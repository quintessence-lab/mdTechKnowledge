---
title: "Attention Is All You Need 徹底解説【第1回】なぜTransformerが必要だったのか — RNN/LSTMの限界と革新の背景"
date: 2026-04-14
category: "AI論文解説"
tags: ["Transformer", "Attention", "論文解説", "RNN", "LSTM", "深層学習"]
excerpt: "2017年に発表された「Attention Is All You Need」論文の詳細解説シリーズ第1回。Transformer以前のNLPモデル（RNN/LSTM）が抱えていた根本的な課題と、Attention機構の先行研究を丁寧に解説します。"
---

## はじめに — この連載シリーズについて

「Attention Is All You Need」は、2017年にGoogle BrainとGoogle Researchのチームによって発表された、現代AIにとって最も重要な論文のひとつです。著者はAshish Vaswani、Noam Shazeer、Niki Parmar、Jakob Uszkoreit、Llion Jones、Aidan N. Gomez、Łukasz Kaiser、Illia Polosukhinの8名。この論文が提案した**Transformer**アーキテクチャは、GPT、BERT、Claude、Vision Transformerなど、現在のAI技術のほぼすべての基盤となっています。

この全5回の連載では、論文の内容を一つひとつ丁寧に解きほぐしていきます。

| 回 | テーマ |
|:---:|:---|
| **第1回（本記事）** | なぜTransformerが必要だったのか — RNN/LSTMの限界と革新の背景 |
| 第2回 | Transformerアーキテクチャの全体像 — 構造を読み解く |
| 第3回 | Self-AttentionとMulti-Head Attentionの深層解剖 |
| 第4回 | Positional Encoding、学習テクニック、正規化 — 訓練を支える仕掛け |
| 第5回 | 実験結果・BLEU新記録・そして世界を変えた波及効果 |

第1回では、Transformerが登場する以前のNLPモデルが抱えていた根本的な課題を深く理解することで、なぜこの論文が革命的だったのかを明らかにします。

---

## 1. 系列変換（Sequence-to-Sequence）タスクとは

自然言語処理（NLP）における中核的な課題のひとつが**系列変換（seq2seq）タスク**です。これは、ある系列（文や文字列）を別の系列に変換する問題で、具体的には以下のようなタスクが該当します。

- **機械翻訳**: 「私は猫が好きです」→ "I like cats"
- **文書要約**: 長い文章 → 短いサマリー
- **対話生成**: ユーザーの質問 → システムの応答
- **音声認識**: 音声信号の系列 → テキストの系列

これらのタスクに共通するのは、**入力系列の長さと出力系列の長さが異なる可能性がある**ということです。この「可変長→可変長」の変換を高精度に実現することが、2010年代のNLP研究の大きなテーマでした。

---

## 2. RNN（再帰型ニューラルネットワーク）の仕組みと限界

### 2.1 RNNの基本構造

RNN（Recurrent Neural Network）は、系列データを扱うために設計されたニューラルネットワークです。その核心的なアイデアは、**隠れ状態（hidden state）**を時間ステップ間で受け渡すことで、過去の情報を保持するというものです。

各時間ステップ $t$ での計算は以下の通りです：

$$h_t = f(W_h h_{t-1} + W_x x_t + b)$$

ここで：
- $x_t$ は時刻 $t$ の入力ベクトル
- $h_{t-1}$ は前の時刻の隠れ状態
- $W_h$, $W_x$ は重み行列、$b$ はバイアス
- $f$ は活性化関数（通常はtanh）

この式が意味するのは、**現在の隠れ状態は、前の隠れ状態と現在の入力の両方に依存する**ということです。これにより、RNNは理論上、任意の長さの系列を処理できます。

<iframe src="/mdTechKnowledge/guides/transformer-p1-rnn-unrolled.html" width="100%" height="420" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

### 2.2 RNNの3つの根本的問題

しかし、RNNには深刻な問題がありました。

#### 問題1: 逐次処理による並列化の不可能性

RNNの計算は本質的に**逐次的（sequential）**です。$h_t$ を計算するには $h_{t-1}$ が必要であり、$h_{t-1}$ を計算するには $h_{t-2}$ が必要です。つまり、入力系列の各トークンを**1つずつ順番に**処理しなければなりません。

