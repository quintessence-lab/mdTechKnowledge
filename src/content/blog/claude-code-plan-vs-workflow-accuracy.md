---
title: "Claude Code の plan mode と Dynamic Workflows で精度はどう変わるか — 計画先行 vs 検証付きマルチエージェントを一次データで読み解く"
date: 2026-05-31
category: "Claude技術解説"
tags: ["Claude Code", "plan mode", "Dynamic Workflows", "マルチエージェント", "精度", "検証", "ベンチマーク", "一次ソース"]
excerpt: "「実行前に計画を立てる（plan mode）」のと「複数エージェントで検証まで回す（Dynamic Workflows）」のとで、出力の精度はどう変わるのか。Anthropic 公式に直接比較データは存在しないが、背後の技術（計画先行 vs 検証付きマルチエージェント）には豊富な学術・実務データがある。Plan-and-Solve・Tree of Thoughts・ADaPT・Reflexion・SWE-bench 系の検証、Anthropic 自社の +90.2%、Bun 移植の 99.8% まで一次ソースの数値で横断整理し、「計画は精度を保証しない」「内的自己修正は逆効果」という反証も含めて、実務での使い分けを導く。"
draft: false
---

**対象**: Claude Code の plan mode / Dynamic Workflows を使う技術者
**スタンス**: 一次ソース（Anthropic 公式・arXiv 論文・公式リーダーボード）主義。数値はベンチマーク名・モデル世代込みで提示します。

---

## はじめに — 「計画すれば精度が上がる」「検証すれば精度が上がる」は本当か

Claude Code には、出力の質を高めるとされる2つの対照的なアプローチがあります。

- **plan mode（計画先行）**: 実装に入る前に、Claude にコードベースを調査させ「変更計画」を立てさせて承認する読み取り専用フェーズ（`Shift + Tab` 2回 / `/plan`）。
- **Dynamic Workflows（検証付きマルチエージェント）**: プロンプトに `workflow` と添えるだけで、Claude が JavaScript スクリプトを自動生成し、複数のサブエージェントを並列起動。独立した試行を**互いに敵対的レビュー（adversarial review）**させ、答えが収束するまで検証する。

直感的には「どちらも精度を上げそう」です。では、**実際にどれだけ・どんな条件で精度が変わるのか？** そして **両者を比べたらどちらが効くのか？**

本記事の結論を先に言うと——**この2つを同一タスク・同一指標で直接比較した公開データは存在しません**。しかし、その背後にある技術（計画先行 vs 検証付き実行）には**豊富な学術・実務データ**があり、精度の変化は驚くほど明確に読み解けます。そして最も重要なのは、**Anthropic 自身が両者を「対立」ではなく「補完」として融合させている**という事実です。

> 本記事は2026年5月時点の Anthropic 公式ドキュメント・公式ブログと、arXiv 等の一次論文に基づきます。数値はモデル世代に強く依存するため、各数値に測定条件を併記します。

---

## 1. 結論を先に — 直接比較データは「ない」。だが傾向は明確

調査の核心を最初にまとめます。

| 問い | 答え |
|:---|:---|
| plan mode と Dynamic Workflows を直接比較した公開データはあるか | **ない**（公式・報道・論文いずれにも） |
| plan mode 側の精度根拠は | 開発者 Boris Cherny の「one-shot success rate を劇的に改善」という**定性表現のみ**（pt 値なし） |
| Dynamic Workflows 側の精度根拠は | Bun 移植で「既存テスト**99.8%**通過」という**単一事例のみ**（対照群なし） |
| 公式の立場は | 「計画 **vs** 検証」ではなく「計画 **＋** 検証」。両者は役割の異なる相補的なゲート |
| 背後技術の傾向は | 計画先行＝**中程度の底上げ**（難タスクほど大）／検証付き＝**大幅向上だが条件付き** |

