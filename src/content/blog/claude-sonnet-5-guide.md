---
title: "Claude Sonnet 5 完全ガイド — Opus 4.8 に迫る性能を低価格で回す新デフォルトモデル"
date: 2026-07-03
updatedDate: 2026-07-07
category: "Claude技術解説"
tags: ["Claude", "Sonnet 5", "Anthropic", "AIモデル", "エージェント", "コーディング"]
excerpt: "2026年6月30日（PT）リリースのClaude Sonnet 5は、Free/Pro/Claude Codeの新デフォルトモデル。agentic codingベンチ63.2%でOpus 4.8（69.2%）に迫りつつ、導入価格$2/$10（〜2026-08-31、以降$3/$15）という破格の低価格を実現した。エージェント自律実行・ツールユース・コンピュータ使用を強化した後継モデルの実力を、Sonnet 4.6・Opus 4.8との比較で総点検する。"
draft: false
---

## 1. リリース概要・位置づけ

Anthropic は **2026年6月30日（PT／日本時間 7月1日）**、Sonnet シリーズの新世代 **Claude Sonnet 5**（API モデル ID: `claude-sonnet-5`）をリリースしました。同モデルは即日、**Claude.ai の Free / Pro プランおよび Claude Code の新しいデフォルトモデル**として展開され、前世代 [Claude Sonnet 4.6](/mdTechKnowledge/blog/claude-sonnet-4-6-guide/) からデフォルトの座を引き継ぎました。Max / Team / Enterprise ユーザーも利用できます。

公式発表のキーメッセージは明快で、「**数か月前までは、より大きく高価なモデルを必要としたレベルで、計画を立て、ブラウザやターミナルのようなツールを使い、自律的に動作できる**」というものです。つまり **Opus 4.8 に迫る性能を、Sonnet の低価格で回せる**——これが Sonnet 5 最大の売りです。TechCrunch も「エージェントをより安く動かす手段（a cheaper way to run agents）」として本モデルを報じています。

| 項目 | 値 |
|------|-----|
| リリース日 | 2026-06-30（PT）／ 2026-07-01（JST） |
| モデル ID | `claude-sonnet-5` |
| 導入価格（〜2026-08-31） | 入力 **$2** / 出力 **$10** per MTok |
| 通常価格（2026-09-01〜） | 入力 $3 / 出力 $15 per MTok |
| デフォルト先 | Free / Pro / Claude Code |
| 提供対象 | Free / Pro / Max / Team / Enterprise |

価格面が今回の目玉です。**導入価格の $2 / $10 は、Sonnet 4.6 の $3 / $15 よりさらに安い**設定で、2026年8月31日までの期間限定です。9月1日以降は $3 / $15（＝Sonnet 4.6 と同水準）へ戻ります。TechCrunch によれば、この価格は Opus 4.8・GPT-5.5・Gemini 3.1 Pro より安く、Gemini 3.5 Flash よりは高い、という立ち位置とされています。

```text
Sonnet 系列の流れ
─────────────────────────────────────────────
4.4 → 4.5 → 4.6 → 5（現行）
                    │
                    └─ Free/Pro/Claude Code デフォルト化
                       （Sonnet 4.6 から交代）
```

> **補足（推測）:** Claude Code でのデフォルト切り替えは **v2.1.197** で行われたとされます（本記事の指示情報による。公式ニュースページにはバージョン番号の明記なし）。厳密なバージョンは Claude Code のリリースノートでの確認を推奨します。

---

## 2. スペック詳細

### 2.1 主要スペック早見表

| 項目 | Sonnet 5 | 備考 |
|------|----------|------|
| モデル ID | `claude-sonnet-5` | API 指定名 |
| コンテキストウィンドウ | **1M トークン（公式確定）** | デフォルト＝最大が1M（より小さいコンテキスト版はなし）。最大出力 128k トークン |
| 導入価格（〜08-31） | 入力 $2 / 出力 $10 per MTok | 期間限定 |
| 通常価格（09-01〜） | 入力 $3 / 出力 $15 per MTok | Sonnet 4.6 と同水準 |
| デフォルト先 | Free / Pro / Claude Code | 前世代から交代 |

