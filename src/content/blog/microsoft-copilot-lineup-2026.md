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

---

## 2026年4月15日以降に必要なプラン

### 法人向け（商用テナント）

| 組織規模 | 変更内容 | 引き続き使うために必要なプラン |
|----------|----------|-------------------------------|
| **2,000席以上** | Word/Excel/PowerPoint/OneNote内のCopilot Chatが**完全廃止** | **Microsoft 365 Copilot**（$30/ユーザー/月）の購入が必須 |
| **300〜2,000席未満** | 「標準アクセス」に格下げ（混雑時に応答品質・速度が低下） | 無料枠は残る。フル機能は**Microsoft 365 Copilot**（$30/ユーザー/月）が必要 |
| **300席以下** | 同上（標準アクセスに格下げ） | 無料枠は残る。フル機能は**Microsoft 365 Copilot Business**（$21/ユーザー/月）が必要 |

- **有料のMicrosoft 365 Copilotライセンス保有者は変更なし**（引き続きフル機能を利用可能）
- ラベル変更：有料ユーザーは「**M365 Copilot (Premium)**」、無料ユーザーは「**Copilot Chat (Basic)**」と表示

### 個人向け

| プラン | 4月15日以降の影響 |
|--------|----------------|
| **Microsoft 365 Personal / Family** | 今回の変更は法人テナント向けのため**個人プランへの直接影響はなし**。月60クレジットの制限内でWord・Excel等のCopilotを引き続き利用可能 |
| **Microsoft 365 Premium**（$199/年） | クレジット上限なし。Researcher・Deep Research・Analyst等の機能を含む |

### 影響を受けないサービス

- **Outlook** → 対象外。4月15日以降も無料で継続利用可能
- **ブラウザ版 Copilot Chat**（copilot.cloud.microsoft）→ 引き続き無料利用可能
- **Copilotスタンドアロンアプリ** → 引き続き無料利用可能

### 変更の背景

Microsoftは2025年9月にCopilot ChatをOfficeアプリ内サイドパネルとして無料提供し始めたが、わずか半年足らずで方針を撤回。「エンタープライズグレードのAI機能は有料ティアが前提」と説明している。

---

## E3 / E5ライセンスへの当てはめ

### 重要前提：E3・E5にはCopilot（生産性AI）は含まれない

E3・E5はCopilot Chatへのアクセス前提資格にはなるが、Word/Excel等のCopilot機能は**別途アドオン購入が必要**。E5で追加されるのはSecurity Copilot（セキュリティ操作用AI）であり、Officeアプリ内のCopilotとは別物。

### E3 / E5 ライセンス別の影響まとめ

| ライセンス | 4月15日以降 Word/Excel/PPT内Copilot | 備考 |
|---|---|---|
| **M365 E3**（2,000席超） | 利用不可（完全廃止） | アドオンなし |
| **M365 E3**（2,000席未満） | 制限付きで継続（高需要時に劣化） | アドオンなし |
| **M365 E5**（2,000席超） | 利用不可（完全廃止） | E3と同じ扱い |
| **M365 E5**（2,000席未満） | 制限付きで継続（高需要時に劣化） | E3と同じ扱い |
| **E3/E5 + Copilotアドオン** | 完全利用可能（変化なし） | $30/ユーザー/月追加 |
| **Office 365 E3/E5**（旧来） | M365と同じルール適用 | ブランド差のみ |

### 引き続き使うための最安コース

**方針A：無料で継続する（Officeアプリ内はあきらめる）**
- ブラウザ版Copilot Chat / Outlook内Copilot / Teams内Copilot Chatは引き続き無料利用可能
- Word/Excel/PowerPoint/OneNote内の機能のみ失われる

**方針B：最小コストでOfficeアプリ内Copilotを維持する**
- E3/E5に**Copilotアドオンを追加**するのが唯一の正式ルート
  - 大企業（リスト価格）：**$30/ユーザー/月**
  - 300席以下のSMB：**$21/ユーザー/月**（Microsoft 365 Copilot Business）
  - EA契約の大企業は交渉で $23〜$28/月も可能
- 全社一律でなく**必要な部門・ロールのみに付与**することでコストを抑えられる（席単位で選択可能）

**方針C：上位プランへ移行（長期視点）**
- **Microsoft 365 E7**（$99/ユーザー/月）にはCopilotが統合含有。ただし大幅なコスト増になる

### 参考：E3/E5の値上げ予定（2026年7月1日〜）

| プラン | 現在 | 2026年7月〜 |
|---|---|---|
| M365 E3 | $36/ユーザー/月 | $39/ユーザー/月 |
| M365 E5 | $57/ユーザー/月 | $60/ユーザー/月 |

