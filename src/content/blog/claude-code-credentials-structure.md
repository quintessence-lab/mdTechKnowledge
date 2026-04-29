---
title: "Claude Code 認証情報ファイル (.credentials.json) の構造変更"
date: 2026-04-11
updatedDate: 2026-04-29
category: "Claude技術解説"
tags: ["Claude Code", "OAuth認証", "セキュリティ", "Tips"]
excerpt: ".credentials.json がフラット形式から認証方式別ネスト形式に変更。外部スクリプトの修正方法、レート制限データ取得方法、およびv2.1.69〜v2.1.121までの認証フロー関連の主要変更を解説。"
draft: false
---

## 概要

Claude Codeの認証情報ファイル `.credentials.json` の構造が、フラット形式から認証方式別のネスト形式に変更された。これにより、OAuthトークンを直接参照していた外部スクリプトが動作しなくなるケースが発生する。

## 変更内容

### 旧構造（フラット形式）

```json
{
  "accessToken": "sk-ant-oat01-...",
  "refreshToken": "sk-ant-ort01-...",
  "expiresAt": 1775906657084,
  "scopes": ["user:inference", "..."],
  "subscriptionType": "max"
}
```

トップレベルに `accessToken` が直接配置されていた。

### 新構造（認証方式別ネスト形式）

```json
{
  "claudeAiOauth": {
    "accessToken": "sk-ant-oat01-...",
    "refreshToken": "sk-ant-ort01-...",
    "expiresAt": 1775906657084,
    "scopes": [
      "user:file_upload",
      "user:inference",
      "user:mcp_servers",
      "user:profile",
      "user:sessions:claude_code"
    ],
    "subscriptionType": "max",
    "rateLimitTier": "default_claude_max_5x"
  }
}
```

トップレベルのキーが認証方式名（`claudeAiOauth`）となり、その配下にトークン情報がネストされる。

## 変更の背景

Claude Codeが複数の認証方式を同時にサポートするようになったため。1つのファイル内に認証方式ごとのブロックを持てる構造に変更された。

現在確認されている認証方式キー：

| キー | 認証方式 |
|------|---------|
| `claudeAiOauth` | claude.ai OAuth認証（Max / Proサブスクリプション） |

APIキー認証（`apiKey`）など他の方式が追加される可能性がある。

## レート制限データの取得方法の比較

Claude Codeのレート制限（5時間/7日）を外部スクリプトで表示する場合、データソースは2つある。

### データソース比較表

| 項目 | Claude Code ステータスラインJSON | OAuth Usage API |
|------|-------------------------------|----------------|
| **取得方法** | `settings.json` の `statusline` コマンドにstdinで渡される | `GET https://api.anthropic.com/api/oauth/usage` |
| **認証** | 不要（Claude Codeが自動で渡す） | OAuthトークン（Bearer認証）が必要 |
| **5h利用量** | `rate_limits.five_hour.used_percentage`（※現在は未提供） | `five_hour.utilization`（0〜100） |
| **7d利用量** | `rate_limits.seven_day.used_percentage`（※現在は未提供） | `seven_day.utilization`（0〜100） |
| **リセット時刻** | 提供なし | `five_hour.resets_at` / `seven_day.resets_at`（ISO 8601） |
| **モデル別内訳** | 提供なし | `seven_day_opus`, `seven_day_sonnet` 等で個別に取得可能 |
| **追加利用枠** | 提供なし | `extra_usage`（`is_enabled`, `monthly_limit`, `used_credits`） |
| **更新頻度** | ステータスライン描画のたび（リアルタイム） | 任意（キャッシュ推奨：10分TTL） |
| **現状** | レート制限フィールドが含まれていない（v2.1.76時点） | 正常に動作 |

### 現状の推奨

2026年4月時点では、Claude Codeがステータスライン用JSONにレート制限情報を含めていないため、**OAuth Usage API を直接呼び出す方式**が唯一の取得方法となっている。

OAuth Usage APIのリクエスト例：

```
GET https://api.anthropic.com/api/oauth/usage
Authorization: Bearer {accessToken}
anthropic-beta: oauth-2025-04-20
```

レスポンス例：

