---
title: "Microsoft Copilot Cowork アップデートまとめ"
date: 2026-04-01
updatedDate: 2026-05-04
category: "その他技術"
tags: ["Microsoft", "Copilot", "Cowork", "M365", "Claude", "エージェント"]
excerpt: "MicrosoftとAnthropicが共同開発したClaude基盤のM365エージェント機能。リリースタイムライン・主要機能・制限事項・ライセンス体系を整理。2026年5月1日にMicrosoft 365 E7スイートとして正式GA。"
draft: false
---

**最終更新**: 2026-05-04
**注記**: Copilot Coworkはバージョン番号が公式に付番されていないため、リリース段階・時系列で整理しています。

---

## 概要

Copilot CoworkはMicrosoftとAnthropicが共同開発した**Claude基盤のMicrosoft 365エージェント機能**。2026年3月9日（Wave 3）に正式発表。「チャットして回答を得る」モデルを超え、**長時間・複数ステップのタスクを自律的に実行**することを目的とする。

---

## リリースタイムライン

| 日付 | 内容 |
|------|------|
| 2025年12月8日 | M365管理センターにAnthropicサブプロセッサー切替UIが出現。商用クラウドでデフォルトON（EU/EFTA/UKはデフォルトOFF） |
| 2026年1月7日 | Anthropicがサブプロセッサーとして正式有効化。旧来のオプトイントグル廃止 |
| 2026年3月9日 | **Copilot Cowork 正式発表**（Wave 3）。プライベートプレビュー開始 |
| 2026年3月下旬 | Frontierプログラム参加者へ広範展開 |
| 2026年5月1日 | Microsoft 365 E7スイートとしてGA（一般提供）開始 — $99/ユーザー/月 |

---

## 主要機能

### Work IQ（作業コンテキスト把握）
Outlook・Teams・Excel・OneDrive・SharePointなどのシグナルを横断的に参照し、ユーザーの業務コンテキストを自動把握。

### 自律的なマルチステップ実行
例：顧客ミーティング準備として以下を一括実行
1. 資料作成
2. 財務データ収集
3. チームへのメール送信
4. スケジュール調整

### タスク進捗の可視化・介入
タスク実行中にユーザーが途中で介入・修正できる制御機能。

### マルチモデル選択
Claude（Anthropic）と次世代OpenAIモデルを単一インターフェースで選択可能。

---

## Wave 3 同時発表の関連アップデート

| 機能 | 内容 |
|------|------|
| GPT-5.2 / 5.3 / 5.4 Thinking | 新モデル追加 |
| Word・Excel・PowerPoint Agent Mode | Office アプリへの直接統合 |
| Outlookエージェント | カレンダー管理・メール起草の自動化 |
| Copilot Chat モデル選択UI | Claude をCopilot Chat内で直接選択可能 |
| MCP Apps対応 | Model Context Protocol アプリ統合 |
| Agent 365 | 組織規模の運用管理機能 |
| Copilot Studio | モデル作成時にClaudeを選択可能 |

---

## 対応プラットフォーム

| プラットフォーム | 対応状況 |
|----------------|---------|
| Microsoft 365 Copilot（Web・デスクトップ・モバイル） | Claude統合済み（UI上でモデル切替可能） |
| Teams | Work IQのシグナルソースとして統合 |
| Outlook | カレンダー・メール管理エージェントとして統合 |
| Excel / Word / PowerPoint | Agent Mode対応（Claude選択可能） |
| Copilot Studio | モデル作成時にClaudeを選択可能 |
| 政府クラウド（GCC/GCC High/DoD） | **未対応**（FedRAMP未取得） |
| ソブリンクラウド | **未対応** |

---

## 既知の制限・注意点

1. **EUデータ境界の除外**: AnthropicモデルはEUデータ境界・UK内処理コミットメントの対象外。EU/EFTA/UKではデフォルトOFF、管理者のオプトインが必要
2. **政府・ソブリンクラウド非対応**: GCC、GCC High、DoD、ソブリンクラウドでは利用不可
3. **データレジデンシーのリスク**: オーストラリア・NZなど一部地域では、Claudeにルーティングされた時点でオンショア処理の保証が失われる
4. **監査証跡の課題**: CoworkがユーザーのIDで操作を実行するため、既存コンプライアンスフレームワークとの整合性に課題
5. **閉域網環境での制限**: Claude推論はAnthropicインフラ上で実行（Azure外部）のため、完全閉域網環境では利用困難
6. **段階的展開中**: 2026年3月時点では全組織に展開済みではない

---

## ライセンス・価格

| プラン | 価格 | 内容 |
|--------|------|------|
| Copilot Cowork アドオン | $30/ユーザー/月 | Cowork機能単体 |
| Microsoft 365 E7 | $99/ユーザー/月 | Coworkを含む新スイート（**2026年5月1日GA済み**） |