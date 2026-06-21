---
title: "Claude Code Plugin Marketplace ガイド — slash/hooks/サブエージェント/skills を束ねて配布・導入する"
date: 2026-06-21
category: "Claude技術解説"
tags: ["Claude Code", "プラグイン", "Marketplace", "slash commands", "hooks", "サブエージェント", "skills", "MCP"]
excerpt: "Claude Code のプラグインは、slash commands・hooks・サブエージェント・skills・MCP サーバーを1つのパッケージに束ねて配布・導入できる仕組みです（2025年10月 公開ベータ）。/plugin コマンドでの検索・インストール、公式マーケットプレイス claude-plugins-official とサードパーティ/自前マーケットプレイスの追加方法、plugin.json の構成、作成の流れまでを公式ドキュメントベースで整理します。"
draft: false
---

## プラグインとは？ — 4つの拡張要素を「1つに束ねる」仕組み

Claude Code の**プラグイン（Plugin）**は、これまで個別に設定していた拡張機能を1つのパッケージにまとめ、**登録・配布・導入**できるようにする仕組みです。2025年10月9日に全ユーザー向けの**公開ベータ**として発表されました。

これまで Claude Code を自分好みにカスタマイズするには、`.claude/commands/` に slash command を、`.claude/agents/` にサブエージェントを、`settings.json` に hooks を…とバラバラに置く必要がありました。プラグインは、これらを**ひとまとめにして「インストール」「アンインストール」「オン/オフ」できる単位**にしたものです。チームでの標準化や、OSS としての配布が一気に簡単になります。

> **補足**: 公開ベータの発表は公式ブログ（claude.com/blog/claude-code-plugins）で「2025年10月9日」とされています。本記事の機能挙動・コマンド名は公式ドキュメント（code.claude.com/docs）に準拠しています。

### プラグインが束ねられる要素

プラグイン1つには、以下の拡張要素を任意に組み合わせて含められます。

| 要素 | 役割 | 単体での設定場所（従来） |
|------|------|--------------------------|
| **Slash commands** | よく使う操作を `/コマンド` として呼び出す | `.claude/commands/` |
| **Hooks** | ツール実行などの前後に自動でスクリプトを走らせる | `settings.json` の `hooks` |
| **Sub-agents（サブエージェント）** | 特定タスク専用の補助エージェント | `.claude/agents/` |
| **Skills** | Markdown で定義する手順・専門知識のパッケージ | `.claude/skills/` |
| **MCP servers** | 外部サービス・データソースとの連携（Model Context Protocol） | `claude mcp add` 等 |

プラグインによっては、上記に加えて **LSP サーバー**（言語サーバー連携によるコードナビゲーション・診断）を含むものもあります。

各要素そのものの基礎は、[Claude Code パワーアップガイド](/mdTechKnowledge/blog/claude-code-powerup-guide/) や [Claude Code の CLAUDE.md とメモリの仕組み](/mdTechKnowledge/blog/claude-code-claudemd-memory-guide/)、[MCPサーバーとClaudeの接続パターン解説](/mdTechKnowledge/blog/mcp-claude-connection-patterns/) でも解説しています。プラグインは「それらをまとめて配る箱」と捉えると分かりやすいです。

---

## マーケットプレイスの考え方 — 「ストアを追加」→「アプリを入れる」

プラグインは**マーケットプレイス（Marketplace）**経由で配布されます。マーケットプレイスとは、誰かが作って公開した**プラグインのカタログ**です。利用は2ステップで考えると整理できます。

1. **マーケットプレイスを追加する**: カタログを Claude Code に登録する。この時点ではまだ何もインストールされません（＝閲覧できるようになるだけ）。
2. **個別のプラグインをインストールする**: カタログを見て、欲しいプラグインだけを入れる。

公式ドキュメントは「アプリストアを追加するようなもの。ストアを追加すると中身を見られるが、どのアプリを入れるかは自分で選ぶ」とたとえています。

