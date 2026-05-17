---
title: "Claude for Small Business 完全ガイド — Cowork トグルで8コネクタ・15ワークフロー・15スキル"
date: 2026-05-18
category: "Claude技術解説"
tags: ["Claude", "Cowork", "SMB", "中小企業", "ワークフロー自動化", "コネクタ", "PayPal"]
excerpt: "2026年5月14日（JST）GAローンチした Claude for Small Business を解説。Claude Cowork のトグルで有効化し、QuickBooks/PayPal/HubSpot/Canva/DocuSign/Google Workspace/Microsoft 365 の8コネクタと連携。財務・営業・HR・CS の15ワークフロー＋15スキルを追加料金なしで提供。米国10都市の無料ワークショップ（AI Fluency for Small Business）も併走。"
draft: false
---

**最終更新**: 2026-05-18
**ローンチ**: 2026年5月13日（PT）/ 2026年5月14日（JST）
**提供形態**: Claude Cowork 内の新トグル（既存プラン内・追加料金なし）

---

## 1. はじめに — なぜ今 SMB（中小企業）向けか

Anthropic が中小企業（Small Business）市場に本格参入した。米国経済における SMB の存在感は大きい。

| 指標 | 値 |
|---|---|
| 米国 GDP に占める SMB の割合 | **約 44%** |
| 民間部門労働力に占める割合 | **約 50%** |
| 既存の AI 導入率（大企業対比） | 大幅に遅れている |

「チャットウィンドウを超えた実践的な AI 活用」が SMB にはまだ普及していない。理由は明確で、**専任のシステムエンジニアが不在**、**複数 SaaS の連携コストが高い**、そして **業務文脈に合わせたカスタマイズが難しい** ためだ。

Anthropic は既に法律・金融・ヘルスケア・教育の業種別ソリューションを提供しており、Claude for Small Business は **5番目の業界別バージョン** にあたる。今回は「業種」ではなく「企業規模」での切り出しで、より幅広いターゲットを狙う。

---

## 2. Claude for Small Business とは

**Claude Cowork 内の新トグル機能** として 2026年5月14日（JST）に正式公開された。Claude Cowork の既存基盤（マルチエージェント並列処理・ローカルファイルアクセス・サンドボックス実行）の上に、SMB 向けに **事前構築されたワークフロー・スキル・コネクタ** をパッケージ化したもの。

| 観点 | 内容 |
|---|---|
| 提供形態 | Claude Cowork 内のトグル ON/OFF で有効化 |
| 対象プラン | Claude Pro / Team / Enterprise（既存ライセンス内、**追加料金なし**） |
| 動作環境 | Claude Desktop（macOS / Windows）、iOS / Android |
| 認証・実行 | ユーザー承認後に自動実行（承認なしでは送信・投稿・支払いを行わない） |

既存の Claude Cowork ユーザーは、設定からトグル ON にするだけで利用開始できる。新規ユーザーは Pro 以上のプランに加入後、Cowork を有効化すれば同様に使える。

---

## 3. 8 つのコネクタ統合 — 主要 SaaS への接続

Claude for Small Business は以下の **8 つの SaaS コネクタ** を標準サポートする。「あなたが支払っていることを忘れているサブスクリプション」を Claude 経由で統合的に操作できるようにする発想だ。

| コネクタ | カテゴリ | 主な機能 |
|---|---|---|
| **Intuit QuickBooks** | 会計 | 給与計画、月次決算、キャッシュフロー管理 |
| **PayPal** | 決済 | 決済処理、請求書管理、紛争対応、払い戻し |
| **HubSpot** | CRM | リード分類、顧客把握、キャンペーン分析 |
| **Canva** | デザイン | コンテンツ生成・編集・公開、パフォーマンス追跡 |
| **DocuSign** | 電子契約 | 契約署名、ステータス追跡、実行済み文書ファイリング |
| **Google Workspace** | グループウェア | Gmail・スプレッドシート・ドキュメント・カレンダー統合 |
| **Microsoft 365** | グループウェア | Outlook・Teams・Excel・Word・PowerPoint 統合 |
| **拡張枠** | — | 業種別ビジネスアプリへの追加対応予定 |

これらのコネクタは Claude Cowork から **ユーザー承認** のもとで API 経由で操作される。例えば「先月の請求書未払いリストを取得し、HubSpot で顧客スコアを更新、催促メールを Gmail から送信する」というクロスツール処理が、1 つのプロンプトで完結する。

