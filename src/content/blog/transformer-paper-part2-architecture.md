---
title: "Attention Is All You Need 徹底解説【第2回】Transformerアーキテクチャの全体像 — 構造を読み解く"
date: 2026-04-14
category: "AI論文解説"
tags: ["Transformer", "Attention", "論文解説", "Encoder-Decoder", "深層学習"]
excerpt: "「Attention Is All You Need」論文解説シリーズ第2回。Transformerモデルの全体構造を図解とともに詳しく解説します。Encoder/Decoderの各層、残差接続、Layer Normalization、FFNなど、すべてのコンポーネントを読み解きます。"
---

## はじめに

[第1回](/mdTechKnowledge/blog/transformer-paper-part1-background/)では、RNN/LSTMが抱えていた限界と、Attention機構の発展を振り返りました。第2回では、いよいよ論文の核心である**Transformerアーキテクチャの全体像**を解説します。

Transformerは「RNNを完全に排除し、Attentionだけで系列変換を実現する」という大胆なアーキテクチャです。論文のSection 3で詳述されているこの構造を、各コンポーネントに分解しながら丁寧に見ていきましょう。

---

## 1. Transformerの全体構造

Transformerは、seq2seqの伝統に従い**Encoder-Decoder構造**を採用しています。ただし、RNNの代わりにSelf-Attentionを中心に据えている点が決定的に異なります。

<iframe src="/mdTechKnowledge/guides/transformer-p2-full-architecture.html" width="100%" height="650" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

全体の流れを簡潔にまとめると：

1. **入力文**のトークン列がEmbedding層とPositional Encodingを通過
2. **Encoder**（6層）が入力の文脈を考慮した表現を生成
3. **Decoder**（6層）が、Encoderの出力を参照しながら出力トークンを1つずつ生成
4. 最終層のLinear + Softmaxで次のトークンの確率分布を出力

論文で使われた主要なハイパーパラメータは以下の通りです：

| パラメータ | 値 | 説明 |
|:---|:---:|:---|
| $d_{\text{model}}$ | 512 | モデル全体の埋め込み次元数 |
| $d_{ff}$ | 2048 | Feed-Forwardネットワークの中間次元数 |
| $h$ | 8 | Multi-Head Attentionのヘッド数 |
| $d_k = d_v$ | 64 | 各ヘッドのKey/Valueの次元数 |
| $N$ | 6 | Encoder/Decoderの層数 |
| $P_{drop}$ | 0.1 | ドロップアウト率 |

---

## 2. Encoder — 入力の文脈表現を生成する

### 2.1 Encoderスタックの構成

Encoderは同一構造の層を**6つ積み重ねた**スタックです。各層には2つのサブレイヤーがあります。

<iframe src="/mdTechKnowledge/guides/transformer-p2-encoder-stack.html" width="100%" height="580" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

1. **Multi-Head Self-Attention層**: 入力系列内のトークン間の関係を計算する
2. **Position-wise Feed-Forward Network（FFN）**: 各位置に対して独立に非線形変換を適用する

各サブレイヤーの周囲には**残差接続（Residual Connection）**と**Layer Normalization**が配置されています。

### 2.2 Encoder 1層の内部フロー

1つのEncoder層の内部を詳しく見てみましょう。

<iframe src="/mdTechKnowledge/guides/transformer-p2-encoder-single-layer.html" width="100%" height="420" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

データの流れは以下の通りです：

```
入力 x
  ↓
Multi-Head Self-Attention(x, x, x)  ← Q, K, V すべて同じ入力から
  ↓
Add & Norm: LayerNorm(x + Attention出力)  ← 残差接続
  ↓
Feed-Forward Network
  ↓
Add & Norm: LayerNorm(前段出力 + FFN出力)  ← 残差接続
  ↓
出力（次の層への入力）
```

重要なのは、Self-Attentionの**Q（Query）、K（Key）、V（Value）がすべて同じ入力から生成される**ことです。これは「自分自身に対してAttentionを計算する」ことを意味し、だから「Self」-Attentionと呼ばれます。

