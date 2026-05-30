---
title: "Claude Cowork アップデートまとめ"
date: 2026-04-26
category: "Claude技術解説"
tags: ["Claude", "Cowork", "エージェント", "Claude Desktop", "Computer Use", "KPMG", "Claude for Legal", "Finance Agents"]
excerpt: "AnthropicのデスクトップAIエージェント機能「Claude Cowork」のリリースから2026年4月GA移行・Live Artifacts・Amazon Bedrock対応・Claude for Small Business・PwC 拡大パートナーシップ・KPMG Digital Gateway（276,000人 / 138 か国 / 2026-05-19）・Claude for Legal（20+ MCPコネクタ・12 practice-area プラグイン、2026-05-12）・Finance Agents 10 テンプレート（2026年5月）までのアップデートをリリース順に整理。"
updatedDate: 2026-05-30
draft: false
---

**最終更新**: 2026-05-23
**注記**: Claude Coworkはバージョン番号が公開されておらず、日付ベースのリリースノート形式です。**2026年4月9日にGA（一般提供）へ移行**しました。

---

## 概要

Claude CoworkはAnthropicが提供するデスクトップAIエージェント機能。Claude Desktopアプリの一部として2026年1月に研究プレビュー開始。ローカルファイルへのアクセス・複数ステップのワークフロー実行・マルチエージェント並列処理が可能。

---

## リリースタイムライン

### 2026年1月：初回リリース

| 日付 | 内容 |
|------|------|
| 1月12日 | **研究プレビュー開始（Maxプラン）** ― ローカルフォルダへのアクセス許可、ファイル読み書き、複数ステップのワークフロー実行、成果物生成、仮想マシン上での隔離実行、マルチエージェント並列処理、Agent Skills（Excel/PPTX/DOCX/PDF）統合 |
| 1月16日 | **Proプランへ拡大** ― macOS版Claude DesktopのProプランユーザーが利用可能に |
| 1月23日 | **TeamおよびEnterpriseプランへ拡大** |

---

### 2026年2月：エンタープライズ強化

| 日付 | 内容 |
|------|------|
| 2月24日 | **大規模エンタープライズ向けアップグレード** |
| | ・プライベートプラグインマーケットプレイス（Team/Enterprise）― 社内GitHubリポジトリ接続で社内専用プラグイン管理 |
| | ・新プリビルトプラグイン10種以上（HR・デザイン・エンジニアリング・財務分析・投資銀行・株式リサーチ・PE・ウェルスマネジメント等） |
| | ・新MCPコネクタ13種：Google Drive / Google Calendar / Gmail / DocuSign / Apollo / Clay / Outreach / SimilarWeb / MSCI / LegalZoom / FactSet / WordPress / Harvey |
| | ・管理者用「Customize」セクション追加（スキル・プラグイン・コネクタを一元管理） |
| 2月25日 | **定期タスク・スケジュール機能** ― 繰り返し実行タスクおよびオンデマンドタスクの作成・スケジュール設定が可能に |

---

### 2026年3月：永続スレッド・コンピュータ使用

| 日付 | 内容 |
|------|------|
| 3月17日 | **永続エージェントスレッド（Pro/Max 研究プレビュー）** ― Claude Desktop・iOS/Androidアプリから一貫したCoworkタスク管理スレッドにアクセス可能。Maxプランから段階ロールアウト後、Proプランへ展開 |
| 3月23日 | **コンピュータ使用（Computer Use）研究プレビュー（Pro/Max・macOS）** ― Claudeが画面上でのクリック・ファイル操作・開発ツール実行・ナビゲーションを自律実行。「Dispatch」機能との統合でユーザー不在中もPCを操作してタスク継続。Windows対応は近日公開予定 |

---

### 2026年4月：GA（一般提供）移行

