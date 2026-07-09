---
title: "Claude の自動起動・スケジュール実行ガイド — クラウド/ローカルの全手段とサブスク内外の課金整理"
date: 2026-06-21
updatedDate: 2026-07-09
category: "Claude技術解説"
tags: ["Claude Code", "自動化", "スケジュール実行", "Routines", "loop", "Managed Agents", "課金", "サブスクリプション"]
excerpt: "Claude（Claude Code）でタスクを自動起動・自動実行する手段を、クラウド側（Routines / Claude Code on the web / Managed Agents / GitHub Actions）とローカル端末側（Desktop scheduled tasks / loop / バックグラウンドセッション / OSスケジューラ）に分けて体系整理。各手段が『サブスク定額の枠内』か『API従量課金』かの線引き、PC常時起動の要否、再起動後の継続可否、レート上限の消費といった注意点を、公式ドキュメントに基づいて一覧表でまとめる。2026年6月に予告され施行当日に一時停止された課金変更の経緯も正確に解説。"
draft: false
---

> ## 要点
>
> - 「**自動承認（auto mode）**」「**自動起動（スケジュール実行）**」「**自動継続（`/loop`）**」は**別の概念**。auto mode はセッション内の承認自動化であって、勝手に起動する仕組みではない。
> - 自動起動の手段は **クラウド側**（Routines / Claude Code on the web / Managed Agents / GitHub Actions）と **ローカル端末側**（Desktop scheduled tasks / `/loop` / バックグラウンドセッション / OSスケジューラ）に大別できる。
> - **課金の線引きは「クラウドかローカルか」ではない**。多くの手段は **サブスク定額の利用上限内**で動く。明確に **API 従量課金**になるのは **Managed Agents**、および **API キーを使って動かす Agent SDK / `claude -p` / GitHub Actions** など、限られたケース。
> - **PC を常時起動しておく必要があるか／再起動後も続くか**は、クラウド系（不要・継続）とローカル系（必要・停止しうる）で大きく異なる。
> - 2026年6月15日に「Agent SDK / `claude -p` / GitHub Actions を別建てクレジットへ」という課金変更が予告されたが、**施行当日に一時停止**され、本記事執筆時点（2026-06-21）でも**これらは引き続きサブスク上限から消費**される。

## はじめに — 3つの「自動」を混同しない

Claude を自動で動かしたい、という相談でよく混ざるのが、次の3つの異なる概念です。

| 概念 | 何を自動化するか | 起動は誰がする？ |
|---|---|---|
| **自動承認（auto mode）** | セッション内での**ツール実行の承認**（毎回の許可プロンプトを省く） | 人が起動する |
| **自動起動（スケジュール実行）** | **セッションの起動そのもの**（無人で立ち上がる） | スケジューラ／クラウド |
| **自動継続（`/loop`）** | 起動済みセッション内で**タスクを繰り返し継続** | 人が1回起動、以降は自動反復 |

auto mode は「起動後に止まらず進む」ための仕組みで、**「勝手に立ち上がる」仕組みではありません**。本記事のテーマは2つ目と3つ目、すなわち「無人での自動起動」と「自動継続」です。

> **関連**: そもそも Claude にどんなアクセス手段があるかの全体像は [Claude へのアクセス方法まとめ](/mdTechKnowledge/blog/claude-access-methods-overview/) を参照してください。本記事はその中の「自動で動かす」軸に絞った実務ガイドです。

---

## クラウド側で自動起動する手段

クラウド側の最大の利点は、**自分の PC を起動しておく必要がない**こと（Anthropic 側のインフラで動く）と、**再起動・スリープの影響を受けない**ことです。

### ① Routines（`/schedule`）— 定額でクラウド・スケジュール実行

**Routines** は、保存した構成を Anthropic 管理のクラウドで定期実行する公式機能です。Claude Code の **`/schedule`** コマンドで作成・管理できます。

