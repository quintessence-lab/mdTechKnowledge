---
title: "Claude Sonnet 5 完全ガイド — Opus 4.8 に迫る性能を低価格で回す新デフォルトモデル"
date: 2026-07-03
updatedDate: 2026-09-29
category: "Claude技術解説"
tags: ["Claude", "Sonnet 5", "Anthropic", "AIモデル", "エージェント", "コーディング"]
excerpt: "2026年6月30日（PT）リリースのClaude Sonnet 5は、Free/Pro/Claude Codeの新デフォルトモデル。agentic codingベンチ63.2%でOpus 4.8（69.2%）に迫りつつ、価格$2/$10という破格の低価格を実現した（当初は2026-08-31までの導入価格→**2026-08-10に恒久化を発表**、9月からの$3/$15への値上げは撤回）。エージェント自律実行・ツールユース・コンピュータ使用を強化した後継モデルの実力を、Sonnet 4.6・Opus 4.8との比較で総点検する。2026-09-22追記: Claude Code v2.1.280でPro・Team StandardプランのデフォルトがSonnetからOpus（5.5）へ再変更された点を追記（Claude.aiのFree/Proチャットは引き続きSonnet 5既定）。 【2026-09-29追記】後継のClaude Sonnet 5.5（2026-09-28 PT、同価格$2/$10で出力30%超高速）の概要・公式ベンチマーク・5つのAPI破壊的変更と、Sonnet 5がLegacy扱いになった点を追記。"
draft: false
---

## 1. リリース概要・位置づけ

> **【2026-09-29追記】後継の Claude Sonnet 5.5 がリリースされました（2026-09-28 PT）。** 同じ価格で出力が30%以上速く、Sonnet 5 はモデル一覧で Legacy（旧世代）扱いになりました。概要は本記事末尾の「後継 Claude Sonnet 5.5 がリリース」の節を参照してください。

Anthropic は **2026年6月30日（PT／日本時間 7月1日）**、Sonnet シリーズの新世代 **Claude Sonnet 5**（API モデル ID: `claude-sonnet-5`）をリリースしました。同モデルは即日、**Claude.ai の Free / Pro プランおよび Claude Code の新しいデフォルトモデル**として展開され、前世代 [Claude Sonnet 4.6](/mdTechKnowledge/blog/claude-sonnet-4-6-guide/) からデフォルトの座を引き継ぎました。Max / Team / Enterprise ユーザーも利用できます。

公式発表のキーメッセージは明快で、「**数か月前までは、より大きく高価なモデルを必要としたレベルで、計画を立て、ブラウザやターミナルのようなツールを使い、自律的に動作できる**」というものです。つまり **Opus 4.8 に迫る性能を、Sonnet の低価格で回せる**——これが Sonnet 5 最大の売りです。TechCrunch も「エージェントをより安く動かす手段（a cheaper way to run agents）」として本モデルを報じています。

| 項目 | 値 |
|------|-----|
| リリース日 | 2026-06-30（PT）／ 2026-07-01（JST） |
| モデル ID | `claude-sonnet-5` |
| 価格（**恒久**） | 入力 **$2** / 出力 **$10** per MTok（2026-08-10 に導入価格の恒久化を発表。9/1 からの $3/$15 は撤回） |
| デフォルト先 | Free / Pro / Claude Code |
| 提供対象 | Free / Pro / Max / Team / Enterprise |

価格面が今回の目玉です。**$2 / $10 は、Sonnet 4.6 の $3 / $15 よりさらに安い**設定です。TechCrunch によれば、この価格は Opus 4.8・GPT-5.5・Gemini 3.1 Pro より安く、Gemini 3.5 Flash よりは高い、という立ち位置とされています。

> **【2026-08-14 更新】導入価格が恒久化されました。** 当初は「2026-08-31 までの導入価格、9/1 から $3/$15」と公式に明記されていましたが（2026-08-02 時点で確認済み）、**2026年8月10日、Anthropic は $2/$10 を恒久価格とすることを発表**しました。**9月1日からの値上げは行われません**。8月末までの移行を急ぐ必要はなくなりましたが、依然として Sonnet 4.6（$3/$15）より安いため、乗り換え検証の合理性は変わりません。

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
| 価格（恒久） | 入力 $2 / 出力 $10 per MTok | 2026-08-10 に恒久化を発表（$3/$15 への値上げは撤回） |
| デフォルト先 | Free / Pro / Claude Code | 前世代から交代 |

