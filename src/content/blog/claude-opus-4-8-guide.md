---
title: "Claude Opus 4.8 完全ガイド — System Card準拠ベンチ詳説・Effort 5段階の正準対応・4.7→4.8実務移行"
date: 2026-05-30
category: "Claude技術解説"
tags: ["Claude", "Opus 4.8", "Anthropic", "Effort Control", "ベンチマーク", "API", "アライメント"]
excerpt: "2026-05-28（PT）リリースの新フラッグシップ Claude Opus 4.8 を System Card 準拠で徹底解説。SWE-bench Pro 69.2%・HLE・GDPval Elo の正確な読み方、Effort 5段階（low/medium/high/xhigh/max）と claude.ai/Claude Code/API の名称対応、Fast mode の経済性、near-Mythos アライメントの正確な意味、claude-opus-4-8 への実務移行（budget_tokens の罠）まで網羅。"
draft: false
---

**最終更新**: 2026-05-30
**対象**: Claude Opus 4.8（`claude-opus-4-8`）/ API・Claude Code・claude.ai・各クラウド
**前提**: [Claude Opus 4.7 ガイド](/mdTechKnowledge/blog/claude-opus-4-7-guide/) の基礎知識

---

## TL;DR

- **2026年5月28日（PT）／5月29日（JST）** リリース。Opus 4.7 の**約6週間後**という異例の短サイクル。
- **モデルID は `claude-opus-4-8`**。標準価格は **Opus 4.7 据え置きの入力 $5 / 出力 $25 per MTok**。
- ベンチは **SWE-bench Pro 64.3%→69.2%** が目玉だが、これは**最難関バリアント限定**の数値（SWE-bench Verified は 87.6%→88.6% と小幅）。
- **Effort は 5段階（low/medium/high/xhigh/max）、デフォルト high**。コーディングは **xhigh 開始**が公式推奨。
- アライメントは **「自分が書いたコードの欠陥見逃しが約1/4」** と **「near-Mythos 水準」** の2点（**別々の指標**）。
- **手動 extended thinking（`budget_tokens`）は非対応**。4.7 からの移行時の最大の罠。

> 本記事は2026年5月時点の公式発表・System Card・報道に基づきます。数値の一次ソースは原則 **Claude Opus 4.8 System Card** で、第三者再掲経由のものは帰属を明記しています。料金・一部の可用性情報は報道ベースで、最終的には公式ページでの確認を推奨します。

---

## 1. Opus 4.8 とは — 「約6週間後」リリースの文脈

Claude Opus 4.8 は、Opus 4.7（2026-04-16）からわずか **約6週間後**（4月16日→5月28日で実暦42日）に投入された新フラッグシップです。一部報道は「41日後」と表現していますが、暦日では42日です。この短サイクルの背景には、OpenAI の Codex 大型更新や Google の Gemini 更新といった競合圧力があったと TechCrunch は報じています。

ただし本記事は**モデル本体のハブ**として、Opus 4.8 で「何が変わったか」に集中します。Opus 4.7 から継続する機能（1M コンテキスト、Adaptive Thinking の導入、マルチクラウド対応など）は[Opus 4.7 ガイド](/mdTechKnowledge/blog/claude-opus-4-7-guide/)を、Dynamic Workflows の詳細は[専用記事](/mdTechKnowledge/blog/claude-code-dynamic-workflows-guide/)を参照してください。

---

## 2. ベンチマーク詳説 — 数字を正しく読む

Opus 4.8 のベンチマークは**バリアント名と測定条件を省くと容易にミスリード**します。一次ソースは Anthropic の **Claude Opus 4.8 System Card**（公式ニュースページのベンチ表は画像埋め込みでテキスト化されていません）。

### 2-1. 「コーディング 69.2%」の正体は SWE-bench Pro

「コーディングスコアが 64.3%→69.2% に向上」という数字は、**SWE-bench の最難関バリアント「SWE-bench Pro」限定**の値です。同じ "コーディング" でも、より一般的な SWE-bench Verified では差は **+1.0pt** に過ぎません。

