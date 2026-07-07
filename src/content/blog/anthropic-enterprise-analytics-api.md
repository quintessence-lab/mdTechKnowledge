---
title: "Anthropic Enterprise Analytics API 完全ガイド — 組織別利用データの照会と活用"
date: 2026-05-02
updatedDate: 2026-07-07
category: "Claude技術解説"
tags: ["Anthropic", "Claude API", "Admin API", "Analytics", "エンタープライズ", "FinOps", "Slack連携", "Workload Identity Federation", "OIDC"]
excerpt: "2026年4月、Anthropic は Claude / Claude Code Remote / Claude Cowork の組織別利用データをプログラム照会できる Enterprise Analytics API を拡張した。Rate Limits API との位置付けの違い、エンドポイント構造、認証、レスポンス、Python/curl 実装例、Slackボット連携、運用ユースケース、制限事項までをまとめて解説する。さらに2026年6月の Workload Identity Federation（WIF＝OIDCトークンによるAPIキー不要認証）対応と、Admin API に追加された issuers / service accounts / federation rules エンドポイントも解説する。"
draft: false
---

## はじめに — Enterprise Analytics API とは

2026年4月、Anthropic はエンタープライズ顧客向けに **Enterprise Analytics API** を拡張しました。これは Claude（チャット）、Claude Code Remote、Claude Cowork といった主要プロダクトの**組織別の利用データを構造化されたまま取り出せる Admin API** です。

これまで、エンタープライズ顧客が組織内の使用状況を把握する手段は次のいずれかに限られていました。

- Claude Console の「Analytics」ダッシュボードを目視で確認する
- Stripe や請求書 PDF から事後的に集計する
- 各メンバーに自己申告してもらう

いずれも、**FinOps 的な可視化・自動化には不向き**でした。Enterprise Analytics API はこの空白を埋め、組織のコスト管理・採用分析・自動アラートの基盤として位置付けられています。

報道によれば、2026年4月時点で次のような変化が起きています。

- Claude Code のアクティブユーザー数が直近で 300% 増加
- Claude 4 系モデルの登場以来、ランレートは 5.5 倍に拡大
- Claude Cowork の利用統計が Analytics API のフィールドに追加され、コラボレーション系プロダクトも同じ APIで観測できるようになった

本記事では、Enterprise Analytics API の構造と使い方を、姉妹 API である Rate Limits API との違いを意識しながら解説します。なお、API のフィールド名やパスの表記は、解説のために一般的に想定される形を例示しています。実装時は最新の Anthropic ドキュメントを必ず参照してください。

## Rate Limits API との位置付けの違い

Anthropic の Admin API には、運用観点で性格の異なる複数のサブセットがあります。Enterprise Analytics API と Rate Limits API は別エンドポイントでありながら、よく一緒に使われるため、両者の役割をまず整理しておきます。

| 観点 | Rate Limits API | Enterprise Analytics API |
| --- | --- | --- |
| 用途 | 設定済みのレート制限値を取得 | 実際の利用実績を取得 |
| データの性質 | 静的（管理画面で変更しない限り変わらない） | 動的（時系列で変動） |
| 主なフィールド | requests_per_minute / tokens_per_minute | tokens_consumed / spend / accept_rate / sessions |
| 適切な集計単位 | 組織 / ワークスペース | 組織 / ワークスペース / ユーザー / モデル / 期間 |
| 主な利用者 | プラットフォームエンジニア・ゲートウェイ管理者 | FinOps、エンジニアリング・マネージャ、人事・採用分析 |
| 想定呼び出し頻度 | 日次 〜 週次 | 数分 〜 数時間ごと |

シンプルに言えば、**Rate Limits API は「上限値」を、Enterprise Analytics API は「実績値」を返す API**です。両者を組み合わせると、「現在の利用が制限の何 % に達しているか」をリアルタイムに可視化できます。

## エンドポイント構造

Enterprise Analytics API は複数のリソースに分かれて提供されます。代表的なエンドポイントは次の通りです。