つまり「A と B、どちらが精度が高い？」という問いの立て方自体が、実は的を外しています。**plan mode は実装前の整流、Dynamic Workflows（の検証）は実装後の独立チェック**であり、Anthropic は「リードエージェントがまず計画を立て → 並列サブエージェントが独立に検証する」と、**両方を同時に使っています**（§7）。

以下、(A) 計画先行と (B) 検証付きが、それぞれ**どれだけ精度を動かすのか**を一次データで見ていきます。

---

## 2. (A) 計画先行で精度はどう変わるか

学術的には「実行前に計画・分解を立てる」手法は数多く研究されています。共通する傾向は明確です——**タスクが長い・多段・構成的（compositional）であるほど効果が大きく、短い単純タスクでは効果が小さい（むしろ逆効果のことも）**。

### 代表的な計画先行手法の精度

| 手法 | ベンチマーク（モデル） | baseline → 改善後 | 差分 |
|:---|:---|:---|:---|
| **Plan-and-Solve+** | GSM8K（text-davinci-003） | 56.4% → 59.3% | +2.9pt |
| **Plan-and-Solve+** | 算術6データセット平均 | 70.4% → 76.7% | +6.3pt |
| **Plan-and-Solve+** | Last Letters（記号推論） | 64.8% → 75.2% | +10.4pt |
| **Least-to-Most** | SCAN 構成的汎化（code-davinci-002） | CoT 16.2% → **99.7%** | 約 +83.5pt |
| **Least-to-Most** | GSM8K 全問 | 60.87% → 62.39% | +1.5pt |
| **Least-to-Most** | GSM8K 5ステップ以上の難問 | 39.07% → 45.23% | +6.2pt |
| **Tree of Thoughts** | Game of 24 成功率（GPT-4） | CoT 10% → **74%** | +64pt |
| **Plan-and-Act** | WebArena-Lite 成功率 | ReAct 型 9.85% → **57.58%** | 従来 SOTA +8.48pt 超 |

baseline はいずれも Zero-shot-CoT / CoT / 標準プロンプト。出典: Plan-and-Solve（Wang et al., ACL 2023）、Least-to-Most（Zhou et al., 2022）、Tree of Thoughts（Yao et al., NeurIPS 2023）、Plan-and-Act（Erdogan et al., ICML 2025）。

### 何が読み取れるか

- **難しいタスクほど効く**: Least-to-Most は GSM8K 全体ではわずか +1.5pt ですが、5ステップ以上の難問では +6.2pt、構成的汎化を要する SCAN では **+83pt** という桁違いの効果を見せます。同様に Tree of Thoughts は探索を要する Game of 24 で CoT の 10% を 74% に跳ね上げます。
- **効果の機序**: ①計算ミス・手順抜けの削減（Plan-and-Solve の誤答分析では計算エラー 7%→5%、手順抜け 12%→7%）、②探索空間の拡張とバックトラック（ToT）、③高レベル計画と低レベル実行の分離による長期一貫性（Plan-and-Act）。
- **Anthropic 公式の位置づけ**: plan mode は「コーディングに直行すると**間違った問題を解くコード（code that solves the wrong problem）**を生むリスクを下げる前段の整流」とされます。

ただし——**計画は精度を「保証」しません**。この重要な反証は §4 で扱います。

---

## 3. (B) 検証付きマルチエージェントで精度はどう変わるか

「実行結果を検証する」「複数エージェントで独立に解いて突き合わせる」アプローチは、計画先行より**改善幅が大きい傾向**があります。ただし決定的な条件が1つあります——**検証信号が外部・客観的に接地（grounded）しているか**です（§5 で詳述）。

### 検証付き手法の精度

