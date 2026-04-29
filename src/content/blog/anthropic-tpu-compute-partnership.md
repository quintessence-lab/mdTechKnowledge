---
title: "Anthropic コンピュートインフラ & TPUパートナーシップ — Google・BroadcomとのマルチギガワットTPU契約（2027年稼働）"
date: 2026-04-29
updatedDate: 2026-04-29
category: "一般リサーチ"
tags: ["Anthropic", "Google", "Broadcom", "TPU", "AIインフラ", "コンピュート", "パートナーシップ"]
excerpt: "2026年4月6日にAnthropicが発表したGoogle・BroadcomとのマルチギガワットTPUインフラ契約（2027年稼働予定）を解説。フロンティアモデルのトレーニング・デプロイスケール戦略、対OpenAI・Google DeepMind競合構図、Amazon $5B/$100Bディールとのマルチクラウド戦略を整理。"
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
8. [情報ソース一覧](#第8章-情報ソース一覧)

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

### マルチクラウド3軸の最新像

```
┌─────────────────────────────────────────────────┐
│  Anthropic Claude スケーリング基盤（2026〜2031）  │
├─────────────────────────────────────────────────┤
│  ① AWS    : Trainium 5GW（Project Rainier中心）  │
│  ② GCP    : TPU 5GW（うち3.5GWは2027〜稼働）    │
│             Broadcom実装ASIC、Ironwood世代       │
│  ③ NVIDIA : GPU（CoreWeave等経由、汎用ワーク）    │
└─────────────────────────────────────────────────┘
```

合計**10GW超**を2027〜2031年スパンで確保。3軸の意義は(1)チップ供給リスク分散、(2)ワークロード最適配置、(3)AWS・GCPからの戦略投資受領（クラウド消費契約とセット）、(4)規制・独禁リスク回避。

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

## 第8章: 情報ソース一覧

### 一次情報

- [Anthropic公式: Anthropic expands partnership with Google and Broadcom for compute（2026/4/6）](https://www.anthropic.com/news/google-broadcom-partnership-compute)
- [Google Cloud Press: Anthropic Expands Use of Google Cloud and TPUs（2026/4/6）](https://www.googlecloudpresscorner.com/2026-04-06-Anthropic-Expands-Use-of-Google-Cloud-and-TPUs)
- [Broadcom 8-K SEC開示（2026/4/7）](https://www.stocktitan.net/sec-filings/AVGO/8-k-broadcom-inc-reports-material-event-35aab0650b17.html)

### 主要報道

- [TechCrunch: Anthropic ups compute deal with Google and Broadcom（2026/4/7）](https://techcrunch.com/2026/04/07/anthropic-compute-deal-google-broadcom-tpus/)
- [CNBC: Broadcom agrees to expanded chip deals with Google, Anthropic（2026/4/6）](https://www.cnbc.com/2026/04/06/broadcom-agrees-to-expanded-chip-deals-with-google-anthropic.html)
- [Tom's Hardware: Broadcom to supply Anthropic with 3.5GW of Google TPU capacity from 2027](https://www.tomshardware.com/tech-industry/broadcom-expands-anthropic-deal-to-3-5gw-of-google-tpu-capacity-from-2027)
- [HPCwire: Anthropic Signs Google, Broadcom Deal to Add Multi-Gigawatt TPU Capacity](https://www.hpcwire.com/off-the-wire/anthropic-signs-google-broadcom-deal-to-add-multi-gigawatt-tpu-capacity/)
- [TechWire Asia: Custom AI chips, 3.5 gigawatts, and a quiet SEC clause](https://techwireasia.com/2026/04/broadcom-custom-ai-chips-google-anthropic-deal/)

### 関連既存記事

- [Anthropic 大型資本調達ラウンド — Amazon $5B/$100B AWSコミット・Google 最大$40B 投資の戦略的意義](/blog/anthropic-funding-2026/)
- [Claude Opus 4.7 完全ガイド](/blog/claude-opus-4-7-guide/)
- [Claude Managed Agents 簡易ガイド](/blog/claude-managed-agents-guide/)
