---
title: "これがラストチャンスかも② — Claude Fable 5「サブスク内利用」が7月19日まで再延長、GPT-5.6 Sol 登場の影響"
date: 2026-07-13
updatedDate: 2026-07-24
category: "Claude技術解説"
tags: ["Claude Fable 5", "Anthropic", "Usage Credits", "従量課金", "サブスクリプション", "GPT-5.6", "OpenAI", "モデル比較", "延長"]
excerpt: "2026年7月7日で終わるはずだった Claude Fable 5 の『サブスク内利用（週間上限の最大50%まで追加費用なし）』は、7月12日→7月19日と2度延長された後、7月20日に最終方針が確定した。Max/Team Premium は週間50%として恒久組み込み、Pro/Team Standard は Usage Credits＋$100の一時クレジットへ。同時期の7月9日、OpenAI が GPT-5.6（Luna/Terra/Sol）を公開し、最上位 Sol はコーディングベンチで Fable 5 をわずかに上回りながら価格は Fable 5 の50〜60%（＝約40〜50%安・混合単価で約44%安）と報じられている。2度の延長から最終決着までの経緯、GPT-5.6 Sol との性能・価格比較を整理する。"
draft: false
---

> ## 要点
>
> - Claude Fable 5 の「サブスク内利用（週間上限の最大50%まで追加費用なし）」は、**7月7日→7月12日→7月19日 23:59:59（PT）**と**2度延長**された（Anthropic公式）。**Claude Code の週間利用上限50%増も同じ7/19まで延長**。
> - **7月20日以降**：プリペイドの **Usage Credits**（入力$10 / 出力$50 per MTok）へ移行する点は前回記事から変更なし。
> - **同じ7月9日、OpenAI が GPT-5.6（Luna / Terra / Sol の3段階）を公開**。最上位 **Sol はコーディングベンチマークで Fable 5 をわずかに上回りつつ、価格は Fable 5 の50〜60%＝約40〜50%安**（入力$5 / 出力$30 per MTok。混合単価で約44%安）と報じられている。
> - Sol は米政府の安全審査を経て一部パートナー限定公開 → 一般公開という、**Fable 5 の輸出管理停止と似た構図**を辿った。
> - 2度の連続延長の「本当の理由」を Anthropic は明言していないが、**GPT-5.6 Sol という強力な低価格モデルの登場と時期が重なった**ことは、読み解く上で無視できない材料。

## 何が起きたか — 2度目の延長

Claude Fable 5 の有料プラン内無料利用枠は、当初「7月7日まで」とされていましたが、**7月7日に7月12日へ延長**され、**さらに7月12日直前に7月19日へ再延長**されました。同じ期限が2回連続で押し戻されたことになります。

| 段階 | 期限 | 延長幅 |
|---|---|---|
| 当初発表 | 2026年7月7日 | — |
| 1回目の延長 | 2026年7月12日 | +5日 |
| **2回目の延長（今回）** | **2026年7月19日 23:59:59（PT）** | **+7日** |

| 項目 | 内容 |
|---|---|
| 対象プラン | Pro / Max / Team・premium 席の Enterprise |
| 無料枠の中身 | **週間利用上限の最大50%まで**、追加費用なしで Fable 5 を利用可 |
| 付随措置 | **Claude Code の週間利用上限50%増**も同じ7/19まで延長 |
| 利用方法 | クレーム・有効化操作は不要。Fable 5 は他モデルと**同じ週間利用プールを共有**して自動的に消費される |
| 7月20日以降 | プリペイドの **Usage Credits（従量メーター課金）**へ移行 |

なお、そもそも今回の無料枠自体、**6月12日の輸出管理停止（19日間）を経て7月1日に全世界再開**した後の経緯であり、「停止19日間 → 再開 → 無料枠延長×2」という**異例続きの数ヶ月**になっています。詳しい経緯は関連記事を参照してください。

## なぜ「ラストチャンスかも②」なのか

前回記事（7/12延長時点）で述べた二面性——「①サブスク内で気軽に試せる期間はいずれ終わる」「②Anthropicは一時的な容量措置と説明しており、戻す意向を示している」——は今回も変わりません。ただし**2度連続の延長という事実**は、次の2通りに解釈できます。

