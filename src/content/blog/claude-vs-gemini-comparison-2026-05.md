---
title: "Claude vs Gemini 完全比較 — 有料プラン・NotebookLM・Gemini CLI・画像生成API料金（2026年5月版）"
date: 2026-05-04
updatedDate: 2026-06-10
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
| 利用モデル | Sonnet 4.6中心 | **Opus 4.8（最新フラッグシップ、2026-05-29 JST 〜デフォルト）** / Opus 4.7 / Sonnet 4.6 / Haiku 4.5 | 同左（高頻度） | 同左（最高頻度） |
| メッセージ目安 | 制限大 | 約45 / 5h | 約225 / 5h | 約900 / 5h |
| **Claude Code** | 不可 | **可** | 可 | 可 |
| **Claude Cowork** | 不可 | **可** | 可 | 可 |
| 画像/動画生成 | **不可** | **不可** | **不可** | **不可** |

---

## 3. Claude × Gemini 横断比較

| 観点 | Claude Pro ($20) | Google AI Pro ($19.99) |
|:---|:---|:---|
| 文章・コード | **更に強い**（Opus 4.8: コーディング 69.2% / 推論 57.9%、Opus 4.7 比で約 5pt 改善） | 並 |
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

## 6. Opus 4.8 リリースで変わった点（2026-05-28 PT / 2026-05-29 JST 追記）

### 6-1. 価格更新

| モデル | 標準価格（in/out per MTok） | Fast mode 価格 |
|:---|:---|:---|
| Opus 4.7（旧フラッグシップ） | $5 / $25 | $30 / $150 |
| **Opus 4.8（現フラッグシップ）** | **$5 / $25（据え置き）** | **$10 / $50（約 3倍安）** |
| Gemini 2.5 Pro（参考） | $1.25 / $10 (input 200k以下) | 該当機能なし |

→ Claude 側の **Fast mode が大幅に安く** なり、対 Gemini での価格差は依然あるものの、Claude 内での「高速モード」採用ハードルが大きく下がった。

### 6-2. Effort Control（claude.ai / Claude Code）

Opus 4.8 では **思考の深さを段階的に調整するスライダー** が claude.ai に登場。

| レベル | 想定用途 |
|:---|:---|
| **low** | 即答系の簡易タスク |
| **default** | 通常タスク（バランス） |
| **extra** | 構造化推論を要するタスク |
| **max** | 最深考察（コードベース全体の再設計、複雑な数理推論等） |

- Claude Code 側では `/effort low / default / extra / max` で同等の制御
- Gemini 側には現時点で同等のユーザー可視スライダーは無く（Thinking Budget は API のみ）、**対話 UI で思考の深さを選べる点は Claude の独自優位**

### 6-3. Dynamic Workflows（Claude Code v2.1.154 / 2026-05-28 PT）

Claude Code v2.1.154 で **Dynamic Workflows（Research Preview）** が追加。プロンプトに "workflow" を含めると、Claude が **数十〜最大1000サブエージェント** を背景でファンアウト実行し、大規模リファクタリングやコードベース移行を並列処理します。

| 観点 | Claude Code（Opus 4.8 + Dynamic Workflows） | Gemini CLI |
|:---|:---|:---|
| 並列サブエージェント | **最大 1000**（Enterprise / Team / Max） | 単一プロセス前提 |
| ステータス可視化 | `/workflows` で実行履歴閲覧 | 該当機能なし |
| 想定タスク規模 | コードベース移行・大規模リファクタリング | スクリプト化単位の自動化 |

→ **「複数視点の論駁・収束を AI 内で完結させる」用途では現状 Claude 側に大きなアドバンテージ**。Gemini は Vertex AI 上で別途オーケストレーション基盤を組む必要あり。

### 6-4. アライメント向上

Opus 4.8 では **コード欠陥の見落としが Opus 4.7 比で約 1/4**（Anthropic 公式発表）。Claude Mythos Preview に迫る水準とされ、**コードレビューでの誤検出・見逃しが懸念だった用途** で実用性が一段階上がっています。

---

## 7. Claude Fable 5 リリースで「最上位」が更新（2026-06-09 PT / 2026-06-10 JST 追記）

2026年6月9日（PT）、Anthropic は **Opus クラスより上位の「Mythos クラス」** を一般公開しました。これにより、Claude 側の最上位は Opus 4.8 から **Claude Fable 5** に更新されます。

| 項目 | Claude Fable 5（新・最上位） | Claude Opus 4.8（従来フラッグシップ） |
|:---|:---|:---|
| モデルID | `claude-fable-5` | `claude-opus-4-8` |
| 能力クラス | **Mythos クラス（Opus クラスより上位）** | Opus クラス |
| API 標準価格（in/out per MTok） | **$10 / $50** | $5 / $25 |
| 位置づけ | 最も高性能な一般公開モデル | Fable 5 のフォールバック先 |

- **性能**: 公式は FrontierCode で frontier モデル中最高、Hebbia Finance ベンチで全モデル中最高、スプレッドシート系で Opus 4.8 比 25〜30% 高速などを挙げ、「ほぼ全ベンチで SOTA」としています。
- **特殊な提供形態（重要）**: 対話プランでは **6月9日〜6月22日（PT）まで Pro / Max / Team / 座席制 Enterprise に追加料金なし**で利用でき、**6月23日以降はこれらのプランから外れクレジット制**に移行します（API・消費ベース Enterprise は当初から通常提供）。Opus 4.8 のように常時プランに含まれるわけではない点に注意。
- **安全設計**: 高リスク領域（サイバー・生物・化学・蒸留）でリクエストを拒否し **Opus 4.8 へ自動フォールバック**できる設計。Anthropic は「95%超のセッションはフォールバックなしで完結」としています。
- Gemini 側の最上位（Gemini 3.x 系）との比較は、料金・提供形態が大きく異なるため単純比較は困難ですが、**Claude は"期間限定で最上位を開放→以降クレジット制"という独特の提供形態**を採った点が特徴です。

> 詳細は別記事 [Claude Mythos Preview & Project Glasswing](/blog/claude-mythos-glasswing/) の Fable 5 / Mythos 5 追記、および Fable 5 専用記事（予定）を参照。

---

## 参考資料

- [Anthropic公式: Claude Fable 5 / Mythos 5（2026/6/9）](https://www.anthropic.com/news/claude-fable-5-mythos-5)

- [Anthropic公式: Claude Opus 4.8（2026/5/28）](https://www.anthropic.com/news/claude-opus-4-8)
- [Google AI Plans (Google One)](https://one.google.com/about/google-ai-plans/)
- [Gemini API Pricing](https://ai.google.dev/pricing)
- [Gemini API Rate Limits](https://ai.google.dev/gemini-api/docs/rate-limits)
- [Gemini CLI 公式リポジトリ](https://github.com/google-gemini/gemini-cli)
- [Claude Pricing](https://claude.com/pricing)
- [Anthropic API Pricing](https://platform.claude.com/docs/en/about-claude/pricing)

---

*本記事は2026年5月時点の情報に基づいています。価格・機能は予告なく変更される可能性があります。*
