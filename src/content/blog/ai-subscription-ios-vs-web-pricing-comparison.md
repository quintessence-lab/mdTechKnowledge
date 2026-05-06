---
title: "Claude / Gemini / ChatGPT — iOS と Web どちらで契約するのが本当に安いか（2026年5月版）"
date: 2026-05-06
updatedDate: 2026-05-06
category: "一般リサーチ"
tags: ["Claude", "Gemini", "ChatGPT", "サブスクリプション", "iOS", "App Store", "料金比較", "Apple"]
excerpt: "主要AIサービス3社（Claude / Gemini / ChatGPT）について、iOS App Store経由とWeb直接契約の料金差を整理。Apple 30%コミッションの転嫁パターン（完全転嫁・部分転嫁・吸収）と日本円固定価格の為替逆転現象まで解説。"
draft: false
---

## はじめに

主要な AI チャットサービスはどれも、**Web からの直接契約**と **iOS App Store のアプリ内課金** の2系統で契約できます。一見すると同じプランなのに、契約経路によって **月額が最大 30% 異なる** ことがあるため、知らずに iOS で契約すると無駄な出費になる可能性があります。

本記事では、Claude / Gemini / ChatGPT の3社について、Web vs iOS の価格差を **2026年5月時点の公開情報**に基づいて整理します。

> 為替前提: **$1 = ¥150**

---

## 1. なぜ料金差が生まれるのか — Apple 30% コミッション

Apple App Store のアプリ内課金には **30% の手数料**（小規模事業者プログラム該当時は2年目以降 15%）が課せられます。AI サービス事業者はこの手数料を以下のいずれかの形で扱います:

| 対応パターン | 内容 | 利用者から見た料金 |
|:---|:---|:---|
| **完全転嫁** | 手数料分を価格に上乗せ | iOS の方が **+30% 程度** 高い |
| **部分転嫁** | 一部だけ価格に乗せる | iOS の方が **+5〜25%** 高い |
| **完全吸収** | 事業者が手数料を負担 | iOS と Web が **ほぼ同額** |

このパターンは事業者ごとに異なり、**3社で見事に分かれる**のが面白いポイントです。

---

## 2. 主要3社の価格比較表（米国 USD ベース）

| サービス / プラン | Web 月額 | iOS 月額 | 差額 | コミッション扱い |
|:---|:---|:---|:---|:---|
| **Claude Pro** | $20 | $20 | **同額** | 吸収（月額のみ） |
| Claude Pro 年契約 | $17/月相当（$200/年） | $214.99/年 | +7.5% | 部分転嫁 |
| **Claude Max 5x** | $100 | **$124.99** | **+25%** | 部分転嫁 |
| **Claude Max 20x** | $200 | **$249.99** | **+25%** | 部分転嫁 |
| **Gemini AI Pro** | $19.99 | $19.99 前後 | **ほぼ同額** | 吸収 |
| **Gemini AI Ultra** | $249.99 | 同額の報告 | ほぼ同額 | 吸収方向 |
| **ChatGPT Plus** | $20 | **$26** | **+30%（$6 差）** | **完全転嫁** |
| ChatGPT Pro | $200 | 地域差あり（実質ほぼ同額〜転嫁有） | 不明確 | 不明確 |

### 一目で見える3社の違い

```
        Web → iOS の値上がり率
        0%        10%        20%        30%
Gemini  ▏                                     ← ほぼ無差（Google が吸収）
Claude  ▏▏▏▏▏▏▏▏ (Pro月額0% / Pro年7.5% / Max 25%)  ← 部分転嫁
ChatGPT ▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏▏  ← 完全転嫁
```

---

## 3. サービス別に見るパターン解説

### 3-1. Claude（Anthropic）— 部分転嫁

| プラン | iOS 値上がり |
|:---|:---|
| Pro 月額 | 0%（同額） |
| Pro 年契約 | +7.5% |
| Max 5x / 20x | +25% |

**Pro 月額のみ価格を据え置き**、Pro 年契約と Max は Apple 手数料を一部転嫁する戦略。Max ユーザーの場合、月 $25〜$50 の差は無視できません。

### 3-2. Gemini（Google）— 完全吸収

iOS の Gemini アプリ内課金でも、Web の Google AI Pro / Ultra と **ほぼ同額**で契約できます。Google 側が Apple 手数料を吸収しており、利用者は契約経路を気にする必要がありません。

> ただし日本では円建て固定価格（¥2,900 等）になっており、為替によって細かい差が出ることはあります。

### 3-3. ChatGPT（OpenAI）— 完全転嫁

