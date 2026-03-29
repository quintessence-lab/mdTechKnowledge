---
title: "Claude Code リモートセッション起動の重要Tips"
date: 2026-03-29
category: "Claude技術解説"
tags: ["Claude Code", "リモートセッション", "Remote Control", "OAuth認証", "PowerShell"]
excerpt: "Cowork経由でClaude Codeを起動する際のOAuthトークン問題と、Remote Controlセッションを正しく起動するための手順を解説する。"
draft: false
---

## 背景・問題

Cowork経由でClaude Codeを起動すると、`CLAUDE_CODE_OAUTH_TOKEN`（推論専用トークン）が自動注入される。このトークンはRemote Controlに必要なスコープが不足しているため、そのまま起動するとエラーになる。

```
Cowork起動時の問題:
  CLAUDE_CODE_OAUTH_TOKEN（推論専用）が注入済み
      ↓ このままだとRemote Controlのスコープ不足
  解決: 新規PowerShellで環境変数を除去してからclaude起動
      ↓ キャッシュ済みOAuth（フルスコープ）で認証
  結果: Remote Control含む全機能が使用可能
```

---

## 実行順序

### ① ユーザーがスキルを呼び出す
```
ユーザー:「リモートを起動して」
```

### ② Claude がSKILL.mdを読み込み、実行すべきコマンドを認識
```
トリガー条件: "リモートセッションを起動して" に一致
→ ~/.claude/skills/remote-control/SKILL.md を参照
→ 方法1（スクリプトファイル使用）を選択
```

### ③ Bashツールで以下を実行
```powershell
Start-Process powershell -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-File', 'C:\Users\%username%\clauderc\claude-remote.ps1'
```

### ④ 新しいPowerShellウィンドウが開き、claude-remote.ps1 が実行される
```powershell
# claude-remote.ps1 の処理内容
Remove-Item Env:CLAUDE_CODE_OAUTH_TOKEN -ErrorAction SilentlyContinue
Remove-Item Env:ANTHROPIC_API_KEY -ErrorAction SilentlyContinue
claude
```

### ⑤ claude が起動し、Remote Control モードで待機
```
> QRコードが表示される
> スマートフォンのClaudeアプリでスキャン
> Remote Controlセッション接続完了
```

---

## 注意事項

- 環境変数の除去は起動したPowerShellセッション内のみに影響（他プロセスに影響なし）
- `-NoExit` フラグにより、claude終了後もPowerShellウィンドウが残る
- **初回のみ** 通常のPowerShellで `claude auth login` を実行してOAuth認証が必要
- 認証キャッシュが切れた場合は再度 `claude auth login` を実行する

---

## 方法2: インラインコマンド（スクリプトファイルなしの場合）

```powershell
Start-Process powershell -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', 'Remove-Item Env:CLAUDE_CODE_OAUTH_TOKEN -ErrorAction SilentlyContinue; Remove-Item Env:ANTHROPIC_API_KEY -ErrorAction SilentlyContinue; claude'
```
