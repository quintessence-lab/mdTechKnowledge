---
title: "【必読】Claudeで/powerup を使ってAI力をアップ！"
date: 2026-04-04
category: "Claude技術解説"
tags: ["Claude Code", "/powerup", "チュートリアル", "初心者向け", "Tips"]
excerpt: "Claude Code v2.1.90で追加された /powerup コマンドを徹底解説。10個のインタラクティブレッスンで、見落としがちな機能を効率よく習得しよう。"
draft: false
---

## `/powerup` とは？

Claude Code v2.1.90 で追加されたインタラクティブな学習コマンドです。ターミナル上でアニメーション付きのデモを見ながら、Claude Codeの「ほとんどの人が見落としている機能」を1つずつ学べます。

### 起動方法

Claude Codeのプロンプトで以下を入力するだけ：

```
/powerup
```

10個のレッスンが一覧表示され、選択するとアニメーションデモ付きの解説が表示されます。読んで、試して、完了マークを付ける — というシンプルな学習フローです。

```
Power-ups 0/10 unlocked ░░░░░░░░░░

Each power-up teaches one thing Claude Code can do that most
 people miss. Open one, read it, try it, mark it done.
```

---

## 全10レッスン一覧

| # | レッスン名 | キーワード | 学べること |
|---|-----------|-----------|-----------|
| 1 | Talk to your codebase | `@` files, line refs | ファイル・行番号の参照方法 |
| 2 | Steer with modes | shift+tab, plan, auto | モード切替による作業スタイル制御 |
| 3 | Undo anything | `/rewind`, Esc-Esc | 変更の取り消し・巻き戻し |
| 4 | Run in the background | tasks, `/tasks` | バックグラウンドタスクの活用 |
| 5 | Teach Claude your rules | CLAUDE.md, `/memory` | ルール・メモリによるカスタマイズ |
| 6 | Extend with tools | MCP, `/mcp` | 外部ツール連携（MCP） |
| 7 | Automate your workflow | skills, hooks | スキルとフックによる自動化 |
| 8 | Multiply yourself | subagents, `/agents` | サブエージェントによる並列作業 |
| 9 | Code from anywhere | `/remote-control`, `/teleport` | リモートアクセス・セッション移動 |
| 10 | Dial the model | `/model`, `/effort` | モデル・思考レベルの調整 |

---

## 各レッスン詳細

### 1. Talk to your codebase — コードベースと会話する

**キーワード**: `@` ファイルメンション、行番号参照

プロンプト入力中に `@` を打つと、ファイル名の候補が表示されます。ファイルを直接コンテキストに追加でき、Claudeが正確にコードを理解できるようになります。

```
@src/components/Header.astro を修正して
```

行番号付きで参照すれば、特定の箇所をピンポイントで指示できます。

**ポイント**: フォルダ全体の `@` メンションや、画像ファイルのドラッグ＆ドロップにも対応しています。

---

### 2. Steer with modes — モードで操縦する

**キーワード**: `Shift+Tab`、Plan モード、Auto モード

Claude Codeには3つの操作モードがあります：

| モード | 動作 | 用途 |
|-------|------|------|
| **Ask** | 質問・調査のみ（編集なし） | コード理解・調査 |
| **Plan** | 計画を立てて承認を求める | 大きな変更の設計 |
| **Auto** | 自動で編集・実行 | 定型作業・信頼できるタスク |

`Shift+Tab` でモードを素早く切り替えられます。大きな変更はPlanモードで計画を確認してから実行すると安全です。

---

### 3. Undo anything — なんでも元に戻せる

**キーワード**: `/rewind`、`Esc-Esc`

Claudeが行った変更が気に入らない場合、簡単に元に戻せます：

- **`/rewind`**: 会話の任意の時点まで巻き戻し。コード変更も一緒に戻る
- **`Esc` 2回押し**: 実行中のバックグラウンドエージェントを停止

「やり直し」のハードルが低いので、大胆にタスクを任せられます。

---

### 4. Run in the background — バックグラウンドで実行

**キーワード**: tasks、`/tasks`、`Ctrl+B`

長時間かかるタスクをバックグラウンドで実行し、メインの作業を続けられます：

- **`Ctrl+B`**: 実行中のコマンドやエージェントをバックグラウンドに移動
- **`/tasks`**: バックグラウンドタスクの一覧を確認
- 完了時に通知が表示される

テスト実行やビルドを裏で走らせながら、別の作業を進められます。

---

### 5. Teach Claude your rules — Claudeにルールを教える

**キーワード**: CLAUDE.md、`/memory`

プロジェクトごとのルールや好みをClaudeに覚えさせることができます：

