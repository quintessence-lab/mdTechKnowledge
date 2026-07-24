---
title: "Anthropic × SpaceX Colossus コンピュートディール — 競合xAIから全容量を借りる『月$1.25B』契約と宇宙コンピュート構想"
date: 2026-05-31
updatedDate: 2026-07-24
category: "一般リサーチ"
tags: ["Anthropic", "SpaceX", "xAI", "Colossus", "GPU", "AIインフラ", "コンピュート", "NVIDIA", "宇宙コンピュート"]
excerpt: "2026年5月、Anthropicが競合xAIの運営するColossus 1データセンター（Memphis・GPU22万台超・300MW超）の全容量を借りる契約を発表。月$1.25B・年$15B・xAIへ$40B超、2029年まで。Claude Codeのレート制限緩和に即反映され、宇宙空間でのGW級コンピュート構想も表明。ライバル間取引の構造とTPU契約との位置づけを整理する。"
draft: false
---

**テーマ**: 一般リサーチ — AIインフラ／コンピュート確保戦略

---

## はじめに

2026年5月、AI業界で前例の少ない契約が発表されました。**Anthropic が、生成AIの直接の競合である xAI（イーロン・マスク率いる）の運営するデータセンターの全計算能力を借りる**——という取引です。対象は xAI の親会社圏 SpaceX 傘下で運営される **Colossus 1**（Memphis, Tennessee）。NVIDIA GPU 22万台超・300MW超という巨大容量を、Anthropic が丸ごと確保しました。

しかも後日明らかになった財務規模は、**月額 $1.25B（約1,875億円）、年間 $15B、xAI 側に総額 $40B 超の収益**という桁外れのもの。ライバル同士が手を組まざるを得ないほど、AI業界のコンピュート（計算資源）争奪は激化しています。

本記事は、(1) この契約の中身、(2) なぜ競合間で取引が成立したのか、(3) Claude ユーザーへの即効果、(4) 宇宙コンピュート構想、(5) Anthropic の他のインフラ契約（とくに Google・Broadcom との TPU 契約）との位置づけ、を整理します。

> 本記事は2026年5月時点の公開情報・報道に基づきます。Anthropic のマルチクラウド・インフラ戦略の全体像は関連記事「[Anthropic コンピュートインフラ & TPUパートナーシップ](/mdTechKnowledge/blog/anthropic-tpu-compute-partnership/)」で扱っており、本記事はそのうち SpaceX 契約に焦点を絞った深掘りです。

---

## 1. 契約の概要

2026年5月6日（PT）/ 5月7日（JST）、Anthropic は SpaceX 傘下の xAI が運営する **Colossus 1 データセンターの全計算能力**を確保する契約を発表しました。

| 項目 | 内容 |
|---|---|
| 発表日 | 2026年5月6日（PT）/ 2026年5月7日（JST） |
| 容量 | 300MW超 |
| GPU規模 | 22万台超（xAI総GPU群 約50万台の半数弱） |
| GPU種別 | NVIDIA H100 / H200 / GB200（次世代含む） |
| 拠点 | Colossus 1、Memphis, Tennessee |
| 即時性 | 契約翌月内にアクセス開始 |

特筆すべきは「**特定データセンターの全容量を借り切る**」という形態です。クラウドの一部リソースを従量利用するのではなく、1つの巨大データセンターのキャパシティを丸ごと長期確保するという、AI業界でも前例の少ないモデルです。

---

## 2. 財務詳細（2026-05-20報道で判明）

2026年5月20日（PT）/ 21日（JST）、Axios・TechCrunch が報じた財務詳細で、契約規模の全容が明らかになりました。

| 項目 | 内容 |
|---|---|
| 月額支払 | **$1.25B / 月** |
| 年間総額 | **$15B / 年** |
| 契約期間 | **2029年5月まで（約3年）** |
| xAI側の想定収益 | **$40B 超** |
| 解約条件 | いずれの当事者も **90日通知で解約可能** |
| ramp-up期間 | 契約初月（5月）と翌月（6月）は割引レート |
| Colossus 2 拡張 | 確定。2026年6月中に **NVIDIA GB200 容量を順次追加** |

xAI の年間総収益が約 $18B とされるなか、**Anthropic 1社で年間 $15B（xAI収益の過半規模）**に達する超大型契約です。Colossus 2 への拡張により、GB200 ベースの最新世代 GPU へのアクセスも段階的に追加されます。

---

## 3. なぜ競合間で取引が成立したのか

Anthropic と xAI は生成AI市場の直接競合です。それでもこの取引が成立したのは、双方に明確なメリットがあるからです。

