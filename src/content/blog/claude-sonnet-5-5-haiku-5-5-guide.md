---
title: "Claude Sonnet 5.5 / Haiku 5.5 完全ガイド — 5.5世代の中位・軽量モデルの性能・価格・API破壊的変更・使い分け"
date: 2026-10-10
category: "Claude技術解説"
tags: ["Claude", "Sonnet 5.5", "Haiku 5.5", "Anthropic", "ベンチマーク", "API", "thinking", "移行ガイド", "料金", "Claude Code", "Effort Control"]
excerpt: "2026-09-28（PT）リリースの Claude Sonnet 5.5（claude-sonnet-5-5）と、2026-10-07（PT）リリースの Claude Haiku 5.5（claude-haiku-5-5）を、公式発表・公式 API docs・Claude Code CHANGELOG の一次情報で整理。Sonnet 5.5 は Sonnet 5 と同額の $2/$10 で出力30%超高速・Terminal-Bench 4.0 70.6%、キャッシュ読取は10/7に $0.10 へ半額化。Haiku 5.5 は $0.10/$0.50（100Kトークン超は $0.50/$2.50 の2段階）で Haiku 4.5 の10分の1の単価、Haiku として初の effort 対応。Sonnet 5 / Haiku 4.5 からの API 破壊的変更（between_tools・tool_choice 制限・thinking ブロックの紐付け・computer use ツールセット・advisor の組合せ制限・budget_tokens と prefill の400エラー）、安全性（サイバー safeguard・蒸留対策）、Claude Code への影響、Opus 5.5 との使い分けと移行チェックリストをまとめる。"
draft: false
---

> ## TL;DR
>
> - **Claude 5.5 世代は3モデルがそろいました**: 最上位寄りの **Opus 5.5**（9/22・$4/$20）、中位の **Sonnet 5.5**（9/28・$2/$10）、軽量の **Haiku 5.5**（10/7・$0.10/$0.50）。
> - **Sonnet 5.5** は Sonnet 5 と**同額**のまま、出力が**30%以上速く**、ほとんどの作業でコストが**最大30%安い**（公式の主張）。Terminal-Bench 4.0 は **70.6%** で、Opus 5.5（66.4%）を上回ります。**キャッシュ読取は 10/7 に $0.20 → $0.10 へ半額化**されました。
> - **Haiku 5.5** は Haiku 4.5（$1/$5）の **10分の1の単価**（100,000トークン以下）。ただし**100K超のプロンプトは $0.50/$2.50**、新トークナイザーで**同じ文章が約30%多いトークン**に数えられます。Anthropic は**平均で約75%安い**と説明しています。Haiku として**初めて effort パラメータに対応**しました。
> - **どちらも API の破壊的変更あり**: モデル ID の差し替えだけでは動かない場合があります。Sonnet 5.5 は5点、Haiku 5.5 は5点で、内容が異なります（本記事の第5章）。
> - **使い分け**: 複雑で慎重な判断が要る作業は Opus 5.5、日常の開発・文書作成は Sonnet 5.5、大量処理・分類・サブエージェントは Haiku 5.5。**Haiku 5.5 は複雑なエージェント的コーディングには向かない**と公式が明記しています。

## 1. 5.5世代のラインナップ

| モデル | モデルID | 入力 / 出力（per MTok） | リリース | 公式の位置付け | 既定 effort（API） |
|:---|:---|:---:|:---|:---|:---:|
| **Opus 5.5** | `claude-opus-5-5` | $4 / $20 | 2026-09-22 | 複雑で慎重な判断を要する作業向け | `medium` |
| **Sonnet 5.5** | `claude-sonnet-5-5` | $2 / $10 | 2026-09-28 | 速度と知能の最良のバランス | `high` |
| **Haiku 5.5** | `claude-haiku-5-5` | $0.10 / $0.50〜 | 2026-10-07 | 高ボリューム・低レイテンシ向け（最速） | `medium` |

3モデルとも、コンテキストは **1M トークン**、最大出力は **128K**、知識カットオフは **2026年6月**です（公式のモデル比較表より）。Claude アプリと Claude Code での Sonnet 5.5 の既定 effort は `medium` です。