| 日付 | 内容 |
|------|------|
| 4月9日 | **GA（一般提供）へ移行** ― Research Previewを終了し、Pro/Maxを含む全有料プランで正式提供開始。macOS/Windows Desktopが正式GAに到達。エンタープライズ向けには次の6機能を追加 |
| | ・**ロールベースアクセス制御（RBAC）** ― チーム・ユーザーグループ単位で機能権限を階層的に割り当て可能 |
| | ・**グループスペンド制限** ― チーム・部門単位でのコスト上限設定 |
| | ・**利用分析（Usage Analytics）** ― 管理ダッシュボードから詳細な使用状況レポートを参照 |
| | ・**Analytics API** ― 利用データをプログラマブルに取得し、社内BIや既存の可観測基盤と連携 |
| | ・**OpenTelemetry拡張対応** ― コンプライアンス・セキュリティツール互換の詳細イベントデータを出力 |
| | ・**Zoom MCPコネクタ／ツール単位のコネクタ制御** ― 会議サマリー・アクションアイテム連携と、コネクタごとのきめ細かなアクセス管理 |
| 4月14日 | **Claude Desktop全面リデザイン** ― IDE型ワークスペースへ刷新。マルチセッションサイドバー、Routines（定期タスク）統合、統合ターミナル、Diffビューア再構築、ドラッグ&ドロップレイアウト、ファイルエディタ内蔵、プレビューペインを追加 |
| 4月15日頃 | **Computer Use（Windows対応）GA** ― 3月にmacOSで先行公開された画面操作機能がWindowsでも一般提供。Dispatchによるユーザー不在時のPC代理操作にも対応 |
| 4月16日頃 | **インライン可視化の標準化** ― グラフ・図表・チャートをCoworkレスポンス内に直接生成。ファイル出力を介さずチャット内でインタラクティブに確認可能 |
| 4月20日 | **Live Artifacts** ― アプリ・ファイルに接続し、開くたびに最新データへ自動更新されるダッシュボード／トラッカーを生成。専用サイドバータブにバージョン履歴付きで保存され、Asana・Linear等のSaaSやローカルファイルをデータソースに利用可能。現時点では個人利用向け（共有・デバイス間同期は未対応） |
| 4月下旬 | **iOS/Androidアプリでのタスク実行対応拡張** ― 永続スレッド閲覧に加え、モバイルからCoworkタスクの起動・進捗確認・成果物プレビューが可能に |
| 4月27日週 | **Amazon Bedrock版Claude Cowork提供開始** ― AWSエンタープライズビルダー向けにClaude CoworkをAmazon Bedrock経由で利用可能に。AWSインフラ内でデータセキュリティを保ったままチーム協働ワークフロー・共有データワークスペース・IaCデプロイに対応。AnthropicとAWSの提携強化に伴い、基盤モデルの学習をAWS Trainium／Gravitonプロセッサ上で実施する方針が公表され、Annapurna Labsとシリコンレベルで共同エンジニアリングを推進。AWSを離れずにClaudeを直接統合できる「Claude Platform on AWS」も近日公開予定 |

---

### 2026年5月：Claude for Small Business 正式公開

| 日付 | 内容 |
|------|------|
| 5月14日（JST）/ 5月13日（PT） | **Claude for Small Business 正式公開（Cowork 内の新トグル）** ― 中小企業（SMB）向けに、QuickBooks・PayPal・HubSpot・Canva・DocuSign・Google Workspace・Microsoft 365（Excel/Word/PowerPoint/Outlook）と連携。**15 本の自動化ワークフロー**（経理・営業・マーケ・HR・カスタマーサービス）と **15 スキル**を追加。Human-in-the-loop（実行前承認）方式を採用。詳細は [Claude for Small Business 完全ガイド](/mdTechKnowledge/blog/claude-for-small-business-guide/) を参照 |
| 5月15日（PT）/ 5月16日（JST） | **PwC × Anthropic 拡大パートナーシップ発表** ― PwC が世界数十万名規模のグローバル従業員に **Claude Code + Cowork** を展開予定（米国チームから順次開始）。両社共同で **Center of Excellence** を設立し、**3万名の PwC プロフェッショナルを Claude 認定** する計画。新設の **Office of the CFO** ユニットは銀行・保険・ヘルスケアなど規制業界向けに Claude を業務組込。導入実績として「保険引受 10週→10日」「セキュリティ業務 数時間→数分」「最大 70% のデリバリ改善」が報告された |
| 5月21日（PT）/ 5月22日（JST） | **Claude Compliance API 統合** ― 公式リリースノートで追加。IT・セキュリティチームが Claude を **他アプリケーション同様の対象** として既存セキュリティ／コンプライアンスツールから管理可能に。「Claude を可視化・統制したい」エンタープライズ要件に応える基盤 |
| 5月28日（PT）/ 5月29日（JST） | **Enterprise プランのコネクタアクセス管理拡張** ― 公式リリースノートで追加。**カスタムロールフレームワークが拡張** され、**各カスタムロールで利用可能なコネクタと個別ツールを管理者が制御** できるように。「グループ別ロール設定」の文脈で、コネクタ単位・ツール単位の細粒度ガバナンスが実現。Claude Opus 4.8 リリースと同日付 |

