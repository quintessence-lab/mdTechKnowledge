---
title: "Anthropic モデル廃止スケジュール & 移行ガイド — 1Mコンテキストβ廃止・Sonnet/Opus 4 廃止の対応"
date: 2026-05-02
updatedDate: 2026-05-02
category: "Claude技術解説"
tags: ["Claude", "Anthropic", "API", "モデル廃止", "移行", "1Mコンテキスト", "Sonnet 4", "Opus 4", "extended thinking"]
excerpt: "2026年4月30日に1Mコンテキストβ（context-1m-2025-08-07）が廃止、6月15日にSonnet 4 (claude-sonnet-4-0)とOpus 4 (claude-opus-4-0)が廃止される。本稿では緊急度の高い2件の廃止について、影響範囲・移行手順・extended thinkingの変更点・テストスニペット・ロールバック戦略まで体系的に整理する。"
draft: false
---

## はじめに

Anthropic API利用者にとって、2026年5月初旬は**緊急度の高いモデル廃止が2件同時進行する**節目です。

1. **2026-04-30**: ベータヘッダー `context-1m-2025-08-07` が廃止 — Sonnet 4.5 / Sonnet 4 で1Mコンテキストが無効化
2. **2026-06-15**: `claude-sonnet-4-0` (Sonnet 4) と `claude-opus-4-0` (Opus 4) がリタイア — APIエラー化

本記事では、両者の影響範囲・移行手順・運用上の注意点を**API直叩き／SDK経由／Bedrock・Vertex・Foundry**の各経路別に整理し、最後に**extended thinkingの変更点**と**確認用テストスニペット**、**ロールバック戦略**まで一気通貫で解説します。

---

## 1. 廃止スケジュール一覧

### 直近で対応が必要なリタイア

| リタイア日 | 対象 | 種別 | 推奨移行先 |
|:---|:---|:---|:---|
| **2026-04-30** | `context-1m-2025-08-07` ベータヘッダー | ヘッダー | ヘッダー削除＋Sonnet 4.6へ移行 |
| **2026-06-15** | `claude-sonnet-4-20250514` (Sonnet 4) | モデル | `claude-sonnet-4-6` |
| **2026-06-15** | `claude-opus-4-20250514` (Opus 4) | モデル | `claude-opus-4-7` |

### 公式ステータステーブル（2026年5月時点抜粋）

| API モデル名 | 状態 | 廃止通知日 | リタイア予定日 |
|:---|:---|:---|:---|
| `claude-opus-4-7` | Active | — | 2027-04-16 以降 |
| `claude-opus-4-6` | Active | — | 2027-02-05 以降 |
| `claude-opus-4-5-20251101` | Active | — | 2026-11-24 以降 |
| `claude-opus-4-1-20250805` | Active | — | 2026-08-05 以降 |
| `claude-opus-4-20250514` | **Deprecated** | 2026-04-14 | **2026-06-15** |
| `claude-sonnet-4-6` | Active | — | 2027-02-17 以降 |
| `claude-sonnet-4-5-20250929` | Active | — | 2026-09-29 以降 |
| `claude-sonnet-4-20250514` | **Deprecated** | 2026-04-14 | **2026-06-15** |
| `claude-haiku-4-5-20251001` | Active | — | 2026-10-15 以降 |

リタイア後は該当モデルIDを指定したリクエストはエラー応答（典型的には`404 not_found_error` または `400 invalid_request`）となります。

### モデル状態の用語整理

| 状態 | 意味 |
|:---|:---|
| **Active** | 正式サポート、推奨 |
| **Legacy** | 更新は止まったが利用可。将来の廃止候補 |
| **Deprecated** | 利用は可能だが推奨外。リタイア日が確定 |
| **Retired** | リタイア完了。リクエストは失敗する |

---

## 2. 影響範囲（経路別）

廃止の影響は、API利用経路によって細かく異なります。

### 2.1 Anthropic API 直叩き

