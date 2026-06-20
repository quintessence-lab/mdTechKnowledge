---
title: "Dynamic Workflows を起点に理解する Claude のマルチエージェント4系統 — Agent View・Managed Agents・Agent Teams との比較と使い分け"
date: 2026-05-31
updatedDate: 2026-06-20
category: "Claude技術解説"
tags: ["Claude Code", "Dynamic Workflows", "Agent View", "Managed Agents", "Agent Teams", "マルチエージェント", "オーケストレーション", "Research Preview"]
excerpt: "Claude の「マルチエージェント」は Dynamic Workflows（実行エンジン）・Agent View（管理UI）・Managed Agents（クラウド基盤）・Agent Teams（対等な独立セッション協働）の4系統が混同されがち。Dynamic Workflows を起点に四者の役割・動く場所・確認コマンドを比較し、使い分けの判断軸を示す。後半に Agent View の起動・ステータス・キーバインド・自動化の詳細リファレンスを補足。"
draft: false
---

**最終更新**: 2026-06-20
**対象**: Claude Code **v2.1.139 以降**（Pro / Max / Team / Enterprise / API）
**ステータス**: Dynamic Workflows・Agent View は Research Preview、Agent Teams は実験的機能（いずれも UI・挙動は変更され得ます）

---

## はじめに — Claude の「マルチエージェント」は4系統ある

> **🔗 関連記事との「系統数」の違い**：本記事は**マルチエージェントを動かす"機構"の4系統**（Dynamic Workflows / Agent View / Managed Agents / Agent Teams）に絞ります。**サブエージェント単体**を1系統として加えた**エージェント全般の5系統**の整理は [Agent Teams 大改訂 — Claude の『エージェント』5系統の全体マップ](/mdTechKnowledge/blog/claude-agent-teams-overhaul/) を参照してください。観点が違うだけで内容は矛盾しません（本記事ではサブエージェントを「Dynamic Workflows が動かす実体」として扱うため独立系統に数えていません）。

2026年、Claude Code は立て続けに「複数のエージェントを扱う」機能を増やし、**マルチエージェント開発プラットフォーム**へと舵を切りました。ところが、これらは名前が似ているだけで**役割もレイヤーも異なる4系統**であり、混同されがちです。

| 系統 | 一言でいうと | レイヤー |
|:---|:---|:---|
| **Dynamic Workflows** | 1タスクを最大1000サブエージェントに**ファンアウトする実行エンジン** | ローカル（セッション内ランタイム） |
| **Agent View** | 複数セッションを1画面で**束ねて見る管理UI** | ローカル（CLI ダッシュボード） |
| **Managed Agents** | エージェントを**クラウドで代行実行する hosted 基盤** | クラウド（or self-hosted sandbox） |
| **Agent Teams** | 対等な独立セッション同士が**双方向通信して協働するチーム** | ローカル（複数セッション） |

本記事は **Dynamic Workflows を起点**に、Agent View・Managed Agents・Agent Teams との違いと関係を整理し、「どれをいつ使うか」の判断軸を示します。後半（補足）に、独立した解説記事を持たない **Agent View の機能詳細リファレンス**をまとめます（Agent Teams と Dynamic Workflows の1対1の深掘りは [専用記事](/mdTechKnowledge/blog/agent-teams-vs-dynamic-workflows/) を参照）。

> 本記事は2026年5月時点の公式ドキュメント・公式ブログ・公式 CHANGELOG に基づきます。Dynamic Workflows・Agent View はともに Research Preview で、UI・挙動・バージョン番号は変更され得ます。Managed Agents との統合可否など公式に明示のない点は推測として明記します。

---

## 1. 起点: Dynamic Workflows とは（実行エンジン）

**Dynamic Workflows** は、プロンプトに `workflow` と含めると Claude が **JavaScript スクリプトを自動生成**し、そのスクリプトが**多数のサブエージェントを大規模オーケストレーション**する実行エンジンです（Claude Code v2.1.154、Research Preview）。