| 項目 | 内容 |
|---|---|
| 起動場所 | クラウド（Anthropic 管理・**自分の PC は不要**） |
| トリガー | スケジュール（cron 相当）／ API（HTTP POST）／ GitHub イベント（CLI からは Scheduled、API/GitHub トリガーは Web で設定） |
| 最小間隔 | 1時間 |
| 実行環境 | 毎回リポジトリを fresh clone（ローカルファイルへはアクセスしない） |
| 課金 | **サブスク内**。対話セッションと同じく利用上限から消費（日次の実行上限あり。超過時はオプトインで従量継続も可） |
| 提供 | Pro / Max / Team / Enterprise（research preview） |

「毎朝チェックを回す」「定期的にレポートを生成する」といった**無人の定期実行**に最も素直な選択肢です。

### ② Claude Code on the web — クラウド実行セッション

ブラウザ（`claude.ai/code`）から起動し、**Anthropic 管理の隔離 VM 上で実行**するモードです。ブラウザを閉じてもセッションは継続し、モバイルから進捗監視もできます。

- 起動場所：クラウド（隔離サンドボックス VM）。**PC 不要**。
- 課金：**サブスク内**。公式に「クラウド VM に対する別途のコンピュート課金はない（There is no separate compute charge for the cloud VM.）」と明記。
- 注意：並列実行はその分だけレート上限を多く消費する。

### ③ Claude Managed Agents — 本番運用向け（API 従量課金）

長時間・非同期のエージェントを**フルマネージドのクラウド基盤**で動かす製品です。永続的な状態（ファイルシステム・履歴）を持ち、本番運用を想定しています。

- 起動場所：クラウド（または自前インフラの self-hosted サンドボックス）。**PC 不要**。
- 課金：**API 従量課金**。トークン課金に加え **session runtime に対して $0.08 / session-hour**（実行中のみミリ秒単位で課金、アイドル・終了時は無課金）。**ここがサブスク定額とは別建て**になる代表例。
- 提供：ベータ（API キーが必要。`anthropic-beta: managed-agents-2026-04-01` ヘッダ）。
- 詳細は [Claude Managed Agents 簡易ガイド](/mdTechKnowledge/blog/claude-managed-agents-guide/) を参照。

### ④ Claude Code GitHub Actions — イベント駆動の自動実行

GitHub 上で PR / Issue に `@claude` とメンションすると、GitHub のランナー上で Claude Code が起動して解析・実装・PR 作成などを行う公式アクションです。

- 起動場所：**GitHub 側のランナー**（イベント駆動）。自分の PC 不要。
- 課金：**2系統が別々**。①GitHub Actions の実行時間（GitHub 側課金、Anthropic とは無関係）＋ ②Anthropic の推論コスト。後者は認証方式しだいで、**API キー使用なら API 従量**、**OAuth（サブスク）トークン使用ならサブスク経路**。

---

### ⑤ Cowork リモートセッション — PC を閉じてもクラウドで継続（2026-07-07〜）

2026年7月7日、**Claude Cowork が Web / iOS / Android へ展開**され、**「リモートセッション（Remote sessions）」** が加わりました（Max プランからベータで順次）。これにより Cowork のエージェント作業が**クラウド側で継続**するようになり、「ローカル /loop か・クラウド Routines か」に続く**第3の選択肢**として位置づけられます。

- 起動場所：**クラウド**。**PC を閉じても作業が継続**し、指定時刻のタスクを**デバイス不要で自律実行**できる。
- 監視・承認：**モバイル（iOS/Android）や Web から進捗確認**が可能。承認が必要な場面はスマホに通知が届き、応答後に再開。
- 課金：**サブスク内**（Cowork の利用上限を消費。上限は 2026-08-05 まで2倍に延長中）。**Agent SDK / `claude -p` を通らない**ため別課金にはならない。
- 位置づけ：Routines（スケジュール実行）に近いが、**対話的タスクをそのままクラウドへ逃がして継続**できる点が異なる。詳細は [Claude Cowork アップデートまとめ](/mdTechKnowledge/blog/claude-cowork-updates/) を参照。

---

## ローカル端末側で自動起動する手段

