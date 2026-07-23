---
title: "Claude Fable 5 は Pro プランで使える？ — 再開後の利用条件と「週間50%枠はすぐ尽きる」評価"
date: 2026-07-04
updatedDate: 2026-07-23
category: "Claude技術解説"
tags: ["Claude Fable 5", "Pro プラン", "利用上限", "クレジット", "従量課金", "Anthropic", "レート制限", "本人確認"]
excerpt: "2026年7月1日に輸出管理解除で全世界再開した Claude Fable 5 は、Pro プランでも使える。2026年7月20日、Anthropic は最終方針を確定：Max/Team Premium は週間利用上限の50%として恒久的にプランへ組み込み、Pro/Team Standard は引き続き usage credits（従量課金）でアクセスし、$100の一時クレジットを受け取る。本記事は Pro ユーザーの視点に絞り、プラン別の可否、そして『50%枠は既存週間上限からの切り出しで、Fable 5 が高コスト・重いモデルであるためすぐ尽きて課金圏に入りやすい』という点を仕組みから評価する。7月8日発効の本人確認（生体・政府ID）や再開時の新分類器も含め、Pro で使う際の注意点を整理する。"
draft: false
---

> ## 要点
>
> - **Claude Fable 5 は 2026年7月1日、輸出管理解除で全世界再開**。**Pro プランでも使える**（Max / Team / 一部 Enterprise も）。**Free は対象外**とみられる。
> - **【最終方針・2026年7月20日確定】** Max / Team Premium は Fable 5 を**週間利用上限の50%として恒久的にプランへ組み込み**（締切なし・追加課金なし）。**Pro / Team Standard は usage credits（従量課金）でのアクセスを継続**し、**$100 の一時クレジット**を受け取る。
> - 背景: Fable 5 は Anthropic で最も計算資源を要するモデルで、6月の需要急増が既存データセンター契約の容量を超えていた。**SpaceX Colossus 1 契約（300MW超・NVIDIA GPU 22万台超）**と推論効率の改善で容量問題が解消し、Max/Team Premium への恒久組み込みが実現した。
> - **Pro では「50%枠」はすぐ尽きやすい**。50%は追加枠ではなく**既存の週間上限からの切り出し**で、Fable 5 は**入力$10/出力$50（Opus 4.8 の2倍）・トークン約30%増・長時間タスク向け**という高コストで重いモデルだから。ご懸念の「すぐ到達して課金」は**方向として妥当**。
> - **7月8日発効のプライバシーポリシー**で、消費者プランは**本人確認（政府ID＋顔スキャン／Persona）**を求められ得る（API 顧客は対象外）。
> - 具体的なクレジット同梱量・しきい値は**未公表** → **ダッシュボードでの実測が必須**。

