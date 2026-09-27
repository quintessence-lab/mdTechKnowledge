---
title: "Claude Docs & Slides 解説 — Claude と一緒に書く「生きたドキュメント」とスライド、Claude Code からの操作まで"
date: 2026-09-27
category: "Claude技術解説"
tags: ["Claude", "Claude Docs", "Claude Slides", "Artifacts", "Cowork", "Claude Code", "MCP", "コネクタ", "共同編集", "ベータ"]
excerpt: "2026年9月16日、Claude のチャットと Cowork が「one Claude」に統合されたのと同時に、新しいアーティファクトとして Claude Docs と Claude Slides が登場した（どちらもベータ）。Docs は Claude が目の前で下書きし、判断の理由をコメントで残す「生きたドキュメント」で、複数タブ・表・チャート・ダイアグラムを持ち、人と Claude が同時に編集できる。コメントで @Claude とメンションすれば、そのスレッドの中で Claude が直接書き直す。Slides はノートやレポート、チャットの内容からスライドを起こし、各スライドを直接編集して Claude の中でそのまま発表でき、PowerPoint と PDF に書き出せる。本記事は作り方・編集・コメント・構成要素と、バージョン履歴がない、コメントのみの権限がない、モバイルは閲覧のみ、Team / Enterprise は組織外に共有できない、CMEK / ZDR / HIPAA 構成では使えない、といった現時点の制限を整理する。さらに、Claude Code から MCP コネクタ経由で Docs を作成・編集できることを実機で確認し、その仕組みと注意点を解説する。Free プランで使えるかは公式情報どうしで食い違っている点も明記した。"
draft: false
---

> ## 要点
>
> - **2026年9月16日**、チャットと Cowork の統合（one Claude）と同時に、**Claude Docs** と **Claude Slides** が新しいアーティファクトとして登場した。どちらも**ベータ**。
> - **Docs**: Claude と一緒に書く「生きたドキュメント」。複数タブ・表・チャート・ダイアグラムを持ち、**人と Claude が同時に編集**できる。コメントで **@Claude** と呼べば、そのスレッドの中で Claude が直接書き直す。
> - **Slides**: ノートやレポート、チャットの内容からスライドを起こす。各スライドを直接編集でき、**Claude の中でそのまま発表**できる。PowerPoint と PDF に書き出せる。
> - **制限**: バージョン履歴がない、コメントのみの権限がない、**モバイルは閲覧のみ**、**Team / Enterprise は組織外に共有できない**、CMEK / ZDR / HIPAA 構成では使えない。
> - **Claude Code から MCP コネクタ経由で Docs を作成・編集できる**（本記事で実機確認）。ただし公開ドキュメントはまだない。

## 1. Claude Docs と Slides とは

チャットと Cowork を1つにまとめた発表の中で、Anthropic は2つの新機能をこう説明しています。

> ドキュメントを頼めば、あなたと Claude が一緒に書く。プレゼンを頼めば、Claude がスライドを起こす。

公式の位置づけは**「作業を別のツールに移さずに済む」**ことです。これまで Claude に下書きさせた文章は、Word や Google Docs に貼り直して仕上げていました。Docs と Slides は、その仕上げの場所自体を Claude の中に置きます。

| 項目 | Claude Docs | Claude Slides |
|:---|:---|:---|
| 何を作るか | 仕様書・計画書・議事録などのドキュメント | QBR・決算説明資料・デザインレビューなどのプレゼン |
| Claude の関わり方 | 目の前で下書きし、最初に確認の質問をし、判断理由をコメントで残す | ノート・レポート・チャットの内容からスライドを起こす |
| 人の編集 | 直接入力（自動保存・リアルタイム反映） | 各スライドを直接編集 |
| 書き出し | Word・PDF・Markdown・Google Docs | PowerPoint・PDF |
| その他 | コメントで @Claude を呼べる | Claude の中でそのまま発表できる |
| 提供状況 | ベータ | ベータ |

ヘルプセンターのリリースノートは、Docs・Slides・Design を**「どの会話からでも頼める新しいアーティファクト（テンプレート）」**として位置づけています。アーティファクト全体の仕組み（共有の範囲・アクセスレベル・管理者設定・レガシーとの違い）は [Claude のアーティファクトは統合された？](/mdTechKnowledge/blog/claude-artifacts-unified-2026-09/) で詳しく解説しています。

## 2. Claude Docs の使い方

### 2-1. 作り方は3通り

1. **会話の中で頼む**（例: 「この計画を製品仕様書にして」）
2. **`/docs` コマンド**を使うか、「Output」>「Docs」を選ぶ
3. **Artifacts タブでテンプレートを選び**、内容を説明する

下書きの材料には、会話に添付したファイル、メモリ、Projects、スキル、接続アプリが使われます。

### 2-2. 編集とコメント

