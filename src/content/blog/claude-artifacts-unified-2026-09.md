---
title: "Claude のアーティファクトは統合された？ — 9月16日の区切り・Artifacts タブ・レガシー、そして Claude Code の現在地"
date: 2026-09-26
category: "Claude技術解説"
tags: ["Claude", "Artifacts", "Claude Code", "Cowork", "Claude Design", "Claude Docs", "Claude Slides", "共有", "レガシーアーティファクト"]
excerpt: "2026年9月16日、チャットで作るアーティファクトが「レガシー」となり、8月19日の Cowork に続いて新しい共通の仕組みへ移行した。ヘルプセンター・管理者ガイド・Claude Code 公式ドキュメントを一次情報に、何が共通化されたのか（呼び方と入口・Artifacts タブ・共有・管理設定・使用量枠）と、何が別に残るのか（Claude Code のセッション出力ページ・専用ギャラリー・/artifacts）を整理する。レガシーと新形式の違い、Docs / Slides / Design テンプレート、プラン別の共有、Team / Enterprise の設定、CMEK / ZDR / HIPAA 組織の例外、そして公式に明記されていない未確認事項までまとめる。"
draft: false
---

> ## 要点
>
> - **統合は大きく進んだが、完全ではない**。**2026年8月19日（Cowork）**と**9月16日（チャット）**を境に、アーティファクトは「テンプレート・Artifacts タブ・Share」を軸にした共通の仕組みへ移行しています（ヘルプセンター記載）。
> - **共通化が確認できたもの**: 呼び方と入口、Claude サイドバーの **Artifacts タブ**、**共有（Share）の仕組み**、管理設定と権限、使用量の枠。
> - **別に残っているもの**: Claude Code の**セッション出力ページ**（`claude.ai/code/artifact/<id>`）、専用ギャラリー `claude.ai/code/artifacts`、`/artifacts` コマンド。これらが Artifacts タブにも出るかは、**公式ヘルプに明記がありません**。
> - **9月16日より前にチャットで作ったもの**は「**レガシーアーティファクト**」。動作と共有は続きますが、**新しく作ることはできません**。
> - **CMEK・ZDR・HIPAA 対応構成の組織**は、新しい体験（テンプレート等）が**まだ使えません**。
> - 本記事は **2026年9月26日時点**のヘルプセンターと公式ドキュメントに基づきます。ヘルプは随時更新されるため、最新は原文を確認してください。

## はじめに — 「アーティファクトは3種類ある」が変わりつつある

7月の時点では、Claude のアーティファクトは **①チャット、②Cowork のライブアーティファクト、③Claude Code** の3つが別々の仕組みで、一覧も保存場所も別でした（[Claude の「アーティファクト」は3種類ある](/mdTechKnowledge/blog/claude-three-artifact-types/)）。

その後、Cowork とチャットの統合（2026年9月16日発表）に合わせて、アーティファクトの位置づけが整理し直されました。ヘルプセンターの「What are artifacts and how do I use them?」は、アーティファクトを次のように定義し直しています。

> An artifact is anything Claude makes for you that you'd put in front of someone: a design, a deck, a document, a dashboard, or a small interactive tool.
> （アーティファクトとは、Claude があなたのために作る、人に見せるもの全般。デザイン、デッキ、ドキュメント、ダッシュボード、小さなインタラクティブツール）

そして「**どの会話でも頼める（Claude Code を含む）**」「**Artifacts タブのテンプレートから始められる**」と説明されています。本記事では、この再編で**何が変わり、どこまで共通化されたのか**を、一次情報から整理します。

## 1. 時系列 — 2つの区切り日

