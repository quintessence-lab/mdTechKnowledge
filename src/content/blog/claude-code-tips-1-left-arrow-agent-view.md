---
title: "Claude Code Tips① — 左矢印キー（←）で今の会話をバックグラウンド化してAgent Viewを開く"
date: 2026-07-25
category: "Claude技術解説"
tags: ["Claude Code", "Tips", "Agent View", "キーボードショートカット", "バックグラウンドセッション"]
excerpt: "Claude Codeで空のプロンプト行のまま左矢印キー（←）を押すと、今の会話がバックグラウンド化されAgent View（claude agents一覧）が開く。Escキーで元の会話に戻れる対称構造と、v2.1.218で追加された誤操作防止の「2秒ルール」を公式ドキュメント原文ベースで解説する。"
draft: false
---

> ## 要点
>
> - 空のプロンプト行で **左矢印キー（←）** を押すと、今の会話が**バックグラウンド化**され、`claude agents` と同じ**Agent View**（セッション一覧）が開く。
> - Agent View で会話にアタッチしている場合も、空のプロンプト行で **←** を押すか **`/exit`** すると、元の Agent View に戻る（detach）。
> - Agent View 側では **Esc** で戻る。ただし ← でバックグラウンド化して開いた Agent View の場合、Esc は**シェルではなく元の会話へ**戻る。
> - **v2.1.218（2026-07-22 PT）** で誤操作防止策が追加され、**削除直後や入力履歴を辿った直後の2秒以内**に ← を押しても即座には切り替わらず、「Press ← again to open agents」という確認メッセージを経て**2回目の押下**で初めて切り替わるようになった。

## はじめに — 何気なく押した左矢印キーで画面が切り替わる理由

Claude Code のターミナル UI では、プロンプト入力中に何気なく左矢印キー（←）を押すと、突然「セッション一覧」のような画面に切り替わることがあります。カーソル移動のつもりで押したのに会話が消えたように見えて驚いた、という人も多いはずです。

これはバグではなく、**Claude Code の設計上の機能**です。左矢印キーは、空のプロンプト行でのみ「今の会話をバックグラウンドへ送り、Agent View（`claude agents` コマンドで開くのと同じセッション一覧画面）を開く」というグローバルなナビゲーションとして働きます。本記事は公式ドキュメント（`code.claude.com/docs/en/agents`）の原文をもとに、この挙動を正確に整理します。

## 1. 基本動作 — フォアグラウンドセッションでの ←

ターミナルで直接 `claude` を起動した（Agent View からアタッチしたのではない）**フォアグラウンドセッション**では、以下の動作になります。

> *In a session running in the foreground, one you started in the terminal rather than attached to from agent view, pressing `←` on an empty prompt backgrounds it and opens agent view with that row selected, so you can switch sessions without leaving the terminal.*

日本語で要約すると:

- **空のプロンプト行**（何も文字を入力していない状態）で **←** を押す
- 今の会話が**バックグラウンドセッション**として送られる
- **Agent View** が開き、たった今バックグラウンド化した行が選択された状態で表示される

つまり、ターミナルを離れることなく、複数セッションを切り替えるための入口として ← が使われています。文字を入力中（プロンプトが空でない）であれば、← は通常どおりカーソル移動として動作するので、うっかり会話を巻き込む心配はありません。

## 2. 逆方向 — Agent View にアタッチしたセッションでの ←

Agent View から特定のセッションにアタッチした場合（あるいは `claude attach <id>` でシェルからアタッチした場合）も、同じキーで元に戻れます。

> *Press `←` on an empty prompt, or run `/exit`, to detach and return to agent view, whether you opened the session from agent view or with `claude attach <id>` from your shell.*

- 空のプロンプト行で **←** または **`/exit`**
- 元の **Agent View** に戻る（detach）

「フォアグラウンドセッション → Agent View」と「アタッチしたセッション → Agent View」の両方が、同じ ← キーで統一されている点がポイントです。

