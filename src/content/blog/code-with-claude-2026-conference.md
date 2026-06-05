---
title: "Code with Claude 2026 開発者カンファレンス まとめ — Remote Agents・Code Review・Routines・Dreaming"
date: 2026-05-09
updatedDate: 2026-06-05
category: "Claude技術解説"
tags: ["Claude Code", "Code with Claude", "Anthropic", "Remote Agents", "Code Review", "Multi-agent orchestration", "Dreaming", "Routines", "カンファレンス", "Agent View", "/goal", "Tokyo", "Code with Claude Tokyo"]
excerpt: "2026年5月6日（PT、JST 5/7）にサンフランシスコで開催された Anthropic 公式開発者カンファレンス Code with Claude 2026 のまとめ。Remote Agents・Code Review・Routines・Dreaming・Multi-agent orchestration・Outcomes など主要発表と Shopify／Mercado Libre の事例、レート制限倍増、SpaceX Colossus 1 連携、v2.1.139 で Research Preview として出荷された Agent View（`claude agents`）／`/goal` コマンド、London 5/20-21・Tokyo 6/10（メイン）／6/11（Extended: 個人開発者・スタートアップ向け）への巡回ツアーまで整理。"
draft: false
---

## はじめに — 「新モデル」ではなく「使いこなし」のカンファレンス

**Code with Claude 2026** は Anthropic が開催した開発者向け年次カンファレンスで、**2026年5月6日（PT）／ 5月7日（JST）** にサンフランシスコ本社で行われました。同シリーズは **London（5/20-21）／ Tokyo（6/10 メイン・6/11 Extended）** にも巡回しました。

例年とは異なり、**今回は新モデルの発表が主軸ではなく**、既存モデル（Opus 4.7 / Sonnet 4.6 / Haiku 4.5）を**いかに開発フローに織り込むか**を訴求するイベントとなりました。Anthropic の Chief Product Officer **Ami Vora** が冒頭で「**API 利用量が前年比 17 倍**」と紹介し、`Claude Code` を中心とした自律的ソフトウェアエンジニアリングの実装パターンが続々と提示されました。

本記事では、**他記事でカバーしきれていない新機能と事例**を中心に、カンファレンス全体像を整理します。

> **関連記事**:
> - [Claude Managed Agents 簡易ガイド](/mdTechKnowledge/blog/claude-managed-agents-guide/)（Dreaming・Outcomes・Multi-agent orchestration の各機能詳細）
> - [Claude Managed Agents Memory 完全ガイド](/mdTechKnowledge/blog/claude-managed-agents-memory/)（Dreaming のメモリ永続化）
> - [Anthropic Rate Limits API 完全ガイド](/mdTechKnowledge/blog/anthropic-rate-limits-api-guide/)（5月のレート制限倍増の詳細）
> - [Anthropic コンピュートインフラ & TPUパートナーシップ](/mdTechKnowledge/blog/anthropic-tpu-compute-partnership/)（SpaceX Colossus 1 を含む計算基盤）

---

## 1. キーノート登壇者と主要メッセージ

| 登壇者 | 役職 | 主なテーマ |
|---|---|---|
| **Ami Vora** | Chief Product Officer | API 17 倍成長、レート制限倍増、SpaceX Colossus 1 連携 |
| **Dianne Na Penn** | Head of Product, Research | モデル能力（tool use・long context・computer use・adaptive thinking・visual design・agentic loops）／ Amp の Opus 4.7 採用事例 |
| **Katelyn Lesse / Angela Kiang** | Claude Platform | Advisor Strategy（Opus が小型モデルを advise してフロンティア品質を1/5コストで）、Managed Agents 3 機能 |
| **Cat Wu** | Head of Product, Claude Code | Code Review、Remote Agents、CI auto-fix、Security Reviews |
| **Boris Cherny** | Claude Code 創設者 | Routines（高次プロンプト）、async automation、デスクトップ multi-session |

「**次世代モデルを前提に作れ**」（Dianne Na Penn）が一貫したメッセージで、9月予定の **Claude 5 / Mythos** を見据えた設計判断（コンテキスト無限化・higher judgment）が随所で語られました。

---

## 2. 新機能・新サービス全体像

### 2-1. Claude Code 新機能（Cat Wu / Boris Cherny セッション）

