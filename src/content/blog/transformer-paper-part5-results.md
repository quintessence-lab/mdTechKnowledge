---
title: "Attention Is All You Need 徹底解説【第5回】実験結果・BLEU新記録・そして世界を変えた波及効果"
date: 2026-04-14
category: "AI論文解説"
tags: ["Transformer", "Attention", "論文解説", "BERT", "GPT", "Vision Transformer", "深層学習"]
excerpt: "「Attention Is All You Need」論文解説シリーズ最終回。WMT翻訳タスクでの圧倒的な実験結果、モデルバリエーション実験の知見、そしてBERT・GPT・Vision Transformerなど後世に与えた計り知れない影響を解説します。"
---

## はじめに

[第4回](/mdTechKnowledge/blog/transformer-paper-part4-training/)までで、Transformerのアーキテクチャと訓練技術のすべてを解説しました。最終回の第5回では、論文のSection 6（Results）を中心に、**実験結果**とその分析、そして2017年以降の**Transformerの波及効果**を詳しく見ていきます。

---

## 1. 機械翻訳の実験結果

### 1.1 WMT 2014 英独翻訳

<iframe src="/mdTechKnowledge/guides/transformer-p5-bleu-comparison-en-de.html" width="100%" height="420" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

WMT 2014英独翻訳タスクでの結果：

| モデル | BLEU | 学習コスト (FLOPs) |
|:---|:---:|:---:|
| ByteNet | 23.75 | — |
| GNMT+RL | 24.6 | $1.4 \times 10^{20}$ |
| ConvS2S | 25.16 | $1.5 \times 10^{20}$ |
| MoE | 26.03 | $1.2 \times 10^{20}$ |
| **Transformer (base)** | **27.3** | $3.3 \times 10^{18}$ |
| **Transformer (big)** | **28.4** | $2.3 \times 10^{19}$ |

Transformer (big) は**BLEU 28.4**を達成し、当時の全てのモデル（アンサンブルを含む）を上回る新記録を樹立しました。特筆すべきは、base modelでさえ27.3と、既存の最良モデル（MoE: 26.03）を大幅に上回っている点です。

### 1.2 WMT 2014 英仏翻訳

<iframe src="/mdTechKnowledge/guides/transformer-p5-bleu-comparison-en-fr.html" width="100%" height="420" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

| モデル | BLEU | 学習コスト (FLOPs) |
|:---|:---:|:---:|
| Deep-Att + PosUnk | 39.2 | — |
| GNMT+RL | 39.92 | $2.3 \times 10^{19}$ |
| ConvS2S | 40.46 | $1.5 \times 10^{20}$ |
| MoE | 40.56 | $1.2 \times 10^{20}$ |
| **Transformer (big)** | **41.0** | $2.3 \times 10^{19}$ |

英仏翻訳でもBLEU 41.0で**単一モデルとしてのSOTA**を達成しました。

### 1.3 学習コストの革命的な削減

<iframe src="/mdTechKnowledge/guides/transformer-p5-training-cost-comparison.html" width="100%" height="400" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

結果以上に衝撃的だったのは、**学習コストの大幅な削減**です。

- **GNMT+RL**: 96台のK80 GPUで6日間 → FLOPs $1.4 \times 10^{20}$
- **Transformer (big)**: 8台のP100 GPUで3.5日間 → FLOPs $2.3 \times 10^{19}$

Transformerの学習コストはGNMT+RLの**約1/6**です。性能は上、コストは大幅に下——この組み合わせがTransformerの急速な普及を決定づけました。

base modelに至っては**8台のP100で12時間**（FLOPs $3.3 \times 10^{18}$）と、GNMTの**1/40以下**のコストで、GNMTを大きく上回る性能を発揮しています。

---

## 2. モデルバリエーション実験

論文のTable 3は、Transformerの各コンポーネントが性能にどう影響するかを系統的に調べた実験です。

<iframe src="/mdTechKnowledge/guides/transformer-p5-model-variations-table.html" width="100%" height="480" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

### 2.1 ヘッド数の影響

<iframe src="/mdTechKnowledge/guides/transformer-p5-head-count-ablation.html" width="100%" height="380" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

| ヘッド数 $h$ | $d_k$ | BLEU (dev) |
|:---:|:---:|:---:|
| 1 | 512 | 24.9 |
| 4 | 128 | 25.5 |
| **8** | **64** | **25.8** |
| 16 | 32 | 25.8 |
| 32 | 16 | 25.0 |

**発見1**: 単一ヘッド（$h=1$）は明確に性能が劣る。Multi-Headの有効性が実証されている。

**発見2**: $h=8$ と $h=16$ はほぼ同等。ヘッド数を増やしすぎる（$h=32$）と、各ヘッドの次元 $d_k = 16$ が小さくなりすぎて性能が低下する。

### 2.2 Attention Key次元の影響

<iframe src="/mdTechKnowledge/guides/transformer-p5-attention-key-size-ablation.html" width="100%" height="380" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

$d_k$ を小さくすると性能が低下します。これは、Dot-Productスコアを計算する空間の次元が小さくなり、**異なるトークン間の類似度を十分に識別できなくなる**ためです。

