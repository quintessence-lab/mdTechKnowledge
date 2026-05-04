---
title: "Claude vs Gemini 完全比較 — 有料プラン・NotebookLM・Gemini CLI・画像生成API料金（2026年5月版）"
date: 2026-05-04
updatedDate: 2026-05-04
category: "Claude技術解説"
tags: ["Claude", "Gemini", "NotebookLM", "Gemini CLI", "画像生成", "プラン比較", "API料金"]
excerpt: "Anthropic ClaudeとGoogle Geminiの有料プランを2026年5月時点で徹底比較。NotebookLM・Gemini CLI・Imagen 4の画像生成API単価まで網羅。"
draft: false
---

<iframe src="/mdTechKnowledge/guides/claude-vs-gemini-comparison-2026-05.html" width="100%" height="4200" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

## はじめに — Gemini / NotebookLM / Gemini CLI の違い

「Gemini」は3つの異なる入り口があり、混同されやすいので最初に整理します。

| 名称 | 何か | 主な使い道 | アクセス先 |
|:---|:---|:---|:---|
| **Gemini（チャット）** | Webブラウザ・モバイルアプリで使う対話型AI。ChatGPTのGoogle版に相当 | 質問・調べもの・画像/動画生成・コード生成 | [gemini.google.com](https://gemini.google.com) |
| **NotebookLM** | 「自分が用意した資料」だけをソースに回答するAIノート。要約・FAQ・音声解説生成が特徴 | 論文・社内資料・PDF集約しての調査と要約 | [notebooklm.google.com](https://notebooklm.google.com) |
| **Gemini CLI** | ターミナル上でGeminiモデルを動かす公式コマンドラインツール（Claude Codeに対応する位置） | コード生成・ファイル編集・自動化スクリプト | `npm install -g @google/gemini-cli` |

**3つの関係性**: 同じGoogle AI Pro/Ultra契約で **3つすべてが使える**。料金も含めて3つの利用枠が共通で割り当てられている形（ただしCLIには別途のレート上限あり、後述）。

---

## 1. Gemini 有料プラン

| 項目 | 無料 | Google AI Pro | Google AI Ultra |
|:---|:---|:---|:---|
| 月額 | $0 | **$19.99** | **$249.99** |
| 主モデル | 2.5 Flash 中心 | **Gemini 3.1 Pro** + Deep Research | 3.1 Pro 最高上限 + Deep Think + Gemini Agent |
| コンテキスト | 〜128K | 1M | 1M |
| **NotebookLM** | 50 sources/note | **300 sources/note** | **600 sources/note** |
| **Gemini CLI 利用枠** | Flash系のみ無料枠 | Pro系モデルもCLIから利用可 | 最高上限でCLI利用 |
| **Gemini CLI APIトークン制限** | **60リクエスト/分・1,000リクエスト/日**（Flash系） | **Pro系: 60req/分・1,000req/日**、Flash系: 上限緩和 | Pro系も Ultra固有の高頻度上限 |
| 画像生成 (Imagen 4 / Nano Banana) | 限定的 | 標準枠 | 高頻度枠 |
| 動画生成 (Veo 3.1) | 不可 | Veo 3.1 **Lite** | Veo 3.1 **フル** + Project Genie |
| ストレージ | 15GB | **5TB** | **30TB** |

> 旧 Gemini Advanced / Google One AI Premium は **Google AI Pro に統合済み**（「Pro契約」と言ったら通常これ）。
> 2026年3月以降、**Gemini Pro系モデルは有料プラン専用**（無料はFlashのみ）。

---

## 2. Claude 有料プラン

| 項目 | Free | **Pro** | Max 5x | **Max 20x** |
|:---|:---|:---|:---|:---|
| 月額 | $0 | **$20** | $100 | **$200** |
| 利用モデル | Sonnet 4.6中心 | Opus 4.7 / Sonnet 4.6 / Haiku 4.5 | 同左（高頻度） | 同左（最高頻度） |
| メッセージ目安 | 制限大 | 約45 / 5h | 約225 / 5h | 約900 / 5h |
| **Claude Code** | 不可 | **可** | 可 | 可 |
| **Claude Cowork** | 不可 | **可** | 可 | 可 |
| 画像/動画生成 | **不可** | **不可** | **不可** | **不可** |

---

## 3. Claude × Gemini 横断比較

| 観点 | Claude Pro ($20) | Google AI Pro ($19.99) |
|:---|:---|:---|
| 文章・コード | **強い**（Opus 4.7） | 並 |
| **画像生成** | **不可** | **可（Imagen 4 / Nano Banana）** |
| 動画生成 | 不可 | Veo 3.1 Lite |
| マルチモーダル入力（音声/動画） | 限定 | フル対応 |
| CLI ツール | **Claude Code（強力）** | Gemini CLI |
| ストレージ | – | 5TB |
| NotebookLM | – | 300 sources/note |

**構造的違い**:

- **Gemini = スイート型**（生成系 + ストレージ + 検索系を1サブスクに同梱）
- **Claude = 単機能特化**（文章 + コード、画像/動画は持たない）

---

## 4. 画像生成の詳細（Geminiの強み）

Claudeには画像生成機能が **存在しません**（2026年5月時点）。一方、Geminiは Webアプリ・Whisk・Flow・APIの4ルートで画像生成可能です。

### 4-1. Webアプリ経由（サブスク内、ほぼ使い放題）

| プラン | Imagen 4 / Nano Banana 利用 |
|:---|:---|
| AI Pro | 標準枠（数十〜数百枚/日級） |
| AI Ultra | 最高頻度枠 |

### 4-2. API経由の単価（1枚あたり）

| モデル | 用途 | 単価 |
|:---|:---|:---|
| **Imagen 4 Fast** | 軽量バッチ | **$0.02 / 画像** |
| **Imagen 4 Standard** | 標準品質 | **$0.04 / 画像** |
| **Imagen 4 Ultra** | プロダクション | **$0.06 / 画像** |
| **Gemini 2.5 Flash Image (Nano Banana)** | 対話的編集 | **$0.039 / 画像** |

> ClaudeにはAPI/Webともに画像生成機能なし。画像が必要なら **Claude Code から MCP / Bash経由でGemini APIを呼ぶ** 構成が現実解。

---

## 5. API利用が必要な機能と必要なプラン

| やりたいこと | Webサブスクで可能? | API契約必要? |
|:---|:---|:---|
| Webで都度画像生成（手動） | **AI Pro で可** | 不要 |
| Claude Codeから自動で画像生成 | – | **Gemini API必要** |
| バッチで100枚画像生成 | 現実的でない | **Gemini API必要** |
| 自社アプリにGemini組込 | 不可 | **Gemini API必要** |
| Veo動画をプログラム生成 | 不可 | **Vertex AI Veo API必要** |

---

## 参考資料

- [Google AI Plans (Google One)](https://one.google.com/about/google-ai-plans/)
- [Gemini API Pricing](https://ai.google.dev/pricing)
- [Gemini API Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Gemini CLI 公式リポジトリ](https://github.com/google-gemini/gemini-cli)
- [Claude Pricing](https://claude.com/pricing)
- [Anthropic API Pricing](https://platform.claude.com/docs/en/about-claude/pricing)

---

*本記事は2026年5月時点の情報に基づいています。価格・機能は予告なく変更される可能性があります。*