| 手法 | ベンチマーク（モデル） | baseline → 改善後 | 差分 |
|:---|:---|:---|:---|
| **Multi-agent（orchestrator-worker）** | Anthropic 内部 research eval | single-agent Opus 4 比 | **+90.2%**（相対）|
| **Reflexion**（コード実行で検証） | HumanEval pass@1 | 80%（GPT-4 SOTA）→ **91%** | +11pt |
| **Self-Consistency**（CoT 多数決） | GSM8K（PaLM-540B） | 56.5% → 74.4% | +17.9pt |
| **PRM**（中間軌跡の是正） | SWE-bench（Claude） | 31.8% → 40.6% | +8.8pt |
| **SWE-Gym verifier**（best-of-n 選択） | SWE-bench Verified（Claude 3.5 Sonnet） | 30.8% → 40.6% | +9.8pt |
| **DeepSWE ハイブリッド検証**（best@16） | SWE-bench Verified（32B） | 42.2% → **59%** | +16.8pt |
| **Skywork-SWE**（test-time scaling） | SWE-bench Verified | 38.0% → 47.0% | +9pt |
| **Multi-Agent Code Verification** | SWE-Bench | 32.8% → **79.3%** | +46.5pt |

出典: Anthropic「How we built our multi-agent research system」、Reflexion（Shinn et al., NeurIPS 2023）、Self-Consistency（Wang et al., ICLR 2023）、SWE-Gym（arXiv:2412.21139）、When Agents go Astray / PRM（arXiv:2509.02360）、DeepSWE（Together AI）、Skywork-SWE（arXiv:2506.19290）、Multi-Agent Code Verification（arXiv:2511.16708）。

### Claude Code 文脈の実例

Anthropic 公式ブログが Dynamic Workflows の唯一の具体数値として挙げるのが、**Bun の Zig→Rust 移植（約750,000行）**です。構造マッピング → 並列移植（**各ファイルに2レビュアー**）→ build/test の fix ループという多段ワークフローで、移植後に**既存テストスイートの 99.8% が通過**、初回コミットからマージまで11日でした（The Register でも裏取り済み。ただし**単一パスや plan mode との対照値は非公表**で、プルーフ・オブ・コンセプトの位置づけ）。

公式の核心主張は明快です——**「作業した本人が採点者になってはいけない（the agent doing the work isn't the one grading it）」**。fresh model に結果を**反証（refute）させる**独立チェックこそが、無人実行が長引くほど精度担保に不可欠だとされます。

---

## 4. 重要な反証 — 「計画も検証も、必ず精度を上げるわけではない」

ここが本記事で最も価値のあるパートです。「計画すれば／検証すれば精度が上がる」という素朴な期待を、一次データは何度も裏切ります。

| 反証 | ベンチマーク（モデル） | 結果 | 出典 |
|:---|:---|:---|:---|
| **純粋な計画先行は悪化しうる** | WebShop（GPT-3.5） | ReAct 32.0% → Plan-and-Execute **17.0%（-15pt）** | ADaPT（NAACL 2024 Findings） |
| **固定計画は無効化も** | ALFWorld | Plan-and-Execute は 43.3% のまま改善ゼロ | ADaPT |
| **内的自己修正は逆効果** | GSM8K（GPT-4） | 95.5% → **89.0%（-6.5pt）** | Huang et al.（ICLR 2024） |
| **内的自己修正で大幅悪化** | CommonSenseQA（GPT-3.5） | 75.8% → **38.1%（-37.7pt）** | Huang et al. |
| **マルチエージェント検証が効かない例** | HumanEval（GPT-4o） | self-consistency 95.0% → **92.0%（-3pt）** | BoN-MAV（arXiv:2502.20379） |
| **検証/投票の逓減** | HotpotQA（現代モデル, 20サンプル） | +0.4% のみ | Reevaluating Self-Consistency（2025） |

ポイントを整理します。