| 影響 | 詳細 |
|:---|:---|
| 1Mコンテキスト | `anthropic-beta: context-1m-2025-08-07` ヘッダーが**4/30以降は無視される**。200kトークン超のプロンプトは `400 invalid_request_error` で拒否 |
| Sonnet 4 / Opus 4 | 6/15以降、`claude-sonnet-4-0` `claude-opus-4-0` を指定したリクエストが失敗 |

### 2.2 公式SDK（Python / TypeScript / Go / Java / .NET / PHP / Ruby）

SDKは内部で`messages.create`等のAPIをラップしているだけなので、**モデルID文字列の参照箇所**を更新する以外の対応は基本不要です。ただし、SDKメジャーバージョンによってはdeprecatedモデルへの自動フォールバックが入っていないため、明示的な置換が必要です。

```python
# Before
client.messages.create(model="claude-sonnet-4-0", ...)

# After
client.messages.create(model="claude-sonnet-4-6", ...)
```

### 2.3 Amazon Bedrock

| 影響 | 詳細 |
|:---|:---|
| モデルID | Bedrock経由のARN（例: `anthropic.claude-sonnet-4-v1:0`）も同期して廃止される。**Bedrock側のリリースノートで対応版モデルARNへ移行** |
| 1Mコンテキスト | Bedrockでは元から1Mベータが提供されていない地域があり、ヘッダー方式とは挙動が異なる。**地域別の最新告知を確認** |

### 2.4 Google Cloud Vertex AI

| 影響 | 詳細 |
|:---|:---|
| パブリッシャーモデル | `publishers/anthropic/models/claude-sonnet-4` 等のパスが廃止対象。**4.6/4.7パスへ更新** |
| 認証 | Vertexは`anthropic-beta`ヘッダーを直接渡せないため、SDK側のVertex対応版で**ベータ機能の有無自体が異なる**点に注意 |

### 2.5 Microsoft Foundry（Azure AI Foundry）

| 影響 | 詳細 |
|:---|:---|
| デプロイメント名 | Foundryでデプロイ時に付けた名前は保持されるが、**裏側のモデルバージョンは更新が必要** |
| 通知タイミング | Anthropic本家より遅れて反映されるケースがある。Foundry管理画面の通知も並行確認 |

---

## 3. 1Mコンテキストβ廃止の詳細

### 何が変わるか

2026年4月30日付で、**`context-1m-2025-08-07`** ベータヘッダーは Sonnet 4.5 / Sonnet 4 から廃止されます。これにより:

1. ヘッダーは**無視され、200kトークン上限が適用**される
2. 200k超のプロンプトは**`400` エラー**で拒否される
3. 専用の**長コンテキストレート制限**（プレミアム枠）は標準制限に統合される

### 価格面の変化

廃止前: 200kトークン超の入力には**長コンテキストプレミアム**として、入力2倍・出力1.5倍が課金されていました。

廃止後: 後継のSonnet 4.6では、**$3 / $15 の標準価格を900kトークンまで適用**する形に変わり、追加料金なしで長コンテキストが扱えます（Opus 4.7も同様に1M標準価格）。

### 移行ステップ（SDK利用例）

```python
import anthropic

client = anthropic.Anthropic()

# === 廃止前（〜2026-04-30） ===
response = client.messages.create(
    model="claude-sonnet-4-5",
    max_tokens=4096,
    messages=[{"role": "user", "content": large_text}],
    extra_headers={"anthropic-beta": "context-1m-2025-08-07"},
)

# === 廃止後（2026-04-30以降の推奨） ===
response = client.messages.create(
    model="claude-sonnet-4-6",   # モデルIDを更新
    max_tokens=4096,
    messages=[{"role": "user", "content": large_text}],
    # ベータヘッダーは不要（標準で長コンテキスト対応）
)
```

### コードベース全体の置換

```bash
# プロジェクト内を grep して、ヘッダー指定箇所を洗い出す
grep -rn "context-1m-2025-08-07" .

# 環境変数化していれば一括差し替え
# .env: ANTHROPIC_LONG_CONTEXT_BETA=context-1m-2025-08-07 → 削除
```

### Sonnet 4 → Sonnet 4.6 の互換性

