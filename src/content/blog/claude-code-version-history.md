---
title: "Claude Code バージョン履歴まとめ"
date: 2026-04-01
updatedDate: 2026-06-10
category: "Claude技術解説"
tags: ["Claude Code", "バージョン履歴", "リリースノート", "アップデート"]
excerpt: "Claude Code v2.0.59〜v2.1.170 のバージョン履歴。Claude Fable 5 へのアクセス追加・`--safe-mode` フラグ（カスタマイズ無効化でトラブルシュート）・`/cd` コマンド（プロンプトキャッシュを壊さない作業ディレクトリ変更）・`disableBundledSkills` 設定・fallbackModel 設定（最大3つのフォールバックモデル）・deny ルールの glob 対応・クロスセッションメッセージング堅牢化・既定思考モデルの thinking 無効化・requiredMinimumVersion/requiredMaximumVersion マネージド設定・/plugin list（--enabled/--disabled フィルタ）・バックグラウンドセッションの自動バージョン更新（コールドリスタート不要）・Dynamic Workflows トリガー語 workflow→ultracode 変更・シェル起動ファイル書き込み前プロンプト・acceptEdits モードでのビルドツール設定ファイル保護・/usage カテゴリ別内訳・allowAllClaudeAiMcps・/simplify→/code-review リネーム・claude agents --json・/resume バックグラウンドセッション対応・plugin パネル最終更新日・/model セッション単位化・plugin dependency enforcement・claude project purge・Agent View Research Preview・/goal コマンド・Plugin Marketplace・/tui・ANTHROPIC_BEDROCK_SERVICE_TIER・PR URL から /resume 検索・worktree.baseRef設定・.claude/skills plugin 自動ロード・Bedrock/Vertex/Foundry での auto mode opt-in など主要マイルストーンを解説。"
draft: false
---

**最終更新**: 2026-06-10
**現在の最新バージョン**: 2.1.170

---

## 主要マイルストーン一覧

