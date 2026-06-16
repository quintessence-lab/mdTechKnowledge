---
title: "【6/15施行は撤回】Claude Agent SDK / claude -p 課金分離ガイド — 当日に一時停止、現状と再開への備え"
date: 2026-06-06
updatedDate: 2026-06-17
category: "Claude技術解説"
tags: ["Claude", "Anthropic", "Agent SDK", "claude -p", "課金", "クレジットプール", "Claude Code", "GitHub Actions", "料金", "一時停止"]
excerpt: "2026年6月15日に施行予定だった『Agent SDK クレジットプール』への課金分離は、施行予定日当日に Anthropic が公式に一時停止（pause）した。現在 Agent SDK・claude -p（headless）・GitHub Actions は従来どおりサブスク枠から消費され、別クレジットプールは未稼働。本記事は『何が起きたのか（撤回の経緯）』『当初発表されていた設計の中身』『再開に備えて把握しておくべきこと』を公式ヘルプセンター記事（一次ソース）ベースで整理する。【2026-06-17更新】施行は撤回・一時停止。慌てて設定する必要はないが、再開に備えた棚卸しは有効。"
draft: false
---

> ## 🚨 速報：この課金分離は「施行されませんでした」（2026-06-17 更新）
>
> - **2026年6月15日に施行予定だった**「Agent SDK クレジットプール」への課金分離は、**施行予定日当日に Anthropic が公式に一時停止（pause）**しました。
> - 一次ソースである公式サポート記事の冒頭に、こう明記されています — **"We're pausing the changes to Claude Agent SDK usage described below. For now, nothing has changed."**（以下に記載の Agent SDK 利用に関する変更を一時停止します。現時点では何も変わっていません）
> - **現在、Agent SDK・`claude -p`（headless）・Claude Code GitHub Actions・サブスク認証のサードパーティアプリは、従来どおりサブスクリプションの利用上限から消費**されます。独立クレジットプールは**稼働していません**。
> - したがって、**いま慌ててクレジットを claim する・usage credits を設定する必要はありません**（claim の対象自体が現在は提供されていません）。
> - ただし **「撤回＝完全に白紙」ではありません**。Anthropic は「サブスク利用の実態により合う形で計画を更新中で、何かが発効する前に改めて告知する」と表明しており、**形を変えて再開する可能性**があります。当初設計の理解と、自分の自動実行のトークン量の把握はしておくと、再開時に慌てずに済みます。
>
> 一次ソース: [Use the Claude Agent SDK with your Claude plan — Anthropic Support](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan)（冒頭に "pausing" 告知）

## はじめに — 「施行されるはず」が当日に撤回された

2026年6月15日は、当初「Claude を自動で動かしている開発者にとって**課金体系の節目**になる」と見られていた日でした。Pro / Max などのサブスクで賄っていた `claude -p` の CI 自動実行や Agent SDK の常時バッチを、独立した「**Agent SDK クレジットプール**」（API 従量レート課金）へ分離する——そう発表されていたためです。

ところが、**施行予定日である 6月15日当日、Anthropic はこの変更を一時停止（pause）**しました。公式サポート記事の冒頭に「変更を一時停止する／現時点では何も変わっていない」と追記され、複数の報道（The New Stack、the-decoder ほか）も「施行されるはずだった当日に撤回された」と伝えています。背景として、施行前から噴出していた開発者の反発や、OpenAI との価格競争といった事業要因が指摘されていますが、これらは二次情報です。

本記事は、(1) **何が起きたのか（一時停止の事実）**、(2) **当初発表されていた設計の中身**（再開に備えて理解しておく価値があります）、(3) **いま備えとしてやっておくとよいこと**、を整理します。

> ⚠️ **「施行済み」を前提とした古い情報に注意してください。** 2026-06-17 時点では施行されておらず、何も変わっていません。Web 上には施行を前提にした解説が多数残っていますが、現状とは異なります。