- **規模**: 1実行あたり**最大1000サブエージェント**、**同時実行は最大16**（CPUが少ないとより少ない）。
- **実行モデル**: 会話とは隔離した環境でスクリプトが走り、中間結果はスクリプト変数に保持。Claude のコンテキストには**最終回答のみ**返る。
- **権限**: サブエージェントは常に **acceptEdits** モードで動き、ユーザーのツール許可リストを継承（ファイル編集は自動承認）。
- **進捗確認**: **`/workflows`**（フェーズ別のエージェント数・トークン量・経過時間、`p` 一時停止 / `x` 停止 / `s` スクリプト保存）。
- **提供**: 全有料プラン＋API＋Bedrock＋Vertex AI＋Microsoft Foundry（Pro は `/config` でオン）。

つまり Dynamic Workflows は **「1つの重いタスクを、Claude が自分で書いたコードで並列に解き切る」** 仕組みです。内部構造・コスト・パターンの深掘りは [Claude Code Dynamic Workflows 完全ガイド](/mdTechKnowledge/blog/claude-code-dynamic-workflows-guide/) を参照してください。

---

## 2. 4系統 全体比較マップ

Dynamic Workflows を中心に、4系統を一望します。**これが本記事の核心の表**です。

| 観点 | **Dynamic Workflows** | **Agent View** | **Managed Agents** | **Agent Teams** |
|:---|:---|:---|:---|:---|
| 役割 | 実行エンジン（1タスクを並列化） | 管理UI（複数セッションを俯瞰） | クラウド実行基盤（hosted） | 協働チーム（対等な独立セッション） |
| 動く場所 | ローカル（セッション内ランタイム） | ローカル（自分のマシン） | クラウド or self-hosted sandbox | ローカル（複数セッション） |
| 調整の主体 | Claude が書く JS スクリプト | ユーザーが手動で覗く・返す | Anthropic の harness | 各エージェントが自律対話（双方向DM） |
| 起動 | プロンプトに `workflow` | `claude agents` / 空プロンプト `←` | API（beta ヘッダ） | チームを起動（実験的機能・環境変数で有効化） |
| 確認コマンド | `/workflows` | `claude agents` | （API レスポンス/イベントログ） | 共有タスクリスト・DM |
| 規模 | 1実行最大1000・同時16 | — | — | 少数（リーダー＋数体） |
| 永続性 | 同一セッション内のみ再開可 | `~/.claude/jobs`（ローカル） | サーバー側イベントログ | セッションとして残り続ける |
| 必要条件 | v2.1.154 | v2.1.139 | `managed-agents-2026-04-01` | 実験的機能（環境変数で有効化） |
| 深掘り記事 | [DW 完全ガイド](/mdTechKnowledge/blog/claude-code-dynamic-workflows-guide/) | 本記事（後半 補足） | [Managed Agents ガイド](/mdTechKnowledge/blog/claude-managed-agents-guide/) | [Agent Teams vs DW](/mdTechKnowledge/blog/agent-teams-vs-dynamic-workflows/) |

以降、ペアごとに違いを掘り下げます。

---

## 3. Dynamic Workflows × Agent View — 実行エンジン vs 管理UI

最も混同されやすいペアです。どちらも「複数エージェント」に関わりますが、**実行する側**と**見る側**で役割が正反対です。

| 観点 | Dynamic Workflows | Agent View |
|:---|:---|:---|
| 本質 | **タスクを並列実行**する | セッションを**束ねて見る** |
| 単位 | フェーズ・サブエージェント | セッション |
| 駆動 | Claude 生成スクリプト（自動） | ユーザー操作（手動） |
| 確認 | `/workflows` | `claude agents` |
| 規模上限 | 1実行1000・同時16 | なし（見るだけ） |

### 相互作用

バックグラウンドセッションの中で Dynamic Workflow が走ると、Agent View 上はそのセッションが **Working** として表示されます（フェーズの詳細ではなく、セッション状態として）。**フェーズ・サブエージェントの詳細を見るのは `/workflows` の役割**です。

また、進行中の作業（サブエージェント／Dynamic Workflow／バックグラウンドシェル）があるセッションで `←` による背景化を試みると **「Cannot open agents — N background task(s) running」** が出て、`/tasks` で確認・`/bg` で破棄確認が必要になります。

