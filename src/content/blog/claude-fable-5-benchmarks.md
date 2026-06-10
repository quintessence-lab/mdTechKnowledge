---
title: "Claude Fable 5 徹底解剖② — 2ヶ月の仕事が1日で終わる。Fable 5 の5,000万行移行と SWE-Bench Pro 80.3% の衝撃"
date: 2026-06-10
category: "Claude技術解説"
tags: ["Claude Fable 5", "Anthropic", "ベンチマーク", "SWE-Bench", "Fable 5", "AIモデル", "性能比較"]
excerpt: "Claude Fable 5 はどれだけ強いのか。SWE-Bench Pro で 80.3%、自社コア分析ベンチで初の90%超え、そして5,000万行の Ruby コードベースの移行を1日で完了した Stripe の事例まで。本シリーズ第2話では、Fable 5 のベンチマーク数値と実世界の能力実証を、Opus 4.8・GPT-5.5・Gemini 3.1 Pro との比較とともに整理する。数値の出所（公式かサードパーティ集計か）も明示する。"
draft: false
---

**本記事は3部構成の第2話「ベンチマーク・性能編」です。**

- 第1話: [Claude Fable 5 徹底解剖①概要編](/blog/claude-fable-5-overview/)
- 第2話（本記事）: [Claude Fable 5 徹底解剖②ベンチマーク・性能編](/blog/claude-fable-5-benchmarks/)
- 第3話: [Claude Fable 5 徹底解剖③安全設計・社会的文脈編](/blog/claude-fable-5-safety-context/)

---

## はじめに

第1話では Claude Fable 5 の全体像——Mythos クラス初の一般公開モデルであること、Mythos 5 との関係、価格や提供形態——を整理しました。本記事では「**では実際、どれだけ強いのか**」を、ベンチマーク数値と実世界の事例で具体的に見ていきます。

## 数値の読み方 — 「公式は画像、数値は書き起こし」

最初に重要な注意点です。Anthropic の公式発表本文には、SWE-Bench Pro などの**具体的なスコア数値がほとんどテキストで記載されていません**。公式は「テスト済みのほぼすべてのベンチで最高水準」「自社コア分析ベンチで初の90%突破」といった**定性的な表現**と、ページ内の**ベンチマーク比較画像**で性能を示しています。

そのため、以下に示す個別スコアの多くは、**各メディアやベンチマーク集計サイトが公式の比較画像を書き起こした二次情報**です。本記事では公式の定性記述とサードパーティ集計を区別して記載します。数値はおおむね複数ソースで一致していますが、一部端数のゆれ（例：SWE-Bench Pro を 80.3% とするか 80.0% とするか）がある点はご了承ください。

## ソフトウェアエンジニアリング性能

Fable 5 が最も得意とするのが、エージェント的なコーディングと大規模なソフトウェアエンジニアリングです。

以下は Anthropic が公開した比較を各メディアが書き起こしたものです。

| ベンチマーク | Fable 5 / Mythos 5 | Opus 4.8 | GPT-5.5 | Gemini 3.1 Pro |
|--------------|--------------------|----------|---------|----------------|
| **SWE-Bench Pro** | **80.3%** | 69.2% | 58.6% | 54.2% |
| Terminal-Bench 2.1 | 88.0% | 82.7% | 83.4% | 70.7% |
| FrontierCode Diamond（難問） | 29.3% | 13.4% | 5.7% | — |

- **SWE-Bench Pro 80.3%** は、実世界のソフトウェアエンジニアリング課題をエージェントとして解く厳しいベンチマークでのスコアです。複数のサードパーティ集計で一致しています。
- 注目すべきは **FrontierCode Diamond** のような難問セットで、Fable 5（29.3%）は Opus 4.8（13.4%）の約2.2倍、GPT-5.5（5.7%）の約5倍のスコアを出しています。**問題が難しくなるほど差が開く**という Fable 5 の特性が、ここに表れています。

