---
title: "MCPサーバーとClaudeの接続パターン解説 — Browser / Claude Code Terminal / Claude Code Web"
date: 2026-04-26
updatedDate: 2026-04-26
category: "Claude技術解説"
tags: ["MCP", "Claude", "Claude Code", "アーキテクチャ", "接続パターン", "GitHub MCP"]
excerpt: "MCPサーバーとClaudeの3つの主要接続パターン（Browser / Claude Code Terminal / Claude Code Web）を図解。GitHub MCPを例にアクセス経路の違い・認証フロー・運用上の選択基準を整理。"
draft: false
---

## はじめに

「MCP（Model Context Protocol）を使う」と一口に言っても、**どのClaudeクライアントから接続するかによって、接続元のIP・認証情報の置き場所・到達可能なネットワーク範囲・課金モデルまでが根本的に異なる**。「ブラウザでもCLIでも同じ」という前提で設計を進めると、「社内ツールに繋がらない」「書き込み権限が動かない」「予期しないAPI課金が発生した」といった事故に直面する。

本記事ではClaude側の接続パターンを3種類（claude.aiブラウザ／Claude Code物理端末／Claude Code on the Web）に分けて整理し、それぞれの経路図・認証フロー・適用場面を解説する。GitHub MCPを例に取り上げ、**3つのGitHubアクセス経路**と料金構造もあわせて図解する。

> 関連記事:
> - プロトコル仕様の詳細は[MCP（Model Context Protocol）アーキテクチャ詳細](/mdTechKnowledge/blog/mcp-architecture/)
> - GitHub MCPの導入是非は[GitHub MCP サーバ導入のメリットとデメリット](/mdTechKnowledge/blog/github-mcp-merits-demerits/)

---

## TL;DR

- MCPの**接続発信元は3パターン**ある。**ブラウザ経由はAnthropicクラウド側**、**CLI経由はローカル端末**、**Code on the WebはAnthropic管理VM**から発信される。社内VPN内のサーバーに繋ぎたければCLI一択。
- claude.aiのカスタムコネクタUIは**OAuth 2.1前提**で設計されており、PAT（Personal Access Token）をAuthorizationヘッダーに直接渡すことができない。`api.githubcopilot.com/mcp`をPAT認証で使いたい場合はCLI側の設定ファイルを使う必要がある。
- GitHubと連携する経路は3つあり、用途・費用が大きく異なる。**書き込みを伴う自動化は Claude GitHub App + GitHub Actions（API従量課金）**、**手動の参照は GitHub連携（純正・サブスク内）**、**書き込みを伴う対話は Claude Code（CLI）**がそれぞれ向く。
- Claude GitHub App経由ではPro/Maxなどのサブスクリプションは適用されず、**Anthropic APIの従量課金**になる。**支出上限の設定が必須**。

---

## 1. 前提知識: トランスポートと「ローカル/リモート」

MCPサーバーへの接続方式（トランスポート）は次の3種類。

| トランスポート | 接続方式 | 主な用途 | 認証 |
|---|---|---|---|
| `stdio` | クライアントが子プロセスとしてMCPサーバーを起動し、標準入出力でやり取り | ローカルツール（ファイル操作・DB接続など） | プロセスがユーザー権限を継承 |
| `http` (Streamable HTTP) | クライアントがリモートのHTTPエンドポイントに接続 | クラウドサービス、社内APIゲートウェイ | OAuth 2.1 / Bearerトークン |
| `sse` (Server-Sent Events) | HTTPの旧バリアント | 互換性目的のみ。新規採用は非推奨 | 同上 |

`stdio`は本質的にローカル接続専用、リモート接続は`http`を使う。本記事では便宜的に次の呼び分けをする。

- **ローカルMCP**: `stdio`で動作する、クライアント実行マシン上のサーバー
- **リモートMCP**: `http`で動作する、ネットワーク越しに接続する別マシン上のサーバー

この区別が重要なのは、**クライアント種別ごとに使用可能なトランスポートが違う**ためである。

---

## 2. パターン1: claude.ai（ブラウザ）からの接続