- **直接入力**できます。自動保存され、変更は同じドキュメントを開いているほかの人にもリアルタイムで反映されます。
- **会話で変更を頼む**と、Claude が編集し、何を変えたかを伝えます。
- **テキストを選択してコメント**できます。コメントの中で **@Claude** とメンションすると、Claude がそのスレッドの中で直接編集します。
- **人と Claude が同時に編集**できます。Claude は依頼した人の権限を超えて編集せず、**各変更には作成者（人か Claude か）が記録**されます。

### 2-3. ドキュメントに入れられるもの

- 見出し・表などのリッチテキスト
- **複数のタブ**（ノートのセクションのように使える）
- **チャート・ダイアグラム・グラフ・タイムライン**。データは Salesforce や Google Sheets などの接続アプリから取り込めます。ただし**自動更新はされず**、新しいデータにするには Claude に更新を頼みます。

### 2-4. 保存場所 — Projects には入れられない

Docs は自動保存され、**Artifacts タブ**に入ります。会話をまたいで開けます。ただし、**Projects には入れられません**（チャットは入れられます）。Docs 専用の一覧はなく、Artifacts タブにタイトルで並びます。

## 3. Claude Slides の使い方

- 会話で頼むか、Artifacts タブのテンプレート（QBR・決算説明資料・デザインレビューなど）から始めます。
- **各スライドを直接編集**でき、**Claude から離れずにそのまま発表**できます。
- 管理者ガイドには「**デザインシステムで見た目を整え直し**、PowerPoint に書き出せる」とあります。
- Salesforce などのツールからデータを取り込めます。

> **注意**: Slides 専用のヘルプ記事はまだ公開されていません。書き出し先について、ヘルプセンターは **PowerPoint と PDF**、製品ページは「**Google Slides、PPTX、PDF など**」と書いており、Google Slides への書き出しは情報が食い違っています。

**Slides と Claude Design の違い**: Design は「ビジュアル・モックアップ・プロトタイプ・一枚物・ランディングページ」向け、Slides はプレゼン専用と整理されています。単独の claude.ai/design も引き続き使えます。

## 4. 誰がどこで使えるか

### 4-1. プラン — 公式情報どうしで食い違いがある

| 情報源 | 書かれている内容 |
|:---|:---|
| Docs のヘルプ | Pro / Max / Team / Enterprise。Pro・Max・Team は既定でオン、Enterprise は既定でオフ（組織設定で有効化） |
| 発表ブログ・統合ヘルプ | まず Pro と Max に数週間かけて順次展開。Team と Free は後から |
| リリースノート | 「Free を含むすべてのプランで利用可能」 |
| Artifacts ヘルプの表 | テンプレートから始める機能は Free では使えない |

**Free プランで使えるかは、一次情報どうしで矛盾しています**。実際に使えるかは、自分の画面で `/docs` が出るかで確認してください。利用には、設定の Capabilities で「Cloud code execution and file creation」がオンになっている必要があります。使った分はプランの利用上限にカウントされ、長いドキュメントや多数のソースを使う依頼ほど多く消費します。

### 4-2. プラットフォーム

| 環境 | できること |
|:---|:---|
| Web・デスクトップアプリ | 作成・編集・共有のすべて |
| Claude Code | デスクトップではサイドパネル、ターミナルでは Web のリンクで開く |
| iOS・Android アプリ | **閲覧のみ**（書き出しもできない）。テンプレートからの作成は Web かデスクトップが必要 |

## 5. 現時点の制限

- **バージョン履歴がない**。誤って消した内容を過去の版から戻す手段がありません
- **コメントのみの権限がない**。権限は閲覧のみ（Viewer）と編集可（Editor）の2段階
- **チャートは自動更新されない**
- **Team / Enterprise では組織外に共有できない**（Pro / Max はリンクで誰とでも共有可）
- **CMEK・ZDR・HIPAA 対応構成の組織では使えない**
- **Compliance API に Docs 内の編集やコメントが記録されない**（アーティファクト単位の記録はある）
- **モバイルは閲覧のみ**
- 保存データはアーティファクト1つあたり 20MB まで、テキストのみ

> **実務上の注意**: バージョン履歴がない点は、共同編集では特に効きます。複数人と Claude が同時に書き換える重要文書は、節目ごとに Word か Markdown で書き出して控えを残しておくのが安全です。社外に見せる資料は、Team / Enterprise では Docs のまま共有できないので、書き出して渡すか Slides / Design を使います。

## 6. Claude Code から Docs を操作する — MCP コネクタ

**Claude Code から、claude.ai がホストする「Claude Docs」コネクタ（MCP）経由で Docs を作成・編集できます**。本記事の執筆に使った Claude Code のセッションにもこのコネクタが接続されており、実際にツールとガイドを確認しました。

### 6-1. コネクタでできること

