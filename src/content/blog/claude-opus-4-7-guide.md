---
title: "Claude Opus 4.7 完全ガイド — GA公開・xhigh effort・1Mコンテキスト・Adaptive Thinking"
date: 2026-04-26
updatedDate: 2026-05-02
category: "Claude技術解説"
tags: ["Claude", "Opus 4.7", "Anthropic", "AIモデル", "リリースノート"]
excerpt: "2026年4月16日にGAとなったClaude Opus 4.7の全体像。1Mトークン無料提供、xhigh effortレベル、画像3倍解像度、Adaptive Thinking、Amazon Bedrock / Google Cloud Vertex AI / Microsoft Foundry のマルチクラウド正式提供まで主要機能を整理。"
draft: false
---

## 1. リリース概要

Anthropic は **2026年4月16日**、フラッグシップモデル **Claude Opus 4.7**（API モデル ID: `claude-opus-4-7`）を一般提供（GA）として公開しました。Opus 4.6 からの世代交代となる本モデルは、長時間にわたるエージェント処理・知識労働・ビジョン・メモリ系タスクで大幅な性能向上を実現しつつ、価格は **入力 $5 / 出力 $25 per MTok と据え置き** です。

| 項目 | 値 |
|------|-----|
| GA 日付 | 2026-04-16 |
| モデル ID | `claude-opus-4-7` |
| 入力料金 | $5 / 1M トークン |
| 出力料金 | $25 / 1M トークン |
| コンテキストウィンドウ | **1M トークン**（追加料金なし） |
| 最大出力トークン | 128k |
| ベンチマーク | SWE-bench Verified 87.6% / SWE-bench Pro 64.3% / Finance Agent v1.1 64.4% |

特筆すべきは、競合モデルが長コンテキストプレミアムを課すなか、Opus 4.7 は **1M トークン窓を標準 API 価格のまま提供**している点です。これは知識労働・コードベース解析・長尺ドキュメント処理での実質コストを大きく押し下げます。

---

## 2. 主要新機能

### 2.1 高解像度画像サポート（3倍）

Opus 4.7 は Claude シリーズで **初の高解像度画像対応モデル**です。

| 項目 | Opus 4.6 まで | Opus 4.7 |
|------|--------------|----------|
| 最大画像解像度 | 1568px / 1.15MP | **2576px / 3.75MP** |
| 座標マッピング | スケール係数計算が必要 | **1:1 でピクセル一致** |

特に **Computer Use・スクリーンショット解析・ドキュメント / アーティファクト理解**といったビジョン重視のワークロードで大きな改善が期待できます。低レベル知覚（指差し・計測・カウント）と画像ローカライゼーション（バウンディングボックス検出）も強化されました。

なお高解像度画像はトークン消費が増えるため、不要なケースではあらかじめダウンサンプルすることが推奨されます。

### 2.2 新 effort レベル `xhigh`

`effort` パラメータの選択肢が拡張され、`high` と `max` の中間に **`xhigh`** が追加されました。コーディング・エージェント用途のスタート地点として推奨されています。

```text
standard  →  high  →  xhigh  →  max
```

知能を要するタスクは最低でも `high`、コーディングや複雑なエージェントループでは `xhigh` から始めるのが Anthropic 推奨の使い方です。

### 2.3 タスクバジェット（パブリックベータ）

**Task budgets** は、エージェントループ全体（思考・ツール呼び出し・ツール結果・最終出力すべて）に対するトークン目安をモデル自身に伝える仕組みです。モデルはカウントダウンを参照しながら作業を優先度付けし、予算消費に合わせてタスクを「綺麗に」終わらせるよう動きます。

```python
response = client.beta.messages.create(
    model="claude-opus-4-7",
    max_tokens=128000,
    output_config={
        "effort": "high",
        "task_budget": {"type": "tokens", "total": 128000},
    },
    messages=[
        {"role": "user", "content": "Review the codebase and propose a refactor plan."}
    ],
    betas=["task-budgets-2026-03-13"],
)
```

`max_tokens` がリクエスト単位のハードキャップなのに対し、`task_budget` は **エージェントループ全体に対する助言的な上限**である点が違いです。最低値は 20k トークンで、品質優先のオープンエンドな作業には設定しないほうが良いとされています。

### 2.4 Adaptive Thinking（唯一の思考モード）

Opus 4.7 では **Extended thinking budgets が削除**され、**Adaptive Thinking** が唯一サポートされる思考モードになりました。社内評価で Adaptive のほうが Extended を上回るためです。