| バージョン | 主な機能追加 |
|-----------|------------|
| **2.1.170** | **Claude Fable 5 へのアクセス追加**（Mythos クラスを安全に一般利用可能にしたモデル。2.1.170 へ更新するとアクセス可能になる）、VS Code 統合ターミナル（または Claude Code 環境変数を継承したシェル）から起動したセッションがトランスクリプトを保存せず `--resume` に表示されない問題を修正 |
| **2.1.169** | **`--safe-mode` フラグ / `CLAUDE_CODE_SAFE_MODE`**（カスタマイズを無効化してトラブルシュート）、**`/cd` コマンド**（プロンプトキャッシュを壊さずにセッションの作業ディレクトリを変更）、**`disableBundledSkills` 設定 / `CLAUDE_CODE_DISABLE_BUNDLED_SKILLS`**（バンドルスキルをモデルから隠す）、`claude agents --json` の出力拡張（新フィールド・フィルタ）、`/workflows` がターン中に即座に開く、`TaskCreate` の信頼性向上（自動入力修復）、`CLAUDE.md` 警告閾値がモデルのコンテキストウィンドウに応じてスケール、多数の修正（Up/Down キーが折返し行を飛ばす問題、enterprise MCP ポリシー強制、macOS の claude.ai 認証時 UI ストール、Windows の `claude -p` 遅延、Git Credential Manager 起動時ポップアップ、Remote Control 再接続、フッターヒント非表示、stale な権限/ダイアログプロンプト、ストリーミング中の CPU 使用率削減 等） |
| **2.1.168** | バグ修正・信頼性向上 |
| **2.1.167** | バグ修正・信頼性向上 |
| **2.1.166** | **`fallbackModel` 設定追加**（プライマリモデルが過負荷／利用不可のときに順に試す最大3つのフォールバックモデルを設定。`--fallback-model` が対話セッションにも適用）、**deny ルールのツール名位置で glob パターン対応**（`"*"` で全ツール拒否。allow ルールは非MCPの glob を拒否、deny の未知ツール名は起動時に警告）、**クロスセッションメッセージングの堅牢化**（他 Claude セッションから `SendMessage` で中継されたメッセージはユーザー権限を持たず、受信側は中継された権限要求を拒否・auto モードもブロック）、**`MAX_THINKING_TOKENS=0` / `--thinking disabled` / モデル別 thinking トグルで、既定で思考するモデルの thinking を無効化可能に**（Claude API 経由。3Pプロバイダは不変）、API が想定外の非リトライ可能エラーを返したとき**フォールバックモデルで1回リトライ**（認証・レート制限・リクエストサイズ・トランスポートエラーは即時表面化）、`claude update` がダウンロード前に対象バージョンを通知、`claude agents` のリストにURL入力で該当セッションを絞り込み。多数の修正（画像処理エラーと余分なトークン消費、起動時ワーカー登録中の一時障害でリモートセッションが恒久停止、JetBrains 2026.1+ 端末のちらつき＝同期出力で解消、Kitty キーボードプロトコル端末で Shift+非ASCII が欠落、Windows の PowerShell コマンド検証ハング、macOS で daemon 死後の `claude --bg-pty-host` が100% CPU、voice モードの stale 認証、無効エントリでマネージド設定の残り有効ポリシーが無効化される問題、`allowedMcpServers`/`deniedMcpServers` の `${VAR}` 参照不一致、git worktree に入った背景セッションが再オープンで crash-loop、Ctrl+O トランスクリプトの思考テキスト重複、`/doctor` の矛盾チェック 等） |
| **2.1.165** | バグ修正・信頼性向上 |
| **2.1.163** | **`requiredMinimumVersion` / `requiredMaximumVersion` マネージド設定追加**（バージョンが許可範囲外なら Claude Code が起動を拒否し、承認済みバージョンへ誘導＝組織でのバージョン固定が可能に）、**`/plugin list` コマンド追加**（インストール済みプラグインを一覧表示、`--enabled` / `--disabled` フィルタ付き）、**バックグラウンドセッションが Claude Code 更新後にバックグラウンドで新バージョンへ更新**（更新後にセッションを開いてもコールドリスタート待ちが発生しなくなった）、`/btw` に「`c` でコピー」ショートカット（生 markdown 回答をクリップボードへコピーし貼り付け先で書式維持）、**Stop / SubagentStop フックが `hookSpecificOutput.additionalContext` を返せるように**（フックエラー扱いされずに Claude へフィードバックしてターンを継続）、Skills でコマンド本文の数字直前にリテラル `$` を入れる `\$` エスケープ構文、stdio MCP サーバーが `--resume` 時に hooks/Bash と同じ `CLAUDE_CODE_SESSION_ID` を受け取る、**`claude -p` がバックグラウンドコマンドの未終了で最終結果後に無限ハングする問題を修正**（stdin クローズ後 ~5s で背景シェルを停止）、`claude -p` が Bedrock/Vertex/Foundry で `CI=true`・Anthropic APIキー未設定時に「ANTHROPIC_API_KEY required」で失敗する問題修正、bazel/EDR 保護 Go ワークフローで `$TMPDIR` が全コマンドに上書きされ失敗する問題修正（2.1.154 リグレッション）、Windows で read-only 属性／OneDrive 配下の session-env ディレクトリで「EEXIST」失敗する問題修正、新規 config ディレクトリで起動中にマネージド設定取得が完了すると組織管理権限ルールがセッション全体に適用されない問題修正、agent view を Esc で抜ける際の端末崩れ・数秒ハング修正、フック `if: "Bash(...)"` 条件がサブシェル/バッククォート内のコマンドにもマッチするよう修正、ホームディレクトリパスの deny ルール（例 `Read(~/Desktop/**)`）が `$HOME` 経由参照の Bash をブロックしない問題修正、`/` メニューの組み込みコマンド/スキル説明の明確化など多数 |
| **2.1.162** | **`claude agents --json` に `waitingFor` フィールド追加**（待機中セッションが何でブロックされているか＝例: 権限プロンプト を表示）、**Remote Control が永続フッターのピル表示に**（起動時メッセージから、セッションへのリンク付き常時表示へ変更）、**`/ide` メニュー・`/terminal-setup`・`/scroll-speed` で Windsurf を Devin Desktop に改名**（エディタのリブランドに追随）、`--tools` で Grep/Glob を明示指定するとネイティブビルドで専用検索ツールを提供（従来は無視）、オートコンプリートのスラッシュコマンドはクリックで即実行せずプロンプトに入力（Enterで実行）、`/effort` がデフォルト永続化の確認表示、設定ディレクトリが読み取り専用時の起動ハング修正・WebFetch 許可ルールがプリアプルーブドドメインに効かない問題修正・Windows のバックスラッシュ表記許可ルール不一致修正など多数 |
| **2.1.161** | **`OTEL_RESOURCE_ATTRIBUTES` の値がメトリクスデータポイントのラベルに反映**（team / repo 等のカスタム次元で使用量メトリクスをスライス可能）、**`claude agents` の行が `done/total` を詳細の前に表示**（作業がファンアウトされているとき。peek は最長実行中の項目を表示）、`/mcp` が未サインインの claude.ai コネクタを「Show unused connectors」行に折りたたみ、**並列ツール呼び出しで失敗した Bash が同一バッチの他呼び出しをキャンセルしなくなった**（各ツールが独立して結果を返す）、フルスクリーンで Linux クリップボードが `wl-copy`/`xclip`/`xsel` 対応・PRIMARY セレクションにもコピー、OTel ログイベントが初期化完了前に送出されると無音で破棄される問題修正、`claude mcp` がシークレットを端末出力する問題修正など多数 |
| **2.1.160** | **Dynamic Workflows のトリガー語を `workflow` → `ultracode` に変更**（`workflow` の語では起動しなくなり、自然文での依頼は引き続き有効。トリガー語はプロンプト入力で violet にハイライト）、**シェル起動ファイル（`.zshenv`/`.zlogin`/`.bash_login`）と `~/.config/git/` への書き込み前にプロンプト追加**（意図しないコマンド実行を防止）、**`acceptEdits` モードでコード実行を許す可能性のあるビルドツール設定ファイル（`.npmrc`/`.yarnrc*`/`bunfig.toml`/`.bazelrc`/`.pre-commit-config.yaml`/`.devcontainer/` 等）書き込み前にプロンプト追加**、単一ファイルの `grep`/`egrep`/`fgrep` 後の Edit が別途 Read 不要に、`/effort ultracode` 関連修正、バックグラウンドセッション／エージェント系の多数の修正（計27変更） |
| **2.1.159** | **内部インフラ改善のみ（ユーザー向け変更なし）** |
| **2.1.158** | **Bedrock / Vertex / Foundry 上の Opus 4.7 / 4.8 で auto mode が利用可能に**（`CLAUDE_CODE_ENABLE_AUTO_MODE=1` でオプトイン） |
| **2.1.157** | **`.claude/skills` 配下の plugin を Marketplace 登録なしで自動ロード**＋`claude plugin init <name>` でスケルトン生成、`settings.json` の **`agent` フィールドがディスパッチセッションに反映**（`--agent <name>` で上書き）、`EnterWorktree` がセッション中に Claude 管理 worktree 間を切替、**worktree をエージェント完了時にアンロック**（`git worktree remove`/`prune` で掃除可能）、**ゼロバイト/破損画像でリクエストがクラッシュする問題を修正**、`/config` に「Workflow keyword trigger」設定（"workflow" 語での誤起動を抑止）など多数 |
| **2.1.154** | **Claude Opus 4.8 がデフォルトモデルに昇格** ＋ **Dynamic Workflows（Research Preview、最大1000サブエージェントをファンアウト並列実行）**。`ultracode` 設定（xhigh effort + 自動オーケストレーション）、**Fast mode 価格3倍安化**、リーンシステムプロンプトのデフォルト化、Agent Teams 改善（`! <command>` で背景シェル起動）、macOS 背景エージェントの権限継続、`/model` セッションデフォルト保存 |
| **2.1.153** | GitHub plugin マーケットプレイスに **`skipLfs`** オプション追加（Git LFS ダウンロードをスキップ）、MCP サーバー認証通知の統合（複数の "needs authentication" を1メッセージに集約）、`claude agents` の PR 列表示改善（単一は `PR #N`、複数は `N PRs`） |
| **2.1.152** | **`/code-review --fix`** — レビュー後に reuse / simplification / efficiency 提案をワーキングツリーに適用（旧 `/simplify` は内部的にこれを呼ぶ形へ統合）、Skill フロントマターに **`disallowed-tools`**（スキル活性中に特定ツールを除外）、**`/reload-skills`** コマンド（セッション再起動なしでスキル再スキャン） |
| **2.1.151** | マイナー修正（公式 changelog に詳細記載なし） |
| **2.1.150** | **内部インフラ改善のみ（ユーザー向け変更なし）** — バックエンド最適化・メンテナンス目的のリリース（コミット `39e853e`） |
| **2.1.149** | `/usage` がスキル／サブエージェント／プラグイン／MCP サーバー別の**カテゴリ別内訳**を表示、`/diff` 詳細ビューをキーボードでスクロール、Markdown が GFM タスクリストチェックボックスをレンダリング、エンタープライズ向け **`allowAllClaudeAiMcps`** 設定追加。**セキュリティ修正多数**（PowerShell 権限バイパス、git worktree sandbox allowlist、PWD/OLDPWD/DIRSTACK 変数追跡）、macOS の `find` がファイル/vnode テーブル枯渇させる問題修正 |
| **2.1.148** | v2.1.147 で混入した **Bash ツールが毎回 exit code 127 を返すリグレッション**を緊急修正 |
| **2.1.147** | **`/simplify` を `/code-review` にリネーム** — effort レベル指定 (`/code-review high` 等) で正確性バグを検出、`--comment` で GitHub PR にインラインコメントとして投稿可能。**pin した background sessions がアイドル時も生存維持**＋アップデート時に in-place 再起動。auto-updater にリトライロジック追加、エンタープライズログイン制約強制の不具合修正、コマンド出力で `&` 文字表示不具合修正、プラグインエージェントが Agent type をドロップする問題修正、Windows PowerShell ツール系不具合修正 |
| **2.1.145** | **`claude agents --json`** をスクリプト用に追加、`agent_id` / `parent_agent_id` を OpenTelemetry span に含める、`/plugin` がインストール前に commands/agents/skills/hooks/MCP を表示、フルスクリーンでエージェントパネルがマウス hover/click 対応、MCP prompt コマンドの検証エラー修正、UI フリーズ/トランスクリプト系修正多数 |
| **2.1.144** | **`/resume` バックグラウンドセッション対応** — `claude --bg` や Agent View 経由で起動したバックグラウンドセッションが `/resume` のインタラクティブ一覧に **`bg` タグ付き** で混在表示。バックグラウンド作業の引継ぎが対話セッションと同じ UI で完結。**`/plugin` パネル最終更新日表示** — Marketplace の browse/discover ペインに各プラグインの最終更新日が表示され、メンテ状況を即判断可能。**`/model` セッション単位化** — `/model` は現在のセッションだけにモデル変更を適用するように変更。`d` キーで新規セッション用デフォルトを設定。**他**：背景サブエージェント完了通知の経過時間表示（例 "3h 2m 5s"）、`/extra-usage` → `/usage-credits` リネーム（旧名残存）、`api.anthropic.com` 到達不可時の起動ハング 75s→15s タイムアウト、ターミナル化け修正、MCP/OAuth/バックグラウンドセッション系のバグ修正多数 |
| **2.1.143** | **Plugin dependency enforcement** — プラグイン間の依存関係を宣言的に解決し、不足プラグインの自動インストール／バージョン整合チェック／循環依存検知を行うランタイム強制機構。**`claude project purge` コマンド拡張** — プロジェクト履歴の選択削除（セッション単位・期間指定・パターン指定）を `claude project purge` 配下に統合（v2.1.126 で導入された雛形を本コマンドラインに昇格）。**Projected context cost display**（`/plugin` Marketplace browse の per-turn/per-invocation トークン見積もり）、**worktree.bgIsolation: "none"** 設定（バックグラウンドセッションが worktree を経由せず working copy を直接編集）、**PowerShell -ExecutionPolicy Bypass** デフォルト適用（`CLAUDE_CODE_POWERSHELL_RESPECT_EXECUTION_POLICY=1` で opt-out）、バックグラウンドセッションのアイドル復帰時にモデル/effort を保持 |
| **2.1.140 系** | **Plugin Marketplace 関連変更**（マーケットプレース連携・配布フローの整備）、**`/plugin` コマンド整備**（インストール／削除／一覧／詳細表示）、**`/skills` リアルタイムフィルタ**（タイプしながら絞り込み）、その他 CLI 全般で 13 件の変更 |
| **2.1.139** | **Agent View (Research Preview)** — `claude agents` コマンドまたはセッション内左矢印キー（←）で起動。実行中／入力待ち／完了セッションを一覧表示し、複数バックグラウンドエージェントを横断管理可能（Pro/Max/Team/Enterprise/API 全プラン対応、標準レート制限適用）。**`/goal` コマンド** — 完了条件（goal）を設定すると Claude が自動的にタスクを継続実行 |
| **2.1.138** | `ANTHROPIC_BEDROCK_SERVICE_TIER` 環境変数追加（`default` / `flex` / `priority`）、`/resume` に **PR URL を貼り付けて該当セッションを検索**（GitHub・GitHub Enterprise・GitLab・Bitbucket 対応）、**Remote Control 有効時の「Push when Claude decides」プッシュ通知オプション**（Claude が判断したタイミングで通知）、**`/tui` コマンド追加**（ちらつきなしのフルスクリーン描画）、Bedrock / Vertex / Foundry での 429 エラー修正、MCP **重複コネクタヒント**（同一 URL の claude.ai コネクタ／ローカル定義の重複検知） |
| **2.1.137** | [VSCode] Windows で extension がアクティベーション失敗する問題修正（v2.1.131 と同種の追加修正） |
| **2.1.136** | `CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL` で OTel 経由で品質サーベイ回答を集めるエンタープライズ向けセッション品質サーベイ再有効化、`settings.autoMode.hard_deny` で auto モード分類器の無条件ブロックルール（ユーザー意図や allow 例外に関わらず拒否）、`.mcp.json`/プラグイン/claude.ai コネクター由来の MCP サーバーが VS Code/JetBrains/Agent SDK の `/clear` 後に静かに消える問題修正、並行 credential 書き込みで rotate 直後の OAuth トークンが上書きされ再ログイン強制される稀な login loop 修正、複数 MCP サーバー同時 refresh で OAuth refresh トークンが失われ毎日再認証が必要だった問題修正、ツール呼び出し後の redacted thinking ブロックで extended thinking が API 400 を出す問題修正、プロジェクトパスにアンダースコアを含む `--resume`/`--continue` がセッションを見つけられない問題修正、`Edit(...)` 許可ルールがあっても plan モードがファイル書き込みをブロックしない問題修正、WSL2 で xclip/wl-paste が画像読めない場合に PowerShell フォールバックで Windows クリップボードからの画像ペーストが動作、キャッシュクリーンアップが実行中セッションで使用中のバージョンを削除する問題修正、スラッシュコマンドダイアログのフッターヒント・スペーシング・矢印キースタイル統一、bash 出力と markdown コードブロックでの色位置ずれ修正、`@` ファイルピッカーがセッション中に作成したファイル/100エントリ超ディレクトリで見つからない問題修正、`/usage` 週次リセットが時刻を表示していたのを暦日付表示に修正、CJK 端末でのウェルカムバナー overflow 修正、`/insights` クラッシュ修正、`AskUserQuestion` の multi-select 配列回答が破棄される問題修正、その他 30件超のバグ修正・UI 改善（v2.1.134・v2.1.135 はスキップ番号） |
| **2.1.133** | **`worktree.baseRef` 設定（`fresh` \| `head`）** で `--worktree`/`EnterWorktree`/agent-isolation worktree のベース branch を制御。**注: デフォルトは `fresh` に戻り、`EnterWorktree` のベースは `origin/<default>` に再変更**（v2.1.128 以降は local HEAD だった）。未 push commit を保持したい場合は `worktree.baseRef: "head"` を設定。`sandbox.bwrapPath`/`sandbox.socatPath` マネージド設定（Linux/WSL の bubblewrap/socat バイナリパス指定）、`parentSettingsBehavior` 管理者キー（`'first-wins'`/`'merge'`、SDK `managedSettings` をポリシーマージに参加させる）、フックが effort.level JSON フィールドと `$CLAUDE_EFFORT` 環境変数を受け取れるように・Bash ツールでも参照可、focus モード挙動改善、メモリ圧迫時の warm-spare バックグラウンドワーカー解放によるメモリ使用量改善、refresh トークンレースでの並列セッション全 401 dead-end 修正、`Edit`/`Write` のドライブルート（`C:\`）/POSIX `/` 許可ルールが不正にマッチして毎回プロンプトする問題修正、history/session-log ファイルロック compromise 時の未ハンドル `ECOMPROMISED` rejection 修正、conversation compaction 中の Esc 押下でスプリアス "Error compacting conversation" 通知が出る問題修正、MCP OAuth フロー全体（discovery/dynamic client registration/token exchange/refresh）が `HTTP(S)_PROXY`/`NO_PROXY`/mTLS を尊重するよう修正、`--add-dir`/SDK `additionalDirectories` で渡したマップトネットワークドライブで Read/Write/Edit が拒否される問題修正、claude.ai からの Remote Control stop/interrupt がローカル Esc と同等にキャンセルしない問題修正、`/effort` が他の同時セッションの effort を意図せず変更する問題修正、サブエージェントが project/user/plugin スキルを Skill ツール経由で発見できない問題修正、`claude --help` に `--remote-control` フラグを表示、[VSCode] `claudeCode.claudeProcessWrapper` の "Unsupported platform" 修正 |
| **2.1.132** | `CLAUDE_CODE_SESSION_ID` 環境変数を Bash ツールサブプロセスに追加（hooks の `session_id` と一致）、`CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1` でフルスクリーン代替スクリーンレンダラを無効化（端末ネイティブのスクロールバックに会話を残す）、Ctrl+V 画像ペースト中の "Pasting…" フッターヒント、外部 SIGINT（IDE stop ボタン/`kill -INT`）でグレースフルシャットダウン実行（端末モード復元と `--resume` ヒント表示）、ネイティブビルドでの terminal close/SSH disconnect 中の uncaught exception 修正、tool error truncation で絵文字が壊れた `--resume` の `no low surrogate in string` 失敗修正・既破損セッションは load 時にサニタイズ、plan-mode セッション再開時の `--permission-mode` 無視と `ExitPlanMode` 後の plan-mode 再適用失敗修正、laptop sleep/wake/Ctrl+Z/`fg` 後のフルスクリーン空白画面修正、Indic conjunct/ZWJ 絵文字が行ラップしたときのカーソル mid-grapheme 着地修正、vim オペレータが NFD 分解アクセント文字を破損する問題修正、`/` で始まるテキストペーストが silently swallow される問題修正、bracketed paste と focus event/mouse-tracking が干渉してエスケープシーケンスがプロンプトに混入する問題修正、Cursor/VS Code 1.92-1.104 の上流 xterm.js bug によるマウスホイール過速修正、JetBrains 2025.2 端末のスクロールホイールハンドリング修正、`/usage` Ctrl+S が Linux/X11 でクリップボードコピー時にハングする問題修正、`/terminal-setup` の Windows Terminal 矛盾エラー修正、`/effort` ピッカーが `CLAUDE_CODE_EFFORT_LEVEL` を反映しない問題修正、`/status` のデフォルトモデル誤表示修正、スラッシュコマンド autocomplete が ~3-5 件で頭打ちだったのを端末高に応じてスケール、statusline `context_window` トークン数が累積セッション合計を表示していたのを現在のコンテキスト使用量に修正、Alt+T (思考トグル) が iTerm2/Terminal.app デフォルトで効かない問題修正、`claude agents` 経由でバックグラウンドセッションを再開した後の Windows でのキーボード入力 dead 修正、stdio MCP サーバーが非プロトコルデータを stdout に書くと 10GB+ RSS の無限メモリリーク修正、`tools/list` 失敗の MCP サーバーが silently 0 ツールになる問題を 1 回リトライ＋"connected · tools fetch failed" 表示に変更、Bedrock/Vertex で `ENABLE_PROMPT_CACHING_1H` 設定時の 400 エラー修正 |
| **2.1.131** | VS Code extension が Windows でアクティベーション失敗する問題修正（バンドル SDK のハードコードビルドパス、`createRequire` polyfill bug）、Mantle エンドポイント認証が `x-api-key` ヘッダー欠落で失敗する問題修正 |
| **2.1.129** | `--plugin-url <url>` で `.zip` プラグインを URL から取得（セッション限定）、`CLAUDE_CODE_FORCE_SYNC_OUTPUT=1` で同期出力強制有効化（Emacs `eat` 等）、`CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE` で Homebrew/WinGet インストール時にバックグラウンド自動更新＋再起動プロンプト、プラグインマニフェスト `themes`/`monitors` を `experimental` 配下に移行（旧トップレベルは警告）、ゲートウェイ `/v1/models` モデル探索を `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1` でオプトイン化（v2.1.126〜v2.1.128 は自動だった）、`Ctrl+R` 履歴ピッカーがデフォルトで全プロジェクト検索に復帰（v2.1.124 以前の挙動、`Ctrl+S` で現セッション/プロジェクト絞込）、サードパーティ展開（Bedrock/Vertex/Foundry/`ANTHROPIC_BASE_URL`）でスピナーヒントが Anthropic 一次サーフェスを指さなくなる、`skillOverrides` 設定が機能（`off`/`user-invocable-only`/`name-only`）、`claude_code.pull_request.count` OTel メトリクスが MCP ツール経由 PR/MR もカウント、ポリシー拒否エラーに API Request ID を含める、未認識 400 ステータスで生 JSON が表示される問題修正、`/clear` 後にターミナルタブタイトルがリセットされない問題修正、`/rename` セッションタイトルチップがダイアログ表示時に消える問題修正、サブエージェント実行中にエージェントパネルが隠れる問題修正（v2.1.122 リグレッション）、Ctrl+G 外部エディタで会話履歴が空白化する問題修正、`/context` のレンダ済み ASCII グリッドが会話に流出する問題修正（約 1.6k トークン節約）、`/agents` ライブラリ矢印キー操作のスクロール改善、`/branch` 成功メッセージに `/resume` 用セッション ID 追加、絵文字入り太字ヘッダーの末尾欠け修正、エンタープライズ/チームの `user:inference` スコープ欠落 OAuth クレデンシャルでサーバー管理設定ポリシーが適用されない問題修正、wake-from-sleep 後の OAuth refresh race による全セッションログアウト問題修正、1 時間プロンプトキャッシュ TTL が無音で 5 分にダウングレードされる問題修正、`/clear`/compact 後の `/effort`/`/model` 切替時のキャッシュミス警告誤表示修正、`Bash(mkdir *)` `Bash(touch *)` 等の許可ルールが in-project パスで効かない問題修正、`deniedMcpServers` の `*://` スキームワイルドカードが大文字小文字混在ホスト名にマッチしない問題修正、voice mode の `--debug` で WebSocket 警告がエラーログ化される問題修正、[VSCode] `/clear` が会話コンテキスト・表示中トランスクリプトをクリアしない問題修正 |
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

