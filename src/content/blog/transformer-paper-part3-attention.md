---
title: "Attention Is All You Need 徹底解説【第3回】Self-Attention と Multi-Head Attention の深層解剖"
date: 2026-04-14
category: "AI論文解説"
tags: ["Transformer", "Attention", "論文解説", "Self-Attention", "Multi-Head Attention", "深層学習"]
excerpt: "「Attention Is All You Need」論文解説シリーズ第3回。Transformerの核心技術であるScaled Dot-Product AttentionとMulti-Head Attentionの仕組みを、行列計算のレベルまで掘り下げて詳細に解説します。"
---

## はじめに

[第2回](/mdTechKnowledge/blog/transformer-paper-part2-architecture/)では、Transformerの全体構造を俯瞰しました。第3回では、そのアーキテクチャの**核心部分**であるAttention機構にフォーカスします。

論文のSection 3.2で詳述されているScaled Dot-Product AttentionとMulti-Head Attentionは、Transformerが高い性能を発揮する最大の理由です。この回では、直感的な理解から数式レベルの詳細まで、段階的に深掘りしていきます。

---

## 1. Query, Key, Value — 直感的な理解

### 1.1 検索エンジンのアナロジー

Self-Attentionを理解する最も直感的な方法は、**検索エンジン**に例えることです。

<iframe src="/mdTechKnowledge/guides/transformer-p3-qkv-intuition.html" width="100%" height="480" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

- **Query（Q）**: 「何を探しているか」— 検索バーに入力するクエリ
- **Key（K）**: 「何を持っているか」— 各ドキュメントのタグや見出し
- **Value（V）**: 「実際に渡す情報」— ドキュメントの本文内容

Attention機構は、QueryとKeyの類似度を計算し、その類似度に基づいてValueの加重和を取る操作です。検索エンジンで言えば、「検索クエリに最もマッチするドキュメントの内容を、関連度に応じてブレンドして返す」イメージです。

### 1.2 Self-Attentionにおける Q, K, V

Self-Attentionでは、Q, K, V はすべて**同じ入力**から生成されます。入力ベクトル $x$ に対して、3つの異なる重み行列を掛けることで変換します：

$$Q = xW^Q, \quad K = xW^K, \quad V = xW^V$$

つまり、1つのトークンが「何を探しているか（Q）」「自分は何を提供できるか（K）」「実際に渡す情報（V）」という3つの異なる役割を同時に持つのです。

---

## 2. Scaled Dot-Product Attention

### 2.1 計算フロー

Attentionの計算は以下の4ステップで行われます。

<iframe src="/mdTechKnowledge/guides/transformer-p3-scaled-dot-product.html" width="100%" height="500" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{QK^T}{\sqrt{d_k}}\right)V$$

各ステップを詳しく見ていきましょう。

### 2.2 ステップ1: QK^T — 類似度スコアの計算

最初のステップは、QueryとKeyの内積によるスコア計算です。

<iframe src="/mdTechKnowledge/guides/transformer-p3-qk-matmul-step.html" width="100%" height="500" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

$Q$ が $n \times d_k$ 行列、$K^T$ が $d_k \times n$ 行列の場合、結果は $n \times n$ のスコア行列になります。この行列の $(i, j)$ 要素は、位置 $i$ のQueryと位置 $j$ のKeyの内積、つまり**位置 $i$ が位置 $j$ にどれだけ注目すべきか**のスコアです。

内積が大きいほど2つのベクトルが「似ている」ことを意味します。これは、コサイン類似度と本質的に同じ発想です（正規化していない点のみ異なる）。

### 2.3 ステップ2: スケーリング — なぜ √d_k で割るのか

ここがScaled Dot-Product Attentionの「Scaled」の部分です。スコアを $\sqrt{d_k}$ で割ります。

<iframe src="/mdTechKnowledge/guides/transformer-p3-scaling-factor-effect.html" width="100%" height="480" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

