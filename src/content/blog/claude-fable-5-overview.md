---
title: "Claude Fable 5 完全ガイド①概要編 — Mythos クラス初の一般公開モデルとは"
date: 2026-06-10
category: "Claude技術解説"
tags: ["Claude Fable 5", "Anthropic", "Mythos", "Fable 5", "Mythos 5", "AIモデル", "Claude"]
excerpt: "2026年6月9日、Anthropic は最強クラスのモデル群「Mythos」を初めて一般公開した。その公開版が Claude Fable 5 だ。Fable 5 と非公開の Mythos 5 は同じ基盤モデルで、違いは安全装置の有無だけ——高リスク領域では応答を Claude Opus 4.8 にフォールバックする。本シリーズ第1話では、Fable 5 とは何か、Mythos 5 との関係、モデルファミリーの系譜、「AIは危険になりすぎている」と警告した数日後に最強モデルを公開したリリースの文脈、価格、そして使える場所までを整理する。"
draft: false
---

**本記事は3部構成の第1話「概要編」です。** Claude Fable 5 を、①概要（本記事）→ ②ベンチマーク・性能 → ③安全設計と社会的文脈、の順で詳しく解説します。

- 第1話（本記事）: [Claude Fable 5 完全ガイド①概要編](/blog/claude-fable-5-overview/)
- 第2話: [Claude Fable 5 完全ガイド②ベンチマーク・性能編](/blog/claude-fable-5-benchmarks/)
- 第3話: [Claude Fable 5 完全ガイド③安全設計・社会的文脈編](/blog/claude-fable-5-safety-context/)

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
| プラン同梱 | **2026年6月9日〜6月22日**は Pro / Max / Team / シートベース Enterprise に追加費用なしで同梱。**6月23日に各プランから削除**され、以降は従量課金（クレジット）が必要 |
| データ保持 | 安全監視のため**30日間のデータ保持が必須**（学習には使用せず、新規ジェイルブレイク防御や誤検知特定にのみ利用） |
| フォールバック課金 | 高リスク領域で Opus 4.8 に転送された分には、Fable 価格を課金しない |

特に注意したいのが**6月22日までの無料同梱期間**です。Pro / Max / Team / Enterprise の契約者は、この期間中は追加費用なしで Fable 5 を試せますが、6月23日以降は各プランから外れ、従量課金に切り替わります。

また、Mythos クラスのトラフィックには**30日間のデータ保持が必須化**されました。従来ゼロ保持契約だった企業にも適用されるため、機密性の高い用途では事前の確認が必要です（この新ポリシーをめぐる議論は第3話で扱います）。

## まとめと次回予告

第1話のポイントを整理します。

- **Claude Fable 5** は、Anthropic の最強クラス「Mythos」を初めて一般公開した安全装置付きモデル（2026年6月9日公開）
- 非公開の **Mythos 5** とは同一の基盤モデルで、違いは安全装置の有無だけ。95%超のセッションでは両者は実質同一
- 高リスク領域（サイバー・生物化学・蒸留）では応答を **Opus 4.8 にフォールバック**
- 価格は入力 $10 / 出力 $50（Mythos Preview の半額未満／報道では Opus 4.8 の2倍）
- API・主要クラウドで提供、6/22まではプラン同梱、6/23から従量課金、30日データ保持必須

次回・第2話では、Fable 5 が「どれだけ強いのか」を、SWE-Bench Pro をはじめとする**ベンチマーク数値と実世界の事例**（5,000万行のコード移行を1日で完了した Stripe の例など）で具体的に見ていきます。

→ [Claude Fable 5 完全ガイド②ベンチマーク・性能編](/blog/claude-fable-5-benchmarks/)

## 参考資料

- [Claude Fable 5 and Claude Mythos 5（Anthropic 公式発表）](https://www.anthropic.com/news/claude-fable-5-mythos-5)
- [Claude Fable（Anthropic 製品ページ）](https://www.anthropic.com/claude/fable)
- [Anthropic releases Claude Fable, a version of Mythos, days after warning AI is becoming too dangerous（TechCrunch）](https://techcrunch.com/2026/06/09/anthropic-released-claude-fable-5-its-most-powerful-model-publicly-days-after-warning-ai-is-getting-too-dangerous/)
- [Anthropic releases Mythos-like AI model to the public, Claude Fable 5（CNBC）](https://www.cnbc.com/2026/06/09/anthropic-mythos-claude-fable-5.html)
- [Anthropic just released public Mythos-class AI model called Claude Fable（9to5Mac）](https://9to5mac.com/2026/06/09/anthropic-just-released-public-mythos-class-ai-model-called-claude-fable-details-here/)
- [Claude Fable 5 available on Amazon Bedrock（About Amazon）](https://www.aboutamazon.com/news/aws/claude-fable-5-anthropic-available-amazon-bedrock)