これは、GPU/TPUの並列計算能力を十分に活用できないことを意味します。入力系列の長さが $n$ であれば、少なくとも $n$ ステップの計算が必要です。長い文書を処理する場合、この逐次性が大きなボトルネックとなり、学習に膨大な時間がかかりました。

#### 問題2: 勾配消失問題（Vanishing Gradient Problem）

RNNを学習させる際、**誤差逆伝播（backpropagation through time, BPTT）**を用います。しかし、勾配が時間方向に逆伝播する際、各ステップで重み行列 $W_h$ が繰り返し掛けられます。

$W_h$ の最大特異値が1未満の場合、勾配は指数的に減衰します。たとえば、特異値が0.9で系列長が100の場合：

$$0.9^{100} \approx 0.0000265$$

つまり、100ステップ前の入力の影響は元の **0.00265%** にまで減衰してしまいます。これが**勾配消失問題**です。

<iframe src="/mdTechKnowledge/guides/transformer-p1-gradient-vanishing.html" width="100%" height="380" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

逆に、最大特異値が1を超えると勾配が指数的に増大する**勾配爆発問題**が発生しますが、こちらは勾配クリッピングである程度対処可能です。勾配消失の方がより根深い問題でした。

#### 問題3: 固定長ボトルネック

初期のseq2seqモデル（Sutskever et al., 2014）では、Encoder RNNが入力文全体を**1つの固定長ベクトル**（最終隠れ状態）に圧縮し、それをDecoderに渡していました。

<iframe src="/mdTechKnowledge/guides/transformer-p1-rnn-bottleneck.html" width="100%" height="400" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

「The quick brown fox jumps over the lazy dog」のような短い文であれば問題ありませんが、数百語の段落や、複雑な構造を持つ文を1つのベクトルに圧縮すると、必然的に情報が失われます。入力が長くなるほど、翻訳の品質が急激に低下する現象が観測されていました。

---

## 3. NLPモデル進化の歴史

Transformerの登場に至るまで、NLPの分野では数十年にわたる研究の積み重ねがありました。

<iframe src="/mdTechKnowledge/guides/transformer-p1-seq2seq-timeline.html" width="100%" height="380" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

| 年 | モデル/手法 | 貢献 |
|:---:|:---|:---|
| 1990 | Elman Network | 単純なRNNの提案、時系列データの学習 |
| 1997 | **LSTM** | ゲート機構による長期記憶の実現 |
| 2014 | **Seq2Seq** | Encoder-Decoderアーキテクチャの確立 |
| 2014 | GRU | LSTMの簡略版、計算効率の改善 |
| 2015 | **Bahdanau Attention** | Attention機構の導入、固定長ボトルネックの解消 |
| 2015 | Luong Attention | より効率的なAttention計算の提案 |
| 2017 | **Transformer** | Attentionのみによる系列変換の実現 |

この表の中で、特に重要なマイルストーンであるLSTMとAttention機構について、詳しく見ていきましょう。

---

## 4. LSTM — ゲート機構による長期記憶の試み

### 4.1 LSTMの設計思想

LSTM（Long Short-Term Memory）は1997年にHochreiterとSchmidhuberによって提案されました。RNNの勾配消失問題を解決するために、**ゲート機構**と**セル状態（cell state）**という2つの重要な概念を導入しました。

LSTMの核心的なアイデアは、「情報を選択的に記憶・忘却する仕組み」を明示的に設計することです。人間が文章を読む際に、重要な情報は記憶し、不要な情報は忘れるのと同じ発想です。

### 4.2 4つのゲート

LSTMは以下の4つのコンポーネントで構成されています。

<iframe src="/mdTechKnowledge/guides/transformer-p1-lstm-gate-mechanism.html" width="100%" height="520" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

**忘却ゲート（Forget Gate）** — 何を忘れるかを決定します。

$$f_t = \sigma(W_f \cdot [h_{t-1}, x_t] + b_f)$$

シグモイド関数 $\sigma$ の出力は0〜1で、0に近いほど「忘れる」、1に近いほど「覚えておく」を意味します。

**入力ゲート（Input Gate）** — 新しい情報のうち何を記憶するかを決定します。

