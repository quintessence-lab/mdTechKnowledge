---
title: "Claude Code バージョン履歴まとめ"
date: 2026-04-01
updatedDate: 2026-05-05
category: "Claude技術解説"
tags: ["Claude Code", "バージョン履歴", "リリースノート", "アップデート"]
excerpt: "Claude Code v2.0.59〜v2.1.128 のバージョン履歴。/color ランダムセッションカラー・/mcp ツール数表示・--plugin-dir .zip対応・--channels API key認証対応・OTEL_* 継承無効化・MCP workspace予約名・/model ピッカーゲートウェイ対応・claude project purge など主要マイルストーンを解説。"
draft: false
---

**最終更新**: 2026-05-05
**現在の最新バージョン**: 2.1.128

---

## 主要マイルストーン一覧

| バージョン | 主な機能追加 |
|-----------|------------|
| **2.1.128** | `/color` 引数なしでランダムセッションカラー、`/mcp` で接続済サーバーのツール数表示・0ツールで接続したサーバーをフラグ表示、`--plugin-dir` が `.zip` プラグインアーカイブ受付、`--channels` がコンソール（API key）認証で利用可能（マネージド設定 `channelsEnabled: true` 必要）、`/model` ピッカーで Opus 4.7 重複エントリ統合（"Opus" 表示）、サブプロセス（Bash/フック/MCP/LSP）が `OTEL_*` 環境変数を継承しないよう変更、MCP `workspace` 予約サーバー名化、MCP 再接続時のツール名一覧フラッディング解消（サーバープレフィックスで要約）、SDK ホストの Bash 許可プロンプトに localSettings 永続化サジェスト、`EnterWorktree` が local HEAD からブランチ作成（origin/<default> ではなく未push commit を保持）、auto モード分類器エラー時のヒント追加（リトライ/`/compact`/`--debug`）、多数のバグ修正（フォーカスモード暗転・OSC 9通知・Remote Control・>10MB stdin・MCP 画像取りこぼし・vim NORMAL モード Space・OSC 9;4 進捗ちらつき 等）、headless `--output-format stream-json` の `init.plugin_errors` に `--plugin-dir` 失敗を含める（v2.1.127 はスキップ番号） |
| **2.1.126** | `/model` ピッカーが `ANTHROPIC_BASE_URL` のゲートウェイ `/v1/models` エンドポイントからモデルを一覧表示、`claude project purge [path]` コマンド追加（`--dry-run`/`-y`/`-i`/`--all` 対応）、`--dangerously-skip-permissions` の対象パス拡張（`.claude/`・`.git/`・`.vscode/`・シェル設定ファイル等のバイパス）、WSL2/SSH/コンテナ環境で `claude auth login` の OAuth コードをターミナル貼付可能に、PowerShell 7（Microsoft Store/MSI/.NETグローバルツール版）プライマリシェル検出、2000px超の画像ペースト時の自動ダウンスケール修正、マネージド設定 `allowManagedDomainsOnly` / `allowManagedReadPathsOnly` が無視される問題を修正（v2.1.124・v2.1.125 はスキップ番号） |
| **2.1.123** | `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` 設定時の OAuth 認証 401 ループを修正 |
| **2.1.122** | `ANTHROPIC_BEDROCK_SERVICE_TIER` 環境変数（`default` / `flex` / `priority`）、PR URL を `/resume` に貼り付けで該当セッション検索（GitHub・GitLab・Bitbucket・GitHub Enterprise 対応）、`/mcp` で同一URLのclaude.aiコネクター併記、OpenTelemetryの `api_request`/`api_error` 数値属性化、`/branch` フォーク `tool_use ids without tool_result` 修正、Vertex AI/Bedrock の `output_config` エラー修正 |
| **2.1.121** | `alwaysLoad` MCP サーバー設定オプション、`claude plugin prune` コマンド、`/skills` タイプフィルター検索、`PostToolUse` フックが全ツールに対応、フルスクリーンスクロール修正、MCP サーバー起動時のトランジエントエラー自動リトライ（最大3回） |
| **2.1.120** | `/ultrareview` の非対話型スクリプト実行モード追加（`claude ultrareview path/to/changes` 形式、`--json` オプション） |
| **2.1.119** | `/config` 設定永続化（project/local/policy 優先順）、`--from-pr` で GitLab/Bitbucket/GitHub Enterprise 対応、`prUrlTemplate` 設定、`PostToolUse` フックに `duration_ms` 追加 |
| **2.1.118** | `/cost` と `/stats` を `/usage` に統合、Vim ビジュアルモード（`v`/`V`）、カスタムテーマ、Hooks から MCP ツール呼び出し（`type: "mcp_tool"`）、`DISABLE_UPDATES` 環境変数 |
| **2.1.117** | フォークサブエージェント（`CLAUDE_CODE_FORK_SUBAGENT=1`）、`--agent` で `mcpServers` ロード、Native macOS/Linux ビルドで Glob/Grep を bfs/ugrep に置換、Pro/Max の Opus/Sonnet 4.6 デフォルト effort を high に |
| **2.1.116** | `/resume` 大幅高速化（40MB+ で最大 67%）、MCP stdio サーバー起動高速化、`/usage` タブで即時表示、`/terminal-setup` でスクロール感度設定 |
| **2.1.115** | エージェントチームメイトのツール要求時のクラッシュ修正 |
| **2.1.114** | エージェントチームメイトのツール要求時のクラッシュ修正 |
| **2.1.113** | CLI がプラットフォーム別ネイティブバイナリを起動、`sandbox.network.deniedDomains` 追加、`/ultrareview` 高速化、Bash 連鎖 `cd <current-directory> && git` で承認不要に |
| **2.1.112** | "claude-opus-4-7 temporarily unavailable" auto モードエラー修正 |
| **2.1.111** | Claude Opus 4.7 xhigh 提供開始、`/effort` 対話型スライダー、`/ultrareview` コマンド、`/less-permission-prompts` スキル、PowerShell ツール拡大、auto モードに `--enable-auto-mode` 不要化 |
| **2.1.110** | `/tui` コマンド・`/focus` コマンド追加、push 通知ツール、`autoScrollEnabled` 設定、`Ctrl+G` 外部エディタにレスポンス含める設定、テレメトリ無効環境でも session recap 有効化 |
| **2.1.109** | 拡張思考インジケータ改善（回転プログレスヒント追加） |
| **2.1.108** | セッション再開 recap 機能、1時間プロンプトキャッシュ TTL オプトイン、`/model` 切替警告、`/resume` ピッカー改善、メモリフットプリント削減 |
| **2.1.105** | EnterWorktree `path` パラメータ、PreCompact フック、プラグインバックグラウンドモニタ、`/proactive` エイリアス、`/doctor` 改善、WebFetch 改善 |
| **2.1.104** | パーミッション制御強化（ブロック済みツールの明示的承認要求）、システムリマインダー簡素化 |
| **2.1.101** | `/team-onboarding` コマンド、OS CA 証明書ストア信頼、LSP コマンドインジェクション修正 |
| **2.1.98** | Vertex AI 対話型セットアップ、Perforce モード、Monitor ツール、Linux サブプロセスサンドボックス |
| **2.1.97** | Focus ビュー（`Ctrl+O`）、ステータスライン `refreshInterval`、NO_FLICKER 大量修正 |
| **2.1.96** | Bedrock Mantle 認証修正（2.1.94 リグレッション） |
| **2.1.94** | Amazon Bedrock Mantle 対応、デフォルト effort を high に変更、Slack MCP 連携改善、CJK テキスト化け修正 |
| **2.1.92** | Bedrock 対話型セットアップ、`/cost` モデル別内訳、`/release-notes` バージョンピッカー、Write ツール高速化 |
| **2.1.91** | MCP ツール結果永続化オーバーライド、プラグイン実行ファイル同梱、トランスクリプトチェーン修正 |
| **2.1.90** | /powerup コマンド、auto モード境界遵守修正、PowerShell セキュリティ強化 |
| **2.1.89** | PreToolUse defer、PermissionDenied フック、CRLF 二重化修正、autocompact ループ修正 |
| **2.1.84** | Windows PowerShell ツール（プレビュー） |
| **2.1.75** | Opus 4.6 で 1M コンテキスト ウィンドウ |
| **2.1.71** | /loop コマンド、Cron スケジューリング |
| **2.1.59** | 自動メモリ保存、/copy コマンド |
| **2.1.49** | Worktree 隔離、--worktree フラグ |
| **2.1.32** | Claude Opus 4.6、自動メモリ、Agent Teams マルチエージェント |
| **2.1.0** | スキル統合、Vim 拡張、Plan モード、Agent Teams 基盤 |
| **2.0.74** | LSP（Language Server Protocol）ツール |
| **2.0.72** | Claude in Chrome ベータ |
| **2.0.64** | エージェント async 実行、Named sessions（/rename） |
| **2.0.60** | バックグラウンド エージェント サポート |

