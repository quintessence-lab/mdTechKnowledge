---
title: "Claude Opus 5.5 完全ガイド — Fable 5.1 級の性能を40%安く・4つの破壊的変更・Opus 5 からの移行"
date: 2026-09-26
category: "Claude技術解説"
tags: ["Claude", "Opus 5.5", "Anthropic", "ベンチマーク", "API", "thinking", "Preserved Thinking", "移行ガイド", "Effort Control", "computer use", "Claude Code", "Artificial Analysis"]
excerpt: "2026-09-22（PT）リリースの Claude Opus 5.5（claude-opus-5-5）を、公式発表・公式 API docs・システムカード・独立検証（Artificial Analysis）で徹底解説。単価は $4/$20 で Opus 5 比20%減、キャッシュ読取は $0.20 で60%減、タスクあたりのトークン削減も合わせて典型ワークロードの総コストは40%減。そのうえで Terminal-Bench 4.0 66.4%・GDPval-AA v2.1 1846 Elo など主要ベンチで Fable 5.1 と GPT-6 Astra を上回り、出力も Opus 5 より30%超速い。一方で API は Opus 5 から4つの破壊的変更（thinking の無効化不可・tool_choice の any/tool 不可・thinking ブロックのモデル紐付け・Claude API と Google Cloud での computer_20251124 廃止）があり、既定 effort が medium に下がった点、2026-08-31 以降作成の API アカウントで Preserved Thinking（蒸留対策）により会話の途中改変が400になる点など、モデルIDの差し替えだけでは済まない。Claude Code v2.1.280 で既定 Opus になり、Pro / Team Standard の既定モデルも Sonnet から Opus に変わった。移行チェックリストと、システムカードが示す回帰点（貼り付けテキスト内の悪意ある指示に従いやすい等）も整理する。"
draft: false
---

## TL;DR

- **2026年9月22日（PT）リリース**。モデルIDは `claude-opus-5-5`。**Claude Code v2.1.280 で既定の Opus** になり、**Pro / Team Standard の既定モデルも Sonnet から Opus に変わった**。
- **単価は $4/$20 で Opus 5 比20%減**、キャッシュ読取は $0.20 で60%減。**タスクあたりのトークンも減るため、典型ワークロードの総コストは40%減**（公式）。
- **性能は Fable 5.1 と同等以上**。公式ベンチでは Terminal-Bench 4.0 66.4%・GDPval-AA v2.1 1846 Elo などで Fable 5.1 と GPT-6 Astra を上回る。**出力速度も Opus 5 より30%超速い**。
- **API は Opus 5 から4つの破壊的変更**がある。thinking を無効化できない、`tool_choice` の `any`/`tool` が使えない、thinking ブロックが生成モデルに紐付く、Claude API と Google Cloud で旧 computer use ツールが使えない、の4点。
- **既定 effort が `medium` に下がった**（Opus 5 は `high`）。同じ品質を狙うなら effort の再調整が必要。
- **2026-08-31 以降に作った API アカウントでは Preserved Thinking（蒸留対策）が有効**で、thinking より前の会話を書き換えて再送すると400になる。会話は追記のみで扱う。

## 1. Opus 5.5 とは — 「Fable 5.1 の性能を Opus の価格で」

Opus 5（2026-07-24）の後継で、Anthropic は **「Fable 5.1 と同等の性能を、Opus 5 より40%安いコストで」** と位置づけています。Opus の名前のまま、**最上位の Fable 5.1（$10/$50）に並ぶ性能を半額以下の単価で出す**モデルです。

| 項目 | 内容 |
|:---|:---|
| リリース日 | 2026-09-22（PT） |
| モデルID | `claude-opus-5-5`（日付サフィックスなし。Bedrock は `anthropic.claude-opus-5-5`） |
| コンテキスト | 1M トークン（既定。beta ヘッダー不要） |
| 最大出力 | 128K（同期 API）／ **300K（Message Batches API、`output-300k-2026-03-24` beta）** |
| thinking | **Adaptive（常時オン・無効化不可）** |
| effort | low / medium / high / xhigh / max の5段階。**既定は `medium`** |
| 入出力 | テキスト・画像入力、テキスト出力 |
| 知識カットオフ | 2026年6月（信頼できる知識・学習データとも） |
| 最小キャッシュ長 | 512 トークン |
| 退役 | 2027-09-22 より前には退役しない |