- **好意的な見方**：Anthropic が本当に「容量が整い次第サブスクに戻す」方針で、実際に猶予を積み増している。
- **競争環境を踏まえた見方**：後述する GPT-5.6 Sol のような**安価で高性能な代替が登場するタイミング**で無料枠を打ち切ると、ユーザーが競合へ流出しかねない。延長はその防波堤という側面もあり得る。

Anthropic 公式はいずれの理由も明言していないため、**両方とも「推測」の域を出ません**。ただし後者の文脈を知っておくと、「なぜ何度も延長されるのか」への納得感が変わります。

## GPT-5.6 Sol 登場の影響

Fable 5 の延長発表とほぼ同じタイミングの **2026年7月9日、OpenAI は新モデル群 GPT-5.6 を公開**しました。

### GPT-5.6 とは — Luna / Terra / Sol の3段階

| モデル | 位置づけ |
|---|---|
| **Luna** | 最も軽量・安価 |
| **Terra** | 中位モデル |
| **Sol** | 最上位・最高性能 |

Sol は当初、**米政府の安全審査（サイバーセキュリティ能力に関するもの）を条件に、一部の信頼済みパートナーへ限定先行公開**され、審査を経て7月9日に一般公開されました。**「政府審査を経てから世に出る」という展開は、Fable 5 の輸出管理停止（6/12〜6/30）と構図が似ています**——ともに「強力すぎる能力への政府の関与」が背景にある点は、2026年のフロンティアモデル全般に共通する潮流と言えそうです。

### 性能比較 — 「迫る」のではなく「わずかに上回る」

Sam Altman（OpenAI CEO）は、Sol について**コーディングタスクで従来バージョン比54%のトークン効率化**を達成したと述べています。第三者ベンチマーク（Artificial Analysis Coding Agent Index）では、**Sol が 80点、Fable 5 に対して +2.8ポイント**という結果が報告されています。

> 事前に「GPT-5.6 は Fable 5 に迫る性能」という見方もありますが、報じられているベンチマークを見る限り、正確には**「迫る」ではなく「僅差で上回る」**が実態に近い評価です。もっとも、ベンチマーク1本の数点差は誤差の範囲とも言え、**実務上はほぼ互角**と捉えるのが妥当でしょう。

### 価格比較 — Sol はFable 5の50〜60%

価格面では、Sol の優位がより明確です。

| 項目 | Claude Fable 5 | GPT-5.6 Sol | 差 |
|---|---|---|---|
| 入力（per MTok） | $10 | **$5** | Sol が **50%** |
| 出力（per MTok） | $50 | **$30** | Sol が **60%** |
| 3:1（入力:出力）の混合単価目安 | 約$20.00 | 約$11.25 | Sol が**約44%安い** |

ただし単純に「Sol が常に安い」とは言い切れない留保もあります。

- **ロングコンテキストで料金体系が変わる**: Sol は入力が272Kトークンを超えると、その時点で単価が $10 / $30 へ切り替わります。一方 Fable 5 は 1M トークンの全域で $10 / $50 の単一料金です。長大なコンテキストを多用する用途では、価格差が縮小します。
- **Fable 5 の Batch API（非同期・50%割引）を使うと、混合単価は約$10.00まで下がり**、Sol との差はほぼ解消します。

つまり結論は「**通常のリアルタイム利用・短〜中コンテキストなら Sol が明確に安い**。長文コンテキストや Batch API 前提なら差は縮む」という、利用パターン依存の話になります。

### この状況が意味すること

Fable 5 は「最上位モデル」としての優位性を、性能面では**わずかな差でかろうじて保っている**一方、**価格面では明確に見劣りする**状況になったと言えます。無料のサブスク内枠が2度延長されたことと、この競争環境の変化が**時期的に重なっている**のは事実ですが、Anthropic がこれを延長理由として明言したわけではない点は、繰り返し強調しておきます。

## 7月19日までに取るべき行動

前回記事からの更新点を反映した、実務的なチェックリストです。