### 2.3 その他の知見

- **モデルサイズ**: $d_{\text{model}}$ と $d_{ff}$ を大きくすると一般に性能が向上する
- **ドロップアウト**: $P_{drop} = 0$ では過学習が発生し性能が低下。$P_{drop} = 0.1$ が最適
- **学習可能なPE**: 正弦波PEとほぼ同等の性能（BLEU 25.7 vs 25.8）

---

## 3. 英語構文解析への汎用性

論文では、機械翻訳以外のタスクへの汎用性も検証しています。英語の構文解析（Constituency Parsing）タスクでは、タスク固有の調整なしに、RNNベースの既存モデルに匹敵する性能を達成しました。

これは、Transformerが**翻訳に特化したモデルではなく、汎用的な系列変換モデル**であることを示す重要な結果でした。

---

## 4. なぜ「Attention Is All You Need」が転換点だったのか

この論文が単なる「新しいモデル提案」を超えて、AI史の転換点となった理由を整理します。

### 4.1 パラダイムシフト

| 観点 | Before (RNN時代) | After (Transformer時代) |
|:---|:---|:---|
| 基本演算 | 逐次的な隠れ状態更新 | 並列的なAttention計算 |
| 長距離依存 | ゲート機構による間接的な記憶 | 直接的な全位置間接続 |
| 学習速度 | GPU活用が限定的 | GPU/TPUの並列性をフル活用 |
| スケーリング | 難しい（逐次性がボトルネック） | データ・モデルサイズに応じてスケール |

### 4.2 3つの決定的な貢献

1. **RNNの逐次性からの解放**: 並列計算の完全な活用を可能にした
2. **スケーリングの道を開いた**: データとモデルサイズを増やすほど性能が向上する「スケーリング則」の基盤を提供
3. **汎用アーキテクチャの確立**: NLPだけでなく、あらゆるドメインに適用可能な基盤を作った

---

## 5. Transformerの後世への波及

### 5.1 NLPにおける3つの系統

Transformerの発表後、モデルは大きく3つの系統に分岐しました。

<iframe src="/mdTechKnowledge/guides/transformer-p5-bert-gpt-divergence.html" width="100%" height="480" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

#### Encoder-only系統（BERT, 2018）

GoogleのBERTは、TransformerのEncoderのみを使用し、**双方向の文脈理解**に特化しました。

- **学習方法**: Masked Language Model（ランダムにトークンをマスクして予測）
- **得意なタスク**: 文書分類、質問応答、固有表現認識
- **特徴**: 文全体を双方向に見れるため、文の理解に優れる

#### Decoder-only系統（GPT, 2018〜）

OpenAIのGPT系列は、TransformerのDecoderのみを使用し、**テキスト生成**に特化しました。

- **学習方法**: 因果的言語モデル（次のトークンを予測）
- **得意なタスク**: テキスト生成、対話、コード生成
- **特徴**: 大規模化と「In-Context Learning」により汎用AIに発展

現在の大規模言語モデル（GPT-4、Claude、Gemini、LLaMAなど）は、**ほぼすべてがDecoder-only系統**です。

#### Encoder-Decoder系統（T5, BART）

GoogleのT5やFacebookのBARTは、元のTransformerと同じEncoder-Decoder構造を維持しています。

- **得意なタスク**: 翻訳、要約、テキスト変換
- **特徴**: 入力と出力の構造が異なるタスクに適する

### 5.2 Transformerの系譜

<iframe src="/mdTechKnowledge/guides/transformer-p5-transformer-family-tree.html" width="100%" height="520" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

### 5.3 NLPを超えた波及

Transformerの影響はNLPにとどまりませんでした。

#### Vision Transformer（ViT, 2020）

<iframe src="/mdTechKnowledge/guides/transformer-p5-vision-transformer.html" width="100%" height="400" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

画像を16×16のパッチに分割し、各パッチを「トークン」として扱うことで、**画像認識にもTransformerを適用**できることが示されました。「画像もトークンの系列である」というシンプルかつ強力なアイデアです。

#### その他の分野への展開

| 分野 | モデル例 | 適用方法 |
|:---|:---|:---|
| 音声認識 | Whisper (2022) | 音声をスペクトログラムのトークン系列として処理 |
| タンパク質構造予測 | AlphaFold2 (2020) | アミノ酸配列をトークンとしてAttentionで構造予測 |
| 画像生成 | DALL-E, Stable Diffusion | テキスト→画像の変換にTransformerを使用 |
| コード生成 | Codex, GitHub Copilot | コードをテキストとして扱い、Transformer生成 |
| 音楽生成 | MusicLM | 音楽をトークン列として生成 |
| ロボティクス | RT-2 | 行動をトークンとして生成 |

---

## 6. スケーリング — Transformerが切り拓いた道

### 6.1 パラメータ数の爆発的増加

<iframe src="/mdTechKnowledge/guides/transformer-p5-scaling-laws.html" width="100%" height="450" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

Transformerの最も重要な遺産のひとつは、**モデルのスケーリングが直接的に性能向上につながる**ことを示したことです。