---

## バージョン別詳細（新しい順）

### 2.1.128（最新）
- **`/color` ランダムセッションカラー** — 引数なしで `/color` を実行するとランダムにセッションカラーが選ばれる
- **`/mcp` ツール数表示** — 接続済みサーバーごとのツール数を表示。**0 ツールで接続したサーバーをフラグ警告**
- **`--plugin-dir` の `.zip` 対応** — ディレクトリだけでなく `.zip` プラグインアーカイブも受け付ける
- **`--channels` がコンソール（API key）認証で利用可能** — マネージド設定で `channelsEnabled: true` を有効化する必要あり
- **`/model` ピッカー改善** — Opus 4.7 の重複エントリを統合し、現在の Opus を「Opus 4.7」ではなく「Opus」と表示
- **サブプロセスへの `OTEL_*` 環境変数継承を停止** — Bash / フック / MCP / LSP のサブプロセスが CLI 自身の OTLP エンドポイントを引き継がなくなる
- **MCP `workspace` を予約サーバー名に** — 既存の同名サーバーは警告付きでスキップ
- **MCP 再接続時のツール名フラッディング解消** — 再アナウンスはサーバープレフィックスで要約表示
- **SDK ホストに `localSettings` 永続化サジェスト** — Bash 許可プロンプトで「Always allow」が `.claude/settings.local.json` に書き込まれる
- **`EnterWorktree` が local HEAD ベース** — 仕様通り local HEAD から新規ブランチを作成（旧: `origin/<default>`）。**未 push commit が消える事故を解消**
- **auto モード分類器エラーにヒント追加** — リトライ・`/compact`・`--debug` 実行を案内
- **その他バグ修正多数**:
  - フォーカスモードで前の応答が一瞬暗転する事象修正
  - `/exit` 時に Kitty 等で OSC 9 を通知扱いし「4;0;」が表示される事象修正
  - Remote Control のレート制限時の空メッセージを修正
  - `claude -p` への 10MB 超 stdin パイプでクラッシュループ修正
  - フルスクリーンで折り返し行のリンクが非クリッカブルになる事象修正
  - `/plugin` Components パネルで `--plugin-dir` 経由プラグインが「Marketplace not found」表示される事象修正
  - MCP ツール結果が structured content と content blocks 同時返却時に画像を落とす事象修正
  - リスト内コードブロックのコピペで先頭空白が混入する事象修正
  - `/config` のタブナビゲーションでフォーカスが消える事象修正
  - OSC 8 非対応端末でリンクラベルが消える → `label (url)` 形式に
  - 1Mコンテキストモデルで autocompact ウィンドウより小さい時に「Prompt is too long」誤判定修正
  - 並列シェルツールで読み取り専用コマンド失敗時の兄弟キャンセル修正
  - effort 非対応モデルでバナーに「with X effort」が表示される事象修正
  - `/fast` を 3P プロバイダで実行時に無関係スキルへのファジーマッチを修正
  - Bedrock デフォルトモデルが `global.*` に解決されてしまう事象修正
  - vim NORMAL モードの `Space` がカーソル右移動するよう修正（標準 vi 挙動）
  - 進捗インジケータ（OSC 9;4）がツール呼び出し間で点滅消失する事象修正
  - resume 時の `/rename` 失敗・stale な「remote-control is active」表示・stale `installed_plugins.json` の PATH 汚染を修正
  - MCP stdio サーバーで `CLAUDE_CODE_SHELL_PREFIX` 設定時の引数破損修正
  - サブエージェント要約のキャッシュミス修正（`cache_creation` 約3倍削減）
  - `/plugin update` が npm 由来プラグインの新版を検出しない事象修正
  - サブエージェント要約の連続実行抑止（idle時のトークンコストを抑制）
