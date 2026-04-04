---
title: "MCP (Model Context Protocol) アーキテクチャ詳細"
date: 2026-04-04
category: "Claude技術解説"
tags: ["MCP", "Claude Code", "JSON-RPC", "GitHub", "OAuth", "プロトコル"]
excerpt: "MCPの概要・全体アーキテクチャ・接続ライフサイクル・トランスポート方式・プロトコル詳細・OAuth認証・GitHub MCP実践例・プロセスモデルを網羅的に解説"
draft: false
---

## MCPとは？

MCP（Model Context Protocol）は、**AIアシスタントと外部ツール・データソースを接続するためのオープンプロトコル**。Anthropicが策定し、オープンソースとして公開されている。

### 何を解決するのか

従来、AIアシスタントが外部サービス（GitHub, Gmail, DB等）にアクセスするには、サービスごとに個別の統合コードが必要だった。MCPはこの問題を**標準化**で解決する。

```
従来: AIクライアントごとに個別実装が必要
════════════════════════════════════════════���══

  Claude Code ──[独自実装]──► GitHub API
  Claude Code ──[独自実装]──► Gmail API
  Claude Code ──[独自実装]──► Database
  Cursor      ──[独自実装]──► GitHub API   ← 同じAPIに対して別実装
  Cursor      ──[独自実装]──► Gmail API
  ...

MCP導入後: 共通プロトコルで統一
═══════════════════════════════════════════════

  Claude Code ─┐                ┌─► GitHub MCP Server ──► GitHub API
  Cursor      ─┤── MCP Protocol ├─► Gmail MCP Server  ──► Gmail API
  VS Code     ─┤   (JSON-RPC)   ├─► DB MCP Server     ──► Database
  任意Client   ─┘                └─► 任意のMCP Server
```

### 核心コンセプト

| 概念 | 説明 |
|---|---|
| **Client** | AIアシスタント側（Claude Code等）。MCPサーバーに接続してツールを利用 |
| **Server** | 外部サービスへの橋渡し。ツール・リソース・プロンプトを提供 |
| **Protocol** | JSON-RPC 2.0ベース。初期化→機能交渉→オペレーション→終了 |
| **Tools** | サーバーが提供する実行可能な機能（例: `create_issue`, `send_email`） |
| **Resources** | サーバーが提供する読み取り可能なデータ（例: ファイル内容, DB行） |

### USBに例えると

MCPは「AIのUSB規格」と考えるとわかりやすい:

```
USB規格                         MCP
════════                        ════════
USBポート（PC側）          =    MCPクライアント（Claude Code）
USBケーブル・プロトコル    =    MCPプロトコル（JSON-RPC 2.0）
USBデバイス（マウス等）    =    MCPサーバー（GitHub, Gmail等）
デバイスドライバ           =    ツール定義（inputSchema）

→ 規格に準拠していれば、どのPC + どのデバイスでも接続可能
→ MCPに準拠していれば、どのAIクライアント + どのサーバーでも接続可能
```

---

## アップデートについて

| サーバー種別 | 更新方法 |
|---|---|
| **リモート（claude.ai Gmail等）** | **自動管理** — Anthropic側でホストされており、ユーザー操作不要 |
| **ローカル（stdio）** | **手動更新** — `npx some-server@1.2.3` のバージョン指定で管理 |

---

## 全体アーキテクチャ図

```
┌─────────────────────────────────────────────────────┐
│                   Claude Code (Client)              │
│                                                     │
│  ┌───────────────┐    ┌──────────────────────────┐  │
│  │  LLM (Claude) │◄──►│  MCP Client Manager      │  │
│  │               │    │                          │  │
│  │  tools/call   │    │  ・サーバー発見・初期化   │  │
│  │  の判断       │    │  ・ヘルスチェック         │  │
│  └───────────────┘    │  ・トークン管理           │  │
│                       └──────┬───────────┬───────┘  │
└──────────────────────────────┼───────────┼──────────┘
                               │           │
              ┌────────────────┘           └──────────────┐
              ▼ stdio                        ▼ HTTP/SSE   │
   ┌─────────────────────┐        ┌───────────────────────┤
   │  ローカルサーバー    │        │  リモートサーバー      │
   │  (サブプロセス)      │        │  (Anthropicホスト等)   │
   │                     │        │                       │
   │  stdin ──► 処理     │        │  POST /mcp ──► 処理   │
   │  stdout ◄── 応答    │        │  SSE ◄────── 応答     │
   │  stderr ──► ログ    │        │                       │
   │                     │        │  OAuth認証必須         │
   │  例: DB, ファイル系  │        │  例: Gmail, Calendar   │
   └─────────────────────┘        └───────────────────────┘
```

