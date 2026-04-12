---
title: "Ultraplan 完全ガイド — クラウド連携プランニングの仕組みと使い方"
date: 2026-04-12
category: "Claude技術解説"
tags: ["Claude Code", "Ultraplan", "プランニング", "CCR"]
excerpt: "Claude Code v2.1.91で追加されたUltraplanの全体像。クラウドプランニング・GitHub連携・テレポート返却・使い分けを網羅。"
draft: false
---

<iframe src="/mdTechKnowledge/guides/ultraplan-guide.html" width="100%" height="4000" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

# Ultraplan 完全ガイド

> Claude Code v2.1.91 以降 / Research Preview / 2026年4月時点

---

## 1. Ultraplan とは

従来の Claude Code では `/plan` を実行するとターミナルがロックされ、計画が完成するまで別作業ができなかった。**Ultraplan** はプランニングのフェーズを Anthropic のクラウド（CCR: Cloud Container Runtime）に移すことで、この問題を解決する。

### 主な特徴

| 特徴 | 内容 |
|---|---|
| **ターミナルが自由** | 計画はクラウドで生成。3秒ポーリングのみで、別作業・複数セッション並行が可能 |
| **ブラウザでリッチなレビュー** | インラインコメント・絵文字リアクション・アウトラインサイドバーで特定箇所を指定して修正依頼 |
| **実行先を選択** | 「クラウドで実行してPRを作成」か「ターミナルに計画を戻す」かを承認後に選択 |
| **Opus 4.6 × 最大30分** | クラウドセッションは最大30分のコンピューティング時間を確保 |

### 起動方法（3通り）

```bash
# 方法A: スラッシュコマンド（確認ダイアログあり）
/ultraplan migrate the auth service from sessions to JWTs

# 方法B: プロンプト内にキーワード（確認ダイアログあり）
I need an ultraplan for refactoring the payment module

# 方法C: ローカルプランから昇格（確認なし）
# /plan 実行 → 承認ダイアログで「Refine with Ultraplan」を選択
```

> **注意：** Remote Control と Ultraplan は同時に利用できない。どちらも `claude.ai/code` インターフェースを使うため、Ultraplan 起動時に Remote Control は切断される。

---

## 2. 全体アーキテクチャ

4つのコンポーネントが連携する。

```
ローカル環境                  Anthropic CCR                  ブラウザ
─────────────                ─────────────────────────────   ────────────
                             ┌─────────────────────────┐
ターミナル  ──起動──────────→│ スナップショット          │
                             │ (起動時のコードを同期)    │
GitHub リポ ──sync──────────→│                         │ ──計画を送信──→ ブラウザ
                             │ Planning Agent           │                  レビュー UI
                             │ (Opus 4.6 / 最大30分)   │ ←─承認────────
                             │                         │
                             │ プランモード              │
                             │ Simple / Visual / Deep   │
                             │                         │
                             │ セキュアプロキシ          │──→ GitHub (remote)
                             └─────────────────────────┘
                                                               ↓ (承認後の分岐)
                             クラウドで実行 → GitHub PR    テレポート → ターミナル ダイアログ
```

### プランモードの3種類（サーバー側A/Bで自動割り当て、ユーザーは選択不可）

| モード | 特徴 | 見分け方 |
|---|---|---|
| **Simple Plan** | ローカルプランと同等の軽量解析。ファイルリストと変更ステップを出力。 | 箇条書きのみ、図なし |
| **Visual Plan** | Simple に加えて Mermaid / ASCII 図を自動生成。依存関係の循環なども視覚化。 | 計画内に図が含まれる |
| **Deep Plan** | サブエージェントによるリスク評価・アーキテクチャレビューを含む多角的分析。 | リスク評価セクションがある |

---

## 3. GitHub 連携の仕組み

### 3-1. スナップショット取得（起動時）

Ultraplan を起動すると、その時点のリポジトリ状態が CCR に同期される。これは**点時間のコピー**であり、起動後にローカルで加えた変更はクラウドセッションには反映されない。

**ベストプラクティス：** コミット＆プッシュ後に起動する。

> **既知の不具合：** Ultraplan は `origin` という名前のリモートから GitHub URL を探す。Bitbucket を origin にして GitHub をセカンダリリモートにしている場合、認証エラーになる。回避策：GitHub リモートを `origin` にリネームする。

### 3-2. セキュアプロキシ（git操作の仲介）

クラウドセッション内の git クライアントは、実際の GitHub トークンを持たない。代わりに**スコープ付き一時認証情報**を使って Anthropic のセキュアプロキシに接続し、プロキシが検証・変換して GitHub へ転送する。

```
CCR サンドボックス内                     Anthropic インフラ
─────────────────────────────────────   ──────────────────────
Planning Agent
  └── git client
        └── スコープ付き認証情報  ──→  セキュアプロキシ
                                         ① スコープ認証を検証
                                         ② git操作の内容を検証
                                         ③ 本物のトークンに変換
                                         ④ GitHub へ転送 + ログ記録
                                              ↓
                                         GitHub (clone / fetch / push / PR)
```

