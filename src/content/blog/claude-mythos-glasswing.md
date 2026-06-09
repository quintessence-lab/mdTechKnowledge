---
title: "Claude Mythos Preview & Project Glasswing — セキュリティ特化LMと重要インフラ防衛プログラム"
date: 2026-04-26
updatedDate: 2026-06-10
category: "Claude技術解説"
tags: ["Claude", "Mythos", "Glasswing", "セキュリティ", "Anthropic", "重要インフラ", "Bedrock", "Vertex AI", "Claude Security"]
excerpt: "Anthropicがセキュリティタスク特化型LM「Claude Mythos Preview」と重要インフラ防衛プロジェクト「Project Glasswing」を発表。能力範囲・想定ユースケース・公開条件・既存Claudeとの差別化に加え、AWS Bedrock・Google Vertex AIでのGated Research Preview提供、GlasswingからClaude Security Beta（防御製品）への発展経緯、さらに2026年6月の第2次拡張（約150組織・15カ国以上、公共インフラ・医療等へ拡大）と Mythosクラスのモデルを『数週間以内』に一般提供する方針転換までを整理。"
draft: false
---

## はじめに

2026年4月7日、Anthropicはサイバーセキュリティ領域に特化した新しい汎用言語モデル「**Claude Mythos Preview**」と、それを重要インフラ防衛に活用するイニシアチブ「**Project Glasswing**」を同時発表しました。Mythosは数十年間人間のレビューと自動テストをすり抜けてきた脆弱性を次々と発見する能力を持ち、Anthropicは「公開しない」という異例の判断を下しています。本記事では、この2つの発表の全体像と技術的・社会的インパクトを整理します。

## 1. Claude Mythos Preview とは

### 公式名称とリリース時期