---

## Claude for Small Business（SMB 向け新トグル）

### 概要

2026年5月13日（PT）／14日（JST）、Anthropic は **Claude for Small Business** を Claude Cowork 内の新トグルとして正式公開した。中小企業（SMB）が日常利用する 7 種の業務 SaaS と Microsoft 365 を直接連携対象とし、Cowork 上の単一インターフェースから 15 ワークフロー・15 スキルを実行できる。米 GDP の 44% を占めながら AI 導入が遅れていた SMB セグメントを開拓する初の専用パッケージ。

### 対応コネクタ

| カテゴリ | サービス |
|---|---|
| 会計・決済 | QuickBooks / PayPal |
| CRM・マーケティング | HubSpot |
| デザイン | Canva |
| 電子署名 | DocuSign |
| 生産性 | Google Workspace |
| Microsoft 365 | Excel / Word / PowerPoint / Outlook |

### 15 本の自動化ワークフロー（領域別）

| 領域 | 主なワークフロー例 |
|---|---|
| 経理（Finance） | 月次決算、請求書追跡（invoice chasing）、給与プランニング |
| 営業（Sales） | リード対応、見込み顧客フォロー、提案書作成 |
| マーケティング | キャンペーン管理、SNS 投稿、コンテンツ制作 |
| HR | 採用書類処理、オンボーディング、給与関連通知 |
| カスタマーサービス | 問い合わせ対応、FAQ 更新、レビュー分析 |

### 15 スキル（再利用可能な業務スキル）

請求書追跡・月次決算・給与プランニング・キャンペーン管理など、SMB の頻出ボトルネックに対応する再利用可能なスキル群として 15 種を初期提供。Cowork のスキルマーケットプレイスから追加・カスタマイズできる。

### Trust & Security

- **権限の継承**: ユーザーの既存権限は変更されず、Claude もそのユーザーが見られる範囲のデータにしかアクセスできない
- **学習除外**: Team / Enterprise プランではユーザーデータをモデル学習に使用しない
- **Human-in-the-loop**: 全てのタスクはユーザーが起動・承認した上で実行される

### 関連プログラム

| プログラム | 内容 |
|---|---|
| AI Fluency for Small Business | PayPal と共同提供する無料コース |
| Claude SMB Tour | 2026年5月14日から米国10都市（Chicago / Tulsa / Dallas 他）で半日ワークショップ |
| Solopreneurship Accelerator Program | Workday Foundation・LISC と共同 |
| CDFI 提携 | Community Development Financial Institutions と連携し SMB 向け資金調達アクセスを拡大 |

### Cowork との関係

Claude for Small Business は新規アプリではなく、**Cowork 内のトグル切替**で SMB 向けプリセットに切り替える構造になっている。Cowork の既存機能（マルチエージェント並列・Routines・Live Artifacts・Computer Use）はそのまま利用でき、SMB 向けには 15 ワークフローと 15 スキルが初期表示される。これにより、規模拡大時にエンタープライズ向け機能（RBAC・Analytics API 等）への移行もシームレスに行える。

### 参考