ローカル系は手元で完結する一方、**PC を起動しておく必要があり、シャットダウンで止まりうる**点が共通の制約です。

### ① Desktop scheduled tasks — ローカルのスケジュール実行（定額）

Claude Desktop アプリから作成する「ローカル版の Routine」です。**自分のマシン上で定期実行**し、ローカルファイルにもアクセスできます。

| 項目 | 内容 |
|---|---|
| 起動場所 | ローカル端末（**マシンの起動は必須**、対話セッションの開放は不要） |
| 最小間隔 | 1分 |
| ローカルFS | アクセス可 |
| 課金 | **サブスク内** |

「手元のファイルを使う定期処理を、PC を点けている時間帯に回したい」場合のローカル本命です。

### ② `/loop` — 起動済みセッションの自動継続

`/loop` は Claude Code 公式バンドルのスキル（v2.1.72 以降）で、**起動済みの対話セッション内でタスクを繰り返し継続**させます。コールドスタート（無人での新規起動）ではない点に注意。

- `/loop 5m <prompt>` … 固定間隔（単位は s/m/h/d）で反復
- `/loop <prompt>` … 間隔省略で Claude が**自己ペース**（毎回 1分〜1時間の遅延を選び、完了を立証するとループ自身を終了）
- 停止は `Esc`、**7日で自動失効**、1セッションあたり最大 50 タスク
- 起動場所：**ローカル**（マシン起動＋セッション開放が必須。閉じると停止し、`--resume` / `--continue` で復元）
- 課金：**サブスク内**（対話セッション内の機能で専用課金なし）

「今から PC を点けている間、N 分／N 時間おきに同じ処理を回したい」用途に向きます。

### ③ バックグラウンドセッション（`claude --bg` / Agent View）

`claude --bg "<task>"` で起動し、`claude agents`（Agent View）で複数のバックグラウンドセッションを横断管理する仕組みです。

- 起動場所：**ローカル**（マシン上の supervisor プロセスが保持）。**スリープは保持されるがシャットダウンで停止**。
- 課金：**サブスク内**（対話と同等。並列に10走らせれば上限消費もおよそ10倍速）。
- 詳細は [Agent View ガイド](/mdTechKnowledge/blog/claude-code-agent-view-guide/) を参照。

### ④ 手動起動 ＋ auto mode（半自動）

完全無人ではありませんが、「起動は自分でやり、押した後は止めたくない」なら、対話セッションを起動して auto mode にすれば、以降の承認はノンストップになります。サブスク内で安全な半自動運用です。

### ⑤ OS スケジューラ（cron / Windows タスクスケジューラ）＋ `claude`

技術的には、OS のスケジューラから Claude Code を起動して無人実行することも可能です。ただし**公式が推奨している裏付けは確認できず**、同じ目的には上記の **Desktop scheduled tasks（マネージドなローカル実行）** が公式の案内です。

- 無人で起動するには非対話モード（`claude -p`）を使うことになり、**`ANTHROPIC_API_KEY` を設定していると API 従量課金になる**点に注意（API キー未設定でサブスク認証なら、現状はサブスク枠から消費）。
- 「Claude の判断が不要な、機械的な定型処理」であれば、**Claude を介さない素のスクリプト（PowerShell / Python 等）を OS スケジューラで回す**のが、課金も依存も最小の堅実な方法です。
- 補足（Windows）：タスクスケジューラ登録時は「**コンピューターを AC 電源で使用している場合のみタスクを開始する**」のチェックを外しておくと、電源状態に左右されず実行されます。

---

## 全手段まとめ — 起動場所・PC要否・継続性・課金