**なぜスケーリングが必要なのか？**

$d_k$ 次元のベクトル同士の内積を考えます。各要素が平均0、分散1の独立した確率変数だと仮定すると、内積の分散は $d_k$ に比例します。つまり：

- $d_k = 64$ の場合、内積の標準偏差は $\sqrt{64} = 8$
- $d_k = 512$ の場合、内積の標準偏差は $\sqrt{512} \approx 22.6$

内積の絶対値が大きくなると、softmaxの入力が極端な値を取り、出力が**ほぼone-hotベクトル**（1つが1に近く、残りはほぼ0）になります。この状態では勾配がほぼ0になり、学習が停滞します。

$\sqrt{d_k}$ で割ることで、内積の分散を1に正規化し、softmaxが適切な確率分布を出力するようにしています。

### 2.4 ステップ3: Softmax — スコアを確率分布に変換

スケーリング後のスコアにsoftmaxを適用し、各行を確率分布に変換します。

<iframe src="/mdTechKnowledge/guides/transformer-p3-softmax-to-weights.html" width="100%" height="400" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

$$\alpha_{ij} = \frac{\exp(s_{ij})}{\sum_{k=1}^{n} \exp(s_{ik})}$$

ここで $s_{ij} = \frac{Q_i \cdot K_j^T}{\sqrt{d_k}}$ です。softmaxにより：
- すべての重みは0以上
- 各行の重みの合計は1（確率分布）
- スコアが高いほど重みが大きい

### 2.5 ステップ4: 加重和 — Attention出力の計算

最後に、Attention重みとValueの加重和を計算します。

<iframe src="/mdTechKnowledge/guides/transformer-p3-weighted-value-sum.html" width="100%" height="420" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

位置 $i$ のAttention出力は：

$$\text{output}_i = \sum_{j=1}^{n} \alpha_{ij} V_j$$

つまり、位置 $i$ のトークンの新しい表現は、全トークンのValueベクトルの重み付き平均です。**Attention重みが大きいトークンほど、出力に大きく寄与**します。

---

## 3. Multi-Head Attention

### 3.1 なぜ複数のヘッドが必要か

1つのAttentionヘッドでは、1種類の「注目パターン」しか学習できません。しかし、言語には複数の関係性が同時に存在します：

- **構文的依存**: 主語-動詞の一致（「猫**が**...好き**です**」）
- **意味的関連**: 代名詞の照応（「猫は...it」→ "it"は"猫"を指す）
- **近接関係**: 隣接するトークン同士の局所的な関係
- **長距離依存**: 文の冒頭と末尾の関係

Multi-Head Attentionは、これらの異なるパターンを**並列に**学習するための仕組みです。

### 3.2 Multi-Headの構造

<iframe src="/mdTechKnowledge/guides/transformer-p3-multi-head-split-concat.html" width="100%" height="480" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

$$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \ldots, \text{head}_h)W^O$$

$$\text{head}_i = \text{Attention}(QW_i^Q, KW_i^K, VW_i^V)$$

論文では $h = 8$ ヘッド、各ヘッドの次元は：

$$d_k = d_v = \frac{d_{\text{model}}}{h} = \frac{512}{8} = 64$$

各ヘッドの射影行列の次元：

- $W_i^Q \in \mathbb{R}^{512 \times 64}$
- $W_i^K \in \mathbb{R}^{512 \times 64}$
- $W_i^V \in \mathbb{R}^{512 \times 64}$
- $W^O \in \mathbb{R}^{512 \times 512}$（8ヘッドの結合後の変換）

### 3.3 計算の流れ

1. 入力（512次元）に各ヘッド固有の射影行列 $W_i^Q$, $W_i^K$, $W_i^V$ を掛けて、64次元のQ, K, Vを生成
2. 各ヘッドで独立にScaled Dot-Product Attentionを計算（8つの並列計算）
3. 8つのヘッドの出力（各64次元）を結合（Concat）して512次元に戻す
4. 結合した結果に $W^O$ を掛けて最終出力を生成