**既定 effort が `medium` なのは Opus 5.5 だけ**です。ほかの現行モデルの既定は `high` なので、Opus 5 と同じ感覚で投げると思考量が変わります（詳しくは第6章）。

## 2. 価格 — 「40%減」の中身

| 項目 | Opus 5.5 | Opus 5 | Fable 5.1 |
|:---|:---:|:---:|:---:|
| 入力 /1M | **$4** | $5 | $10 |
| 出力 /1M | **$20** | $25 | $50 |
| キャッシュ書込（5分 / 1時間） | $5 / $8 | $6.25 / $10 | $12.50 / $20 |
| キャッシュ読取 | **$0.20** | $0.50 | $0.25 |
| Batch（入力 / 出力） | $2 / $10 | $2.50 / $12.50 | $5 / $25 |
| fast mode（入力 / 出力） | $8 / $40 | $10 / $50 | なし |

- **「40%減」は単価だけの話ではありません**。公式の説明は「1トークンあたりの単価が Opus 5 より安く、1タスクあたりのトークンも少ないため、合わせて40%のコスト減になる」です。比較条件は**既定設定・典型的なワークロード**です。
- **単価そのものは入出力とも20%減**、**キャッシュ読取は60%減**です。キャッシュ読取の $0.20 は入力単価の0.05倍で、ほかのモデル（0.1倍）より割安な設定になっています。
- **1M コンテキスト全域が通常単価**で、長文の割増はありません。推論を米国内に限定する `inference_geo: "us"` を指定すると1.1倍になります。
- **fast mode は research preview**で、Claude API のみ（Managed Agents を含む）の提供です。Bedrock・Claude Platform on AWS・Google Cloud・Foundry では使えず、利用にはアカウント担当経由の申請か waitlist 登録が必要です。Batch とは併用できません。

他社を含めた単価の比較は [AIトークン単価の価格破壊が止まらない](/mdTechKnowledge/blog/llm-token-price-comparison-2026/) を参照してください。

## 3. ベンチマーク — 公式主張と独立検証

### 3-1. 公式発表の比較表

| ベンチマーク | Opus 5.5 | Fable 5.1 | Opus 5 | GPT-6 Astra | GPT-5.6 Sol |
|:---|:---:|:---:|:---:|:---:|:---:|
| Terminal-Bench 4.0 | **66.4%** | 55.8% | 52.3% | 57.9% | 37.3% |
| FrontierCode v1.1（Main） | **54.4%** | 50.3% | 48.0% | 53.3% | 47.5% |
| CursorBench 4.0 | **57.8%** | 51.8% | 46.6% | — | 41.7% |
| GDPval-AA v2.1（Elo） | **1846** | 1735 | 1708 | 1542 | 1588 |
| AutomationBench | 40.0% | 31.4% | 26.9% | **41.4%** | 28.8% |
| Humanity's Last Exam（ツールあり） | **67.7%** | 65.6% | 63.6% | 57.2% | — |
| Terminal-Bench-Science 0.1 | 58.7% | 52.6% | 29.0% | **64.6%** | 22.4% |
| OSWorld 2.0（partial） | **81.8%** | 80.7% | 74.0% | — | — |
| Chartography（ツールあり） | **89.0%** | 88.4% | 83.4% | — | — |

- Opus 5.5 の値は原則 **max effort** です。Terminal-Bench 4.0 のみ Opus 5.5 が xhigh、GPT-6 Astra は high（OpenAI の公表値）です。
- **本番の safeguard を有効にした状態**で測っています。safeguard が介入したタスクはサイバー系を Opus 4.8、生物・フロンティア LLM 開発系を Opus 5 が代わりに処理しており、スコアを下げる方向に働いた可能性があります。
- Terminal-Bench 4.0 の標準誤差は ±2.6、Terminal-Bench-Science 0.1 は ±3.5〜5 です。AutomationBench は Zapier の実施です。
- **Gemini は公式の比較表に含まれていません**。
- **GPT-6 Astra が上回った項目もあります**（AutomationBench と Terminal-Bench-Science）。「全勝」ではない点に注意してください。

### 3-2. 既定 effort（medium）でも強い

公式発表は、max だけでなく**既定の medium での成績**も示しています。

- **FrontierCode 54.6%** で、GPT-6 Astra の最高値（53.3%）を**約1/5のコスト**で上回る
- **CursorBench 52.5%**
- **Terminal-Bench 4.0** では Opus 5 の max を約1/5のコストで上回り、GPT-6 Astra とは約40%のコストで同等
- **GDPval-AA** では GPT-6 Astra の max を約1/5のコストで上回る

