---
title: "GitHub の歴史・無料提供の理由・現行サービス・Gist ガイド"
date: 2026-05-05
updatedDate: 2026-05-05
category: "その他技術"
tags: ["GitHub", "Git", "歴史", "ビジネスモデル", "Gist", "OSS", "GitHub Actions"]
excerpt: "2008年公開のGitHub。創業からMicrosoft買収（2018年・75億ドル）、フリーミアム戦略、Copilot/Actions/Pages等の現行サービス、軽量サービスGistまでを一通り整理。"
draft: false
---

## はじめに

GitHub は、Linus Torvalds が2005年に Linux カーネル開発のために作った **Git** をベースに、Web 上での協業を簡単にするインターフェースとして 2008 年に公開されたサービスです。現在では世界最大のソースコードホスティングプラットフォームとなり、Microsoft の傘下で AI ネイティブな開発者プラットフォームへと進化しています。

本記事では、GitHub の **歴史**・**無料で使える経済合理性**・**現行の主要サービス**・**Gist の位置づけ** までを一通り整理します。

---

## 1. GitHub の歴史

### 1-1. 創業期（2007〜2008年）

GitHub のアイデアは、サンフランシスコの Ruby コミュニティでの偶然の出会いから生まれました。

- **2007 年**: Tom Preston-Werner と Chris Wanstrath が、サンフランシスコのスポーツバー **「Zeke's」** で、Ruby 関連ミートアップ後に出会う。Preston-Werner が当時開発していた **「Grit」**（Git 経由でリポジトリにアクセスする Ruby ライブラリ）について話したのがきっかけ
- **2007 年 10 月 19 日**: Chris Wanstrath が **最初の GitHub コミット** を実施。それから数週間にわたり Preston-Werner と毎週末に集まって設計とコーディングを進める
- **2008 年 4 月 10 日**: GitHub が **正式に一般公開**

創業メンバーは **Tom Preston-Werner / Chris Wanstrath / PJ Hyett / Scott Chacon** の4名。

### 1-2. 急成長期（2009〜2017年）

| 年 | マイルストーン |
|:---|:---|
| 2009 年 | 公開からわずか1年弱で **46,000 以上の公開リポジトリ** をホスト |
| 2011 年 | **100 万リポジトリ + 10 万ユーザー** 突破。SourceForge を抜き OSS ホスティングのトップに |
| 2012 年 7 月 | Andreessen Horowitz 主導の **シリーズAで $100M 調達**（評価額 $750M）→ GitHub Enterprise で企業市場への本格展開 |
| その後 | **シリーズB で $250M を追加調達** |

### 1-3. Microsoft 買収（2018 年）

- **2018 年 6 月**: Microsoft が **$7.5B（75 億ドル）の全株式取引で GitHub を買収**
- 当時の GitHub: 従業員約 **1,000 人**、ユーザー **2,000 万人超**、ARR **$300M 規模** の世界最大ソースコードホスティング

### 1-4. 買収後〜現在

買収後は次の3軸で収益化を加速:

- **Copilot サブスクリプション**（AI コード補完）
- **Actions の従量課金**（CI/CD）
- **エンタープライズプラン**（SSO・SCIM・監査ログ等）

AI ネイティブな開発者プラットフォームへの転換が進行中です。

---

## 2. なぜ無料で利用できるのか

### 2-1. ビジネスモデル：フリーミアム

GitHub は創業初期から **フリーミアム戦略** を採用してきました。

| 利用者 | 料金 |
|:---|:---|
| 公開リポジトリ（個人 / 小規模） | **無料** |
| プライベートリポジトリ・組織機能（チーム / エンタープライズ） | 有料 |

公開してから約4年間、外部資金にほとんど頼らず **ブートストラップ経営でスケール** しました。

### 2-2. 無料提供を支える経済合理性

| 要因 | 内容 |
|:---|:---|
| **個人ユーザー = 企業導入の入口** | 個人開発者が GitHub に慣れる → その人が所属する企業にも自然に導入される（**ボトムアップ採用**） |
| **ネットワーク効果** | OSS エコシステムが集中することで、プラットフォーム自体の価値が増幅 |
| **Microsoft 戦略との統合** | Azure、VS Code、Copilot を含む開発者エコシステム全体への入口として機能 |
| **AI 訓練データとしての価値** | 公開リポジトリのコードが Copilot 系モデルの基盤となっている |

「個人に無料で提供する」ことは、**最も効率的な企業向け営業活動** という構造です。

---

## 3. 現在提供されている主なサービス

GitHub の提供する主要サービスを **コア機能** / **自動化・開発インフラ** / **AI・セキュリティ** の3層で整理します。

### 3-1. コア機能（無料枠あり）

| サービス | 概要 |
|:---|:---|
| **Repository** | Git ベースのコードホスティング。公開・非公開ともに無料 |
| **Pull Request** | コード変更提案とレビューワークフロー |
| **Issues** | バグ追跡・タスク管理 |
| **Discussions** | フォーラム形式のコミュニティ機能 |
| **Projects** | カンバン / テーブル形式のプロジェクト管理 |
| **GitHub Pages** | 静的サイトホスティング |
| **Wiki** | リポジトリ付属のドキュメント機能 |

### 3-2. 自動化・開発インフラ（従量課金）