各サブレイヤーの出力は以下の式で表されます：

$$\text{output} = \text{LayerNorm}(x + \text{Sublayer}(x))$$

ここで $x$ はサブレイヤーへの入力、$\text{Sublayer}(x)$ はSelf-AttentionまたはFFNの出力です。

### 2.3 なぜ6層なのか

論文では6層が選択されていますが、これは実験的に決定された値です。層が増えるほどモデルの表現力は向上しますが、計算コストも増大します。6層は性能と効率のバランスが良い値として選ばれました。後の研究（BERT-Large: 24層、GPT-3: 96層）では、タスクやモデルサイズに応じてより深いスタックが使われています。

---

## 3. Decoder — 出力を自己回帰的に生成する

### 3.1 Decoderスタックの構成

DecoderもEncoderと同様に6層のスタックですが、各層には**3つのサブレイヤー**があります。

<iframe src="/mdTechKnowledge/guides/transformer-p2-decoder-stack.html" width="100%" height="620" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

1. **Masked Multi-Head Self-Attention層**: 出力系列内のトークン間の関係を計算する（ただし未来の位置を参照不可）
2. **Multi-Head Cross-Attention層**: Encoderの出力を参照する
3. **Position-wise Feed-Forward Network（FFN）**: Encoderと同じ構造

### 3.2 Decoder 1層の内部フロー

<iframe src="/mdTechKnowledge/guides/transformer-p2-decoder-single-layer.html" width="100%" height="480" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

Decoder層のデータフロー：

```
入力 y（前のDecoderの出力）
  ↓
Masked Multi-Head Self-Attention(y, y, y)  ← 未来のトークンをマスク
  ↓
Add & Norm
  ↓
Multi-Head Cross-Attention(Q=前段出力, K=Encoder出力, V=Encoder出力)
  ↓
Add & Norm
  ↓
Feed-Forward Network
  ↓
Add & Norm
  ↓
出力（次の層への入力）
```

### 3.3 Masked Self-Attention — 未来を見ない仕組み

Decoderの最初のサブレイヤーでは、**Masked Self-Attention**が使われます。これは、位置 $i$ のトークンが位置 $i+1$ 以降のトークンを参照できないようにする仕組みです。

なぜこれが必要なのでしょうか？ Transformerは学習時に出力系列全体を一度に処理します（Teacher Forcing）。しかし推論時には、トークンは左から右へ1つずつ生成されます。学習時に「未来のトークンを見てしまう」と、カンニングになり正しい学習ができません。

マスクは実装上、Attention計算のスコアに $-\infty$ を加算することで実現されます。softmaxを通すと $e^{-\infty} \approx 0$ となり、未来の位置からの情報が完全に遮断されます。

### 3.4 Cross-Attention — Encoderの情報を取り込む

2つ目のサブレイヤーであるCross-Attentionは、Decoderの各位置がEncoderの出力全体を参照できるようにする仕組みです。

<iframe src="/mdTechKnowledge/guides/transformer-p2-cross-attention-flow.html" width="100%" height="450" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

Self-Attentionとの決定的な違いは：

- **Self-Attention**: Q, K, V がすべて同じソースから生成
- **Cross-Attention**: **Q**はDecoderの前のサブレイヤーの出力から、**K**と**V**はEncoderの最終出力から生成

つまり、Decoderは「自分が今生成しようとしている内容（Q）に最も関連する入力文の部分（K, V）を動的に選択する」のです。これは第1回で解説したBahdanau Attentionの発展形と言えます。

---

## 4. 残差接続（Residual Connection）

### 4.1 なぜ残差接続が必要か

深いニューラルネットワークでは、層が深くなるほど勾配が消失しやすくなります。残差接続（He et al., 2016）は、入力をサブレイヤーの出力に直接加算することで、この問題を軽減します。

<iframe src="/mdTechKnowledge/guides/transformer-p2-residual-connection.html" width="100%" height="420" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

残差接続の数式：

