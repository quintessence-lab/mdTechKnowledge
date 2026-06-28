---
title: "Anthropic Messages API 新機能まとめ（2026年5〜6月）— Web検索動的フィルタ・キャッシュ診断・会話途中systemメッセージ"
date: 2026-06-20
updatedDate: 2026-06-28
category: "Claude技術解説"
tags: ["Anthropic", "Claude API", "Messages API", "Web Search", "Cache Diagnostics", "Prompt Caching", "Opus 4.8", "プロンプトキャッシュ"]
excerpt: "2026年5〜6月に Anthropic Messages API へ追加された重要な新機能を公式リリースノート一次ソースで整理。Web検索ツールのGAと動的フィルタリング（精度平均+11%・入力トークン-24%、code_execution併用で無料）、プロンプトキャッシュのミス原因を返す Cache Diagnostics（cache_miss_reason 6種）、Opus 4.8 の会話途中 system メッセージ（キャッシュ維持）、拒否種別を返す stop_details まで、対応モデル・betaヘッダー・コード例つきで横断解説する。"
draft: false
---

> ## 要点
>
> - **Web検索ツールが GA**（betaヘッダー不要）。**動的フィルタリング**で検索結果をコード実行でその場フィルタし、精度を**平均 +11%**、入力トークンを**平均 −24%** 改善。`code_execution` は web search / web fetch 併用時に**無料**。
> - **Cache Diagnostics（public beta）**: `diagnostics.previous_message_id` を渡すと、プロンプトキャッシュのプレフィックスが**どこで食い違ったか**を `cache_miss_reason`（6種）で返す。betaヘッダー `cache-diagnosis-2026-04-07`。
> - **会話途中 system メッセージ（Opus 4.8）**: 会話の途中に `role: "system"` を差し込んでも**プロンプトキャッシュのヒットを維持**できる。betaヘッダー不要。
> - **Refusal categories**: 拒否レスポンスの `stop_details.category`（`cyber` / `bio` / `null`）でルーティングを分岐できる。betaヘッダー不要。
> - **Advisor Tool** は本記事では概要のみ。詳細は [Advisor Tool ガイド](/mdTechKnowledge/blog/anthropic-advisor-tool-guide/) を参照。

## はじめに — 2026年5〜6月の Messages API は何が変わったか

2026年5月から6月にかけて、Anthropic は Claude の Messages API に複数の重要な新機能を追加しました。モデル本体（Opus 4.8 など）のリリースに注目が集まる一方で、**API そのものの使い勝手・運用性を底上げする機能**が静かに積み上がっています。本記事はそれらを横断的にまとめ、API 利用者がすぐ実装に移せるよう、対応モデル・beta ヘッダー・コード例つきで整理します。

本記事で扱う主要トピックは次の4つです。

1. **Web 検索ツールの GA と動的フィルタリング** — 精度とトークン効率の両取り
2. **Cache Diagnostics** — プロンプトキャッシュのミス原因を API が教えてくれる
3. **会話途中 system メッセージ（Opus 4.8）** — 長時間セッションでも指示変更でキャッシュを壊さない
4. **Refusal categories（拒否種別）** — 拒否レスポンスを分類してルーティングに使う

加えて、**Advisor Tool**（高知能アドバイザー＋高速エグゼキューターのペアリング）も同時期に拡張されていますが、こちらは既に専用記事があるため本記事では1〜2文の概要に留めます。