### 2.1.170（2026-06-09 PT、最新）— **Claude Fable 5 へのアクセス追加**

Mythos クラスを安全に一般利用可能にした新モデル **Claude Fable 5** へのアクセスを追加するリリース。

- **Claude Fable 5 の導入** — Mythos クラスを一般利用向けに安全化したモデルで、「これまで一般提供してきたどのモデルの能力をも上回る」とされる。**2.1.170 へ更新するとアクセス可能**になる（詳細は別シリーズ [Claude Fable 5 徹底解剖](/blog/claude-fable-5-overview/) を参照）
- **バグ修正（セッショントランスクリプト）** — VS Code 統合ターミナル、または Claude Code の環境変数を継承した任意のシェルから起動した際に、セッションがトランスクリプトを保存せず `--resume` に表示されない問題を修正

### 2.1.169（2026-06-08 PT）— **`--safe-mode` / `/cd` コマンド / `disableBundledSkills`**

トラブルシュート用セーフモード、作業ディレクトリ変更コマンド、スキル制御設定を中心とする機能追加＋多数の修正を含むリリース。

- **`--safe-mode` フラグ / `CLAUDE_CODE_SAFE_MODE` 環境変数追加** — カスタマイズ（設定・プラグイン・スキル等）を無効化して起動し、問題の切り分けを容易にする
- **`/cd` コマンド追加** — セッションの作業ディレクトリを**プロンプトキャッシュを壊さずに**新しいディレクトリへ移動できる
- **`disableBundledSkills` 設定 / `CLAUDE_CODE_DISABLE_BUNDLED_SKILLS` 環境変数追加** — バンドルされた組み込みスキルをモデルから隠す
- `claude agents --json` の出力を拡張（新フィールド・フィルタリングオプション）、`claude agents` を並行セッション向けに勧めるヒントを追加
- `/workflows` がターン実行中でも即座に開くように
- `TaskCreate` の信頼性向上（入力の自動修復）
- `CLAUDE.md` の警告閾値がモデルのコンテキストウィンドウサイズに応じてスケール、スキルタグの色コントラスト改善
- 多数の修正: Up/Down 矢印キーが折り返し行をまたいでコマンド履歴を飛ばす問題、再接続時／IDE 設定での enterprise MCP ポリシー強制、リモートセッション再アタッチ時に権限・ダイアログプロンプトが再表示される問題、macOS で claude.ai 認証情報利用時の ~30-50ms UI ストール、Windows でのスラッシュコマンド/スキルスキャン時の `claude -p` 遅延、Windows 起動時の Git Credential Manager ポップアップ、MCPB プラグインキャッシュの無効化、背景エージェントがプロジェクトレベルの環境設定を無視する問題、Remote Control 再接続、ストリーミング・アニメーション中の CPU 使用率削減、フッターヒント非表示、retire→wake サイクルでの背景セッションのフラグ保持 など

