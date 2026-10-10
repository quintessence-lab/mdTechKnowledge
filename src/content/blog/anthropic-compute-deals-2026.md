---
title: "Anthropic のコンピュート契約の全体像 — Google/Broadcom・Amazon・SpaceX・TeraWulf・AMD・Volta・Riot・Nscale・Akamai（2025年11月〜2026年9月）"
date: 2026-10-10
category: "一般リサーチ"
tags: ["Anthropic", "コンピュート", "データセンター", "TPU", "Trainium", "AMD", "Nvidia", "Riot Platforms", "Volta", "TeraWulf", "Nscale", "Akamai", "一般リサーチ"]
excerpt: "Anthropic が2025年11月から2026年9月にかけて公表・報道されたコンピュート契約を、時系列・契約相手・規模・期間・稼働時期・情報の確度で一覧する。公式発表（Google/Broadcom の TPU、Amazon の最大5GW、SpaceX の Colossus 1）、取引先の開示（TeraWulf の 401MW・Riot の 191MW・Akamai の $11.6B・AMD の最大2GW）、報道ベース（Volta の $10B、Nscale の $45B）を区別する。契約額を電力容量で割った試算（施設リースは1MW・年あたり約$240万、コンピュートの貸与は約$12〜16M）から、契約の『中身の違い』も読み解く。個別の詳細は各既存記事に譲り、本記事は全体像に絞る。"
draft: false
---

> ## 要点
>
> - 2025年11月の **$50B の米国インフラ投資**から2026年9月までに、Anthropic は**10件**の大型コンピュート契約・拡張を公表または報道されています（Akamai は拡張を含めて1件と数えています）。相手は、クラウド・チップ企業（Google、Broadcom、Amazon、AMD）、競合の施設（SpaceX の Colossus 1）、そして**暗号資産マイニング施設の転用**（TeraWulf、Riot）や新興ネオクラウド（Volta、Nscale、Akamai）です。
> - **情報の確度は三層**に分かれます。**Anthropic の公式発表**（Google/Broadcom、Amazon、SpaceX）、**取引先の開示**（TeraWulf・Riot・Akamai・AMD の SEC 提出書類や IR）、**報道ベース**（Volta・Nscale など）です。
> - **Riot の開示文書に Anthropic の名前はありません**。契約書は借り手を「世界有数のフロンティア AI ラボ」とだけ書き、Anthropic だと特定したのは Bloomberg の報道です。
> - 契約額は**単位も意味も混在**しています（契約総額・投資額・電力容量・期間）。金額を電力容量で割ると、施設リース（TeraWulf・Riot）は**1MW・1年あたり約$240万**、コンピュートの貸与（Volta・Nscale）は**約$12〜16M**と、中身がまったく違う契約だと分かります（本記事の試算）。
> - **稼働の山は2027年**です。TPU、AMD の最初の1GW、Riot・TeraWulf・Nscale の初期容量がそろって2027年から2028年前半に立ち上がります。

## 1. 時系列の一覧

| 日付（発表・報道） | 相手 | 規模・期間 | 内容・拠点 | 確度 |
|:---|:---|:---|:---|:---|
| 2025-11 | **Fluidstack ほか（米国インフラ投資）** | **$50B** | 米国でのコンピュートインフラ構築のコミット | Anthropic 公式（後続の発表で参照） |
| 2026-04-06 | **Google・Broadcom** | 複数ギガワット級（2027年から稼働） | 次世代 TPU。大半を米国内に設置 | Anthropic 公式 |
| 2026-04-20 | **Amazon（AWS）** | 最大5GW。**10年で$100B超**の AWS コミット | Trainium2〜4。2026年末までに約1GW。Amazon は$5Bを出資し、将来さらに最大$20B | Anthropic 公式 |
| 2026-05-06 | **SpaceX（Colossus 1）** | 全容量。**300MW超**、NVIDIA GPU **22万基超** | xAI が運営する既存の Colossus 1 データセンターを借りる。契約額は公式非開示 | Anthropic 公式（金額は報道） |
| 2026-05 → 09-24 | **Akamai** | 5月 **$1.8B／7年** → 9月 **$11.6B／7年**（最大約$20B） | クラウド（CPU 中心）。Anthropic 向けにワラントを付与 | Akamai の開示（9月）／Bloomberg 報道（5月） |
| 2026-07-06 | **TeraWulf** | **20年**、**401MW**、約**$19B** | ケンタッキー州 Hawesville の Justified Data キャンパス | TeraWulf の 8-K |
| 2026-07-22 | **AMD** | **最大2GW**（MI450）。AMD が最大$5Bを出資 | Helios ラック。最初の1GWは2027年上半期から | AMD の IR |
| 2026-08-04 | **Volta** | 約**$10B／6年**、**133MW** | ノルウェー。Nvidia Vera Rubin | 報道（Bloomberg、TechCrunch） |
| 2026-08-10 | **Riot Platforms** | **20年**、**191MW**、約**$9.1B**（延長込みで最大約$16.1B） | テキサス州 Rockdale | Riot の開示（借り手の名は未記載）＋Bloomberg 報道 |
| 2026-08-26 | **Nscale** | 約**$45B／6年**、約**460MW** | ウェストバージニア州。Nvidia Vera Rubin | 報道（CNBC、TechCrunch、Bloomberg） |