| 機能 | 概要 | ステータス |
|---|---|---|
| **Code Review** | PR 単位でレビューを Claude が自動実施。Anthropic 全社で利用中 | GA |
| **Remote Agents** | スマホから PC（ラップトップ）の Claude Code セッションを操作 | プレビュー |
| **CI auto-fix** | PR に対して CI 失敗時の修正を Claude が自動コミット | プレビュー |
| **Security Reviews** | ブランチ全体にセキュリティレビューをかける `/security-review` の拡張 | GA |
| **Routines** | 高次プロンプトで非同期自動化。**「朝起きたら PR がマージ可能になっている」** | GA（v2.1.71+） |
| **Multi-session デスクトップ** | デスクトップアプリで複数セッションを並列管理 | GA |
| **Agent View**（`claude agents`） | 複数バックグラウンドセッションのフリート可視化ダッシュボード（Running/Blocked/Done のリアルタイム状態追跡）。`/bg` で背景化したセッションを横断管理 | **Research Preview（v2.1.139, 2026-05-11 PT 出荷）** |
| **`/goal` コマンド** | 完了条件（goal）を宣言し Claude が自律的に実装・テスト・デバッグを反復。`--tokens` / `--turns` / `--time` フラグでリソース制約、独立 supervisor が最終状態を検証 | **Research Preview（v2.1.139, 2026-05-11 PT 出荷）** |

> **2026-05 出荷確認**: カンファレンスで予告された **Agent View（`claude agents`）** と **`/goal` コマンド** は v2.1.139 (2026-05-11 PT / 2026-05-12 JST) で Research Preview としてリリースされました。詳細は [Claude Code バージョン履歴まとめ](/mdTechKnowledge/blog/claude-code-version-history) 該当バージョン節を参照。

### 2-2. Claude Managed Agents 新機能（Katelyn / Angela セッション）

| 機能 | 概要 | ステータス |
|---|---|---|
| **Multi-agent orchestration** | リードエージェントがフロントエンド／バックエンド／QA など専門サブエージェントを編成 | パブリックベータ |
| **Outcomes** | ルーブリック評価で結果を採点し、スコア閾値未達なら自動再試行 | パブリックベータ |
| **Dreaming** | 過去セッションを定期的に自己レビューしパターン抽出（Harvey 社で完了率約 6 倍） | リサーチプレビュー |

### 2-3. Advisor Strategy（コスト1/5の小型化パターン）

**Opus が小型モデル（Sonnet/Haiku）の出力をリアルタイムで advise** することで、**フロンティアモデル品質を 1/5 のコストで実現** する手法が公式に推奨されました。Eve 社（バイオ AI）の事例が紹介されています。

---

## 3. 注目セッション詳細

### 3-1. Remote Agents — 「スマホからラップトップを動かす」

Cat Wu のデモでは、**iPhone から自宅 Mac の Claude Code セッションを承認・修正・送信** する流れが示されました。

- ラップトップ側で `claude --remote-control` を有効化
- claude.ai または Claude モバイルアプリから接続
- **Esc／割り込み・キュー・モデル切替・`/exit` 等がモバイルから完全制御可能**（v2.1.110〜）
- **Push 通知** で「許可待ち」「完了通知」を即時配信
- 双方向認証は OAuth（既存トークン共有）

> **設計上の特徴**: Remote Agents はサーバー側で完結する「クラウド実行」ではなく、**ローカルマシンの Claude Code をリモート制御する** モデル。コードは依然としてローカルに留まり、開発者の機密リポジトリがクラウドに渡らない。

### 3-2. Code Review — Anthropic 全社で利用中

PR 作成時に Claude が自動的にレビューコメントを付ける機能。

- **`/review` または `claude review <PR_URL>`**（headless モードでも実行可）
- レビュー観点: 正しさ／保守性／パフォーマンス／セキュリティ／観測可能性／ドキュメント
- 並列マルチエージェントの `/ultrareview`（v2.1.111+）と並んで「**書く前に Claude にレビューさせる**」運用が推奨

### 3-3. Routines — 「朝起きたら PR が完成」

Boris Cherny が示した **Routines + Dreaming + Outcomes** の組み合わせデモ:

```
1. ユーザーが「次のスプリントで未着手の Issue 3 件を順に処理」と Routines に登録
2. 夜間、Claude Code が定期実行で順次 Issue を着手
3. Outcomes でスコア未達なら自己評価して再試行
4. Dreaming が「前回の失敗パターン」を memory に書き込み
5. 朝にはレビュー可能な PR が 3 件揃っている
```

詳細は [Claude Code /loop コマンドと Cron スケジューリング](/mdTechKnowledge/blog/claude-code-routines-guide/) を参照。

### 3-4. Multi-Agent Orchestration — 専門サブエージェントの並列稼働

リードエージェントが以下のような構造で動きます:

```
Lead Agent
├── Frontend Agent (UI/UX)
├── Backend Agent (API/DB)
└── QA Agent (test generation)
```

- 各サブエージェントは独立したコンテキストで並列実行
- リードエージェントが**契約（contract）ベース**で出力を検証
- コンフリクトはネゴシエーションプロトコルで解決