| エンドポイント | 用途 |
| --- | --- |
| `GET /v1/organizations/usage` | 組織レベルの利用サマリー |
| `GET /v1/organizations/workspaces/{workspace_id}/usage` | ワークスペース固有の利用データ |
| `GET /v1/organizations/users/{user_id}/usage` | ユーザー単位の利用データ |
| `GET /v1/organizations/cowork/usage` | Claude Cowork の利用統計 |
| `GET /v1/organizations/code/usage` | Claude Code Remote の利用統計（lines accepted, suggestion accept rate など） |

各エンドポイントは概ね次のクエリパラメータを受け付けます。

| パラメータ | 型 | 説明 |
| --- | --- | --- |
| `start_date` | string (ISO 8601) | 集計開始日 |
| `end_date` | string (ISO 8601) | 集計終了日 |
| `granularity` | string | `day` / `hour` / `month` などの集計粒度 |
| `model` | string | 特定モデルだけにフィルタ |
| `group_by` | string | `user` / `workspace` / `model` などの集計軸 |
| `page` | string | ページネーショントークン |

エンドポイント階層を図で示すと次のようになります。

```
/v1/organizations
  ├── /usage                    # 組織全体の利用
  ├── /workspaces/{id}/usage    # ワークスペース別
  ├── /users/{id}/usage         # ユーザー別
  ├── /cowork/usage             # Cowork 個別
  ├── /code/usage               # Claude Code Remote 個別
  └── /rate_limits              # Rate Limits API（参考: 静的設定値）
```

このように、Analytics API は **「全体 → 軸別 → 個別プロダクト」** の3層構造で設計されており、必要な粒度だけを取り出す形になっています。

## 認証 — Admin API キーと anthropic-version

Enterprise Analytics API も、Rate Limits API と同様に **Admin API キー** を使用します。標準の API キー（`sk-ant-api...`）では呼び出せません。

### Admin API キーの取得

