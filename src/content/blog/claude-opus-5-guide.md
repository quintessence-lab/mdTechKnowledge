---
title: "Claude Opus 5 完全ガイド — ベンチ独立検証・2つの破壊的変更・Opus 4.8 からの実務移行"
date: 2026-07-25
category: "Claude技術解説"
tags: ["Claude", "Opus 5", "Anthropic", "ベンチマーク", "Effort Control", "API", "thinking", "移行ガイド", "Artificial Analysis"]
excerpt: "2026-07-24（PT）リリースの新フラッグシップ Claude Opus 5 を、公式発表・公式API docs・独立検証（Artificial Analysis）の三点で徹底解説。Frontier-Bench v0.1 で Opus 4.8 の2倍超（43.3% vs 18.7%）、GDPval-AA v2 で 1861 Elo と Fable 5 を100点超引き離しつつ、価格は Opus 4.8 と同額の $5/$25。一方で AA-Omniscience の幻覚率が +14ポイント（50%）に上がる留保も明示する。API では『thinking が既定オン』『thinking disabled × effort xhigh/max で400エラー』という2つの破壊的変更があり、これは単なるモデルID差し替えでは済まない。効果が上がった Effort の使い分け、キャッシュ最小512トークン、mid-conversation tool changes、fallbacks default モード、そして4.8→5 移行チェックリスト（検証指示の削除・サブエージェント上限）までを実務目線でまとめる。"
draft: false
---

## TL;DR

- **2026年7月24日（PT）、Claude Opus 5（`claude-opus-5`）リリース**。**Opus 4.8 と同額の $5 / $25 per MTok** で、公式は「**Fable 5 のフロンティア知能に、その半額で迫る**」と位置づける。
- **独立検証でも裏が取れている**: Artificial Analysis Intelligence Index で **61（max）＝1位**（Fable 5 の 60 と実質同着、GPT-5.6 Sol 59 を上回る）。知識労働の **GDPval-AA v2 で 1861 Elo**、Fable 5・Sol を **100点超**引き離す。
- **コーディングは Frontier-Bench v0.1 で 43.3%（max）**。Fable 5 33.7%、**Opus 4.8 18.7% の2倍超**という不連続な伸び。
- ⚠️ **手放しでは褒められない点**: AA-Omniscience で正答率は 4.8 比 +7ポイントだが、**幻覚率が +14ポイント上昇して 50%**。事実性が critical な用途では検証層を外せない。
- **API の破壊的変更が2つ**: ①**thinking が既定オン**（4.8 は省略時オフ）→ `max_tokens` の見直しが必要。②**`thinking: disabled` は effort `high` 以下でのみ可**、`xhigh`/`max` と併用すると **400エラー**（リクエスト単位で判定）。
- **モデルID差し替えだけの移行は危険**。特に**「検証させる指示」は削除**（Opus 5 は言われなくても自己検証するため過剰検証になる）、**サブエージェントは上限を設ける**（4.8 と逆に委任しすぎる）。

## 1. Opus 5 とは — 「2か月で4モデル目」という文脈

Anthropic は2026年5月末の Opus 4.8 以降、Sonnet 5・Fable 5 と立て続けにリリースし、**7月24日の Opus 5 で約2か月に4モデル目**という異例のペースになりました。そのなかで Opus 5 の役割は明快です。

| 観点 | Claude Fable 5 | **Claude Opus 5** | Claude Opus 4.8 |
|:---|:---|:---|:---|
| 位置づけ | 最上位・最難関特化 | **日常的に使うフロンティア主力** | 前世代主力 |
| 入力/出力（per MTok） | $10 / $50 | **$5 / $25** | $5 / $25 |
| コンテキスト | 1M | **1M（既定かつ最大）** | 1M |
| 最大出力 | 128K | **128K** | 128K |
| 思考 | 常時オン | **既定オン**（無効化は条件付き可） | 既定オフ |
| 提供状況 | 継続 | **新主力** | **継続提供**（廃止ではない） |

公式の表現を借りれば「**フロンティア知能を Fable 5 の半額で**」。Claude Max では既定モデルに、Claude Pro では選択可能な最上位モデルになりました。**価格は Opus 4.8 から据え置き**で、値上げなしの世代交代です。

> 単価の全体像（Batch・キャッシュ倍率・fast mode・他社比較）と、Claude Code でのモデル指定方法は別記事にまとめています → [Claude Opus 5 リリースで変わった単価とモデル選択](/mdTechKnowledge/blog/claude-opus-5-pricing-and-model-selection/)

