---
title: "Attention Is All You Need 徹底解説【第4回】Positional Encoding、学習テクニック、正規化 — 訓練を支える仕掛け"
date: 2026-04-14
category: "AI論文解説"
tags: ["Transformer", "Attention", "論文解説", "Positional Encoding", "学習率スケジューリング", "深層学習"]
excerpt: "「Attention Is All You Need」論文解説シリーズ第4回。Positional Encodingの数学的設計、学習率warmup、ドロップアウト、Label Smoothingなど、Transformerの訓練を成功に導く技術要素を詳細に解説します。"
---

## はじめに

[第3回](/mdTechKnowledge/blog/transformer-paper-part3-attention/)では、Self-AttentionとMulti-Head Attentionの仕組みを詳細に解剖しました。第4回では、Transformerの「隠れた立役者」ともいえる技術要素群を取り上げます。

Positional Encoding、学習率スケジューリング、ドロップアウト、Label Smoothing——これらは一見地味ですが、なければTransformerは正しく機能しません。論文のSection 3.5（Positional Encoding）とSection 5（Training）を中心に解説します。

---

## 1. Positional Encoding — 語順情報の埋め込み

### 1.1 なぜ位置情報が必要か

Self-Attentionは本質的に**集合演算**です。入力トークンの順序を入れ替えても、（Q, K, Vの値が同じであれば）Attentionの出力は同じになります。これは「置換等変性（permutation equivariance）」と呼ばれる性質です。

<iframe src="/mdTechKnowledge/guides/transformer-p4-why-position-matters.html" width="100%" height="400" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

「猫が犬を追う」と「犬が猫を追う」は全く異なる意味ですが、位置情報なしのSelf-Attentionでは区別できません。RNNは逐次処理の構造自体に語順情報が暗黙的に含まれていましたが、Transformerではこれを**明示的にエンコード**する必要があります。

### 1.2 正弦波Positional Encodingの設計

論文では、sin/cos関数を使った**正弦波Positional Encoding**が採用されました。

$$PE_{(pos, 2i)} = \sin\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)$$

$$PE_{(pos, 2i+1)} = \cos\left(\frac{pos}{10000^{2i/d_{\text{model}}}}\right)$$

ここで $pos$ はトークンの位置（0, 1, 2, ...）、$i$ は次元のインデックス（0, 1, 2, ..., $d_{\text{model}}/2 - 1$）です。

このPEベクトルは**入力Embeddingに加算**されます：

$$\text{input} = \text{Embedding}(x) \times \sqrt{d_{\text{model}}} + PE_{pos}$$

### 1.3 PE行列の視覚化

<iframe src="/mdTechKnowledge/guides/transformer-p4-sinusoidal-pe-heatmap.html" width="100%" height="450" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

ヒートマップで観察すると、重要な特徴が見えてきます：

- **低次元（左側）**: 高周波の正弦波 — 隣接する位置間で値が大きく変化
- **高次元（右側）**: 低周波の正弦波 — 多くの位置にわたってゆっくり変化

### 1.4 異なる次元の周波数

<iframe src="/mdTechKnowledge/guides/transformer-p4-pe-frequency-bands.html" width="100%" height="380" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

各次元ペア $(2i, 2i+1)$ は、波長 $2\pi \cdot 10000^{2i/d_{\text{model}}}$ の正弦波/余弦波に対応します。

- 次元0-1: 波長 $2\pi \approx 6.28$（最も短い周期）
- 次元254-255: 波長 $2\pi \cdot 10000^{254/512} \approx 62,832$（最も長い周期）

この「マルチスケール」な設計により、モデルは近い位置の区別（高周波成分）から遠い位置の大まかな関係（低周波成分）まで、さまざまなスケールの位置情報を利用できます。これはフーリエ変換の考え方と通じるものがあります。

### 1.5 相対位置の表現

この設計の巧妙な点は、**相対位置が線形変換で表現できる**ことです。

<iframe src="/mdTechKnowledge/guides/transformer-p4-pe-relative-position.html" width="100%" height="380" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

任意の固定オフセット $k$ に対して、$PE_{pos+k}$ を $PE_{pos}$ の線形変換で表現できます。具体的には、2次元ペア $(sin, cos)$ に注目すると：

$$\begin{pmatrix} \sin(\omega(pos+k)) \\ \cos(\omega(pos+k)) \end{pmatrix} = \begin{pmatrix} \cos(\omega k) & \sin(\omega k) \\ -\sin(\omega k) & \cos(\omega k) \end{pmatrix} \begin{pmatrix} \sin(\omega \cdot pos) \\ \cos(\omega \cdot pos) \end{pmatrix}$$

これは**回転行列**です。つまり、位置 $k$ だけ離れたトークンへの変換は、PE空間上での一定の回転に対応します。この性質により、モデルは**絶対位置だけでなく相対位置の情報**も活用できるのです。