---

## 接続ライフサイクル

```
Phase 1: 初期化
══════════════════════════════════════════════════

Client                              Server
  │                                    │
  │──── Initialize Request ──────────►│
  │     (プロトコルver, 機能一覧)       │
  │                                    │
  │◄─── Initialize Response ──────────│
  │     (合意ver, サーバー機能)         │
  │                                    │
  │──── Initialized 通知 ────────────►│
  │                                    │

Phase 2: オペレーション
══════════════════════════════════════════════════

  │──── tools/list ──────────────────►│
  │◄─── [ツール一覧] ─────────────────│
  │                                    │
  │──── tools/call ──────────────────►│
  │     {name: "send_email",           │
  │      arguments: {to: "..."}}       │
  │◄─── [実行結果] ──────────────────│
  │                                    │

Phase 3: シャットダウン
══════════════════════════════════════════════════

  │──── stdin閉じ / HTTP切断 ────────►│
  │     (SIGTERM → SIGKILL)            │
```

---

## トランスポート方式

### Stdio トランスポート（ローカル）

- **プロセスモデル**: クライアントがMCPサーバーをサブプロセスとして起動
- **通信方式**:
  - サーバーが標準入力（stdin）からJSON-RPCメッセージを読み取り
  - 標準出力（stdout）にメッセージを返送
  - メッセージは改行で区切られ、埋め込み改行は許可されない
- **ロギング**: サーバーはstderrにログを出力可能

```
Client → [Subprocess Launch] → Server Process
  ↓                                ↓
[stdin] ←―――――――――――――→ [stdout]
  ↓                                ↓
[Monitor] ←―――――――――――――→ [stderr (logs)]
```

### Streamable HTTP トランスポート（リモート）

- **クライアント → サーバー**: HTTP POSTでJSON-RPCメッセージを送信
- **サーバー → クライアント**: JSON応答 または SSE（Server-Sent Events）ストリーム
- **セッション管理**: `Mcp-Session-Id`ヘッダで管理

```
POST /mcp [InitializeRequest]
    ↓
Response with Mcp-Session-Id header
    ↓
All subsequent requests: include Mcp-Session-Id header
    ↓
Session timeout → HTTP 404 → Re-initialize
```

### 比較表

| 特性 | ローカル Stdio | リモート HTTP/SSE |
|---|---|---|
| **プロセス管理** | クライアントが起動・管理 | 常時稼働（独立プロセス） |
| **複数接続** | 1クライアント、1プロセス | 複数クライアント接続可能 |
| **ネットワーク** | ローカルIPC | HTTP(S) over Network |
| **認証** | なし（ローカル） | OAuth、APIキー等 |
| **遅延** | ローカル、低遅延 | ネットワーク遅延あり |

---

## プロトコル詳細 (JSON-RPC 2.0)

MCPはJSON-RPC 2.0を基盤に使用。3種類のメッセージ:

```json
// 1. リクエスト（応答必須、idあり）
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": { "name": "get_weather", "arguments": { "location": "Tokyo" } }
}

// 2. レスポンス
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": { "content": [{ "type": "text", "text": "20°C, 晴れ" }] }
}

// 3. 通知（応答不要、idなし）
{
  "jsonrpc": "2.0",
  "method": "notifications/initialized"
}
```

### 初期化ハンドシェイク