| バリアント | Opus 4.7 | Opus 4.8 | 差分 | 備考 |
|:---|:---|:---|:---|:---|
| **SWE-bench Pro**（最難関） | 64.3% | **69.2%** | +4.9pt | 目玉数値。必ず「Pro で」と明示すべき |
| SWE-bench Verified | 87.6% | 88.6% | +1.0pt | 一般的な代表指標。差は小幅 |
| SWE-bench Multilingual | 80.5% | 84.4% | +3.9pt | 参考 |

→ 「コーディング全般が +4.9pt」ではなく、「**最難関バリアントで +4.9pt、標準バリアントでは +1.0pt**」が正確な理解です。

### 2-2. 「マルチ分野推論」＝ Humanity's Last Exam（ツール使用あり）

「マルチ分野推論 54.7%→57.9%」は、正式には **Humanity's Last Exam（HLE）の「ツール使用あり」条件**の数値です。ツールなしでは別の値になります。

| 条件 | Opus 4.7 | Opus 4.8 | 差分 |
|:---|:---|:---|:---|
| **HLE（ツール使用あり）** | 54.7% | **57.9%** | +3.2pt |
| HLE（ツールなし） | 46.9% | 49.8% | +2.9pt |

### 2-3. 「知識作業 1753→1890」は % ではなく Elo

「知識作業スコア 1753→1890」は、実世界の知識労働を評価する **GDPval-AA の Elo レーティング**です（パーセンテージではありません）。max effort 時の値で、**+137 Elo** の向上です。

| ベンチマーク | スコア | 単位 | 一次ソース |
|:---|:---|:---|:---|
| GDPval-AA（知識労働） | 1753 → **1890** | **Elo**（+137, max effort） | System Card / 第三者再掲 |
| Terminal-Bench 2.1 | 66.1% → 74.6% | % | 報道（VentureBeat） |
| Online-Mind2Web（ブラウザ） | 84% | %（4.8値のみ） | 報道（VentureBeat） |

> **ベンチ数値の留保**: SWE-bench Pro / Verified は System Card で一次確認済み。HLE・GDPval は第三者再掲（vellum.ai・the-decoder 等）経由のため、厳密には「System Card によれば」と帰属して扱うのが安全です。

---

## 3. Effort Control 完全整理

Opus 4.8 で実務上もっとも重要なのが **Effort（推論努力度）の制御**です。ここは UI ごとに呼称が異なり混乱しやすいので、正準的に整理します。

### 3-1. API の正式トークンは5段階

| レベル | 公式の位置づけ | 推奨用途 | 永続性 |
|:---|:---|:---|:---|
| `low` | 最小の推論・低レイテンシ | 即答系・知能非依存 | 永続 |
| `medium` | コスト寄り | 品質維持を確認できた作業 | 永続 |
| **`high`** | バランス（**Opus 4.8 既定**） | 一般の知能重視タスク | 永続 |
| `xhigh` | 深い推論・高トークン | **コーディング/エージェントの推奨開始点** | 永続 |
| `max` | 最深・トークン上限なし | 最難関（過剰思考で収穫逓減も） | セッション限定 |

公式は **「the complete set the API accepts」** としてこの5段階を定義し、**デフォルトは `high`**（effort 未指定と完全に同一挙動）と明記しています。コーディング・エージェント用途は **`xhigh` から始める**のが公式推奨で、`xhigh`/`max` では `max_tokens` を大きめ（64k から調整）に取る必要があります。

### 3-2. claude.ai ⇔ Claude Code ⇔ API の名称対応表

| API / Claude Code | claude.ai UI 表記 | 既定 | 備考 |
|:---|:---|:---|:---|
| `low` | （UI 表記は公式未公開）※ | | 二次情報 |
| `medium` | （UI 表記は公式未公開）※ | | 二次情報 |
| `high` | default 相当 | ● | 既定 |
| `xhigh` | **Extra** | | UI の「Extra」＝ API の `xhigh` に対応 |
| `max` | **Max** | | 全 UI 共通 |

※ `low`/`default` の正確な UI ラベルは公式未公開のため、上表のうち確実なのは「**Extra = xhigh**」「**Max = max**」「**default ≒ high**」の対応のみです（その他は報道ベースの推測）。

