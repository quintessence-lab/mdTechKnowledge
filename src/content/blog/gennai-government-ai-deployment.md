---
title: "源内をデプロイする — AWS CDK でのセットアップから運用まで"
date: 2026-05-09
updatedDate: 2026-05-09
category: "その他技術"
tags: ["源内", "ガバメントAI", "デジタル庁", "OSS", "AWS CDK", "デプロイ", "SAML", "CI/CD", "運用"]
excerpt: "源内（GenAI）を自組織で立ち上げる手順をシリーズ第3回として解説。事前準備（Node.js/AWS CLI/CDK/jq）、パラメータファイル作成、`cdk deploy` 実行、SAML 認証連携、カスタムドメイン、CI/CD（GitHub Actions）、ログ・モニタリング、システム管理者・チーム登録、AIアプリ追加（ExApp）、想定構築工数とランニングコスト、既知の制限事項までを網羅。"
draft: false
---

## 関連記事ナビゲーション（源内シリーズ）

| # | 記事 |
|---|---|
| 1 | [源内（ガバメントAI）概要 — OSS化の意義と全体像](/mdTechKnowledge/blog/gennai-government-ai-overview/) |
| 2 | [源内アーキテクチャ詳解 — 源内Web × 源内AIアプリの2層構成](/mdTechKnowledge/blog/gennai-government-ai-architecture/) |
| **3** | **源内をデプロイする — AWS CDK でのセットアップから運用まで**（本記事） |
| 4 | [源内ユースケース集 — どの業務に向くか／公開済みAIアプリ事例](/mdTechKnowledge/blog/gennai-government-ai-usecases/) |

---

## 1. はじめに — 誰が、何を、どれくらいで立ち上げるか

源内 Web のデプロイは、**AWS の中堅エンジニア1〜2名で 1〜2週間** が現実的な目安です。本記事では「**最小構成で動くところまで**」を最短経路で示し、運用に必要な周辺設定を順に積み上げていきます。

| 想定読者 | 必要スキル |
|---|---|
| **自治体・大企業の AI 基盤担当** | AWS基本／IaC（CDK）／SAML SSO の知識 |
| **検証目的の個人開発者** | Node.js + AWS アカウントがあればOK（最小構成） |
| **OSS 改修して再公開したい組織** | 上記 + GitHub Actions、フォーク管理 |

---

## 2. 事前準備

### 2-1. 必須ツール

| ツール | 用途 | 備考 |
|---|---|---|
| **Node.js** | フロント／CDK 実行 | `.node-version` の指定バージョン（mise 推奨） |
| **AWS CLI** | AWS 操作 | 認証情報設定済 |
| **AWS CDK CLI** | IaC デプロイ | `npm install -g aws-cdk` |
| **jq** | パラメータ整形 | スクリプト内で利用 |
| **git** | リポジトリ取得 | 標準 |

### 2-2. AWS 側の準備

| 項目 | 内容 |
|---|---|
| **AWS アカウント** | 専用アカウント推奨（共有アカウントは管理が煩雑） |
| **デプロイ先リージョン** | Bedrock 利用可能リージョン（`us-east-1` / `ap-northeast-1` 等） |
| **IAM 権限** | CDK 実行に必要な広範囲の権限（CloudFormation, S3, Lambda, DynamoDB, Cognito, Bedrock, IAM） |
| **CDK Bootstrap** | 初回のみ `cdk bootstrap` 必須 |
| **Bedrock モデル有効化** | コンソールから利用するモデル（Claude / Titan 等）を有効化 |

### 2-3. 認証連携用 IdP（SAML）

本番運用では SAML SSO 必須:

| 想定IdP | 備考 |
|---|---|
| **Okta** | 一般企業で多い |
| **Microsoft Entra ID（旧 Azure AD）** | Microsoft 365 利用組織 |
| **Google Workspace** | 一部対応 |
| **政府共通認証基盤（GIMA等）** | 行政機関向け |
| **Cognito ローカル User Pool** | 開発・検証時のみ |

---

## 3. リポジトリの取得とセットアップ

```bash
# クローン
git clone https://github.com/digital-go-jp/genai-web.git
cd genai-web

# Node.js 環境（mise の場合）
mise trust
mise install
node -v   # .node-version で指定されたバージョンが出ること

# 依存インストール
npm ci

# AWS CDK Bootstrap（このアカウント×リージョンで初回のみ）
npm -w packages/cdk run cdk -- bootstrap
```

