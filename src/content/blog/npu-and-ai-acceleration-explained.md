---
title: "NPUは何のためにあるのか — Claude Code・クラウドAIとローカルアクセラレータの関係"
date: 2026-04-28
updatedDate: 2026-04-28
category: "その他技術"
tags: ["NPU", "GPU", "Copilot+ PC", "Ryzen AI", "Claude Code", "AIアクセラレータ", "ローカルAI", "ハードウェア"]
excerpt: "Claude Code・ChatGPT・Microsoft 365 Copilotなど主要クラウドAIはローカルNPUを使わない。ではNPU搭載端末は何のためにあるのか？ Copilot+ PC専用機能（Recall・Cocreator等）、ビデオ会議エフェクト、Adobe等のクリエイティブ系での実利用を整理し、NPU有無の実質的影響を判断する基準を提示する。"
draft: false
---

**調査日**: 2026年4月28日

---

## 目次

1. [結論サマリー](#第1章-結論サマリー)
2. [Claude CodeとローカルGPU/NPUの関係](#第2章-claude-codeとローカルgpunpuの関係)
3. [NPUとは何か — 存在意義の整理](#第3章-npuとは何か--存在意義の整理)
4. [NPUが活躍する代表的な機能](#第4章-npuが活躍する代表的な機能)
5. [「Copilot」という名前の混同に注意](#第5章-copilotという名前の混同に注意)
6. [NPU有無の判断基準](#第6章-npu有無の判断基準)
7. [補足: GPU(dGPU/iGPU)との使い分け](#第7章-補足-gpudgpuigpuとの使い分け)
8. [情報ソース](#第8章-情報ソース)

---

## 第1章: 結論サマリー

| 観点 | 結論 |
|---|---|
| Claude CodeでローカルGPU/NPUは使うか | **使わない**。モデル推論はAnthropicクラウドで実行 |
| ChatGPT・Microsoft 365 Copilot本体は？ | **使わない**。クラウド推論が中心 |
| ではNPUは何のため？ | **OS/アプリに常駐する小〜中規模AI処理を、低消費電力で動かす専用回路** |
| Copilot+ PC専用機能（Recall等） | **NPU必須**。NPUなし端末では利用不可 |
| クラウドAIだけ使うユーザーにNPUは必要？ | **不要**。GPU/NPUの有無は応答速度・機能に影響しない |

**ローカルLLMを使わないユーザーにとって、NPUの有無はAI体験に実質的な影響を与えない。**ただしビデオ会議のバッテリー持ちや一部Windows新機能には差が出る。

---

## 第2章: Claude CodeとローカルGPU/NPUの関係

### Claude Codeのアーキテクチャ

```
[ユーザー入力]
   ↓
[Claude Code CLI / Desktop（Node.js + Ink / Electron）]  ← ローカルでCPUのみ
   ↓ HTTPS
[Anthropic API / Claude モデル]                          ← クラウド側で推論
   ↓ ストリーム
[応答表示・ファイル編集・ツール実行]
```

### ポイント

- Claude CodeのCLI/Desktopアプリ自体は、**Node.js + Ink（ターミナルUI）または Electron（Desktop）**で構築されたCPUベースのアプリケーション
- LLMの推論処理は**すべてAnthropicクラウド**で実行されるため、ローカルのアクセラレータは出番がない
- Claude Codeに**GPU/NPUを使うオプションは提供されていない**（ローカルモデル実行機能は非搭載）

### 唯一の例外

Claude Codeを通じて実行する**子プロセス**（`npm run build`、Pythonスクリプト等）が内部でGPU/NPUを使う場合は、ホストOSが認識しているハードウェアがそのまま使われる。これはClaude Codeの機能ではなくOS/プロセス側の挙動。

### 影響まとめ

| 項目 | ローカルGPU/NPU依存 |
|---|---|
| 応答速度 | ❌ 無関係（ネットワーク遅延+クラウド処理時間で決まる） |
| 並列セッション | ❌ CPUコア数とメモリで決まる |
| ファイル編集・ビルド | ❌ 通常のCPU処理 |
| バッテリー消費 | ❌ テキスト+ネットワークI/O中心 |

---

## 第3章: NPUとは何か — 存在意義の整理

### NPUの定義

**Neural Processing Unit**。AI推論（特に行列演算・畳み込み・量子化推論）を、CPU/GPUとは独立した専用回路で処理するアクセラレータ。

### CPU/GPU/NPUの役割分担

| プロセッサ | 得意分野 | AI処理の特性 |
|---|---|---|
| **CPU** | 汎用処理・分岐・OS全般 | 小規模AIは可能だが電力効率が悪い |
| **GPU** | 並列大規模計算（学習・大型推論） | 大規模モデル向き。常時稼働は電力消費大 |
| **NPU** | 軽量〜中規模AI推論の常時実行 | **低消費電力・低レイテンシ・常駐処理向き** |

### NPUの存在意義

CPU/GPUでも同じAI処理は可能だが、以下の点で不利:

- **消費電力**: GPUは数十W〜、NPUは数W程度
- **発熱**: GPU稼働でファンが回り続ける、NPUは静音維持
- **CPU/GPU負荷を奪わない**: ゲーム中・動画編集中もAIが裏で動ける
- **レスポンス**: 専用回路で待ち時間が短い

つまりNPUは「**AI機能を、ユーザーが意識しないレベルでバックグラウンド常駐させる**」ための回路。

---

## 第4章: NPUが活躍する代表的な機能

### 4.1 Microsoft Copilot+ PC専用機能（NPU 40 TOPS以上が必須要件）

| 機能 | 内容 | NPUの役割 |
|---|---|---|
| **Recall** | 画面を定期キャプチャしAIで要約・検索可能化 | 画像認識・OCR・埋め込み生成を常時バックグラウンド実行 |
| **Cocreator (Paint)** | リアルタイムお絵描き→画像生成 | Stable Diffusion系小型モデルをローカル推論 |
| **Live Captions翻訳** | 全アプリの音声をリアルタイム字幕＋翻訳 | 音声認識・翻訳モデルを常時実行 |
| **Windows Studio Effects** | カメラの背景ぼかし・視線補正・ノイズ除去 | ビデオ会議中の継続的画像処理 |
| **Click to Do** | 画面上のテキスト・画像にAIアクション | OCR・画像セグメンテーション |
| **Auto Super Resolution** | ゲーム画面のAIアップスケール | リアルタイム超解像 |

これらは**Copilot+ PC専用機能**として、NPU 40 TOPS以上が要件。NPU無し端末では一切利用不可。

### 4.2 Microsoft 365 Copilot周辺機能

| 機能 | NPU活用 |
|---|---|
| **Teams ノイズ抑制・背景ぼかし** | NPUで処理（搭載端末ではバッテリー持ちが大幅向上） |
| **Outlook 文書下書き候補（軽量）** | クラウド+NPU併用 |
| **Microsoft 365 Copilot本体（チャット・文書生成）** | **メイン処理はクラウド（OpenAI GPT）**。NPU必須ではない |

> ⚠️ **重要**: Microsoft 365 Copilot本体はクラウド処理なので、**NPU搭載端末でなくても普通に使える**。

### 4.3 サードパーティ製アプリ

| アプリ | NPU活用例 |
|---|---|
| **Adobe Photoshop / Premiere** | 被写体抜き出し・ノイズ除去・補完をローカル実行 |
| **DaVinci Resolve** | 顔認識・自動カラーマッチング |
| **Zoom / Google Meet** | 背景置換・ノイズ除去 |
| **Webカメラ専用ドライバ（Logicool等）** | 顔追従・自動フレーミング |
| **Windows Defender** | マルウェア検知の機械学習処理 |

---

## 第5章: 「Copilot」という名前の混同に注意

「Copilot」は複数の異なる製品名に使われており、NPU要件もそれぞれ異なる。混同しないこと。

| 製品 | NPU要件 | 実体 |
|---|---|---|
| **Copilot+ PC専用機能**（Recall/Cocreator/Click to Do等） | **必須（40 TOPS以上）** | Windowsローカル機能 |
| **Microsoft 365 Copilot**（Word/Excel/Teamsの生成AI） | **不要** | クラウド処理（OpenAI GPT） |
| **GitHub Copilot** | **不要** | クラウド処理 |
| **Copilot Cowork**（Wave 3 Microsoftエージェント） | **不要** | クラウド処理（Anthropic Claude基盤） |
| **ブラウザ版Copilot（旧Bing Chat）** | **不要** | クラウド処理 |

**Copilot+ PC ≠ Microsoft 365 Copilot ≠ GitHub Copilot**。Copilot+ PCのみNPU専用機能を持つ。

---

## 第6章: NPU有無の判断基準

| 利用シナリオ | NPU必要性 |
|---|---|
| **Claude Code** を主に使う | **不要**（クラウド処理のみ） |
| **ChatGPT** を主に使う | **不要** |
| **Microsoft 365 Copilot**（Word/Excel/Teams生成AI） | **不要** |
| **GitHub Copilot** | **不要** |
| ビデオ会議で背景ぼかし・ノイズ除去を頻繁に使う | あると**バッテリー2〜3割長持ち**。必須ではない |
| **Copilot+ PC専用機能**（Recall等）を使いたい | **必須**（端末買い替え対象） |
| 写真・動画編集でAI機能を多用する | あると快適。CPU/GPUでも動作可 |
| ローカルLLM・画像生成を本格的に使いたい | NPUより**dGPU（VRAM 12GB以上）**が重要 |

### クラウドAIユーザーの結論

**Claude Code・ChatGPT・Microsoft 365 Copilotなどクラウド型AIだけを使う場合、NPUの有無はAI体験に影響しない**。NPU非搭載端末でも問題なく利用可能。

---

## 第7章: 補足 — GPU(dGPU/iGPU)との使い分け

NPU・GPU・iGPUは目的が異なるため、用途で選び分ける。

| 種類 | 主用途 | 消費電力 | ローカルLLM適性 |
|---|---|---|---|
| **dGPU（NVIDIA RTX等）** | 大規模AI推論・学習・ゲーム・3DCG | 高（100W〜） | **最適**（VRAM 12GB以上推奨） |
| **iGPU（CPU内蔵）** | 軽量GPU処理・動画再生・軽量ゲーム | 低 | 小型量子化モデルなら一部可 |
| **NPU** | 常駐AI機能・低電力AI推論 | 極低（数W） | **不向き**（メモリ容量・帯域が不足） |

### 「ローカルでAI処理したい」ときの選択肢

| 用途 | 推奨ハードウェア |
|---|---|
| 大型LLM（70Bクラス）をローカル実行 | dGPU（RTX 4090等、VRAM 24GB） |
| 中型LLM（13B量子化）をローカル実行 | dGPU（RTX 4060 Ti 16GB等） |
| 画像生成（Stable Diffusion） | dGPU（VRAM 8GB以上） |
| ビデオ会議のリアルタイムエフェクト | NPU（または最近のiGPU） |
| Windows Recall等のCopilot+機能 | NPU（40 TOPS以上）必須 |
| クラウドAI（Claude Code/ChatGPT等） | **どれも不要** |

---

## 第8章: 情報ソース

### Microsoft Copilot+ PC関連

- [Microsoft 公式: Copilot+ PCs overview](https://www.microsoft.com/en-us/windows/copilot-plus-pcs)
- [Microsoft Learn: Windows Copilot Runtime](https://learn.microsoft.com/en-us/windows/ai/)
- [Microsoft 365 Copilot vs Copilot+ PC の違い解説（公式FAQ）](https://support.microsoft.com/ja-jp/copilot)

### NPU・Ryzen AI / Intel Core Ultra / Snapdragon X関連

- [AMD Ryzen AI 公式](https://www.amd.com/en/products/processors/consumer/ryzen-ai.html)
- [Intel Core Ultra (Meteor Lake/Lunar Lake) NPU解説](https://www.intel.com/content/www/us/en/products/details/processors/core-ultra.html)
- [Qualcomm Snapdragon X Elite NPU仕様](https://www.qualcomm.com/products/mobile/snapdragon/pcs-and-tablets/snapdragon-x-series)

### Claude Code関連

- [Anthropic 公式: Claude Code](https://docs.claude.com/en/docs/claude-code/overview)
- [Claude Code は CLI / Desktop / Cloud（Web） / Routines の4実行環境](/blog/claude-code-execution-environments/)

### 関連既存記事

- [Claude Code クラウドセッション構成図](/blog/claude-code-cloud-session-architecture/)
- [Claude Code の実行場所 — 端末上？クラウド上？](/blog/claude-code-execution-environments/)
- [Microsoft Copilot ラインナップ総まとめ](/blog/microsoft-copilot-lineup-2026/)
- [Microsoft Copilot Cowork アップデートまとめ](/blog/copilot-cowork-updates/)
