---
title: "Agent Teams 大改訂 — Claudeの『エージェント』の全体像と、v2.1.178で何が変わったか"
date: 2026-06-20
category: "Claude技術解説"
tags: ["Claude Code", "Agent Teams", "サブエージェント", "マルチエージェント", "v2.1.178", "TeamCreate", "Dynamic Workflows", "Managed Agents"]
excerpt: "Claude Code v2.1.178（2026-06-15 PT）で Agent Teams の内部モデルが大きく改訂された。TeamCreate / TeamDelete ツールが廃止され、CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 を立てると各セッションが最初から『暗黙の1チーム』を持ち、Agent ツールの name パラメータでチームメイトを直接スポーンする方式へ。本記事ではまず Claude の『エージェント』にどんな種類があるか（サブエージェント / Agent Teams / Dynamic Workflows / Managed Agents / Agent View）を体系的に整理し、そのうえで今回の改訂内容を CHANGELOG 原文つきで詳述、さらに改訂の背景を（公式見解がないため）推定として考察する。"
draft: false
---

> ## 要点
>
> - **Claude Code v2.1.178（2026-06-15 PT）** で **Agent Teams の内部モデルが大改訂**された。
> - **`TeamCreate` / `TeamDelete` ツールが廃止**。`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` を立てると **各セッションが最初から「暗黙の1チーム」を持つ**モデルになり、**事前のチーム作成ステップが不要**に。
> - チームメイトは **`Agent` ツールの `name` パラメータ**で直接スポーンする。`team_name` パラメータは**受け付けるが無視**される（後方互換のための残置）。
> - あわせて権限ルールに **`Tool(param:value)` 構文**が追加。`Agent(model:opus)` のように**ツールの入力パラメータ単位でブロック**できる。
> - 一方で、自然言語での「チームを作って」「クリーンアップして」という指示は**引き続き有効**（Claude が内部で `Agent(name:...)` を発行）。**ユーザーの操作感はほぼ変わらない**。
> - 本記事は前半で **Claude の「エージェント」5系統**（サブエージェント / Agent Teams / Dynamic Workflows / Managed Agents / Agent View）を整理し、後半で**改訂内容と背景の推定**を扱う。

## はじめに — なぜ「種類の整理」から始めるのか

Claude を使っていると「エージェント」という言葉が**複数の異なる意味**で出てきます。サブエージェント、Agent Teams（チームメイト）、Dynamic Workflows のファンアウト、クラウドの Managed Agents、そして `claude agents` で開く Agent View……。これらは**実行レイヤーも対象ユーザーも別物**で、混同すると今回の v2.1.178 の改訂が「どの層の話なのか」を見失います。

今回 v2.1.178 で改訂されたのは、このうち **Agent Teams（Claude Code 内のローカル・マルチエージェント機能）の起動モデル**です。改訂内容を正しく理解するために、まず**全体の地図**を描きます。

> **関連**: Agent Teams の有効化・表示モード・チーム管理の実務手順は [【必読】Claude マルチエージェントの初期設定](/mdTechKnowledge/blog/claude-agent-teams-setup/) を、サブエージェントの権限差（Explore が read-only な理由）は [Claude Code サブエージェントの歩き方](/mdTechKnowledge/blog/claude-code-subagent-readonly-switch/) を参照してください。本記事はそれらを束ねる「種類の地図＋今回の改訂」に焦点を当てます。

---

## Claude の「エージェント」5系統 — 全体マップ

「エージェント」と呼ばれるものは、大きく **5系統**に整理できます。

