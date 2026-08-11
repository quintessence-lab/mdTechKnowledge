---
title: "【重要Tips】Claude Codeの実行場所はどこ？～端末上？クラウド上？"
date: 2026-04-16
updatedDate: 2026-08-11
category: "Claude技術解説"
tags: ["Claude Code", "CCR", "Routines", "クラウド", "実行環境", "Self-hosted", "Enterprise"]
excerpt: "Claude Codeには4つの実行環境があります。ローカルCLI・CCR・Cloud版Web UI・Routinesの違いをアクセスURL・実行場所・操作方法・用途・プラン要件で整理します。"
draft: false
---

## はじめに

「Claude Codeってどこで動いているの？」——この問いに対する答えは、**使い方によって異なります**。2026年4月現在、Claude Codeには4つの実行環境があり、それぞれ実行場所・操作方法・用途が異なります。

この記事では、4つの環境を一覧比較し、それぞれの特徴と使い分けを整理します。

---

## 一覧比較

| 項目 | ローカルCLI | CCR（Cloud Code Remote） | Cloud版 Web UI | Routines |
|:---|:---|:---|:---|:---|
| **実行場所** | 自分のPC | Anthropicクラウド（サンドボックス） | Anthropicクラウド（サンドボックス） | Anthropicクラウド（サンドボックス） |
| **操作方法** | ターミナル直接操作 | ターミナルからリモート接続 | ブラウザ | 無人自動実行 |
| **アクセスURL** | — （`npm install -g @anthropic-ai/claude-code`） | — （`claude --remote` でターミナルから接続） | [claude.ai/code](https://claude.ai/code) または [code.claude.com](https://code.claude.com) | [claude.ai/code](https://claude.ai/code) の Routines タブ |
| **ファイルアクセス** | ローカルファイルに直接アクセス | クラウド上のサンドボックス内 | クラウド上のサンドボックス内 | クラウド上のサンドボックス内 |
| **GitHub連携** | `git`/`gh` コマンド経由 | GitHub リポジトリをクローン | GitHub リポジトリをクローン | GitHub リポジトリをクローン |
| **PC電源** | 必要 | セッション中は必要 | セッション中は必要 | **不要**（PCオフでも実行） |
| **対話性** | 対話的 | 対話的 | 対話的 | **非対話的**（トリガー駆動） |
| **主な用途** | 通常の開発作業 | Ultraplan、重い処理のオフロード | ブラウザベースの開発 | 定期実行・イベント駆動の自動化 |

---

## 各環境の詳細

### 1. ローカルCLI

最もベーシックな使い方です。自分のPCのターミナルでClaude Codeを直接実行します。

```bash
# インストール
npm install -g @anthropic-ai/claude-code

# 起動
claude
```

**特徴:**
- ローカルファイルに直接アクセスできる（最も自由度が高い）
- PC上のツール（Docker、データベース、ブラウザ等）をそのまま利用可能
- ネットワーク不要の作業も可能（キャッシュ済みなら）
- PCの電源を切ると停止する

**向いている作業:** 日常的な開発、ローカルファイルの編集、テスト実行、git操作

### 2. CCR（Cloud Code Remote）

ターミナルから Anthropic のクラウドサンドボックスにリモート接続して使います。Ultraplanなどの機能で利用されます。

```bash
# リモートセッション起動
claude --remote
```

**特徴:**
- 処理はクラウド上で実行されるため、PCの性能に依存しない
- GitHub リポジトリをクローンして作業
- Ultraplanでは、クラウド上でプランを立ててローカルにテレポート返却する流れ
- セッション中はターミナルを開いておく必要がある

**向いている作業:** 大規模なコード生成、Ultraplanによるプランニング、PCスペックに制約がある場合

### 3. Cloud版 Web UI

ブラウザから直接Claude Codeを使う方法です。ターミナルに馴染みがない方や、出先で使いたい場合に便利です。

**アクセスURL:**
- [https://claude.ai/code](https://claude.ai/code)
- [https://code.claude.com](https://code.claude.com)

**特徴:**
- ブラウザだけで完結（CLIのインストール不要）
- GitHubリポジトリを接続して作業
- UIはチャット形式で、コード編集・ターミナル操作が統合されている
- CLIと同等の機能を備えている

**向いている作業:** CLIを入れていない端末からの作業、ブラウザベースの開発、チームでの共有

### 4. Routines

2026年4月にリサーチプレビューとしてリリースされた、**無人自動実行**の仕組みです。人間が操作するのではなく、トリガーに応じてClaude Codeが自動的に起動・実行・終了します。

**設定URL:**
- [https://claude.ai/code](https://claude.ai/code) の Routines タブから設定

**トリガーの種類:**
- **スケジュール**: cron式で定期実行（例: 毎朝9時にコードレビュー）
- **API**: 外部システムからHTTPリクエストで起動
- **GitHubイベント**: Issue作成、PR作成などをトリガーに自動実行

**特徴:**
- PCの電源が切れていても実行される
- MCPコネクタ（Slack、Linear、Google Drive等）と連携可能
- 実行ごとにフルのClaude Codeクラウドセッションが起動
- 実行結果はメールやSlackで通知可能

**プラン別の利用上限（2026-04時点）:**

| プラン | 1日あたりの実行回数上限 |
|:---|:---|
| Pro | 5 回/日 |
| Max | 15 回/日 |
| Team / Enterprise | 25 回/日 |

> Pro プランでも Routines は試用可能（少回数）。継続利用は Max 以上が現実的。

**向いている作業:** 定期的なコードレビュー、依存関係の更新チェック、Issue対応の自動化、レポート生成

**参考:**
- [Claude Code Routines 公式](https://code.claude.com/docs/en/routines)
- [SiliconANGLE: Routines 解説](https://siliconangle.com/2026/04/14/anthropics-claude-code-gets-automated-routines-desktop-makeover/)

---

## 共通のクラウド基盤

CCR・Cloud版・Routinesの3つは、いずれも**Anthropicが管理するクラウドサンドボックス**上で動作します。基盤は共通ですが、起動・操作の方法が異なります。

```
                    Anthropicクラウド基盤
                   （サンドボックスコンテナ）
                  ┌─────────────────────┐
                  │  Claude Code 実行   │
                  │  + GitHub クローン   │
                  │  + MCP コネクタ      │
                  └──────┬──────────────┘
                         │
           ┌─────────────┼─────────────┐
           │             │             │
     ターミナル接続   ブラウザ接続    トリガー起動
       (CCR)        (Web UI)      (Routines)
```

ローカルCLIだけが例外で、自分のPC上で直接動作します。

---

## 【2026-07追記】Claude Desktop for Linux（ベータ）

2026年6月30日、**Claude Desktop の Linux版が公式ベータ**として公開されました。macOS/Windows版に続く3プラットフォーム目です。

| 項目 | 内容 |
|:---|:---|
| 対応ディストリ | **Ubuntu 22.04 以降・Debian 12（bookworm）以降** |
| アーキテクチャ | x86_64・arm64 |
| インストール方法 | Anthropic 公式 **apt リポジトリ**（署名鍵取得 → リポジトリ追加 → `apt install claude-desktop`）。以後は `apt` 経由で自動更新 |
| 提供機能 | macOS/Windows と**同じ Chat・Cowork・Claude Code 体験**（並列セッション・ビジュアル diff レビュー・統合ターミナル/エディタ・ライブアプリプレビュー） |
| 未対応機能 | **Computer Use**（アプリ直接操作）・**音声入力**は Linux版では未提供（Computer Use は今後対応予定、音声入力は時期未定） |
| 未対応ディストリ | Fedora / RHEL / Arch は現時点で非対応（今後拡大予定） |

これでローカルCLI・CCR・Cloud版・Routines・**Desktop アプリ**という主要な実行環境が、Linux でも macOS/Windows と同等に揃いつつあります。出典: [Claude Desktop on Linux（公式）](https://code.claude.com/docs/en/desktop-linux)。

---

## 【2026-08追記】Self-hosted environments（ベータ）— 自社インフラでクラウドセッションを実行

2026年8月7日（Claude Code v2.1.224）、**Self-hosted environments**が Team / Enterprise プラン向けに**パブリックベータ**として追加されました。CCR・Cloud版 Web UI・Routinesは、これまで必ず**Anthropicが管理するクラウドサンドボックス**上で動作していましたが、この新機能により、同じ「クラウドセッション」（開発者自身のマシン以外で動くセッション全般の総称）を**自社が管理するインフラ上で実行**できるようになります。

### 仕組み

自社ホスティングは3つの要素で構成されます。

| 要素 | 内容 |
|:---|:---|
| **Environment（環境）** | claude.ai の admin settings で作成する、ランナーをグループ化した名前付きの送信先 |
| **Runner（ランナー）** | 自社ネットワーク内のホストで稼働させる長時間プロセス。セッションをキューから取得して実行する（自己ホスト型CIランナーと同じ発想） |
| **Session（セッション）** | 開発者が開始した1つのClaude Codeタスク。ランナーが子プロセスとして起動する |

開発者がクラウドセッションを開始する際、環境選択UIにAnthropicホスト型の環境と並んで自社作成の環境が表示されます。自社環境を選ぶと、Anthropicの制御プレーンがセッションを環境のキューに配置し、空き容量のあるランナーがそれを取得してリポジトリをクローンし、Claude Codeプロセスを自社ホスト上で起動します。

### ネットワーク設計

すべての通信は**自社ネットワークからの outbound HTTPS のみ**（`api.anthropic.com` 宛てのキューポーリング・イベントストリーム・モデル推論）で、**Anthropicから自社ネットワークへの inbound 接続は一切発生しません**。リポジトリのチェックアウト・ビルド成果物・シークレット・セッションが作成/変更したファイルはすべて自社が管理するマシン上に留まりますが、会話内容（プロンプト・応答・ツール結果）はモデル推論のため `api.anthropic.com` に送信され、セッション再開のためにAnthropic側でトランスクリプトが保存されます。

### 主な制約

- **対象プラン**: Team / Enterprise の**パブリックベータ**、既定は無効（admin が Cloud environments 管理ページで有効化）
- **Zero Data Retention 組織では利用不可**
- モデル推論は Anthropic API 経由のみ。**Amazon Bedrock / Google Cloud のAgent Platform / Microsoft Foundry / LLM gateway 経由のルーティングは不可**
- 対応サーフェス: Web UI・モバイル/デスクトップアプリ・Routines・`claude --cloud`（ターミナルから）。**Claude Tag・Claude Security・Code Review のセッションは未対応**（今後個別対応予定）
- リポジトリは GitHub のみ
- 課金は通常のAnthropicホスト型クラウドセッションと同様、組織のClaude Code利用量として計上される

### 向いているケース

Anthropicホスト型のほうがインフラ運用不要で大半のチームに向きますが、自社ホスティングは**社内ネットワークのDB・レジストリへのアクセスが必要**、**コンパイラ・SDK・社内CLIを事前インストールした専用ランナーイメージを使いたい**、**リポジトリチェックアウトや成果物を自社管理インフラ内に留めたい**（コンプライアンス要件）といったチーム向けです。その代わり、ランナーイメージの構築・フリート運用・ネットワーク管理は自社の責任になります。

これでローカルCLI・CCR・Cloud版・Routines・Desktop アプリに加え、**Self-hosted環境**という第6の選択肢が加わったことになります（CCR・Cloud版・Routinesの実行場所を、Anthropic管理か自社管理かで選べるようになった、という位置づけです）。

出典: [Self-hosted environments（公式ドキュメント）](https://code.claude.com/docs/en/self-hosted-environments) / [Anthropic公式ブログ: Run Claude Code sessions on your own compute](https://claude.com/blog/run-claude-code-sessions-on-your-own-compute)

---

## プラン要件

| 環境 | 必要なプラン |
|:---|:---|
| ローカルCLI | Free 以上（Max推奨） |
| CCR | Max / Team / Enterprise |
| Cloud版 Web UI | Max / Team / Enterprise |
| Routines | **Pro / Max / Team / Enterprise**（リサーチプレビュー、プラン別上限あり） |

CCR・Cloud版 Web UI は **Maxプラン以上** が必要。Routines のみ **Pro でも試用可能**（5回/日）です。

---

## まとめ

- **普段の開発** → ローカルCLI
- **重い処理やUltraplan** → CCR
- **ブラウザで手軽に** → Cloud版 Web UI
- **定期実行・自動化** → Routines

4つの環境はすべて同じClaude Codeですが、**実行場所と起動方法が異なる**だけです。用途に応じて使い分けることで、Claude Codeの能力を最大限に活用できます。