## 2. ベンチマーク詳説 — 公式主張と独立検証を分けて読む

ベンチマークは**「誰が測ったか」で信頼度が変わります**。ここでは Anthropic 公式発表と、第三者（Artificial Analysis・llm-stats 系）の測定値を明示的に分けます。

### 2-1. コーディング: Frontier-Bench v0.1 で 4.8 の2倍超

Terminal-Bench 2.1 の後継にあたる74タスクのベンチマークです。

| モデル | スコア | 備考 |
|:---|:---:|:---|
| **Claude Opus 5** | **43.3%**（max） | **xhigh では 44.4%** が最良値との報告も |
| Claude Fable 5 | 33.7% | 最上位モデル |
| Claude Opus 4.8 | 18.7% | 前世代 |

**Opus 4.8 比で2.3倍**。世代交代としては明らかに不連続な伸びで、公式も「より低いタスク単価で Opus 4.8 の performance を2倍以上にした」と表現しています。

> **効果の高い effort が xhigh である点**は実務的に重要です。「max が常に最良」ではなく、**コーディング/エージェントは xhigh が最適解**というのは Opus 4.7 以降の一貫した傾向です。

### 2-2. 知識労働: GDPval-AA v2 で 1861 Elo

**Artificial Analysis による独立測定**です。GDPval-AA は経済的に価値のある知識労働タスク（金融・法務など）を Elo で評価します。

| モデル | GDPval-AA v2（Elo） | AA-Briefcase（Elo） |
|:---|:---:|:---:|
| **Claude Opus 5（max）** | **1861** | **1720** |
| Claude Fable 5 | 1747 | 1574（-146） |
| GPT-5.6 Sol（max） | 1736 | — |

**Fable 5・Sol を100点超引き離して単独1位**です。Elo は %スコアではないため「1861点＝正答率」ではなく、**モデル同士の相対的な勝率**を表す指標である点に注意してください（この読み方は [Opus 4.8 完全ガイド](/mdTechKnowledge/blog/claude-opus-4-8-guide/) の Elo 解説と同じです）。

### 2-3. 総合知能とコスト効率（Artificial Analysis）

| 指標 | Claude Opus 5 | 比較対象 |
|:---|:---|:---|
| **Intelligence Index** | **61（max）＝1位** | Fable 5: 60（実質同着）／GPT-5.6 Sol: 59 |
| **Coding Agent Index** | **同着1位**（xhigh × Claude Code） | — |
| **Index 1タスクあたり平均コスト** | **$2.03（max）** | Fable 5（フォールバック込み）$2.75 ／ Opus 4.8 $1.80 ／ Sonnet 5 $1.53 |
| Terminal-Bench v2.1 | **89%（max）** | 首位 GPT-5.6 Sol（xhigh）とほぼ同等 |
| Humanity's Last Exam | **53%** | Fable 5 と同水準 |

**「知能1位」と「コスト効率」を同時に取った**のがこのモデルの本質です。Fable 5 より賢く（実質同着）、かつ**1タスクあたり約26%安い**。一方で **Opus 4.8（$1.80）や Sonnet 5（$1.53）より高い**のも事実なので、「全部 Opus 5」ではなく用途で使い分ける前提は変わりません。

### 2-4. その他の公式主張

| ベンチマーク | 公式の主張 |
|:---|:---|
| **ARC-AGI 3** | **次点モデルの3倍**のスコア（第三者集計では Opus 5 **30.2%** / GPT-5.6 Sol 7.8% / **Opus 4.8 1.5%**） |
| **CursorBench 3.2** | max effort で **Fable 5 のピークと 0.5% 差**、タスク単価は半分 |
| **Zapier AutomationBench** | 同コストで次点モデルの**約1.5倍**の pass rate |
| **OSWorld 2.0** | **Fable 5 の最良値を上回り**、コストは約1/3 |
| 有機化学タスク | Opus 4.8 比 **+10.2ポイント** |
| タンパク質配列予測 | Opus 4.8 比 **+7.7ポイント** |

導入企業のコメントも具体的です。Cursor は「Opus の速度とコストで Fable 5 に近い知能」、Devin は「**難しいデバッグで特に強い**」、Lovable は「**Opus 4.7 比 +22%**、実行ごとのブレが大幅に減った」、JetBrains は「Claude のモデル間で**最も明確な問題解決能力の飛躍**」と評しています。