| 系統 | どこで動くか | 何をするか | 主な対象 | 起動方法 |
|---|---|---|---|---|
| **① サブエージェント** | ローカル（Claude Code 内） | メインが**単一の作業者**にタスクを委任し、**結果だけ**受け取る | 開発者個人 | `Agent` ツール（`subagent_type` でタイプ指定） |
| **② Agent Teams** | ローカル / tmux | 複数の Claude Code インスタンスを**チームとして協調**（メンバー同士が双方向通信） | 開発者個人・小規模チーム | `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` ＋ `Agent(name:...)` |
| **③ Dynamic Workflows** | ローカル（Claude Code 内） | スクリプトで**多数のサブエージェントを決定論的にファンアウト**（最大16並列・累計1,000体） | 大規模な並列処理を回す開発者 | `Workflow` ツール（JS スクリプト） |
| **④ Managed Agents** | Anthropic クラウド | エージェントを**本番運用**するフルマネージド API（サンドボックス・永続化・RBAC） | 組織・プロダクトチーム | API / Console（**別製品**） |
| **⑤ Agent View** | ローカル（横断 UI） | Agent Teams や `claude --bg` の**バックグラウンドセッションを一覧管理** | 並列タスクを束ねる開発者 | `claude agents` ／ セッション内で **←キー** |

ポイントは次の対比です。

- **①②③⑤ はすべて Claude Code（ローカル）の機能**。④ Managed Agents だけが**クラウドの別製品**です。
- **① サブエージェント = 縦の委任（結果を返すだけ）**、**② Agent Teams = 横の協調（互いに通信）**、**③ Dynamic Workflows = 大量の並列ファンアウト（決定論的な制御フロー）**。同じ「複数エージェント」でも軸が違います。
- **⑤ Agent View は実行機構ではなく「管理ビュー」**。動いているセッションを横断して眺めるための UI です。

### ① サブエージェントの「タイプ」

サブエージェント（①）には**タイプ**があり、タイプごとに使えるツール権限が異なります。Claude Code 標準の主要タイプは以下です。

| タイプ | 主な用途 | 書き込み系（Edit/Write） | モデル傾向 |
|---|---|:---:|---|
| **Explore** | 高速な読み取り専用検索（ファイル探索・grep・WebFetch） | ❌（read-only） | 軽量寄り |
| **Plan** | 実装プラン作成・アーキテクチャ検討 | ❌（read-only） | — |
| **general-purpose** | 汎用・多段階タスク全般 | ✅ | — |
| **statusline-setup** | ステータスライン設定の編集 | ✅（Read/Edit のみ） | — |
| **claude-code-guide** | Claude Code / SDK / API に関する質問回答 | ❌（調査系のみ） | 軽量寄り |
| **（タイプ未指定）** | 何でも | ✅ | 汎用のキャッチオールに解決 |

> **補足**: `name` も `subagent_type` も指定せずに委任した場合は、汎用のキャッチオール（実質 general-purpose 相当）に解決されます。「Explore は read-only でした。general-purpose に切り替えて再起動します」という挙動は、この**タイプ間の権限差**による正常な軌道修正です（詳細は[サブエージェントの歩き方](/mdTechKnowledge/blog/claude-code-subagent-readonly-switch/)）。
>
> なお **v2.1.172** で「**サブエージェントが自身のサブエージェントを生成可能（最大5階層）**」になりました。これは①サブエージェントの入れ子（縦の深さ）の話で、③ Dynamic Workflows の「最大1,000並列」（横の広さ）とは**別の軸**です。

---

## 今回の改訂内容 — v2.1.178（2026-06-15 PT）

ここからが本題です。v2.1.178 で **② Agent Teams の起動モデル**が改訂されました。公式 CHANGELOG の原文は次のとおりです。

> **Agent teams: removed the `TeamCreate` and `TeamDelete` tools.** With `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` set, every session now has one implicit team — spawn teammates directly with the Agent tool's `name` parameter, no setup step needed. **The `team_name` parameter on the Agent tool is still accepted but ignored.**
>
> — [Claude Code CHANGELOG v2.1.178](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)

### 変更点① TeamCreate / TeamDelete ツールの廃止

これまで Agent Teams は、**明示的なライフサイクル**を持っていました。

