---
title: "Claude Code の Artifact と claude.ai チャットの Artifact は別物 — スマホアプリの一覧に出てこない理由"
date: 2026-07-15
category: "Claude技術解説"
tags: ["Claude Code", "Artifacts", "claude.ai", "モバイルアプリ", "共有", "トラブルシューティング"]
excerpt: "PCのClaude Codeで作成したページ（Artifact）が、iPhoneのClaudeアプリの『アーティファクト』一覧に出てこない——実はこれは不具合ではなく仕様。claude.aiチャットのArtifactsとClaude CodeのArtifactsは名前は同じでも保存場所・一覧UIが別で、統合されていない。両者の違い・原因・見つからないときの対処法を公式ドキュメントに基づき整理する。"
draft: false
---

> ## 要点
>
> - **claude.ai チャットの Artifact**と**Claude Code の Artifact**は、名前は同じでも**別の実装・別の保存場所・別の一覧UI**です。
> - Claude Code の Artifact は URL が `claude.ai/code/artifact/<id>` で、一覧は専用ギャラリー **`claude.ai/code/artifacts`** に集約されます。**チャットのサイドバーとは別物**で、そこには表示されません。
> - **モバイルアプリからの Artifact 発行は非対応**（発行できるのは Claude Code CLI か Claude Desktop アプリのみ）。スマホの「アーティファクト」タブは、チャット由来のものしか表示していません。
> - Claude Code の Artifact 機能は 2026年6月18日に Team/Enterprise 向けベータで始まり、**同年7月に Pro/Max プランへも拡大**しました。
> - 見つからない場合は、**発行時に表示された直接URLを控える**か、ブラウザで **`claude.ai/code/artifacts`** を開けば確認できます。

## はじめに — 「PCで作った資料がスマホに出てこない」

PC で Claude Code（CLI）を使って作成した比較資料のページ（Artifact）を、あとで iPhone の Claude アプリから見返そうとしたら、「アーティファクト」の一覧画面にそれが見当たらない——代わりに、旅行プランや別の調査レポートなど、心当たりのない別のアーティファクトが並んでいる。

これは Anthropic 側の不具合ではなく、**「claude.ai チャットの Artifact」と「Claude Code の Artifact」が、そもそも別々に管理されている**ために起きる仕様です。本記事では、両者の違い・分かれている理由・見失ったときの対処法を、公式ドキュメントに基づいて整理します。

## Artifact とは何か（簡単な説明）

まず前提として、Artifact（アーティファクト）とは、Claude が生成した**まとまった成果物を、会話とは別のウィンドウ／ページとして切り出して表示・保存する機能**です。コード、レポート、ダッシュボードなど、チャットのテキストとして流し読みするより「見て・触って」使いたい内容に向いています。

Anthropic には性質の異なる2つの Artifact 機能があり、これが混同の元になっています。

### ① claude.ai チャットの Artifacts（従来からある機能）

通常の claude.ai の会話の中で、Claude が**まとまった自己完結的な成果物**（目安として15行を超えるコードや文書など）を作ると、チャット画面の右側に専用ウィンドウとして表示されます。「これを Artifact にして」と明示的に頼むこともできます。

会話内で作られただけでは自分の一覧には保存されず、ウィンドウを開いて **「Publish」を押すと**、claude.ai サイドバーの**専用 Artifacts セクション**に追加されます。

### ② Claude Code の Artifacts（2026年に追加された新機能）

Claude Code（CLI・デスクトップアプリ）のセッション中に、Claude が作業内容を**claude.ai 上のライブなWebページ**として発行する機能です。「このPRの差分を注釈付きで見せて」「先週のデプロイ失敗をダッシュボードにして」のように頼むと、Claude が HTML/Markdown ファイルを作成し、確認を求めた上で `claude.ai/code/artifact/<id>` という専用URLに公開します。セッションが進むとページも更新されます。

## なぜ一覧が分かれているのか（原因）

結論から言うと、①と②は**保存場所も一覧の置き場所も別**だからです。公式ドキュメントには、Claude Code の Artifact について次のように明記されています。

> "It also links to your gallery at claude.ai/code/artifacts, which lists every artifact you have created."

つまり Claude Code で作った Artifact の一覧は、チャットのサイドバーではなく **`claude.ai/code/artifacts`** という**専用のギャラリーページ**に集約されます。スマホアプリの「アーティファクト」タブは①（チャット由来）の一覧を表示する画面であり、②（Claude Code 由来）の専用ギャラリーとは統合されていません。