```json
// Client → Server: Initialize Request
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2025-03-26",
    "capabilities": {
      "roots": { "listChanged": true },
      "sampling": {}
    },
    "clientInfo": {
      "name": "claude-code",
      "version": "1.0.0"
    }
  }
}

// Server → Client: Initialize Response
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "protocolVersion": "2025-03-26",
    "capabilities": {
      "tools": { "listChanged": true },
      "resources": { "subscribe": true, "listChanged": true }
    },
    "serverInfo": {
      "name": "example-server",
      "version": "1.0.0"
    }
  }
}
```

**バージョンネゴシエーション**:
- クライアントが最新バージョンを提示
- サーバーがサポートするバージョンで応答
- 合意できなければ切断

---

## OAuth認証フロー（リモートサーバー）

```
┌──────────┐    ┌──────────────┐    ┌──────────────┐
│Claude Code│    │  MCPサーバー  │    │ OAuthプロバイダ│
│          │    │(gmail.mcp...)│    │(Google等)     │
└────┬─────┘    └──────┬───────┘    └──────┬───────┘
     │                  │                   │
     │─── POST /mcp ──►│                   │
     │◄── 401 + WWW-Authenticate ──────────│
     │                  │                   │
     │─── GET /.well-known/oauth ─────────►│
     │◄── authorization_endpoint等 ────────│
     │                  │                   │
     │══ ブラウザ起動 ══════════════════════►│
     │   ユーザーが認可                      │
     │◄═══ authorization_code ══════════════│
     │                  │                   │
     │─── code → token交換 ───────────────►│
     │◄── access_token ───────────────────│
     │                  │                   │
     │─── POST /mcp (Bearer token) ──►│   │
     │◄── 正常レスポンス ─────────────│   │
```

### 認証ディスカバリ

1. **Well-Knownエンドポイント**: `GET /.well-known/oauth-protected-resource`
2. **WWW-Authenticateヘッダ**: 401応答に含まれるリソースメタデータURL

---

## 設定の優先順位

```
Local   .claude/.mcp.local.json    ← 最優先（個人用）
Project .claude/mcp.json           ← チーム共有
User    ~/.claude/mcp.json         ← 全プロジェクト共通
Built-in claude.ai Gmail等         ← デフォルト組み込み
```

### 設定例

```json
// ローカルサーバー（stdio）
{
  "mcpServers": {
    "my-database": {
      "transport": "stdio",
      "command": "npx",
      "args": ["my-mcp-server@1.0.0"],
      "env": {
        "DATABASE_URL": "postgresql://..."
      }
    }
  }
}

// リモートサーバー（HTTP）
{
  "mcpServers": {
    "sentry": {
      "transport": "http",
      "url": "https://sentry-mcp.example.com",
      "auth": "oauth"
    }
  }
}
```

### CLIコマンド

```bash
claude mcp list              # サーバー一覧
claude mcp add               # サーバー追加
claude mcp get <名前>        # 詳細確認
claude mcp remove <名前>     # 削除
```

### Windows特有の注意

ネイティブWindows（WSL非使用）ではnpx実行に`cmd /c`が必要:

```json
{
  "command": "cmd",
  "args": ["/c", "npx", "some-mcp-server"]
}
```

---

## 実践例: GitHub MCPサーバー

### セットアップ

GitHub公式MCPサーバーの追加方法:

```bash
# リモートHTTP版（推奨 — GitHub側でホスト、メンテナンス不要）
claude mcp add --transport http github \
  https://api.githubcopilot.com/mcp/ \
  --header "Authorization: Bearer YOUR_GITHUB_PAT"

# ローカルstdio版（Docker）
claude mcp add --transport stdio github \
  --env GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_PAT \
  -- docker run -i --rm -e GITHUB_PERSONAL_ACCESS_TOKEN ghcr.io/github/github-mcp-server

# ローカルstdio版（npx）
claude mcp add --transport stdio github \
  --env GITHUB_PERSONAL_ACCESS_TOKEN=YOUR_PAT \
  -- npx @github/github-mcp-server
```

### 提供されるツール

