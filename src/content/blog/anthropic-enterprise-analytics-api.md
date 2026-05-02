---
title: "Anthropic Enterprise Analytics API 完全ガイド — 組織別利用データの照会と活用"
date: 2026-05-02
updatedDate: 2026-05-02
category: "Claude技術解説"
tags: ["Anthropic", "Claude API", "Admin API", "Analytics", "エンタープライズ", "FinOps", "Slack連携"]
excerpt: "2026年4月、Anthropic は Claude / Claude Code Remote / Claude Cowork の組織別利用データをプログラム照会できる Enterprise Analytics API を拡張した。Rate Limits API との位置付けの違い、エンドポイント構造、認証、レスポンス、Python/curl 実装例、Slackボット連携、運用ユースケース、制限事項までをまとめて解説する。"
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
