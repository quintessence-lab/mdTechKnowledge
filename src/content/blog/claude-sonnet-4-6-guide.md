---
title: "Claude Sonnet 4.6 完全ガイド — Free/Pro/Code/Cowork デフォルトモデルの実力"
date: 2026-05-02
updatedDate: 2026-05-02
category: "Claude技術解説"
tags: ["Claude", "Sonnet 4.6", "Anthropic", "AIモデル", "コンピュータユース", "Adaptive Thinking"]
excerpt: "2026年2月17日リリースのClaude Sonnet 4.6は、Free/Pro/Claude Code/Coworkすべての新規デフォルトモデル。1Mトークンコンテキスト・SWE-bench 79.6%・コンピュータユース 94%・OSWorld 72.5% という性能で、$3/$15のSonnet価格帯を維持しながらOpus 4.7に匹敵する場面も多い。スペック・機能・Opusとの使い分けを総点検する。"
draft: false
---

## 1. リリース概要・位置づけ

Anthropic は **2026年2月17日**、Sonnet シリーズの新世代として **Claude Sonnet 4.6**（API モデル ID: `claude-sonnet-4-6`）をリリースしました。同モデルは即日、**Claude.ai の Free / Pro プラン、Claude Code、Claude Cowork のデフォルトモデル**として展開されており、「日常的に最も多く触れる Claude」がそのまま 4.6 になった形です。

| 項目 | 値 |
|------|-----|
| リリース日 | 2026-02-17 |
| モデル ID | `claude-sonnet-4-6` |
| 入力料金 | $3 / 1M トークン |
| 出力料金 | $15 / 1M トークン |
| コンテキストウィンドウ | **1M トークン**（パブリックベータ） |
| デフォルト先 | Free / Pro / Claude Code / Cowork |
| ベンチマーク | SWE-bench Verified 79.6% / OSWorld 72.5% / コンピュータユース精度 94% |

価格は前世代の **Sonnet 4.5 から据え置き**で、$3 / $15 per MTok のままです。これは「Sonnet 価格帯のままで Opus に近い場面が増えた」という意味で、コストパフォーマンスの面で大きな転換点になりました。リリース直後の社内 A/B テストでは **「ユーザーが Sonnet 4.6 を前世代より約 70% の頻度で選好」** という結果が公表されており、Claude Code テストでは **Opus 4.5 との比較でも 59%** で 4.6 が選好されたとされています。

```text
Sonnet 系列の流れ
─────────────────────────────────────────────
4.0 → 4.1 → 4.2 → 4.3 → 4.4 → 4.5 → 4.6（現行）
                                       │
                                       └─ Free/Pro/Code/Cowork デフォルト化
```

---

## 2. スペック詳細

### 2.1 コンテキストウィンドウ

Sonnet 4.6 のコンテキストウィンドウは **1M トークン（パブリックベータ）** です。Anthropic の公式情報によれば、**コードベース全体・長文契約書・数十件の研究論文を単一リクエストで処理できる**規模に到達しています。これは Opus 4.7 と同じ 1M クラスで、エージェントが長時間状態を保ちながら作業するユースケースでは特に効きます。

| モデル | コンテキストウィンドウ | 標準提供 |
|--------|---------------------|---------|
| Sonnet 4.5 | 200K（標準）／ 1M（一部ベータ） | 一部 |
| **Sonnet 4.6** | **1M（パブリックベータ）** | はい |
| Opus 4.7 | 1M | はい |

### 2.2 価格

| 区分 | 入力 | 出力 |
|------|------|------|
| 標準（〜200K） | $3 / MTok | $15 / MTok |
| 1M ベータ枠 | プレミアムなし（標準価格を基本踏襲） | プレミアムなし |

Anthropic は Sonnet 4.5 と同価格を堅持しており、**「Sonnet 価格で 1M を提供」**という Opus 4.7 と同じ路線を取りました。

### 2.3 ベンチマーク

| ベンチマーク | Sonnet 4.6 | 補足 |
|------------|-----------|------|
| SWE-bench Verified | **79.6%** | 上位陣に近づく水準 |
| OSWorld | **72.5%** | コンピュータユース系での飛躍 |
| コンピュータユース精度 | **94%** | OS 操作タスクの成功率 |
| Vending-Bench Arena | Sonnet 4.5 を上回る | ビジネス判断系 |