### 2.1.168（2026-06-06 PT）

- バグ修正・信頼性向上のみ（公式リリースノートに個別項目の記載なし）

### 2.1.167（2026-06-06 PT）

- バグ修正・信頼性向上のみ（公式リリースノートに個別項目の記載なし）

### 2.1.166（2026-06-06 PT）— **`fallbackModel` 設定 / deny ルールの glob 対応 / クロスセッションメッセージング堅牢化**

フォールバックモデル、権限ルールの glob、マルチセッション安全性を中心とする機能追加＋多数の修正を含むリリース。

- **`fallbackModel` 設定追加** — プライマリモデルが過負荷／利用不可のとき、**順に試す最大3つのフォールバックモデル**を設定できる。`--fallback-model` が**対話セッションにも**適用されるようになった
- **deny ルールのツール名位置で glob パターン対応** — `"*"` で全ツールを拒否できる。allow ルールは非MCPの glob を拒否し、deny ルールの未知ツール名は起動時に警告
- **クロスセッションメッセージングの堅牢化** — 他の Claude セッションから `SendMessage` で中継されたメッセージは**ユーザー権限を持たない**。受信側は中継された権限要求を拒否し、auto モードもこれをブロックする
- **既定で思考するモデルの thinking を無効化可能に** — `MAX_THINKING_TOKENS=0` / `--thinking disabled` / モデル別 thinking トグルが、Claude API 経由で既定思考モデルの thinking を無効化（サードパーティプロバイダ経由は変更なし）
- **API の想定外エラー時にフォールバックモデルで1回リトライ** — 非リトライ可能エラーを返した場合、フォールバックモデルでターンを1回再試行。認証・レート制限・リクエストサイズ・トランスポートエラーは即時表面化
- `claude update` がダウンロード前に**対象バージョンを通知**（従来は無音）
- `claude agents`: リストにURLを入力すると、最初のプロンプトにそのURLを含むセッションに絞り込み
- 多数の修正: 処理不能画像での「image could not be processed」エラーと余分なトークン消費、起動時ワーカー登録中の一時的バックエンド障害でリモートセッションが恒久停止する問題、JetBrains 2026.1+ IDE 端末（IntelliJ/PyCharm/WebStorm 等）のちらつき（同期出力の有効化で解消）、Kitty キーボードプロトコル端末（WezTerm/Ghostty/kitty）で Shift+非ASCII 文字（例 Shift+ä → Ä）が欠落する問題、Windows で kill されたプロセスの子が出力パイプを保持した際の PowerShell コマンド検証ハング、macOS で daemon 死後に `claude --bg-pty-host` が100% CPU で回り続ける問題、`/voice` 切替後に stale な認証チェックが残る問題、無効エントリを含むマネージド設定が残りの有効ポリシーの強制を無音で無効化する問題、`allowedMcpServers`/`deniedMcpServers` の `${VAR}` 参照が一致しない問題、git worktree に入った背景セッションが `claude agents` から再オープンすると「No conversation found」で crash-loop する問題、Ctrl+O トランスクリプト表示の思考テキスト重複、リモートセッション内で `/doctor` が矛盾した「Not inside a remote session」失敗を表示する問題 など

### 2.1.165（2026-06-05 PT）

- バグ修正・信頼性向上のみ（公式リリースノートに個別項目の記載なし）

> 注: **2.1.164 は欠番**（公式 changelog に記載なし）。

### 2.1.163（2026-06-04 PT）— **バージョン固定（requiredMin/MaxVersion）/ `/plugin list` / バックグラウンド自動更新**

組織でのバージョン統制、プラグイン一覧、バックグラウンド更新の体験改善を中心とするリリース。