```json
{
  "five_hour": {
    "utilization": 8.0,
    "resets_at": "2026-04-11T08:00:00.663210+00:00"
  },
  "seven_day": {
    "utilization": 7.0,
    "resets_at": "2026-04-12T08:00:01.342140+00:00"
  },
  "seven_day_opus": null,
  "seven_day_sonnet": {
    "utilization": 0.0,
    "resets_at": "2026-04-12T23:00:00.342149+00:00"
  },
  "seven_day_cowork": null,
  "extra_usage": {
    "is_enabled": false,
    "monthly_limit": null,
    "used_credits": null,
    "utilization": null
  }
}
```

## 影響を受けるケースと修正方法

### Python スクリプトの場合

**修正前（動作しない）：**

```python
with open(creds_file) as f:
    creds = json.load(f)
token = creds.get('accessToken', '')  # 空文字列が返る
```

**修正後：**

```python
with open(creds_file) as f:
    creds = json.load(f)
oauth = creds.get('claudeAiOauth', {})
token = oauth.get('accessToken', '') if isinstance(oauth, dict) else creds.get('accessToken', '')
```

### bash スクリプトの場合

`sed` による正規表現抽出は、ファイル全体から最初にマッチする `accessToken` の値を返すため、ネスト構造でも偶然動作する。ただし、将来複数の認証方式ブロックが存在する場合は意図しないトークンを取得する可能性がある。

```bash
# 現状は動作するが、複数認証方式時にはリスクあり
token=$(sed -n 's/.*"accessToken":"\([^"]*\)".*/\1/p' "$creds_file" | head -1)
```

より堅牢なアプローチは `jq` を使う方法：

```bash
token=$(jq -r '.claudeAiOauth.accessToken // .accessToken // empty' "$creds_file")
```

## 新しいフィールド

新構造で追加されたフィールド：

| フィールド | 説明 | 値の例 |
|-----------|------|--------|
| `rateLimitTier` | レート制限の適用ティア | `default_claude_max_5x` |
| `scopes` に `user:file_upload` | ファイルアップロード権限 | - |
| `scopes` に `user:mcp_servers` | MCPサーバー接続権限 | - |
| `scopes` に `user:sessions:claude_code` | Claude Codeセッション権限 | - |

## ファイルの場所

| OS | パス |
|----|------|
| Windows | `%USERPROFILE%\.claude\.credentials.json` |
| macOS / Linux | `~/.claude/.credentials.json` |

## v2.1.69 〜 v2.1.121 の認証フロー関連変更

`.credentials.json` の構造変更以降も、Claude Code は認証フロー周りで多数の修正と機能追加を重ねています。本セクションでは、外部スクリプトや運用に影響しうる主要な変更点を整理します。

### OS CA証明書ストアの信頼デフォルト化（v2.1.101）

エンタープライズ環境のTLSプロキシを追加設定なしで透過的に通せるよう、OS の CA 証明書ストアがデフォルトで信頼されるようになりました。従来のバンドル CA のみを利用したい場合は環境変数で明示的にオプトアウトできます。

```bash
# 従来挙動（バンドルCAのみ）に戻す
export CLAUDE_CODE_CERT_STORE=bundled
```

社内プロキシ越しに `claude` を使用していて、これまで `NODE_EXTRA_CA_CERTS` を手動指定していたケースでは、v2.1.101 以降は不要になる可能性があります。

### `CLAUDE_CODE_OAUTH_TOKEN` 環境変数の挙動修正

| バージョン | 修正内容 |
|------------|---------|
| v2.1.117 | `CLAUDE_CODE_OAUTH_TOKEN` 環境変数で起動したセッションでトークンが期限切れになっても `/login` が機能しない問題を修正 |
| v2.1.118 | `CLAUDE_CODE_OAUTH_TOKEN` で起動したセッションで `/login` が無効化される問題を修正。環境変数のトークンをクリアし、ディスク上の credentials を有効化するよう変更 |

CI/CDやコンテナ環境で `CLAUDE_CODE_OAUTH_TOKEN` を注入している場合、v2.1.117 より前は期限切れ後の再ログインができず手動介入が必要でした。v2.1.117 以降は 401 を契機にトークンが反応的にリフレッシュされ、v2.1.118 ではディスクの credentials へのフォールバックも正しく動作します。

### Linux/Windows での credential 保存修正（v2.1.118）

```
Fixed credential save crash on Linux/Windows corrupting ~/.claude/.credentials.json
```