### 3-5. Webhook Support（一般提供）

外部ワークフローへの統合用 webhook が GA となりました。

| イベント種別 | トリガー |
|---|---|
| `tool_result` | ツール実行完了 |
| `agent_status` | planning / executing / completed / blocked |
| `error` | エージェント失敗時のアラート |

実装には **署名検証・冪等性キー・非同期コールバック** が標準で含まれます。

---

## 4. 顧客事例（紹介された主要 3 社）

| 顧客 | 規模 | 利用形態 |
|---|---|---|
| **Shopify** | 大手 EC プラットフォーム | Claude Code 全社採用、内製ツールチェーンと統合 |
| **Mercado Libre** | エンジニア **23,000 名** | 「**Q3（2026年7-9月）までに 90% 自律コーディング**」を目標に掲げる |
| **Eve（バイオ AI）** | 中規模スタートアップ | Advisor Strategy で **コスト 1/5** を実現 |
| **Amp**（参考事例） | エディタ系 | 計画モードを Sonnet → Opus 4.7 に切替で品質向上 |
| **Harvey（Legal AI）** | 中規模 | Dreaming 採用で **タスク完了率約 6 倍** |

Mercado Libre の「90% 自律コーディング」は、**人間レビュアーの役割が「コード書き」から「方針判断と最終承認」へシフト**することを意味し、Anthropic が提唱する「**Senior engineer as a reviewer**」モデルの典型例として強調されました。

---

## 5. インフラとレート制限

### 5-1. レート制限倍増（即日有効）

| プラン | 旧 (5時間) | 新 (5時間) |
|---|---|---|
| Pro | 100 リクエスト | **200 リクエスト** |
| Max | 500 リクエスト | **1,000 リクエスト** |
| Enterprise | （カスタム） | **Pro/Max ピーク時間制限を撤廃** |

詳細: [Anthropic Rate Limits API 完全ガイド](/mdTechKnowledge/blog/anthropic-rate-limits-api-guide/)

### 5-2. SpaceX Colossus 1 — 計算基盤

- **300+ MW、NVIDIA GPU 22万台超**
- 全容量を Anthropic が確保（1ヶ月以内にオンライン化）
- 既存の Google・Amazon・Microsoft・Nvidia・Broadcom・Fluid Stack との multi-gigawatt 契約に追加
- **軌道上（宇宙）AI コンピュート** への関心も Ami Vora が言及

詳細: [Anthropic コンピュートインフラ & TPUパートナーシップ](/mdTechKnowledge/blog/anthropic-tpu-compute-partnership/)

---

## 6. ロードマップと「次の Claude」

| 機能 | リリース | 確度 |
|---|---|---|
| 2× レート制限 | **Live now** | 100% |
| Dreaming（プレビュー） | **Live** | 95% |
| Multi-agent orchestration | **Developer Preview** | 90% |
| Webhook 対応 | **GA** | 100% |
| **Infinite context window** | Claude 5 / Mythos | 70% |
| **Higher judgment & code taste** | Claude 5 / Mythos | 60-70% |
| **Claude 5 / Mythos リリース** | 2026 年 9 月予定 | 60-70% |

「**Higher judgment**」とは、ベンチマークではなく **アーキテクチャ理解・保守性・スケーラビリティ・技術的負債回避** を最適化対象にしたモデル。「**Code Taste**」と命名されており、Anthropic が次に勝負する評価軸が「**コードの美意識**」であることを示唆しています。

---

## 7. 既存記事との対応マップ

| 発表項目 | カバーする mdTechKnowledge 既存記事 |
|---|---|
| Multi-agent orchestration | [Claude Managed Agents 簡易ガイド](/mdTechKnowledge/blog/claude-managed-agents-guide/) |
| Dreaming | [Claude Managed Agents Memory 完全ガイド](/mdTechKnowledge/blog/claude-managed-agents-memory/) |
| Outcomes | [Claude Managed Agents 簡易ガイド](/mdTechKnowledge/blog/claude-managed-agents-guide/) |
| Routines | [Claude Code /loop コマンドと Cron スケジューリング](/mdTechKnowledge/blog/claude-code-routines-guide/) |
| `/ultrareview` | [Claude Code /ultrareview ガイド](/mdTechKnowledge/blog/claude-code-ultrareview-guide/) |
| Push 通知（Remote Agents の通知部分） | [Claude Code Monitor & Push Notification](/mdTechKnowledge/blog/claude-code-monitor-push-notification/) |
| レート制限倍増 | [Anthropic Rate Limits API 完全ガイド](/mdTechKnowledge/blog/anthropic-rate-limits-api-guide/) |
| SpaceX Colossus 1 / インフラ | [Anthropic コンピュートインフラ & TPUパートナーシップ](/mdTechKnowledge/blog/anthropic-tpu-compute-partnership/) |
| Code with Claude 全体まとめ | **本記事** |