```python
# Before (Opus 4.6)
thinking = {"type": "enabled", "budget_tokens": 32000}

# After (Opus 4.7)
thinking = {"type": "adaptive"}
output_config = {"effort": "high"}
```

Adaptive Thinking は **デフォルトでオフ**であり、`thinking` フィールド未指定なら通常生成として動きます。明示的に有効化が必要な点に注意してください。

### 2.5 強化されたソフトウェアエンジニアリング性能

* **SWE-bench Verified 87.6% / SWE-bench Pro 64.3%** ― 「特に難易度の高いタスク」での向上が顕著
* **より直接的・断定的な口調**（4.6 のように共感フレーズや絵文字を多用しない）
* **デフォルトのツール呼び出し回数が減少**し、推論で済ませる傾向
* **サブエージェント生成も控えめ**（プロンプトで誘導可能）
* **進捗の中間報告がより頻繁に**

---

## 3. effort コントロール（`/effort`）

`effort` は知能とトークン消費・レイテンシのトレードオフを制御するパラメータです。Claude Code では対話型スライダー `/effort` で切替できます。

| レベル | 主な用途 |
|-------|---------|
| `standard` | 軽量タスク・低レイテンシ重視 |
| `high` | 知能を要する一般用途のミニマム推奨値 |
| `xhigh` | コーディング・エージェント用途の推奨スタート |
| `max` | 最も難易度の高い問題、検証・レビュー用途 |

**Messages API 専用**の制御で、Claude Managed Agents は自動で適切な effort を割り当てます。

---

## 4. 利用可能プラットフォーム

Opus 4.7 は **2026年4月16日の GA と同時に Anthropic API・Amazon Bedrock・Google Cloud Vertex AI・Microsoft Foundry の4プラットフォームで正式提供開始**となりました。本セクションでは、各クラウドの提供日・リージョン・モデル ID・必要な認証情報を整理します。

| プラットフォーム | 提供開始日 | モデル ID（既定） |
|-----------------|----------|------------------|
| Anthropic API | 2026-04-16 | `claude-opus-4-7` |
| Amazon Bedrock | 2026-04-16 | `us.anthropic.claude-opus-4-7`（クロスリージョン推論プロファイル）|
| Google Cloud Vertex AI | 2026-04-15 | `claude-opus-4-7`（publisher: `anthropic`）|
| Microsoft Foundry | 2026-04-16 | `claude-opus-4-7`（デプロイメント名は変更可）|
| GitHub Copilot Pro+ / Business / Enterprise | 2026-04-16 | `claude-opus-4-7`（モデルピッカー）|

### 4.1 Amazon Bedrock

* **対応リージョン**: US East（バージニア北部）/ Asia Pacific（東京）/ Europe（アイルランド）/ Europe（ストックホルム）の **4 リージョン**
* **モデル ID（推論プロファイル）**: `us.anthropic.claude-opus-4-7`（地域接頭辞は `us.` / `eu.` / `apac.`）
* **API バージョン**: リクエストボディに `"anthropic_version": "bedrock-2023-05-31"` を指定
* **初期スループット**: 10,000 RPM
* **必要な IAM 権限**: `bedrock:InvokeModel` / `bedrock:InvokeModelWithResponseStream`、推論プロファイル利用時は `bedrock:GetInferenceProfile` も必要
* **ゼロオペレータアクセス**: Bedrock の新推論エンジンでは **Anthropic / AWS のオペレータからもプロンプト・応答が見えない**ことが保証されており、機微データを扱うワークロードに適します

```bash
# Bedrock Runtime 経由の例
aws bedrock-runtime invoke-model \
  --model-id us.anthropic.claude-opus-4-7 \
  --body '{
    "anthropic_version": "bedrock-2023-05-31",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello"}]
  }' \
  --cli-binary-format raw-in-base64-out \
  output.json
```

### 4.2 Google Cloud Vertex AI

* **対応リージョン**: US マルチリージョン / EU マルチリージョン / グローバルエンドポイント（`us-east1` などの単一リージョンも順次提供）
* **モデル ID**: `claude-opus-4-7`（Vertex 内部識別子は `anthropic-claude-opus-4-7`）
* **エンドポイント形式**:
  ```
  https://{REGION}-aiplatform.googleapis.com/v1/projects/{PROJECT}/locations/{REGION}/publishers/anthropic/models/claude-opus-4-7:rawPredict
  ```
