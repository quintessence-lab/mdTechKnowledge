---
title: "Claude Fable 5 完全ガイド③ — 「政府を不安にさせた技術」に売り物のブレーキは付けられるのか"
date: 2026-06-10
category: "Claude技術解説"
tags: ["Claude Fable 5", "Anthropic", "AI安全性", "Project Glasswing", "Mythos 5", "セキュリティ", "Fable 5"]
excerpt: "最強クラスのモデルを、なぜ安全に一般公開できるのか。Claude Fable 5 は高リスク領域（サイバー・生物化学・蒸留）を検知すると応答を Claude Opus 4.8 にフォールバックする。本シリーズ最終話では、この安全設計の仕組み、30日データ保持ポリシー、ジェイルブレイク耐性をめぐる専門家の懸念、Mythos と政府・Project Glasswing の関係、そして評価額9,650億ドルでOpenAIを上回ったAnthropicのIPO文脈までを整理する。"
draft: false
---

**本記事は3部構成の第3話（最終話）「安全設計・社会的文脈編」です。**

- 第1話: [Claude Fable 5 完全ガイド①概要編](/blog/claude-fable-5-overview/)
- 第2話: [Claude Fable 5 完全ガイド②ベンチマーク・性能編](/blog/claude-fable-5-benchmarks/)
- 第3話（本記事）: [Claude Fable 5 完全ガイド③安全設計・社会的文脈編](/blog/claude-fable-5-safety-context/)

---

## はじめに

第1話で全体像を、第2話で性能を見てきました。最終話となる本記事では、最大の論点に踏み込みます——「**なぜ、最強クラスのモデルを安全に一般公開できるのか**」、そして「**それでも残る懸念は何か**」です。

## フォールバック安全設計 — 危ない質問は Opus 4.8 へ

Fable 5 の安全性の核心は、**分類器（classifier）によるフォールバック機構**です。

Fable 5 には分類器が組み込まれており、特定の高リスク領域に関するリクエストを検知すると、その応答を **Claude Opus 4.8 が代わりに処理**します。対象となる3領域は以下です。

| 領域 | フォールバックの理由 |
|------|----------------------|
| サイバーセキュリティ | 攻撃的なサイバータスク（脆弱性の悪用・エクスプロイト開発）への悪用防止 |
| 生物・化学 | デュアルユース（軍民両用）リスクの防止 |
| 蒸留（distillation） | 競合モデルへの能力抽出（モデルの「蒸留」）防止 |

重要な数値として、Anthropic は「**早期データでは95%超の Fable セッションでフォールバックがまったく起きていない**」と述べています。つまりフォールバックが発動するのは5%未満で、大半のユーザーは Fable 5 の能力をそのまま使えます。さらに、**Opus 4.8 に転送されたリクエストには Fable 価格を課金しない**仕組みになっています。

この設計こそが、「危険な双子」である Mythos 5（安全装置解除版）を非公開にしたまま、その能力をほぼそのまま一般公開できる理由です。

## 30日データ保持ポリシー — 新たな論点

Fable 5 / Mythos 5 のような Mythos クラスのトラフィックには、**30日間のデータ保持が必須化**されました。これは安全監視——新規ジェイルブレイク手法の検知や、フォールバック分類器の誤検知の特定——のためで、Anthropic は「**学習には使用しない**」と説明しています。

ただしこのポリシーは、**従来ゼロ保持契約だった企業にも適用**されます。機密性の高いデータを扱う企業にとっては運用上の検討事項となり、一部メディア（Yahoo Tech など）は「業界の前例になりうる」と論評しています。

## ジェイルブレイク耐性 — 「無敵ではない」を公式も認める

安全装置がどれだけ堅牢かも論点です。Anthropic の主張と、その限界は以下の通りです。

- **Anthropic の主張**: 外部バグバウンティを含む **1,000時間超のテストで、普遍的なジェイルブレイク（universal jailbreak）はゼロ**。公開されている30種のジェイルブレイク手法でも、サイバー攻撃計画やエクスプロイト開発につながる有害なシングルターン要求の成功は0件。
- **公式が認める限界**: 一方で Anthropic は、**UK AISI（英国 AI 安全研究所）が短い初期テスト期間内に普遍的ジェイルブレイクの発見へ「前進した（made progress towards）」**とも記しています。つまり「完全に無敵」ではないことを公式が認めています。