| 手段 | 起動場所 | PC常時起動 | 再起動後 | 課金（2026-06-21時点） |
|---|---|:---:|:---:|---|
| **Routines（`/schedule`）** | クラウド | 不要 | 継続 | サブスク内 |
| **Claude Code on the web** | クラウド | 不要 | 継続 | サブスク内（VM別途課金なし） |
| **Cowork リモートセッション** | クラウド | 不要 | 継続（モバイル監視可） | サブスク内（Cowork枠・〜8/5は2倍） |
| **Managed Agents** | クラウド/self-host | 不要 | 復帰可 | **API従量＋$0.08/session-hour** |
| **GitHub Actions** | GitHub ランナー | 不要 | イベント駆動 | GitHub 実行時間＋推論（API or サブスク） |
| **Desktop scheduled tasks** | ローカル | 必要 | 稼働中のみ | サブスク内 |
| **`/loop`** | ローカル | 必要 | セッション要・7日失効 | サブスク内 |
| **バックグラウンド（`--bg`）** | ローカル | 必要 | shutdownで停止 | サブスク内 |
| **手動起動＋auto mode** | ローカル | 必要 | ― | サブスク内 |
| **OSスケジューラ＋`claude -p`** | ローカル | 必要 | 稼働中のみ | サブスク内／APIキー設定時はAPI従量 |

---

## サブスク内 / API 従量課金の線引き

ここが最も誤解されやすいポイントです。**「自動だから別課金」ではありません。**

### 明確に「API 従量課金（サブスクとは別建て）」になるもの

- **Claude Managed Agents**（トークン＋session-hour 課金）
- **Agent SDK を API キー認証で動かす**場合（pay-as-you-go の API 課金）
- **`claude -p` で `ANTHROPIC_API_KEY` を設定**している場合（API キーが優先され API 課金）
- **GitHub Actions を API キー認証**で動かす場合の推論分（＋ GitHub 実行時間は常に GitHub 課金）

### サブスク定額の利用上限内で動くもの

- 対話的な Claude Code（Pro / Max / Team / Enterprise）
- **Routines**、**Claude Code on the web**、**Desktop scheduled tasks**
- **`/loop`**、**バックグラウンドセッション（`--bg`）**
- これらは claude.ai・Claude Code と**共有のレート上限**（5時間ごと＋週次）を消費。上限超過時の API 課金は**オプトイン**で、有効化しない限り上限でブロックされるだけで課金は発生しません。

### 2026年6月15日の課金変更とその一時停止

2026年6月15日に、Anthropic は **Agent SDK / `claude -p` / サードパーティアプリ経由の利用を、別建ての月額クレジットへ移す**という課金変更を予告していました。しかし**施行当日に一時停止（pause）**され、公式は次のように述べています。

> 「変更を一時停止します。当面、何も変わりません。Claude Agent SDK・`claude -p`・サードパーティアプリの利用は、引き続きサブスクリプションの利用上限から消費されます。」（Anthropic 公式サポート）

したがって**2026-06-21 時点では、これらは引き続きサブスク枠内**です。ただしこれは恒久撤回ではなく一時停止であり、**将来的に再導入される可能性**があります（再導入時は事前告知の方針）。自動化を組む際は、最新の公式アナウンスを確認するのが安全です。

---

## どれを選ぶか — 判断フロー

```
質問1: PC を起動していない時間帯・再起動後も確実に走らせたいか？
  YES → クラウド側（Routines が定額の第一候補。本番運用や長時間・非同期なら Managed Agents、
         ただし API 従量課金）
  NO  → 質問2へ

質問2: 無人で「定期的に」起動したいか？
  YES → ローカルの Desktop scheduled tasks（定額・最小1分・ローカルFS可）
  NO  → 質問3へ

質問3: 「今から点けている間だけ」繰り返したい／半自動でよいか？
  YES → 反復したいなら /loop、起動後ノンストップで良いなら 手動起動＋auto mode
  NO  → 単発でよい（自動化不要）

補足: Claude の判断が不要な機械的処理は、Claude を介さない素のスクリプトを
      OS スケジューラで回すのが最も軽量。
```

---

## 注意点（横断）

