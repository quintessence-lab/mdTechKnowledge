---
title: "Anthropic Rate Limits API 完全ガイド — 組織・ワークスペースのレート制限をプログラム照会"
date: 2026-04-29
updatedDate: 2026-04-29
category: "Claude技術解説"
tags: ["Anthropic", "Claude API", "Rate Limits", "Admin API", "エンタープライズ", "運用監視"]
excerpt: "2026年4月25日リリースのAnthropic Rate Limits API（読み取り専用Admin API）を解説。組織・ワークスペース単位のレート制限をJSONで取得可能。CI/Slackボット/ゲートウェイから自動照会できる構成例、認証、レスポンス、運用ユースケースまで網羅。"
draft: false
---

## はじめに — Rate Limits API とは

2026年4月25日、Anthropicは **Rate Limits API** を公開しました。これは Claude API の利用組織が設定されているレート制限を、Webコンソール画面ではなくプログラムから直接照会できる**読み取り専用の Admin API**です。

これまで、自分の組織のレート制限値を確認する方法は次のいずれかでした。

- Claude Console の「Limits」ページを目視で確認する
- 過去のドキュメントやヘルプから推測してハードコードする
- 429 エラーが返ってきたタイミングで実測する

いずれもプログラム的に整合性を保つには弱く、特に Anthropic 側がレート制限値を調整した際にゲートウェイ・スロットラー・モニタリング基盤側が**ドリフト（実値とのズレ）**を起こしがちでした。Rate Limits API はこのドリフトを根本から解消するために設計されています。

公式リリースノートの記載は次の通りです（2026年4月24日付）。

> We've released the Rate Limits API, allowing administrators to programmatically query the rate limits configured for their organization and workspaces.

ant CLI（コマンドライン Messages API クライアント）と混同されがちですが、両者は別軸です。**ant CLI は Messages API を呼び出すフロントエンド**であり、**Rate Limits API は Admin API のサブセットで「設定済みのレート制限値そのもの」を取得する管理系 API** です。本記事では Rate Limits API に絞って解説します。

## 主な機能

Rate Limits API は2つのエンドポイントで構成されています。

| エンドポイント | 用途 |
| --- | --- |
| `GET /v1/organizations/rate_limits` | 組織レベルのレート制限を一覧取得 |
| `GET /v1/organizations/workspaces/{workspace_id}/rate_limits` | ワークスペース固有のオーバーライドを取得 |

主な特徴は以下の通りです。

- **JSON で取得**: コンソール「Limits」ページと同じ情報を構造化データで返す
- **モデルグループ単位**: 複数のモデルバージョンが共有する `model_group` 単位でまとめられる
- **複数リミッタータイプ**: `requests_per_minute`、`input_tokens_per_minute`、`output_tokens_per_minute` などをそれぞれ取得
- **ワークスペース単位のオーバーライド**: ワークスペース側に上書きが設定されている場合、`org_limit`（組織値）と `value`（ワークスペース値）の両方を返す
- **読み取り専用**: 値の変更は Console UI からのみ可能

## 必要な権限・セットアップ

### Admin API キーの取得

Rate Limits API は **Admin API キー（`sk-ant-admin...` で始まる）** が必要です。標準の API キー（`sk-ant-api...`）では呼び出せません。

