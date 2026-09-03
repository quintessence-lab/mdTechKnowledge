---
title: "【重要Tips】Claude Code リモートセッション起動"
date: 2026-03-29
updatedDate: 2026-09-04
category: "Claude技術解説"
tags: ["Claude Code", "リモートセッション", "Remote Control", "OAuth認証", "PowerShell"]
excerpt: "Cowork経由でClaude Codeを起動する際のOAuthトークン問題と、Remote Controlセッションを正しく起動するための手順を解説する。2026年8月追記: v2.1.229の claude remote-control --continue（最新セッションを名前不要で再開）と、v2.1.232の安定化（ネットワーク断後約30分の自動再接続・セッション再アタッチ・別デバイス引き継ぎの明示）、Week 34でのRemote Control正式版化とスマホの「デバイスカード」からのセッション開始、v2.1.251でのフォアグラウンド部分エージェントのツール呼び出しライブ配信を反映。"
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

---

## 【2026-08-14 追記】`claude remote-control --continue` と Remote Control の安定化

本記事の初版（2026年4月）以降、Remote Control まわりは大きく改善されています。特に **v2.1.229（2026-08-12 PT）で追加された `--continue`** は、本記事のテーマである「セッションの起動」を簡略化する 新フローです。

### `claude remote-control --continue` — 最新セッションを名前不要で再開

```powershell
claude remote-control --continue
```

**最後に使った Remote Control セッションを、セッション名の指定なしで再開**できます。従来は再開対象を名前で特定する必要がありましたが、「さっきのセッションの続き」という最頻出ケースが1コマンドになりました。

### v2.1.232（2026-08-14頃）での安定化

| 改善 | 内容 |
|------|------|
| **自動再接続の強化** | ネットワーク断の後、**約30分間は再接続を試行**し続ける（従来は断続的な複数回の切断でドロップしていた） |
| セッションの再アタッチ | Desktop / IDE から開始した Remote Control セッションが、ローカルセッションの resume ごとに新しい claude.ai セッションとして増殖する問題を修正（既存セッションへ再アタッチ） |
| 状態の明示 | 別デバイスによる引き継ぎ・別アプリからの終了・削除を端末上で明示し、無効な再接続の提案をやめた |
| 取り合いの防止 | 会話の resume が、同一マシン上で Remote Control を保持している別の Claude Code から黙って奪わなくなった（移すには相手側で `/remote-control` を実行） |
| `ListAgents` の表示改善（v2.1.229） | 切断中の Remote Control セッションを `offline`、クラウドセッションを `cloud` と表示 |

> **注記**: 本記事の主題である「Cowork 経由起動時の OAuth トークン問題」（`CLAUDE_CODE_OAUTH_TOKEN` の継承による Remote Control 不可）と、その回避策（環境変数を除去して起動）は、2026年8月時点でも有効な Tips として残しています。

## 【2026-08-25 追記】Remote Control が正式版に — スマホの「デバイスカード」からセッション開始

Week 34（2026-08-17〜21 PT）のアップデートで、**Remote Control が research preview を卒業して正式版**になりました。同時に、起動フローが「マシン側で起動 → スマホで探す」から「**スマホから直接始める**」方向へ進化しています。

### デバイスカード — スマホからそのマシンでセッションを開始

`claude remote-control` を実行中のマシンは、**Claude モバイルアプリの Code タブ最上部に「デバイスカード」として表示**されるようになりました。

```bash
claude remote-control
```

1. 到達したいマシンで Remote Control を起動しておく
2. スマホで Claude アプリの Code タブを開くと、そのマシンがデバイスカードとして現れる
3. カードをタップ → **ディレクトリを選択** → そのマシン上で新しいセッションを開始

従来の「PC 側で開始済みのセッションにスマホから合流する」使い方に加えて、**外出先からスマホだけで自宅 PC 上の新規セッションを立ち上げる**運用が可能になりました。

### あわせて入った関連改善（Week 34）

- スマホや claude.ai/code から **effort レベルを変更すると、マシン上のセッションに反映**される
- Desktop / VS Code がホストする Remote Control セッションでは、接続中のデバイスに**現在の permission mode が表示**される

参考: [What's new in Claude Code — Week 34（公式）](https://code.claude.com/docs/en/whats-new/2026-w34) / [Remote Control ドキュメント](https://code.claude.com/docs/en/remote-control)

## 【2026-08-28 追記】v2.1.251 — フォアグラウンド部分エージェントのツール呼び出しをライブ配信

**Claude Code v2.1.251** で、Remote Controlクライアント（スマホ・claude.ai/code等）への情報配信が拡充されました。

- **フォアグラウンドの部分エージェント（subagent）が実行中のツール呼び出し・結果が、Remote Controlクライアントへリアルタイムに配信**されるようになりました。従来はメインセッションの動きしか見えませんでしたが、フォアグラウンドで動くサブエージェントの詳細な進捗もスマホ側から追えます。
- **バックグラウンドのサブエージェントは引き続きステータスのみ表示**（「実行中」「完了」等）で、詳細なツール呼び出しはライブ配信されません。フォアグラウンド／バックグラウンドで情報量に差がある点に注意してください。

出典: [Claude Code CHANGELOG（v2.1.251）](https://raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md)
