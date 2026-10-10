---
title: "Anthropic の買収・買収交渉まとめ — Bun・Vercept・Stainless、報道ベースの Coefficient Bio、破談に終わった Decart（2025年12月〜2026年9月）"
date: 2026-10-10
category: "一般リサーチ"
tags: ["Anthropic", "買収", "M&A", "Bun", "Vercept", "Stainless", "Decart", "Coefficient Bio", "Claude Code", "Computer Use", "一般リサーチ"]
excerpt: "Anthropic が2025年12月から2026年9月にかけて発表・報道された買収と買収交渉を、公式発表（Bun・Vercept・Stainless）と報道ベースの案件（Coefficient Bio・Decart）に分けて一覧する。Bun は Claude Code のためのランタイム（2025-12-03・MIT ライセンス継続）、Vercept は computer use 強化（2026-02-25・外部向け製品は終了）、Stainless は SDK／MCP ツール（2026-05-18・ホスト型製品は終了、価格は公式非開示で報道に$300M超）。Decart は2026-08-13に約$6B の買収交渉が報じられたが、9月上旬に Anthropic がデューデリジェンス後に撤退したと報じられた。各案件で『公式発表されたこと』『報道されたこと』『確認できないこと』を区別し、全体を貫く狙い（開発者基盤・エージェント能力・計算効率・ライフサイエンス）を整理する。"
draft: false
---

> ## 要点
>
> - Anthropic の2025年12月以降の買収は、**公式発表されたもの**が3件（**Bun**・**Vercept**・**Stainless**）。いずれも**金額は公式に開示されていません**。
> - **報道ベース**の案件が2件あります。**Coefficient Bio**（生命科学系、約$400M の全額株式取引と報じられた。公式確認は見つからず）と **Decart**（イスラエル発、約$6B の買収交渉）です。
> - **Decart は不成立**です。2026年8月13日に Bloomberg が約$6B の交渉を報じましたが、**9月上旬に「Anthropic がデューデリジェンスのあと撤退した」と同じ Bloomberg が報じました**。理由は公表されておらず、双方ともコメントを控えています。
> - 買収の狙いは大きく4つ——**開発者基盤**（Bun・Stainless）、**エージェントの実行能力**（Vercept）、**計算効率**（Decart）、**ライフサイエンス**（Coefficient Bio）。ただし「なぜその会社か」の細部は、公式が明かしていない部分を報道と解釈で補っています。本記事ではその区別を明示します。

## 1. 一覧

| 時期 | 案件 | 種別 | 金額 | 状況 | 情報の確度 |
|:---|:---|:---|:---|:---|:---|
| 2025-12-03 | **Bun**（JavaScript ランタイム） | 買収 | 非開示 | 完了（チームが Anthropic に参加） | 公式発表 |
| 2026-02-25 | **Vercept**（computer use／知覚・操作） | 買収 | 非開示 | 完了（外部向け製品は終了） | 公式発表 |
| 2026-04（報道） | **Coefficient Bio**（生命科学 AI） | 買収と報じられた | 約$400M・全額株式（報道） | 報道ベース（公式確認は未確認） | 二次報道 |
| 2026-05-18 | **Stainless**（SDK／MCP サーバーのツール） | 買収 | 公式非開示（報道に「$300M超」） | 発表済み（ホスト型製品は終了） | 公式発表＋報道 |
| 2026-08-13 → 9月上旬 | **Decart**（GPU 効率化・リアルタイム映像） | 買収交渉 | 約$6B（報道） | **不成立（Anthropic が撤退と報道）** | 二次報道（Bloomberg ほか） |

> 本記事の日付は、特記しない限り発表・報道日（PT／現地）です。**金額の確度は案件ごとに大きく異なる**ため、表の右端の列を必ず確認してください。

## 2. 公式発表された3件

### 2-1. Bun — Claude Code の土台となる JavaScript ランタイム（2025年12月3日）