| カテゴリ | 主要ツール | 機能 |
|---|---|---|
| **リポジトリ** | `search_repositories` | リポジトリ検索 |
| | `get_file_contents` | ファイル内容取得 |
| | `search_code` | コード検索 |
| **Issue** | `list_issues` | Issue一覧取得 |
| | `create_issue` | Issue作成 |
| | `update_issue` | Issue更新 |
| **Pull Request** | `get_pull_request` | PR詳細取得 |
| | `create_pull_request` | PR作成 |
| | `create_pending_pull_request_review` | PRレビュー作成 |
| **Actions** | ワークフロー実行・監視 | CI/CD管理 |
| **Security** | Dependabotアラート確認 | 脆弱性管理 |

### 具体的なワークフロー例

**ユーザーの指示**: 「pandas リポジトリの最新Issueを確認して」

```
ユーザー                Claude Code (LLM)           GitHub MCP Server
  │                         │                              │
  │── "pandasの最新Issue" ─►│                              │
  │                         │                              │
  │                    LLMがツール選択を判断                 │
  │                         │                              │
  │                         │── tools/call ───────────────►│
  │                         │   name: "list_issues"        │
  │                         │   arguments:                 │
  │                         │     owner: "pandas-dev"      │
  │                         │     repo: "pandas"           │
  │                         │     state: "open"            │
  │                         │     sort: "updated"          │
  │                         │                              │
  │                         │              GitHub API呼出  │
  │                         │              GET /repos/...  │
  │                         │                              │
  │                         │◄── result ──────────────────│
  │                         │   content: [Issue一覧...]    │
  │                         │                              │
  │                    LLMが結果を自然言語に整形             │
  │                         │                              │
  │◄── "最新のIssueは..." ─│                              │
```

### JSON-RPCメッセージの実際の流れ

**1. ツール検出（セッション開始時に1回）**

```json
// Client → Server
{ "jsonrpc": "2.0", "id": 2, "method": "tools/list" }

// Server → Client（抜粋）
{
  "jsonrpc": "2.0", "id": 2,
  "result": {
    "tools": [
      {
        "name": "list_issues",
        "description": "List issues in a repository",
        "inputSchema": {
          "type": "object",
          "properties": {
            "owner": { "type": "string" },
            "repo":  { "type": "string" },
            "state": { "type": "string", "enum": ["open", "closed", "all"] }
          },
          "required": ["owner", "repo"]
        }
      },
      {
        "name": "create_issue",
        "description": "Create a new issue",
        "inputSchema": { "..." : "..." }
      }
    ]
  }
}
```

**2. ツール呼び出し（ユーザーリクエストごと）**

```json
// Client → Server
{
  "jsonrpc": "2.0", "id": 3,
  "method": "tools/call",
  "params": {
    "name": "list_issues",
    "arguments": {
      "owner": "pandas-dev",
      "repo": "pandas",
      "state": "open",
      "sort": "updated"
    }
  }
}

// Server → Client
{
  "jsonrpc": "2.0", "id": 3,
  "result": {
    "content": [{
      "type": "text",
      "text": "1. #58901 - Fix deprecation warning in Series.fillna()\n2. #58900 - TypeError in DataFrame.groupby()"
    }],
    "isError": false
  }
}
```

---

## プロセス稼働の全体像

### どこで何が動いているか