> Agent View の行から Workflow のフェーズ詳細へ直接ドリルダウンできるかは公式に明示がなく、現状はセッション状態としてのみ可視と考えるのが安全です（統合度合いは未確定）。

→ **Dynamic Workflows は「1つの作業を並列に解く」、Agent View は「複数の作業を俯瞰する」**。レイヤーが異なり競合しません。

---

## 4. Dynamic Workflows × Managed Agents — ローカル自動実行 vs クラウド基盤

どちらも「Claude が多数の処理を自走させる」点で似ますが、**動く場所と永続化のレイヤー**が異なります。

| 観点 | Dynamic Workflows | Managed Agents |
|:---|:---|:---|
| 実行場所 | ローカル（Claude Code セッション内） | Anthropic クラウド（or self-hosted） |
| 起動 | プロンプトに `workflow` | API（`managed-agents-2026-04-01`） |
| 状態保持 | スクリプト変数（セッション内） | サーバー側イベントログ（永続） |
| 寿命 | Claude Code 終了で次回ゼロから | クラウドで常駐・長期実行 |
| 主用途 | その場の大規模タスクを並列処理 | long-horizon エージェントの常設代行 |

→ **Dynamic Workflows は「手元のセッションで、その場限りの大規模処理」、Managed Agents は「クラウドで、継続的に走らせる業務基盤」**。前者はローカルの瞬発力、後者はクラウドの常駐力です。

---

## 5. Agent View × Managed Agents — ローカル管理UI vs クラウド基盤

| 観点 | Agent View（Claude Code） | Managed Agents（Claude Platform） |
|:---|:---|:---|
| 種別 | ローカルの CLI ダッシュボード | Anthropic 提供の hosted service |
| 実行場所 | 自分のマシン | 管理クラウド or self-hosted sandbox |
| ホスト | per-user supervisor プロセス | Harness（Brain）＋ Sandbox（Hands） |
| 永続化 | `~/.claude/jobs`（ローカル） | サーバー側イベントログ |
| 停止条件 | **マシンのシャットダウンで停止** | クラウドで常駐 |
| ブランド | Claude Code | 別ブランド（「Claude Code」名称は不可） |

Agent View のセッションは公式に **「ローカル（machine 上で動き、シャットダウンで停止）」** と位置づけられ、クラウドで動かしたい場合は別製品 **Claude Code on the web** が案内されます。一方 Managed Agents は **brain（Claude＋harness）と hands（sandbox＋tools）を分離**したクラウド基盤です。

> 「Agent View が Managed Agents のクラウドセッションを一覧表示・操作する」とは考えにくい構図です（「Sessions are local」「model API 以外接続しない」「クラウドは別製品を案内」から別レイヤーと読むのが自然。ただし公式に明確な否定文はなく推測です）。Managed Agents の構成は資料により「Session/Harness/Sandbox の3層」とも「Agent/Environment/Session/Events の4概念」とも説明されます（切り口の違い）。

---

## 6. Agent Teams — 対等な独立セッションの協働チーム

4つ目の系統 **Agent Teams（チームメイト）** は、ここまでの3系統とは毛色が異なります。Dynamic Workflows が「1タスクをサブエージェントに**ファンアウト**する」のに対し、Agent Teams は **複数の対等な独立セッションが双方向に通信して協働する**仕組みです。「エージェントチームを起動して」のように指示すると、リーダー＋数体のチームメイトが立ち上がり、役割分担して進めます（実験的機能・環境変数で有効化）。

### 6-1. Dynamic Workflows との決定的な違い — サブエージェント vs 独立セッション

最も混同されるのがこのペアです。両者の核心は **「動かす実体」** が違う点にあります。

| 観点 | Dynamic Workflows | Agent Teams |
|:---|:---|:---|
| 動かす実体 | **サブエージェント**（親に従属） | **独立セッション**（対等） |
| 通信方向 | 一方向（親が指示→子が結果を返す） | 双方向（DM・共有タスクリスト） |
| 子→親の能動通信 | 原則できない（結果テキストのみ） | できる（報告・問い合わせ） |
| 制御 | コード（JS）で決定論的に fan-out | 各エージェントが自律的に対話 |
| 規模 | 大規模（同時16・総計1000） | 少数（リーダー＋数体） |
| 永続性 | 実行中のみ（終われば消える） | セッションとして残り続ける |

