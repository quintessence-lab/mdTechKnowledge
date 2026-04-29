---
title: "【必読】Claude マルチエージェントの初期設定"
date: 2026-04-04
updatedDate: 2026-04-29
category: "Claude技術解説"
tags: ["Claude Code", "Agent Teams", "マルチエージェント", "tmux", "初期設定", "Managed Agents"]
excerpt: "Claude Code Agent Teams（ローカル/tmuxで動くマルチエージェント機能）の有効化・表示モード・チーム管理を解説。クラウド側の Managed Agents（別製品）との位置づけや使い分け判断ガイドも掲載。"
draft: false
---

## Agent Teams とは？

複数のClaude Codeインスタンスを**チームとして協調動作**させる実験的機能です（v2.1.32以降）。1つのセッションがチームリーダーとなり、複数のチームメイトにタスクを割り当て、結果を統合します。

> **重要な前提（2026年4月以降）**: 同じ「マルチエージェント」という言葉でも、**Agent Teams**（本記事のテーマ）と **Managed Agents**（クラウド製品）は **別物** です。本記事は **Claude Code 内のローカル / tmux マルチエージェント機能** を扱います。クラウド側で動く Managed Agents との境界・使い分けは下の「Agent Teams と Managed Agents の位置づけ整理」を参照してください。

### サブエージェントとの違い

|                   | サブエージェント | Agent Teams |
|:------------------|:---------------|:------------|
| **コンテキスト** | メインに結果を返す | 各メンバーが完全に独立 |
| **通信** | メインへの報告のみ | メンバー同士が直接メッセージ |
| **調整方法** | メインが全制御 | 共有タスクリストで自己調整 |
| **最適な用途** | 結果だけが必要な集中タスク | 議論・協働が必要な複雑な作業 |
| **トークンコスト** | 低い（結果要約のみ） | 高い（各メンバーが独立インスタンス） |