```
┌─ ユーザーのPC ─────────────────────────────────────────────────┐
│                                                                │
│  ┌─ プロセス1: Claude Code (Node.js) ───────────────────────┐  │
│  │                                                          │  │
│  │  [MCPクライアント]                                        │  │
│  │    ├── サーバー設定読込（.mcp.json等）                     │  │
│  │    ├── ローカルサーバーのプロセス起動・管理                 │  │
│  │    ├── リモートサーバーへのHTTP接続管理                     │  │
│  │    └── ツール一覧のキャッシュ・LLMへの提供                 │  │
│  │                                                          │  │
│  │  [LLM通信]                                                │  │
│  │    ├── Anthropic API ◄──► Claude モデル（クラウド）        │  │
│  │    └── ツール呼び出し判断はLLM側で実施                     │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          │                                     │
│            ┌─────────────┼──────────────┐                      │
│            ▼ stdio       │              │                      │
│  ┌─ プロセス2 ────────┐  │              │                      │
│  │ GitHub MCP Server  │  │              │                      │
│  │ (ローカルstdio版)  │  │              │                      │
│  │                    │  │              │                      │
│  │ ・Node.js/Docker   │  │              │                      │
│  │ ・stdin/stdout通信  │  │              │                      │
│  │ ・GitHub API呼出   │  │              │                      │
│  └────────────────────┘  │              │                      │
│                          │              │                      │
│  ┌─ プロセス3 ────────┐  │              │                      │
│  │ DB MCP Server      │  │              │                      │
│  │ (ローカルstdio版)  │  │              │                      │
│  └────────────────────┘  │              │                      │
│                          │              │                      │
└──────────────────────────┼──────────────┼──────────────────────┘
                           │              │
              ─ ─ ─ネットワーク境界─ ─ ─ ─ ─
                           │              │
                           ▼ HTTPS        ▼ HTTPS
            ┌──────────────────┐  ┌──────────────────────────┐
            │  Anthropic Cloud │  │  GitHub/Googleクラウド    │
            │                  │  │                          │
            │  Claude LLM      │  │  ┌─ リモートMCPサーバー ┐ │
            │  (推論エンジン)   │  │  │                     │ │
            │                  │  │  │ github.mcp.com       │ │
            │  ・ツール選択判断 │  │  │ gmail.mcp.claude.com │ │
            │  ・応答生成      │  │  │ gcal.mcp.claude.com  │ │
            │                  │  │  │                     │ │
            └──────────────────┘  │  │ → GitHub API呼出    │ │
                                  │  │ → Gmail API呼出     │ │
                                  │  └─────────────────────┘ │
                                  └──────────────────────────┘
```

### stdio版 vs リモート版: プロセスの違い

```
【stdio版 GitHub MCP Server】
══════════════════════════════════════════════════════════

ユーザーPC内で完結:

  Claude Code ──stdin/stdout──► github-mcp-server ──HTTPS──► api.github.com
  (プロセス1)                   (プロセス2: 子プロセス)        (外部API)

  ・プロセス2はClaude Codeが起動・終了を管理
  ・PATはローカル環境変数で保持
  ・サーバープロセスのメモリ・CPUはローカルで消費


【リモート版 GitHub MCP Server】
══════════════════════════════════════════════════════════

ユーザーPCにはClaude Codeのみ:

  Claude Code ──HTTPS──► api.githubcopilot.com/mcp/ ──内部──► api.github.com
  (プロセス1)             (GitHubクラウド上のサーバー)          (GitHub API)

  ・サーバープロセスはGitHubクラウド上で稼働
  ・認証はPATをHTTPヘッダで送信
  ・ローカルリソース消費なし
  ・サーバー更新はGitHub側が自動実施
```

### リクエスト処理の全プロセスフロー

```
① ユーザー入力
   "pandas のIssue #58901 にコメントして"
        │
        ▼
② Claude Code → Anthropic API（HTTPS）
   LLMにユーザー入力 + 利用可能ツール一覧を送信
        │
        ▼
③ Anthropic Cloud: Claude LLM 推論
   「add_issue_comment ツールを使うべき」と判断
   → tool_use レスポンスを返却
        │
        ▼
④ Claude Code（ローカル）
   LLMの判断に基づき、MCPサーバーにツール呼び出し
   → JSON-RPC: tools/call { name: "add_issue_comment", ... }
        │
        ├──[stdio版]──► ローカルプロセスのstdinに書込
        │                   └──► GitHub API (HTTPS)
        │
        └──[リモート版]──► api.githubcopilot.com (HTTPS)
                             └──► GitHub API (内部)
        │
        ▼
⑤ MCPサーバーからレスポンス受信
   → JSON-RPC result
        │
        ▼
⑥ Claude Code → Anthropic API（HTTPS）
   ツール実行結果をLLMに送信
        │
        ▼
⑦ Anthropic Cloud: Claude LLM 推論
   結果を自然言語に整形
        │
        ▼
⑧ ユーザーに応答表示
   "Issue #58901 にコメントしました: ..."
```

---

## MCPサーバーのプロセスモデル詳細

### 常駐か非常駐か？

MCPサーバーは**仮想マシンやコンテナのように常駐するサービスではない**。種別ごとのプロセスモデルは以下の通り:

| 種別 | 常駐/非常駐 | ライフサイクル | OS上の実体 |
|---|---|---|---|
| **ローカル stdio** | **非常駐** | Claude Codeセッション中のみ | 通常のOSプロセス（node.exe等） |
| **ローカル HTTP** | **半常駐** | 手動起動・手動停止 | 通常のOSプロセス（HTTPサーバー） |
| **リモート HTTP** | **常駐（クラウド側）** | サービス提供者が管理 | ユーザーPC上にプロセスなし |
| **ビルトイン（Gmail等）** | **常駐（クラウド側）** | Anthropicが管理 | ユーザーPC上にプロセスなし |

### ローカル stdio サーバーの詳細

**最も重要なポイント: Claude Codeを閉じればMCPサーバーも終了する。**

```
Claude Code 起動
    │
    ├── 設定ファイル読込（.mcp.json）
    │
    ├── 各stdioサーバーを子プロセスとして起動
    │     ├── node.exe github-mcp-server    ← OSの通常プロセス
    │     ├── python db-mcp-server.py       ← OSの通常プロセス
    │     └── docker run some-mcp-server    ← Dockerコンテナ内プロセス
    │
    ├── 各プロセスとstdin/stdoutで通信
    │
    ├── セッション中ずっと生存（待機状態）
    │
    └── Claude Code 終了時
          ├── 各子プロセスのstdinを閉じる
          ├── SIGTERM送信
          └── 応答なければSIGKILL（強制終了）
```

**タスクマネージャーでの見え方（Windows）:**

```
タスクマネージャー
├── claude.exe                          ← Claude Code本体
│   ├── node.exe (github-mcp-server)    ← MCP子プロセス1
│   ├── python.exe (db-mcp-server)      ← MCP子プロセス2
│   └── ...
```

- **仮想マシンではない**: VMWareやHyper-Vのような仮想化層は一切ない
- **Dockerの場合のみコンテナ**: `docker run`で起動した場合はDockerコンテナ内で動作するが、これはMCPの仕様ではなく起動方法の選択による
- **サービス登録なし**: Windowsサービスやsystemdに登録されない。バックグラウンドデーモンにもならない
- **リソース消費**: 各プロセスは待機中も少量のメモリを消費（Node.js製なら通常30-80MB程度）

### ローカル HTTP サーバーの詳細

stdioと異なり、**ユーザーが自分で起動・停止を管理する**独立したHTTPサーバー:

```
# 別ターミナルで手動起動（Claude Codeとは独立）
$ npx @some/mcp-http-server --port 3100

# Claude Codeからは接続するだけ
claude mcp add --transport http my-server http://localhost:3100/mcp
```

```
Claude Code 起動/終了    ← サーバーに影響なし
        │
        └── HTTP接続 ──► localhost:3100 ──► mcp-http-server
                          （独立プロセス、手動管理）
```

- Claude Codeを閉じてもサーバーは動き続ける
- 複数のClaude Codeセッションから同時接続可能
- 開発・テスト用途で使われることが多い

**重要: 事前に起動しておかないと使えない。**

```
【起動していない場合】
Claude Code ── HTTP接続 ──► localhost:3100  → 接続失敗（Connection refused）
                            （プロセスなし）    → ツール使用不可

【起動済みの場合】
Claude Code ── HTTP接続 ──► localhost:3100  → 正常接続
                            （手動起動済み）    → ツール使用可能
```

**自動起動は必要か？** → 通常は不要。理由は以下の通り:

| 方式 | 自動起動 | 主な用途 |
|---|---|---|
| **stdio（主流）** | Claude Codeが自動起動・自動終了 | 一般的な利用 |
| **リモートHTTP（推奨）** | クラウド側で常時稼働 | GitHub, Gmail等 |
| **ローカルHTTP** | **手動起動が必要** | MCPサーバーの開発・デバッグ用 |

ローカルHTTPは主に**MCPサーバーを自分で開発している人**がデバッグのために使うトランスポート。
一般利用であればstdio（自動起動）またはリモートHTTP（常時稼働）を選べばよく、
ローカルHTTPの自動起動を設定する必要はない。