最上位の Fable 5.1（$10/$50）を含む全モデルの価格は [Claude 単価総覧](/mdTechKnowledge/blog/claude-pricing-overview/)、Opus 5.5 の詳細は [Claude Opus 5.5 完全ガイド](/mdTechKnowledge/blog/claude-opus-5-5-guide/) を参照してください。

## 2. Claude Sonnet 5.5

### 2-1. 位置付け

**2026年9月28日（PT）**にリリースされました。公式は「Sonnet 5 からの明確なアップグレードで、出力は30%以上速く、ほとんどの作業でコストが最大30%安い」と説明しています。Opus 5.5 とは役割を分けており、**Opus 5.5 は複雑で慎重な判断を要する作業向け、Sonnet 5.5 は範囲の明確な日常タスク、バグ修正、整った文書・スライド・スプレッドシートの作成に最も強い**とされています。

- **速度**: 出力の生成が Sonnet 5 より **30%以上速く**、Sonnet として過去最速
- **効率**: ツール呼び出しをまとめて行う傾向が強まり、ステップ数とコストが減る。タスクあたりのトークンも減る
- **文章**: Opus 5.5 と同様に、前世代より明瞭な文章を書く（早期テスターの評価）

### 2-2. 公式ベンチマーク

公式発表の比較表です。

| ベンチマーク | Sonnet 5.5 | Sonnet 5 | Opus 5.5 |
|:---|:---:|:---:|:---:|
| Terminal-Bench 4.0（エージェント的コーディング） | **70.6%** | 10.3% | 66.4%（xhigh） |
| FrontierCode 1.1 Main（同） | 46.2%（Max）／52.1%（Xhigh） | 42.4% | 54.4% |
| CursorBench 4.0（同） | 55.5% | 34.1% | 57.8% |
| GDPval-AA v2.1（知識労働・Elo） | 1844 | 1449 | 1846 |
| AA-Briefcase v1.1（知識労働・Elo） | 1811 | 1359 | 1822 |
| Humanity's Last Exam（ツールあり） | 64.5% | 54.9% | 67.7% |
| OSWorld 2.1 partial（コンピュータ操作） | 80.1% | 57.0% | 81.8% |
| Chartography（図表の読み取り・ツールなし） | 61.6% | 15.6% | 64.4% |

読み方のポイントです。

- **Terminal-Bench 4.0 では Opus 5.5 を上回り**、GDPval-AA では Opus 5.5 と**2点差**（1844 対 1846）です。一方、**FrontierCode では Opus 5.5 との差が残っています**。公式も「複雑でオープンエンドな作業では Opus 5.5 が明確に強い」と述べています。
- **Sonnet 5 → 5.5 の伸びが極端に大きい指標**（Terminal-Bench 4.0 の 10.3% → 70.6% など）は、Sonnet 5 の側が低かった点に注意が必要です。
- **FrontierCode は Max より Xhigh のほうが高い**（46.2% 対 52.1%）。公式の脚注によると、この指標は範囲外の変更にペナルティを課し、Max effort では Claude Code のコードレビュー用スキル（多数のサブエージェントを使う）を実行する頻度が増え、タイムアウトや範囲外の編集につながった事例があったためです。**effort は高いほど良いとは限りません**。
- 独立評価機関 Artificial Analysis の測定は**リリース前のデプロイ**で行われ、構造化出力リクエストに影響するバグがあった旨が脚注に記されています（Anthropic は影響は小さく、性能を過小評価する方向とみており、バグは修正済み）。GPT-6 Sol の画像理解にあった不具合も、一部の第三者スコアの時期によって影響しうるとされています。
- すべて **Anthropic の評価・Anthropic が提示した値**です。ベンチマークはモデル能力の一部しか表しません。

### 2-3. コスト効率の主張（公式の図より）

公式は、effort を下げた設定での費用対効果を次のように示しています。

- Terminal-Bench 4.0: **medium effort**（Claude アプリの既定）で、Sonnet 5 の最高スコアを**1/10未満のコスト**で上回る
- FrontierCode: **high effort** で GPT-6 Sol の最高スコアに並ぶ水準を**約1/5のコスト**で達成
- CursorBench 4.0: **low effort** で Sonnet 5 の最高スコアを**1/10未満のコスト**で上回る
- AA-Briefcase: **medium effort** で Sonnet 5 の最高スコアを**約1/9のコスト**で上回る
- タスクあたり、Sonnet 5 より**最大30%安い**（Anthropic のテストで）

