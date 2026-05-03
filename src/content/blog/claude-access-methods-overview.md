---
title: "【重要Tips】Claude Cowork / ブラウザ / Claude Code（端末） / Claude Code Web の使い分け早わかり"
date: 2026-05-03
updatedDate: 2026-05-03
category: "Claude技術解説"
tags: ["Claude", "Claude Cowork", "Claude Code", "初心者向け", "アクセス方法", "使い分け"]
excerpt: "Claude を使う4つの主要な入り口（Claude Cowork / ブラウザ / Claude Code 端末 / Claude Code Web）について、アクセスURL・実行場所・対象ユーザー・適した用途を初心者向けに整理。"
draft: false
---

## はじめに

「Claude を使い始めたい」と思ったとき、入り口は1つではありません。**どのアプリ／URLから入るかによって、使える機能・実行場所・対象ユーザーが大きく変わります**。

本記事では、代表的な4つの入り口について **「どこから使うのか」「実際の処理はどこで動くのか」「どんな人向けか」** を初心者向けに整理します。

> 詳細な接続パターンや認証フローは [MCPサーバーとClaudeの接続パターン解説](/mdTechKnowledge/blog/mcp-claude-connection-patterns/) を参照。

---

## 4つのアクセス方法 早見表

| 項目 | Claude Cowork | ブラウザ（claude.ai） | Claude Code（端末） | Claude Code Web |
|:---|:---|:---|:---|:---|
| **アクセスURL／入り口** | Slack（チャンネル内で `@Claude`） | [claude.ai](https://claude.ai/) | ターミナルで `claude` コマンド | [claude.ai/code](https://claude.ai/code) |
| **インストール** | Slack App を追加 | 不要（ブラウザだけ） | `npm install -g @anthropic-ai/claude-code` | 不要（ブラウザだけ） |
| **実行場所** | Anthropicクラウド | Anthropicクラウド | **自分のPC（端末）** | Anthropic管理の隔離VM |
| **主な用途** | チームでの相談・議論サマリ | 個人の質問・調べもの | コーディング・ローカル開発 | ブラウザでコード作業（PR作成等） |
| **ローカルファイル操作** | できない | できない | **できる** | クローンしたリポジトリのみ |
| **対象ユーザー** | チーム（Slack利用者） | 個人ユーザー全般 | 開発者 | 開発者（PCを離れているとき等） |

---

## 1. Claude Cowork — Slack の中で Claude と会話

**入り口**: Slack のチャンネルやDMで `@Claude` とメンション

Slack ワークスペースに Claude を招待して、チャットの流れの中でそのまま使える形態です。**チームでの利用を想定**しており、メンバー全員が同じ会話を見られます。

```
[Slackユーザー] →（@Claude メンション）→ [Slack上のClaude Cowork] → [Anthropicクラウド]
```

### 向いている使い方
- 会議の議事メモを Claude に要約してもらう
- 「このエラー、どう対応したらいい？」をチームのチャンネルで聞く
- ドキュメントの草案をチームで一緒に練る

### 向かない使い方
- ローカルのファイルを読み書きさせる（できません）
- 機密性が高くSlackに出したくない情報の処理

---

## 2. ブラウザ（claude.ai） — もっとも手軽な入り口

**入り口**: [https://claude.ai/](https://claude.ai/) にログインしてチャット

最も多くの人が最初に触れる形態です。Webブラウザだけあれば動き、インストールも不要。

```
[ユーザー端末] → HTTPS → [claude.ai] → [Anthropicクラウド]
```

### 向いている使い方
- 普段の質問・調べもの
- 文章・メールの下書き
- 画像やファイルをアップロードして内容を聞く
- カスタムコネクタ経由で Notion / GitHub などのSaaSと連携

### 向かない使い方
- 自分のPC内のファイルを直接編集させる（できません）
- 社内ネットワーク内のサーバーに接続させる（Anthropicクラウドからは到達不可）

---

## 3. Claude Code（端末） — 開発者の本命

**入り口**: ターミナルで `claude` コマンド（インストールが必要）

Claude をコマンドラインから使う開発者向けツールです。**処理は自分のPC上で動き**、Claude にローカルファイルを読ませたり編集させたりできます。

```
[ターミナル] → [自分のPC上の claude プロセス] → ローカルファイル操作
                       ↓ HTTPS（推論のみ）
                  [Anthropic API]
```

### 向いている使い方
- リポジトリ内のコードを読んでバグ修正・新機能追加
- 大規模なリファクタリング
- 社内VPN内のAPIや `localhost` ツールへの接続
- 認証情報をAnthropic側に置きたくないケース

### 向かない使い方
- PCを持っていない／Slackやブラウザだけで完結したい場面
- チーム全員で同じセッションを共有したい場面（個人端末ごとの利用が前提）

---

## 4. Claude Code Web — ブラウザで動かす Claude Code

**入り口**: [https://claude.ai/code](https://claude.ai/code)

Claude Code を **ブラウザから動かせる** バージョン。ただし処理は自分のPCではなく、**Anthropic が用意した隔離VM（サンドボックス）**で動きます。

```
[ユーザーブラウザ] → [claude.ai/code UI] → [隔離VM（Claude Code実行）]
                                              ↓ HTTPS
                                          [GitHub等]
```

GitHub と連携し、リポジトリをクローンしてコード編集や PR 作成ができます。**自分のPCに何もインストールせず、コードを触れる**のが大きな利点です。

### 向いている使い方
- 外出先・タブレット・Chromebook など、PCに開発環境がない状況
- 「リポジトリの Issue に従ってPRを作る」などの隔離された自動作業
- 複数の作業を並行に走らせたい

### 向かない使い方
- 社内ネットワーク内のサーバーへの接続（隔離VMからは到達不可）
- 自分のPCのローカルファイルを直接触る作業

---

## アクセスURL一覧

| 入り口 | URL／コマンド |
|:---|:---|
| Claude Cowork | Slackで `@Claude` メンション（事前にApp追加が必要） |
| ブラウザ | [https://claude.ai/](https://claude.ai/) |
| Claude Code（端末） | `npm install -g @anthropic-ai/claude-code` → `claude` コマンド |
| Claude Code Web | [https://claude.ai/code](https://claude.ai/code) または [https://code.claude.com/](https://code.claude.com/) |
| Anthropic Console（API管理） | [https://console.anthropic.com/](https://console.anthropic.com/) |

---

## どれを使えばよい？ 簡易フローチャート

```
┌─ 何をしたい？
│
├─ チームでSlackの中で相談したい
│     → Claude Cowork
│
├─ 個人でちょっと質問したい・調べたい
│     → ブラウザ（claude.ai）
│
├─ コードを書きたい
│     │
│     ├─ 自分のPCのファイルを編集したい
│     │     → Claude Code（端末）
│     │
│     └─ ブラウザだけで完結させたい／PCがない
│           → Claude Code Web
│
└─ 社内ネットワーク内のサーバーに繋ぎたい
      → Claude Code（端末）一択
        （ブラウザ系・Web系はAnthropicクラウドから繋がるため到達不可）
```

---

## 実行場所のイメージ図

「処理が実際にどこで動いているか」を理解すると、向き不向きが直感的にわかります。

```
[ あなたのPC ]
  └─ Claude Code（端末）─────────┐
                                  │
[ Slack ]                         │   推論
  └─ Claude Cowork ───────────────┤───→ [ Anthropic API ]
                                  │
[ ブラウザ ]                      │
  ├─ claude.ai ───────────────────┤
  │                               │
  └─ claude.ai/code ──→ [Anthropic管理 隔離VM]
                                  │
                                  └─→ [外部MCP/GitHub等]
```

ポイント:
- **Claude Code（端末）だけが「あなたのPC」上で動く**。ローカルファイルや社内ネットワークに自然にアクセスできる理由はこれ。
- **その他3つは Anthropic 側のサーバー上で動く**。便利だが、ローカル資源や社内ネットワークには直接届かない。

---

## よくある誤解

| 誤解 | 実際 |
|:---|:---|
| 「ブラウザで Claude Code Web を使えば自分のPCのファイルを編集できる」 | ❌ Web版は隔離VM上で動くので、自分のPCのファイルは見えない。GitHubリポジトリをクローンする形でコードを扱う |
| 「Claude Cowork は Anthropic のサブスクとは別契約」 | ❌ Cowork は Anthropic の公式ツール。Pro/Maxサブスクの範囲内で使える |
| 「Claude Code（端末）は重い処理をすると自分のPCが遅くなる」 | △ モデルの推論は Anthropic サーバー側。PC側はファイル操作・差分計算など軽処理が中心 |
| 「どれを使っても料金は同じ」 | ❌ 公式ツール（4つすべて）はサブスク内、API キー経由のサードパーティツールは別途従量課金 |

---

## まとめ

| 入り口 | 一言で言うと |
|:---|:---|
| **Claude Cowork** | 「Slackの中でチームで使う Claude」 |
| **ブラウザ** | 「最も手軽な、個人用 Claude」 |
| **Claude Code（端末）** | 「自分のPC上で動く、開発者向け Claude」 |
| **Claude Code Web** | 「ブラウザで動かす、サンドボックス版 Claude Code」 |

迷ったら:
- 開発者なら **Claude Code（端末）** を1つ入れておく
- それ以外の用途は **ブラウザ（claude.ai）** で十分
- チーム共有が必要になったら **Claude Cowork** を追加
- PCを離れているときに使いたければ **Claude Code Web**

---

## 参考資料

- [Claude — Anthropic](https://claude.ai/)
- [Claude Code Docs](https://code.claude.com/)
- [MCPサーバーとClaudeの接続パターン解説](/mdTechKnowledge/blog/mcp-claude-connection-patterns/)
- [【重要Tips】Claude Codeの実行場所はどこ？](/mdTechKnowledge/blog/claude-code-execution-environments/)

---

*本記事は2026年5月時点の情報に基づいています。各サービスのURL・機能は予告なく変更される可能性があります。*