---

## E7 vs Microsoft 365 Copilot アドオン 徹底比較

### Microsoft 365 Copilot アドオン（$30/ユーザー/月）

E3またはE5ライセンスに追加できるAIアシスタント機能。**Excel・PowerPoint・Word内でのCopilot利用は可能。**

| アプリ | Copilot利用 | Agent Mode |
|--------|------------|------------|
| Word | ✅ | ✅ |
| Excel | ✅ | ✅（デスクトップ版GA済み） |
| PowerPoint | ✅ | ✅（4月末までにロールアウト完了予定） |
| Outlook | ✅ | ✅ |
| Teams | ✅ | ✅ |

- **Copilot Cowork**：Frontierプレビュー参加で利用可能（正式GA後はこのアドオンで利用可）
- **Agent 365**：❌ 含まれない（別途 $15/ユーザー/月）
- **前提**：E3またはE5ライセンスが別途必要

---

### Microsoft 365 E7（Frontier Suite）$99/ユーザー/月

**2026年5月1日より一般販売開始。E5の全機能にCopilot・Agent 365・Entra Suiteを一体化した統合スイート。**

#### 含まれるもの

| 機能 | 内容 |
|------|------|
| **M365 Copilot（$30相当）** | Word/Excel/PowerPoint/Outlook/Teams内のAI機能・Agent Mode |
| **Agent 365（$15相当）** | 企業内AIエージェントの統合管理基盤 |
| **Microsoft Entra Suite（$12相当）** | AIエージェントをIDとして管理・ガバナンス |
| **Work IQ** | ユーザーの作業パターン・組織ダイナミクスのセマンティックグラフ |
| **Copilot Cowork** | 長時間・多段階タスクの自律実行（Frontierプレビュー） |
| **E5の全機能** | Defender・Purview・Power BI Pro・Teams Phone System等 |

#### Agent 365 とは

企業内AIエージェントの**統合コントロールプレーン**。

- Microsoft製・パートナー製・カスタム全エージェントの一元管理
- 全エージェントの動作監視・ログ取得
- Microsoft Defenderと統合したエージェント向けセキュリティ
- AIエージェントを「従業員と同格の一級市民ID」として管理

---

### ライセンス全体比較表

| 機能 | E3（$39） | E5（$60） | Copilotアドオン（+$30） | E7（$99） |
|------|:---:|:---:|:---:|:---:|
| Word/Excel/PowerPoint Copilot | ❌ | ❌ | ✅ | ✅ |
| Outlook/Teams Copilot | ❌ | ❌ | ✅ | ✅ |
| Agent Mode（Office内） | ❌ | ❌ | ✅ | ✅ |
| Copilot Cowork | ❌ | ❌ | ✅（Frontierプレビュー） | ✅（同上） |
| Work IQ | ❌ | ❌ | ✅ | ✅ |
| Agent 365 | ❌ | ❌ | ❌ | ✅ |
| Microsoft Entra Suite | ❌ | ❌ | ❌ | ✅ |
| Security Copilot | ❌ | ✅（4月20日〜） | ❌ | ✅ |
| Defender全スイート | 一部 | ✅ | ❌ | ✅ |
| Purview全スイート | 一部 | ✅ | ❌ | ✅ |
| Power BI Pro | ❌ | ✅ | ❌ | ✅ |
| Teams Phone System | ❌ | ✅ | ❌ | ✅ |
| **前提ライセンス** | 単体完結 | 単体完結 | E3/E5が別途必要 | 単体完結 |
| **月額コスト** | $39 | $60 | +$30（E3/E5に追加） | $99 |

> ※ Copilotアドオン列は「E3またはE5に追加した場合の追加費用と機能」を示す。単体では購入不可。

---

### E7はE3/E5の上位版か？

E7はE3/E5の**垂直方向のティア上位版**（後継ではなく新層）。E5の全機能を内包した上でAI機能を追加。MicrosoftがE5以来2015年以来初めて新設した新ティア。

### 移行コストの比較

| 現在の構成 | 月額 | → E7 | 差額 |
|---|---|---|---|
| E3 + Copilotアドオン | $39+$30 = **$69** | $99 | **+$30**（Agent 365・Entraの対価） |
| E5 + Copilotアドオン | $60+$30 = **$90** | $99 | **+$9**（割安感あり） |
| E5 + Copilot + Entra + Agent 365 | $60+$30+$12+$15 = **$117** | $99 | **▲$18（約15%削減）** |

→ **E5ユーザーにとってE7はほぼコスト中立**で、Agent 365とEntra Suiteが付いてくるため5月以降は移行を検討する価値が高い。
