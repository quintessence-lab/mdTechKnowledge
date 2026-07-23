---
title: "これがラストチャンスかも③（完結編）— Claude Fable 5 が7月20日に最終決着、Max/Team Premium は「恒久組み込み」で恵まれた"
date: 2026-07-23
category: "Claude技術解説"
tags: ["Claude Fable 5", "Anthropic", "Usage Credits", "Max", "Team Premium", "SpaceX", "Colossus", "サブスクリプション", "従量課金", "容量"]
excerpt: "7月7日→12日→19日と2度延長された Claude Fable 5 の『サブスク内利用』は、2026年7月20日に最終決着した。Max / Team Premium は週間上限の50%として恒久的にプランへ組み込み（追加費用なし）、Pro / Team Standard は Usage Credits 継続＋一時$100クレジット。恒久化を可能にした背景は、SpaceX Colossus 1（300MW超・NVIDIA GPU 22万台超）の容量確保と推論効率の改善だ。プラン別の勝ち負け、なぜ Max/Team Premium が一番恵まれた結末になったのか、Pro 向けの実務を、ラストチャンス①②の続き・完結編として整理する。"
draft: false
---

> ## 要点
>
> - **2026年7月20日、Claude Fable 5 の扱いが最終決着**した（7/18 公式発表、7/20 施行）。2度の延長（7/7→7/12→7/19）の先は「3度目の延長」でも「一律 Usage Credits 移行」でもなく、**プラン別に道が分かれる**形だった。
> - **Max / Team Premium**：Fable 5 が**週間利用上限の50%として恒久的にプランへ組み込み**。クレジット購入も有効化操作も不要で、追加費用ゼロで常用できる。
> - **Pro / Team Standard**：**Usage Credits（従量課金）でのアクセスを継続**。ただし救済として**一時金$100のクレジット**が付与される。
> - **恒久化を可能にした背景**は、**SpaceX Colossus 1（300MW超・NVIDIA GPU 22万台超）の全容量確保**と推論効率の改善による容量問題の解消と報じられている。
> - 率直に言えば、**数か月の混乱を経て一番おいしい着地をしたのは Max / Team Premium**。月額は高いプランですが、最終的に「恒久・追加費用なし・クレジット管理不要」という最も気楽な立場を手にしました。
> - Claude Code の週間利用上限 +50% は **2026年8月19日まで**継続。

## はじめに — 「ラストチャンス」シリーズの完結

このシリーズは、Claude の最上位モデル **Fable 5** の「サブスク内で追加費用なしに使える枠」がいつ終わるのか、を追ってきました。

- [①（7/12延長版）](/mdTechKnowledge/blog/claude-fable-5-credit-period-extended/)：最初の延長と Usage Credits の仕組み
- [②（7/19延長版）](/mdTechKnowledge/blog/claude-fable-5-credit-period-extended-2/)：2度目の延長と、同時期に登場した GPT-5.6 Sol の影響

②の時点では「本日7/19が最終日。3度目の延長があるのか、予告どおり Usage Credits へ移行するのか」というところで筆を置いていました。その答えが **7月20日に確定**しました。結論から言うと、**どちらでもなく「プランによって扱いを分ける」**という第3の道でした。本稿はその最終決着と、そこから見える「勝ち負け」を整理する完結編です。

## 1. 7月20日の最終決着 — プラン別に道が分かれた

Anthropic は7月18日（PT）に最終方針を告知し、**7月20日から施行**しました。公式アナウンスは次の通りです。

> "Beginning July 20, Claude Fable 5 will be included in all Max and Team Premium plans, at 50% of limits. Pro and Team Standard users will continue to have access to Fable via usage credits, and will receive a one-time $100 credit."
> （7月20日より、Claude Fable 5 を Max・Team Premium の全プランに上限の50%として組み込む。Pro・Team Standard のユーザーは引き続き Usage Credits 経由で Fable にアクセスでき、一度きりの $100 クレジットを受け取る。）

プラン別に整理すると次のようになります。

| プラン | 7/20 以降の Fable 5 の扱い | 追加費用 | クレジット管理 |
|---|---|---|---|
| **Max（5x / 20x）** | **週間利用上限の50%として恒久組み込み** | **不要**（プラン内） | **不要** |
| **Team Premium** | **同上（恒久組み込み・上限50%）** | **不要**（プラン内） | **不要** |
| **Pro** | **Usage Credits 経由で継続** ＋ 一時 **$100** クレジット | クレジット消費（$100 使い切り後は従量） | 必要 |
| **Team Standard** | 同上（Usage Credits＋一時$100） | 同上 | 必要 |

補足として、**Claude Code の週間利用上限 +50% は 2026年8月19日まで**維持されます（こちらはモデル横断の別枠措置）。

つまり、②の末尾で心配していた「無料の猶予は終わってしまうのか」という問いに対する答えは、**Max / Team Premium には『終わるどころか恒久化』、Pro / Team Standard には『終わるが $100 の再チャンスつき』**という、非対称な決着でした。

## 2. 結局、Max / Team Premium が一番恵まれている