- **内容**: Bun は2021年に Jarred Sumner が創業した JavaScript／TypeScript のツールキットで、ランタイム・パッケージマネージャー・バンドラー・テストランナーを1つにまとめたものです。公式発表は、月間ダウンロード700万超、GitHub スター8万2,000超、Midjourney や Lovable などが採用していると紹介しています。
- **条件**: 価格・取引構造・完了時期は**開示されていません**。**Bun は引き続き MIT ライセンスのオープンソース**で、チームは Anthropic に参加し、Anthropic は引き続き Bun に投資するとしています。
- **狙い（公式）**: Claude Code の性能・安定性・新機能の向上。同じ発表で、**Claude Code が2025年11月に年換算売上（run-rate）$10億に到達**（一般提供から約6か月）したことにも触れています。

### 2-2. Vercept — computer use を前に進める（2026年2月25日）

- **内容**: Vercept は「複雑なタスクを AI に有用にこなさせるには、知覚と操作の難問を解く必要がある」という考えで作られた会社です。共同創業者の Kiana Ehsani・Luca Weihs・Ross Girshick らが Anthropic に参加します。
- **条件**: 価格などは**開示されていません**。公式は「**外部向け製品を、今後数週間で終了する**」としています（具体的な日付は公式にはありません）。
- **狙い（公式）**: Claude の computer use（実際のアプリの中で作業する機能）を押し進めること。発表では、OSWorld で Sonnet 系が2024年後半の15%未満から**72.5%**まで上がり、Sonnet 4.6 は複雑なスプレッドシートの操作やブラウザタブをまたぐフォーム入力のようなタスクで「人間に近い水準」に近づいていると述べています。
- **報道で補われている点（二次情報）**: TechCrunch は、Vercept の製品が **Vy**（リモートの MacBook を操作するクラウド型の computer use エージェント）で、**3月25日に終了**すると報じています（出典の明示はなし）。総調達額は **$5,000万**（CEO の LinkedIn 投稿による）、2025年1月に$1,600万のシードを発表していました。

### 2-3. Stainless — SDK と MCP サーバーの「最後の1マイル」（2026年5月18日）

- **内容**: Stainless は2022年創業で、**API 仕様書から TypeScript・Python・Go・Java・Kotlin などの SDK、CLI、MCP サーバーを生成**する会社です。公式発表は、**Anthropic の公式 SDK を初期から生成してきた**こと、数百社が利用していることを挙げています。創業者兼 CEO は Alex Rattray です。
- **条件（公式）**: 価格・取引構造は**開示されていません**。発表は Stainless のホスト型サービスの扱いに触れていません。
- **狙い（公式）**: Claude がデータやツールにつながる力の拡張、Claude Platform の開発者体験とエージェント接続性の強化。発表では「エージェントは、つながる先の分だけ有用になる」と述べています。
- **報道・当事者の情報（二次情報）**:
  - **価格**: The Register は「報道によれば$300M超」と書いていますが、**出典は明示されておらず、公式には確認できません**。InfoWorld の記事には金額の記載がありません。
  - **ホスト型製品の終了**: InfoWorld によれば、Stainless は**SDK ジェネレーターを含むホスト型製品をすべて終了**し、Claude Platform とエージェントの API 接続に注力します。**生成済みの SDK を変更・拡張する権利は顧客に残る**とされています。The Register は終了日を**2026年9月1日**と報じています（X の投稿を根拠にしており、確定情報として扱えません）。
  - **顧客への影響**: Stainless 自身の顧客ページには OpenAI・Google DeepMind・Perplexity・Groq・Cloudflare などが挙がっています。これは Stainless の掲載であり、**現在も取引が続いているかは確認できません**。アナリスト（Forrester、Omdia）は、Anthropic が自社 SDK／API ツールの制御を強められる一方、他社は代替ツールや内製が必要になると見ています（アナリストの解釈）。

## 3. 報道ベースの案件

### 3-1. Coefficient Bio（2026年4月・報道）