- [Anthropic: Claude for Small Business](https://www.anthropic.com/news/claude-for-small-business)
- [TechCrunch: Anthropic courts a new kind of customer — small business owners（2026/5/13）](https://techcrunch.com/2026/05/13/anthropic-courts-a-new-kind-of-customer-small-business-owners/)
- [Axios: Anthropic Claude small business SMB（2026/5/13）](https://www.axios.com/2026/05/13/anthropic-claude-small-business-smb)
- [Claude for Small Business 完全ガイド](/mdTechKnowledge/blog/claude-for-small-business-guide/)

---

## PwC × Anthropic 拡大パートナーシップ（2026年5月15日 PT／16日 JST）

### 概要

2026年5月15日（PT）、Anthropic と PwC は既存パートナーシップの大幅拡大を発表した。PwC のグローバル従業員（数十万名規模）に対し **Claude Code + Claude Cowork** を順次展開し、専門サービス・コンサルティング業界での AI 駆動デリバリの標準化を進める。

### 主要数値

| 項目 | 内容 |
|---|---|
| 展開対象 | PwC 世界数十万名規模（米国チームから先行展開） |
| Claude 認定計画 | **3万名**の PwC プロフェッショナルを認定予定 |
| 共同組織 | Center of Excellence を設立 |
| 新設ユニット | **Office of the CFO**（規制業界の CFO 部門向け） |

### 戦略フォーカス領域

1. **Agentic technology development** — エージェント技術の研究開発
2. **AI-native deal execution** — 案件遂行プロセスの AI ネイティブ化
3. **Enterprise function transformation** — 企業内機能（CFO・HR・調達等）の変革

### Office of the CFO

PwC は Claude を中核に据えた新規ビジネスユニット **Office of the CFO** を発足。初期フォーカスは **銀行・保険・ヘルスケア**などの規制業界。CFO 領域の財務・コンプライアンス・ガバナンス業務を Claude による自動化で再構築する。

### 導入実績（パートナーシップ発表時点）

| 領域 | 改善幅 |
|---|---|
| 保険引受（Insurance underwriting） | 10週 → **10日** |
| セキュリティ業務 | 数時間 → **数分** |
| デリバリ全般（プロスポーツ／メインフレーム近代化／HR 変革／サイバーセキュリティ運用） | 最大 **70%** 改善 |
| Advocate Health（PwC クライアント、従業員 16.7万人） | 全社規模での Claude 展開を構築中 |

### Claude Cowork との関係

PwC 内では Claude Cowork の **マルチエージェント並列・Routines・Computer Use** を活用し、業務プロセス（経理・監査・コンサル成果物作成等）の Human-in-the-loop 自動化を本格運用する。コンサル業界での Cowork 大規模採用事例として、エンタープライズ向け Cowork のリファレンスケースに位置付けられる。

### 参考

- [Anthropic: PwC expanded partnership](https://www.anthropic.com/news/pwc-expanded-partnership)
- [SiliconAngle: PwC expands Anthropic alliance, will train 30000 staff（2026/5/14）](https://siliconangle.com/2026/05/14/pwc-expands-anthropic-alliance-will-train-30000-staff-claude/)

---

## KPMG Digital Gateway Powered by Claude（2026年5月19日 PT／20日 JST）

### 概要

2026年5月19日（PT）、Anthropic と KPMG はグローバル戦略アライアンスを発表。KPMG の中核業務プラットフォーム **Digital Gateway（Microsoft Azure 基盤）**に **Claude Cowork + Managed Agents** を組み込み、**全世界 276,000 人超**の従業員が Claude を業務で利用できる体制となる。Big Four 初の大規模 Claude 全社展開。

### 主要数値

| 項目 | 内容 |
|---|---|
| 展開対象 | KPMG グローバル従業員 **276,000+ 人** |
| 地理的範囲 | **138 か国・地域** |
| 統合製品 | Claude Cowork / Managed Agents / Claude Code（PE 案件の KPMG Blaze） |
| 先行運用 | KPMG 米国で 2年間の AI・Data Labs 展開実績 |
| プラットフォーム | KPMG Digital Gateway（Microsoft Azure 基盤） |

### 戦略フォーカス領域

1. **Tax / Legal クライアント業務** — 初期フォーカス。Cowork + Managed Agents による業務 AI 統合
2. **Private Equity** — KPMG は Anthropic の Preferred Partner 指定。PE ポートフォリオ企業の老朽 IT 近代化を加速（Claude Code 活用の KPMG Blaze）
3. **サイバーセキュリティ** — 脆弱性検出・修復ワークフロー

### 改善事例

| 領域 | 改善幅 |
|---|---|
| 税務規制 AI エージェント（Cowork + Managed Agents） | **週単位 → 分単位** |
| ツール／チャット切替の削減 | プラットフォーム集約で workflow 統合 |
| PE ポートフォリオ近代化 | レガシー IT 刷新の加速 |

PwC（5/15）に続く Big Four 大規模採用例。両社の事例は**コンサル業界における Claude 標準化**の急速な進展を示している。

### 参考

- [Anthropic: Anthropic × KPMG global alliance](https://www.anthropic.com/news/anthropic-kpmg)
- [KPMG: Press release — KPMG-Anthropic Global Alliance](https://kpmg.com/us/en/media/news/kpmg-anthropic-global-alliance.html)
- [CPA Practice Advisor: KPMG partners with Anthropic for Digital Gateway Powered by Claude](https://www.cpapracticeadvisor.com/2026/05/20/kpmg-partners-with-anthropic-for-digital-gateway-powered-by-claude/183743/)

---

## Claude for Legal — 業界特化 MCP コネクタと Practice-area プラグイン（2026年5月12日 PT／13日 JST）

### 概要

2026年5月12日（PT）、Anthropic は **法律業界向けの業界特化型大型リリース**として **20+ の MCP コネクタ**と **12 の practice-area プラグイン**を Apache 2.0 ライセンスで OSS 公開した。Claude Cowork から法律実務の主要 SaaS 群と一気通貫接続し、契約・ディスカバリ・リサーチ・案件管理を AI 駆動で実行可能となる。Anthropic 初の業界特化型大型リリース。

### MCP コネクタ群（20+ 本、領域別）

| 領域 | 主要コネクタ |
|---|---|
| **契約管理** | Ironclad / DocuSign / iManage |
| **ディスカバリ** | Relativity / Everlaw |
| **法的リサーチ** | Westlaw / Practical Law / Midpage |
| **案件管理** | Harvey 等 |
| **法律 LLM 等** | LexisNexis 他 |

### Practice-area プラグイン（12 本）

| プラグイン例 | 対象領域 |
|---|---|
| Commercial | 商事法務 |
| Employment | 労働法 |
| Privacy | プライバシー法 |
| Corporate | 企業法務 |
| Regulatory | 規制対応 |
| Litigation | 訴訟支援 |
| その他 | 学生向け教材含む計 12 領域 |

### Cowork での運用イメージ

法務専門家は Cowork 上で **「Westlaw でリサーチ → Relativity でディスカバリ抽出 → iManage で関連契約参照 → DocuSign で署名フロー起票」**といった一連の作業を、コンテキスト連動した会話のなかで完結可能となる。

### 採用事例

- **Freshfields**（英国系国際法律事務所）が**数千ユーザー規模**で展開済
- 法曹は Claude Cowork で最多職種となっている（Anthropic 集計）

### 参考

- [Anthropic Blog: Claude for the Legal Industry](https://claude.com/blog/claude-for-the-legal-industry)
- [LawNext: Anthropic Goes All-In on Legal—Releasing More Than 20 Connectors and 12 Practice-Area Plugins](https://www.lawnext.com/2026/05/anthropic-goes-all-in-on-legal-releasing-more-than-20-connectors-and-12-practice-area-plugins-for-claude.html)
- [TechCrunch: The AI legal services industry is heating up — Anthropic is getting in on the action](https://techcrunch.com/2026/05/12/the-ai-legal-services-industry-is-heating-up-anthropic-is-getting-in-on-the-action/)

---

## Finance Agents — 金融サービス向け 10 エージェントテンプレート（2026年5月）

### 概要

法律業界（Claude for Legal）と並行し、Anthropic は**金融サービス向け 10 エージェントテンプレート**を Cowork で提供開始。投資銀行・PE・資産運用・保険・規制当局対応など、金融特化のワークフローをすぐに利用できるテンプレート群となっている。

### 代表的テンプレート

| テンプレート | 用途 |
|---|---|
| **ピッチブック作成** | M&A・IPO アドバイザリ向け資料生成 |
| **KYC スクリーニング** | 顧客審査・制裁リスト照合の自動化 |
| **月次締め処理** | 経理クローズフローの AI 補助 |
| その他 7 本 | デューデリ／決算分析／規制レポート／コンプライアンス監査等 |

### 位置付け

Claude for Legal と組み合わせて、**専門サービス（コンサル／法律／金融）における業界特化 Claude 展開**の3本柱を構成する。Cowork の汎用エージェントとの違いは、**業界知識・データソース連携・成果物テンプレートが事前定義**されている点。

### 参考

- [Anthropic: Finance Agents](https://www.anthropic.com/news/finance-agents)

---

## 参考：Claude.ai 全体の関連アップデート

| 日付 | 内容 |
|------|------|
| 2月12日 | セルフサービスエンタープライズプラン提供開始 |
| 2月17日 | Claude Sonnet 4.6 リリース（100万トークンコンテキストウィンドウ ベータ） |
| 3月2日 | 無料ユーザー向けメモリ機能開放 |
| 3月11日 | Excel/PowerPoint連携強化（両アプリ間での完全なコンテキスト共有） |
| 3月12日 | カスタムチャート・ビジュアライゼーションをチャット内にインライン表示 |
| 3月25日 | モバイルアプリでインタラクティブアプリ（チャート・図表）利用可能に |
| 4月16日 | **Claude Opus 4.7 GA** ― CoworkのバックエンドモデルもOpus 4.7利用可能に |
| 4月17日 | **Claude Design** リサーチプレビュー公開（プロトタイプ・スライド・ワンページャーのビジュアル生成） |
| 4月18日 | **Project Glasswing** 発表（Claude Mythos Previewによるセキュリティ強化イニシアチブ） |
| 4月19日 | **Claude Haiku 3 廃止** ― CoworkでHaiku 3を利用していた場合は後継モデル（Haiku 4.5など）への移行が必要 |

---

## 対応プラットフォーム

| プラットフォーム | 対応状況 |
|----------------|---------|
| macOS（Claude Desktop） | GA（2026年4月9日） |
| Windows（Claude Desktop） | GA（2026年4月9日、Computer Useも4月中旬にGA） |
| iOS / Android | 永続スレッド・タスク起動・進捗確認・成果物プレビューに対応 |

---

## プラン別提供状況

| プラン | 提供開始 |
|--------|---------|
| Max | 2026年1月12日（研究プレビュー） → 2026年4月9日 GA |
| Pro | 2026年1月16日（研究プレビュー） → 2026年4月9日 GA |
| Team / Enterprise | 2026年1月23日（研究プレビュー） → 2026年4月9日 GA（RBAC・Analytics API等のエンタープライズ機能はTeam/Enterprise限定） |
| 無料 | 未対応 |

※料金は各プランの既存サブスクリプションに含まれる形で提供されます（Cowork単体の追加課金なし）。エンタープライズ向けの高度な統制・分析機能はTeam/Enterpriseプランのみで利用可能です。

---

## 注意事項

- 2026年4月9日にGA（一般提供）へ移行済み。正式リリースのバージョン番号は存在しない
- バグ修正の個別リストは公式リリースノートでは非公開
- Computer Use機能は仮想マシン上での隔離実行により安全性を確保（macOS・Windowsで一般提供）
- Live Artifactsはローカル端末上に保存されるため、デバイス間の同期や他ユーザーとの共有には対応していない（2026年4月時点）
- 閉域網環境での利用制限あり