- **`requiredMinimumVersion` / `requiredMaximumVersion` マネージド設定追加** — バージョンが許可範囲外なら Claude Code が起動を拒否し、承認済みバージョンへ誘導。組織で使用バージョンを固定できる
- **`/plugin list` コマンド追加** — インストール済みプラグインを一覧表示。`--enabled` / `--disabled` フィルタ付き
- **バックグラウンドセッションが Claude Code 更新後にバックグラウンドで新バージョンへ更新** — 更新後にセッションを開いてもコールドリスタート待ちが発生しなくなった
- **`/btw` に「`c` でコピー」ショートカット** — 生 markdown 回答をクリップボードへコピーし、貼り付け先で書式を維持
- **Stop / SubagentStop フックが `hookSpecificOutput.additionalContext` を返せるように** — フックエラー扱いされずに Claude へフィードバックしてターンを継続できる
- **Skills**: コマンド本文で数字の直前にリテラル `$` を入れる `\$` エスケープ構文を追加
- stdio MCP サーバーが `--resume` 時に hooks/Bash と同じ `CLAUDE_CODE_SESSION_ID` を受け取る
- **`claude -p` の修正**: バックグラウンドコマンドが終了しないと最終結果後に無限ハングする問題（stdin クローズ後 ~5s で背景シェルを停止）、Bedrock/Vertex/Foundry で `CI=true`・Anthropic APIキー未設定時に「ANTHROPIC_API_KEY required」で失敗する問題を修正
- bazel/EDR 保護 Go ワークフローで `$TMPDIR` が全コマンドに上書きされ失敗する問題修正（2.1.154 リグレッション）、Windows で read-only 属性／OneDrive 配下の session-env ディレクトリで「EEXIST」失敗する問題修正
- 新規 config ディレクトリで起動中にマネージド設定取得が完了すると組織管理権限ルールがセッション全体に適用されない問題、agent view を Esc で抜ける際の端末崩れ・数秒ハング、フック `if: "Bash(...)"` がサブシェル/バッククォート内コマンドにマッチしない問題、ホームディレクトリの deny ルール（例 `Read(~/Desktop/**)`）が `$HOME` 経由参照の Bash をブロックしない問題などを修正
- `/` メニューの組み込みコマンド/スキルの説明を明確化、サブスクリプション切替サジェストを起動時アナウンス枠に表示

### 2.1.162（2026-06-03 PT）— **`waitingFor` / Remote Control フッター常時表示 / Windsurf→Devin Desktop 改名**

`claude agents` 系の改善と、エディタ連携・起動まわりの修正を中心とするリリース。

- **`claude agents --json` に `waitingFor` フィールド追加** — 待機中セッションが何でブロックされているか（例: 権限プロンプト）を表示
- **`--tools` での Grep/Glob 明示指定が機能** — 埋め込み検索を持つネイティブビルドで、Grep/Glob を明示すると専用検索ツールが提供される（従来はこれらの名前が無音で無視されていた）
- **`/effort` がデフォルト永続化を確認表示** — 選択したレベルが新規セッションのデフォルトとして永続化される場合に確認を表示
- **オートコンプリートのスラッシュコマンドはクリックで即実行しない** — メニューでクリックするとプロンプトに入力され、Enter で実行する挙動に変更
- **Remote Control が永続フッターのピル表示に** — 起動時メッセージではなく、セッションへのリンク付きのフッターピルとして常時表示されるよう変更
- **`/ide` メニュー・`/terminal-setup`・`/scroll-speed` で Windsurf を Devin Desktop に改名** — エディタのリブランドに追随
- 設定ディレクトリが読み取り専用／書き込み不可のときの無音起動ハングを修正（インメモリ設定で起動し、空白画面ではなく起動エラーを表示）
- WebFetch 許可ルールが組み込みプリアプルーブドドメインに適用されない問題を修正（明示的な `WebFetch(domain:...)` の deny/ask/allow がプリアプルーブド自動許可より優先）
- Windows の許可ルールがバックスラッシュ表記（`~\`、`\\server\share`）や大文字小文字違いのパスで一致しない問題、Read の deny ルールが Glob/Grep 結果からファイルを隠さない問題を修正
- そのほか stream-json/SDK セッションでのターン冒頭 Esc 取りこぼし、絵文字混入時の API 400 `no low surrogate in string`、MCP per-server `timeout` の 1000ms 未満値処理、LSP の `workspaceSymbol`、`claude agents` の表示幅／名前列／アタッチ／画像ペースト、起動通知の整理など多数の修正

### 2.1.161（2026-06-02 PT）— **OTEL_RESOURCE_ATTRIBUTES のメトリクスラベル反映 + `claude agents` の done/total 表示**

テレメトリとエージェント表示の改善を含むリリース。

- **`OTEL_RESOURCE_ATTRIBUTES` の値がメトリクスデータポイントのラベルに含まれるように** — team や repo といったカスタム次元で使用量メトリクスをスライスできるようになった
- **`claude agents` の行が `done/total` を詳細の前に表示** — 作業がファンアウトされているときに完了数／総数を表示し、peek では最長実行中の項目を表示
- **`/mcp` が未サインインの claude.ai コネクタを折りたたみ表示** — 一度もサインインしていないコネクタを「Show unused connectors」行の下にまとめる
- **並列ツール呼び出しで失敗した Bash が他をキャンセルしない** — 同一バッチ内の Bash コマンドが失敗しても他の呼び出しはキャンセルされず、各ツールが独立して結果を返す
- フルスクリーンモードでクリップボードが Linux で `wl-copy`/`xclip`/`xsel` を利用、クリップボードと PRIMARY セレクション両方にコピー（ミドルクリック貼り付け対応）
- OpenTelemetry ログイベントがテレメトリ初期化完了前に送出されると無音で破棄される問題を修正
- `claude mcp` の list/get/add がシークレットを端末に出力する問題を修正（`${VAR}` 参照を展開せず、認証ヘッダー・URL シークレットを秘匿）
- そのほか `claude -p` の stdout 破損、`/usage-credits` の再ログイン誤発生、`/autofix-pr` の worktree 誤判定、Windows hooks の bash 明示呼び出し失敗、Write ツール結果レンダリングのクラッシュなど多数の修正

### 2.1.160（2026-06-01 PT）— **セキュリティ強化 + Dynamic Workflows トリガー語変更**

セキュリティ関連のプロンプト追加と、Dynamic Workflows のトリガー語変更を含む27変更のリリース。

- **Dynamic Workflows のトリガー語を `workflow` → `ultracode` に変更** — `workflow` という語ではワークフローが起動しなくなった（自分の言葉で依頼すれば引き続き起動する）。トリガー語はプロンプト入力で violet（紫）にハイライトされる
- **シェル起動ファイルへの書き込み前にプロンプトを追加** — `.zshenv` / `.zlogin` / `.bash_login` および `~/.config/git/` への書き込みは意図しないコマンド実行につながり得るため、書き込み前に確認プロンプトを表示
- **`acceptEdits` モードでビルドツール設定ファイルの書き込み前にプロンプトを追加** — コード実行を許す可能性のある `.npmrc` / `.yarnrc*` / `bunfig.toml` / `.bazelrc` / `.pre-commit-config.yaml` / `.devcontainer/` 等を `acceptEdits` モードでも書き込み前に確認
- **`grep` 閲覧後の Edit が別途 Read 不要に** — 単一ファイルの `grep` / `egrep` / `fgrep` コマンドが read-before-edit チェックを満たすようになった
- **`/effort ultracode` 関連修正** — モデルが xhigh を実行できない場合に dynamic workflows 設定のせいだと誤って表示する問題を修正。ultracode をサポートしないモデルでは ultracode を提示しないように変更
- WSL で copy-on-select が Windows クリップボードに書き込めない問題を修正（OSC 52 ではなく PowerShell interop を使用、MobaXterm 等の OSC 52 非対応端末でも動作）
- サードパーティプロバイダ（Bedrock/Vertex/Foundry）での auto mode 利用不可メッセージを、モデルのせいにするのではなく `CLAUDE_CODE_ENABLE_AUTO_MODE` オプトインを案内するよう修正
- `CLAUDE_CODE_OPUS_4_6_FAST_MODE_OVERRIDE` を削除（no-op 化）、起動時の JetBrains プラグインインストール提案を削除
- そのほかバックグラウンドセッション／`claude agents`／`claude --bg`／音声モード／Windows 入力応答性／vim モードなど多数の修正（計27変更）

### 2.1.159（2026-05-31 PT）

- **内部インフラ改善のみ（ユーザー向け変更なし）** — 公式リリースノートに "Internal infrastructure improvements (no user-facing changes)" と明記

### 2.1.158（2026-05-30 PT）

- **Auto mode が Bedrock / Vertex / Foundry 上の Opus 4.7 および Opus 4.8 で利用可能に** — `CLAUDE_CODE_ENABLE_AUTO_MODE=1` を設定してオプトイン。サードパーティ展開（Bedrock/Vertex/Foundry）でも、分類器による事前アクションレビュー付きの auto mode が使えるようになった

### 2.1.157（2026-05-29 PT）

v2.1.154 の Opus 4.8 / Dynamic Workflows ロールアウト後の修正版だが、**plugin / worktree 周りで実質的な機能追加**を多数含む。

- **`.claude/skills` 配下の plugin を Marketplace 登録なしで自動ロード** — `claude plugin init <name>` で `.claude/skills` に新規 plugin のスケルトンを生成。`/plugin` 引数のオートコンプリート（サブコマンド／インストール済み plugin 名／既知 Marketplace の plugin）も追加
- **`settings.json` の `agent` フィールドがディスパッチセッションで尊重される** — `--agent <name>` で上書き可能
- **`EnterWorktree` がセッション中に Claude 管理 worktree 間を切替可能に**
- **Claude 管理 worktree をエージェント完了時にアンロック** — `git worktree remove`/`prune` でクリーンアップできるよう変更（30日リテンション後の orphan 化も修正）
- **ゼロバイト/破損画像（paste・MCP・dialog 経由）がリクエストをクラッシュさせる問題を修正** — テキストプレースホルダにフォールバック
- `tool_decision` テレメトリに `tool_parameters`（bash コマンド・MCP/skill 名）を追加（`OTEL_LOG_TOOL_DETAILS=1` 時）
- `/config` に **「Workflow keyword trigger」設定** — プロンプト中の "workflow" 語で動的ワークフローが起動するのを抑止。トリガー語直後の backspace で起動要求を取り消し（alt+w と同等）
- [VSCode] Opus 4.8 で fast mode インジケータが出ない問題、background subagent の Stop が効かない問題を修正
- そのほか `--resume`／`claude agents`／WSL 画像ペースト／長い会話のレンダリング性能など多数の修正

### 2.1.154（2026-05-28 PT、2026-05-29 JST）— **Opus 4.8 デフォルト化 + Dynamic Workflows**

このバージョンが本シリーズで**最大級の機能追加**。Anthropic 公式の Claude Opus 4.8 リリースに合わせた一括展開。

- **Claude Opus 4.8 がデフォルトモデルに昇格** — `/effort xhigh` が高難度タスク向けデフォルト。既存ユーザーの個別設定は保持
- **Dynamic Workflows（Research Preview）** — プロンプトに "workflow" を含めると、Claude が **数十〜最大1000サブエージェント** をバックグラウンドでファンアウト実行・並列ブレスト・収束。`/workflows` で実行状況を確認
- **`ultracode` 設定** — `xhigh effort` + 自動オーケストレーション on を組み合わせた高難度モード
- **Fast mode 価格3倍安化** — Opus 4.8 では「標準レート×2 で2.5倍速」へ（従来は更に高額）
- **リーンシステムプロンプトのデフォルト化** — Haiku / Sonnet / Opus 4.7 以前を **除く** 全モデルで適用
- **Agent Teams 改善** — `claude agents` 内で `! <command>` でバックグラウンドシェルセッション起動、attach / detach 可能。`claude --bg --exec '<command>'` でも同等
- **macOS バックグラウンドエージェントの権限継続** — Privacy & Security に "Claude Code" として統一表示、アップグレード後も付与済み権限を保持
- **`/model` セッションデフォルト保存** — 通常は新規セッションのデフォルトとして保存、`s` キーで現在セッションのみ変更（IDE 動作に一致）
- **`claude agents` autocomplete 改善**

### 2.1.153（2026-05-28 PT）

- GitHub plugin マーケットプレイス: `skipLfs` オプション追加（clone/update で Git LFS ダウンロードをスキップ）
- MCP サーバー認証通知の統合（複数の "needs authentication" 通知を1メッセージに集約）
- `claude agents` の PR 列改善: 単一PRは `PR #N`、複数は `N PRs` 形式で表示

