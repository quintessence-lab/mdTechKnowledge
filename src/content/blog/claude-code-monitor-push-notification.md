---
title: "Claude Code Monitorツール & Push通知 完全ガイド — Routines・自動化との組み合わせ"
date: 2026-04-29
updatedDate: 2026-04-29
category: "Claude技術解説"
tags: ["Claude Code", "Monitor", "Push通知", "Remote Control", "Routines", "自動化"]
excerpt: "Claude Code v2.1.xで追加されたMonitorツール（バックグラウンドスクリプトのイベントストリーミング）とPush通知ツール（Remote Control経由のモバイル通知）を解説。Routines連携・自動化ワークフローでの活用例を含む。"
draft: false
---

## はじめに

Claude Code v2.1系では、エージェントが「裏側で動いているプロセス」と「離席中のユーザー」をつなぐための仕組みが段階的に追加されました。本記事では、その中核を担う2つの機能を整理します。

- **Monitorツール** — v2.1.98で追加。バックグラウンドで動かしているスクリプトのイベントをエージェントにストリーミングする
- **Push通知ツール** — v2.1.110で追加。Remote Controlの「Push when Claude decides」設定と組み合わせて、モバイル端末にプッシュ通知を送信する

長時間ビルドの完了待ち、ログ監視、無人Routines実行中の障害検知など、「Claude Codeを起動したまま画面を見続けたくない」シーンで威力を発揮します。

---

## Monitorツールとは（v2.1.98）

### 概要

Monitorツールは、`run_in_background: true` で起動したバックグラウンドプロセスから流れてくるイベント（標準出力の各行など）を、エージェントが必要なタイミングで取り出すためのツールです。

公式CHANGELOGの記述は次の通りです。

> Added Monitor tool for streaming events from background scripts

これまでバックグラウンドスクリプトの出力を確認するには、`Read` ツールでログファイルを定期的に読み直す、あるいは `/loop` で短い間隔のポーリングを回すといった方法しかありませんでした。Monitorツールは「stdoutの新しい行が来た時点で通知を受け取る」というイベントドリブンな購読モデルを提供することで、ポーリングコストを排除しています。

### 動作モデル

| 観点 | 内容 |
|:---|:---|
| 入力 | バックグラウンドプロセスの識別子（Bashのrun_in_background時に発行） |
| 出力 | プロセスがstdoutに書き出した各行をイベントとしてストリーム |
| 終了条件 | プロセス終了、明示的な購読停止、または条件達成 |
| 待機方式 | イベント到着まで非同期にブロック（busy-loopなし） |

ポーリングと違い、「変化があった瞬間にだけ会話コンテキストに行が追加される」ため、プロンプトキャッシュの破壊（5分TTLの再計算）も最小限に抑えられます。

### 典型的な用途

1. **ビルド・コンパイル監視**
   `npm run build` や `cargo build --release` のような長時間ビルドを `run_in_background: true` で起動し、Monitorで「Build completed」やエラー行を待ち受ける
2. **デプロイ監視**
   `kubectl rollout status` や `terraform apply` の進捗をストリーム購読し、Ready / Failed のシグナルで次のステップに進む
3. **ログ追跡**
   `tail -f app.log` を仕掛けてWARN/ERRORが流れたタイミングで反応する。障害ドリブンな対応を自動化できる
4. **テストランナー**
   ファイルウォッチャ付きテスト（`vitest --watch` など）と組み合わせ、再実行のたびに結果を解析する

---

## Push通知ツールとは（v2.1.110）

### 概要

Push通知ツールは、Claude Code側の判断で **モバイル端末（iOS/Android のClaudeアプリ）にプッシュ通知を送る** ためのツールです。

公式CHANGELOGの記述は次の通りです。

> Added push notification tool — Claude can send mobile push notifications when Remote Control and 'Push when Claude decides' config are enabled

ポイントは「Remote Controlが接続されていて、ユーザーが明示的にPushをオプトインしている」場合にのみ、エージェントが通知発火を選択できる点です。Claudeが恣意的に通知を飛ばすのではなく、ユーザー側の設定で許諾された範囲でしか動かない安全設計になっています。

### 必要な前提条件

| 条件 | 内容 |
|:---|:---|
| Remote Control接続 | claude.aiモバイルアプリとローカル/CCRセッションがペアリングされている |
| 設定 | `Push when Claude decides` を有効化（claude.ai側のRemote Control設定） |
| アプリ通知許可 | OS側でClaudeアプリの通知が許可されている |
| バージョン | Claude Code v2.1.110 以降 |

