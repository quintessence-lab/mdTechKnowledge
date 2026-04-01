---
title: "Microsoft Copilot 種類・ラインナップ総まとめ（2026年4月時点）"
date: 2026-04-02
category: "その他技術"
tags: ["Microsoft", "Copilot", "Excel", "PowerPoint", "M365", "Agent Mode"]
excerpt: "Excel・PowerPoint連携を中心に、Copilotの全種類・機能・制限事項を整理。Agent Modeの対応状況・できること・できないことを網羅。"
draft: false
---

Excel・PowerPoint連携を中心に、Copilotの全種類・機能・制限事項を整理する。

---

## Copilot 全種類一覧

### 1. Microsoft 365 Copilot（ビジネス・企業向け主力）

Microsoft 365アプリ（Word / Excel / PowerPoint / Outlook / Teams等）に深く統合されたAIアシスタント。

| プラン | 価格 | 対象 |
|---|---|---|
| **Copilot Chat**（無料枠） | 無料（M365サブスク必須） | M365を持つすべてのEntra IDユーザー |
| **Copilot Business** | $18/ユーザー/月（2026年6月末まで促進価格）→ 標準$21 | 300ユーザー以下の中小企業 |
| **Copilot Enterprise** | $30/ユーザー/月（年払い） | エンタープライズ向け |
| **Microsoft 365 E7（Frontier Suite）** | $99/ユーザー/月（2026年5月1日提供開始） | 大企業向け最上位バンドル |

**重要：2026年4月15日以降、Word・Excel・PowerPoint・OneNote内の無料Copilot Chatパネルが廃止または大幅制限。**

---

### 2. Copilot（無料版・個人向け）

Microsoftが提供する一般消費者向け無料AIアシスタント。copilot.microsoft.comやWindows組み込みで利用可能。Web検索グラウンドの回答・画像生成・文書作成を無料で提供。

---

### 3. Copilot Pro（個人向け有料）

| 項目 | 内容 |
|---|---|
| 価格 | $20/月 |
| 対象 | 個人ユーザー |
| 特徴 | 最新モデル（GPT-4o等）への優先アクセス。Microsoft 365 Personal/Familyとの組み合わせでWord・Excel等のCopilot機能が利用可能 |

---

### 4. Copilot+ PC（ハードウェア認定）

特定のNPU（Neural Processing Unit）を搭載したPCの認定ブランド。AIをローカルで高速処理できる。

主な機能：
- **Recall（リコール）**: 過去の操作履歴を自然言語で検索
- **Live Captions with Translation**: 40言語以上のリアルタイム音声翻訳・字幕
- **Cocreator（画像生成）**: テキスト/画像プロンプトからリアルタイムで画像生成
- **Windows Studio Effects**: ビデオ通話の照明補正・視線修正・ノイズキャンセル

---

### 5. GitHub Copilot（開発者向け）

| プラン | 価格 | 主な内容 |
|---|---|---|
| **Free** | 無料 | コード補完2,000回/月、プレミアムリクエスト50回/月 |
| **Pro** | $10/月 | 無制限コード補完、Coding Agent付き |
| **Pro+** | $39/月 | 全モデルへのフルアクセス、大容量リクエスト |
| **Business** | $19/ユーザー/月 | 組織管理、Coding Agent、ポリシー管理 |
| **Enterprise** | $39/ユーザー/月 | Businessの全機能＋エンタープライズ機能 |

2026年3月時点でAgent Mode（コード自動実行）、Copilot Memoriesがリリース済み。

---

### 6. Copilot Cowork（2026年3月 Wave 3 新機能）

Microsoft 365 Copilotの新動作モード。単なる質問応答を超えて、**長時間・多段階タスクを自律的に実行**する。Anthropic（Claude）との共同開発。

- 複雑なリクエストをステップに分解し、ファイルやツールを横断して推論・実行
- スケジューリング・ブリーフィング生成・予算レビュー等の定型業務を自動処理
- 進捗の可視化・途中介入・停止が可能
- 2026年3月30日よりFrontierプログラム参加者へ提供開始

---

### 7. Microsoft Security Copilot（セキュリティ担当者向け）

セキュリティインシデント対応・脅威ハンティング・脆弱性管理に特化した生成AI。

| 利用形態 | 内容 |
|---|---|
| スタンドアロン | SCU（Security Compute Unit）単位で課金、1 SCU/時間から |
| E5バンドル | M365 E5の1,000ライセンスにつき月400 SCU（最大10,000 SCU）を追加費用なしで利用可 |

---

### 8. Copilot Studio（ローコードエージェント作成）

カスタムAIエージェントをローコード/ノーコードで作成・公開するためのプラットフォーム。

