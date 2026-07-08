---
title: "これがラストチャンスかも — Claude Fable 5「サブスク内利用」が7月12日まで延長"
date: 2026-07-08
category: "Claude技術解説"
tags: ["Claude Fable 5", "Anthropic", "Usage Credits", "従量課金", "サブスクリプション", "Pro プラン", "クレジット", "延長"]
excerpt: "当初2026年7月7日で終わるはずだった Claude Fable 5 の『サブスク内利用（週間上限の最大50%まで追加費用なし）』が、7月12日まで5日間延長された（Anthropic 公式 @claudeai 発表）。7月13日以降はプリペイドの Usage Credits（入力$10/出力$50 per MTok）へ移行する。Anthropic は『一時的な容量措置で、キャパシティが許せばサブスクへ戻す意向』と表明しており、この延長がサブスク内で触れる“最後の猶予”になる可能性がある。延長の中身、7/13以降の実像、7/12までに取るべき行動を整理する。"
draft: false
---

> ## 要点
>
> - **当初 7月7日**で終わる予定だった Claude Fable 5 の**「サブスク内利用（週間上限の最大50%まで追加費用なし）」が、7月12日まで5日間延長**された（Anthropic 公式 **@claudeai** で発表）。
> - **〜7月12日**：Pro / Max / Team・一部 Enterprise は従来どおりサブスク内で Fable 5 を利用可。**7月13日以降はプリペイドの Usage Credits（従量課金）へ移行**。
> - **7/13 以降の価格**：入力 **$10 / 出力 $50**（per MTok）＝ **Opus 4.8（$5/$25）のちょうど2倍**。プロンプトキャッシュで入力90%割引。
> - **Anthropic の説明**：これは**一時的な容量（capacity）措置**であり、**キャパシティが許せば Fable 5 をサブスクプランへ戻す意向**。つまり「恒久有料化」ではないが、**戻る保証も時期も未定**。
> - だから**「ラストチャンスかも」**：7/12 が「サブスク内で気軽に Fable 5 を触れる最後の猶予」になる可能性がある一方、将来サブスクに戻る可能性も残る、という二面性。

## 何が起きたか — 5日間の延長

Anthropic は、輸出管理解除で 2026年7月1日に全世界再開した最上位モデル **Claude Fable 5** について、有料プラン内での無料利用枠の期限を**当初の7月7日から7月12日まで5日間延長**しました。発表は Anthropic 公式アカウント **@claudeai** で行われ、各メディア（The New Stack ほか）が同日報じています。

| 項目 | 内容 |
|---|---|
| 当初の期限 | 2026年7月7日 |
| **延長後の期限** | **2026年7月12日**（+5日） |
| 対象プラン | Pro / Max / Team・一部（premium）Enterprise |
| 無料枠の中身 | **週間利用上限の最大50%まで**、追加費用なしで Fable 5 |
| 7月13日以降 | プリペイドの **Usage Credits（従量メーター課金）**へ移行 |
| 発表元 | Anthropic 公式 **@claudeai** |

対象サーフェスは Claude.ai / Claude Code / Cowork。**Standard Enterprise 席は当初から無料枠の対象外**で、クレジットを有効化しないと Fable 5 は起動しません。

## なぜ「ラストチャンスかも」なのか

見出しに「**かも**」が付くのは、相反する2つの事実があるからです。

**① 7/12 で「サブスク内で気軽に試せる期間」がいったん終わる**
7月13日以降、Fable 5 は**サブスクの定額枠には含まれず**、プリペイドの Usage Credits を有効化しないと使えなくなります（後述のとおり高単価）。「追加費用ゼロで Fable 5 を触る」という意味では、**7/12 がラストチャンス**になり得ます。

**② ただし Anthropic は「サブスクに戻す意向」を明言している**
一方で Anthropic は、今回の従量課金化は**一時的な容量（capacity）措置**であり、**キャパシティが許せば Fable 5 を通常のサブスクリプションプランへ戻す意向**だと表明しています。恒久的な有料アドオン化を狙っているわけではありません。つまり「二度とサブスクで使えなくなる」わけではない——**戻る時期は未定**ですが。

この二面性ゆえに、断定の「ラストチャンス」ではなく「**ラストチャンス“かも”**」が正確です。無料でじっくり試したいなら 7/12 までに動くのが安全、というのが実務的な結論になります。

## 7月13日以降の実像 — Usage Credits の中身

延長期間が終わると、Fable 5 は**プリペイドの従量課金**に切り替わります。