| 日付 | 出来事 | 出典 |
|:---|:---|:---|
| 2026-06-18 | Claude Code のアーティファクトが **Team / Enterprise 向けベータ**で登場 | 公式ブログ |
| 2026年7月 | Pro / Max へ拡大（現行ヘルプは「Claude Code を含む全プラン」） | 既存記事・ヘルプ |
| **2026-08-19** | **Cowork**：この日**以降**に作るものは「通常のアーティファクト」。**以前**のものは「ライブアーティファクト」 | Cowork ヘルプ |
| **2026-09-16** | **チャット**：この日**より前**のものは「レガシーアーティファクト」。同日、Cowork とチャットが1つの Claude に統合される発表 | What are artifacts / 公式ブログ |
| 2026-09-17 | Projects が再設計され、**ライブラリにファイルとアーティファクトが集約**される | 公式ブログ |

Cowork のヘルプには、8月19日以降について次の記載があります。

> Artifacts made in Cowork on or after August 19, 2026 work like any other artifact.
> （2026年8月19日以降に Cowork で作ったアーティファクトは、他のアーティファクトと同じように動く）

## 2. 何が共通化され、何が別に残っているか

| 観点 | 状況 | 根拠 |
|:---|:---|:---|
| **呼び方・定義** | 共通。デザイン・デッキ・ドキュメント・ダッシュボード・小さなツールを、どの会話（Claude Code 含む）でも頼める | What are artifacts |
| **一覧** | Claude サイドバーの **Artifacts タブ**に「作ったものすべて」が集まる。Cowork のライブアーティファクトも「Cowork」ラベル付きで同じビューに並び、「Filter by」で絞り込める。スタンドアロンの Claude Design のプロジェクト（`claude.ai/design`）も同タブに表示される | What are artifacts / Cowork ヘルプ / 管理者ガイド |
| **Claude Code の一覧** | **専用ギャラリー `claude.ai/code/artifacts` と `/artifacts` コマンドが残っている**。Claude Code のセッション出力ページが Artifacts タブに出るかは、ヘルプ本文に明記なし | Claude Code 公式ドキュメント |
| **共有** | 1つの記事に統合。「every plan and every place you make artifacts: in a chat, from a template, and in Claude Code（すべてのプラン、チャット・テンプレート・Claude Code のすべての作成場所を対象）」と明記 | Share artifacts |
| **管理設定** | Team / Enterprise は **Organization settings > Artifacts** に集約。カスタムロールの「Artifacts」権限は、Claude Code と Cowork での作成・公開と、チャットと Cowork のアーティファクトの組織内共有をカバー | 管理者ガイド |
| **使用量** | 各ユーザーの**既存の利用枠**（Claude Code を含む）に計上。別枠の割り当ては不要 | 管理者ガイド |
| **監査** | Compliance API は、会話・Artifacts タブで作ったものを artifact 単位で記録。Claude Code 側には別に `GET /v1/compliance/code/artifacts` がある | 管理者ガイド / Claude Code 公式ドキュメント |

つまり、**入口・共有・管理・課金は共通化が進んだ一方、Claude Code のセッション出力ページは専用の一覧と URL を持ち続けている**、というのが現時点で確認できる姿です。

## 3. 新しいアーティファクトとレガシーの違い

9月16日より前にチャットで作ったものは、次のように扱われます。

> Legacy artifacts are artifacts made in a chat before September 16, 2026. They keep working, and you can still publish and share them, but you can't make new ones.
> （レガシーアーティファクトは、2026年9月16日より前にチャットで作られたもの。動作は続き、公開・共有もできるが、新しく作ることはできない）

| 項目 | 新しいアーティファクト | レガシー（9/16 より前にチャットで作成） |
|:---|:---|:---|
| 新規作成 | 可能（どの会話でも、またはテンプレートから） | **不可**（既存分は動作継続） |
| 共有ボタン | 「Share」 | 「Publish」（Free / Pro / Max）、「Share & copy link」（Team / Enterprise） |
| 公開リンクの閲覧 | **Claude アカウントが必要** | チャットから公開したレガシーは**アカウント不要**（唯一の例外） |
| データ保存 | 公開しなくても使える | **公開後にのみ動作** |
| 公開の取り消し | 共有設定を「Only you」（Pro / Max）または「Only people invited」（Team / Enterprise）に戻す | 「Unpublish」は**一方通行**。**再公開できず、保存データも完全に削除** |
| Claude を呼ぶ機能 | 初回に許可を求める | 「AI-powered artifacts」設定でオフにできる |
| 書き出し | テンプレート由来は Export（下記） | コードの表示・コピー・ダウンロード |