- **headless `--output-format stream-json`**: `init.plugin_errors` が `--plugin-dir` 読み込み失敗も含むように
- ※ v2.1.127 はスキップ番号

### 2.1.126
- **`/model` ピッカーのゲートウェイ対応** — `ANTHROPIC_BASE_URL` で指定したゲートウェイの `/v1/models` エンドポイントからモデル一覧を取得して表示
- **`claude project purge [path]` コマンド追加** — トランスクリプト・タスク・ファイル履歴・設定エントリを一括削除。`--dry-run`（実行せず確認）、`-y`（確認なし）、`-i`（対話）、`--all`（全プロジェクト）に対応
- **`--dangerously-skip-permissions` の対象パス拡張** — `.claude/`・`.git/`・`.vscode/`・シェル設定ファイル等の保護パスへの書き込みプロンプトもバイパスされるよう拡張
- **OAuth コードのターミナル貼付対応** — WSL2 / SSH / コンテナ環境で `claude auth login` の OAuth コードをターミナルに直接貼り付け可能に
- **PowerShell 7 プライマリ検出** — Microsoft Store / MSI / .NET グローバルツール版の PowerShell 7 をプライマリシェルとして検出・利用
- **画像ペースト自動ダウンスケール修正** — 2000px 超の画像ペースト時に自動でダウンスケールする処理の不具合を修正
- **セキュリティ修正** — マネージド設定の `allowManagedDomainsOnly` / `allowManagedReadPathsOnly` が無視されていた問題を修正
- ※ v2.1.124・v2.1.125 はスキップ番号（内部ビルド）

### 2.1.123
- **OAuth 認証 401 ループの修正** — `CLAUDE_CODE_DISABLE_EXPERIMENTAL_BETAS=1` を設定した状態で OAuth 認証が 401 エラーを繰り返してログインできない問題を修正

### 2.1.122
- **`ANTHROPIC_BEDROCK_SERVICE_TIER` 環境変数追加** — Amazon Bedrock 経由利用時に `default` / `flex` / `priority` のサービス階層を選択可能に
- **PR URL を `/resume` に貼り付けで該当セッション検索** — GitHub・GitHub Enterprise・GitLab・Bitbucket の PR URL に対応し、関連セッションの再開が容易に
- **`/mcp` 表示の改善** — 手動追加した MCP サーバーと同 URL の claude.ai コネクターも併記表示するよう修正
- **OpenTelemetry の数値属性化** — `api_request` / `api_error` の数値属性を文字列ではなく数値型で出力するよう修正
- **`/branch` フォーク失敗の修正** — `tool_use ids were found without tool_result blocks` で失敗していた問題を修正
- **Vertex AI / Bedrock `invalid_request_error: output_config` 修正** — マルチクラウド利用時のエラーを解消

### 2.1.121
- **`alwaysLoad` MCP サーバー設定オプション** — MCP サーバー設定で `alwaysLoad` を指定すると、起動時に常時ロードされる
- **`claude plugin prune` コマンド追加** — 不要・未使用のプラグインを一括削除可能に
- **`/skills` タイプフィルター検索** — スキルをタイプ（種別）でフィルターして検索可能に
- **`PostToolUse` フックが全ツールに対応** — これまで一部ツールのみだった `PostToolUse` フックがすべてのツールで発火するように拡張
- **MCP サーバー起動時のトランジエントエラー自動リトライ** — 起動時の一時的なエラーに対し最大 3 回まで自動でリトライ
- **フルスクリーンスクロール修正** — フルスクリーンモードでのスクロール挙動の不具合を修正

### 2.1.120
- **`/ultrareview` 非対話型スクリプト実行モード追加** — `claude ultrareview path/to/changes` の形式で CLI から直接コードレビューを実行可能に
- **`--json` オプション追加** — `/ultrareview` の結果を JSON 形式で出力できるようになり、CI/CD パイプラインや外部ツールとの連携が容易に