### 1.6 学習可能なPEとの比較

論文では学習可能なPositional Encoding（各位置に学習可能なベクトルを割り当てる方式）も実験していますが、正弦波PEとほぼ同等の性能でした。正弦波PEが選ばれた理由は：

- **学習時に見ない長さの系列にも対応可能**: sin/cosは任意の位置に対して計算できるため、学習データより長い系列にも外挿できる
- **パラメータ不要**: 追加のパラメータなしで位置情報を提供

---

## 2. 学習率スケジューリング

### 2.1 Warmup + Inverse Square Root Decay

Transformerの学習では、独特の学習率スケジュールが使われています。

<iframe src="/mdTechKnowledge/guides/transformer-p4-learning-rate-schedule.html" width="100%" height="400" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

$$lrate = d_{\text{model}}^{-0.5} \cdot \min(step^{-0.5}, \; step \cdot warmup\_steps^{-1.5})$$

この式は2つのフェーズから構成されています：

**Warmupフェーズ**（step < warmup_steps）:
学習率は $step \cdot warmup\_steps^{-1.5}$ に従って**線形に増加**します。デフォルトの $warmup\_steps = 4000$ では、最初の4000ステップで学習率がゼロからピークまで上昇します。

**Decayフェーズ**（step ≥ warmup_steps）:
学習率は $step^{-0.5}$ に従って**逆平方根で減衰**します。

### 2.2 なぜWarmupが必要か

Warmupなしでいきなり大きな学習率を使うと、以下の問題が発生します：

1. **Attention重みの不安定性**: 学習初期のAttention重みはほぼランダムです。大きな学習率で更新すると、重みが極端な値に振れてしまい、回復困難な状態に陥る
2. **Layer Normalizationの統計量の不安定性**: 初期の統計量（平均・分散）が安定していないため、大きな更新は有害
3. **Adamの分散推定の暖機**: Adamオプティマイザの2次モーメント推定は初期に偏りがあり、Warmupで安定させる

$warmup\_steps = 4000$ は、これらが安定するのに十分な時間を確保する値として選ばれました。

### 2.3 Adamオプティマイザの設定

$$\beta_1 = 0.9, \quad \beta_2 = 0.98, \quad \epsilon = 10^{-9}$$

標準的なAdam（$\beta_2 = 0.999$）よりも $\beta_2$ が小さい値が使われています。これは、勾配の2次モーメント推定をより速く更新するためです。Transformerの学習では勾配の分散が変動しやすいため、過去の情報に引きずられすぎないようにする意図があります。

---

## 3. ドロップアウト（Dropout）

### 3.1 適用箇所

Transformerでは、3つの異なる箇所にドロップアウト（$P_{drop} = 0.1$）が適用されています。

<iframe src="/mdTechKnowledge/guides/transformer-p4-dropout-positions.html" width="100%" height="450" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

1. **各サブレイヤーの出力**: Self-Attention、Cross-Attention、FFNの出力に、残差接続で加算される前にドロップアウトを適用
2. **Attention重み**: softmaxで計算されたAttention重みの一部をランダムにゼロにする
3. **Embedding + Positional Encoding**: 入力Embeddingと位置エンコーディングの合計にドロップアウトを適用

### 3.2 なぜ3箇所に適用するか

それぞれ異なる正則化効果があります：

- **サブレイヤー出力のドロップアウト**: 特定のサブレイヤーの出力に過度に依存することを防ぐ。残差接続と組み合わせることで、一部の経路が遮断されても情報がショートカット経由で流れる
- **Attention重みのドロップアウト**: 特定のトークンへの過度な集中を防ぎ、より分散したAttentionパターンを学習させる
- **入力のドロップアウト**: Embeddingの特定の次元への依存を防ぎ、ロバストな表現を学習させる

---

## 4. Label Smoothing

### 4.1 One-hotとLabel Smoothingの比較

<iframe src="/mdTechKnowledge/guides/transformer-p4-label-smoothing.html" width="100%" height="420" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

標準的なクロスエントロピー損失では、正解ラベルをone-hotベクトル（正解=1.0、他=0.0）として扱います。Label Smoothingでは、この分布を「滑らかに」します。

$$q'(k) = \begin{cases} 1 - \epsilon_{ls} + \epsilon_{ls}/K & \text{if } k = \text{正解} \\ \epsilon_{ls}/K & \text{otherwise} \end{cases}$$

論文では $\epsilon_{ls} = 0.1$、語彙サイズ $K$ が使われています。つまり、正解ラベルの確率を1.0から約0.9に下げ、残りの0.1を他のすべてのラベルに均等に配分します。

### 4.2 なぜLabel Smoothingが有効か

**Perplexityは悪化するが、BLEUは向上する**——これは直感に反する結果ですが、合理的な説明があります。