---

## `/plugin` コマンドの使い方

プラグイン管理の中心が `/plugin` コマンドです。Claude Code のプロンプトで `/plugin` を実行すると、4つのタブを持つ管理画面が開きます。タブは **Tab**（戻るときは **Shift+Tab**）で切り替えます。

| タブ | 役割 |
|------|------|
| **Discover** | 追加済みの全マーケットプレイスからプラグインを検索・閲覧する |
| **Installed** | インストール済みプラグインの確認・有効化/無効化/アンインストール |
| **Marketplaces** | マーケットプレイスの追加・更新・削除 |
| **Errors** | プラグイン読み込み時のエラー確認 |

Discover タブでプラグインを選ぶと、インストール前に中身を確認できる詳細ペインが表示されます。新しめのバージョンでは次の情報も表示されます。

- **Context cost**: そのプラグインが毎ターンのコンテキストに追加するおおよそのトークン量（v2.1.143 以降）
- **Last updated**: 最終更新日（v2.1.144 以降）
- **Will install**: 追加される commands / agents / skills / hooks / MCP・LSP サーバーの一覧（v2.1.145 以降）

### 主要コマンドまとめ

UI を開かずにコマンドラインから直接操作することもできます。

| コマンド | 動作 |
|----------|------|
| `/plugin` | プラグイン管理画面（4タブ）を開く |
| `/plugin install <name>@<marketplace>` | プラグインをインストール（既定は user スコープ） |
| `/plugin list` | インストール済みプラグインを一覧表示（`--enabled` / `--disabled` で絞り込み） |
| `/plugin disable <name>@<marketplace>` | 削除せずに無効化 |
| `/plugin enable <name>@<marketplace>` | 無効化したプラグインを再有効化 |
| `/plugin uninstall <name>@<marketplace>` | 完全に削除 |
| `/plugin marketplace add <source>` | マーケットプレイスを追加 |
| `/plugin marketplace list` | 追加済みマーケットプレイスの一覧 |
| `/plugin marketplace update <name>` | カタログを最新化 |
| `/plugin marketplace remove <name>` | マーケットプレイスを削除（入れたプラグインも消える） |
| `/reload-plugins` | セッション再起動なしで変更を反映 |

> **ヒント**: `/plugin marketplace` は `/plugin market` と短縮でき、`remove` は `rm` と書けます。

### `/skills`（リアルタイムフィルタ）との関係

プラグインが提供する skill は**プラグイン名で名前空間化**されます。例えば `commit-commands` プラグインを入れると、skill は `/commit-commands:commit` のように呼び出します。インストール・有効化・無効化を行った直後は `/reload-plugins` を実行すると、セッションを再起動せずに反映できます（再読み込み時には次リクエストでトークンコストが発生する点に注意）。

利用可能な skill を探すときは `/skills` を使うと、入力に応じてリアルタイムにフィルタしながら目的の skill を絞り込めます。プラグイン由来の skill も `プラグイン名:skill名` の形でここに並びます。

---

## 公式・コミュニティ・サードパーティ マーケットプレイスの違い

マーケットプレイスには大きく分けて、Anthropic 公式・コミュニティ・サードパーティ（自前含む）の3種類があります。性格が異なるので使い分けます。

| 種類 | マーケットプレイス名 / 追加元 | 追加の要否 | 性格 |
|------|------------------------------|------------|------|
| **公式** | `claude-plugins-official`（リポジトリ `anthropics/claude-plugins-official`） | 起動時に**自動で利用可能** | Anthropic がキュレーションした高品質プラグイン集 |
| **コミュニティ** | `claude-community`（`anthropics/claude-plugins-community`） | **手動で追加**が必要 | 自動検証・安全性スクリーニングを通過したサードパーティ製。各プラグインは特定コミット SHA に固定 |
| **デモ** | `claude-code-plugins`（`anthropics/claude-code`） | **手動で追加**が必要 | プラグインシステムの可能性を示すサンプル集 |
| **サードパーティ/自前** | 任意の Git リポジトリ・URL・ローカルパス | **手動で追加**が必要 | 個人・チーム・OSS が独自に配布。中身は Anthropic の管理外 |