```
【改訂前（〜v2.1.177）】
1. TeamCreate でチームを作成   ← 専用ツール
2. Agent でチームメイトをスポーン
3. メンバー同士が協調作業
4. TeamDelete でチームを解散    ← 専用ツール
```

v2.1.178 では、この **TeamCreate / TeamDelete の2ツールが削除**されました。代わりに「**1セッション = 暗黙の1チーム**」というモデルになり、`CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` を立てた瞬間に、**そのセッションは最初から空のチームを1つ持っている**状態になります。

```
【改訂後（v2.1.178〜）】
0. CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1（環境変数）
   → セッション起動と同時に「暗黙の1チーム」が存在
1. Agent(name: "security-reviewer") でチームメイトを直接スポーン
   ← 作成ステップ不要。name を付けるだけ
2. メンバー同士が協調作業
3. 各チームメイトのシャットダウン／セッション終了でチームも消滅
   ← TeamDelete は不要
```

### 変更点② `name` パラメータでチームメイトを直接スポーン

改訂の核心は、**チームメイトの作り方が `Agent` ツールの `name` パラメータに一本化**された点です。

- **`subagent_type` だけ**を指定 → 従来どおりの**サブエージェント**（結果を返すだけ、①）。
- **`name` を指定** → **チームメイト**（独立セッション・双方向通信、②）。

つまり**同じ `Agent` ツールが、`name` の有無でサブエージェントとチームメイトを切り替える**設計に整理されました。チームの「箱」を先に作る必要がなくなり、**メンバーを名指しでスポーンした時点でチームに加わる**という、より素直なモデルです。

### 変更点③ `team_name` パラメータは「受理するが無視」

後方互換のため、`Agent` ツールの **`team_name` パラメータは引き続き受け付けられますが、内部的には無視**されます。1セッション＝1暗黙チームなので、チームを名前で区別する必要がなくなったためです。古いスクリプトやプロンプトが `team_name` を渡してもエラーにはならず、単に無視されます。

### 変更点④ 権限ルールに `Tool(param:value)` 構文（同 v2.1.178）

同じ v2.1.178 で、**権限ルールにツールの入力パラメータをマッチさせる構文**が追加されました。

> Added `Tool(param:value)` syntax for permission rules to match a tool's input parameters (with `*` wildcard), e.g. `Agent(model:opus)` to block Opus subagents
>
> — [CHANGELOG v2.1.178](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)

これは Agent Teams の改訂と直接の依存関係はありませんが、**エージェント運用の統制**という意味で関連します。例えば次のような制御が可能です。

| ルール例 | 効果 |
|---|---|
| `Agent(model:opus)` | **Opus** のサブエージェント／チームメイト起動をブロック（コスト上限対策） |
| `Agent(model:*)` | モデル指定付きの `Agent` 呼び出し全般にマッチ（`*` ワイルドカード） |

`name` 一本化でチームメイトのスポーンが手軽になった分、**「どんなエージェントを起動してよいか」をパラメータ単位で縛れる**手段が同時に用意された、という対の関係で捉えると分かりやすいです。

### 変わらない点（重要）

操作する側の体感は、実はほとんど変わりません。

| 観点 | 改訂前 | 改訂後（v2.1.178〜） |
|---|---|---|
| 自然言語で「PRをレビューするチームを作って」 | ✅ 有効 | ✅ **引き続き有効**（内部で `Agent(name:...)` を発行） |
| 自然言語で「チームをクリーンアップして」 | ✅（内部で TeamDelete） | ✅ **引き続き有効**（各メイトのシャットダウン＋セッション終了で消滅） |
| 有効化フラグ | `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` | **同じ** |
| 表示モード（in-process / split-panes） | あり | **同じ** |
| チームメイト同士の双方向通信・共有タスクリスト | あり | **同じ** |

