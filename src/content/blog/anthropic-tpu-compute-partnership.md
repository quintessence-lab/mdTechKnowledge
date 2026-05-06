---
title: "Anthropic コンピュートインフラ & TPUパートナーシップ — Google・BroadcomとのマルチギガワットTPU契約（2027年稼働）"
date: 2026-04-29
updatedDate: 2026-05-07
category: "一般リサーチ"
tags: ["Anthropic", "Google", "Broadcom", "TPU", "AIインフラ", "コンピュート", "パートナーシップ", "SpaceX", "xAI", "Colossus", "GPU"]
excerpt: "2026年4月6日発表のGoogle・BroadcomとのマルチギガワットTPU契約（2027年稼働）に加え、2026年5月のSpaceX xAI Colossus 1データセンター全容量契約（300MW超・GPU22万台超）を収録。Anthropicのマルチクラウド・マルチベンダーインフラ戦略を整理。"
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
9. [情報ソース一覧](#第9章-情報ソース一覧)

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
| 4月20日 | Amazon追加$5B、10年で$100B AWS支出 | 資本＋AWS消費 |
| 4月24日 | Google最大$40B投資（5GW TPU含む） | 資本＋GCP消費 |

つまり**4月6日のTPU契約が「インフラ層の確保」を先行宣言し、20日・24日の資本ラウンドが「その費用を払える資金体力」を裏打ちする**構造だ。

### マルチクラウド4軸の最新像（2026年5月時点）

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
└─────────────────────────────────────────────────────┘
```

2026年5月の**SpaceX xAI Colossus 1契約**（第8章）を加え、合計**10GW超**のコンピュートポートフォリオを形成。4軸の意義は(1)チップ供給・アーキテクチャリスク分散、(2)ワークロード最適配置、(3)AWS・GCPからの戦略投資受領（クラウド消費契約とセット）、(4)規制・独禁リスク回避、に加え⑤ライバル（xAI）からの緊急キャパシティ調達というユニークな側面も持つ。

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

### 契約の概要

2026年5月6日（PT）、Anthropicは**SpaceX傘下のxAIが運営するColossus 1データセンター（Memphis, TN）の全計算能力**を確保する契約を発表した。

| 項目 | 内容 |
|---|---|
| 発表日 | 2026年5月6日（PT）/ 2026年5月7日（JST） |
| 容量 | 300MW超 |
| GPU規模 | 22万台超（xAI総GPU群 約50万台の半数弱） |
| GPU種別 | NVIDIA H100 / H200 / GB200（次世代含む） |
| 拠点 | Colossus 1、Memphis, Tennessee |
| 即時性 | 契約翌月内にアクセス開始 |
| 追加の関心 | 宇宙ベース（軌道上）AIコンピュートの複数GW化 |

### ライバル間取引の構造

Anthropicとxは生成AI市場における直接競合だが、今回の取引では**xAIがColossus 1のキャパシティをAnthropicに貸し出す**形をとる。xAI側にとっては、Grokの学習・推論ピーク外の余剰GPUを収益化できるメリットがある。Seekingalphaのアナリストは「AI業界全体のGPU不足が競合間の協力を強制する構造変化の表れ」と指摘する。

### ユーザーへの即効果

この追加コンピュートは、契約発表と同日（2026年5月6日）から以下の制限緩和に反映された:

| 変更項目 | 変更内容 |
|---|---|
| Claude Code 5時間レート制限 | Pro / Max / Team / Enterprise で**倍増** |
| Claude Code ピーク時制限 | Pro / Max で**廃止** |
| Claude Opus API レート制限 | 大幅引き上げ |

### 宇宙ベースコンピュートへの布石

発表では、AnthropicがSpaceXと協力して**軌道上（宇宙空間）で複数GWのAIコンピュート容量**を構築することへの関心を表明したと明記されている。具体的なタイムラインや技術仕様は未公表だが、衛星ベースのAI推論インフラに向けた長期的な方向性を示唆する動きとして注目される。

### インフラポートフォリオにおける位置づけ

| ディール | 発表時期 | 規模 | 性質 |
|---|---|---|---|
| AWS（Project Rainier） | 2023〜2025年 | Trainium 5GW | 長期インフラ |
| Google/Broadcom TPU | 2026年4月 | 3.5GW（2027〜） | 長期インフラ |
| Azure | — | $30B相当 | クラウド消費 |
| Fluidstack | — | $50B相当 | クラウド消費 |
| **SpaceX xAI Colossus 1** | **2026年5月** | **300MW超・22万GPU** | **即時GPU調達** |

Colossus 1契約は「長期コミット型」の既存ディールとは異なり、**需要急増に対応した即時キャパシティ補強**として機能する。

---

## 第9章: 情報ソース一覧

### 一次情報

- [Anthropic公式: Higher usage limits for Claude and a compute deal with SpaceX（2026/5/6）](https://www.anthropic.com/news/higher-limits-spacex)
- [xAI公式: New Compute Partnership with Anthropic（2026/5/6）](https://x.ai/news/anthropic-compute-partnership)
- [Anthropic公式: Anthropic expands partnership with Google and Broadcom for compute（2026/4/6）](https://www.anthropic.com/news/google-broadcom-partnership-compute)
- [Google Cloud Press: Anthropic Expands Use of Google Cloud and TPUs（2026/4/6）](https://www.googlecloudpresscorner.com/2026-04-06-Anthropic-Expands-Use-of-Google-Cloud-and-TPUs)
- [Broadcom 8-K SEC開示（2026/4/7）](https://www.stocktitan.net/sec-filings/AVGO/8-k-broadcom-inc-reports-material-event-35aab0650b17.html)

### 主要報道（SpaceX Colossus 1 関連）

- [CNBC: Anthropic, SpaceX announce compute deal that includes space development（2026/5/6）](https://www.cnbc.com/2026/05/06/anthropic-spacex-data-center-capacity.html)
- [Data Center Dynamics: Anthropic to use all of SpaceX-xAI's Colossus 1 data center compute（2026/5/6）](https://www.datacenterdynamics.com/en/news/anthropic-to-use-all-of-spacex-xais-colossus-1-data-center-compute/)
- [Axios: Anthropic will get compute capacity from Elon Musk's SpaceX（2026/5/6）](https://www.axios.com/2026/05/06/anthropic-spacex-elon-musk-compute)
- [9to5Google: Claude Code is getting higher usage limits, doubled for most users（2026/5/6）](https://9to5google.com/2026/05/06/claude-code-is-getting-higher-usage-limits-doubled-for-most-users/)

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