### 公式マーケットプレイスからのインストール

公式マーケットプレイス `claude-plugins-official` は Claude Code 起動時に自動で使えます。`/plugin` の Discover タブで閲覧するか、ウェブの [claude.com/plugins](https://claude.com/plugins) でカタログを見られます。インストールは次の形式です。

```shell
/plugin install github@claude-plugins-official
```

もし「プラグインが見つからない」と表示される場合は、マーケットプレイスが未追加か古い可能性があります。`/plugin marketplace update claude-plugins-official` で更新するか、未追加なら `/plugin marketplace add anthropics/claude-plugins-official` で追加してから再試行します。

公式マーケットプレイスには、外部連携（`github`, `gitlab`, `slack`, `notion`, `linear`, `figma` など MCP サーバーを同梱）、コードインテリジェンス（`pyright-lsp`, `typescript-lsp` などの LSP 連携）、自動セキュリティレビュー（`security-guidance`）、開発ワークフロー（`commit-commands`, `pr-review-toolkit`, `plugin-dev` など）といったカテゴリが揃っています。`security-guidance` の中身は [Claude Security Beta の解説](/mdTechKnowledge/blog/claude-security-beta/) とあわせて読むと理解が深まります。

> **注意**: 公式マーケットプレイスへの掲載は Anthropic の裁量によるキュレーションです。アプリ内の投稿フォームから登録されるのは**コミュニティマーケットプレイス**であり、公式ではありません。独自に配布したい場合は自前のマーケットプレイスを作って共有します。

### サードパーティ/自前マーケットプレイスの追加方法

`/plugin marketplace add` は複数のソース形式に対応しています。

| ソース | 書き方の例 |
|--------|-----------|
| GitHub リポジトリ | `/plugin marketplace add anthropics/claude-code`（`owner/repo` 形式） |
| 任意の Git URL（GitLab/Bitbucket/自前） | `/plugin marketplace add https://gitlab.com/company/plugins.git` |
| 特定のブランチ/タグ | `/plugin marketplace add https://gitlab.com/company/plugins.git#v1.0.0` |
| ローカルパス | `/plugin marketplace add ./my-marketplace` |
| リモートの marketplace.json | `/plugin marketplace add https://example.com/marketplace.json` |

GitHub やその他 Git ホストの場合、リポジトリのルート（正確には `.claude-plugin/marketplace.json`）にカタログ定義が必要です。Git URL を使うときは `.git` 接尾辞を付けると、URL を直接の JSON リンクではなくクローン対象として扱ってくれます。

コミュニティマーケットプレイスを使う場合は次のように追加・インストールします。

```shell
/plugin marketplace add anthropics/claude-plugins-community
/plugin install <plugin-name>@claude-community
```

GitHub 連携プラグインの背景は [GitHub MCP サーバ導入のメリットとデメリット](/mdTechKnowledge/blog/github-mcp-merits-demerits/) も参照してください。

---

## チームでの共有とインストールスコープ

プラグインはインストール先（スコープ）を選べます。チーム運用では特に重要です。

| スコープ | 適用範囲 | 設定の保存先 |
|----------|----------|--------------|
| **User**（既定） | 自分の全プロジェクト | ユーザー設定 |
| **Project** | このリポジトリの全コラボレーター | `.claude/settings.json`（共有） |
| **Local** | このリポジトリの自分だけ | ローカル設定（非共有） |

チーム管理者は、プロジェクトの `.claude/settings.json` に `extraKnownMarketplaces` を追記しておくことで、メンバーがフォルダを信頼した際に**マーケットプレイス追加とプラグイン導入を促す**よう設定できます。

```json
{
  "extraKnownMarketplaces": {
    "my-team-tools": {
      "source": { "source": "github", "repo": "your-org/claude-plugins" }
    }
  }
}
```

公式マーケットプレイスは既定で自動更新が有効です。サードパーティ/ローカル開発用は既定で無効なので、必要なら UI（Marketplaces タブ）からプラグインごとに自動更新を切り替えます。

---

## プラグインを作る — 構成と plugin.json の概要

自分のプラグインを作るのも、基本的にはディレクトリにファイルを配置するだけです。最小構成のイメージは次のとおりです。

```
my-plugin/
├── .claude-plugin/
│   └── plugin.json        # プラグインのメタデータ（名前・説明・バージョン等）
├── commands/              # slash commands
├── agents/                # サブエージェント
├── skills/                # skills（Markdown）
├── hooks/                 # hooks 定義
└── .mcp.json              # 同梱する MCP サーバー（任意）
```

`plugin.json` にプラグイン名や説明、バージョンなどのメタデータを記述し、`commands/` `agents/` `skills/` `hooks/` に各拡張要素を置きます。配布するには、これらを含むリポジトリのルートに `.claude-plugin/marketplace.json`（カタログ）を用意し、`/plugin marketplace add owner/repo` で追加できる状態にします。

> **推測**: 上記のディレクトリ名・ファイル構成は公式の例に基づく一般形です。`plugin.json` / `marketplace.json` の全フィールド仕様は公式の Plugins reference に最新があるため、実装前にそちらで確認することを推奨します（本記事執筆時点の概要です）。

開発支援として、公式マーケットプレイスにはプラグイン作成用の **`plugin-dev`** プラグインも用意されています。

---

## セキュリティ上の注意

プラグインとマーケットプレイスは**高い信頼を前提とするコンポーネント**で、あなたのユーザー権限で任意のコードを実行できます。MCP サーバーや同梱ファイルの中身を Anthropic が管理・検証しているわけではない（公式・コミュニティ以外は特に）ため、**信頼できるソースからのみ**インストールしてください。組織では、追加可能なマーケットプレイスを管理設定で制限することもできます。

---

## まとめ

- プラグインは **slash commands・hooks・サブエージェント・skills・MCP（＋LSP）を1つに束ねて配布・導入**できる仕組み（2025年10月 公開ベータ）。
- 入口は `/plugin` コマンド。**Discover タブで検索・インストール**、Installed/Marketplaces/Errors の4タブで管理する。`/skills` で skill をリアルタイムにフィルタできる。
- **公式 `claude-plugins-official` は自動で利用可能**。コミュニティ・デモ・自前マーケットプレイスは `/plugin marketplace add` で手動追加する。
- 作成は `.claude-plugin/plugin.json` を中心にディレクトリへ要素を配置し、`marketplace.json` で配布する。
- 任意コードが走るため、**信頼できるソースのみ**を入れる。

まずは `/plugin` を開いて Discover タブを眺め、`commit-commands` や `github` など公式プラグインから試すのがおすすめです。

---

## 参考資料

- Claude Code 公式ドキュメント「Discover and install prebuilt plugins through marketplaces」 — https://code.claude.com/docs/en/discover-plugins
- Anthropic 公式ブログ「Claude Code plugins (public beta)」 — https://claude.com/blog/claude-code-plugins
- 公式マーケットプレイス リポジトリ `anthropics/claude-plugins-official` — https://github.com/anthropics/claude-plugins-official
- 公式プラグインカタログ（ウェブ） — https://claude.com/plugins
- Claude Code 公式ドキュメント「Plugins（作成）」「Plugins reference」「Create a plugin marketplace」 — https://code.claude.com/docs/

※ ディレクトリ構成・`plugin.json` の項目など「推測」と明記した箇所は、本記事執筆時点（2026-06-21）の一般的な構成例です。正確な仕様は上記公式リファレンスの最新版をご確認ください。
