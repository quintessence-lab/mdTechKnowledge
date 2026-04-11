---
title: "Claude Code 認証情報ファイル (.credentials.json) の構造変更"
date: 2026-04-11
category: "Claude技術解説"
tags: ["Claude Code", "OAuth認証", "セキュリティ", "Tips"]
excerpt: ".credentials.json がフラット形式から認証方式別ネスト形式に変更。外部スクリプトの修正方法とレート制限データ取得方法を解説。"
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

## まとめ

- `.credentials.json` の構造が認証方式別のネスト形式に変更された
- 外部スクリプトからOAuthトークンを取得する場合は `claudeAiOauth` キー配下を参照する必要がある
- 後方互換性のため、フォールバックとして旧構造（フラット形式）もチェックするのが望ましい
- レート制限表示にはOAuth Usage APIの直接呼び出しが必要（ステータスラインJSONには現在レート制限情報が含まれていない）