$$i_t = \sigma(W_i \cdot [h_{t-1}, x_t] + b_i)$$

**セル候補（Cell Candidate）** — 新しい候補値を生成します。

$$\tilde{C}_t = \tanh(W_C \cdot [h_{t-1}, x_t] + b_C)$$

**セル状態の更新** — 忘却と記憶を組み合わせます。

$$C_t = f_t \odot C_{t-1} + i_t \odot \tilde{C}_t$$

ここで $\odot$ は要素ごとの積（アダマール積）です。この式が示すのは、古いセル状態を忘却ゲートでフィルタリングし、新しい候補値を入力ゲートでフィルタリングして加算する、という操作です。

**出力ゲート（Output Gate）** — セル状態のどの部分を出力するかを決定します。

$$o_t = \sigma(W_o \cdot [h_{t-1}, x_t] + b_o)$$

$$h_t = o_t \odot \tanh(C_t)$$

### 4.3 LSTMの成果と残された課題

LSTMは勾配消失問題を大幅に軽減し、より長い系列の学習を可能にしました。2014〜2016年頃には、機械翻訳、音声認識、テキスト生成など多くのタスクで最先端の性能を達成しました。

しかし、**LSTMでも解決できない問題**がありました：

1. **逐次処理の制約は残ったまま** — LSTMもRNNの一種であるため、並列化の問題は解決されていません
2. **超長距離の依存関係** — 数百トークンを超えるような長距離の依存関係は依然として困難でした
3. **計算コスト** — ゲート機構の追加により、単純なRNNよりも計算量が増大しました（4つのゲート分の行列計算）

---

## 5. Attention機構 — 固定長ボトルネックの突破

### 5.1 Bahdanau Attentionの登場

2015年、Bahdanauらは画期的なアイデアを提案しました。「Decoderが出力を生成する各ステップで、Encoderの**全ての**隠れ状態を参照できるようにする」というものです。

<iframe src="/mdTechKnowledge/guides/transformer-p1-bahdanau-attention.html" width="100%" height="500" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

具体的には、以下の手順で計算されます。

**Step 1: Alignmentスコアの計算**

Decoderの現在の状態 $s_{i-1}$ と、Encoderの各隠れ状態 $h_j$ のペアについて、関連度を示すスコアを計算します：

$$e_{ij} = a(s_{i-1}, h_j) = v_a^T \tanh(W_a s_{i-1} + U_a h_j)$$

ここで $a$ はアライメントモデル（小さなニューラルネットワーク）、$v_a$, $W_a$, $U_a$ は学習可能なパラメータです。

**Step 2: Attention重みの計算**

スコアをsoftmaxで正規化し、確率分布に変換します：

$$\alpha_{ij} = \frac{\exp(e_{ij})}{\sum_{k=1}^{n} \exp(e_{ik})}$$

**Step 3: コンテキストベクトルの計算**

Attention重みを使ってEncoderの隠れ状態の加重和を取ります：

$$c_i = \sum_{j=1}^{n} \alpha_{ij} h_j$$

このコンテキストベクトル $c_i$ は、出力の各ステップ $i$ ごとに異なる値を持ちます。つまり、「この出力トークンを生成するために、入力文のどの部分に注目すべきか」をモデルが動的に学習するのです。

### 5.2 Attention重みの可視化

Attention機構の大きな利点のひとつは、モデルの「注目」を可視化できることです。以下は機械翻訳タスクにおけるAttention重みのヒートマップの例です。

<iframe src="/mdTechKnowledge/guides/transformer-p1-attention-heatmap.html" width="100%" height="420" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

ヒートマップでは、対角線に近い部分が明るくなっていることが多いですが（語順が類似する場合）、語順が異なる言語ペアでは非対角の位置が明るくなります。これは、モデルが言語間の構造的な違いを自然に学習していることを示しています。

### 5.3 Luong Attentionとの比較

Luong et al.（2015）は、Bahdanau Attentionを改良したいくつかのバリエーションを提案しました。