1. **〜7/19（PT）：サブスク内枠で試す** — 週間上限の最大50%まで追加費用ゼロ。Fable 5 が本当に必要なタスクかをこの期間に見極める。
2. **7/19 直前：ダッシュボードで残枠を確認** — 継続利用するなら **Settings → Usage** でクレジットを有効化しておく。
3. **GPT-5.6 Sol も選択肢に入れて比較する** — コスト重視・短中コンテキストのコーディングタスクなら、Sol は有力な代替になり得る（ただし別ベンダーへの切替はワークフロー・ツール連携の再構築コストも伴う点に注意）。
4. **代替の常用モデルを決めておく** — 多くのタスクは [Sonnet 5](/mdTechKnowledge/blog/claude-sonnet-5-guide/) や [Opus 4.8](/mdTechKnowledge/blog/claude-opus-4-8-guide/) で十分。Fable 5 は「最難関だけ」に絞ると費用対効果が上がる。
5. **本格運用はクレジット課金前提で見積もる** — 高単価＋新トークナイザによるトークン増（同一文章で約30%増）を織り込む。

## 【2026-07-20追記・最終決着】Max/Team Premium は恒久組み込み、Pro は Usage Credits + $100

7月19日の延長期限を迎えたその翌日、**Anthropic は最終方針を発表**しました（公式 @claudeai、7/18付）。3度目の延長ではなく、**プランごとに扱いを分ける形で決着**しています。

> "Beginning July 20, Claude Fable 5 will be included in all Max and Team Premium plans, at 50% of limits. Pro and Team Standard users will continue to have access to Fable via usage credits, and will receive a one-time $100 credit."

- **Max / Team Premium**：Fable 5 が**週間利用上限の50%として恒久的にプランへ組み込み**。もう「無料枠の延長待ち」ではなく、恒久的にプランの一部になりました。
- **Pro / Team Standard**：**Usage Credits（従量課金）でのアクセスを継続**し、**$100 の一時クレジット**が付与されます。「延長がなくなった」という意味では冒頭の懸念どおりですが、無料の $100 分が救済措置として用意されました。
- **背景**：Fable 5 は Anthropic で最も計算資源を要するモデルで、6月の再開直後の需要急増が既存データセンター契約の容量を超えていました。**SpaceX Colossus 1 契約（300MW超・NVIDIA GPU 22万台超）**の追加確保と推論効率の改善が、この恒久方針を可能にしたと報じられています。

つまり本記事のタイトルにある「ラストチャンスかも」は、**Max/Team Premium にとっては杞憂に終わり（恒久的に使える）、Pro/Team Standard にとっては「無料の猶予は終わったが、$100分の再チャンスが与えられた」**という形で決着しました。