| 観点 | ① claude.ai チャットの Artifact | ② Claude Code の Artifact |
|:---|:---|:---|
| 発行元 | 通常の claude.ai 会話（Web/デスクトップ/モバイルアプリ） | Claude Code CLI（v2.1.183+）または Claude Desktop アプリ（v1.13576.0+）のセッション |
| URL 形式 | claude.ai のチャットに紐づくページ | `claude.ai/code/artifact/<id>` |
| 一覧の場所 | claude.ai サイドバーの Artifacts セクション | 専用ギャラリー `claude.ai/code/artifacts` |
| 一覧に載る条件 | ウィンドウを開いて「Publish」した分だけ | 発行した Artifact は自動的にギャラリーに掲載 |
| モバイルアプリからの新規発行 | 可能 | **不可**（CLI/デスクトップのみ対応） |
| 対応モデル経路 | — | Anthropic API 経由のセッションのみ（Bedrock/Vertex/Microsoft Foundry は非対応） |

## Claude Code Artifact の提供時期

Claude Code の Artifact 機能自体、比較的新しい機能です。段階的にプラン対象が広がってきました。

| 時期 | 内容 |
|:---|:---|
| 2026-06-18 | **Team・Enterprise** プラン向けにベータ公開（Claude Code CLI・デスクトップアプリ） |
| 2026年7月 | **Pro・Max** プランにも一般提供が拡大 |

Pro/Max プランでは、Artifact は発行者本人にのみ非公開の状態から始まり、共有する場合は**公開リンクのみ**が選択肢です（管理者による組織内共有機能はありません）。Team/Enterprise プランでは、組織内の特定メンバーやチーム全体への共有に加え、管理者が許可すれば公開リンクでの共有も可能です。

## 共有範囲の違いにも注意

Artifact を「誰に見せられるか」もプランによって異なります。

| プラン | 共有できる範囲 |
|:---|:---|
| Pro / Max | 公開リンクのみ（リンクを知っていれば誰でも閲覧可・claude.ai へのサインイン不要） |
| Team / Enterprise | 組織内の特定メンバー／組織全員に限定共有。管理者が許可すれば公開リンクも可 |

Pro/Max では「組織内だけに絞って共有する」という選択肢自体が存在せず、共有する時点で誰でも見られる公開リンクになる点は覚えておくとよいでしょう。

## 見つからないときの対処法

1. **発行時に表示されたURLを控えておく** — Claude Code が Artifact を発行すると、ターミナルに `claude.ai/code/artifact/...` 形式のURLが表示されます。ブックマークやメモに残しておくのが最も確実です。
2. **ブラウザで専用ギャラリーを開く** — `claude.ai/code/artifacts` にアクセスすると、自分が Claude Code で作成したすべての Artifact が一覧表示されます。スマホでもこの URL を直接ブラウザで開けば閲覧できます（アプリの「アーティファクト」タブ経由ではない点に注意）。
3. **共有して手元に控える** — 他の端末でも確認したい場合は、ページ右上の Share から公開リンクを発行しておくと、URLさえ分かればどの端末からでも開けます。
4. **同一セッションから更新する** — 別セッションから同じ Artifact を更新したい場合は、そのURLを Claude に伝えて「これを更新して」と頼みます。URLを伝えずに新しいセッションで頼むと、更新ではなく**別の新しい Artifact**が作られる点に注意してください。

## まとめ

- claude.ai チャットの Artifact と Claude Code の Artifact は、**名前が同じだけの別機能**。保存場所（サイドバー vs 専用ギャラリー `claude.ai/code/artifacts`）も、発行できる場所（チャット全般 vs CLI/デスクトップのみ）も異なります。
- スマホアプリの「アーティファクト」一覧は**チャット由来のものしか表示しない**ため、Claude Code で作ったページはそこには現れません。
- 探すときは、**発行時のURLを控える**か、**ブラウザで `claude.ai/code/artifacts` を直接開く**のが確実です。
- Claude Code の Artifact は 2026年7月から Pro/Max プランでも使えるようになった比較的新しい機能で、今後スマホアプリ側の一覧統合が進む可能性はありますが、本記事執筆時点では未統合です。

## 参考資料

- [Share session output as artifacts — Claude Code 公式ドキュメント](https://code.claude.com/docs/en/artifacts)
- [What are artifacts and how do I use them? — Claude Help Center](https://support.claude.com/en/articles/9487310-what-are-artifacts-and-how-do-i-use-them)
- [Claude Code now supports artifacts — Anthropic 公式ブログ](https://claude.com/blog/artifacts-in-claude-code)
- [Claude Code Artifacts now available for Pro and Max plan users — AlternativeTo](https://alternativeto.net/news/2026/7/claude-code-artifacts-now-available-for-pro-and-max-plan-users/)