- **報道内容**: The Information などが、Anthropic が生命科学系のスタートアップ **Coefficient Bio** を**約$400M の全額株式取引**で買収したと報じました。TechCrunch も関係者の話として買収の成立を伝えています。日付は2026年4月3日とする報道がありますが、確認の取れた一次情報ではありません。
- **確認できていないこと**: **Anthropic・Coefficient Bio の公式な確認は見つかりませんでした**（Fierce Biotech は両社に確認を求めたが、記事の時点で回答なし）。金額も「約$400M」「$400M をわずかに超える」と報道で揺れており、正確な条件は確定していません。
- **位置付け**: 本記事ではこの案件を「報道ベース」として扱い、数値を確定情報とはしません。Anthropic のライフサイエンス領域の動きとしては、Life Sciences Verification Program など公式の施策が別にあります。

### 3-2. Decart — $6B の買収交渉と、その撤退（2026年8月〜9月）

**経緯**

| 日付 | 出来事 | 出典 |
|:---|:---|:---|
| 2026-08-13（PT） | Bloomberg が、Anthropic がイスラエルの AI スタートアップ **Decart** の約**$6B**での買収交渉をしていると報道。目的は、急増する需要を既存インフラで吸収する（GPU 効率化）ためとされた | Bloomberg、Fortune |
| 2026-09-07〜08ごろ | Bloomberg が、**Anthropic がデューデリジェンスを行ったあと、買収を見送った**と報道。合意には至らなかった | Bloomberg（TNW・Globes などが転載。日付は媒体により9月7日／8日で差がある） |

**わかっていること（報道）**

- **Decart とは**: 2023年創業（Dean Leitersdorf、Orian Leitersdorf、Moshe Shalev）。GPU の効率化ソフトウェア、リアルタイム動画生成、シミュレーション環境・世界モデルを手がけます。2026年5月に**$300M を調達し、評価額は約$4B**（Radical Ventures が主導、WSJ 報道）。
- **Anthropic の関心**: TNW によれば、関心は世界モデル製品ではなく**チップ効率化・最適化スタック**にあったとされます（Bloomberg の報道と同社サイトに基づく TNW の分析）。$6B は5月の評価額に対し**約50%の上乗せ**でした。
- **今後の可能性**: 匿名の関係者によれば、両社は**別の形で協力する**余地があり、Anthropic が**顧客または投資家**になる可能性が示唆されています（単一の匿名情報）。

**わかっていないこと**

- **撤退の理由**: **公表されておらず**、価格がネックだったのか、デューデリジェンスで何かが見つかったのかも確認できません。Anthropic と Decart の双方がコメントを控えています。
- **Nvidia の提示**: Globes は Bloomberg を引用し、Decart には**Nvidia からより高い提示**があったが、創業者と株主は**株式での支払いとなる Anthropic の提案**を選んだと伝えています。ただし金額は不明で、他の媒体では確認できませんでした。
- 買収が不成立になったことと、その後の Decart の動向（他の買い手との交渉など）は別問題で、記事の時点で確認できる情報はありません。

> Decart は**成立しなかった案件**です。「Anthropic が Decart を買収した」と読める記述を見た場合は、2026年9月上旬の撤退報道が反映されていない古い情報の可能性があります。Decart の交渉当時の経緯を含む資金調達の全体像は [Anthropic 大型資本調達ラウンド](/mdTechKnowledge/blog/anthropic-funding-2026/) の第5章補遺2を参照してください。

## 4. 全体の読み解き（解釈）

以下は公式の説明ではなく、公表された事実から見える**本記事の解釈**です。