![パターン1: claude.aiブラウザからのMCP接続経路](/mdTechKnowledge/images/mcp-connection/pattern1-browser.png)

### 2.1 経路の特徴

ユーザー端末は**claude.aiのチャットUIに接続するだけ**で、MCPサーバーへの実際の接続は**Anthropicのクラウドインフラから発信される**。これはclaude.ai、Claude Desktop、モバイルアプリなどコンシューマー向け Claudeクライアント全般で共通の動作。

```
[ユーザー端末] → HTTPS → [claude.ai サーバー] → HTTPS → [MCPサーバー]
```

MCPサーバーから見ると、接続元はAnthropicのIPレンジになる。

### 2.2 認証情報の流れ

- **claude.aiセッション**: ユーザーがログインする際のOAuthトークン。Anthropic側に保管。
- **MCP認証**: 各MCPサーバーごとにOAuth／APIキー。コネクタ設定時にClaude側に登録され、Anthropicインフラに保管。

### 2.3 制約事項

このパターンの最大の制約は**MCPサーバーがAnthropic IPからの到達性を持たねばならない**ことである。

| 接続先 | 可否 |
|---|---|
| 社内LAN/VPN内のMCPサーバー | 接続不可 |
| `localhost`のMCPサーバー | 接続不可 |
| ファイアウォール背後のMCPサーバー | 接続不可 |
| パブリックインターネットに公開されたMCPサーバー | 接続可 |
| Cloudflare Tunnel/ngrokなどで公開されたサーバー | 接続可 |

加えて、`stdio`トランスポートは**完全に使えない**。ローカルプロセスとして起動するという概念がそもそもクラウド側に存在しないため。

### 2.4 適している用途

- パブリックなクラウドサービス（GitHub、Notion、Linear、Asana等）との連携
- ホスト型SaaS製品との連携
- 出張先や複数デバイスから同じMCP接続を使いたいケース

---

## 3. パターン2: Claude Code（物理端末）からの接続

![パターン2: Claude Code物理端末からのMCP接続経路](/mdTechKnowledge/images/mcp-connection/pattern2-claude-code-terminal.png)

### 3.1 経路の特徴

`claude` CLIコマンドはユーザーの物理端末上で動作し、MCPサーバーへの接続もすべてローカルから発信される。Anthropicのサーバーは**モデル推論にだけ**使われ、MCP通信経路には介在しない。

```
[ユーザーCLI] → stdio/HTTP → [MCPサーバー]
[ユーザーCLI] → HTTPS     → [Anthropic API（推論のみ）]
```

`stdio` MCPサーバーはCLIが**子プロセス**として起動するため、ユーザーと同じOS権限・環境変数・ファイルシステムへのフルアクセスを継承する。

### 3.2 設定スコープ

Claude CodeのMCP設定は3階層ある。

| スコープ | 設定ファイル | 共有範囲 | 主な用途 |
|---|---|---|---|
| `local` | (CLI内部状態) | 起動端末・現在のディレクトリのみ | 試験的な接続 |
| `project` | プロジェクトルートの`.mcp.json` | リポジトリにコミットしてチーム共有 | プロジェクト固有のツール |
| `user` | `~/.claude.json` | 個人ユーザー全体 | 個人用APIキー、補助ツール |

`project`スコープの`.mcp.json`をコミットすればチーム全員が同じMCP設定で開発できる。ただし**シークレット（APIキー等）は環境変数経由で渡し、ファイル本体にハードコードしない**のが原則。

### 3.3 認証情報の流れ

- **MCP認証**: 設定ファイル（`.mcp.json`または`~/.claude.json`）に直接、もしくは環境変数経由で渡す。**PATをAuthorizationヘッダーで指定する形が一般的**。
- **stdio子プロセスの権限**: CLI起動ユーザーの全権限を継承。

### 3.4 到達可能なネットワーク

- ローカル`stdio`サーバー → 制限なし
- `localhost`のHTTPサーバー → 接続可
- 社内VPN内のサーバー → 接続可（VPN接続済みの端末から）
- パブリックインターネットのMCPサーバー → 接続可

要するに、**ユーザーの端末から見えるものはすべて見える**。