サブエージェントが「親に結果を返したら消える」のに対し、チームメイトは「対等な仲間として生き続け、対話を続ける」——これが両者を分ける核心です。詳細な1対1比較は [Agent Teams と Dynamic Workflows は何が違うのか](/mdTechKnowledge/blog/agent-teams-vs-dynamic-workflows/) を参照してください。

### 6-2. Agent View との違い — 「俯瞰する」か「協働させる」か

Agent Teams も Agent View も「複数のローカルセッション」を扱う点で似ますが、目的が逆です。

- **Agent View** = 既存の複数セッションを**1画面で俯瞰し、手動で覗く・返す管理UI**（セッション同士は無関係でよい）
- **Agent Teams** = 最初から**同じチームとして一緒に立て、メンバー同士が自動で通信し合う**協働の仕組み

つまり Agent View は「バラバラに走るセッションを束ねて見る」ダッシュボード、Agent Teams は「最初からチームとして協働させる」編成です。なお、**後から既存の別セッションにチームとして割り込むことはできません**（Agent Teams は立ち上げ時のメンバー間でのみ通信可能。この「既存別セッションの外部監視は不可」という制約は Dynamic Workflows とも共通です）。

### 6-3. 3つの連携方法

| 連携方法 | 内容 |
|:---|:---|
| **共有タスクリスト** | 全メンバーがタスクの状態（pending / in progress / completed）を共有 |
| **ダイレクトメッセージング** | メンバーが互いに名前を指定してメッセージを送信 |
| **自動配信** | 送信メッセージは相手に自動的に届く（ポーリング不要） |

「リーダーが実行役に定期的な状態報告を求め、チームメイトが報告する」といった**相互監視**が組めるのは、この双方向通信があるからです。有効化やチーム管理の手順は [Claude マルチエージェントの初期設定](/mdTechKnowledge/blog/claude-agent-teams-setup/) を参照してください。

---

## 7. 確認コマンドの早見表と `/goal` の位置づけ

4系統＋関連機能は**確認・操作のコマンドが異なります**。ここを押さえると混乱しません。

| 対象 | コマンド | 系統 |
|:---|:---|:---|
| Dynamic Workflows の進捗 | **`/workflows`** | 実行エンジン |
| バックグラウンドセッション一覧 | **`claude agents`**（Agent View） | 管理UI |
| Agent Teams のメンバー間連携 | 共有タスクリスト・ダイレクトメッセージ | 協働チーム |
| 現在セッション内のサブエージェント | `/agents` | — |
| 現在セッションのバックグラウンド項目全般 | `/tasks` | — |

加えて、**`/goal`**（v2.1.139 で Agent View と同時期に追加）は「**完了条件を指定して Claude を自律継続させる**」コマンドで、Claude Code を“1往復の応答”から“目標達成までの自走”へ広げる機能です。Dynamic Workflows（並列ファンアウト）とは別軸の「単一セッションの自律化」であり、これも「マルチエージェント開発プラットフォーム化」の一環です（詳細は [Monitor & Push 通知ガイド](/mdTechKnowledge/blog/claude-code-monitor-push-notification/) を参照）。

---

## 8. 使い分けの意思決定ガイド

| やりたいこと | 使うもの |
|:---|:---|
| 1つの重いタスク（移行・監査・多視点検証）をその場で並列処理したい | **Dynamic Workflows**（`workflow` キーワード） |
| 役割分担した少数エージェントで長期協働・相互報告させたい | **Agent Teams**（チームを起動） |
| 複数の自走セッションの状態を俯瞰し、入力待ちに返答・アタッチしたい | **Agent View**（`claude agents`） |
| 目標を決めて1セッションを完了まで自律継続させたい | **`/goal`** |
| エージェントをクラウドで常駐・長期運用したい（業務基盤） | **Managed Agents**（API） |
| クラウド環境でローカル同等のセッションを動かしたい | **Claude Code on the web** |

ざっくり言えば——**並列に「解く」なら Dynamic Workflows、対等に「協働させる」なら Agent Teams、複数を「見る」なら Agent View、クラウドで「常駐させる」なら Managed Agents**。