### 3-3. adaptive thinking と budget_tokens の罠

Opus 4.8 は **adaptive thinking（`thinking: { type: "adaptive" }`）** を使用します。重要なのは、**従来の手動 extended thinking（`budget_tokens` 指定）は非対応**で、指定すると **400 エラー**になる点です。4.7 からコードを移行する際、`budget_tokens` を残したままだと壊れます（§8 で再掲）。

### 3-4. ultracode は「effort レベル」ではない

混同されがちですが、**`ultracode` は API の effort レベルではありません**。Claude Code 限定の設定で、「`xhigh` をモデルに送りつつ、タスクごとに動的ワークフローを常設で計画させる」組み合わせです（`effortLevel` 設定ファイルには書けず、セッション限定）。詳細は[Dynamic Workflows 専用記事](/mdTechKnowledge/blog/claude-code-dynamic-workflows-guide/)を参照してください。

> 補足: Claude Code v2.1.154 で `/effort` スライダーのラベルが「Speed / Intelligence」から **「Faster / Smarter」** に改称されました。

---

## 4. Messages API における 4.8 固有点

### 4-1. モデルID切替と最小移行コード

最小の移行は**モデルIDの差し替え**です。

```python
# Before (Opus 4.7)
resp = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=8000,
    messages=[{"role": "user", "content": "..."}],
)

# After (Opus 4.8)
resp = client.messages.create(
    model="claude-opus-4-8",   # ← モデルIDのみ変更
    max_tokens=16000,          # xhigh/max を使うなら大きめに
    messages=[{"role": "user", "content": "..."}],
)
```

### 4-2. 4.7 → 4.8 API 差分

| 項目 | Opus 4.7 | Opus 4.8 |
|:---|:---|:---|
| モデルID | `claude-opus-4-7` | `claude-opus-4-8` |
| 標準価格（in/out per MTok） | $5 / $25 | **$5 / $25（据え置き）** |
| コンテキスト窓 | 1M | 1M（Microsoft Foundry のみ 200k ※二次情報） |
| thinking | extended/adaptive | **adaptive のみ**（`budget_tokens` 指定で 400 エラー） |
| 既定 effort | xhigh | **high** |
| 新規ブレイキングチェンジ | — | （モデルID・thinking 以外は）新規なし |

### 4-3. max_tokens の設定指針

`xhigh`/`max` では推論に多くのトークンを使うため、`max_tokens` を小さいまま（例: 4k）にすると出力が途中で切れます。公式は **64k からの調整**を推奨しています。

---

## 5. アライメント向上の技術的中身

Opus 4.8 のアライメント改善は2つの**独立した**主張から成ります。**両者を因果・等価で結びつけないこと**が正確な理解の鍵です。

### 5-1. 「自分が書いたコードの欠陥見逃しが約1/4」

公式原文は **"around four times less likely than its predecessor to allow flaws in code *it has written* to pass unremarked"**。つまり対象は **「自分が書いたコード」限定**です。**任意のコードのレビュー精度が4倍向上した、という意味ではありません**——この一般化は誤りです。

### 5-2. near-Mythos アライメント（別の指標）

これとは別に、**誤整合行動（欺瞞・悪用への協力など）の率**が Opus 4.7 より大幅に低く、Anthropic の最良整合モデル **Claude Mythos Preview と同等水準**である、と公式は述べています。

ここで言う「near-Mythos」は **誤整合率が同等という限定的主張**であり、**性能・能力が Mythos 同等という意味ではありません**（Mythos は 4.8 より高性能ですが、選択的リリースに留まっています）。

| 指標 | 内容 | 対象範囲 | 出典 |
|:---|:---|:---|:---|
| コード欠陥見逃し ~1/4 | 前世代比で約4倍見逃しにくい | **自分が書いたコード限定** | 公式（定性的表現） |
| near-Mythos アライメント | 誤整合行動率が Mythos と同等水準 | アライメント評価全般 | 公式 |
| 誤整合スコア 1.9（4.7は2.5） | 約2,600シミュレーションセッション | — | **二次（System Card 解説）** |
| プロソーシャル特性 | 自律性支援・最善利益沿いで新最高水準 | — | 公式 |

