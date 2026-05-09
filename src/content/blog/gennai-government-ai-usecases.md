---
title: "源内ユースケース集 — どの業務に向くか／公開済みAIアプリ事例"
date: 2026-05-09
updatedDate: 2026-05-09
category: "その他技術"
tags: ["源内", "ガバメントAI", "デジタル庁", "OSS", "ユースケース", "RAG", "Bedrock", "Vertex AI", "vLLM", "自治体"]
excerpt: "源内（GenAI）が向く業務／向かない業務を整理し、公開済み3つの行政実務用 AIアプリ（AWS Query Expansion RAG、Azure vLLM/PLaMo、Google Cloud 法制度RAG lawsy-custom-bq）を技術スタック付きで解説。議事録要約・文書校正・法令検索など行政業務マッピング、自治体の規模別導入難易度、民間内製AI基盤としての参考価値、競合プロダクト（GenU/Copilot Studio/Dify）との比較をシリーズ最終回として整理。"
draft: false
---

## 関連記事ナビゲーション（源内シリーズ）

| # | 記事 |
|---|---|
| 1 | [源内（ガバメントAI）概要 — OSS化の意義と全体像](/mdTechKnowledge/blog/gennai-government-ai-overview/) |
| 2 | [源内アーキテクチャ詳解 — 源内Web × 源内AIアプリの2層構成](/mdTechKnowledge/blog/gennai-government-ai-architecture/) |
| 3 | [源内をデプロイする — AWS CDK でのセットアップから運用まで](/mdTechKnowledge/blog/gennai-government-ai-deployment/) |
| **4** | **源内ユースケース集 — どの業務に向くか／公開済みAIアプリ事例**（本記事） |

---

## 1. はじめに — 源内が向く業務／向かない業務

シリーズ最終回として、**「実際に何に使うのか」** を整理します。源内は汎用 AI ポータルではなく、**行政・大規模組織の業務に最適化された設計** です。

| 評価軸 | 向く | 向かない |
|---|---|---|
| **データの機密性** | 高い（外部 SaaS に出せない） | 低い（公開情報のみ） |
| **利用者規模** | 数百〜十数万人 | 個人〜数十人 |
| **業務の定型性** | 一定パターンで反復 | 都度ゼロから企画 |
| **ガバナンス要件** | 監査ログ・チーム制御必須 | ベスト・エフォート |
| **クラウド環境** | AWS / Azure / Google Cloud いずれかが主軸 | クラウドベンダーロック回避が最優先 |
| **AI モデル選定** | Bedrock / Azure OpenAI / Vertex AI のいずれか | 自前 LLM を細かくチューニング |

---

## 2. 公開済み3つの行政実務用 AI アプリ

