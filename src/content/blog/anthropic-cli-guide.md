---
title: "ant CLI 完全ガイド — Anthropic公式Claude API向けコマンドラインクライアント"
date: 2026-04-26
category: "Claude技術解説"
tags: ["Anthropic", "Claude API", "CLI", "ant", "開発ツール"]
excerpt: "Anthropic公式のClaude API向けCLI「ant」を解説。go installでセットアップし、フラグ/YAML/@path参照でリクエスト構築、--transformでレスポンス抽出。Claude Codeとの連携・APIリソースのYAMLバージョン管理を整理。"
draft: false
---

## ant CLI とは

`ant` は Anthropic が公式に提供する **Claude Developer Platform 向けのコマンドラインクライアント** です。Go 言語で実装されており、Claude API のすべてのリソース（messages、files、batches、agents、sessions、environments など）をシェルのサブコマンドとして直接操作できます。

これまで Claude API を呼び出すには Python / TypeScript SDK を使うか、`curl` で手書き JSON を投げる必要がありました。`ant` はその中間に位置する **「型付きフラグと YAML パイプでリクエストを組み立てる純粋な CLI」** であり、シェルスクリプト・CI/CD・アドホックなデバッグに最適化されています。

Claude Code が「コーディング作業を支援するエージェント型 CLI」であるのに対し、`ant` は **「Claude API そのものを薄くラップした管理ツール」** という位置付けです。両者は補完関係にあり、目的に応じて使い分けます。