### 5-3. grader awareness（要監視事項）

Opus 4.8 では、**「評価されていると認識し、採点方法を推論する傾向」が増大**したと公式が報告しています（観測された行動自体の悪化はなし）。予備的な解釈研究では訓練エピソードの約5%に採点者関連の推論が見られたとされますが、この5%は**二次情報（System Card 解説）**です。実務上は「ベンチ最適化的な振る舞いに注意」という監視事項として捉えるのが妥当です。

### 5-4. Claude Mythos 一般提供の前提

なお最良整合モデル Claude Mythos Preview が選択的リリースに留まる理由は、**誤整合ではなく、生のオフェンシブ・サイバー能力が現行防御を上回るため**であり、より強力なサイバーセーフガードの整備後、**「数週間以内」に全顧客へ提供見込み**と公式は説明しています。

---

## 6. Fast mode の経済性

価格は**2つの軸を分けて**理解する必要があります。

| モード | 入力 / MTok | 出力 / MTok | 速度 | 適する用途 |
|:---|:---|:---|:---|:---|
| **標準** | $5 | $25 | 1.0× | 通常のバッチ・非対話 |
| **Fast mode** | $10 ※ | $50 ※ | **約2.5×** | レイテンシ重視・対話的UX |

※ Fast mode の $10/$50 は**報道ベース**（VentureBeat 等が一致）。公式は数値を明示せず「2.5倍速」「3倍安」とのみ述べているため、最終的には公式料金ページでの確認を推奨します。

理解すべき2軸:

1. **標準 vs Fast mode**: Fast mode は**標準の2倍単価**で、その代わり**約2.5倍速**。
2. **世代比**: 公式は Fast mode が **「従来モデル（previous models）の Fast mode より約3倍安い」** と表現。**これは "Opus 4.7 比" と断定はできません**（公式は一般の "previous models" と記載）。一方、**標準価格は明確に "Opus 4.7 据え置き"** です。

| モデル | 標準（in/out） | Fast mode（in/out） |
|:---|:---|:---|
| Opus 4.7 | $5 / $25 | $30 / $150 ※二次 |
| **Opus 4.8** | $5 / $25 | **$10 / $50 ※二次** |

→ 単価は2倍でも2.5倍速になるため、**スループット単価（時間あたり処理量）で見ると Fast mode が有利になる**ケースが対話的ワークロードで生じます。

---

## 7. マルチクラウド／可用性

### 7-1. プラットフォーム別

| プラットフォーム | 提供 | コンテキスト窓 | モデルID |
|:---|:---|:---|:---|
| Anthropic API | ○ | 1M | `claude-opus-4-8` |
| Amazon Bedrock | ○（AWS公式） | 1M | （Bedrock 形式） |
| Google Cloud Vertex AI | ○ ※二次 | 1M | （Vertex 形式） |
| Microsoft Foundry | ○ ※二次 | **200k（制限）※二次** | （Foundry 形式） |

### 7-2. IDE / ツール別

| ツール | 対応 | 備考 |
|:---|:---|:---|
| **GitHub Copilot** | 同日 GA | Pro+/Business/Enterprise。**6/1 まで 15倍プレミアムリクエスト乗数**。VS Code / Visual Studio / CLI / JetBrains / Xcode / Eclipse / モバイルで選択可 |
| Cursor | ローンチ時点で追加 ※二次 | モデルピッカーに登場 |
| Claude Code | v2.1.154 でデフォルト | `claude update` で更新 |
| claude.ai / Desktop / Cowork | ○ | Max / Team Premium / Enterprise / API でデフォルト昇格 |

---

## 8. 4.7 → 4.8 実務移行ガイド

### 8-1. A/B 検証手順

```python
import anthropic
client = anthropic.Anthropic()

PROMPT = "（自社の代表的タスク）"
for model in ["claude-opus-4-7", "claude-opus-4-8"]:
    resp = client.messages.create(
        model=model,
        max_tokens=16000,
        # ❌ thinking={"type": "enabled", "budget_tokens": 10000}  # 4.8 で 400 エラー
        messages=[{"role": "user", "content": PROMPT}],
    )
    print(model, resp.usage)  # 出力品質・トークン・レイテンシを比較
```

