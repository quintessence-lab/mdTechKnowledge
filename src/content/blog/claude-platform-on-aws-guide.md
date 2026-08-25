---
title: "Claude Platform on AWS 完全ガイド — Bedrock との違い・3系統の使い分け・移行の落とし穴"
date: 2026-07-26
updatedDate: 2026-08-26
category: "Claude技術解説"
tags: ["Claude", "AWS", "Amazon Bedrock", "Claude Platform on AWS", "SigV4", "IAM", "AWS Marketplace", "CCU", "データ所在", "移行ガイド"]
excerpt: "2026年5月11日（PT）GAの Claude Platform on AWS を、Amazon Bedrock との違いを軸に徹底解説。最大の違いは『誰がスタックを運用するか』で、Bedrock は AWS が運用（AWSがデータプロセッサ）、Claude Platform on AWS は Anthropic が運用し推論は AWS セキュリティ境界の外で処理される。AWS 経由の Claude には実は3系統（Platform on AWS / Bedrock Mantle / Bedrock レガシー InvokeModel）があり、ベースURL・API形式・モデルID・SDKクライアントがすべて異なる。同日提供の機能パリティ・Agent Skills・anthropic-beta ヘッダーという利点と、HIPAA非対応・fast mode非対応・Admin API制限・ZDRがオプトインという制約、CCU課金の仕組み、16リージョン、outbound web identity federation の有効化忘れという移行の落とし穴まで、公式ドキュメントに基づいて整理する。2026年8月追記: Claude Managed AgentsのWebhooks・マルチエージェントオーケストレーション・セルフホストサンドボックスのAWS対応と、Lambda MicroVMsをサンドボックスに使う新構成（Firecracker隔離・Secrets Manager経由の認証・Webhook署名検証）を追加。"
draft: false
---

> ## 要点
>
> - **2026年5月11日（PT）GA**。Anthropic 初の**クラウドプロバイダ直接統合**で、AWS アカウント・IAM・AWS Marketplace 課金のまま**Anthropic のフルプラットフォーム**を使える。
> - **Bedrock との最大の違いは「誰がスタックを運用するか」**。Bedrock は **AWS が運用**（AWS がデータプロセッサ）、Claude Platform on AWS は **Anthropic が運用**し、**推論データは AWS のセキュリティ境界の外**（Anthropic 側）で処理される。
> - **AWS 経由の Claude は実は3系統**ある（Platform on AWS ／ Bedrock Mantle ／ Bedrock レガシー InvokeModel）。**ベースURL・API形式・モデルID・SDKクライアントがすべて異なる**。
> - **得られるもの**: 新モデル・新機能が**ほぼ同日に利用可**、**Agent Skills**、**コード実行**、**`anthropic-beta` ヘッダーが通る**（Bedrock では非対応）、モデルIDは**プレフィックスなしの素の ID**。
> - **失うもの／制約**: **HIPAA 対応プログラム非対応**、**fast mode 非対応**、**Admin API は大部分が非対応**、**OAuth 非対応**、**OpenAI互換エンドポイント非対応**、**ZDR はオプトイン**（Bedrock では AWS がデータプロセッサのため Anthropic は保持しない）。
> - **最大の移行落とし穴**: アカウントごとに**「outbound web identity federation」の有効化が1回必要**。これを忘れると**全リクエストがフェデレーションエラーで落ちる**（Bedrock では不要な手順）。

## 1. Claude Platform on AWS とは

2026年5月11日（PT）／12日（JST）に GA した、**Anthropic のプラットフォームを AWS アカウント経由でそのまま使える**統合です。別途の Anthropic 契約・認証情報・請求関係を作らずに、**AWS の IAM 認証と AWS Marketplace 課金のまま**、Claude API のフル機能へアクセスできます。

重要なのは、これが **Amazon Bedrock の置き換えではなく併存する選択肢**である点です。公式は「特定のリージョナルなデータ所在要件を持たないチーム向けに**補完する**もの」と位置づけています。

### 動作の実態 — 「AWS 経由」だが「AWS 内」ではない

公式ドキュメントの記述が端的です。

