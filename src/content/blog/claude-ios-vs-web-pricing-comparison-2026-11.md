---
title: "Claude を契約するなら iOS と Web どちらが安いか — 2026年11月版コスト比較"
date: 2026-11-07
category: "Claude技術解説"
tags: ["Claude", "Anthropic", "サブスクリプション", "料金", "iOS", "App Store", "コスト比較", "Pro", "Max", "Ultra", "為替", "Usage Credits"]
excerpt: "2026年11月7日時点で、Claude の個人プラン（Pro / Max / Ultra）を Web で直接契約した場合と iPhone アプリ（App Store）で契約した場合の費用を比較。10月30日に Max 5x が「Max」（$100）、Max 20x が「Ultra」（$200）へ改称されたが、価格は据え置きで、iOS の円価格（Pro 月額¥3,000・Pro 年¥35,000・Max ¥20,000・Ultra ¥40,000）も9月から変わらない。11月6日終値 $1≈¥158.45 で再計算すると、Pro 月額は iOS が月¥486安、Max は Web が月¥2,570安、Ultra は Web が月¥5,141安。Pro 年契約は Web が年¥141安（0.40%）とほぼ互角で、カードの海外事務手数料が0.4%を超えれば iOS が安くなる。あわせて、Ultra の認証（5時間制限）、追加利用（Usage Credits）のバンドルと12か月の失効、Max/Ultra の月次 API クレジット（iOS 契約でも対象）、Fable の扱いを整理する。"
draft: false
---

> ## 要点（2026年11月7日時点）
>
> - **改称**: 2026年10月30日（PT）に **Max 5x → Max（$100/月）**、**Max 20x → Ultra（$200/月）** へ改称。**価格は変わらず**、既存の Max 20x 契約者は自動で Ultra に移行します
> - **Pro（月額）**: **iPhone（App Store）が安い**。iOS ¥3,000 vs Web 実質 約¥3,486。**月 約¥486（約13.9%）iOS が安い**
> - **Pro 年契約**: **ほぼ互角（僅差で Web）**。iOS ¥35,000 vs Web 約¥34,859 で、**Web が安いのは年 約¥141（約0.40%）だけ**。カードの海外事務手数料が約0.4%を超えると iOS のほうが安くなります
> - **Max（$100）**: **Web 一択**。iOS ¥20,000 vs Web 約¥17,430 で、**月 約¥2,570（年 約¥30,840）Web が安い**
> - **Ultra（$200）**: **Web 一択**。iOS ¥40,000 vs Web 約¥34,859 で、**月 約¥5,141（年 約¥61,692）Web が安い**
> - **為替**: 11月6日終値 **$1≈¥158.45**（9月22日の¥157.4からわずかに円安）。iOS の円価格は固定なので、円安に振れるほど Web だけが高くなります
> - **日本では追加利用（Usage Credits）は Web 一択**。日本の App Store には商品がありません
> - **月次 API クレジット（Max $100／Ultra $200）は Web・iOS・Android のどれで契約しても対象**です。ここは iOS と Web で差が出ません

## 本記事の位置づけ

**2026年11月時点**の比較です。前回版は [【2026年9月版】](/mdTechKnowledge/blog/claude-plans-cost-comparison-2026-09/)（9月22日、$1≈¥157.4）で、**10月版はありません**。**iOS と Web の損得は為替に強く依存する**ため、契約時点のレートで再計算することをおすすめします。常に最新の状態に更新される比較や、過去版は次の記事を参照してください。

- [Claude を契約するなら iOS と Web どちらが安いか（全プラン・随時更新版）](/mdTechKnowledge/blog/claude-ios-vs-web-pricing-comparison/)
- [Claude Max を契約するなら iOS と Web どちらが安いか（Max 特化・随時更新版）](/mdTechKnowledge/blog/claude-max-web-direct-savings/)
- [【2026年9月版】Claude 全プラン費用比較](/mdTechKnowledge/blog/claude-plans-cost-comparison-2026-09/)（前回版）
- [【2026年8月版】Claude 全プラン費用比較](/mdTechKnowledge/blog/claude-plans-cost-comparison-2026-08/)
- API の単価は [Claude 料金まとめ](/mdTechKnowledge/blog/claude-pricing-overview/) を参照してください

**前提（11月6日・7日時点の値）**