> **注**: 一部の二次情報に SWE-bench Verified/Pro のスコアが出回っていますが、**Anthropic 公式発表には SWE-bench 系の数値は掲載されていません**（公式チャートは画像で提供され、比較表の形にはなっていません）。裏の取れない数値のため本記事では採用しません。

### 2-5. ⚠️ 留保: 幻覚率は上がっている

手放しの称賛では実務判断を誤ります。Artificial Analysis の **AA-Omniscience**（事実知識）では次の結果が出ています。

- **正答率**: Opus 4.8 比 **+7ポイント**（改善）
- **幻覚率**: **+14ポイント上昇して 50%**（悪化）

つまり「**知っていることは増えたが、知らないことを知らないと言わない頻度も増えた**」という状態です。エージェントの自律実行や事実性が critical な用途（レポート生成、調査業務）では、**Opus 5 に切り替えたからといって検証層を薄くしてはいけない**、という実務上の結論になります。

### 2-6. 苦手領域

公式が明言している弱点もあります。**サイバーセキュリティのエクスプロイト系タスクと自律的な生物学研究では、Mythos 5 に及びません**。これらの領域は Mythos 5（Project Glasswing 限定）の担当範囲であり、Opus 5 は汎用フロンティアという役割分担です。

## 3. API の破壊的変更は2つ — モデルID差し替えだけでは済まない

Opus 4.8 → Opus 5 は「IDを変えるだけ」ではありません。**400エラーになる変更が1つ、silent に挙動が変わる変更が1つ**あります。

### 3-1. 【破壊的変更①】thinking が既定オン

| | Opus 4.8 | **Opus 5** |
|:---|:---|:---|
| `thinking` を省略したとき | **思考なしで実行** | **adaptive で思考する** |

ワイヤ上の値は変わっておらず、`thinking: {"type": "adaptive"}` は今も有効で既定と等価です。**変わったのは「省略時の既定」**です。

これが厄介なのは、**エラーにならず、コストと出力長に影響する**点です。

> **`max_tokens` は「思考＋応答テキスト」の合計に対する上限**です。4.8 で「思考なし前提」に `max_tokens` を切り詰めていたワークロードは、**Opus 5 で応答が途中で切れる**可能性があります。

対処は2択です。

1. `max_tokens` に余裕を持たせる（推奨）
2. 明示的に `thinking: {"type": "disabled"}` を指定する（ただし次項の制約あり）

### 3-2. 【破壊的変更②】thinking 無効化は effort `high` 以下でのみ可

**`thinking: {"type": "disabled"}` を effort `xhigh` または `max` と併用すると 400 エラー**になります。Opus 4.8 では effort と独立して無効化できたため、これは明確な破壊的変更です。

```python
# Opus 5 では 400 エラー
client.messages.create(
    model="claude-opus-5",
    max_tokens=4096,
    thinking={"type": "disabled"},
    output_config={"effort": "xhigh"},   # ← disabled と併用不可
    messages=[...],
)
```

**判定はリクエスト単位**です。同じ会話の途中で effort を `xhigh` に上げると、それまで通っていても**そのリクエストだけ弾かれます**。thinking を無効化している経路は、呼び出し箇所を全部監査してください。

移行方法は「thinking を有効に戻す」か「effort を `high` 以下に下げる」の2択ですが、**Opus 5 は `low`/`medium` でも十分強い**ため、レイテンシ重視の経路は「`medium` ＋ thinking オン」の方が「`xhigh` ＋ thinking オフ」より筋が良いケースが多くなります。

### 3-3. thinking を無効化したときの2つの失敗モード

やむを得ず thinking を切る場合、Opus 5 特有の2つの症状を知っておく必要があります。**どちらも thinking を有効化すれば解消**します。

**① ツール呼び出しがプレーンテキストとして出力される**

構造化された `tool_use` ブロックではなく、**ユーザー向けテキストの中にツール呼び出しを書いてしまう**ことがあります。厄介なのは、

- **ターンは正常終了し、エラーも出ない**
- **呼び出しは実行されない**
- エージェントループでは、その偽テキストが会話履歴に残って後続ターンを歪める

という点です。ハーネス側からは「成功したのに何もしていないターン」に見えます。検索など**ツール多用のワークロードで起きやすい**とされています。

緩和策は、**前置きを許可する**こと（この症状は「前置きの抑制」が引き金とみられています）。

> 「ツールを使う前に短い一文を述べてもかまいません。」

**② `<thinking>` タグが応答に漏れる**