実際、Fable 5 のサイバー能力ベンチ（ExploitBench）は78.0%と高い一方、ブロッキングモードが機能している状態では「攻撃的サイバータスクの進捗は0%」とされ、安全装置が能力を確実に抑え込んでいる、という構図です。

## Mythos と政府・Project Glasswing

Fable 5 の「双子」である Mythos が、なぜこれほど警戒されてきたのか。その背景が **Project Glasswing** と政府との関係です。

- 2026年4月の Mythos Preview お披露目は「ウォール街と政府高官を釘付けにした」と報じられ、Mythos Preview は「**主要なOSとWebブラウザすべてに数千件の重大・深刻なサイバー脆弱性**」を自律的に発見したとされます。
- **Project Glasswing** は、この能力を防御目的で使うための枠組みです。Mythos 5 は Glasswing を通じて米政府と協力して展開され、Mythos Preview の段階で既に金融機関・ソフトウェア企業・医療ネットワークを含む150超の組織に提供されていました。Mythos 5 ではアクセスが15カ国超・約150の新組織に拡大され、**重要インフラ（critical infrastructure）を運営する組織が優先**されています。
- Anthropic は NBC に対し「**何年も前から連邦政府に全モデルの早期アクセスを提供してきた**」と述べ、Fable 5 も公開前に政府がテスト済みだとしています。

### 「271件の Firefox 脆弱性」の正確な意味

Mythos の能力を象徴する数字として「**271**」がよく引用されますが、正確に理解する必要があります。

- これは **2026年4月**（Fable 5 公開より前の Mythos 評価）に、Mythos が **Firefox で発見した脆弱性の件数**で、**Mozilla 公式ブログが裏付けています**（Firefox 150 はこの初回評価で発見された271件の脆弱性の修正を含む、と記載）。
- ただし「**271個すべてがゼロデイ**」という表現は誇張の可能性があります。セキュリティ専門家の Bruce Schneier らは、271件の多くが低重大度（多層防御・ハードニング・非悪用パス）であり、すべてがゼロデイではないと指摘しています。
- したがって本記事では「**271件の脆弱性（ゼロデイを含む）**」と表記し、「271ゼロデイ」とは断定しません。これは Fable 5 の発表とは別の、**2026年4月の Mythos の実績**である点も押さえておくべきです。

## 専門家の懸念

安全設計に対しては、複数のセキュリティ専門家が懸念を表明しています（以下は各専門家個人の見解です）。

- **Alissa Knight（Assail 創業者/CEO）**: 「**無敵のモデルなど存在しない（No model is impervious）**。Anthropic は普遍的ジェイルブレイクの完全防止はおそらく不可能だと平易に認めている。同社の戦略は、いかなるジェイルブレイクも、スケールする前に検知・無効化できるよう十分に遅く・高コストにすることだ」
- **Peter Garraghan（Mindgard CSO）**: フォールバック機構は Fable 5 がリクエストを正しく検知・理解できることを前提とするが、攻撃者は通常、真意を隠したり、一見安全な指示を悪用したりする、と指摘。
- **Yossi Torati（セキュリティ企業CEO）**: 「Anthropic は現状サイバー能力を自社に留め、世界をその能力から守っている。だが、我々がその能力に備えなくてよい、ということにはならない」

これらは、フォールバック分類器の「検知漏れ」と、能力が拡散したときの社会的備えという、二つの本質的な論点を突いています。

## 市場・IPO の文脈

Fable 5 のリリースは、Anthropic の事業面でも大きな意味を持ちます。