| 年 | モデル | パラメータ数 |
|:---:|:---|:---:|
| 2017 | Transformer | 65M / 213M |
| 2018 | BERT-Large | 340M |
| 2019 | GPT-2 | 1.5B |
| 2020 | GPT-3 | 175B |
| 2022 | PaLM | 540B |
| 2023 | GPT-4 | ~1.8T（推定） |

2017年の65Mパラメータから、わずか6年で**約30,000倍**に成長しました。この「スケーリング則（Scaling Laws）」の発見——データ量・モデルサイズ・計算量を増やすと性能が予測可能に向上する——は、現代のAI開発の方向性を決定づけました。

### 6.2 アーキテクチャの改良

Transformer以降、数多くの改良が提案されてきました：

- **Sparse Attention**: 全位置間ではなく、選択的な位置間のAttentionを計算（計算量を$O(n\sqrt{n})$に削減）
- **FlashAttention**: GPU メモリアクセスパターンを最適化し、Attentionの実行速度を大幅に改善
- **Mixture of Experts (MoE)**: FFN層を複数の「エキスパート」に分割し、入力ごとに一部のエキスパートのみを活性化
- **Rotary Position Embedding (RoPE)**: 正弦波PEの改良版。相対位置をより自然にエンコード
- **Group Query Attention (GQA)**: Key/Valueヘッドを共有し、推論効率を改善

しかし、基本的な**Self-Attention + FFN + 残差接続 + Layer Norm**というTransformerの骨格は、2026年現在も変わっていません。

---

## 7. 8人の著者のその後

論文の8人の著者たちは、その後も最前線でAI研究を推進しています。

- **Ashish Vaswani**: Essential AI共同創業者
- **Noam Shazeer**: Character.AI共同創業者 → Google DeepMindに復帰
- **Niki Parmar**: Essential AI共同創業者
- **Jakob Uszkoreit**: Inceptive（生物学×AI）共同創業者
- **Llion Jones**: Sakana AI共同創業者（東京拠点）
- **Aidan N. Gomez**: Cohere共同創業者・CEO
- **Łukasz Kaiser**: OpenAI
- **Illia Polosukhin**: NEAR Protocol共同創業者（ブロックチェーン×AI）

8人中6人がスタートアップを創業しているのは注目に値します。Transformerの発明が、いかに大きな技術的・経済的インパクトを持っていたかを物語っています。

---

## まとめ — 全5回の総括

この連載では、「Attention Is All You Need」論文を5回にわたって詳細に解説してきました。

### 第1回で学んだこと
RNN/LSTMの限界（逐次処理・勾配消失・固定長ボトルネック）と、Attention機構の先行研究が、Transformerの着想に至る背景を形成した。

### 第2回で学んだこと
Transformerは6層のEncoder + 6層のDecoderから構成され、各層はSelf-Attention + FFN（+ Cross-Attention）という構造を持つ。残差接続とLayer Normalizationが深いネットワークの学習を支える。

### 第3回で学んだこと
Scaled Dot-Product Attentionは $QK^T/\sqrt{d_k}$ でスコアを計算し、softmaxを適用してValueの加重和を取る。Multi-Head Attentionは8つのヘッドで異なる注目パターンを並列に学習する。

### 第4回で学んだこと
正弦波Positional Encodingは語順情報を明示的にエンコードする。Warmup学習率スケジュール、ドロップアウト、Label Smoothingが訓練の成功を支える。

### 第5回で学んだこと
Transformerは英独BLEU 28.4、英仏BLEU 41.0でSOTAを達成し、学習コストは既存モデルの数分の一だった。この論文がBERT、GPT、Vision Transformerなど、現代AIのほぼすべての基盤となった。

---

### 一言でまとめると

> **「シンプルだが強力な注意機構だけで、複雑な系列処理を高速・高精度に実現できる」**

この論文が証明したこの事実は、2017年から2026年の現在に至るまで、AI革命の原動力であり続けています。Transformerは「注意こそが全て」という大胆な主張を、圧倒的な実験結果で裏付けた——まさにAI史上最も重要な論文のひとつです。

---

## 参考文献

- Vaswani, A., et al. (2017). "Attention Is All You Need." *NeurIPS.*
- Devlin, J., et al. (2019). "BERT: Pre-training of Deep Bidirectional Transformers." *NAACL.*
- Radford, A., et al. (2018, 2019). "Improving Language Understanding by Generative Pre-Training" / "Language Models are Unsupervised Multitask Learners."
- Brown, T., et al. (2020). "Language Models are Few-Shot Learners." *NeurIPS.* (GPT-3)
- Dosovitskiy, A., et al. (2021). "An Image is Worth 16x16 Words: Transformers for Image Recognition at Scale." *ICLR.* (ViT)
- Jumper, J., et al. (2021). "Highly accurate protein structure prediction with AlphaFold." *Nature.* (AlphaFold2)
- Kaplan, J., et al. (2020). "Scaling Laws for Neural Language Models." *arXiv.*
- Dao, T., et al. (2022). "FlashAttention: Fast and Memory-Efficient Exact Attention with IO-Awareness." *NeurIPS.*