- **CLAUDE.md**: プロジェクトルートに配置するルールファイル。コーディング規約、使用技術、注意点などを記述
- **`/memory`**: 自動メモリの管理。Claudeが作業中に学んだことを記録・参照

```markdown
# CLAUDE.md の例
- TypeScriptを使用
- テストはvitestで書く
- コミットメッセージは日本語で
```

一度設定すれば、毎回同じ指示を繰り返す必要がなくなります。

---

### 6. Extend with tools — ツールで拡張する

**キーワード**: MCP、`/mcp`

MCP（Model Context Protocol）を使って、外部ツールやサービスとClaude Codeを連携できます：

- **データベース接続**: SQLクエリを直接実行
- **Slack連携**: メッセージの送受信
- **GitHub連携**: Issue・PR操作の強化
- **カスタムAPI**: 社内ツールとの統合

```
claude mcp add slack -- npx @anthropic-ai/mcp-slack
```

`/mcp` コマンドでサーバーの有効/無効を切り替え、接続状態を確認できます。

---

### 7. Automate your workflow — ワークフローを自動化する

**キーワード**: skills、hooks

繰り返しの作業を自動化する2つの仕組み：

**Skills（スキル）**:
- `.claude/skills/` にMarkdownファイルとして定義
- スラッシュコマンドとして呼び出し可能
- 「コードレビューして」「PRを作って」などの定型タスクを標準化

**Hooks（フック）**:
- ツール実行の前後に自動でスクリプトを実行
- 例: ファイル保存後に自動フォーマット、コミット前にリント実行

---

### 8. Multiply yourself — 自分を増やす

**キーワード**: subagents、`/agents`

サブエージェントを使って、複数のタスクを並列で実行できます：

- **Explore エージェント**: コードベースの高速調査（Haiku搭載）
- **カスタムエージェント**: `.claude/agents/` にMarkdownで定義
- **Agent Teams（実験的）**: 複数エージェントがチームとして協働

```markdown
# .claude/agents/reviewer.md
---
description: セキュリティ観点のコードレビュー
model: sonnet
tools: [Read, Grep, Glob]
---
セキュリティ脆弱性を重点的にレビューしてください。
```

調査・分析をサブエージェントに委任すれば、メインコンテキストを節約しながら効率的に作業できます。

---

### 9. Code from anywhere — どこからでもコーディング

**キーワード**: `/remote-control`、`/teleport`

ターミナルで `/remote-control` を実行すると、そのセッションにスマホやブラウザからアクセスできるようになります：

```
> /remote-control
◐ connecting…
✓ Session available at claude.ai/code
```

- **出力の監視**: 長時間タスクの進捗をスマホで確認
- **プロンプト送信**: 外出先から追加指示
- **ツール承認**: 権限リクエストをリモートで承認

`/teleport` はClaude Code → Web（claude.ai/code）にセッションを転送する機能です。

> **注意**: Webで始めたチャットをClaude Codeにそのまま引き継ぐことはできません。
>
> - `/teleport` は **Claude Code → Web** 方向のみ対応
> - **Web → Claude Code** への転送は対応していません
>
> 現状、Web（claude.ai）で始めた会話のコンテキストをClaude Codeに持ち込む方法はありません。必要であれば、Webでの会話内容を手動でコピーしてClaude Codeに貼り付ける形になります。

**活用例**: 長時間タスクを開始 → ノートPC を閉じる → スマホで進捗確認

---

### 10. Dial the model — モデルを調整する

**キーワード**: `/model`、`/effort`

状況に応じてモデルと思考レベルを使い分けられます：

**モデル選択** (`/model`):

| モデル | 特徴 | 用途 |
|-------|------|------|
| Opus 4.6 | 最高性能 | 複雑な設計・難問 |
| Sonnet 4.6 | バランス型 | 日常的な開発タスク |
| Haiku 4.5 | 高速・低コスト | 簡単な質問・調査 |

**思考レベル** (`/effort`):

| レベル | 記号 | 用途 |
|-------|------|------|
| low | ○ | 単純な質問 |
| medium | ◐ | 一般的なタスク |
| high | ● | 複雑な問題解決 |

プロンプトで「ultrathink」と入力すると、一時的にhighレベルで深く考えさせることもできます。

---

## まとめ

`/powerup` は、Claude Codeの隠れた実力を引き出すための最短ルートです。10個のレッスンはそれぞれ独立しているので、気になるものから試してみてください。

### おすすめの進め方

1. **まず試す**: `/powerup` を実行してレッスンを眺める
2. **1日1つ**: 毎日1つのPower-upを試してみる
3. **実践で使う**: 学んだ機能を実際の作業で使ってみる
4. **全制覇**: 10/10 unlocked を目指す

```
Power-ups 10/10 unlocked ██████████████████
```

日々の開発がより効率的になるはずです。