内部XMLが可視応答に混入することがあります。ここは**直感に反する2つのルール**があります。

- **「考えるな/推論するな」という指示は削除する** — かえってタグ漏れが増えます
- **タグ名を名指ししない** — 「thinkingタグを出すな」より、汎用形の方が効きます

> 「応答に内部タグやシステムタグを含めないでください。」

## 4. Effort — 「効き方」が過去最高に強くなった

公式は「**Opus 5 は追加の effort を、これまでのどの Opus よりも確実に結果の向上へ変換する**」と述べています。だからこそ、**過去モデルから引き継いだ effort 設定は、たいてい最適ではありません**。

| レベル | Opus 5 での位置づけ |
|:---|:---|
| `max` | 最深の推論。レイテンシ非依存で正確性最優先のとき。過剰思考のリスクもあり |
| **`xhigh`** | **コーディング・エージェント用途の推奨値**（Coding Agent Index 同着1位もこの設定） |
| **`high`** | **API 既定値**。知能重視の一般用途の出発点 |
| `medium` | コスト削減の第一段。**Opus 5 では想像以上に品質が保たれる** |
| `low` | 短くスコープの狭いタスク、レイテンシ重視 |

推奨する進め方は、**「まず既定の `high` から始め、自分の評価セットで上下に振る」**ことです。公式も「品質が保てるところは下げてトークンとレイテンシを節約し、最も要求の厳しい仕事では上げる」と明記しています。

**低 effort の強さは Opus 5 の売りのひとつ**で、`low`/`medium` が「高設定の何分の一かのトークンとレイテンシで強い品質」を出すと公式が capability として挙げています。effort による出力トークン量は **low→max でおよそ8倍の幅**があるため、ここは最大のコストレバーです。

> **`xhigh`/`max` を使うときは `max_tokens` を大きく取る**こと（64K 以上が目安）。思考とツール呼び出し・サブエージェントの往復に十分な余地が必要です。

## 5. 新機能・仕様変更

### 5-1. プロンプトキャッシュ最小が 512 トークンに半減

| モデル | 最小キャッシュ可能長 |
|:---|:---:|
| **Opus 5** | **512 トークン** |
| Opus 4.8 | 1,024 トークン |
| Opus 4.7 | 2,048 トークン |
| Opus 4.6 | 4,096 トークン |

**コード変更なしで効いてくる改善**です。「短すぎてキャッシュされなかった」プロンプトが対象になる可能性があるので、以前キャッシュを諦めた箇所は再確認する価値があります（世代が新しいほど小さいわけではない点にも注意——4.6 は 4096 で最大）。

### 5-2. mid-conversation tool changes（ベータ）

**会話の途中でツールを追加・削除しても、プロンプトキャッシュが壊れない**新機能です。従来 `tools` は会話の生存期間中は固定で、編集するとプレフィックス全体が無効化されていました。

- ベータヘッダー: `mid-conversation-tool-changes-2026-07-01`
- `{"role": "system"}` メッセージに `tool_addition` / `tool_removal` ブロックを載せる
- 追加するツールは事前に `tools[]` に **`"defer_loading": true`** で宣言しておく必要がある

「モード切替でツールセットを差し替える」「権限に応じてツールを絞る」といった実装が、**キャッシュを捨てずに**できるようになります。

### 5-3. fallbacks の `"default"` モード（ベータ）

Opus 5 は**サイバーセキュリティ関連のセーフガードが強化**されており、安全性分類器がリクエストを拒否することがあります。この場合 **HTTP 200 で `stop_reason: "refusal"`** が返るため、`response.content[0]` を無条件に読むコードは壊れます。

```python
response = client.messages.create(model="claude-opus-5", max_tokens=1024, messages=[...])
if response.stop_reason == "refusal":
    handle_refusal()      # content は空（出力前拒否）または部分的
else:
    print(response.content[0].text)
```

従来はフォールバック先を自分で指定していましたが、新しい `"default"` モードは**拒否カテゴリに応じて Anthropic 推奨のフォールバック先へ自動ルーティング**します（cyber カテゴリなら Opus 4.8）。

- ベータヘッダー: `server-side-fallback-2026-07-01`（`"default"` とモデル配列の両方に対応）
- 旧 `server-side-fallback-2026-06-01` は**配列指定のみ**

モデルを固定指定するより `"default"` が推奨です。**拒否理由によって適切な代替モデルは変わる**うえ、固定先が非推奨化したときの移行作業も不要になります。

