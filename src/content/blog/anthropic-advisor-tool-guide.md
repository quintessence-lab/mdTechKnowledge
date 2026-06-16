---
title: "Anthropic Advisor Tool 完全ガイド — Opus を『助言役』にして安いモデルを賢くする"
date: 2026-06-07
updatedDate: 2026-06-16
category: "Claude技術解説"
tags: ["Anthropic", "Claude", "Advisor Tool", "API", "Opus", "Sonnet", "Haiku", "コスト最適化", "ツール"]
excerpt: "Anthropic の Advisor Tool（advisor_20260301、2026年4月9日 Public Beta）は、Sonnet/Haiku を『エグゼキュータ（実行役）』、Opus を『アドバイザー（助言役）』として単一APIコール内でペアリングする新パターン。アドバイザーはツールも最終出力も生成せず助言だけを返すため、Opus の推論力を借りつつ、最終生成は安いモデルが担うことでコストを抑える。役割分担の仕組み・対応モデルの組み合わせ・課金（usage.iterations）・APIコード例・制約（Bedrock/Vertex 非対応）・ベンチマークまでを公式ドキュメント一次ソースで整理する。"
draft: false
---

> ## 要点
>
> - **Advisor Tool**（`advisor_20260301`）は、安いモデル（Sonnet/Haiku＝**エグゼキュータ**）が必要なときだけ高いモデル（Opus＝**アドバイザー**）に助言を求める仕組み。**単一の `/v1/messages` コール内**で完結する。
> - **アドバイザーはツールを呼ばず、ユーザー向け出力も生成しない**。エグゼキュータへの「助言テキスト」だけを返す。最終的なコードや回答は**エグゼキュータが生成**する。
> - これにより、**Opus の推論力を要所だけ借りつつ、生成は安いモデルに任せてコストを抑える**。
> - **2026年4月9日に Public Beta** 開始。**Claude API と Claude Platform on AWS のみ**対応（Bedrock / Vertex AI / Microsoft Foundry は非対応）。
> - 有効化は `anthropic-beta: advisor-tool-2026-03-01` ヘッダー。

## はじめに — 「賢いモデルは高い、安いモデルは少し物足りない」を両取りする

エージェント的なワークロード（コーディングエージェント、computer use、複数ステップの調査パイプライン）では、**大半のターンは機械的だが、要所の"判断"だけは賢いモデルでないと外す**——という場面がよくあります。全部を Opus で回せば品質は出ますが高い。かといって Sonnet/Haiku だけだと、肝心の計画でつまずく。

Anthropic の **Advisor Tool** は、この板挟みに対する答えです。**実行は安いモデル（エグゼキュータ）に任せ、判断が要る瞬間だけ Opus（アドバイザー）に助言を求める**。アドバイザーは助言を返すだけで、最終的な出力は安いモデルが生成するため、Opus を"薄く"使えます。

本記事は Anthropic 公式ドキュメントを一次ソースに、仕組み・モデルの組み合わせ・課金・APIの使い方・制約を整理します。

> **日付の注記**: 公式ブログ「The Advisor Strategy」の掲載日は **2026年4月9日**です。具体的なタイムゾーン（PT 等）はソース上に明示がないため、本記事では「4月9日」とのみ記載します。識別子 `advisor_20260301` とヘッダーの `advisor-tool-2026-03-01` はどちらも「2026年3月1日版」というツールのバージョン日付で、提供開始日とは別物です。

---

## 1. 仕組み — エグゼキュータとアドバイザーの役割分担

| 役割 | 指定場所 | 何をするか |
|:---|:---|:---|
| **エグゼキュータ（executor）** | トップレベルの `model` | タスクをエンドツーエンドで実行。ツール呼び出しもユーザー向け出力も担当。高速・低コストモデルを置く |
| **アドバイザー（advisor）** | tool 定義内の `model` | **ツールを呼ばず、ユーザー向け出力も生成しない**。エグゼキュータへの**助言テキストのみ**を返す。高知能モデルを置く |

ポイントは、**アドバイザーが「毎ターン」呼ばれるわけではない**ことです。エグゼキュータが、他のツールと同じように「いま助言が要る」と判断したときだけ呼び出します。