API面の主要な互換性は維持されており、`messages.create`のパラメータ・レスポンス構造はそのままです。ただし、**プロンプトキャッシュのキー**はモデルIDに紐づくため、**キャッシュは再ウォーミングが必要**です。バッチで動かしているシステムでは、初回のレスポンスタイムが一時的に伸びる点を運用通知に含めると安全です。

---

## 4. Sonnet 4 / Opus 4 廃止の詳細

### 廃止対象と推奨移行先

| 廃止モデル | 廃止日 | デフォルト移行先 | パフォーマンス重視の移行先 |
|:---|:---|:---|:---|
| `claude-sonnet-4-20250514` | 2026-06-15 | `claude-sonnet-4-6` | `claude-opus-4-7` |
| `claude-opus-4-20250514` | 2026-06-15 | `claude-opus-4-7` | `claude-opus-4-7` |

価格・速度バランスを保つなら**Sonnet 4 → Sonnet 4.6**、知能優先で完全に置換するなら**Sonnet 4 → Opus 4.7**を選びます。

### モデルIDの典型パターン

```python
# === 古い指定（リタイア対象） ===
MODEL = "claude-sonnet-4-0"
# または
MODEL = "claude-sonnet-4-20250514"
MODEL = "claude-opus-4-0"
MODEL = "claude-opus-4-20250514"

# === 推奨指定（2026年5月時点） ===
MODEL = "claude-sonnet-4-6"      # Sonnet系の最新
MODEL = "claude-opus-4-7"        # Opus系の最新
```

### コードベース内の更新ステップ

#### Step 1: 監査

Anthropic Consoleの**Usage**画面 → **Export** から、API キー × モデル別のCSVを取得し、**廃止対象モデルの利用箇所**を特定します。

```bash
# CSVから対象モデルの利用APIキーを抽出する例
awk -F',' '$3 ~ /claude-(sonnet|opus)-4-2025/' usage.csv
```

#### Step 2: モデルIDを環境変数化

ハードコーディングされたモデルIDは、まず環境変数 or 設定ファイルへ集約します。

```python
# config.py
import os

CLAUDE_MODEL_DEFAULT = os.getenv("CLAUDE_MODEL_DEFAULT", "claude-sonnet-4-6")
CLAUDE_MODEL_HEAVY   = os.getenv("CLAUDE_MODEL_HEAVY",   "claude-opus-4-7")
```

これによりリタイア時の置換が**1箇所修正で済む**ようになります。

#### Step 3: ステージングで先に動作確認

リタイア日の**少なくとも2週間前**にステージングを切り替え、品質劣化・プロンプト互換性・コスト変動を確認します。

#### Step 4: 本番をローリング切替

トラフィックを段階的にシフト。問題があれば即時にロールバックできるよう、新旧モデルIDを切り替えるフィーチャーフラグを用意するのが推奨です。

---

## 5. extended thinking の変更点

### `budget_tokens` 廃止と新方式

旧 Sonnet 4 / Opus 4 では、extended thinkingの推論バジェットは**`thinking.budget_tokens`** で指定していました。

```python
# === 旧方式（Sonnet 4 / Opus 4） ===
response = client.messages.create(
    model="claude-opus-4-0",
    max_tokens=4096,
    thinking={"type": "enabled", "budget_tokens": 16000},
    messages=[...],
)
```

新世代（Sonnet 4.5以降、Opus 4.5以降）では、**`effort`** パラメータによる**抽象レベル指定**が標準になりました。

```python
# === 新方式（Sonnet 4.6 / Opus 4.7） ===
response = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=4096,
    thinking={"type": "enabled", "effort": "xhigh"},  # standard / high / xhigh / max
    messages=[...],
)
```

### `effort` レベルの目安

```
standard  →  high  →  xhigh  →  max
 軽量      標準    コーディング  最大限の
                   ・複雑エージェント   推論
                   推奨スタート点
```

### 移行時の注意

