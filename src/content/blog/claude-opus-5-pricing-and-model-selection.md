---
title: "Claude Opus 5 リリースで変わった単価とモデル選択 — 全モデル単価総覧＋Claude Code で旧モデル（Opus 4.8 等）を指定する方法"
date: 2026-07-25
category: "Claude技術解説"
tags: ["Claude", "Claude Code", "Opus 5", "Opus 4.8", "トークン単価", "モデル選択", "model alias", "コスト比較", "Anthropic"]
excerpt: "2026年7月24日リリースの Claude Opus 5 は、Opus 4.8 と同額の $5/$25 で世代交代した（Fable 5 の半額で、それに迫る性能）。本記事は前半で Claude 全モデルの per-MTok 単価を Batch・プロンプトキャッシュ・fast mode まで含めて総覧し、後半で『Claude Code の /model ピッカーから Opus 4.8 が消えた＝もう選べない？』という疑問に答える。結論は選べる — v2.1.219 で opus エイリアスの解決先が Opus 5 に変わりピッカー行が統合されただけで、旧モデルはフルモデル名（claude-opus-4-8）で明示指定すれば従来どおり使える。4つの指定方法、モデル別の必要バージョン、セッション単位と既定値の違い、実測結果までまとめる。"
draft: false
---

> ## 要点
>
> - **2026年7月24日、Claude Opus 5（`claude-opus-5`）がリリース**。単価は **$5 / $25 per MTok** で、**Opus 4.8 とまったく同額のまま世代交代**した（Fable 5 の**半額**でそれに迫る性能）。
> - Opus 4.8 は**値上げも廃止もされていない**。同額 $5/$25 で提供が続いており、deprecated マークも付いていない。
> - **Claude Code の `/model` ピッカーから Opus 4.8 の行が消えた**のは、v2.1.219 で **`opus` エイリアスの解決先が Opus 5 に変わり、Opus 行が統合された**ため。**選べなくなったわけではない**。
> - **旧モデルはフルモデル名で明示指定すれば使える**: `/model claude-opus-4-8`（セッション中に切替＋既定保存）／`claude --model claude-opus-4-8`（起動時・そのセッションのみ）／`ANTHROPIC_MODEL`（環境変数）／`ANTHROPIC_DEFAULT_OPUS_MODEL`（`opus` エイリアス自体を固定）。
> - Opus 5 特有の実務ポイント: **思考（thinking）が既定でオン**、`thinking: disabled` は **effort `high` 以下でのみ可**、プロンプトキャッシュ最小が **512トークン**（4.8 は 1024）、**レート上限は Opus 4.x とは別枠**。

## 1. Claude Opus 5 とは — 「Opus 4.8 と同額で世代交代」

2026年7月24日、Anthropic は **Claude Opus 5** をリリースしました。ポジションは明快で、**最上位 Fable 5 の半額で、その知能に迫る**モデルです。Claude Max では既定モデルに、Claude Pro では選択可能な最上位モデルになりました。

料金面での最大のポイントは、**値上げなしの世代交代**である点です。

| 項目 | Claude Opus 5 | Claude Opus 4.8（前世代） |
|:---|:---|:---|
| モデルID | `claude-opus-5` | `claude-opus-4-8` |
| 入力 / 出力（per MTok） | **$5 / $25** | **$5 / $25**（同額） |
| コンテキスト | 1M（既定かつ最大） | 1M |
| 最大出力 | 128K | 128K |
| 提供状況 | 現行フロンティア主力 | **継続提供**（deprecated ではない） |

「新モデルが出たら旧モデルは値上げか廃止」というパターンではなく、**同じ値段で性能だけが上がった**形です。だからこそ「旧モデルを使い続けたい理由」は主に**挙動の互換性**（後述）になります。

## 2. Claude 全モデル 単価総覧（2026年7月25日時点）