### 3.5 セキュリティ上の含意

このパターンは最も柔軟だが、その柔軟性ゆえのリスクも持つ。

- `stdio` MCPサーバーは**任意のローカルコマンドを実行**できる。プロンプトインジェクション攻撃を受けると、信頼できないMCPサーバー経由で`~/.ssh/id_rsa`を読み取られる、`rm -rf`を実行される、といった被害に直結する。
- 業務マシンで信頼できないコミュニティ製のMCPサーバーを試す場合は、**専用のVMやDocker環境**で実行することが強く推奨される。
- `project`スコープの`.mcp.json`をGitで共有する場合、`stdio`起動コマンドが安全か、コミット前にレビューする運用が必須。

### 3.6 適している用途

- ローカルファイルやDBを操作するMCPツール
- 社内ツール（`localhost`やVPN越しのAPI）
- 開発中の自作MCPサーバーのテスト
- 認証情報をAnthropic側に置きたくないケース（社内ポリシーで外部送信を禁止されている等）

---

## 4. パターン3: Claude Code on the Webからの接続

![パターン3: Claude Code on the WebからのMCP接続経路](/mdTechKnowledge/images/mcp-connection/pattern3-claude-code-web.png)

### 4.1 経路の特徴

Claude Code on the Webはブラウザから使うClaude Codeで、Anthropicが管理する**隔離VM（サンドボックス）**上で動作する。表面的にはブラウザ操作だがパターン1とは大きく異なり、サンドボックス内で`claude` CLI相当のプロセスが動き、リポジトリのクローン・コード編集・PR作成などを行う。

```
[ユーザーブラウザ] → [claude.ai/code UI] → [隔離VM（Claude Code実行）]
                                              ↓ HTTPS
                                          [リモートMCP / GitHub]
```

### 4.2 認証情報の独自設計

このパターンの核心は、**機密情報がサンドボックス内に存在しない**点にある。

- git認証情報や署名鍵はサンドボックス**外**の専用認証プロキシが保持
- サンドボックス内のgitクライアントは独自のスコープ付き認証情報でプロキシに認証
- プロキシはgit操作の内容も検証（例: 「設定したブランチへのpushのみ」を強制）した上で、本物の認証トークンを使ってGitHub APIにリクエストを発行

これにより、サンドボックス内で動作するコード（LLMが生成した処理を含む）が暴走しても、**本物の認証トークンには触れられない**設計になっている。プロンプトインジェクションでサンドボックス内が侵害されても、被害範囲はサンドボックス内のリポジトリクローンに限定される。

### 4.3 制約事項

- **`stdio` MCPは使用不可**: サンドボックスはLLMが任意プロセスを起動する権限を持たないため
- **ネットワークアクセスは制限可能**: デフォルトでegressに制約あり。社内VPN内のサーバーには到達不可
- **ローカルファイル/環境変数にはアクセス不可**: クローンしたリポジトリのみが見える
- 実行時間に上限あり（長時間タスクは打ち切られる）

### 4.4 適している用途

- リポジトリに対する自動PR作成
- 隔離環境で実行したいIssueの処理
- ローカル端末を持たないユーザー（タブレット、Chromebook等）からの開発
- 認証情報をサンドボックスに渡したくない（ポリシー遵守）

---

## 5. 3パターン比較表

| 観点 | パターン1: ブラウザ | パターン2: Code（端末） | パターン3: Code on Web |
|---|---|---|---|
| **起動場所** | claude.ai UI（ブラウザ） | ローカル端末 | claude.ai/code UI（ブラウザ） |
| **MCP接続の発信元** | Anthropicクラウド | ローカル端末 | Anthropic管理VM |
| **stdio MCP** | 不可 | 可（子プロセス） | 不可 |
| **リモートHTTP MCP** | 可 | 可 | 可 |
| **`localhost`のMCP** | 不可 | 可 | 不可 |
| **社内VPN内サーバー** | 不可 | 可（VPN端末から） | 不可 |
| **ローカルファイル/環境変数** | アクセス不可 | フルアクセス | クローンしたリポジトリのみ |
| **認証情報の保管場所** | Anthropic側 | ローカル端末 | サンドボックス外プロキシ |
| **MCP認証の方式** | OAuth 2.1前提 | OAuth/PAT/任意ヘッダー | OAuth 2.1前提 |
| **プロンプトインジェクション耐性** | 中（Anthropic側で隔離） | 低（ローカル権限を共有） | 高（二重隔離） |
| **同時に複数デバイスから利用** | 容易 | 端末ごとに設定 | 容易 |
| **典型用途** | パブリックSaaS連携 | 社内ツール・自作MCP・localhost | 自動PR・隔離実行 |