### 3.4 計算コストの比較

8ヘッドのMulti-Head Attentionと、512次元の単一ヘッドAttentionの計算量はほぼ同等です。

| 方式 | 次元 | ヘッド数 | 1ヘッドの計算量 | 合計計算量 |
|:---|:---:|:---:|:---:|:---:|
| 単一ヘッド | 512 | 1 | $O(n^2 \cdot 512)$ | $O(n^2 \cdot 512)$ |
| Multi-Head | 64 | 8 | $O(n^2 \cdot 64)$ | $O(n^2 \cdot 64 \times 8) = O(n^2 \cdot 512)$ |

次元を $h$ 分割しているため、各ヘッドの計算量は $1/h$ に削減されます。$h$ 個のヘッドを並列に実行しても、合計計算量は単一ヘッドの場合と同程度です。つまり、**追加コストほぼゼロで複数の注目パターンを学習できる**のです。

### 3.5 各ヘッドは何を学習するか

<iframe src="/mdTechKnowledge/guides/transformer-p3-head-specialization.html" width="100%" height="480" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

学習後の各ヘッドを調べると、異なるヘッドが異なる言語的パターンに特化していることが観察されています。例えば：

- あるヘッドは**構文的な依存関係**（主語-動詞）に注目
- あるヘッドは**近接トークン**（隣接する単語）に注目
- あるヘッドは**長距離の照応関係**（代名詞の参照先）に注目

この「自動的な役割分担」は設計者が明示的に指定するものではなく、学習を通じて自然に発現します。

---

## 4. Transformerにおける3種類のAttention

Transformerでは、Attention機構が3つの異なる場面で使われています。

<iframe src="/mdTechKnowledge/guides/transformer-p3-three-attention-types.html" width="100%" height="420" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

### 4.1 Encoder Self-Attention

- **場所**: Encoderの各層
- **Q, K, V**: すべて前の層の出力（または入力Embedding）
- **特徴**: 入力系列内の全位置間で双方向のAttentionを計算
- **マスク**: なし（全位置を参照可能）

例えば、「The animal didn't cross the street because it was too tired」という文で、"it"が"animal"を参照する関係を学習できます。

### 4.2 Decoder Masked Self-Attention

- **場所**: Decoderの各層（最初のサブレイヤー）
- **Q, K, V**: すべて前の層の出力
- **特徴**: 出力系列内の現在位置以前のみ参照可能
- **マスク**: あり（未来の位置を $-\infty$ でマスク）

<iframe src="/mdTechKnowledge/guides/transformer-p3-causal-mask.html" width="100%" height="450" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

マスクは以下のような下三角行列です：

$$M = \begin{pmatrix} 0 & -\infty & -\infty & -\infty & -\infty \\ 0 & 0 & -\infty & -\infty & -\infty \\ 0 & 0 & 0 & -\infty & -\infty \\ 0 & 0 & 0 & 0 & -\infty \\ 0 & 0 & 0 & 0 & 0 \end{pmatrix}$$

このマスクをスコアに加算してからsoftmaxを適用すると、$e^{-\infty} \approx 0$ により未来の位置のAttention重みが0になります。

### 4.3 Decoder Cross-Attention

- **場所**: Decoderの各層（2番目のサブレイヤー）
- **Q**: Decoderの前のサブレイヤーの出力
- **K, V**: Encoderの最終出力
- **特徴**: DecoderがEncoder全体を参照
- **マスク**: なし

これにより、出力トークンを生成する際に入力文全体の情報を参照できます。第1回で解説したBahdanau Attentionの一般化と見なすことができます。

---

## 5. 計算量の比較 — なぜSelf-Attentionが優れているか

<iframe src="/mdTechKnowledge/guides/transformer-p3-attention-complexity.html" width="100%" height="400" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

論文のTable 1では、Self-Attention、RNN、CNNの計算量を3つの観点で比較しています。