### 単一APIコール内のフロー

1. エグゼキュータが `name: "advisor"` の `server_tool_use` ブロックを **input 空**で発行（＝「助言が欲しい」というタイミング通知）。
2. Anthropic がサーバ側で**別の推論パス**をアドバイザーモデルで実行。**エグゼキュータの全トランスクリプト**（システムプロンプト・全ツール定義・全ターン・全ツール結果）をアドバイザーに渡す。
3. アドバイザーの応答が `advisor_tool_result` ブロックとしてエグゼキュータに返る。
4. エグゼキュータが助言を踏まえて生成を継続。

これらが**すべて1回の `/v1/messages` リクエスト内**で完結します（クライアント側で追加のラウンドトリップは不要）。アドバイザーは**ツールなし・context management なし**で動き、その thinking ブロックは破棄され、助言テキストだけがエグゼキュータに届きます。

- アドバイザー出力は通常 **400〜700 テキストトークン**（thinking 込みで 1,400〜1,800 トークン）程度。
- **ストリーミング**: アドバイザーのサブ推論は**ストリーミングしません**。実行中はエグゼキュータのストリームが一時停止し（約30秒ごとに SSE `ping` のみ）、完了後に `advisor_tool_result` が一括到着してからエグゼキュータ出力のストリーミングが再開します。

---

## 2. 対応モデルの組み合わせ

エグゼキュータ（トップレベル `model`）とアドバイザー（tool 内 `model`）は有効なペアである必要があり、**アドバイザーはエグゼキュータ以上の能力**でなければなりません。無効なペアは `400 invalid_request_error` になります。

| エグゼキュータ（実行役） | 指定できるアドバイザー（助言役） |
|:---|:---|
| Claude Haiku 4.5（`claude-haiku-4-5-20251001`） | Opus 4.8（`claude-opus-4-8`）/ Opus 4.7（`claude-opus-4-7`） |
| Claude Sonnet 4.6（`claude-sonnet-4-6`） | Opus 4.8 / Opus 4.7 |
| Claude Opus 4.6（`claude-opus-4-6`） | Opus 4.8 / Opus 4.7 |
| Claude Opus 4.7（`claude-opus-4-7`） | Opus 4.8 / Opus 4.7 |
| Claude Opus 4.8（`claude-opus-4-8`） | Opus 4.8 のみ |

> アドバイザーに指定できるのは現行ドキュメント上 **Opus 4.8 / 4.7** です（モデル表は更新されうるため、利用時に公式ドキュメントで最新の対応ペアを確認してください）。

---

## 3. APIの使い方

### tool 定義のパラメータ

| パラメータ | 型 | 既定 | 説明 |
|:---|:---|:---|:---|
| `type` | string | 必須 | `"advisor_20260301"` 固定 |
| `name` | string | 必須 | `"advisor"` 固定 |
| `model` | string | 必須 | アドバイザーのモデルID（このレートで課金） |
| `max_uses` | integer | 無制限 | **1リクエスト内**のアドバイザー呼び出し上限。超過時は助言なしで続行 |
| `max_tokens` | integer | モデルの出力上限 | アドバイザー1回の総出力（thinking+text）上限。**最小1024**。推奨開始値は `2048`。**フル長の助言を必要としないワークロードでは、これを設定することで1コールあたりのレイテンシと出力トークンコストを削減できる**（Claude Developer Platform で正式サポート） |
| `caching` | object\|null | `null`（off） | アドバイザーのトランスクリプトのプロンプトキャッシュ。`{"type":"ephemeral","ttl":"5m"\|"1h"}` |

### 最小コード例（curl）

```bash
curl https://api.anthropic.com/v1/messages \
    --header "x-api-key: $ANTHROPIC_API_KEY" \
    --header "anthropic-version: 2023-06-01" \
    --header "anthropic-beta: advisor-tool-2026-03-01" \
    --header "content-type: application/json" \
    --data '{
        "model": "claude-sonnet-4-6",
        "max_tokens": 4096,
        "tools": [
            {
                "type": "advisor_20260301",
                "name": "advisor",
                "model": "claude-opus-4-8"
            }
        ],
        "messages": [{
            "role": "user",
            "content": "Build a concurrent worker pool in Go with graceful shutdown."
        }]
    }'
```

