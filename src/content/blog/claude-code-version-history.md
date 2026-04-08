---
title: "Claude Code バージョン履歴まとめ"
date: 2026-04-01
updatedDate: 2026-04-08
category: "Claude技術解説"
tags: ["Claude Code", "バージョン履歴", "リリースノート", "アップデート"]
excerpt: "Claude Code 2.0〜2.1系の主要バージョンを一覧整理。Bedrock Mantle対応・スキル統合・Worktree隔離・Agent Teams・1Mコンテキスト・Buddy コンパニオンなど主要マイルストーンを解説。"
draft: false
---

**最終更新**: 2026-04-08
**現在の最新バージョン**: 2.1.96

---

## 主要マイルストーン一覧

| バージョン | 主な機能追加 |
|-----------|------------|
| **2.1.96** | Bedrock Mantle 認証修正（2.1.94 リグレッション） |
| **2.1.94** | Amazon Bedrock Mantle 対応、デフォルト effort を high に変更、Slack MCP 連携改善、CJK テキスト化け修正 |
| **2.1.92** | Bedrock 対話型セットアップ、`/cost` モデル別内訳、`/release-notes` バージョンピッカー、Write ツール高速化 |
| **2.1.91** | MCP ツール結果永続化オーバーライド、プラグイン実行ファイル同梱、トランスクリプトチェーン修正 |
| **2.1.90** | `/powerup` コマンド、auto モード境界遵守修正、PowerShell セキュリティ強化 |
| **2.1.89** | PreToolUse defer、PermissionDenied フック、CRLF 二重化修正、autocompact ループ修正 |
| **2.1.84** | Windows PowerShell ツール（プレビュー） |
| **2.1.75** | Opus 4.6 で 1M コンテキスト ウィンドウ |
| **2.1.71** | `/loop` コマンド、Cron スケジューリング |
| **2.1.59** | 自動メモリ保存、`/copy` コマンド |
| **2.1.49** | Worktree 隔離、--worktree フラグ |
| **2.1.32** | Claude Opus 4.6、自動メモリ、Agent Teams マルチエージェント |
| **2.1.0** | スキル統合、Vim 拡張、Plan モード、Agent Teams 基盤 |
| **2.0.74** | LSP（Language Server Protocol）ツール |
| **2.0.72** | Claude in Chrome ベータ |
| **2.0.64** | エージェント async 実行、Named sessions（`/rename`） |
| **2.0.60** | バックグラウンド エージェント サポート |

---

## バージョン別詳細（新しい順）

### 2.1.96（最新）
- **Bedrock 認証エラー修正** — `AWS_BEARER_TOKEN_BEDROCK` または `CLAUDE_CODE_SKIP_BEDROCK_AUTH` 使用時に `403 "Authorization header is missing"` でリクエストが失敗する問題を修正（2.1.94 でのリグレッション）

### 2.1.94
- **Amazon Bedrock Mantle 対応** — `CLAUDE_CODE_USE_MANTLE=1` を設定することで Mantle 経由の Bedrock を利用可能に
- **デフォルト effort レベル変更** — API キー、Bedrock/Vertex/Foundry、Team、Enterprise ユーザーのデフォルトが「medium」から「high」に変更（`/effort` で制御可能）
- **Slack MCP 連携改善** — send-message ツール呼び出し時にクリック可能なチャンネルリンク付きのコンパクトな `Slacked #channel` ヘッダーを表示
- **プラグインスキル改善** — `"skills": ["./"]` で宣言されたスキルがディレクトリ名ではなくフロントマターの `name` を呼び出し名として使用
- **フック機能追加** — `keep-coding-instructions` フロントマターフィールド対応、`hookSpecificOutput.sessionTitle` で `UserPromptSubmit` フックからセッションタイトル設定可能に
- 429 レート制限で長い `Retry-After` ヘッダー返却時にエージェントがスタックして見える問題を修正
- macOS で Console ログインがキーチェインロック時に無言で失敗する問題を修正（`claude doctor` で診断可能に）
- プラグインスキルの YAML フロントマターで定義されたフックが無視される問題を修正
- 長時間セッションでスクロールバックに同じ diff が繰り返し表示される問題を修正
- **CJK およびマルチバイトテキストが UTF-8 シーケンス分割時に U+FFFD に化ける問題を修正**
- `--resume` が他のワークツリーのセッションを直接再開できるように改善