### 2.1.119
- **`/config` 設定の永続化** — `~/.claude/settings.json` に保存、project/local/policy の優先順で上書き
- **`prUrlTemplate` 設定** — カスタム コードレビュー URL を定義可能
- **`CLAUDE_CODE_HIDE_CWD` 環境変数** — 起動ロゴでの作業ディレクトリ表示を抑制
- **`--from-pr` 拡張** — GitLab マージリクエスト・Bitbucket プルリクエスト・GitHub Enterprise PR の URL を受付
- **`--print` モードのフロントマター尊重** — エージェントの `tools:` / `disallowedTools:` を反映
- **`--agent <name>` の `permissionMode`** — 組み込みエージェントの定義を尊重
- **PowerShell ツールの自動承認対応** — permission モードで auto-approve 可能に
- **`PostToolUse` / `PostToolUseFailure` フックに `duration_ms` 追加** — ツール実行時間を取得可能
- **サブエージェント / SDK MCP サーバーの並列再構成** — 接続を並列化
- **プラグイン依存解決の改善** — 別プラグインのバージョン制約で固定された場合、最も高い満たすタグへ自動更新
- **OpenTelemetry 拡張** — `tool_result` / `tool_decision` イベントに `tool_use_id` を含める
- **ステータスライン拡張** — stdin JSON に `effort.level` と `thinking.enabled` を追加
- **セキュリティ強化** — `blockedMarketplaces` の `hostPattern` / `pathPattern` 適用を修正
- **バグ修正多数** — CRLF 貼り付けで余分な空行が挿入される問題、kitty キーボードプロトコルで複数行貼り付けが改行を失う問題、Bash ツールが拒否されると Glob/Grep ツールも消える問題、フルスクリーンで上スクロールが下に戻る問題、MCP HTTP の非 JSON 応答での OAuth エラー、Rewind オーバーレイで画像添付が "(no prompt)" 表示、auto モードが plan モードを上書きする問題、`PostToolUse` 非同期フックが空トランスクリプトエントリを生成する問題、Vertex AI でツール検索デフォルト無効化（`ENABLE_TOOL_SEARCH` でオプトイン）、`@`-file タブ補完がプロンプト全体を置き換える問題、macOS Terminal.app 起動時のゴミ文字 `p` 表示、MCP ヘッダーの `${ENV_VAR}` プレースホルダー未置換、MCP OAuth トークン交換時のクライアントシークレット未送信、`/skills` Enter キーがダイアログを閉じてしまう問題、`/agents` 詳細ビューで利用不可ツールが "Unrecognized" と誤表示される問題、Windows でプラグイン MCP サーバーが起動しない問題、`/export` の実セッションモデル表示、verbose 出力設定の永続化、`/usage` プログレスバーのラベル重なり、プラグイン MCP の `${user_config.*}` 任意フィールド参照、`/plan` 既存プラン未反映、`/reload-plugins` / `/doctor` の無効プラグインへのエラー報告、`isolation: "worktree"` のサブエージェントが古い worktree を再利用する問題等を修正

### 2.1.118
- **Vim ビジュアルモード追加** — `v` でビジュアル、`V` でビジュアルラインモード
- **`/cost` と `/stats` を `/usage` に統合**
- **カスタムテーマ** — `/theme` から作成・切替、または `~/.claude/themes/` で JSON 編集
- **Hooks から MCP ツール呼び出し** — `type: "mcp_tool"` で MCP ツールを直接実行
- **`DISABLE_UPDATES` 環境変数** — 全ての更新パスをブロック
- **WSL 設定継承** — `wslInheritsWindowsSettings` で Windows 側のマネージド設定を WSL に継承
- **auto モード `"$defaults"`** — allow / deny / environment にデフォルトを含める指定
- **「Don't ask again」オプション** — auto モード opt-in プロンプトに追加
- **`claude plugin tag`** — リリース git タグ作成（バージョン検証付き）
- **`--continue`/`--resume` の `/add-dir` 対応** — 追加ディレクトリ含むセッションを検索
- **`/color` で claude.ai 同期** — Remote Control 接続時にアクセントカラーを同期
- **`/model` ピッカーの環境変数尊重** — `ANTHROPIC_DEFAULT_*_MODEL_NAME` / `_DESCRIPTION` を反映
- **バグ修正多数** — `/mcp` メニューで `headersHelper` サーバーの OAuth アクション非表示、MCP OAuth トークンの `expires_in` 欠落による毎時再認証、MCP step-up authorization のサイレント更新、MCP OAuth リフレッシュ競合、macOS キーチェーン同時更新の競合、事前失効トークンでのリフレッシュ失敗、Linux/Windows での `~/.claude/.credentials.json` 破損クラッシュ、`CLAUDE_CODE_OAUTH_TOKEN` 環境変数下で `/login` が効かない問題、エージェントタイプフックが非 Stop イベントで失敗する問題、`prompt` フックがエージェントフック検証サブエージェント呼び出しで再発火する問題、`/fork` がフォークごとに親をディスク書き込み、Alt キーコンボでキー入力フリーズ、Remote Control がローカル `model` 設定を上書き、Remote Control セッションが一時的 JWT 更新でアーカイブ等を修正