正式名称は「Claude Mythos Preview」。2026年4月7日にAnthropicの研究組織「red.anthropic.com」を通じて公表されました。情報は事前のデータリーク事件（[Fortune報道](https://fortune.com/2026/03/26/anthropic-says-testing-mythos-powerful-new-ai-model-after-data-leak-reveals-its-existence-step-change-in-capabilities/)）によって部分的に流出していた経緯もあり、Anthropicは社内で「step change（段階的飛躍）」と表現しています。

### セキュリティタスク特化の汎用LM

Mythosは、Claude 3 / Claude 4 / Claude Opus系列とは異なる位置づけの**汎用LM**ですが、その特性は**コンピュータセキュリティタスクに著しく偏っている**点が最大の特徴です。Anthropic公式サイトによれば「全般的に高性能だが、セキュリティ系タスクで特に突出している」と説明されています。

### 既存 Claude モデルとの位置づけ

| モデル | 主な役割 | 公開状況 |
|--------|----------|----------|
| Claude Opus 4.7 | 一般用途・コーディング・推論 | 一般公開（API・claude.ai） |
| Claude Sonnet | バランス型 | 一般公開 |
| Claude Haiku | 軽量・高速 | 一般公開 |
| **Claude Mythos Preview** | **セキュリティ特化** | **限定アクセスのみ・一般非公開** |

Opus 4.6では成功率がほぼ0%だったFirefoxエクスプロイト開発タスクで、Mythos Previewは181回成功するなど、セキュリティ領域では既存モデルから劇的な飛躍を示しています（出典：[red.anthropic.com](https://red.anthropic.com/2026/mythos-preview/)）。

### 主要能力

公式ブログとUK AI Safety Institute（[AISI評価](https://www.aisi.gov.uk/blog/our-evaluation-of-claude-mythos-previews-cyber-capabilities)）の評価によると、Mythos Previewは以下の能力を備えます。

- **ゼロデイ脆弱性発見**：主要OS（Linux、OpenBSD、FreeBSD）、Webブラウザ、暗号ライブラリ、メディア処理系で数千件のゼロデイを発見
- **長年潜伏したバグの検出**：OpenBSDで27年前、FFmpegで16年前のバグを発見
- **エクスプロイト自動生成**：JITヒープスプレイ、KASLR回避、ROPチェーン分割など高度な技法を組み込み、専門家が数週間要する攻撃チェーンを数時間で生成
- **複数脆弱性のチェーニング**：Linux権限昇格で最大4つの脆弱性を自動連結
- **逆エンジニアリング**：クローズドソースバイナリから疑似ソースを再構築
- **ロジック脆弱性の発見**：認証バイパス、CSRFなど従来のファジングでは検出困難なバグの特定
- **SOC支援・脅威分析**：ログ解析、IoC抽出、脅威ハンティングへの応用

スキャン規模は約7,000エントリポイント・数千リポジトリに及び、検出された脆弱性の99%以上は公表時点で未パッチです。

### アクセス・公開条件

Anthropicは当初**Mythos Previewを一般公開しない方針**を明確にしていました（※2026年5月末以降、Mythosクラスのモデルを「数週間以内に全顧客へ提供する見込み」と方針を転換。詳細は後述「『数週間以内』の一般提供方針」節を参照）。発表当初の利用は次の3つに限定されていました。

1. Project Glasswingの参加組織（後述）
2. オープンソースセキュリティチーム（限定的）
3. Anthropic社内のレッドチーム

将来的には「Cyber Verification Program」によって正規セキュリティ業務従事者の例外承認制度を整備し、危険な出力を遮断するセーフガードの開発後に段階的に拡大する計画です。

#### マルチクラウド経由のGated Research Preview（2026年4月下旬追加）

2026年4月下旬、AWS Bedrock と Google Cloud Vertex AI の両方で **Claude Mythos Preview の Gated Research Preview 提供** が開始されました。Anthropic 直接アクセスに加え、企業ユーザーが既存のクラウド契約とコンプライアンス枠組みのなかで Mythos を評価できるようになっています。

| プラットフォーム | 提供形態 | 申請窓口 |
|---|---|---|
| **Amazon Bedrock** | Gated Research Preview（Anthropic 同等の審査要件） | AWS Bedrock コンソール → モデルアクセス申請 |
| **Google Cloud Vertex AI** | 同上、招待制 | Vertex AI Model Garden → Anthropic 経由申請 |

参考: [AWS What's New](https://aws.amazon.com/about-aws/whats-new/2026/04/amazon-bedrock-claude-mythos/) / [Google Cloud Blog](https://cloud.google.com/blog/products/ai-machine-learning/claude-mythos-preview-on-vertex-ai)

> Bedrock / Vertex 経由でも審査・利用範囲制限は Anthropic 直接アクセスと同等。Project Glasswing 参加組織または同等のセキュリティ研究組織であることが要件です。

## 2. Project Glasswing とは

### 目的

[Project Glasswing](https://www.anthropic.com/glasswing)は「AI時代に世界で最も重要なソフトウェアを守る」ことを掲げる産業横断プログラムです。Mythos Previewが攻撃者の手に渡る前に、防衛側が同等以上の能力を獲得することを目指します。

### 対象範囲

公式発表では以下の重要インフラ領域がカバーされます。

- **電力・エネルギー**：送配電制御システム、SCADA
- **水道**：浄水・配水制御
- **医療**：病院ネットワーク、医療機器ファームウェア
- **金融**：銀行コアシステム、決済ネットワーク
- **通信**：5G/6Gコア、ネットワーク機器
- **クラウド・OS基盤**：主要OS、ブラウザ、ハイパーバイザ
- **オープンソース基盤**：Linux kernel、OpenSSL、FFmpegなど

### パートナーシップ・連携先

ローンチパートナー（[CyberScoop報道](https://cyberscoop.com/project-glasswing-anthropic-ai-open-source-software-vulnerabilities/)）には以下が含まれます。

- **クラウド・プラットフォーム**：Amazon Web Services、Apple、Google、Microsoft
- **ネットワーク・ハードウェア**：Broadcom、Cisco、NVIDIA
- **セキュリティベンダー**：CrowdStrike、Palo Alto Networks、Zscaler
- **金融**：JPMorgan Chase
- **OSS**：Linux Foundation

加えて、重要インフラを支える40以上の組織が追加アクセス権を得ています。

### 財政コミットメント

Anthropicは**最大1億ドルの利用クレジット**と**400万ドルのオープンソースセキュリティ組織への寄付**をコミットしています。

### Mythosとの関係

Glasswingは「Mythosを社会的に責任ある形で活用する枠組み」と位置づけられます。Mythosが発見した脆弱性をGlasswing参加組織が責任ある開示プロセスで修正し、パッチ後最大135日以内に詳細を公表する運用です。SHA-3ハッシュコミットメント形式で証拠を保持し、改ざん不能な発見記録を残します。

## 3. 想定ユースケース

| 領域 | ユースケース |
|------|--------------|
| OSS保守 | Linux kernel、OpenSSLなどの大規模監査 |
| ベンダー製品 | iOS、Android、Windows、macOSの内部脆弱性ハント |
| SOC運用 | アラートトリアージ、脅威ハンティング、IoC生成 |
| 金融セキュリティ | 取引システムのロジック脆弱性検出、不正アクセス検知 |
| 重要インフラ | SCADA・産業制御システム（ICS）のファームウェア解析 |
| 医療機器 | 組み込みファームウェアの暗号実装監査 |
| バグバウンティ補完 | 商用製品の責任ある開示前検証 |

## 4. 倫理・誤用対策

Mythosは「[公開すれば攻撃者を強化しすぎる](https://venturebeat.com/technology/anthropic-says-its-most-powerful-ai-cyber-model-is-too-dangerous-to-release)」とAnthropic自身が判断したモデルです。誤用対策は多層構造になっています。

- **アクセス制限**：APIすら一般公開しない。クラウド経由ではなく隔離環境での利用
- **ネットワーク隔離**：Mythosの実行はオフライン環境で行う運用が推奨
- **ヒトによる検証**：専門セキュリティトリアジャーがバグレポートを検証（成功率98%以内）
- **クローズドソース解析の制限**：対応するバグバウンティが存在する範囲のみ
- **ハッシュコミットメント**：発見証拠の改ざん防止
- **段階的開示**：パッチ後最大135日でディスクロージャ
- **将来のセーフガード**：危険な出力を検出・遮断するフィルタ層を後続Opusモデルに統合予定

## 5. Anthropicのセキュリティ施策との接続

Mythos / Glasswingは独立した発表ではなく、Anthropicの長期的な安全性施策の延長線上にあります。

- **Responsible Scaling Policy（RSP）**：モデルの能力閾値に応じてセーフガードを段階的に強化する枠組み。MythosはRSPで定義される「サイバー能力閾値」を超えたため、限定公開の意思決定がトリガーされたと見られます
- **Constitutional AI**：拒否ポリシーの基盤。攻撃者支援的な出力を遮断
- **AISIなど第三者評価**：UK AISIによる独立評価が実施され、英国政府レベルでの検証が入っています（[CFR論考](https://www.cfr.org/articles/six-reasons-claude-mythos-is-an-inflection-point-for-ai-and-global-security)）
- **Cyber Verification Program**（計画中）：将来の利用者認証制度

### Glasswing → Claude Security Beta（防御製品への発展）

2026年5月1日、Anthropic は **Claude Security Beta** を発表しました。これは Glasswing イニシアチブで蓄積した「攻撃側の能力（Mythos の脆弱性発見・エクスプロイト生成）を裏返して、防御側の検出・パッチ生成に転用する」アプローチを **エンタープライズ向けプロダクト** として提供するものです。

```
Glasswing (2026-04-07)              Claude Security Beta (2026-05-01)
─────────────────────────           ──────────────────────────────────
研究プログラム                  →   エンタープライズ向け製品
・Mythos を防衛側に提供              ・コードベース脆弱性スキャン
・参加組織限定                       ・パッチ自動生成
・Anthropic 直接運用                 ・Opus 4.7 powered (Mythos 派生)
                                     ・CrowdStrike / Wiz 等パートナー連携
```

主要パートナー:
- **技術統合**: CrowdStrike / Microsoft Security / Palo Alto Networks / SentinelOne / TrendAI / Wiz
- **デプロイ支援**: Accenture / BCG / Deloitte / Infosys / PwC

つまり Mythos / Glasswing は研究フェーズ、Claude Security Beta はそこから派生した製品フェーズという位置付けで、**両者は技術系譜上一直線につながっています**。詳細は [`claude-security-beta.md`](./claude-security-beta) を参照してください。

参考: [SiliconANGLE](https://siliconangle.com/2026/04/30/anthropic-announces-claude-security-public-beta-find-fix-software-vulnerabilities/) / [SC World](https://www.scworld.com/brief/anthropic-opens-claude-security-public-beta-for-code-audits)

### Glasswing 初回進捗アップデート（2026-05-24〜25 PT / 2026-05-25〜26 JST）

2026年5月24〜25日（PT）、Anthropic は **Project Glasswing 初回進捗アップデート** を公表しました（[公式記事](https://www.anthropic.com/research/glasswing-initial-update)）。約50パートナー企業のシステムで Claude Mythos Preview を運用し、**10,000件超** の高・クリティカル深刻度脆弱性を発見したことを明らかにしています。

#### 数値サマリ

| 観点 | 数値 |
|---|---|
| 約50パートナー企業の合計脆弱性発見数 | **10,000件超**（高・クリティカル深刻度） |
| 真陽性（True Positive）件数 | **1,726件**（注: パートナー企業環境での確定数） |
| 1,000+ OSSプロジェクトでの追加発見 | **6,202件**（高・クリティカル、検証精度 **90.6%**） |
| Cloudflare 発見数 | **2,000件**（うち **400件** が高・クリティカル）。False positive 率はヒトテスター比でも優秀 |
| Mozilla Firefox 発見数 | **271件**（旧モデル比 **10倍**） |
| Microsoft / Oracle | パッチサイクルの **加速** を報告 |

#### 代表事例：WolfSSL CVE-2026-5194

| 項目 | 値 |
|---|---|
| 対象 | WolfSSL（IoT・組込み向け軽量 TLS/SSL ライブラリ） |
| CVE | **CVE-2026-5194** |
| CVSS | **9.1（Critical）** |
| 発見者 | Mythos Preview（Glasswing パートナー経由） |
| 含意 | IoT/組込み機器の TLS 実装が広範に影響 |

#### 課題のシフト：「発見」から「修正・開示・パッチ適用」へ

公式レポートのキーメッセージ:

> *「ソフトウェアセキュリティの進歩は、これまで『どれだけ早く新しい脆弱性を見つけられるか』に制約されていた。今は『どれだけ早く検証し、開示し、パッチを当てられるか』が制約になっている。」*

→ 「攻撃面の発見能力」が AI で大幅に底上げされた結果、**ボトルネックがパッチ運用サイクル側に移った** ことが現場データから裏付けられた格好。Anthropic はこれを受け、開発者にはパッチサイクル短縮を、利用者には常時最新版維持を推奨しています。

#### Claude Security との関係

Claude Security Beta（後述「Glasswing → Claude Security Beta」節）でも、**2026-05-22 時点でパブリックベータ開始 3週間** で Claude Opus 4.7 が **2,100件以上** のパッチを適用済みと公表。Glasswing（攻撃面の発見）→ Claude Security（防御側の修正生成）という両輪の規模感が、本初回進捗アップデートで具体的な数値として可視化されました。

参考: [Anthropic 公式: Project Glasswing initial update](https://www.anthropic.com/research/glasswing-initial-update) / [Help Net Security](https://www.helpnetsecurity.com/2026/05/26/anthropic-project-glasswing-update/) / [Benzinga](https://www.benzinga.com/markets/private-markets/26/05/52759147/anthropics-project-glasswing-finds-more-than-10000-critical-bugs-expands-to-additional-pa)

### Glasswing 第2次拡張：約150組織・15カ国以上へ（2026-06-02）

2026年6月2日（JST 6/3）、Anthropic は Project Glasswing を **約150の新規組織** へ拡大すると発表しました（[Anthropic 公式: Expanding Project Glasswing](https://www.anthropic.com/news/expanding-project-glasswing)）。これにより参加組織は **合計約200組織** となり、新規パートナーは **15カ国以上** に所在します。初期コホート（約50組織）で手薄だった分野を重点的に補強し、**電力・水道（公共インフラ）、医療、通信、ハードウェア** の各事業者が加わりました。

| 観点 | 数値・内容 |
|---|---|
| 新規参加組織 | **約150組織**（追加分） |
| 拡張後の合計 | **約200組織** |
| 対象国 | **15カ国以上** |
| 重点補強分野 | 電力・水道（公共インフラ）、医療、通信、ハードウェア |
| 想定リスク規模 | 新規パートナーの多くは「大規模攻撃が **1億人超** に影響し得る」重要度（Anthropic 公式） |
| 利用条件 | 従来同様、アクセス前に所定のセキュリティ要件を満たす必要がある |

Anthropic 公式は拡大記事のなかで、約50社の初期パートナーがこれまでに **10,000件超** の高・クリティカル深刻度の脆弱性を発見したことを改めて挙げ、重要インフラ防衛を地理的・分野的に広げる狙いを示しています。

> 本節の数値・分野は Anthropic 公式発表および報道（[CNBC](https://www.cnbc.com/2026/06/02/anthropic-mythos-ai-project-glasswing.html) / [9to5mac](https://9to5mac.com/2026/06/02/anthropic-expands-glasswing-as-it-promises-public-claude-mythos-class-model-releases/)）に基づきます。合計組織数（約200）など一部数値は報道ベースである点に留意してください。

### 「数週間以内」の一般提供方針（Mythosクラス・モデル）

第2次拡張に併せ、Anthropic は **Mythosクラスのモデルを一般顧客にも提供する方針** を改めて示しました。公式の文言は次のとおりです（条件付きである点に注意）。

> *「We're making swift progress on developing these safeguards and expect to be able to bring Mythos-class models to all our customers in the coming weeks.（セーフガードの開発を急速に進めており、数週間以内にMythosクラスのモデルを全顧客に提供できる見込み）」*

この声明はもともと **2026年5月28日の Claude Opus 4.8 発表に併せて** 公表されたもので、6月2日の Glasswing 拡大発表で再掲されました（[BleepingComputer](https://www.bleepingcomputer.com/news/artificial-intelligence/anthropic-confirms-claude-mythos-class-models-will-roll-out-to-the-public/) / [9to5mac](https://9to5mac.com/2026/06/02/anthropic-expands-glasswing-as-it-promises-public-claude-mythos-class-model-releases/)）。ただし提供は **危険な出力を遮断するセーフガードの完成が前提** であり、Anthropic 公式の拡大記事自体は具体的な公開日を明示せず「安全に一般提供できるよう可能な限り急いでいる」とするにとどまっています。Mythos Preview を「公開しない」とした当初方針から、**段階的に一般提供へ舵を切る転換点** と位置づけられます。

### 【2026-06-10追記】予告の実現 — Claude Fable 5 / Mythos 5 をリリース

上記の「数週間以内」の予告は、**2026年6月9日（PT）＝ 6月10日（JST）に現実のもの**となりました。Anthropic は Mythos クラスを2つの形で提供開始しました（[公式ニュース](https://www.anthropic.com/news/claude-fable-5-mythos-5) / [開発者ドキュメント](https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5)）。

| 区分 | モデル | 提供形態 | 安全classifier |
|:---|:---|:---|:---|
| **一般公開版** | **Claude Fable 5**（`claude-fable-5`） | GA（API / Claude Platform on AWS / Bedrock / Vertex AI / Microsoft Foundry） | あり（高リスク領域をブロック） |
| **承認組織向け** | **Claude Mythos 5**（`claude-mythos-5`） | Project Glasswing 経由の承認顧客限定 | 一部解除（Fable 5 と同一基盤モデルでセーフガードを外した版） |

- **能力クラス**: Mythos クラス（Fable 5 / Mythos 5）は **Opus クラス（Opus 4.8 等）より上位**と位置づけられ、Fable 5 は「最も高性能な広く提供されるモデル」。公式は **FrontierCode で frontier モデル中最高**、**Hebbia Finance ベンチで全モデル中最高**、スプレッドシート系タスクで **Opus 4.8 比 25〜30% 高速**、永続メモリ活用タスクで **Opus 4.8 比3倍**などを挙げ、「ほぼ全ベンチで SOTA」としています。
- **API 料金**: 入力 **$10** / 出力 **$50** per MTok（Fable 5・Mythos 5 共通。Mythos Preview の半額未満、Opus 4.8 の約2倍）。プロンプトキャッシュ読取 $1/MTok、Batch は半額（$5/$25）。
- **提供条件（対話プラン）**: **6月9日〜6月22日（PT）まで Pro / Max / Team / 座席制 Enterprise に追加料金なし**、**6月23日以降はこれらのプランから外れクレジット制**に移行。API・消費ベース Enterprise は当初から通常提供。
- **安全ガードレール（Fable 5）**: **サイバーセキュリティ・生物・化学・蒸留（distillation）** の高リスク領域でリクエストを拒否（`stop_reason: "refusal"` を HTTP 200 で返す）し、**Opus 4.8 へフォールバック**できる設計（`fallbacks` パラメータ／SDKミドルウェア）。出力生成前の拒否は非課金。公式は **「95%超のセッションはフォールバックなしで完結し、その場合 Fable 5 の性能は Mythos 5 と実質同等」** としています。
- **パラメータ仕様**: Adaptive thinking が常時 ON（無効化不可、深さは `effort` で制御）、extended thinking 非対応、raw CoT 非返却（要約のみ取得可）。コンテキスト 1M／最大出力 128k。

> Mythos Preview で「公開しない」とした当初方針からの転換が、**安全classifier＋Opus 4.8 フォールバック**という設計で「一般公開（Fable 5）」と「承認組織向け強化版（Mythos 5）」に分離する形で着地した、と言えます。Fable 5 単独の詳細は別途専用記事で扱う予定です。

### Pentagon・連邦政府との関係動向（2026年4〜5月）

Mythos の限定公開方針は、米連邦政府（特に Pentagon）との関係においても緊張と進展の両面を生んでいます。2026年4月下旬から5月にかけて、以下の動きが報じられました。

#### 2026-04-20（米時間） — TechCrunch / Axios: NSA が Pentagon 禁止令をよそに Mythos を利用

[TechCrunch 報道](https://techcrunch.com/2026/04/20/nsa-spies-are-reportedly-using-anthropics-mythos-despite-pentagon-feud/)（Axios ソース）によると、**米国家安全保障局（NSA）が Claude Mythos Preview を利用していた** ことが明らかになりました。Pentagon が Anthropic を **"supply-chain risk"（サプライチェーンリスク）** に指定した数週間後の出来事です。

| 項目 | 内容 |
|---|---|
| **NSA の用途** | 自組織環境内の **悪用可能な脆弱性スキャン**（防御側ユースケース） |
| **Pentagon の指定理由** | Anthropic が Mythos のフル機能への無制限アクセス供与を拒否したため |
| **Anthropic の対応** | 同指定を不服とし、**国防総省に対し訴訟を提起** |
| **Mythos のアクセス組織数** | 約 **40 組織**（公表は約 12 組織のみ）。UK AI Security Institute も含まれる |

この事案は「Pentagon と Anthropic の確執」が続く一方で、**情報コミュニティ（IC）側は独自に Mythos を利用し始めている** ことを示しており、連邦政府内でも Mythos に対する評価が一枚岩でないことを浮き彫りにしています。

#### 2026-05-02（JST） — CNBC: Pentagon 技術責任者「Anthropic は依然 blacklist、Mythos は別案件」

[CNBC 報道](https://www.cnbc.com/2026/05/01/pentagon-anthropic-blacklist-mythos-michael.html) によると、Pentagon の技術責任者は CNBC のインタビューで以下の趣旨を表明しました。

- **Anthropic は引き続き Pentagon の blacklist 上に置かれている**（supply-chain risk 指定は維持）
- ただし **Mythos の評価・調達検討は blacklist とは別案件** として扱われている
- NSA を含む他連邦機関での Mythos 利用は Pentagon の管轄外であり、所管機関の判断による

つまり「Anthropic 全社としての調達禁止」と「Mythos モデル個別の利用評価」は **異なるトラック** で進行しており、Pentagon 自身も Mythos 能力には関心を持っている、という構図が浮かび上がっています。

#### 2026年5月 — 下院国土安全保障委員会による非公開ブリーフィング

[The Hill 報道](https://thehill.com/policy/technology/5875253-house-briefing-anthropic-mythos/) によると、2026年5月、米下院国土安全保障委員会（House Homeland Security Committee）が Mythos に関する **非公開ブリーフィング** を実施しました。

| 項目 | 内容 |
|---|---|
| **実施場所** | 下院国土安全保障委員会（非公開セッション） |
| **Anthropic 側参加者** | **フロンティアレッドチーム**および**国家安全保障チーム** |
| **内容** | Mythos の能力・リスクプロファイル・Glasswing 運用説明 |
| **特記事項** | **ライブデモを実施** — Mythos が実際に脆弱性を発見・エクスプロイト生成する様子を委員会メンバーに提示 |

立法府レベルでの Mythos 認知が本格化したことを示すイベントで、今後の **AI ガバナンス立法・予算審議** の前提情報として位置づけられます。Pentagon との対立構図に加え、議会側の独立評価という第三の軸が動き出した格好です。

#### この3つの動きが意味するもの

| 主体 | スタンス |
|---|---|
| **Pentagon（行政府・国防）** | Anthropic を blacklist 維持。ただし Mythos 個別評価は別トラック |
| **NSA（行政府・情報）** | 既に防御目的で実利用中。Pentagon の指定とは独立した判断 |
| **下院国土安全保障委員会（立法府）** | 非公開ブリーフィングで独自評価を開始。ライブデモで能力を直接確認 |

Mythos / Glasswing は単一の「政府との関係」ではなく、**省庁・機関・立法府それぞれが独立した評価・利用判断を行う多層的な状況** に入っています。今後のセキュリティ立法、AI輸出管理、調達ポリシーへの波及に注目が必要です。

## 6. 開発者・企業へのインパクト

### 開発者への影響

- **パッチサイクルの短縮が必須に**：Mythos相当の能力が攻撃者側に出現するまで時間が限られるため、月次パッチでは間に合わない可能性
- **依存ライブラリ監査の重要性増大**：長年潜伏した脆弱性が大量発見されるため、SBOM管理・依存関係追跡が必須
- **シークレット管理の厳格化**：認証バイパス・ロジック脆弱性の発見が容易になるため、設計時点での防御が重要

### 企業への影響

- **自動アップデート前提の運用**：Anthropicは公式に「自動アップデート拡大」を要求
- **インシデント対応自動化**：人手では追従不能な発見スピードに対応するため、SOAR等の整備が必須
- **重要インフラ事業者は早期参加検討**：Glasswingに参加できなかった事業者は、Mythos相当能力が一般化する移行期に脆弱なまま取り残されるリスク
- **AI Bill of Materials（AIBOM）**：自社が利用するAIサービスがMythos的能力を提供しているか、提供しないかの確認

[AEIの論考](https://www.aei.org/technology-and-innovation/anthropics-project-glasswing-is-a-warning-technical-debt-is-now-a-national-security-risk/)は「技術的負債は今や国家安全保障リスクである」と指摘しており、レガシーシステムを抱える組織への警鐘となっています。

## まとめ

Claude Mythos PreviewとProject Glasswingは、AIによるサイバーセキュリティの「攻防均衡」を一気に書き換えるイベントです。Anthropicが「公開しない」という選択をしたこと自体が、AI能力ガバナンスの新たな前例となります。本記事の内容は2026年4月時点で公表されている情報に基づいており、Anthropic公式の[Project Glasswing](https://www.anthropic.com/glasswing)および[red.anthropic.com](https://red.anthropic.com/2026/mythos-preview/)が一次情報源です。今後のCyber Verification Programの詳細や、後続Opusモデルへのセーフガード統合動向に注目する必要があります。

### 参考リンク

- 一次情報：[Claude Mythos Preview（red.anthropic.com）](https://red.anthropic.com/2026/mythos-preview/)
- 一次情報：[Project Glasswing（anthropic.com）](https://www.anthropic.com/glasswing)
- 二次報道：[TechCrunch](https://techcrunch.com/2026/04/07/anthropic-mythos-ai-model-preview-security/)
- 二次報道：[SecurityWeek](https://www.securityweek.com/anthropic-unveils-claude-mythos-a-cybersecurity-breakthrough-that-could-also-supercharge-attacks/)
- 二次報道：[Foreign Policy](https://foreignpolicy.com/2026/04/20/claude-mythos-preview-anthropic-project-glasswing-cybersecurity-ai-hacking-danger/)
- 評価：[UK AISI評価レポート](https://www.aisi.gov.uk/blog/our-evaluation-of-claude-mythos-previews-cyber-capabilities)
- パートナー視点：[CrowdStrike](https://www.crowdstrike.com/en-us/blog/crowdstrike-founding-member-anthropic-mythos-frontier-model-to-secure-ai/) / [Zscaler](https://www.zscaler.com/blogs/company-news/zscaler-anthropic-project-glasswing)
