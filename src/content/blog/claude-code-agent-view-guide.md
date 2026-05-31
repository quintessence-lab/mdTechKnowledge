---
title: "Claude Code Agent View 完全ガイド — 全セッションを1画面で束ねる横断管理ダッシュボード"
date: 2026-05-31
category: "Claude技術解説"
tags: ["Claude Code", "Agent View", "claude agents", "バックグラウンドセッション", "セッション管理", "マルチエージェント", "Research Preview"]
excerpt: "Claude Code v2.1.139 で追加された Agent View（Research Preview）を体系解説。起動方法・6種ステータス・キーバインド・claude agents --json による自動化・バックグラウンドセッションのライフサイクルを整理し、Dynamic Workflows（管理UI vs 実行エンジン）と Managed Agents（ローカル vs クラウド）との棲み分けも明確にする。"
draft: false
---

**最終更新**: 2026-05-31
**対象**: Claude Code **v2.1.139 以降**（Pro / Max / Team / Enterprise / API）
**ステータス**: Research Preview（UI・キーバインドは変更され得ます）

---

## はじめに

Claude Code でバックグラウンドセッションや複数の作業を並行させると、「どのセッションが動いていて、どれが自分の入力待ちで、どれが終わったのか」が見えなくなります。**Agent View（エージェントビュー）** は、その全並列セッションを**1画面のリストで束ねて見る CLI ダッシュボード**です。

2026年5月11日（PT、JST では5月12日）、Claude Code **v2.1.139** で Research Preview として追加されました。重要なのは、Agent View は**「実行する」機能ではなく「束ねて見る・操作する」管理UI**である点です。本記事では Agent View 単体を体系的に解説したうえで、混同されがちな **Dynamic Workflows**（実行エンジン）と **Managed Agents**（クラウド基盤）との違い・関係も整理します。

> 本記事は2026年5月時点の公式ドキュメント・公式ブログ・公式 CHANGELOG に基づきます。Research Preview のため、インターフェース・キーバインド・バージョン挙動は変更され得ます。日付は公式リポジトリ CHANGELOG コミットのタイムスタンプ（PT基準）に基づきます。

---

## 1. Agent View とは何か

### 1-1. 早わかり

| 項目 | 内容 |
|:---|:---|
| 正式名 | Agent View（エージェントビュー） |
| 一言で | すべての並列 Claude Code セッションを1画面で管理するダッシュボード |
| 起動 | `claude agents` コマンド、または空プロンプトで左矢印 `←` |
| 必要バージョン | **v2.1.139 以降** |
| 提供形態 | Research Preview |
| 対応プラン | Pro / Max / Team / Enterprise / Claude API |
| 非対応 | **Free プラン**（バックグラウンドエージェント・`claude agents` 不可） |
| 役割 | セッションを**束ねて見る・操作する**管理UI（実行エンジンではない） |
| 無効化 | `disableAgentView` 設定 / 環境変数 `CLAUDE_CODE_DISABLE_AGENT_VIEW` |

### 1-2. 「管理UI」という立ち位置

Agent View 自体はタスクを実行しません。すでに走っている（あるいは終わった）**複数セッションの状態を一覧化し、覗き見（peek）・返信・アタッチ（attach）する**ための窓口です。この「実行はしない、束ねて見る」という性格が、後述の Dynamic Workflows（実行エンジン）との決定的な違いになります。

> `ANTHROPIC_API_KEY` を設定している場合はサブスクリプションではなく **API 課金**で動作します。Team / Enterprise では管理者が `disableAgentView` で無効化できます。

---

## 2. 起動と無効化

| 手段 | 操作 | 効果 | 設定キー |
|:---|:---|:---|:---|
| コマンド | `claude agents` | シェルから Agent View を開く | — |
| 左矢印 | 空プロンプトで `←` | 現在のセッションを背景化し、その行を選択状態で開く | `leftArrowOpensAgents` |
| 取り込み | `/background`（`/bg`）または `←` | 対話セッションを背景セッション化 | — |
| 全体無効化 | `disableAgentView: true` / `CLAUDE_CODE_DISABLE_AGENT_VIEW` | Agent View を使えなくする（管理者強制可） | managed settings |