> **注意**: PR は受け付けないリポジトリのため、**自組織でフォーク**しておくことを強く推奨します。OSS 本家を `upstream` として登録し、自分たちは `origin`（フォーク）から運用します。

---

## 4. パラメータファイルの作成

### 4-1. テンプレートのコピー

```bash
cd packages/cdk/env-parameters
cp self-hosting-template.ts self-hosting-dev.ts
```

### 4-2. パラメータ設定

`self-hosting-dev.ts` を編集し、環境に合わせて以下を設定:

| 主要パラメータ | 例 | 説明 |
|---|---|---|
| **`appEnv`**（必須） | `"dev"` | 環境識別子。CloudFormation スタック名等に使用 |
| `allowedIpV4AddressRanges` | `["203.0.113.0/24"]` | 利用許可する IP レンジ |
| `modelIds` | `["claude-opus-4.7-v1", "claude-haiku-4.5-v1"]` | Bedrock で利用するモデル ID |
| `samlAuthEnabled` | `true` | SAML 認証を有効化 |
| `customDomain` | `"genai.example.go.jp"` | カスタムドメイン |
| `hiddenUseCases` | `["imageGeneration"]` | 無効化する汎用アプリ |

### 4-3. parameter.ts に登録

```typescript
// packages/cdk/parameter.ts
import { selfHostingDevParams } from "./env-parameters/self-hosting-dev";

const deploy_envs: Record<string, Partial<StackInput>> = {
  "-selfHostingDev": selfHostingDevParams,
  // 本番、ステージングなども同様に追加
};
```

---

## 5. デプロイ実行

### 5-1. ローカルからデプロイ

```bash
npm -w packages/cdk run cdk -- deploy --all \
  --require-approval never \
  -c env=-selfHostingDev
```

- `--all` で全スタックを一括デプロイ
- `--require-approval never` は CI 用フラグ（手動確認なしで進行）
- 環境差し替えは `-c env=-selfHostingProd` のように指定

### 5-2. デプロイ完了確認

```
✅ Outputs:
  selfHostingDev-WebStack.CloudFrontUrl = https://abc123.cloudfront.net
  selfHostingDev-WebStack.UserPoolId    = ap-northeast-1_xxxx
```

CloudFront URL（またはカスタムドメイン）にアクセスし **ログイン画面が表示されれば成功** です。

---

## 6. SAML 認証連携

### 6-1. Cognito 側

CDK で生成された Cognito User Pool に **SAML IdP を追加**:

1. AWS マネジメントコンソール → Cognito → 当該 User Pool
2. **Sign-in experience** → **Federated identity provider sign-in** → **Add identity provider**
3. **SAML** を選択 → IdP 名・メタデータ XML をアップロード

### 6-2. IdP 側

Cognito から発行される **SP メタデータ** を IdP（Okta 等）に登録:

```
ACS URL:   https://<user-pool-domain>/saml2/idpresponse
Entity ID: urn:amazon:cognito:sp:<user-pool-id>
```

### 6-3. 属性マッピング

| Cognito 属性 | IdP 属性（Okta 例） | 備考 |
|---|---|---|
| `email` | `user.email` | ユーザーID |
| `name` | `user.displayName` | 表示名 |
| `custom:organization` | `user.department` | 所属（チーム自動割当の参照） |

---

## 7. カスタムドメイン設定

| ステップ | 内容 |
|---|---|
| 1. ACM 証明書発行 | `us-east-1` で（CloudFront 仕様） |
| 2. Route53 でドメイン登録／DNS設定 | A/AAAA レコード →  CloudFront |
| 3. `customDomain` パラメータ設定 | `self-hosting-dev.ts` で指定 |
| 4. CDK 再デプロイ | 反映 |

詳細はリポジトリ内 `docs/カスタムドメイン設定.md` を参照。

---

## 8. システム管理者・チーム登録

### 8-1. 初回ログインユーザーをシステム管理者に昇格

CDK 出力された User Pool に **最初にログインしたユーザー** を、CLI / コンソール経由でシステム管理者ロールに昇格させます。詳細は `docs/システム管理者設定手順.md`。

### 8-2. 共通アプリチームの登録