| 項目 | 値 |
|:---|:---|
| 為替 | **$1 ≈ ¥158.45**（Yahoo!ファイナンスの USD/JPY、11月6日終値。11月2日〜6日の値幅は ¥157.21〜158.76） |
| Web の消費税 | **10%**（2026年4月1日から、Anthropic が適格請求書発行事業者として加算） |
| iOS 円価格 | **日本の App Store 実価格**（Pro 月額 ¥3,000・Pro 年 ¥35,000・Max ¥20,000・Ultra ¥40,000。2026年11月7日、アプリ v1.261104.19 で確認） |
| Web のドル価格 | claude.com/pricing（2026年11月7日確認。**税抜**） |

## 1. 11月最大の変化 — Max の改称と Ultra

2026年10月30日（PT）、Anthropic は @claudeai の X 投稿で、プラン名の変更を発表しました。

| 旧名称 | 新名称 | 月額（Web） |
|:---|:---|:---|
| Max 5x | **Max** | **$100** |
| Max 20x | **Ultra** | **$200** |

投稿の文言は「Max is still $100/month, and Ultra is still $200」です。**価格は変わらず**、既存の Max 20x 契約者は自動で Ultra に移行し、価格も変わりません。サブスクリプション担当のプロダクトリード（Mike Overell 氏）の X 投稿によると、最上位プランは2025年4月の発売時に5時間制限が Pro の20倍だったため「Max 20x」と名付けましたが、後から加えた週間制限は Pro の10倍だったことが、改称の理由とされています。

| プラン | 利用量（Pro 比、公式ヘルプ） |
|:---|:---|
| **Max（$100）** | **5時間ごと・週ごとに Pro の5倍** |
| **Ultra（$200）** | **週の利用量が Pro の10倍**。全モデル共通の週間上限と、Fable 専用の週間上限がある |

### Ultra の「5時間制限」と認証

公式ヘルプによると、**認証済み（verified）の Ultra アカウントには5時間制限がありません**。未認証のあいだは一時的な制限がかかり、認証されると自動で解除されます。

- 認証は、アカウントと支払いの履歴から**自動で判定**されます。購入時の電話番号認証では解除されません
- **設定 > 使用量** に「Current session」のバーが出なければ、認証済みです
- **App Store で契約した場合に認証の判定が変わるかは、公式に記載がありません**（本稿では断定しません）
- Ultra は**月払いのみ**です（年払いはありません）

なお、公式ヘルプの価格表記は Web 契約のものです。モバイルについては公式が「**Mobile pricing may vary depending on your app platform**（アプリのプラットフォームによって異なる場合があります）」と明記しています。

## 2. 契約経路は2系統ある

| 経路 | 価格の性質 |
|:---|:---|
| **Web 直接契約**（claude.com） | Anthropic が定価で提供。**米ドル建て**請求＋消費税10%。為替の影響を受ける |
| **iPhone アプリ契約**（App Store） | Apple 手数料の影響で多くのプランが割高。**日本円建ての固定価格**（税込）で、日々の為替では動かない |

機能は**完全に同等**です。Web で契約しても iPhone アプリ・デスクトップアプリで同一アカウントで利用できます。異なるのは**価格・請求通貨・領収書の名義**だけです。

**Team / Enterprise は App Store では契約できません**（Web・営業経由のみ。日本の App Store の課金一覧にも存在しません）。iPhone アプリから契約できるのは Free / Pro / Max / Ultra です。

### Web の価格（claude.com/pricing、税抜）

| プラン | 価格 |
|:---|:---|
| Free | $0 |
| Pro | $20/月、年払いなら $17/月（$200 一括） |
| Max | $100/月 |
| Ultra | $200/月（月払いのみ） |
| Team（2〜150席）Standard 席 | 年払い $20、月払い $25 |
| Team Premium 席（Standard の5倍の利用量） | 年払い $100、月払い $125 |
| Enterprise | US$20/席/月（年払い・最低20席）＋利用分を API 単価で課金 |

### 日本から Web で契約した場合の請求

- 公式の「日本のお客様向け消費税のお知らせ」によると、**2026年4月1日から全プランの価格に10%の消費税が加算**されます。**請求通貨は変わらず**、消費税額は適格請求書上で円で表示されます。適格請求書の登録番号は **T7700150134388** です
- Pro のヘルプには「対応地域では現地通貨で表示される」とありますが、対応通貨の一覧は見当たらず、**日本円で請求されることは確認できていません**。本稿は「**ドル＋10%**」で計算しています。**決済画面に円価格が出た場合は、その額で比較してください**
- **App Store 経由の契約では Anthropic は請求書を発行しません**。領収書は App Store のアカウントで確認できます
- **請求通貨の変更は、期間末で解約してから買い直す**必要があります。契約経路の移管（iOS ⇄ Web）も同じく「解約 → 新規契約」です