| 当事者 | メリット |
|---|---|
| **Anthropic** | 逼迫するコンピュートを即時・大規模に確保。TPU/Trainium の長期契約が稼働する2027年までの「つなぎ」を埋められる |
| **xAI** | Grok の学習・推論ピーク外の余剰GPUを収益化。年$15B超という巨大な安定収益を得られる |

アナリストは「**AI業界全体のGPU不足が、競合間の協力を強制する構造変化の表れ**」と指摘しています。技術で競いながらインフラでは協力する——コンピュートが希少資源化した時代を象徴する取引です。

---

## 4. Claudeユーザーへの即効果

この契約のユニークな点は、発表と**同日（2026年5月6日）からユーザー向けの制限緩和に直結**したことです。

| 変更項目 | 変更内容 |
|---|---|
| Claude Code 5時間レート制限 | Pro / Max / Team / Enterprise で **倍増** |
| Claude Code ピーク時制限 | Pro / Max で **廃止** |
| Claude Opus API レート制限 | 大幅引き上げ |

「コンピュート確保 → その場でレート制限緩和」という即効性は、調達した容量が即座に推論キャパシティとして使えるGPUベース契約ならではです。Claude Code を日常的に使うユーザーにとって、このインフラ契約は抽象的なニュースではなく、**実際の使用上限の改善**として体感できるものでした。

---

## 5. 宇宙コンピュート構想への布石

発表では、Anthropic が SpaceX と協力して **軌道上（宇宙空間）で複数GW（ギガワット）規模のAIコンピュート容量**を構築することへの関心も表明されました。

具体的なタイムラインや技術仕様は未公表ですが、地上のデータセンターが直面する電力・冷却・用地の制約を、宇宙空間（太陽光発電＋宇宙空間の冷却環境）で突破するという長期的方向性を示唆します。SpaceX のロケット打ち上げ能力（Starship）と組み合わせることで、衛星ベースのAI推論インフラという構想が現実味を帯びてきます。現時点では構想段階ですが、コンピュート争奪が地球の物理的制約に達しつつあることの裏返しとも言えます。

---

## 6. TPU契約との位置づけ — マルチクラウド5軸の一角

このSpaceX契約は、Anthropic のマルチクラウド・マルチベンダー戦略の一部です。とくに **Google・Broadcom との TPU 契約**（2026年4月発表、3.5GW、2027年稼働）とは性格が対照的で、両者を併せて見ると戦略の全体像が見えてきます。

| 契約 | 発表 | 規模 | 性格 | 稼働 |
|---|---|---|---|---|
| AWS（Project Rainier） | 2023〜2025 | Trainium 5GW | 長期インフラ | 稼働中 |
| **Google / Broadcom TPU** | 2026年4月 | 3.5GW | 長期インフラ（カスタムASIC） | **2027年〜** |
| **SpaceX xAI Colossus 1+2** | 2026年5月 | 300MW超・22万GPU | **即時GPU調達** | **即時** |
| Akamai Technologies | 2026年5月 | $1.8B・7年 | クラウドコンピュート | — |

この対比が示すのは、Anthropic のコンピュート戦略が **「時間軸の二段構え」**になっているということです。

- **長期（2027年〜）**: Google/Broadcom の TPU や AWS Trainium といった、カスタムシリコンによる安価・大規模・安定の本命レーン
- **即時（2026年〜）**: SpaceX Colossus の GPU を競合から借りてでも、今すぐ必要な推論キャパシティを埋める「つなぎ」

TPU/Trainium の本命容量が立ち上がる2027年までの間、需要爆発（Anthropicは単一四半期で前年同期比80倍成長とも報じられる）に追いつくための緊急調達が、このSpaceX契約の本質です。**「ライバルからの全容量賃借」というアクロバティックな手段**を取ってでも、コンピュートを確保しなければならないほど、AI需要の伸びが急峻だということでもあります。

> Google・Broadcom TPU 契約の詳細（3.5GW・2027年稼働・2031年まで、Broadcom の役割、$200B規模の Google Cloud 長期コミット、競合比較など）は、関連記事「[Anthropic コンピュートインフラ & TPUパートナーシップ](/mdTechKnowledge/blog/anthropic-tpu-compute-partnership/)」で詳しく扱っています。

## 7. 【2026-07-17追記】次はMeta？ — $10B・2年のコンピュートリース交渉（報道ベース）

SpaceX（競合xAI経由）に続き、**Anthropic は Meta とも大型のコンピュートリース契約を交渉中**と報じられています。**現時点ではまだ初期段階の交渉であり、正式契約ではありません**。