> Claude のモデルは **Anthropic が管理するインフラ上で動作**します。これは**課金とアクセスのための商業的統合**です。**推論の入出力については Anthropic がデータプロセッサ**となります。AWS はマーケットプレイスモデルのもとで**課金とアイデンティティのメタデータを処理**します。

さらに運用特性として、次が明記されています。

- **データが AWS 上に存在しない場合がある**
- **推論が Anthropic のプライマリクラウドへルーティングされる場合がある**
- **サブサービスが予告なく変更される場合がある**

つまり「AWS アカウントから叩けて AWS に請求される」が、「**データが AWS の中に留まる**」わけではありません。ここが Bedrock との本質的な差であり、選定を左右する最大のポイントです。

## 2. 【本題】Bedrock との違い — 実は「3系統」ある

「AWS で Claude を使う」には、現在**3つの異なる経路**が存在します。混同されやすいので、まず全体像を押さえます。

| 観点 | **Claude Platform on AWS** | **Claude in Amazon Bedrock**（現行） | **Amazon Bedrock（Opus 4.6以前・レガシー）** |
|:---|:---|:---|:---|
| **スタックの運用者** | **Anthropic** | **AWS** | **AWS** |
| **API サーフェス** | Claude API（`/v1/{endpoint}`） | Messages API（`/anthropic/v1/messages`） | Bedrock Converse / InvokeModel |
| **ベースURL** | `aws-external-anthropic.{region}.api.aws` | `bedrock-mantle.{region}.api.aws` | `bedrock-runtime.{region}.amazonaws.com` |
| **モデルID** | **`claude-sonnet-5`**（素のID） | **`anthropic.claude-sonnet-5`** | `anthropic.claude-3-5-sonnet-20241022-v2:0`（ARN風） |
| **機能提供時期** | **Claude API とほぼ同日** | Bedrock のリリーススケジュール | Bedrock のリリーススケジュール |
| **`anthropic-beta` ヘッダー** | **通る** | **非対応** | **非対応** |
| **Agent Skills** | **利用可（beta）** | 非対応（コード実行が必要なため） | 非対応 |
| **認証** | AWS IAM / SigV4 **または API キー** | AWS IAM / SigV4 | AWS IAM / SigV4 またはベアラートークン |
| **課金** | **AWS Marketplace** | AWS（ネイティブサービス） | AWS（ネイティブサービス） |
| **SDK クライアント** | `AnthropicAWS`（beta） | `AnthropicBedrockMantle` | `AnthropicBedrock`（レガシー） |

### 押さえるべき3点

**① モデルIDの形式が3系統で全部違う**

これは移行時に最も機械的に効いてくる差です。

```python
# Claude Platform on AWS — 素のID（プレフィックスなし）
model = "claude-sonnet-5"

# Claude in Amazon Bedrock（現行）— anthropic. プレフィックス
model = "anthropic.claude-sonnet-5"

# Bedrock レガシー — ARN風のバージョン付きID
model = "anthropic.claude-3-5-sonnet-20241022-v2:0"
```

Platform on AWS では**ファーストパーティ Claude API と完全に同一のモデルID**が使えます。**Bedrock風の ARN も `anthropic.` プレフィックスも不要**です。

**② `anthropic-beta` ヘッダーが通るかどうか**

これが機能面で最大の分岐点です。Bedrock（現行・レガシーとも）では `anthropic-beta` ヘッダーが**サポートされない**ため、ベータ機能は原則使えません。Platform on AWS では**ファーストパーティと同じようにヘッダーを渡すだけ**でベータ機能にアクセスできます。

**③ 新機能の提供タイミング**

Platform on AWS は「**Anthropic が両プラットフォームを運用しているため、ほとんどの新機能とベータヘッダーが別途の統合作業なしに利用可能になる**」と公式が明言しています。新モデルも**通常はファーストパーティと同日**にローンチされます。Bedrock は AWS 側のリリーススケジュールに従うため、ここにタイムラグが生じます。

## 3. 利用可能なモデルとリージョン

### モデル一覧（公式）