> ## 【2026-07-20 追記・最終方針確定】Max/Team Premium は恒久組み込み、Pro は Usage Credits + $100
>
> 2度の延長（7/7→7/12→7/19）を経て、**2026年7月20日、Anthropic は最終的な着地点を発表**しました（公式 @claudeai）。**"Beginning July 20, Claude Fable 5 will be included in all Max and Team Premium plans, at 50% of limits. Pro and Team Standard users will continue to have access to Fable via usage credits, and will receive a one-time $100 credit."**
> - **Max / Team Premium**：Fable 5 が**週間利用上限の50%として恒久的にプランへ組み込み**。クレジット不要・締切なし——「いったんプランに入っている」状態になりました。
> - **Pro / Team Standard**（本記事の対象）：**Usage Credits（従量課金）でのアクセスを継続**しつつ、**$100 の一時クレジット**が付与されます。つまり Pro は「無料の週間枠」からは外れましたが、**$100分は無料で試せる**形になりました。
> - **背景**：Fable 5 はAnthropicで最も計算資源を要するモデルで、6月の再開直後の需要急増が既存データセンター契約の容量を超えていました。**SpaceX Colossus 1 契約（300MW超・NVIDIA GPU 22万台超）**の追加確保と推論効率の改善によって容量問題が解消し、今回の恒久方針に至っています。
> - **7/20 以降の価格**：入力 **$10 / 出力 $50**（per MTok）。**Opus 4.8（$5 / $25）のちょうど2倍**。プロンプトキャッシュで入力90%割引。コスト実例＝入力20万＋出力4万トークンで **約 $4.00**（同条件 Sonnet 5 は約 $0.80 ＝ 5倍差）。$100 クレジットなら、この試算で約25セッション分に相当します。
>
> 詳報は関連記事 [これがラストチャンスかも①（7/12まで延長）](/mdTechKnowledge/blog/claude-fable-5-credit-period-extended/) ／ [これがラストチャンスかも②（7/19まで再延長・GPT-5.6 Sol の影響）](/mdTechKnowledge/blog/claude-fable-5-credit-period-extended-2/) を参照。出典: [Claude 公式 @claudeai（7/18）](https://x.com/claudeai/status/2078302415804379218) ／ [TechTimes: Fable 5 Ends Subscription Limbo](https://www.techtimes.com/articles/320905/20260718/claude-fable-5-ends-subscription-limbo-permanent-max-credits-only-pro.htm)

## はじめに — 「Fable 5、Pro で使えるの？」

2026年6月12日の米政府・輸出管理指令で全世界停止していた最強クラスのモデル **Claude Fable 5** が、**6月30日の解除を受けて7月1日に全世界で再開**しました。停止期間は約19日間。停止〜再開の全経緯は [米政府、Claude Fable 5 と Mythos 5 を停止](/mdTechKnowledge/blog/claude-fable-5-export-control-suspension/) を参照してください。

再開後にまず気になるのが「**自分の Pro プランで Fable 5 を使えるのか、使えるとしてタダなのか**」です。本記事は Pro ユーザーの視点に絞り、**プラン別の可否**と、とくに **「週間利用上限の50%枠はすぐ尽きて課金になるのでは？」という懸念の評価**を、仕組みから整理します。

> Fable 5 とは何か・モデルの詳細（安全設計・API 仕様・料金全体）は [Claude Fable 5 徹底解剖①（概要編）](/mdTechKnowledge/blog/claude-fable-5-overview/) にまとまっています。本記事は「Pro で使えるか・コストはどうか」に特化した実務ガイドです。

---

## 結論：Pro で使える。ただし Max/Team Premium とは扱いが分かれた

| プラン | 2026年7月20日以降（最終方針） |
|---|---|
| **Max / Team Premium** | Fable 5 が**週間利用上限の50%として恒久的にプランへ組み込み**。クレジット不要・締切なし |
| **Pro / Team Standard**（本記事の対象） | **Usage Credits（従量メーター課金）**でのアクセスを継続。**$100 の一時クレジット**が付与される |
| **Free** | 対象外とみられる（公式明言は未確認） |
| **API / Claude Platform** | 従量課金（入力$10/出力$50 per MTok）。フォールバック等は当初どおり |

- 対象サーフェスは **Claude.ai / Claude Code / Cowork / API**、クラウド（Bedrock / Vertex AI / Foundry）も再有効化。
- 7/1〜7/19（当初7/7→7/12→7/19 と2度延長）の「50%まで無料」の移行猶予は終了し、**7/20 から上記の恒久方針へ移行**しました。

> つまり **Pro でも Fable 5 は使えます**。ただし Max/Team Premium のような「プラン組み込み」ではなく、**$100 の一時クレジット＋以降は従量課金**という形です。同じ Fable 5 でも、プランによって着地点が分かれた点に注意してください。

---

## 評価：Pro では「50%枠」はすぐ尽き、実質すぐ課金圏に入りやすい

「Pro では週間50%にすぐ到達して課金が発生するのでは？」という懸念は、**方向として妥当**です。仕組みと現実的な帰結を分けて整理します（**数値が未公表のため、以下は挙動の性質からの評価**です）。

### なぜすぐ尽きるのか

1. **「50%」は追加枠ではなく、既存の週間利用上限からの切り出し**。Fable 5 に回せるのは「Pro の週間枠の半分まで」で、ボーナス容量ではありません。
2. **Fable 5 は“重い・高い”モデル**：
   - **API 換算で入力 $10 / 出力 $50（100万トークンあたり）＝ Opus 4.8 の2倍**。
   - **新トークナイザで、同じ文章でも約30%多くトークンを消費**。
   - 想定用途が**長時間・数百万トークン規模の自律タスク**。
   - → **1回の利用あたりの消費が大きい**。
3. その結果、**相対的に枠の小さい Pro では、Fable 5 を本格的に使うと週間上限の50%（＝Fable 5 割当）に短時間で到達しやすい**。数回の長めのエージェント作業で割当を使い切ることは十分あり得ます。

### 「到達＝即課金」ではない（ただし7/20で状況が変わった）

- **7/19 までは、50%に到達しても自動課金はされませんでした**。Fable 5 の無料利用が止まるだけで、週次リセットを待つか、Opus 4.8 等へ切り替える運用でした。
- **7/20 以降、Pro/Team Standard は Usage Credits が実質の枠**になっています。**$100 の一時クレジットを使い切った後も使い続ける＝そのまま実費**です。Max/Team Premium は恒久組み込みのためこの制約がありません。

### コスト要因の早見

| 要因 | 内容 | Pro への効き方 |
|---|---|---|
| 単価 | 入力 $10 / 出力 $50（Opus 4.8 の2倍） | 同じ作業でもコスト2倍相当 |
| トークナイザ | 同一テキストで約30%増 | 実消費トークンが膨らむ |
| 想定用途 | 長時間・数百万トークンの自律タスク | 1セッションで大量消費 |
| 枠の出所 | 週間上限の“半分まで”の切り出し | 枠自体が小さくすぐ枯れる |

> **まとめ**：Pro における「無料で使える Fable 5」は、実質 **“少量ですぐ枯れる試用枠”** と捉えるのが安全です。7/19 まではコスト0で試せますが、**継続的・本格的に Fable 5 を回すならクレジット課金は前提**。枠を厚く持ちたいなら **Max など上位プラン、または API 直利用（従量）** を検討するのが現実的です。厳密なしきい値は週間上限値・クレジット換算が未公表のため計算できず、**ダッシュボードでの実測が必須**です。

---

## 【2026-07-08〜】本人確認（生体・政府ID）の導入に注意

**7月8日にプライバシーポリシーが改定**され、収集データに **生体情報（顔スキャン）と政府発行 ID** が明記されます。消費者向けプラン（Pro 等）では、第三者サービス **Persona による本人確認**（政府発行 ID ＋ライブ自撮り＋顔形状スキャン）が、**特定機能へのアクセスやクレジット付与の条件**として求められ得ます。**Fable 5 はその最有力の対象**とされています。

- ⚠️ ただし「**Fable 5 の全利用に本人確認が必須なのか、一部機能だけか**」は現時点で断定できません。生体情報の提供に抵抗がある場合は 7/8 以降に自分のアカウントで要件を確認してください。
- **API 顧客は現行ポリシーでは本人確認の対象外（exempt）**。Enterprise は法人 attestation で代替の可能性。

---

## 再開時に追加された安全策（Pro でも影響あり）

再開にあたり Anthropic は**新しいサイバーセキュリティ分類器**を追加し、今回のトリガーとなった jailbreak 手法を **99%超でブロック**すると報じられています。この99%超ブロックは **NIST 傘下の CAISI（Center for AI Standards and Innovation）による独立検証**を経ており、報道では政府側が「極めて強力（extraordinarily strong）」と評価したと伝えられています（報道ベース）。

- ブロック時は多くの場合 **Claude Opus 4.8 にフォールバック**（該当はセッションの5%未満、拒否は `stop_reason: "refusal"`）。**回答モデルが切り替わる前提**で使う。
- **通常のコーディング/デバッグでも誤検知（false positive）**が起き得ることを Anthropic 自身が認めています。高リスクな題材（攻撃的サイバー・生物/化学・モデル蒸留）は避けるのが無難です。

---

## Pro ユーザー向け・実務チェックリスト

1. **$100 の一時クレジットの消費ペースを把握する**：入力20万＋出力4万トークンで約$4.00の試算なら、$100は約25セッション分。ダッシュボードで残高を随時確認する。
2. **本人確認（生体・政府ID）の要否を確認**：7/8以降、対象になっている場合は方針判断。
3. **本格運用はクレジット課金前提**で見積もる（枠を厚く持ちたいなら Max/Team Premium への切替も選択肢）。
4. **高リスク題材は避ける**（誤検知・Opus 4.8 フォールバックが起きる）。
5. **機密データは 30日データ保持（ZDR不可）**を前提に扱う。
6. **API 連携なら** `stop_reason:"refusal"`（HTTP 200）ハンドリング＋fallback 設定を実装。

---

## まとめ

- **Fable 5 は Pro でも使える**が、**2026年7月20日の最終方針で Max/Team Premium とは扱いが分かれた**。Max/Team Premium は週間50%として恒久組み込み、**Pro/Team Standard は Usage Credits＋$100の一時クレジット**という形。
- **Pro の従来の50%枠は「既存週間上限の切り出し」×「Fable 5 が高コスト・重い」ため、すぐ尽きやすかった**——この評価自体は、Usage Credits へ移行した後の**消費ペースの速さ**として引き続き当てはまる。
- **7/8 の本人確認（生体・政府ID）**と**新分類器のフォールバック/誤検知**にも注意。
- 厚い枠が必要・恒久的に使い続けたいなら **Max / Team Premium への切替**を検討するのが最も合理的（クレジット消費を気にせず使える）。

---

## 関連記事

- [Claude Fable 5 徹底解剖①（概要編）](/mdTechKnowledge/blog/claude-fable-5-overview/) — Fable 5 とは何か・料金・API 仕様・安全設計の全体像
- [米政府、Claude Fable 5 と Mythos 5 を停止](/mdTechKnowledge/blog/claude-fable-5-export-control-suspension/) — 停止〜7/1 再開までの全経緯
- [Claude Opus 4.8 完全ガイド](/mdTechKnowledge/blog/claude-opus-4-8-guide/) — Fable 5 のフォールバック先モデル
- [Anthropic Rate Limits API 完全ガイド](/mdTechKnowledge/blog/anthropic-rate-limits-api-guide/) — レート制限（ティア）をプログラム照会する

## 出典

- [9to5Mac: Claude Fable 5 cleared to return（再開・50%措置）](https://9to5mac.com/2026/07/01/claude-fable-5-cleared-to-return-as-us-lifts-anthropics-export-control-restriction/)
- [MarkTechPost: Anthropic redeploys Claude Fable 5（新分類器）](https://www.marktechpost.com/2026/07/01/anthropic-redeploys-claude-fable-5-on-july-1-after-us-export-controls-lift-adds-new-cybersecurity-classifier/)
- [digitalapplied: Fable 5 usage credits July 7 pricing guide（7/7 クレジット移行）](https://www.digitalapplied.com/blog/claude-fable-5-usage-credits-july-7-pricing-guide-2026)
- [explainx: Claude ID verification（7/8 本人確認）](https://explainx.ai/blog/anthropic-claude-id-verification-persona-fable-5-2026)
- [Claude 公式 @claudeai（2026-07-18・7/20最終方針発表）](https://x.com/claudeai/status/2078302415804379218)
- [TechTimes: Claude Fable 5 Ends Subscription Limbo — Permanent for Max, Credits-Only for Pro](https://www.techtimes.com/articles/320905/20260718/claude-fable-5-ends-subscription-limbo-permanent-max-credits-only-pro.htm)
- [Anthropic 公式 Docs: Introducing Claude Fable 5 and Claude Mythos 5](https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5)