- **レート上限の消費**：サブスク系の手段はすべて claude.ai・Claude Code 共通の上限（5時間ごと＋週次）を消費します。並列・高頻度の自動実行は上限を急速に食う点に注意。
- **PC 常時起動の要否**：クラウド系（Routines / web / Managed Agents / GitHub Actions）は不要。ローカル系（Desktop tasks / `/loop` / `--bg` / OSスケジューラ）は PC が起動している必要があります。
- **再起動後の継続**：ローカルのバックグラウンドはスリープでは保持されますが**シャットダウンで停止**。`/loop` はセッション開放が必須で **7日で失効**。クラウド系は端末状態に依存しません。
- **データの取り扱い**：クラウド実行はリポジトリやデータが Anthropic 側の環境に渡ります。機密データを扱う場合は、ローカル実行（Desktop tasks 等）やアクセス範囲の制御を検討してください。
- **無人実行の安全性**：無人運用では、想定外の高コストアクションやモデル指定を防ぐため、権限ルールでの制御（例：高コストモデルの自動起動をブロック）を併用すると安全です（→ [Claude Code バージョン履歴まとめ](/mdTechKnowledge/blog/claude-code-version-history/) の `Tool(param:value)` 権限構文）。

---

## まとめ

- 「**自動承認（auto mode）**」≠「**自動起動**」≠「**自動継続（`/loop`）**」。まず概念を分けて考える。
- 自動起動は**クラウド側**（Routines / web / Managed Agents / GitHub Actions）と**ローカル側**（Desktop scheduled tasks / `/loop` / `--bg` / OSスケジューラ）に大別。
- **課金の線引きは「クラウド/ローカル」ではなく「どの入口・どの認証で動かすか」**。Managed Agents と API キー利用が API 従量、それ以外の多くはサブスク定額枠内。
- **無人・再起動耐性が要るならクラウド（定額なら Routines）**、**手元のファイルを定期処理するならローカルの Desktop scheduled tasks**、**点けている間だけ反復するなら `/loop`** が基本の使い分け。
- 2026-06-15 の課金変更は**施行当日に一時停止**され、現時点でも Agent SDK / `claude -p` 等はサブスク枠のまま。ただし将来の再導入に備え、最新の公式情報を確認すること。

---

## 関連記事

- [Claude へのアクセス方法まとめ](/mdTechKnowledge/blog/claude-access-methods-overview/) — Claude を使う手段全体の地図
- [Claude Code Routines ガイド](/mdTechKnowledge/blog/claude-code-routines-guide/) — クラウド/ローカルの定期実行（Routines / scheduled tasks）の詳細
- [Agent View ガイド](/mdTechKnowledge/blog/claude-code-agent-view-guide/) — バックグラウンドセッションの横断管理
- [Claude Managed Agents 簡易ガイド](/mdTechKnowledge/blog/claude-managed-agents-guide/) — クラウド本番運用基盤（API 従量課金）
- [Agent Teams 大改訂](/mdTechKnowledge/blog/claude-agent-teams-overhaul/) — エージェントの種類と起動モデルの全体像
- [Claude Code バージョン履歴まとめ](/mdTechKnowledge/blog/claude-code-version-history/) — `Tool(param:value)` 権限構文など

---

## 出典

- [Anthropic: Use the Claude Agent SDK with your Claude plan（6/15変更の一時停止を明記）](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan)
- [Claude Code: Routines](https://code.claude.com/docs/en/routines) / [Scheduled tasks（`/loop`・Desktop scheduled tasks）](https://code.claude.com/docs/en/scheduled-tasks)
- [Claude Code on the web](https://code.claude.com/docs/en/claude-code-on-the-web)
- [Claude Code: Agent View](https://code.claude.com/docs/en/agent-view)
- [Claude Code: GitHub Actions](https://code.claude.com/docs/en/github-actions)
- [Claude Managed Agents Overview](https://platform.claude.com/docs/en/managed-agents/overview) / [Pricing](https://platform.claude.com/docs/en/about-claude/pricing)
- [Anthropic: Pro プラン](https://support.claude.com/en/articles/8325606-what-is-the-pro-plan) / [Max プラン](https://support.claude.com/en/articles/11049741-what-is-the-max-plan) / [Claude Code を Pro/Max で使う](https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan)