| モデル | モデルID |
|:---|:---|
| Claude Fable 5 | `claude-fable-5` |
| Claude Opus 4.8 / 4.7 / 4.6 / 4.5 | `claude-opus-4-8` ほか |
| Claude Sonnet 5 / 4.6 / 4.5 | `claude-sonnet-5` ほか |
| Claude Haiku 4.5 | `claude-haiku-4-5` |

> **注**: 本記事執筆時点の公式ページ掲載分です。2026年7月24日リリースの **Claude Opus 5（`claude-opus-5`）も Claude Platform on AWS で提供**されています（Opus 5 のリリースノートで明記）。「新モデルは通常同日にローンチ」という方針どおりです。

### 16リージョン（東京含む）

| 地域 | リージョン |
|:---|:---|
| **北米** | US East（バージニア北部）、US East（オハイオ）、US West（オレゴン）、Canada（中部） |
| **南米** | South America（サンパウロ） |
| **欧州** | ダブリン、ロンドン、フランクフルト、ミラノ、チューリッヒ、パリ、ストックホルム |
| **アジア太平洋** | **東京**、ソウル、メルボルン、ジャカルタ、シドニー |

> ⚠️ **リージョン ≠ 推論の実行場所**。公式は明確に警告しています。「ワークスペースが紐づく AWS リージョンは、**呼び出すゲートウェイのエンドポイントと、AWS 側リソース（IAM・CloudTrail・課金）のスコープを決める**だけで、**モデル推論がどこで実行されるかを固定しない**」。推論地域を固定したい場合は、後述の `inference_geo` パラメータを使います。

## 4. 認証 — SigV4 と API キーの2択

Bedrock と違い、**SigV4 に加えて API キー認証**も選べます。

### SigV4（推奨・本番向け）

```bash
curl "https://aws-external-anthropic.us-west-2.api.aws/v1/messages" \
  --aws-sigv4 "aws:amz:us-west-2:aws-external-anthropic" \
  --user "$AWS_ACCESS_KEY_ID:$AWS_SECRET_ACCESS_KEY" \
  -H "x-amz-security-token: $AWS_SESSION_TOKEN" \
  -H "content-type: application/json" \
  -H "anthropic-version: 2023-06-01" \
  -H "anthropic-workspace-id: $ANTHROPIC_AWS_WORKSPACE_ID" \
  -d '{"model":"claude-sonnet-5","max_tokens":1024,"messages":[{"role":"user","content":"Hello!"}]}'
```

**署名サービス名は `aws-external-anthropic`** です（Bedrock の `bedrock` とは異なる）。

### API キー（ローカル開発・スクリプト向け）

> ⚠️ **重要**: Claude Platform on AWS の API キーは **AWS コンソール**（Claude Platform on AWS → API keys）で発行します。**通常の Claude Console で作ったキーはこのエンドポイントでは動きません**。IAM 側で `aws-external-anthropic:CallWithBearerToken` アクションの許可も必要です。

