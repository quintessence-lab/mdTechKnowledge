---
title: "MCP (Model Context Protocol) アーキテクチャ詳細"
date: 2026-04-26
updatedDate: 2026-06-18
category: "Claude技術解説"
tags: ["MCP", "Claude Code", "JSON-RPC", "GitHub", "OAuth", "プロトコル", "Claude for Legal", "Release Candidate", "ステートレス", "SEP-2577", "SEP-2663", "Sampling", "非推奨ポリシー", "MCP Apps", "Extensions", "JSON Schema 2020-12", "W3C Trace Context"]
excerpt: "MCPの概要・アーキテクチャ・トランスポート・JSON-RPC・OAuth・プロセスモデルに加え、v2.1仕様（Server Cards・メディアサポート・Tasks primitive）、2026年MCPロードマップ（transport scalability/agent communication/governance/enterprise readiness/エンタープライズSSO・監査トレイル・Governance Working Group・新コアメンテナー）、MCP Apps（SEP-1865）、2026-05-21 Release Candidate ロック（プロトコルステートレス化＝Mcp-Session-Id 廃止、MCP Apps の HTML UI、Tasks Extension 再設計、最終仕様 2026-07-28 公開予定）、MCP Dev Summit NA、Streamable HTTPスケーラビリティ課題、AAIFガバナンス移管後の動向、Claude for Legal で公開された20+ MCPコネクタ、約20万サーバーに影響した重大脆弱性事案、さらに 2026-07-28 RC で制定された SEP-2577 の非推奨ポリシー（Active/Deprecated/Removed の3段階・最低12ヶ月）と Sampling/Roots/Logging の deprecated 化までの参照リンクを網羅"
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

### 2026年の動向（2026-05時点）

#### 2026 MCP Roadmap — 4本柱

2026年初頭に公式ブログで公開された MCP のロードマップは、以下4テーマを中心に進行中:

| テーマ | 内容 |
|---|---|
| **Transport Scalability** | Streamable HTTP のスケール課題への対応。ステートフルセッションがロードバランサと競合し水平スケールが困難な現状を緩和する設計（ステートレス HTTP の検討含む） |
| **Agent Communication** | エージェント間通信プリミティブの標準化（Tasks primitive の発展形）。長時間タスク向けに **retry（一時的失敗時の再試行）／ expiry（完了後に結果を保持する期間）セマンティクス**を整備 |
| **Governance Maturation** | AAIF（Agentic AI Foundation、Linux Foundation 傘下）配下での意思決定フローの整備、SEP（Specification Enhancement Proposal）プロセスの定着 |
| **Enterprise Readiness** | エンタープライズが MCP 導入時に直面する4課題＝**監査証跡（audit trails）／ SSO 統合認証 ／ ゲートウェイ挙動（gateway behavior）／ 設定ポータビリティ（configuration portability）**への対応。SSO・レジストリ自動登録・Server Cards による検出性向上を含む |

#### 2026 ロードマップの追加トピック（2026-05 更新）

ロードマップ公開後にコミュニティ Working Group での議論を経て、以下が新たに優先項目として明文化されている。

| 項目 | 内容 |
|---|---|
| **エンタープライズ認証・SSO 対応** | SAML / OIDC ベースの SSO 連携、企業 IdP（Okta / Entra ID / Auth0 等）統合、サーバー横断のシングルセッション。Enterprise Readiness 柱の中核 |
| **監査トレイル機能** | MCP サーバー側で全 tool call / resource access を構造化ログとして記録するための標準仕様。コンプライアンス（SOC 2 / ISO 27001 等）監査に必要な属性（actor / timestamp / parameters / result hash）を統一定義 |
| **Governance Working Group 設立** | AAIF 配下に正式な Working Group を組成。仕様提案（SEP）の審議・承認フロー、メンテナー任命、エコシステム調整を担当 |
| **新コアメンテナー加入** | **Clare Liguori（AWS）** と **Den Delimarsky（Microsoft）** がコアメンテナーチームに加入。ハイパースケーラー2社のシニアエンジニアが直接プロトコル設計に関与する体制となり、エンタープライズ要求の反映スピードが向上 |