## 知識労働・推論・マルチモーダル

コーディング以外の領域でも、Fable 5 は幅広く高スコアを示しています（同じく Anthropic 公開比較のサードパーティ書き起こし）。

| ベンチマーク | Fable 5 / Mythos 5 | Opus 4.8 | GPT-5.5 | Gemini 3.1 Pro |
|--------------|--------------------|----------|---------|----------------|
| GDPval-AA（知識労働, Elo） | 1932 | 1890 | 1769 | 1314 |
| Humanity's Last Exam（ツールなし） | 59.0% | 49.8% | 41.4% | 44.4% |
| Humanity's Last Exam（ツールあり） | 64.5% | 57.9% | 52.2% | 51.4% |
| OSWorld-Verified（コンピュータ操作） | 85.0% | 83.4% | 78.7% | 76.2% |
| HealthBench Professional | 66.0% | 56.9% | 51.8% | — |
| MMMU（マルチモーダル／ビジョン） | 89.31% | — | — | — |

- **ビジョン**: Anthropic は「ビジョンで卓越」と定性的に述べており、PDF 内の図表・チャートの読解や、科学図表からの数値抽出を強みとして挙げています。
- **分析ベンチ**: Anthropic は「Fable 5 は**自社のコア分析ベンチマークで初めて90%を突破した**——Opus 比で+10ポイント」と公式に述べています（一部メディアはこれを "Hex Analytical Benchmark" と表記していますが、固有名は公式本文にはなく、正確な小数値も未確認です）。

> **GPQA について**: 推論ベンチとして有名な GPQA は、Anthropic の Fable 5 比較表には**含まれていません**（公式スコア非公表）。参考に GPT-5.5 の GPQA Diamond は 93.6% と報じられていますが、Fable 5 の値は不明なため、本記事では並置を避けています。

## 実世界の能力実証

ベンチマーク以上に Fable 5 の実力を示すのが、Anthropic が公式発表で挙げた**顧客の実例**です。

- **Stripe — 5,000万行のコード移行を1日で**: 通常チームで2ヶ月超かかる **5,000万行（50-million-line）の Ruby コードベース**の移行を、Fable 5 は**1日**で完了しました。Anthropic はこれを「数ヶ月分のエンジニアリングを数日に圧縮した」と表現しています。
- **物理研究 — GPT-5.5 の4日を36時間で**: ある外部パートナーのベンチで、GPT-5.5 が4日かけて達成した結果に、Fable 5 は**推論トークン約1/3・36時間**で到達したと報告されています。
- **Pokémon FireRed をビジョンのみでクリア**: 従来モデルは補助システムが必要だったゲームクリアを、Fable 5 はスクリーンショットだけを見る最小ハーネス（vision-only）で達成しました。
- **Slay the Spire で Opus の3倍**: 永続メモリの活用により、ゲーム性能が Opus 4.8 の約3倍に改善し、最終アクトへの到達頻度も3倍になったとされています。
- **創薬・タンパク質設計（Mythos 5）**: 14個のタンパク質ターゲットのうち9個で、深掘りに値する候補を返したと報告されています。

これらはいずれも Anthropic 公式発表に基づく事例です（一部の「約10倍加速」「ゲノミクスの自律研究」といった表現はメディア要約段階のもので、本記事では公式が明示した範囲に絞っています）。

## 「長く複雑なほど差が開く」という特性

Fable 5 の性能を語るうえで、Anthropic 自身が繰り返し強調しているのが次の特性です。

> 「**タスクが長く複雑であるほど、Fable 5 の他モデルに対するリードは大きくなる**（The longer and more complex the task, the larger Fable 5's lead over our other models）」

単純な一問一答では他モデルとの差は小さくても、**複数日にわたる高複雑度の自律ワークフロー**になるほど、Fable 5 が劇的に引き離す——という特性です。先述の FrontierCode Diamond のような難問での大差や、Stripe の大規模移行が、この特性を裏づけています。