### 5.1 用途別の推奨

- **社内DB/APIへの接続が必要** → パターン2 一択
- **手元の`localhost`の自作ツールを試したい** → パターン2
- **Notion/Slack/GitHubなどのクラウドSaaSと連携したい** → パターン1が最も手軽
- **隔離された環境で安全に試したい新規MCPサーバー** → パターン3
- **自動化されたPR作成（CIライク）** → パターン3またはGitHub Actions連携（後述）

---

## 6. claude.aiからのMCP利用時に陥りやすい落とし穴

ここからは、特に**claude.ai（パターン1）**からMCPを使う際に実際に遭遇する制約と回避策を整理する。公式ドキュメントには明記されていない実運用上の注意点が中心。

### 6.1 認証方式の制約: OAuth前提という設計思想

claude.aiのリモートMCPコネクタは、認証として**OAuth 2.1フローを前提**に設計されている。コネクタを追加するとClaudeがMCPサーバーの`/.well-known/oauth-authorization-server`を見に行き、ブラウザを開いて認証コードフローを実行し、コールバックでアクセストークンを取得する流れ。

#### PAT（Personal Access Token）を直接渡せない

VS CodeやClaude Code（CLI）の`mcp.json`では次のようにAuthorizationヘッダーにPATを直接書ける。

```json
{
  "servers": {
    "github": {
      "type": "http",
      "url": "https://api.githubcopilot.com/mcp/",
      "headers": {
        "Authorization": "Bearer ghp_xxxxx"
      }
    }
  }
}
```

しかしclaude.aiの「カスタムコネクタを追加」UIには、この**Authorizationヘッダーを直接入力する欄がない**。表示されるのは:

- 名前
- URL
- (詳細設定) OAuth Client ID
- (詳細設定) OAuthクライアントシークレット

の4つだけ。PATはOAuthトークンとは別物（PATは事前発行されたBearerトークン、OAuthは認証フロー経由で動的に取得するトークン）なので、このUIからは渡せない。

#### 回避策

PAT認証しかサポートしていないMCPサーバーは、**claude.aiのカスタムコネクタからは使えない**ことになる。回避策:

1. **MCPサーバー側にOAuthエンドポイントを追加実装する**（大変）
2. **OAuthプロキシ（例: Cloudflareの`mcp-remote`）を間に挟む**（中程度の手間）
3. **Claude Code（CLI）を使う**（パターン2に切り替え）
4. **Claude GitHub App（`@claude`メンション）を使う**（GitHub限定）

### 6.2 GitHub MCPコネクタの書き込み権限が動かない問題

`api.githubcopilot.com/mcp`をOAuth認証でclaude.aiに登録した状態で、Issue作成やpushを試みると次のエラーが返ることがある。

```
403 Resource not accessible by integration
```

原因は次のいずれか（頻度順）:

1. **Copilotサブスクリプションを契約していない** — `api.githubcopilot.com/mcp`の書き込みツールはCopilot契約必須
2. **GitHub CopilotのGitHub Appが対象リポジトリにインストールされていない**
3. **インストール済みだがRepository accessに対象リポジトリが含まれていない**
4. **個人/Orgのサードパーティアプリポリシーで MCP書き込みがブロックされている**

claude.aiの「ツール許可」UIで全ツールを ✓ 許可済みにしても、これはClaude → MCPサーバー間の許可であって、MCPサーバー → GitHub間のトークン権限とは別レイヤー。許可をどれだけONにしても、裏側のGitHub Appトークンが書き込み権限を持っていなければ403になる。