Linux および Windows で、credential 保存処理がクラッシュして `~/.claude/.credentials.json` を破損させる問題が修正されました。これに該当した場合の症状は、ログイン直後にも関わらず `/login` プロンプトが繰り返し表示される、トークンが空文字になるなどです。v2.1.118 未満で破損ファイルが残っている場合は、一度ファイルを削除して `claude /login` でやり直すのが確実です。

### macOS keychain 競合対応

| バージョン | 修正内容 |
|------------|---------|
| v2.1.69 | 複数のOAuth MCP サーバを使用した際の macOS keychain 破損を修正。大きな OAuth メタデータが `security -i` の stdin バッファをオーバーフローさせ、stale な credentials が残って `/login` プロンプトが繰り返される問題を解消 |
| v2.1.81 | 複数のClaude Code セッションを並行実行している際、片方が OAuth トークンをリフレッシュすると他のセッションが再認証を要求される問題を修正 |
| v2.1.84 | macOS で keychain の一時的な読み取り失敗により発生していた誤った "Not logged in" エラーを修正 |
| v2.1.86 | 多数の claude.ai MCP コネクタを設定している環境での起動時イベントループ停止を低減（macOS keychain キャッシュを 5秒 → 30秒 に延長） |
| v2.1.94 | macOS Console ログイン時、login keychain がロックされているかパスワード同期が崩れている場合に "Not logged in" で無言失敗していた問題を修正。エラーが画面に出るようになり、`claude doctor` で診断可能に |
| v2.1.118 | MCP トークンリフレッシュ中の競合により、フレッシュにリフレッシュされた OAuth トークンが上書きされ、`/login` プロンプトが予期せず表示される macOS keychain race を修正 |

特に v2.1.118 は、複数のMCP サーバが同時にトークンリフレッシュを行う環境で頻発していた問題への対処であり、`/login` ループが発生していたユーザは v2.1.118 以降への更新が推奨されます。

### v2.1.108以降の OAuth 関連修正

| バージョン | 修正内容 |
|------------|---------|
| v2.1.108 | `/login` のコード入力プロンプトでペーストが効かない問題を修正（v2.1.105 でのリグレッション） |
| v2.1.117 | Plain-CLI OAuth セッションで access token がセッション中に期限切れになると "Please run /login" で死亡する問題を修正。401 を契機にトークンが反応的にリフレッシュされるように |
| v2.1.118 | MCP サーバの OAuth トークンレスポンスが `expires_in` を省略した場合に毎時間再認証が必要になる問題を修正 |
| v2.1.118 | MCP step-up authorization が `insufficient_scope` 403 で既に保有しているスコープを再要求された場合に、サイレントリフレッシュではなく再同意プロンプトを出すよう修正 |
| v2.1.118 | OAuth トークンリフレッシュがクロスプロセスロックなしで進行していた問題を修正 |
| v2.1.118 | サーバがローカル expiry 前にトークンを失効させた場合の OAuth トークンリフレッシュ失敗を修正 |
| v2.1.121 | Vertex AI で X.509 証明書ベースの Workload Identity Federation（mTLS ADC）をサポート |

### 補足: 環境変数経由のクレデンシャル保護（v2.1.83）

```bash
# サブプロセスからAnthropicおよびクラウドプロバイダのクレデンシャルを除去
export CLAUDE_CODE_SUBPROCESS_ENV_SCRUB=1
```

v2.1.83 で追加された設定で、Bash ツール、hooks、MCP stdio サーバなどのサブプロセス環境から `ANTHROPIC_API_KEY` や AWS/GCP 系の認証情報を取り除けます。サブプロセスがクレデンシャルを意図せず参照することを避けたい運用では有効化を検討してください。

## まとめ

- `.credentials.json` の構造が認証方式別のネスト形式に変更された
- 外部スクリプトからOAuthトークンを取得する場合は `claudeAiOauth` キー配下を参照する必要がある
- 後方互換性のため、フォールバックとして旧構造（フラット形式）もチェックするのが望ましい
- レート制限表示にはOAuth Usage APIの直接呼び出しが必要（ステータスラインJSONには現在レート制限情報が含まれていない）
- v2.1.69〜v2.1.121 の認証関連修正のうち、特に v2.1.101（OS CA信頼デフォルト化）、v2.1.117/v2.1.118（`CLAUDE_CODE_OAUTH_TOKEN` 関連、Linux/Windows credential 保存修正、macOS keychain 競合対応）は外部運用への影響が大きい
