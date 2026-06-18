---
title: "Claude Code の Effort レベルを /effort で選ぶ — low〜max と ultracode（xhigh + workflows）の6段階ガイド"
date: 2026-06-19
category: "Claude技術解説"
tags: ["Claude Code", "effort", "ultracode", "Dynamic Workflows", "xhigh", "Opus 4.8", "設定"]
excerpt: "Claude Code の /effort コマンドで選べる Effort レベル（low / medium / high / xhigh / max / ultracode）を、実際のスライダー画面とともに解説。各レベルの『速度 vs 知能・トークン消費』のトレードオフ、Opus 4.8 の既定（high）、最上位の ultracode が『xhigh + workflows』＝xhigh 推論に Dynamic Workflows の自動オーケストレーションを足したものである正体、永続レベルとセッション限定レベルの違い、操作方法までをまとめる。"
draft: false
---

## はじめに — /effort で「速度と知能のバランス」を選ぶ

Claude Code には、応答にどれだけの推論リソース（思考の深さ・トークン）を使うかを切り替える **Effort レベル** があります。`/effort` コマンドを実行すると、**`Faster`（速い）〜`Smarter`（賢い）** の軸でレベルを選ぶスライダー UI が表示されます。

実際の画面はこうです：

![Claude Code の /effort コマンドの Effort レベル選択スライダー。low / medium / high / xhigh / max と、別枠の ultracode（xhigh + workflows）](/mdTechKnowledge/images/claude-effort-slider.png)

スライダーは **low → medium → high → xhigh → max** と「速い→賢い」に並び、その先に特別枠として **ultracode（xhigh + workflows）** が置かれています。操作は **`+` / `>`（または ←/→）で調整、`Enter` で確定、`Esc` でキャンセル**です。

---

## 1. Effort レベルは6段階

| レベル | 位置づけ | 向くタスク | 永続性 |
|:---|:---|:---|:---|
| **low** | 最速・最軽量 | レイテンシ重視、知能をあまり要さない単純作業 | セッションをまたいで永続 |
| **medium** | 軽量 | コスト重視で多少の知能低下を許容できる作業 | 永続 |
| **high** | バランス（**Opus 4.8 の既定**） | トークンと知能のバランスを取りたい通常作業 | 永続 |
| **xhigh** | 高負荷 | より深い推論が要る難しい作業（Opus 4.7 の既定） | 永続 |
| **max** | 最深 | 最も難しい単発タスク。トークン上限なし | **セッション限定** |
| **ultracode** | xhigh + workflows | 構造が決まった大規模タスクを自動でワークフロー化 | **セッション限定** |

> **永続レベルとセッション限定レベル**：`low`〜`xhigh` は設定として永続します（次回セッションでも維持）。一方 **`max` と `ultracode` はセッション限定**で、`/effort high` などで通常レベルに戻すまでの一時設定です。設定ファイル（`effortLevel`）に書けるのは `low / medium / high / xhigh` のみで、`max` と `ultracode` は書けません。

---

## 2. max と ultracode は「使いどころを選ぶ」

スライダーで `max` や `ultracode` 側にカーソルを合わせると、警告が表示されます：

> *"May use excessive tokens, resulting in long response times or overthinking. Use sparingly for the hardest tasks."*
> （過剰なトークンを消費し、応答が長時間化したり「考えすぎ」になったりする可能性があります。最も難しいタスクにのみ控えめに使ってください）

`max` は「最深の推論・トークン上限なし」ですが、**過剰思考（overthinking）で収穫逓減**になりやすく、常用は非推奨です。`high` を基準に、本当に難しいタスクだけ一段上げるのが実務的です。

---

## 3. ultracode の正体 —「xhigh + workflows」

スライダー上で ultracode の下に **`xhigh + workflows`** と書かれているとおり、ultracode は単なる「最も賢い effort レベル」ではありません。正確には：

- **xhigh 相当の推論**をモデルに送りつつ、
- **タスクごとに Claude が Dynamic Workflows（動的ワークフロー）を自動でオーケストレーションする**設定

です。つまり1つのリクエストが「理解 → 変更 → 検証」といった連続ワークフローになり、**多数のサブエージェントが並列で動く**ことがあります（Dynamic Workflows は同時最大16・総計最大1000サブエージェント）。仕組みの詳細は関連記事を参照してください。

### `/effort ultracode`（設定）と `ultracode`（トリガー語）の違い

紛らわしいのですが、`ultracode` には2つの使い方があります：

| 使い方 | 効果 | 範囲 |
|:---|:---|:---|
| **`/effort ultracode`**（このスライダー） | セッション全体を「xhigh + ワークフロー自動化」モードに | **全タスク**がワークフロー化されうる（トークン・時間が増える） |
| **プロンプトに `ultracode` と一語添える** | その単発タスクだけをワークフロー化 | **単発のみ** |

セッション全体を高負荷モードにしたいなら `/effort ultracode`、単発だけワークフロー化したいなら本文に `ultracode` と書く、と使い分けます。`/effort high` でいつでも通常モードに戻せます。

---

## 4. どう選ぶか（実務の目安）

- **日常のコーディング・調べもの** → `high`（既定のまま）でOK
- **軽い定型作業でコスト・速度を優先** → `low` / `medium`
- **設計が難しく深く考えさせたい単発** → `xhigh`（永続）か `max`（セッション限定・使い切り）
- **大規模な移行・監査・多視点検証など、構造が決まった大量処理** → `ultracode`（ワークフローで大量並列）

迷ったら **`high` を基準**に、難しいタスクだけ一段上げるのが、コストと品質のバランスを取りやすい運用です。

---

## 関連記事

- [Claude Code Dynamic Workflows 完全ガイド](/mdTechKnowledge/blog/claude-code-dynamic-workflows-guide/) — ultracode が起動する「最大1000サブエージェントの並列実行」の仕組み
- [Agent Teams と Dynamic Workflows は何が違うのか](/mdTechKnowledge/blog/agent-teams-vs-dynamic-workflows/) — サブエージェント方式と独立セッション方式の違い

---

*本記事は2026年6月時点の Claude Code の挙動・公式ドキュメントに基づきます。Effort レベルの名称・既定・挙動はバージョンにより変わる可能性があります。*
