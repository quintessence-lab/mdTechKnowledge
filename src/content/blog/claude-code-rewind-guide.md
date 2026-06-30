---
title: "Claude Code /rewind（チェックポイント）完全ガイド — コードと会話を任意ターンへ巻き戻す"
date: 2026-06-30
category: "Claude技術解説"
tags: ["Claude Code", "rewind", "チェックポイント", "checkpoint", "コンテキスト管理", "/clear", "セッション復元", "アンドゥ"]
excerpt: "Claude Codeの /rewind（チェックポイント）を公式ドキュメントに基づき深掘り。ファイル編集と会話履歴を任意の過去ターンへ巻き戻す仕組み、v2.1.191で追加された /clear 前の復元、restore と summarize の6アクション、bash変更が追跡されない等の制限、/clear・/compactとの使い分けまでを表で整理します。"
draft: false
---

# Claude Code /rewind（チェックポイント）完全ガイド — コードと会話を任意ターンへ巻き戻す

> 2026年6月時点 / 公式ドキュメント [Checkpointing](https://code.claude.com/docs/en/checkpointing) に基づく

「Claudeに大きな変更を任せたら壊れてしまった」「`/clear` を押したけど直前の文脈が必要になった」「いくつか実装を試したいが、いつでも元の状態に戻れる安心感が欲しい」 — こうした場面の救済手段が **`/rewind`（チェックポイント）** です。

本記事は、コンテキスト管理全般を扱う「[コンテキスト管理入門](/mdTechKnowledge/blog/claude-code-context-management/)」の姉妹記事として、**`/rewind` というチェックポイント機構そのものを深掘り**します。仕組み・操作・6つのアクション・制限・`/clear` / `/compact` との使い分けまで、公式ドキュメントの記述を裏取りしながら整理します。

---

## 1. `/rewind`（チェックポイント）とは

**`/rewind` は、Claude Code が自動で保存している「チェックポイント」を使って、コード（ファイル編集）と会話履歴を、任意の過去ターンへ巻き戻す機能**です。

公式ドキュメントは冒頭でこう述べています。

> "Claude Code automatically tracks Claude's file edits as you work, allowing you to quickly undo changes and rewind to previous states if anything gets off track."
> （Claude Code は作業中の Claude のファイル編集を自動追跡し、何かが脱線したときに変更を素早く取り消して以前の状態へ巻き戻せるようにする）

ポイントは2つです。

- **対象は「コード」と「会話」の両方**を選べる。片方だけ、両方一緒、のいずれも可能。
- **自動である**。明示的に「チェックポイントを作る」操作は不要で、**ユーザープロンプトを送るたびに新しいチェックポイントが作られる**。

| 概念 | 内容 |
|------|------|
| チェックポイント | 各編集の前に自動キャプチャされるコード状態のスナップショット |
| 作成タイミング | **ユーザープロンプトを送るたび**に新規作成される |
| 永続性 | **セッションを跨いで残る**（resume した会話からもアクセス可能） |
| 自動削除 | セッションと一緒に**30日後**に自動クリーンアップ（設定で変更可） |
| 起動方法 | `/rewind` コマンド、または入力欄が空のとき `Esc` を2回 |

> 💡 チェックポイントは「local undo（ローカルな取り消し）」と位置づけられています。Git の代替ではなく、**セッション単位の素早い復旧**のための仕組みです（詳細は第6章）。

---

## 2. v2.1.191 で何が変わったか — `/clear` 前の会話ごと復元

`/rewind` は以前からチェックポイント機能として存在していましたが、**2026年6月の Claude Code v2.1.191** で重要な追加がありました。

公式 CHANGELOG（v2.1.191）の記述:

> "Added `/rewind` support for resuming a conversation from before `/clear` was run"
> （`/clear` を実行する前の会話を再開するための `/rewind` サポートを追加）

### それ以前との違い

従来 `/clear` の弱点は「**一度消すと元に戻せない**」点でした。v2.1.191 以降は次のように補われます。

| 観点 | v2.1.191 より前 | v2.1.191 以降 |
|------|----------------|---------------|
| `/clear` 後の文脈復帰 | 不可（`/clear` で消えた会話は戻せない） | rewind メニュー最上部の専用エントリから復帰可能 |
| 操作 | `/resume` で前セッションを手動選択する代替のみ | rewind メニュー内に `/resume <session-id> (previous session)` が表示される |
| 前提 | — | 同一 Claude Code プロセス内で `/clear` した場合 |

公式ドキュメントは、この挙動を次のように説明しています。

> "If you ran `/clear` earlier in the same Claude Code process, the rewind menu shows an additional entry at the top of the list labeled `/resume <session-id> (previous session)`."

このエントリは **Claude Code を終了するか別セッションを resume するまで有効**で、**v2.1.191 以降が必要**です。古いバージョンでは `/resume` を実行して一覧から前セッションを選ぶ代替手段になります。

> ⚠️ 注意: これは「同じプロセス内で `/clear` した直後」のための救済です。端末を再起動した後のセッション復元は別の仕組み（`claude --resume`）です。詳しくは[コンテキスト管理入門](/mdTechKnowledge/blog/claude-code-context-management/)を参照してください。

---

## 3. 操作方法 — 起動・UI・6つのアクション

### 3-1. 起動

| 起動方法 | 条件・補足 |
|---------|-----------|
| `/rewind` コマンド | いつでも実行可能 |
| `Esc` を2回 | **入力欄が空のとき**に rewind メニューを開く |
| `Esc` ×2（入力欄に文字あり） | メニューではなく**入力をクリア**する。消したテキストは入力履歴に保存され、`Up` で呼び戻せる |

公式の注記:

> "If the prompt input contains text, double `Esc` clears it instead of opening the menu. The cleared text is saved to your input history, so press `Up` to recall it after you finish in the rewind menu."

### 3-2. UI — ターンの選択

rewind メニューには、**セッション中に送った各プロンプトが一覧表示**されます。戻りたい地点を選んでから、アクションを選択します。

### 3-3. 6つのアクション（何が戻り、何が戻らないか）

選択地点に対して、以下の6アクションから選べます。**restore 系は状態を巻き戻し、summarize 系はファイルを変えずに会話を圧縮**します。

| アクション | コード | 会話 | 説明 |
|-----------|:------:|:----:|------|
| **Restore code and conversation** | 巻き戻す | 巻き戻す | コードと会話の両方を選択地点へ戻す |
| **Restore conversation** | 維持 | 巻き戻す | 現在のコードはそのまま、会話だけその地点へ戻す |
| **Restore code** | 巻き戻す | 維持 | 会話はそのまま、ファイル変更だけ戻す |
| **Summarize from here** | 変更なし | 圧縮 | 選択地点**以降**を要約に置換（コンテキスト解放） |
| **Summarize up to here** | 変更なし | 圧縮 | 選択地点**より前**を要約に置換（以降はそのまま） |
| **Never mind** | — | — | 何もせず一覧へ戻る |

復元後の挙動:

- **Restore conversation** または **Summarize from here** を選ぶと、選択メッセージの**元のプロンプトが入力欄に復元**され、そのまま再送・編集できる。
- **Summarize up to here** は会話末尾に留まり、入力欄は空のまま。

---

## 4. restore と summarize の違い（深掘り）

`/rewind` には性格の異なる2系統があります。混同しやすいので整理します。

### 4-1. restore 系 = 状態を巻き戻す

ファイル・会話履歴・またはその両方を「**選択地点の状態に戻す**」操作です。失敗した変更を取り消したいとき、試行を捨てて元に戻りたいときに使います。

### 4-2. summarize 系 = 会話を圧縮する（ファイルは触らない）

会話の一部を **AI生成の要約に置換**してコンテキストウィンドウを空ける操作です。**ファイルはディスク上で変更されません**。

| 観点 | Summarize from here | Summarize up to here |
|------|--------------------|--------------------|
| 要約される範囲 | 選択メッセージ**以降** | 選択メッセージ**より前** |
| そのまま残る範囲 | 選択メッセージ**より前** | 選択メッセージ**以降** |
| 終了後の位置 | 元プロンプトが入力欄へ復元 | 会話末尾に留まる（入力欄は空） |
| 典型用途 | 脇道の議論を捨てて初期文脈を残す | 初期セットアップを圧縮して直近作業を残す |

> いずれの summarize でも、**元のメッセージはセッションのトランスクリプトに保持**され、必要なら Claude が詳細を参照できます。要約の焦点を指示するテキストを任意で入力することも可能です。

### 4-3. `/compact` との関係

公式は summarize をこう位置づけています。

> "This is similar to `/compact`, but targeted: instead of summarizing the entire conversation, you choose which side of the selected message to compress."
> （`/compact` に似ているが対象を絞れる。会話全体ではなく、選択メッセージのどちら側を圧縮するかを選べる）

つまり **summarize は「狙い撃ちの `/compact`」**です。

### 4-4. summarize と fork の違い

公式は、別アプローチを試したい場合は summarize ではなく **fork** を勧めています。

> "If you want to branch off and try a different approach while preserving the original session intact, use fork instead (`claude --continue --fork-session`)."

summarize は同一セッションでコンテキストを圧縮するもので、元セッションを温存して分岐したいなら fork、という棲み分けです。

---

## 5. 仕組み・保存範囲・制限

### 5-1. 何が追跡され、何が追跡されないか

| 対象 | 追跡される？ | 補足 |
|------|:-----------:|------|
| Claude のファイル編集ツールによる直接編集 | される | チェックポイントの基本対象 |
| bash コマンドによるファイル変更 | **されない** | `rm` / `mv` / `cp` などは rewind で戻せない |
| セッション外の手動編集 | 原則されない | 同じファイルを当該セッションも編集していれば巻き込まれる場合あり |
| 別の同時実行セッションの編集 | 原則されない | 上と同様の例外あり |

公式の限界に関する記述:

> "Checkpointing does not track files modified by bash commands."
> "Checkpointing only tracks files that have been edited within the current session."

bash の例として `rm file.txt` / `mv old.txt new.txt` / `cp source.txt dest.txt` が挙げられ、**これらは rewind で取り消せない**と明記されています。

### 5-2. 保存と削除

- チェックポイントは**ユーザープロンプトごと**に作られ、**セッションを跨いで永続**する（resume 後もアクセス可）。
- セッションと一緒に**30日後に自動クリーンアップ**（設定変更可）。

> 📌 **推測**: 「30日」「設定で変更可」とあるものの、本記事執筆時点の公式 checkpointing ページには具体的な設定キー名は明示されていません。保持期間を変えたい場合は最新の設定リファレンスを確認してください（公式に明示なし＝推測）。

### 5-3. バージョン管理の代替ではない

公式は明確に線引きしています。

| 役割 | 担うもの |
|------|---------|
| local undo（その場の取り消し・セッション単位の復旧） | チェックポイント（`/rewind`） |
| permanent history（恒久履歴・コミット・ブランチ・共同作業） | Git 等のバージョン管理 |

> "Think of checkpoints as 'local undo' and Git as 'permanent history.'"
> チェックポイントは Git を**補完するが置き換えない**、という位置づけです。

---

## 6. `/clear`・`/compact` との使い分け

3つのコマンドは目的も「元に戻せるか」も対象も異なります。

| 項目 | `/rewind` | `/clear` | `/compact` |
|------|-----------|----------|------------|
| 主目的 | 過去ターンへ巻き戻す / 部分要約 | 会話を完全消去して仕切り直す | 会話全体を要約して圧縮 |
| 元に戻せるか | **これ自体が「戻す」機能** | v2.1.191 以降は rewind 経由で復帰可（同一プロセス内） | 不可（要約は上書き） |
| 対象 | **会話・コード・両方**から選択 | 会話のみ（コードは無関係） | 会話のみ |
| コード（ファイル）への影響 | restore code で**ファイルを戻せる** | なし | なし |
| トークン消費 | restore は基本なし / summarize は要約LLM呼び出しあり | なし（即時） | あり（要約LLM呼び出し） |
| 典型シーン | 失敗変更の取り消し・試行錯誤・脇道の圧縮 | 全く別作業を始める | 同じ作業を続けたいが文脈が重い |

> 補足: `/compact`・`/clear` の詳細な内部動作（トークン消費・自動圧縮など）は[コンテキスト管理入門](/mdTechKnowledge/blog/claude-code-context-management/)で扱っています。本記事はあくまで `/rewind` を主役にした対比です。

---

## 7. 実務での使いどころ

公式が挙げる代表的なユースケースに、実務の文脈を添えて整理します。

| 場面 | 使い方 | 効果 |
|------|--------|------|
| 失敗した変更の巻き戻し | バグを入れた地点を選び **Restore code** | 会話文脈を保ったままコードだけ健全な状態へ |
| 複数アプローチの試行錯誤 | 出発点を選び **Restore code and conversation** | 開始点を失わず別実装を試せる |
| 安全な実験 | 大胆な変更を任せた後、必要なら巻き戻す | 「いつでも戻れる」前提で広範囲タスクに挑める |
| `/clear` 直後の文脈復帰 | rewind メニュー最上部の前セッションエントリ | 間違えて `/clear` しても救済（v2.1.191+、同一プロセス） |
| 冗長なデバッグログの整理 | 中盤以降を **Summarize from here** | 初期指示を残しつつコンテキストを解放 |
| 初期セットアップの圧縮 | **Summarize up to here** | 序盤の長い前提を要約し直近作業を温存 |

### よくある落とし穴

- **bash で行ったファイル操作は戻らない**。`rm` や生成スクリプトでの変更は rewind の対象外なので、危険な操作の前は Git コミットで保険をかける。
- **`/clear` 後の復帰は「同一プロセス内」が前提**。端末を閉じた後は `claude --resume` を使う。
- **summarize はファイルを変えない**。コードを戻したいなら restore 系を選ぶ。

---

## 8. まとめ

- **`/rewind` はチェックポイントを使って、コード・会話・両方を任意の過去ターンへ巻き戻す**機能。プロンプト送信ごとに自動でチェックポイントが作られる。
- **v2.1.191** で「`/clear` 実行前の会話への復帰」が追加され、間違えて `/clear` しても（同一プロセス内なら）救済できるようになった。
- 起動は `/rewind` または入力欄が空のときの `Esc` ×2。メニューには **restore 3種 + summarize 2種 + Never mind** の6アクションがある。
- **restore は状態を巻き戻し、summarize はファイルを変えずに会話を圧縮**する（「狙い撃ちの `/compact`」）。
- **bash によるファイル変更・セッション外の編集は追跡されない**。チェックポイントは「local undo」であり、**Git の代替ではない**。

`/rewind` を押さえておくと、Claude に大胆な変更を任せる際の心理的ハードルが大きく下がります。あわせて[Plan Mode ガイド](/mdTechKnowledge/blog/claude-code-plan-mode-guide/)で「実行前に計画を確認する」、[Safe Mode 入門](/mdTechKnowledge/blog/claude-code-safe-mode-guide/)で「危険操作を抑止する」を組み合わせると、攻めと守りの両面で安全に運用できます。

---

## 参考資料

- [Checkpointing — Claude Code 公式ドキュメント](https://code.claude.com/docs/en/checkpointing)（本記事の主要出典。引用はすべてここから）
- [Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)（v2.1.191: "Added `/rewind` support for resuming a conversation from before `/clear` was run"）
- [Interactive mode — 公式ドキュメント](https://code.claude.com/docs/en/interactive-mode)（キーボードショートカット・セッション操作）
- [Commands — 公式ドキュメント](https://code.claude.com/docs/en/commands)（`/rewind` 経由のチェックポイントアクセス）
- 関連記事: [コンテキスト管理入門](/mdTechKnowledge/blog/claude-code-context-management/) / [Plan Mode ガイド](/mdTechKnowledge/blog/claude-code-plan-mode-guide/) / [Safe Mode 入門](/mdTechKnowledge/blog/claude-code-safe-mode-guide/)