### 6.3 「GitHub連携」（純正コネクタ）の実体

claude.aiの設定画面のコネクタ一覧で、上段に表示される「GitHub連携」（Anthropic純正コネクタ）と、下段の「GitHub MCP（カスタム）」は**別物**。

- **GitHub連携**（純正）: claude.aiがGitHubを**検索/参照**する用途。ツール一覧はread中心で、書き込み系ツールは原則公開されていない
- **GitHub MCP**（カスタム）: 上記の`api.githubcopilot.com/mcp`を手動で追加するパターン。Copilot契約があれば書き込み可

「GitHub連携をONにしているのにIssueが作れない」という混乱は、この区別ができていないことに起因することが多い。

---

## 7. ClaudeがGitHubを操作する3つの経路

![ClaudeがGitHubを操作する3つの経路](/mdTechKnowledge/images/mcp-connection/github-access-paths.png)

GitHubと連携する場合、選択肢は3つある。提供主体・権限・課金が異なるので、用途に応じて使い分ける。

| 経路 | 提供主体 | 主な用途 | 書き込み | 課金 |
|---|---|---|---|---|
| **A. GitHub連携（純正コネクタ）** | Anthropic | コード参照・PR要約 | 不可 | サブスク内 |
| **B. GitHub MCP（カスタム）** | GitHub（`api.githubcopilot.com/mcp`） | 対話的な書き込み | 可（Copilot契約必須） | Copilotサブスク |
| **C. Claude GitHub App（`@claude`）** | Anthropic公式App + Actions | 自動化・定期実行 | 可 | API従量課金 |

### 7.1 経路A: GitHub連携（Anthropic純正コネクタ）

claude.aiのコネクタ画面に最初から見える純正コネクタ。read中心で、コードやIssueの参照に使う。書き込みはサポートされない（もしくは非常に限定的）。**追加課金なく、claude.aiのサブスクリプション内で完結**する。

**使うべき場面**: コードを読んで質問する、PRの差分をレビューしてもらう、Issueの内容を要約してもらう、など参照中心の作業。

### 7.2 経路B: GitHub MCP（カスタムコネクタ）

GitHubが提供する公式MCPサーバー（`api.githubcopilot.com/mcp`）。書き込み系ツール（Issue作成、PR作成、ファイル編集等）を含む豊富なツール群を提供するが、**書き込みツールの利用はGitHub Copilotの契約が必要**。さらにCopilotのGitHub Appが対象リポジトリに正しくインストールされ、書き込み権限を持っている必要がある。

**注意点**: claude.aiのUIからPATを渡せないので、認証はOAuthフロー前提。CLI側であればPATも使える。

### 7.3 経路C: Claude GitHub App（`@claude`メンション + GitHub Actions）

Anthropicが提供する`Claude` GitHub Appをリポジトリにインストールし、Issue/PRで`@claude`とメンションすると、リポジトリのGitHub ActionsワークフローがトリガーされてClaude Codeが起動するパターン。

実体としては:

1. リポジトリに`.github/workflows/claude.yml`を配置（anthropics/claude-code-actionを使用）
2. `ANTHROPIC_API_KEY`をRepository Secretsに登録
3. Issue/PRで`@claude このバグを直して`のようにメンション
4. GitHub Actionsランナーが起動してClaude Codeを実行
5. Claude CodeがPR作成、コメント返信などを実行

**最大の注意点**: 課金構造（次セクション）。

---

## 8. Claude GitHub Appの料金構造（経路C詳細）

### 8.1 二重の課金: API + GitHub Actions

経路Cを使う場合、**2系統のコスト**が発生する。

#### Anthropic APIトークン課金（主要なコスト）

Claude Code ActionはGitHub Actionsランナー上で`claude`プロセスを起動し、Anthropic APIを呼び出してモデル推論を行う。このAPI利用は**完全に従量課金**。

| モデル | 入力 | 出力 |
|---|---|---|
| Claude Opus 4.7 | $5 / 100万トークン | $25 / 100万トークン |
| Claude Sonnet 4.6 | $3 / 100万トークン | $15 / 100万トークン |
| Claude Haiku 4.5 | $1 / 100万トークン | $5 / 100万トークン |

