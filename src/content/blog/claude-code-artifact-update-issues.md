---
title: "Claude Code の Artifact が更新されない — 症状の類型・未修正Issue・切り分けガイド（2026年7月25日時点）"
date: 2026-07-25
category: "Claude技術解説"
tags: ["Claude Code", "Artifacts", "claude.ai", "トラブルシューティング", "republish", "バージョン管理", "共有", "GitHub Issues"]
excerpt: "Claude Code の Artifact を「更新したはずなのに反映されない」— この事象は個別環境の問題ではなく、2026年7月下旬時点で複数ユーザーが公式リポジトリに報告している既知の問題領域だ。本記事は 7月25日現在の状況を、(1) 仕様由来で『更新されない』ように見える4つの典型原因（URL未指定の別セッション更新は新規作成になる・ファイルパス変更で新URL・共有版のピン留め・409コンフリクト）、(2) 未修正のまま open な公式Issue群（republishしても状態が持続する #79824/#78374、WebFetchでartifactが読めない #79536 ほか）、(3) CHANGELOG 2.1.215〜219 に artifact 修正が入っていない事実、(4) 原因切り分けチェックリストと実務上の回避策、の4部で整理する。"
draft: false
---

> ## 要点（2026-07-25 時点）
>
> - Claude Code の Artifact（`claude.ai/code/artifact/<id>`）で「**更新したはずが反映されない**」事象は、**複数ユーザーが公式リポジトリに報告している既知の問題領域**。特に 2026年7月20日〜23日に関連報告が集中している。
> - 原因は大きく2系統。**①仕様由来**（別セッションで URL を渡さないと**更新ではなく新規 Artifact が作られる**、ファイルパス変更で新URL、共有バージョンのピン留め、409コンフリクト）と、**②未修正の不具合**（republish してもサーバー側の状態が古いまま持続する [#79824](https://github.com/anthropics/claude-code/issues/79824)・[#78374](https://github.com/anthropics/claude-code/issues/78374)、エージェントが Artifact を読めない [#79536](https://github.com/anthropics/claude-code/issues/79536) など）。
> - **CHANGELOG 2.1.215〜2.1.219 に Artifact 関連の修正は1件もなく**、上記 Issue はいずれも open のまま＝現在進行形。
> - まず本記事の**切り分けチェックリスト**で「新規作成に化けていないか」「版ピン留めではないか」を確認するのが最短。どれにも該当しなければ不具合報告相当。

## はじめに — 「更新したのに変わらない」は珍しくない

Claude Code の Artifact は、セッションの成果物を claude.ai 上のライブなWebページとして発行する機能です。公式ドキュメントの建て付けでは「republish すれば**同一URLのまま即座に新バージョンが配信**され、開いているページはその場で更新される」ことになっています。

ところが実際には、「更新を頼んだのにページが変わらない」「republish しても状態が引き継がれる」という報告が、2026年7月下旬時点で公式リポジトリ（anthropics/claude-code）に複数上がっています。本記事は 7月25日現在の状況を、仕様由来の原因・未修正の不具合・切り分け手順の3層で整理します。

## 1. まず疑うべき「仕様由来」の4つの典型原因

不具合を疑う前に、以下の4つは**仕様どおりの動作**で「更新されない」ように見える代表例です。

| # | 原因 | 何が起きるか | 対処 |
|---|---|---|---|
| 1 | **別セッションから URL を渡さずに更新を依頼** | 公式docsに明記: 「**URL なしでは、新しいセッションは既存の更新ではなく常に新しい Artifact を作る**」。つまり“更新したつもり”が**別URLの新規 Artifact**になり、元のURLは古いまま | 更新依頼時に必ず `claude.ai/code/artifact/<id>` の**URLを本文で渡す**。ギャラリー `claude.ai/code/artifacts` に同名の行が増えていたらこのパターン |
| 2 | **元と異なるファイルパスから発行** | 同一セッションでも、発行元のファイルパスが変わると**新しいURLが割り当てられる** | 同じファイルを編集して再発行する（パスを変えない） |
| 3 | **共有バージョンのピン留め** | Share メニューで「Sharing version N」を特定版に固定していると、**発行者には最新版・閲覧者には旧版**が表示され続ける | ページヘッダの Share から「**Always share latest version**」トグルを確認 |
| 4 | **409 コンフリクト** | 別セッションが同じ Artifact を先に更新していると、後からの書き込みが**409で拒否**される（黙って上書きしない設計） | 最新内容を読み直し、変更をマージしてから再発行 |

これに加えて、**unpublish（非公開化）は一方通行**である点にも注意が必要です。一度 unpublish した Artifact は同じものを再公開できず、新規作成（＝新URL）になります（二次情報: [Stacktree の解説](https://stacktr.ee/blog/claude-artifact-cannot-republish)）。共有済みリンクを維持したい Artifact を「一旦下げて直す」運用はできません。

## 2. 未修正の不具合報告（2026-07-25 時点・すべて open）

上記のどれにも当てはまらないのに更新・反映が効かない場合、以下の報告群と同種の可能性があります。公式リポジトリの Issue から、関連するものを報告日順に整理します。

| Issue | 報告日 | 症状 |
|---|---|---|
| [#76462](https://github.com/anthropics/claude-code/issues/76462) | 07-10 | デスクトップアプリの Artifact ペインで、**republish 後の新バージョン初回表示時にマウスホイールスクロールが効かない**（更新自体は成立しているが表示が壊れる） |
| [#77895](https://github.com/anthropics/claude-code/issues/77895) | 07-15 | **mermaid 図を含む Artifact が公開共有できない** |
| [#79536](https://github.com/anthropics/claude-code/issues/79536) | 07-20 | **エージェント（WebFetch）が Artifact を読めない**。`artifact read failed: incomplete boot response`。同一アカウント所有の有効な Artifact でも失敗・再現あり |
| [#79824](https://github.com/anthropics/claude-code/issues/79824) | 07-21 | **「This version can't be shared publicly」エラーが republish しても解消しない**。同一ファイルでの版再発行でも、**別パスから新URLで作り直しても**同じエラーが持続＝サーバー側の状態が古いまま残る |
| [#79901](https://github.com/anthropics/claude-code/issues/79901) | 07-21 | 版履歴の取得・URLバージョニングの機能要望（**版まわりの見通しの悪さ**への不満の表れ） |
| [#78374](https://github.com/anthropics/claude-code/issues/78374) | 07月 | **capabilities を宣言していないのに「uses connectors」として公開共有がブロックされ続ける**。republish 後もキャッシュされた能力状態が残る（報告者は per-owner/セッション単位のキャッシュを疑っている） |
| [#80198](https://github.com/anthropics/claude-code/issues/80198) | 07-22 | VS Code 拡張で、**republish 時の挙動が docs 記載と不一致**（`CLAUDE_CODE_ARTIFACT_AUTO_OPEN=0` でもブラウザが開く） |
| [#80418](https://github.com/anthropics/claude-code/issues/80418) | 07-23 | **Artifact ツール自体が利用不可・無応答**になる |

共通するパターンは「**republish が“新しい状態”を素直に反映しない**」ことです。#79824 と #78374 は、版の再発行どころか**新規 Artifact の作成でもエラー状態が持続**したと報告されており、クライアント側ではなくサーバー側の状態管理に起因することを示唆しています。

また #79536（Artifact の読み取り失敗）は、「別セッションから URL を渡して更新する」ワークフローの前段（現内容の読み取り）を壊すため、**これを踏むと更新が成立しない／新規作成に化ける**可能性があります。ただし筆者環境の実測（7月23〜24日）では同じ WebFetch 読み取りが**成功したケースもあり**、常時再現ではなく環境・タイミング依存とみられます。

## 3. 修正状況 — CHANGELOG に Artifact の修正なし

Claude Code の公式 CHANGELOG を確認したところ、**直近の v2.1.215〜v2.1.219 に Artifact 関連の修正・変更は1件も含まれていません**（2026-07-25 時点）。上記の Issue 群はすべて open のままであり、「アップデートしたら直った」を期待できる段階にはまだ達していません。

なお、解説系の二次記事（republish すれば同一URLで即反映・キャッシュバスト不要、と説明するもの）は**公式仕様どおりの動作を前提**に書かれており、上記 Issue 群の実態とは食い違いがあります。「仕様上は即反映のはずが、実際には反映されないケースが一定数ある」というのが7月下旬の実情です。

## 4. 切り分けチェックリスト

「更新されない」に遭遇したら、上から順に確認します。

1. **ギャラリーを確認する** — ブラウザで `claude.ai/code/artifacts` を開き、**同名の Artifact が増えていないか**を見る。増えていたら原因1（URL未指定）か原因2（パス変更）で、**更新は新規作成に化けている**。以後は元のURLを明示して更新を依頼する
2. **URL が同一かを確認する** — セッションが発行後に表示したURLと、見ているページのURLの `<id>` を突き合わせる
3. **版のピン留めを確認する** — ページヘッダの Share で「Always share latest version」になっているか。特定版を固定していたら最新版に切り替える
4. **ハードリロードする** — 表示側のブラウザキャッシュの可能性を除外（Ctrl+Shift+R）。デスクトップアプリのペイン表示がおかしい場合は #76462 の症状も疑い、ブラウザで直接URLを開いて比較する
5. **同時更新（409）を確認する** — 他のセッション・共同編集者が同じ Artifact を触っていないか。触っていたら最新を読み直してから再発行
6. **ここまで全部シロなら不具合** — #79824 / #78374 / #80418 と同種のサーバー側状態の問題である可能性が高い。再現手順（発行→更新依頼→結果、URL、エラーメッセージ）を添えて [anthropics/claude-code](https://github.com/anthropics/claude-code/issues) へ起票するか、既存 Issue に合流する

## 5. 実務上の回避策

- **更新依頼は「URL＋同じファイル」をセットで** — 別セッションからの更新は必ずURLを渡す。発行元ファイルはプロジェクト内に残るので、そのファイルを編集して同じパスから再発行する
- **共有リンクの安定性が最重要なら Artifact に依存しない** — unpublish 一方通行・版まわりの不透明さを踏まえると、URL を自分で管理できるホスティング（自サイト・GitHub Pages 等）に置く方が堅い。Artifact は「セッション成果の速報・共有」用と割り切る
- **重要な版はローカルのHTML/mdファイルで保全する** — Artifact の版履歴取得は現状 API がなく（#79901 が要望中）、正本はローカルファイル側に置く
- **発行直後に表示確認まで行う** — 「発行成功のメッセージ」と「実際の反映」がズレる報告がある以上、更新のたびにブラウザで実物を確認するのが確実

## まとめ

- 「Artifact を更新したのに反映されない」は、**2026年7月25日時点で複数ユーザーが報告している既知の問題領域**であり、個別環境の問題とは限らない
- ただし報告の相当数は**仕様由来**（URL未指定の別セッション更新＝新規作成、版ピン留め等）でも説明がつくため、まず**切り分けチェックリスト**で確認する
- 仕様で説明がつかない「republish しても状態が持続する」系の不具合（#79824/#78374 ほか）は**未修正・open のまま**で、v2.1.219 までの CHANGELOG にも修正は入っていない
- 当面は「URL明示＋同一ファイルからの再発行＋発行後の実物確認」を習慣化し、リンクの安定性が最重要の用途では Artifact 以外のホスティングを検討する

## 関連記事

- [Claude Code の Artifact と claude.ai チャットの Artifact は別物](/mdTechKnowledge/blog/claude-code-artifacts-vs-chat-artifacts/) — 2つの Artifact 機能の違い・ギャラリーが分かれている理由
- [Claude Code バージョン履歴まとめ](/mdTechKnowledge/blog/claude-code-version-history/) — 各バージョンの修正内容

## 出典

- [Share session output as artifacts — Claude Code 公式ドキュメント](https://code.claude.com/docs/en/artifacts)（republish・版・共有の仕様）
- anthropics/claude-code Issues: [#76462](https://github.com/anthropics/claude-code/issues/76462) / [#77895](https://github.com/anthropics/claude-code/issues/77895) / [#79536](https://github.com/anthropics/claude-code/issues/79536) / [#79824](https://github.com/anthropics/claude-code/issues/79824) / [#79901](https://github.com/anthropics/claude-code/issues/79901) / [#78374](https://github.com/anthropics/claude-code/issues/78374) / [#80198](https://github.com/anthropics/claude-code/issues/80198) / [#80418](https://github.com/anthropics/claude-code/issues/80418)
- [Claude Code CHANGELOG（公式）](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)（2.1.215〜2.1.219 に artifact 修正なしを確認）
- [Why a Claude artifact cannot be republished — Stacktree](https://stacktr.ee/blog/claude-artifact-cannot-republish)（unpublish の一方通行性）

*本記事は 2026年7月25日（JST）時点の公開情報・Issue の状態に基づきます。Issue のステータスや CHANGELOG は随時更新されるため、最新状況は各リンク先で確認してください。*