---

## 8. ツアー日程と参加方法

| 開催地 | 日付 | 状況 |
|---|---|---|
| サンフランシスコ | 2026-05-06 | 終了 |
| ロンドン | **2026-05-20〜21（PT） / 5/21（JST）** | 開催（旧 5/19 から日程更新） |
| 東京（メイン） | **2026-06-10** | **登録受付中**（現地参加・ライブストリームともに無料） |
| **東京 Extended** | **2026-06-11** | **登録受付中**（個人開発者・初期スタートアップ向け追加開催枠） |

東京（メイン, 6/10）はオンラインでのライブストリーム配信（バーチャル参加）が用意されており、現地参加が難しい場合も「Attend virtually」の登録で基調セッションを追跡できます。セッションは主に英語・一部日本語で、双方向の同時通訳が全編で提供されます。

> **2026-06-05 時点 補足**: ロンドンは当初 5/19 単日告知でしたが、2日間プログラムに拡張されて 5/20-21 開催に。東京はメインイベントが **6/10**（[claude.com/code-with-claude/tokyo](https://claude.com/code-with-claude/tokyo)）、さらに個人開発者・初期スタートアップ向けの追加枠 **東京 Extended が 6/11**（[claude.com/code-with-claude/tokyo-extended](https://claude.com/code-with-claude/tokyo-extended)）として個別ページで公開されています。最新情報は [公式ページ](https://claude.com/code-with-claude) で確認してください。

### 7-1. 東京（メイン, 6/10）の構成

東京メインイベントは **Research / Claude Platform / Claude Code** の3トラック構成で、08:00 のチェックイン・朝食から 20:00 のイブニングレセプションまで終日開催されます。

| 時間帯 | 内容 |
|---|---|
| 09:00–10:00 | オープニングキーノート |
| 10:30–12:30 | 午前セッション（3トラック並行）／「What's new in Claude Code」やエージェント開発ワークショップ等 |
| 12:30–14:00 | ランチ |
| 14:00 以降 | 午後セッション・企業事例（Canva・Rakuten・Mizuho 等） |
| 18:00–20:00 | イブニングレセプション |

### 7-2. 東京 Extended（6/11）の構成

Extended は **個人開発者・初期スタートアップ向け** の追加開催枠で、08:30〜18:00。**Founder stage / Builder stage / Workshops** の3トラックで構成されます。

- **Founder stage**: スタートアップ創業者がプロトタイプから初収益までの道のりや意思決定を語る
- **Builder stage**: 「ドメインエキスパートが自らソフトウェアを作れるようになると何が起きるか」等、実プロダクト出荷の実演
- **Workshops**: managed agents・エージェントメモリ・evals・マルチエージェント分解（multi-agent decomposition）、対戦形式の「Agent Battle」など実践ハンズオン

---

## まとめ

Code with Claude 2026 は **「次のモデルではなく、今あるモデルで何を作るか」** を主題にした、開発者カンファレンスとしては珍しい構成でした。注目すべきは:

1. **Remote Agents**: コードはローカル保護したまま、操作面はモバイル化
2. **Multi-agent orchestration + Outcomes + Dreaming**: 自律ループの完成形が見え始めた
3. **Mercado Libre の 90% 自律目標**: 大規模組織が「人間がコードを書かない」前提に移行する宣言
4. **Higher judgment（Claude 5）**: 評価軸が「正答率」から「コードの美意識」へ

エンジニアリング組織が Claude を使う場合、**「個人の生産性向上ツール」から「常駐するコードレビュアー兼ジュニアエンジニア」** への位置づけ変化が、2026 年後半の主要トレンドとなりそうです。

---

## 参考資料

- [Code with Claude（公式）](https://claude.com/code-with-claude)
- [Code w/ Claude 2026 — Simon Willison](https://simonwillison.net/2026/May/6/code-w-claude-2026/)
- [The Complete Guide to Autonomous Software Engineering — Atal Upadhyay](https://atalupadhyay.wordpress.com/2026/05/07/anthropics-claude-developer-conference-2026-the-complete-guide-to-autonomous-software-engineering/)
- [Anthropic 公式: Claude Managed Agents 新機能](https://claude.com/blog/new-in-claude-managed-agents)
- [Anthropic 公式: Higher limits — SpaceX](https://www.anthropic.com/news/higher-limits-spacex)
- [Anthropic 公式: Enterprise AI Services Company](https://www.anthropic.com/news/enterprise-ai-services-company)

---

*本記事は2026年5月9日時点の公開情報に基づきます。Anthropic の発表内容・ロードマップは変更される可能性があります。*