* **API バージョン**: リクエストボディに `"anthropic_version": "vertex-2023-10-16"` を指定
* **必要な IAM 権限**: `aiplatform.endpoints.predict`（ロール `roles/aiplatform.user` で付与）。Model Garden で **Anthropic Claude Opus 4.7 の利用規約を一度承諾**しておく必要があります
* **既定クォータ（マルチリージョン）**: QPM 400 / 入力 TPM 4,000,000 / 出力 TPM 400,000
* **トークン上限**: 入力 1M / 出力 128k
* **撤退予定**: 2027 年 4 月 16 日より前ではない

### 4.3 Microsoft Foundry

* **対応リージョン**: 起動時は **Global Standard デプロイメント**として提供（US DataZone は近日対応）。EU 圏では **Sweden Central** が現状唯一の Claude 提供 Azure リージョン。米国側は **East US 2** で展開
* **モデル ID / デプロイメント名**: 既定 `claude-opus-4-7`（Foundry ポータルから任意のデプロイメント名に変更可。API には**デプロイメント名**を指定）
* **エンドポイント形式**:
  ```
  https://{resource}.services.ai.azure.com/anthropic/v1/messages
  ```
* **認証方式**: 以下の 2 通り
  * **API キー**: `api-key: <KEY>` または `x-api-key: <KEY>` ヘッダー
  * **Microsoft Entra ID**: `Authorization: Bearer <TOKEN>` ヘッダー（RBAC ロール「Cognitive Services OpenAI User」相当が必要）
* **API バージョンヘッダー**: `anthropic-version: 2023-06-01`
* **コンテキストウィンドウ**: Foundry 上でも **1M トークン**に対応
* **未サポート機能**: Admin API（`/v1/organizations/*`）/ Models API（`/v1/models`）/ Message Batch API（`/v1/messages/batches`）
* **SDK**: 専用パッケージ `@anthropic-ai/foundry-sdk`（TS）、`anthropic` Python SDK の `AnthropicFoundry` クラスなど