**1回の処理あたりの目安**:

- 小規模Issue処理（記事生成、ラベル付け、シンプルなPRコメント）でSonnet使用: **$0.05〜$0.30**
- リポジトリ全体を読んでバグ修正PR作成、Opus使用: **$0.50〜$3**
- 暴走時（ループ、`--max-turns`未設定）: **数十ドル〜数百ドル**

#### GitHub Actions実行時間

GitHub-hosted runnerの使用分。Publicリポジトリは無料、Privateは月2,000分の無料枠あり（Freeプラン）。Claude Code Action 1回の実行は数分程度なので、Publicでは事実上0円、Privateでも個人利用なら無料枠で収まることが多い。

### 8.2 重要: Claude Pro/Maxサブスクリプションは適用されない

これは2026年4月のポリシー変更で確定した点。

**Anthropicは2026年4月4日に**、Claudeのサブスクリプションプラン（Pro $20/月、Max $100〜$200/月など）は**「公式ツール」のみ**で利用可能とすると発表した。公式ツールとは:

- Claude Code CLI
- claude.ai（チャットUI）
- Claude Desktop
- Claude Cowork

これら以外、つまり**サードパーティ製ツールやAPIキーを使う任意のプログラム**はサブスクリプション枠の対象外となり、API従量課金になる。

GitHub Actions経由でClaude Code Actionを実行する場合、これは「APIキーを使うプログラム」に該当するため、**Pro/Maxプランに加入していてもこの分は別途請求される**。

### 8.3 暴走による高額請求のリスク

API従量課金は青天井であるため、設定ミスや制御不足で高額請求が発生する事故報告が複数ある。代表事例:

- Claude Max（$200/月）の加入者が、サブスクと混同したまま`claude -p`を`cron`で実行する仕組みを構築 → 2日間で**$1,800超**の請求（2026年3月）
- 本人はMax加入でカバーされていると誤認していたが、`-p`フラグやAPIキー経由はAPI課金扱いだった

### 8.4 必須の安全策

経路Cを採用する場合、次の対策を**設定前に**実施することを強く推奨。

#### Anthropic Consoleで支出上限を設定

1. `https://console.anthropic.com/`にログイン
2. Settings → Limits → Workspace spend limit
3. 月額上限を設定（個人利用なら$10など、保守的に）

これにより上限到達時点でAPI呼び出しが自動的に停止し、青天井の請求を防げる。

#### ワークフロー側での制御

`.github/workflows/claude.yml`で次の制限を入れる。

```yaml
- uses: anthropics/claude-code-action@v1
  with:
    anthropic_api_key: ${{ secrets.ANTHROPIC_API_KEY }}
    claude_args: |
      --model claude-sonnet-4-6
      --max-turns 5
  timeout-minutes: 10
```

- **`--model claude-sonnet-4-6`**: Opusより約5倍安い。記事生成や軽量タスクには十分
- **`--max-turns 5`**: 1回の実行での最大ターン数。ループ防止
- **`timeout-minutes: 10`**: GitHub Actions側のタイムアウト

#### トリガー条件を絞る

`@claude`メンションすべてに反応させると意図しない実行が発生しやすいので、特定ラベルが付いたIssueだけ、特定ユーザーからのメンションだけ、などに絞る。

```yaml
on:
  issue_comment:
    types: [created]

jobs:
  claude:
    if: |
      contains(github.event.comment.body, '@claude') &&
      github.event.comment.user.login == 'OWNER_USERNAME'
    runs-on: ubuntu-latest
```

---

## 9. ワークフロー判断のフローチャート

「どのパターン/経路を使うべきか」を整理する。