| 層タイプ | 層あたりの計算量 | 逐次操作数 | 最大パス長 |
|:---|:---:|:---:|:---:|
| Self-Attention | $O(n^2 \cdot d)$ | $O(1)$ | $O(1)$ |
| Recurrent | $O(n \cdot d^2)$ | $O(n)$ | $O(n)$ |
| Convolutional | $O(k \cdot n \cdot d^2)$ | $O(1)$ | $O(\log_k(n))$ |

**逐次操作数**: Self-Attentionは$O(1)$です。全位置間の計算を行列積で並列実行できるため、GPU/TPUの能力を最大限に活用できます。RNNの$O(n)$とは決定的な差です。

**最大パス長**: 任意の2トークン間の情報の「距離」です。Self-Attentionでは全位置が直接接続されるため$O(1)$、RNNでは$n$ステップを経由する必要があり$O(n)$です。短いパス長は長距離依存の学習を容易にします。

**計算量のトレードオフ**: Self-Attentionの計算量 $O(n^2 \cdot d)$ は系列長 $n$ の二乗に比例するため、$n$ が非常に大きい場合（数千〜数万トークン）は問題になります。$n < d$（系列長がモデル次元より小さい）の一般的なケースではSelf-Attentionが有利で、$n > d$ のケースではRNNの方が計算効率が良くなります。

---

## 6. Dot-Product Attention vs Additive Attention

<iframe src="/mdTechKnowledge/guides/transformer-p3-dot-product-vs-additive.html" width="100%" height="420" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

論文では、Additive Attention（Bahdanau型）とDot-Product Attention（Transformer型）を比較しています。

**Additive Attention**:

$$\text{score}(s, h) = v_a^T \tanh(W_a s + U_a h)$$

- 追加パラメータ $v_a, W_a, U_a$ が必要
- tanh関数の計算コスト
- $d_k$ が小さい場合はDot-Productと同等の精度

**Dot-Product Attention**:

$$\text{score}(Q, K) = \frac{Q \cdot K^T}{\sqrt{d_k}}$$

- 追加パラメータ不要
- 高度に最適化された行列積演算を利用可能
- $d_k$ が大きい場合はスケーリングが必須

論文がDot-Productを選んだ理由は明確です。行列積はGPU/TPUで高度に最適化されているため、実行速度とメモリ効率の両面で大きな優位性があります。スケーリングさえ行えば精度面でもAdditive Attentionと同等の性能を発揮します。

---

## まとめ

第3回では、Transformerの核心技術であるAttention機構を詳細に解剖しました。

- **Q, K, V**: 「何を探すか」「何を持っているか」「何を渡すか」の3つの役割
- **Scaled Dot-Product Attention**: $QK^T$ でスコアを計算し、$\sqrt{d_k}$ でスケーリングしてsoftmaxを適用し、Valueの加重和を取る
- **Multi-Head Attention**: 8つのヘッドが異なる注目パターンを並列に学習。計算コストの増加なしに表現力を向上
- **3種類のAttention**: Encoder Self-Attention（双方向）、Decoder Masked Self-Attention（因果的）、Cross-Attention（Encoder-Decoder間）
- **計算量**: Self-Attentionは逐次操作数$O(1)$・最大パス長$O(1)$で、RNNに対して大きな優位性

次回の第4回では、Transformerの残りの重要なコンポーネント—Positional Encoding、学習率スケジューリング、ドロップアウト、Label Smoothingなど—を解説します。

---

## 参考文献

- Vaswani, A., et al. (2017). "Attention Is All You Need." *NeurIPS.*
- Bahdanau, D., Cho, K., & Bengio, Y. (2015). "Neural Machine Translation by Jointly Learning to Align and Translate." *ICLR.*
- Luong, M. T., Pham, H., & Manning, C. D. (2015). "Effective Approaches to Attention-based Neural Machine Translation." *EMNLP.*