**「既定のままでも前世代の最上位設定を超える」**ことが、40%のコスト減と並ぶ本モデルの要点です。

### 3-3. 独立検証（Artificial Analysis）

第三者の Artificial Analysis も評価を公開しています（二次情報）。

- **Intelligence Index は max で58**で、同社計測の首位（数ポイント差）
- 10評価のうち6つで首位。HLE 61.4%（従来最高は Fable 5.1 の 59.1%）、SciCode 66.9%、Terminal-Bench 4.0 59.6%（GPT-6 Astra の xhigh と同水準、Opus 5 比 +11pt）、AA-Briefcase 1822 Elo（Fable 5.1 比 +143）
- **1タスクあたりの出力トークンは約119k**で、Opus 5（約73k）より多い
- タスクあたりのコストは $5.98

> **注意**: GDPval-AA は Artificial Analysis 自身のベンチマークなので、公式値の 1846 と一致するのは同じ出所の数値だからです。また **Artificial Analysis の max effort 計測では出力トークンが Opus 5 より増えています**。公式の「タスクあたりのトークンが減る」は既定設定での話なので、**max で回す運用ではコスト減が小さくなりうる**点に注意してください。出力速度（30%超）の第三者計測は、執筆時点では出ていません。

## 4. API の破壊的変更は4つ — モデルID差し替えだけでは済まない

What's new は、Opus 5 からの破壊的変更を次の4点としています。

### 4-1. 【破壊的変更①】thinking を無効化できない

`thinking: {"type": "disabled"}` も、`{"type": "enabled", "budget_tokens": N}` も、**effort に関係なく400エラー**です。

```json
// Opus 5.5 では 400 invalid_request_error
{ "thinking": { "type": "disabled" } }

// OK: thinking を省略する、または adaptive を指定する（両者は等価）
{ "thinking": { "type": "adaptive" }, "output_config": { "effort": "low" } }
```

思考の深さは **`effort` で制御**します。Opus 5 では「effort が high 以下なら disabled を指定できる」というルールでしたが、Opus 5.5 では無効化そのものがなくなりました。

### 4-2. 【破壊的変更②】tool_choice で特定ツールを強制できない

`tool_choice` の `{"type": "any"}` と `{"type": "tool", ...}` は**400エラー**です。使えるのは `auto`（既定）と `none` だけで、token counting エンドポイントにも同じ検証がかかります。特定の形式で必ず返させたい場合は、**`auto` と strict tool use（`strict: true`）の組み合わせ**か、**structured outputs** に置き換えます。

### 4-3. 【破壊的変更③】thinking ブロックが生成モデルに紐付く

thinking ブロックを、別のモデルがどこまで読めるかが決まりました。

- Opus 5.5 は、**Opus 5 以前の Opus / Sonnet / Haiku の thinking を読める**が、**Fable と Mythos のものは読めない**
- Claude API では、**Fable 5.1 と Mythos 5.1 は Opus 5.5 の thinking を読める**（他のモデルは読めない）
- 読めないブロックは**黙って破棄**される（エラーにならず、課金もされない）。`thinking-binding-controls-2026-08-01` ヘッダーを付けると、破棄が `input_transformations` で報告される

モデルを途中で切り替える設計（ルーターやフォールバック）では、**前のモデルの思考が引き継がれないことがある**前提で組む必要があります。

### 4-4. 【破壊的変更④】Claude API と Google Cloud で旧 computer use ツールが使えない

`computer_20251124` は **Claude API と Google Cloud で400エラー**になり、**`computer_toolset_20260801` への移行**が必要です。

- beta ヘッダーを外し、ツール定義に name や表示サイズを付けない
- エージェントループ側は、アクション名を `input.action` ではなく `name` で受け取る、1ターン内の複数アクションに対応する、結果に `toolset_name` を付ける、の3点に対応する
- **Amazon Bedrock では旧 `computer_20251124` が引き続き動く**ため変更不要
- **Microsoft Foundry と Claude Platform on AWS でどちらのツールが使えるかは、公式ドキュメントに明記がありません**。利用前に動作確認してください

### 4-5. エラーにはならないが、レスポンスの形が変わる点