### 2.1.117
- **フォークサブエージェント外部ビルド有効化** — `CLAUDE_CODE_FORK_SUBAGENT=1` で利用可能
- **エージェントフロントマター `mcpServers` ロード** — `--agent` 経由のメインスレッドセッションで適用
- **`/model` 選択の永続化** — プロジェクトピンに関わらず再起動後も維持
- **`/resume` の大規模セッション要約提案** — 古い大規模セッションの再読み込み前に要約を提示
- **起動高速化** — ローカル / claude.ai MCP サーバー接続を並列化
- **`plugin install` の依存自動補完** — 既存プラグインへの不足依存をインストール
- **マーケットプレイス追加時の依存自動解決** — `claude plugin marketplace add` で実施
- **`cleanupPeriodDays` の対象拡張** — `tasks/` / `shell-snapshots/` / `backups/` も保持期間スイープ対象に
- **OpenTelemetry 拡張** — `user_prompt` に `command_name` / `command_source` 追加
- **Native macOS/Linux ビルド** — Bash 経由で `Glob` / `Grep` を `bfs` / `ugrep` に置き換え
- **Windows 起動高速化** — `where.exe` ルックアップをキャッシュ
- **Pro/Max の Opus/Sonnet 4.6 デフォルト effort を `high` に**
- **バグ修正多数** — Plain-CLI OAuth セッションがトークン期限切れで死ぬ問題（reactive refresh に変更）、`WebFetch` の大規模 HTML ページでのハング、プロキシの HTTP 204 でのクラッシュ、`CLAUDE_CODE_OAUTH_TOKEN` 期限切れ時の `/login` が効かない問題、`Ctrl+_` プロンプト undo の無反応、Bun 下のリモート API リクエストで `NO_PROXY` 無視、低速接続でのエスケープ / リターン誤作動、SDK `reload_plugins` の直列接続、Bedrock application-inference-profile での thinking 無効時 400 エラー、MCP `elicitation/create` の print/SDK モード自動キャンセル、サブエージェント別モデルでのファイルマルウェア警告、バックグラウンドタスクでの idle 再描画ループ、Opus 4.7 `/context` 膨張・早期 autocompact（1M コンテキスト）等を修正

### 2.1.116
- **`/resume` 大幅高速化** — 大規模セッション（40MB+）で最大 67% 高速化
- **MCP 起動高速化** — stdio サーバーで `resources/templates/list` を遅延化
- **フルスクリーンスクロール改善** — `/terminal-setup` でスクロール感度を設定可能
- **思考スピナーのインライン進捗表示** — "still thinking" / "almost done" を表示
- **`/config` 検索のオプション値マッチ** — 例: "vim" で Editor mode を発見
- **`/doctor` を応答中に開ける**
- **`/reload-plugins` とバックグラウンド自動更新で不足依存を自動インストール**
- **Bash ツールの GitHub API レート制限ヒント** — `gh` がレート制限に達するとヒントを表示
- **`/usage` タブの即時 5 時間 / 週次表示**
- **エージェントフロントマター `hooks:`** — `--agent` 実行時にフック発火
- **セキュリティ強化** — サンドボックス auto-allow が dangerous-path チェックをバイパスする問題を修正
- **配布元変更** — `https://downloads.claude.ai/claude-code-releases` に
- **バグ修正多数** — Devanagari/Indic スクリプトの列整列の崩れ、Kitty プロトコル端末での `Ctrl+-` undo 不発火、`Cmd+Left/Right` の行境界ジャンプ、`Ctrl+Z` のラッパープロセス（npx, bun run）経由ハング、インラインモードでのスクロールバック重複、低背端末での検索モーダルオーバーフロー、VS Code 統合ターミナルの空白セル、API 400 cache control TTL 順序エラー、`/branch` の 50MB 超トランスクリプト拒否、`/resume` の大ファイル空表示、`/plugin` Installed タブの重複表示、worktree 進入後の `/update` と `/tui` 等を修正

#### 4月23日 Anthropic 公式ポストモーテム
4月20日前後にユーザーから報告されていた Claude の応答品質低下について、4月23日に Anthropic 公式エンジニアリングブログでポストモーテムが公開されました。原因として以下の3つのバグが特定されたと報告されています。

1. **デフォルト推論努力（reasoning effort）が high → medium に意図せず変更** — 内部設定変更により、本来 high であるべき推論努力レベルが medium にダウングレードされていた
2. **キャッシュクリアバグ** — プロンプトキャッシュのクリア処理に不具合があり、想定外の挙動を引き起こしていた
3. **詳細度プロンプト変更** — 応答の詳細度（verbosity）に関するプロンプト変更が、出力品質に影響を与えていた

Anthropic は影響を受けた全利用者に対し、利用制限（rate limit）リセットを実施しました。