## 3. 米国価格（USD）— 11月も構造は同じ

| プラン | Web 月額 | Web 年契約 | iOS 月額 | iOS 年契約 | iOS 割高率 |
|:---|:---|:---|:---|:---|:---:|
| Free | $0 | — | $0 | — | — |
| **Pro** | **$20** | **$17/月（$200一括）** | $20.00 | $214.99 | 月: 同額 / 年: **+7.5%** |
| **Max** | **$100** | 月額のみ | **$124.99** | なし | **+25%** |
| **Ultra** | **$200** | 月額のみ | **$249.99** | なし | **+25%** |

（米国の App Store の価格。2026年11月7日確認）

Apple 手数料の転嫁パターンは9月と同じです。

| プラン | Anthropic の対応 |
|:---|:---|
| Pro 月額 | **吸収**（Web と同額） |
| Pro 年契約 | **一部転嫁**（+7.5%） |
| Max / Ultra | **完全転嫁**（+25%） |

**この USD 構造は為替が動いても変わりません。** 日本の Apple 手数料体系（21%＋決済5%）については、11月時点で再確認していません。詳細は [8月版の該当箇所](/mdTechKnowledge/blog/claude-plans-cost-comparison-2026-08/#2-米国価格usd8月も据え置き) を参照してください。

## 4. 日本価格（11月6日・$1≈¥158.45・税込実質）

Web 実質は「$ × 158.45 × 1.10」で計算しています。

| プラン | iOS（円建て・税込） | Web 実質 | 差 | 前回（9/22）の差 |
|:---|:---|:---|:---|:---|
| Pro 月額 | **¥3,000** | 約 ¥3,486 | **iOS が ¥486 安**（約13.9%） | iOS が ¥463 安 |
| **Pro 年契約** | ¥35,000 | **約 ¥34,859**（$200） | **Web が ¥141 安**（約0.40%） | Web が ¥372 安 |
| Max 月額 | ¥20,000 | **約 ¥17,430** | **Web が ¥2,570 安**（年 ¥30,840） | Web が ¥2,686 安 |
| Ultra 月額 | ¥40,000 | **約 ¥34,859** | **Web が ¥5,141 安**（年 ¥61,692） | Web が ¥5,372 安（Max 20x として） |

### 9月からの変化 — 円がわずかに安くなり、Pro 年契約の Web 優位はさらに縮小

理由は変わらず、**iOS は円固定・Web はドル建て**だからです。9月22日（¥157.4）より11月6日（¥158.45）のほうが約0.7%円安のため、Web 側だけがわずかに高くなりました。

| 逆転ライン | 内容 |
|:---|:---|
| Pro 月額 | **$1≈¥136.4 より円高**になると Web が逆転（当面は iOS が安いまま） |
| Pro 年契約 | **$1≈¥159.1 より円安**になると iOS が逆転。現在の¥158.45とは約0.4%しか離れていない |
| Max / Ultra | **$1≈¥181.8 より円安**になると iOS が逆転（現実的には Web 一択） |

**Pro 年契約**は、Web 契約がドル建て請求のため、**カードの海外事務手数料が0.4%を超えれば iOS のほうが安く**なります。カード会社ごとの手数料率は本稿では確認していないので、**お使いのカードの規約で確認**してください。

## 5. 追加利用（Usage Credits）— 日本では Web 一択

プランの上限を使い切ると、**追加利用（Usage Credits）の従量課金**に切り替わります。料金は標準の API 単価です。

### Web のバンドル（設定 > 使用量 > Buy usage）

| バンドル | 支払額 | 割引 |
|:---|:---|:---|
| $50 | $45 | 10% |
| $250 | $200 | 20% |
| $1,000 | $700 | 30% |

- **対象プラン**: Pro / Max / Ultra / Team
- **購入上限**: 個人は月 $2,000 分まで、Team は月 $3,000 分まで（超えた分は標準単価）
- **返金できません**（解約・アカウント削除時も同様）
- **自動チャージ（auto-reload）は Web だけ**です

### 有効期限

公式ヘルプによると、**2026年12月7日以降に購入した分は、購入から12か月で失効**します（国によって異なる場合があります）。**それより前に購入した分は失効しません**。失効前にはメールで通知されます。

### アプリ（iOS）での購入

アプリで買えるのは、**アプリ内課金がある地域だけ**です。**日本の App Store には Usage Credits の商品がありません**（2026年11月7日確認）。**日本で追加利用をするなら Web 一択**です。

参考までに、米国の iOS のクレジット価格は次のとおりで、Web のバンドルと割引率は同じです。

| 米国 iOS の商品 | 価格 |
|:---|:---|
| Usage Credits (20) | $20.00 |
| Usage Credits (50) | $45.00 |
| Usage Credits (100) | $90.00 |
| Usage Credits (250) | $200.00 |
| Usage Credits (500) | $350.00 |
| Usage Credits (1000) | $700.00 |

## 6. 月次 API クレジット — iOS で契約しても対象

Max と Ultra には、Claude API 用の**月次クレジット**が付きます。

| プラン | 月次クレジット |
|:---|:---|
| Max | **$100** |
| Ultra | **$200** |
| Team | Standard 席 $20・Premium 席 $100 をプールし、**上限は月 $500** |
| Free / Pro / Enterprise | **対象外** |

- **受け取り方**: 契約から**7日**たつと、claude.ai の **Settings > Billing** から Claude Console の組織をリンクして受け取れます。**リンクできる組織は1つだけ**で、リンク後は自分で変更できません
- **使える範囲**: Claude API・Console のプレイグラウンド・Managed Agents・Agent SDK
- **使えない範囲**: 対話型の Claude Code、アプリでの追加利用、Bedrock / Vertex / Foundry などの他プラットフォーム
- **有効期限**: 請求サイクルごとに失効し、繰り越しはありません
- **iOS・Android 契約でも対象**: 公式ドキュメントに「Claude for iOS / Android で購入したプランも対象。受け取りは Web の claude.ai で」と明記されています。**iOS と Web の比較で差が出ない点**です
- 英語版のヘルプ記事には Ultra の行がありません。プラットフォームのドキュメントと日本語版のヘルプには、Ultra $200 が載っています

> **読み方**: Ultra（月 $200 相当）に月 $200 の API クレジットが付くのは、API で何かを作る人にはほぼ実質値引きです。一方、Claude Code が中心の人には使えません。**API・Managed Agents・Agent SDK に用途が及ぶか**で価値が変わります。

## 7. Fable の扱い（サブスクでの費用に直結）

公式ヘルプ「Claude Fable models on your plan」によると、Fable 5 と 5.1 のプラン上の扱いは次のとおりです。

| プラン | 扱い |
|:---|:---|
| **Max / Ultra** | 標準でプランに含まれる。**週間上限の50%まで**は追加料金なしで Fable に使える（通常の週間上限から消費）。超えた分は Usage Credits か他のモデル |
| **Team Premium 席** | Max / Ultra と同じ |
| **Pro / Team Standard 席** | Fable は**プランの上限に含まれず、Usage Credits でのみ**利用できる |

Fable 5 を週間上限に含めていたプロモーションは、**2026-07-19 23:59:59 PT に終了**しています。Fable 5.1 には適用されたことがなく、Pro / Team Standard に付与された一時クレジットに相当するものも、Fable 5.1 にはありません。

> **結論**: Fable を本格的に使うなら **Max か Ultra** が前提です。そのうえで、日本では **Web 契約のほうが安い**（Max は月約¥2,570、Ultra は月約¥5,141）、という流れになります。Pro で Fable を使うと、使うたびに Usage Credits が消費されます。

## 8. どちらで契約すべきか（11月版）

| ユーザー像 | 推奨 | 理由 |
|:---|:---|:---|
| 個人 Pro（月額・コスト重視） | **iPhone アプリ** | ¥3,000 固定が Web 実質（約¥3,486）より月約¥486 安 |
| 個人 Pro（年契約を検討） | **どちらでも可（僅差で Web）** | 差は年約¥141（約0.40%）のみ。カードの海外事務手数料や、$1≈¥159.1 を超える円安で iOS が逆転する |
| 個人 Max | **Web 一択** | 月約¥2,570（年約¥30,840）安 |
| 個人 Ultra | **Web 一択** | 月約¥5,141（年約¥61,692）安。Ultra は月払いのみ |
| Fable を本格的に使う個人 | **Max / Ultra（Web）** | Pro は Fable が Usage Credits 扱い。Max / Ultra は週間上限の50%までプラン内 |
| 追加利用（Usage Credits）をよく買う | **Web 一択（日本）** | 日本の App Store に商品がない。Web なら最大30%引きのバンドルと自動チャージ |
| 法人・経費精算あり | **Web 一択** | Anthropic 名義の領収書・適格請求書（App Store 経由では Anthropic は請求書を発行しない） |
| Team / Enterprise | **Web / 営業経由のみ** | App Store では契約不可 |

> 最もコスパの良い構成は **「Web で契約して、iPhone アプリで使う」**（Max・Ultra の場合）。契約経路とアプリの利用先は独立しています。

## 9. 注意点

- **為替で結論が変わる** — 特に Pro 年契約は逆転ライン（$1≈¥159.1）まで約0.4%です。**契約時のレートで再計算**してください
- **決済画面の円価格を優先** — Web が日本円で表示された場合は、本稿の「ドル＋10%」ではなく、その額で比較してください
- **Web はカードの海外事務手数料に注意** — ドル建て請求のため、カード会社によっては手数料が上乗せされます。差が小さい Pro 年契約では結論が変わりえます
- **iOS の領収書は Apple 名義のみ** — 法人の経費処理・インボイスには不向きです
- **iOS は為替ヘッジになる** — 円安に振れても価格が動かないのは iOS の利点です。逆に円高では不利です
- **契約経路の移管は不可** — iOS ⇄ Web の切り替えは「解約 → 新規契約」が必要です
- **Ultra の認証の扱い（App Store 契約）は不明** — 公式に記載がありません
- **価格は変わりうる** — 公式ページに「プランと価格は変更されることがある」と記載されています

## まとめ

2026年11月の Claude プラン費用は、**「Pro 月額は iPhone、Max・Ultra は Web」**という9月からの構図が続いています。11月最大の話題は **Max 5x → Max、Max 20x → Ultra への改称**ですが、価格は据え置きで、iOS の円価格も変わっていません。ドル円がわずかに円安へ戻ったため、Web の優位は9月よりごくわずかに縮み、特に **Pro 年契約は年約¥141（約0.40%）差**と、ほぼ互角になりました。

判断が分かれやすいのは Pro 年契約だけで、ここはカードの海外事務手数料次第です。Max・Ultra と、日本での追加利用（Usage Credits）は Web が前提です。月次 API クレジットは契約経路を問わず付くため、API を使う人は Max・Ultra の実質負担がさらに下がります。

## 参考資料

- [Claude 料金プラン — Anthropic 公式](https://claude.com/pricing)（Web の価格の一次確認先）
- [Claude by Anthropic — App Store（日本）](https://apps.apple.com/jp/app/claude-by-anthropic/id6473753684)（iOS の円価格の一次確認先）
- [What is the Ultra plan? — Anthropic ヘルプセンター](https://support.claude.com/en/articles/17728952-what-is-the-ultra-plan)
- [What is the Max plan? — Anthropic ヘルプセンター](https://support.claude.com/en/articles/11049741-what-is-the-max-plan)
- [Usage credit bundles — Anthropic ヘルプセンター](https://support.claude.com/en/articles/14246112-usage-credit-bundles)
- [Usage credits（追加利用）— Anthropic ヘルプセンター](https://support.claude.com/en/articles/12429409)
- [API credits for Max, Ultra, and Team plans — Claude Platform ドキュメント](https://platform.claude.com/docs/en/about-claude/api-credits-for-subscribers)
- [Claude Fable models on your plan — Anthropic ヘルプセンター](https://support.claude.com/en/articles/15424964-claude-fable-models-on-your-plan)
- [日本のお客様向け消費税のお知らせ — Anthropic ヘルプセンター](https://support.claude.com/en/articles/14051822-notice-regarding-consumption-tax-jct-for-japanese-customers)
- [@claudeai の X 投稿（2026-10-30、Max / Ultra への改称）](https://x.com/claudeai/status/2116220869479428500)
- [【2026年9月版】Claude 全プラン費用比較](/mdTechKnowledge/blog/claude-plans-cost-comparison-2026-09/)
- [【2026年8月版】Claude 全プラン費用比較](/mdTechKnowledge/blog/claude-plans-cost-comparison-2026-08/)
- [Claude を契約するなら iOS と Web どちらが安いか — 随時更新版](/mdTechKnowledge/blog/claude-ios-vs-web-pricing-comparison/)
- [Claude Max を契約するなら iOS と Web どちらが安いか — 随時更新版](/mdTechKnowledge/blog/claude-max-web-direct-savings/)
- [Claude 料金まとめ（API 単価）](/mdTechKnowledge/blog/claude-pricing-overview/)