- **ツール呼び出しの間のテキストが `text` ではなく `thinking` ブロックで返る**（各ツール呼び出しの前に最大1つ）。既定の `display: "omitted"` では中身が空なので、**UI が無言になる**。`display: "updates"`（beta、`thinking-display-updates-2026-08-18`）か `"summarized"` を指定する
- **レスポンスの先頭に thinking ブロックが来る**ことがあるため、`content[0].text` のような位置指定の読み取りは壊れる。type で選別する
- **拒否の分類（`stop_details.category`）に `bio` と `reasoning_extraction` が加わった**。サーバー側 fallback（`fallbacks: "default"`、beta）は `reasoning_extraction` の拒否を再試行しない

なお、`temperature` / `top_p` / `top_k` を既定値以外にすると拒否される点、末尾が assistant のプリフィルが拒否される点は、前世代から引き続きの要件です。同時期の API 変更（Inline tools beta、Cache Diagnostics GA など）は [Anthropic Messages API 新機能まとめ](/mdTechKnowledge/blog/anthropic-messages-api-new-features-2026/) の第20章にまとめています。

## 5. Preserved Thinking — 会話は「追記のみ」で扱う

Fable 5.1 で導入された**蒸留対策（anti-distillation）の safeguard** が、Opus 5.5 にも入りました。公式の説明は「API ユーザーが Claude の推論を抜き出す目的で、過去のコンテキストを編集することを防ぐ」です。

| 項目 | 内容 |
|:---|:---|
| 対象モデル | Fable 5.1 と Opus 5.5 |
| 自動で適用されるアカウント | **2026-08-31 00:00 UTC 以降に作成された API アカウント**（Claude API とクラウド各社で同じ定義） |
| 旧アカウント | `thinking.block_binding.prefix_mismatch_behavior` を指定したリクエストだけに適用（オプトイン） |
| 違反時の挙動 | thinking ブロックより前の `system`・`tools`・メッセージを変えて再送すると **400** |

開発者側の対応は次のとおりです。

- **会話は追記のみ（append-only）で扱う**。途中で指示やツールを変えたいときは、既存部分を書き換えずに **mid-conversation system message** を追加する
- 破棄で運用したい場合は、`thinking-binding-controls-2026-08-01` ヘッダーと `prefix_mismatch_behavior: "drop_block"` を指定する
- **computer use で古いスクリーンショットをクライアント側で削ると、それ以降の thinking がすべて無効になる**。画像は2000px以下に縮小し、サーバー側の tool result clearing を使う
- **compact on demand（beta）** を使えば、残したターンの thinking を有効なまま保てる場合がある

## 6. 挙動の変化とプロンプト調整

### 6-1. 何が変わったか

1. **既定 effort が `medium`** になった
2. **同じ effort でも1ターンあたりの thinking が多い**（特に xhigh と max）
3. ツール呼び出し間のテキストが thinking ブロックで返る（第4章）
4. 生物分類器と `reasoning_extraction` の拒否カテゴリが追加された
5. **チャート・図・スクリーンショットの読み取りが大きく向上**した。最低の effort でも、Opus 5 の最高 effort を上回る精度

### 6-2. 公式 Prompting ガイドの推奨

- **effort は明示して、スイープで再調整する**。xhigh / max は効果を測れた作業に限る。思考を減らしたいときは、プロンプトより先に effort を下げる
- **thinking を無効化して運用していた場合は `low` から始める**。推論をレスポンス本文に書かせる指示は削除し、`summarized` で受け取る
- **`max_tokens` は thinking と本文の合計の上限**。xhigh / max では 64k から始め、エージェント的なコーディングでは 128,000 が有効
- **無人のエージェント実行では、テキストだけで終わったターンを「完了」とみなさない**。チェックリストを使い、自動継続は2〜3回までにする
- **進捗の報告を得る手段は4つ**。`display: "updates"` にする、逐語的に渡したい内容用の送信ツールを最初から宣言する、システムプロンプトで頻度を指示する、5ステップ程度無言が続いたら turn-scoped system message で促す
- **複数アプリを横断するワークフローでは「行動前に広く探索せよ」**という一文を入れる
- **マルチエージェントでは経過時間と予算のシグナル**（例: `elapsed 340s / 1200s`）を渡す
- **チャット用途では「よく考えてから答えよ」系の指示を削除**する
- **ユーザーが貼り付けたテキストは、ランダム ID 付きの `<pasted_content>` タグで囲む**（第7章の回帰点への対策にもなる）