**変わったのは「内部の起動モデルと、ツール／パラメータの形」**であり、**自然言語での使い勝手は維持**されています。既存の運用手順（[初期設定記事](/mdTechKnowledge/blog/claude-agent-teams-setup/)）はそのまま通用します。

---

## 改訂の背景（推定）

> ⚠️ **本セクションは推定です。** Anthropic は v2.1.178 の Agent Teams 改訂について、CHANGELOG の事実記載以上の公式な理由を示していません。以下は CHANGELOG の文面・周辺のリリース傾向・既知の使い勝手の課題から導いた**考察**であり、断定ではありません。

CHANGELOG の文言（"no setup step needed"）と、最近の Claude Code のリリース傾向を踏まえると、改訂の動機は次の3点に集約できそうです。

### 推定① ツール数とAPIサーフェスの削減

サブエージェント・チームメイト・ワークフローと、エージェント関連の機能が増えるほど、**モデルが扱うツール定義（ツールスキーマ）の総量**が膨らみます。`TeamCreate` / `TeamDelete` という**ライフサイクル専用ツールを2つ削り**、チームメイト生成を既存の `Agent` ツールへ吸収すれば、

- モデルが覚える**ツールの数が減る**（プロンプト上のツール定義トークンも減る）
- 「サブエージェントとチームメイトで別のツールを使い分ける」**認知負荷が減る**

という効果が見込めます。`Agent` ツールに `name` を足すだけでチームメイトになる、という整理は**最小の API サーフェスで最大の機能**を狙ったように見えます。

### 推定② 「箱を作ってから入れる」2段階の無駄を解消

改訂前は「① チームを作る → ② メンバーを入れる」という2段階が必要でした。しかし**1セッションで同時に複数チームは管理できない**（ネスト不可・1セッション1チーム）という制限がもともとあったため、**チームの「箱」を明示的に作る意味が薄い**。それなら最初から暗黙のチームを1つ持たせ、**メンバーを名指しした時点でチームが立ち上がる**方が素直です。"every session now has one implicit team" という表現は、この**冗長な1ステップの除去**を意図したものと読めます。

### 推定③ ライフサイクル不整合の温床を断つ

旧モデルでは「**解散は必ずリーダーから**」「チームメイトからの `TeamDelete` はリソース不整合を起こしうる」という注意書きが必要でした。つまり `TeamDelete` は**誤用すると状態が壊れる**ツールでした。暗黙チーム＋「セッション終了で自動消滅」にすれば、**明示的な解散ツールに伴う不整合リスクそのものを設計から取り除ける**。安全性・堅牢性の観点からの簡素化、という推定です。

### 傍証 — 実験的機能ゆえの素早い作り替え

Agent Teams は一貫して **`CLAUDE_CODE_EXPERIMENTAL_*` フラグ配下の実験的機能**です（v2.1.32 で登場）。実験的機能は**後方互換を厳密に保つ制約が緩く、内部モデルを大胆に作り替えやすい**。実際、`team_name` を「受理するが無視」とする処理は、**破壊的変更の角を取りつつ素早く新モデルへ移行する**ための典型的な緩衝策です。これらは「Anthropic が Agent 系のAPIを継続的に整理・統合している」という最近の流れ（`Task` → `Agent` への改称〔v2.1.63〕、サブエージェントの入れ子解禁〔v2.1.172〕、auto モードでの起動前評価〔v2.1.178〕など）とも整合します。

> **要するに（推定の総括）**: 今回の改訂は新機能の追加ではなく、**「エージェント生成の入口を `Agent` ツールに統一し、専用ライフサイクルツールと冗長なステップ・不整合リスクを削る」整理整頓**だと考えるのが自然です。ユーザー体験を変えずに内部を簡素化する、という方向性です。

---

## 実務への影響と移行

ほとんどのユーザーにとって、**特別な移行作業は不要**です。影響を受けるのは「ツールを明示的に呼んでいた」ケースだけです。