出典: [Claude 公式 @claudeai（2026-07-18）](https://x.com/claudeai/status/2078302415804379218) ／ [TechTimes: Claude Fable 5 Ends Subscription Limbo](https://www.techtimes.com/articles/320905/20260718/claude-fable-5-ends-subscription-limbo-permanent-max-credits-only-pro.htm)

## Usage Credits の実務（Pro/Team Standard 向け）

- **有効化の場所**: [claude.ai](https://claude.ai) の **Settings → Usage** で「usage credits（extra usage）」をオンにする。プラン内の通常枠を使い切った後、超過分を **API 標準レートで従量課金**する仕組み（[Manage usage credits — Claude Help Center](https://support.claude.com/en/articles/12429409-manage-usage-credits-for-paid-claude-plans)）。
- **プラン枠は従来どおり温存**: プランに含まれる通常利用はこれまでと同じで、**クレジットはプラン上限を超えてから初めて消費**されます。Fable 5 以外（[Opus 4.8](/mdTechKnowledge/blog/claude-opus-4-8-guide/)・[Sonnet 5](/mdTechKnowledge/blog/claude-sonnet-5-guide/)・Haiku 4.5 等）は引き続きプラン枠で使えます。
- **残高は単一プール**: usage bundle の残高は **Claude / Claude Desktop / モバイル（iOS・Android）/ Claude Code / Cowork** をまたぐ1つのプールとして適用されます（[Buy usage bundles — Claude Help Center](https://support.claude.com/en/articles/14246112-buy-usage-bundles)）。前払いのバンドル購入なら標準レートより最大30%割引（Pro/Max は月 $2,000 まで割引対象）。
- **Fable 5 の従量レート**: 入力 **$10** / 出力 **$50** per MTok。新トークナイザで同一文章のトークン数が約30%増える点も見積もりに織り込みます。$100 の一時クレジットは、この試算で約25セッション分に相当します。

> 購入手続きの正確な導線（特にモバイルアプリからの購入可否）は変わりうるため、実際の有効化・購入は claude.ai の Settings → Usage と公式ヘルプで最新の手順を確認してください。

## 背景と今後

2度の延長は「容量（capacity）が整うまでの一時措置」という Anthropic の説明と整合的でしたが、**GPT-5.6 Sol という価格競争力のある代替が登場した直後というタイミング**は、今後のFable 5の価格戦略を占う上で注視に値する材料でした。結果的に、**Max/Team Premium への恒久組み込みという「サブスクへの復帰」**という形で決着し、Anthropic の当初の説明（「キャパシティが許せばサブスクに戻す」）は実現した形になります。一方 Pro/Team Standard は Usage Credits が実質の窓口として固定され、「本当に Fable 5 が要るタスクだけをクレジットで叩く」という費用対効果の判断が今後も続きます。

## 関連記事

- [これがラストチャンスかも③（完結編）— 7月20日の最終決着](/mdTechKnowledge/blog/claude-fable-5-credit-period-final/) — Max/Team Premium は恒久組み込み、Pro は Usage Credits＋$100（本稿の続き・完結編）
- [これがラストチャンスかも① — 7月12日までの延長版](/mdTechKnowledge/blog/claude-fable-5-credit-period-extended/) — 1回目の延長の詳細（Usage Creditsの仕組み・注意点）
- [Claude Fable 5 は Pro プランで使える？](/mdTechKnowledge/blog/claude-fable-5-pro-plan-availability/) — プラン別の可否とコスト評価
- [米政府、Claude Fable 5 と Mythos 5 を停止](/mdTechKnowledge/blog/claude-fable-5-export-control-suspension/) — 停止〜7/1再開までの経緯
- [Claude Sonnet 5 完全ガイド](/mdTechKnowledge/blog/claude-sonnet-5-guide/) / [Claude Opus 4.8 完全ガイド](/mdTechKnowledge/blog/claude-opus-4-8-guide/) — 常用の代替モデル

## 出典

- [BleepingComputer: Claude Fable 5 stays free for paid users until July 19 as Anthropic buys more time（2026-07-12頃）](https://www.bleepingcomputer.com/news/artificial-intelligence/claude-fable-5-stays-free-for-paid-users-until-july-19-as-anthropic-buys-more-time/)
- [Officechai: Anthropic Extends Claude Fable 5's Access On Paid Plans Until 19th July](https://officechai.com/ai/anthropic-extends-claude-fable-5s-access-on-paid-plans-until-19th-july/)
- [Android Authority: Claude Fable 5 promotion extended after backlash over early cutoff](https://www.androidauthority.com/claude-fable-5-free-extension-3685103/)
- [TechCrunch: OpenAI launches its new family of models with GPT-5.6（2026-07-09）](https://techcrunch.com/2026/07/09/openai-launches-its-new-family-of-models-with-gpt-5-6/)
- [OpenAI: Previewing GPT-5.6 Sol](https://openai.com/index/previewing-gpt-5-6-sol/)
- [CNBC: OpenAI expanding GPT-5.6 AI model release, ending government limits（2026-07-08）](https://www.cnbc.com/2026/07/08/openai-expanding-gpt-5point6-ai-model-release-ending-government-limits.html)
- [TechTimes: GPT-5.6 Sol Review — Faster Coding, Half Fable 5 Cost, and a Benchmark Problem](https://www.techtimes.com/articles/319808/20260707/gpt-56-sol-review-faster-coding-half-fable-5-cost-benchmark-problem.htm)
- [DigitalApplied: GPT-5.6 Sol vs Claude Fable 5 — Price, Access and Benchmarks](https://www.digitalapplied.com/blog/gpt-5-6-sol-vs-claude-fable-5-price-access-2026)