参考: [2026 MCP Roadmap](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/) / [MCP公式ロードマップ](https://modelcontextprotocol.io/development/roadmap) / [The New Stack 解説](https://thenewstack.io/model-context-protocol-roadmap-2026/)

#### MCP Apps（SEP-1865）— 対話型UIのプロトコル仕様化

2026年初頭に **SEP-1865** として正式仕様化。AIホストアプリ（Claude Desktop / Claude Code 等）から **MCPサーバー側が対話型UIを配信** する仕組み。旧称 mcp-ui を発展させ、ホスト側でレンダリング可能なフォーム・カード・確認ダイアログをサーバー側で定義できる。

#### MCP Dev Summit North America（2026年4月）

- 開催地: ニューヨーク
- 参加者: 約1,200名
- 主要テーマ: ロードマップ討議、エンタープライズ事例、新仕様（MCP Apps / Tasks primitive）のデモ
- 業界普及の節目となり、AAIF の運営体制移管後初の大規模イベント

#### Server Cards によるレジストリ自動登録

サーバー定義に同梱する `server.card.json`（仮称、SEP 準拠の自己記述メタ）を解析することで、MCP レジストリへの自動登録・検証・更新を行う仕組みが検討されている。エンタープライズ環境での MCP サーバーガバナンスの中核機能として位置づけられる。

参考: [MCP公式ブログ](https://blog.modelcontextprotocol.io/) / [4月メンテナー更新](https://blog.modelcontextprotocol.io/posts/2026-04-08-maintainer-update/)

#### MCP 2026-07-28 Release Candidate の主要変更（2026-05-21 ロック／最終仕様 2026-07-28 公開予定）

2026年5月21日（PT）、MCP の **次期 Release Candidate（RC）** がロックされた。Transport Scalability・Tasks Extension・MCP Apps に加え、**Sampling 等の非推奨化（SEP-2577）** が本 RC に含まれ、最終仕様は **2026-07-28 公開予定**。RC ロックから最終公開までの約 **10週間が検証期間（validation window）** として設けられており、SDK メンテナ・実装者がこの間に適合性を検証する。**RC は確定版ではなく**、検証期間中の指摘により細部が変わる可能性がある点に注意。実装者にとってのインパクトは大きく、特に**プロトコル層のステートレス化**は既存サーバー/クライアントの再設計を要する。

##### 0. RC 構成 SEP 一覧（2026-05-27補追）

RC で確定した変更は以下の **SEP（Specification Enhancement Proposal）** が束ねる形で構成される。実装者は各 SEP を起点に詳細仕様を追える。

| 領域 | SEP | 内容 |
|---|---|---|
| ステートレス化（プロトコル骨格） | **SEP-2575** | 初期化ハンドシェイク（`initialize` / `initialized`）廃止 |
| 〃 | **SEP-2567** | `Mcp-Session-Id` ヘッダーとサーバー側セッション概念の廃止 |
| 〃 | **SEP-2260** | サーバー発信リクエストは「クライアント処理中」のみ許可（双方向接続前提を撤去） |
| 〃 | **SEP-2322** | Multi Round-Trip Requests により SSE ストリームへの依存撤廃 |
| 〃 | **SEP-2243** | `Mcp-Method` / `Mcp-Name` ヘッダーで操作識別を可能化 |
| キャッシュ制御 | **SEP-2549** | `ttlMs` と `cacheScope` を追加（ステートレス前提でのキャッシュ最適化） |
| エラーモデル統一 | **SEP-2164** | リソース未検出エラーを MCP独自 `-32002` → **JSON-RPC 標準 `-32602 Invalid Params`** に統一 |
| UI 仕様 | **SEP-1865** | MCP Apps（server-rendered HTML UI）。Extensions の公式拡張その1 |
| タスク（拡張化） | **SEP-2663** | Tasks を実験的コアから公式拡張へ昇格（ステートレス・ライフサイクル再設計）。公式拡張その2 |
| 認可強化 | **SEP-2468** / **SEP-837** / **SEP-2352** / **SEP-2207** / **SEP-2350** / **SEP-2351** | OAuth/OIDC 詳細仕様（`iss` 検証 / `application_type` / 資格情報バインディング / リフレッシュトークン / スコープ段階請求 / `.well-known` ディスカバリ） |

→ ステートレス化テーマは **6本の SEP（2575/2567/2260/2322/2243/2549）が連動** することで完成。単独 SEP では成立しない設計。

##### 0-1. エラーコード変更（SEP-2164）— 既存クライアント要修正

リソース未検出時のエラーコードが、MCP独自 `-32002` から **JSON-RPC標準 `-32602 Invalid Params`** に変更。

| 観点 | 変更前 | 変更後（RC） |
|---|---|---|
| コード | `-32002`（MCP独自） | `-32602 Invalid Params`（JSON-RPC標準準拠） |
| 互換性 | MCP 仕様内のみ通用 | **JSON-RPC エコシステム全体と整合** |
| クライアント影響 | `-32002` ハンドリングコード | **要書き換え**（`-32602` への分岐追加・旧コード判定の削除） |

→ **Breaking change**: `-32002` をスイッチ条件にしているクライアント実装は **RC 適用前に必ず更新**。とくに自社 MCP クライアント実装を持つチームは、エラー分岐の grep / リプレース計画が必要。

##### 1. プロトコルのステートレス化（Mcp-Session-Id 廃止）

| 観点 | 変更前 | 変更後（RC） |
|---|---|---|
| セッション識別 | `initialize` / `initialized` ハンドシェイクで **`Mcp-Session-Id` ヘッダー**を発行、以降のリクエストで携帯必須 | **ヘッダー廃止**。リクエストごとに `_meta` 経由でクライアント情報を渡す |
| ルーティング | スティッキー LB が必須（同じサーバーインスタンスへ pin） | **プレーンなラウンドロビン LB で十分** |
| 共有セッションストア | 水平スケール時に必須（Redis 等） | **不要** |
| サーバー側状態管理 | プロトコル層のセッション初期化ロジック | **撤去**。状態が必要なアプリは tool call から ID を発行し、モデルが引数として渡し返す **明示的ハンドルパターン**で実装 |

→ Streamable HTTP のスケール課題（ロードマップ「Transport Scalability」テーマ）に対する**根本解決**。

##### 2. MCP Apps（server-rendered HTML UI）

サーバーが**事前レンダリング済 HTML**をホストアプリへ提供し、**サンドボックス iframe** 内で表示。UI 内のすべての操作は通常の JSON-RPC 経路を通るため、**監査トレイルが直接ツール呼び出しと同等**に取れる。

| 実装サイド | やること |
|---|---|
| サーバー | tool メタデータで UI テンプレートを宣言、HTML をテンプレートエンジンで事前生成 |
| クライアント／ホスト | iframe sandbox を実装、レンダリング済 UI ⇄ プロトコルハンドラ間で JSON-RPC ブリッジを構築 |

旧来の SEP-1865 提案を実装フェーズへ進めた形。

##### 3. Tasks Extension の再設計（SEP-2663）

長時間タスク機能が**実験的コア機能から opt-in 拡張（SEP-2663）** に格下げされる代わりに、**ステートレスなライフサイクル**を採用。MCP Apps（SEP-1865）と並ぶ**2つの公式拡張**の一つ。

| 観点 | 変更前 | 変更後（RC） |
|---|---|---|
| 位置付け | 実験的コア機能 | opt-in **拡張**（Tasks Extension） |
| ライフサイクル | 永続接続状態が前提 | **ステートレス**。`tools/call` 応答に **task handle** を含め、`tasks/get` / `tasks/update` / `tasks/cancel` で駆動 |
| `tasks/list` エンドポイント | 存在 | **廃止** |
| タスク化の判断主体 | クライアント駆動 | **サーバー駆動**（サーバーが「これはタスクである」と判断） |

→ **Breaking change**: 既存の実験的 Tasks API 実装は書き換えが必要。なお移行対象として公式が名指ししているのは **2025-11-25 の experimental Tasks API**（“Anyone who shipped against the 2025-11-25 experimental Tasks API will need to migrate”）。`tasks/list` は session-free スコープ制約のため廃止された。

##### 4. 非推奨ポリシーの制定（SEP-2577）と Sampling 等の deprecated 化

2026-07-28 RC では、これまで暗黙だった機能の廃止手順が **正式な非推奨（deprecation）ポリシー**として SEP-2577 で制定された。プロトコルが「コア機能を壊さずに進化できる」ことを担保する枠組み。

| 段階 | 意味 |
|---|---|
| **Active** | 通常提供。利用推奨 |
| **Deprecated** | 廃止予告。代替手段への移行を促す（仕様上は引き続き機能） |
| **Removal（Removed）** | 仕様から削除。**Deprecated から最低12ヶ月**の間隔を空けてから実施 |

このポリシーに基づき、本 RC で以下の3機能が **Deprecated（廃止予告）** となった。いずれも12ヶ月ルールにより即時削除はされないが、新規実装は代替手段を採るべき。

| 機能 | ステータス | 推奨される代替 |
|---|---|---|
| **Sampling** | Deprecated | クライアント側で **直接 LLM API を統合**する方式が推奨 |
| **Roots** | Deprecated | tool parameters / resource URIs / サーバー設定（server config）で代替 |
| **Logging** | Deprecated | **stderr** もしくは **OpenTelemetry** の利用を推奨 |

→ とくに **Sampling** はサーバーがクライアント経由でモデル推論を依頼する仕組み（本記事「初期化ハンドシェイク」例の `capabilities.sampling` に対応）であり、これに依存するサーバー実装は移行計画が必要。ただし RC＝確定版ではないため、最終仕様（2026-07-28）で細部が変わる可能性がある。

##### 5. Extensions フレームワーク / JSON Schema 2020-12 / W3C Trace Context（RC追補）

ステートレス化・認可・非推奨ポリシーに加え、本 RC では拡張ガバナンスとツール定義・可観測性の標準化も入った。

- **Extensions フレームワーク** — 拡張は **reverse-DNS 識別子**（例: `com.example.feature`）を持ち、**コア仕様から独立してバージョニング**される。capability map でネゴシエートし、**独立リポジトリ＋委任メンテナ**で管理。SEP プロセスに **Extensions Track** が設けられ、実験的 → 公式へと段階的に昇格する。現状の公式拡張は **MCP Apps（SEP-1865）** と **Tasks（SEP-2663）** の2つ。コアを肥大化させずに機能を足せる「増築の作法」が定義された形。
- **JSON Schema 2020-12 サポート** — ツールスキーマが完全な**合成（`oneOf` / `anyOf` / `allOf`）・条件分岐・参照（`$ref`）** に対応。出力スキーマに制限はない。ただしセキュリティ上、**実装は外部 `$ref` URI を自動的にデリファレンス（解決）してはならない**。
- **W3C Trace Context** — 分散トレーシング用キー **`traceparent` / `tracestate` / `baggage`** を `_meta` に標準化。**OpenTelemetry 互換**で、MCP をまたぐリクエストのエンドツーエンド追跡が可能になる。

##### マイグレーション影響まとめ

| 関係者 | 対応 |
|---|---|
| **MCP サーバー実装者** | セッション初期化ロジック撤去、Tasks 仕様書き換え、UI テンプレート宣言（オプション）、**Sampling / Roots / Logging への依存を代替手段へ移行**（12ヶ月の猶予あり） |
| **MCP クライアント／ホスト実装者** | session ID 管理撤去、`_meta` への client info 移行、iframe sandbox 実装、新 Tasks ライフサイクル対応 |
| **インフラ運用** | スティッキー LB 設定解除、共有セッションストア撤去（コスト削減） |
| **エンタープライズユーザー** | スケーリング容易化により水平展開コストが下がる |

参考: [2026-07-28 Release Candidate（MCP公式ブログ）](https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/) / [The New Stack: Model Context Protocol Roadmap 2026](https://thenewstack.io/model-context-protocol-roadmap-2026/)

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

## 実用例: Claude for Legal で公開された 20+ MCP コネクタ（2026年5月）

2026年5月、Anthropic は **Claude for Legal** 製品向けに **20以上の MCP コネクタ** と **12 の業務分野（practice area）プラグイン** を一括公開した。法律業界に特化した広範な MCP コネクタ群が単一ベンダーから提供された初の事例であり、MCP がエンタープライズ垂直市場で実用フェーズに入ったことを示すマイルストーンとなっている。

### コネクタ一覧（カテゴリ別）

| カテゴリ | コネクタ |
|---|---|
| **契約・文書管理** | Ironclad / DocuSign / Definely / iManage / NetDocuments |
| **e-Discovery・訴訟支援** | Relativity / Everlaw / Consilio |
| **ディール・バーチャルデータルーム** | Box / Datasite |
| **リーガルリサーチ** | Midpage / Trellis / Legal Data Hunter（※ LexisNexis / Westlaw 系の主要DB連携を含む） |
| **リーガル AI・特化サービス** | Harvey（リーガル AI）/ Thomson Reuters CoCounsel Legal / Solve Intelligence（特許業務）/ Courtroom5 / BoardWise（access-to-justice） |

### MCP プロトコル観点での意義

- **垂直特化レジストリの先行事例**: 業界別 MCP コネクタを一括認定・配布する運用モデルが確立され、他業界（医療・金融・製造）への展開テンプレートになる
- **エンタープライズ認証要件の実証**: 法律 SaaS の多くは SSO・SAML 必須であり、ロードマップ「Enterprise Readiness（SSO 対応）」の即時的な検証ケースとなる
- **監査トレイル要求の高まり**: 訴訟支援・契約管理は法的証拠能力が問われるため、Governance トラックで議論中の監査トレイル仕様の最有力ユースケース

参考: [LawNext: Anthropic goes all-in on legal — 20+ connectors and 12 practice area plugins](https://www.lawnext.com/2026/05/anthropic-goes-all-in-on-legal-releasing-more-than-20-connectors-and-12-practice-area-plugins-for-claude.html)

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

## 補足: Agent Teams in-processモードでの稼働確認

Claude Code の Agent Teams 機能で複数エージェント（チームメイト）を稼働させた場合、
in-processモードでは以下の方法で確認・操作する。

### 基本操作

| キー | 動作 |
|---|---|
| **Shift+Down** | チームメイト間を循環切り替え（次のエージェントに移動） |
| **Ctrl+T** | タスクリスト表示（全体の進捗・ステータス確認） |
| **Escape** | 現在のチームメイトに割り込み（中断して指示を出す） |

### チームメイトの管理

スラッシュコマンドではなく、**自然言語でリードエージェントに指示**する:

```
# 新しいチームメイトを生成
Spawn a security reviewer teammate to audit the auth module.

# チームメイトの状況確認を指示
Wait for your teammates to complete their tasks before proceeding.

# チームメイトの終了
Ask the researcher teammate to shut down.
```

### モード設定

| 設定値 | 動作 |
|---|---|
| `"auto"`（デフォルト） | tmuxセッション内 → split panes、それ以外 → in-process |
| `"in-process"` | 常にメインターミナル1画面内で動作 |
| `"split-panes"` | 常にtmux/iTerm2で分割ペイン表示 |

```bash
# 一時的に指定（セッション単位）
claude --teammate-mode in-process

# 恒久的に設定（~/.claude.json に追記）
{ "teammateMode": "in-process" }
```

### 注意点

- in-processモードでは `/resume` でセッション再開するとチームメイトが消える可能性がある
- tmux未使用環境ではデフォルトで in-process モードが適用される

---

## MCP v2.1 仕様アップデート（2026年Q1〜Q2）

2026年に入り、MCP仕様は v2.1 系列のアップデートを進めています。実験的機能としてシップ済みのものから議論段階のものまでを含みますが、いずれもエコシステム全体の機能性・運用性を底上げする内容です。

### Server Cards（サーバーメタデータの標準化）

MCPサーバーが自身の情報を構造化して公開する仕組みです。クライアント側からサーバーの素性・能力・所有者情報を機械可読な形で取得できるようになります。

```
GET https://example-mcp.com/.well-known/mcp-server-card
    ↓
{
  "name": "Example MCP Server",
  "version": "1.4.0",
  "vendor": "Example Inc.",
  "documentationUrl": "https://...",
  "capabilities": ["tools", "resources", "prompts"],
  "supportedTransports": ["http", "sse"],
  "authentication": { "type": "oauth2", "scopes": [...] }
}
```

- 配置場所: `/.well-known/` 配下の固定パス
- 用途: クライアントによる事前検証、レジストリへの自動登録、信頼性スコアリング
- 効果: 未知のサーバーに接続する前に「何ができるか」「誰が運用しているか」を確認できる

### メディアサポート（画像・動画・音声）

これまでツールの結果は主にテキスト中心でしたが、v2.1 ではコンテンツ型として画像・動画・音声を一級でサポートします。

| 種別 | 用途例 |
|---|---|
| **画像（image）** | 図表生成、スクリーンショット取得、グラフ可視化 |
| **動画（video）** | 画面録画、動画編集ツールの結果返却 |
| **音声（audio）** | TTS結果、音声分析、文字起こし元データ |

```json
// tools/call の結果例
{
  "content": [
    { "type": "text", "text": "グラフを生成しました" },
    { "type": "image", "mimeType": "image/png", "data": "base64..." }
  ]
}
```

### Tasks primitive（SEP-1686, 実験的機能としてシップ済み）

長時間実行・非同期型のツール呼び出しを扱うための新プリミティブです。従来の `tools/call` が同期的な要求/応答を前提としていたのに対し、Tasks はジョブ的なワークロードを扱えます。

```
クライアント                       サーバー
   │── tasks/create ─────────────►│   タスク登録（即座に taskId 返却）
   │◄────────── { taskId } ───────│
   │
   │── tasks/get ────────────────►│   進捗ポーリング or 通知購読
   │◄── { status: "running", progress: 0.4 } ─│
   │
   │── tasks/get ────────────────►│
   │◄── { status: "completed", result: ... } ─│
```

現在シップ済みなのは基本ライフサイクルで、追加で **リトライセマンティクス** と **有効期限ポリシー（TTL）** の標準化が進行中です。失敗時の再試行責務の所在、長時間タスクの自動破棄、結果のキャッシュ寿命などをプロトコルレベルで規定する方向で議論されています。

参考: [Model Context Protocol Roadmap 2026 (公式ブログ)](https://blog.modelcontextprotocol.io/posts/2026-mcp-roadmap/) / [Roadmap 2026 (The New Stack)](https://thenewstack.io/model-context-protocol-roadmap-2026/)

---

## 2026年4月以降の動向（エコシステム）

MCPは2024年11月の公開以降、急速に普及しています。2025年12月の **AAIF（Agentic AI Foundation、Linux Foundation 傘下）** へのガバナンス移管以降、仕様策定とエコシステム運営は中立的な財団のもとで進行しており、2026年4〜5月時点では財団主導の SEP プロセスとメンテナー体制が安定運用に入っています。Anthropic から AAIF への MCP プロトコル正式寄贈は、[The New Stack 解説記事](https://thenewstack.io/anthropic-donates-the-mcp-protocol-to-the-agentic-ai-foundation/) も参照してください。

### メンテナーチーム体制刷新（2026-04-08）

公式ブログでメンテナー体制の更新が発表されました。新体制は以下の通りです:

| ロール | 氏名 | 主な背景・担当 |
|---|---|---|
| **Lead Maintainer** | **Den Delimarsky** | 開発者プラットフォーム経験者。仕様全体の方向性、ロードマップ運営、SEP統括 |
| **Core Maintainer（新規）** | **Clare Liguori** | 分散システム運用の経験を持つエンジニア。MCP仕様・SDKの保守、運用面の意思決定 |

Lead Maintainer が Den Delimarsky に確定し、Core Maintainer として Clare Liguori が新たに加わったことで、SEP レビュー・SDKリリース・コミュニティサポートの体制が強化されました。AAIF ガバナンス移管後の運営体制が一段と整った形です。

参考: [MCP Maintainer Update (2026-04-08)](https://blog.modelcontextprotocol.io/posts/2026-04-08-maintainer-update/)

### MCP Dev Summit North America (NYC, 2026-04 中旬)

2026年4月中旬、ニューヨークで初の北米向け MCP Dev Summit が開催されました。参加者は約 **1,200名** で、サーバー実装者・クライアント実装者・SaaSベンダー・エンタープライズ採用企業が一堂に会する場となりました。

- v2.1 仕様の合意形成（Server Cards / メディアサポート / Tasks primitive）
- AAIF 移管後の運営方針の共有
- エンタープライズ採用ケーススタディ（GitHub・Sentry・Linear等）
- セキュリティ分科会（後述の脆弱性事案がトピックとして取り上げられた）

### 重大脆弱性事案（2026-04-16〜20）

2026年4月中旬から下旬にかけて、MCPサーバー実装に共通するパターンに起因する **重大度の高い脆弱性** が公表されました。影響範囲は **約20万サーバー** にのぼると報告されています。

| 項目 | 概要 |
|---|---|
| **重要度** | 高（Critical 相当） |
| **影響範囲** | 約20万サーバー（公開・社内含む） |
| **Anthropicの判断** | 一部の挙動については **"expected behavior"（仕様通りの動作）** との見解を表明。プロトコル側ではなく実装・運用側で対処すべきと整理 |

本記事では概要のみに留めます。詳細な技術内容・影響範囲・推奨される緩和策・各SDKの対応状況については、別途用意している脆弱性専門記事を参照してください。

参考: 詳細記事 [MCP脆弱性レポート（mcp-vulnerability-report.md）](./mcp-vulnerability-report.md)

### AWS MCP Server が GA（正式提供）に移行（2026-05-06）

AWS は 2026年5月6日（米時間）、**AWS MCP Server を Preview から GA（一般提供）** へ移行したと発表しました。AI コーディングエージェントが MCP プロトコル経由で **AWS サービスへ安全・監査可能にアクセス** するための、AWS マネージドな MCP サーバーです。

| 項目 | 内容 |
|---|---|
| **提供状況** | GA（General Availability） |
| **対応リージョン** | US East (N. Virginia) / Europe (Frankfurt) |
| **追加課金** | なし（消費した AWS リソース分のみ課金） |

#### Preview からの主な追加機能

- **単一ツールから任意の AWS API を呼び出し可能**（ファイルアップロード・長時間オペレーション含む）
- **サンドボックス内 Python スクリプト実行** — マルチステップタスクをファイルシステム／シェルアクセスなしで実行
- **Agent Skills** が従来の SOP に代わり、オンデマンドでガイダンスを発見・提供
- **ドキュメント検索・スキル発見が AWS 認証情報なしで実行可能** に変更

参考: [AWS What's New（2026-05-06）](https://aws.amazon.com/about-aws/whats-new/2026/05/aws-mcp-server/)

> AWS MCP Server の GA 移行に合わせ、MCP プロジェクト全体としても **新メンテナ体制が確立**：Den Delimarsky（Lead Maintainer）に加え、**Clare Liguori（Core Maintainer）** が就任し、Anthropic 外（AWS 在籍）からの中核メンテナが入ることで、AAIF（Linux Foundation 傘下）配下での **ベンダー中立性が実体面で進展** しています（詳細は次節）。

### SDK・レジストリの更新（2026-05-08 / 09 JST）

2026年5月上旬、MCP の **Rust SDK・TypeScript SDK・公式レジストリ** が相次いで更新されました。

| 対象 | 更新内容（概要） | 日付 |
|---|---|---|
| **Rust SDK** | v2.1 仕様への追随（Server Cards / メディアサポート対応の API 追加）、エラーハンドリング改善 | 2026-05-08 JST |
| **TypeScript SDK** | v2.1 対応強化、Tasks primitive クライアントヘルパ整備、型定義更新 | 2026-05-08 JST |
| **公式レジストリ** | Server Cards 自動取り込みの試験運用、検索 UX 改善、メタデータスキーマ更新 | 2026-05-09 JST |

これらの更新により、サーバー実装者は v2.1 仕様（Server Cards・メディア・Tasks）を **公式 SDK のみで完結して実装** できる範囲が広がりました。

参考: [MCP 公式ブログ](https://blog.modelcontextprotocol.io/)

### エコシステム規模

| 指標 | 数値 | 備考 |
|---|---|---|
| **公開MCPサーバー数** | **10,000以上** | GitHubおよび公式レジストリ上で公開されているサーバーの累計 |
| **月間SDKダウンロード数** | **約9,700万件** | Python・TypeScript SDK合計（npm + PyPI） |
| **SEP提案数** | **増加傾向** | v2.1関連（Server Cards / Tasks）に加え、認証・セキュリティ系SEPが活発 |

### エコシステム規模

| 指標 | 数値 | 備考 |
|---|---|---|
| **公開MCPサーバー数** | **10,000以上** | GitHubおよび公式レジストリ上で公開されているサーバーの累計 |
| **月間SDKダウンロード数** | **約9,700万件** | Python・TypeScript SDK合計（npm + PyPI） |
| **SEP提案数** | **増加傾向** | 認証・トランスポート・新メッセージ型などの仕様拡張案が継続的に提出されている |

### SEP（Specification Enhancement Proposals）

SEPはMCP仕様への変更を議論・追跡するための公式提案プロセス。最近は以下のテーマで活発な議論が行われている:

- **認証・認可の強化**: OAuth 2.1準拠、PKCE必須化、動的クライアント登録の標準化
- **トランスポート拡張**: WebSocket、gRPC等の追加トランスポート提案
- **新メッセージ型**: 進捗通知の拡張、構造化エラー応答、長時間実行ツール対応
- **セキュリティ**: ツール定義の検証、権限スコープ、監査ログ

### 普及の背景

- **クライアント側採用拡大**: Claude Code・Cursor・VS Code・Zed・Continue等、主要なAI開発ツールが標準対応
- **エンタープライズ採用**: GitHub・Sentry・Linear・Notion等、SaaS各社が公式MCPサーバーを提供
- **オープンソース貢献**: モデル提供事業者だけでなく、サードパーティ開発者によるサーバー実装が活発化

参考: [Model Context Protocol Roadmap 2026 (The New Stack)](https://thenewstack.io/model-context-protocol-roadmap-2026/)

---

## Claude Code 側の運用機能変更（2026年4月）

MCPプロトコル本体だけでなく、Claude Code クライアント側でも MCP に関連する運用機能の改善が複数入っています。

### ツール結果の最大サイズを上書き可能に

ツール呼び出しの結果サイズには上限があり、超過するとトリミングされていました。これに対し、サーバー定義の `_meta` フィールドで上限値を上書きできるようになりました。

```json
{
  "name": "fetch_large_dataset",
  "description": "...",
  "inputSchema": { "..." : "..." },
  "_meta": {
    "anthropic/maxResultSizeChars": 500000
  }
}
```

- キー: `_meta["anthropic/maxResultSizeChars"]`
- 用途: 大規模ログ取得・大量レコードの一括返却・長文ドキュメント取得など、デフォルト上限では収まりきらないツール
- 効果: ツール側で必要な上限（例: 500K文字）を宣言することで、結果が途中で切れる問題を回避

### ローカル + claude.ai 両方の MCP 設定時、concurrent connect がデフォルト化

ローカル設定（`.mcp.json` 等）と claude.ai 側の MCP サーバー設定の **両方** が存在するケースで、従来は順次接続だったものが **並行接続（concurrent connect）がデフォルト** になりました。

- 効果: セッション開始時の初期化時間が短縮
- 影響範囲: 両方の設定が併存している環境（ハイブリッド利用者）

### プラグイン依存関係エラーの UX 改善

MCPサーバーをプラグイン経由で利用する際、依存関係が未インストールの場合のエラー表示が改善されました。

```
従来: 不明瞭なエラー（"failed to start" 等）

新版: 明示的な "not installed" 表示 + インストールヒント
  → "Plugin dependency 'foo-tool' is not installed.
     Run: npm install -g foo-tool"
```

- 効果: 初回セットアップでのつまずきを大幅に削減
- 対象: stdio 系のローカルMCPサーバー全般

参考: [Claude Code Changelog](https://code.claude.com/docs/en/changelog) / [Claude Code リリース履歴 (releasebot)](https://releasebot.io/updates/anthropic/claude-code)

---

## まとめ

- **MCPとは**: AIクライアントと外部ツールを繋ぐ標準プロトコル（AIのUSB規格）
- **リモートMCPサーバー**（Gmail等）はAnthropicやサービス提供元がホスト・自動更新 → ユーザー側メンテナンス不要
- **ローカルMCPサーバー**（stdio）はnpm等で手動更新が必要
- プロトコルはJSON-RPC 2.0ベースで、初期化→バージョンネゴシエーション→オペレーション→シャットダウンのライフサイクル
- リモートサーバーはOAuth認証が必要で、初回アクセス時にブラウザで認可フローを実行
- **ツール選択の判断はLLM（クラウド）** が行い、**実際のAPI呼び出しはMCPサーバー**が行う
- **2026年4月時点でエコシステムは大幅拡大**: 公開MCPサーバー10,000以上、月間SDKダウンロード約9,700万件
- **v2.1 仕様アップデート進行中**: Server Cards（`.well-known` メタデータ）、メディアサポート（画像・動画・音声）、Tasks primitive（SEP-1686、リトライ・TTLポリシー策定中）
- **メンテナー体制刷新（2026-04-08）**: Lead Maintainer に Den Delimarsky、Core Maintainer に Clare Liguori が就任。AAIF ガバナンス移管後の運営体制が安定化
- **NYC で MCP Dev Summit NA 開催（2026-04 中旬, 約1,200名参加）**
- **重大脆弱性が公表（2026-04-16〜20、約20万サーバー影響）**: Anthropic は一部を "expected behavior" と判断。詳細は別記事 [MCP脆弱性レポート](./mcp-vulnerability-report.md) 参照
- **Claude Code 運用機能改善**: `_meta["anthropic/maxResultSizeChars"]` での結果上限上書き（500K等）、ローカル+claude.ai 併存時の concurrent connect デフォルト化、プラグイン依存関係エラーの UX 改善