ここが本稿の主題です。数か月にわたる「停止 → 再開 → 延長×2 → 最終決着」というジェットコースターの末に、**最も気楽で得な立場に落ち着いたのは Max / Team Premium ユーザー**でした。

| 観点 | Max / Team Premium | Pro / Team Standard |
|---|---|---|
| 継続性 | **恒久**（プランの一部） | 従量（クレジット次第） |
| 追加費用 | **ゼロ**（プラン内50%枠） | $100 使い切り後は従量課金 |
| 事前準備 | **不要**（自動で使える） | Usage Credits の有効化が必要 |
| コスト予測 | **月額固定で読める** | 使うほど増える（上振れリスク） |
| 心理的負担 | **なし**（残枠を気にせず試せる） | 「1回いくら」を意識し続ける |

もちろん、Max（5x で月$100、20x で月$200）や Team Premium は**もともと月額が高いプラン**です。「高い金を払っているのだから当然」という見方もできます。それでも、**この数か月の不確実性を丸ごと回避し、最終的に『恒久・追加費用なし・クレジット管理不要』という三拍子そろった立場を得た**のは事実で、率直に言って **Max/Team Premium の人は恵まれています**。

- **「ラストチャンスかも」が杞憂に終わった**のは、実質 Max / Team Premium だけです。彼らにとって Fable 5 は「いつ切られるか分からない期間限定枠」から「プランに最初から入っている常備品」に格上げされました。
- 一方 Pro / Team Standard にとっては、タイトルどおり**サブスク内の無料枠は本当に終わり**ました。ただし $100 という**現金同等の再チャンス**が配られたので、「静かに打ち切り」ではなく「軟着陸」ではあります。

### Pro 目線での $100 の価値

$100 の一時クレジットが実際どれくらい使えるのか、Fable 5 の従量レート（入力 $10 / 出力 $50 per MTok）で概算します。

| 想定する1セッションの消費 | 概算コスト | $100 でおよそ |
|---|---|---|
| 入力 20万＋出力 4万トークン（重め） | 入力$2.0＋出力$2.0＝**$4.0** | **約25セッション** |
| 入力 5万＋出力 1万トークン（軽め） | 入力$0.5＋出力$0.5＝**$1.0** | **約100セッション** |

> あくまで目安です。新トークナイザで同一文章のトークン数が約30%増える点、長時間エージェント実行では1セッションのトークンが跳ね上がる点（②で触れた「1000倍」問題）を踏まえると、**重い使い方なら $100 は意外と早く溶けます**。「本当に Fable 5 が要る最難関タスクだけに使う」という割り切りが、Pro での費用対効果を左右します。

## 3. なぜ恒久化できたのか — 容量問題の解消

そもそも Fable 5 のサブスク枠が2度も延長され、扱いが二転三転したのは、**Fable 5 が Anthropic で最も計算資源を食うモデル**で、6月末〜7月の再開後に需要が既存データセンター契約の容量を超えていたからだと説明されてきました。その容量制約が解けたことが、恒久組み込みを可能にした——というのが報じられている背景です。

鍵になったのが **SpaceX Colossus 1** の全容量確保です。

| 項目 | 内容 |
|---|---|
| 契約発表 | 2026年5月6日（Anthropic × SpaceX） |
| 規模 | **NVIDIA GPU 22万台超**（H100 / H200 / 次世代 GB200）、**300MW超** |
| 立地 | 米テネシー州メンフィス |
| 形態 | Colossus 1 の**全 AI 計算容量を Anthropic が賃借** |
| 費用 | 月 **約$12.5億**（〜2029年5月） |

背景には皮肉な事情もあります。Colossus 1 はもともと **xAI（2026年に SpaceX へ統合）** の訓練用でしたが、xAI が自社訓練を **Colossus 2** へ移したことで Colossus 1 の稼働率が大きく下がっており、そこへ**競合の Anthropic が全容量を借り上げた**という構図です。つまり **Fable 5 の恒久組み込みは、ライバル陣営由来の計算資源に支えられている**とも言えます。

これに**推論効率（同じ出力をより少ない計算で出す最適化）の改善**が重なり、「最上位モデルをプランに常備しても供給が回る」水準に達した——というのが今回の決着の技術的な土台です。②で書いた「容量が整い次第サブスクに戻す」という Anthropic の当初説明は、**Max / Team Premium については文字どおり実現**した形になります。

> 注：Colossus 1 契約の規模・費用は公開情報に基づく事実ですが、「それが 7/20 の恒久化を直接可能にした」という因果は各種報道による解釈です。Anthropic が公式に「Colossus 1 ゆえに恒久化した」と明言したわけではない点は、切り分けておきます。

## 4. Pro / Team Standard 向けの実務（Usage Credits）

恒久組み込みの対象外となった Pro / Team Standard は、引き続き Usage Credits が実質の窓口です。要点だけ再掲します。