### 2.1.152（2026-05-27 PT）

- **`/code-review --fix`** — レビュー実行後に reuse / simplification / efficiency の提案をワーキングツリーに適用
- 旧 `/simplify` は内部的に `/code-review --fix` を呼び出す形へ統合
- **Skill フロントマターに `disallowed-tools`** — スキル活性中に特定ツールをモデルから除外可能
- **`/reload-skills` コマンド** — セッション再起動なしでスキルディレクトリを再スキャン

### 2.1.151（2026-05-25 PT）

- マイナー修正（公式 changelog に詳細記載なし）

### 2.1.150（2026-05-23 PT）

- **内部インフラ改善のみ（ユーザー向け変更なし）** — 公式リリースノートには "Internal infrastructure improvements (no user-facing changes)" と明記。CLI コマンド・UI・既存挙動の変更はない
- バックエンド最適化・メンテナンスを目的とするリリース。新規バグ修正もこのバージョンでは公開されていない
- コミットハッシュ: `39e853e`

### 2.1.149（2026-05-22 PT）

- **`/usage` カテゴリ別内訳** — スキル／サブエージェント／プラグイン／MCP サーバー別のトークン消費を分解表示。コスト要因の特定が大幅に容易化
- **`/diff` 詳細ビューをキーボードスクロール対応** — マウス不要で長い差分を確認可能
- **GFM タスクリストチェックボックス対応** — Markdown 描画で `- [ ]` / `- [x]` が視覚的に表示
- **エンタープライズ設定 `allowAllClaudeAiMcps`** — claude.ai 由来 MCP コネクタを組織横断で許可するワイルドカード設定
- **セキュリティ修正多数**:
  - PowerShell 権限バイパスの抜け穴
  - git worktree sandbox allowlist の不備
  - `PWD` / `OLDPWD` / `DIRSTACK` の変数追跡における権限解析ギャップ
- macOS で `find` がファイル/vnode テーブルを枯渇させる問題修正
- 各種 UI 修正・権限プロンプト修正

### 2.1.148（2026-05-22 PT）

- v2.1.147 で混入した **Bash ツールが毎回 exit code 127 を返すリグレッション**の緊急修正。バージョン番号は 1 つしか進めなかったが、Bash ベースのワークフロー全停止級の影響だったため即日 hotfix リリース

### 2.1.147（2026-05-21 PT）

- **`/simplify` → `/code-review` リネーム** — コマンド名と挙動を再定義
  - `/code-review [effort]` で **effort レベル**（`standard` / `high` / `xhigh` / `max`）を選択してコード正確性のバグを検出
  - **`--comment` フラグ**で GitHub PR の該当行にインラインコメントとして投稿
  - 旧 `/simplify` の "cleanup-and-fix" 挙動は廃止
- **Pinned background sessions の永続化** — `/pin` でピン留めした背景セッションは、アイドル時もメモリから降ろされず生存維持。Claude Code 本体のアップデートが発生してもそのセッションは **in-place 再起動**で文脈を保持
- **Auto-updater リトライロジック** — 一時的ネットワークエラーを自動リトライし、原因別のエラーカテゴリを報告
- **エンタープライズログイン制約強制** — 組織ポリシーで許可されていない認証フローが通ってしまう不具合修正
- コマンド出力での `&` 文字 HTML エスケープによる表示崩れ修正
- プラグインエージェントが Agent type 情報を伝播しない問題修正
- Windows PowerShell ツール系の複数バグ修正

### 2.1.145（2026-05-19 PT）

- **`claude agents --json`** — Agent View で扱う情報を JSON で出力するフラグ。CI/CD やシェルパイプラインから状態取得・自動化に利用可能
- **OTEL span 拡張** — `agent_id` と `parent_agent_id` を span 属性に含め、サブエージェント階層をテレメトリで追跡可能に
- **`/plugin` インストール前プレビュー** — Marketplace 一覧で各プラグインが提供する commands / agents / skills / hooks / MCP サーバー一覧を**インストール前**に確認可能
- **フルスクリーンでエージェントパネルのマウス操作対応** — hover / click でセッション選択
- **MCP prompt コマンドの検証エラー修正** — 引数を要求しない MCP prompt が誤って「引数不足」エラーを出していた問題修正
- UI フリーズ・トランスクリプト描画系の修正多数

### 2.1.144（2026-05-19 PT / 2026-05-19 JST）

- **`/resume` バックグラウンドセッション対応** — `claude --bg` や Agent View で起動したバックグラウンドセッションが、`/resume` のインタラクティブ一覧と同じピッカーに混在表示されるようになった
  - 各エントリには **`bg` タグ** が付与され、バックグラウンド由来かインタラクティブ由来かを一目で識別可能
  - 「バックグラウンドで走らせていた作業を対話セッションとして引き継ぎたい」「バックグラウンド ↔ インタラクティブの境界を意識せず作業履歴を辿りたい」というユースケースに対応
- **`/plugin` ブラウズパネルの最終更新日表示** — Plugin Marketplace の browse / discover ペインに各プラグインの **最終更新日**が表示
  - メンテナンスが続いているか、放置プラグインかが視覚的に判別できる
  - 信頼性評価の判断材料が増えた
- **`/model` がセッション単位変更に変更** — `/model` は **現在のセッションのみ** にモデル変更を適用する挙動に
  - モデルピッカーで **`d` キーを押す** と、新規セッション用のデフォルトを設定可能
  - 旧挙動は global default を変更していたため、複数並行セッションでの誤適用がしばしば発生していた
