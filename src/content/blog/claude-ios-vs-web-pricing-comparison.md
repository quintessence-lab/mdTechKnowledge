---
title: "Claude を契約するなら iOS と Web どちらが安いか — 2026年5月版コスト比較"
date: 2026-05-05
updatedDate: 2026-06-17
category: "Claude技術解説"
tags: ["Claude", "Anthropic", "サブスクリプション", "iOS", "App Store", "料金", "コスト比較", "Agent SDK credits", "プログラマティック利用", "API課金"]
excerpt: "Anthropic Claude を契約する際、claude.com 直接契約と iOS App Store 経由とで料金がどう違うかを2026年5月時点の情報でまとめ。Pro/Max・年契約・日本価格・インボイス対応に加え、2026年6月15日施行予定だった課金分離（インタラクティブ利用 vs プログラマティック利用＝Agent SDK / claude -p / Claude Code GitHub Actions）の概要と Web/iOS への影響まで整理。【2026-06-17更新】この課金分離は施行当日に一時停止され、現在は従来どおりサブスク枠（料金比較への影響なし）。詳細は別記事参照。"
draft: false
---

## はじめに

Anthropic Claude のサブスクリプションは、**claude.com から直接契約**する方法と、**iOS の Claude アプリから App Store 経由で契約**する方法の2系統があります。前者は Anthropic 側が定価で提供、後者は Apple の手数料（標準 30%、小規模事業者は2年目以降 15%）の影響で **多くのプランで割高** になります。

本記事では2026年5月時点の公開情報を基に、両者の料金差・運用面の違い・どちらで契約すべきかを整理します。

> 本記事の為替前提: **$1 = ¥150**

---

## 1. Web（直接契約）vs iOS App Store 価格比較（米国・USD）

| プラン | Web（claude.com）月額 | Web 年契約 | iOS App Store 月額 | iOS 年契約 | iOS 割高率 |
|:---|:---|:---|:---|:---|:---:|
| Free | $0 | — | $0 | — | — |
| **Pro** | **$20** | **$17/月（$200一括）** | $20.00 | $214.99 | 月: 同額 / 年: **+7.5%** |
| **Max 5x** | **$100** | 月額のみ | **$124.99** | なし | **+25%** |
| **Max 20x** | **$200** | 月額のみ | **$249.99** | なし | **+25%** |

ポイント:

- **Pro 月額**: 米国では Web / iOS いずれも $20 で同額（Anthropic が手数料を吸収）
- **Pro 年契約**: Web $200 / iOS $214.99 で **約 $15 の差**（+7.5%）
- **Max は両プランとも +25% の差**: 月 $25（Max 5x）/ 月 $50（Max 20x）の追加負担
- iOS の **Max には年契約が存在しない**（月額のみ）

---

## 2. 日本価格（参考）

| プラン | iOS（日本円表示） | Web（米ドル決済換算） |
|:---|:---|:---|
| Pro 月額 | **¥3,400（約 $21.29）** | $20（約 ¥3,000）+ 消費税 |

日本では **iOS の方が約 ¥400 程度割高** になります。Apple の地域別価格設定の影響で、米ドル換算でも Web より高くなる構造です。

> Max プランの公式日本円表示は2026年5月時点で限定的なため、最新は App Store と claude.com で各自確認推奨。

---

## 3. 機能・運用面の違い

| 観点 | Web 直接契約 | iOS App Store 経由 |
|:---|:---|:---|
| 機能差 | **なし** | **なし**（同一プランなら同じ） |
| 解約・プラン変更 | claude.com 設定画面から | Apple ID の購読管理から |
| 領収書 | **Anthropic 名義**（インボイス対応可） | **Apple 名義のみ** |
| 法人経費・インボイス対応 | ◎ | △（Apple 名義のため経費処理に難あり） |
| プラン移管 | Web ⇆ iOS 切替は **不可**（解約→再契約必要） | 同上 |
| クロスプラットフォーム利用 | Web で契約 → iOS / Desktop アプリでも同アカウントで利用可 | 同上 |
| 支払い手段 | クレジットカード等 | Apple Pay / 各種 Apple 課金手段 |