リポジトリは [github.com/anthropics/anthropic-cli](https://github.com/anthropics/anthropic-cli) で MIT ライセンスにて公開されています（2026 年 4 月時点で v1.3.2）。

## インストール

### Go によるインストール（推奨）

Go 1.22 以上が必要です。

```bash
go install 'github.com/anthropics/anthropic-cli/cmd/ant@latest'
```

`$HOME/go/bin`（または `$GOPATH/bin`）にバイナリが配置されるので、PATH を通しておきます。

```bash
export PATH="$PATH:$(go env GOPATH)/bin"
```

### Homebrew（macOS / Linux）

```bash
brew install anthropics/tap/ant
```

### バイナリ配布

Linux / WSL 向けには [Releases ページ](https://github.com/anthropics/anthropic-cli/releases) からアーカイブをダウンロードして展開する方法もあります。

インストール確認：

```bash
ant --version
ant --help
```

## 認証設定

環境変数で API キーを設定するのが基本です。

```bash
export ANTHROPIC_API_KEY="sk-ant-..."
```

代替として `ANTHROPIC_AUTH_TOKEN` も利用可能です。スクリプト中で一時的に切り替えたい場合はフラグで直接渡せます。

```bash
ant messages create --api-key "$MY_KEY" ...
```

複数アカウントを扱うなら、`direnv` などでディレクトリごとに環境変数を切り替える運用が安全です。

## 基本コマンド構造

```bash
ant <resource>[:<subresource>] <action> [flags...]
```

最小例として、Messages API を呼び出してみます。

```bash
ant messages create \
  --model claude-sonnet-4-5-20250929 \
  --max-tokens 1024 \
  --message '{role: user, content: [{type: text, text: "こんにちは"}]}'
```

ベータ機能（agents、sessions、environments など）は `beta:` プレフィックスで指定し、`anthropic-beta` ヘッダーが自動付与されます。

```bash
ant beta:agents create --name my-agent ...
```

## 主要機能

### 1. 型付きフラグ

スカラー値や構造化フィールドは個別フラグとして公開されており、シェル補完と型チェックの恩恵を受けられます。

```bash
ant messages create \
  --model claude-opus-4-7 \
  --max-tokens 2048 \
  --temperature 0.7 \
  --system "You are a helpful assistant."
```

### 2. YAML パイプによるリクエスト構築

長いリクエストボディは標準入力から YAML / JSON で流し込むのが便利です。手書き JSON のクォートエスケープ地獄から解放されます。

```bash
ant messages create <<YAML
model: claude-sonnet-4-5-20250929
max_tokens: 1024
system: あなたは熟練の技術ライターです。
messages:
  - role: user
    content:
      - type: text
        text: |
          Astro のコンテンツコレクションについて
          初心者向けに 3 行で説明してください。
YAML
```

注意点として、配列フィールドに対してフラグを併用すると **stdin の配列を上書き** します（追記ではない）。

### 3. `@path` 参照によるファイル内容のインライン展開

`@` プレフィックスで任意のファイルを参照でき、テキスト／バイナリは自動判定されます。

```bash
# 画像を直接添付
ant messages create --message '{role: user, content: [{type: image, source: {type: base64, data: "@diagram.png"}}]}'

# YAML 内でも同様
ant messages create <<YAML
messages:
  - role: user
    content:
      - type: text
        text: "@prompt.txt"
      - type: image
        source: { type: base64, data: "@chart.jpg" }
YAML
```

エンコーディングを明示したい場合は次のスキームが使えます。

| 記法 | 意味 |
| --- | --- |
| `@file://path` | 強制的にプレーンテキスト |
| `@data://path` | 強制的に base64 |
| `@file:///abs/path` | 絶対パス |

文字列リテラルとして `@` を渡したい場合はバックスラッシュでエスケープします（例：`'\@username'`）。

### 4. `--transform` によるレスポンス抽出（GJSON）

`jq` 風に [GJSON 構文](https://github.com/tidwall/gjson/blob/master/SYNTAX.md) でレスポンスから必要部分だけを取り出せます。

```bash
# 応答テキストだけを抽出
ant messages create --transform 'content.0.text' <<YAML
model: claude-sonnet-4-5-20250929
max_tokens: 256
messages:
  - {role: user, content: [{type: text, text: "ping"}]}
YAML
```

リスト系エンドポイントでは **エンベロープではなく各要素に対して** transform が適用されるため、ID 一覧を抜き出す用途で重宝します。

```bash
ant files list --transform 'id'
```

スカラーをシェル変数に代入するなら `--format raw` と組み合わせます。

```bash
MSG_ID=$(ant messages create --transform 'id' --format raw <<YAML
...
YAML
)
```

## 出力フォーマットとデバッグ

| フラグ | 用途 |
| --- | --- |
| `--format` | `auto` / `json` / `jsonl` / `pretty` / `raw` / `yaml` / `explore` |
| `--format-error` | エラー出力フォーマット |
| `--debug` | HTTP リクエスト・レスポンスを詳細ログ |
| `--base-url` | カスタムバックエンド（プロキシ・テスト用） |

`--format explore` はインタラクティブにレスポンス構造をたどれるモードで、新しいエンドポイントの調査に役立ちます。

## API リソースの YAML バージョン管理

`ant` の真価は **コントロールプレーン操作（agents / environments など）の宣言的管理** にあります。リソース定義を YAML としてリポジトリに格納し、Git で履歴管理する運用が推奨されています。

```yaml
# agents/code-reviewer.yaml
name: code-reviewer
model: claude-opus-4-7
instructions: |
  あなたはシニアエンジニアとして PR をレビューします。
  セキュリティ、可読性、テスト網羅性の3観点で指摘してください。
tools:
  - type: bash
  - type: str_replace_editor
```

初回作成で ID を取得し、以降は `update` に `version` を指定して **楽観的ロック** を効かせます。

```bash
# 作成
AGENT_ID=$(ant beta:agents create --transform id --format raw < agents/code-reviewer.yaml)

# 更新（version 不一致なら 409 で失敗）
ant beta:agents update --agent-id "$AGENT_ID" --version 3 < agents/code-reviewer.yaml
```

## Claude Code との連携・使い分け

| 観点 | Claude Code | ant CLI |
| --- | --- | --- |
| 主用途 | コーディング支援エージェント | Claude API の直接操作 |
| 対話性 | 対話的・自律実行 | 1 リクエスト 1 レスポンス |
| 入力 | 自然言語プロンプト | フラグ / YAML / `@path` |
| 出力 | 編集差分・実行結果 | JSON / YAML / 抽出値 |
| 使いどころ | 実装作業全般 | バッチ・CI・運用 |

両者を組み合わせる典型例として、Claude Code 上から `ant` を Bash ツール経由で呼び出し、本番 API キーを使う処理だけ厳格に CLI 化する、というハイブリッド運用が有効です。

## 実用例

### バッチ処理：複数ファイルを要約

```bash
for f in docs/*.md; do
  summary=$(ant messages create \
    --transform 'content.0.text' --format raw <<YAML
model: claude-haiku-4-5
max_tokens: 200
messages:
  - role: user
    content:
      - {type: text, text: "次のドキュメントを 3 行で要約してください。"}
      - {type: text, text: "@${f}"}
YAML
)
  echo "## $f" >> SUMMARY.md
  echo "$summary" >> SUMMARY.md
done
```

### CI/CD 統合：PR ごとに変更概要を生成

```yaml
# .github/workflows/pr-summary.yml
- name: Install ant
  run: go install github.com/anthropics/anthropic-cli/cmd/ant@latest

- name: Generate summary
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
  run: |
    git diff origin/main...HEAD > /tmp/diff.patch
    ant messages create --transform 'content.0.text' --format raw <<YAML > pr-summary.md
    model: claude-sonnet-4-5-20250929
    max_tokens: 1024
    messages:
      - role: user
        content:
          - {type: text, text: "以下の diff の概要を日本語で書いてください。"}
          - {type: text, text: "@/tmp/diff.patch"}
    YAML
```

### スクリプト連携：Slack 通知への組み込み

```bash
ant messages create --transform 'content.0.text' --format raw <<YAML \
  | curl -X POST -H 'Content-Type: application/json' \
      -d "$(jq -Rn --arg t "$(cat -)" '{text: $t}')" "$SLACK_WEBHOOK"
model: claude-haiku-4-5
max_tokens: 300
messages:
  - {role: user, content: [{type: text, text: "今日のリリースノートをまとめて"}]}
YAML
```

## 既存 SDK との比較

| | Python / TypeScript SDK | ant CLI |
| --- | --- | --- |
| 言語 | アプリ本体に組み込み | シェル / 任意言語から呼び出し |
| 型安全性 | 強（IDE 補完） | フラグレベル |
| ストリーミング | ネイティブ対応 | `--format jsonl` で受信可 |
| 並列処理 | async / Promise | `xargs -P` などシェル並列 |
| 学習コスト | 言語の流儀に従う | シェル習熟者なら即戦力 |
| 配布 | パッケージマネージャ | 単一バイナリ |

長期的・複雑なアプリケーションは SDK、運用・調査・スクリプト・CI は `ant`、と棲み分けるのが定石です。**プロトタイプを `ant` で書き、必要に応じて SDK に書き起こす** 流れも生産性が高いでしょう。

## まとめ

- `ant` は Claude API のすべてのリソースをシェルから扱える Anthropic 公式 CLI
- 型付きフラグ・YAML パイプ・`@path` 参照でリクエストを安全に組み立てられる
- `--transform`（GJSON）で必要な値だけを抜き出し、シェルパイプラインに自然に統合
- agents / environments などは YAML 化して Git 管理し、`version` で楽観的ロック
- Claude Code が「対話的開発支援」、`ant` が「API 操作の自動化」と役割が明確

シェル文化に馴染んだ開発者にとって `ant` は **Claude API を最も素直に扱えるツール** です。SDK と CLI の両輪を押さえておくことで、API 活用の幅が一段広がります。

---

**参考リンク**

- [anthropics/anthropic-cli (GitHub)](https://github.com/anthropics/anthropic-cli)
- [Claude Developer Platform CLI ドキュメント](https://platform.claude.com/docs/en/api/sdks/cli)
- [GJSON Syntax](https://github.com/tidwall/gjson/blob/master/SYNTAX.md)
