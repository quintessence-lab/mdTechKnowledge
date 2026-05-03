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
| **アクセスURL／入り口** | **Claude Desktop の Cowork タブ**（補助: Slackコネクタ／モバイルアプリ） | [claude.ai](https://claude.ai/) | ターミナルで `claude` コマンド | [claude.ai/code](https://claude.ai/code) |
| **インストール** | [claude.com/download](https://claude.com/download) からClaude Desktopを取得 | 不要（ブラウザだけ） | `npm install -g @anthropic-ai/claude-code` | 不要（ブラウザだけ） |
| **実行場所** | **自分のPC（Desktopアプリ）** + Anthropicクラウド | Anthropicクラウド | **自分のPC（端末）** | Anthropic管理の隔離VM |
| **主な用途** | チーム業務の自動化（Slack/Drive/Notion連携・定期実行） | 個人の質問・調べもの | コーディング・ローカル開発 | ブラウザでコード作業（PR作成等） |
| **ローカルファイル操作** | **できる**（Desktop経由） | できない | **できる** | クローンしたリポジトリのみ |
| **対象ユーザー** | チーム（Team以上のプラン） | 個人ユーザー全般 | 開発者 | 開発者（PCを離れているとき等） |

---

## 1. Claude Cowork — Desktopアプリで動くチーム業務向けエージェント

**入り口（本体）**: Claude Desktop アプリの **Cowork タブ**（macOS / Windows）
**補助入口**: Slackコネクタ（Cowork内からSlackを参照／投稿）、モバイルアプリ（iOS/Android、タスク投入・進捗確認）

Cowork は **Claude Desktop アプリに内蔵された3つのモード（Chat / Cowork / Code）の1つ**で、ローカルファイル操作や Computer Use、Routines（定期実行）などを含むエージェント機能を備えます。Team 以上のプラン契約者が利用可能。

```
[ あなたのPC (Claude Desktop) ]
         │
   Coworkタブ ─→ [Anthropicクラウド: 推論・Routines]
         │
         ├─→ ローカルファイル操作
         ├─→ [Slack] 連携（読み取り／投稿）
         ├─→ [Google Drive / Notion / GitHub 等]
         └─→ Computer Use（画面操作の自動化）
```

> **「Slack版Cowork」という独立アプリは存在しない**。Slackは Cowork の入口の1つ（コネクタ）で、本体は Desktop。Slack側からClaudeをメンションする `Claude for Slack` (Interactive App) は別アプリで、Coworkのフル機能（ローカルFS操作・Routines等）は持たない。
> なお claude.ai（ブラウザ）は Cowork 非対応で、Chat のみ。

### Coworkでチームで利用する例

Cowork は「チームの会話をその場で全員で見る」形ではなく、**共有データソース（Slack/Drive/Notion等）とRoutinesを通じて、チーム業務を分担・自動化する**形が中心です。

| 用途 | 具体例 |
|:---|:---|
| **会議の自動整理** | Google Calendarの予定を読み取り→終了後にSlack/Notionの共有先に議事サマリを自動投稿 |
| **デイリースタンドアップ補助** | 毎朝Routinesで前日のSlackチャンネル要約・GitHub PR/Issue状況を生成→チームチャンネルへ投稿 |
| **問い合わせ対応のドラフト** | 共有Slackチャンネルの質問を読み、過去のNotion FAQから回答ドラフトを生成→担当者がレビュー後に送信 |
| **週次レポート生成** | 共有ドライブの数字を集計→週末にレポート生成→担当者にDM／チャンネル投稿 |
| **コードレビューの下書き** | GitHub PRの差分を取得→レビューコメント案を生成→担当者がチームに投げる前にチェック |
| **議論の論点整理** | 長くなったSlackスレッドを Cowork で要約→「未決事項」「次のアクション」を抽出してピン留め |

ポイント:
- **個々のメンバーがそれぞれDesktop上でCoworkを実行**する。同一会話をリアルタイム共有するのではなく、**結果を共有先（Slack等）に出す**ことでチーム共有する
- **Routines** によって「人がいなくても定期的に走る」ため、チームの定型業務を肩代わりさせやすい
- **Slackコネクタ** はCoworkから「読み」「書き」両方ができるので、Slackをハブにして情報の入出力を集約できる

### 向いている使い方
- チーム共有リソース（Slack/Drive/Notion/GitHub）を横断した定型業務の自動化
- 議事録・週報・ステータスサマリの定期生成と共有チャンネルへの投稿
- Routinesによる無人実行（PCがオンのとき）

### 向かない使い方
- メンバー全員が同じ会話セッションをリアルタイム共有して議論する用途（個人セッションが基本）
- Team未満（Free/Pro個人）プランでの利用（Coworkは Team 以上）

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
| Claude Cowork（本体） | Claude Desktop を [https://claude.com/download](https://claude.com/download) から取得 → 起動後 **Cowork タブ**を選択（Team以上） |
| Claude Cowork（補助：モバイル） | App Store / Google Play の Claude 公式アプリ |
| Claude for Slack（別アプリ） | [https://claude.com/claude-for-slack](https://claude.com/claude-for-slack) — Coworkのフル機能ではない |
| ブラウザ（Cowork非対応） | [https://claude.ai/](https://claude.ai/) |
| Claude Code（端末） | `npm install -g @anthropic-ai/claude-code` → `claude` コマンド |
| Claude Code Web | [https://claude.ai/code](https://claude.ai/code) または [https://code.claude.com/](https://code.claude.com/) |
| Anthropic Console（API管理） | [https://console.anthropic.com/](https://console.anthropic.com/) |

---

## どれを使えばよい？ 簡易フローチャート

```
┌─ 何をしたい？
│
├─ チームでSlack/Drive/Notion等を横断した業務を自動化したい
│     → Claude Cowork（Desktop）+ Slack/各種コネクタ
│       Routinesで定期実行も可
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
  ├─ Claude Code（端末・CLI）────┐
  │                              │
  └─ Claude Desktop              │  推論
       └─ Cowork タブ ───────────┤───→ [ Anthropic API ]
            ├─→ ローカルFS       │
            ├─→ Slack/Drive/Notion等
            └─→ Computer Use     │
                                 │
[ ブラウザ ]                     │
  ├─ claude.ai（Chatのみ）───────┤
  │                              │
  └─ claude.ai/code ──→ [Anthropic管理 隔離VM]
                                 │
                                 └─→ [外部MCP/GitHub等]
```

ポイント:
- **Claude Code（端末）と Claude Cowork（Desktop）は「あなたのPC」上で動く**。ローカルファイルや社内ネットワークに自然にアクセスできる理由はこれ。
- **ブラウザ系（claude.ai / claude.ai/code）は Anthropic 側のサーバー上で動く**。便利だが、ローカル資源や社内ネットワークには直接届かない。

---

## まとめ

| 入り口 | 一言で言うと |
|:---|:---|
| **Claude Cowork** | 「Desktopアプリで動く、チーム業務自動化エージェント」（Slackは入口の1つ） |
| **ブラウザ** | 「最も手軽な、個人用 Claude」（Coworkは非対応） |
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