`←` は**空のプロンプト上**でのみ Agent View を開きます（入力中は通常のカーソル移動）。なお、進行中のバックグラウンド作業（サブエージェント・Dynamic Workflow・バックグラウンドシェル）があると `←` での背景化は **「Cannot open agents — N background task(s) running」** となり、`/tasks` での確認・`/bg` での破棄確認が必要です。

---

## 3. 画面の読み方

### 3-1. 各行の3要素

各行は **①セッション名 ②現在のアクティビティ（最終応答の1行要約）③最後に状態変化してからの経過** で構成されます。要約は **Haiku クラスのモデル**が生成し、作業中は**最大15秒に1回＋各ターン終了時**に更新されます（要約は最終応答の1行であり全文ではありません）。

### 3-2. 6つのセッション状態

| 状態 | 色・表現 | 意味 |
|:---|:---|:---|
| **Working** | アニメーション | ツール実行／応答生成中 |
| **Needs input** | 黄色 | 質問・権限判断の待ち |
| **Idle** | 薄暗 | 次のプロンプト待ち |
| **Completed** | 緑 | 成功完了 |
| **Failed** | 赤 | エラー終了 |
| **Stopped** | 灰 | `Ctrl+X` または `claude stop` で停止 |

### 3-3. アイコン形状＝プロセス生存状態

| アイコン | 状態 | できること |
|:---|:---|:---|
| `✻` / `✽`（点滅） | プロセス生存・即応答可 | そのまま attach/reply |
| `∙` | プロセス終了済み | peek/reply/attach 可（再開時に途中復帰） |
| `✢` | `/loop` がイテレーション間でスリープ中 | 実行回数とカウントダウンを表示 |

### 3-4. グルーピングと PR 列

行は **Ready for review（PRあり）／Needs input** が上部 → **Working** → **Completed**（完了・失敗・停止）の順にグループ化されます。**`Ctrl+S`** でディレクトリ別グループ化に切り替えられます（選択は永続化）。右端の PR 列は色で状態を示します。

| 色 | PR 状態 | アクション目安 |
|:---|:---|:---|
| 黄 | チェック/レビュー待ち、またはチェック失敗 | 確認が必要 |
| 緑 | チェック通過・ブロックなし | マージ検討可 |
| 紫 | マージ済み | 完了 |
| 灰 | ドラフト/クローズ | 対応不要 |

---

## 4. キーバインド・peek パネル

### 4-1. 主なキーバインド

| キー | 動作 |
|:---|:---|
| `↑` / `↓` | 行の選択移動 |
| `Enter` / `→` | 選択セッションに attach（対話復帰） |
| `Space` | peek パネルの開閉 |
| `Ctrl+S` | ディレクトリ別グループ化の切替 |
| `Ctrl+T` | ピン留め（自動停止から除外） |
| `Ctrl+X` | 停止（**2秒以内に再押下で削除**） |
| `?` | ヘルプ表示 |

> ⚠ **`Ctrl+X` の2連打による削除は破壊的**です。Claude が作成した worktree（**未コミット変更を含む**）も一緒に削除されます。データ損失に注意してください。

### 4-2. peek パネル

**`Space`** で開閉。セッションが必要としていること・最新出力・開いた PR を表示します（**全文トランスクリプトではありません**）。返信を打って `Enter` で送信、多肢選択は数字キー、提案返信は `Tab` で補完、返信先頭に `!` で Bash コマンド送信、`↑/↓` で隣接 peek、`→` で attach できます。

---

## 5. バックグラウンドセッションのライフサイクル

Agent View が管理する実体は「バックグラウンドセッション」です。その生死を理解すると運用が安定します。