### 仕組み

1. ユーザーがローカルまたはCCRでClaude Codeセッションを開始
2. Remote Controlでモバイルアプリと接続
3. claude.ai上で「Push when Claude decides」をON
4. エージェントが「ユーザーに知らせるべきイベント」と判断したタイミングでPush通知ツールを呼び出す
5. Anthropicのサーバ経由でモバイルアプリにプッシュ通知が届く

これにより、ユーザーは画面から離れていても、長時間処理の完了や承認待ちのタイミングを能動的に通知してもらえます。

---

## 設定方法

### Push通知の有効化手順

1. モバイルでClaudeアプリをインストール、ログイン
2. PC側で `claude` を起動し、`/remote-control` または「リモートを起動して」でRemote Controlを開く
3. 表示されたQRコードまたはコードをモバイルアプリでスキャンして接続
4. claude.aiの設定画面 → Remote Control → **Push when Claude decides** をON
5. テスト用に「ビルドが終わったらPush通知して」などと指示し、動作確認

### Monitorツールの利用例（疑似コード）

Monitorツールはエージェント側で自動的に選ばれるため、ユーザーは普通に「裏でビルドして、終わったら教えて」と指示すれば良いだけですが、内部的には次のような呼び出しが行われます。

```text
1. Bash(command="npm run build", run_in_background=true)
   → background_id: "bg_abc123"

2. Monitor(background_id="bg_abc123",
           until="stdout contains 'Build completed' or 'error'")
   → エージェントはイベント到着までブロック
   → 完了を検知するとPush通知ツールへ

3. PushNotification(message="ビルドが完了しました（17分32秒）")
```

ポイントは、`Monitor` がポーリング型ではなく **「条件達成までawaitする」非同期購読** であること。`/loop` のようにモデル呼び出しを繰り返すコストがかからず、通知が必要なタイミングで初めてエージェントが起動します。

---

## Routinesとの組み合わせ