| ツール | 役割 |
|:---|:---|
| `batch` | ドキュメントの新規作成と、複数の操作のまとめ実行 |
| `update` | タブの内容の編集、ドキュメントやタブの名前変更 |
| `read` / `query` | ドキュメント・タブ・コメントの読み取り |
| `create` / `delete` | コメントやタブなどの追加・削除 |
| `export` | Word・PDF として書き出し（ファイルは Claude 側に渡る） |
| `guide` | 操作方法のガイドを返す |

コネクタのガイドから分かる、Docs の中身の構造は次のとおりです。

- **ドキュメント → タブ → 本文**という階層。本文には段落・表・リストに加え、**チャート・ダイアグラム・チップ**（人のメンション、日付、プルダウン）を置ける
- **編集は差分で行う**。「この語句をこう置き換える」「このブロックの後に挿入する」という操作を送り、ドキュメント全体を書き直さない。人が同時に書き換えた部分とぶつかった場合は、**人の編集が優先**される
- **書き始めに「作成予定」のブロックを置き、1節ずつ埋めていく**作法が推奨されている。開いている人は、構成が先に見え、中身が順に埋まっていく様子を見られる
- **コメントで Claude を呼ぶと、Claude はコメントのスレッドの中で返信・編集する**

### 6-2. 注意点

- **このコネクタの公開ドキュメントはまだ見つかりません**。提供条件や正式な手順は未公表で、挙動が変わる可能性があります
- **共有の設定はコネクタからはできず**、claude.ai 上で操作します
- **`export` は、書き出したファイルを Claude に渡すもの**で、ユーザーに直接ダウンロードさせるものではありません
- 名前でドキュメントを検索する機能はなく、既存のドキュメントを編集するには**リンク（ID）が必要**です
- Claude Code の Artifact 機能（`/design` や HTML・Markdown の公開）の公式ドキュメントには、Docs 専用の手順は載っていません

> Claude Code で調べた結果を、そのままチームの Docs に書き込む、といった使い方ができます。Claude Code 側のアーティファクトとの違いは [Claude の「アーティファクト」は3種類ある](/mdTechKnowledge/blog/claude-three-artifact-types/) も参照してください。

## まとめ

- **Claude Docs と Slides は、Claude で作ったものを「そのまま仕上げて共有する」ための場所**。2026年9月16日に one Claude とともに登場し、どちらもベータ。
- **Docs は人と Claude の同時編集と、コメントでの @Claude 呼び出し**が特徴。Slides は直接編集と Claude 内での発表ができる。
- **バージョン履歴がない、モバイルは閲覧のみ、Team / Enterprise は組織外に共有できない**など、仕事で使うには制限を理解しておく必要がある。
- **Free プランの扱いと Slides の Google Slides 書き出しは、公式情報どうしで食い違っている**。
- **Claude Code からは MCP コネクタで Docs を操作できる**が、公開ドキュメントはまだない。

## 関連記事

- [Claude のアーティファクトは統合された？](/mdTechKnowledge/blog/claude-artifacts-unified-2026-09/) — 9月16日の区切り・共有の仕組み・管理者設定
- [Claude の「アーティファクト」は3種類ある](/mdTechKnowledge/blog/claude-three-artifact-types/) — チャット / Cowork / Claude Code の違い
- [Claude Cowork アップデートまとめ](/mdTechKnowledge/blog/claude-cowork-updates/) — チャットと Cowork の統合の経緯
- [Claude Design 解説](/mdTechKnowledge/blog/claude-design-overview/) — Slides と並ぶビジュアル生成機能

## 出典

- [Claude Cowork and chat are now one Claude — Claude Blog](https://claude.com/blog/cowork-is-now-claude)（2026-09-16、発表・位置づけ・展開予定）
- [Get started with Claude Docs — Claude Help Center](https://support.claude.com/en/articles/16923645-get-started-with-claude-docs)（作り方・編集・コメント・書き出し・既知の制限・対象プラン）
- [What are artifacts and how do I use them? — Claude Help Center](https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them)（Slides の書き出し・プラン別の表・20MB 上限・レガシー）
- [Artifacts admin guide for Team and Enterprise plans — Claude Help Center](https://support.claude.com/en/articles/16994751-artifacts-admin-guide-for-team-and-enterprise-plans)（管理者設定・デザインシステム）
- [Claude cowork and chat are one Claude — Claude Help Center](https://support.claude.com/en/articles/16761823-claude-cowork-and-chat-are-one-claude)（統合後の制限）
- [Release notes — Claude Help Center](https://support.claude.com/en/articles/12138966-release-notes)（2026-09-16 のリリースノート）
- [Artifacts — Claude 製品ページ](https://claude.com/features/artifacts)（テンプレート例・Slides の書き出し先）
- [Artifacts — Claude Code Docs](https://code.claude.com/docs/en/artifacts)（Claude Code 側のアーティファクト）

*本記事の内容は2026年9月27日時点の公開情報と、Claude Code からのコネクタの実機確認に基づきます。Docs と Slides はベータのため、仕様は変わる可能性があります。*
