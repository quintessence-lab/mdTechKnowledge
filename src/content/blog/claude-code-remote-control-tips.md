---
title: "【重要Tips】Claude Code リモートセッション起動"
date: 2026-03-29
updatedDate: 2026-04-04
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

### 1. ユーザーがスキルを呼び出す
```
ユーザー:「リモートを起動して」
```

### 2. Claude がSKILL.mdを読み込み、実行すべきコマンドを認識
```
トリガー条件: "リモートセッションを起動して" に一致
→ ~/.claude/skills/remote-control/SKILL.md を参照
→ 方法1（スクリプトファイル使用）を選択
```

### 3. Bashツールで以下を実行
```powershell
Start-Process powershell -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-File', 'C:\Users\%username%\clauderc\claude-remote.ps1'
```

### 4. 新しいPowerShellウィンドウが開き、claude-remote.ps1 が実行される

> **注意**: `claude-remote.ps1` は**ローカル端末上**に配置されたPowerShellスクリプトです（クラウド上ではなく、操作している端末のファイルシステム上に存在します）。
>
> スクリプトの詳細内容については、本ドキュメント（`claude-code-remote-control-tips.md`）の「方法2: インラインコマンド」セクションを参照してください。

### 5. claude が起動し、Remote Control モードで待機
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

## 起動方法による表示の違い

### 通常起動（Cowork外から直接起動）

```
Version: 2.1.86
Session name: /rename to add a name
Session ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
cwd: C:\Users\%username%\clauderc
Login method: Claude Max Account
Organization: ****@****.***'s Organization
Email: ****@****.***
```

- `Login method: Claude Max Account` が表示される
- OAuth フルスコープで認証済み
- Remote Control を含む全機能が使用可能

---

### Cowork内から通常PowerShellを起動してclaudeを起動した場合

```
Version: 2.1.86
Session name: /rename to add a name
Session ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
cwd: C:\Users\%username%\clauderc
Auth token: CLAUDE_CODE_OAUTH_TOKEN
Anthropic base URL: https://api.anthropic.com
```

- `Auth token: CLAUDE_CODE_OAUTH_TOKEN` が表示される（推論専用トークン）
- Cowork の親プロセスから環境変数が**子プロセスに自動継承**される
- スコープ不足により Remote Control が使用不可

---

### claude-remote.ps1 経由で起動した場合

- 環境変数 `CLAUDE_CODE_OAUTH_TOKEN` を明示的に削除してから起動
- キャッシュ済みOAuth（フルスコープ）で認証され、通常起動と同じ状態になる
- Remote Control を含む全機能が使用可能

---

## 起動方法の比較表

> `claude-remote.ps1` は**ローカル端末上**に配置されたスクリプトファイルです。詳細は本ドキュメント（`claude-code-remote-control-tips.md`）を参照してください。

| 項目 | 通常起動（Cowork外） | Cowork内PowerShellから起動 | claude-remote.ps1 経由 |
|------|------|------|------|
| **起動時の表示** | `Login method: Claude Max Account`<br>`Organization: (組織名)`<br>`Email: (メールアドレス)` | `Auth token: CLAUDE_CODE_OAUTH_TOKEN`<br>`Anthropic base URL: https://api.anthropic.com` | `Login method: Claude Max Account`<br>`Organization: (組織名)`<br>`Email: (メールアドレス)` |
| **認証方式** | OAuth（フルスコープ） | 推論専用トークン（Coworkから継承） | OAuth（フルスコープ） |
| **トークン種別** | 通常OAuthトークン | CLAUDE_CODE_OAUTH_TOKEN | 通常OAuthトークン |
| **Remote Control** | 使用可 | スコープ不足でエラー | 使用可 |
| **環境変数の継承** | なし | Cowork親プロセスから自動継承 | 明示的に削除して起動 |
| **全機能利用** | 可 | 制限あり | 可 |
| **claude-remote.ps1** | 不要 | 使用しても効果なし（継承が発生する） | ローカル端末上のスクリプトを実行して環境変数を除去 |

---

## 方法2: インラインコマンド（スクリプトファイルなしの場合）

```powershell
Start-Process powershell -ArgumentList '-NoExit', '-ExecutionPolicy', 'Bypass', '-Command', 'Remove-Item Env:CLAUDE_CODE_OAUTH_TOKEN -ErrorAction SilentlyContinue; Remove-Item Env:ANTHROPIC_API_KEY -ErrorAction SilentlyContinue; claude'
```