> 本記事の数値・仕様は、原則として Anthropic 公式の[リリースノート](https://platform.claude.com/docs/en/release-notes/overview)・各機能ドキュメント（platform.claude.com）と公式ブログを一次ソースとして記載しています。公式に明記がない点は本文中で「推測」と明示します。

### 新機能一覧（早見表）

| 機能 | 主な内容 | 対応モデル | beta ヘッダー | 公開日（発表） |
| --- | --- | --- | --- | --- |
| Web 検索ツール GA + 動的フィルタリング | 検索結果をコード実行でフィルタ。精度+11% / 入力トークン−24% | Sonnet 4.6 / Opus 4.6 以降（最新版は Opus 4.8・Fable 5 等も対応） | 不要（GA） | 2026/2/17 |
| code execution が web 系併用で無料 | web search / web fetch と組み合わせ時に課金なし | 同上 | 不要（GA） | 2026/2/17 |
| Web 検索の SEC filing 強化 | 財務リサーチ・デューデリの一次ソース根拠を強化 | web search 対応モデル | 不要 | 2026/5/18 |
| Cache Diagnostics | キャッシュミス箇所と理由（`cache_miss_reason` 6種）を返す | Claude API（Bedrock/Vertex 非対応） | `cache-diagnosis-2026-04-07` | 2026/5/13 |
| 会話途中 system メッセージ | 会話途中の `role: "system"` でもキャッシュ維持 | Opus 4.8 | 不要 | 2026/5/28 |
| Refusal categories（`stop_details`） | 拒否種別 `category` でルーティング分岐 | refusal を返す全モデル | 不要 | 2026/5/28（公式文書化） |
| Advisor Tool（参照のみ） | 助言役モデルと実行役モデルのペアリング | Opus 4.8 等 | `advisor-tool-2026-03-01` | 2026/4/9 |

## 1. Web 検索ツールの GA と動的フィルタリング

### 何が変わったか

2026年2月17日、**web search ツール**と **programmatic tool calling** が GA（一般提供）となり、**beta ヘッダーが不要**になりました。同時に web search / web fetch に **動的フィルタリング（dynamic filtering）** が導入されています。

動的フィルタリングの核心は、Claude が**検索結果をいったんコード実行（code execution）でその場フィルタし、不要な部分を context window に入れない**点にあります。従来の基本 web search では、検索結果の取り込み・複数サイトの HTML 取得・全文に対する推論を行っており、その大半が無関係な内容で、回答品質をかえって落とすことがありました。動的フィルタリングは、Claude が**コードを書いて実行し、結果を post-process（後処理）**してから context に載せることで、これを解消します。

### 効果（公式ブログの数値）

公式ブログ [Improved web search with dynamic filtering](https://claude.com/blog/improved-web-search-with-dynamic-filtering) が報告するベンチマーク結果は次の通りです。

| 指標 | 内容 | Sonnet 4.6 | Opus 4.6 |
| --- | --- | --- | --- |
| 精度（平均改善） | 各ベンチ平均 | **+11%**（全体平均） | **+11%**（全体平均） |
| BrowseComp | ブラウジング系タスク | 33.3% → **46.6%** | 45.3% → **61.6%** |
| DeepsearchQA（F1） | 深掘り検索QA | 52.6% → **59.4%** | 69.8% → **77.3%** |
| 入力トークン | 平均削減 | **−24%**（全体平均） | **−24%**（全体平均） |

> 精度は平均で **+11%**、入力トークンは平均で **−24%** という「品質とコストの両取り」が動的フィルタリングの売りです。なお価格加重トークン（price-weighted tokens）は Sonnet 4.6 では両ベンチで減少、Opus 4.6 では増加しており、コスト影響はフィルタの複雑さで変動する点に注意してください（公式ブログ記載）。

### code execution が無料になる条件

トークン効率に直結する重要ポイントとして、**code execution ツールは web search / web fetch と併用する場合は無料**です（2026年2月17日のリリースノートに明記）。動的フィルタリングは内部で code execution を使うため、**動的フィルタリングを使う限り追加のコード実行課金は発生しない**ことになります。単独で code execution を使う場合は別途課金です。

なお動的フィルタリングを使うには **code execution ツールを有効化する必要があります**。

### 対応モデルとツールバージョン

動的フィルタリングはツールのバージョンで段階的に拡張されています。最新ドキュメントの記載は次の通りです。

| ツールバージョン | 内容 | 動的フィルタリング |
| --- | --- | --- |
| `web_search_20250305` | 基本 web search | 非対応 |
| `web_search_20260209` | 動的フィルタリング対応 | 対応 |
| `web_search_20260318` | 上記 + `response_inclusion` 制御を追加 | 対応 |

最新版（`web_search_20260318`）は **2026年6月11日にリリース**され（同日 web fetch も `web_fetch_20260318`、code execution も `code_execution_20260521` に対応。いずれも **beta ヘッダー不要**）、動的フィルタリングがサポートするモデルは、公式ドキュメントによると **Claude Fable 5 / Opus 4.8 / Mythos 5 / Mythos Preview / Opus 4.7 / Opus 4.6 / Sonnet 4.6** です。`web_search_20260318` は、code execution で消費済みの検索結果ブロックをレスポンスから落とす `response_inclusion`（既定 `"full"`、`"excluded"` で除外）をエージェント向けに追加しています。なお `"excluded"` の除外対象は **code execution で完了消費された結果ブロックに限られ**、直接呼び出しの結果や完了前に pause した呼び出しの結果は次ターンで必要なため常に全文返却されます。

> プラットフォーム制約: web search（動的フィルタリング有無問わず）は Claude API・Claude Platform on AWS・Microsoft Foundry で利用可能。**Vertex AI は基本 web search のみ（動的フィルタリング非対応）**、**Amazon Bedrock は web search 非対応**です（公式ドキュメント）。

### 最小コード例（動的フィルタリング）

`web_search_20260209` 以降を指定し、code execution を有効にすればフィルタリングが既定で働きます。

```python
import anthropic

client = anthropic.Anthropic()

response = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=4096,
    messages=[
        {
            "role": "user",
            "content": "AAPL と GOOGL の現在の株価を調べて、P/E レシオが良い方を計算して。",
        }
    ],
    tools=[{"type": "web_search_20260209", "name": "web_search"}],
)
print(response)
```

### SEC filing 対応の強化（2026年5月18日）

2026年5月18日のリリースノートで、**web search ツールが SEC filing（米国証券取引委員会への開示書類）のデータをよりリッチに返す**よう強化されました。これにより、財務リサーチ・決算分析・デューデリジェンスのワークフローを、引用つきの一次ソースに根拠づけしやすくなっています。財務系エージェントを構築する場合、動的フィルタリングと組み合わせると「一次ソースを引きつつ、context は軽く保つ」運用がしやすくなります。

## 2. Cache Diagnostics — キャッシュミスの原因を API が教えてくれる

### 課題: キャッシュは「壊れても理由がわからない」

[プロンプトキャッシュ](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)はレイテンシとコストを大幅に削減しますが、**プロンプト先頭がバイト単位で前回と同一の場合にしか効きません**。ツールの並び替え、system プロンプトに差し込んだタイムスタンプ、過去メッセージの編集など、ささいな違いでキャッシュは静かに無効化されます。従来、その唯一のシグナルは `usage.cache_read_input_tokens` がゼロに落ちることだけで、**何が変わったのかは推測するしかありませんでした**。

### 解決: `diagnostics.previous_message_id`

2026年5月13日に public beta で登場した **Cache Diagnostics** は、このギャップを埋めます。前回レスポンスの `id` を `diagnostics.previous_message_id` として次のリクエストに渡すと、API が2つのリクエストを比較し、**プレフィックスが最初に食い違った地点（モデル・system・tools・メッセージ履歴のどれか）**をレスポンスの `diagnostics` オブジェクトで返します。

- **beta ヘッダー**: `cache-diagnosis-2026-04-07`
- **対応**: **Claude API のみ**（Amazon Bedrock / Vertex AI 非対応）
- **最初のターン**: `previous_message_id: null` を渡してオプトイン（比較対象がないため `diagnostics` は `null`）
- **保存内容**: 生のプロンプト本文は保存されず、**ハッシュとトークン数推定のみ**のフィンガープリント（ZDR 適格、短期間で失効）

### `cache_miss_reason` の6種類

`cache_miss_reason` は `type` による判別共用体（discriminated union）で、**最も早い食い違いだけ**を報告します（先に出た原因の裏に別の原因が隠れている場合あり）。6種類は次の通りです。

| `type` | 意味 | 直すべきこと |
| --- | --- | --- |
| `model_changed` | `model` が前回と異なる（ルーター・A/B テスト・フォールバックで別モデルが選ばれた等）。キャッシュはモデル単位。 | キャッシュ中の会話ではモデルを固定する |
| `system_changed` | `system` が異なる。タイムスタンプやリクエスト ID 等の毎回値が system に混入しているのが典型。 | system はバイト安定な定数にし、動的データはキャッシュ区切り以降の最初の `user` メッセージへ移す |
| `tools_changed` | `tools` 配列が異なる（追加・削除・並び替え、または `input_schema` の非決定的シリアライズ）。 | 毎ターン同一順序・キーソート済みの決定的シリアライズで送る |
| `messages_changed` | model / system / tools は一致するが、`messages` の過去エントリが追記でなく改変・並び替え・削除された。履歴の切り詰めや、assistant ターン・`tool_result` の再シリアライズが典型。 | 履歴は append-only として扱い、assistant content とツール結果は逐語的に返す |
| `previous_message_not_found` | 指定 `previous_message_id` のフィンガープリントが存在しない（前回が beta ヘッダー未送信／別ワークスペース／時間経過）。リクエストが変わった証拠ではない。 | 毎ターン beta ヘッダーを送り、連続ターンを時間的に近づける |
| `unavailable` | 診断情報が得られなかった。`tool_choice` / `thinking` / `context_management` 等の別パラメータ差や、比較地平を超える超長会話など。リクエスト自体は正常処理。 | プロンプトに影響するパラメータをキャッシュ会話の間は固定する |

> `*_changed` の4種は `cache_missed_input_tokens`（食い違い地点以降に落ちた入力トークン数の推定）も返します。**バイト長ベースの推定**なので、課金値ではなく「失われたプレフィックスの規模感」として扱ってください。

### `diagnostics` の4状態と usage の併読

`diagnostics` フィールドは次の4状態を取ります。

| 値 | 意味 |
| --- | --- |
| フィールドなし | `diagnostics` 未指定、または beta ヘッダー欠落 |
| `null` | 初回（比較対象なし）、または比較したが食い違いなし |
| `{"cache_miss_reason": null}` | 比較がまだ実行中（応答が速すぎた）。次ターンで再確認 |
| `{"cache_miss_reason": {...}}` | 食い違いを検出。`*_changed` は最初の地点を示す |

`diagnostics` は「**リクエストが変わったか**」を、`usage.cache_read_input_tokens` は「**キャッシュがヒットしたか**」を答えるので、併読すると原因の切り分けができます。例えば「`diagnostics` が `null` なのにキャッシュ read トークンが低い」場合はリクエストは一致しているがキャッシュエントリが失効しており、ターン間隔の短縮や [1時間 TTL](https://platform.claude.com/docs/en/build-with-claude/prompt-caching#1-hour-cache-duration) を検討する、といった判断ができます。

### コード例（マルチターンで毎回チェック）

```python
import anthropic

client = anthropic.Anthropic()
SYSTEM = "You are an AI assistant analyzing a large document. <document>...</document>"

messages = []
prev_id = None

for i, user_message in enumerate(
    ["Summarize section 1.", "Now section 2.", "Now section 3."]
):
    messages.append({"role": "user", "content": user_message})

    r = client.beta.messages.create(
        model="claude-opus-4-8",
        max_tokens=1024,
        cache_control={"type": "ephemeral"},
        system=SYSTEM,
        messages=messages,
        diagnostics={"previous_message_id": prev_id},
        betas=["cache-diagnosis-2026-04-07"],
    )

    if r.diagnostics is not None and r.diagnostics.cache_miss_reason is not None:
        print(f"Turn {i + 1} cache_miss_reason: {r.diagnostics.cache_miss_reason.type}")

    messages.append({"role": "assistant", "content": r.content})
    prev_id = r.id
```

> 運用の勘所: フィンガープリントは**短期間で失効**するため、診断は**時間的に近接したリクエスト間**で行うのが前提です。連続するターン間で毎回 `previous_message_id` を引き継ぐと、本番のキャッシュ効率劣化を「インシデント」として早期に拾えます（業界メディアでも「キャッシュミスを本番インシデント扱いする」設計思想として紹介されています）。

## 3. 会話途中 system メッセージ（Opus 4.8）

2026年5月28日、**Claude Opus 4.8** とともに **mid-conversation system messages**（会話途中 system メッセージ）が登場しました。これは `messages` 配列の中で、**user ターンの後に `role: "system"` メッセージを送れる**機能です（[配置ルール](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages#limitations)に従う）。

最大の利点は、**長時間セッションの途中で指示が変わっても、プロンプトキャッシュのヒットを維持できる**ことです。従来、会話途中で方針や制約を変えたい場合は先頭の system プロンプトを書き換える必要があり、それがキャッシュのプレフィックスを壊していました。会話途中 system メッセージなら、変更を**履歴の末尾側に追記**する形で表現できるため、前述の `system_changed` 型キャッシュミスを避けやすくなります。

- **対応モデル**: Claude Opus 4.8
- **beta ヘッダー**: 不要
- **補足（Opus 4.8 のキャッシュ）**: Opus 4.8 ではプロンプトキャッシュの**最小キャッシュ可能長が 1,024 トークン**に引き下げられており（Opus 4.7 より低い）、短めのプレフィックスもキャッシュ対象にしやすくなっています。

> Cache Diagnostics（第2章）と会話途中 system メッセージ（本章）は補完関係にあります。「指示変更をキャッシュを壊さず差し込む」手段（本章）と「壊れたときに原因を特定する」手段（第2章）を組み合わせると、長時間エージェントのキャッシュ運用が安定します。

## 4. Refusal categories（拒否種別）と `stop_details`

2026年5月28日、拒否レスポンスの **`stop_details`** フィールドが公式に文書化されました。安全性分類器がリクエストを拒否すると、Messages API は `stop_reason: "refusal"` を返し、`stop_details` に次が含まれます。

- `category`: 拒否の種別（`cyber` / `bio` / `null`）
- `explanation`: 人間可読の説明

これにより、アプリ側で**拒否の種類ごとに次のアクションを振り分ける（ルーティングする）**ことができます。例えば「`cyber` 系は社内ポリシー確認フローへ」「`null`（種別なし）は再プロンプト」といった分岐です。**beta ヘッダーは不要**です。

| `category` | 意味 | 想定アクション例 |
| --- | --- | --- |
| `cyber` | サイバー関連の安全制約による拒否 | ポリシー確認・人手レビューへエスカレーション |
| `bio` | 生物関連の安全制約による拒否 | 同上、用途確認 |
| `null` | 種別なしの拒否 | プロンプト言い換え・再試行 |

> 課金面の合わせ技: 2026年6月2日のリリースノートで、**出力が生成される前に `stop_reason: "refusal"` で返ったリクエストは Claude API では課金されない**ことが明記されました。さらに 2026年6月9日の Fable 5 では、別モデルで再実行する opt-in の `fallbacks` パラメータ（beta）や、`reasoning_extraction` という新カテゴリも追加されています（Fable 5 固有）。本記事の主対象は Messages API 一般機能のため詳細は割愛しますが、refusal ハンドリングは継続的に拡張されている領域です。

## 5. Advisor Tool（概要のみ・参照）

**Advisor Tool**（2026年4月9日 public beta、beta ヘッダー `advisor-tool-2026-03-01`）は、安価で高速な「エグゼキューター（実行役）」モデルに、高知能の「アドバイザー（助言役）」モデルを単一 API コール内でペアリングし、長期エージェントタスクの品質をアドバイザー単独に近づけつつトークン生成の大半を安いモデルで賄う機能です。2026年5月28日に Opus 4.8 対応、6月2日に出力上限を絞る `max_tokens` パラメータが追加されました。

本機能は専用記事で詳しく解説しているため、本記事ではここまでとします。詳細は [Advisor Tool ガイド](/mdTechKnowledge/blog/anthropic-advisor-tool-guide/) を参照してください。

## 6. 2026年6月後半の追加アップデート（コード実行・fast mode・レート制限）

5〜6月前半の機能群に続き、6月後半にも API 周りで3つの実務的な変更が入りました。

### `code_execution_20260120` が全公式SDKに対応（2026-06-18）

**Python・TypeScript・Go・Java・Ruby・PHP・C#** の各 SDK が、コード実行ツールの新バージョン **`code_execution_20260120`** に対応しました。**REPL 状態の永続化**に対応し、**プログラマティックツール呼び出し（programmatic tool calling）の最小バージョン**でもあります。ツールの `type` を `code_execution_20260120` に設定するだけで利用でき、**ベータヘッダーは不要**です（対応モデル: Fable 5 / Mythos 5 / Opus 4.5以降 / Sonnet 4.5以降）。

### Opus 4.7 の fast mode が廃止予告（2026-06-25・削除7/24）

Claude Opus 4.7 の fast mode（`speed: "fast"`）が非推奨化され、**2026年7月24日に削除**されます。削除後、`claude-opus-4-7` に `speed: "fast"` を付けたリクエストは**エラー**になります（standard 速度は引き続き利用可）。継続には **Opus 4.8 の fast mode** への移行が必要です（モデルIDを差し替えるだけ。fast 料金も 4.8 の方が安い）。詳細は [モデル廃止・移行ガイド](/mdTechKnowledge/blog/anthropic-model-deprecation-migration/) を参照。

### API レート制限の大改定（2026-06-26）

**Sonnet / Haiku のレート制限が Opus と同一水準**（RPM/ITPM/OTPM）に引き上げられ、利用ティアが **Start / Build / Scale の3段階に統合**されました。大半の組織は自動で上位ティアへ移行し、操作は不要・降格なしです。詳細・新ティアの数値は [Rate Limits API 完全ガイド](/mdTechKnowledge/blog/anthropic-rate-limits-api-guide/) を参照。

> 出典: [Anthropic Release notes](https://platform.claude.com/docs/en/release-notes/overview)

## まとめ — どの機能をいつ使うか

2026年5〜6月の Messages API 新機能は、「**品質を上げる**」「**コストを下げる**」「**運用を見通せるようにする**」の3方向に効きます。

- **検索を伴う回答の品質とコストを両取りしたい** → Web 検索 GA + 動的フィルタリング（`web_search_20260209` 以降 + code execution）。財務系は SEC filing 強化も追い風。
- **長時間セッションでキャッシュが効かない理由を突き止めたい** → Cache Diagnostics（`cache-diagnosis-2026-04-07`、`cache_miss_reason` 6種で原因特定）。
- **会話途中で指示を変えてもキャッシュを壊したくない** → Opus 4.8 の会話途中 system メッセージ。
- **拒否の種類に応じて後段処理を分けたい** → `stop_details.category` でルーティング。
- **長期エージェントの品質をコストを抑えて底上げしたい** → Advisor Tool（[専用記事](/mdTechKnowledge/blog/anthropic-advisor-tool-guide/)参照）。

これらは独立機能ですが、特に **Cache Diagnostics × 会話途中 system メッセージ** はキャッシュ運用で補完し合うため、長時間エージェントを運用するチームは両方をセットで導入する価値があります。

## 参考資料

- [Claude Platform リリースノート（公式・一次ソース）](https://platform.claude.com/docs/en/release-notes/overview)
- [Web search tool（公式ドキュメント）](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-search-tool)
- [Improved web search with dynamic filtering（公式ブログ・ベンチ数値の出典）](https://claude.com/blog/improved-web-search-with-dynamic-filtering)
- [Cache diagnostics（公式ドキュメント・`cache_miss_reason` 6種の出典）](https://platform.claude.com/docs/en/build-with-claude/cache-diagnostics)
- [Mid-conversation system messages（公式ドキュメント）](https://platform.claude.com/docs/en/build-with-claude/mid-conversation-system-messages)
- [Refusals and fallback / `stop_details`（公式ドキュメント）](https://platform.claude.com/docs/en/build-with-claude/refusals-and-fallback)
- [Prompt caching（公式ドキュメント）](https://platform.claude.com/docs/en/build-with-claude/prompt-caching)
- [Code execution tool（公式ドキュメント・併用無料の出典）](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool)
- [Advisor tool（公式ドキュメント）](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool)
- 関連記事: [Advisor Tool 完全ガイド](/mdTechKnowledge/blog/anthropic-advisor-tool-guide/)
- 関連記事: [Anthropic Rate Limits API 完全ガイド](/mdTechKnowledge/blog/anthropic-rate-limits-api-guide/)