1. **計画は保証しない**: 事前に固定計画を立てるだけの Plan-and-Execute は、WebShop でベースラインを **15pt 下回りました**。Anthropic 公式も「plan mode は**オーバーヘッドを増やす**。diff を一文で説明できる小さく明確な変更（typo 修正・ログ追加・変数リネーム）では計画を飛ばせ」と明言しています。
2. **内的自己修正は危険**: 外部フィードバックなしに LLM が自分の答えを見直すと、**正しかった初期解を誤って書き換えて**精度が下がります（GPT-4 GSM8K で 95.5→89.0%）。
3. **マルチエージェント討論は過大評価されがち**: "Should we be going MAD?" / "Stop Overvaluing Multi-Agent Debate" は、計算量を揃えると討論の利得の大半は**討論そのものではなく投票（アンサンブル）効果**由来で、単一エージェントの self-consistency をほとんど上回らないと指摘します。
4. **コスト**: マルチエージェントはトークン消費が**通常チャットの約15倍**（通常のエージェントは約4倍）。Anthropic は「共有コンテキストや密な調整を要する**コーディングのようなタスクではマルチエージェントの性能は低い**」と明言しており、+90.2% はあくまで横展開探索（breadth-first）型タスク限定の値です。

---

## 5. 鍵は「検証信号の接地」と「実行フィードバックのループ」

反証を踏まえると、精度を上げる/下げるの分かれ目が見えてきます。

### (1) 検証は「外部・客観的な信号」に接地している時だけ効く

精度が**上がった**検証は、すべて外部の客観信号を使っています——Reflexion は**コード実行結果**、SWE 系の verifier は**テストの pass/fail**、CRITIC は**外部ツール**、Self-Consistency は**多数決**。逆に精度が**下がった**のは、外部信号のない**内的自己批判**でした。

Anthropic 公式も同じ原則を述べます：「エージェントが各ステップで環境から **ground truth**（ツール呼び出し結果やコード実行結果）を得て進捗を評価することが極めて重要だ」。

→ **Claude Code のテスト実行・型チェック・build 終了コードは、まさにこの「外部・客観的な検証信号」に該当します**。だから Claude Code 文脈での検証は、学術知見上は精度向上方向に働きます。

### (2) 最も効くのは「静的計画」でも「事後検証」でもなく、その中間

ADaPT と Tree of Thoughts が示す、最も重要な知見がこれです。

| 手法 | ベンチマーク | 結果 |
|:---|:---|:---|
| **ADaPT**（失敗検知=検証をトリガーに適応的に再分解） | TextCraft | 固定計画 Plan-and-Execute を **+25pt** 上回る |
| **ADaPT** | ALFWorld | Reflexion を **+14.1pt** 上回る |
| **Plan-and-Act** の dynamic replanning（実行フィードバックで計画修正） | WebArena-Lite | 静的計画比 **単独 +10.31pt** |
| **Tree of Thoughts**（中間状態を自己評価して枝刈り） | Game of 24 | ToT 74% vs **検証なし並列多数決（CoT-SC）は19%止まり** |

特に Tree of Thoughts の対比は示唆的です——**「並列化するだけ」では 19% 止まり**で、**「実行ループの中で中間状態を検証し、見込みのない枝を切る」ことで初めて 74% に届く**。つまり精度の主因は**並列化そのものではなく、検証を実行ループに織り込むこと**です。

→ **「最初に計画を立てて終わり」でも「最後に検証して終わり」でもなく、実行結果を観測して計画を修正し続けるループが最も精度が高い**。これが一次データ全体を貫く最大のメッセージです。

---

## 6. plan mode と Dynamic Workflows の使い分け早見表

ここまでの知見を、Claude Code の実務に落とし込みます。

| 状況 | 推奨アプローチ | 根拠 |
|:---|:---|:---|
| diff を一文で説明できる小修正（typo・ログ追加・リネーム） | **どちらも不要**（直接実行） | 計画はオーバーヘッド（公式）。短タスクで計画効果は小〜負 |
| アプローチが不確実／複数ファイル／不慣れなコード | **plan mode** | 「間違った問題を解く」リスクを下げる前段の整流（公式） |
| 出力にテスト・型チェックなど客観的な合否がある | **検証ループを必ず付ける** | 外部信号に接地した検証は +8〜17pt（SWE 系） |
| 誤答コストが高い／無人で長時間動かす | **Dynamic Workflows の adversarial review** | 「作業者≠採点者」の独立チェックが精度担保に不可欠（公式） |
| 横展開的に多経路を探索する調査タスク | **マルチエージェント** | breadth-first で +90.2%（公式）。ただしトークン約15倍 |
| 密に協調するコーディングの逐次タスク | **単一エージェント＋計画＋テスト検証** | マルチエージェントは密協調タスクで性能低（公式） |
| 外部信号がなく「LLM に自己採点させるだけ」 | **避ける** | 内的自己修正は精度を下げうる（-6〜38pt） |