| 項目 | 旧 (`budget_tokens`) | 新 (`effort`) |
|:---|:---|:---|
| 指定単位 | トークン数 | 抽象レベル |
| 上限制御 | プログラムで厳密 | モデル側でレベルに応じた可変 |
| コスト見積もり | 上限固定で読みやすい | 平均値ベースで運用 |
| マイグレーション | `budget_tokens` を `effort` レベルへマップ | 16k 程度なら `high`、コーディングは `xhigh` から |

レガシー互換のため、Sonnet 4.6 / Opus 4.7でも当面は`budget_tokens`相当の指定を受け付けるラッパーがSDK側に残っているケースがありますが、**正式には`effort`への移行が推奨**です。

---

## 6. 確認用テストスニペット

### Python（公式SDK）

```python
import os
import anthropic

client = anthropic.Anthropic(api_key=os.environ["ANTHROPIC_API_KEY"])

def smoke_test(model: str) -> bool:
    """指定モデルが利用可能か簡易チェック"""
    try:
        resp = client.messages.create(
            model=model,
            max_tokens=64,
            messages=[{"role": "user", "content": "Reply with OK."}],
        )
        text = resp.content[0].text.strip()
        print(f"[{model}] -> {text}")
        return "OK" in text
    except anthropic.NotFoundError:
        print(f"[{model}] retired or not available")
        return False
    except anthropic.APIStatusError as e:
        print(f"[{model}] API error: {e.status_code} {e.message}")
        return False

if __name__ == "__main__":
    for model in [
        "claude-sonnet-4-6",   # 期待: OK
        "claude-opus-4-7",     # 期待: OK
        "claude-sonnet-4-0",   # 6/15以降: NG
        "claude-opus-4-0",     # 6/15以降: NG
    ]:
        smoke_test(model)
```

### curl（直接叩いて確認）

```bash
# Sonnet 4.6 の疎通
curl -s https://api.anthropic.com/v1/messages \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{
    "model": "claude-sonnet-4-6",
    "max_tokens": 32,
    "messages": [{"role":"user","content":"Reply with OK."}]
  }' | jq '.content[0].text'

# 長コンテキスト（Sonnet 4.6 で900kまで標準対応・ヘッダー不要）
# 古い context-1m ベータを付けても無害（4/30以降は無視される）
```

### 1Mベータヘッダー残存検出（リポジトリ全体）

```bash
# 残存する古いベータヘッダーを洗い出す
rg -n "context-1m-2025-08-07" .
rg -n "claude-(sonnet|opus)-4-(0|20250514)" .
```

### extended thinking の動作確認

```python
resp = client.messages.create(
    model="claude-opus-4-7",
    max_tokens=2048,
    thinking={"type": "enabled", "effort": "xhigh"},
    messages=[{"role": "user", "content": "1から100までの素数を列挙し、その合計を計算してください。"}],
)
for block in resp.content:
    if block.type == "thinking":
        print("[THINKING]", block.thinking[:200], "...")
    elif block.type == "text":
        print("[OUTPUT]", block.text)
```

---

## 7. ロールバック戦略・代替案

### 戦略1: フィーチャーフラグで瞬時切替

```python
# config.py
USE_LEGACY_MODEL = os.getenv("USE_LEGACY_MODEL", "false").lower() == "true"

MODEL = "claude-sonnet-4-0" if USE_LEGACY_MODEL else "claude-sonnet-4-6"
```

リタイア日（2026-06-15）までは旧モデルへの即時ロールバックも可能ですが、**6/15以降は旧モデルへの戻しは原理的に不可**です。**6/15より前にステージングで品質確認**を完了することが肝要です。

### 戦略2: A/Bテストでの段階移行

```python
import random

def pick_model() -> str:
    # 10% を新モデルに振って品質を比較
    return "claude-sonnet-4-6" if random.random() < 0.1 else "claude-sonnet-4-0"
```

- 1日目: 10%
- 3日目: 30%
- 1週間後: 70%
- 2週間後: 100%

### 戦略3: 失敗時のフェイルオーバー（リタイア後はサーバー側でエラー）