Cowork のライブアーティファクト（8月19日より前）も同様に**動作は続くが、その場では編集できません**。編集したい場合は「Share」から**新しいアーティファクトとして再公開**します。すでに共有していたリンクは、そのまま新バージョンを指します。

## 4. 新しい体験でできること

### テンプレート（ベータ・有料プランのみ）

Pro / Max / Team では既定でオン、Enterprise では**オーナーが個別にオン**にするまでオフです。

| テンプレート | 内容 |
|:---|:---|
| **Docs** | Claude やチームとリアルタイムで一緒に書く、生きたドキュメント |
| **Slides** | ノートやレポート、チャットの内容から作るプレゼン。各スライドを直接編集し、Claude 内でそのまま発表、PowerPoint / PDF に書き出し |
| **Design** | ビジュアル、モックアップ、プロトタイプ、ワンページャー、ランディングページ。デザインシステムを適用可能 |

どのテンプレートから始めても、**会話で頼むか、アーティファクト上で直接編集**し、作業に合わせてライブで更新されます。ドキュメントや Markdown では、範囲を選んで「**Edit with Claude**」で依頼すると、その箇所だけが編集されます。

### 書き出し（Export）

| 種類 | 書き出し先 |
|:---|:---|
| Docs | Word / PDF / Markdown / Google Docs |
| デッキ | PowerPoint / PDF |
| Design | .zip / PDF / PowerPoint / スタンドアロン HTML |

### アプリ連携・データ保存・Claude を呼ぶアーティファクト

- **アプリ連携**（Pro 以上・Web / デスクトップ）: Asana、Google Calendar、Slack などのコネクタを読み書きできる。**共有されたアーティファクトでも、各自が自分のアプリを接続**する。承認が必要なコネクタツールは使えない。
- **データ保存**（Pro 以上・Web / デスクトップ）: 個人用と共有用があり、**1アーティファクトあたり20MB・テキストのみ**。共有ストレージは「他の人にも見える」ことの確認が最初に出る。
- **Claude を呼ぶアーティファクト**: 小さなアプリとして Claude を組み込める。APIキーは不要で、**使用量は利用者それぞれのプランに計上**される。

## 5. どこで作れるか

| 場所 | できること |
|:---|:---|
| Web / デスクトップ | 作成・編集・共有・テンプレートからの開始 |
| **iOS / Android** | 任意のチャットでデザイン・デッキ・ドキュメントを**依頼**し、結果を **Artifacts タブで閲覧**。テンプレートからの開始・編集・**共有設定の変更は Web / デスクトップのみ** |
| **Claude Code** | セッション出力をアーティファクトとして公開、`/design` でデザイン、ドキュメントを依頼。デスクトップではドキュメントがサイドパネルで開き、ターミナルでは Web で開くリンクが返る |

### プラン別の提供範囲

| 機能 | Free | Pro | Max | Team | Enterprise |
|:---|:---:|:---:|:---:|:---:|:---:|
| チャットでアーティファクトを作る | ○ | ○ | ○ | ○ | ○ |
| テンプレートから始める（Design / Slides / Docs） | — | ○ | ○ | ○ | ○ |
| アプリを連携する | — | ○ | ○ | ○ | ○ |
| データを保存する | — | ○ | ○ | ○ | ○ |

**前提条件**として、**Cloud code execution and file creation** を有効にする必要があります（Free / Pro / Max は Settings > Capabilities、Team / Enterprise は Organization settings > Capabilities）。

## 6. 共有の現在の仕組み

アーティファクトは**最初は自分だけ**に見えます。共有するには「Share」を押します。