| 保護機能 | 内容 |
|---|---|
| **認証情報の隔離** | GitHub トークンは VM 内に入らない。漏洩リスクをゼロにする設計。 |
| **操作の制限** | 指定ブランチへの push のみ許可。clone・fetch・PR 作成は可能。 |
| **監査ログ** | アウトバウンド通信はすべてプロキシ経由で完全に記録される。 |
| **ネットワーク制限** | デフォルトは許可ドメインリストに限定。GitHub 操作専用プロキシはネットワーク設定とは独立。 |

### 3-3. 利用条件（GitHub）

- GitHub リポジトリが必須（GitLab・Bitbucket・ローカルのみのリポジトリは不可）
- Claude GitHub App をリポジトリにインストール済みであること
- Amazon Bedrock・Google Cloud Vertex AI・Microsoft Foundry では利用不可
- Team / Enterprise プランは Self-hosted GitHub Enterprise Server もサポート

---

## 4. ターミナルへの返却メカニズム

### 4-1. ステータスインジケーター（起動後にプロンプトに表示）

```
◇ ultraplan running       → コードベースを解析中。ターミナルは自由。
◇ needs clarification     → ブラウザで追加情報が必要。
◆ ultraplan ready         → 計画完成。ブラウザの URL を開く。
```

内部では `pollForApprovedExitPlanMode()` という関数が **3秒ごと** に CCR のセッション状態を問い合わせる。

### 4-2. `/tasks` コマンドで詳細確認

```bash
/tasks
# → ultraplan エントリを選択すると以下が表示される
#   - セッションリンク（ブラウザで開くURL）
#   - エージェントのアクティビティログ（何を調査中かを確認）
#   - Stop ultraplan（中断してセッションをアーカイブ）
```

### 4-3. ブラウザ承認後の分岐

ブラウザで承認ボタンを押すと、CCR 側に `executionTarget` フィールドが設定される。次のポーリングでターミナルがそれを検知し、以下のように分岐する。

#### パターン A：クラウドで実行（`executionTarget = 'remote'`）

```
ターミナルに届くもの：短い通知テキストのみ（計画内容は届かない）
インジケーターが消える。
↓
GitHub に PR が自動作成される（ブラウザで確認）

通知テキスト例：
"Ultraplan approved — executing in Claude Code on the web.
 Results will land as a pull request when the remote session finishes.
 There is nothing to do here."
```

#### パターン B：テレポート（`executionTarget = 'local'`）

```
計画の全文がターミナルに注入される。
Web セッションはアーカイブ（並行実行しない）。
↓
「Ultraplan approved」ダイアログが出現
  ① Implement here    → 現在の会話に計画を注入して続行
  ② Start new session → コンテキストをリセットして新規セッション開始
  ③ Cancel            → ファイルに保存して後で使う（パスが表示される）
```

### 4-4. 返却内容の比較

| 比較項目 | クラウド実行（remote） | テレポート（local） |
|---|---|---|
| ターミナルに届くもの | 短い通知テキストのみ | 計画の全文 |
| ダイアログ | なし（インジケーターが消えるだけ） | 「Ultraplan approved」3択 |
| 最終成果物 | GitHub PR（ブラウザで確認） | ローカルで実行した結果 |
| 向いているケース | 自己完結した変更、CI/CDに乗せる場合 | 環境変数・内部サービス依存の作業 |

---

## 5. 利用条件

| 条件 | 詳細 |
|---|---|
| Claude Code バージョン | v2.1.91 以降 |
| プラン | Pro / Max / Team / Enterprise（いずれか） |
| リポジトリ | GitHub リポジトリが接続済みであること |
| GitHub App | Claude GitHub App がリポジトリにインストール済み |
| 利用不可の環境 | Amazon Bedrock / Google Cloud Vertex AI / Microsoft Foundry |
| Enterprise 特記 | Self-hosted GitHub Enterprise Server は Team・Enterprise のみ |

> ステータス：Research Preview。フィードバックにより動作・機能は変更される場合がある。

---

## 6. 使い分けとベストプラクティス

### Ultraplan を使うべきケース

- **大規模移行・リファクタリング** — 複数ファイルにまたがる変更や、アーキテクチャ上の決定が伴う作業
- **計画をレビューしたい** — ブラウザ URL を共有すれば、チームメンバーが計画をレビュー可能
- **ターミナルを別作業に使いたい** — 計画の生成に時間がかかると分かっている場合

### ローカルプランを使うべきケース

- **小さな変更・素早い反復** — ターミナル上で即座にフィードバック可能
- **カスタムツール依存** — ローカルの MCP サーバーやカスタムツールが必要な場合

### ベストプラクティス

1. **起動前に push する** — `git commit && git push` 後に起動。コミット前の変更はスナップショットに含まれない可能性がある。
2. **ローカルプランから昇格させる** — まずローカルプランで方向性を確認し、「Refine with Ultraplan」で昇格させると精度が高くなる。
3. **CLAUDE.md を整備する** — プロジェクトルートに配置し、スタック・規約・触ってはいけないファイルを記述しておく。
4. **具体的なタスク説明** — 「auth をリファクタリング」より「`/api/auth` のセッション認証を JWT に置き換え、エンドポイントシグネチャを維持する」のほうが精度が上がる。

---

*Ultraplan 完全ガイド — Claude Code Research Preview / 2026年4月時点*