---

## 7. Anthropic が実際にやっていること — 計画と検証の融合

「計画 vs 検証」という二項対立が的外れである最大の証拠が、Anthropic 自身の実装です。

公式ブログ「How we built our multi-agent research system」によれば、リードエージェントは——

1. **まずアプローチを熟考し、計画を Memory に保存**（plan：長時間タスクで戦略を失わないための状態管理）
2. その計画に沿って**並列サブエージェントをファンアウト**（独立した context window・ツール・探索経路で「関心の分離」）
3. 各サブエージェントの結果を**取り込む前にチェック**し、**他のエージェントが反証を試み、答えが収束するまで反復**（verify）

つまり **plan mode 的な「計画先行」と Dynamic Workflows 的な「並列検証」は、1つのシステムの中で順番に組み合わされています**。Dynamic Workflows 自体も、公式が「計画をコードに移すことで、独立エージェントが互いの発見を**敵対的にレビューしてから報告する反復可能な品質パターン**を適用でき、**単一パスより信頼できる結果**が得られる」と説明しており、「計画（をコード化する）」と「検証」が同居しています。

なお、更新後の plan mode 自体が**複数サブエージェントを並列起動してコードベースを多視点で探索し計画を生成する**ようになっており、「計画」と「マルチエージェント」の境界はすでに溶けつつあります。

---

## 8. 数値を読むときの注意（留保）

本記事の数値を引用・活用する際は、次の留保を必ず併せて確認してください。

- **直接比較は最後まで存在しない**: 「plan mode 有り/無し」「Dynamic Workflows 有り/無し」を同一タスク・同一指標で測った Claude Code 固有の pt 差データは公開されていません。本記事は**背後技術の知見からの推論**です。
- **モデル世代依存**: Plan-and-Solve / Least-to-Most / ToT などは text-davinci-002/003・GPT-4 初期世代の値です。最新モデルは素の精度が高く、**gap が縮小している可能性**があります。
- **内部評価／PoC 事例**: Anthropic の +90.2% は約20クエリ起点の**内部 research eval（LLM-as-judge）**、Bun 移植の 99.8% は**単一の概念実証事例**で、いずれも公開ベンチの厳密スコアではありません。
- **ベンチ自体の信頼性**: SWE-bench には solution leakage 等の信頼性問題も別途報告されており、resolve rate の解釈には留保が要ります。
- **Boris Cherny の主張は定性のみ**: 「one-shot success rate を劇的に改善」に pt 値の裏付けはありません。

---

## まとめ

- **plan mode と Dynamic Workflows を直接比較した公開データは存在しない**。公式の立場は「対立」ではなく「**計画＋検証**」の補完。
- **(A) 計画先行**は、タスクが**難しい・多段・構成的なほど大きく効く**（Least-to-Most で SCAN +83pt、ToT で Game of 24 +64pt）。逆に**短い単純タスクでは小〜負**（公式も小修正では plan mode 不要と明言）。
- **(B) 検証付きマルチエージェント**は改善幅が大きい（公式 +90.2%、SWE 系で +8〜17pt、コード検証で +46.5pt）が、**検証信号が外部・客観的に接地している時だけ効く**。
- **反証は決定的**: 純粋な固定計画は -15pt 悪化しうる。外部信号なしの内的自己修正は -6〜38pt 悪化。マルチエージェント討論の利得は大半が投票効果。マルチエージェントはトークン約15倍。
- **最強は中間形**: 「最初に計画して終わり」でも「最後に検証して終わり」でもなく、**実行結果を観測して計画を修正し続けるループ**（ADaPT・dynamic replanning・ToT の枝刈り）が最も精度が高い。
- **Claude Code 実務**: テスト・型チェックという外部検証信号を必ず与え、不確実なタスクには plan mode、誤答コストの高い無人実行には Dynamic Workflows の adversarial review を使う——そして両者は併用できる。