**短期 API キー**という選択肢もあります。SigV4 に対応していないツール（LLM ゲートウェイ、サーバーレス関数など）へ資格情報を渡す場合、AWS 公式のトークンジェネレータライブラリ（[JavaScript](https://github.com/aws/token-generator-for-aws-external-anthropic-js) / [Python](https://github.com/aws/token-generator-for-aws-external-anthropic-python) / [Java](https://github.com/aws/token-generator-for-aws-external-anthropic-java)）で時限トークンを生成できます。**有効期間は既定12時間**で、「要求した期間・AWS 資格情報の有効期限・12時間」の**最も短いもの**が採用されます。

### SDK での認証解決順

```
1. apiKey 引数            → x-api-key ヘッダー
2. awsAccessKey + awsSecretAccessKey → SigV4
3. awsProfile 引数        → 名前付きプロファイルで SigV4
4. ANTHROPIC_AWS_API_KEY 環境変数 → x-api-key ヘッダー
5. AWS 既定の資格情報プロバイダチェーン → SigV4
```

Python なら `from anthropic import AnthropicAWS` → `AnthropicAWS()` で、あとは通常の `client.messages.create(...)` と同じです。**リージョン（`AWS_REGION`）と workspace ID（`ANTHROPIC_AWS_WORKSPACE_ID`）は必須**で、**Bedrock と違ってフォールバックのデフォルト値がありません**。

## 5. データ所在（`inference_geo`）

推論地域は**リクエスト単位**で指定します。

| 設定 | 挙動 | 価格 |
|:---|:---|:---|
| `inference_geo: "us"` | 推論が**米国データセンター内に留まる** | **1.1倍**の乗数 |
| `inference_geo: "global"`（既定） | Anthropic 運用の任意のデータセンターへルーティング | 標準価格 |

**Claude 4.6 以降のモデルでのみサポート**され、Opus 4.5 / Sonnet 4.5 / Haiku 4.5 に指定すると **400 エラー**になります。

**ZDR（Zero Data Retention）はリクエストベースで利用可能**ですが、後述のとおり**オプトイン**です。

## 6. 機能サポート — 得られるものと、失うもの

### 利用できる（Bedrock より有利な点）

- **Agent Skills**（PowerPoint / Excel / Word / PDF の事前構築スキルがそのまま動く）
- **コード実行**（Anthropic 管理のサンドボックス）
- **Claude Managed Agents**（agents / environments / sessions）
- **ツール使用全般**（computer use を含む）
- **拡張思考・ストリーミング・バッチ処理**
- **プロンプトキャッシュ全機能**（5分TTL・1時間TTL・自動キャッシュ）
- **Files API**
- **CMEK**（ただし **AWS KMS キーのみ**。Google Cloud KMS・Azure Key Vault は登録不可。**キーはワークスペースと同一 AWS リージョン**である必要あり）
- **Compliance API**（AWS IAM で認可）

### ⚠️ 利用できない（要確認の制約）

| 非対応項目 | 内容 |
|:---|:---|
| **HIPAA 対応** | Anthropic の HIPAA-ready プログラムは**利用不可**。医療系ワークロードでは選定不可 |
| **fast mode** | **非対応**（ファーストパーティ Claude API 限定） |
| **Admin API の大部分** | ワークスペース系（作成・取得・一覧・更新・アーカイブ）のみ利用可。**組織メンバー・ワークスペースメンバー・招待・APIキー・使用量/コスト/レート上限レポート・external keys は非対応**。組織メンバーシップは **AWS IAM が管理** |
| **ワークスペースのメンバー管理** | ユーザーの追加・削除は不可。**ワークスペース ARN に対する IAM ポリシー**でアクセス制御する |
| **Claude Code 専用ワークスペース／Analytics API** | 自動レート上限付きの Claude Code ワークスペースは非対応。Claude Code の使用量は一般の使用量ビューに混在表示 |
| **OAuth 認証** | 非対応（SigV4 か API キーを使う） |
| **OpenAI 互換エンドポイント** | 非対応 |
| **MCP トンネル** | **公開インターネット上に露出した MCP サーバーのみ**サポート |

**HIPAA と fast mode の非対応は、選定を左右しうる要素**です。特に医療系は Bedrock 側を検討する必要があります。

## 7. 課金 — CCU（Claude Consumption Units）

AWS Marketplace 経由で課金されます。

| 概念 | 内容 |
|:---|:---|
| **課金単位** | **CCU（Claude Consumption Unit）** |
| **CCU 単価** | **$0.01 / CCU**（固定。**割引はトークン→CCU 変換時に適用**され、CCU 単価自体は変わらない） |
| **変換方式** | トークン使用量を**標準のモデル別・機能別レートで USD 換算** → 割引適用 → $0.01/CCU で CCU へ変換 |
| **メータリング** | **1時間ごと**に AWS Marketplace へ報告／**月次請求** |
| **支払モデル** | **後払いのみ**（arrears）。**プリペイドクレジットなし・CCU 残高や約定なし** |
| **税** | 税抜きでメータリングし、**AWS Marketplace が税を処理** |
| **コスト可視性** | **Claude Console でリアルタイム内訳**（AWS コンソール経由でアクセス）／**AWS Cost Explorer には CCU が集約表示** |

> **100 CCU = $1.00 USD** という関係です。AWS の請求書上は**単一の CCU 明細**として現れるため、モデル別の内訳を見たい場合は Claude Console 側を参照します。

### レート上限と支出上限の注意点

- **組織は Start ティアに配置**され、**使用量による自動的なティア昇格は行われません**（ファーストパーティ組織のみが対象）。
- Claude Console の**セルフサービスの上限引き上げフローも利用不可**で、**Anthropic のアカウント担当者かサポート経由**での申請になります。
- ティアは**レート上限と月次支出上限がセット**で動きます。
- 自組織で設定する支出上限は **Billing ページ**（Limits ページではない）で管理し、**ソフトリミット**（定価計算・反映に約2時間のラグ）です。

## 8. Bedrock からの移行 — 変わるもの・得るもの・落とし穴

公式は「**統合全体にわたる変更が必要**」と明言しています。SigV4 署名は引き続き使えますが、**署名コンテキスト・ベースURL・API形式・モデルID・SDKクライアントとパッケージ・ストリーミング形式・リクエストヘッダー・リージョン可用性がすべて変わり**、さらに**新しい Anthropic 組織がプロビジョニング**されます。

### 変わらないもの

- **AWS IAM 認証（SigV4）**
- **AWS が請求者である**こと（ただし**課金チャネルはネイティブサービス → AWS Marketplace へ変更**）
- **AWS コミットメントの消化**

### 得られるもの

- 新モデル・新機能への**ほぼ同日アクセス**
- **Agent Skills**（ドキュメント生成）
- **コード実行**
- **`anthropic-beta` ヘッダー経由のベータ機能**
- **Claude Console**（クォータ可視化・使用量分析）
- **Anthropic の直接サポート**
- **API キー認証**という SigV4 以外の選択肢

### 🚨 移行の落とし穴（2つ）

**① outbound web identity federation の有効化を忘れる**

> **これが最大の罠です。** AWS アカウントで Claude Platform on AWS を初めて使う場合、**アカウントにつき1回、outbound web identity federation の有効化が必要**です。**このステップを踏まないと、すべてのリクエストがフェデレーションエラーで失敗します。****Bedrock では不要な手順**なので、移行者ほど見落とします。

**② ZDR がオプトインである（Bedrock とは前提が逆）**

これは**データガバナンス上、極めて重要な差**です。

| | Amazon Bedrock | **Claude Platform on AWS** |
|:---|:---|:---|
| データプロセッサ | **AWS** | **Anthropic**（独立したデータプロセッサ） |
| 推論入出力の保持 | **Anthropic は保持しない** | **ファーストパーティ Claude API と同じ保持ポリシー** |
| ZDR | Anthropic の ZDR プログラムは**適用対象外**（そもそも保持しないため） | **リクエストベースのオプトイン**（アカウント担当者経由） |

> Bedrock では「AWS がデータプロセッサだから Anthropic は保持しない」という構造でしたが、Platform on AWS では「**Anthropic が処理し、既定ではファーストパーティと同じ保持ポリシー**」になります。**データ保持の保証に依存する本番ワークロードを移行する前に、ZDR の登録を必ず確認**してください。

### 商用面の注意

- **Anthropic の商用利用規約とポリシーへの同意が必要**（Bedrock 経由でしか使っていなかった組織は、セットアップ時に同意を求められる）
- **交渉済みの割引や AWS Marketplace のプライベートオファーは、Bedrock ↔ Platform on AWS 間で自動的に引き継がれません**。Anthropic のアカウント担当者と別途調整が必要です

## 9. 監視・ガバナンス

- **CloudTrail**: ワークスペース操作を**既定で管理イベントとして記録**。推論アクティビティは**データイベントログ**として有効化可能
- **IAM ポリシー**: ワークスペース ARN 単位でアクセス制御。バッチ推論だけを拒否するといった**アクション単位の制御**も可能。マネージドポリシーも提供
- **Claude Console**: AWS コンソール経由でサインインし、使用量・コスト・クォータを確認

## 9.5 【2026-08-26 追記】Managed Agents の本格運用が AWS 内で完結 — Webhooks・マルチエージェント・セルフホストサンドボックス

本記事の初版（2026-07）では Claude Managed Agents を「利用できる機能」として挙げるに留めていましたが、Claude Platform on AWS では **Managed Agents の運用系機能が一通り利用可能**になっています（API リリースノート 2026-05-29 ほか）。

### 利用可能になった機能と IAM

| 機能 | 内容 | IAM 上の対応 |
|---|---|---|
| **Webhooks** | セッション・vault に加え、agent／deployment／環境／memory store のライフサイクルイベントを受信（ポーリング不要） | 新しい IAM アクションが追加 |
| **マルチエージェントオーケストレーション** | エージェントのロスター定義・サブエージェントスレッド | 同上 |
| **セルフホストサンドボックス** | ツール実行を自社管理のインフラ内で行う構成 | マネージドポリシー **`AnthropicSelfHostedEnvironmentAccess`** が提供 |
| **`GET /v1/environments/{id}/work`** | セルフホストサンドボックスの保留ワーク一覧（2026-06-10 追加） | `GetEnvironment` アクションで認可 |

さらに 2026-08-19 には、セルフホストサンドボックスで実行するセッションが **memory store をアタッチ**できるようになりました（SDK ワーカーが各ストアを `mount_path` へダウンロードし、エージェントの変更をストアへ同期）。

### 新構成: AWS Lambda MicroVMs をサンドボックスにする

AWS 公式ドキュメントに、**Lambda MicroVMs を Managed Agents のセルフホストサンドボックスとして使うリファレンス構成**が公開されています。Anthropic 側がエージェントループとモデルをホストし、**ツール呼び出し（bash / read / write / edit / glob / grep）の実行環境だけを自社 AWS アカウント内の MicroVM に置く**分担です。

動作フロー:

1. セッションが running になると、Anthropic が `session.status_run_started` **Webhook** を自社アカウントのエンドポイントへ送信
2. ランチャー Lambda 関数が **Webhook 署名を検証**し、`RunMicroVM` を呼び出す
3. MicroVM 上のワーカーがセッションを claim し、`/workspace` でツール呼び出しを実行して結果を Anthropic へ返す
4. セッション終了で MicroVM を suspend / terminate（課金も終了）

セキュリティ・運用上のポイント:

- **組織の API キーは AWS 側に渡らない**。ランチャーは **AWS Secrets Manager の参照**だけを渡し、MicroVM の実行ロールが実行時に環境キーを読む
- **Firecracker によるセッション単位のハードウェア仮想化隔離**。スナップショットからサブ秒〜数秒で起動し、最長8時間・セッション間で状態を共有しない
- 既定でパブリックインターネットに到達可能（`api.anthropic.com` への追加設定不要）。私設リソース（Aurora 等）へは **VPC egress コネクタ**をアタッチ
- CloudFormation スタック（API Gateway・ランチャー Lambda・Secrets Manager・S3・IAM ロール）と MicroVM イメージの**リファレンス実装**が [aws-samples リポジトリ](https://github.com/aws-samples/sample-lambda-microvm-claude-managed-agents) で公開

> **位置づけ**: 「推論データは AWS のセキュリティ境界の外」という本記事第1章の構図は変わりませんが、**ツール実行・機密ファイル・パッケージ・内部サービスへのアクセスは自社 AWS 境界内に保てる**ようになりました。「Anthropic 運用のプラットフォーム＋自社運用の実行環境」というハイブリッドが、Bedrock との比較軸に加わった形です。

参考: [Claude Platform release notes（2026-05-29 / 06-10 / 08-19）](https://platform.claude.com/docs/en/release-notes/api) ／ [AWS: Using Lambda MicroVMs as a sandbox for Claude Managed Agents](https://docs.aws.amazon.com/lambda/latest/dg/microvms-integrations-claude-managed-agents.html)

## 10. 選定ガイド — どれを選ぶべきか

| こういう場合 | 推奨 |
|:---|:---|
| **最新機能・ベータ機能をすぐ使いたい** | **Claude Platform on AWS** |
| **Agent Skills / コード実行 / Managed Agents を使いたい** | **Claude Platform on AWS** |
| **HIPAA 対応が必要** | **Bedrock**（Platform on AWS は非対応） |
| **データを AWS のセキュリティ境界内に留めたい** | **Bedrock**（Platform on AWS は境界外で処理） |
| **リージョナルなデータ所在要件が厳格** | **Bedrock** |
| **fast mode を使いたい** | ファーストパーティ Claude API（両方とも非対応） |
| **既存の AWS コミットメント・請求に寄せたい** | **どちらでも可**（Platform on AWS も AWS 請求・コミット消化対象） |
| **Admin API でユーザー管理を自動化したい** | ファーストパーティ Claude API（Platform on AWS は大部分が非対応） |

**「AWS 経由でありながら Anthropic のフル機能」を取るか、「AWS のセキュリティ境界とコンプライアンス」を取るか**——この軸で選ぶのが最も分かりやすい整理です。

## まとめ

- Claude Platform on AWS は「**AWS アカウント・IAM・請求のまま、Anthropic のフルプラットフォームを使う**」ための統合。**Bedrock の置き換えではなく併存する選択肢**。
- **最大の違いは運用主体とデータ境界**。Bedrock は AWS 運用・AWS 境界内、Platform on AWS は **Anthropic 運用・境界外**。ここがコンプライアンス要件と直結する。
- 実務では**3系統（Platform on AWS / Bedrock Mantle / Bedrock レガシー）でモデルIDが全部違う**点に注意。Platform on AWS だけが**素のモデルID**を使える。
- **移行時は「outbound web identity federation の有効化」と「ZDR がオプトインであること」の2点が最大の落とし穴**。前者は忘れると全リクエストが落ち、後者は気づかないとデータ保持の前提が変わる。
- **HIPAA・fast mode・Admin API の大部分が非対応**である点は、選定前に必ず確認する。

## 関連記事

- [Claude Opus 5 完全ガイド](/mdTechKnowledge/blog/claude-opus-5-guide/) — 各プラットフォームでのモデル可用性
- [Claude Opus 5 リリースで変わった単価とモデル選択](/mdTechKnowledge/blog/claude-opus-5-pricing-and-model-selection/) — 全モデル単価総覧
- [Claude Managed Agents 簡易ガイド](/mdTechKnowledge/blog/claude-managed-agents-guide/) — Platform on AWS でも利用可能なエージェント基盤
- [Anthropic Enterprise Analytics API 完全ガイド](/mdTechKnowledge/blog/anthropic-enterprise-analytics-api/) — Admin API の全体像（Platform on AWS では制限あり）
- [Anthropic × Google TPU パートナーシップ](/mdTechKnowledge/blog/anthropic-tpu-compute-partnership/) — マルチクラウド計算資源の全体構造

## 出典

- [Claude Platform on AWS — Claude Platform Docs](https://platform.claude.com/docs/en/build-with-claude/claude-platform-on-aws)（運用主体・Bedrock比較表・認証・モデル・リージョン・機能サポート・非対応項目・課金・移行・IAM）
- [Introducing Claude Platform on AWS — AWS Machine Learning Blog](https://aws.amazon.com/blogs/machine-learning/introducing-claude-platform-on-aws-anthropics-native-platform-through-your-aws-account/)（GA日・16リージョン一覧・CloudTrail・AWS側の位置づけ）
- [Pricing（Claude Platform on AWS pricing 節）— Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/pricing)（CCU の単価・変換・メータリング）
- [Claude Platform on AWS IAM actions — Claude Platform Docs](https://platform.claude.com/docs/en/api/claude-platform-on-aws-iam-actions)（IAM アクション）

*本記事の仕様・価格は 2026年7月26日時点の公式ドキュメントに基づきます。Claude Platform on AWS は比較的新しい統合であり、機能可用性（特に「非対応」項目）は変更されうるため、導入判断時は公式ページで最新状況をご確認ください。*