### 5-4. fast mode

| 対象 | 入力 | 出力 | 提供範囲 |
|:---|:---:|:---:|:---|
| **Opus 5 / Opus 4.8** | $10 | $50 | **Claude API のみ**（Bedrock・Google Cloud・Foundry 非対応） |

**標準の2倍単価で、出力トークン毎秒が約2.5倍**になります。リサーチプレビュー扱いで、**Batch API とは併用不可**、レート上限も標準 Opus とは別枠です。

## 6. 挙動の変化とプロンプト調整

コードを変えなくても**体感が変わる**部分です。公式が behavior changes として明記しているものを、対処とセットで整理します。

| 変化 | 症状 | 対処 |
|:---|:---|:---|
| **応答が長くなる** | ユーザー向け応答・書き出すファイルが冗長化 | **effort を下げても解決しない**。簡潔さの指示をプロンプトで与える（テストでは約20%短縮） |
| **ナレーションが増える** | エージェントセッションでツール呼び出し間の説明が増加 | 「進捗を要約せよ」型の足場は**削除**。静粛既定を与える |
| **自己検証する** | 言われなくても検証する | **「検証させる指示」を削除**（削除で過剰検証が減り、能力低下もない） |
| **スコープが広がる** | 頼んでいない改善・追加を行う | スコープ規律の指示を明示 |
| **サブエージェントに委任しすぎる** | 4.8 と**逆方向**。コストとレイテンシが増える | 4.8 向けの「もっと委任せよ」は**撤去**し、上限を設ける |
| **自己訂正を語りすぎる** | 過去の誤りを長々と説明 | 訂正はユーザーの判断が変わる場合のみ、と指示 |

とくに注意したいのが**「検証指示の削除」**です。「最終検証ステップを入れよ」「サブエージェントで検証せよ」といった、**従来はベストプラクティスだった指示が Opus 5 では逆効果**になります。プロンプトライブラリに一律で入れている場合は、Opus 5 だけ例外扱いにする必要があります。

同様に、**「もっとサブエージェントを使え」という Opus 4.8 向けのチューニングは撤去**してください。Opus 5 は逆に委任しすぎる方向で、サブエージェントは1体ごとにコンテキストを再構築し、レポートを書き、それを親が読み直すため**コストとレイテンシが乗算的に増えます**。

## 7. 可用性・レート上限・周辺仕様

### 7-1. プラットフォーム別

| プラットフォーム | モデルID | 備考 |
|:---|:---|:---|
| **Claude API** | `claude-opus-5` | 全顧客に提供 |
| **Amazon Bedrock** | `anthropic.claude-opus-5` | `InvokeModel` からも到達可（レガシー統合のARN表には非掲載） |
| **Google Cloud** | `claude-opus-5` | プレフィックスなし |
| **Microsoft Foundry** | — | 提供あり |

**Opus 4.8 は上記すべてで継続提供**されます。

### 7-2. 見落としやすい制約

- **レート上限は別バケット**。Opus 4.8/4.7/4.6/4.5 は共通プールですが、**Opus 5 はそこから引きません**。トラフィックを移しても旧プールの枠が空くわけでも、旧プールの枠を引き継ぐわけでもないので、**本番移行前に Opus 5 側の上限を確認**してください。
- **Priority Tier の対象外**。Fable 5 や Opus 4.8 は対象ですが、**Opus 5・Sonnet 5・Mythos 5 は対象外**で、指定するとバリデーションエラーになります。
- **fast mode・cache diagnostics は Claude API 限定**。
- **会話途中のシステムメッセージ**（`{"role": "system"}` を `messages[]` に追加）は Opus 5 で利用可能。キャッシュを壊さずに運用指示を注入できます。
- **advisor ツール**を使う場合、Opus 5 を executor にするなら advisor 側は Opus 5 / Fable 5 / Mythos 5 のいずれかである必要があります（advisor は executor と同等以上の能力が必須）。

## 8. Opus 4.8 → Opus 5 移行チェックリスト

**必須（放置すると 400 エラーや出力切れになる）**

- [ ] モデルIDを `claude-opus-5` に更新（Bedrock は `anthropic.claude-opus-5`）
- [ ] **`thinking: disabled` × effort `xhigh`/`max` の経路を全部洗い出す** → thinking を有効化するか effort を `high` 以下へ。**リクエスト単位判定なので呼び出し箇所ごとに確認**
- [ ] **`thinking` を指定していない経路の `max_tokens` を見直す** → 既定オンになったぶん、思考＋応答の合計が上限に当たる
- [ ] `stop_reason == "refusal"` のハンドリングを `content` 読み取りの前に入れる