| 共有方法 | Free | Pro | Max | Team | Enterprise |
|:---|:---:|:---:|:---:|:---:|:---:|
| リンクを知っている人と共有 | — | ○ | ○ | ○ | ○ |
| 組織内の全員／特定の人と共有 | — | — | — | ○ | ○ |
| グループと共有 | — | — | — | — | ○ |
| メールで特定の人を招待（ベータ） | — | ○ | ○ | ○ | ○ |
| レガシーを「Publish」 | ○ | ○ | ○ | — | — |
| レガシーを「Share & copy link」 | — | — | — | ○ | ○ |

Team / Enterprise では、組織内の共有が既定です。「リンクを知っている人」を選べるのは、**オーナーが外部共有（External sharing）をオンにしている場合、またはそのアーティファクトを個別に許可した場合だけ**で、選べないときはオーナーに依頼します。

### アクセスレベル

| レベル | できること |
|:---|:---|
| Can view | 開いて、コメントを読む |
| Commenter | 上に加えて、コメントの追加と、アーティファクトが提供するファイルのダウンロード |
| Can edit | 上に加えて、変更 |

### メール招待（ベータ）の制約

- 招待できるのは**アーティファクトのオーナー**（Team / Enterprise は編集権のある組織内メンバーも可）。
- **1アーティファクトにつき組織外の50人まで**。保留中の招待は**30日で失効**（承諾済みは失効しない）。
- **Claude アカウントが必要**。招待メールは英語。
- **共有できないもの**: Claude Docs で作ったドキュメント、他のウェブサイトに接続するもの、アップロードファイルの検査が終わっていない／通らなかったもの。
- 「リンクを知っている人」は、**アプリ連携や Claude 呼び出しを使うアーティファクトでは選べず**、Team / Enterprise では**ドキュメントも現時点で不可**。

### 閲覧に関する注意

- **誰でも Claude アカウントが必要**です。「アカウントなしで開ける」のは、**チャットから公開したレガシー**だけです。
- 閲覧者は**自分の権限**で動きます。連携アプリのデータは閲覧者自身の接続で取得され、権限がなければその部分はエラーになります。
- **共有ストレージ**を使うアーティファクトは、他の人が入力した情報が見えます。機密情報を入れる前に確認してください。
- **信頼できる人のアーティファクトだけ**を開いてください。他人のコードとコンテンツを取り込むため、見知らぬ人から届いたファイルと同じ扱いが必要です。

## 7. Team / Enterprise 管理者向けの要点

- **設定の場所**: Organization settings > Artifacts。先に Organization settings > Capabilities で Cloud code execution and file creation を有効にします。
- **テンプレートは個別にオン／オフ**（Slides / Design / Design systems / Docs）。オフにしても、**すでに作られたものには影響しません**。
- **外部共有とメール招待は別々の設定**（片方をオンにしても、もう片方はオンになりません）。メール招待は Team では既定オン、Enterprise では既定オフ。外部共有をオフにすると、**既存の公開リンクも止まります**（個別に許可したものを除く）。
- **Docs は組織外に共有できません**（現時点）。
- **アプリ連携は組織全体のオン／オフのみ**で、到達できるアプリを絞ることはできません。
- **Artifact presence**（誰が開いているかの表示）は Team / Enterprise で既定オン。
- **Enterprise はカスタムロール**で、機能ごと（Artifacts / Design / Design systems / Docs / Slides）にグループ単位で制御できます。組織設定がオフなら、ロールでは有効にできません。
- **例外構成**: **CMEK・ZDR・HIPAA 対応構成の組織は、新しい体験（テンプレート・デザインシステム・メール招待）が使えず、Cowork のライブアーティファクトを使い続けます。**教育・K-12 組織ではメール招待が使えません。
- **サードパーティクラウド（Bedrock / Vertex / Foundry）経由では利用できません。**

## 8. Claude Code のアーティファクトの現在地

Claude Code 公式ドキュメントは、現在も**専用のギャラリーと URL**を前提に説明しています。

> The header also links to your gallery at claude.ai/code/artifacts, which lists every artifact you have created.
> （ヘッダーには `claude.ai/code/artifacts` のギャラリーへのリンクがあり、作成したすべてのアーティファクトが一覧される）