リタイア後は旧モデルを呼ぶと`404`が返るため、**try/exceptで捕捉して新モデルにフォールバック**するセーフティネットを挟むのが定石です。

```python
def call_with_fallback(messages):
    try:
        return client.messages.create(model="claude-sonnet-4-6", max_tokens=2048, messages=messages)
    except anthropic.NotFoundError:
        # まずありえない経路だが、転ばぬ先の杖
        return client.messages.create(model="claude-haiku-4-5", max_tokens=2048, messages=messages)
```

### 戦略4: コスト最適化を狙った再選定

廃止を機に**モデル選定そのものを見直す**のも合理的です。たとえば「軽い分類タスクはHaiku 4.5に寄せる」「Heavy推論はOpus 4.7のxhigh effort一択にする」など、コスト＝品質バランスの再設計を組み込みやすい節目です。

| 旧構成 | 移行先候補 | 想定効果 |
|:---|:---|:---|
| Sonnet 4 (一般タスク) | Sonnet 4.6 | 同等価格・同等以上の知能・900k標準対応 |
| Sonnet 4 (大量分類) | Haiku 4.5 | コスト大幅減・速度向上 |
| Opus 4 (重推論) | Opus 4.7 + xhigh | 1M標準対応・推論深度ジャンプ |
| Sonnet 4 + 1Mベータ | Sonnet 4.6 | プレミアム廃止で**実質コスト減** |

---

## 8. 移行チェックリスト

```
[ ] Anthropic Console > Usage で旧モデルの利用箇所を抽出
[ ] context-1m-2025-08-07 ヘッダーの残存を grep で確認
[ ] claude-sonnet-4-0 / claude-opus-4-0 / -20250514 サフィックスの残存確認
[ ] 環境変数化（CLAUDE_MODEL_DEFAULT 等）で1箇所管理に
[ ] ステージング環境で新モデルの動作確認（疎通・出力品質）
[ ] extended thinking 利用箇所で budget_tokens → effort へ書き換え
[ ] プロンプトキャッシュの再ウォーミング計画
[ ] 本番ローリング切替の段取り（A/B、フィーチャーフラグ）
[ ] 6/15 リタイア日まで2週間以上の余裕を持って完了
[ ] Bedrock / Vertex / Foundry 経由は各プラットフォームの告知も並行確認
```

---

## まとめ

- **2026-04-30**: `context-1m-2025-08-07` ベータヘッダーが廃止 → **ヘッダー削除＋Sonnet 4.6（900k標準）への移行**
- **2026-06-15**: Sonnet 4 / Opus 4 が**リタイア**（APIエラー化） → **Sonnet 4.6 / Opus 4.7 へ移行**
- 経路別影響: API直叩き・SDK・Bedrock・Vertex・Foundryで微妙に対応箇所が異なる
- extended thinking は **`budget_tokens` → `effort`** が新方式。`xhigh` がコーディング推奨スタート
- 価格面は1Mプレミアム廃止により**実質コスト減**になるケースが多い
- 移行戦略はフィーチャーフラグ・A/B・フェイルオーバーを組み合わせる
- **6/15以降は旧モデル戻しが不可**。2週間以上の余裕を持ってステージング検証を完了させること

廃止スケジュールは「ただの作業」ではなく、**モデル選定全体を見直す好機**でもあります。Sonnet/Opusを単純に1段上のバージョンへ置き換えるだけでなく、Haiku 4.5への部分シフトや`effort`レベル設計を再検討することで、コスト・品質・速度のバランスをより最適化できます。

---

## 参考資料

- [Model deprecations — Claude Platform Docs](https://platform.claude.com/docs/en/about-claude/model-deprecations)
- [Anthropic 1M context beta retirement (April 30, 2026) — Pasquale Pillitteri](https://pasqualepillitteri.it/en/news/1451/anthropic-1m-context-beta-retirement-april-30-2026)
- [Claude Sonnet 4 / Opus 4 Deprecation Migration Guide — MindStudio](https://www.mindstudio.ai/blog/claude-sonnet-4-opus-4-deprecation-migration-guide)