| 局面 | 挙動 |
|:---|:---|
| 起動経路 | ①Agent View 入力欄 ②`/bg`（`/background`）③シェル `claude --bg "<prompt>"` |
| ホスト | **per-user の supervisor プロセス**（端末・Agent View から独立、初回起動時に自動開始） |
| 永続化 | `~/.claude/jobs/<id>/state.json` 等に保存 |
| ファイル分離 | 編集前に `.claude/worktrees/` 配下の独立 git worktree へ移動（`worktree.bgIsolation: "none"` で無効化、**v2.1.143以降**） |
| ネットワーク | 認証情報を対話セッションと共有、**model API 以外の追加接続はしない** |
| 自動停止 | 完了して未 attach のまま**約1時間でプロセス停止**（`Ctrl+T` ピン留めで除外） |

運用フローは「**`claude --bg` や `/bg` で起動 → Agent View で監視 → 必要になったら attach（または `/resume`）で対話復帰**」が基本形です。

---

## 6. シェルからの管理と自動化

Agent View は TUI だけでなく、**シェルコマンドと JSON 出力**でも操作でき、CI/自動化に組み込めます。

### 6-1. 管理コマンド

| コマンド | 機能 | 最小バージョン |
|:---|:---|:---|
| `claude agents` | Agent View 起動 | v2.1.139 |
| `claude agents --cwd <path>` | ディレクトリ単位スコープ | v2.1.141 頃 |
| `claude agents --json` | ライブセッションを JSON 配列で出力 | v2.1.144 頃 |
| `claude attach <id>` / `claude logs <id>` | 復帰 / ログ確認 | — |
| `claude stop <id>`（`claude kill`）/ `claude respawn <id>` `--all` | 停止 / 再起動 | — |
| `claude rm <id>` / `claude daemon status` | 削除 / supervisor 状態 | — |

### 6-2. `claude agents --json` で自動化

`claude agents --json` は各セッションを構造化出力するため、`jq` 等でフィルタしてスクリプト化できます。

| フィールド | 内容 | 常時/条件付き |
|:---|:---|:---|
| `pid` / `cwd` / `kind` / `startedAt` | プロセスID・作業ディレクトリ・種別・開始時刻 | 常時 |
| `sessionId` / `name` / `status` | セッションID・名前・状態 | 設定時 |

```bash
# 入力待ち（Needs input）のセッションだけ抽出する例
claude agents --json | jq '.[] | select(.status=="needs_input") | {name, cwd}'
```

### 6-3. dispatch 制御フラグ・バックグラウンドシェル

セッション起動時に `--model` / `--effort` / `--permission-mode` などを指定できます（多くは **v2.1.142 頃**から、`--allow-dangerously-skip-permissions` は v2.1.143 頃、`--agent` 尊重は v2.1.157 頃）。また Agent View 入力欄の先頭に **`!`** を付けるとシェルジョブを実行でき（例 `! pytest -x`）、シェルからは `claude --bg --exec 'pytest -x'` が同等です（**v2.1.154 で言及**。出力はメモリ保持・コマンド終了の約5分後に自動クリーンアップ）。

> バージョン番号は資料間で揺れがあるため、本記事では機能の存在を主軸に「v2.1.14x 頃」と幅を持たせています。正確な初出は公式ドキュメントの最小バージョン表を参照してください。

---

## 7. Dynamic Workflows との比較 — 管理UI vs 実行エンジン

Agent View と [Dynamic Workflows](/mdTechKnowledge/blog/claude-code-dynamic-workflows-guide/) は、どちらも「複数エージェント」に関わるため混同されがちですが、**役割が根本的に異なります**。

| 観点 | **Agent View** | **Dynamic Workflows** |
|:---|:---|:---|
| 役割 | セッションを束ねて見る**管理UI** | 1タスクを大規模並列化する**実行エンジン** |
| 調整主体 | ユーザー（手動で覗く・返す） | Claude が書く **JavaScript スクリプト** |
| 確認コマンド | **`claude agents`** | **`/workflows`** |
| 管理単位 | セッション | フェーズ・サブエージェント |
| 規模上限 | — | 1実行**最大1000**・同時**最大16** |
| 権限 | dispatch フラグで指定 | 常に **acceptEdits**（許可リスト継承） |
| 必要バージョン | v2.1.139 | v2.1.154 |
| 永続性 | `~/.claude/jobs`（背景セッション） | 同一セッション内のみ再開可 |

