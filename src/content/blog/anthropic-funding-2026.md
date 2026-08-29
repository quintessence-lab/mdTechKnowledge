---
title: "Anthropic 大型資本調達ラウンド — Amazon $5B/$100B AWSコミット・Google 最大$40B 投資・Series G $380B → Series H $965B評価額（OpenAI超）の戦略的意義"
date: 2026-04-26
updatedDate: 2026-08-29
category: "一般リサーチ"
tags: ["Anthropic", "Amazon", "Google", "AWS", "GCP", "Trainium", "TPU", "投資", "クラウドインフラ", "Claude", "Series G", "Series H", "CoreWeave", "Blackstone", "Goldman Sachs", "合弁会社", "EPAM", "Dragoneer", "Greenoaks", "Sequoia", "Altimeter", "Gates Foundation", "公益", "IPO", "S-1", "SEC", "Micron", "Samsung", "SK hynix", "Fluidstack", "データセンター", "HBM", "半導体", "Apollo", "プライベートクレジット", "Decart"]
excerpt: "2026年4月にAnthropicが立て続けに発表したAmazon・Googleからの巨額投資ラウンドと、Series G $380B評価額調達・年間収益ランレート $30B 突破（OpenAI 逆転）・CoreWeave との計算インフラ個別契約を整理。2026年5月3日発表のBlackstone・H&F・Goldman Sachs との$1.5Bエンタープライズ AI サービス合弁会社、5月7日発表のEPAM Systems との戦略的多年契約、5月8日 Fortune 報道『単一四半期で80倍成長』、5月12日 Bloomberg 報道の$30B 調達ラウンド合意確定（評価額 $900B 超、ARR $45B）、5月14日 Gates Foundation との $200M／4年 grant partnership（医療・K-12教育・経済モビリティ）まで追補。さらに2026年5月28日発表の Series H — $65B 調達・post-money $965B 評価額（OpenAI を上回り AI スタートアップ史上最高）・年率 run-rate revenue $47B 到達・ハイパースケーラー既コミット $15B（Amazon $5B 含む）、6月1日（PT）に SEC へ機密ドラフト S-1 を提出した IPO 申請開始、Google製カスタムTPUのリース資金を賄うApollo/Blackstoneのプライベートクレジット（第1弾$35B完了・2026年8月時点で第2弾最低$36B打診中）に加え、2026年7月末のGoogle支援$15Bデット調達、8月13日のDecart AI買収交渉（$6B・未確定）、8月時点で収益ランレート$65B突破・Q2収益$11.5B（前年同期比約15倍）、8月18日報道のIPO前リボルビング・クレジットファシリティが目標$10Bを超過見込み（主要行に約$1.25Bずつコミット要請）まで追補。"
draft: false
---

**調査日**: 2026年4月26日

---

## 目次