汎用5アプリ（チャット／文章生成／翻訳／画像生成／ダイアグラム生成）を全ユーザーに提供する **特殊チーム** を登録します。`docs/共通アプリチームの登録.md`。

### 8-3. 各部署のチーム作成

部署単位でチームを作成し、所属ユーザーとチーム管理者を割り当てます。

---

## 9. AI アプリの追加（ExApp）

### 9-1. AI アプリ側を構築

[`digital-go-jp/genai-ai-api`](https://github.com/digital-go-jp/genai-ai-api) のテンプレートをベースに、対応クラウドへ AI アプリをデプロイ:

| クラウド | テンプレート |
|---|---|
| AWS | `aws/query-expansion-rag/`（CDK） |
| Azure | `azure/genai-azure/`（Bicep） |
| Google Cloud | `google-cloud/lawsy-custom-bq/`（Terraform） |

### 9-2. 源内Web 側で登録

源内Web の「**チーム管理**」メニュー → **AIアプリ管理** → **新規追加** で:

- **AI アプリ名** / **説明**
- **エンドポイント URL**（AIアプリ側の REST URL）
- **リクエスト形式 JSON**（[ExApp 仕様](https://github.com/digital-go-jp/genai-web/blob/main/docs/AI%E3%82%A2%E3%83%97%E3%83%AAAPI%E4%BB%95%E6%A7%98.md)に従う）
- **共有シークレット**（Web↔AIアプリ間の認証）

を設定すると、**チームメンバーのメニューに自動的に表示**されます。

---

## 10. ローカル開発環境

| 観点 | 内容 |
|---|---|
| フロントエンド | `npm -w packages/web run dev` で Vite dev server |
| Cognito | ローカル User Pool でモック |
| Bedrock | AWS 認証情報経由で実 API（モック化が望ましい場合は LocalStack 等） |
| 詳細 | `docs/ローカル開発環境.md` |

---

## 11. CI/CD 設定

GitHub Actions テンプレートが用意されています:

```bash
cp .github/genai-deploy.yaml.example .github/workflows/genai-deploy-dev.yaml
```

| 設定項目 | 内容 |
|---|---|
| `AWS_ROLE_TO_ASSUME` | OIDC ロールの ARN |
| `AWS_REGION` | デプロイリージョン |
| ブランチトリガ | `main` / `develop` 等 |
| 環境分離 | ワークフローを環境ごとにコピー |

詳細は `docs/CI-CD設定.md`。

---

## 12. ログ・モニタリング

| 項目 | 設定先 | 内容 |
|---|---|---|
| **アプリログ** | CloudWatch Logs | Lambda 標準出力 |
| **利用ログ** | DynamoDB + CloudWatch | チーム×ユーザー×時間 |
| **入力監査** | DynamoDB / S3 | プロンプト本文（要件次第で OFF） |
| **メトリクス** | CloudWatch Metrics | 利用回数・トークン数・応答時間 |
| **アラート** | CloudWatch Alarms + SNS | エラー率・レイテンシ閾値超過 |
| **ダッシュボード** | CloudWatch Dashboards | 一覧用 |

詳細は `docs/ログ設定.md`。

---

## 13. 既知の制限事項

| 制限 | 内容 | 影響度 |
|---|---|---|
| **PR 受付なし** | 機能追加要望は反映されない | フォーク運用前提 |
| **Issue は致命的なもののみ** | データ損失・サービス障害・法令違反のみ | 通常バグはフォーク内で修正 |
| **アクセシビリティ課題** | 画像生成パラメータ調整等で WCAG 2.0 AA 未達部位あり | アクセシビリティ法令対応時は補修必要 |
| **多言語** | 日本語・英語のみ | 多国籍組織には不足 |
| **クラウドベンダーロック** | AWS CDK / Azure Bicep | クラウド変更時は実装書き換え |
| **GenU 上流変更の取り込みなし** | 独立開発に切替済 | 自組織で更新追従 |

---

## 14. 想定構築工数とコスト

### 14-1. 工数（中規模組織想定）

| フェーズ | 工数 |
|---|---|
| 事前準備（AWS / IdP / ドメイン） | 2〜3日 |
| ローカル動作確認 | 1日 |
| 開発環境デプロイ | 2〜3日 |
| SAML 連携 | 1〜2日 |
| カスタムドメイン・本番デプロイ | 1〜2日 |
| 共通アプリ・チーム登録 | 1日 |
| AI アプリ1本追加・連携 | 3〜5日（AI アプリ側の開発工数次第） |
| **合計** | **約 2〜3 週間** |

### 14-2. 月額ランニングコスト目安（小規模・100ユーザー想定）

| 項目 | 月額 | 内訳 |
|---|---|---|
| **CloudFront + S3** | $5〜15 | ほぼ転送量次第 |
| **Lambda + API Gateway** | $20〜50 | リクエスト数 |
| **DynamoDB** | $5〜10 | オンデマンド |
| **Cognito** | $0〜30 | MAU 50,000 まで無料枠 |
| **Bedrock** | $50〜500 | **モデル・トークン量次第（最も変動）** |
| **CloudWatch** | $5〜20 | ログ保管期間次第 |
| **合計** | **$100〜600** | 約 1.5〜10 万円 |

> Bedrock のモデル選択（Claude Opus 4.7 vs Haiku 4.5）と利用頻度がコストの大半を決めます。

---

## 15. デプロイ チェックリスト

```
□ Node.js / AWS CLI / CDK / jq インストール完了
□ AWS アカウント確保、IAM 権限付与
□ Bedrock 利用モデルを有効化
□ npm ci 成功
□ cdk bootstrap 完了
□ self-hosting-<env>.ts 作成・編集
□ parameter.ts に env エントリ追加
□ cdk deploy --all 成功
□ CloudFront URL でログイン画面表示確認
□ Cognito SAML IdP 登録
□ IdP 側 SP メタデータ登録
□ カスタムドメイン設定（任意）
□ システム管理者ロール昇格
□ 共通アプリチーム登録
□ 部署別チーム作成
□ AI アプリ最低 1 本追加（ExApp）
□ CI/CD ワークフロー設定
□ CloudWatch Alarms 設定
□ 監査ログの保管期間ポリシー決定
```

---

## まとめ

| ポイント | 内容 |
|---|---|
| **最短** | 「`npm ci` → CDK bootstrap → cdk deploy」で動かすだけなら半日 |
| **本番化** | SAML/カスタムドメイン/監視まで含めると2〜3週間 |
| **運用** | フォーク前提・PR 非受付なので、自組織で改修方針を確立 |
| **コスト** | 100ユーザー規模で月 1.5〜10 万円（Bedrock 利用次第） |

次回はこのインフラの上で **「どの業務にどう適用するか」** をユースケース別に解説します。

---

## 参考資料

- [源内Web: 事前準備](https://github.com/digital-go-jp/genai-web/blob/main/docs/%E4%BA%8B%E5%89%8D%E6%BA%96%E5%82%99.md)
- [源内Web: デプロイ手順](https://github.com/digital-go-jp/genai-web/blob/main/docs/%E3%83%87%E3%83%97%E3%83%AD%E3%82%A4%E6%89%8B%E9%A0%86.md)
- [源内Web: SAML 認証手順](https://github.com/digital-go-jp/genai-web/blob/main/docs/SAML%E8%AA%8D%E8%A8%BC%E6%89%8B%E9%A0%86.md)
- [源内Web: カスタムドメイン設定](https://github.com/digital-go-jp/genai-web/blob/main/docs/%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%89%E3%83%A1%E3%82%A4%E3%83%B3%E8%A8%AD%E5%AE%9A.md)
- [源内Web: CI/CD 設定](https://github.com/digital-go-jp/genai-web/blob/main/docs/CI-CD%E8%A8%AD%E5%AE%9A.md)
- [源内Web: ログ設定](https://github.com/digital-go-jp/genai-web/blob/main/docs/%E3%83%AD%E3%82%B0%E8%A8%AD%E5%AE%9A.md)
- [源内Web: ローカル開発環境](https://github.com/digital-go-jp/genai-web/blob/main/docs/%E3%83%AD%E3%83%BC%E3%82%AB%E3%83%AB%E9%96%8B%E7%99%BA%E7%92%B0%E5%A2%83.md)
- [源内AIアプリ（テンプレート集）](https://github.com/digital-go-jp/genai-ai-api)

---

*本記事は2026年5月9日時点の公開情報に基づきます。CDK パラメータ・コスト見積りは環境により変動します。実数値は AWS Pricing Calculator で確認してください。*