```bash
# Foundry エンドポイント呼び出し例（API キー方式）
curl https://my-resource.services.ai.azure.com/anthropic/v1/messages \
  -H "content-type: application/json" \
  -H "api-key: $AZURE_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d '{
    "model": "claude-opus-4-7",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

### 4.4 GitHub Copilot

GitHub Copilot Pro+ / Business / Enterprise 各プランで、VS Code・Visual Studio・JetBrains・Xcode・Eclipse・GitHub.com・モバイル・Copilot CLI から `claude-opus-4-7` を選択可能です。**4/30 まで 7.5× プレミアム倍率**のキャンペーンが適用されています。

---

## 5. Claude Code との統合

Claude Code では Opus 4.7 が **v2.1.111 で xhigh 提供開始**となり、以降以下のような統合が進みました。

* **`/effort` 対話型スライダー** ― standard / high / xhigh / max を即時切替
* **Pro / Max プランの auto モード**で Opus 4.7 を自動選択（v2.1.111 で `--enable-auto-mode` 不要化）
* **`/ultrareview` コマンド** ― Opus 4.7 専用のコードレビューセッション
* **デフォルト effort を high に**（v2.1.117 で Pro/Max の Opus/Sonnet 4.6 にも適用）
* **`auto` モードのフォールバック挙動** ― v2.1.112 で「claude-opus-4-7 temporarily unavailable」エラーが修正されています

`/effort` を高めると応答に時間はかかりますが、難易度の高いリファクタリングや設計レビューで効果を実感しやすい構成です。

---

## 6. 移行ガイド（4.6 → 4.7）

### 6.1 ブレイキングチェンジ（Messages API）

| 変更 | 対応 |
|------|------|
| `thinking.budget_tokens` 廃止 | `thinking: {"type": "adaptive"}` + `output_config.effort` に移行 |
| `temperature` / `top_p` / `top_k` 設定不可（非デフォルト値で 400 エラー） | パラメータ自体を省略しプロンプト誘導に切替 |
| 思考コンテンツがレスポンスからデフォルト省略 | 必要なら `thinking.display = "summarized"` でオプトイン |
| 新トークナイザ（テキスト依存で **1.0〜1.35×** トークン消費増） | `max_tokens` に余裕を持たせる、`task_budget` / `effort` でコスト制御 |

Claude Managed Agents 利用時はこれらの API ブレイキングチェンジは適用されません。

### 6.2 振る舞いの変化（プロンプト調整推奨）

* **より文字通りの指示遵守**（暗黙の一般化をしない）
* **応答の長さがタスクの複雑さに応じて自動調整**（固定の冗長さに依存しない）
* **ツール呼び出し・サブエージェント生成が控えめ**
* **共感フレーズや絵文字が減り直接的な口調に**

既存プロンプトに「スライドレイアウトを再確認してから返答せよ」といった足場が含まれるなら、いったん外してリベースラインを取ることが推奨されます。

### 6.3 ストリーミング UX への影響

思考コンテンツがデフォルト省略されるため、**思考中は出力前の長い無音**として見えます。ユーザーに進捗を見せたい場合は `display: "summarized"` を必ず設定してください。

---

## 7. 周辺アップデート

Opus 4.7 GA と同時期、Anthropic エコシステムでは次のような変化も進行しています。

* **Claude Haiku 3 が廃止**（旧世代 Haiku 系の整理）
* **Claude Design** ― ビジュアルワークフロー強化に伴うデザインツール群の統合
* **Project Glasswing / Mythos Preview** ― 攻撃的サイバー能力を意図的に絞った先行公開トラックへ
* **GitHub Copilot で Opus 4.5 / 4.6 を順次置換** ― モデルピッカーから旧版を整理
* **Bedrock のゼロオペレータアクセス推論エンジン**で機密領域の Claude 利用が拡大
* **Claude Security Beta（2026-05-01 発表）** ― **Opus 4.7 powered** のエンタープライズ向けコードベース脆弱性スキャン・パッチ生成ツール
  * 技術パートナー: **CrowdStrike / Microsoft Security / Palo Alto Networks / SentinelOne / TrendAI / Wiz** が Opus 4.7 を自社セキュリティツールに組み込み
  * サービスパートナー: **Accenture / BCG / Deloitte / Infosys / PwC** がデプロイ支援を提供
  * 既存の `claude-code-leak-report` / `mcp-vulnerability-report` 系の脅威情報に対応する形で、Anthropic 自身がセキュリティ製品レイヤを獲得した位置付け
  * 参考: [Business Standard](https://www.business-standard.com/technology/tech-news/anthropic-announces-claude-security-beta-for-enterprise-customers-126050100019_1.html) / [Anthropic News](https://www.anthropic.com/news)

---

## 8. 用途別推奨

| 用途 | 推奨設定 |
|------|---------|
| コーディング・リファクタリング | `effort: xhigh`、Adaptive Thinking 有効、必要なら `task_budget` 128k |
| 長文・コードベース解析 | 1M コンテキスト + `effort: high`、`max_tokens` 多めに確保 |
| 高解像度ビジョン（Computer Use・スクリーンショット） | 2576px までの原寸投入、座標は 1:1 利用 |
| 知識労働（.docx redlining、.pptx 編集、図表分析） | `effort: high` 以上、ツール使用を許可 |
| 長時間エージェントループ | `effort: xhigh` + `task_budget`（例: 200k）、Memory Tool 併用 |
| レイテンシ重視・軽量タスク | `effort: standard`、思考オフ |

---

## 9. まとめ

Claude Opus 4.7 は、**価格据え置きのまま 1M コンテキスト・3倍解像度ビジョン・xhigh effort・Adaptive Thinking・タスクバジェット**をまとめて押し込んだ、Anthropic の現行最上位モデルです。Messages API ではいくつかのブレイキングチェンジ（thinking budget 廃止、サンプリングパラメータ廃止、新トークナイザ）があるため、Opus 4.6 からの移行時はトークン消費の増加と Adaptive Thinking のオプトインに注意してください。

Claude Code・Amazon Bedrock・Google Cloud Vertex AI・Microsoft Foundry のいずれの経路でも GA 同日（2026-04-16、Vertex のみ 04-15）から利用可能であり、特に Claude Code の `/effort` スライダーと auto モードを組み合わせることで、難易度に応じた賢い切替を簡単に試せます。エージェント長時間タスクには `task_budget`、ビジョン処理には 2576px 投入を、それぞれ最初に試してみてください。マルチクラウド環境ではモデル ID と `anthropic_version`（Bedrock: `bedrock-2023-05-31` / Vertex: `vertex-2023-10-16` / Foundry: `anthropic-version: 2023-06-01`）の差異だけ押さえておけば、ほぼ同一のリクエストボディで切替できます。