effort の既定は、Claude Platform（API）が `high`、Claude アプリと Claude Code が `medium` です。公式ドキュメントは、**effort の水準が Sonnet 5 とは較正し直されている**ため、設定をそのまま持ち越さずに再スイープするよう勧めています（エージェント的コーディングや複数ステップのツール利用は `medium` から、難しい・長いタスクは `high`、チャットなど低レイテンシ重視は `medium` か `low` から）。

### 2-4. 顧客の早期テスト報告（Anthropic の発表に掲載）

いずれも**ベンダー（Anthropic）が掲載した顧客の報告**で、独立検証ではありません。

| 企業 | 報告された内容 |
|:---|:---|
| Slack | 追加のプロンプト変更なしで、オフラインの Slackbot 評価のほぼすべてで Sonnet 5 を上回り、ステップ数は少なく出力トークンは約14%減 |
| Zendesk | サポート業務で、本番利用中のモデルより誤判断が少なく、チケット処理が20%速い |
| Box | Sonnet 5 が見逃したソース文書のデータ誤りを検出。前のモデル比で、より正確・2.4倍速く、総トークン12%減 |
| Balyasny Asset Management | 2,441件の金融タスクで Sonnet 5 を上回り、回答あたり約12.1万トークン（Sonnet 5 は約49.7万）。検証した7モデルで品質とコストのバランスが最良 |
| CodeRabbit | Sonnet 5 より良い判断を、大幅に少ない出力トークンで実現。簡易〜中程度のレビューを移行予定 |
| Lovable | コーディング評価でツール呼び出しが約1/3減、シェル実行がほぼ半減 |

## 3. Sonnet 5.5 の価格

| 項目 | Sonnet 5.5 |
|:---|:---|
| 入力 / 出力 | **$2 / $10**（Sonnet 5 と同額）、Batch は50%オフ |
| キャッシュ書込 | 5分 $2.50 / 1時間 $4 |
| キャッシュ読取 | **$0.10**（2026-10-07 に $0.20 から半額化。入力の0.05倍） |
| 最小キャッシュ可能プロンプト | **512トークン**（Sonnet 5 は1,024） |
| トークナイザー | Sonnet 5 と同じ（同じ文章で同じトークン数） |

発売時の公式発表ではキャッシュ読取が $0.20 でしたが、**10月7日の価格改定で $0.10 になりました**。Anthropic は、この改定でエージェント系タスクの多くで Sonnet 5.5 のコストが約20%下がると説明しています。キャッシュ書込など他の価格は変わっていません。キャッシュを使ったコスト設計は [Claude 単価総覧](/mdTechKnowledge/blog/claude-pricing-overview/) の試算例も参考にしてください。

## 4. Claude Haiku 5.5

### 4-1. 位置付け

**2026年10月7日（PT）**にリリースされました。Anthropic は「最も安く、最も速く、最も高性能な小型モデル」と位置付けています。想定用途は、要約、コンパクション、データベースクエリ、分類などの**高ボリューム・コスト重視の作業**で、Opus 5.5 や Sonnet 5.5 と組み合わせた**コーディングのサブエージェント**、ライブのカスタマーサポート、ブラウザ操作にも向くとされています。

- **Haiku として初めて effort に対応**（Low／Med／High／Xhigh／Max）。adaptive thinking が既定でオン
- 公式は、**複雑なエージェント的コーディングには Sonnet 5.5 と Opus 5.5 のほうが適する**と明記しています
- 標準速度では Anthropic のモデルで最速（Opus の fast mode よりは遅い）

### 4-2. 公式ベンチマーク