> **日付・TZ注記**: 当初の施行予定は「June 15, 2026」、一時停止の告知も同日付。再開時期は本記事更新時点（2026-06-17）で未定です。同じ 6月15日には「Sonnet 4 / Opus 4 のリタイア（モデルID廃止）」も予定されていました。これは課金分離とは**別問題**で、こちらは別記事を参照してください（→[Anthropic モデル廃止スケジュール & 移行ガイド](/blog/anthropic-model-deprecation-migration/)）。

---

## 1. いま何が起きているのか（結論）

| 状態 | 内容 |
|:---|:---|
| **課金分離は一時停止中** | Agent SDK / `claude -p` / GitHub Actions は**従来どおりサブスク枠から消費**。独立クレジットプールは未稼働 |
| **必要な緊急対応** | **なし**（claim の対象も現在は未提供）。再開に備えた棚卸しは有効 |
| **今後** | 形を変えて**再開する可能性**。発効前に改めて公式告知、と Anthropic が表明 |

当初は「サブスクリプションひとつ」で賄われていた利用を「**2つの枠**」に分ける計画でした。以下では、その**当初発表されていた設計**を「再開に備えた予習」として解説します（くり返しになりますが、**現在は停止中**です）。

---

## 2. 【当初設計】対象となる予定だった利用形態

停止された当初設計で、独立クレジットプールへ移る予定だったのは次の4種類です（公式記事が逐語的に挙げていたもの）。

| 対象（予定） | 説明 |
|:---|:---|
| **Claude Agent SDK** | 自前プロジェクトでの SDK 利用（Python / TypeScript） |
| **`claude -p`（非対話モード / headless）** | Claude Code を非対話で実行するモード（CI・スクリプト組み込み） |
| **Claude Code GitHub Actions** | GitHub Actions インテグレーション（自動PRレビュー・自動コード生成など） |
| **サードパーティ製アプリ** | Claude サブスク認証で動く外部エージェント製品（報道では Zed・Conductor などが具体例） |

> 現在はいずれも **従来どおりサブスク枠から消費**されます（分離は停止中）。

---

## 3. 【当初設計】対象外（もともと従来どおり）

逆に、以下は当初設計でも**サブスクに含まれ影響を受けない**とされていたものです。現在はもちろん、上記の対象予定も含めて**すべて従来どおり**です。

| 対象外 | 説明 |
|:---|:---|
| **対話型 Claude Code** | 端末 / IDE で対話しながら使う通常の Claude Code |
| **Claude.ai チャット** | Web / デスクトップ / モバイルのチャット |
| **Claude Cowork** | Cowork での利用 |

---

## 4. 【当初設計】プラン別の月額 Agent SDK クレジット

当初設計では、各プランに**プラン月額と同額**のAgent SDK クレジットが付与される予定でした（公式記事の表に基づく。**現在は付与されていません**）。

| プラン | 月額クレジット（予定） |
|:---|:---|
| **Pro** | **$20** |
| **Max 5x** | **$100** |
| **Max 20x** | **$200** |
| Team（Standard） | $20 / シート |
| Team（Premium） | $100 / シート |
| Enterprise（usage-based） | $20 / ユーザー |
| Enterprise（seat-based Premium） | $200 / シート |

- クレジットは**ユーザー単位**で付与され、**チーム内でプール・共有はできない**設計でした（"Credits belong to individual accounts. They can't be shared or pooled across teammates."）。
- Enterprise の seat-based Standard シートはクレジット対象外とされていました。自組織の正確な扱いは、再開時の公式案内で確認してください。

---

## 5. 【当初設計】ロールオーバーと超過時の挙動

### ロールオーバーはなし（予定）

未使用クレジットは**翌請求サイクルへ繰り越されない**設計でした（"Unused credits don't roll over to the next billing cycle."）。

### 月額クレジットを使い切ったら（予定）

枯渇後の挙動は、**「usage credits（追加課金 / overflow billing）」を有効にしているか**で分岐する設計でした。

| usage credits 設定 | 枯渇後の挙動（予定） |
|:---|:---|
| **有効** | 追加の Agent SDK 利用は継続し、**標準APIレートで課金** |
| **無効（デフォルト）** | Agent SDK リクエストは**次サイクルの補充まで停止（reject）**。キューイングも安価モデルへの自動フォールバックもなし |