| 軸 | 案件 | 読み取れること |
|:---|:---|:---|
| **開発者基盤** | Bun、Stainless | Claude Code の実行環境（Bun）と、API を SDK・MCP サーバーとして届ける工程（Stainless）という、**エージェント開発の末端のツール**を自社に取り込んでいる |
| **エージェントの実行能力** | Vercept | 画面を見て操作する computer use の知覚・操作の部分を強化。外部向け製品を畳み、Claude 本体へ集約する形 |
| **計算効率** | Decart（不成立） | 推論コストを下げるチップ効率化技術への関心。成立はしなかったが、需要増をインフラで吸収する課題は残る（自社チップ戦略は [Anthropic のコンピュート契約](/mdTechKnowledge/blog/anthropic-tpu-compute-partnership/) を参照） |
| **ライフサイエンス** | Coefficient Bio（報道） | 生命科学領域への投資。公式の確認が取れていないため、位置付けは暫定 |

共通するのは、**買収した会社の「外部向け製品」を終了し、人材と技術を自社の製品群に組み込む**パターンが Vercept と Stainless で見られる点です（Bun は MIT ライセンスのまま継続）。利用者の側では、買収された会社のサービスに依存していた場合の**移行コスト**が実務上の論点になります。

## 5. 読むときの注意

- **金額は原則として未開示**: 公式発表の3件で金額が出ているものはありません。Stainless の「$300M超」、Coefficient Bio の「約$400M」、Decart の「約$6B」はすべて**報道**です。
- **交渉と成立を区別する**: Decart は交渉報道のあと不成立になりました。逆に Coefficient Bio は成立と報じられていますが、公式確認がありません。
- **日付の読み方**: Bloomberg 報道は PT で記載され、JST では翌日になることがあります。
- 買収に関する報道は、後続の事実で**内容が更新されやすい**分野です。最新の状況は各社の公式発表で確認してください。

## 関連記事

- [Anthropic 大型資本調達ラウンド](/mdTechKnowledge/blog/anthropic-funding-2026/) — Decart 交渉報道の当時の経緯、収益・資金調達の全体像
- [Anthropic のコンピュート契約](/mdTechKnowledge/blog/anthropic-tpu-compute-partnership/) — 計算資源の確保という文脈
- [Anthropic エンタープライズ攻勢2026](/mdTechKnowledge/blog/anthropic-enterprise-expansion-2026/) — 導入支援側の提携

## 出典

- [Anthropic acquires Bun（Anthropic 公式、2025-12-03）](https://www.anthropic.com/news/anthropic-acquires-bun-as-claude-code-reaches-usd1b-milestone)
- [Anthropic acquires Vercept（Anthropic 公式、2026-02-25）](https://www.anthropic.com/news/acquires-vercept) ／ [TechCrunch（二次）](https://techcrunch.com/2026/02/25/anthropic-acquires-vercept-ai-startup-agents-computer-use-founders-investors/)
- [Anthropic acquires Stainless（Anthropic 公式、2026-05-18）](https://www.anthropic.com/news/anthropic-acquires-stainless) ／ [InfoWorld（二次）](https://www.infoworld.com/article/4172947/anthropic-acquires-stainless-to-strengthen-claudes-developer-tooling.html) ／ [The Register（二次）](https://www.theregister.com/ai-ml/2026/05/20/anthropics-stainless-steal-tightens-grip-on-ai-dev-tooling/5243053)
- [Anthropic acquires stealth AI startup Coefficient Bio in $400M deal: reports（Fierce Biotech、二次）](https://www.fiercebiotech.com/biotech/anthropic-acquires-stealth-ai-startup-coefficient-bio-400m-deal)
- [Bloomberg: Anthropic Said in Talks to Buy AI Startup Decart for $6 Billion（2026-08-13）](https://www.bloomberg.com/news/articles/2026-08-13/anthropic-said-in-talks-to-buy-ai-startup-decart-for-6-billion) ／ [The Next Web: Anthropic has walked away from its $6bn Decart deal, Bloomberg reports（2026-09-08、二次）](https://thenextweb.com/news/anthropic-walks-away-decart-6bn-acquisition) ／ [Globes（二次）](https://en.globes.co.il/en/article-anthropic-decides-against-6b-decart-acquisition-report-1001554747)