```
┌─────────────────────────────────────────────────────────┐
│ 何をしたい?                                              │
└─────────────────────────────────────────────────────────┘
            │
            ├─ 社内ツール/localhostに繋ぎたい
            │     → パターン2（Claude Code CLI）一択
            │
            ├─ クラウドSaaS（Notion/Slack/GitHub等）と連携
            │     │
            │     ├─ 参照だけでよい
            │     │     → パターン1（claude.ai）+ 純正コネクタ
            │     │       （GitHubなら経路A）
            │     │
            │     └─ 書き込みも必要
            │           │
            │           ├─ 対話的にClaudeと相談しながら書きたい
            │           │     │
            │           │     ├─ Copilot契約済み → パターン1 + 経路B
            │           │     ├─ Copilot未契約・PAT使いたい → パターン2 + PAT
            │           │     └─ Copilot未契約・OAuth必須 → パターン2が無難
            │           │
            │           └─ 自動化された定期処理にしたい
            │                 → 経路C（GitHub App + Actions）
            │                   ※API課金注意・spend limit必須
            │
            └─ 隔離環境で安全に試したい新規MCP
                  → パターン3（Claude Code on the Web）
```

---

## 10. セキュリティ・運用上の留意事項

### 10.1 信頼境界の整理

各パターンで「どこまでが信頼できるゾーンか」を意識することが重要。

- **パターン1**: ユーザーのブラウザ／Anthropicクラウド／MCPサーバーが3つの異なる信頼境界。プロンプトインジェクションはAnthropic側で一定の対策（システムプロンプトの保護等）があるが、MCPサーバーが返す内容を信頼しすぎないことが重要
- **パターン2**: ユーザー端末が一つの信頼境界。`stdio` MCPは端末と同じ信頼レベル。**信頼できないコミュニティ製MCPサーバーは絶対にローカル端末で動かさない**こと。試すなら専用VM/Docker
- **パターン3**: サンドボックスと認証プロキシの二重隔離。最も強い分離だが、サンドボックス内に渡したデータ（例: 秘密のドキュメントを含むリポジトリ）はLLMの処理対象になる

### 10.2 シークレット管理の原則

| パターン | シークレットの置き場所 | 留意点 |
|---|---|---|
| 1 | Claudeアカウント（Anthropic） | サブミット時に外部送信される。Anthropicのセキュリティモデルを信頼する前提 |
| 2 | ローカル端末（`~/.claude.json`等） | OSレベルのアクセス制御（ファイル権限600）を徹底。Gitにコミットしないこと |
| 3 | サンドボックス外プロキシ | Anthropic側で管理。git認証以外のシークレット（DBパスワード等）はMCPサーバー側の認証で持たせる設計に |

### 10.3 監査ログ

- **パターン1**: claude.aiの活動ログをAnthropicコンソールから確認可能（Team/Enterpriseプラン）
- **パターン2**: ローカル`~/.claude/logs/`等に出力。自分で監視・収集が必要
- **パターン3**: ジョブ単位のログが残る。長期保存は別途必要
- **経路C（GitHub Actions）**: GitHub Actionsのログ。90日で自動削除されるので必要ならアーティファクト保管

---

## 11. トラブルシュート逆引き

### 11.1 「カスタムコネクタ追加UIにAuthorizationヘッダーの欄がない」

**原因**: claude.aiのリモートコネクタはOAuth 2.1前提で、PAT（Bearerトークン）を直接渡すUIを提供していない。

**対応**: OAuthエンドポイントを持つMCPサーバーを使うか、パターン2（CLI）に切り替える。

### 11.2 「`Resource not accessible by integration` 403が出る」

**原因**: GitHub Appのトークンに必要な権限がない。Claudeのツール許可とは別レイヤーの問題。

**対応**:

1. `https://github.com/settings/installations`（個人）または `https://github.com/orgs/<ORG>/settings/installations`（Org）を開く
2. 該当AppのConfigureを開きRepository accessとPermissionsを確認
3. `Read and write`になっていなければ修正（App側の固定権限なら別Appを使う）
4. 書き込み専用のAnthropic純正`Claude` Appを別途インストール（経路C）を検討

### 11.3 「`@claude`メンションしたのに反応しない」

**原因**: リポジトリにClaude Code Actionのワークフローファイルがない、または`ANTHROPIC_API_KEY`が未設定。

**対応**:

1. `.github/workflows/claude.yml`を作成（公式テンプレートあり）
2. Repository Secretsに`ANTHROPIC_API_KEY`を追加
3. ワークフロー初回実行時はAnthropic Consoleでspend limitを必ず設定