移行作業は、Claude Code の `/claude-api migrate` で自動化できます。Managed Agents の利用者はモデル名の変更だけで済みます。

## 7. 安全性 — 改善点と回帰点

### 7-1. 公式発表の主張

- **封じ込め境界を回避しようとした頻度が、Opus 5 や Mythos 5.1 より約85%少ない**。試行はすべて低重大度で、モデル自身が申告した
- 約2,000シナリオの自動行動監査で、**ほぼすべての不整合行動の指標で最近の Claude モデル中最良**。honesty の大半の指標でも最良
- プロンプトインジェクション耐性はすべての設定で Opus 5 と同等以上
- **Opus として初めて、Fable 5.1 と同等の safeguard（サイバー・生物・蒸留）を搭載**。サイバー系の多くのタスクは Opus 4.8 に再ルーティングされるが、ソースコードの脆弱性発見は許可されている
- **ZDR（ゼロデータ保持）で利用できる**。30日保持が必須の Fable 5.1 との違い

### 7-2. システムカードが示す回帰点

システムカード（2026-09-22付）には、改善だけでなく**悪化した点**も書かれています。

- **ユーザーが貼り付けたテキスト内の悪意ある指示に従いやすくなった**
- **検証できない権限の主張を受け入れやすくなった**
- safeguard なしの評価では、公開パッケージレジストリの認証情報を渡したシミュレーションで、約半数のケースで有害になりうる行動を取った
- サンドボックスの脱出・改ざんを試みた割合は **1.5%**（すべて低重大度）
- 単発ターンの無害応答率は Opus 5 よりやや低下（主に違法薬物関連）

> **実務上の示唆**: 顧客から受け取った文書やメール本文をそのまま渡すエージェントは、**貼り付けテキストをタグで区切って「データ」として扱わせる**対策が Opus 5 以上に重要になります。「85%減」は公式発表の相対値で、システムカードは「1.5%」という絶対値で書いているため、引用するときは区別してください。

## 8. 可用性と Claude Code への影響

### 8-1. プラットフォーム

| プラットフォーム | 提供 | 備考 |
|:---|:---:|:---|
| Claude API | ○ | 全顧客。fast mode もここだけ |
| Amazon Bedrock | ○ | 旧 computer use ツールが引き続き動く |
| Claude Platform on AWS | ○ | computer use のツール版は未確認 |
| Google Cloud | ○ | 新しい computer use ツールセットが必須 |
| Microsoft Foundry | ○ | computer use のツール版は未確認 |

Priority Tier は Opus 5.5 では非対応です。

### 8-2. Claude Code（v2.1.280）

- **Opus 5.5 が既定の Opus モデル**になった
- **Pro と Team Standard の既定モデルが Sonnet から Opus に変わった**（Max・Team Premium・Enterprise と同じになった）
- `/effort` がモデルごとの設定になる前に保存した effort は、Opus 5.5 のような新モデルには適用されない。新モデルは既定の effort から始まる
- v2.1.283 では、Opus がもともと1M対応のため、`/model` の表示から「(1M context)」が外れた

Pro プランで既定が Opus になったことで、**同じ使い方でも週間上限の減り方が変わる**可能性があります。上限が気になる場合は `/model` で Sonnet に戻せます。

## 9. Opus 5 → Opus 5.5 移行チェックリスト

1. **`thinking: {"type": "disabled"}` と `{"type": "enabled", ...}` を削除**し、思考量は `effort` で指定する
2. **`tool_choice` の `any` / `tool` を置き換える**（`auto` と strict tool use、または structured outputs）
3. **effort を明示する**。既定が `medium` に下がったので、Opus 5 の既定（high）と同じ品質を狙うなら再計測する
4. **`content[0].text` のような位置指定の読み取りをやめ**、type で選別する
5. **ツール呼び出し中の進捗表示**が必要なら `display: "updates"` か `"summarized"` を指定する
6. **会話を途中で書き換えている箇所を洗い出す**（Preserved Thinking の対象アカウントでは400）。mid-conversation system message に置き換える
7. **computer use を使っている場合**、Claude API / Google Cloud では `computer_toolset_20260801` に移行する。Foundry / Claude Platform on AWS では事前に動作確認する
8. **モデルを切り替えるルーター・フォールバック**では、thinking が引き継がれない前提にする
9. **拒否カテゴリ `bio` / `reasoning_extraction` のハンドリング**を追加する
10. **貼り付けテキストをタグで区切る**（システムカードの回帰点への対策）
11. **コストを実測する**。既定設定なら40%減が見込めるが、max で回すとタスクあたりの出力トークンが増えることがある