![サブエージェントとAgent Teamsのアーキテクチャ比較](https://mintcdn.com/claude-code/nsvRFSDNfpSU5nT7/images/subagents-vs-agent-teams-light.png?fit=max&auto=format&n=nsvRFSDNfpSU5nT7&q=85&s=2f8db9b4f3705dd3ab931fbe2d96e42a)
*サブエージェントはメインに結果を返すだけ。Agent Teamsは共有タスクリストで自律的に協調する。（出典: [Anthropic公式ドキュメント](https://code.claude.com/docs/en/agent-teams)）*

---

## 有効化手順

Agent Teamsはデフォルトで無効です。以下の設定で有効化します。

### 方法1: settings.json に追加（推奨）

`~/.claude/settings.json` または `.claude/settings.json` に以下を追加：

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

### 方法2: 環境変数で設定

```bash
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

---

## 2つの表示モード

Agent Teamsには**in-process**と**split panes**の2つの表示モードがあります。

### in-process モード（tmux不要）

すべてのチームメイトが**メインターミナル1画面内**で動作します。特別なソフトウェアのインストールは不要です。

```
╭─────────────────────────────────────────────────╮
│  Claude Code (リーダー)                          │
│                                                 │
│  ┌ Teammates ─────────────────────────────────┐ │
│  │ ● security-reviewer  Working on Task #1    │ │
│  │ ● perf-checker       Working on Task #2    │ │
│  │ ○ test-validator     Idle                  │ │
│  └────────────────────────────────────────────┘ │
│                                                 │
│  > Shift+Down でチームメイトを切り替え           │
│  > 直接メッセージを入力して指示可能              │
╰─────────────────────────────────────────────────╯
```

**操作方法**:
- `Shift+Down`: チームメイトを順に切り替え（最後のメンバーの次はリーダーに戻る）
- `Enter`: チームメイトのセッションを表示
- `Escape`: チームメイトの現在のターンを中断
- `Ctrl+T`: タスクリストの表示/非表示

**メリット**: どのターミナルでも動作。セットアップ不要。
**デメリット**: 同時に1つのセッションしか見えない。タブ切替のような操作感。

---

### split panes モード（tmux / iTerm2 必要）

各チームメイトが**独立したペイン**に表示され、全員の作業をリアルタイムで同時に確認できます。

```
┌─────────────────────┬─────────────────────┐
│  Leader             │  security-reviewer   │
│                     │                      │
│  Task #1: ✓ Done    │  Reviewing auth      │
│  Task #2: In prog   │  module for XSS...   │
│  Task #3: Pending   │                      │
│                     │  Found 2 issues:     │
│  > Waiting for      │  - SQL injection in  │
│    teammates...     │    user_query()      │
│                     │  - Missing CSRF...   │
├─────────────────────┼─────────────────────┤
│  perf-checker       │  test-validator      │
│                     │                      │
│  Profiling API      │  Running test suite  │
│  endpoints...       │  ████████░░ 80%      │
│                     │                      │
│  Response times:    │  42 passed           │
│  GET /api: 120ms    │  3 failed            │
│  POST /api: 450ms   │  Coverage: 87%       │
└─────────────────────┴─────────────────────┘
```

**操作方法**: 各ペインをクリックして直接操作。各チームメイトのフルセッションが見える。

**メリット**: 全員の動作をリアルタイムに俯瞰できる。3人以上のチームに最適。
**デメリット**: tmux または iTerm2 が必要。VS Code統合ターミナル・Windows Terminal・Ghosttyでは非対応。

---

### tmux とは？

**Terminal Multiplexer（ターミナル多重化ツール）** — 1つのターミナルウィンドウ内で画面を分割し、複数のシェルセッションを同時に表示・操作できるツールです。

```bash
# インストール（macOS）
brew install tmux

# インストール（Ubuntu/Debian）
sudo apt install tmux

# インストール（Windows - Git Bash / MSYS2）
pacman -S tmux
```

> **注意**: Windows環境ではtmuxのサポートが限定的です。WSL2上でのLinux tmuxが最も安定して動作します。

---

### 表示モードの設定

デフォルトは `"auto"`（tmuxセッション内なら split panes、それ以外は in-process）です。

**グローバル設定**（`~/.claude.json`）:

```json
{
  "teammateMode": "in-process"
}
```

**セッション単位で指定**:

```bash
claude --teammate-mode in-process
claude --teammate-mode tmux
```

---

## チームの作成と管理

### チームを作成する

自然言語でチーム構成を指示するだけです：

```
PR #142 をレビューするチームを作って。3人のレビュアーを作成：
- セキュリティの観点で確認する人
- パフォーマンスへの影響をチェックする人
- テストカバレッジを検証する人
それぞれレビューして結果を報告して。
```

Claude が自動的にチームを作成し、タスクを割り当て、作業を開始します。

### チームメイトに直接指示する

各チームメイトは独立したClaude Codeセッションです。直接メッセージを送れます：

```
セキュリティレビュアーに追加指示：
認証トークンの有効期限処理も確認して
```

### タスクの管理

共有タスクリストでチーム全体の作業を調整します：

| 状態 | 説明 |
|------|------|
| **pending** | 未着手（依存タスク完了待ちの場合あり） |
| **in progress** | 作業中 |
| **completed** | 完了 |

タスクには依存関係を設定でき、前提タスクが完了するまで次のタスクはブロックされます。

### チームメイトの終了

```
リサーチ担当のチームメイトをシャットダウンして
```

### チームの解散

```
チームをクリーンアップして
```

> **重要**: クリーンアップは必ずリーダーから実行してください。チームメイトからの実行はリソースの不整合を起こす可能性があります。

---

## 活用シーン

### 1. 並列コードレビュー

```
チームを作ってPR #142をレビューして。
3人のレビュアー：セキュリティ、パフォーマンス、テストカバレッジ
```

### 2. 競合仮説による調査

```
アプリが1メッセージ後に終了するバグを調査。
5人のチームメイトに異なる仮説を割り当て、
お互いの仮説を反証し合うように議論させて。
```

### 3. 新機能の並列開発

```
認証モジュールをリファクタリングするチームを4人で作成。
フロントエンド、バックエンドAPI、データベース、テスト、
それぞれ別のチームメイトに担当させて。
```

---

## ベストプラクティス

| ポイント | 推奨 |
|---------|------|
| **チームサイズ** | 3〜5人が最適。それ以上は調整コストが増大 |
| **タスク粒度** | メンバーあたり5〜6タスクが目安 |
| **コンテキスト** | スポーン時に十分な背景情報を提供する |
| **ファイル競合回避** | 各メンバーが異なるファイルセットを所有する |
| **進捗監視** | 放置せず定期的に方向修正する |
| **まず調査から** | コードレビューやリサーチなど境界が明確なタスクから始める |

---

## 制限事項

- **セッション再開不可**: `/resume` や `/rewind` は in-process チームメイトを復元しない
- **タスク状態の遅延**: チームメイトがタスクを完了マークし忘れることがある
- **シャットダウンに時間がかかる**: 現在のリクエスト完了後に終了する
- **1セッション1チーム**: 同時に複数チームは管理できない
- **ネスト不可**: チームメイトが自分のチームを作ることはできない
- **リーダー固定**: セッション作成者が永続的にリーダー
- **split panesの制限**: VS Code統合ターミナル、Windows Terminal、Ghosttyでは非対応

---

## Agent Teams と Managed Agents の位置づけ整理

2026年4月にAnthropicが **Claude Managed Agents** を別製品として整備したことで、「マルチエージェント」と呼ばれるものが **2系統** に明確に分かれました。本記事の Agent Teams（Claude Code内機能）と、クラウド側の Managed Agents は **対象ユーザーも実行モデルも異なる別レイヤー** です。

### 一行サマリー

- **Agent Teams** = **Claude Code内** で動く **ローカル/tmux** ベースのマルチエージェント機能。**開発者個人のワークフロー** が対象。
- **Managed Agents** = **Anthropicクラウド側** のサンドボックス実行サービス。**本番エージェント運用** が対象の **別製品**。

### Agent Teams vs Managed Agents 比較表

| 比較項目 | Agent Teams（本記事） | Managed Agents（別製品） |
|---------|----------------------|------------------------|
| **製品分類** | Claude Code 内の実験的機能 | フルマネージド クラウド API（Public Beta） |
| **実行環境** | ローカルマシン / tmux ペイン | Anthropicクラウドの隔離サンドボックス |
| **インフラ管理** | 不要（手元のCLIで完結） | 完全マネージド（Session/Harness/Sandbox 3層） |
| **対象ユーザー** | 開発者個人・小規模チーム | 本番エージェントを運用する組織・プロダクトチーム |
| **主なユースケース** | 並列コードレビュー、競合仮説調査、複数モジュール並列開発 | コーディングエージェント、CSエージェント、社内業務エージェント等の **本番運用** |
| **永続化** | セッション再開不可（`/resume`非対応） | チェックポイント自動保存・状態完全復元 |
| **長時間タスク** | △ ターミナル開いている間のみ | ✓ 数時間〜の長時間タスクに対応 |
| **Memory（長期記憶）** | なし（各チームメイトはセッション限り） | ✓ パブリックベータ（2026年4月下旬〜）。ファイルシステム層として実装 |
| **エンタープライズ統制** | なし | ✓ RBAC・グループ支出制限・利用分析・OpenTelemetry連携 |
| **可観測性** | ターミナル / タスクリスト | Claude Console 統合トレーシング |
| **料金モデル** | Claude APIトークン課金のみ | トークン課金 + **$0.08 / session-hour** |
| **起動方法** | `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1` | API / Console / Claude Code から `start onboarding for managed agents` |
| **ベータヘッダー** | 不要 | `anthropic-beta: managed-agents-2026-04-01` |

### 2026年4月の Managed Agents 動向との関係

Managed Agents 側では2026年4月に以下の動きがありました（詳細は別記事 [Claude Managed Agents 簡易ガイド](/mdTechKnowledge/blog/claude-managed-agents-guide) を参照）。

| 時期 | 出来事 | Agent Teams への影響 |
|------|-------|---------------------|
| **2026-04-08** | Managed Agents パブリックベータ開始 | Agent Teams は引き続き Claude Code 内の **ローカル機能** として独立。混同を避けるため境界が明確化 |
| **2026-04-09** | エンタープライズ機能（RBAC・グループ支出制限・OpenTelemetry）追加 | Managed Agents 側の統制機能。**Agent Teams は対象外**（ローカル実行のため組織統制の枠外） |
| **2026-04下旬** | Memory がパブリックベータへ移行 | Managed Agents 側の長期記憶機能。**Agent Teams のチームメイトは引き続きセッション限りで、長期記憶は持たない** |

つまり、Anthropic が2026年4月に大々的に拡充したのは **Managed Agents 側の本番運用基盤** であり、Agent Teams（Claude Code内機能）は **開発者の手元で並列に動かすツール** という位置づけのまま据え置かれています。

### どちらをいつ使うか — 判断ガイド

以下のフローで選択してください。

```
質問1: それは「自分の開発作業を加速したい」タスクか？
  YES → Agent Teams を使う（ローカル/tmux で完結）
  NO  → 質問2へ

質問2: それは「本番プロダクトとしてエージェントを稼働させたい」タスクか？
  YES → Managed Agents を使う（クラウド・長期運用前提）
  NO  → 質問3へ

質問3: それは「数時間〜数日かかる長時間タスク」「組織横断のガバナンスが必要」「Memoryで知識を蓄積したい」のいずれかか？
  YES → Managed Agents を使う
  NO  → Agent Teams で十分
```

#### Agent Teams が適しているケース

- PR を **複数観点で並列レビュー** したい（セキュリティ / パフォーマンス / テスト）
- バグ調査で **競合仮説を5人に分担** させたい
- 1つの機能を **フロントエンド / バックエンド / DB / テスト** に分けて並列実装したい
- **手元のリポジトリ** で完結する作業
- **トークン課金以外のコストを発生させたくない**

#### Managed Agents が適しているケース

- 顧客向けプロダクトに **エージェント機能を組み込みたい**
- **CI/CD と連携** してバグ検出→修正→PR作成を自動化したい
- **Slack/Teams から指示** を送って成果物を受け取る運用にしたい
- **数時間〜の長時間タスク** をクラッシュ耐性付きで動かしたい
- **RBAC・支出上限・OpenTelemetry** などの組織統制が必要
- **Memory で知識を蓄積** し、繰り返し利用するほど精度を上げたい

#### 併用パターン

両者は **排他ではなく補完関係** です。実務では以下の併用が現実的です。

- **開発フェーズ**: Agent Teams で手元でプロトタイプを並列試行
- **本番フェーズ**: 同じロジックを Managed Agents に移植してクラウドデプロイ
- **日常運用**: Managed Agents が本番で稼働しつつ、開発者は Agent Teams で改善検証

---

## 参考リンク

- [Anthropic公式: Agent Teams ドキュメント](https://code.claude.com/docs/en/agent-teams)
- [Anthropic公式: サブエージェント](https://code.claude.com/docs/en/sub-agents)
- [Anthropic公式: Managed Agents Overview](https://platform.claude.com/docs/en/managed-agents/overview)
- [SDTimes: Anthropic adds memory to Claude Managed Agents](https://sdtimes.com/anthropic/anthropic-adds-memory-to-claude-managed-agents/)
- [InfoWorld: Anthropic rolls out Claude Managed Agents](https://www.infoworld.com/article/4156852/anthropic-rolls-out-claude-managed-agents.html)
- [関連記事: Claude Managed Agents 簡易ガイド](/mdTechKnowledge/blog/claude-managed-agents-guide)
- [tmux 公式Wiki](https://github.com/tmux/tmux/wiki)