### 8-2. Production 切替チェックリスト

| 観点 | 確認項目 | 推奨アクション |
|:---|:---|:---|
| 互換性 | `budget_tokens` を使っていないか | **adaptive thinking へ移行**（最大の罠） |
| モデルID | ハードコード箇所を網羅したか | `claude-opus-4-8` へ一括置換 |
| effort | 用途に対し適切か | コーディングは `xhigh` 開始、`max_tokens` を大きく |
| コスト | 標準/Fast mode の使い分け | 対話的UXは Fast mode を検証 |
| 品質 | A/B で劣化がないか | 自社タスクで実測してから切替 |

新規のブレイキングチェンジは（モデルID・thinking 仕様以外には）報告されていないため、移行自体は比較的軽量です。

---

## 9. 関連記事（ハブからの分岐）

Opus 4.8 を起点に、より深い話題は各専門記事へ:

- **Dynamic Workflows の内部構造・ultracode 詳細** → [Claude Code Dynamic Workflows 完全ガイド](/mdTechKnowledge/blog/claude-code-dynamic-workflows-guide/)
- **Claude Code の CLI 変更履歴（v2.1.154 ほか）** → [Claude Code バージョン履歴まとめ](/mdTechKnowledge/blog/claude-code-version-history/)
- **対 Gemini の価格・機能比較** → [Claude vs Gemini 完全比較](/mdTechKnowledge/blog/claude-vs-gemini-comparison-2026-05/)
- **Opus 4.7 の継続機能** → [Claude Opus 4.7 ガイド](/mdTechKnowledge/blog/claude-opus-4-7-guide/)

---

## まとめ

- Opus 4.8 は Opus 4.7 の**約6週間後**の新フラッグシップ。モデルID `claude-opus-4-8`、**標準価格は据え置き $5/$25**。
- ベンチは**バリアント名と条件を明示して読む**: SWE-bench **Pro** 69.2%（Verified は +1.0pt）、HLE は**ツール使用あり**で 57.9%、GDPval は **Elo** 1890。
- **Effort 5段階・デフォルト high・コーディングは xhigh 開始**。UI 表記は「Extra=xhigh」「Max=max」。
- アライメントは**「自分が書いたコードの欠陥見逃し約1/4」**と**「near-Mythos（誤整合率が同等）」**の**2つの別指標**。
- 移行の最大の罠は **`budget_tokens` 非対応（400 エラー）**。adaptive thinking へ。

---

## 参考資料

- [Anthropic 公式: Claude Opus 4.8](https://www.anthropic.com/news/claude-opus-4-8)
- [Claude Opus 4.8 System Card](https://www.anthropic.com/claude-opus-4-8-system-card)
- [Anthropic API: Effort（推論努力度）](https://platform.claude.com/docs/en/build-with-claude/effort)
- [VentureBeat: Claude Opus 4.8 — 3x cheaper fast mode and near-Mythos alignment](https://venturebeat.com/technology/anthropics-claude-opus-4-8-is-here-with-3x-cheaper-fast-mode-and-near-mythos-level-alignment)
- [TechCrunch: Anthropic releases Opus 4.8 with new Dynamic Workflow tool](https://techcrunch.com/2026/05/28/anthropic-releases-opus-4-8-with-new-dynamic-workflow-tool/)
- [MarkTechPost: Anthropic ships Claude Opus 4.8](https://www.marktechpost.com/2026/05/28/anthropic-ships-claude-opus-4-8-alongside-dynamic-workflows-and-cheaper-fast-mode-with-workflows-capped-at-1000-subagents/)

---

*本記事は2026年5月時点の公式発表・System Card・報道に基づいています。ベンチマーク数値は System Card を一次ソースとし、第三者再掲・報道ベースの情報は本文中に帰属を明記しています。料金・一部可用性は変更され得るため、最終確認は公式ページを参照してください。*