| 項目 | 内容 |
|---|---|
| 入力 | **$10 / 100万トークン（MTok）** |
| 出力 | **$50 / MTok** |
| 相対価格 | **Opus 4.8（$5 / $25）のちょうど2倍**。Sonnet 5 導入価格の約5倍 |
| プロンプトキャッシュ | **入力90%割引**（キャッシュ活用でコスト圧縮可） |
| コスト実例 | 入力20万＋出力4万トークンの1セッションで **約 $4.00**（同条件の Sonnet 5 は約 $0.80 ＝ **5倍差**） |
| 有効化 | アカウント/組織の **Settings → Usage**（プリペイド・従量） |
| 未有効時 | **Standard Enterprise は起動不可**。Pro/Max/Team も 7/13 以降はクレジットが無ければ利用不可（明示的なフォールバック機構は未公表） |

Fable 5 は**新トークナイザで同じ文章でも約30%多くトークンを消費**し、**長時間・数百万トークン規模の自律タスク**が想定用途です。1回あたりの消費が大きく、**クレジットは想定より早く目減りしやすい**点に注意してください。

## 7月12日までに取るべき行動

1. **〜7/12：サブスク内枠で試す** — 週間上限の最大50%まで追加費用ゼロ。Fable 5 の使いどころ（本当に Opus 4.8 / Sonnet 5 では足りないタスクか）をこの間に見極める。
2. **7/12 直前：ダッシュボードで残枠を確認** — 週間上限・消費状況をチェックし、継続利用するなら **Settings → Usage** でクレジットを有効化。
3. **代替の常用モデルを決めておく** — 多くのタスクは [Sonnet 5](/mdTechKnowledge/blog/claude-sonnet-5-guide/)（低コスト）や [Opus 4.8](/mdTechKnowledge/blog/claude-opus-4-8-guide/) で十分。Fable 5 は「最難関だけ」に絞ると費用対効果が上がる。
4. **本格運用はクレジット課金前提で見積もる** — 高単価＋トークン増を織り込む。枠を厚くしたいなら Max など上位プラン／API 直利用も検討。
5. **将来のサブスク復帰を待つ選択肢も** — 「一時措置」の表明を踏まえ、急ぎでなければ通常プランへ戻るのを待つのも合理的。

## 背景と今後

今回の一時的な従量課金化は、**Fable 5 が最上位クラスで計算資源の消費が大きく、サブスク定額枠のままでは容量が逼迫する**ためと見られます。Anthropic は「キャパシティが整えばサブスクに戻す」としており、**GPU/推論容量の拡充が進めば、再び定額プラン内で使える日が来る可能性**があります。

なお、Fable 5 には再開時に**新しいサイバーセキュリティ分類器**が追加され、高リスク題材ではブロック（多くは Opus 4.8 へフォールバック）や誤検知が起こり得ます。安全設計の詳細は関連記事を参照してください。

## 関連記事

- [Claude Fable 5 は Pro プランで使える？ — 再開後の利用条件と「週間50%枠はすぐ尽きる」評価](/mdTechKnowledge/blog/claude-fable-5-pro-plan-availability/) — プラン別の可否とコスト評価（本延長を反映済み）
- [Claude Fable 5 徹底解剖①（概要編）](/mdTechKnowledge/blog/claude-fable-5-overview/) — Fable 5 とは何か・料金・API 仕様・安全設計
- [米政府、Claude Fable 5 と Mythos 5 を停止](/mdTechKnowledge/blog/claude-fable-5-export-control-suspension/) — 停止〜7/1 再開までの経緯
- [Claude Sonnet 5 完全ガイド](/mdTechKnowledge/blog/claude-sonnet-5-guide/) / [Claude Opus 4.8 完全ガイド](/mdTechKnowledge/blog/claude-opus-4-8-guide/) — 常用の代替モデル

## 出典

- [The New Stack: Anthropic gives Claude subscribers five more days with Fable 5（2026-07-07）](https://thenewstack.io/anthropic-extends-fable-5/)
- [Anthropic 公式 @claudeai 告知](https://x.com/claudeai/status/2074548242386178258)
- [Forbes: Claude Fable 5 Extends By Five More Days（2026-07-07）](https://www.forbes.com/sites/sandycarter/2026/07/07/claude-fable-5-extends-by-five-more-days-10-moves-to-make-now/)
- [digitalapplied: Fable 5 Usage Credits 価格ガイド](https://www.digitalapplied.com/blog/claude-fable-5-usage-credits-july-7-pricing-guide-2026)