「計画すれば精度が上がる」「検証すれば精度が上がる」は、**条件付きでは正しく、無条件では誤り**です。効くのは「難しいタスクへの計画」と「外部信号に接地した検証」、そして両者を回し続けるループ。Anthropic 自身がそう実装している以上、私たちも plan mode と Dynamic Workflows を**二択ではなく組み合わせ**として捉えるのが、最も精度の出る使い方です。

---

## 参考資料

**Anthropic 公式**
- [Claude Code Docs: Best practices](https://code.claude.com/docs/en/best-practices)
- [Claude Code Docs: Orchestrate subagents at scale with dynamic workflows](https://code.claude.com/docs/en/workflows)
- [Claude Code Docs: Choose a permission mode（plan mode）](https://code.claude.com/docs/en/permission-modes)
- [Anthropic 公式ブログ: Introducing Dynamic Workflows in Claude Code](https://claude.com/blog/introducing-dynamic-workflows-in-claude-code)
- [Anthropic Engineering: How we built our multi-agent research system](https://www.anthropic.com/engineering/built-multi-agent-research-system)
- [Anthropic Engineering: Building Effective Agents](https://www.anthropic.com/engineering/building-effective-agents)

**計画先行（planning）の学術研究**
- [Plan-and-Solve Prompting（Wang et al., ACL 2023, arXiv:2305.04091）](https://arxiv.org/abs/2305.04091)
- [Least-to-Most Prompting（Zhou et al., arXiv:2205.10625）](https://arxiv.org/abs/2205.10625)
- [Tree of Thoughts（Yao et al., NeurIPS 2023, arXiv:2305.10601）](https://arxiv.org/abs/2305.10601)
- [Plan-and-Act（Erdogan et al., ICML 2025, arXiv:2503.09572）](https://arxiv.org/abs/2503.09572)
- [ADaPT: As-Needed Decomposition and Planning（Prasad et al., NAACL 2024 Findings, arXiv:2311.05772）](https://arxiv.org/abs/2311.05772)

**検証・マルチエージェントの学術研究**
- [Self-Consistency（Wang et al., ICLR 2023, arXiv:2203.11171）](https://arxiv.org/abs/2203.11171)
- [Reflexion（Shinn et al., NeurIPS 2023, arXiv:2303.11366）](https://arxiv.org/abs/2303.11366)
- [Self-Refine（Madaan et al., NeurIPS 2023, arXiv:2303.17651）](https://arxiv.org/abs/2303.17651)
- [Large Language Models Cannot Self-Correct Reasoning Yet（Huang et al., ICLR 2024, arXiv:2310.01798）](https://arxiv.org/abs/2310.01798)
- [Should we be going MAD?（Smit et al., arXiv:2311.17371）](https://arxiv.org/abs/2311.17371)

**コーディングエージェントの実務ベンチ**
- [SWE-Gym（arXiv:2412.21139）](https://arxiv.org/abs/2412.21139)
- [When Agents go Astray: Course-Correcting SWE Agents with PRMs（arXiv:2509.02360）](https://arxiv.org/abs/2509.02360)
- [DeepSWE（Together AI）](https://www.together.ai/blog/deepswe)
- [Multi-Agent Verification / BoN-MAV（arXiv:2502.20379）](https://arxiv.org/abs/2502.20379)

---

*本記事は2026年5月時点の公式ドキュメント・公式ブログ・arXiv 論文に基づいています。plan mode と Dynamic Workflows を直接比較した公開データは存在せず、本記事は背後技術の一次データからの整理・推論です。ベンチマーク数値はモデル世代・測定条件に強く依存し、一部（Anthropic +90.2%・Bun 移植 99.8%）は内部評価・概念実証事例である点に留意してください。*