> **【2026-07-07 更新】公式ドキュメントで確定**: コンテキストウィンドウは **1M トークンがデフォルトかつ最大**（縮小版なし）、最大出力 **128k トークン**。ZDR（ゼロデータ保持）契約組織は**利用可**、Priority Tier は**非対応**（[What's new in Claude Sonnet 5](https://platform.claude.com/docs/en/about-claude/models/whats-new-sonnet-5)）。

### 2.2 価格の考え方

Sonnet 5 の価格戦略は、当初「**新デフォルトへの乗り換えを導入価格で後押しし、9月に通常価格へ**」という二段構えでしたが、**2026-08-10 の発表で導入価格がそのまま恒久価格になりました**。

| 区分 | 期間 | 入力 | 出力 |
|------|------|------|------|
| **現行価格（恒久）** | リリース〜（期限なし） | **$2 / MTok** | **$10 / MTok** |
| ~~通常価格~~（撤回） | ~~2026-09-01〜~~ 実施されず | ~~$3 / MTok~~ | ~~$15 / MTok~~ |

**Sonnet 4.6 より 3〜4 割安く**同等以上の性能が恒久的に使えるため、既存の Sonnet 4.6 ワークロードは切り替え検証が合理的です。

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
| Amazon Bedrock | **提供**（【2026-07-07 更新】公式docsで確認。旧 legacy Bedrock の InvokeModel/Converse は非対応） |
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
| 価格（恒久・2026-08-10 発表） | 入力 $2 / 出力 $10 | （Opus 価格帯・別途） |
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
- 価格は **$2 / $10 per MTok で恒久化**（2026-08-10発表。当初予定されていた9月1日からの $3/$15 への値上げは撤回されたため、コスト試算はこの恒久価格で行ってよい）
- Sonnet 4.6 からの主な差分は「エージェント自律実行・タスク完遂性・自己検証」の強化。**プロンプト側で過剰に手取り足取り指示していた部分は簡素化できる**可能性

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

> **【2026-09-22追記】Claude Code の Pro・Team Standard デフォルトは Opus（5.5）へ再変更**: Claude Code v2.1.280（2026-09-22 PT）で、**Pro・Team Standardプランの既定モデルがSonnetからOpus（新登場のOpus 5.5）へ変更**されました。Max・Team Premium・Enterpriseは元々Opus既定だったため、これで**全プランがOpus既定に統一**されています。詳細は[Claude Opus 5 完全ガイド](/mdTechKnowledge/blog/claude-opus-5-guide/)を参照。本節で説明している「Sonnet 5が自動的に使われる」という挙動は、**Claude.aiのFree/Proチャットには引き続き該当**しますが、**Claude Code（v2.1.280以降のPro/Team Standard）には該当しなくなった**点に注意してください。

### 7.3 クラウド利用

- **AWS（Claude Platform on AWS）／ Microsoft Foundry** は提供開始済み
- **Google Vertex AI も提供開始済み**（リリース時は coming soon → 【2026-07-07 更新】公式docsで提供を確認）
- **Amazon Bedrock も提供済み**（【2026-07-07 更新】公式docsで確認。旧 legacy Bedrock の InvokeModel/Converse は非対応）。Copilot / Cursor / OpenRouter などの周辺ツール対応は各サービスの案内で最新状況を確認

---

## 8. 用途別推奨設定

| ユースケース | モデル | 効率の考え方 |
|------------|--------|------------|
| チャット / 要約 / 短い変換 | Sonnet 5（低 effort） | レイテンシとコスト重視 |
| Web 検索 RAG / 調査 | Sonnet 5 | ツールユース強化が効く |
| コード生成（一般） | Sonnet 5 | 恒久価格 $2/$10 で最良のコスト効率 |
| コード生成（難局面） | Sonnet 5（高 effort） | Opus エスカレ前段 |
| 最難関 agentic coding | Opus 4.8 | 69.2% の最高水準 |
| 知識労働（ドキュメント作業） | Sonnet 5 | Opus に匹敵〜わずかに上 |
| コンピュータ使用（GUI 操作） | Sonnet 5 | OSWorld-Verified 78.5% |
| 長時間自律エージェント | Sonnet 5 ＋ Opus 4.8 | 通常 Sonnet、難所のみ Opus |
| 難バグ根本解析 / 大規模設計 | Opus 4.8 | 深い推論が必要 |

## 【2026-09-29追記】後継 Claude Sonnet 5.5 がリリース

**2026年9月28日（PT）**、Sonnet 5 の後継となる **Claude Sonnet 5.5（`claude-sonnet-5-5`）** がリリースされました。公式は「Sonnet 5 からの明確なアップグレードで、出力は30%以上速く、ほとんどの作業でコストが最大30%安い」と説明しています。モデル一覧では、現行の Sonnet が Sonnet 5.5 になり、**Sonnet 5 は Legacy（旧世代）**に移りました。

| 項目 | Sonnet 5.5 |
|---|---|
| 価格（入力 / 出力） | $2 / $10 per MTok（Sonnet 5 と同額。キャッシュ書込 $2.50・$4、読取 $0.20、Batch 50%引きも同じ） |
| 速度 | 出力の生成が Sonnet 5 より **30%以上速い**（Sonnet として過去最速） |
| コンテキスト / 最大出力 | 1M / 128K（Batch API はベータヘッダーで 300K） |
| 知識カットオフ | 2026年6月 |
| thinking | Adaptive thinking が既定でオン。`between_tools` で事前の thinking を切れる（effort が high 以下のとき） |
| 既定 effort | API は `high`、Claude アプリと Claude Code は `medium` |

**公式ベンチマーク**（公式発表より）

| ベンチマーク | Sonnet 5.5 | Sonnet 5 | Opus 5.5 |
|---|---|---|---|
| Terminal-Bench 4.0 | **70.6%** | 10.3% | 66.4%（xhigh） |
| FrontierCode 1.1（Main） | 46.2%（Max） | 42.4% | 54.4% |
| CursorBench 4.0 | 55.5% | 34.1% | 57.8% |
| GDPval-AA v2.1（Elo） | 1844 | 1449 | 1846 |
| AA-Briefcase v1.1（Elo） | 1811 | 1359 | 1822 |
| Humanity's Last Exam（ツールあり） | 64.5% | 54.9% | 67.7% |
| OSWorld 2.1（partial） | 80.1% | 57.0% | 81.8% |
| Chartography（ツールなし） | 61.6% | 15.6% | 64.4% |

Terminal-Bench 4.0 では Opus 5.5 を上回り、GDPval-AA では Opus 5.5 と2点差です。一方、FrontierCode では Opus 5.5 との差が大きく残っています。公式は「Opus 5.5 は慎重な判断を要する複雑な作業向け、Sonnet 5.5 は範囲の明確な日常タスクやバグ修正に最も強い」と役割を分けています。

- **安全性**: **Sonnet として初めて、最上位モデル向けに作られたサイバー分野の safeguard とフォールバックを搭載**しました。リスクの高いサイバーセキュリティのタスクは、目に見える形で Sonnet 5 に切り替わります。生物分野の safeguard は Sonnet 5 と同じです。Preserved Thinking（蒸留対策）も適用されます。
- **API の破壊的変更は5点**です。① thinking を切るには `disabled` ではなく `between_tools` を使う（`disabled` と `enabled`＋`budget_tokens` は400エラー）、② `tool_choice` の `any` / `tool` が使えない、③ thinking ブロックがモデルと会話に紐付く、④ Claude API と Google Cloud で `computer_20251124` が使えない、⑤ advisor tool で Opus 4.8・Opus 4.7・Sonnet 5 を助言役に指定できない。Sonnet 5 からの移行では、Opus 5.5 と同様にモデル ID の差し替えだけでは済みません。
- **Claude Code**: v2.1.284 で追加されました。Anthropic API では `sonnet` エイリアスが Sonnet 5.5 を指します（Bedrock・Google Cloud・Claude Platform on AWS では旧 Sonnet のまま）。**Claude Code の既定モデルは Opus 5.5 のまま**です。
- **提供範囲**: Claude API・Amazon Bedrock・Claude Platform on AWS・Google Cloud・Microsoft Foundry、claude.ai の全プラン、GitHub Copilot（Pro 以上）。
- **Haiku 5.5** は「数週間以内」に Claude 5.5 ファミリーに加わると予告されています。

API の変更点の詳細は [Anthropic Messages API 新機能まとめ](/mdTechKnowledge/blog/anthropic-messages-api-new-features-2026/) の第22章、同じ 5.5 世代の上位モデルは [Claude Opus 5.5 完全ガイド](/mdTechKnowledge/blog/claude-opus-5-5-guide/) を参照してください。

出典: [Claude Sonnet 5.5 — Anthropic 公式発表](https://www.anthropic.com/claude-sonnet-5-5)（2026-09-28） / [Claude Sonnet 5.5 モデルページ](https://platform.claude.com/docs/en/models/sonnet-5-5/overview) / [What's new in Claude Sonnet 5.5](https://platform.claude.com/docs/en/models/sonnet-5-5/whats-new-sonnet-5-5) / [Platform リリースノート（2026-09-28）](https://platform.claude.com/docs/en/release-notes/overview)

---

## 9. まとめ

Claude Sonnet 5 は、Anthropic のラインナップにおいて **「日常で最も触れるモデル」のデフォルトを Sonnet 4.6 から引き継いだ**重要リリースです。要点を整理すると：

- **2026-06-30（PT）／07-01（JST）リリース**、Free / Pro / Claude Code の新デフォルト
- **モデル ID `claude-sonnet-5`**、Max / Team / Enterprise でも利用可
- **$2 / $10 per MTok（恒久価格）**（2026-08-10発表。当初予定の9月からの $3 / $15 値上げは撤回）
- **agentic coding 63.2%**（Sonnet 4.6=58.1% / Opus 4.8=69.2%）で **Opus 4.8 に肉薄**
- **OSWorld-Verified 78.5%**、knowledge work は Opus 4.8 をわずかに上回る場面も
- **エージェント自律実行・タスク完遂性・自己検証・安全性**が Sonnet 4.6 から強化
- 提供先は **Claude Platform / AWS / Microsoft Foundry / Vertex AI / Bedrock**（Vertex・Bedrock は 2026-07-07 に公式docsで提供確認）
- 使い分けは「量と速度・コストなら Sonnet 5、最難所と最高品質なら Opus 4.8」

Sonnet 5 のメッセージは一貫して「**Opus 4.8 に迫る性能を、Sonnet の低価格で**」。価格が恒久化されたことでコストメリットは期間限定ではなくなり、既存の Sonnet 4.6 ワークロードの移行検証は急ぐ理由も先延ばしする理由もなく合理的です。多くのタスクを Sonnet 5 で捌き、最難所のみ [Opus 4.8](/mdTechKnowledge/blog/claude-opus-4-8-guide/) にエスカレートする運用が、現状のコスト×品質バランスでベストといえます。

---

## 参考資料

- [Claude Sonnet 5 — Anthropic News](https://www.anthropic.com/news/claude-sonnet-5)（公式・一次情報）
- [Anthropic launches Claude Sonnet 5 as a cheaper way to run agents — TechCrunch](https://techcrunch.com/2026/06/30/anthropic-launches-claude-sonnet-5-as-a-cheaper-way-to-run-agents/)
- [Claude Sonnet — Anthropic Product Page](https://www.anthropic.com/claude/sonnet)
- 関連記事: [Claude Sonnet 4.6 完全ガイド](/mdTechKnowledge/blog/claude-sonnet-4-6-guide/) / [Claude Opus 4.8 完全ガイド](/mdTechKnowledge/blog/claude-opus-4-8-guide/) / [/effort の6段階ガイド](/mdTechKnowledge/blog/claude-code-effort-levels-guide/)