1. [Claude Console](https://platform.claude.com) にログインする
2. **admin ロール**を持つメンバーであることを確認する
3. **Settings → Admin Keys** から Admin API キーを発行する
4. 環境変数として安全に保管する（例: `ANTHROPIC_ADMIN_KEY`）

### 必要なヘッダー

すべてのリクエストに次の2つのヘッダーが必要です。

```http
x-api-key: sk-ant-admin-...
anthropic-version: 2023-06-01
```

`anthropic-version` は Messages API・Rate Limits API と共通の API バージョンヘッダーで、`2023-06-01` を指定します。

### 権限スコープ

Admin API キーは組織オーナーまたは Admin ロールが発行する必要があります。Read-only Admin キーで十分なケースが多いため、原則として読み取り専用キーを使い、書き込み権限のあるキーをエージェントや CI に渡さないようにしてください。

## レスポンスフィールド

代表的なエンドポイント `GET /v1/organizations/usage` のレスポンス例を示します。

```json
{
  "object": "list",
  "data": [
    {
      "object": "usage_record",
      "date": "2026-04-25",
      "model_group": "claude-opus-4-7",
      "input_tokens": 12_345_678,
      "output_tokens": 4_567_890,
      "cache_read_tokens": 2_345_000,
      "cache_creation_tokens": 678_900,
      "spend_usd": 412.78,
      "active_users": 128,
      "sessions": 543
    },
    {
      "object": "usage_record",
      "date": "2026-04-25",
      "model_group": "claude-sonnet-4-7",
      "input_tokens": 23_456_789,
      "output_tokens": 9_876_543,
      "cache_read_tokens": 5_000_000,
      "cache_creation_tokens": 1_234_500,
      "spend_usd": 178.55,
      "active_users": 256,
      "sessions": 1_142
    }
  ],
  "has_more": false
}
```

主要フィールドの意味は次のとおりです。

| フィールド | 説明 |
| --- | --- |
| `date` | 集計日（granularity に応じて日付・時刻） |
| `model_group` | 集計対象のモデルグループ |
| `input_tokens` | 入力トークン総量 |
| `output_tokens` | 出力トークン総量 |
| `cache_read_tokens` | プロンプトキャッシュからの読み出し量 |
| `cache_creation_tokens` | プロンプトキャッシュ生成量 |
| `spend_usd` | 当該集計単位での米ドル換算支出 |
| `active_users` | アクティブユーザー数 |
| `sessions` | セッション数（Claude Code Remote の場合は実行回数） |

Claude Code Remote 専用エンドポイントでは、これに加えて次のフィールドが返ります。

| フィールド | 説明 |
| --- | --- |
| `lines_accepted` | 受け入れられたコード行数 |
| `lines_suggested` | 提案された総行数 |
| `accept_rate` | 受け入れ率 (0.0–1.0) |
| `avg_daily_spend_per_user` | ユーザーごとの平均日次支出 |

Claude Cowork のエンドポイントでは次のような協業系メトリクスが追加されます。

| フィールド | 説明 |
| --- | --- |
| `cowork_sessions` | Cowork セッション数 |
| `participants_avg` | 1セッションあたり平均参加者数 |
| `messages_total` | セッション内総メッセージ数 |

## ユースケース実装例

ここからは、実際にどのように呼び出すかを Python と curl で示します。

### curl による単発呼び出し

```bash
curl -G https://api.anthropic.com/v1/organizations/usage \
  -H "x-api-key: $ANTHROPIC_ADMIN_KEY" \
  -H "anthropic-version: 2023-06-01" \
  --data-urlencode "start_date=2026-04-01" \
  --data-urlencode "end_date=2026-04-30" \
  --data-urlencode "granularity=day" \
  --data-urlencode "group_by=model"
```

### Python (httpx + pandas) で日次レポートを生成

```python
import os
import httpx
import pandas as pd

ADMIN_KEY = os.environ["ANTHROPIC_ADMIN_KEY"]
BASE_URL = "https://api.anthropic.com/v1/organizations/usage"

def fetch_usage(start: str, end: str, granularity: str = "day") -> pd.DataFrame:
    headers = {
        "x-api-key": ADMIN_KEY,
        "anthropic-version": "2023-06-01",
    }
    params = {
        "start_date": start,
        "end_date": end,
        "granularity": granularity,
        "group_by": "model",
    }
    records = []
    page = None
    while True:
        if page:
            params["page"] = page
        r = httpx.get(BASE_URL, headers=headers, params=params, timeout=30.0)
        r.raise_for_status()
        body = r.json()
        records.extend(body["data"])
        if not body.get("has_more"):
            break
        page = body.get("next_page")
    return pd.DataFrame(records)

if __name__ == "__main__":
    df = fetch_usage("2026-04-01", "2026-04-30")
    summary = (
        df.groupby("model_group")[["input_tokens", "output_tokens", "spend_usd"]]
        .sum()
        .sort_values("spend_usd", ascending=False)
    )
    print(summary.to_string())
```

このスクリプトは、月初から月末までの利用実績をモデルグループ単位で集計し、支出の多い順に並べます。Cron や GitHub Actions で日次実行し、社内 BI に流すのが定番の活用パターンです。

### ユーザー単位の支出ランキング

```python
def top_users(start: str, end: str, top_n: int = 10) -> pd.DataFrame:
    headers = {
        "x-api-key": ADMIN_KEY,
        "anthropic-version": "2023-06-01",
    }
    url = "https://api.anthropic.com/v1/organizations/usage"
    params = {
        "start_date": start,
        "end_date": end,
        "granularity": "day",
        "group_by": "user",
    }
    r = httpx.get(url, headers=headers, params=params, timeout=30.0)
    r.raise_for_status()
    df = pd.DataFrame(r.json()["data"])
    return (
        df.groupby("user_id")["spend_usd"]
        .sum()
        .sort_values(ascending=False)
        .head(top_n)
    )
```

Top-N の取得を毎週レポートとして出すと、突出した利用パターンや**暴走したエージェント**を早期に発見できます。

## Slackボット連携サンプル

Enterprise Analytics API で取得したデータを Slack に流すと、エンジニア組織の認知に乗りやすくなります。簡易的な Slack ボットの例を示します。

```python
import os
import datetime as dt
import httpx
from slack_sdk import WebClient

ADMIN_KEY = os.environ["ANTHROPIC_ADMIN_KEY"]
SLACK_TOKEN = os.environ["SLACK_BOT_TOKEN"]
SLACK_CHANNEL = "#claude-cost-watch"

def daily_summary() -> str:
    yesterday = (dt.date.today() - dt.timedelta(days=1)).isoformat()
    headers = {
        "x-api-key": ADMIN_KEY,
        "anthropic-version": "2023-06-01",
    }
    params = {
        "start_date": yesterday,
        "end_date": yesterday,
        "granularity": "day",
        "group_by": "model",
    }
    r = httpx.get(
        "https://api.anthropic.com/v1/organizations/usage",
        headers=headers,
        params=params,
        timeout=30.0,
    )
    r.raise_for_status()
    rows = r.json()["data"]
    total = sum(row["spend_usd"] for row in rows)
    lines = [f"Claude 利用サマリー ({yesterday})", "----------------------------------"]
    for row in sorted(rows, key=lambda x: -x["spend_usd"]):
        lines.append(
            f"  {row['model_group']:<22} ${row['spend_usd']:>8.2f}  "
            f"input={row['input_tokens']:>12,d}  output={row['output_tokens']:>12,d}"
        )
    lines.append("----------------------------------")
    lines.append(f"  合計支出: ${total:.2f}")
    return "\n".join(lines)

def post_to_slack():
    client = WebClient(token=SLACK_TOKEN)
    text = daily_summary()
    client.chat_postMessage(channel=SLACK_CHANNEL, text=f"```\n{text}\n```")

if __name__ == "__main__":
    post_to_slack()
```

Cron で毎朝定刻に走らせれば、前日の Claude 関連支出が Slack に届きます。閾値超過時のみメンションを飛ばすロジックを足せば、簡易な FinOps アラートとしても機能します。

## 既存 Rate Limits API との比較表

実際の運用では、Rate Limits API と Enterprise Analytics API を**組み合わせて使う**のが効果的です。両者の役割を改めて整理します。

| 項目 | Rate Limits API | Enterprise Analytics API |
| --- | --- | --- |
| 取得対象 | 設定値（上限） | 実績値（消費） |
| データ更新 | 設定変更時のみ | 継続的に更新 |
| 推奨呼び出し頻度 | 日次〜週次 | 数分〜数時間ごと |
| 主なフィールド | requests_per_minute / tokens_per_minute | tokens_consumed / spend / accept_rate |
| 主な用途 | スロットラー値同期、ガードレール設定 | コスト管理、採用分析、社内アラート |
| ペアでの活用 | 上限値を取得 | 実績を取得し、上限に対する充足率を算出 |

組み合わせ例として、次のような「使用率」モニタリングが定番です。

```
使用率 = (Analytics API の実績 tokens_per_minute) / (Rate Limits API の上限 tokens_per_minute)
```

これを 80% / 90% / 95% などの閾値で監視し、Slack や PagerDuty に通知すれば、**429 エラーが出る前に異常を検知**できます。

## 運用ユースケース

Enterprise Analytics API の活用パターンは、概ね以下の4類型に整理できます。

### 1. コスト管理（FinOps）

- 組織・ワークスペース・ユーザー単位の月次支出を BI 基盤に取り込む
- モデル別（Opus / Sonnet / Haiku）の支出比率を可視化し、モデル選択を最適化
- プロンプトキャッシュの利用率を監視し、キャッシュ設計を改善

### 2. 採用・人事分析

- 部門ごとの「アクティブユーザー数」「セッション数」を追跡し、AI 活用度を比較
- Claude Code Remote の `accept_rate`（受け入れ率）をエンジニア生産性指標として扱う
- 採用したエンジニアのオンボーディング進捗を、利用パターンの変化から推定

### 3. 異常検知

- 平均から大きく外れたユーザー支出を早期に検出
- 暴走したエージェント（短時間で大量のセッションを生成）の検知
- 不自然な深夜帯の利用増加（漏洩・誤操作の兆候）を監視

### 4. プロダクト運営

- Claude Cowork のセッション数・参加者数の推移から、コラボレーション系機能の浸透度を測る
- ワークスペース新設後 30 日の利用立ち上がりを追跡し、ロールアウト戦略に活用
- 経営報告用ダッシュボードに「AI 利用 KPI」として組み込む

## 制限事項と注意点

Enterprise Analytics API を本番運用で使う際の注意点を整理します。

- **エンタープライズ顧客限定**: API 自体が Claude Enterprise 契約を前提としており、個人 / Pro / Team プランでは利用できない
- **遅延がある**: ほぼリアルタイムだが、当日の最新数分のデータは確定していない場合がある
- **時系列の粒度に上限**: 細かい粒度（1分単位など）では取得期間が制限されることがある
- **Admin API キーの厳格な管理が必要**: 漏洩した場合、組織内の利用情報がすべて閲覧可能になる
- **個人特定可能な情報の扱い**: ユーザー単位データは社内規程・各国法令（GDPR等）に従って慎重に扱う必要がある
- **集計値とコンソールの差異**: ダッシュボードと完全一致しない場合は、タイムゾーンや課金確定タイミングの違いを確認する

特に Admin API キーは、**組織全体の利用状況を読み取れる強力な資格情報**です。CI/CD 環境では、Read-only Admin キーを使い、Secrets Manager で管理し、定期的にローテーションする運用を推奨します。

## 【2026-06追記】Compliance API と per-user attribution の拡張

2026年6月、Anthropic は可観測性・監査・ガバナンス系の機能を拡張しました。Analytics API（**集計済み**の使用量・コスト）に加え、**イベント単位の生レコード**を扱う **Compliance API** が新設され、ユーザー単位の取得指標も大きく増えています。

### Compliance API（新規）

**集計値を返す Analytics API とは別系統**で、セキュリティ・法務・コンプライアンスチーム向けに **per-event（イベント単位）の生データ**を返します（公式: [Compliance API](https://platform.claude.com/docs/en/manage-claude/compliance-api)）。

| 項目 | 内容 |
|:---|:---|
| エンドポイント | `https://api.anthropic.com/v1/compliance/*`（例: Activity Feed は `GET /v1/compliance/activities`） |
| 取得できるもの | **Activity Feed**（actor の email / user_id / IP / user_agent、`claude_chat_created` 等のイベント）、**ディレクトリ**（organizations / users / roles / groups）、**claude.ai コンテンツ本体**（chats / files / projects / attachments の取得・**オンデマンド削除**） |
| 対象プラン | **Enterprise はフルAPIにアクセス可（要申請）**。Console 組織は **Activity Feed のみ** |
| 認証 | Compliance Access Key（claude.ai 発行・全エンドポイント）/ Admin API key（Console 発行・Activity Feed のみ）。`read:compliance_activities` 等のスコープ |
| 用途 | 監査・SIEM 連携・コンテンツの取得/削除（GDPR 等の削除要求対応含む） |

> **Analytics API（集計）と Compliance API（生イベント）の棲み分け**: 「何にどれだけ使ったか」を集計で見るのが Analytics、「誰がいつ何をしたか」をイベント単位で追うのが Compliance。キーも別、プロビジョニングも別です。

### per-user attribution（named users 単位）の拡張

Enterprise Analytics API が **named user（メールアドレス付き）単位**で返せる指標が拡張されました。

- **使用量・コスト**: ユーザー別トークン消費（product / model / context window / inference region / speed で内訳）、ユーザー別 USD 支出（product / model / cost type で内訳）
- **チャット／エンゲージメント**: 会話数、送信メッセージ数、作成プロジェクト数、アップロードファイル数、作成 artifact 数、**使用スキル**、**使用コネクタ**
- **Claude Code**: コミット数、PR 数、行数（追加 / 削除）、**セッション数**
- **Cowork**: 開始セッション数、ツールアクション数、dispatch ターン数、スキル / コネクタ呼び出し数

> データ更新の目安: コスト/使用量は約4時間ごと（最大24時間）、エンゲージメント系は約3日遅延。コストは30日間改訂され得るため、請求精度を求める照会は30日以上前の日付を対象にするのが安全です。

これにより、「どのチーム / 個人が、どのプロダクト（Claude Code / Cowork / チャット）で、どれだけ使い・どんな成果（コミット・PR）を出したか」を**named user 粒度**で把握できるようになりました（人事・採用分析や FinOps の精度が向上）。なお個人特定データの取り扱いは社内規程・各国法令（GDPR 等）に従ってください。

## 【2026-06追記】Workload Identity Federation（WIF）— APIキー不要のOIDC認証

**2026年6月17日に GA（一般提供）**となった **Workload Identity Federation（WIF）** により、Admin API（本記事の Analytics/Admin 系 API を含む）を含む全 Claude API エンドポイント（第一者 SDK・**Claude Code** 経由を含む）の認証手段として、長寿命の `sk-ant-...` API キーの代わりに、**自社の ID プロバイダー（IdP）が発行する短命の OIDC（JWT）トークン**でワークロードを認証できます。「CI やコンテナに API キーを置かない」運用が可能になります。

- **対応 IdP**: AWS IAM、Google Cloud、GitHub Actions、Kubernetes、SPIFFE、Microsoft Entra ID、Okta など標準準拠の OIDC 発行体。
- **狙い**: 静的シークレットの発行・保管・ローテーション・漏洩リスクを排除し、**数分で失効するトークン**へ置き換える（IdP 側の条件付きアクセス・監査と組み合わせて多層防御）。

### 3つの構成リソース（Console／Admin API で作成）

| リソース | ID 接頭辞 | 役割 |
|---|---|---|
| **Service account** | `svac_...` | フェデレーショントークンが「成り代わる」非人間アイデンティティ。ワークスペースのレート制限・使用量按分は API キーと同様に適用 |
| **Federation issuer** | `fdis_...` | OIDC IdP を登録（`iss` クレーム値＝Issuer URL＋JWKS 取得方法: `discovery`(既定)/`explicit_url`/`inline`） |
| **Federation rule** | `fdrl_...` | 「issuer X の JWT が条件 Y を満たせば service account Z のトークンを発行」。match（`subject_prefix`/`audience`/`claims`/CEL `condition`）＋ scope（既定 `workspace:developer`）＋ `token_lifetime_seconds`（60〜86400・既定3600） |

### 認証フロー
1. IdP がワークロードに JWT を発行（K8s の projected token、GCP メタデータ、Azure IMDS、GitHub Actions OIDC 等、多くは自動取得）。
2. SDK が JWT を **`POST /v1/oauth/token`**（RFC 7523 `jwt-bearer` グラント）で交換 → Anthropic が JWKS とルールの match を検証し、**短命の `sk-ant-oat01-...` アクセストークン**を返す。
3. SDK が以後のリクエストに付与し、失効前に自動リフレッシュ（API キー未設定でクライアント生成）。

### Admin API での管理（IaC 化）
WIF リソースはコンソールの「Connect workload」ウィザードに加え、**Admin API の新エンドポイント**で管理できます: **Service accounts API / Federation issuers API / Federation rules API**。Infrastructure as Code でフェデレーション設定をコード管理可能です。

> **重要（認証の要件）**: これら WIF 管理エンドポイントは、本記事の Analytics 系で使う **Admin API キー（`x-api-key`）を受け付けません**。**`org:admin` スコープを持つ OAuth ベアラートークン**（admin / owner / primary owner ロール）が必須です。さらに `org:admin` などの特権スコープを持つルールの作成は **Claude Console からの操作に限られ**、OAuth 経由では `workspace:developer` / `workspace:inference` スコープのルールのみ作成・変更できます。各リソースはハードデリートではなく**アーカイブ（ソフト削除・冪等）**で無効化します。

### 注意点
- 取得対象となる Issuer/JWKS URL は **https・443・公開DNSホスト名**が必須（`explicit_url`/`inline` では `issuer_url` は文字列比較で内部ホスト名も可）。
- **`ANTHROPIC_API_KEY` はフェデレーションより優先**されるため、移行時は当該ワークロードの全実行環境（コンテナ env・CI シークレット・シェル）で**確実に unset**する（`ant auth status` でどの資格情報が選ばれたか確認可）。
- 発行トークンの寿命は「ルールの `token_lifetime_seconds`」と「提示した IdP JWT の残存寿命×2」の**短い方**（最低60秒）。

> 出典: [Workload Identity Federation — Anthropic 公式ドキュメント](https://platform.claude.com/docs/en/manage-claude/workload-identity-federation)。Admin API 詳細は Service accounts / Federation issuers / Federation rules の各 API リファレンス参照。

## 【2026-07-02】管理者向け大型アップデート — コスト可視化・モデル制限・支出アラート

2026年7月2日、Anthropic は Claude Enterprise の**管理者向けコントロールを大幅に強化**しました。本記事が扱う Analytics API の周辺（管理ダッシュボード・エンタイトルメント・アラート）が一気に拡充されています（[公式ブログ](https://claude.com/blog/giving-admins-more-visibility-and-control-over-claude-usage-and-spend)）。

| 新機能 | 内容 |
|---|---|
| **グループ/ユーザー別のコスト×生産性表示** | 管理ダッシュボードで「利用とコストをグループ別・ユーザー別」に表示。**Artifacts 作成数・ファイル編集数・使用スキル/コネクタ**などのアウトプットが**コストと並べて**見える。SCIM グループでフィルタ可。Claude Code 専用タブでは開発者数・セッション指標に加え「**生産性向上の推計・コミット単価・年間価値**」も表示 |
| **モデルレベル・エンタイトルメント** | 管理者が**新規会話の開始モデル（デフォルト）とアクセス可能モデル**を、chat / Cowork / Claude Code 横断でロール別・組織全体に設定可能。不要な最上位モデル利用の抑制に |
| **支出アラート** | 組織レベル: 支出上限の **75% / 90%** でメール通知。ユーザーレベル: **75% / 95%** でアプリ内通知＋**Claude 内から管理者へ増額申請**できる導線 |
| **FinOps ツール連携** | Analytics API 経由で **Datadog Cloud Cost Management・CloudZero** にエクスポートし、他のクラウド/AI支出と並べて管理。日付・チーム・プロダクト・モデルでフィルタ可 |
| **Skills / Plugin のコスト計上** | 「**スキルが自身の利用とコストを報告**」し、**プラグイン採用状況・Artifact 作成数を追跡する新エンドポイント**を追加 |
| **Analytics Chat（自然言語）** | 管理者が自然言語で質問（例:「今月 Claude 利用が2倍に増えたチームは？」）→ **エクスポート・共有可能なグラフで回答** |

> **本記事の API 群との関係**: 従来の Analytics API（利用実績の取得）を土台に、「**見る（ダッシュボード/Chat）→ 制御する（エンタイトルメント）→ 守る（支出アラート）→ つなぐ（FinOps 連携）**」が一体化した形です。対象は Claude **Enterprise**（GA として提供）。新エンドポイント（Skills/Plugin/Artifact 系）の仕様は公式ドキュメントの更新を確認してください。

## まとめ — Rate Limits API との両輪で運用する

Enterprise Analytics API は、Claude / Claude Code Remote / Claude Cowork の利用実態をプログラム的に把握できる、エンタープライズ運用の基盤 API です。Rate Limits API との両輪で使うことで、次のような循環を作れます。

```
┌──────────────────────┐    ┌──────────────────────┐
│  Rate Limits API     │    │  Analytics API       │
│  上限値（設定）       │ ←─┤  実績値（消費）       │
└──────────────────────┘    └──────────────────────┘
            │                          │
            └─────── 充足率を計算 ──────┘
                       │
                       ▼
            ┌──────────────────────┐
            │  Slack / Datadog /    │
            │  社内 BI / アラート     │
            └──────────────────────┘
```

特に、2026年4月の料金体系変更（バンドルトークン廃止）により、トークン消費がそのまま請求に直結する構造になったため、**Analytics API による日次コストモニタリングは、もはや「あったら便利」ではなく「ないと困る」**運用要件になりました。

Rate Limits API ガイド（姉妹記事）と組み合わせ、自社のエンタープライズ運用に最適な観測パイプラインを設計してください。

## 参考資料

- [Claude Code user base grows 300% as Anthropic launches enterprise analytics dashboard (The New Stack)](https://thenewstack.io/claude-code-user-base-grows-300-as-anthropic-launches-enterprise-analytics-dashboard/)
- [AWS Weekly Roundup — Anthropic / Meta partnership, AWS Lambda, S3 Files, Bedrock AgentCore CLI (April 27, 2026)](https://aws.amazon.com/blogs/aws/aws-weekly-roundup-anthropic-meta-partnership-aws-lambda-s3-files-amazon-bedrock-agentcore-cli-and-more-april-27-2026/)
- [Compliance API — Claude Docs（公式）](https://platform.claude.com/docs/en/manage-claude/compliance-api)
- [Get started with the Claude Enterprise Analytics API — Anthropic Support（公式）](https://support.claude.com/en/articles/13694757)
