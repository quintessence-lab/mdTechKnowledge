---
title: "Claude Code バージョン履歴まとめ"
date: 2026-04-01
category: "Claude技術解説"
tags: ["Claude Code", "バージョン履歴", "リリースノート", "アップデート"]
excerpt: "Claude Code 2.0〜2.1系の主要バージョンを一覧整理。スキル統合・Worktree隔離・Agent Teams・1Mコンテキストなど主要マイルストーンを解説。"
draft: false
---

**最終更新**: 2026-03-30
**現在の最新バージョン**: 2.1.86

---

## 主要マイルストーン一覧

| バージョン | 主な機能追加 |
|-----------|------------|
| **2.1.0** | スキル統合、Vim 拡張、Plan モード、Agent Teams 基盤 |
| **2.1.32** | Claude Opus 4.6、自動メモリ、Agent Teams マルチエージェント |
| **2.1.49** | Worktree 隔離、--worktree フラグ |
| **2.1.59** | 自動メモリ保存、/copy コマンド |
| **2.1.71** | /loop コマンド、Cron スケジューリング |
| **2.1.75** | Opus 4.6 で 1M コンテキスト ウィンドウ |
| **2.1.84** | Windows PowerShell ツール（プレビュー） |
| **2.0.60** | バックグラウンド エージェント サポート |
| **2.0.64** | エージェント async 実行、Named sessions（/rename） |
| **2.0.72** | Claude in Chrome ベータ |
| **2.0.74** | LSP（Language Server Protocol）ツール |

---

## バージョン別詳細（新しい順）

### 2.1.86（最新）
- `X-Claude-Code-Session-Id` ヘッダー追加
- `.jj` と `.sl` を VCS 除外リストに追加
- ファイル操作のアウト・オブ・メモリ クラッシュ修正
- Terminal 設定ファイルの不要な書き込み削除
- ファイル読み込み時の JSON エスケープ不要化によるトークン削減

### 2.1.85
- 条件付きフック `if` フィールド追加
- MCP OAuth RFC 9728 サポート
- ToolSearch の改善
- Pre/PostToolUse フック強化

### 2.1.84
- **PowerShell ツール追加**（Windows オプトイン プレビュー）
- TaskCreated フック追加
- WorktreeCreate HTTP サポート
- MCP ツール説明 2KB 上限
- Prompt キャッシュ最適化

### 2.1.83
- **Transcript 検索機能追加**
- `managed-settings.d/` ドロップイン ディレクトリ
- CwdChanged / FileChanged フック イベント追加

### 2.1.81
- `--bare` フラグ追加
- `--channels` 権限リレー
- Remote Control セッション管理
- OAuth マルチセッション同時リフレッシュ問題修正

### 2.1.80
- `rate_limits` フィールド（statusline スクリプト向け）
- MCP OAuth Client ID Metadata Document
- 並列ツール結果の復元

### 2.1.79
- `--console` フラグ（Anthropic Console 認証）
- トライアル リモート セッション管理

### 2.1.78
- **レスポンス テキストの行ごとストリーミング**
- StopFailure フック イベント追加
- `${CLAUDE_PLUGIN_DATA}` プラグイン永続状態

### 2.1.77
- **Opus 4.6 のデフォルト最大出力トークン 64k に拡張**
- Sandbox ファイルシステム `allowRead` 設定
- `/copy N` インデックス付きコピー

### 2.1.76
- **MCP Elicitation サポート**（フォーム入力ダイアログ）
- `isolation: worktree` エージェント サポート
- PostCompact フック
- `/effort` コマンド追加

### 2.1.75
- **Opus 4.6 で 1M コンテキスト ウィンドウがデフォルト**
- `/color` コマンド（プロンプトバー色変更）
- メモリ ファイル最終更新タイムスタンプ

### 2.1.74
- `/context` アクション提案
- `autoMemoryDirectory` 設定
- Streaming API メモリ リーク修正

### 2.1.73
- `modelOverrides` 設定（カスタム プロバイダー マッピング）
- 複雑な bash コマンド フリーズ修正

### 2.1.72
- `/copy` ファイル書き込み機能（`w` キー）
- ExitWorktree ツール
- エフォート レベル簡略化（low/medium/high）

### 2.1.71
- **/loop コマンド追加**（定期実行）
- **Cron スケジューリング ツール**
- voice:pushToTalk キーバインディング

### 2.1.69
- **/claude-api スキル追加**
- **エージェント チーム サポート拡大**
- Voice STT 10 言語追加（合計 20 言語対応）

### 2.1.68
- **Opus 4.6 が中程度エフォートのデフォルトモデルに**
- **Ultrathink キーワード再導入**
- Opus 4 / 4.1 削除

### 2.1.63
- `/simplify` `/batch` コマンド追加
- HTTP フック サポート
- MCP ツール自動ディスカバリー（deferred loading）
- Claude.ai コネクター統合

### 2.1.59
- **Claude 自動メモリ保存機能**
- **/copy コマンド追加**（対話型コード選択）
- `/memory` コマンド追加

### 2.1.50〜2.1.52
- **WorktreeCreate / WorktreeRemove フック**
- Worktree セッション メモリ リーク修正
- Task 管理システム進化