### 最小コード例（Python SDK）

```python
import anthropic

client = anthropic.Anthropic()

response = client.beta.messages.create(
    model="claude-sonnet-4-6",
    max_tokens=4096,
    betas=["advisor-tool-2026-03-01"],
    tools=[
        {
            "type": "advisor_20260301",
            "name": "advisor",
            "model": "claude-opus-4-8",
        }
    ],
    messages=[
        {
            "role": "user",
            "content": "Build a concurrent worker pool in Go with graceful shutdown.",
        }
    ],
)

print(response)
```

### レスポンス構造（成功時）

```json
{
  "role": "assistant",
  "content": [
    { "type": "text", "text": "Let me consult the advisor on this." },
    { "type": "server_tool_use", "id": "srvtoolu_abc123", "name": "advisor", "input": {} },
    {
      "type": "advisor_tool_result",
      "tool_use_id": "srvtoolu_abc123",
      "content": {
        "type": "advisor_result",
        "text": "Use a channel-based coordination pattern. The tricky part is draining in-flight work during shutdown..."
      }
    },
    { "type": "text", "text": "Here's the implementation. I'm using a channel-based coordination pattern..." }
  ]
}
```

- `server_tool_use.input` は**常に空**（クライアントが値を入れてもアドバイザーには届かない。サーバがトランスクリプトから文脈を構築する）。
- `advisor_tool_result.content` は判別共用体で、平文の `advisor_result`（`text`/`stop_reason`）か、暗号化された `advisor_redacted_result`（`encrypted_content`/`stop_reason`）のいずれか。**いずれも次ターン以降はそのまま（verbatim）往復させる**こと。
- マルチターンでは、`advisor_tool_result` を含む assistant content を次リクエストにそのまま戻します。**履歴に `advisor_tool_result` が残っているのに tools からアドバイザーツールを外すと `400`** になります。

---

## 4. 課金 — `usage.iterations` で内訳を読む

- アドバイザー呼び出しは**別サブ推論**として、**アドバイザーモデルのレート**で課金されます。エグゼキュータ分はエグゼキュータのレートで課金。
- 使用量は `usage.iterations[]` 配列で報告されます。`type: "advisor_message"`（`model` にアドバイザーモデルID付き）がアドバイザー課金分、`type: "message"` がエグゼキュータ課金分。
- **トップレベルの `usage` はエグゼキュータのトークンのみ**を反映するため、正確なコストは `usage.iterations` を使って計算します。

```json
{
  "usage": {
    "input_tokens": 412,
    "output_tokens": 531,
    "iterations": [
      { "type": "message", "input_tokens": 412, "output_tokens": 89 },
      { "type": "advisor_message", "model": "claude-opus-4-8", "input_tokens": 823, "output_tokens": 1612 },
      { "type": "message", "input_tokens": 1348, "cache_read_input_tokens": 412, "output_tokens": 442 }
    ]
  }
}
```

コスト削減が成立する理屈は、**アドバイザー（高いモデル）は最終出力を生成せず、最終生成は安いエグゼキュータが担う**ためです。Opus を"判断の瞬間だけ"使う形になります。

> **Priority Tier の注意**: Priority Tier はモデルごとに適用されます。エグゼキュータの Priority Tier はアドバイザーには及ばないため、アドバイザーモデル側でも別途必要です。

---

## 5. ベンチマーク（公式の数値と二次情報の区別）

公式ブログ「The Advisor Strategy」が示す数値は次の通りです。

- **SWE-bench Multilingual**: Sonnet＋Opusアドバイザーは、Sonnet単独比で **+2.7 パーセンテージポイント**、かつ**タスクあたりコスト 11.9% 削減**。
- **BrowseComp**: Haiku 単独 **19.7%** → Haiku＋Opusアドバイザー **41.2%**（単独の2倍超）。Haiku＋Opusアドバイザーは「**Sonnet 単独**にスコアで29%劣るが、タスクあたりコストは **85% 安い**」。