- Anthropic は**評価額9,650億ドル（$965B）**で資金調達を完了し、3月末時点で8,520億ドル（$852B）だった **OpenAI を上回った**と報じられています。年内の IPO の可能性も取り沙汰されています。
- CNBC は続報の見出しで、Mythos の「非公開ロールアウトがウォール街を揺るがしてから2ヶ月後」の公開だと位置づけました。
- 一方、価格面では懸念も出ています。Wells Fargo のストラテジストは「**急騰する AI トークンコストこそ、AI 相場への最も差し迫った脅威**」と警告しており、Fable 5 の入力$10/出力$50という価格設定は、この文脈でも注目されています。

## 「危険」と警告しながら公開する論理

最後に、第1話でも触れた最大の論点——「AI は危険になりすぎていると警告した数日後に、なぜ最強モデルを公開したのか」に立ち返ります。

TechCrunch は「偽善（hypocrisy）」という見方を "安直な見方" だと評しつつ、Anthropic の論理を次のように整理しています。

> 基盤モデル（頭脳）は Mythos と同一でも、危険な双子である Mythos 5 は公開せず、**安全装置で包んだ Fable 5 だけを世に出す**。競合がガードレールなしで同等のモデルを出すのを待つより、自分たちが「Mythos クラスが世に出る形」を定義したほうがよい。

この「自分たちで安全な公開の形を定義する」という姿勢と、Jack Clark が訴えた業界全体の「ブレーキペダル」論——協調的で検証可能なグローバルな一時停止メカニズム——は、Anthropic にとっては一貫した戦略の両面だ、という整理になります。それを説得力ある選択と見るか、矛盾と見るかは、フォールバック機構が実運用でどれだけ堅牢かにかかっていると言えるでしょう。

## シリーズ総括

全3話を通じて、Claude Fable 5 を整理してきました。

- **概要（第1話）**: Mythos クラス初の一般公開モデル。非公開の Mythos 5 と同一基盤で、違いは安全装置の有無。価格は入力$10/出力$50
- **性能（第2話）**: SWE-Bench Pro 80.3% など幅広いベンチで最高水準。Stripe の5,000万行を1日で移行。問題が難しく長いほど差が開く
- **安全と文脈（第3話）**: 高リスク領域は Opus 4.8 にフォールバック（発動は5%未満）。30日データ保持の必須化、専門家の懸念、政府・Glasswing との関係、評価額でOpenAI超え

Fable 5 は「能力」と「安全」を分離するのではなく、**安全装置を能力の一部として組み込む**という Anthropic の設計思想を体現したモデルです。その思想が現実の脅威にどこまで耐えるかは、これからの実運用が答えを出していくことになります。

→ シリーズ第1話に戻る: [Claude Fable 5 完全ガイド①概要編](/blog/claude-fable-5-overview/)

## 参考資料

- [Claude Fable 5 and Claude Mythos 5（Anthropic 公式発表）](https://www.anthropic.com/news/claude-fable-5-mythos-5)
- [Anthropic releases Claude Fable, days after warning AI is becoming too dangerous（TechCrunch）](https://techcrunch.com/2026/06/09/anthropic-released-claude-fable-5-its-most-powerful-model-publicly-days-after-warning-ai-is-getting-too-dangerous/)
- [Anthropic unveils Claude Fable 5, keeps Mythos restricted（BankInfoSecurity・専門家コメント）](https://www.bankinfosecurity.com/anthropic-unveils-claude-fable-5-keeps-mythos-restricted-a-31934)
- [Anthropic releases Fable 5 model, built on the same tech that spooked the government（NBC LA）](https://www.nbclosangeles.com/news/national-international/anthropic-releases-powerful-fable-5-model-mythos/3901792/)
- [AI security and zero-day vulnerabilities（Mozilla Blog・271件の裏付け）](https://blog.mozilla.org/en/privacy-security/ai-security-zero-day-vulnerabilities/)
- [Claude Mythos has found 271 vulnerabilities in Firefox（Schneier on Security・271件の精査）](https://www.schneier.com/blog/archives/2026/04/claude-mythos-has-found-271-zero-days-in-firefox.html)
- [Anthropic to release public Mythos model amid IPO plans（CoinGape・IPO文脈）](https://coingape.com/anthropic-to-release-public-mythos-model-claude-fable-amid-ipo-plans/)