- **規模**: 最大 **$10B・2年間**（月次分割払い）。SpaceX 契約（3年で約$45B）と並ぶ大型案件になり得ます。
- **段階**: 「early talks（初期交渉）」の段階で、**両社とも早期に契約を打ち切れる**条件が想定されているとされます。
- **異例の構図**: Meta は自社モデル「Llama」シリーズで Claude と直接競合する立場でありながら、**同時に Anthropic のインフラ供給者になる**という、SpaceX（xAI）契約と同様の「競合が計算資源の貸し手になる」構図が繰り返されています。
- **Meta側の思惑**: Mark Zuckerberg CEO は2026年5月、自社の巨額AIインフラ投資を他社にも売って収益化する「クラウド事業への参入」を検討していると発言しており、今回の交渉はその一環と位置づけられます。

もし成立すれば、Anthropicのコンピュート調達は **AWS・GCP・NVIDIA-CoreWeave・AMD・SpaceX(xAI)・Meta** という、競合企業まで巻き込んだ多面的な調達網に拡大することになります。現時点では交渉段階のため、続報が出次第、本記事または関連記事で更新します。

出典: [CNBC: Meta, Anthropic in talks for potential $10 billion compute lease deal](https://finance.yahoo.com/technology/ai/articles/meta-talks-10-billion-anthropic-162927340.html) ／ [MLQ: Anthropic in Early Talks to Lease $10B in Compute From Meta](https://mlq.ai/news/anthropic-in-early-talks-to-lease-10b-in-compute-from-meta-over-two-years/)

---

## まとめ

| 観点 | ポイント |
|---|---|
| **何の契約か** | 競合xAIの Colossus 1（Memphis・GPU22万台超・300MW超）の全容量を借りる |
| **規模** | 月$1.25B・年$15B・xAIへ総額$40B超、2029年5月まで・90日解約可 |
| **なぜ競合と** | GPU不足が競合間協力を強制。xAIは余剰GPUを収益化、Anthropicは即時調達 |
| **ユーザー効果** | 発表同日にClaude Codeのレート制限を倍増・ピーク制限廃止 |
| **宇宙構想** | SpaceXと軌道上GW級コンピュートへの関心を表明 |
| **戦略的位置** | TPU/Trainium（長期・2027年〜）に対する「即時のつなぎ」レーン |

このSpaceX Colossus契約は、単独でも前例の少ない取引ですが、**Anthropic のインフラ戦略全体のなかで読むと意味が際立ちます**。「2027年に立ち上がるTPU/Trainiumの本命容量」と「今すぐ必要なGPUの緊急調達」を二段構えで確保し、競合からの賃借も辞さない——コンピュートが事業の生命線となったAI時代の、リアルな調達戦略がここに表れています。

---

## 参考資料

- [Anthropic公式: Higher usage limits for Claude and a compute deal with SpaceX（2026/5/6）](https://www.anthropic.com/news/higher-limits-spacex)
- [xAI公式: New Compute Partnership with Anthropic（2026/5/6）](https://x.ai/news/anthropic-compute-partnership)
- [CNBC: Anthropic, SpaceX announce compute deal that includes space development（2026/5/6）](https://www.cnbc.com/2026/05/06/anthropic-spacex-data-center-capacity.html)
- [Data Center Dynamics: Anthropic to use all of SpaceX-xAI's Colossus 1 data center compute（2026/5/6）](https://www.datacenterdynamics.com/en/news/anthropic-to-use-all-of-spacex-xais-colossus-1-data-center-compute/)
- [Axios: Anthropic to pay xAI $1.25B per month for compute（2026/5/20）](https://www.axios.com/2026/05/20/anthropic-spacex-compute)
- [TechCrunch: Anthropic will pay xAI $1.25 billion per month for compute（2026/5/20）](https://techcrunch.com/2026/05/20/anthropic-will-pay-xai-1-25-billion-per-month-for-compute/)
- [9to5Google: Claude Code is getting higher usage limits, doubled for most users（2026/5/6）](https://9to5google.com/2026/05/06/claude-code-is-getting-higher-usage-limits-doubled-for-most-users/)
- 関連記事: [Anthropic コンピュートインフラ & TPUパートナーシップ — Google・BroadcomとのマルチギガワットTPU契約](/mdTechKnowledge/blog/anthropic-tpu-compute-partnership/)
- 関連記事: [Anthropic 大型資本調達ラウンド](/mdTechKnowledge/blog/anthropic-funding-2026/)

---

*本記事は2026年5月時点の公開情報・報道に基づく一般リサーチです。数値・契約条件は今後変更される可能性があります。最新情報は各社の公式発表でご確認ください。*