### 2.1.92
- **`forceRemoteSettingsRefresh` ポリシー設定追加** — CLI 起動時にリモート管理設定の取得完了までブロックし、取得失敗時は終了する fail-closed 方式
- **Bedrock 対話型セットアップウィザード** — ログイン画面で「3rd-party platform」選択時に AWS 認証、リージョン設定、資格情報検証、モデルピン留めをガイド
- **`/cost` のモデル別・キャッシュヒット内訳表示** — サブスクリプションユーザー向けに詳細なコスト内訳を表示
- **`/release-notes` が対話型バージョンピッカーに** — バージョンを選んでリリースノートを確認可能に
- **Remote Control セッション名のデフォルトプレフィックス** — ホスト名を使用（例: `myhost-graceful-unicorn`）、`--remote-control-session-name-prefix` で上書き可能
- **プロンプトキャッシュ期限切れ通知** — Pro ユーザーがセッションに戻った際、次のターンで送信される非キャッシュトークン数をフッターに表示
- 大きなファイルに対する Write ツールの diff 計算速度が **60% 向上**（タブ/`&`/`$` を含むファイル）
- tmux ウィンドウ強制終了後にサブエージェント生成が失敗する問題を修正
- 拡張思考が空白のみのテキストブロックを生成した際の API 400 エラー修正
- フルスクリーンモードのスクロールバックで同じメッセージが重複表示される問題を修正
- `/tag` コマンドと `/vim` コマンドを削除（vim モード切替は `/config` → Editor mode から）

### 2.1.91
- **MCP ツール結果の永続化オーバーライド** — `_meta["anthropic/maxResultSizeChars"]` アノテーション（最大 500K）により、DB スキーマ等の大きな結果がトランケーションされずに通過可能に
- **`disableSkillShellExecution` 設定追加** — スキル・カスタムスラッシュコマンド・プラグインコマンドでのインラインシェル実行を無効化
- **ディープリンクでの複数行プロンプト対応** — `claude-cli://open?q=` でエンコードされた改行（`%0A`）が拒否されなくなった
- **プラグインの実行ファイル同梱** — プラグインが `bin/` 以下に実行ファイルを配置し、Bash ツールからベアコマンドとして呼び出し可能に
- `--resume` 時に非同期トランスクリプト書き込み失敗で会話履歴が失われる可能性のあるトランスクリプトチェーン断絶を修正
- iTerm2、kitty、WezTerm、Ghostty、Windows Terminal で `cmd+delete` が行頭まで削除しない問題を修正
- Edit ツールがより短い `old_string` アンカーを使用し、出力トークンを削減

### 2.1.90
- `/powerup` コマンド追加 — アニメーション デモ付きのインタラクティブ レッスンで Claude Code の機能を学習
- `CLAUDE_CODE_PLUGIN_KEEP_MARKETPLACE_ON_FAILURE` 環境変数追加（オフライン環境向け）
- `.husky` を保護ディレクトリに追加（acceptEdits モード）
- **auto モードがユーザーの明示的な境界（「push しないで」等）を無視する問題を修正**
- レート制限ダイアログの無限ループ クラッシュ修正
- `--resume` 時の deferred tools/MCP サーバーでの完全キャッシュ ミス修正（v2.1.69 リグレッション）
- PostToolUse format-on-save フック後の連続 Edit/Write エラー修正
- PowerShell セキュリティ強化: 末尾 `&` バイパス、アーカイブ展開 TOCTOU、パース失敗時の deny ルール劣化修正
- `Get-DnsClientCache` と `ipconfig /displaydns` を auto-allow から除外（DNS キャッシュ プライバシー）
- MCP ツール スキーマ キャッシュ最適化、SSE 大規模フレーム線形処理化
- `/resume` プロジェクト セッション並列読み込み改善