---

## 4. 15 のワークフロー — 業務領域別の事前構築テンプレート

Claude for Small Business には **15 本の自動化ワークフロー** が事前構築されている。業務領域別の内訳は以下の通り。

| 業務領域 | ワークフロー例 |
|---|---|
| **財務（Finance）** | 月次請求書発行、決算データ集約、経費承認ルーティング、月末準備、税務準備 |
| **営業（Sales）** | パイプライン自動更新、見積書・提案資料生成、商談後フォロー自動実行 |
| **マーケティング** | キャンペーン実行、リード評価・スコアリング、月次レポート自動生成 |
| **HR（人事）** | 給与計算準備（QuickBooks/PayPal 連携）、採用フロー管理、従業員データベース同期 |
| **カスタマーサクセス** | サポートチケット管理、顧客フォローアップ、NPS・満足度追跡 |

各ワークフローは「テンプレート」として配布され、SMB は自社の業務フローに合わせて部分カスタマイズできる。フルスクラッチで Claude にプロンプトを書く必要はなく、**「使うワークフローをトグル ON にするだけ」** で動作する。

---

## 5. 15 のスキル — 再利用可能な Claude 実行ロジック

ワークフローとは別に、**15 のスキル** が同時公開された。スキルは「フォルダベースの軽量ロジック」で、ワークフロー内から組み合わせて呼び出される。

| スキル分類 | 内容例 |
|---|---|
| 財務分析 | マージン分析、ビジネスパルス取得、キャッシュフロー予測 |
| 業務自動化 | 給与計画、月次決算、月末準備、税務準備 |
| 営業支援 | リード分類、商談スコアリング、契約レビュー |
| マーケティング | キャンペーン実行、コンテンツ戦略、パフォーマンス分析 |
| 請求・回収 | 請求書催促、紛争処理、払い戻し処理 |

スキルとワークフローの違いは「粒度」と「再利用性」にある。スキルは **1 つの定型タスク** を担当し、ワークフローは **複数スキルを連鎖** させて業務全体を自動化する構造だ。

---

## 6. アーキテクチャと安全性

Claude for Small Business は Claude Cowork を基盤としており、技術的には以下の二層構造で動作する。

| 層 | 役割 |
|---|---|
| **スキル（Skills）** | フォルダベースの軽量ロジック。単一タスクを担当 |
| **プラグイン（Plugins）** | より広範な機能統合。複数スキル・複数コネクタを束ねた業務単位 |

### 実行前承認プロセス

すべての外部送信・投稿・支払い処理は **ユーザーが事前承認** したうえで実行される。Claude は以下のような確認画面を提示する。

```
[実行内容の確認]
- 対象: HubSpot
- 操作: 商談ステータスを「失注」に更新（顧客 ABC Corp）
- 影響: CRM レコード変更
[承認] [却下] [修正]
```

これにより、**自動化されながらも誤操作・誤送信のリスクが構造的に低い** 設計になっている。SMB のオーナーが「AI に丸投げして意図しない請求書が送られる」事態を防ぐ。

### 既存ライセンス内で動作

新規製品ではなく既存の Claude Cowork の拡張機能として提供されるため、**追加課金は発生しない**。Pro / Team / Enterprise プランの既存サブスクリプション内ですべての機能が使える。

---

## 7. AI Fluency for Small Business — 米国 10 都市の無料ワークショップ

製品ローンチと並行して、Anthropic は PayPal と共同で **米国 10 都市の無料ワークショップツアー** を開催する。

| 項目 | 内容 |
|---|---|
| 共同開催 | Anthropic × PayPal |
| 開始日 | 2026年5月14日（シカゴ） |
| 対象 | 地域起業家 100 名/回 |
| 形式 | 半日無料トレーニング |
| 特典 | 参加者に **1 ヶ月の Claude Max サブスクリプション** 提供 |

開催都市一覧:

| 開催順 | 都市 |
|---|---|
| 1 | シカゴ（Chicago） |
| 2 | タルサ（Tulsa） |
| 3 | ダラス（Dallas） |
| 4 | ハミルトン・タウンシップ（Hamilton Township） |
| 5 | バトンルージュ（Baton Rouge） |
| 6 | バーミンガム（Birmingham） |
| 7 | ソルトレイクシティ（Salt Lake City） |
| 8 | ボルチモア（Baltimore） |
| 9 | サンノゼ（San Jose） |
| 10 | インディアナポリス（Indianapolis） |