## 3. Esc キーとの対称関係

Agent View 側では、Esc キーが基本の「戻る」操作です。

> *Press `Esc` at any time to return to your shell; if you opened agent view by backgrounding a session with `←`, `Esc` returns to that conversation instead.*

- 通常は **Esc** で **シェルへ**戻る
- ただし、**← でバックグラウンド化して Agent View を開いた場合は、Esc がシェルではなく「元の会話」へ**戻る

つまり ← と Esc は、それぞれ「会話 → 一覧」「一覧 → 会話」の対になっており、どちらから始めても行き来できる設計です。終了したい場合は **Ctrl+C を2回**押すのが確実な脱出方法として維持されています。

## 4. v2.1.218 で追加された「2秒ルール」（誤操作防止）

Claude Code v2.1.218（2026-07-22 PT）以前は、← を押すと**即座に**バックグラウンド化・切り替えが発生していました。プロンプトを Backspace で消した直後や、↑キーで入力履歴を遡った直後にうっかり ← を押してしまい、意図せず会話がバックグラウンドへ送られる、という誤操作が起きやすい状態でした。

v2.1.218 でこの点が改善されています。

> *Pressing `←` within two seconds of a deletion that emptied the prompt, or of moving through prompt history, shows `Press ← again to open agents`, or `Press ← again to go back to agents` in an attached session, and switches only on a second press at least a second later; before this release the press switched immediately.*

整理すると:

| 状況 | v2.1.218 より前 | v2.1.218 以降 |
|:---|:---|:---|
| 削除操作でプロンプトが空になった直後2秒以内に ← | 即座に切り替わる | 確認メッセージ表示、1秒以上空けた2回目の押下で切り替わる |
| 入力履歴（↑/↓）を辿った直後に ← | 即座に切り替わる | 同上 |
| 通常の空プロンプトで ← | 即座に切り替わる | 変更なし（即座に切り替わる） |

確認メッセージは、フォアグラウンドセッションでは `Press ← again to open agents`、アタッチ中のセッションでは `Press ← again to go back to agents` と表示され、文言でも状況が判別できるようになっています。

## 5. 関連操作 — Agent View の Peek パネル

Agent View 内でセッション一覧を移動する際は、上下矢印キーでプレビュー（peek）ができます。

> *Use `↑` and `↓` to peek at adjacent sessions without closing the panel, or `→` to attach.*

- **↑ / ↓**: パネルを閉じずに隣のセッションをプレビュー
- **→**: 選択中のセッションにアタッチ（本記事の ← の逆操作）

Agent View 全体のキーバインドの一覧は [Claude Code バックグラウンドセッション運用ガイド](/mdTechKnowledge/blog/claude-code-routines-guide/) の「主要キーバインド」セクションも参照してください。

## まとめ

- **空のプロンプト行での ←** は、Claude Code において「今の会話 ⇔ Agent View」を行き来するグローバルな操作。
- フォアグラウンドセッションで ← → **バックグラウンド化して Agent View を開く**。Agent View で ← または `/exit` → **detach して Agent View に戻る**。
- Agent View での **Esc** は通常シェルへ戻るが、← でバックグラウンド化した直後なら**元の会話へ**戻る（対称構造）。
- **v2.1.218 以降**、削除・履歴操作の直後2秒以内の ← は**2回押し**が必要になり、誤操作での会話バックグラウンド化を防止。
- 文字入力中（プロンプトが空でない）の ← は、これらの動作に一切影響せず**通常のカーソル移動**のまま。

## 参考資料

- [Manage multiple agents with agent view（公式ドキュメント）](https://code.claude.com/docs/en/agents)
- [Claude Code バージョン履歴まとめ](/mdTechKnowledge/blog/claude-code-version-history/) — v2.1.218 の変更点一覧
- [Claude Code バックグラウンドセッション運用ガイド](/mdTechKnowledge/blog/claude-code-routines-guide/) — Agent View の主要キーバインド一覧