### 使うための条件

- Pro / Max / Team / Enterprise で、**`/login` でサインインしたセッション**（APIキー・ゲートウェイトークン・クラウドプロバイダの資格情報では公開不可）。
- **Anthropic API 経由のみ**（Bedrock / Google Cloud / Microsoft Foundry は非対応）。
- **Claude Code CLI**、または **Claude Desktop 1.13576.0 以降**。
- 組織で **CMEK・HIPAA・ZDR が有効でないこと**。

### 主なコマンドと機能

| 機能 | 必要バージョン |
|:---|:---|
| `/artifacts`（所有分・共有された分を一覧し、開く・リンクをコピー・現在のセッションに添付） | v2.1.208 以降 |
| コネクタ呼び出し | v2.1.209 以降 |
| コメントの読み取り（Team / Enterprise） | v2.1.221 以降 |
| コメントへの自動返信 | v2.1.228 以降 |
| `/design`（アートボードを1枚のキャンバスにまとめ、Design アーティファクトとして公開） | v2.1.265 以降 |

別のセッションから同じアーティファクトを更新するには、**URL を伝えるか `/artifacts` で添付**します。どちらもないと、新しいセッションでは**更新ではなく新規作成**になります。

### 最近の Claude Code の更新（CHANGELOG）

- **v2.1.271**: Markdown ファイルをアーティファクトとして公開すると、**スタイル付きの文書ページ**として表示される。1セッションで監視できる公開済みアーティファクトが**5件から10件**に増えた。
- **v2.1.277**: claude.ai のアーティファクトのリンクは、WebFetch ではなく **Artifact ツール**で読む。
- **v2.1.281**: セッションのアーティファクトへのリンクが、プロンプト下の**1つのフッターのピル（⧉）**に集約され、`/artifacts` が開く。Artifact ツールが `claude remote-control` 起動のセッションで欠ける問題も修正。

### ギャラリー表示のバグ報告（ユーザー報告）