- **背景サブエージェント完了通知の経過時間表示** — 例: `"Agent completed · 3h 2m 5s"` のように所要時間を併記
- **`/extra-usage` → `/usage-credits` リネーム** — CLI 全体で "extra usage" 表記を "usage credits" に統一（旧コマンド名は引き続き動作）
- **`api.anthropic.com` 到達不可時の起動ハング修正** — サイドチャネル API 呼び出しのタイムアウトを **75秒 → 15秒** に短縮
- **ターミナル描画系修正** — ウィンドウリサイズイベント取り逃しによる描画化け、長時間セッションでの段階的描画破壊を修正
- MCP / OAuth / バックグラウンドセッション系のバグ修正多数

### 2.1.143（2026-05-15 PT / 2026-05-16 JST）
- **Plugin dependency enforcement** — プラグイン間の依存関係を宣言的に解決するランタイム強制機構
  - プラグインマニフェストの `dependencies` フィールドを参照し、起動時／インストール時に不足プラグインを自動取得
  - バージョン整合性チェック（semver 範囲指定）とバージョン不一致時の警告／インストール拒否
  - 循環依存（A→B→A）を検知してロード時にエラー表示
  - 既存の `claude plugin install` フローと統合され、依存ツリー全体を一括解決
- **`claude project purge` コマンド** — プロジェクト履歴の選択削除を専用コマンド化
  - セッション単位・期間指定・パターン指定で履歴／キャッシュを精密に削除
  - `--dry-run` で削除対象のプレビュー、`-i` で対話的選択、`--all` でプロジェクト全履歴の一括削除
  - v2.1.126 で導入された機能を本格コマンドラインに昇格、プロジェクト切替時のディスク領域回収・機密情報の選択的消去を容易化

### 2.1.140 系
- **Plugin Marketplace 関連変更** — マーケットプレース上のプラグイン配布・連携フロー周辺の整備
- **`/plugin` コマンド整備** — プラグインの **インストール／アンインストール／一覧／詳細表示** を `/plugin` 配下で統一
- **`/skills` リアルタイムフィルタ** — スキル一覧で **タイプしながらの絞り込み（インクリメンタルフィルタ）** に対応
- その他 CLI 全般で **13 件の変更**（バグ修正・UI 改善含む）

### 2.1.139（2026-05-11 PT / 2026-05-12 JST）
- **Agent View (Research Preview)** — 複数バックグラウンドセッションを横断管理する新ビュー
  - 起動方法: ターミナルで `claude agents` 実行、または既存セッション内で **左矢印キー（←）** 押下
  - 表示内容: Session ID / Status（実行中／入力待ち／完了）/ Latest Response / Last Interaction
  - 主な操作: 行選択で最終ターンプレビュー、入力待ちセッションへのインライン返信、Enter でフル会話履歴、`/bg` で既存セッションを Agent View 管理下に、`claude --bg [task]` で新規バックグラウンド起動
  - 提供範囲: Pro / Max / Team / Enterprise / Claude API すべて（標準レート制限）
- **`/goal` コマンド** — 完了条件（goal）を設定すると Claude がその条件を満たすまで **自動的にタスクを継続実行**

### 2.1.138（2026-05-09 JST）
- **`ANTHROPIC_BEDROCK_SERVICE_TIER` 環境変数** — Bedrock の Service Tier を `default` / `flex` / `priority` から選択可能
- **`/resume` への PR URL ペースト検索** — GitHub / GitHub Enterprise / GitLab / Bitbucket の PR URL を貼り付けると、該当セッションを自動検索
- **Remote Control 有効時の「Push when Claude decides」プッシュ通知オプション** — Claude 側がタイミングを判断して通知を送信
- **`/tui` コマンド** — ちらつきのないフルスクリーン描画モードに切替
- **Bedrock / Vertex / Foundry の 429 エラー修正**
- **MCP 重複コネクタヒント** — 同一 URL の claude.ai コネクタとローカル定義の重複を検知してヒント表示

### 2.1.137
- **VS Code extension の Windows アクティベーション失敗を修正** — v2.1.131 と同種の追加修正

### 2.1.136
- **`CLAUDE_CODE_ENABLE_FEEDBACK_SURVEY_FOR_OTEL`** — OpenTelemetry 経由で品質サーベイ回答を収集するエンタープライズ向けに、セッション品質サーベイを再有効化
- **`settings.autoMode.hard_deny`** — auto モード分類器のうち、ユーザー意図や allow 例外に関わらず無条件にブロックするルール
- **`/clear` 後の MCP サーバー喪失修正** — `.mcp.json` / プラグイン / claude.ai コネクター由来の MCP サーバーが、VS Code extension・JetBrains plugin・Agent SDK の `/clear` で静かに消える問題
- **OAuth login loop 修正** — 並行 credential 書き込みで rotate 直後の OAuth トークンが上書きされ、再ログイン強制される稀な問題
- **MCP OAuth refresh トークン喪失修正** — 複数 MCP サーバー同時 refresh で refresh トークンが失われ、毎日再認証が必要だった問題
- **extended thinking の API 400 修正** — ツール呼び出し後の redacted thinking ブロック発行で 400 を返す問題
- **`--resume` / `--continue` のアンダースコアパス問題修正** — プロジェクトパスにアンダースコアを含むセッションが見つからない問題
- **plan モードの Edit 許可ルール尊重修正** — `Edit(...)` の allow ルールがあっても plan モードがファイル書き込みをブロックしない問題
- **WSL2 画像ペースト** — xclip/wl-paste で画像読めないとき PowerShell フォールバックで Windows クリップボードから読み込み
- **キャッシュクリーンアップ競合修正** — 実行中セッションで使用中のバージョンを削除する問題
- **スラッシュコマンドダイアログ UI 統一** — フッターヒント・スペーシング・矢印キースタイル統一、ローディング中のダイアログフレーム即時表示
- **bash / markdown コードブロックの色位置ずれ修正**
- **ReasonML diff の "undefined" アーティファクト修正**
- **worktree 削除後の終了ダイアログ修正** — 誤ったディレクトリで未コミット警告を出す問題
- **`@` ファイルピッカー改善** — セッション中に作成したファイル / 100 エントリ超ディレクトリ / git 管理外ディレクトリでのマッチ
- **fullscreen のツール失敗 click-to-expand 修正** — 出力が truncate されたときのクリック展開
- **Backspace / Ctrl+Backspace 入れ替わり修正** — Ctrl+G で外部エディタを開いた後、persistent extended-key モードの端末で
- **`/usage` 週次リセット表示修正** — 時刻ではなく暦日付表示に
- **CJK 端末ウェルカムバナー overflow 修正**
- **`/insights` クラッシュ修正** — tool calls の input フィールド malformed 時
- **レンダラクラッシュ修正** — ツールの折りたたみ可否がセッション中に変化したとき
- **`plugin.json` の `skills` エントリ修正** — デフォルト `skills/` ディレクトリを隠す問題、ファイルパス指定でエラー表示
- **IDE shell-integration ロックファイル** — `CLAUDE_CONFIG_DIR` を尊重するよう修正
- **コピー時の trailing whitespace 削除**
- **プラグインの uninstall/enable/disable** — slug を case-insensitive にマッチ
- **tool error truncation のサロゲートペア負カウント修正**
- **`CLAUDE_ENV_FILE` SessionStart hooks の env 変数** — `/resume`/`/clear` 後の stale 化修正
- **`/branch` のマルチライン session title** — ペーストされた複数行名のサニタイズ
- **`AskUserQuestion`** — multi-select 配列回答が破棄される問題
- **`/clear <name>` のセッションラベル付与修正**
- **`CronList` 表示** — qualifiers と scheduled prompt の欠落修正
- **マーケットプレイス削除キー** — `r`（retry と衝突）から `d` に変更
- ※ v2.1.134・v2.1.135 はスキップ番号