### リモート HTTP サーバーの詳細

**ユーザーPC上にプロセスは一切存在しない。** 純粋にHTTPSリクエストを送受信するだけ:

```
ユーザーPC                              クラウド（GitHub/Anthropic等）
┌─────────────────��┐                   ┌──────────────────────────────┐
│                  │                   │                              │
│  Claude Code     │    HTTPS通信      │  MCPサーバー群               │
│  (node.exe)      │◄────────────────►│  (コンテナ/K8s等で常時稼働)   │
│                  │                   │                              │
│  ・プロセスなし   │                   │  ・スケーラブル               │
│  ・メモリ消費なし │                   │  ・冗長構成                   │
│  ・管理不要      │                   │  ・自動更新                   │
│                  │                   │  ・サービス提供者が運用        │
└──────────────────┘                   └──────────────────────────────┘
```

クラウド側の実装はサービス提供者に依存するが、一般的には:
- **Kubernetes / コンテナ**: 複数レプリカで冗長運用
- **サーバーレス**: リクエストごとに起動する関数（AWS Lambda等）
- **専用サーバー**: 従来型のアプリケーションサーバー

ユーザーはこれを意識する必要がなく、URLを指定するだけで利用できる。

### ビルトインサーバー（claude.ai Gmail / Calendar）

Claude Codeにデフォルトで組み込まれているMCPサーバー:

```
分類:    リモートHTTPサーバー（Anthropicホスト）
URL:     https://gmail.mcp.claude.com/mcp
         https://gcal.mcp.claude.com/mcp
PC上:    プロセスなし、メモリ消費なし
状態:    未認証の場合は一切通信しない
更新:    Anthropic側で自動管理
削除:    不可（ビルトインのため。無視して放置で問題なし）
```

### OS上のプロセス名称

MCPサーバーは専用の名前で動くわけではなく、**実行ランタイムのプロセス名**で表示される。
MCPという名前のプロセスは存在しない。

#### タスクマネージャーでの見え方

```
【実環境で稼働しているプロセス例（Windows 11）】

プロセス名      PID    パス                                                      役割
═══════════════════════════════════════════════════════════════════════════════════════════════
claude.exe     15076   C:\Program Files\WindowsApps\Claude_...\app\claude.exe    Claudeデスクトップアプリ（メイン/Electron）
claude.exe     24764     └─ --type=crashpad-handler                              ├─ クラッシュ報告
claude.exe     27524     └─ --type=gpu-process                                   ├─ GPU描画
claude.exe     14476     └─ --type=utility (network)                             ├─ ネットワーク通信
claude.exe      1480     └─ --type=renderer                                      ├─ UIレンダリング
claude.exe     26840     └─ --type=renderer                                      ├─ UIレンダリング
claude.exe      5196     └─ --type=renderer                                      ├─ UIレンダリング（Claude Code内蔵）
claude.exe     27180     └─ --type=utility (video_capture)                       ├─ ビデオキャプチャ
claude.exe     11080     └─ --type=utility (audio)                               └─ オーディオ

claude.exe     14312   C:\Users\...\\.local\bin\claude.exe                       Claude Code CLI（セッション1）
claude.exe     18812   C:\Users\...\\.local\bin\claude.exe                       Claude Code CLI（セッション2）
claude.exe     26320   C:\Users\...\\.local\bin\claude.exe                       Claude Code CLI（セッション3）
```

**重要なポイント:**
- すべて`claude.exe`という同じプロセス名で表示される
- デスクトップアプリはElectronベースのため、1つのアプリで**9個のプロセス**が起動する
- CLI版は1セッション1プロセス
- MCPサーバーのstdioプロセスはリモート/ビルトインのみ利用時にはなし

#### MCPサーバーを追加した場合のプロセス名

MCPサーバーの実行方法によってプロセス名が変わる:

```
MCPサーバーの設定              タスクマネージャーでのプロセス名     備考
═════════════════════════════════════════════════════════════════════════════════
npx @github/github-mcp-server → node.exe                         Node.js製サーバー
npx @modelcontextprotocol/... → node.exe                         Node.js製サーバー
python my-mcp-server.py       → python.exe                       Python製サーバー
uvx mcp-server-sqlite         → python.exe (uvx経由)             Python製サーバー
docker run ghcr.io/...        → com.docker.backend.exe内で稼働   Dockerコンテナ
go run ./mcp-server           → mcp-server.exe                   Go製（コンパイル済み）
java -jar mcp-server.jar      → java.exe                         Java製サーバー
```

**つまり「MCPサーバー」という名前のプロセスは存在しない。**
ランタイム（node.exe, python.exe等）の名前で表示される。

#### 具体例: GitHub MCPサーバーを追加した場合

```
タスクマネージャー（stdio版を追加した場合）
═══════════════════════════════════════════════════════════════

claude.exe (PID: 14312)     ← Claude Code CLI
  └── node.exe (PID: ???)   ← GitHub MCP Server（子プロセス）
        コマンドライン: node ...\@github\github-mcp-server\...

※ Claude Codeの子プロセスとして表示される
※ Claude Code終了時に自動で終了する
※ プロセス名は「node.exe」であり「github-mcp-server」ではない
```

```
タスクマネージャー（リモート版を使用した場合）
═══════════════════════════════════════════════════════════════

claude.exe (PID: 14312)     ← Claude Code CLI
                            ← MCPサーバーのプロセスなし
                               （HTTPSリクエストを送るだけ）
```

#### プロセスツリーの全体像

```
【MCPサーバーなしの場合】

explorer.exe
├── claude.exe                ← Claudeデスクトップアプリ（Electron）
│   ├── claude.exe (gpu)
│   ├── claude.exe (network)
│   ├── claude.exe (renderer) x3
│   ├── claude.exe (crashpad)
│   ├── claude.exe (video)
│   └── claude.exe (audio)
│
├── bash.exe                  ← ターミナル
│   └── claude.exe            ← Claude Code CLI
│
└── (他のアプリ)


【stdio版MCPサーバーを3つ追加した場合】

explorer.exe
├── claude.exe                ← Claudeデスクトップアプリ
│   └── (Electronサブプロセス群)
│
├── bash.exe
│   └── claude.exe            ← Claude Code CLI
│       ├── node.exe          ← GitHub MCP Server
│       ├── python.exe        ← DB MCP Server
│       └── node.exe          ← Slack MCP Server
│
└── (他のアプリ)


【リモート版のみの場合】

explorer.exe
├── claude.exe                ← Claudeデスクトップアプリ
│   └── (Electronサブプロセス群)
│
├── bash.exe
│   └── claude.exe            ← Claude Code CLI
│                                ← MCPプロセスなし（HTTP通信のみ）
│
└── (他のアプリ)
```

### 全種別の比較まとめ

```
                    ユーザーPC上             クラウド上
                    ════════════            ══════════
stdio (npx)         node.exe ← 子プロセス   なし
                    セッション中のみ生存
                    メモリ: 30-80MB程度

stdio (docker)      docker container        なし
                    セッション中のみ生存
                    メモリ: コンテナ依存

ローカルHTTP        httpサーバープロセス      なし
                    手動起動・手動停止
                    メモリ: サーバー依存

リモートHTTP        なし                     常時稼働
                    （HTTPリクエストのみ）    サービス提供者管理

ビルトイン          なし                     Anthropic管理
                    （HTTPリクエストのみ）    常時稼働
```

---

## まとめ

- **MCPとは**: AIクライアントと外部ツールを繋ぐ標準プロトコル（AIのUSB規格）
- **リモートMCPサーバー**（Gmail等）はAnthropicやサービス提供元がホスト・自動更新 → ユーザー側メンテナンス不要
- **ローカルMCPサーバー**（stdio）はnpm等で手動更新が必要
- プロトコルはJSON-RPC 2.0ベースで、初期化→バージョンネゴシエーション→オペレーション→シャットダウンのライフサイクル
- リモートサーバーはOAuth認証が必要で、初回アクセス時にブラウザで認可フローを実行
- **ツール選択の判断はLLM（クラウド）** が行い、**実際のAPI呼び出しはMCPサーバー**が行う