### 2.1.49
- **--worktree フラグ追加**
- **Subagent `isolation: worktree` サポート**
- バックグラウンド エージェント強制終了 Ctrl+F

### 2.1.45〜2.1.48
- **Sonnet 4.6 サポート追加**
- Agent Teams teammates 修正
- 自動コンテキスト切り替え

### 2.1.32〜2.1.44
- **Claude Opus 4.6 リリース**
- **自動メモリ機能**
- **Agent Teams マルチエージェント コラボレーション**
- エージェント バックグラウンド実行サポート

### 2.1.30
- **PDF `pages` パラメータ**（ページ範囲指定）
- `/debug` コマンド
- MCP OAuth 事前設定クライアント認証

### 2.1.27
- `--from-pr` フラグ（PR からセッション開始）
- PR 自動リンク
- Git 統合強化

### 2.1.20〜2.1.22
- PR レビュー ステータス インジケーター
- Arrow キー Vim NORMAL モード対応
- Task 削除機能
- 構造化出力 非インタラクティブ モード

### 2.1.19
- **Task 管理システム新規追加**
- `$0`、`$1` ショートハンド引数
- Agent メモリ フロントマター

### 2.1.16〜2.1.18
- **新しい Task 管理システム**（依存関係追跡）
- **カスタマイズ可能なキーバインディング**
- React Compiler 最適化

### 2.1.14〜2.1.15
- Bash コマンド履歴ベース オートコンプリート
- プラグイン内検索
- npm インストール廃止通知

### 2.1.9
- MCP ツール検索 `auto:N` 閾値設定
- `plansDirectory` 設定
- PreToolUse フック `additionalContext`

### 2.1.7
- Wildcard パーミッション ルール セキュリティ修正
- MCP ツール検索 `auto` デフォルト有効化
- Tool 結果 50K 文字のディスク永続化

### 2.1.3〜2.1.5
- **スキルとスラッシュ コマンドの統合**
- バックグラウンド タスク無効化 環境変数
- Tool hook 実行タイムアウト 60s → 10分に延長
- `CLAUDE_CODE_TMPDIR` 環境変数

### 2.1.2
- **Bash コマンド インジェクション セキュリティ修正**
- Tree-sitter メモリ リーク修正
- Winget インストール サポート

### 2.1.0（メジャー リリース）
大幅な機能拡張を含むメジャー バージョン。

**主要な新機能：**
- **スキル自動ホット リロード**
- **スラッシュ コマンドと Skill の統合**
- **Vim モーション大幅拡張**（テキスト オブジェクト、オペレーターなど）
- **Plan モード統合**
- **Wildcard Bash パーミッション**（`npm *`、`git * main` など）
- **Agent Teams マルチエージェント基盤**
- `/teleport`、`/remote-env` コマンド追加
- Ctrl+B バックグラウンド化統合

**主要な修正：**
- 敏感データのロギング公開を修正（セキュリティ）
- OAuth トークン マルチセッション同時リフレッシュ修正
- ファイル読み込みエンコーディング修正

---

## 2.0 シリーズ（安定版）

### 2.0.74〜2.0.76
- **LSP（Language Server Protocol）ツール追加**
- Kitty / Alacritty / Zed / Warp ターミナル サポート

### 2.0.72
- **Claude in Chrome ベータ機能**
- ブラウザ制御
- @ mention ファイル提案スピード 3x 改善

### 2.0.70
- Enter キー Prompt 提案受け入れ
- MCP ツール wildcard パーミッション `mcp__server__*`
- メモリ使用量 3x 削減

### 2.0.67
- **Thinking モード（Opus 4.5）デフォルト有効**
- `/permissions` 検索機能
- Enterprise managed settings サポート

### 2.0.65
- Alt+P / Option+P モデル切り替え
- Context window 情報を statusline に表示

### 2.0.62〜2.0.64
- **自動コンパクティング即座化**
- **Named session サポート**（`/rename`）
- エージェント async 実行
- `/stats` ユーザー統計
- `.claude/rules/` メモリ ルール

### 2.0.60
- **バックグラウンド エージェント サポート**
- `--disable-slash-commands` フラグ
- MCP サーバー クイック トグル

### 2.0.59
- `--agent` CLI フラグ
- Agent System Prompt カスタマイズ

---

## カテゴリ別まとめ

### セキュリティ対応
| バージョン | 内容 |
|-----------|------|
| 2.1.7 | Wildcard パーミッション セキュリティ修正 |
| 2.1.2 | Bash コマンド インジェクション修正 |
| 2.1.0 | 敏感データ ロギング公開修正 |

### パフォーマンス改善
| バージョン | 内容 |
|-----------|------|
| 2.1.86 | JSON エスケープ不要化でトークン削減 |
| 2.1.74 | Streaming API メモリ リーク修正 |
| 2.1.29 | Resume パフォーマンス 68% 削減 |
| 2.0.70 | メモリ使用量 3x 削減 |

### Windows 対応
| バージョン | 内容 |
|-----------|------|
| 2.1.84 | PowerShell ツール追加（プレビュー） |
| 2.1.2 | Winget インストール サポート |
| 2.1.0 | テキスト スタイル Windows ミスアライメント修正 |