$$\text{output} = \text{LayerNorm}(x + \text{Sublayer}(x))$$

残差接続がある場合、逆伝播時の勾配は少なくとも $\frac{\partial x}{\partial x} = 1$ の項を含みます。これにより、層が深くても勾配が「ハイウェイ」を通じて効率的に伝播できます。Transformerでは、すべてのサブレイヤー（Encoder: 2つ × 6層 = 12箇所、Decoder: 3つ × 6層 = 18箇所）に残差接続が適用されています。

### 4.2 Layer Normalization

残差接続と対になるのがLayer Normalizationです。Batch Normalizationがバッチ方向に正規化するのに対し、Layer Normalizationは**各サンプルの特徴方向**に正規化します。

$$\text{LN}(x) = \gamma \cdot \frac{x - \mu}{\sigma + \epsilon} + \beta$$

ここで $\mu$ と $\sigma$ は特徴次元方向の平均と標準偏差、$\gamma$ と $\beta$ は学習可能なスケール・シフトパラメータです。

Layer Normalizationは系列データとの相性が良く、バッチサイズに依存しないため安定した学習が可能です。

---

## 5. Position-wise Feed-Forward Network

### 5.1 FFNの構造

各Encoder/Decoder層に含まれるFeed-Forward Network（FFN）は、2層の全結合ネットワークです。

<iframe src="/mdTechKnowledge/guides/transformer-p2-ffn-structure.html" width="100%" height="380" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

$$\text{FFN}(x) = \max(0, xW_1 + b_1)W_2 + b_2$$

- 入力次元: $d_{\text{model}} = 512$
- 中間次元: $d_{ff} = 2048$（4倍に拡大）
- 出力次元: $d_{\text{model}} = 512$（元に戻す）
- 活性化関数: ReLU（$\max(0, x)$）

### 5.2 「Position-wise」の意味

「Position-wise」とは、系列の各位置に対して**同じFFNが独立に**適用されることを意味します。位置1のトークンに適用されるFFNと位置2のトークンに適用されるFFNは同じ重みを共有しますが、計算は独立に行われます。

これは別の見方をすると、カーネルサイズ1の1次元畳み込みを2回適用しているのと等価です。

### 5.3 なぜ4倍に拡大するのか

FFNの中間層を $d_{\text{model}}$ の4倍（2048次元）にする理由は、**非線形変換の表現力を確保する**ためです。Self-Attentionは本質的に線形変換（重み付き和）なので、FFNが非線形な特徴変換を担います。中間層の次元を大きくすることで、より複雑な変換を学習できるようになります。

---

## 6. Embedding層と重み共有

### 6.1 入出力のEmbedding

Transformerでは、入力トークンと出力トークンをそれぞれ $d_{\text{model}} = 512$ 次元のベクトルに変換するEmbedding層を使用します。

### 6.2 3つのEmbedding間の重み共有

論文の重要な設計判断として、以下の3つのコンポーネントが**同じ重み行列を共有**しています：

<iframe src="/mdTechKnowledge/guides/transformer-p2-weight-sharing.html" width="100%" height="380" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

1. **Input Embedding**: 入力トークン → ベクトル変換
2. **Output Embedding**: 出力トークン → ベクトル変換
3. **Pre-Softmax Linear層**: 最終層でベクトル → 語彙サイズの確率分布へ変換

重み共有には以下の利点があります：
- **パラメータ数の大幅削減**: 語彙サイズが37,000、$d_{\text{model}} = 512$ の場合、共有しなければ $37000 \times 512 \times 3 \approx$ 57Mパラメータですが、共有すれば約19Mで済みます
- **学習の安定化**: 入力と出力の表現空間が統一されるため、モデルの学習が安定します

### 6.3 Embeddingのスケーリング

論文では、Embedding層の出力に $\sqrt{d_{\text{model}}}$ を掛けています。

$$\text{Embedding}(x) = \text{lookup}(x) \times \sqrt{d_{\text{model}}}$$