### 2.1.133
- **`worktree.baseRef` 設定（`fresh` | `head`）** — `--worktree`、`EnterWorktree`、agent-isolation worktree の **ベース branch を制御**。**注: デフォルトは `fresh`（origin/<default> ベース）に戻り、v2.1.128 以降の `EnterWorktree` 仕様（local HEAD ベース）から再変更**。未 push commit を保持したい場合は `worktree.baseRef: "head"` を明示
- **`sandbox.bwrapPath` / `sandbox.socatPath`** — Linux/WSL のマネージド設定で bubblewrap / socat バイナリパスを指定可能
- **`parentSettingsBehavior`** — 管理者 tier の admin キー（`'first-wins'` / `'merge'`）。SDK `managedSettings` をポリシーマージに opt-in
- **フックが effort レベルを取得可能** — `effort.level` JSON フィールド + `$CLAUDE_EFFORT` 環境変数。Bash ツールコマンド内でも `$CLAUDE_EFFORT` を読める
- **focus モード挙動改善**
- **メモリ使用量改善** — メモリ圧迫時に warm-spare バックグラウンドワーカーを解放
- **並列セッション 401 dead-end 修正** — refresh トークンレースで shared credentials が wipe される問題
- **`Edit` / `Write` ドライブルート許可ルール修正** — `C:\` / POSIX `/` がスコープのルールが不正にマッチして毎回プロンプトを出す問題
- **`ECOMPROMISED` unhandled rejection 修正** — history / session-log ファイルロックが clock skew や slow disk で compromise されたとき
- **conversation compaction 中の Esc 押下** — スプリアス "Error compacting conversation" 通知修正
- **MCP OAuth フロー全体のプロキシ尊重** — discovery / dynamic client registration / token exchange / token refresh のすべてで `HTTP(S)_PROXY` / `NO_PROXY` / mTLS が機能
- **マップトネットワークドライブ修正** — `--add-dir` / SDK `additionalDirectories` 渡しで Read/Write/Edit が拒否される問題
- **claude.ai からの Remote Control stop/interrupt 修正** — ローカル Esc と同等にキャンセルしない問題（stuck tool/prompt 中断後にキューメッセージが進まない）
- **`/effort` の sessions 跨ぎ波及修正** — 1 セッションでの変更が他の同時セッションの effort を変える問題
- **サブエージェントのスキル発見修正** — project / user / plugin スキルを Skill ツール経由で発見できない問題
- **`claude --help`** — `--remote-control` を `--remote-control-session-name-prefix` と並列に表示
- **[VSCode]** `claudeCode.claudeProcessWrapper` の "Unsupported platform" 修正（Claude バイナリ非同梱ビルド時）

### 2.1.132
- **`CLAUDE_CODE_SESSION_ID` 環境変数** — Bash ツールサブプロセスに追加（hooks の `session_id` と一致）
- **`CLAUDE_CODE_DISABLE_ALTERNATE_SCREEN=1`** — フルスクリーン代替スクリーンレンダラを無効化し、端末ネイティブのスクロールバックに会話を残す
- **`Ctrl+V` 画像ペースト中の "Pasting…" フッターヒント**
- **外部 SIGINT のグレースフルシャットダウン** — IDE stop ボタン / `kill -INT` で端末モード復元と `--resume` ヒント表示
- **ネイティブビルドの terminal close / SSH disconnect 修正** — uncaught exception
- **`--resume` の絵文字 `no low surrogate in string` 修正** — tool error truncation 起因。既破損セッションは load 時にサニタイズ
- **plan-mode セッション再開修正** — `-p --continue`/`--resume` 時の `--permission-mode` 無視と、`ExitPlanMode` 後の plan-mode 再適用失敗
- **laptop sleep/wake / Ctrl+Z / `fg` 後のフルスクリーン空白画面修正**
- **Indic conjunct / ZWJ 絵文字のカーソル修正** — 行ラップ時の Ctrl+E/A/K/U/矢印キーで mid-grapheme 着地
- **vim オペレータの NFD 文字破損修正** — 分解アクセント文字
- **`/` 始まりテキストペースト修正** — silently swallow / unknown-command reply
- **bracketed paste 修正** — focus event / mouse-tracking との干渉でエスケープシーケンスがプロンプトに混入
- **マウスホイール過速修正** — Cursor / VS Code 1.92-1.104 の上流 xterm.js bug
- **JetBrains IDE 2025.2 端末のスクロールホイール修正** — spurious arrow keys / wrong-direction / runaway acceleration
- **`/usage` Ctrl+S** — Linux/X11 でのクリップボードコピーハング修正
- **`/terminal-setup`** — Windows Terminal で Shift+Enter ネイティブ対応の矛盾エラー修正
- **`/effort` ピッカー** — `CLAUDE_CODE_EFFORT_LEVEL` 環境変数オーバーライドを反映
- **`/status`** — デフォルトモデル誤表示修正
- **スラッシュコマンド autocomplete** — ~3-5 件頭打ちを端末高に応じてスケール
- **statusline `context_window`** — 累積セッション合計から現在のコンテキスト使用量に修正
- **Alt+T 思考トグル修正** — iTerm2 / Terminal.app デフォルト（Option as Meta 無効）でも動作
- **Windows のキーボード入力 dead 修正** — `claude agents` 経由でバックグラウンドセッション再開後
- **stdio MCP サーバー不正出力での無限メモリリーク修正** — 非プロトコルデータを stdout に書くと 10GB+ RSS
- **MCP `tools/list` 失敗時** — silently 0 ツールから 1 回リトライ + "connected · tools fetch failed" 表示
- **claude.ai MCP コネクター表示修正** — 未認可サーバーが "failed" ではなく "needs auth" 表示。headless `-p` モードの非 transient 4xx リトライ抑止
- **スラッシュコマンドダイアログ・`/login`/`/upgrade`/`/extra-usage` のスペーシング統一**
- **`/tui fullscreen` 起動バナー** — メモリ使用量低減・マウスサポート・auto-copy on select の説明追加
- **Bedrock / Vertex 400 エラー修正** — `ENABLE_PROMPT_CACHING_1H` 設定時

### 2.1.131
- **VS Code extension の Windows アクティベーション失敗修正** — バンドル SDK のハードコードビルドパス（`createRequire` polyfill bug）
- **Mantle エンドポイント認証修正** — `x-api-key` ヘッダー欠落

### 2.1.129（旧最新）
- **`--plugin-url <url>`** — `.zip` プラグインアーカイブを URL から取得して現在のセッションのみで使用
- **`CLAUDE_CODE_FORCE_SYNC_OUTPUT=1`** — 同期出力の自動検出を取りこぼすターミナル（Emacs `eat` など）で強制有効化
- **`CLAUDE_CODE_PACKAGE_MANAGER_AUTO_UPDATE`** — Homebrew / WinGet インストール時に Claude Code がバックグラウンドで `upgrade` コマンドを実行し、再起動を促す
- **プラグインマニフェスト整理** — `themes` と `monitors` は `"experimental": { ... }` 配下で宣言する形に。トップレベル宣言は引き続き動くが `claude plugin validate` で警告
- **ゲートウェイモデル探索のオプトイン化** — `/model` ピッカーの `/v1/models` 探索は `CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1` で明示有効化（v2.1.126〜v2.1.128 は自動だった）
- **`Ctrl+R` 履歴ピッカーが全プロジェクト検索に復帰** — v2.1.124 以前の挙動。現プロジェクト/セッションに絞り込みたいときは `Ctrl+S`
- **サードパーティ展開でのスピナーヒント抑制** — Bedrock / Vertex / Foundry / `ANTHROPIC_BASE_URL` ゲートウェイ利用時、Anthropic 一次サーフェスを指すヒントを表示しない
- **`skillOverrides` 設定が動作** — `off` でモデル/`/` から非表示、`user-invocable-only` でモデルからのみ非表示、`name-only` で description を折りたたみ
- **`claude_code.pull_request.count` OTel メトリクスの拡張** — シェルコマンド経由だけでなく MCP ツール経由 PR/MR もカウント
- **ポリシー拒否メッセージに API Request ID** — サポートデバッグが容易に
- **バグ修正多数**:
  - 未認識 400 ステータスエラーで根本メッセージではなく生 JSON が表示される事象
  - `/clear` でターミナルタブタイトルがリセットされない事象
  - `/rename` のセッションタイトルチップが許可/その他ダイアログ表示中に消える事象
  - サブエージェント実行中にエージェントパネルが隠れる事象（v2.1.122 リグレッション）
  - Ctrl+G 外部エディタへのハンドオフでプロンプト上の会話履歴が空白化する事象
  - `/context` がレンダ済み ASCII ビジュアライゼーショングリッドを会話にダンプする事象（呼び出しごとに約 1.6k トークン浪費）
  - `/agents` ライブラリで矢印キーナビゲーション時、リストがビューポート超過時にハイライト中エージェントが見えなくなる事象
  - `/branch` 成功メッセージに新ブランチの `/resume` 用セッション ID が含まれない事象
  - キーキャップ/ZWJ/肌の色絵文字を含む太字ヘッダーがフルスクリーンモードで末尾文字を失う事象
  - `user:inference` スコープを欠く OAuth クレデンシャルを保存したエンタープライズ/チームでサーバー管理設定ポリシーが適用されない事象
  - wake-from-sleep 後の OAuth refresh race により全実行中セッションがログアウトする事象
  - 1 時間プロンプトキャッシュ TTL が無音で 5 分にダウングレードされる事象
  - `/clear` / compact 後に `/effort` / `/model` を変更するとキャッシュミス警告が誤表示される事象
  - `Bash(mkdir *)` / `Bash(touch *)` 等の許可ルールが in-project パスで尊重されない事象
  - `deniedMcpServers` の `*://` スキームワイルドカードが大文字小文字混在ホスト名にマッチしない事象
  - voice mode の `--debug` 中に無害な WebSocket 警告がエラーログとして記録される事象
  - [VSCode] `/clear` が会話コンテキストと表示中トランスクリプトをクリアしない事象

### 2.1.128
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