参考リンク: [https://www.anthropic.com/engineering/april-23-postmortem](https://www.anthropic.com/engineering/april-23-postmortem)

### 2.1.115
- **クラッシュ修正** — エージェントチームメイトのツール要求時の権限ダイアログクラッシュを修正

### 2.1.114
- **クラッシュ修正** — エージェントチームメイトのツールアクセス要求時の権限ダイアログクラッシュを修正

### 2.1.113
- **CLI ネイティブバイナリ起動** — プラットフォーム別ネイティブ Claude Code バイナリを optional dependency として配布
- **`sandbox.network.deniedDomains` 追加** — 特定ドメインをブロック可能
- **フルスクリーン拡張** — `Shift+↑/↓` で選択を端を超えて拡張する際スクロール
- **マルチライン入力改善** — `Ctrl+A` / `Ctrl+E` で論理行の先頭 / 末尾へ移動
- **Windows `Ctrl+Backspace`** — 前の単語を削除
- **長 URL のクリック可能化** — 折り返し時も OSC 8 ハイパーリンク維持
- **`/loop` 制御** — Esc で待機中の wakeup をキャンセル、"Claude resuming /loop wakeup" 表示
- **`/extra-usage` の Remote Control 対応**
- **Remote Control クライアントの `@`-file 自動補完取得**
- **`/ultrareview` 高速化** — 並列チェック・diffstat・アニメーション
- **サブエージェントストール検知** — 10 分超のストールで明確なエラーを返す
- **Bash 複数行コメント表示** — 1 行目に複数行コメントがある場合トランスクリプトに全文表示
- **連鎖コマンドの承認不要化** — `cd <current-directory> && git ...` で再プロンプトしない
- **セキュリティ強化** — macOS の `/private/{etc,var,tmp,home}` を危険指定、`env` / `sudo` / `watch` / `ionice` / `setsid` ラッパー検知、`Bash(find:*)` の `-exec` / `-delete` 自動承認停止
- **バグ修正多数** — MCP タイムアウト処理で別呼び出しがタイムアウトを解除する問題、`Cmd-backspace` / `Ctrl+U` の削除方向、インラインコードのパイプによるマークダウンテーブル崩れ、サブエージェント表示中に入力したメッセージの非表示・誤帰属、`dangerouslyDisableSandbox` の権限プロンプトバイパス、`/effort auto` 確認メッセージ、絵文字の "copied N chars" 過剰カウント、Windows での `/insights` `EBUSY` クラッシュ、`CLAUDE_CODE_EXTRA_BODY` effort 400 エラー、`NO_COLOR` でのプロンプトカーソル消失、`ToolSearch` ランキング、再開長コンテキストの compacting 失敗、`plugin install` バージョン競合報告、SDK 画像処理クラッシュ、Remote Control サブエージェントトランスクリプトストリーミング、Opus 4.7 `thinking.type.enabled` 400 エラー等を修正

### 2.1.112
- **クリティカル修正** — auto モードでの "claude-opus-4-7 temporarily unavailable" エラーを修正

### 2.1.111
- **Claude Opus 4.7 xhigh 提供開始** — `/effort` から利用可能
- **Opus 4.7 で auto モード提供** — Max サブスクライバー向け
- **`xhigh` effort レベル追加** — `high` と `max` の間に位置
- **`/effort` 対話型スライダー** — 矢印キーで選択
- **「Auto (match terminal)」テーマオプション** — 端末のモードに合わせる
- **`/less-permission-prompts` スキル** — トランスクリプトをスキャンして許可リスト提案
- **`/ultrareview` コマンド** — 並列マルチエージェントによるコードレビュー
- **auto モードの利用要件緩和** — `--enable-auto-mode` 不要に
- **PowerShell ツール展開** — Windows でロールアウト（`CLAUDE_CODE_USE_POWERSHELL_TOOL` で制御）、Linux/macOS では `=1` で有効化
- **読み取り専用 Bash 改善** — グロブ・安全な `cd && ...` で承認プロンプトを表示しない
- **タイポ補正** — 最も近いサブコマンドを提案（例: `udpate` → `update`）
- **プランファイル名にプロンプト由来の文字列** — 例: `fix-auth-race-snug-otter.md`
- **`/setup-vertex` / `/setup-bedrock` 改善** — パス表示・モデルシード
- **`/skills` トークン数ソート** — `t` キーで切替
- **入力バッファ操作** — `Ctrl+U` でクリア、`Ctrl+Y` で復元
- **`Ctrl+L`** — 全画面再描画＋プロンプトクリア
- **トランスクリプトフッター** — `[`（dump）と `v`（editor）ショートカット表示
- **headless `--output-format stream-json`** — `plugin_errors` を含める
- **`OTEL_LOG_RAW_API_BODIES` 環境変数追加** — デバッグ用
- **v2.1.110 の非ストリーミングフォールバックリトライ上限を取り消し**
- **バグ修正多数** — iTerm2 + tmux のターミナルティアリング、`@` 補完のプロジェクト全再スキャン、編集後の LSP 診断遅延表示、`/context` 余分な空行、`/clear` でのセッション名喪失、プラグインエラーハンドリング改善、Claude が存在しない `commit` スキルを呼ぶ問題、誤った "GitHub API rate limit" ヒント、`CLAUDE_ENV_FILE` がコメント行で終わる問題、Windows での `CLAUDE_ENV_FILE` 適用とパスケース正規化等を修正

### 2.1.110
- **`/tui` コマンドと `tui` 設定** — `/tui fullscreen` で同セッションのまま flicker-free レンダリングへ切替
- **プッシュ通知ツール** — Remote Control + 「Push when Claude decides」設定有効時、Claude がモバイル通知を送信可能
- **`Ctrl+O` の動作変更** — normal と verbose トランスクリプト切替のみに、focus ビューは新コマンド `/focus` で切替
- **`autoScrollEnabled` 設定追加** — フルスクリーンモードで会話の自動スクロールを無効化可能
- **`Ctrl+G` 外部エディタにレスポンス含める設定** — `/config` から有効化
- **`/plugin` Installed タブ改善** — 注意要・お気に入りが上位、無効項目は折りたたみ、`f` でお気に入り
- **`/doctor` のスコープ警告** — 同じ MCP サーバーが複数スコープで異なるエンドポイントの場合警告
- **`--resume` / `--continue` のスケジュールタスク復活** — 期限切れでなければ復元
- **Remote Control 拡張** — `/context` / `/exit` / `/reload-plugins` がモバイル / web から動作
- **Write ツールの IDE 編集通知** — IDE diff で承認前にユーザーが編集した場合モデルに通知
- **Bash ツールタイムアウト適正化** — ドキュメント記載の最大値を強制
- **SDK / headless の分散トレース連携** — `TRACEPARENT` / `TRACESTATE` を環境から読み取り
- **session recap のテレメトリ無効環境対応** — Bedrock / Vertex / Foundry / `DISABLE_TELEMETRY` 環境でも有効化、`/config` または `CLAUDE_CODE_ENABLE_AWAY_SUMMARY=0` でオプトアウト
- **バグ修正多数** — SSE/HTTP 接続中断時の MCP ツール呼び出しハング、API 到達不能時の非ストリーミングフォールバックリトライによる数分ハング、focus モードでの session recap 等のシステム表示欠落、選択中・ツール実行中のフルスクリーン CPU 過負荷、マーケットプレイスエントリが依存を省略した場合の `plugin install` の依存無視、`disable-model-invocation: true` スキルが `/<skill>` mid-message で失敗する問題、`--resume` で実行中・異常終了セッションの最初のプロンプトが `/rename` 名の代わりに表示される問題、マルチツール呼び出しターン中のキューメッセージ二重表示、サブエージェントトランスクリプトを含むセッションディレクトリ全削除、CLI 再起動後（`/tui`、provider セットアップウィザード等）のキー入力ドロップ、macOS Terminal.app 等同期出力非対応端末での起動時表示崩れ、信頼できないファイル名による「Open in editor」のコマンドインジェクション対策、`PermissionRequest` フックの `updatedInput` が `permissions.deny` 規則に再評価されない問題（`setMode:'bypassPermissions'` 更新が `disableBypassPermissionsMode` を尊重）、`PreToolUse` フック `additionalContext` のドロップ、stdio MCP サーバーのゴミ非 JSON 行による切断（v2.1.105 リグレッション）、`CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC` / `CLAUDE_CODE_DISABLE_TERMINAL_TITLE` 設定時の余分な Haiku リクエスト、パイプ（非 TTY）Ink 出力の単一広い行による過大メモリ確保、フルスクリーンモーダルでの `/skills` メニュースクロール、Remote Control セッション期限切れ時のジェネリックエラー、claude.ai からの Remote Control セッション名前変更がローカル CLI に反映されない問題等を修正

### 2.1.109（旧最新）
- **拡張思考インジケータ改善** — 長い操作中に回転するプログレスヒントを表示し、思考中の状態がより分かりやすくなった

### 2.1.108
- **セッション再開 recap 機能** — セッション再開時にコンテキストの要約（recap）を自動提供。`/config` で設定可能、`/recap` で手動実行、`CLAUDE_CODE_ENABLE_AWAY_SUMMARY` 環境変数で強制可能
- **1時間プロンプトキャッシュ TTL** — `ENABLE_PROMPT_CACHING_1H` 環境変数で API キー・Bedrock・Vertex・Foundry で 1 時間キャッシュにオプトイン可能（`FORCE_PROMPT_CACHING_5M` で 5 分 TTL 強制も可能）
- **スラッシュコマンドのスキル経由発見** — モデルが `/init`、`/review`、`/security-review` 等のスラッシュコマンドを Skill ツール経由で発見・実行可能に
- **`/undo` エイリアス** — `/rewind` のエイリアスとして `/undo` を追加
- **`/model` 切替警告** — 会話中のモデル切り替え前に「次の応答は全履歴をキャッシュなしで再読み込み」と警告表示
- **`/resume` ピッカー改善** — 現在のディレクトリのセッションをデフォルト表示（`Ctrl+A` で全プロジェクト表示に切替）
- **メモリフットプリント削減** — ファイル読み込み・編集・シンタックスハイライティングの言語文法をオンデマンド読み込みに変更
- **エラーメッセージ改善** — サーバーレート制限とプラン使用制限を区別、5xx/529 エラーは status.claude.com リンク表示、不明なスラッシュコマンドは最も近い候補を提案
- **verbose インジケータ** — 詳細トランスクリプト表示時に「verbose」インジケータを追加（`Ctrl+O`）
- **プロンプトキャッシュ無効化時の警告** — `DISABLE_PROMPT_CACHING*` 環境変数でキャッシュ無効化されている場合、起動時に警告表示
- **バグ修正多数** — `/login` コードプロンプトでペーストが機能しない問題（v2.1.105 回帰）、テレメトリ無効化時のキャッシュ TTL フォールバック、`language` 設定時の発音区別記号削除問題、Remote Control セッションタイトル上書き問題等を修正
- ※ v2.1.106 は内部ビルド番号としてスキップ（未公開）

### 2.1.105
- **EnterWorktree `path` パラメータ** — 既存リポジトリの worktree に切り替え可能に
- **PreCompact フック** — 終了コード 2 または `{"decision":"block"}` を返して compaction をブロック可能
- **プラグインバックグラウンドモニタ** — トップレベル `monitors` マニフェストキーでセッション開始時またはスキル実行時に自動アーム
- **`/proactive` エイリアス** — `/loop` のエイリアスとして追加
- **API ストリーム停止処理改善** — データなし 5 分後にアボートし、ストリーミングなしで再試行（無期限ハング防止）
- **`/doctor` 改善** — ステータスアイコン付きレイアウト、`f` キーで Claude が報告された問題を修正可能に
- **WebFetch 改善** — 取得ページから `<style>`/`<script>` を削除し、CSS が重いページでもテキストに到達しやすく
- **スキル説明上限引き上げ** — 250 文字から 1,536 文字に拡大、説明が切断されている場合は起動時に警告
- **Worktree クリーンアップ改善** — PR が squash-merge された worktree を適切に削除
- **バグ修正多数** — キューに入れたメッセージの画像ドロップ、長い会話でのプロンプト入力の画面空白、ASCII アート先頭空白の切り詰め、Alt+Enter 改行挿入の回帰（v2.1.100）、stdio MCP サーバーの不正形式出力でのハング、429 レート制限の生 JSON 表示等を修正

### 2.1.104
- **パーミッション制御の強化** — パーミッション設定でブロックされているツール呼び出しについて、自動実行せず明示的なユーザー承認を要求するように変更（意図しない外部アクションの防止）
- **システムリマインダープロンプトの簡素化** — システムリマインダーのバリエーションを 4 種類から 2 種類に削減し、一貫性を向上
- ※ v2.1.102・v2.1.103 は内部ビルド番号としてスキップ（未公開）

### 2.1.101
- **`/team-onboarding` コマンド追加** — ローカルの Claude Code 利用状況からチームメイト向けオンボーディングガイドを自動生成
- **OS CA 証明書ストアをデフォルトで信頼** — エンタープライズ TLS プロキシが追加設定なしで動作（`CLAUDE_CODE_CERT_STORE=bundled` でバンドル CA のみに切替可能）
- **LSP コマンドインジェクション脆弱性修正** — `which` フォールバックでのコマンドインジェクションを修正（セキュリティ）
- `/ultraplan` やリモートセッション機能が Web 側セットアップなしにデフォルトのクラウド環境を自動作成
- brief モードでプレーンテキスト応答時に 1 回リトライするよう改善
- tool-not-available エラーで理由と対処法を説明するよう改善
- レート制限リトライメッセージでどの制限に引っかかったかとリセット時刻を表示
- `claude -p --resume <name>` が `/rename` や `--name` 設定のセッションタイトルを受付
- 長いセッションでの仮想スクローラーメモリリーク修正
- `--resume`/`--continue` で大規模セッションの会話コンテキストが失われる問題を修正
- ハードコードされた 5 分リクエストタイムアウトが `API_TIMEOUT_MS` に関係なく遅いバックエンドを中断する問題を修正
- `--setting-sources` で `user` を含まない場合に 30 日超の会話履歴が削除される問題を修正
- サブエージェントが動的追加された MCP サーバーの MCP ツールを継承しない問題を修正
- `RemoteTrigger` ツールの `run` アクションが空ボディでサーバーに拒否される問題を修正
- Grep ツールの組み込み ripgrep バイナリパスが古くなった場合に ENOENT → システム `rg` にフォールバック
- `/resume` ピッカーの複数の問題を修正
- `ctrl+]`、`ctrl+\`、`ctrl+^` キーバインドが Terminal.app 等で発火しない問題を修正
- **[VSCode]** チャット入力下のファイル添付がエディタタブクローズ時にクリアされない問題を修正

### 2.1.98
- **Google Vertex AI 対話型セットアップウィザード** — GCP 認証、プロジェクト・リージョン設定、認証情報検証、モデルピニングをガイド
- **`CLAUDE_CODE_PERFORCE_MODE` 環境変数追加** — Edit/Write が読み取り専用ファイルで `p4 edit` ヒント付きエラーを返す
- **Monitor ツール追加** — バックグラウンドスクリプトからのイベントストリーミング用
- **Linux サブプロセスサンドボックス追加** — PID 名前空間分離、セッションごとのスクリプト実行数制限
- **Bash ツール権限バイパス修正** — バックスラッシュエスケープされたフラグが読み取り専用として自動許可される脆弱性を修正（セキュリティ）
- **複合 Bash コマンドの安全チェックバイパス修正**（セキュリティ）
- `/dev/tcp/...` や `/dev/udp/...` へのリダイレクトが自動許可ではなくプロンプト表示に修正
- ストリーミング応答のストール時にフォールバックせずタイムアウトする問題を修正
- 429 リトライが小さな `Retry-After` 値で全試行を約 13 秒で消費する問題を修正（指数バックオフ適用）
- kitty キーボードプロトコル有効時に xterm/VS Code で大文字が小文字に変換される問題を修正
- `/export` が絶対パスや `~` を尊重せず、拡張子を `.txt` に書き換える問題を修正
- MCP HTTP/SSE 接続で約 50MB/時の未解放バッファ蓄積を修正（2.1.97）
- エージェントチームメンバーが `--dangerously-skip-permissions` 使用時にリーダーの権限モードを継承しない問題を修正

### 2.1.97
- **Focus ビュートグル（`Ctrl+O`）追加** — NO_FLICKER モードでプロンプト・1 行ツールサマリー・最終応答を表示
- **ステータスライン `refreshInterval` 設定追加** — N 秒ごとにステータスラインコマンドを再実行
- **Cedar ポリシーファイルのシンタックスハイライト追加**
- CJK 句読点の後でも `/` や `@` 補完がトリガーされるよう改善（日本語入力でスペース不要に）
- コンテキスト残量少警告が永続行ではなく一時フッター通知に変更
- NO_FLICKER モードの大量修正（クラッシュ、メモリリーク、Windows Terminal スクロール、CJK テキストコピー文字化け等）
- `--dangerously-skip-permissions` が保護パスへの書き込み承認後に accept-edits モードにダウングレードされる問題を修正
- auto/bypass-permissions モードでサンドボックスネットワークアクセスプロンプトを自動承認
- Bash ツール権限の env 変数プレフィックスとネットワークリダイレクトチェック強化
- Bedrock SigV4 認証が空文字列設定時に失敗する問題を修正（GitHub Actions）
- ワークツリー分離サブエージェントが作業ディレクトリを親セッションに漏洩する問題を修正

### 2.1.96
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
- **Remote Control セッション名のデフォルトプレフィックス** — ホスト名を使用、`--remote-control-session-name-prefix` で上書き可能
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
| 2.1.101 | LSP バイナリ検出の POSIX `which` コマンドインジェクション修正 |
| 2.1.98 | Bash ツール権限バイパス修正、複合コマンド安全チェックバイパス修正、ネットワークリダイレクト修正 |
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