2026年9月15日に、GitHub の anthropics/claude-code で [Issue #94552](https://github.com/anthropics/claude-code/issues/94552) が起票されました（本記事作成時点でオープン）。

- 報告者の観察では、ギャラリー `claude.ai/code/artifacts` の All タブに、**Claude Code のアーティファクトと、claude.ai のチャット由来のアーティファクト（2025年分を含む）が並んでいる**。
- ただし、**Claude Code 側は約 2026年9月2日以降の分しか表示されない**（それより古い分もリンクからは開ける）。
- これは**ユーザーの観察と不具合報告**であり、公式の説明ではありません。ギャラリーが2つの供給元を混ぜて表示しているように見える、という点だけが参考になります。

## 9. まだ確認できていないこと

一次情報を読んでも、次の点は**明記が見つかりませんでした**。断定せず、確認が必要な事項として残します。

1. **Claude Code のセッション出力ページが、Claude サイドバーの Artifacts タブにも表示されるか。** ヘルプ本文は「Everything you make is saved to the Artifacts tab」と書いていますが、Claude Code のライブページを含むかは書かれていません。
2. **iOS / Android の Artifacts タブに、Claude Code のセッション出力ページが出るか。**
3. **専用ギャラリー `claude.ai/code/artifacts` と Artifacts タブが、同じビューの別の入口なのか、別物なのか。**
4. **9月16日より前に作った Claude Code のアーティファクトの扱い**（新しい形式へ移行されるのか、そのままなのか）。

**自分のアカウントで確認する方法**: Claude のサイドバーで「Artifacts」を開き、Claude Code で作ったページが並んでいるかを見ます。あわせて `claude.ai/code/artifacts` を開き、同じものが出るかを比べれば、1〜3 の現状が分かります。

## 10. 実務上の使い分けと注意

- **レガシーの「Unpublish」は取り消せません。** 再公開できず、そのアーティファクトが使っていた個人・共有のストレージデータも完全に削除されます。公開を止めたいだけなら、まず他の方法（共有先の見直し）を検討してください。
- **チャット由来のアーティファクトを共有すると、そのチャットの添付ファイルも閲覧者に見える**ことがあります（Team / Enterprise のレガシー共有）。共有前に、機密書類が含まれていないか確認してください。
- **Claude Code で作ったページを他の端末で開く**なら、発行時の URL を控えるか、`/artifacts` や `claude.ai/code/artifacts` から探します。
- **CMEK・ZDR・HIPAA 組織**は、新しい体験が使えないため、当面は Cowork のライブアーティファクトを前提に運用します。
- **Docs は組織外に共有できません。** 社外に見せる資料は、Slides / Design を使うか、書き出し（Word / PDF など）で渡します。

## まとめ

- アーティファクトは、**2026年8月19日（Cowork）と9月16日（チャット）を境に、テンプレート・Artifacts タブ・Share を軸にした共通の仕組み**へ移行しています。
- **共通化が確認できた**のは、定義と入口、Artifacts タブ、共有の仕組み、管理設定と権限、使用量の枠、監査（Compliance API）です。
- **Claude Code のセッション出力ページ**は、専用ギャラリーと URL（`claude.ai/code/artifacts`、`claude.ai/code/artifact/<id>`）が残っており、Artifacts タブとの関係は**公式に明記されていません**。
- **9月16日より前にチャットで作ったものはレガシー**で、動作・共有は続きますが新規作成はできず、**Unpublish は取り消せません**。
- **CMEK・ZDR・HIPAA の組織は新しい体験の対象外**です。
- 7月に書いた既存記事の「別物」という整理は、**Claude Code のセッション出力ページについては今も一部当てはまります**が、チャット・Cowork については**現行のヘルプに合わせて読み替えてください**。

## 関連記事

- [Claude の「アーティファクト」は3種類ある](/mdTechKnowledge/blog/claude-three-artifact-types/) — 7月時点の3分類（チャット / Cowork ライブ / Claude Code）
- [Claude Code の Artifact と claude.ai チャットの Artifact は別物](/mdTechKnowledge/blog/claude-code-artifacts-vs-chat-artifacts/) — 一覧が分かれていた理由と対処法（7月時点）
- [Claude Code の Artifact が更新されない](/mdTechKnowledge/blog/claude-code-artifact-update-issues/) — 更新の切り分けガイド
- [Claude Cowork アップデートまとめ](/mdTechKnowledge/blog/claude-cowork-updates/) — Cowork とチャットの統合（9月16日）
- [Claude Code バージョン履歴まとめ](/mdTechKnowledge/blog/claude-code-version-history/) — v2.1.271〜282 のアーティファクト関連の更新

## 参考資料

- [What are artifacts and how do I use them? — Claude Help Center](https://support.claude.com/en/articles/17153992-what-are-artifacts-and-how-do-i-use-them)
- [Share artifacts — Claude Help Center](https://support.claude.com/en/articles/9547008-publish-and-share-artifacts)
- [Artifacts admin guide for Team and Enterprise plans — Claude Help Center](https://support.claude.com/en/articles/16994751-artifacts-admin-guide-for-team-and-enterprise-plans)
- [Use live artifacts in Claude Cowork — Claude Help Center](https://support.claude.com/en/articles/14729249-use-live-artifacts-in-claude-cowork)
- [Share session output as artifacts — Claude Code 公式ドキュメント](https://code.claude.com/docs/en/artifacts)
- [Claude Cowork and chat are now one Claude — Claude 公式ブログ（2026-09-16）](https://claude.com/blog/cowork-is-now-claude)
- [Projects redesigned: from folder to conversation — Claude 公式ブログ（2026-09-17）](https://claude.com/blog/projects-redesigned)
- [Claude Code now supports artifacts — Claude 公式ブログ（2026-06-18）](https://claude.com/blog/artifacts-in-claude-code)
- [anthropics/claude-code Issue #94552（ギャラリー表示のバグ報告）](https://github.com/anthropics/claude-code/issues/94552)
- [Claude Code CHANGELOG](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md)