> **数値の扱いに関する注記**:
> - SWE-bench Multilingual の**絶対値「Sonnet単独 72.1% → 74.8%」は複数の二次記事で報じられています**が、公式ブログ本文では「+2.7pp」のデルタのみで、本記事の調査では**一次ソースでの絶対値の裏取りはできませんでした**（差分は 74.8−72.1＝2.7pp で公式デルタと整合）。
> - 「コスト85%削減」の比較対象は **Sonnet 単独**です（Opus 単独比ではありません）。

---

## 6. 制約・注意点

| 項目 | 内容 |
|:---|:---|
| 対応プラットフォーム | **Claude API / Claude Platform on AWS のみ**。**Bedrock・Vertex AI・Microsoft Foundry は非対応** |
| ストリーミング | アドバイザー部分は非対応（実行中エグゼキュータのストリームが一時停止） |
| 呼び出し上限 | `max_uses` は**リクエスト単位**（会話単位ではない）。会話全体の制御はクライアント側で |
| `max_tokens` | トップレベルはエグゼキュータ出力のみ制限。アドバイザー出力は tool 定義の `max_tokens` で別途制限（最小1024・推奨2048） |
| エラー時 | アドバイザー失敗時も**リクエスト自体は失敗せず**、エグゼキュータは助言なしで続行（`max_uses_exceeded` / `overloaded` 等のエラーコード） |
| ZDR | Zero Data Retention 対象機能 |
| Batch | バッチ処理に対応（`usage.iterations` はアイテムごとに報告） |

---

## 7. 向いている用途・向かない用途

**向いている**
- 長期的なエージェント型ワークロード（コーディングエージェント・computer use・複数ステップ調査）で、**大半は機械的だが優れた計画が決定的に効く**場合。
- すでに Sonnet で複雑タスクを回している → Opus をアドバイザーに足し、同等以下のコストで品質を底上げ。
- Haiku の知能を底上げしたい → Opus をアドバイザーに（Haiku単独より高コストだが、エグゼキュータを大型化するより安い）。

**向かない**
- 単一ターンの Q&A（計画する対象がない）。
- ユーザー自身がコスト/品質を選ぶ pass-through 型のモデルピッカー。
- 全ターンが本当にアドバイザーモデルのフル能力を要するワークロード（それなら最初から Opus を実行役に）。

> **プロンプトのコツ**: コーディングではエグゼキュータがアドバイザーを過少に呼びがちなため、「いつ助言を求めるか」を指示するシステムプロンプトを前置すると効果的です（早期に1回＋難所での最終1回など、タスクあたり2〜3回が目安）。アドバイザー出力を短くしたいときは、user メッセージに直接「(Advisor: please keep your guidance under 80 words)」のように書くのが最も効きます。

---

## まとめ

- Advisor Tool は、**安いモデル（エグゼキュータ）が要所だけ Opus（アドバイザー）に助言を求める**仕組み。単一APIコールで完結し、最終生成は安いモデルが担うためコストを抑えられる。
- アドバイザーは**ツールも最終出力も生成しない**。`type: advisor_20260301` / `name: "advisor"` / tool 内 `model` でアドバイザーを指定し、`anthropic-beta: advisor-tool-2026-03-01` で有効化。
- 対応は **API / Claude Platform on AWS のみ**（Bedrock/Vertex/Foundry 非対応）。課金は `usage.iterations` で内訳を読む。
- 公式ベンチは「SWE-bench Multilingual +2.7pp・コスト11.9%減」「BrowseComp で Haiku が約2倍、Sonnet単独比85%安」。
- 「機械的なターンが多いが要所の判断が効く」エージェントに最も向く。

---

## 参考資料

- [Advisor tool — Anthropic 公式ドキュメント（一次）](https://platform.claude.com/docs/en/agents-and-tools/tool-use/advisor-tool)
- [The Advisor Strategy — Anthropic 公式ブログ（2026-04-09・一次）](https://claude.com/blog/the-advisor-strategy)
- [Anthropic API Pricing（公式）](https://www.anthropic.com/pricing)