- **有効化の場所**：[claude.ai](https://claude.ai) の **Settings → Usage** で「usage credits（extra usage）」をオンにする。プラン内の通常枠を使い切った後、超過分を従量課金する仕組み（[Manage usage credits — Claude Help Center](https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans)）。
- **プラン枠は温存**：プランに含まれる通常利用は従来どおり。クレジットはプラン上限を超えてから消費されます。Fable 5 以外（[Opus 4.8](/mdTechKnowledge/blog/claude-opus-4-8-guide/)・[Sonnet 5](/mdTechKnowledge/blog/claude-sonnet-5-guide/)・Haiku 4.5 等）は引き続きプラン枠で使えます。
- **残高は単一プール**：usage bundle の残高は Claude / Desktop / モバイル / Claude Code / Cowork をまたぐ1プール（[Buy usage bundles — Claude Help Center](https://support.claude.com/en/articles/14246112-buy-usage-bundles)）。前払いバンドルなら最大30%割引。
- **まず $100 を計画的に**：付与される一時クレジットは一度きり。ばらまき利用ですぐ消えるので、「Sonnet 5 / Opus 4.8 で足りるタスクはそちらへ、Fable 5 は最難関だけ」という振り分けが基本方針になります。

## 5. シリーズ総括 — 「停止」から「常備」まで

改めて時系列で俯瞰すると、Fable 5 の数か月は次のような弧を描きました。

| 時期 | 出来事 |
|---|---|
| 6月12日 | 輸出管理を理由に Fable 5 / Mythos 5 が停止（19日間） |
| 7月1日 | 全世界で再開 |
| 7月7日 → 7月12日 → 7月19日 | サブスク内50%枠を2度延長 |
| **7月20日** | **最終決着：Max/Team Premium は恒久組み込み、Pro/Team Standard は Usage Credits＋$100** |

「最強モデルをいつまでタダ同然で触れるのか」という不安から始まった話は、**Max/Team Premium にとっては『恒久的にプランの一部になる』という最良の形**で、**Pro/Team Standard にとっては『無料枠は終わったが $100 の再チャンス付き』という軟着陸**で幕を閉じました。②で並べた「好意的な見方（容量が整えば戻す）」と「競争環境を踏まえた見方（GPT-5.6 Sol への防波堤）」のうち、少なくとも表向きは前者が現実になった格好です。

最後にもう一度だけ。**Max / Team Premium の人は、本当に恵まれています。** 数か月の不確実性を最後まで気にせずに済み、これからも追加費用ゼロで最上位モデルを常用できるのですから。Pro の方は、配られた $100 を「最難関タスク専用の弾」として、賢く使い切りましょう。

## 関連記事

- [これがラストチャンスかも②（7/19延長版）](/mdTechKnowledge/blog/claude-fable-5-credit-period-extended-2/) — 2度目の延長と GPT-5.6 Sol の影響（本稿の前編）
- [これがラストチャンスかも①（7/12延長版）](/mdTechKnowledge/blog/claude-fable-5-credit-period-extended/) — 最初の延長と Usage Credits の基礎
- [米政府、Claude Fable 5 と Mythos 5 を停止](/mdTechKnowledge/blog/claude-fable-5-export-control-suspension/) — 停止〜7/1再開までの経緯
- [Claude Fable 5 は Pro プランで使える？](/mdTechKnowledge/blog/claude-fable-5-pro-plan-availability/) — プラン別の可否とコスト評価
- [Claude Sonnet 5 完全ガイド](/mdTechKnowledge/blog/claude-sonnet-5-guide/) / [Claude Opus 4.8 完全ガイド](/mdTechKnowledge/blog/claude-opus-4-8-guide/) — 常用の代替モデル

## 出典

- [Claude 公式 @claudeai（2026-07-18）](https://x.com/claudeai/status/2078302415804379218) — Max/Team Premium 恒久組み込み・Pro/Team Standard の $100 クレジット
- [TechTimes: Claude Fable 5 Ends Subscription Limbo — Permanent for Max, Credits-Only for Pro](https://www.techtimes.com/articles/320905/20260718/claude-fable-5-ends-subscription-limbo-permanent-max-credits-only-pro.htm)
- [DAWN: Anthropic to add Claude's Fable 5 to Max, Team Premium plans at 50pc of usage limits](https://www.dawn.com/news/2016483)
- [DataCenterDynamics: Anthropic to use all of SpaceX-xAI's Colossus 1 data center compute](https://www.datacenterdynamics.com/en/news/anthropic-to-use-all-of-spacex-xais-colossus-1-data-center-compute/)
- [Tom's Hardware: SpaceX rents out Colossus 1 — 220,000 Nvidia GPUs and 300 MW — to Anthropic](https://www.tomshardware.com/tech-industry/artificial-intelligence/musks-spacex-has-rented-out-access-to-its-supercomputers-220-000-nvidia-gpus-and-300-megawatts-of-ai-compute-power-to-rival-anthropic-musk-says-no-one-set-off-my-evil-detector-antrhropic-also-interested-in-orbital-data-centers)
- [Buy usage bundles — Claude Help Center](https://support.claude.com/en/articles/14246112-buy-usage-bundles) / [Manage usage credits — Claude Help Center](https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans)