> **【2026-07-07 更新】公式ドキュメントで確定**: コンテキストウィンドウは **1M トークンがデフォルトかつ最大**（縮小版なし）、最大出力 **128k トークン**。ZDR（ゼロデータ保持）契約組織は**利用可**、Priority Tier は**非対応**（[What's new in Claude Sonnet 5](https://platform.claude.com/docs/en/about-claude/models/whats-new-sonnet-5)）。

### 2.2 価格の考え方

Sonnet 5 の価格戦略は「**新デフォルトへの乗り換えを導入価格で後押しし、9月に通常価格へ**」という二段構えです。

| 区分 | 期間 | 入力 | 出力 |
|------|------|------|------|
| 導入価格 | リリース〜2026-08-31 | $2 / MTok | $10 / MTok |
| 通常価格 | 2026-09-01〜 | $3 / MTok | $15 / MTok |

導入期間中は **Sonnet 4.6 より 3〜4 割安く**同等以上の性能が使えるため、既存の Sonnet 4.6 ワークロードは早期の切り替え検証が合理的です。

---

## 3. ベンチマーク — Opus 4.8 に迫る性能

Sonnet 5 の核心は「Sonnet 価格帯で Opus に肉薄する」点にあります。公式・TechCrunch から確認できる数値を整理します。

### 3.1 agentic coding での 3 モデル比較

| モデル | agentic coding | 位置づけ |
|--------|:---:|------|
| Sonnet 4.6 | 58.1% | 前世代 |
| **Sonnet 5** | **63.2%** | 本記事の主役 |
| [Opus 4.8](/mdTechKnowledge/blog/claude-opus-4-8-guide/) | 69.2% | フラッグシップ |

Sonnet 5 は **前世代 Sonnet 4.6（58.1%）から +5.1 ポイント**改善し、フラッグシップの **Opus 4.8（69.2%）との差を約 6 ポイントまで縮めました**。価格が Opus より大幅に安いことを踏まえると、コストパフォーマンスの跳ね上がりは顕著です。

### 3.2 その他の公式ベンチマーク

| ベンチマーク | Sonnet 5 | 補足 |
|------------|:---:|------|
| OSWorld-Verified | **78.5%** | コンピュータ使用（デスクトップ操作） |
| Humanity's Last Exam（ツールなし） | 34.6% | 高難度知識推論 |
| Humanity's Last Exam（ツールあり） | 46.8% | ツール併用時 |

公式は **BrowseComp と OSWorld-Verified において、高い effort 設定では Sonnet 5 が Opus 4.8 の能力水準に匹敵する**としています。さらに知識労働（knowledge work）系タスクでは「**Opus 4.8 をわずかに上回る**」との評価も示されています。

### 3.3 「近い性能を、低価格で」

要点は次の一言に集約されます——**Opus 4.8 に迫る性能を、Sonnet の価格で**。難局面の一部（agentic coding など）ではまだ Opus 4.8 が上ですが、多くの実務タスクでは Sonnet 5 で十分な水準に到達しており、コスト最適化の主力として非常に強力です。

---

## 4. Sonnet 4.6 からの強化点

公式および TechCrunch の記述から、Sonnet 5 の Sonnet 4.6 に対する主な進化は以下です。

### 4.1 エージェント自律実行

- **計画立案 → ツール使用 → 自律実行**を、従来より大型・高価なモデルが必要だったレベルで実行可能
- **タスクを途中で止めずに完遂**する能力が向上（公式: 「以前の Sonnet なら途中で止まっていた複雑なタスクを完遂する（finishes complex tasks where previous Sonnet models would stop short）」）

### 4.2 コーディング

- agentic coding 58.1% → **63.2%** への改善
- エージェント的なコーディングワークフロー（複数ステップの実装・修正）での自走性が向上

### 4.3 ツールユース

- **ブラウザ・ターミナル等のツール利用**が強化され、外部環境との相互作用がより確実に
- **明示的に指示されなくても自分の出力を自己検証する（checks its own output without explicitly being asked）**挙動を獲得

### 4.4 コンピュータ使用

- **OSWorld-Verified 78.5%** という高い水準（デスクトップ画面を見て操作するタスク）
- BrowseComp（Web ブラウズ）でも高 effort 時に Opus 4.8 級

### 4.5 安全性

- **誤用への協調・欺瞞・ハルシネーション・過度の同調（sycophancy）** といった望ましくない挙動の発生率が Sonnet 4.6 より低下
- **Sonnet 級で初の「リアルタイム・サイバーセキュリティ安全装置」搭載**: 禁止・高リスクなサイバー関連の依頼は拒否され得る。拒否は HTTP 200＋`stop_reason: "refusal"` で返る（エラーではない）

| 観点 | Sonnet 4.6 | Sonnet 5 |
|------|-----------|----------|
| agentic coding | 58.1% | **63.2%** |
| タスク完遂（途中停止） | 途中で止まる場面あり | 完遂性が向上 |
| 自己検証 | — | 無指示でも自己チェック |
| 安全性（望ましくない挙動） | 基準 | 低下（改善） |

---

## 5. 利用可能プラットフォーム

公式ニュースで確認できる展開先と、周辺エコシステム（推測含む）を分けて整理します。

### 5.1 公式で確認できる提供先

| プラットフォーム | 提供状況 | 出典 |
|---------------|---------|------|
| Claude API / Claude Platform（Anthropic 直接） | 提供 | 公式 |
| Claude Platform on AWS | 提供 | 公式 |
| Microsoft Foundry（Azure + Anthropic ホスト） | 提供 | 公式 |
| Google Cloud（Vertex AI） | **提供**（【2026-07-07 更新】公式docsで確認） | 公式 |
| Amazon Bedrock | **提供**（※旧 legacy Bedrock の InvokeModel/Converse は非対応） | 公式 |
| Claude Code | デフォルトモデル | 公式 |

### 5.2 周辺ツール（推測・要確認）

以下は本記事の指示情報に基づく展開候補で、**公式ニュースページには明記がありません**。実際の対応状況は各ツールの提供状況を確認してください。

| プラットフォーム | 状況 |
|---------------|------|
| Amazon Bedrock | 推測（AWS 展開はあるが Bedrock 明記なし・要確認） |
| VS Code / GitHub Copilot | 推測（要確認） |
| Cursor | 推測（要確認） |
| OpenRouter | 推測（要確認） |

Sonnet 4.6 が Bedrock / Vertex AI / Microsoft Foundry / GitHub Copilot に展開されていた実績を踏まえると、**Sonnet 5 も順次これらへ拡大すると見込まれます**が、リリース直後の時点では公式に確認できる範囲を優先してください。

---

## 6. Sonnet 5 と Opus 4.8 の使い分け

Sonnet 5 は「Opus 4.8 に迫る性能を低価格で」提供する一方、最難関タスクでは依然 [Opus 4.8](/mdTechKnowledge/blog/claude-opus-4-8-guide/) が上です。運用の最重要論点は「**いつコストの Sonnet 5、いつ最高性能の Opus 4.8 か**」です。

### 6.1 早見表

| 観点 | Sonnet 5 | Opus 4.8 |
|------|----------|----------|
| 導入価格（〜08-31） | 入力 $2 / 出力 $10 | （Opus 価格帯・別途） |
| 通常価格（09-01〜） | 入力 $3 / 出力 $15 | （Opus 価格帯・別途） |
| agentic coding | 63.2% | **69.2%** |
| knowledge work | Opus をわずかに上回る場面あり | 高水準 |
| OSWorld-Verified | 78.5% | 高 effort 時に同等 |
| 想定スイートスポット | 量・速度・コスト | 難易度・最高品質 |

### 6.2 ユースケース別推奨

- **日常コーディング / レビュー / リファクタ / 多数の PR 処理**: **Sonnet 5**（コスト効率が最良）
- **知識労働系（調査・要約・ドキュメント作業）**: **Sonnet 5**（Opus 4.8 に匹敵〜わずかに上回る場面も）
- **最難関の agentic coding・大規模設計・難バグ根本解析**: **Opus 4.8**
- **長時間自律エージェント**: コスト最優先なら Sonnet 5、品質最大化なら Opus 4.8
- **コンピュータ使用（GUI 操作）**: Sonnet 5 で高水準（OSWorld-Verified 78.5%）、最難局面のみ Opus 4.8

### 6.3 ハイブリッド運用

実務では **「メインを Sonnet 5 で回し、最難所だけ Opus 4.8 にエスカレーション」**が効率的です。Claude Code では会話途中でのモデル切り替えが可能なので、通常タスクは Sonnet 5、設計判断や難バグ追跡は Opus 4.8 に渡す運用が現実解です。

```text
通常の作業フロー
────────────────
[Sonnet 5]──→ 9割超のタスクを低コスト処理
      │
      └ 最難所でハマったら
              ▼
      [Opus 4.8]──→ 最高性能で難所だけ突破
```

なお、Sonnet 5 でも effort（推論の深さ）を高く設定すると Opus 4.8 に匹敵する場面が増えます。effort の段階的な使い分けは [/effort の6段階ガイド](/mdTechKnowledge/blog/claude-code-effort-levels-guide/) を参照してください。**「Sonnet 5 の effort を上げてまず試し、それでも足りなければ Opus 4.8」**が、コストと品質のバランスでは有力な手順です。

---

## 7. 移行・活用ガイド

### 7.1 既存プロジェクトの移行

- **API モデル ID** を `claude-sonnet-5` に変更
- **導入価格期間（〜2026-08-31）** のうちに切り替え検証を進めるとコスト面で有利
- Sonnet 4.6 からの主な差分は「エージェント自律実行・タスク完遂性・自己検証」の強化。**プロンプト側で過剰に手取り足取り指示していた部分は簡素化できる**可能性
- **9月1日以降は通常価格 $3 / $15** に戻る点をコスト試算に織り込む

#### 【重要】移行前チェック — 新トークナイザと3つの破壊的変更

「モデルIDの差し替えだけ」で移行すると踏み抜くポイントが公式ドキュメントに明記されています（[What's new in Claude Sonnet 5](https://platform.claude.com/docs/en/about-claude/models/whats-new-sonnet-5)）。

**① 新トークナイザ — 同じテキストで約30%多くトークンを消費**

Sonnet 5 は新トークナイザを採用し、**同一の入力テキストが Sonnet 4.6 比で約30%多くのトークン**になります（増加率はコンテンツ依存。API の形は不変）。影響は「トークンで測る・積むものすべて」です。

- **トークン数の再計測必須**: 旧モデルで測った `usage` やトークンカウントは流用不可。[token counting API](https://platform.claude.com/docs/en/build-with-claude/token-counting) で `claude-sonnet-5` を指定して再計測
- **1M コンテキストの実効容量**: ウィンドウは 1M トークンのままだが、1トークンが覆うテキストが短くなるため**同じ窓に入る「文章量」は減る**
- **`max_tokens` の見直し**: Sonnet 4.6 向けに出力長ギリギリで調整していた上限は、同等の出力で**途中切れ（truncate）**し得る
- **実効コスト**: トークン単価は据え置きでも、同じ依頼のトークン数が増えるため**リクエスト単位のコストは変わり得る**

**② ③ 破壊的変更（いずれも 400 エラー）**

| 変更 | 内容 | 対処 |
|---|---|---|
| **adaptive thinking が既定ON** | `thinking` 未指定のリクエストが**思考つき**で実行される（4.6 は思考なし）。`max_tokens` は思考＋本文の合計上限なので、思考なし前提のワークロードは上限を見直す | 思考を切りたい場合のみ `thinking: {type: "disabled"}`（Sonnet 5 では**無効化は可能**） |
| **手動 extended thinking の削除** | `thinking: {type: "enabled", budget_tokens: N}` は **400 エラー**（4.6 で非推奨→5 で削除。Opus 4.7/4.8 と同じ） | `thinking: {type: "adaptive"}`＋`effort` パラメータへ移行 |
| **サンプリングパラメータ不可** | `temperature` / `top_p` / `top_k` を非デフォルト値にすると **400 エラー**（Opus 4.7 で先行導入された制約が Sonnet 級にも適用） | パラメータを削除し、挙動の誘導はシステムプロンプトで行う |

> 補足: assistant メッセージの **prefill 不可（400）** は Sonnet 4.6 から変わらず継続。ZDR（ゼロデータ保持）は**利用可**、Priority Tier は**非対応**です。

### 7.2 Claude Code / Free / Pro ユーザー

Free / Pro プランおよび Claude Code ユーザーは、**特別な操作なしで自動的に Sonnet 5** が使われます（デフォルト交代済み）。Opus 4.8 を使いたい場面では `/model` コマンドなどで明示的に切り替えます。

### 7.3 クラウド利用

- **AWS（Claude Platform on AWS）／ Microsoft Foundry** は提供開始済み
- **Google Vertex AI は近日提供（coming soon）**
- Bedrock / Copilot / Cursor / OpenRouter などの周辺ツール対応は**リリース直後時点で公式未確認**のため、各サービスの案内で最新状況を確認

---

## 8. 用途別推奨設定

| ユースケース | モデル | 効率の考え方 |
|------------|--------|------------|
| チャット / 要約 / 短い変換 | Sonnet 5（低 effort） | レイテンシとコスト重視 |
| Web 検索 RAG / 調査 | Sonnet 5 | ツールユース強化が効く |
| コード生成（一般） | Sonnet 5 | 導入価格で最良のコスト効率 |
| コード生成（難局面） | Sonnet 5（高 effort） | Opus エスカレ前段 |
| 最難関 agentic coding | Opus 4.8 | 69.2% の最高水準 |
| 知識労働（ドキュメント作業） | Sonnet 5 | Opus に匹敵〜わずかに上 |
| コンピュータ使用（GUI 操作） | Sonnet 5 | OSWorld-Verified 78.5% |
| 長時間自律エージェント | Sonnet 5 ＋ Opus 4.8 | 通常 Sonnet、難所のみ Opus |
| 難バグ根本解析 / 大規模設計 | Opus 4.8 | 深い推論が必要 |

---

## 9. まとめ

Claude Sonnet 5 は、Anthropic のラインナップにおいて **「日常で最も触れるモデル」のデフォルトを Sonnet 4.6 から引き継いだ**重要リリースです。要点を整理すると：

- **2026-06-30（PT）／07-01（JST）リリース**、Free / Pro / Claude Code の新デフォルト
- **モデル ID `claude-sonnet-5`**、Max / Team / Enterprise でも利用可
- **導入価格 $2 / $10（〜2026-08-31）**、以降 **$3 / $15**（Sonnet 4.6 と同水準）
- **agentic coding 63.2%**（Sonnet 4.6=58.1% / Opus 4.8=69.2%）で **Opus 4.8 に肉薄**
- **OSWorld-Verified 78.5%**、knowledge work は Opus 4.8 をわずかに上回る場面も
- **エージェント自律実行・タスク完遂性・自己検証・安全性**が Sonnet 4.6 から強化
- 提供先は **Claude Platform / AWS / Microsoft Foundry**、**Vertex AI は近日**
- 使い分けは「量と速度・コストなら Sonnet 5、最難所と最高品質なら Opus 4.8」

Sonnet 5 のメッセージは一貫して「**Opus 4.8 に迫る性能を、Sonnet の低価格で**」。導入価格期間中は特にコストメリットが大きく、既存の Sonnet 4.6 ワークロードの早期移行検証が合理的です。多くのタスクを Sonnet 5 で捌き、最難所のみ [Opus 4.8](/mdTechKnowledge/blog/claude-opus-4-8-guide/) にエスカレートする運用が、現状のコスト×品質バランスでベストといえます。

---

## 参考資料

- [Claude Sonnet 5 — Anthropic News](https://www.anthropic.com/news/claude-sonnet-5)（公式・一次情報）
- [Anthropic launches Claude Sonnet 5 as a cheaper way to run agents — TechCrunch](https://techcrunch.com/2026/06/30/anthropic-launches-claude-sonnet-5-as-a-cheaper-way-to-run-agents/)
- [Claude Sonnet — Anthropic Product Page](https://www.anthropic.com/claude/sonnet)
- 関連記事: [Claude Sonnet 4.6 完全ガイド](/mdTechKnowledge/blog/claude-sonnet-4-6-guide/) / [Claude Opus 4.8 完全ガイド](/mdTechKnowledge/blog/claude-opus-4-8-guide/) / [/effort の6段階ガイド](/mdTechKnowledge/blog/claude-code-effort-levels-guide/)