## 競合との比較 — Opus 4.8 / GPT-5.5 / Gemini 3.1 Pro

ここまでの数値を踏まえ、競合との関係を整理します。

- **対 Claude Opus 4.8**: ほぼすべてのベンチで Fable 5 が上回ります。なお Opus 4.8 は、Fable 5 が高リスク領域を検知したときの**フォールバック先**でもあります（第3話で詳述）。
- **対 GPT-5.5**: コーディング、知識労働、ツール使用で Fable 5 が優位です。ただし **GPQA Diamond は GPT-5.5 が 93.6%**（Fable 5 は公式値なし）、**ARC-AGI-2 も GPT-5.5 が 85.0%** と報じられており、推論系の一部では GPT-5.5 が強い領域もあります。
- **対 Gemini 3.1 Pro**: 比較可能なほぼ全項目で Fable 5 が上回り、Terminal-Bench（70.7%）や GDPval（1314）などで大きな差がついています。

価格性能の観点では、以下の関係になります（価格はいずれも100万トークンあたり、報道ベース）。

| モデル | 入力 | 出力 |
|--------|------|------|
| Claude Fable 5 | $10 | $50 |
| Claude Opus 4.8 | $5 | $25 |
| GPT-5.5 | $5 | $30 |

Fable 5 は最高水準の性能と引き換えに、価格も最高水準です。「**長く複雑なタスクほど差が開く**」という特性を踏まえると、単純なタスクには Opus 4.8、難度の高い大規模タスクには Fable 5、という使い分けが現実的でしょう。

## まとめと次回予告

第2話のポイントです。

- **SWE-Bench Pro 80.3%** をはじめ、コーディング・知識労働・ビジョンの幅広いベンチで Fable 5 が最高水準（数値の多くは公式比較画像のサードパーティ書き起こし）
- **問題が難しく・長くなるほど他モデルとの差が拡大**するのが Fable 5 の核心的な特性
- **Stripe の5,000万行を1日で移行**など、実世界の大規模タスクで実力を実証
- GPQA など一部の推論ベンチでは GPT-5.5 が強い領域もあり、公平に見れば「全方位で圧勝」ではない
- 価格は Opus 4.8 の2倍（報道ベース）。難度の高い大規模タスクでこそ真価を発揮

次回・第3話では、この強力なモデルを安全に公開するための仕組み——高リスク領域での **Opus 4.8 へのフォールバック**、30日データ保持ポリシー、専門家の懸念、そして「政府を不安にさせた技術」をめぐる社会的文脈を掘り下げます。

→ [Claude Fable 5 徹底解剖③安全設計・社会的文脈編](/blog/claude-fable-5-safety-context/)

## 参考資料

- [Claude Fable 5 and Claude Mythos 5（Anthropic 公式発表）](https://www.anthropic.com/news/claude-fable-5-mythos-5)
- [Claude Fable 5 Benchmarks 2026（BenchLM.ai）](https://benchlm.ai/models/claude-fable)
- [Claude Fable 5 / Mythos 5 release benchmarks（digitalapplied）](https://www.digitalapplied.com/blog/claude-fable-5-mythos-5-release-benchmarks-2026)
- [Claude Fable 5 vs GPT-5.5 frontier comparison（digitalapplied）](https://www.digitalapplied.com/blog/claude-fable-5-vs-gpt-5-5-frontier-comparison-2026)
- [Claude Fable 5 review（llm-stats）](https://llm-stats.com/blog/research/claude-fable-5-review)
- [Claude Fable 5 is generally available for GitHub Copilot（GitHub Changelog）](https://github.blog/changelog/2026-06-09-claude-fable-5-is-generally-available-for-github-copilot/)
- [Fable 5 now available in Harvey（Harvey）](https://www.harvey.ai/blog/fable-5-now-available-in-harvey)