Web 月額 $20 に対し iOS 月額 **$26**（+30%）と、Apple 手数料を **そのまま価格に上乗せ**するスタイル。AI Plus を年単位で使うと **$72 の差**（年）が発生します。

---

## 4. 日本円固定価格 vs USD建てWebの為替逆転

ここが意外と知られていない注意点です。

App Store の日本価格は **円建て固定**（例: ChatGPT Plus iOS = ¥3,000）。一方、Web 側は **USD 課金**で消費税が乗ります（例: ChatGPT Plus Web = $22 ≒ ¥3,300）。

| サービス | iOS 日本（円固定） | Web 日本（USD換算 + 消費税） | 為替条件次第の優位 |
|:---|:---|:---|:---|
| ChatGPT Plus | ¥3,000 | 約 ¥3,300 | **iOS の方が安い** |
| Claude Pro | ¥3,400 | 約 ¥3,000 + 消費税 | Web の方が安い |
| Gemini AI Pro | ¥2,900 | 約 ¥2,900 + 消費税 | ほぼ同額（Web わずかに高い） |

**ChatGPT 日本ユーザーは iOS が逆に安い**という現象が起きます。Apple が円相場を即時には反映せず固定価格を維持するため、円安局面ではドル建て Web の方が高くつくのが理由です。

---

## 5. サービス別 推奨契約方法

| 利用シナリオ | 推奨 |
|:---|:---|
| **Claude Pro 月額のみ（米/同等）** | どちらでも同額。手軽さで iOS、領収書なら Web |
| **Claude Pro 年契約** | **Web** 一択（$15 / 年安い） |
| **Claude Max** | **Web** 一択（月 $25〜$50 安い） |
| **Gemini AI Pro / Ultra** | **どちらでも OK**（価格差ほぼなし） |
| **ChatGPT Plus（米）** | **Web** 一択（月 $6 安い、年 $72 差） |
| **ChatGPT Plus（日本）** | **iOS** が ¥300 安いケースあり（為替次第） |
| **法人・経費精算が必要** | **Web** 一択（インボイス対応のため） |

---

## 6. その他の注意点（共通）

| 観点 | Web 直接契約 | iOS App Store 経由 |
|:---|:---|:---|
| 機能差 | なし | なし（同一プランなら同じ） |
| 解約・プラン変更 | 各サービス設定画面 | Apple ID の購読管理 |
| 領収書 | 事業者名義（**インボイス対応**） | Apple 名義のみ |
| 法人経費 | ◎ | △（Apple 名義のため処理に難） |
| Web ⇆ iOS 切替 | **不可**（解約 → 再契約が必要） | 同上 |
| クロスデバイス利用 | Web で契約してもアプリで利用可 | 同上 |

---

## 7. まとめ

| 結論 | 内容 |
|:---|:---|
| **「迷ったら Web」は正しい** | ChatGPT/Claude Max/年契約はすべて Web が安い |
| **Gemini は例外** | Google が手数料を吸収しているため、どちらでもよい |
| **ChatGPT 日本は逆転** | 為替次第で iOS が安いケースがある |
| **法人は Web 一択** | インボイス対応のため契約経路選択肢は事実上 Web のみ |

3社のパターンが綺麗に **「完全転嫁（ChatGPT）」「部分転嫁（Claude）」「吸収（Gemini）」** に分かれているのは、各社の価格戦略・ユーザー層・Apple との関係性を反映しています。サブスクを始める前に **必ず Web 価格と iOS 価格を見比べる** クセをつけておけば、年間で数万円規模の差になることもあります。

---

## 関連記事

- [Claude を契約するなら iOS と Web どちらが安いか — 2026年5月版コスト比較](/mdTechKnowledge/blog/claude-ios-vs-web-pricing-comparison/)
- [Claude vs Gemini 完全比較 — 有料プラン・NotebookLM・Gemini CLI・画像生成API料金（2026年5月版）](/mdTechKnowledge/blog/claude-vs-gemini-comparison-2026-05/)

---

## 参考資料

- [Plans & Pricing — Claude](https://claude.com/pricing)
- [Google AI Plans (Google One)](https://one.google.com/about/google-ai-plans/)
- [ChatGPT Plans — OpenAI](https://chatgpt.com/pricing/)
- [Apple Takes Its 30% Bite From AI Innovation — Decrypt](https://decrypt.co/142309/apple-takes-its-30-bite-from-ai-innovation-costing-openai-millions)
- [Apple Developer: App Store サブスクリプション手数料](https://developer.apple.com/app-store/subscriptions/)

---

*本記事は2026年5月時点の公開情報に基づきます。各サービスの料金・ポリシーは予告なく変更される可能性があります。最新情報は各社公式と App Store で確認してください。*