特筆すべきは **OSWorld 72.5%** と **コンピュータユース精度 94%** で、これは「実際にデスクトップ画面を見て操作する」タスクで圧倒的に強くなっていることを示しています。Anthropic 自身も「ほぼすべての組織が API のような最新インターフェイスなしで構築された専門システムを保有している」と指摘しており、これらのレガシーシステムを操作するエージェントの実用域に乗ってきたモデルが Sonnet 4.6 です。

---

## 3. 主要機能

### 3.1 Adaptive Thinking

Sonnet 4.6 は **Adaptive Thinking**（および従来型の Extended Thinking）をサポートします。Adaptive Thinking はクエリの難易度に応じて**思考量をモデル自身が動的に調整**する仕組みで、簡単な質問では即答、難しい質問では深く考えるという挙動になります。

```python
# Adaptive Thinking の有効化（概念例）
response = client.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=8192,
    thinking={"type": "adaptive"},
    messages=[{"role": "user", "content": "..."}],
)
```

Anthropic 内部評価では Adaptive のほうが固定 budget の Extended Thinking を上回るケースが増えており、Opus 4.7 ではすでに Adaptive のみに集約されていますが、Sonnet 4.6 は両方をサポートする過渡期のポジションです。

### 3.2 Context Compaction（ベータ）

長時間のエージェント実行で課題になる「コンテキスト溢れ」を緩和するため、**Context Compaction** が導入されています。古いやり取りを自動的に要約することで、1M トークンの窓を消化し切る前に**作業継続性を保つ**機能です。

```text
[初期]                      [長時間後]
─────────                  ────────────
直近の指示                 直近の指示
ツール結果                 ツール結果
ツール結果        ──→     [要約: 過去のツール結果群]
ツール結果                 ツール結果
...                        ...
（窓が大きくても消化が早い） （古い情報は要約に圧縮）
```

ベータ機能のため挙動は今後変わる可能性がありますが、長尺エージェント運用では**「気づいたら詰まっていた」という事故**が大幅に減ります。

### 3.3 コンピュータユース

Sonnet 4.6 のコンピュータユースは **OSWorld 72.5% / 操作精度 94%** という水準にあり、デスクトップ画面のスクリーンショットを見ながらマウス・キーボード操作を行うタイプのエージェントが、**実用域に乗る**領域に来ました。

OSWorld は 16 ヶ月にわたる継続改善が示されているベンチマークで、**Sonnet 4.5 → 4.6 の伸びはこの中でも目立った段階**です。レガシーシステム操作・社内 GUI 業務の自動化など、API 化されていない世界の自動化ニーズに直接刺さります。

### 3.4 ツール強化

- **Web 検索 / 取得**: 動的フィルタリングを通じた結果処理を自動実行
- **コード実行 / メモリ / プログラマティックツール呼び出し**: 一般利用可能（GA）

エージェント側で「検索 → 取捨選択 → 取得」を一気通貫で行えるようになり、外部から情報を取り込んでくるユースケースが扱いやすくなりました。

---

## 4. ベンチマーク詳細

### 4.1 SWE-bench Verified 79.6%

ソフトウェアエンジニアリングタスク群（Verified）で **79.6%** という成績は、**実用的な「PR を書ける AI」ライン**として申し分ない水準です。Opus 4.7 の 87.6% には及ばないものの、Sonnet の価格帯（$3 / $15）で出すスコアとしては破格です。

| モデル | SWE-bench Verified |
|--------|-------------------|
| Sonnet 4.5 | 70%台前半（参考値） |
| **Sonnet 4.6** | **79.6%** |
| Opus 4.7 | 87.6% |

### 4.2 OSWorld 72.5%

OSWorld はデスクトップ環境でのタスク完遂率を測るベンチマークです。72.5% は **「人間の補助なしで OS 操作タスクの 7 割超を片付けられる」** ということを意味し、本番運用に乗せる現実味が出てきた水準です。

### 4.3 Vending-Bench Arena

Vending-Bench Arena は仮想自販機ビジネスを通じて長期意思決定能力を測るベンチマークで、**Sonnet 4.6 は Sonnet 4.5 を上回る成績**を記録しています。長期計画・コスト管理・需要予測といった「ビジネス的判断」での改善を示唆します。