[`digital-go-jp/genai-ai-api`](https://github.com/digital-go-jp/genai-ai-api) リポジトリに、**ガバメントクラウド採択の3クラウドそれぞれに対応する AI アプリ**が公開されています。

| # | クラウド | アプリ名 | 用途 | 技術スタック |
|---|---|---|---|---|
| **A** | AWS | [`query-expansion-rag`](https://github.com/digital-go-jp/genai-ai-api/tree/main/aws/query-expansion-rag) | 行政文書 RAG | Bedrock + OpenSearch Serverless + Lambda + CDK |
| **B** | Azure | [`genai-azure`](https://github.com/digital-go-jp/genai-ai-api/tree/main/azure/genai-azure) | LLM セルフホスト | vLLM + PLaMo翻訳 / Azure OpenAI + Bicep + APIM |
| **C** | Google Cloud | [`lawsy-custom-bq`](https://github.com/digital-go-jp/genai-ai-api/tree/main/google-cloud/lawsy-custom-bq) | 日本法令 RAG | Vertex AI Gemini 2.5 Flash + BigQuery ML + Cloud Functions + Terraform |

---

## 3. AWS: Query Expansion RAG（行政文書検索）

### 3-1. 概要

複数の RAG アプリを **設定ファイル変更だけで並行デプロイ** できる CDK プロジェクト。クエリ拡張・ナレッジベース検索・関連性評価・回答生成の一連の RAG 処理を Lambda で実装。

### 3-2. アーキテクチャ

```
Client → API Gateway (x-api-key) → Lambda (Python)
   │
   ├─→ Bedrock Converse API（クエリ拡張）
   ├─→ Bedrock Knowledge Base（×n 並列検索）
   │     └─→ OpenSearch Serverless + S3
   └─→ Bedrock Converse API（回答生成）
```

### 3-3. 主要特徴

| 特徴 | 内容 |
|---|---|
| **マルチRAG並行運用** | 1 コードベースで複数 RAG（規程集／FAQ／議事録 等）を別個にデプロイ |
| **クエリ拡張** | 単一クエリを n 個の派生クエリに展開して再現率向上 |
| **暗号化方式選択可能** | 個別 CMEK ／ 共通 CMEK の 2 方式 |
| **OpenSearch Serverless 共有** | 共通 CMEK で OCU 効率化（コスト削減） |
| **キーローテーション自動化** | KMS 自動ローテーション有効 |

### 3-4. 想定行政ユースケース

- 各府省庁の **規程集 RAG**（人事・経理・調達等のルール検索）
- **議事録ナレッジベース**（過去の検討内容引き当て）
- **政策資料データベース**（過去政策と類似事案の参照）

---

## 4. Azure: vLLM / Azure OpenAI セルフホスト

### 4-1. 概要

Hugging Face の OSS LLM や Azure OpenAI を **Azure 上で効率的にホスト** するテンプレート。実装例として **PLaMo翻訳モデル**（Preferred AI 製）が同梱。

### 4-2. アーキテクチャ要素

| Azure サービス | 用途 |
|---|---|
| **VMSS（Virtual Machine Scale Sets）** | vLLM コンテナをスケールアウトでホスト |
| **APIM（API Management）** | API ゲートウェイ／ポリシーカスタマイズ |
| **Azure OpenAI** | Chat Completions / Responses / Code Interpreter |
| **Application Insights** | メトリクス・ログ |
| **Bicep** | IaC |

### 4-3. 動作モード

| モード | 用途 |
|---|---|
| **vLLM 変換モード** | 独自カスタム API 形式（PLaMo 等）を OpenAI 互換に変換 |
| **vLLM パススルーモード** | OpenAI 互換 API をそのまま転送 |
| **Azure OpenAI 直接** | Chat Completions / Responses / Code Interpreter |

### 4-4. 想定行政ユースケース

- **機微情報を含む翻訳業務**（外交文書翻訳・国際会議資料）
- **特定領域に fine-tune した日本語 LLM**（行政固有用語）
- **Code Interpreter による集計業務自動化**（統計データの整形）

VMSS + 自動起動／停止スケジューリングが標準で組み込まれており、**夜間停止でコスト削減**が可能です。

---

## 5. Google Cloud: lawsy-custom-bq（日本法令 RAG）

### 5-1. 概要

**法令に関する質問を受け取り、AI が意図解析して最適化されたレポートを動的生成** する Cloud Functions ベースのサーバーレス API。BigQuery ML のベクトル検索 + Gemini で日本の法令データ（e-Gov）を対象に検索。

### 5-2. 主要機能

| 機能 | 内容 |
|---|---|
| **法令検索** | BigQuery ML のベクトル検索で関連法令を高速取得 |
| **レポート生成** | 6パターン（沿革／改正／参照／比較 等）から最適構造を選択し1回の AI 呼び出しで包括レポート |
| **出典管理** | 実際に引用された参考情報のみ整理して表示 |
| **Web Grounding** | Gemini の Web grounding で最新情報も参照（フォールバック付） |

### 5-3. 処理フロー

```
HTTP リクエスト
  → 法令名推定 (3段階フォールバック)
  → 並列実行:
      ├─ BigQuery ML ベクトル検索
      ├─ Web 検索 (redirect 解決)
      └─ クエリ URL 取得（含まれる場合）
  → 条文選択・全文取得
  → レポート生成 (6パターン自動選択)
  → 出典フィルタリング
  → 後処理 (Mermaid sanitize・引用リンク化)
  → HTTP レスポンス
```

### 5-4. 想定行政ユースケース

- **法令適用判断**（条例 vs 法律の整合確認）
- **改正履歴の追跡**（過去の条文変遷）
- **政策資料への引用作成**（出典自動整形）

民間でも法務部門・コンプライアンス部門で参考になる実装です。

---

## 6. 行政業務×源内 マッピング

### 6-1. 汎用5アプリで対応可能な業務（源内Web 標準同梱）

| 業務 | 使う汎用アプリ | 例 |
|---|---|---|
| **議事録要約** | チャット／文章生成 | 録音文字起こし → 要約 |
| **文書校正** | 文章生成 | メール／報告書の表現チェック |
| **多言語翻訳** | 翻訳 | 英語論文／海外公文書 |
| **アイデア発散** | チャット | 政策案のブレインストーミング |
| **資料図解** | ダイアグラム生成 | 組織図／フロー図の draft |

### 6-2. 行政実務用 AI アプリ（ExApp）が必要な業務

| 業務 | 必要 AI アプリ | 提供形態 |
|---|---|---|
| **規程集 RAG** | AWS Query Expansion RAG | 自組織で構築 |
| **法令検索・引用** | Google lawsy-custom-bq | デジタル庁が公開、再利用可 |
| **過去政策事案の参照** | AWS Query Expansion RAG（カスタム RAG） | 自組織で構築 |
| **特殊翻訳・要約** | Azure vLLM | 自組織で構築 |
| **統計データ集計** | Azure Code Interpreter | 自組織で構築 |
| **申請書 OCR + 校閲** | カスタム ExApp | 自組織で構築 |

---

## 7. 自治体への展開シナリオ

| 規模 | 想定 | 導入難易度 | 備考 |
|---|---|---|---|
| **都道府県（人口 100万人〜）** | 自治体内部の AI ポータル | ★★★（中） | デジタル戦略課が主導、エンジニアリングチーム必要 |
| **政令市（70万〜）** | 単独運用可能 | ★★★ | クラウド運用知見が十分必要 |
| **中核市（20万〜）** | 単独 or 広域連携 | ★★★★（高） | 共同調達／共同利用が現実的 |
| **一般市町村** | 広域連携必須 | ★★★★★（最高） | 都道府県 or 民間ベンダー経由が現実的 |

### 7-1. 共同利用モデルの可能性

複数自治体が **1 つの源内インスタンスを共有**する運用は、**チーム単位の権限分離が標準実装されているため技術的に可能**です:

```
共同インスタンス
├── A市 チーム（A市職員のみ）
├── B市 チーム（B市職員のみ）
└── 共通チーム（標準アプリのみ全員利用可）
```

ただし **データ分離の法的整理（個人情報保護条例の整合性）** が前提です。

---

## 8. 民間企業での参考活用

### 8-1. 大企業の内製 AI ポータル

源内の構造は **大企業の内製 AI 基盤** のリファレンスとして有用です。特に:

| 要素 | 民間で参考になる箇所 |
|---|---|
| ExApp プロトコル | 部門ごとに AI アプリを後付けできる **Generic LLM Gateway** 設計 |
| チーム管理 | **多階層組織の権限統制** |
| マルチクラウド | **クラウドロック回避**の参考実装 |
| 監査ログ | **規制業界（金融・医療）での監査要件**対応 |

### 8-2. SaaS 事業者の比較対象

エンタープライズ向け AI ポータルを SaaS 提供している事業者にとっては、**「政府が無償で公開する OSS で代替可能な範囲」を可視化されたリファレンス**として機能します。差別化軸の再定義が必要になる可能性があります。

---

## 9. リスクと限界

| リスク | 内容 | 対策 |
|---|---|---|
| **PR 非対応** | 機能要望は本家で受けない | 自組織でフォーク・改修するチーム体制が必要 |
| **クラウドベンダーロック** | CDK / Bicep / Terraform に強く依存 | 採用クラウドの選定を先に固める |
| **GenU 上流追従なし** | GenU 進化を取り込まない構造 | 独自進化を前提に長期保守計画 |
| **多言語対応** | 日本語・英語のみ | 多国籍組織には別途追加対応必要 |
| **Bedrock/Azure OpenAI 依存** | 各クラウドの LLM 提供状況に左右される | 複数モデル併用の設計余地を残す |
| **アクセシビリティ未達部位** | 画像生成パラメータ調整等 | 法令対応時は補修必要 |
| **デジタル庁の保守継続性** | 政府事業のため予算次第 | フォークによる自組織側でのメンテ準備 |

---

## 10. 競合・代替プロダクト比較

| 観点 | **源内** | GenU 直利用 | Microsoft Copilot Studio | Dify | 民間 SaaS（各種） |
|---|---|---|---|---|---|
| **コスト** | OSS 無料（クラウド代のみ） | OSS 無料 | 月額課金 | OSS 無料 / SaaS有 | 月額課金 |
| **ガバナンス** | ◎（チーム・監査） | △ | ○ | ○ | ◎ |
| **マルチクラウド** | ◎（AWS/Azure/GCP） | × AWS のみ | × Azure 中心 | ○ | ベンダー次第 |
| **デザイン統一** | ◎（デジタル庁デザインシステム） | × | × | × | ベンダー次第 |
| **行政適合性** | ◎（最初から想定） | × | △ | △ | △ |
| **カスタマイズ性** | ◎（OSS） | ◎（OSS） | ○ | ◎ | × |
| **アクセシビリティ** | ◎（WCAG 2.0 AA 試験済） | × | △ | △ | ベンダー次第 |
| **コミュニティ** | ×（PR 受付なし） | ◎ | ○ | ◎ | × |
| **学習コスト** | 中（CDK + 設計理解） | 中 | 低 | 低 | 低 |

**棲み分け**:
- **政府・自治体**: 源内が第一候補
- **大企業内製**: 源内 or GenU（Microsoft 環境なら Copilot Studio）
- **中小企業 / スタートアップ**: Dify or SaaS が現実的
- **特定 AI チャット用途のみ**: SaaS で十分

---

## 11. 導入判断フローチャート

```
組織の規模は？
├ 数百人未満 ─→ Dify / SaaS で十分
└ 数百人以上
    │
    機密情報を扱うか？
    ├ いいえ ─→ Copilot / SaaS でOK
    └ はい
        │
        既存クラウド主軸は？
        ├ AWS         ─→ 源内 or GenU
        ├ Azure       ─→ 源内（Azure 経路）or Copilot Studio
        ├ Google Cloud ─→ 源内（GCP 経路）
        └ ハイブリッド ─→ 源内（マルチクラウド）
```

---

## まとめ

| 観点 | ポイント |
|---|---|
| **公開アプリ** | 3 クラウド × 各 1 アプリ（RAG / セルフホスト / 法令RAG）が即利用可能 |
| **行政業務マッピング** | 汎用5アプリで多くカバー、特殊業務は ExApp で追加 |
| **自治体展開** | 都道府県・政令市は単独運用可能、中核市以下は広域連携が現実的 |
| **民間活用** | 内製 AI 基盤の参考実装、ExApp は **Generic LLM Gateway** として有用 |
| **競合比較** | 政府・大組織での「ガバナンス × カスタマイズ × マルチクラウド」要件で **源内が最も適合** |

シリーズ全4回を通じて、源内の **概要・技術・実装・活用** の全体像を整理しました。OSS としての公開は始まったばかりで、今後の自治体・民間での採用事例・派生プロジェクトの登場が期待されます。

---

## 参考資料

- [源内Web（GitHub）](https://github.com/digital-go-jp/genai-web)
- [源内AIアプリ（GitHub）](https://github.com/digital-go-jp/genai-ai-api)
- [AWS Query Expansion RAG（README）](https://github.com/digital-go-jp/genai-ai-api/tree/main/aws/query-expansion-rag)
- [Azure GenAI / vLLM テンプレート（README）](https://github.com/digital-go-jp/genai-ai-api/tree/main/azure/genai-azure)
- [Google Cloud lawsy-custom-bq（README）](https://github.com/digital-go-jp/genai-ai-api/tree/main/google-cloud/lawsy-custom-bq)
- [Generative AI Use Cases (GenU)](https://github.com/aws-samples/generative-ai-use-cases)
- [Dify](https://dify.ai/)
- [Microsoft Copilot Studio](https://www.microsoft.com/microsoft-copilot/microsoft-copilot-studio)

---

## シリーズまとめ

| 記事 | 主題 |
|---|---|
| [#1 概要](/mdTechKnowledge/blog/gennai-government-ai-overview/) | OSS 化の背景・ライセンス・GenU との関係 |
| [#2 アーキテクチャ](/mdTechKnowledge/blog/gennai-government-ai-architecture/) | 2層構成・ExApp プロトコル・SAML 認証 |
| [#3 デプロイ](/mdTechKnowledge/blog/gennai-government-ai-deployment/) | AWS CDK 手順・SAML 連携・コスト見積 |
| **#4 ユースケース**（本記事） | 公開アプリ詳解・業務マッピング・競合比較 |

---

*本記事は2026年5月9日時点の公開情報に基づきます。源内の公開アプリ・対応クラウドは今後拡充される可能性があります。*