これは、Positional Encodingとの加算時にEmbeddingの値がPositional Encodingに埋もれないようにするためです。Embeddingの初期値は小さな値（平均0、分散が小さい）に初期化される一方、Positional Encodingのsin/cosは-1〜1の範囲を取るため、スケーリングなしではEmbeddingの情報が相対的に小さくなってしまいます。

---

## 7. 推論時の自己回帰生成

### 7.1 学習時と推論時の違い

**学習時**: 正解の出力系列全体を一度にDecoderに入力し（Teacher Forcing）、すべての位置の予測を並列に計算します。マスクにより未来の情報は遮断されます。

**推論時**: 出力トークンを1つずつ順番に生成する**自己回帰（autoregressive）**方式を取ります。

<iframe src="/mdTechKnowledge/guides/transformer-p2-inference-autoregressive.html" width="100%" height="450" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

### 7.2 自己回帰生成のステップ

1. 開始トークン `<SOS>` をDecoderに入力
2. Decoderが次のトークンの確率分布を出力
3. 最も確率の高いトークン（またはビームサーチで複数候補を選択）を選ぶ
4. 選んだトークンを入力に追加し、ステップ2に戻る
5. 終了トークン `<EOS>` が生成されるか、最大長に達したら終了

この逐次生成は推論時の計算コストを増大させます。出力系列の長さが $m$ の場合、$m$ 回のDecoder実行が必要です。ただし、Encoderは1回だけ実行すれば良い点は効率的です。

---

## 8. パラメータ数の概算

Transformerの各コンポーネントのパラメータ数を概算してみましょう（base modelの場合）。

| コンポーネント | 計算 | パラメータ数 |
|:---|:---|---:|
| Embedding（共有） | $37000 \times 512$ | 18.9M |
| Self-Attention（Encoder 6層） | $6 \times (4 \times 512 \times 512)$ | 6.3M |
| FFN（Encoder 6層） | $6 \times (512 \times 2048 + 2048 \times 512)$ | 12.6M |
| Self-Attention（Decoder 6層） | $6 \times (4 \times 512 \times 512)$ | 6.3M |
| Cross-Attention（Decoder 6層） | $6 \times (4 \times 512 \times 512)$ | 6.3M |
| FFN（Decoder 6層） | $6 \times (512 \times 2048 + 2048 \times 512)$ | 12.6M |
| Layer Norm等 | — | ~0.1M |
| **合計** | | **~63M** |

base modelで約6,300万パラメータ、big modelでは約2億1,300万パラメータです。2017年当時としては大きなモデルでしたが、現在のGPT-4（推定1兆パラメータ超）やClaude（非公開）と比較すると、極めてコンパクトです。

---

## まとめ

第2回では、Transformerの全体構造を詳しく見てきました。

- **Encoder**（6層）: Self-Attention + FFN で入力の文脈表現を生成
- **Decoder**（6層）: Masked Self-Attention + Cross-Attention + FFN で出力を自己回帰的に生成
- **残差接続 + Layer Normalization**: 深いネットワークの安定的な学習を実現
- **FFN**: 各位置に独立に適用される2層のネットワークで非線形変換を担う
- **重み共有**: Input/Output Embedding + Pre-Softmax Linearの重み共有でパラメータ効率を向上
- **自己回帰生成**: 推論時はトークンを1つずつ順に生成

ここまでで「何が」含まれているかは理解できましたが、「どのように」Attentionが計算されるかの詳細はまだ解説していません。次回の第3回では、Transformerの核心技術であるScaled Dot-Product AttentionとMulti-Head Attentionの仕組みを、行列計算のレベルまで掘り下げて解説します。

---

## 参考文献

- Vaswani, A., et al. (2017). "Attention Is All You Need." *NeurIPS.*
- He, K., et al. (2016). "Deep Residual Learning for Image Recognition." *CVPR.*
- Ba, J. L., Kiros, J. R., & Hinton, G. E. (2016). "Layer Normalization." *arXiv:1607.06450.*
- Press, O., & Wolf, L. (2017). "Using the Output Embedding to Improve Language Models." *EACL.*