| サービス | 概要 |
|:---|:---|
| **GitHub Actions** | CI/CD パイプライン。実行時間（minutes）ベースの課金 |
| **Packages** | コンテナ・パッケージレジストリ |
| **Codespaces** | クラウド開発環境（VS Code on the Web） |

### 3-3. AI・セキュリティ（有料）

#### GitHub Copilot — 5階層構成

| プラン | 月額 | 対象 |
|:---|:---|:---|
| **Free** | $0 | 機能制限あり |
| **Pro** | $10 / 月 | 個人開発者 |
| **Pro+** | $39 / 月 | パワーユーザー |
| **Business** | $19 / ユーザー / 月 | チーム |
| **Enterprise** | $39 / ユーザー / 月 | 大企業 |

#### その他のエンタープライズ機能

- **Advanced Security**: 脆弱性スキャン、シークレット検出、コードスキャン
- **Copilot Workspace**: 自然言語から PR 作成までを担うエージェント機能

### 3-4. 組織向けプラン

| プラン | 主な機能 |
|:---|:---|
| **Free** | 個人・小規模向け |
| **Team** | 小〜中規模組織向け（保護ブランチ、コードオーナー） |
| **Enterprise** | 大企業向け（SSO、SCIM、監査ログ、IP 補償） |

---

## 4. Gist：もう一つの軽量サービス

**GitHub Gist** は、コードや小さなテキストを素早く保存・バージョン管理・共有するための軽量サービスです。リポジトリを丸ごと作るほどでもない場合に便利な選択肢になります。

### 4-1. 主な特徴

| 特徴 | 内容 |
|:---|:---|
| **Git リポジトリ扱い** | 各 Gist は1つの Git リポジトリ。フォークやクローンが可能 |
| **公開範囲は2種類** | **Public Gist**（Discover に表示・検索可能） / **Secret Gist**（検索対象外だが、URL を知っていれば誰でも閲覧可能） |
| **Secret ≠ Private** | URL を知る第三者がアクセスすれば Gist は見える点に注意 |
| **多彩な配信形式** | ZIP 一括ダウンロード、ブログ等への**埋め込みコード**生成、GeoJSON マップ表示などに対応 |
| **CLI 操作対応** | GitHub CLI（`gh gist create` など）からもターミナル経由で操作可能 |

### 4-2. 典型的な用途

- 単発のスクリプト共有
- バグ再現コード
- 設定ファイルの保存・共有
- Slack / Discord / フォーラムへのスニペット投稿
- 技術記事への埋め込み

### 4-3. リポジトリとの使い分け

| 観点 | Repository | Gist |
|:---|:---|:---|
| **規模** | 中〜大規模プロジェクト | 単発コード・小スニペット |
| **ディレクトリ** | あり | なし（フラットな構造のみ） |
| **URL** | `github.com/user/repo` | `gist.github.com/{hex_id}` |
| **Discover** | リポジトリ検索 | Gist 専用 Discover ページ |
| **用途** | ソフトウェア開発 | コード共有・メモ |

### 4-4. 使い分けの実用例

- **Repository + GitHub Pages**: 体系的な技術記事サイト・ドキュメント
- **Gist**: note 等の記事の補足として置く設定スニペット、小さなサンプルコード、表データの単独配信

Gist は **note の記事中にも埋め込み可能** なので、技術記事の見せ方の選択肢として組み合わせる手もあります。

---

## 5. まとめ

| ポイント | 内容 |
|:---|:---|
| **歴史** | 2008 年公開 → 2018 年 Microsoft が $7.5B で買収 → AI プラットフォーム化進行中 |
| **無料提供の理由** | 個人ユーザーが企業導入の入口になるフリーミアム + ネットワーク効果 + Microsoft エコシステム統合 |
| **主要サービス** | Repository / Issues / Pull Request / Pages / Actions / Codespaces / Copilot / Advanced Security |
| **Gist** | 単発コード・スニペット用の軽量サービス。Repository とは住み分けて併用 |

GitHub は「個人開発者に無料で提供する」ことで世界中の開発文化を集約し、その上で企業向け機能を有料化することで成長してきたサービスです。Microsoft 傘下となった現在も、**Copilot を中心とした AI ネイティブな開発者プラットフォーム** として進化が続いています。

---

## 関連記事

- [GitHub の仕組み — ローカルフォルダ・ローカルgit・GitHub の3層構造](/mdTechKnowledge/blog/github-three-layer-guide/)
- [GitHub Pages 自動デプロイの仕組み](/mdTechKnowledge/blog/github-pages-auto-deploy-mechanism/)
- [GitHub Pages vs Vercel 比較](/mdTechKnowledge/blog/github-pages-vs-vercel-comparison/)
- [GitHub MCP サーバ導入のメリットとデメリット](/mdTechKnowledge/blog/github-mcp-merits-demerits/)

---

## 参考資料

- [GitHub Pricing — Copilot](https://github.com/features/copilot/plans)
- [About GitHub Gist — GitHub Docs](https://docs.github.com/en/get-started/writing-on-github/editing-and-sharing-content-with-gists/creating-gists)
- [GitHub Wikipedia](https://en.wikipedia.org/wiki/GitHub)（背景情報）
- [Microsoft Acquires GitHub — 2018 announcement](https://news.microsoft.com/2018/06/04/microsoft-to-acquire-github-for-7-5-billion/)

---

*本記事は2026年5月時点の情報に基づきます。GitHub のプラン体系・料金・機能は予告なく変更される可能性があります。*