---

# 補足: Agent View 詳細リファレンス

ここからは、独立記事を持たない **Agent View の機能詳細**を補足します。Agent View は全並列セッションを1画面で束ねる管理UIで、**v2.1.139**（PT 2026-05-11 / JST 5-12）で Research Preview として登場しました（Pro/Max/Team/Enterprise/API、**Free 不可**）。

## 補足A. 起動と無効化

| 手段 | 操作 | 効果 | 設定キー |
|:---|:---|:---|:---|
| コマンド | `claude agents` | シェルから開く | — |
| 左矢印 | 空プロンプトで `←` | 現在セッションを背景化し開く | `leftArrowOpensAgents` |
| 取り込み | `/background`（`/bg`） | 対話セッションを背景化 | — |
| 全体無効化 | `disableAgentView` / `CLAUDE_CODE_DISABLE_AGENT_VIEW` | 使用不可（管理者強制可） | managed settings |

## 補足B. 画面の読み方（状態・アイコン・PR列）

各行は **①セッション名 ②現在のアクティビティ（最終応答の1行要約、Haiku クラスが最大15秒ごと＋各ターン終了時に生成）③最後に状態変化してからの経過** で構成されます。

### 6つのセッション状態

| 状態 | 色・表現 | 意味 |
|:---|:---|:---|
| Working | アニメーション | ツール実行／応答生成中 |
| Needs input | 黄色 | 質問・権限判断の待ち |
| Idle | 薄暗 | 次のプロンプト待ち |
| Completed | 緑 | 成功完了 |
| Failed | 赤 | エラー終了 |
| Stopped | 灰 | `Ctrl+X` / `claude stop` で停止 |

### アイコン形状＝プロセス生存状態

| アイコン | 状態 | できること |
|:---|:---|:---|
| `✻` / `✽`（点滅） | プロセス生存 | 即 attach/reply |
| `∙` | プロセス終了済み | peek/reply/attach（再開時に途中復帰） |
| `✢` | `/loop` がスリープ中 | 実行回数・カウントダウン表示 |

### PR 列の色

| 色 | PR 状態 | 目安 |
|:---|:---|:---|
| 黄 | チェック/レビュー待ち or 失敗 | 確認が必要 |
| 緑 | チェック通過・ブロックなし | マージ検討可 |
| 紫 | マージ済み | 完了 |
| 灰 | ドラフト/クローズ | 対応不要 |

行は **Ready for review / Needs input** が上部 → **Working** → **Completed** の順でグループ化され、**`Ctrl+S`** でディレクトリ別に切替できます。

## 補足C. キーバインドと peek

| キー | 動作 |
|:---|:---|
| `↑` / `↓` | 行の選択移動 |
| `Enter` / `→` | attach（対話復帰） |
| `Space` | peek パネルの開閉 |
| `Ctrl+S` | グループ化の切替 |
| `Ctrl+T` | ピン留め（自動停止から除外） |
| `Ctrl+X` | 停止（**2秒以内に再押下で削除**） |
| `?` | ヘルプ |

**peek**（`Space`）はセッションが必要としていること・最新出力・開いた PR を表示します（**全文トランスクリプトではない**）。返信を打って `Enter` で送信、多肢選択は数字キー、`Tab` で提案補完、先頭 `!` で Bash 送信、`→` で attach。

> ⚠ **`Ctrl+X` 2連打の削除は破壊的**です。Claude が作成した worktree（**未コミット変更を含む**）も削除されます。

## 補足D. バックグラウンドセッションのライフサイクルと自動化

| 局面 | 挙動 |
|:---|:---|
| 起動経路 | ①Agent View 入力欄 ②`/bg` ③`claude --bg "<prompt>"` |
| ホスト | per-user supervisor プロセス（端末から独立、自動開始） |
| 永続化 | `~/.claude/jobs/<id>/state.json` |
| ファイル分離 | `.claude/worktrees/` の独立 worktree（`worktree.bgIsolation: "none"` で無効化、v2.1.143 頃〜） |
| 自動停止 | 未 attach のまま約1時間で停止（`Ctrl+T` で除外） |

