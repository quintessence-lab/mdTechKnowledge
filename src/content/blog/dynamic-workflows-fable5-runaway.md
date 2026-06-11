---
title: "恐怖のClaude　～Dynamic FlowsでサブエージェントがすべてFable 5で立ち上がったら"
date: 2026-06-12
category: "Claude技術解説"
tags: ["Claude", "Claude Code", "Dynamic Workflows", "Fable 5", "サブエージェント", "コスト管理", "失敗談"]
excerpt: "Claude Code の Dynamic Workflows を Fable 5 で起動したら、36個のサブエージェントが全部 Fable 5 で立ち上がった——最上位モデルが一斉に走り、あっという間にセッション上限。実際に遭遇した『恐怖』の一幕と、その回避策（サブエージェントのモデル明示指定）を短くまとめる。"
draft: false
---

9.8時間の動画を解析させようと、Claude Code の **Dynamic Workflows** を起動した。メインモデルは、公開されたばかりの最上位クラス **Claude Fable 5**。

「36個のサブエージェントで並列に読ませれば速い」——そう思った、次の瞬間だった。

## その画面

![Dynamic Workflows の進捗画面。36個のサブエージェントがすべて Fable 5 で起動している](/mdTechKnowledge/images/cwc-tokyo-fable5-subagents-swarm.png)

36個のサブエージェント。その **すべての行に「Fable 5」**。

最上位モデルが36体、一斉に画像読み取りという重い処理を始めていた。画面には `failed: API Error ... (ECONNRESET)`、`idle`、そして延々と続く `queued` の文字。トークンは猛烈な勢いで溶け、**ほどなくしてセッションの利用上限に到達**。作業は強制的に止まった。

ずらりと並んだ「Fable 5」の列は、なかなかに"恐ろしい"光景だった。

## なぜこうなるのか

Dynamic Workflows のサブエージェントは、**明示的にモデルを指定しない限り、メインループのモデルを引き継ぐ**。

つまり、メインを Fable 5 にしていれば——子エージェントも、全員 Fable 5。

Fable 5 は最上位クラス＝高価なモデルだ。それが数十体、同時に動けば、コストも消費トークンも一気に跳ね上がる。上限到達は時間の問題だった。

## 回避策：サブエージェントのモデルを明示指定する

対策はシンプルで、**サブエージェントのモデルを明示的に指定する**だけ。

```js
// Dynamic Workflows の agent() でモデルを明示
agent(prompt, { model: 'sonnet' })
```

視覚読み取り・転記・分類のような **大量かつ機械的な並列処理** は、Sonnet で十分なことが多い。一段下のモデルに逃がすだけで、コストと上限の両面で安全になる。実際、この動画解析も読み取りを **Sonnet** で再実行したところ、問題なく完走した。

## 教訓

- **メインを Fable 5 にしているときの Dynamic Workflows は要注意。** 子は黙っていると全員 Fable 5 になる。
- 起動前に「**子は何のモデルで動くのか**」を必ず確認する。
- **大量ファンアウトはモデルを一段下げる。** 速さの代わりに上限とコストを失っては本末転倒。

最強のモデルを、最強のまま36体並べると——速さの前に、財布とレート上限が悲鳴をあげる。便利な道具ほど、"何が走るのか"を握っておきたい。

---

> この一幕は、約9.8時間のアーカイブをスライド書き起こしした際の制作裏話です。完成物はこちら: [Code with Claude Tokyo 2026 全セッションまとめ](/mdTechKnowledge/blog/code-with-claude-tokyo-sessions/)
>
> 関連: [Claude Code Dynamic Workflows ガイド](/mdTechKnowledge/blog/claude-code-dynamic-workflows-guide/) ／ [Claude Fable 5 徹底解剖①概要編](/mdTechKnowledge/blog/claude-fable-5-overview/)