per-MTok（100万トークンあたり）の USD 単価です。すべて[公式 pricing ページ](https://platform.claude.com/docs/en/about-claude/pricing)の値です。

### 標準単価

| モデル | モデルID | 入力 | 出力 | キャッシュ読取 | 備考 |
|:---|:---|:---:|:---:|:---:|:---|
| **Fable 5** | `claude-fable-5` | $10 | $50 | $1 | 最上位。思考は常時オン |
| Mythos 5 | `claude-mythos-5` | $10 | $50 | $1 | Project Glasswing 限定 |
| **Opus 5** 🆕 | `claude-opus-5` | **$5** | **$25** | $0.50 | **新フロンティア主力（7/24）** |
| **Opus 4.8** | `claude-opus-4-8` | $5 | $25 | $0.50 | 前世代・継続提供 |
| Opus 4.7 / 4.6 / 4.5 | `claude-opus-4-7` 他 | $5 | $25 | $0.50 | いずれも同額 |
| **Sonnet 5** | `claude-sonnet-5` | **$2** | **$10** | $0.20 | **導入価格・〜2026-08-31**。9/1以降 $3/$15 |
| Sonnet 4.6 / 4.5 | `claude-sonnet-4-6` 他 | $3 | $15 | $0.30 | |
| **Haiku 4.5** | `claude-haiku-4-5` | $1 | $5 | $0.10 | 軽量。コンテキストは 200K |

> **Opus 4.1 は $15/$75 のまま**（deprecated・2026-08-05 リタイア予定）で、Opus 4.5〜5 の $5/$25 とは3倍差があります。まだ 4.1 を使っている場合、**移行するだけでコストが1/3**になります。

### Batch API（非同期・一律 50% オフ）

| モデル | Batch 入力 | Batch 出力 |
|:---|:---:|:---:|
| Fable 5 | $5 | $25 |
| **Opus 5 / Opus 4.8** | **$2.50** | **$12.50** |
| Sonnet 5（導入価格） | $1 | $5 |
| Haiku 4.5 | $0.50 | $2.50 |

### プロンプトキャッシュの倍率

キャッシュは入力単価に対する倍率で決まります。

| 操作 | 倍率 | 有効期間 |
|:---|:---:|:---|
| キャッシュ書込（5分） | 1.25× | 5分 |
| キャッシュ書込（1時間） | 2× | 1時間 |
| **キャッシュ読取（ヒット）** | **0.1×** | 直前の書込に準拠 |

5分キャッシュなら**2回目の読取で元が取れ**、1時間キャッシュは書込が2倍なので**3回以上読まないと損**、という関係です。

> **Opus 5 の地味に効く改善: キャッシュ最小サイズが 512 トークンに半減**（Opus 4.8 は 1024、Opus 4.7 は 2048、Opus 4.6 は 4096）。**「短すぎてキャッシュされなかった」プロンプトが、コード変更なしでキャッシュ対象になる**ケースがあります。心当たりがあれば再確認する価値があります。

### fast mode（リサーチプレビュー）

| 対象モデル | 入力 | 出力 | 提供範囲 |
|:---|:---:|:---:|:---|
| **Opus 5 / Opus 4.8** | $10 | $50 | **Claude API のみ**（Bedrock・Google Cloud・Foundry 非対応） |

同じモデルを出力トークン毎秒で最大2.5倍速く回す代わりに、単価はちょうど2倍（＝Fable 5 と同額）になります。Opus 4.7 の fast mode は**削除済み**で、指定するとエラーになります。

### 他社との比較

クラス横断の比較（Gemini・GPT-5.6・Kimi K3 等を含む）は、別記事に単価表を整理しています。**Opus 5（$5/$25）は GPT-5.6 Sol（$5/$30）と入力同額・出力で約2割安**という位置関係です。

→ [AIトークン単価の価格破壊が止まらない — Claude・Gemini・GPT-5.6・Copilot 単価総覧](/mdTechKnowledge/blog/llm-token-price-comparison-2026/)

## 3. 【本題】Claude Code で Opus 4.8 は指定できなくなった？ → 選べます

Opus 5 リリース後、Claude Code で `/model` を開くと、**ピッカーに Opus 4.8 の行が見当たらなくなります**。「旧モデルは選べなくなったのか」と受け取られやすいのですが、**そうではありません**。

### 何が変わったのか（v2.1.219）

CHANGELOG の該当エントリは次のとおりです。

- `Added Claude Opus 5 (claude-opus-5), now the default Opus model — 1M context`
- `Fixed the /model picker showing the merged Opus row as plain 'Opus' instead of 'Opus (1M context)'`
- `Removed Opus 4.7 from fast mode; /fast now applies to Opus 5 and Opus 4.8`

つまり、

1. **`opus` エイリアスの解決先が Opus 4.8 → Opus 5 に変わった**
2. **ピッカーの Opus 行が「統合行」になった**（＝バージョンごとに行が並ぶわけではない）

という2点の結果、**ピッカー上は Opus 5 しか見えない**状態になっています。公式ドキュメントも明記しています。

> エイリアスはプロバイダーごとの推奨バージョンを指し、時間とともに更新される。**特定バージョンに固定するには、フルモデル名（例: `claude-opus-5`）を使うか、対応する環境変数（例: `ANTHROPIC_DEFAULT_OPUS_MODEL`）を設定する。**

**エイリアスとピッカーは常に「最新版」を指す設計で、旧バージョンはフルモデル名で明示指定する**——これが Claude Code のモデル選択の基本ルールです。

### 旧モデルを指定する4つの方法

| # | 方法 | 書き方 | 適用範囲 |
|:---:|:---|:---|:---|
| 1 | **セッション中に切替** | `/model claude-opus-4-8` | 即時切替。**v2.1.153 以降は新規セッションの既定としても保存される** |
| 2 | **起動時に指定** | `claude --model claude-opus-4-8` | **起動したセッションのみ**（既定は変えない） |
| 3 | **環境変数** | `ANTHROPIC_MODEL=claude-opus-4-8` | そのセッションのみ |
| 4 | **エイリアス自体を固定** | `ANTHROPIC_DEFAULT_OPUS_MODEL=claude-opus-4-8` | 以後 `opus` が 4.8 を指す |

**実測**（Claude Code v2.1.219）でも、ピッカーに出ていない 4.8 がフルモデル名で問題なく選択できることを確認しています。

```
/model claude-opus-4-8
→ Set model to Opus 4.8 and saved as your default for new sessions

/model            ← 引数なしでピッカーを開くと
→ Set model to Opus 5 (1M context) and saved as your default for new sessions
```

引数なしの `/model`（ピッカー）は最新の Opus 5 を選び、**フルモデル名を直接タイプすれば 4.8 が選べる**——想定どおりの挙動です。

### モデルエイリアス一覧

| エイリアス | 挙動 |
|:---|:---|
| `default` | モデル指定を解除し、アカウント種別（または組織既定）の推奨モデルへ戻す |
| `opus` | **最新の Opus**（v2.1.219 以降は Opus 5） |
| `sonnet` | 最新の Sonnet |
| `haiku` | 最新の Haiku |
| `fable` | Fable 5（既定ではないので `/model fable` で明示選択） |
| `opus[1m]` | 1M コンテキストの Opus |
| `opusplan` | **plan モードでは `opus`、実行時は `sonnet`** に自動で切り替える複合モード |

> **`opus` の解決先はプロバイダーで異なります。** v2.1.219 より前は Anthropic API で Opus 4.8（v2.1.154 以降）、Claude Platform on AWS / Bedrock / Google Cloud では v2.1.207 以降が 4.8、それ以前は 4.7 や 4.6 でした。**エイリアスが古いモデルに解決される環境では、新しいモデルはフルモデル名か環境変数で指定**します。

### モデル別の必要バージョン

指定してもモデルが出ない・選べないときは、まず Claude Code のバージョンを疑ってください。

| モデル | 必要な Claude Code バージョン |
|:---|:---|
| **Opus 5** | **v2.1.219 以降** |
| Fable 5 | v2.1.170 以降（ゼロデータ保持環境ではピッカーに出ない/無効表示） |
| Sonnet 5 | v2.1.197 以降 |
| Opus 4.8 | v2.1.154 以降 |

`claude update` で更新できます。

### 知っておくと事故らない挙動

- **`/model` は既定として保存される**（v2.1.153 以降）。「一時的に切り替えたつもり」が次のセッションにも引き継がれます。**そのセッション限りにしたいなら `--model` フラグか `ANTHROPIC_MODEL`** を使います。
- **`--model` / `ANTHROPIC_MODEL` は起動したセッションだけ**に効きます。ターミナルごとに別モデルを同時に走らせたいときは、`/model` で切り替えるのではなく**各ターミナルを別々の `--model` で起動**します。
- **再開したセッションは、保存時のモデルを維持**します（`claude --resume` / `--continue` / `/resume`）。現在の既定設定に引きずられません。ただし復元対象のモデルがリタイア済み、または `availableModels` で除外されている場合は通常の優先順位にフォールバックします。
- **ピッカーの価格表示は Anthropic API 経由のときだけ**出ます。Bedrock などのサードパーティプロバイダーやゲートウェイ経由では、課金元が異なるため価格は表示されません（表示は**ラベルにすぎず**、どのモデルが選ばれるかや実際の請求額には影響しません）。

## 4. Opus 5 に切り替えるときの実務上の注意

単価が同じでも、**挙動は変わっています**。旧モデルを指定し続ける理由がここにあります。

| 項目 | Opus 4.8 | Opus 5 |
|:---|:---|:---|
| **思考（thinking）の既定** | `thinking` 省略時は**思考なし** | **省略時も adaptive で思考する** |
| `thinking: disabled` | 常に指定可 | **effort `high` 以下でのみ可**（`xhigh`/`max` と併用すると 400 エラー） |
| キャッシュ最小サイズ | 1024 トークン | **512 トークン** |
| レート上限 | Opus 4.x 共通プール | **Opus 5 は別枠**（4.x の枠を引き継がない） |
| fast mode | 対応 | 対応（$10/$50・Claude API のみ） |

特に効いてくるのが**思考の既定オン**です。`max_tokens` は「思考＋応答テキスト」の合計に対する上限なので、**4.8 で思考なし前提に `max_tokens` を切り詰めていたワークロードは、Opus 5 で応答が途中で切れる**可能性があります。API を直接叩いている場合は `max_tokens` を見直すか、明示的に `thinking: {type: "disabled"}`（effort は `high` 以下）を指定してください。

また **Opus 5 のレート上限は Opus 4.x とは別バケット**です。トラフィックを移しても 4.x 側の枠が空くわけでも、4.x の枠を引き継ぐわけでもないので、**本番トラフィックを移す前に Opus 5 側の上限を確認**しておくのが安全です。

## まとめ

- **Opus 5 は $5/$25 で Opus 4.8 と同額**。値上げなしの世代交代で、Fable 5 の半額帯にフロンティア級がもう1枚増えた形。
- **Opus 4.8 は継続提供**。ピッカーから消えたのは「`opus` エイリアスが Opus 5 を指すようになり行が統合された」ためで、**廃止ではない**。
- **旧モデルは `/model claude-opus-4-8` のようにフルモデル名で指定すれば選べる**。恒久的に固定したいなら `ANTHROPIC_DEFAULT_OPUS_MODEL`。
- 切替時は **思考の既定オン**（`max_tokens` の見直し）と **別レート枠**の2点に注意。逆に**キャッシュ最小 512 トークン**は黙って効いてくる改善。

## 関連記事

- [AIトークン単価の価格破壊が止まらない — Claude・Gemini・GPT-5.6・Copilot 単価総覧](/mdTechKnowledge/blog/llm-token-price-comparison-2026/) — 他社を含めたクラス横断の単価比較と「フロンティア×安価」のコスト設計
- [これがラストチャンスかも③（完結編）— Fable 5 が7月20日に最終決着](/mdTechKnowledge/blog/claude-fable-5-credit-period-final/) — 最上位 Fable 5 のプラン組み込みと Usage Credits
- [Claude Code バージョン履歴まとめ](/mdTechKnowledge/blog/claude-code-version-history/) — 各バージョンの変更点

## 出典

- [Pricing — Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/pricing)（全モデルの標準単価・Batch・キャッシュ倍率・fast mode）
- [Model configuration — Claude Code Docs](https://code.claude.com/docs/en/model-config)（モデルエイリアス、フルモデル名指定、必要バージョン、優先順位）
- [Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)（v2.1.219 の Opus 5 追加・ピッカー統合・fast mode 対象変更）

*本記事の単価・仕様は 2026年7月25日時点の公式ドキュメントに基づきます。価格・モデル体系は改定されることがあるため、契約・実装前に公式ページで最新の値をご確認ください。*