### 確認コマンドの使い分け

| 対象 | コマンド |
|:---|:---|
| バックグラウンドセッション | `claude agents`（Agent View） |
| 現在セッション内のサブエージェント | `/agents` |
| 現在セッションのバックグラウンド項目全般 | `/tasks` |
| Dynamic Workflows | `/workflows` |

### 相互作用

バックグラウンドセッションの中で Dynamic Workflow が走ると、Agent View 上はそのセッションが **Working** として可視化されます（フェーズの詳細ではなく、セッション状態として）。**ワークフローのフェーズ・サブエージェントの詳細を見るのは `/workflows` の役割**です。Agent View の行から Workflow のフェーズ詳細へ直接ドリルダウンできるかは公式に明示がなく、現状はセッション状態としてのみ可視と考えるのが安全です（統合度合いは未確定）。

→ 要約すると、**Agent View は「複数の作業を俯瞰する」、Dynamic Workflows は「1つの作業を並列に解く」**。レイヤーが異なり、競合しません。

---

## 8. Managed Agents との関係性 — ローカル vs クラウド

[Managed Agents](/mdTechKnowledge/blog/claude-managed-agents-guide/) も「エージェントを動かす」基盤ですが、Agent View とは**動く場所（ローカル vs クラウド）が異なります**。

| 観点 | **Agent View（Claude Code）** | **Managed Agents（Claude Platform）** |
|:---|:---|:---|
| 種別 | ローカルの CLI ダッシュボード | Anthropic 提供の **hosted service** |
| 実行場所 | **自分のマシン** | 管理クラウド or self-hosted サンドボックス |
| ホスト | per-user supervisor プロセス | Harness（Brain）＋ Sandbox（Hands） |
| 永続化 | `~/.claude/jobs`（ローカル） | サーバー側のイベントログ |
| ネットワーク | model API のみ | クラウド基盤 |
| アクセス | プラン内（Pro〜Enterprise/API） | beta ヘッダ `managed-agents-2026-04-01` |
| 停止条件 | **マシンのシャットダウンで停止** | クラウドで常駐 |
| ブランド | Claude Code | 別ブランド（「Claude Code」名称は不可） |

### 関係の整理

- Managed Agents は **brain（Claude＋harness）と hands（sandbox＋tools）を分離**し、セッション履歴をサーバー側で永続化するクラウド基盤です。公式は「Claude Code は Managed Agents が使える harness の優れた一例」と述べていますが、**Agent View やバックグラウンドセッションとの具体的な接続には言及していません**。
- Agent View のセッションは公式ドキュメントで明確に **「ローカル（machine 上で動き、シャットダウンで停止）」** と位置づけられ、クラウドで動かしたい場合は別製品 **Claude Code on the web**（managed cloud 環境）が案内されています。
- したがって「**Agent View が Managed Agents のクラウドセッションを一覧表示・操作する**」とは考えにくい構図です（「Sessions are local」「model API 以外接続しない」「クラウドは別製品を案内」から別レイヤーと読むのが自然。ただし公式に明確な否定文はないため、ここは推測です）。

> 補足: Managed Agents の構成は資料により「Session/Harness/Sandbox の3層」とも「Agent/Environment/Session/Events の4概念」とも説明されます。切り口の違いであり、いずれも公式です。

---

## 9. 進化の時系列（Agent View 関連）

| バージョン | 追加・変更 |
|:---|:---|
| **v2.1.139** | Agent View 初登場（Research Preview）、`claude agents` |
| v2.1.141 頃 | `claude agents --cwd <path>`（ディレクトリスコープ） |
| v2.1.142 頃 | dispatch 制御フラグ群（`--model`/`--effort`/`--permission-mode` 等） |
| v2.1.143 頃 | `worktree.bgIsolation` 無効化、`--allow-dangerously-skip-permissions` |
| v2.1.144 頃 | `claude agents --json`、`/resume` に `bg` 表記で混在表示 |
| v2.1.145 頃 | PR 列 `PR #N`/`N PRs` 強化、autocomplete・マウス対応改善 |
| v2.1.154 | `!<command>` バックグラウンドシェル／`claude --bg --exec`、`/resume` がバックグラウンドセッション対応 |
| v2.1.157 | `--agent` とエージェント設定の尊重 |