### 2.1.89
- `PreToolUse` フックに `"defer"` パーミッション判定追加 — ヘッドレス セッション一時停止対応
- `CLAUDE_CODE_NO_FLICKER=1` 環境変数（alt-screen レンダリング）
- `PermissionDenied` フック追加（`{retry: true}` でリトライ可能）
- 名前付きサブエージェントを `@` メンション候補に追加
- `MCP_CONNECTION_NONBLOCKING=true` で `-p` モード時の MCP 接続待機スキップ
- **`/buddy` コマンド追加**（エイプリルフール イースターエッグ、4月1日以降も動作継続）
  - 入力ボックスの横に ASCII アートの小さな生き物（Companion）を常駐表示
  - 生き物の種類はランダム割り当て（ゴースト、子猫、タコなど）、固有名も自動付与（Cinder, Waffleth 等）
  - コーディング中のイベントに反応して吹き出しでコメント（`post_response` / `addressed` / `pet` トリガー）
  - `"companionEnabled": true/false`（settings.json）で有効・無効切り替え可能
  - Bedrock 環境では動作しない制限あり、吹き出しは英語のみ（多言語対応は未実装）
- **Edit/Write ツールが Windows で CRLF を二重化する問題を修正**
- **CJK/絵文字を含むプロンプト履歴が 4KB 境界でドロップされる問題を修正**
- **Windows Terminal Preview 1.25 で Shift+Enter が送信になる問題を修正**
- **Windows PowerShell 5.1 で stderr プログレス出力が失敗と誤報告される問題を修正**
- `StructuredOutput` スキーマ キャッシュ バグ修正（複数スキーマ時 ≈50% 失敗率）
- 長時間セッションでの大規模 JSON 入力メモリ リーク修正
- autocompact スラッシュ ループ修正（3回連続上限到達でエラー停止）
- ネストされた CLAUDE.md の長セッション再注入修正
- LSP サーバー クラッシュ後のゾンビ状態修正（自動再起動化）
- 1GB 超ファイルへの Edit ツール OOM クラッシュ修正
- **思考サマリーがインタラクティブ セッションでデフォルト非生成に変更**
- `Edit` が `Bash` で閲覧済みファイルに別途 `Read` なしで動作するよう変更

### 2.1.87
- Cowork Dispatch でメッセージが配信されない問題を修正

### 2.1.86
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
| 2.1.90 | PowerShell バイパス・TOCTOU・deny ルール劣化修正、DNS キャッシュ プライバシー |
| 2.1.7 | Wildcard パーミッション セキュリティ修正 |
| 2.1.2 | Bash コマンド インジェクション修正 |
| 2.1.0 | 敏感データ ロギング公開修正 |

### パフォーマンス改善
| バージョン | 内容 |
|-----------|------|
| 2.1.90 | MCP スキーマ キャッシュ最適化、SSE 線形処理化、セッション並列読み込み |
| 2.1.86 | JSON エスケープ不要化でトークン削減 |
| 2.1.74 | Streaming API メモリ リーク修正 |
| 2.1.29 | Resume パフォーマンス 68% 削減 |
| 2.0.70 | メモリ使用量 3x 削減 |

### Windows 対応
| バージョン | 内容 |
|-----------|------|
| 2.1.89 | CRLF 二重化修正、Shift+Enter 修正、PowerShell stderr 誤報告修正 |
| 2.1.84 | PowerShell ツール追加（プレビュー） |
| 2.1.2 | Winget インストール サポート |
| 2.1.0 | テキスト スタイル Windows ミスアライメント修正 |
