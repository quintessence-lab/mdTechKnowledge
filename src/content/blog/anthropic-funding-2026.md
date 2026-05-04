---
title: "Anthropic 大型資本調達ラウンド — Amazon $5B/$100B AWSコミット・Google 最大$40B 投資・Series G $380B評価額 の戦略的意義"
date: 2026-04-26
updatedDate: 2026-05-04
category: "一般リサーチ"
tags: ["Anthropic", "Amazon", "Google", "AWS", "GCP", "Trainium", "TPU", "投資", "クラウドインフラ", "Claude", "Series G", "CoreWeave", "Blackstone", "Goldman Sachs", "合弁会社"]
excerpt: "2026年4月にAnthropicが立て続けに発表したAmazon・Googleからの巨額投資ラウンドと、Series G $380B評価額調達・年間収益ランレート $30B 突破（OpenAI 逆転）・CoreWeave との計算インフラ個別契約を整理。さらに2026年5月3日発表のBlackstone・H&F・Goldman Sachs との$1.5Bエンタープライズ AI サービス合弁会社設立（Palantir型前方展開モデル）を追補。"
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
  - 2023年9月: $4B（初回）
  - 2024年3月: $4B（追加）
  - 2024年11月: $4B（戦略的パートナー化）
  - 2026年4月20日: $5B（今回）

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
- IPO観測: 2026年10月説が浮上（未確定）

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
| 評価額 | $180B前後 | **Series G で $380B post-money**（4月末発表） |
| 年間収益ランレート | — | **$30B 突破（OpenAI を逆転、2026年4月初旬報道）** |

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

### 関連既存記事

- [Claude Opus 4.7 完全ガイド](/blog/claude-opus-4-7-guide/)
- [Claude Cowork アップデートまとめ](/blog/claude-cowork-updates/)
- [Claude Managed Agents 簡易ガイド](/blog/claude-managed-agents-guide/)