---

## 5. effort コントロール

Claude Code 内部では Sonnet 4.6 に対しても **effort パラメータ**が設定可能で、推論の深さを切り替えられます。

```text
standard  →  high  →  xhigh  →  max
（軽量・高速）          （重い・高品質）
```

実用上の使い分け目安：

| 用途 | 推奨 effort |
|------|------------|
| チャット・要約・短い変換 | standard |
| 通常のコーディング・調査 | high |
| 難しいデバッグ・大規模リファクタ | xhigh |
| 評価検証・難問挑戦 | max |

`/effort` コマンドで対話的に切り替えられ、v2.1.111 以降はインタラクティブスライダー UI も追加されています。Sonnet 4.6 で `xhigh` を選ぶと、**Opus 4.7 の `high` と肉薄する場面**が珍しくなく、コスト最適化の選択肢として強力です。

---

## 6. 利用可能プラットフォーム

Sonnet 4.6 は主要クラウドプラットフォームすべてに展開されています。

| プラットフォーム | 提供状況 |
|---------------|---------|
| Claude API（Anthropic 直接） | 提供 |
| Amazon Bedrock | 提供 |
| Google Cloud Vertex AI | 提供 |
| **Microsoft Foundry** | **提供** |
| GitHub Copilot 経由 | 提供（Copilot のモデル選択肢として） |
| Claude Code | デフォルトモデル |
| Claude Cowork | デフォルトモデル |

Microsoft Foundry 対応は、エンタープライズ Azure 顧客にとって意味が大きく、**Microsoft 寄りのスタックでも Anthropic モデルが第一候補に乗る**状況になりました。Bedrock / Vertex AI / Foundry の三クラウド対応により、ガバナンス制約のあるエンタープライズでも採用しやすくなっています。

---

## 7. Opus 4.7 との使い分け

Sonnet 4.6 と Opus 4.7 はどちらも 1M コンテキストを持つため、**「いつどちらを使うか」**が運用上の最重要論点になります。

### 7.1 早見表

| 観点 | Sonnet 4.6 | Opus 4.7 |
|------|-----------|---------|
| 入力料金 | $3 / MTok | $5 / MTok |
| 出力料金 | $15 / MTok | $25 / MTok |
| SWE-bench Verified | 79.6% | 87.6% |
| OSWorld | 72.5% | 約同等〜上 |
| 1M コンテキスト | パブリックベータ | 標準 |
| Adaptive Thinking | 対応 | 対応（唯一の思考モード） |
| Extended Thinking | 対応 | 廃止 |
| 高解像度画像（3.75MP） | 非対応 | 対応 |
| effort | standard / high / xhigh / max | 同左 |
| 想定スイートスポット | 量・速度・コスト | 難易度・品質 |

### 7.2 ユースケース別推奨

- **日常コーディング / レビュー / 整形 / リファクタ**: **Sonnet 4.6（high または xhigh）**
- **多数の PR・チケットを高速に捌くワークフロー**: **Sonnet 4.6**
- **大規模リファクタの設計・難バグの根本原因解析**: **Opus 4.7（xhigh / max）**
- **画像解析・スクリーンショット精読・座標精度が必要な場面**: **Opus 4.7**（高解像度画像対応）
- **長時間エージェントの中身**: 速度・コスト最適なら Sonnet 4.6、品質最大化なら Opus 4.7
- **コンピュータユース系（GUI 操作）**: 量を捌くなら Sonnet 4.6、難局面は Opus 4.7

### 7.3 ハイブリッド運用

実運用では **「メインを Sonnet 4.6 で回し、難所だけ Opus 4.7 にエスカレーション」**するパターンが効率的です。Claude Code では会話の途中でモデル切り替えが可能なので、軽い修正は Sonnet で進めて、設計判断や難バグ追跡だけ Opus に渡すといった使い分けが現実的です。

```text
通常の作業フロー
────────────────
[Sonnet 4.6]──→ 90% のタスクを処理
        │
        └ ハマったら
                ▼
        [Opus 4.7]──→ 難所だけ重い推論
```

---

## 8. 移行・活用ガイド

### 8.1 既存プロジェクトの移行