| ベンチマーク | Haiku 5.5 | Haiku 4.5 | GPT-6 Luna | Sonnet 5.5 |
|:---|:---:|:---:|:---:|:---:|
| GDPval-AA v2.1（知識労働・Elo） | 1620 | 735 | 1437 | 1840 |
| AA-Briefcase v1.1（知識労働・Elo） | 1578 | 614 | 1336 | 1824 |
| OSWorld 2.1 オフラインサブセット（コンピュータ操作） | 72.4% | 15.7% | 48.9% | 83.9% |
| Humanity's Last Exam（ツールなし） | 45.9% | 10.2% | — | 56.9% |
| Humanity's Last Exam（ツールあり） | 57.4% | 18.7% | — | 64.5% |
| Terminal-Bench 4.0（エージェント的コーディング） | 39.2% | 0.0% | 16.4% | 70.6% |
| FrontierCode 1.1 Main（同） | 46.4% | — | 42.4% | 52.1%（Xhigh） |
| Chartography（図表の読み取り・ツールなし） | 46.4% | 6.4% | 29.1% | 61.6% |

- Haiku 4.5 からの伸びが極めて大きい一方、**Sonnet 5.5 との差は明確**です。特に **Terminal-Bench 4.0 は 39.2% 対 70.6%** で、複雑なエージェント的コーディングを Haiku に任せない公式の方針と整合します。
- **OSWorld の数値は Sonnet 5.5 の発表（partial：80.1%）と Haiku 5.5 の発表（オフラインサブセット：83.9%）で異なります**。評価セットが違うため、**発表をまたいで数値を混ぜて比べない**でください。
- GDPval-AA と AA-Briefcase は Artificial Analysis が報告する Elo 形式のスコアです。結果は Anthropic の評価と顧客の早期テストに基づきます。

### 4-3. 価格 — 「約75%安い」の中身

| 項目 | Haiku 5.5（100K以下） | Haiku 5.5（100K超） | Haiku 4.5 |
|:---|:---:|:---:|:---:|
| 入力 | $0.10 | $0.50 | $1 |
| 出力 | $0.50 | $2.50 | $5 |
| キャッシュ書込（5分） | $0.125 | $0.625 | $1.25 |
| キャッシュ読取 | $0.01 | $0.05 | $0.10 |
| Batch | 入出力とも50%オフ | 入出力とも50%オフ | 入出力とも50%オフ |

Anthropic は「**Haiku 4.5 より平均で約75%安い**」と説明しています。内訳は、**100K以下のリクエストでは90%安く、100K超では50%安い**という二層の価格で、Haiku 4.5 のリクエストの約90%が100K未満だったことから平均を算出しています。新トークナイザーによるトークン増も、この削減率に**織り込み済み**です。

- 名目の単価は10分の1ですが、**同じ文章が Haiku 4.5 より約30%多いトークンに数えられる**ため、実効の削減幅は小さくなります
- 100Kを超えるかどうかは**リクエストごと**に判定され、**キャッシュ読取・書込のトークンも含めた全入力**が対象です
- Haiku 4.5 から Haiku 5.5 へ移した場合の試算例（トークン増を織り込むと約87%減）は [Claude 単価総覧](/mdTechKnowledge/blog/claude-pricing-overview/) の第5章を参照してください

### 4-4. 顧客の早期テスト報告（Anthropic の発表に掲載）

| 企業 | 報告された内容 |
|:---|:---|
| Asana | タスク完了のレイテンシが30%超低下。エージェントの1ターンあたりの推論が最大2.5倍速 |
| HubSpot | CRM スイートで3回平均 92.8%。小型モデルとして過去最高 |
| AlphaSense | 400件の文書内質問で 0.84（Haiku 4.5 は 0.76）、統計的に有意な改善 |
| Box | Haiku 4.5 より 11 ポイント高く、レイテンシは約半分 |
| Cognition | Devin Fusion で Opus 5.5 を主担当、Haiku 5.5 を補助にして FrontierCode 66.2、コストとレイテンシも低下 |

## 5. API の破壊的変更 — モデルID差し替えだけでは済まない

### 5-1. Sonnet 5 → Sonnet 5.5（5点）