**推奨（品質・コスト最適化）**

- [ ] **effort を振り直す**（`high` から開始し上下に。コーディング/エージェントは `xhigh`、コスト重視は `low`/`medium` を実測）
- [ ] `xhigh`/`max` を使う経路は `max_tokens` を 64K 以上に
- [ ] **プロンプトから「検証させる指示」を削除**、ハーネスの検証ステップも見直す
- [ ] **4.8 向けの「もっと委任せよ」指示を撤去**し、サブエージェント数の上限を設ける
- [ ] 簡潔さの指示を追加（応答・成果物ファイルの両方）
- [ ] キャッシュ対象外だった短いプロンプトを再確認（最小512トークン）
- [ ] **Opus 5 のレート上限を確認**してからトラフィックを移す
- [ ] Priority Tier を使っている場合は対象外である点を確認
- [ ] `fallbacks: "default"`（`server-side-fallback-2026-07-01`）の導入を検討

## まとめ

- **Opus 5 は「値上げなしの世代交代」であり、性能の伸びは不連続**（Frontier-Bench で 4.8 の2.3倍、Intelligence Index 1位、GDPval-AA で Fable 5 を100点超引き離す）。
- ただし **AA-Omniscience の幻覚率は +14ポイント（50%）に悪化**しており、**事実性が critical な用途で検証層を薄くするのは危険**。
- **API は2つの破壊的変更**（thinking 既定オン／disabled × xhigh・max で400）があり、**モデルID差し替えだけの移行では事故る**。
- **プロンプト側の最大の落とし穴は「検証指示」と「委任の推奨」**。どちらも従来はベストプラクティスだったものが、Opus 5 では逆効果になる。**足すのではなく削る移行**である点が、これまでの世代交代と決定的に違う。

## 関連記事

- [Claude Opus 5 リリースで変わった単価とモデル選択](/mdTechKnowledge/blog/claude-opus-5-pricing-and-model-selection/) — 全モデル単価総覧と、Claude Code で旧モデル（Opus 4.8 等）を指定する方法
- [Claude Opus 4.8 完全ガイド](/mdTechKnowledge/blog/claude-opus-4-8-guide/) — 前世代の詳説（Effort 5段階の名称対応・Fast mode の経済性）
- [Claude Sonnet 5 完全ガイド](/mdTechKnowledge/blog/claude-sonnet-5-guide/) — 主力 Sonnet 帯の選択肢
- [これがラストチャンスかも③（完結編）](/mdTechKnowledge/blog/claude-fable-5-credit-period-final/) — 最上位 Fable 5 のプラン組み込みと Usage Credits
- [AIトークン単価の価格破壊が止まらない](/mdTechKnowledge/blog/llm-token-price-comparison-2026/) — 他社を含めたクラス横断の単価比較

## 出典

- [Introducing Claude Opus 5 — Anthropic 公式](https://www.anthropic.com/news/claude-opus-5)（リリース日・位置づけ・ベンチマーク主張・導入企業コメント）
- [What's new in Claude Opus 5 — Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/models/whats-new-opus-5)（1M/128K・thinking 既定オン・disabled の effort 制約・キャッシュ512・mid-conversation tool changes・fallbacks default・可用性・移行手順）
- [Pricing — Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/pricing)（$5/$25・Batch・キャッシュ倍率・fast mode）
- [Opus 5: Fable 5 level intelligence at a lower cost per task — Artificial Analysis](https://artificialanalysis.ai/articles/opus-5)（Intelligence Index 61・GDPval-AA v2 1861 Elo・AA-Briefcase 1720・タスク単価 $2.03・Terminal-Bench 89%・HLE 53%・AA-Omniscience の幻覚率）
- [Frontier-Bench v0.1 Leaderboard — llm-stats](https://llm-stats.com/benchmarks/frontier-bench-v0.1) ／ [Claude Opus 5 Benchmarks Explained — Vellum](https://www.vellum.ai/blog/claude-opus-5-benchmarks-explained)（Frontier-Bench・ARC-AGI 3 の対比数値）

*本記事の数値・仕様は 2026年7月25日時点の公開情報に基づきます。ベンチマークは測定条件（effort レベル・ハーネス）で結果が変わるため、導入判断は自社の評価セットでの実測を推奨します。*