[Claude Code Routines](https://claude.ai/code) は、Anthropic管理のクラウド上で **無人** に動くスケジューラ的な仕組みです。本来Routinesは非対話的なため、Monitorで監視・Pushで通知という構図がきれいに噛み合います。

### パターン1: 定期Routineの実行結果をPushで受け取る

```
Schedule (毎朝7:00)
  └─ Routine起動（クラウドサンドボックス）
       ├─ コードベースの変更サマリー作成
       ├─ Slack投稿
       └─ ユーザーのモバイルへPush通知
            "本日のレポートをSlackに投稿しました"
```

Routinesは原則PCオフでも動きますが、Push通知ツールがRemote Control接続を要求する関係で、現状は **「ユーザーがClaudeアプリを開けば通知を受け取れる」** 構成になります。Routine自体の実行結果はclaude.ai上の履歴やSlack/メールで補完するのが堅実です。

### パターン2: GitHubトリガー × Push

PR作成時にRoutineが起動 → セキュリティレビュー → 重大な脆弱性が見つかった場合のみPush通知、というワークフロー。すべての通知ではなく **「人間の判断が必要なケースだけ」** を選んでPushすることで、通知疲れを防げます。

### パターン3: Monitor + ローカルRoutine的運用

正式なRoutinesを使わなくても、ローカルで `/loop` + `run_in_background` + Monitor + Push を組み合わせれば、簡易的な常駐監視ワークフローが組めます。

```
/loop 30m  "ステージング環境のヘルスチェックを行い、
           失敗したらPush通知して詳細を残せ"
```

---

## 実用例

### ユースケース1: 長時間ビルドの完了通知

Rust/C++/Unreal Engineのような長時間ビルドを抱えるプロジェクトでは、ビルド中に他作業へ切り替えがちです。

```
ユーザー: "release ビルドを裏で実行し、完了か失敗したらモバイルに通知して"

エージェント:
  1. Bash run_in_background: cargo build --release
  2. Monitor で stdout を購読
  3. "Finished" 検出 → PushNotification("リリースビルド成功 (12m04s)")
     "error[" 検出 → PushNotification("ビルド失敗: <最初のエラー行>")
```

### ユースケース2: 障害検知通知

本番ログのテール監視を任せておき、ERROR/Fatal が一定頻度を超えた時点で通知を受け取る。

```
ユーザー: "production.log を監視して、ERRORが1分間に3回以上出たらPush通知"

エージェント:
  1. Bash run_in_background: tail -F /var/log/production.log
  2. Monitor で行を逐次受信、内部カウンタで頻度判定
  3. しきい値超過で PushNotification + 該当行をコンテキストに保存
```

### ユースケース3: 承認待ちアラート

無人で進めている中で、人間判断が必要な分岐に到達したらPush通知 → ユーザーがモバイルから「承認」して続行。Remote Controlの双方向性を活かした非同期ワークフローが組めます。

---

## 既存機能との違いと使い分け

Claude Codeには以前から、長時間処理や繰り返し実行を扱う機能が複数あります。それぞれの守備範囲を整理します。

| 機能 | 役割 | 主な向き先 | 通知 |
|:---|:---|:---|:---|
| **`/loop`** | プロンプトを一定間隔で繰り返し実行 | 状態が能動的に変わるかをポーリングしたい場合 | なし（コンテキスト内表示のみ） |
| **PreCompactフック** | コンパクション直前に処理を挟む | コンテキスト圧縮前のメモ取り・退避 | なし |
| **Monitor** | バックグラウンドプロセスの出力をawait | 非同期で何かが起きるのを待ちたい | なし（イベント検出のみ） |
| **Push通知ツール** | モバイルへ能動通知 | ユーザーに人間として知らせたい瞬間 | あり |
| **Routines** | クラウド上で無人実行 | スケジュール／GitHubイベント駆動 | 履歴・MCP経由（Slack等） |

**典型的な使い分け:**

- **短時間で確認したい**: `/loop 30s` など短間隔ループ
- **長時間プロセスの完了/失敗を待つ**: `run_in_background` + Monitor
- **完了をユーザーに能動的に伝える**: Monitor + Push通知ツール
- **PCオフでも回したい定期/イベント処理**: Routines（必要に応じてSlack/メール通知をMCP経由で）
- **コンテキスト圧縮前の準備**: PreCompactフック

`/loop` はコンテキストキャッシュを温かく保つコストが発生するため、長時間の単純な完了待ちには Monitor の方が経済的です。逆に「定期的にウェブ情報を取得し直す」のように、毎回モデル思考が必要な作業は `/loop` の方が向いています。

---

## セキュリティ考慮

通知系・監視系の機能はユーザビリティを大きく上げますが、扱う情報の機微には注意が必要です。

### 通知内容に機密情報を載せない

- **APIキー・トークン・パスワード** をPush本文に含めない（モバイルロック画面に表示される可能性）
- **顧客個人情報** を通知に直接書かない。要約と「詳細はClaude Codeセッションで確認」に留める
- 失敗時のスタックトレースには内部パス・環境情報が混入しがち。要約してから通知する

### Remote Controlの管理

- 共有PC・公共PCでRemote Controlを接続したまま離席しない
- `Push when Claude decides` をONにする端末は、自分のモバイル端末に限定
- 不要になったペアリングはclaude.ai上で破棄

### Monitorツールが拾うログのスコープ

- バックグラウンドで `tail -f` する対象に、シークレットがそのまま流れていないかを事前確認
- 必要なら `grep -v` で機密パターンを除外したストリームを Monitor に渡す

### Routinesでの通知ファンアウト

Routinesから通知ツールを使う場合、サンドボックス側でログ・成果物が永続化される点を踏まえ、 **「通知は要約のみ・詳細は安全な保管先に」** という分離原則を徹底するのが安全です。

---

## まとめ

| 機能 | 追加バージョン | 役割 |
|:---|:---|:---|
| Monitor | v2.1.98 | バックグラウンドスクリプトのイベントストリーミング |
| Push通知 | v2.1.110 | Remote Control経由のモバイル通知（オプトイン） |

この2つを組み合わせると、Claude Codeは **「裏で何かを見張り、必要な瞬間だけユーザーに声をかける」** エージェントへと進化します。Routinesと組み合わせれば、長時間ビルド、障害検知、定期レポートなど多様な自動化シナリオに対応可能です。

ただし通知は「便利さ」と「機密漏洩リスク」が表裏一体。設定を有効化する際は、本記事のセキュリティ考慮を踏まえ、 **要約して送る・必要な相手に限定する** という原則を最初から組み込むことを推奨します。