（バージョン番号は資料間で揺れがあり、上表は「頃」を含みます。全体の履歴は[Claude Code バージョン履歴まとめ](/mdTechKnowledge/blog/claude-code-version-history/)を参照。）

---

## 10. Research Preview の制約と注意点

| 制約 | 具体的な挙動 | 対処 |
|:---|:---|:---|
| クォータ消費 | バックグラウンドは対話と同クォータ。**10並列なら約10倍速で消費** | 並列数を意識して運用 |
| ローカル依存 | マシンのシャットダウンで停止（次回 Failed 表示） | attach/peek/reply で途中再開 |
| 削除の破壊性 | `Ctrl+X` 2連打で worktree（未コミット変更含む）も削除 | 削除前に変更を確認 |
| UI 変更可能性 | Research Preview のため UI・キーが変わり得る | 公式ドキュメントで最新確認 |

---

## 11. 他機能との棲み分け

- **Agent Teams**（ローカルの協調マルチエージェント）→ [Claude Agent Teams セットアップ](/mdTechKnowledge/blog/claude-agent-teams-setup/)。teammates は Agent View の行としては表示されない別レイヤー。
- **Routines**（スケジュール/イベント駆動のクラウド自動化）→ [Routines ガイド](/mdTechKnowledge/blog/claude-code-routines-guide/)。
- **Monitor / Push 通知**（背景プロセスの監視・離席通知）→ [Monitor & Push 通知ガイド](/mdTechKnowledge/blog/claude-code-monitor-push-notification/)。Agent View の「Needs input」を Push で受け取る連携が有効。

---

## まとめ

- **Agent View は「全並列セッションを1画面で束ねて見る管理UI」**。`claude agents` または空プロンプトの `←` で起動（v2.1.139 以降、Free 不可）。
- 行は **6種ステータス（Working/Needs input/Idle/Completed/Failed/Stopped）** とアイコン（プロセス生存）・PR 列の色で状態を表す。
- バックグラウンドセッションは **per-user supervisor** が管理し `~/.claude/jobs` に永続化、worktree で書き込み分離、未 attach で約1時間後に停止。
- **`claude agents --json`** で自動化・CI 連携が可能。
- **Dynamic Workflows は実行エンジン（`/workflows`）、Agent View は管理UI（`claude agents`）** でレイヤーが異なる。
- **Managed Agents はクラウド基盤、Agent View はローカル** で動く場所が異なる（相互の直接統合は公式明示なし）。

`Ctrl+X` 2連打の削除が未コミット変更ごと消す点だけ注意すれば、Agent View は「複数の自走セッションを安全に俯瞰する」強力な司令塔になります。

---

## 参考資料

- [Claude Code 公式ドキュメント: Agent view](https://code.claude.com/docs/en/agent-view)
- [Anthropic 公式ブログ: Agent view in Claude Code](https://claude.com/blog/agent-view-in-claude-code)
- [Claude Code 公式ドキュメント: Workflows](https://code.claude.com/docs/en/workflows)
- [Claude Code CHANGELOG（anthropics/claude-code）](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)
- [Anthropic: Managed Agents / Claude Platform](https://www.anthropic.com/)

---

*本記事は2026年5月時点の公式ドキュメント・公式ブログ・公式 CHANGELOG に基づいています。Agent View・Dynamic Workflows はともに Research Preview であり、UI・キーバインド・バージョン挙動・各機能の統合度は予告なく変更され得ます。バージョン番号は資料間で揺れがあるため一部「頃」と表記し、Managed Agents との統合可否など公式に明示がない点は推測として明記しています。*