1. **thinking を切るには `between_tools` を使う**: `thinking: {"type": "disabled"}` と `{"type": "enabled", "budget_tokens": N}` は400エラー。`between_tools` は effort が `low`／`medium`／`high` のときだけ指定でき、`xhigh`／`max` では400エラー。`between_tools` には `display` などの追加フィールドを付けられない
2. **強制ツール呼び出しが使えない**: `tool_choice` の `any` と `tool` は400エラー。`auto` ＋ strict tool use（`strict: true`）か構造化出力に置き換える
3. **thinking ブロックがモデルと会話に紐付く**: 前の履歴（system・tools・過去のメッセージ）を編集してからブロックを再送すると400エラーになりうる（2026-08-31 以降に作成したアカウントでは既定で検査）。会話は**追記のみ**にする
4. **Claude API と Google Cloud で `computer_20251124` が使えない**: `computer_toolset_20260801` へ移行（Bedrock では旧ツールのまま使える）
5. **advisor tool の組合せ制限**: Sonnet 5.5 を実行役にすると、助言役に **Opus 4.8・Opus 4.7・Sonnet 5・Haiku 5.5** は使えず400エラー（Mythos 5.1・Fable 5.1・Mythos 5・Fable 5・Opus 5.5・Opus 5、または Sonnet 5.5 自身は可）。受け取る助言は暗号化された `advisor_redacted_result` ブロックで、クライアントからは読めない

エラーにはならない変化として、**ツール呼び出しの間の進捗メモ（1〜2文を超えるもの）が `thinking` ブロックで返る**点があります。既定の `display: "omitted"` ではこのブロックのテキストが空になり、**ツール呼び出しの間にユーザー向けのストリーミング表示が止まって見える**ことがあります。`between_tools` を使うか、`display` を設定して受け取ってください。

### 5-2. Haiku 4.5 → Haiku 5.5（5点）

1. **`budget_tokens`（手動 extended thinking）は400エラー**。adaptive thinking へ置き換える
2. **`temperature`／`top_p`／`top_k` を既定以外にすると400エラー**
3. **assistant メッセージの prefill は400エラー**。`messages` は user ターンで終える
4. **computer use は `computer_toolset_20260801` が必要**（Claude API・Google Cloud で `computer_20250124` は不可）
5. **前のターンを書き換えると thinking ブロックが無効になる**

エラーにならない変化: **応答が `thinking` ブロックから始まることがある**（adaptive thinking が既定でオンのため、位置ではなく `type` でブロックを選ぶ）、**thinking の本文は既定で省略**（受け取るには `thinking.display` を `"summarized"` に）、**`max_tokens` に thinking のトークンが含まれる**（小さい上限だと thinking ブロックの後、テキストの前で止まる）、**同じ文章が約30%多いトークン**になる、thinking ブロックは生成したアカウント（またはリンクされたアカウント）でしか使えない、です。

`thinking: {"type": "disabled"}` は Haiku 5.5 では `high` effort 以下で引き続き指定できます（公式は、品質と速度・コストのバランスは effort で調整するほうがよいとしています）。

API の変更点を時系列で追いたい場合は [Anthropic Messages API 新機能まとめ](/mdTechKnowledge/blog/anthropic-messages-api-new-features-2026/) の第22章（Sonnet 5.5）と第24章（Haiku 5.5・Models API）を参照してください。

## 6. 安全性

### Sonnet 5.5

- **サイバー**: **Sonnet として初めて、最上位モデルと同様のサイバー safeguard とフォールバックを搭載**。通常のバグ修正は使えますが、**リスクの高いサイバータスクは目に見える形で Sonnet 5 にフォールバック**します。サイバー能力は Opus 5 と同程度とされています（公式の比較対象は Opus 5.5 の safeguard です）
- **蒸留対策**: Sonnet として初めて、推論の抽出を防ぐ分類器を搭載。あわせて保持される thinking を拡大し、**thinking が作成したアカウントに紐付く**ようになった（Claude Code でセッション途中にアカウントを切り替えると影響する）
- **生物**: Sonnet 5 と同じ safeguard。微生物学・ウイルス学の一部が誤って検知される場合がある。より広いアクセスは Life Sciences Verification Program で申請できる
- **整合性評価**: 約1,850シナリオの自動行動監査で、整合性・悪用耐性・誠実性の多くの指標で Sonnet 5 に並ぶか上回る。サンドボックス脱出を試みる頻度は低く、検証した全モデルでコンテナの限界を探る可能性が最も低い。Opus 5.5 は全体ではわずかに良い。Anthropic は目的の食い違いの証拠は見つけていないが、未発見の傾向がある可能性にも言及している

### Haiku 5.5