両者は **機能上は完全に同等**で、契約経路と料金、領収書発行元のみが異なります。

---

## 4. iOS が割高になる理由

Apple App Store のサブスクリプションは、**Apple が 30% のコミッション**を取る仕組みです（小規模事業者プログラムでは2年目以降 15% に減額）。

Anthropic はこのコミッションを以下のように扱っています:

| プラン | 対応 |
|:---|:---|
| Pro 月額 | **Anthropic が吸収**（同額提供） |
| Pro 年契約 | **一部転嫁**（+7.5%） |
| Max 5x / 20x | **完全転嫁**（+25%） |

Max の高額プランは利用者あたりの金額が大きいため、Apple コミッション分を Anthropic が吸収しきれず、価格に反映されている形です。

---

## 5. 結論：どちらで契約すべきか

**安く済ませたい・法人で経費処理したいなら Web（claude.com）一択**。

| ユーザー像 | 推奨 |
|:---|:---|
| 個人 Pro ユーザー（月額のみ） | **Web 推奨**（米国は同額だが日本は差あり、年契約への切替時にも有利） |
| 個人 Pro ユーザー（年契約検討中） | **Web 一択**（$15 / 年安い） |
| 個人 Max ユーザー | **Web 一択**（月 $25〜$50 の差は無視できない） |
| 法人・経費精算が必要 | **Web 一択**（Apple 名義領収書はインボイス対応に難） |
| Apple サブスク管理を集約したい個人 | iOS でも可（コスト差を許容できる場合） |

iOS の利点は **Apple ID で購読を一括管理できる手軽さ**くらいで、コスト面では基本的に Web が有利です。

> Web で契約しても iOS / Desktop アプリで同一アカウントで利用できる ため、**「Web 契約 + iOS アプリ利用」が最もコスパが良い構成**になります。

---

## 6. 注意点

- **クロスプラットフォーム移管不可**: 既に iOS で契約している場合、Web に切り替えるには **一度 iOS 側で解約 → Web で新規契約** の流れが必要
- **未使用期間の返金**: Apple 経由は Apple のポリシー（部分返金は条件付き）、Web は Anthropic のポリシーが適用される
- **値上げ・キャンペーン**: Web 側の方が新価格・割引キャンペーンが先行することが多い

---

## 7. インタラクティブ利用 vs プログラマティック利用の課金分離は「一時停止」された（2026-06-17 更新）

> **🚨 2026-06-17 更新**: この課金分離は **施行予定日（2026年6月15日）当日に Anthropic が公式に一時停止（pause）** しました（公式サポート記事冒頭 *"For now, nothing has changed."*）。**現在は課金プール分離は行われておらず、Agent SDK・`claude -p`・GitHub Actions も含めすべて従来どおりサブスク枠から消費**されます。本記事の Web/iOS 料金比較（インタラクティブ利用前提）への影響も**現状なし**、いま claim 等の対応は不要です。白紙撤回ではなく形を変えた再開はありうるため、当初設計を以下に残します。詳細は [Claude Agent SDK / claude -p 課金分離ガイド](/mdTechKnowledge/blog/claude-agent-sdk-billing-split/) を参照。

当初の発表では、2026年6月15日（PT）より Claude サブスクリプションの **課金プールが「インタラクティブ利用」と「プログラマティック利用」の2系統に分割**される予定でした。チャットや端末での対話的な Claude Code といった **インタラクティブ利用は従来のサブスク枠のまま**で、Agent SDK・`claude -p`・GitHub Actions などの **プログラマティック利用は独立した月次クレジットプール（API標準レートで消費）に分離**される、という設計です（**現在は一時停止中**。以下は再開に備えた当初設計）。

> 本セクションは **概要と Web / iOS 契約比較への影響レベル**の整理にとどめます。施行内容の詳細（クレジットの claim 手順・枯渇時のオーバーフロー課金・各プランの内訳など）は **別記事（予定）** で扱います。

### 月額 Agent SDK credits（プラン別）

