---
title: "Anthropic コンピュートインフラ & TPUパートナーシップ — Google・BroadcomとのマルチギガワットTPU契約（2027年稼働）"
date: 2026-04-29
updatedDate: 2026-07-09
category: "一般リサーチ"
tags: ["Anthropic", "Google", "Broadcom", "TPU", "AIインフラ", "コンピュート", "パートナーシップ", "SpaceX", "xAI", "Colossus", "GPU", "Akamai", "Fluidstack", "データセンター", "米国インフラ投資"]
excerpt: "2026年4月6日発表のGoogle・BroadcomとのマルチギガワットTPU契約（2027年稼働）に加え、2026年5月のSpaceX xAI Colossus 1データセンター全容量契約（300MW超・GPU22万台超）、Akamai Technologies $1.8B・7年間クラウドコンピュート契約を収録。Anthropicのマルチクラウド・マルチベンダーインフラ戦略を整理。あわせて2025年11月発表の$50B米国AIインフラ投資（Fluidstackと組みテキサス州・ニューヨーク州にデータセンターを建設、2026年中に順次稼働）も収録。"
draft: false
---

**調査日**: 2026年4月29日

---

## 目次

1. [概要 — 4月6日発表のインパクト](#第1章-概要--4月6日発表のインパクト)
2. [Google CloudのTPU提供](#第2章-google-cloudのtpu提供)
3. [Broadcomとの協業 — カスタムASIC実装層](#第3章-broadcomとの協業--カスタムasic実装層)
4. [2027年稼働スケジュールと2031年までのロードマップ](#第4章-2027年稼働スケジュールと2031年までのロードマップ)
5. [Amazon $5B/$100Bディールとの関係 — マルチクラウド3軸構造](#第5章-amazon-5b100bディールとの関係--マルチクラウド3軸構造)
6. [フロンティアモデルへの含意](#第6章-フロンティアモデルへの含意)
7. [競合比較 — OpenAI / Google DeepMind](#第7章-競合比較--openai--google-deepmind)
8. [SpaceX xAI Colossus 1 — GPU 300MW超・全容量契約（2026-05-07 JST）](#第8章-spacex-xai-colossus-1--gpu-300mw超全容量契約)
9. [Akamai Technologies — $1.8Bクラウドコンピュート契約（2026-05-08）](#第9章-akamai-technologies--18bクラウドコンピュート契約2026-05-08)
10. [$50B 米国AIインフラ投資 — Fluidstackと組むTX・NY州データセンター（2025-11-12）](#第10章-50b-米国aiインフラ投資--fluidstackと組むtxny州データセンター)
11. [情報ソース一覧](#第11章-情報ソース一覧)

---

## 第1章: 概要 — 4月6日発表のインパクト

2026年4月6日、AnthropicはGoogle CloudおよびBroadcomとの提携を拡大し、**マルチギガワット規模の次世代TPU容量**を確保する契約を発表した。Broadcomが翌7日にSECに提出した8-K開示によれば、容量規模は**約3.5GW**、稼働開始は**2027年**、供給契約は**2031年まで**継続する。

| 項目 | 内容 |
|---|---|
| 発表日 | 2026年4月6日（Google Cloud / Anthropic 公式）／4月7日（Broadcom SEC開示） |
| 容量規模 | 約3.5GW（次世代TPUベース） |
| 稼働開始 | 2027年 |
| 供給契約期間 | 2031年まで |
| 既存契約 | 2025年10月発表の1GW分（2026年稼働）に上乗せ |
| 設置地域 | 大半が米国内（2025年11月の$50B米国AIインフラ投資コミットの延長線） |
| 対象モデル | Claude フロンティアモデル（学習・推論）、エージェント、エンタープライズ |

CFO Krishna Raoは「インフラスケーリングにおける規律ある姿勢の延長であり、過去最大級のコンピュートコミットメント」とコメント。ランレート売上は**$30B**（2025年末の$9Bから3倍以上）に達し、年$1M以上支出する顧客も2か月で1,000社超に倍増した。

これは単なる「クラウド利用拡大」ではなく、**Google・Broadcom連合のカスタムシリコン供給ラインを長期で確保する戦略**だ。AnthropicはAWS Trainium・Google TPU・NVIDIA GPUの3軸でClaudeを動かす方針を明示しており、本契約で「TPUレーン」が他2軸と並ぶ規模になる。資本面（Amazon $5B、Google $40B）は別記事[Anthropic 大型資本調達ラウンド](/blog/anthropic-funding-2026/)で扱う。本記事はその下地である**コンピュートインフラ層**に焦点を絞る。

---

## 第2章: Google CloudのTPU提供

- **規模**: 約**3.5GW**（既存1GWを除く新規分）
- **世代**: 次世代TPU、中心は**TPU v7「Ironwood」**相当
- **既存契約**: 2025年10月発表の1GW超に上乗せ
- **設置場所**: 大半が米国内データセンター

Ironwoodは「proactive information generation」や高スループット推論を想定し、エージェント型・長コンテキスト型ワークロードに最適化された世代。ハードウェア以外にもBigQuery、Cloud Run、AlloyDBなどのGCPサービスを業務に組み込む。GCP経由でClaudeを使う顧客にはCoinbase、Cursor、Palo Alto Networks、Replit、Shopify等が含まれる。

---

## 第3章: Broadcomとの協業 — カスタムASIC実装層

### 3社の役割分担

```
┌──────────────────────────────────────────────────┐
│  TPU バリューチェーン                              │
├──────────────────────────────────────────────────┤
│  ① Google      : TPUアーキテクチャ設計・SWスタック│
│  ② Broadcom    : ASIC実装・SerDes・電源管理・    │
│                  パッケージング・ネットワーキング │
│  ③ TSMC        : 製造（ファブリケーション）       │
│  ④ Google Cloud: データセンター・クラウド運用     │
│  ⑤ Anthropic   : 大規模ワークロード消費          │
└──────────────────────────────────────────────────┘
```

Broadcomは設計者ではなく「Googleのアーキテクチャを製造可能なASICレイアウトに落とし込む」実装パートナー。SerDes、電源管理、パッケージング、ラック向けネットワーキングも供給する。Mizuho証券試算では、AnthropicからBroadcomが得るAI関連売上は**2026年に約$21B、2027年に約$42B**規模。Broadcom株価は発表当日6%上昇した。

### Broadcomのマルチ顧客戦略

BroadcomはGoogle（TPU設計・供給を2031年まで延長）、Anthropic（Google TPU経由3.5GW）、OpenAI（約10GWカスタムASIC）、Metaに並行供給しており、NVIDIA汎用GPUに依存しない**カスタムASIC経済圏のハブ**として急浮上している。

### SEC開示の重要条項

Broadcomの8-K開示には条件文がある — *"The consumption of such expanded AI compute capacity by Anthropic is dependent on Anthropic's continued commercial success."* 3.5GWは確定発注ではなく**コミット型のキャパシティ枠**で、Anthropicの売上トラクション次第で実消費量が変動する。ただしランレート$30Bの伸びを踏まえれば、消化が前倒しになる可能性のほうが高い。

---

## 第4章: 2027年稼働スケジュールと2031年までのロードマップ

| 時期 | マイルストーン |
|---|---|
| 2025年10月 | Google-Anthropic 1GW契約発表 |
| 2025年11月 | Anthropic、米国AIインフラに$50B投資コミット |
| 2026年4月6日 | 3.5GW追加契約発表（本記事対象） |
| 2026年内 | 既存1GW分のオンライン化完了予定 |
| 2027年〜 | 新規3.5GW分のオンライン化開始 |
| 2031年 | Broadcom-Google設計・供給契約終了予定 |

2027年スタートは、Ironwoodの量産配備ピーク、米国データセンター・電力契約のリードタイム、Anthropicのフロンティアモデル世代更新タイミングと一致する。$50B米国インフラ投資の**ハードウェア面の中核**を本TPU契約が構成する形だ。

---

## 第5章: Amazon $5B/$100Bディールとの関係 — マルチクラウド3軸構造

### 4月の連続発表シーケンス

| 日付 | 内容 | 性質 |
|---|---|---|
| 4月6日 | **Google・Broadcom 3.5GW TPU契約**（本記事） | コンピュートインフラ |
| 4月20日 | Amazon追加$5B（最大+$20B）、10年で$100B超AWS支出、**新規5GW容量**確保 | 資本＋AWS消費 |
| 4月24日 | Google最大$40B投資（5GW TPU含む） | 資本＋GCP消費 |

つまり**4月6日のTPU契約が「インフラ層の確保」を先行宣言し、20日・24日の資本ラウンドが「その費用を払える資金体力」を裏打ちする**構造だ。

### マルチクラウド5軸の最新像（2026年5月時点）

```
┌─────────────────────────────────────────────────────┐
│  Anthropic Claude スケーリング基盤（2026〜2031）      │
├─────────────────────────────────────────────────────┤
│  ① AWS          : Trainium 5GW（Project Rainier）    │
│  ② GCP          : TPU 5GW（うち3.5GWは2027〜稼働）  │
│                   Broadcom実装ASIC、Ironwood世代     │
│  ③ NVIDIA       : GPU（CoreWeave等経由、汎用ワーク） │
│  ④ SpaceX/xAI   : Colossus 1 GPU 300MW超（即時）    │
│                   H100/H200/GB200 22万台超、Memphis  │
│  ⑤ Akamai       : クラウドコンピュート $1.8B・7年   │
└─────────────────────────────────────────────────────┘
```

2026年5月の**SpaceX xAI Colossus 1契約**（第8章）と**Akamai契約**（第9章）を加え、合計**10GW超**のコンピュートポートフォリオを形成。5軸の意義は(1)チップ供給・アーキテクチャリスク分散、(2)ワークロード最適配置、(3)AWS・GCPからの戦略投資受領（クラウド消費契約とセット）、(4)規制・独禁リスク回避、に加え⑤ライバル（xAI）からの緊急キャパシティ調達というユニークな側面も持つ。

---

## 第6章: フロンティアモデルへの含意

### モデル世代更新サイクル

3.5GWを2027年から消費し始めることで、(1)**次々世代Opus / Sonnet系の大規模学習**（現Opus 4.7・1Mトークン後継）、(2)**マルチモデル並行開発**、(3)**RLHF / Constitutional AIの追加再学習サイクル**といった展開が可能になる。

Ironwoodは推論基盤としても効く。エージェント型ワークロード（Managed Agents・Routinesの長時間ループ）、長コンテキスト推論（1M+トークンを高帯域メモリ・インターコネクトで処理）、BigQuery連携の大規模バッチ推論が中心ユースケース。

エンタープライズ波及としては、Bedrock / Vertex AI 経由のClaudeでピーク時供給逼迫が緩和され、推論コスト構造の改善（特にHaiku系）がAPI価格に反映される可能性がある。

---

## 第7章: 競合比較 — OpenAI / Google DeepMind

### 対 OpenAI

OpenAIはAzure（中核）+ Oracle Cloud（Stargate）+ AWS（$50B）+ Broadcom 約**10GW**カスタムASICで構成。「10GW」だけ見ればOpenAIが大きいが、Anthropicは**マルチクラウド・マルチアーキテクチャ（Trainium + TPU + GPU）**で分散させており、特定ベンダー依存度が低い点が異なる。

### 対 Google DeepMind

GoogleはGemini系を自社運用しつつ、ライバルのAnthropicに自社最新TPU 3.5GWを売り最大$40Bを出資する。狙いは(1)Geminiは内部用途優先（Search/Workspace/Android深層統合）、(2)TPU外販でBroadcom/TSMC規模効率確保、(3)AnthropicのGCP収益はGoogleに直接寄与、(4)AI市場主導権分散ヘッジ。「自社モデル × インフラ提供者」の二刀流であり、Anthropicは**そのインフラ層の最大顧客**として組み込まれる。2010年代のAWS-Netflix関係に類似する。

### 構図サマリー

| 観点 | Anthropic | OpenAI | Google DeepMind |
|---|---|---|---|
| 主要クラウド | AWS + GCP（マルチ） | Azure + Oracle + AWS | GCP（自社） |
| カスタムASIC | Trainium + TPU(via Broadcom) | Broadcom 10GW | TPU（自社設計） |
| 2027年TPU容量 | 3.5GW新規＋既存1GW | — | 内部使用 |
| インフラ戦略 | マルチクラウド分散 | クラウド分散＋自社ASIC | 垂直統合 |

---

## 第8章: SpaceX xAI Colossus 1 — GPU 300MW超・全容量契約（2026-05-07 JST）

> **この契約は独立記事で詳述しています。** SpaceX Colossus 契約の財務詳細・ライバル間取引の構造・宇宙コンピュート構想・Claudeユーザーへの即効果は、専用記事「[Anthropic × SpaceX Colossus コンピュートディール — 競合xAIから全容量を借りる『月$1.25B』契約と宇宙コンピュート構想](/mdTechKnowledge/blog/anthropic-spacex-colossus-compute/)」にまとめました。本章は、TPU契約との対比に必要な要点のみを記載します。

### 要点（GPU即時調達レーン）

2026年5月6日（PT）/ 7日（JST）、Anthropicは**競合xAIが運営するColossus 1データセンター（Memphis, TN）の全計算能力**を確保する契約を発表した。

| 項目 | 内容 |
|---|---|
| 容量 / GPU | 300MW超 / NVIDIA GPU 22万台超（H100/H200/GB200） |
| 財務 | 月$1.25B・年$15B・xAIへ$40B超、2029年5月まで・90日通知解約可 |
| 即効果 | 発表同日にClaude Codeのレート制限を倍増・ピーク制限を廃止 |
| 拡張 | Colossus 2 拡張確定（GB200 順次追加）。宇宙GW級コンピュートにも関心表明 |

TPU契約（長期・2027年稼働の本命レーン）に対し、本契約は**「今すぐ必要なGPUを競合からでも即時調達するつなぎレーン」**という対照的な性格を持つ。詳細は上記の独立記事を参照。

### インフラポートフォリオにおける位置づけ

| ディール | 発表時期 | 規模 | 性質 |
|---|---|---|---|
| AWS（Project Rainier） | 2023〜2025年 | Trainium 5GW | 長期インフラ |
| Google/Broadcom TPU | 2026年4月 | 3.5GW（2027〜） | 長期インフラ |
| Azure | — | $30B相当 | クラウド消費 |
| Fluidstack | — | $50B相当 | クラウド消費 |
| **SpaceX xAI Colossus 1+2** | **2026年5月6日（基本契約）/ 5月20日（財務詳細判明）** | **300MW超・22万GPU + Colossus 2 GB200拡張 / $1.25B/月・〜2029年5月** | **即時GPU調達** |
| **Akamai Technologies** | **2026年5月8日** | **$1.8B・7年** | **クラウドコンピュート** |

---

## 第9章: Akamai Technologies — $1.8Bクラウドコンピュート契約（2026-05-08）

### 契約の概要

2026年5月8日（PT）、Bloombergが報道した内容によれば、AnthropicはAkamai Technologiesと**7年間・最大18億ドル（$1.8B）**のクラウドコンピュート供給契約を締結した。

| 項目 | 内容 |
|---|---|
| 報道日 | 2026年5月8日（PT）/ 2026年5月9日（JST） |
| パートナー | Akamai Technologies |
| 契約期間 | 7年間 |
| 契約規模 | 最大18億ドル（$1.8B） |
| 性質 | クラウドコンピュートリソース供給 |
| 株価反応 | Akamai株価 +27%（報道後） |
| 情報源 | Bloomberg（一次報道） |

### 戦略的意義

Google/Broadcom TPU、SpaceX xAI Colossus 1に続く形で発表されたAkamaiとの契約は、Anthropicのマルチベンダー・マルチクラウド戦略の一環である。Akamaiは従来CDN（コンテンツ配信ネットワーク）大手として知られるが、近年はクラウドコンピュートインフラへの展開を強化しており、今回の契約はその重要な顧客獲得となる。

CEO Dario Amodeiは報道の前後、Q1（2026年1〜3月）の収益・利用量が前年同期比で**80倍増（YoY）**を記録したと述べており、この急成長を支えるコンピュートリソースの多様化が継続的な課題となっている。

### 性格の違い — GPU調達 vs クラウドコンピュート

SpaceX Colossus 1が「特定データセンターのGPUへの即時アクセス確保」であるのに対し、Akamai契約は「7年にわたるクラウドコンピュートリソースの調達」という長期コミット型の性格を持つ。Akamaiのエッジネットワーク・分散インフラを活用することで、地理的な分散と冗長性の確保が期待される。

### Akamai 株価への影響

契約発表後、Akamai株価は**+27%**の急騰を記録した。同社はクラウドビジネスの成長加速が課題とされており、Anthropicという大口顧客の獲得は株式市場に強いシグナルを与えた。

---

## 第9章補遺: Google Cloud $200B（約30兆円）コンピュート契約（2026-05-06 PT 報道）

### 契約の概要

2026年5月6日（PT）、The Information が Anthropic と Google Cloud との間で **5年・$200B（2,000億ドル、約30兆円）**規模のコンピュート契約が成立したと報じた。第2章で扱った2026年4月6日の Google・Broadcom 3.5GW TPU 契約をさらに上回る規模で、TPU を中心とした **5GW 級のキャパシティ**を 2027 年から消費する内容。

| 項目 | 内容 |
|---|---|
| 報道日 | 2026年5月6日（PT）／5月7日（JST） |
| 一次報道 | The Information（Sri Muppidi / Erin Woo / Amir Efrati） |
| 契約期間 | 5年 |
| 契約規模 | **$200B（約30兆円）** |
| 容量 | **TPU 5GW 級**（Google 製カスタムシリコン中心） |
| 稼働開始 | **2027年** |
| 比較対象 | Anthropic の年間収益ランレート（当時 $30B）の **6.7倍**規模 |

### 4月6日 3.5GW契約・4月24日 $40B投資との関係

| 発表日 | 内容 | 性質 |
|---|---|---|
| 2026年4月6日 | Google・Broadcom 3.5GW TPU 契約 | コンピュート供給合意 |
| 2026年4月24日 | Google 最大 $40B 投資（5GW TPU 含む） | 資本＋コンピュート |
| **2026年5月6日（報道）** | **Google Cloud $200B コンピュート契約** | **長期消費コミット（最大級）** |

4月の 3.5GW 容量契約と $40B 投資ラウンドを統合・拡張する形で、**「5年・$200B・TPU 5GW」**という長期消費コミットがまとめられたと解釈できる。$200B という金額は Amazon との10年・$100B超 AWS 支出コミット（第5章）を**金額面で逆転**するもので、Anthropic にとって過去最大級のコンピュートコミットメントとなる。

### 収益規模との比較

報道時点での Anthropic の年間収益ランレートは約 **$30B**（同社公表）。**$200B/5年 = 年 $40B**の支出計画は、現在の年間収益を上回るペースとなる。これは Anthropic が「収益成長」と「コンピュートコスト」のどちらが先行するかを賭ける構造になっており、Fortune が同時期に報じた「単一四半期で 80 倍成長」の見通しが、本契約を経済的に支える前提となる。

### マルチクラウド5軸構造の更新

第5章の5軸構造に本契約を反映した最新像は次の通り:

```
┌─────────────────────────────────────────────────────┐
│  Anthropic Claude スケーリング基盤（2026〜2031）      │
├─────────────────────────────────────────────────────┤
│  ① AWS          : Trainium 5GW（10年・$100B+）       │
│  ② GCP          : TPU 5GW                            │
│                   ├ 4月6日 3.5GW 契約                │
│                   └ 5月6日 $200B / 5年 長期コミット │
│  ③ NVIDIA       : GPU（CoreWeave等経由）             │
│  ④ SpaceX/xAI   : Colossus 1 300MW・22万GPU         │
│  ⑤ Akamai       : クラウドコンピュート $1.8B・7年   │
└─────────────────────────────────────────────────────┘
```

AWS（$100B超 / 10年）と GCP（$200B / 5年）の **年率支出ベースで GCP が AWS を上回る**形となり、コンピュート供給の「主たる軸」が TPU 側に傾いた可能性を示唆する。一方で AWS Trainium は引き続き戦略的に維持されるため、二大ハイパースケーラーの**両建てを最大規模で並走**させる路線が確定した。

### 参考

- [The Information: Anthropic commits to spending $200 billion on Google's cloud and chips（2026/5/6）](https://www.theinformation.com/articles/anthropic-commits-spending-200-billion-googles-cloud-chips)
- [CNBC video: Anthropic commits to spending $200 billion on Google's cloud and chips, according to The Information（2026/5/5）](https://www.cnbc.com/video/2026/05/05/anthropic-commits-to-spending-200-billion-on-googles-cloud-and-chips-according-to-the-information.html)

---

## 第10章: $50B 米国AIインフラ投資 — Fluidstackと組むTX・NY州データセンター（2025-11-12）

### 投資の概要

2025年11月12日、Anthropicは**米国の計算インフラに総額$50B（500億ドル）を投資**すると発表した。本記事の第1章・第4章で繰り返し言及してきた「$50B米国AIインフラ投資コミット」の本体がこれであり、TPU契約をはじめとする各種コンピュート確保の**物理的なデータセンター基盤**を成す。データセンターのパートナーには、AIクラウドプラットフォームの**Fluidstack**（本社ニューヨーク）が選定された。

| 項目 | 内容 |
|---|---|
| 発表日 | 2025年11月12日（PT） |
| 投資総額 | $50B（500億ドル） |
| パートナー | Fluidstack（本社ニューヨーク、大規模GPUクラスタ供給。Meta・Midjourney・Mistral等が顧客） |
| 建設地 | テキサス州・ニューヨーク州（今後さらに拠点を追加予定） |
| 稼働時期 | 2026年中に順次オンライン化 |
| 雇用 | 常勤約800人（平均年収約$144,000）＋建設関連約2,400人 |
| 性格 | Anthropic専用にカスタム設計・効率最適化された自社ワークロード向けDC |
| 政策的文脈 | トランプ政権のAI Action Plan（米国のAIリーダーシップ維持）に沿う |

AnthropicがFluidstackを選んだ理由は、**ギガワット級の電力を迅速に供給できる機動力**にある。Fluidstackは従来からMeta・Midjourney・Mistral等に大規模GPUクラスタを提供してきたAIクラウド事業者で、これらのデータセンターはAnthropic向けにカスタム構築され、自社ワークロードの効率最大化に焦点を置いている。

### コンピュート確保戦略における位置づけ

本記事で扱ってきたGoogle/Broadcom TPU（3.5GW・2027年〜）やAmazon Trainium、SpaceX Colossus等が**「どのチップ・どのクラウドから計算能力を借りるか」**という供給契約であるのに対し、$50B投資は**「自社専用のデータセンターを米国内に建てる」**という物理アセット側の取り組みである点が対照的だ。第1章・第4章で述べたとおり、この$50B投資はTPU契約の設置地域（大半が米国内）とも重なり、Anthropicのコンピュート基盤の**ハードウェア・立地面の中核**を構成する。

発表時点でAnthropicは30万社超のビジネス顧客を抱え、年間$100K超を支出する大口アカウントは過去1年で約7倍に増加していた。この急成長する需要を支えるための、自社主導の大規模インフラ投資という位置づけになる。

---

## 第11章: Micron 戦略協定 — メモリ/ストレージの確保（2026-06-22）

2026年6月22日、Anthropic は **Micron Technology** と戦略協定を締結した。これまで本記事が扱ってきた GPU・TPU といった**アクセラレータ**中心のインフラ確保に対し、本協定は **メモリ/ストレージ**という「もう一つのボトルネック」へ確保戦略を拡張するものだ。

### 協定の概要

| 項目 | 内容 |
|---|---|
| 発表日 | 2026年6月22日 |
| 中核 | Micron のデータセンター向けポートフォリオ全体（**HBM・DRAM・SSD**）を対象とする**複数年（multi-year）のメモリ/ストレージ供給契約** |
| 共同設計 | メモリ/ストレージのサブシステムが AI ワークロード全体でどう機能するかを両社で分析し、**性能・エネルギー効率・トークンエコノミクス**の改善を狙う co-design |
| 資本面 | Micron が Anthropic の **Series H ラウンドに戦略的投資**として参加（金額は非開示） |
| エンタープライズ | Micron 社内に Claude を展開し、エンジニアリング・製造・業務機能でエージェント活用を推進 |
| 規模・期間（金額） | **非開示** |

### 戦略的意義

GPU/TPU の確保競争に注目が集まりがちだが、大規模 AI 推論・学習では **HBM（高帯域幅メモリ）の供給** がそのままアクセラレータの実効性能を左右する。Micron との複数年契約は、アクセラレータ（Google/Broadcom TPU、Amazon Trainium、SpaceX/Akamai の GPU 等）と並ぶ**メモリ/ストレージのサプライチェーン確保**であり、Anthropic のコンピュート戦略を「演算」だけでなく「記憶階層」まで垂直に押さえる動きと位置づけられる。Micron の Sumit Sadana CBO は「AI 革命はデータセンターからエッジに至るまでメモリ/ストレージの役割を恒久的に引き上げた」と述べた。市場の反応も大きく、**発表翌日には Micron 株が史上最高値となる $1,211.38 を記録**した（報道ベース）。なお供給契約の規模・期間や Micron の出資額はいずれも非開示。資本面（Series H 戦略投資・収益ランレート）の詳細は [Anthropic 大型資本調達ラウンド](/mdTechKnowledge/blog/anthropic-funding-2026/) を参照。

参考: [Micron: Micron and Anthropic Announce Strategic Agreement to Scale Next-Generation AI Infrastructure（2026/6/22）](https://investors.micron.com/news-releases/news-release-details/micron-and-anthropic-announce-strategic-agreement-scale-next) / [HPCwire（同協定）](https://www.hpcwire.com/off-the-wire/micron-and-anthropic-announce-strategic-agreement-to-scale-next-generation-ai-infrastructure/)

---

## 第11章補遺: TeraWulf — $19B・20年リースで自社データセンターを直接確保（2026-07-06）

2026年7月6日、Anthropic は暗号資産マイニング事業から AI データセンターへ転換中の **TeraWulf** と、**20年間のリース契約**を締結したと報じられた。これは「クラウドプロバイダ経由の消費」ではなく、**Anthropic がデータセンター容量を直接・長期に押さえる**動きで、コンピュート確保戦略のもう一段の垂直化を示す。

### 契約の概要

| 項目 | 内容 |
|---|---|
| 発表日 | 2026年7月6日 |
| 契約形態 | **20年リース** |
| 契約総額 | **初期契約期間で約 $19B（190億ドル）のリース収益**（TeraWulf 側の開示ベース） |
| 立地 | 米ケンタッキー州 **Hawesville**、**Justified Data** キャンパス |
| 容量 | 完成時 **最大 401 MW の IT 容量**（クリティカルIT負荷） |
| タイムライン | 初期容量の稼働開始は **2027年下半期**、**2028年初頭に 401 MW 全量**達成見込み |
| 位置づけ | クラウド消費（Azure/Fluidstack 等）ではなく**直接リースによる自社インフラ確保** |

### 戦略的意義

Anthropic はこれまで演算調達をクラウドプロバイダに依存してきたが、TeraWulf との直接リースは **Google（$200B 規模のコミット）・AWS（Trainium）・CoreWeave・Fluidstack（$50B）・SpaceX/xAI Colossus** といった既存の枠組みに**「自社が長期に占有するデータセンター」という新たな軸**を加えるものだ。401 MW という規模は本記事が扱ってきた GW 級の TPU/GPU 契約に比べれば中規模だが、**立地・電力・20年という期間を自ら押さえる**点に意味がある。なお同時に TeraWulf は、テキサスの Abernathy JV（168MW）の持分 50.1% を Fluidstack 主導の投資家グループへ売却し、**直接保有インフラへ資本を再配分**している（報道ベース）。

参考: [DataCenterDynamics: Anthropic signs $19bn 20-year lease for Kentucky data center with TeraWulf（2026/7/6）](https://www.datacenterdynamics.com/en/news/anthropic-signs-19bn-20-year-lease-for-kentucky-data-center-with-terawulf/) / [CNBC（同契約）](https://www.cnbc.com/2026/07/06/anthropic-terawulf-data-center-ai.html)

---

## 第12章: 情報ソース一覧

### 一次情報

- [Anthropic公式: Higher usage limits for Claude and a compute deal with SpaceX（2026/5/6）](https://www.anthropic.com/news/higher-limits-spacex)
- [xAI公式: New Compute Partnership with Anthropic（2026/5/6）](https://x.ai/news/anthropic-compute-partnership)
- [Anthropic公式: Anthropic invests $50 billion in American AI infrastructure（2025/11/12）](https://www.anthropic.com/news/anthropic-invests-50-billion-in-american-ai-infrastructure) — Fluidstackと組みTX・NY州にDC建設、2026年中に順次稼働
- [Fluidstack公式: Fluidstack selected by Anthropic to deliver custom data centers in the US](https://www.fluidstack.io/about-us/blog/fluidstack-selected-by-anthropic-to-deliver-custom-data-centers-in-the-us)
- [Anthropic公式: Anthropic and Amazon expand collaboration for up to 5 gigawatts of new compute（2026/4/20）](https://www.anthropic.com/news/anthropic-amazon-compute) — 新規5GW容量・$100B超10年AWSコミット
- [Anthropic公式: Anthropic expands partnership with Google and Broadcom for compute（2026/4/6）](https://www.anthropic.com/news/google-broadcom-partnership-compute)
- [Google Cloud Press: Anthropic Expands Use of Google Cloud and TPUs（2026/4/6）](https://www.googlecloudpresscorner.com/2026-04-06-Anthropic-Expands-Use-of-Google-Cloud-and-TPUs)
- [Broadcom 8-K SEC開示（2026/4/7）](https://www.stocktitan.net/sec-filings/AVGO/8-k-broadcom-inc-reports-material-event-35aab0650b17.html)

### 主要報道（Akamai 関連）

- Bloomberg（2026/5/8）: Anthropic-Akamai $1.8B クラウドコンピュート契約（一次報道）

### 主要報道（SpaceX Colossus 1 関連）

- [CNBC: Anthropic, SpaceX announce compute deal that includes space development（2026/5/6）](https://www.cnbc.com/2026/05/06/anthropic-spacex-data-center-capacity.html)
- [Data Center Dynamics: Anthropic to use all of SpaceX-xAI's Colossus 1 data center compute（2026/5/6）](https://www.datacenterdynamics.com/en/news/anthropic-to-use-all-of-spacex-xais-colossus-1-data-center-compute/)
- [Axios: Anthropic will get compute capacity from Elon Musk's SpaceX（2026/5/6）](https://www.axios.com/2026/05/06/anthropic-spacex-elon-musk-compute)
- [9to5Google: Claude Code is getting higher usage limits, doubled for most users（2026/5/6）](https://9to5google.com/2026/05/06/claude-code-is-getting-higher-usage-limits-doubled-for-most-users/)
- [Axios: Anthropic to pay xAI $1.25B per month for compute（2026/5/20）](https://www.axios.com/2026/05/20/anthropic-spacex-compute) — 月額$1.25B / 〜2029年5月 / 90日通知解約可
- [TechCrunch: Anthropic will pay xAI $1.25 billion per month for compute（2026/5/20）](https://techcrunch.com/2026/05/20/anthropic-will-pay-xai-1-25-billion-per-month-for-compute/) — 総額$40B超 / Colossus 2拡張・GB200追加

### 主要報道（Google / Broadcom TPU 関連）

- [TechCrunch: Anthropic ups compute deal with Google and Broadcom（2026/4/7）](https://techcrunch.com/2026/04/07/anthropic-compute-deal-google-broadcom-tpus/)
- [CNBC: Broadcom agrees to expanded chip deals with Google, Anthropic（2026/4/6）](https://www.cnbc.com/2026/04/06/broadcom-agrees-to-expanded-chip-deals-with-google-anthropic.html)
- [Tom's Hardware: Broadcom to supply Anthropic with 3.5GW of Google TPU capacity from 2027](https://www.tomshardware.com/tech-industry/broadcom-expands-anthropic-deal-to-3-5gw-of-google-tpu-capacity-from-2027)
- [HPCwire: Anthropic Signs Google, Broadcom Deal to Add Multi-Gigawatt TPU Capacity](https://www.hpcwire.com/off-the-wire/anthropic-signs-google-broadcom-deal-to-add-multi-gigawatt-tpu-capacity/)
- [TechWire Asia: Custom AI chips, 3.5 gigawatts, and a quiet SEC clause](https://techwireasia.com/2026/04/broadcom-custom-ai-chips-google-anthropic-deal/)

### 関連既存記事

- [Anthropic 大型資本調達ラウンド — Amazon $5B/$100B AWSコミット・Google 最大$40B 投資の戦略的意義](/blog/anthropic-funding-2026/)
- [Claude Opus 4.7 完全ガイド](/blog/claude-opus-4-7-guide/)
- [Claude Managed Agents 簡易ガイド](/blog/claude-managed-agents-guide/)