> この「無効なら自動処理が突然止まる／有効ならコストが青天井になりうる」という二者択一こそが、施行前に開発者の反発を招いた一因とされています（撤回の背景の一つ）。**再開時には、この ON/OFF をどう設定するかが論点になります。**

---

## 6. 【当初設計】オプトイン（claim）は必須だった

当初設計で最も誤解されやすかった点です。**移行自体は全ユーザーに自動適用される一方、クレジットの受け取りには「一回限りのオプトイン（claim）」が必要**とされていました。

- 公式記事原文（要旨）: クレジットは Claude アカウントから**一度だけ claim**し、以降は毎サイクル自動更新（"You claim your credit through your Claude account once. After that, it refreshes automatically each cycle."）。
- **現在は claim の対象自体が提供されていません**（停止中のため）。施行前に届いていたとされる案内メールも、再開時には改めて案内される見込みです。

---

## 7. 課金レート（単価）— 最新の API 標準レート

当初設計では、クレジット消費・超過分とも**標準APIリストレート（standard API list rates）**で計算される予定でした。再開時にも同様の単価が基準になる可能性が高いため、**最新の公式単価**を載せておきます。

以下は **公式ドキュメント（platform.claude.com / docs）に基づく現行の標準レート**（100万トークンあたり・入力/出力、2026-06-17 時点）です。

| モデル | API モデルID | 入力 /1M | 出力 /1M |
|:---|:---|:---:|:---:|
| **Claude Opus 4.8** | `claude-opus-4-8` | **$5** | **$25** |
| **Claude Sonnet 4.6** | `claude-sonnet-4-6` | **$3** | **$15** |
| **Claude Haiku 4.5** | `claude-haiku-4-5-20251001`（alias `claude-haiku-4-5`） | **$1** | **$5** |