> 日付は特記しない限り発表・報道日（PT／現地）です。このほか、Anthropic は **Microsoft と NVIDIA との戦略的パートナーシップ（Azure の$30B分の容量を含む）** を自社の発表で挙げていますが、本記事では日付と条件を確認できていません。
>
> **交渉段階（未成立）**: 報道によれば、Anthropic は **Stream Data Centers** と最大1GWの容量のリースについて初期段階の交渉をしており、少なくとも$40B規模の資本投資が必要とされます。最終的なリースやハードウェアの決定は公表されていません。

## 2. 契約の種類を分けて読む

| 種類 | 契約 | 借りているもの |
|:---|:---|:---|
| **チップ・クラウド（複数世代にまたがる大型契約）** | Google／Broadcom（TPU）、Amazon（Trainium）、AMD（Instinct） | チップとその運用。投資とセットの契約が多い（Amazon の出資、AMD の最大$5B） |
| **既存の AI 施設の全量借り上げ** | SpaceX（Colossus 1） | 稼働中の GPU 施設を丸ごと |
| **施設（箱と電力）のリース** | TeraWulf、Riot | 電力と建物。暗号資産マイニング施設の転用が中心 |
| **ネオクラウドによるコンピュートの貸与** | Volta、Nscale、Akamai | GPU（または CPU）の容量をサービスとして提供 |

**稼働時期**:

- **2026年内**: Amazon の Trainium 約1GW（年末まで）、SpaceX の Colossus 1（発表時点で月内）
- **2027年**: Google／Broadcom の TPU（2027年から）、AMD の最初の1GW（上半期から）、Riot の最初の96MW（2027年12月）、TeraWulf の初期容量（2027年後半）、Nscale（2027年後半）
- **2028年**: Riot の191MW全量（2028年6月まで）、TeraWulf の401MW全量（2028年初頭）

## 3. 数字の読み方

### 3-1. 契約額・投資額・電力容量は別物

- **契約総額**は、期間全体の支払い見込みで、1年あたりの支出ではありません。
- **AMD の「最大$5B」は Anthropic への出資**で、GPU の購入代金ではありません。AMD の公式発表は、出資の時期を「将来」とし、条件の詳細も開示していません。
- **Akamai の$11.6B** は7年間の契約額で、拡張が実現すれば最大約$20B。履行は Akamai の納入・サービス可用性の要件次第で、どちらの側も一定の条件で終了できます。
- **GW／MW** は電力容量で、搭載されるチップ数や計算性能とは直接の換算関係がありません。

### 3-2. 契約額を電力容量で割った試算（本記事の算出）

| 契約 | 契約額 | 期間 | 容量 | 1MW・年あたり |
|:---|:---:|:---:|:---:|:---:|
| TeraWulf | 約$19B | 20年 | 401MW | **約$237万** |
| Riot | 約$9.1B | 20年 | 191MW | **約$238万** |
| Volta | 約$10B | 6年 | 133MW | **約$1,250万** |
| Nscale | 約$45B | 6年 | 約460MW | **約$1,630万** |

- **施設リースの TeraWulf と Riot は、1MW・年あたりがほぼ同じ約$240万**です。電力と建物の対価という同じ性格の契約であることが、数字の上でも表れています。
- **Volta と Nscale は5〜7倍**です。GPU（Nvidia Vera Rubin）を含むコンピュートそのものの貸与で、金額に計算機の費用が入っているためと考えられます。
- **留意点**: 契約額を稼働年数で均等に割った単純計算です。立ち上げ期間の段階的な増加、延長オプション、報道ベースの金額・容量の誤差は反映されていません。Volta と Nscale は報道ベースの数字で、MW も媒体によって出典が異なります。

### 3-3. 取引先の名前が出ない案件が多い

Riot の開示は借り手を名指ししておらず、Anthropic だと特定したのは Bloomberg の報道です（Riot はコメントを控え、Anthropic は問い合わせに応じていません）。Volta も、報道が出るまでは「AIラボ」とだけ説明していました。Akamai の5月の契約も、当初は「米国のフロンティアモデル事業者」とだけ開示されていました。**契約額や相手先の確度は、情報源ごとに確認が必要**です。