### 11.4 「社内MCPサーバーに接続できない」

**原因**: パターン1と3はAnthropic側からの接続なので、社内LAN/VPN内のサーバーには到達不可。

**対応**: パターン2（CLI）に切り替える。どうしてもパターン1を使いたい場合、社内MCPサーバーをCloudflare Tunnel/ngrok等で公開し、認証を強化（mTLS、IP制限）する。ただしセキュリティ設計が複雑化する。

### 11.5 「Claude Code ActionのAPI請求が想定より高い」

**原因**: モデルがOpus、`--max-turns`未設定、ループしているなど。

**対応**:

- Anthropic ConsoleのUsageで消費トークンを確認
- ワークフローをSonnet 4.6に変更
- `--max-turns 5`を追加
- 必要なら`--model claude-haiku-4-5-20251001`に変更（さらに安価）
- spend limitを強めに設定

---

## 12. まとめ

### 12.1 一文で言うと

**MCPは同じ仕様でも、「どのClaudeクライアントから繋ぐか」で接続元・認証・ネットワーク到達性・課金モデルがすべて変わる**。これを意識せずに設計すると、社内ツールに繋がらない・書き込み権限が動かない・予想外のAPI請求が発生する。

### 12.2 設計時のチェックリスト

新規にMCP連携を組む際は、次を確認してから着手すること。

- 接続したいリソースは社内ネットワーク内か、パブリックか?
- `stdio`ローカルMCPが必要か、リモートHTTP MCPで済むか?
- 認証はOAuth、PAT、その他のどれを使うか?（claude.ai UIで設定可能か）
- 書き込み権限が必要か、参照のみで足りるか?
- 対話的な利用か、自動化された定期実行か?
- サブスクリプション内で済むか、API従量課金になるか?
- （API課金の場合）spend limitを設定したか? `--max-turns`を入れたか?
- シークレットの保管場所は許容できる場所か（Anthropic側／ローカル／プロキシ）?
- プロンプトインジェクション対策は十分か?

### 12.3 今後のアップデート余地

本記事は2026年4月時点の情報をベース。次の領域は変更が予想される。

- claude.aiのカスタムコネクタがPAT/Bearer認証をサポートする可能性
- Claude Code on the WebのVPN/プライベートネットワーク対応
- AnthropicのサブスクリプションとGitHub Actions連携の課金モデル変更
- MCPプロトコル自体の認証拡張（mTLS等）

---

## 参考資料

### 公式ドキュメント

- [Connect to remote MCP Servers — Model Context Protocol](https://modelcontextprotocol.io/docs/develop/connect-remote-servers)
- [Connect Claude Code to tools via MCP — Claude Code Docs](https://code.claude.com/docs/en/mcp)
- [Get started with custom connectors using remote MCP — Claude Help Center](https://support.claude.com/en/articles/11175166-get-started-with-custom-connectors-using-remote-mcp)
- [Use Claude Code on the web — Claude Code Docs](https://code.claude.com/docs/en/claude-code-on-the-web)
- [Making Claude Code more secure and autonomous — Anthropic Engineering](https://www.anthropic.com/engineering/claude-code-sandboxing)
- [Claude Code GitHub Actions — Claude Code Docs](https://code.claude.com/docs/en/github-actions)
- [anthropics/claude-code-action — GitHub](https://github.com/anthropics/claude-code-action)

### 料金・契約関連

- [Anthropic API Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [Claude Plans & Pricing](https://claude.com/pricing)

### GitHub MCP関連

- [About the GitHub MCP Server — GitHub Docs](https://docs.github.com/en/copilot/how-tos/provide-context/use-mcp/use-the-github-mcp-server)
- [github/github-mcp-server — Policies and Governance](https://github.com/github/github-mcp-server/blob/main/docs/policies-and-governance.md)

---

*本記事は2026年4月時点の挙動・料金・ポリシーに基づいています。AnthropicおよびGitHubのポリシーは予告なく変更される可能性があります。最新情報は各公式ドキュメントを参照してください。*