Sonnet 4.5 / 4.4 系から Sonnet 4.6 へ移行する際の主な注意点：

- **API モデル ID** を `claude-sonnet-4-6` に変更
- **1M コンテキスト**は「パブリックベータ」扱いのため、フラグ指定が必要な場合あり（SDK バージョンに依存）
- **Extended Thinking と Adaptive Thinking が併用**できる過渡期モデル — 既存コードに Extended があるならそのまま動く
- **Context Compaction はベータ**なので、本番投入前にテスト

### 8.2 Claude Code / Cowork ユーザー

Free / Pro プラン、Claude Code、Cowork ユーザーは**ログインするだけで自動的に Sonnet 4.6** が使われます。明示的な切り替えは不要ですが、**Opus 4.7 を使いたい場面では `/model` コマンド**などで切り替える必要があります。

### 8.3 Bedrock / Vertex AI / Foundry での利用

各クラウドのコンソールで `claude-sonnet-4-6` 相当のモデル ID を指定するだけで動きます。リージョン展開はクラウドごとにずれがあるため、**自社の対象リージョンで提供されているか**を事前確認するのが安全です。

---

## 9. 用途別推奨設定

| ユースケース | モデル | effort | 思考モード | 補足 |
|------------|--------|--------|----------|------|
| チャットアシスタント | Sonnet 4.6 | standard | adaptive | レイテンシ重視 |
| Web 検索 RAG | Sonnet 4.6 | high | adaptive | ツール強化が効く |
| コード生成（一般） | Sonnet 4.6 | high | adaptive | コスト効率最良 |
| コード生成（難局面） | Sonnet 4.6 | xhigh | adaptive | Opus へのエスカレ前段 |
| デバッグ・難バグ追跡 | Opus 4.7 | xhigh / max | adaptive | 深い推論が必要 |
| 大規模ドキュメント解析 | Sonnet 4.6 | high | adaptive | 1M を活かす |
| 画像 / スクリーンショット精読 | Opus 4.7 | high | adaptive | 高解像度対応 |
| 長時間エージェント | Sonnet 4.6 + Opus 4.7 | 切替 | adaptive | Compaction 併用 |
| ビジネス意思決定支援 | Sonnet 4.6 | high | adaptive | Vending-Bench での強さ |
| OS 操作（コンピュータユース） | Sonnet 4.6 | high | adaptive | OSWorld 72.5% |

---

## 10. まとめ

Claude Sonnet 4.6 は、Anthropic のラインナップにおいて **「日常で最も触れるモデル」のポジションを Free / Pro / Code / Cowork で同時に押さえた**重要なリリースです。要点を整理すると：

- **2026-02-17 リリース**、Free / Pro / Claude Code / Cowork のデフォルトモデル
- **価格は Sonnet 4.5 据え置き**（$3 / $15 per MTok）
- **1M トークンコンテキスト**（パブリックベータ）
- **SWE-bench Verified 79.6% / OSWorld 72.5% / コンピュータユース 94%**
- **Adaptive Thinking + Extended Thinking 両対応**、Context Compaction（ベータ）
- **Bedrock / Vertex AI / Microsoft Foundry / GitHub Copilot** 全主要クラウド対応
- **Opus 4.7 との使い分け**は「量と速度なら Sonnet、難所と品質なら Opus」

Opus 4.7 が「フラッグシップとしての品質追求」を担うのに対し、Sonnet 4.6 は **「Sonnet 価格帯のままで多くの場面を捌ける現実解」**として機能します。Sonnet 4.6 で 9 割を回しつつ、必要に応じて Opus 4.7 にエスカレートする運用が、コストと品質のバランスでは現状ベストといえます。デフォルトモデルとしての地位を考えると、**「Sonnet 4.6 をデフォルトのまま使いこなす」ことが Claude 利用全体の生産性を底上げする**最短ルートです。

---

## 参考資料

- [Claude Sonnet 4.6 — Anthropic News](https://www.anthropic.com/news/claude-sonnet-4-6)
- [Claude Sonnet — Anthropic Product Page](https://www.anthropic.com/claude/sonnet)
- [Anthropic releases Claude Sonnet 4.6 as default — CNBC](https://www.cnbc.com/2026/02/17/anthropic-ai-claude-sonnet-4-6-default-free-pro.html)
