---
title: "Claude Fable 5 徹底解剖① — 「危険すぎて封印」された Mythos は、なぜ Fable 5 として一般公開できたのか"
date: 2026-06-10
updatedDate: 2026-07-23
category: "Claude技術解説"
tags: ["Claude Fable 5", "Anthropic", "Mythos", "Fable 5", "Mythos 5", "AIモデル", "Claude"]
excerpt: "2026年6月9日、Anthropic は最強クラスのモデル群「Mythos」を初めて一般公開した。その公開版が Claude Fable 5 だ。Fable 5 と非公開の Mythos 5 は同じ基盤モデルで、違いは安全装置の有無だけ——高リスク領域では応答を Claude Opus 4.8 にフォールバックする。本シリーズ第1話では、Fable 5 とは何か、Mythos 5 との関係、モデルファミリーの系譜、「AIは危険になりすぎている」と警告した数日後に最強モデルを公開したリリースの文脈、価格、そして使える場所までを整理する。さらに API 利用者向けに、新トークナイザ（同一テキストで約30%トークン増）・`stop_reason: refusal`・opt-in `fallbacks`・30日データ保持必須（ZDR不可）・手動 thinking バジェット非対応（400エラー）といった破壊的 API 変更も解説する。"
draft: false
---

**本記事は3部構成の第1話「概要編」です。** Claude Fable 5 を、①概要（本記事）→ ②ベンチマーク・性能 → ③安全設計と社会的文脈、の順で詳しく解説します。

- 第1話（本記事）: [Claude Fable 5 徹底解剖①概要編](/blog/claude-fable-5-overview/)
- 第2話: [Claude Fable 5 徹底解剖②ベンチマーク・性能編](/blog/claude-fable-5-benchmarks/)
- 第3話: [Claude Fable 5 徹底解剖③安全設計・社会的文脈編](/blog/claude-fable-5-safety-context/)

> **【2026-07-01 追記】Fable 5 は全面解除・全世界で再開しました。** 本記事公開後、Fable 5 / Mythos 5 は米政府の輸出管理指令で一時停止していました（2026-06-12〜）が、**2026年6月30日（PT）に輸出管理が解除され、Fable 5 は 2026年7月1日に全世界で再開**しました（Claude.ai / Claude Platform / Claude Code / Claude Cowork）。Mythos 5 は米国の一部組織向けに限定復旧。停止から再開までの詳しい経緯は [Fable 5 輸出管理停止の全記録](/mdTechKnowledge/blog/claude-fable-5-export-control-suspension/) を参照してください。

---

## はじめに

2026年6月9日（火）、Anthropic は同社の最強クラスのモデル群「**Mythos**」を、初めて一般のユーザーが触れられる形で公開しました。その公開版が **Claude Fable 5** です。

これまで Mythos は、サイバー脆弱性を超人的なレベルで発見する能力などから「ウォール街と政府高官を釘付けにした技術」として報じられ、限られたパートナーにしか提供されてきませんでした。その能力をほぼそのまま、安全装置を組み込んだ形で一般公開したのが Fable 5 です。

本シリーズでは、この Fable 5 を3話に分けて解説します。第1話となる本記事では、まず「Fable 5 とは何か」「非公開の Mythos 5 とどう違うのか」「なぜこのタイミングで公開されたのか」「いくらで、どこで使えるのか」という全体像を押さえます。