## 4. 全体像から見えること（本記事の解釈）

以下は公表された事実から読める**本記事の解釈**で、公式の説明ではありません。

1. **電力と立地が制約になっている**: 暗号資産マイニング施設（TeraWulf、Riot、Volta の建設パートナー Bitdeer）の転用が目立つのは、**既に電力契約と建物がある立地を短期間で押さえられる**ためと読めます。
2. **特定ベンダーに依存しない構成**: Google の TPU、Amazon の Trainium、Nvidia の GPU（SpaceX、Volta、Nscale）、AMD の Instinct と、**チップの供給元を4系統に分散**しています。自社チップの設計チームの存在も公式に確認されています（詳細は [Anthropic のコンピュート契約と TPU](/mdTechKnowledge/blog/anthropic-tpu-compute-partnership/) の補遺4）。
3. **立ち上がりが2027年に集中**: 2026年内の増強は Trainium と Colossus 1が中心で、**契約の多くは2027年以降の需要に向けた先行確保**です。需要見通しが外れた場合の負担の大きさ（20年・6年といった長期の固定費）は、IPO に向けた財務の論点にもなります（[Anthropic IPO](/mdTechKnowledge/blog/anthropic-ipo-s1-filing/)）。
4. **出資と調達の同時進行**: Amazon（出資＋AWS コミット）、AMD（出資＋GPU 導入）、Akamai（ワラントの付与）は、**調達契約と資本関係がセット**になっている型です。

## 5. 個別の詳細は既存記事へ

| 契約 | 詳細 |
|:---|:---|
| Google／Broadcom TPU、Amazon、Akamai、TeraWulf、AMD、Volta、Riot、Nscale、Micron、カスタムシリコン | [Anthropic コンピュートインフラ & TPUパートナーシップ](/mdTechKnowledge/blog/anthropic-tpu-compute-partnership/) |
| SpaceX Colossus 1 | [Anthropic × SpaceX Colossus コンピュートディール](/mdTechKnowledge/blog/anthropic-spacex-colossus-compute/) |
| 資金調達、Series H、収益との関係 | [Anthropic 大型資本調達ラウンド](/mdTechKnowledge/blog/anthropic-funding-2026/) |

> 注: Akamai との契約は、2026年9月24日に$1.8B から$11.6Bへ拡大されています。上記の既存記事の一部は5月時点の$1.8Bの記述が中心なので、最新の条件は本記事と Akamai の開示（出典欄）を参照してください。

## 出典

- [Anthropic expands Google and Broadcom compute deal（Anthropic 公式、2026-04-06）](https://www.anthropic.com/news/google-broadcom-partnership-compute)
- [Anthropic and Amazon expand compute collaboration（Anthropic 公式、2026-04-20）](https://www.anthropic.com/news/anthropic-amazon-compute)
- [Higher usage limits and a SpaceX compute deal（Anthropic 公式、2026-05-06）](https://anthropic.com/news/higher-limits-spacex)
- [AMD and Anthropic announce strategic partnership（AMD IR、2026-07-22）](https://ir.amd.com/news-events/press-releases/detail/1292/amd-and-anthropic-announce-strategic-partnership-to-deploy-up-to-2-gigawatts-of-amd-instinct-mi450-series-gpus)
- [Riot Platforms 2026年第2四半期決算（SEC Exhibit 99.1、2026-08-10）](https://www.sec.gov/Archives/edgar/data/1167419/000110465926093406/riot-20260810xex99d1.htm)
- [TeraWulf 8-K（SEC Exhibit 99.1、2026-07-06）](https://www.sec.gov/Archives/edgar/data/0001083301/000110465926080583/tm2619468d1_ex99-1.htm)
- [TechCrunch: Anthropic to pay Akamai $11.6 billion over seven years（2026-09-25、二次）](https://techcrunch.com/2026/09/25/anthropic-to-pay-akamai-11-6-billion-over-seven-years-in-cloud-deal/)
- [TechCrunch: Anthropic signs $10 billion deal with AI cloud startup Volta（2026-08-04、二次）](https://techcrunch.com/2026/08/04/anthropic-signs-10-billion-deal-with-ai-cloud-startup-volta/)
- [TechCrunch: Anthropic continues compute-gobbling streak in $45 billion deal with Nscale（2026-08-26、二次）](https://techcrunch.com/2026/08/26/anthropic-continues-compute-gobbling-streak-in-45-billion-deal-with-nscale/) ／ [CNBC: Anthropic and Nscale strike $45 billion cloud deal, sources say](https://www.cnbc.com/2026/08/26/anthropic-and-nscale-strike-45-billion-cloud-deal-sources-say.html)