| 課金方式 | 内容 |
|---|---|
| Copilot Creditパック | 25,000クレジット/月 = $200/パック |
| Pay-as-you-go | 使用分のみ課金（Azure経由） |
| 内部エージェント | M365内でのビルド・利用は使用量無制限 |

---

### 9. Agent 365（2026年5月1日提供開始）

Copilot Coworkの機能を中心とした次世代エージェント機能。$15/ユーザー/月で単体提供。E7（Frontier Suite）にも含まれる。

---

## ExcelとCopilotの連携（詳細）

**Agent ModeはExcelデスクトップ版（2026年3月以降チャンネル）でGA（一般提供）済み。**

### できること

| 機能カテゴリ | 具体的な機能 |
|---|---|
| **ワークブック作成** | 自然言語プロンプトから新規スプレッドシートを生成。Webデータを参照してリアルタイムコンテキストを付加 |
| **数式・関数** | 破損した数式の自動修復、数式の説明・提案・挿入 |
| **データ可視化** | グラフ・PivotTable・テーブルの自動生成 |
| **シナリオモデリング** | What-if分析、収益/予算/予測の仮定調整 |
| **Webサーチ統合** | 最新データをソース引用付きで取得してセルに反映 |
| **マルチステップ実行（Agent Mode）** | ステップバイステップのプランを作成し、複数シートにわたって実行 |
| **モデル選択** | OpenAI（GPT-4o等）またはAnthropicのClaudeモデルを切り替えて使用可 |
| **ローカルファイル対応** | OneDrive/SharePoint以外のローカル保存ファイルにもAgent Mode対応 |

### できないこと・制限事項

- **EU・UKではAgent Mode未提供**（地域制限）
- **Pythonを使った高度分析（App Skills）はAgent Modeと非対応**
- **現在開いているワークブックのみ操作可能**（他ファイル・エンタープライズデータへのアクセス不可）
- **変更前のプレビュー機能なし**（直接編集されるため共有・機密ファイルはリスクあり）
- **旧バージョン（永続ライセンス）では非対応**

---

## PowerPointとCopilotの連携（詳細）

**Agent ModeはWeb版が2026年3月中旬から展開開始。Windows/Mac版は2026年4月末までに完了予定。**

### できること

| 機能カテゴリ | 具体的な機能 |
|---|---|
| **プレゼンテーション作成** | 自然言語プロンプトからスライドアウトライン・フルデッキを生成 |
| **対話型反復作成（Agent Mode）** | マルチターン会話でターゲット層・スタイル等を確認しながら生成 |
| **Brand Kit統合** | 組織のブランドガイドライン（色・フォント・スタイル）を自動適用 |
| **リライト・翻訳（Agent Mode）** | スライドテキストの書き換え・翻訳をAgent Modeで実行 |
| **スピーカーノート生成** | スライドごとの発表者メモを自動生成 |
| **SharePoint連携** | 組織のSharePoint内ブランドアセットをAgent Modeで参照 |
| **Word文書からの生成** | 既存のWord文書を元にプレゼン作成 |

### できないこと・制限事項

- **テキスト部分書き換え（Partial rewrite）は非対応**（スライド全体単位のみ）
- **テーブル・グラフ・テキスト以外のオブジェクトへのRewriteは非対応**
- **対応言語は現時点で英語（en-us）のみ**（他言語のリクエストは非対応）
- **翻訳ではEnglish・Spanishの地域バリアント（en-GB等）は非対応**
- **Agent Mode（Brand Kit含む）はFrontierプログラム参加者のみ** → 2026年4月末までに一般展開予定

---

## Wave 3（2026年3月）以降の新機能まとめ

| 機能 | 概要 | 状況 |
|---|---|---|
| **Copilot Cowork** | 長時間・多段階タスクの自律実行（Anthropic Claude連携） | Frontierプログラムで提供中 |
| **Frontier Suite（E7）** | M365 Copilot + Agent 365 + Entra + E5セキュリティのバンドル（$99/月） | 2026年5月1日提供開始 |
| **Agent 365** | 次世代エージェント機能単体提供（$15/月） | 2026年5月1日提供開始 |
| **PowerPoint Agent Mode** | 3月中旬からWeb版展開、4月末までWindows/Mac展開完了予定 | ロールアウト中 |
| **Excel Agent Mode GA** | デスクトップ版で一般提供開始 | GA済み |
| **Claude（Anthropic）モデル統合** | CopilotでOpenAI / Anthropic Claude両モデルを自動選択または手動切替 | 展開中 |
| **Copilot Chat廃止（Office内）** | Word・Excel・PowerPoint・OneNote内の無料Copilot Chatパネルを廃止 | 2026年4月15日〜 |