シェルからは `claude agents --json`（v2.1.144 頃）で構造化出力でき、CI/自動化に組み込めます。

```bash
# 入力待ちセッションだけ抽出
claude agents --json | jq '.[] | select(.status=="needs_input") | {name, cwd}'
```

管理コマンドは `claude attach` / `logs` / `stop`（`kill`）/ `respawn --all` / `rm` / `daemon status`。Agent View 入力先頭の `!`（または `claude --bg --exec`、v2.1.154）でバックグラウンドシェルジョブも実行できます。

## 補足E. Agent View 進化年表

| バージョン | 追加・変更 |
|:---|:---|
| **v2.1.139** | Agent View 初登場（Research Preview）、`claude agents`、`/goal` |
| v2.1.141 頃 | `claude agents --cwd <path>` |
| v2.1.142 頃 | dispatch 制御フラグ（`--model`/`--effort`/`--permission-mode`） |
| v2.1.143 頃 | `worktree.bgIsolation` 無効化 |
| v2.1.144 頃 | `claude agents --json`、`/resume` に `bg` 混在表示 |
| v2.1.145 頃 | PR 列強化、autocomplete・マウス対応改善 |
| v2.1.154 | `!<command>` / `claude --bg --exec`、`/resume` 背景セッション対応 |
| v2.1.157 | `--agent` とエージェント設定の尊重 |

（バージョン番号は資料間で揺れがあり「頃」を含みます。全体は[バージョン履歴まとめ](/mdTechKnowledge/blog/claude-code-version-history/)参照。）

## 補足F. Research Preview の制約

| 制約 | 挙動 | 対処 |
|:---|:---|:---|
| クォータ消費 | 背景は対話と同クォータ（10並列=約10倍速） | 並列数を意識 |
| ローカル依存 | シャットダウンで停止（次回 Failed） | attach/peek/reply で再開 |
| 削除の破壊性 | `Ctrl+X` 2連打で worktree も削除 | 削除前に変更確認 |
| UI 変更可能性 | Research Preview | 公式で最新確認 |

---

## まとめ

- Claude の「マルチエージェント」は **Dynamic Workflows（実行エンジン）／Agent View（管理UI）／Managed Agents（クラウド基盤）／Agent Teams（対等な独立セッション協働）** の4系統。役割もレイヤーも異なる。
- **並列に「解く」なら Dynamic Workflows、対等に「協働させる」なら Agent Teams、複数を「見る」なら Agent View、クラウドで「常駐」なら Managed Agents**。`/goal` は単一セッションの自律化という別軸。
- Agent Teams と Dynamic Workflows の決定的な差は **「独立セッション（対等・双方向）か、サブエージェント（従属・一方向）か」**。Agent View とは「協働させる」か「俯瞰する」かで異なる。
- 確認コマンドは **`/workflows`（DW）／`claude agents`（Agent View）／共有タスクリスト・DM（Agent Teams）／`/agents`・`/tasks`（現セッション）** と使い分ける。
- Agent View 単体の詳細（起動・6種ステータス・キーバインド・自動化）は本記事後半の補足を参照。

---

## 参考資料

- [Claude Code 公式ドキュメント: Workflows](https://code.claude.com/docs/en/workflows)
- [Claude Code 公式ドキュメント: Agent view](https://code.claude.com/docs/en/agent-view)
- [Anthropic 公式ブログ: Agent view in Claude Code](https://claude.com/blog/agent-view-in-claude-code)
- [Claude Code CHANGELOG（anthropics/claude-code）](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [The New Stack: Claude Code Agent View](https://thenewstack.io/claude-code-agent-view/)
- [Anthropic: Managed Agents / Claude Platform](https://www.anthropic.com/)

---

*本記事は2026年5月時点の公式ドキュメント・公式ブログ・公式 CHANGELOG・技術メディア報道に基づいています。Dynamic Workflows・Agent View はともに Research Preview であり、UI・挙動・バージョン挙動・各機能の統合度は予告なく変更され得ます。バージョン番号は資料間で揺れがあるため一部「頃」と表記し、Managed Agents との統合可否など公式に明示がない点は推測として明記しています。*