- **過信の防止**: One-hotラベルで学習すると、モデルは正解に対して過度に高い確率（> 0.99）を出力しようとします。これは実質的に無限大のlogitを必要とし、モデルの一般化能力を損ないます
- **類似トークンへの寛容性**: 翻訳タスクでは、正解以外にも許容される表現が存在します。Label Smoothingは「正解以外もゼロではない」という情報を与え、より柔軟な出力を促します
- **BLEUとの整合性**: BLEUスコアは生成文全体の品質を評価するため、各位置でやや分散した確率分布を出力するモデルの方が、全体として自然な文を生成できます

---

## 5. Layer Normalization

### 5.1 Batch Norm vs Layer Norm

<iframe src="/mdTechKnowledge/guides/transformer-p4-layer-norm-vs-batch-norm.html" width="100%" height="400" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

Batch Normalization（BatchNorm）は画像処理で大きな成功を収めましたが、系列データには適していません。

| 特徴 | Batch Norm | Layer Norm |
|:---|:---|:---|
| 正規化方向 | バッチ方向（同じ特徴の全サンプル） | 特徴方向（1サンプルの全特徴） |
| バッチサイズ依存 | あり（小バッチで不安定） | なし |
| 系列長の可変性 | 対応困難 | 自然に対応 |
| 推論時の挙動 | 学習時の統計量を保存 | その場で計算 |

$$\text{LayerNorm}(x) = \gamma \cdot \frac{x - \mu}{\sigma + \epsilon} + \beta$$

$$\mu = \frac{1}{d} \sum_{i=1}^{d} x_i, \quad \sigma = \sqrt{\frac{1}{d} \sum_{i=1}^{d} (x_i - \mu)^2}$$

TransformerがLayer Normを採用した理由：
- 系列データではバッチ内のサンプルの長さが異なるため、BatchNormの統計量が不安定になる
- Layer Normは各サンプルを独立に正規化するため、バッチサイズや系列長に依存しない

---

## 6. 学習の全体像

### 6.1 データとトークン化

<iframe src="/mdTechKnowledge/guides/transformer-p4-training-pipeline.html" width="100%" height="380" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

- **データセット**: WMT 2014 英独（450万文ペア）、WMT 2014 英仏（3600万文ペア）
- **トークン化**: Byte Pair Encoding（BPE）
  - 英独: 共有語彙37,000トークン
  - 英仏: 個別のword-piece、32,000トークン
- **バッチ構成**: 文ペアを近い系列長でグループ化し、各バッチが約25,000ソーストークン + 25,000ターゲットトークンを含むように構成

### 6.2 ハードウェアと学習時間

| モデル | GPU | 学習ステップ | 学習時間 |
|:---|:---|:---:|:---:|
| Base model | 8 × P100 | 100,000 | 12時間 |
| Big model | 8 × P100 | 300,000 | 3.5日 |

当時の最先端モデル（ConvS2Sなど）と比較して、**1/4以下の学習コスト**で同等以上の性能を達成したことは、Transformerの実用性を示す重要なポイントでした。

### 6.3 ハイパーパラメータの一覧

<iframe src="/mdTechKnowledge/guides/transformer-p4-hyperparameter-table.html" width="100%" height="440" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

---

## まとめ

第4回では、Transformerの訓練を支える技術要素を詳しく見てきました。

- **Positional Encoding**: sin/cos関数による位置情報の埋め込み。マルチスケールな表現と相対位置の線形変換可能性
- **学習率スケジューリング**: Warmup + inverse sqrt decayにより、学習の安定性を確保
- **ドロップアウト**: 3箇所への適用で過学習を防止
- **Label Smoothing**: 過信を防ぎ、BLEUスコアを向上
- **Layer Normalization**: 系列データに適した正規化手法

これらの「裏方」の技術がなければ、Self-Attentionの威力は十分に発揮されません。アーキテクチャの革新と訓練テクニックの両輪が揃ってこそ、Transformerは成功を収めたのです。

次回の最終回・第5回では、論文の実験結果（BLEUスコアの新記録）と、Transformerが後世に与えた計り知れない影響を解説します。

---

## 参考文献

- Vaswani, A., et al. (2017). "Attention Is All You Need." *NeurIPS.*
- Sennrich, R., Haddow, B., & Birch, A. (2016). "Neural Machine Translation of Rare Words with Subword Units." *ACL.*
- Szegedy, C., et al. (2016). "Rethinking the Inception Architecture for Computer Vision." *CVPR.* (Label Smoothing)
- Ba, J. L., Kiros, J. R., & Hinton, G. E. (2016). "Layer Normalization." *arXiv:1607.06450.*
- Kingma, D. P., & Ba, J. (2015). "Adam: A Method for Stochastic Optimization." *ICLR.*