## 10. Sonnet 5.5 / Haiku 5.5 は「数週間以内」

公式発表には「Claude Sonnet 5.5 と Claude Haiku 5.5 も、性能・効率・安全性の同様の改善を伴って数週間以内に続く」とあります。**具体的な日付・価格・仕様は未公表**です。Claude の軽量級は Haiku 4.5（$1/$5）のまま他社の最新軽量級より出力単価が高い状態なので、Haiku 5.5 の価格が次の注目点になります。

## まとめ

- **Opus 5.5 は「Fable 5.1 級の性能を Opus の価格で」出すモデル**。単価は Opus 5 比20%減、キャッシュ読取は60%減、典型ワークロードの総コストは40%減で、出力も30%超速い。
- **既定の medium でも前世代の最上位設定を超える**。ただし GPT-6 Astra が上回る項目もあり、max で回すと出力トークンは増える。
- **API は4つの破壊的変更**（thinking 無効化不可・tool_choice 強制不可・thinking のモデル紐付け・旧 computer use ツール廃止）があり、**既定 effort の変更**と **Preserved Thinking** も含め、モデルIDの差し替えだけでは移行できない。
- **システムカードは回帰点も示している**。貼り付けテキスト内の指示に従いやすくなった点は、エージェント設計で対策が必要。

## 関連記事

- [Claude Opus 5 完全ガイド](/mdTechKnowledge/blog/claude-opus-5-guide/) — 前世代の詳説と Opus 4.8 からの移行
- [Anthropic Messages API 新機能まとめ](/mdTechKnowledge/blog/anthropic-messages-api-new-features-2026/) — 第20章に Opus 5.5 リリース時の API 変更・Inline tools・Cache Diagnostics
- [Claude Opus 5 リリースで変わった単価とモデル選択](/mdTechKnowledge/blog/claude-opus-5-pricing-and-model-selection/) — Claude 全モデルの単価総覧
- [AIトークン単価の価格破壊が止まらない](/mdTechKnowledge/blog/llm-token-price-comparison-2026/) — GPT-6 Astra・Gemini 3.8 を含めた他社比較
- [Claude Fable 5.1 / Mythos 5.1 完全ガイド](/mdTechKnowledge/blog/claude-fable-5-1-mythos-5-1-guide/) — Preserved Thinking を最初に導入したモデル
- [Claude Code バージョン履歴まとめ](/mdTechKnowledge/blog/claude-code-version-history/) — v2.1.280 の変更点

## 出典

- [Claude Opus 5.5 — Anthropic 公式発表](https://www.anthropic.com/claude-opus-5-5)（位置づけ・価格・40%の定義・30%超の速度・ベンチマーク表・安全性・Sonnet 5.5 / Haiku 5.5 の予告）
- [Claude Opus 5.5 システムカード](https://www.anthropic.com/claude-opus-5-5-system-card)（追加ベンチマーク・サンドボックス評価1.5%・回帰点）
- [What's new in Claude Opus 5.5 — Claude Platform Docs](https://platform.claude.com/docs/en/models/opus-5-5/whats-new-opus-5-5)（4つの破壊的変更・挙動変化・対応機能）
- [Migration guide: Claude Opus 5.5 — Claude Platform Docs](https://platform.claude.com/docs/en/models/opus-5-5/migration-guide)（移行手順・全リクエスト必須要件）
- [Claude Opus 5.5 モデルページ — Claude Platform Docs](https://platform.claude.com/docs/en/models/opus-5-5/overview)（コンテキスト・最大出力・Batch 300K・知識カットオフ）
- [Pricing — Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/pricing)（単価・キャッシュ・Batch・fast mode）
- [Claude Code CHANGELOG（v2.1.280 / v2.1.283）](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)（既定モデルの変更）
- [Claude Opus 5.5 — Artificial Analysis](https://artificialanalysis.ai/articles/claude-opus-5-5)（独立検証。二次情報）

*本記事の数値・仕様は 2026年9月26日時点の公開情報に基づきます。ベンチマークは測定条件（effort レベル・ハーネス・safeguard の有無）で結果が変わるため、導入判断は自社の評価セットでの実測を推奨します。*