1. Claude Console（[platform.claude.com](https://platform.claude.com)）にログインする
2. 組織に **admin ロール**を持つメンバーであることを確認する
3. **Settings → Admin Keys** から Admin API キーを発行する
4. 環境変数として安全に保管する（例: `ANTHROPIC_ADMIN_KEY`）

> 個人アカウント（Individual）では Admin API は使えません。Console → Settings → Organization から組織を作成する必要があります。

### 必要なヘッダー

すべてのリクエストに次の2つのヘッダーが必要です。

```http
x-api-key: sk-ant-admin-...
anthropic-version: 2023-06-01
```

`anthropic-version` は Messages API と共通の API バージョンヘッダーで、`2023-06-01` を指定します。

## エンドポイント仕様

### 組織レベル: `GET /v1/organizations/rate_limits`

**クエリパラメータ**

| パラメータ | 型 | 必須 | 説明 |
| --- | --- | --- | --- |
| `model` | string | 任意 | 特定のモデル ID またはエイリアスを含むグループだけ返す |
| `group_type` | string | 任意 | カテゴリでフィルタ（後述） |
| `page` | string | 任意 | ページネーショントークン |

**レスポンス例**

```json
{
  "data": [
    {
      "type": "rate_limit",
      "group_type": "model_group",
      "models": [
        "claude-opus-4-5",
        "claude-opus-4-5-20251101",
        "claude-opus-4-6",
        "claude-opus-4-7"
      ],
      "limits": [
        { "type": "requests_per_minute", "value": 4000 },
        { "type": "input_tokens_per_minute", "value": 2000000 },
        { "type": "output_tokens_per_minute", "value": 400000 }
      ]
    },
    {
      "type": "rate_limit",
      "group_type": "batch",
      "models": null,
      "limits": [
        { "type": "enqueued_batch_requests", "value": 500000 }
      ]
    }
  ],
  "next_page": null
}
```

### ワークスペースレベル: `GET /v1/organizations/workspaces/{workspace_id}/rate_limits`

ワークスペースエンドポイントは**オーバーライドが設定されている項目のみ**を返します。レスポンスに含まれない項目は組織レベル値が継承されます（無制限ではない点に注意）。

**レスポンス例**

```json
{
  "data": [
    {
      "type": "workspace_rate_limit",
      "group_type": "model_group",
      "models": [
        "claude-opus-4-5",
        "claude-opus-4-6",
        "claude-opus-4-7"
      ],
      "limits": [
        { "type": "requests_per_minute", "value": 1000, "org_limit": 4000 },
        { "type": "input_tokens_per_minute", "value": 500000, "org_limit": 2000000 }
      ]
    }
  ],
  "next_page": null
}
```

各リミッターには `value`（ワークスペース値）と `org_limit`（組織側の値、未設定なら `null`）が両方含まれており、差分を一目で把握できます。

### `group_type` で指定可能な値

| 値 | 対象 |
| --- | --- |
| `model_group` | Messages API（モデル別） |
| `batch` | Message Batches API |
| `token_count` | Token Counting API |
| `files` | Files API |
| `skills` | Agent Skills |
| `web_search` | Web Search ツール |

> Claude Managed Agents など一部の新製品はこの API のスコープ外です。

### ページネーション

両エンドポイントは `page` クエリパラメータと `next_page` レスポンスフィールドを持ちます。**現時点では常に単一ページ**で `next_page` は `null` ですが、将来の拡張に備えて必ずループ処理しておくことが推奨されます。

## ユースケース別実装例

### 1. 最小の cURL — 組織レベル一覧取得

```bash
export ANTHROPIC_ADMIN_KEY="sk-ant-admin-..."

curl "https://api.anthropic.com/v1/organizations/rate_limits" \
  --header "anthropic-version: 2023-06-01" \
  --header "x-api-key: $ANTHROPIC_ADMIN_KEY"
```

### 2. CI/CD で使用前にレート制限残量を事前チェック（Python）

大量の Messages API 呼び出しを行うバッチジョブを CI で実行する直前に、現在の `requests_per_minute` 設定を読み取り、想定スループットを超える危険があれば早期に失敗させる例です。

```python
import os
import sys
import requests

ADMIN_KEY = os.environ["ANTHROPIC_ADMIN_KEY"]
HEADERS = {
    "x-api-key": ADMIN_KEY,
    "anthropic-version": "2023-06-01",
}
EXPECTED_RPM = 3000  # ジョブが想定する最低スループット
TARGET_MODEL = "claude-opus-4-7"

def fetch_limits(model: str) -> list[dict]:
    url = "https://api.anthropic.com/v1/organizations/rate_limits"
    resp = requests.get(url, headers=HEADERS, params={"model": model}, timeout=10)
    resp.raise_for_status()
    return resp.json()["data"]

def main() -> int:
    entries = fetch_limits(TARGET_MODEL)
    if not entries:
        print(f"[ERROR] {TARGET_MODEL} のレート制限グループが見つかりません")
        return 1

    rpm = next(
        (l["value"] for l in entries[0]["limits"] if l["type"] == "requests_per_minute"),
        None,
    )
    if rpm is None or rpm < EXPECTED_RPM:
        print(f"[FAIL] requests_per_minute={rpm} が期待値 {EXPECTED_RPM} 未満です")
        return 1

    print(f"[OK] {TARGET_MODEL} requests_per_minute={rpm}")
    return 0

if __name__ == "__main__":
    sys.exit(main())
```

GitHub Actions では `secrets.ANTHROPIC_ADMIN_KEY` として注入し、ステップの `if: failure()` 条件で Slack 通知を飛ばすと、定例的なレート制限ドリフト監視として機能します。

### 3. Slack ボットから残量サマリ通知（Python）

毎朝、組織の主要モデル枠を Slack に投稿する例です。

```python
import os
import requests

ADMIN_KEY = os.environ["ANTHROPIC_ADMIN_KEY"]
SLACK_WEBHOOK = os.environ["SLACK_WEBHOOK_URL"]

def fetch_all() -> list[dict]:
    headers = {"x-api-key": ADMIN_KEY, "anthropic-version": "2023-06-01"}
    out, page = [], None
    while True:
        params = {"page": page} if page else {}
        r = requests.get(
            "https://api.anthropic.com/v1/organizations/rate_limits",
            headers=headers, params=params, timeout=10,
        )
        r.raise_for_status()
        body = r.json()
        out.extend(body["data"])
        page = body.get("next_page")
        if not page:
            break
    return out

def format_summary(entries: list[dict]) -> str:
    lines = ["*Claude API Rate Limits (org)*"]
    for e in entries:
        label = (e["models"][0] if e["models"] else e["group_type"])
        for lim in e["limits"]:
            v = f"{lim['value']:,}"
            lines.append(f"- `{label}` {lim['type']}: *{v}*")
    return "\n".join(lines)

if __name__ == "__main__":
    text = format_summary(fetch_all())
    requests.post(SLACK_WEBHOOK, json={"text": text}, timeout=10)
```

cron や Cloud Scheduler から1日1回実行し、Anthropic 側でレート制限が引き上げ・引き下げされた変化を運用チームが即座に把握できる体制を作れます。

### 4. API ゲートウェイでの自動スロットル（Node.js）

自社で運用する LLM ゲートウェイの起動時に Rate Limits API を読み込み、内部のリーキーバケットレートリミッターの上限値を**ハードコードではなく Anthropic の現値に合わせる**例です。

```javascript
import fetch from "node-fetch";

const ADMIN_KEY = process.env.ANTHROPIC_ADMIN_KEY;

async function loadOrgLimits() {
  const res = await fetch(
    "https://api.anthropic.com/v1/organizations/rate_limits",
    {
      headers: {
        "x-api-key": ADMIN_KEY,
        "anthropic-version": "2023-06-01",
      },
    },
  );
  if (!res.ok) {
    throw new Error(`Rate Limits API failed: ${res.status}`);
  }
  return (await res.json()).data;
}

function pickLimit(entries, model, type) {
  const group = entries.find(
    (e) => e.group_type === "model_group" && (e.models || []).includes(model),
  );
  if (!group) return null;
  const lim = group.limits.find((l) => l.type === type);
  return lim ? lim.value : null;
}

export async function buildThrottleConfig() {
  const entries = await loadOrgLimits();
  return {
    "claude-opus-4-7": {
      rpm: pickLimit(entries, "claude-opus-4-7", "requests_per_minute"),
      itpm: pickLimit(entries, "claude-opus-4-7", "input_tokens_per_minute"),
      otpm: pickLimit(entries, "claude-opus-4-7", "output_tokens_per_minute"),
    },
  };
}
```

ゲートウェイ起動時と1時間ごとの定期リフレッシュで呼び出すことで、Anthropic 側のレート制限変更に追従します。

### 5. モニタリングダッシュボード連携（Grafana / Prometheus）

Prometheus 用のテキストフォーマット出力エンドポイントを作る例（Python + FastAPI を想定）。

```python
from fastapi import FastAPI, Response
import requests, os

app = FastAPI()
HEADERS = {
    "x-api-key": os.environ["ANTHROPIC_ADMIN_KEY"],
    "anthropic-version": "2023-06-01",
}

@app.get("/metrics")
def metrics():
    r = requests.get(
        "https://api.anthropic.com/v1/organizations/rate_limits",
        headers=HEADERS, timeout=10,
    )
    r.raise_for_status()
    lines = ["# TYPE anthropic_rate_limit gauge"]
    for entry in r.json()["data"]:
        models = entry.get("models") or [entry["group_type"]]
        for lim in entry["limits"]:
            for m in models:
                lines.append(
                    f'anthropic_rate_limit{{group="{entry["group_type"]}",'
                    f'model="{m}",limiter="{lim["type"]}"}} {lim["value"]}'
                )
    return Response("\n".join(lines), media_type="text/plain")
```

これを Prometheus が scrape すれば、Grafana 上で「設定上限値」と「実使用量（[Usage and Cost API](https://platform.claude.com/docs/en/build-with-claude/usage-cost-api) や 429 メトリクス）」を重ねて表示でき、消化率を一目で確認できます。

## 既存の利用統計・監視手段との比較

Anthropic にはレート制限・利用状況に関するエンドポイントや UI が複数あります。違いを整理しておきます。

| 機能 | 提供形態 | 対象 | 用途 |
| --- | --- | --- | --- |
| **Rate Limits API**（本記事） | Admin API（読み取り専用） | 組織・ワークスペースの**設定済み上限値** | ゲートウェイの上限ドリフト解消、上限変更の検知 |
| Usage and Cost API | Admin API（読み取り専用） | **実使用量とコスト**の時系列 | 消費分析、原価管理、予算アラート |
| Console「Limits」ページ | Web UI | 設定済み上限値 | 担当者が目視で確認 |
| Console「Usage」ページ・レート制限チャート | Web UI | 実使用量と429発生率 | 運用状況の可視化 |
| ステータスライン JSON / CLI 残量表示 | クライアント側情報 | 直近のリクエストに紐づく残枠 | 開発者の手元での確認 |
| `anthropic-ratelimit-*` レスポンスヘッダー | Messages API レスポンス | リアルタイム残量 | リクエストごとのスロットル判断 |

要点は次のとおりです。

- **設定値を知る**なら Rate Limits API、**実消費を知る**なら Usage and Cost API
- **リアルタイムの残量**は Messages API のレスポンスヘッダーが最も粒度が細かい
- ダッシュボードでは「Rate Limits API（分母）」と「Usage and Cost API または 429 メトリクス（分子）」を組み合わせるのが定石

ant CLI は Messages API のフロントエンドなので、Rate Limits API とは目的が異なります。ant CLI で日常的に Claude を呼び出しつつ、運用基盤側で Rate Limits API を併用するのが推奨パターンです。

## 制限事項・既知の問題

2026年4月時点で確認できる制限は次のとおりです。

- **読み取り専用**: 値の変更はできません。ワークスペース上限の変更は Console UI から行います。
- **デフォルトワークスペースは対象外**: デフォルトワークスペースはオーバーライドを持てないため、ワークスペースエンドポイントには現れません。組織エンドポイントの値がそのまま適用されます。
- **`model` パラメータは組織エンドポイントのみ**: ワークスペースエンドポイントでは `model` クエリは受け付けません。
- **Managed Agents などは未対応**: Claude Managed Agents 等の新規プロダクトの上限は本 API のスコープ外です。
- **Admin API キー必須**: 個人アカウントでは利用不可。組織のセットアップが必要です。
- **ページネーションは現状単一ページ**: 仕様としては `next_page` ループを必ず実装すべきですが、現時点で複数ページが返る運用は確認されていません。
- **更新頻度**: Anthropic 側で上限が引き上げ・引き下げされた場合、Console と本 API は同じソースを参照しているとされていますが、反映タイミングの SLA は明示されていません。アプリ側ではキャッシュ戦略と組み合わせる前提で設計してください。

## ベストプラクティス

### キャッシュ戦略

Rate Limits API の値はリアルタイムに変動するものではなく、Anthropic 側の調整・自社の Console 操作のタイミングでしか変わりません。**毎リクエスト呼び出すのは過剰**です。次のキャッシュ方針を推奨します。

- **ゲートウェイ・スロットラー**: 起動時に1回 + 1時間ごとに再フェッチ
- **CI/CD の事前チェック**: ジョブごとに1回（キャッシュ不要）
- **Slack 日次レポート**: 1日1回スケジュール実行
- **Grafana エクスポーター**: Prometheus の scrape interval（30〜60秒）に合わせて API を1回。短ければ自前で5分キャッシュを挟むこと

5xx や一時的な障害に備え、**最後に成功した値を最低24時間メモリ保持**するフォールバックを実装するとサービスの可用性が高まります。

### エラーハンドリング

押さえるべき主要なエラーパターンは次のとおりです。

- `401 Unauthorized`: Admin API キーが無効、または通常の API キーを使っている
- `403 Forbidden`: キーは有効だが、対象組織のリソースへの権限がない
- `404 Not Found`: `model` クエリで指定したモデル ID がどのグループにもマッチしない
- `429 Too Many Requests`: Admin API 自体のレート制限超過（通常運用ではほぼ発生しない）
- `5xx`: Anthropic 側の一時的障害。指数バックオフで再試行

実装サンプル（Python、`tenacity` 利用）。

```python
from tenacity import retry, stop_after_attempt, wait_exponential
import requests

@retry(
    stop=stop_after_attempt(5),
    wait=wait_exponential(multiplier=1, min=2, max=30),
    retry_error_callback=lambda s: None,
)
def get_limits():
    r = requests.get(
        "https://api.anthropic.com/v1/organizations/rate_limits",
        headers={
            "x-api-key": ADMIN_KEY,
            "anthropic-version": "2023-06-01",
        },
        timeout=10,
    )
    if r.status_code in (401, 403, 404):
        # 再試行しても無意味なエラーは即時失敗
        r.raise_for_status()
    if r.status_code >= 500 or r.status_code == 429:
        r.raise_for_status()
    return r.json()
```

### Admin API キーの管理

Admin API キー（`sk-ant-admin-...`）は**通常の API キーよりも強力**です。利用状況の参照だけでなく、API キー発行・ワークスペース管理など組織全体に影響するエンドポイントへのアクセスにも使われます。次の運用を推奨します。

- **シークレットマネージャに保管**: AWS Secrets Manager / GCP Secret Manager / Azure Key Vault / 1Password / HashiCorp Vault のいずれか
- **Git にコミット禁止**: `.env` 直書きをやめ、`.gitignore` を必ず確認
- **CI では Masked Secret として注入**: GitHub Actions、GitLab CI 等のシークレット機能を使う
- **ローテーション**: 四半期ごとなどの定期ローテーションをルール化
- **最小権限の原則**: Rate Limits API のためだけに使うキーであっても、漏洩時の影響範囲を縮めるため利用範囲を組織のポリシーで明文化
- **監査ログ**: Admin API の呼び出しログを SIEM（Splunk、Datadog、Sentinel 等）に集約

公式ドキュメントは「キーは admin ロールを持つ組織メンバーが Console から発行する」旨を明記しているため、組織の承認フローを通じてだけ発行できる仕組みを徹底してください。

## まとめ

Rate Limits API は、Claude API のエンタープライズ運用において以下を可能にします。

- ゲートウェイ・スロットラー側のレート制限値の**ハードコードを廃止**
- Anthropic の上限調整への**自動追従**
- Usage and Cost API と組み合わせた**消化率モニタリング**の実装
- ワークスペースごとの**設定差分の自動監査**

ant CLI のような開発者向けツールが「Claude を呼び出す側の体験」を改善するのに対し、Rate Limits API は「Claude を運用する側の見通し」を改善します。本記事のコード例をベースに、自社の運用基盤に組み込んでみてください。

## 参考リンク

- [Rate Limits API ドキュメント（公式）](https://platform.claude.com/docs/en/build-with-claude/rate-limits-api)
- [Admin API 全体像](https://platform.claude.com/docs/en/build-with-claude/administration-api)
- [Usage and Cost API](https://platform.claude.com/docs/en/build-with-claude/usage-cost-api)
- [Rate limits（リミッター仕様の詳細）](https://platform.claude.com/docs/en/api/rate-limits)
- [リリースノート（2026年4月24日付）](https://platform.claude.com/docs/en/release-notes/overview)