| 特徴 | Bahdanau Attention | Luong Attention |
|:---|:---|:---|
| スコア関数 | $v_a^T \tanh(W_a s_{i-1} + U_a h_j)$（加法型） | $s_i^T W_a h_j$ または $s_i^T h_j$（乗法型） |
| Decoderの状態 | 前ステップ $s_{i-1}$ を使用 | 現ステップ $s_i$ を使用 |
| Encoderの利用 | 双方向RNNの全状態 | 上位層のみ |
| 計算コスト | やや高い | 乗法型は効率的 |

特に重要なのは、Luongが**乗法型（dot-product）**のスコア関数を採用した点です。これは後のTransformerのScaled Dot-Product Attentionに直接つながるアイデアです。

---

## 6. 革新の前夜 — なぜ「Attentionだけ」という発想に至ったか

### 6.1 Attentionの威力の認識

Attention機構の導入後、研究者たちはある重要な事実に気づき始めました。多くのタスクで、**Attentionが担う役割がRNN本体よりも重要になっている**のです。

RNNは依然として逐次処理のボトルネックを抱えていました。Attentionは入力全体を直接参照できるため、長距離の依存関係を効率的に捕捉できます。ならば、「RNNを完全に排除して、Attentionだけで系列変換を実現できないか？」という自然な問いが生まれました。

### 6.2 並列処理への渇望

2015〜2017年は、GPU/TPUの計算能力が急速に向上した時期でもありました。しかし、RNNの逐次性はこの計算資源を十分に活用することを妨げていました。

<iframe src="/mdTechKnowledge/guides/transformer-p1-parallel-vs-sequential.html" width="100%" height="400" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

上図が示すように、RNNでは系列長 $n$ のデータを処理するのに $O(n)$ の逐次ステップが必要ですが、もし全トークンを並列に処理できれば $O(1)$ で済みます。この差は、長い文書や大規模データセットを扱う場合に決定的です。

### 6.3 「Attention Is All You Need」へ

Vaswaniらは、以下の洞察をもとにTransformerを設計しました：

1. **Self-Attention**: 入力系列内のトークン間の関係を、RNNを介さず直接計算できる
2. **Multi-Head Attention**: 複数の「注目の仕方」を並列に学習できる
3. **Positional Encoding**: RNNが暗黙的に持っていた位置情報を、明示的にエンコードすれば語順を扱える
4. **完全な並列化**: 上記の組み合わせにより、系列の全位置を同時に処理できる

こうして2017年、「**Attention is All You Need**（注意機構さえあればいい）」という大胆なタイトルの論文が発表されました。RNNもCNNも一切使わず、Self-Attentionだけで系列変換タスクを実現する**Transformer**の誕生です。

---

## まとめ

第1回では、Transformerが登場する以前の背景を整理しました。

- **RNN** は系列データを扱える強力なモデルだったが、逐次処理・勾配消失・固定長ボトルネックという3つの根本的問題を抱えていた
- **LSTM** はゲート機構で勾配消失を軽減したが、逐次処理の制約は解消できなかった
- **Attention機構**（Bahdanau, Luong）は固定長ボトルネックを解消し、入力全体への直接的なアクセスを可能にした
- これらの研究の延長線上で、「RNNを排除してAttentionのみで系列変換を実現する」というTransformerの着想が生まれた

次回の第2回では、Transformerアーキテクチャの全体像を詳しく解説します。Encoder-Decoderの構造、残差接続、Layer Normalizationなど、モデルの各コンポーネントを図解とともに読み解いていきます。

---

## 参考文献

- Vaswani, A., et al. (2017). "Attention Is All You Need." *Advances in Neural Information Processing Systems (NeurIPS).*
- Hochreiter, S., & Schmidhuber, J. (1997). "Long Short-Term Memory." *Neural Computation, 9(8), 1735-1780.*
- Sutskever, I., Vinyals, O., & Le, Q. V. (2014). "Sequence to Sequence Learning with Neural Networks." *NeurIPS.*
- Bahdanau, D., Cho, K., & Bengio, Y. (2015). "Neural Machine Translation by Jointly Learning to Align and Translate." *ICLR.*
- Luong, M. T., Pham, H., & Manning, C. D. (2015). "Effective Approaches to Attention-based Neural Machine Translation." *EMNLP.*
- Cho, K., et al. (2014). "Learning Phrase Representations using RNN Encoder-Decoder for Statistical Machine Translation." *EMNLP.*