| プラン | 月額 Agent SDK credits |
|---|---|
| **Pro** | **$20** |
| **Max 5x** | **$100** |
| **Max 20x** | **$200** |
| Team (Standard seats) | $20 |
| Team (Premium seats) | $100 |
| Enterprise (usage-based) | $20 |
| Enterprise (seat-based Premium seats) | $200 |

### どの利用がどちらに分類されるか

| 区分 | 該当する利用 |
|---|---|
| **プログラマティック利用**（独立クレジットプールを消費） | Claude Agent SDK（Python / TypeScript の自プロジェクト）、`claude -p` コマンド、Claude Code GitHub Actions、Agent SDK ベースの第三者エージェント／フレームワーク（OpenClaw・Conductor・Zed・Jean など） |
| **インタラクティブ利用**（従来サブスク枠で継続） | Claude.ai の Web / デスクトップ / モバイルのチャット、ターミナル・IDE での対話的な Claude Code、Claude Cowork、その他 credit を消費しない機能 |

### Credits 枯渇時の挙動・リセット

- **`usage credits`（extra usage）を有効化済**: 超過分は **API 標準レート**（$3 / 百万入力トークン・$15 / 百万出力トークン）で従量課金（オーバーフロー課金は**手動でON/OFF切替**）
- **未有効化**: プログラマティック利用（Agent SDK リクエスト等）は **次回月次リフレッシュまで自動停止**（インタラクティブ利用には影響なし）
- **月次リセット**: クレジットは毎月リセットされ、**未使用分のロールオーバー（繰り越し）は不可**で失効する

### 開始条件・通知

- **一度きりの opt-in（claim）が必要**（アカウント画面から手動有効化）、以降は月次自動リフレッシュ
- 該当ユーザーには **2026年6月8日ごろ案内メール**が届く予定（内容: opt-in / claim 手順 + credits 受領方法）。**施行は6月15日**で、それまでに claim する流れ
- API キー（Claude Platform）のみ利用ユーザーは対象外（従来どおり pay-as-you-go 継続）

### Web vs iOS 比較への影響

| 観点 | 内容 |
|---|---|
| **iOS App Store 契約者** | Agent SDK credits の opt-in 自体は **Web 経由（claude.com アカウント設定）でのみ可能** と推定。iOS 単独で契約している場合は Web アカウントとの紐付けを確認 |
| **コスト計算前提** | Agent SDK を業務利用するユーザーは、本セクションの credits 額を月額サブスク料金に対する **実質的なボーナス価値**として加味 |
| **Web 契約優位性の強化** | プログラマティック利用を伴うユーザーは、Web 契約で credits 完全活用 + 必要なら usage credits も追加できるため、コスト最適化の余地が iOS よりさらに広がる |

> **注意**: 6月15日以降の正確なメニュー UI・iOS との連動仕様は施行後に追加情報が出る可能性があります。本記事は公式発表（[Claude Support 公式記事](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan)）および各報道時点の情報を反映しています。**この課金分離の詳細解説は別記事（予定）で扱います。**

---

## 参考資料

- [Plans & Pricing — Claude](https://claude.com/pricing)
- [How do I sign up for Claude Pro on the iOS app — Claude Help Center](https://support.claude.com/en/articles/9266495)
- [Apple Developer: App Store サブスクリプション手数料](https://developer.apple.com/app-store/subscriptions/)
- [Use the Claude Agent SDK with your Claude plan — Claude Support](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan)
- [Anthropic Splits Claude Subscriptions: Separate Budgets for Programmatic Use — The Decoder](https://the-decoder.com/claude-subscriptions-get-separate-budgets-for-programmatic-use-billed-at-full-api-prices/)
- [Anthropic Splits Claude Subscriptions With Agent SDK Credit Coming June 2026 — The New Stack](https://thenewstack.io/anthropic-agent-sdk-credits/)

---

*本記事は2026年5月時点の公開情報に基づきます。価格・プラン体系は予告なく変更される可能性があります。最新情報は claude.com と App Store で各自確認してください。*