1. [概要](#第1章-概要)
2. [Amazon投資ラウンド（4月20日）](#第2章-amazon投資ラウンド4月20日)
3. [Google投資ラウンド（4月24日）](#第3章-google投資ラウンド4月24日)
4. [マルチクラウド戦略とコンピュート確保](#第4章-マルチクラウド戦略とコンピュート確保)
5. [競合構図への影響](#第5章-競合構図への影響)
6. [Claudeおよびmd読者への含意](#第6章-claudeおよびmd読者への含意)
7. [情報ソース一覧](#第7章-情報ソース一覧)

---

## 第1章: 概要

2026年4月、Anthropicは1週間以内に大型資本調達ラウンドを2件続けて発表した。

| 発表日 | 投資元 | 投資額 | コンピュートコミット | 備考 |
|---|---|---|---|---|
| 4月20日 | Amazon | $5B（追加） | 10年間で**$100B超のAWS支出**、Trainium 5GW相当 | Amazon累計$13B到達 |
| 4月24日 | Google | 最大$40B（現金＋コンピュート） | 5年間で**5GWのTPU**キャパシティ | 初期$10Bは評価額$350B |

両ラウンドの本質は単純な株式投資ではなく、「投資元クラウドの大規模消費契約」と組み合わさったハイブリッド型である。OpenAIが2026年2月にAmazonから$50B規模を引き出した「クラウド支出と引き換えの巨額投資」スキームと同型と言える。

合計約**10GW規模**のAI学習・推論インフラを今後5〜10年で確保する計画であり、Claude次世代モデル（Opus/Sonnet/Haikuの後継世代）スケーリング基盤の決定打となる。

---

## 第2章: Amazon投資ラウンド（4月20日）

### 投資金額・累計

- **新規追加投資**: $5B（50億ドル）
- **Amazonの累計投資**: $13B（130億ドル）
  - 2023年9月: $1.25B（初回）
  - 2024年3月: $2.75B（追加・ここまでで累計$4B）
  - 2024年11月: $4B（戦略的パートナー化・累計$8B）
  - 2026年4月20日: $5B（今回・**累計$13B**）

CNBCの一部見出しは「最大$25B」と記載しているが、現時点で確定した追加投資額は$5Bであり、残りはマイルストーン達成や追加トランシェに依存する見込み。

### $100B+ AWS支出コミット

最大の特徴は、Anthropicが**今後10年間で1,000億ドル超のAWS支出**をコミットした点である。

- AWS上で Claude の学習・推論用に**最大5GWの新規キャパシティ**を確保
- 対象シリコンは**Trainium2 → Trainium4**世代（Trainium3は2025年12月発表、Trainium4は未発表）
- Trainium2の本格供給は2026年Q2開始、年末までにTrainium2+3で約1GW供給予定
- 将来世代のAmazon独自AIチップに対する**優先購入オプション**付き

### 主要発言

- **Andy Jassy（Amazon CEO）**: 「当社のカスタムAIシリコンは、顧客に対し高性能を大幅に低コストで提供する。だからこそこれほど強い需要がある」
- **Dario Amodei（Anthropic CEO）**: 「顧客はClaudeを業務の中心に据えており、需要に応えるためインフラのスケールアップが不可欠。Amazonとの協業によって研究を継続しつつClaudeを届けられる」

---

## 第3章: Google投資ラウンド（4月24日）

### 投資構造

Googleからの投資は、現金とコンピュートの組み合わせで段階的に最大$40Bに到達する構造になっている。

| トランシェ | 金額 | 条件 | 評価額 |
|---|---|---|---|
| 初期分（即時実行） | $10B現金 | 無条件 | $350B |
| 条件付き分 | 最大$30B | 業績マイルストーン達成 | 未確定 |
| 合計 | **最大$40B** | — | — |

評価額は$350B（2026年2月ラウンド水準）が中心だが、一部報道では$380Bを示すソースもあり、トランシェごとに条件が異なる可能性がある。

### TPU提供契約

- **規模**: Google Cloudから今後**5年間で5GWのTPU**キャパシティを提供、追加スケール余地あり
- **関連**: 2026年4月初に発表された Google-Broadcom ディール（2027年開始予定の3.5GW TPU容量）と連動

### Googleの過去出資

- 2023年: 約$0.3B（3億ドル）
- 2024〜2025年: $2B規模を複数回追加
- 2026年4月: 上記$40Bラウンド（過去最大）

累計でAmazonに次ぐ規模の戦略投資家ポジションを確立した。

---

## 第4章: マルチクラウド戦略とコンピュート確保

### 3軸インフラ構造

Anthropicは今回の2件を経て、以下の3軸構造を完成させた。

```
┌─────────────────────────────────────────────────┐
│  Anthropic Claude スケーリング基盤（2026年〜）    │
├─────────────────────────────────────────────────┤
│  ① AWS    : Trainium 5GW（10年で$100B+支出）    │
│  ② GCP    : TPU 5GW（5年で最大$40B契約）        │
│  ③ NVIDIA : CoreWeave経由GPU（既存契約）         │
└─────────────────────────────────────────────────┘
```

### 戦略的意義

- **単一ベンダー依存リスクの排除**: いずれかのチップ供給遅延・価格変動が起きても代替が効く
- **チップアーキテクチャ分散**: Trainium（カスタムASIC）・TPU（カスタムASIC）・NVIDIA GPU（汎用AI）を使い分け
- **優先アクセス権**: 各社の最新世代シリコンに対し、他顧客より早い時期から大規模割当を獲得

### 評価額・IPO観測

- 現行評価額: $350B〜$380B（2026年4月時点）
- 一部VCの提示: 最大$800B規模
- IPO申請: **2026年6月1日（PT）に SEC へ機密ドラフト S-1 を提出**し、IPO プロセスを開始（第5章で詳述）。当初の「2026年10月説」という観測段階から、現実の上場準備フェーズへ移行

### 【2026-07-22追記】AMDが加わり4軸構造へ — $5B戦略投資＋2GW MI450 GPU契約

2026年7月22日、**AMD が Anthropic への戦略的出資（最大 $5B）**と、**AMD Instinct MI450 シリーズ GPU を最大2ギガワット分デプロイする契約**を発表しました。これにより、上記の3軸構造（AWS Trainium / GCP TPU / NVIDIA-CoreWeave）に**4本目の柱**が加わります。

```
┌─────────────────────────────────────────────────┐
│  Anthropic Claude スケーリング基盤（2026年7月〜） │
├─────────────────────────────────────────────────┤
│  ① AWS    : Trainium 5GW（10年で$100B+支出）    │
│  ② GCP    : TPU 5GW（5年で最大$40B契約）        │
│  ③ NVIDIA : CoreWeave経由GPU（既存契約）         │
│  ④ AMD    : Instinct MI450 最大2GW（新規）      │
└─────────────────────────────────────────────────┘
```

- **投資構造**: AMDの出資（最大$5B）は**デプロイのマイルストーン達成に応じて実行**される仕組みで、前払いの一括投資ではありません。
- **ハードウェア**: **AMD Helios**（ラックスケール製品）に **Instinct MI455X GPU・EPUC「Venice」CPU・AMD Pensando ネットワーキング・ROCm ソフトウェア**を組み合わせた構成。最初の1GW分は**2027年上半期**からデプロイ開始予定。
- **相互連携**: Anthropic は Claude を使って AMD Instinct GPU 向けのワークロード最適化・ROCm ソフトウェア開発を加速。AMD は自社のソフトウェア・製品開発全体に Claude を統合。
- **意義**: NVIDIA 依存を一段と下げる動きで、**チップベンダーの分散が3社→4社**に拡大。AMDにとっては、Anthropicへの出資と引き換えに大型GPU受注を得る「投資と引き換えの受注確保」という構図です。

出典: [AMD IR: Strategic Partnership press release](https://ir.amd.com/news-events/press-releases/detail/1292/amd-and-anthropic-announce-strategic-partnership-to-deploy-up-to-2-gigawatts-of-amd-instinct-mi450-series-gpus) ／ [CNBC: AMD to invest up to $5B in Anthropic](https://www.cnbc.com/2026/07/22/amd-anthropic-ai-chip-investment.html)

---

## 第5章: 競合構図への影響

### 対 OpenAI / Microsoft

- OpenAIは2026年2月、Microsoft主導のラウンドに加えAmazonからも$50B規模を獲得（総額$110Bの一部）
- 同じ「クラウド支出引換型巨額投資」スキームを、Anthropicも今回採用
- ハイパースケーラーは**OpenAIとAnthropicの両建て**で、特定モデルへの一極集中を回避

### 対 Google Gemini

GoogleのAnthropicへの巨額出資は表面的にはGeminiと矛盾するが、以下のような**ヘッジ戦略**として整理できる。

- Geminiは自社製品基盤（Search, Workspace, Android）への深い統合に使う
- AnthropicはGCP外部顧客（Anthropic API・Bedrock経由顧客）からの収益機会
- AI市場での主導権が単一プレイヤーに集中しないよう「賭けを分散」（CNBCの表現）

### Anthropic優位の構図変化

| 観点 | 2025年末 | 2026年4月以降 |
|---|---|---|
| 累計調達額 | 数百億ドル規模 | $100B超に拡大 |
| クラウドパートナー | AWS中心 | AWS + GCP のデュアル体制 + CoreWeave 個別契約（GPU） |
| TPU/Trainium割当 | 数百MW規模 | **10GW規模**を契約済み |
| 評価額 | $180B前後 | **$965B**（2026年5月28日 Series H。Bloomberg 報道で OpenAI を上回り AI スタートアップ史上最高評価額。Series G $380B から約1か月で約2.5倍） |
| 年間収益ランレート | — | **$47B**（年率 run-rate。4月初旬 $30B → 5月12日 $45B → 5月28日 Series H 時点 $47B） |

### 追加トピック（2026年4月末〜5月）

#### Series G ラウンド — $380B post-money 評価額

2026年4月末、Anthropic は **Series G ラウンドで post-money $380B** の評価額を達成したと正式発表。Amazon・Google の戦略投資（4月20日／24日）と並ぶ独立した資金調達ラウンドで、AI企業の評価額として OpenAI と並ぶ規模に到達。

参考: [Anthropic 公式: Series G $380B](https://www.anthropic.com/news/anthropic-raises-30-billion-series-g-funding-380-billion-post-money-valuation)

#### 年間収益ランレート $30B 突破 — 対 OpenAI 逆転

2026年4月初旬、Anthropic の **年間収益ランレートが $30B を突破** し、OpenAI を逆転したとPYMNTS等が報道。エンタープライズ需要の急加速（Claude API・Claude Code・Managed Agents・Cowork 各製品）が要因。

参考: [PYMNTS: $30B Run Rate](https://www.pymnts.com/artificial-intelligence-2/2026/anthropic-hits-30-billion-run-rate-as-enterprise-demand-accelerates/)

#### CoreWeave との計算インフラ個別契約

CoreWeave は同時期にMetaと$21Bパートナーシップを締結する一方、Anthropic とも個別の計算インフラ契約を結んでいる（NVIDIA GPU 供給。第4章「3軸インフラ構造」の③に該当する既存契約の拡張）。

参考: [Blockonomi: CoreWeave + Anthropic](https://blockonomi.com/coreweave-crwv-stock-surges-on-21b-meta-partnership-and-anthropic-agreement/)

#### エンタープライズ AI サービス合弁会社（Blackstone・Hellman & Friedman・Goldman Sachs）— 2026年5月3日発表

2026年5月3日（PT）／5月4日（JST）、Anthropic は **Blackstone・Hellman & Friedman（H&F）・Goldman Sachs** と共同で、エンタープライズ向け AI サービスを提供する新会社（合弁会社）の設立を発表した。

| 項目 | 内容 |
|---|---|
| 発表日 | 2026年5月3日（PT）／5月4日（JST） |
| 合弁会社 | Anthropic + Blackstone + H&F + Goldman Sachs |
| 追加投資額 | Blackstone・Goldman Sachs が合弁会社へ **$450M** 出資 + Anthropic 株取得 |
| 評価額（参考） | — |
| その他投資家 | GIC・General Atlantic・Apollo Global Management・Sequoia |

**事業モデル（Palantir 型「前方展開モデル」）**

Palantir の「前方展開エンジニア」と同型のアプローチで、**Anthropic エンジニアを顧客企業に常駐**させ、Claude を業務フローへ深く組み込む。単なるAPIアクセス提供ではなく、コンサルティング・システムインテグレーション領域への本格参入を意味する。

**対象セクター**

ヘルスケア・金融・製造・小売・不動産・インフラ

**競合との構図**

同時期に **OpenAI** も **TPG・Bain Capital** と同様のエンタープライズ AI サービス合弁会社の設立を検討中と報じられており、コンサルティング・SIer 市場での AI 企業間競争が本格化しつつある。

参考:
- [Blackstone 公式プレスリリース](https://www.blackstone.com/news/press/anthropic-partners-with-blackstone-hellman-friedman-and-goldman-sachs-to-launch-enterprise-ai-services-firm/)
- [TechCrunch: Anthropic and OpenAI are both launching joint ventures for enterprise AI services](https://techcrunch.com/2026/05/04/anthropic-and-openai-are-both-launching-joint-ventures-for-enterprise-ai-services/)
- [CNBC: Anthropic, Goldman, Blackstone AI venture](https://www.cnbc.com/2026/05/04/anthropic-goldman-blackstone-ai-venture.html)

#### EPAM Systems との戦略的多年契約 — 2026年5月7日発表

2026年5月7日（PT）、Anthropic は **EPAM Systems**（NYSE: EPAM、エンジニアリング・SI 大手）と**戦略的多年パートナーシップ**を締結したと発表。両社の AI サービスデリバリ能力を統合し、エンタープライズの安全な応用 AI 導入を加速する内容。

| 項目 | 内容 |
|---|---|
| 発表日 | 2026年5月7日（PT） |
| 契約形態 | 戦略的多年契約 |
| Claude 認定アーキテクト育成計画 | **1万人規模** |
| 既トレーニング実績 | **2万人超**が Claude トレーニングを修了済み |
| 対象 | エンタープライズ顧客向け Claude 導入・統合・運用 |

EPAM の認定アーキテクト網が拡大することで、Claude を業務システムへ深く組み込むデリバリチャネルが大幅に強化される。Blackstone 合弁会社の「Anthropic エンジニア直接派遣」とは異なり、**SI パートナーを介した間接展開モデル**として位置付けられる。

参考: [EPAM プレスリリース](https://www.epam.com/about/newsroom/press-releases/2026/epam-and-anthropic-team-up-to-build-the-future-of-enterprise-transformation-with-safe-applied-ai)

#### Fortune 報道「単一四半期で 80 倍成長」 — 2026年5月8日

2026年5月8日（PT）、Fortune は CEO Dario Amodei の発言として、**Anthropic が直近の単一四半期で 80 倍に成長した（grew 80-fold in a single quarter）**と報じた。具体的には、Q1（2026年1〜3月）の収益・利用量が前年同期比で **80倍（YoY）**を記録。Elon Musk のデータセンター（SpaceX xAI Colossus 1）を借りる必要があった背景としても言及されている。

| 指標 | 値 |
|---|---|
| 成長率 | YoY **80倍**（単一四半期） |
| 報道 | Fortune（2026年5月8日） |
| 背景 | エンタープライズ需要急増、コンピュート不足が SpaceX 調達につながる |

参考: [Fortune: Anthropic 80-fold growth quarter renting Elon Musk data center](https://fortune.com/2026/05/08/anthropic-80fold-growth-quarter-renting-elon-musk-data-center/)

#### $30B 調達ラウンド合意確定 — 評価額 $900B 超、ARR $45B（2026年5月12日 Bloomberg）

2026年5月12日（PT）、Bloomberg は Anthropic が **$30B（300億ドル）の追加調達ラウンドの合意を確定**したと報道。評価額は **post-money $900B 超**で、Series G（$380B）からわずか数週間で 2.4 倍に上昇した。

| 項目 | 内容 |
|---|---|
| 報道日 | 2026年5月12日（PT） |
| 調達額 | $30B |
| 評価額（post-money） | **$900B 超** |
| 共同リードインベスター | **Dragoneer / Greenoaks / Sequoia Capital / Altimeter Capital** |
| 年間収益ランレート（ARR） | **$45B**（4月の $30B から1.5 倍） |
| IPO バンカー試算 | $400–500B（バンカー間の参考レンジ） |

このラウンドにより Anthropic の評価額は OpenAI を超え、世界最大級の非公開 AI 企業ポジションを確立した。**1か月で $380B → $900B 超**という評価額急騰は、ARR $45B への伸びと SpaceX・Akamai・EPAM など供給網・営業網の急拡大が根拠とされる。

| 評価額の変遷 | 時期 | 評価額 |
|---|---|---|
| 2026年2月ラウンド | $350B | — |
| Series G | 2026年4月末 | $380B |
| **本ラウンド合意** | **2026年5月12日** | **$900B 超** |
| IPO バンカー試算 | — | $400–500B（参考） |

参考: [Bloomberg: Anthropic in Talks to Raise $30 Billion at $900 Billion Valuation](https://www.bloomberg.com/news/articles/2026-05-12/anthropic-in-talks-to-raise-30-billion-at-900-billion-valuation)

#### 年間収益ランレート $30B 到達 — 前年 $9B から約 3.3 倍（2026年5月時点）

エンタープライズ需要の急加速により、Anthropic の **年間収益ランレート（ARR）が $30B に到達**（5月12日 Bloomberg 続報で $45B へさらに上昇）。前年（2025年末時点）の ARR は約 **$9B** 規模であり、**わずか数か月で約 3.3 倍**へ拡大した計算となる。Claude API・Claude Code・Managed Agents・Cowork の各製品ラインの併行成長と、エンタープライズ大口契約（PwC・EPAM・Blackstone 合弁等）による寄与が主要因。

| 時期 | ARR | 倍率 |
|---|---|---|
| 2025年末時点 | 約 $9B | — |
| 2026年4月初旬 | $30B 突破 | 約 3.3 倍（YoY） |
| 2026年5月12日（Bloomberg 報道） | **$45B** | 約 5 倍（YoY） |

#### 年間 $1M+ 支出企業数が 2 ヶ月で倍増（500社 → 1,000社超）

エンタープライズ大口顧客の急増を示す指標として、**年間 $1M（100万ドル）以上を Anthropic に支出する企業数が、2ヶ月で 500社から 1,000社超に倍増**した。Claude Code の Pro/Max/Team 全プラン浸透、Claude Cowork の GA、エンタープライズ向け RBAC・Analytics API 等の機能拡張がエンタープライズ取引拡大の主要ドライバ。

| 時期 | $1M+ 支出企業数 |
|---|---|
| 2026年3月時点（推計） | 約 500社 |
| 2026年5月時点 | **1,000社超**（2ヶ月で倍増） |

参考: [TechCrunch: Anthropic courts a new kind of customer — small business owners（2026/5/13）](https://techcrunch.com/2026/05/13/anthropic-courts-a-new-kind-of-customer-small-business-owners/)

#### PwC × Anthropic 拡大パートナーシップ — 2026年5月15日 PT／16日 JST

2026年5月15日（PT）、Anthropic と **PwC** は既存パートナーシップの大幅拡大を発表。PwC のグローバル従業員（**数十万名規模**）に対し **Claude Code + Cowork** を順次展開する。両社共同で **Center of Excellence** を設立し、**3万名の PwC プロフェッショナルを Claude 認定**する計画。新設の **Office of the CFO** ユニットは銀行・保険・ヘルスケアなど規制業界の CFO 部門向けに Claude を業務組込する。

| 項目 | 内容 |
|---|---|
| 発表日 | 2026年5月15日（PT）／16日（JST） |
| 展開対象 | PwC グローバル従業員（数十万名規模、米国チームから順次） |
| Claude 認定計画 | **3万名** |
| 新設ユニット | **Office of the CFO**（規制業界向け） |
| 戦略フォーカス | エージェント技術開発 / AI ネイティブ案件遂行 / エンタープライズ機能変革 |
| 導入実績 | 保険引受 10週→10日、セキュリティ業務 数時間→数分、デリバリ最大 70% 改善 |

EPAM（5月7日発表、SI 大手 1万人認定計画）・Blackstone 合弁（5月3日発表、コンサル合弁会社）に続く、エンタープライズ大口顧客／チャネル戦略の中核ピース。コンサル業界での Claude 標準化が進むことで、エンタープライズ ARR の継続的拡大が見込まれる。

参考:
- [Anthropic: PwC expanded partnership](https://www.anthropic.com/news/pwc-expanded-partnership)
- [SiliconAngle: PwC expands Anthropic alliance, will train 30000 staff（2026/5/14）](https://siliconangle.com/2026/05/14/pwc-expands-anthropic-alliance-will-train-30000-staff-claude/)

#### Gates Foundation との $200M パートナーシップ — 2026年5月14日 PT／15日 JST

2026年5月14日（PT）、Anthropic は **Bill & Melinda Gates Foundation** との **$200M（2億ドル）／4年間** のパートナーシップを発表。低・中所得国の医療・教育・経済モビリティ領域における AI 活用を加速する **grant funding（投資ではなく助成）** の枠組みで、現金 grant に加え **Claude 利用クレジット**と**技術支援**を提供する。前述のエンタープライズ営業網拡大とは性質が異なる「公益・社会インパクト」軸の戦略的アライアンス。

| 項目 | 内容 |
|---|---|
| 発表日 | 2026年5月14日（PT）／15日（JST） |
| 総額 | **$200M / 4年間** |
| 形態 | **Grant funding**（grants + Claude usage credits + technical support） |
| 主領域 | グローバルヘルス／K-12 教育／経済モビリティ |
| 地域フォーカス | 低・中所得国（医療中心）、サブサハラアフリカ・インド（教育）、米国（教育・経済モビリティ） |
| 主要プログラム例 | ワクチン・治療法の開発加速、ポリオ／HPV／妊娠高血圧症候群スクリーニング、政府意思決定向けヘルスデータ分析、数学チューター・大学進学アドバイス・カリキュラム設計、小農家の生産性改善、キャリアガイダンス・スキル文書化 |
| 提携パートナー組織 | Institute for Disease Modeling (IDM)、Global AI for Learning Alliance (GAILA) |
| Anthropic 提供物 | Claude usage credits / 技術支援 / API コネクタ・ベンチマーク / 公開財（データセット・評価フレームワーク・知識グラフ）／非営利向けディスカウントアクセス |

PwC・EPAM・Blackstone 合弁等の**営利エンタープライズ拡大**とは別軸で、**公益分野での Claude 標準化**を進める動き。Anthropic の "AI for societal benefit" メッセージングを実体化する施策と位置付けられる。

参考:
- [Anthropic 公式: Gates Foundation Partnership](https://www.anthropic.com/news/gates-foundation-partnership)
- [Gates Foundation プレスリリース](https://www.gatesfoundation.org/ideas/media-center/press-releases/2026/05/ai-anthropic-partnership)
- [TNW: Anthropic-Gates Foundation AI health, education partnership](https://thenextweb.com/news/anthropic-gates-foundation-ai-health-education-partnership)

#### Series H — $65B 調達 / post-money $965B 評価額（OpenAI 超）— 2026年5月28日 PT／29日 JST

2026年5月28日（PT）、Anthropic は **Series H ラウンドで $65B（650億ドル）を調達**し、**post-money 評価額 $965B** に到達したと正式発表した。わずか2週間前の $900B 超（5月12日 Bloomberg 報道のラウンド）からさらに上昇し、Bloomberg は **OpenAI を上回り AI スタートアップとして史上最高評価額**になったと報じた。これまでの段階的調達（Amazon・Google の戦略投資、Series G、$30B ラウンド）の到達点となる、IPO 前の最終的な大型プライベートラウンドと位置付ける報道もある（TechCrunch）。

| 項目 | 内容 |
|---|---|
| 発表日 | 2026年5月28日（PT）／29日（JST） |
| 調達額 | **$65B** |
| 評価額（post-money） | **$965B**（AI スタートアップ史上最高、OpenAI 超） |
| リード投資家 | Altimeter Capital / Dragoneer / Greenoaks / Sequoia Capital |
| コリード投資家 | Capital Group / Coatue / D1 Capital Partners / GIC / ICONIQ / XN |
| 年率 run-rate revenue | **$47B**（「今月初旬に突破」と公式言及） |
| ハイパースケーラー既コミット分 | **$15B**（うち Amazon $5B を含む） |
| 戦略的インフラパートナー（出資者とは別枠） | **Micron / Samsung / SK hynix**（メモリ・ストレージ・ロジックチップ供給） |
| 資金用途 | 安全性・解釈可能性研究／Claude 需要に応えるコンピュート拡張／製品・パートナーシップのスケール |

**評価額の変遷（更新）**: Series G $380B（4月末）→ $900B 超（5月12日報道）→ **$965B（5月28日 Series H）**。1か月強で約2.5倍に達した。$1T（1兆ドル）の大台が射程に入りつつある。

**半導体3社は『投資家』ではなく『戦略的インフラパートナー』**: Series H の公式発表では、出資ラウンドのリード／コリード／主要投資家（Altimeter・Dragoneer・Greenoaks・Sequoia ほか）とは**別枠**で、**Micron・Samsung・SK hynix** の3社を **strategic infrastructure partners（戦略的インフラパートナー）** として紹介している。公式の位置付けは「メモリ・ストレージ・ロジックチップの世界供給で重要な役割を担い、Claude 需要の拡大に合わせてコンピュートを確実にスケールさせる関係」であり、株式出資者（financial investors）としては記載されていない点に注意。AI 学習・推論基盤のボトルネックが GPU/TPU といった演算チップだけでなく **HBM 等のメモリ供給**にも及ぶことを踏まえた、サプライチェーン確保の動きと位置付けられる。なお Series H 公式ではコンピュート契約として Amazon（最大5GW）・Google + Broadcom（5GWの次世代TPU）に加え、**SpaceX の Colossus 1 および Colossus 2 への GPU アクセス**にも言及している。

参考:
- [Anthropic 公式: Series H](https://www.anthropic.com/news/series-h)
- [TechCrunch: Anthropic raises $65 billion, nears $1T valuation ahead of IPO（2026/5/28）](https://techcrunch.com/2026/05/28/anthropic-raises-65-billion-nears-1t-valuation-ahead-of-ipo/)
- [Bloomberg: Anthropic Raises at $965 Billion Valuation, Eclipsing OpenAI（2026/5/28）](https://www.bloomberg.com/news/articles/2026-05-28/anthropic-raises-at-965-billion-valuation-eclipsing-openai)

#### $50B 米国 AI インフラ投資 — Fluidstack と提携し TX・NY にデータセンター建設

Series H とは別に、Anthropic は **米国内の AI インフラへ $50B（500億ドル）を投資**する計画を公式発表している。データセンター事業者 **Fluidstack** と提携し、まず **テキサス州（TX）とニューヨーク州（NY）**にデータセンターを建設する（追加サイトも計画）。Series H 公式ページにはこの $50B 投資・Fluidstack・TX/NY への言及はなく、両者は**独立した発表**である（同時発表ではない点に注意）。

| 項目 | 内容 |
|---|---|
| 投資額 | **$50B**（米国内 AI インフラ） |
| 提携先 | **Fluidstack**（データセンター事業者） |
| 初期立地 | **テキサス州（TX）／ニューヨーク州（NY）**（追加サイトも計画） |
| 稼働時期 | 2026年中に順次オンライン |
| 雇用創出 | 常勤 **約800人** ＋ 建設 **約2,400人** |
| 主要コメント | Dario Amodei（Anthropic CEO）／Gary Wu（Fluidstack 共同創業者・CEO） |

GPU/TPU の確保（Amazon・Google・SpaceX）やメモリ供給（Micron・Samsung・SK hynix）と並ぶ、**自社主導の物理データセンター拡張**軸の施策。Fluidstack は「ギガワット級の電力を機動的に供給できる」点が提携理由として挙げられている。

参考: [Anthropic 公式: Anthropic invests $50 billion in American AI infrastructure](https://www.anthropic.com/news/anthropic-invests-50-billion-in-american-ai-infrastructure)

#### IPO 申請 — SEC へ機密ドラフト S-1 提出（2026年6月1日 PT／6月2日 JST）

2026年6月1日（PT）、Anthropic は **米証券取引委員会（SEC）へ Form S-1 の機密ドラフト登録届出書（confidential draft registration statement）を提出**したと公式発表した。これにより、SEC の審査完了後に株式公開（IPO）を行う**選択肢**を得る。第4章で触れた「2026年10月説」という観測段階から、現実の上場準備フェーズへと一歩進んだ。

| 項目 | 内容 |
|---|---|
| 提出日 | 2026年6月1日（PT）／6月2日（JST） |
| 提出内容 | Form S-1 の**機密ドラフト**登録届出書（confidential draft registration statement） |
| 提出先 | 米証券取引委員会（SEC） |
| 株式数・価格 | **未定**（公式に "The number of shares to be offered and the price have not yet been set" と明記） |
| IPO 実施 | SEC 審査完了後に公開する**選択肢**を得る。実施は「市場環境その他の要因次第（depend on market conditions and other factors）」 |
| 直近の評価額・収益（参考） | Series H 時点で post-money $965B／年率 run-rate revenue $47B（※本 S-1 発表自体には金額記載なし） |
| 法的位置づけ | Securities Act の Rule 135 に基づく告知。証券の売付け申込・買付け勧誘ではない |

**意義**: OpenAI に先駆けての IPO 申請であり、AI 大手の上場競争が現実味を帯びた。**機密提出（confidential filing）**は、正式な S-1 公開前に SEC と非公開で審査を進められる制度で、大型テック IPO で一般的に用いられる手法。直近の評価額 $965B を踏まえれば、実現すれば史上最大級のテック IPO となる可能性がある。ただし株式数・価格・実施時期はいずれも未定であり、最終的な IPO 実施は市場環境に左右される。

参考:
- [Anthropic 公式: We have confidentially submitted a draft S-1 to the SEC](https://www.anthropic.com/news/confidential-draft-s1-sec)
- [TechCrunch: Anthropic files to go public（2026/6/1）](https://techcrunch.com/2026/06/01/anthropic-files-to-go-public/)
- [CNBC: Anthropic IPO S-1 prospectus（2026/6/1）](https://www.cnbc.com/2026/06/01/anthropic-ipo-s1-prospectus.html)
- [NPR: Anthropic IPO filing（2026/6/1）](https://www.npr.org/2026/06/01/nx-s1-5843199/anthropic-ipo-filing-ai-large)

---

### Micron の Series H 戦略投資と収益ランレート $47B（2026-06-22）

2026年6月22日、メモリ大手 **Micron Technology** が Anthropic の **Series H ラウンドに戦略的投資**として参加したことを明らかにした（投資額は非開示）。Series H は2026年5月28日にクローズした **調達額 $65B・ポストマネー評価額 $965B** のラウンドで、Samsung・SK hynix・Altimeter・Sequoia・Amazon 等が名を連ねる。Micron の参加は、同日発表のメモリ/ストレージ供給協定（HBM・DRAM・SSD の複数年契約）と連動しており、**出資・供給・社内 Claude 活用が一体**となった協定となっている（コンピュート面の詳細は [Anthropic コンピュートインフラ & TPU パートナーシップ](/mdTechKnowledge/blog/anthropic-tpu-compute-partnership/) 参照）。

背景には Anthropic の急成長がある。同社の **年間収益ランレートは2026年5月に約 $47B を突破**した（Anthropic 公式）。2025年末の約 $9B から約5倍の伸びで、Series G（2026年4月末）時点の約 $30B からさらに拡大しており、エンタープライズ各社が中核業務に Claude を組み込んでいることが牽引役だ。この収益成長が、$965B 評価額や大型コンピュート/メモリ協定を支える資本市場の評価につながっている。

| 項目 | 内容 |
|---|---|
| Micron の Series H 投資 | 戦略的投資として参加（**金額非開示**） |
| Series H ラウンド | $65B 調達 / ポストマネー評価額 $965B（2026-05-28 クローズ） |
| 収益ランレート | **2026年5月に約 $47B**（2025年末 約$9B から約5倍、Series G 時 約$30B） |
| 連動協定 | Micron とのメモリ/ストレージ供給契約（HBM・DRAM・SSD・複数年） |

参考: [Micron: Strategic Agreement with Anthropic（2026/6/22）](https://investors.micron.com/news-releases/news-release-details/micron-and-anthropic-announce-strategic-agreement-scale-next) / [CNBC: Anthropic revenue growth（2026/5）](https://www.cnbc.com/2026/05/20/anthropic-revenue-explosive-growth-ipo-profitable-quarter.html)

---

## 第5章補遺: Google製カスタムチップ向け大型プライベートクレジット — Apollo/Blackstone $35B（完了）＋ 第2弾$36B（打診中）

Anthropic の資本調達には、資本市場からの直接調達（Series G/H、AWS・Google の戦略投資）とは別に、**「チップ購入資金を特別目的事業体（SPV）経由で調達し、Anthropicはリースで使う」**という**プライベートクレジット型の資金調達**も並走しています。

### 第1弾: Apollo・Blackstoneが$35Bを完了（2026年6月5日）

**Apollo Global Management** と **Blackstone** が、Google製カスタム **Tensor Processing Unit（TPU）** をAnthropic向けに調達するための**$35B（350億ドル）の債務ファイナンス**を完了しました。

| 項目 | 内容 |
|---|---|
| 完了日 | 2026年6月5日 |
| 規模 | **$35B** |
| 仕組み | **SPV（特別目的事業体）**がGoogleカスタムTPUを購入し、**Anthropicへリース**（Anthropicのバランスシートに乗らない） |
| 構造 | **3トランシェ**構成。最上位トランシェには**Broadcomが信用補完・残存価値保証**を提供 |
| Broadcomの役割 | 最大**$30B分のトランシェ**に信用補完を提供。リース料未払い時、SPVがチップを売却して返済し、不足分はBroadcomがA1/A2トランシェ投資家に**100%補償** |
| 出資構成 | 約半分は**外部投資家へシンジケート**。Apollo傘下のAtlas SP Partnersが$800Mの株式出資 |

史上最大級のプライベートクレジットSPV案件の一つと報じられており、Broadcomの保証がついたことで、TPU自体の資産価値だけでなくBroadcomの信用力もリスク低減に寄与する構造になっています。

### 第2弾: Blackstoneが最低$36Bの追加パッケージを打診中（2026年8月4日時点）

2026年8月4日、Blackstoneが**第2弾の債務パッケージ**について投資家への初期打診を開始したとBloombergが報じました。

- **規模**: 初期案では**最低$36B（360億ドル）**。第1弾の$35Bを上回る可能性
- **ステータス**: 規模・構造・主幹事がBlackstoneになるかを含め**未確定**（早期の投資家打診段階）
- **背景**: Anthropicは直近、**米国IPOに向けて機密裏にS-1を提出**しており、資金調達とIPO準備が並行して進んでいる

> 本項目は「打診中・未確定」の報道ベース情報です。規模・条件は今後変わる可能性があるため、確定情報ではない点にご留意ください。

出典: [Bloomberg: Apollo Shops $36 Billion Debt Deal to Buy Google Chips for Anthropic（2026-05-28）](https://www.bloomberg.com/news/articles/2026-05-28/apollo-shops-36-billion-debt-deal-to-buy-google-chips-for-anthropic) / [Investing.com: Apollo, Blackstone finalize $35 billion AI chip financing（2026-06-05）](https://www.investing.com/news/company-news/apollo-blackstone-finalize-35-billion-ai-chip-financing-for-anthropic-4729436) / [Bloomberg: Blackstone Has Pitched Mega Debt Package for Anthropic Chip Deal（2026-08-04）](https://www.bloomberg.com/news/articles/2026-08-04/blackstone-has-pitched-mega-debt-package-for-anthropic-chip-deal)

---

## 第5章補遺2: 収益急拡大 — ランレート$65B突破・Q2収益$11.5B・Decart AI買収交渉・$15Bデット調達・$10B超クレジットファシリティ（2026年7〜8月）

IPO準備が進む中、2026年7〜8月にかけてAnthropicの**収益規模と資金調達の両面で立て続けに大型ニュース**が報じられました。

### $15Bデット調達（2026年7月31日 PT / 8月1日 JST 報道）

**Google支援のもと、銀行団がAnthropic向けに$15B（150億ドル）規模のデット（債務）調達を組成**していると報じられました。前述のApollo/Blackstoneのプライベートクレジット型SPV案件（チップ購入資金の調達）とは別枠の、Anthropic自身への与信枠に近い性質の調達とみられます。

### IPO前クレジットファシリティが目標$10Bを超過へ（2026年8月18日 PT報道）

Bloombergは、Anthropicの**リボルビング・クレジットファシリティ（回転信用枠）**が、当初目標としていた約$10B（100億ドル）を**超過する見込み**と報じました。上記の$15Bデット調達（7月31日報道）とは別枠の取引で、**IPO直前の流動性確保**を目的とした与信枠です。

| 項目 | 内容 |
|---|---|
| 目標規模 | 約**$10B**、実際には**超過する見込み** |
| 主要行のコミット額 | 組成に最も積極的な銀行団に**約$1.25B**ずつのコミットを要請 |
| 準主要行のコミット額 | 次点の積極的な貸し手には**約$1B**程度を打診 |
| 参加行の動機 | クレジットファシリティへの参加が、**IPO幹事団入りの実績作り**になるとみられている |
| 比較 | 前年に確保した**$2.5B・5年物ファシリティ**から大幅増額 |
| 不確実性 | Anthropicが最終的に**目標額以下に規模を抑える**可能性も報じられている |

出典: [Bloomberg: Anthropic Pre-IPO Credit Facility Set to Climb Past $10 Billion（2026-08-18）](https://www.bloomberg.com/news/articles/2026-08-18/anthropic-pre-ipo-credit-facility-set-to-climb-past-10-billion)

### Decart AI買収交渉 — $6B（2026年8月13日 PT / 8月14日 JST 報道）

Bloombergは、Anthropicが**イスラエル発のAIスタートアップ Decart** の買収交渉を進めていると報じました。

| 項目 | 内容 |
|---|---|
| 買収額（報道） | 約**$6B（60億ドル）** |
| Decartの事業 | **GPU効率化ソフトウェア**、リアルタイム動画生成（Lucyモデル）、自動運転・eコマース向け**シミュレーション環境/世界モデル** |
| 直近の資金調達 | 2026年5月、Radical Ventures主導で**$300M調達**（評価額**$4B**） |
| ステータス | **交渉中・未確定**（破談の可能性あり） |
| 意義 | 成立すればAnthropic**史上最大規模のM&A**（2026年に入り5件目の買収交渉） |

Decartのチップ効率化・推論最適化技術は、Anthropic自身の推論コスト削減（→ [カスタムシリコン戦略](/mdTechKnowledge/blog/anthropic-tpu-compute-partnership/) 参照）とも重なる領域であり、急増する推論需要を既存インフラでどう吸収するかという文脈での買収検討とみられています。

### 収益ランレート$65B突破・Q2収益$11.5B（2026年8月）

| 指標 | 数値 | 出典・時期 |
|---|---|---|
| 収益ランレート | **$65B超**（2026年7月末時点） | Bloomberg、2026-08-17 PT / 8-18 JST |
| Q2 2026収益 | **$11.5B超** | CNBC、2026-08-15 PT / 8-16 JST 報道。**前年同期比約15倍** |
| 投資家試算（年末見通し） | ランレート**$100〜120B**に到達するとの見方 | 複数投資家の試算（報道ベース） |

前回更新時点（Series H・run-rate $47B、2026年6月時点報道）から、わずか1〜2ヶ月で**ランレートが$47B→$65B超**へと急拡大しています。この成長ペースが続けば、投資家の間では**評価額$3T（3兆ドル）到達も視野**に入るとの見方も出ています（第7章のIPO評価額観測と合わせて参照）。

> 本項目の数値はすべて報道ベース（Bloomberg・CNBC）であり、Anthropicの公式発表・監査済み財務諸表による確定値ではありません。「年末$100〜120B」「評価額$3T視野」はいずれも投資家・報道の推計・観測であることにご留意ください。

出典: [Bloomberg: Anthropic revenue run rate surpasses $65 billion ahead of IPO（2026-08-17）](https://www.bloomberg.com/news/articles/2026-08-17/anthropic-revenue-run-rate-surpasses-65-billion-ahead-of-ipo) / [Bloomberg: Anthropic revenue ahead of IPO surges over 14-fold in second quarter（2026-08-14）](https://www.bloomberg.com/news/articles/2026-08-14/anthropic-revenue-ahead-of-ipo-surges-over-14-fold-in-second-quarter) / [CNBC: Anthropic revenue jumps to over $11.5 billion in Q2 report（2026-08-15）](https://www.cnbc.com/2026/08/15/anthropic-revenue-jumps-to-over-11point5-billion-in-q2-report.html) / [Bloomberg: Anthropic said in talks to buy AI startup Decart for $6 billion（2026-08-13）](https://www.bloomberg.com/news/articles/2026-08-13/anthropic-said-in-talks-to-buy-ai-startup-decart-for-6-billion)

---

## 第6章: Claudeおよびmd読者への含意

### Claudeプロダクトラインへの影響

- **モデル世代更新の加速**: コンピュート確保によりOpus 4.7（2026年4月GA）以降の次世代モデル投入サイクルが短縮される可能性
- **長コンテキスト化の継続**: 1Mトークンコンテキスト（Opus 4.7）の標準化、より大きなウィンドウへの拡張余地
- **マネージドエージェント拡張**: Managed Agents・Routinesなどクラウド側で完結するサービスの計算余力増
- **エンタープライズ機能拡充**: RBAC・OpenTelemetry・グループSpend Limits等の継続強化

### 開発者・エンタープライズ利用者の視点

- **Bedrock/Vertex経由利用の安定性向上**: 両社ともAnthropic向けキャパシティを契約で確保するため、ピーク時の供給制約が緩和されやすくなる
- **価格競争**: 計算コスト構造が改善した場合、APIトークン単価への波及（特にHaiku系）が期待される
- **AWS/GCPのバンドル提案増加**: クラウド契約の中でClaude利用がパッケージ化されるケースが増える可能性

### 注意点

- 巨額のクラウド支出コミットは、**Anthropicの収益が想定通り伸びなかった場合の負担**でもある。財務体力次第ではAPI価格戦略・無料枠縮小に動く可能性も否定できない
- 投資元との独占的関係化を懸念する規制当局の動きは継続要監視（FTC・EU・日本の動向）

---

## 第7章: 情報ソース一覧

### 一次情報

- [TechCrunch: Anthropic takes $5B from Amazon and pledges $100B in cloud spending in return（2026/4/20）](https://techcrunch.com/2026/04/20/anthropic-takes-5b-from-amazon-and-pledges-100b-in-cloud-spending-in-return/)
- [TechCrunch: Google to invest up to $40B in Anthropic in cash and compute（2026/4/24）](https://techcrunch.com/2026/04/24/google-to-invest-up-to-40b-in-anthropic-in-cash-and-compute/)
- [CNBC: Google to invest up to $40 billion in Anthropic as search giant spreads its AI bets（2026/4/24）](https://www.cnbc.com/2026/04/24/google-to-invest-up-to-40-billion-in-anthropic-as-search-giant-spreads-its-ai-bets.html)
- [CNBC: Amazon to invest up to another $25 billion in Anthropic（2026/4/20）](https://www.cnbc.com/2026/04/20/amazon-invest-up-to-25-billion-in-anthropic-part-of-ai-infrastructure.html)

### 公式発表・コーポレート

- [Anthropic公式: Anthropic and Amazon expand collaboration for up to 5GW](https://www.anthropic.com/news/anthropic-amazon-compute)
- [About Amazon: Amazon and Anthropic expand strategic collaboration](https://www.aboutamazon.com/news/company-news/amazon-invests-additional-5-billion-anthropic-ai)
- [Bloomberg: Google Plans to Invest Up to $40 Billion in Anthropic](https://www.bloomberg.com/news/articles/2026-04-24/google-plans-to-invest-up-to-40-billion-in-anthropic)

### 合弁会社（2026年5月発表）

- [Blackstone プレスリリース: Anthropic Partners with Blackstone, Hellman & Friedman and Goldman Sachs](https://www.blackstone.com/news/press/anthropic-partners-with-blackstone-hellman-friedman-and-goldman-sachs-to-launch-enterprise-ai-services-firm/)
- [TechCrunch: Anthropic and OpenAI are both launching joint ventures for enterprise AI services](https://techcrunch.com/2026/05/04/anthropic-and-openai-are-both-launching-joint-ventures-for-enterprise-ai-services/)
- [CNBC: Anthropic, Goldman, Blackstone AI venture](https://www.cnbc.com/2026/05/04/anthropic-goldman-blackstone-ai-venture.html)
- [Fortune: Anthropic Claude consulting industry joint venture](https://fortune.com/2026/05/04/anthropic-claude-consulting-industry-joint-venture-blackstone-goldman-sachs/)

### 2026年5月の追加報道（EPAM・Fortune・$30B/$900B ラウンド・PwC）

- [EPAM プレスリリース: EPAM and Anthropic team up to build the future of enterprise transformation with safe applied AI（2026/5/7）](https://www.epam.com/about/newsroom/press-releases/2026/epam-and-anthropic-team-up-to-build-the-future-of-enterprise-transformation-with-safe-applied-ai)
- [Fortune: Anthropic grew 80-fold in a single quarter（2026/5/8）](https://fortune.com/2026/05/08/anthropic-80fold-growth-quarter-renting-elon-musk-data-center/)
- [Bloomberg: Anthropic in Talks to Raise $30 Billion at $900 Billion Valuation（2026/5/12）](https://www.bloomberg.com/news/articles/2026-05-12/anthropic-in-talks-to-raise-30-billion-at-900-billion-valuation)
- [TechCrunch: Anthropic courts a new kind of customer — small business owners（2026/5/13）](https://techcrunch.com/2026/05/13/anthropic-courts-a-new-kind-of-customer-small-business-owners/)
- [Anthropic: PwC expanded partnership（2026/5/15）](https://www.anthropic.com/news/pwc-expanded-partnership)
- [SiliconAngle: PwC expands Anthropic alliance, will train 30000 staff（2026/5/14）](https://siliconangle.com/2026/05/14/pwc-expands-anthropic-alliance-will-train-30000-staff-claude/)

### Series H（2026年5月28日発表）

- [Anthropic 公式: Series H（$65B / post-money $965B）](https://www.anthropic.com/news/series-h)
- [TechCrunch: Anthropic raises $65 billion, nears $1T valuation ahead of IPO（2026/5/28）](https://techcrunch.com/2026/05/28/anthropic-raises-65-billion-nears-1t-valuation-ahead-of-ipo/)
- [Bloomberg: Anthropic Raises at $965 Billion Valuation, Eclipsing OpenAI（2026/5/28）](https://www.bloomberg.com/news/articles/2026-05-28/anthropic-raises-at-965-billion-valuation-eclipsing-openai)

### 米国 AI インフラ投資（$50B / Fluidstack）

- [Anthropic 公式: Anthropic invests $50 billion in American AI infrastructure](https://www.anthropic.com/news/anthropic-invests-50-billion-in-american-ai-infrastructure)

### IPO 申請（2026年6月1日 PT）

- [Anthropic 公式: We have confidentially submitted a draft S-1 to the SEC](https://www.anthropic.com/news/confidential-draft-s1-sec)
- [TechCrunch: Anthropic files to go public（2026/6/1）](https://techcrunch.com/2026/06/01/anthropic-files-to-go-public/)
- [CNBC: Anthropic IPO S-1 prospectus（2026/6/1）](https://www.cnbc.com/2026/06/01/anthropic-ipo-s1-prospectus.html)
- [NPR: Anthropic IPO filing（2026/6/1）](https://www.npr.org/2026/06/01/nx-s1-5843199/anthropic-ipo-filing-ai-large)

### 関連既存記事

- [Claude Opus 4.7 完全ガイド](/blog/claude-opus-4-7-guide/)
- [Claude Cowork アップデートまとめ](/blog/claude-cowork-updates/)
- [Claude Managed Agents 簡易ガイド](/blog/claude-managed-agents-guide/)