> 本記事の数値・事実は、Anthropic 公式発表（[claude-fable-5-mythos-5](https://www.anthropic.com/news/claude-fable-5-mythos-5)、[製品ページ](https://www.anthropic.com/claude/fable)）を一次ソースとし、公式で確認できない点はメディア報道として明示しています。

## Claude Fable 5 とは — 「一般公開した中で最強」

Anthropic は Fable 5 を「**これまで一般提供してきたどのモデルの能力をも上回る（capabilities exceed those of any model we've ever made generally available）**」モデルと位置づけています。テスト済みのほぼすべてのベンチマークで state-of-the-art（最高水準）を主張しており、特にソフトウェアエンジニアリング、知識労働、ビジョン（画像・図表の読解）、科学研究で高い性能を示すとしています。

ここで重要なのは「**一般提供してきた中で**最強」という限定です。後述する非公開の Mythos 5 はさらに上の能力を持つため、「最強モデルを公開した」という見出しは、厳密には「**公開できる範囲で最強のモデル**」を意味します。

Fable 5 が得意とするのは、一回の質問応答よりも、**長時間・複数日にわたる自律的なタスク**です。Anthropic は、大規模なコード移行や数日がかりの自律セッション、自分の作業を自分でテストする自己検証、数百万トークン規模のロングコンテキストと永続メモリの活用などを強みとして挙げています。

## Fable 5 と Mythos 5 — 同じ頭脳、違うのは安全装置

Fable 5 を理解するうえで最も大事なのが、非公開モデル **Mythos 5** との関係です。両者は**能力的に同一の基盤モデル**であり、違いは「安全装置（セーフガード）の有無」だけです。

| 観点 | Claude Fable 5 | Claude Mythos 5 |
|------|----------------|-----------------|
| 基盤モデル | 同一 | 同一 |
| 安全装置 | **有効**（高リスク領域で Opus 4.8 にフォールバック） | **解除**（フル能力版） |
| 提供範囲 | **一般公開** | Project Glasswing パートナー＋一部のバイオ研究者に限定 |
| モデルID | `claude-fable-5` | 公開モデルIDなし（限定提供） |
| 想定用途 | 一般のコーディング・知識労働・ビジョン等 | サイバー防御研究・生物学研究などの専門用途 |

Anthropic は、フォールバックが起きない限り両者は実質的に同じだと説明しています。公式の早期データによれば「**95%超の Fable セッションではフォールバックがまったく起きず、そのようなセッションでは Fable 5 の性能は Mythos 5 と実質的に同じ**」とされています。

つまり一般ユーザーは、大半のケースで「安全装置付きの Mythos 5」をそのまま使っている、という構図です。

## モデルファミリーの系譜

Fable 5 / Mythos 5 は、Anthropic のモデル系譜の中で次のように位置づけられます。

```
Opus 4.7 → Opus 4.8 →（Mythos Preview, 2026年4月）→ Fable 5 / Mythos 5（2026年6月9日）
```

- **Opus 4.8** は現行の汎用上位モデルで、Fable 5 のフォールバック先でもあります。高リスク領域の照会は、Fable 5 からこの Opus 4.8 へ再ルーティングされます。
- **Mythos Preview**（2026年4月）は、Mythos クラスが初めて外部に披露されたプレビューで、サイバー脆弱性発見の超人的な能力が大きな話題になりました。
- そして2026年6月9日、安全装置付きの **Fable 5**（一般公開）と、装置を外した **Mythos 5**（限定提供）が同時に登場しました。

## リリースの文脈 — 「危険」と警告した数日後の公開

Fable 5 のリリースで各メディアが最も注目したのが、その**タイミング**です。

公開のわずか数日前、2026年6月5日に、Anthropic は「AI が **完全な再帰的自己改善（RSI: recursive self-improvement）**——人間の介入なしに AI が自らを改良し続ける段階——に急速に近づいている」と警告していました。共同創業者の Jack Clark は、冷戦期の核軍縮になぞらえながら、業界に「ブレーキ」が必要だと訴えています。

> 「AI 業界には今アクセルペダルはあるが、ブレーキペダルがない。我々はそのペダルを作る作業の一部を担いたい」（Jack Clark、CNN への発言として報道）

その数日後に「これまでで最強の公開モデル」を出したことを、TechCrunch は見出しで「**AI が危険になりすぎていると警告した数日後（days after warning AI is becoming too dangerous）**」と表現し、NBC 系メディアは「**政府を不安にさせたのと同じ技術の上に作られた**」と報じました。

一見すると矛盾ですが、Anthropic の論理はこうです——基盤モデル（頭脳）は Mythos と同一でも、危険な「双子」である Mythos 5 は公開せず、**安全装置で包んだ Fable 5 だけを世に出す**。競合がガードレールなしで同等のモデルを出すのを待つより、自分たちが「Mythos クラスが世に出る形」を定義したほうがよい、という考え方です。

なお「危険警告 vs 公開」という対立構図そのものは、Anthropic の公式 Fable / Mythos 発表本文には明記されていません。これは各メディアによるフレーミングである点に留意してください（詳しくは第3話で扱います）。

## 価格 — 比較対象で印象が反転する

Fable 5 と Mythos 5 の価格は共通で、以下の通りです。

| モデル | 入力（100万トークンあたり） | 出力（100万トークンあたり） |
|--------|------------------------------|------------------------------|
| **Claude Fable 5 / Mythos 5** | **$10** | **$50** |
| Claude Opus 4.8（参考・報道ベース） | $5 | $25 |

この価格は、**比較対象によって印象が逆転する**点が面白いところです。

- Anthropic 公式は「**Mythos Preview の半額未満（less than half the price of Claude Mythos Preview）**」と、値下げを強調しています。
- 一方 TechCrunch などのメディアは「**Opus 4.8 の2倍**」と、割高さを強調しています。

なお「Opus 4.8 の2倍」という比較は報道による表現で、Anthropic 公式の Fable / Mythos 発表本文には Opus 4.8 との直接の価格比較は記載されていません。上表の Opus 4.8 価格（$5 / $25）も報道に基づく参考値です。

このほか、プロンプトキャッシュ利用時は**入力トークンが90%割引**、米国内のみで推論する US-only オプションは入力・出力とも**1.1倍**の価格になります。

## 使えるのはどこか — API・クラウド・プラン同梱

Fable 5 の提供形態は以下の通りです。

| 項目 | 内容 |
|------|------|
| モデルID | `claude-fable-5` |
| 利用経路 | Claude API、Claude Platform、各種マーケットプレイス |
| クラウド | Amazon Bedrock、Google Cloud（Vertex AI）、Microsoft Foundry |
| プラン同梱 | **【当初】2026年6月9日〜6月22日**は Pro / Max / Team / シートベース Enterprise に追加費用なしで同梱 → 6月23日に各プランから削除の予定だった。**※ 6/12〜6/30 の輸出管理停止と 7/1 の再開でこの条件は変わりました。最新のプラン別条件は下記「再開後のプラン別利用条件」を参照。** |
| データ保持 | 安全監視のため**30日間のデータ保持が必須**（学習には使用せず、新規ジェイルブレイク防御や誤検知特定にのみ利用） |
| フォールバック課金 | 高リスク領域で Opus 4.8 に転送された分には、Fable 価格を課金しない |

また、Mythos クラスのトラフィックには**30日間のデータ保持が必須化**されました。従来ゼロ保持契約だった企業にも適用されるため、機密性の高い用途では事前の確認が必要です（この新ポリシーをめぐる議論は第3話で扱います）。

## 再開後のプラン別利用条件（2026-07-01〜）

2026年6月30日（PT）に輸出管理が解除され、Fable 5 は **7月1日に全世界で再開**しました。再開にあたりプラン別の利用条件が改めて示されています。

### プラン別の可否と課金

> **【2026-07-20 最終決着・追記】** 下表の「50%までサブスク内利用」の期限はその後 **7/12 → 7/19（PT）へと2度延長**され、**7月20日に最終方針が確定**しました。**Max / Team Premium は週間利用上限の50%として恒久的にプランへ組み込み**（追加費用・クレジット管理不要）、**Pro / Team Standard は Usage Credits（従量課金）継続＋一時 $100 クレジット付与**です。背景は SpaceX Colossus 1（300MW超・NVIDIA GPU 22万台超）の容量確保と推論効率の改善。**下表と下記の評価は再開当初（7/1時点）の記録**としてお読みください（Pro の「50%枠はすぐ尽きる」という構図は、Usage Credits 前提の現在も本質的に変わりません）。顛末は [これがラストチャンスかも③（完結編）](/mdTechKnowledge/blog/claude-fable-5-credit-period-final/) を参照。

| プラン | 〜2026年7月7日 | 2026年7月8日以降 |
|---|---|---|
| **Pro / Max / Team / 一部 Enterprise** | **週間利用上限の最大50%まで、追加費用なし**で Fable 5 を利用可 | **usage credits（従量課金）へ移行**。定額枠には含まれず、Fable 5 利用は別課金の想定 |
| **Free** | 対象外とみられる（公式明言は未確認） | 同左 |
| **API / Claude Platform** | 従量課金（下記料金）。フォールバック等は当初どおり | 同左 |

- 対象サーフェスは **Claude.ai / Claude Code / Cowork / API**、クラウド（Bedrock / Vertex AI / Foundry）も再有効化。
- 7/1〜7/7 の「50%まで無料」は当初**一時的な移行猶予（grace period）**とされていました（→その後2度延長され、上記のとおり 7/20 に Max/Team Premium への恒久組み込みで決着）。
- ⚠️ **クレジットのドル換算・Pro に同梱される量は未公表**です。実際の残高・上限は Claude の使用量ダッシュボードで確認してください。

### 評価：Pro では「50%枠」はすぐ尽き、実質すぐ課金圏に入りやすい

ここは Pro ユーザーが最も誤解しやすい点なので、仕組みと現実的な帰結を分けて整理します（**数値が未公表のため、以下は挙動の性質からの評価**です）。

- **「50%」は追加枠ではなく、既存の週間利用上限から切り出される割当**です。Fable 5 に使えるのは「Pro の週間枠の半分まで」で、ボーナス容量ではありません。
- **Fable 5 は“重い・高い”モデル**です。API 換算で**入力 $10 / 出力 $50（Opus 4.8 の2倍）**、さらに**新トークナイザで同じ文章でも約30%多くトークンを消費**し、想定用途も**長時間・数百万トークン規模の自律タスク**。つまり**1回の利用あたりの消費が大きい**。
- したがって、**相対的に枠の小さい Pro では、Fable 5 を本格的に使うと週間上限の50%（＝Fable 5 割当）に短時間で到達しやすい**、というご懸念は**方向として妥当**です。数回の長めのエージェント作業で割当を使い切ることは十分あり得ます。
- ただし「到達＝即課金」ではありません。**7/7 までは、50%に到達しても自動課金はされず、Fable 5 の無料利用が止まるだけ**です（週次リセット待ち、または Opus 4.8 等へ切替。追加利用〔extra usage / credits〕を自分でオプトインしている場合を除く）。
- **課金が本格的に効くのは 7/8 以降**です。この日から Fable 5 は従量課金（クレジット）になるため、**割当を使い切った後も使い続ける＝そのまま実費**になります。

> **まとめると**: Pro における「無料で使える Fable 5」は、実質**“少量ですぐ枯れる試用枠”**と捉えるのが安全です。7/7 まではコスト0で試せますが、**継続的・本格的に Fable 5 を回すならクレジット課金は前提**。枠を厚く持ちたいなら Max など上位プラン、または API 直利用（従量）を検討するのが現実的です。厳密なしきい値は週間上限値・クレジット換算が未公表のため計算できず、**ダッシュボードでの実測が必須**です。

### 【2026-07-08〜】本人確認（生体・政府ID）の導入に注意

**7月8日にプライバシーポリシーが改定**され、収集データに**生体情報（顔スキャン）と政府発行ID**が明記されます。消費者向けプラン（Pro 等）では、第三者サービス **Persona による本人確認**（政府発行 ID ＋ライブ自撮り＋顔形状スキャン）が、**特定機能へのアクセスやクレジット付与の条件**として求められ得ます。**Fable 5 はその最有力の対象**とされています。

- ⚠️ ただし「**Fable 5 の全利用に本人確認が必須なのか、一部機能だけか**」は現時点で断定できません。生体情報の提供に抵抗がある場合は 7/8 以降に自分のアカウントで要件を確認してください。
- **API 顧客は現行ポリシーでは本人確認の対象外（exempt）**。Enterprise は法人 attestation で代替の可能性。

### 再開時に追加された安全策

再開にあたり Anthropic は**新しいサイバーセキュリティ分類器**を追加し、今回のトリガーとなった jailbreak 手法を**99%超でブロック**すると報じられています。ブロック時は多くの場合 **Claude Opus 4.8 にフォールバック**（拒否は `stop_reason: "refusal"`。該当はセッションの5%未満）。通常のコーディング/デバッグでも**誤検知（false positive）**が起き得る点は Anthropic 自身が認めています。

> 出典: [9to5Mac（再開・50%措置）](https://9to5mac.com/2026/07/01/claude-fable-5-cleared-to-return-as-us-lifts-anthropics-export-control-restriction/) ／ [MarkTechPost（新分類器）](https://www.marktechpost.com/2026/07/01/anthropic-redeploys-claude-fable-5-on-july-1-after-us-export-controls-lift-adds-new-cybersecurity-classifier/) ／ [digitalapplied（7/7 クレジット移行）](https://www.digitalapplied.com/blog/claude-fable-5-usage-credits-july-7-pricing-guide-2026) ／ [Anthropic 公式 Docs](https://platform.claude.com/docs/en/about-claude/models/introducing-claude-fable-5-and-claude-mythos-5)。輸出管理停止〜再開の全経緯は [Fable 5 輸出管理停止の全記録](/mdTechKnowledge/blog/claude-fable-5-export-control-suspension/) を参照。

## API利用時の重要な破壊的変更（移行前に必読）

> **モデル紹介だけ見て「モデルIDを差し替えるだけ」で移行すると事故ります。** Fable 5 / Mythos 5 には **API レベルの破壊的変更**が複数あり、Anthropic 公式リリースノート（2026年6月9日）に明記されています。API / SDK で利用する場合は以下を必ず確認してください。

| 変更点 | 内容 |
|---|---|
| **新トークナイザ（約30%増）** | Fable 5 / Mythos 5 は Claude Opus 4.7 で導入されたトークナイザを採用。**Opus 4.7 より前のモデルと比べ、同じテキストで約30%多くトークンを消費**します。コスト・コンテキスト見積もりは token counting API（`model: "claude-fable-5"`）で実測してください。 |
| **`stop_reason: "refusal"`** | リクエスト時・応答生成中に安全分類器が走り、拒否されると Messages API が `stop_reason: "refusal"` を返します。**出力生成前に拒否された分は課金されません**。`stop_details.category` は従来の `cyber` / `bio` に加え **`reasoning_extraction`**（リバースエンジニアリング等の利用規約制限による拒否）が追加されました。 |
| **opt-in `fallbacks` パラメータ** | 拒否されたリクエストを別モデルで再実行する `fallbacks` パラメータ（beta。Claude API / Claude Platform on AWS で対応、**Message Batches API は非対応**）。課金はフォールバック先モデルのレートです。 |
| **手動 thinking バジェット非対応（400エラー）** | Fable 5 / Mythos 5 は **adaptive thinking のみ**。`thinking: {"type":"disabled"}` は不可で、**手動の extended thinking バジェット指定・assistant prefill はいずれも 400 エラー**になります。`thinking.display` の既定は `"omitted"`（`"summarized"` で要約取得）。 |
| **30日データ保持が必須（ZDR不可）** | Fable 5 は Claude API で **30日間のデータ保持が必須**で、**ゼロデータ保持（ZDR）環境では利用できません**。 |

これらは Opus 4.8 等からの「モデルID差し替えだけ」の移行では踏み抜きやすい落とし穴です。とりわけ **トークン約30%増（実コスト増）**・**手動 thinking バジェットの 400 エラー**・**ZDR不可**は既存パイプラインに直接影響します。API 移行の詳細チェックリストは別記事で扱う予定です。

*（出典: [Anthropic Platform release notes 2026年6月9日](https://platform.claude.com/docs/en/release-notes/overview)）*

## まとめと次回予告

第1話のポイントを整理します。

- **Claude Fable 5** は、Anthropic の最強クラス「Mythos」を初めて一般公開した安全装置付きモデル（2026年6月9日公開）
- 非公開の **Mythos 5** とは同一の基盤モデルで、違いは安全装置の有無だけ。95%超のセッションでは両者は実質同一
- 高リスク領域（サイバー・生物化学・蒸留）では応答を **Opus 4.8 にフォールバック**
- 価格は入力 $10 / 出力 $50（Mythos Preview の半額未満／報道では Opus 4.8 の2倍）
- API・主要クラウドで提供、6/22まではプラン同梱、6/23から従量課金、30日データ保持必須

次回・第2話では、Fable 5 が「どれだけ強いのか」を、SWE-Bench Pro をはじめとする**ベンチマーク数値と実世界の事例**（5,000万行のコード移行を1日で完了した Stripe の例など）で具体的に見ていきます。

→ [Claude Fable 5 徹底解剖②ベンチマーク・性能編](/blog/claude-fable-5-benchmarks/)

## 参考資料

- [Claude Fable 5 and Claude Mythos 5（Anthropic 公式発表）](https://www.anthropic.com/news/claude-fable-5-mythos-5)
- [Claude Fable（Anthropic 製品ページ）](https://www.anthropic.com/claude/fable)
- [Anthropic releases Claude Fable, a version of Mythos, days after warning AI is becoming too dangerous（TechCrunch）](https://techcrunch.com/2026/06/09/anthropic-released-claude-fable-5-its-most-powerful-model-publicly-days-after-warning-ai-is-getting-too-dangerous/)
- [Anthropic releases Mythos-like AI model to the public, Claude Fable 5（CNBC）](https://www.cnbc.com/2026/06/09/anthropic-mythos-claude-fable-5.html)
- [Anthropic just released public Mythos-class AI model called Claude Fable（9to5Mac）](https://9to5mac.com/2026/06/09/anthropic-just-released-public-mythos-class-ai-model-called-claude-fable-details-here/)
- [Claude Fable 5 available on Amazon Bedrock（About Amazon）](https://www.aboutamazon.com/news/aws/claude-fable-5-anthropic-available-amazon-bedrock)