| あなたの使い方 | 影響 | 対応 |
|---|---|---|
| 自然言語で「チームを作って／解散して」と指示している | **影響なし** | そのままでOK（内部で新モデルに自動追従） |
| `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` を設定済み | **影響なし** | フラグは同じ。設定変更不要 |
| スクリプト等で `TeamCreate` / `TeamDelete` を**直接**呼んでいた | **要修正** | チーム作成は不要に。チームメイトは `Agent(name:...)` でスポーン |
| `Agent` 呼び出しで `team_name` を渡していた | **無害だが無意味** | 渡してもエラーにならず無視される。削っても挙動は同じ |
| サブエージェント（結果を返すだけ）を使っている | **影響なし** | `name` を付けなければ従来どおりサブエージェント |

あわせて、`Tool(param:value)` 構文が使えるようになったので、**チームメイト／サブエージェントの起動をコストやモデル単位で縛りたい**場合は、`settings.json` の権限ルールに `Agent(model:opus)` のようなルールを追加して、想定外の高コストエージェントの自動起動を防げます。

---

## まとめ

- v2.1.178 の **Agent Teams 大改訂**は、**TeamCreate / TeamDelete を廃止**し、**1セッション = 暗黙の1チーム**＋**`Agent(name:...)` で直接スポーン**へ統合した変更。
- チームメイト生成の入口が **`Agent` ツールに一本化**され、`team_name` は**受理するが無視**（後方互換）。
- 同 v2.1.178 で **`Tool(param:value)` 権限構文**（例 `Agent(model:opus)`）が追加され、エージェント起動をパラメータ単位で統制可能に。
- **自然言語での操作感は不変**。多くのユーザーに移行作業は不要で、影響を受けるのは TeamCreate/TeamDelete を直接呼んでいたスクリプトのみ。
- 改訂の背景は公式に明示されていないが、**ツール削減・冗長ステップの除去・ライフサイクル不整合リスクの排除**という「整理整頓」と推定するのが自然。
- 前提として、Claude の「エージェント」は **①サブエージェント／②Agent Teams／③Dynamic Workflows／④Managed Agents（クラウド別製品）／⑤Agent View** の5系統。今回変わったのは **② のローカル起動モデル**だけ。

---

## 関連記事

- [【必読】Claude マルチエージェントの初期設定](/mdTechKnowledge/blog/claude-agent-teams-setup/) — Agent Teams の有効化・表示モード（in-process / split-panes）・チーム管理の実務手順。v2.1.178 の追記済み
- [Claude Code サブエージェントの歩き方](/mdTechKnowledge/blog/claude-code-subagent-readonly-switch/) — ①サブエージェントのタイプと権限差（Explore が read-only な理由・general-purpose 切替）
- [Claude Code Dynamic Workflows 入門](/mdTechKnowledge/blog/claude-code-dynamic-workflows-guide/) — ③決定論的な大規模ファンアウト（最大16並列・累計1,000体）
- [Claude Managed Agents 簡易ガイド](/mdTechKnowledge/blog/claude-managed-agents-guide/) — ④クラウド側の本番エージェント運用基盤（別製品）
- [Claude Code バージョン履歴まとめ](/mdTechKnowledge/blog/claude-code-version-history/) — v2.1.178 を含む各バージョンの変更点一覧

---

## 出典

- [Claude Code CHANGELOG（GitHub・一次ソース）](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md) — v2.1.178 の Agent teams / `Tool(param:value)` 記載
- [Anthropic公式: Agent Teams ドキュメント](https://code.claude.com/docs/en/agent-teams)
- [Anthropic公式: サブエージェント](https://code.claude.com/docs/en/sub-agents)
- [Anthropic公式: Agent View（Research Preview）](https://code.claude.com/docs/en/agent-view)
- [Anthropic公式: Managed Agents Overview](https://platform.claude.com/docs/en/managed-agents/overview)