- **Batch API は 50% 引き**: Opus 4.8 = $2.50 / $12.50、Sonnet 4.6 = $1.50 / $7.50、Haiku 4.5 = $0.50 / $2.50。
- Opus 4.8 は **1M コンテキストを標準価格**で提供（long-context プレミアムなし）。
- 注意: Opus 4.7 以降は新トークナイザを採用しており、同一テキストでも従来比で**トークン数が増える**傾向があります。コスト換算時は実トークン量で見積もってください。
- per-token の最新の正確な額・プロンプトキャッシュ単価は、契約時点の[公式 API 料金](https://www.anthropic.com/pricing)で確認してください。

> 旧版の本記事は単価表を Opus 4.7 / 二次ソース参考値として掲載していましたが、本更新で **Opus 4.8 を含む公式ドキュメント基準の値**に差し替えました。

---

## 8. 影響を受ける予定だった運用（再開時の参考）

当初設計が施行されていれば、次のような「自動で回している」運用がクレジットを消費する予定でした。**再開された場合に影響が大きい運用**として把握しておくと役立ちます。

- **CI/CD パイプラインで `claude -p` を常時実行**しているチーム
- **GitHub Actions による自動PRレビュー / 自動コード生成**
- **常時稼働の Agent SDK バッチ / スケジュール実行のエージェント**
- **サードパーティのエージェント製品**（Zed・Conductor 等）をサブスク認証で利用

逆に、手元で対話しながら Claude Code を使う・Claude.ai でチャットする・Cowork を使う、といった用途は当初設計でも対象外でした。

> 重い自動化利用者ほど、再開時の影響は大きくなります。**いまのうちに「自動実行のトークン消費量」を把握しておく**ことが、再開時に慌てないための最良の準備です。

---

## 9. いま備えとしてやっておくとよいこと（緊急ではない）

> **くり返し: 6/15 の施行は撤回・一時停止されました。以下は「今すぐ必須」ではなく、再開に備えた予習・棚卸しです。**

1. **棚卸し（推奨）**: `claude -p` / Agent SDK / GitHub Actions で動かしている処理を洗い出し、月間トークン消費を**APIレート換算**で試算しておく。再開時の影響を即座に見積もれる。
2. **公式アナウンスのウォッチ**: 再開・新設計は「発効前に改めて告知」とされている。公式サポート記事と Anthropic の告知を定期的に確認する。
3. **usage credits の方針を仮決め**: 再開時に「CI を止めたくない → ON（コスト監視も）」「コスト暴走を防ぎたい → OFF（枠超過で停止前提）」のどちらにするか、考えておく。
4. **プラン見直し / API直契約の検討**: 自動化のボリュームが大きいなら、再開時にプラン階層の見直しや Anthropic API 直接契約のほうが合理的な場合がある。
5. **コスト最適化の下準備**: モデルルーティング（定型処理は Haiku、複雑処理のみ Sonnet/Opus）、プロンプトキャッシュ、コンテキスト削減でトークンを抑える設計にしておく。

---

## 10. よくある誤解の整理

| 誤解 | 正しい理解（2026-06-17 時点） |
|:---|:---|
| 「6月15日にもう施行された」 | ❌ **施行予定日当日に一時停止**。現在は何も変わっていない |
| 「いま claim しないと損する」 | ❌ **claim 対象は現在未提供**。慌てて設定する必要はない |
| 「もう完全に撤回されて二度とない」 | △ **白紙ではない**。形を変えて再開の可能性あり（発効前に告知予定） |
| 「対話型 Claude Code も有料クレジットになる」 | ❌ 当初設計でも対象外。現在ももちろん従来どおり |
| 「余ったクレジットは翌月に繰り越せる」 | ❌ 当初設計では**ロールオーバーなし**（再開時も同様の見込み） |
| 「チームでクレジットを共有できる」 | ❌ 当初設計では**ユーザー単位**でプール・共有不可 |

---

## まとめ

- **2026年6月15日に施行予定だった Agent SDK クレジットプールへの課金分離は、施行予定日当日に Anthropic が公式に一時停止**した。一次ソース（公式サポート記事）冒頭に "pausing / nothing has changed" と明記。
- **現在、Agent SDK・`claude -p`・GitHub Actions・サブスク認証のサードパーティアプリは従来どおりサブスク枠から消費**。独立クレジットプールは未稼働。
- **緊急対応は不要**（claim 対象も未提供）。ただし**白紙ではなく再開の可能性**があるため、当初設計の理解と自動実行の棚卸しは有効。
- 当初設計の骨子: 月額クレジット **Pro $20 / Max 5x $100 / Max 20x $200**、ロールオーバーなし、ユーザー単位、claim 必須、超過は usage credits 次第（標準APIレート or 停止）。
- 最新の標準APIレート: **Opus 4.8 $5/$25・Sonnet 4.6 $3/$15・Haiku 4.5 $1/$5**（Batch は50%引き）。

同じ 6月15日に予定されていた **Sonnet 4 / Opus 4 のリタイア**は課金分離とは別問題です（→[Anthropic モデル廃止スケジュール & 移行ガイド](/blog/anthropic-model-deprecation-migration/)）。

---

## 参考資料

- [Use the Claude Agent SDK with your Claude plan — Anthropic Support（一次ソース・冒頭に "pausing" 告知）](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan)
- [Anthropic pauses Claude Agent SDK subscription change on day it was due to take effect — The New Stack](https://thenewstack.io/anthropic-pauses-claude-agent-sdk-subscription-change/)
- [Anthropic backs off unpopular billing overhaul as price war with OpenAI looms — The Decoder](https://the-decoder.com/anthropic-backs-off-unpopular-billing-overhaul-as-price-war-with-openai-looms/)
- [Anthropic API Pricing（公式）](https://www.anthropic.com/pricing)
- [Claude models overview / pricing（公式 docs）](https://platform.claude.com/docs/en/about-claude/models/overview)
- （初報・施行前提の解説。現在は古い点に注意）[The New Stack: Agent SDK credit pools](https://thenewstack.io/anthropic-agent-sdk-credits/) ／ [The Decoder: separate budgets for programmatic use](https://the-decoder.com/claude-subscriptions-get-separate-budgets-for-programmatic-use-billed-at-full-api-prices/)