- **整合性**: Haiku 4.5 より大幅に改善（不整合な挙動と悪用への協力が大きく減少）
- **サイバー**: Haiku 4.5 より厳格で、Sonnet 5.5 より緩い。防御的なタスクをより多く許可するが、**ペネトレーションテストや攻撃者寄りの手法はブロック**
- **生物**: Sonnet 5・Sonnet 5.5・Opus 5 と同じ safeguard
- より広い生物・サイバー分野のアクセスが必要な組織は、Life Sciences Verification Program と Cyber Verification Program に申請できる。後者は 2026-10-06 に Defense／Red Team／Specialized の3層に拡張されている（詳細は [Claude Mythos Preview & Project Glasswing](/mdTechKnowledge/blog/claude-mythos-glasswing/)）
- Haiku 5.5 では、**サーバー側フォールバック（`fallbacks: "default"`）は使えません**。`stop_reason: "refusal"` をクライアントで処理してください

拒否時の `stop_details.category` は、Sonnet 5.5 では `cyber`／`bio`／`frontier_llm`／`reasoning_extraction`／`general_harms` の5種で、サーバー側フォールバックが再試行するのは `cyber` と `frontier_llm` のみ、移行先は Sonnet 5 です。拒否が出力前でも課金されるカテゴリがある点は、[Messages API 新機能まとめ](/mdTechKnowledge/blog/anthropic-messages-api-new-features-2026/) の第21章を参照してください。

## 7. 可用性と Claude Code

- **プラットフォーム**: 両モデルとも Claude API、Amazon Bedrock（`anthropic.claude-sonnet-5-5`／`anthropic.claude-haiku-5-5`）、Claude Platform on AWS、Google Cloud、Microsoft Foundry で利用可。Sonnet 5.5 はゼロデータリテンション対応
- **GitHub Copilot**: Sonnet 5.5 は 2026-09-28 から GitHub Copilot で利用可（GitHub の changelog より）
- **Claude Code**: Sonnet 5.5 は **v2.1.284** 以上、Haiku 5.5 は **v2.1.293** 以上。CHANGELOG によれば、それぞれ Anthropic API での**既定の Sonnet／Haiku モデル**になりました。ただし **Claude Code の既定モデルそのものは Opus 5.5 のまま**です。Anthropic API には「既定モデル」という仕組みはなく、これは Claude Code のエイリアス解決の話です
- **旧世代**: Sonnet 5 は Legacy。Haiku 4.5 は前世代で、退役は 2026-10-15 以降と公表されています。Sonnet 4.5 は 2026-09-30 に廃止が予告され、API 退役は 2026-11-30 です（[モデル廃止スケジュール & 移行ガイド](/mdTechKnowledge/blog/anthropic-model-deprecation-migration/)）

## 8. 使い分け

| 用途 | 第一候補 | 理由 |
|:---|:---|:---|
| 複雑・オープンエンドな設計、難しいバグの根本調査、慎重な判断 | **Opus 5.5** | 公式が「複雑な作業向け」と位置付け。FrontierCode 等で Sonnet 5.5 との差が残る |
| 日常の開発、バグ修正、文書・スライド・スプレッドシート作成 | **Sonnet 5.5** | $2/$10 で Terminal-Bench 4.0 は Opus 5.5 を上回る。速度とコストのバランス |
| 要約・分類・抽出・ルーティング・コンパクションの大量処理 | **Haiku 5.5** | $0.10/$0.50。Batch ならさらに半額 |
| 主担当モデルの補助（サブエージェント） | **Haiku 5.5** | 公式が想定用途に挙げる。Cognition は Opus 5.5 を主、Haiku 5.5 を補助にした構成を報告 |
| 複雑なエージェント的コーディング | Sonnet 5.5 / Opus 5.5 | Terminal-Bench 4.0 は Haiku 5.5 が 39.2%、Sonnet 5.5 が 70.6% |
| 最上位の能力が必要な場面 | Fable 5.1 | $10/$50。コストと遅さを許容できる場合 |

迷ったときは、**Sonnet 5.5 を基準にして、「安く速く回せるか」を Haiku 5.5 で、「精度が足りないか」を Opus 5.5 で検証**するのが現実的です。移行の際は、Haiku 5.5 の新トークナイザーによる請求トークン数の増加と、100K超の2段階価格を、自社データで再計測してから判断してください。

## 9. 移行チェックリスト

