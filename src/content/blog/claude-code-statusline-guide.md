---
title: "Claude Code ステータスライン 仕組みと実装ガイド"
date: 2026-03-29
updatedDate: 2026-03-29
category: "Claude技術解説"
tags: ["Claude Code", "ステータスライン", "カスタマイズ", "シェルスクリプト", "settings.json"]
excerpt: "Claude Codeの画面下部に表示されるステータスラインの仕組み、設定方法、実装例を解説する。"
draft: false
---

## ステータスラインとは

Claude Code の画面下部に固定表示されるカスタマイズ可能なバー。任意のシェルスクリプトを実行し、その出力をリアルタイムで表示する。

### 表示例

**Gitリポジトリありのフォルダで作業中（Opus 4.6）**
![ステータスライン表示例](/images/statusline2_masked.png)

**表示できる情報の例：**
- モデル名
- コンテキストウィンドウの使用率（%）
- セッション費用（USD）
- 経過時間
- Git ブランチ名・ステータス
- レート制限の使用率（Pro/Maxユーザー）

---

## 技術的な仕組み

```
Claude Code（メインプロセス）
    ↓
  JSON 形式のセッションデータを stdin に送信
    ↓
settings.json で指定したシェルスクリプト（実行）
    ↓
  スクリプトが処理して stdout に出力
    ↓
  画面下部に表示
```

**更新タイミング：**
- 新しいアシスタントメッセージ受信後
- パーミッションモード変更時
- Vim モード切り替え時
- 更新は 300ms でデバウンス（複数の変更がまとめて処理される）

**特徴：**
- ローカルで実行（API トークンを消費しない）
- 自動補完・ヘルプメニュー・パーミッションプロンプト表示中は一時非表示

---

## 受信できる JSON データ一覧

| フィールド | 説明 |
|-----------|------|
| `model.id` / `model.display_name` | モデル ID と表示名 |
| `workspace.current_dir` | 現在のディレクトリ |
| `workspace.project_dir` | プロジェクトディレクトリ |
| `context_window.used_percentage` | コンテキスト使用率（%） |
| `context_window.remaining_percentage` | コンテキスト残量（%） |
| `cost.total_cost_usd` | セッション総費用 |
| `cost.total_duration_ms` | 総経過時間（ミリ秒） |
| `cost.total_lines_added` / `removed` | 追加/削除されたコード行数 |
| `rate_limits.five_hour.used_percentage` | 5時間レート制限の使用率（Pro/Maxのみ） |
| `rate_limits.seven_day.used_percentage` | 7日レート制限の使用率（Pro/Maxのみ） |
| `session_id` | セッション ID |
| `vim.mode` | Vim モード（NORMAL/INSERT） |

---

## 設定方法

### 方法A: `/statusline` コマンドで自動生成（推奨）

```
/statusline show model name and context percentage with a progress bar
```

Claude Code が自動的にスクリプトを生成・保存し、settings.json を更新する。

削除する場合：
```
/statusline delete
```

### 方法B: 手動で settings.json を設定

`~/.claude/settings.json` に以下を追加：

```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/statusline.sh",
    "padding": 2
  }
}
```

**設定フィールド：**
- `type`: 常に `"command"` を指定
- `command`: スクリプトのパスまたはインラインコマンド
- `padding`（オプション）: 横方向の余白（文字数）。デフォルト：0

---

## 設定例

### 例1: シンプルなコンテキスト表示

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)
echo "[$MODEL] ${PCT}% context"
```

### 例2: プログレスバー付き（使用率に応じて色変化）

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)

RED='\033[31m'
YELLOW='\033[33m'
GREEN='\033[32m'
RESET='\033[0m'

if [ "$PCT" -ge 90 ]; then COLOR="$RED"
elif [ "$PCT" -ge 70 ]; then COLOR="$YELLOW"
else COLOR="$GREEN"; fi

FILLED=$((PCT / 10))
EMPTY=$((10 - FILLED))
printf -v FILL "%${FILLED}s"
printf -v PAD "%${EMPTY}s"
BAR="${FILL// /▓}${PAD// /░}"

echo -e "[$MODEL] ${COLOR}${BAR}${RESET} ${PCT}%"
```

### 例3: コンテキスト + コスト + 経過時間

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')
COST=$(echo "$input" | jq -r '.cost.total_cost_usd // 0')
PCT=$(echo "$input" | jq -r '.context_window.used_percentage // 0' | cut -d. -f1)
DURATION_MS=$(echo "$input" | jq -r '.cost.total_duration_ms // 0')

MINS=$((DURATION_MS / 60000))
SECS=$(((DURATION_MS % 60000) / 1000))

FILLED=$((PCT / 10))
EMPTY=$((10 - FILLED))
printf -v FILL "%${FILLED}s"
printf -v PAD "%${EMPTY}s"
BAR="${FILL// /█}${PAD// /░}"

echo "[$MODEL]"
echo "$BAR $PCT% | \$$(printf '%.2f' "$COST") | ${MINS}m ${SECS}s"
```

### 例4: Git ステータス付き（色付き）

```bash
#!/bin/bash
input=$(cat)
MODEL=$(echo "$input" | jq -r '.model.display_name')
DIR=$(echo "$input" | jq -r '.workspace.current_dir')

GREEN='\033[32m'
YELLOW='\033[33m'
RESET='\033[0m'

if git rev-parse --git-dir > /dev/null 2>&1; then
    BRANCH=$(git branch --show-current 2>/dev/null)
    STAGED=$(git diff --cached --numstat 2>/dev/null | wc -l | tr -d ' ')
    MODIFIED=$(git diff --numstat 2>/dev/null | wc -l | tr -d ' ')
    echo -e "[$MODEL] ${DIR##*/} | $BRANCH ${GREEN}+${STAGED}${RESET} ${YELLOW}~${MODIFIED}${RESET}"
else
    echo "[$MODEL] ${DIR##*/}"
fi
```

### 例5: Windows PowerShell の場合

`settings.json`:
```json
{
  "statusLine": {
    "type": "command",
    "command": "powershell -NoProfile -File C:/Users/%username%/.claude/statusline.ps1"
  }
}
```

`statusline.ps1`:
```powershell
$input_json = $input | Out-String | ConvertFrom-Json
$model = $input_json.model.display_name
$used = $input_json.context_window.used_percentage
$dirname = Split-Path $input_json.cwd -Leaf

if ($used) {
    Write-Host "$dirname [$model] ctx: $used%"
} else {
    Write-Host "$dirname [$model]"
}
```

---

## ベストプラクティス

- スクリプトは毎回実行されるため、重い処理は避ける
- Git コマンドなどは結果をキャッシュすると軽量化できる
- 長い出力は切り詰められるため、簡潔にする
- ANSI エスケープコードで色付けが可能
- スクリプトには実行権限を付与すること（`chmod +x`）