「実践的な AI スキル習得」を目的とし、Claude for Small Business の使い方を中心に、コネクタ設定・ワークフロー選択・カスタマイズ手法までをカバーする。

---

## 8. Anthropic の業界別戦略における位置づけ

Claude for Small Business は、Anthropic の **業界別バージョン戦略の 5番目** にあたる。

| 順 | 業界別バージョン | ローンチ時期 |
|---|---|---|
| 1 | Claude for Life Sciences（生命科学） | 2025年 |
| 2 | Claude for Education（教育機関） | 2025年 |
| 3 | Claude for Legal（法律） | 2026年5月12日 PT |
| 4 | Claude for Financial Services（金融） | 2026年5月 |
| 5 | **Claude for Small Business（SMB）** | **2026年5月13日 PT** |

業種別から **企業規模別** への拡張は、Anthropic の市場戦略の幅を広げる象徴的な動きと言える。法律・金融のような専門業種では「業務知識の組み込み」が差別化要因だったが、SMB 向けでは「複数 SaaS の統合とワークフロー自動化」が中心になる。

---

## 9. 関連製品・既存記事との関係

Claude for Small Business は単独製品ではなく、Anthropic エコシステムの一部として動作する。以下の既存記事と合わせて理解すると全体像が見えやすい。

| 関連記事 | 関係性 |
|---|---|
| `claude-cowork-updates.md` | 基盤の Claude Cowork のリリース・機能更新まとめ。本記事は Cowork の SMB 向け拡張として位置付けられる |
| `claude-managed-agents-guide.md` | クラウド側の Managed Agents との比較。Small Business は Cowork ベースなのでローカル実行寄り |
| `claude-excel-powerpoint-addin.md` | Microsoft 365 コネクタの一部として Excel/PowerPoint アドインが連携対象に含まれる |

---

## 10. 利用開始の流れ

1. Claude Pro / Team / Enterprise プランに加入（既加入なら不要）
2. Claude Desktop / iOS / Android で Claude Cowork を起動
3. 設定画面で「Claude for Small Business」トグルを ON
4. 接続したい SaaS コネクタを認証（QuickBooks / PayPal など、OAuth フロー）
5. 事前構築ワークフローから業務に合わせたテンプレートを選択
6. 必要に応じてスキルを組み合わせてカスタマイズ
7. 実行 → Claude が承認画面を提示 → ユーザー承認 → 自動実行

---

## まとめ

- **2026年5月14日（JST）GA**: Claude Cowork 内の新トグルとして提供開始
- **8コネクタ統合**: QuickBooks / PayPal / HubSpot / Canva / DocuSign / Google Workspace / Microsoft 365
- **15ワークフロー + 15スキル**: 財務・営業・マーケ・HR・CS の事前構築テンプレート
- **追加料金なし**: 既存 Pro / Team / Enterprise プラン内で利用可能
- **承認ベース実行**: 外部送信前に必ずユーザー承認、誤操作リスクを構造的に低減
- **米国10都市ワークショップ**: PayPal 共催、100名/回・半日無料・Claude Max 1ヶ月付き
- **業界別戦略の5番目**: 業種から企業規模への拡張

SMB 経営者・店舗オーナーにとって、複数 SaaS を横断する定型業務を「トグル ON」だけで自動化できる意義は大きい。専任エンジニア不要で導入できる点も、これまで AI 導入のハードルが高かった SMB 市場への突破口となる。

---

## 参考リンク

- [Anthropic 公式: Claude for Small Business](https://www.anthropic.com/news/claude-for-small-business)
- [SiliconANGLE: Anthropic launches Claude Small Business](https://siliconangle.com/2026/05/13/anthropic-launches-claude-small-business-new-automation-workflows/)
- [The Decoder: Anthropic launches Claude for Small Business](https://the-decoder.com/anthropic-launches-claude-for-small-business-to-embed-ai-into-the-tools-you-forgot-you-pay-for/)
- 元 Issue: [#74 [新規記事候補] Claude for Small Business](https://github.com/quintessence-lab/mdTechKnowledge/issues/74)