### Sonnet 5 → Sonnet 5.5

1. モデル ID を `claude-sonnet-5-5` に変更
2. `thinking: {"type": "disabled"}` を使っていれば `between_tools` に（effort は `high` 以下）
3. `tool_choice` の `any`／`tool` を `auto` ＋ strict tool use に置き換え
4. 会話を追記のみにする（thinking ブロックの再送が400にならないように）
5. Claude API／Google Cloud で `computer_20251124` を使っていれば `computer_toolset_20260801` へ
6. advisor tool を使っていれば、助言役が Sonnet 5.5 で許可される組合せか確認（Haiku 5.5 も不可）
7. ツール呼び出しの間の進捗テキストを画面に出していれば、`display` を設定するか `between_tools` を使う
8. effort を再スイープ（Sonnet 5 の設定を持ち越さない）

### Haiku 4.5 → Haiku 5.5

1. モデル ID を `claude-haiku-5-5` に変更
2. `budget_tokens`、`temperature`／`top_p`／`top_k`、assistant prefill を削除
3. 応答の最初のブロックを位置で読んでいれば、`type` で選ぶように変更
4. `max_tokens` を見直し（thinking のトークンも含まれる）、プロンプトを `count_tokens` で再計測
5. 100Kトークンを超えるプロンプトの比率を確認して、実効コストを再試算
6. `stop_reason: "refusal"` の処理を確認（サーバー側フォールバックは使えない）

## まとめ

- **Sonnet 5.5** は、Sonnet 5 と同額のまま速度と効率が上がり、キャッシュ読取の半額化でさらに安くなりました。コーディングと知識労働のベンチマークで Opus 5.5 に迫る（一部は上回る）一方、複雑でオープンエンドな作業では Opus 5.5 が優位です。
- **Haiku 5.5** は、軽量モデルの単価を一気に下げ、Haiku として初めて effort に対応しました。ただし**100K超の2段階価格と新トークナイザー**があり、複雑なエージェント的コーディングは担当外です。
- **どちらも破壊的変更**があるため、モデル ID の差し替えだけで移行せず、本記事のチェックリストで確認してください。
- 数値の多くは Anthropic が発表したものです。**ベンチマークと顧客の報告はベンダー提示の値**として読み、自社データで検証することをお勧めします。

## 関連記事

- [Claude Opus 5.5 完全ガイド](/mdTechKnowledge/blog/claude-opus-5-5-guide/) — 5.5世代の上位モデル
- [Claude Sonnet 5 完全ガイド](/mdTechKnowledge/blog/claude-sonnet-5-guide/) — 前世代（5.5 のリリース追記つき）
- [Claude 単価総覧](/mdTechKnowledge/blog/claude-pricing-overview/) — 全モデルの価格・キャッシュ・Batch
- [Anthropic Messages API 新機能まとめ](/mdTechKnowledge/blog/anthropic-messages-api-new-features-2026/) — API 変更の時系列（第22章・第24章）
- [Anthropic モデル廃止スケジュール & 移行ガイド](/mdTechKnowledge/blog/anthropic-model-deprecation-migration/) — Haiku 4.5・Sonnet 4.5 の退役

## 出典

- [Claude Sonnet 5.5 — Anthropic 公式発表](https://www.anthropic.com/claude-sonnet-5-5)（2026-09-28）
- [Claude Haiku 5.5 — Anthropic 公式発表](https://www.anthropic.com/claude-haiku-5-5)（2026-10-07）
- [What's new in Claude Sonnet 5.5](https://platform.claude.com/docs/en/models/sonnet-5-5/whats-new-sonnet-5-5) ／ [What's new in Claude Haiku 5.5](https://platform.claude.com/docs/en/models/haiku-5-5/whats-new-haiku-5-5)
- [Claude Haiku 5.5 モデルページ](https://platform.claude.com/docs/en/models/haiku-5-5/overview) ／ [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [Claude Platform リリースノート](https://platform.claude.com/docs/en/release-notes/overview) ／ [Claude Code CHANGELOG](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md)
- 補足（二次情報）: [GitHub changelog: Claude Sonnet 5.5 in GitHub Copilot](https://github.blog/changelog/2026-09-28-claude-sonnet-5-5-in-github-copilot/)
