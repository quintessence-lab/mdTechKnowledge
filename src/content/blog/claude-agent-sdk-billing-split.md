---
title: "【2026-06-15施行】Claude Agent SDK / claude -p 課金分離ガイド — サブスク枠から独立クレジットプールへ"
date: 2026-06-06
category: "Claude技術解説"
tags: ["Claude", "Anthropic", "Agent SDK", "claude -p", "課金", "クレジットプール", "Claude Code", "GitHub Actions", "料金"]
excerpt: "2026年6月15日、Anthropic は Agent SDK・claude -p（headless）・Claude Code GitHub Actions・サブスク認証のサードパーティ製アプリを、サブスクリプション共有枠から独立した『Agent SDK クレジットプール』（API標準レート課金）へ分離する。対象/対象外の切り分け、プラン別クレジット（Pro $20／Max 5x $100／Max 20x $200 ほか）、ロールオーバーなし、超過時の挙動、一回限りのオプトイン（claim）必須、そして移行に向けた棚卸し手順までを公式ヘルプセンター記事（一次ソース）ベースで整理する。"
draft: false
---

> ## ⚠️ 要点（先に結論）
>
> - **2026年6月15日**、Agent SDK・`claude -p`（headless）・Claude Code GitHub Actions・サブスク認証のサードパーティ製アプリが、**サブスクリプションの共有枠から切り離され、独立した「Agent SDK クレジットプール」（API標準レート課金）へ移行**します。
> - **対話的に使う Claude Code（端末/IDE）・Claude.ai チャット・Claude Cowork は対象外**（従来どおりサブスク内）。
> - プラン別の月額クレジットは **Pro $20 / Max 5x $100 / Max 20x $200**（プラン月額と同額）。**ロールオーバーなし**、**ユーザー単位**（チームでのプール・共有不可）。
> - **一回限りのオプトイン（claim）が必要**。6月8日にAnthropicからクレジット請求の案内メールが届き、アカウントから一度claimすれば以降は毎サイクル自動更新。**claimしないとプログラム利用枠は付与されません**。
> - 月額クレジット枯渇後は、**「usage credits（追加課金）」を有効にしていれば標準APIレートで継続課金／無効ならリクエスト停止**（次サイクルまで）。
>
> 一次ソース: [Use the Claude Agent SDK with your Claude plan — Anthropic Support](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan)

## はじめに

2026年6月15日は、Claude を「自動で動かしている」開発者にとって**課金体系の節目**です。これまで Pro / Max などのサブスクリプションでは、対話的に使う Claude Code も、`claude -p` で CI に組み込んだ自動実行も、Agent SDK で常時稼働させているバッチも、**同じサブスクリプション枠**から賄われていました。6月15日以降は、このうち**「プログラム的（エージェント的）に動かす利用」だけが分離**され、独立したクレジットプール（API 従量レート課金）に移ります。

紛らわしいのは、**同じ 6月15日に「Sonnet 4 / Opus 4 のリタイア」も重なる**ことです（モデルID廃止については[別記事](/blog/anthropic-model-deprecation-migration/)を参照）。モデル移行の作業に追われている間に課金の仕組みまで変わるため、両方を切り分けて把握しておく必要があります。

本記事は、Anthropic公式ヘルプセンター記事を一次ソースとして、**何が変わるのか・いくら払うのか・何をすべきか**を整理します。

> **日付・タイムゾーンについての注記**: 公式記事および各報道とも施行日を「June 15, 2026」と記載していますが、**具体的なタイムゾーン（PT 等）は明記されていません**。本記事では「2026年6月15日」とし、JST環境では余裕をもって対応することを推奨します。なお「6月8日にクレジット請求（claim）の案内メールが届く」と複数ソースが伝えています。

---

## 1. 何が変わるのか（全体像）

これまで「サブスクリプションひとつ」で賄われていた利用が、**2つの枠**に分かれます。

| 枠 | 内容 | 課金 |
|:---|:---|:---|
| **サブスクリプション枠**（従来どおり） | 対話的な利用 | Pro / Max などの月額に含まれる |
| **Agent SDK クレジットプール**（新設） | プログラム的・エージェント的な利用 | 月額クレジット → 超過分は**標準APIレート** |

ポイントは、**「人が対話しながら使う」か「自動で動かす」か**で線引きされることです。手元の端末で対話しながら Claude Code を使う分には影響しませんが、CI/CD や GitHub Actions、常駐エージェントとして回している分は新しいクレジットプールを消費します。

---

## 2. 対象となる利用形態（独立クレジットプールへ移行）

公式記事が逐語的に挙げているのは次の4種類です。

| 対象 | 説明 |
|:---|:---|
| **Claude Agent SDK** | 自前プロジェクトでの SDK 利用（Python / TypeScript） |
| **`claude -p`（非対話モード / headless）** | Claude Code を非対話で実行するモード（CI・スクリプト組み込み） |
| **Claude Code GitHub Actions** | GitHub Actions インテグレーション（自動PRレビュー・自動コード生成など） |
| **サードパーティ製アプリ** | Claude サブスク認証で動く外部エージェント製品（報道では OpenClaw・Conductor・Zed・Jean などが具体例として挙がる） |

---

## 3. 対象外（従来どおりサブスク枠内）

逆に、以下は**これまでどおりサブスクリプションに含まれ、影響を受けません**。

| 対象外 | 説明 |
|:---|:---|
| **対話型 Claude Code** | 端末 / IDE で対話しながら使う通常の Claude Code |
| **Claude.ai チャット** | Web / デスクトップ / モバイルのチャット |
| **Claude Cowork** | Cowork での利用 |

> つまり「自分で打ち込みながら使う」用途は据え置き、「自動で回す」用途だけがクレジット制に移る、という整理です。

---

## 4. プラン別の月額 Agent SDK クレジット

各プランには、**プラン月額と同額**のAgent SDK クレジットが付与されます（公式記事の表に基づく）。

| プラン | 月額クレジット |
|:---|:---|
| **Pro** | **$20** |
| **Max 5x** | **$100** |
| **Max 20x** | **$200** |
| Team（Standard） | $20 / シート |
| Team（Premium） | $100 / シート |
| Enterprise（usage-based） | $20 / ユーザー |
| Enterprise（seat-based Premium） | $200 / シート |

- クレジットは**ユーザー単位**で付与され、**チーム内でプール・共有することはできません**（"cannot be pooled or shared across a team"）。
- Team / Enterprise の細目（特に Enterprise Standard の seat-based 枠）は報道間で記述に差があり（一部は $0 とする）、**自組織の正確な扱いは公式案内での確認を推奨**します。

---

## 5. ロールオーバー（繰り越し）と超過時の挙動

### ロールオーバーはなし

未使用クレジットは**翌請求サイクルへ繰り越されません**（"Unused credits don't roll over to the next billing cycle."）。各サイクルでリセットされるため、「軽い月に余った分を重い月に回す」ことはできません。

### 月額クレジットを使い切ったら

枯渇後の挙動は、**「usage credits（追加課金 / overflow billing）」を有効にしているか**で分岐します。

| usage credits 設定 | 枯渇後の挙動 |
|:---|:---|
| **有効** | 追加のAgent SDK利用は継続し、**標準APIレートで課金**される |
| **無効（デフォルト）** | Agent SDK リクエストは**次サイクルのクレジット補充まで停止（reject）**。キューイングも安価モデルへの自動フォールバックもなし |

> 公式記事原文（要旨）: 月額クレジットが尽きると、usage credits を有効にしている場合のみ標準APIレートで追加利用が流れる。有効化していなければ、Agent SDK リクエストはクレジットが補充されるまで停止する。
>
> **運用判断**: CI を止めたくないなら usage credits を**ON**（ただしコストは青天井になりうる）、コスト暴走を防ぎたいなら**OFF**（ただし枠を超えると自動処理が止まる）。どちらを選ぶかを 6/15 前に決めておく必要があります。

---

## 6. オプトイン（claim）は必須

ここが最も誤解されやすい点です。**移行自体は全ユーザーに自動で適用されますが、クレジットの受け取りには「一回限りのオプトイン（claim）」が必要**です。

- 公式記事原文（要旨）: クレジットは Claude アカウントから**一度だけ claim**する。claim 後は毎サイクル自動更新される（"One-time opt-in. You claim your credit through your Claude account once. After that, it refreshes automatically each cycle."）。
- 複数の解説記事が「**6月8日に届く案内メール**からクレジットを claim する」と伝えています。
- **claim しないと、プログラム利用枠（Agent SDK クレジット）は付与されません**。CI パイプラインの担当者・チームへの周知が必要です。

> 一部の報道は「自動適用」と読める表現を使っていますが、これは「対象の切り分け（surface の分離）は全員自動で起きる」点と「クレジットは claim が必要」点を混同したものです。**一次ソースは明確に "one-time opt-in（claim 必須）" と述べています。**

---

## 7. 課金レート（単価）

クレジット消費・超過分とも、**標準APIリストレート（standard API list rates）**で計算されます。プラン固有の割引ではなく、**API 従量課金の単価**が適用される点に注意してください。

- **per-token の具体額は公式ヘルプセンター記事には記載がありません**（Anthropic の API pricing ページを参照）。
- 参考までに、解説記事（二次ソース）が挙げるモデル別単価の目安は以下（100万トークンあたり・入力/出力、**要・公式裏取り**）:

| モデル | 入力 | 出力 |
|:---|:---|:---|
| Haiku 4.5 | $1 | $5 |
| Sonnet 4.6 | $3 | $15 |
| Opus 4.7 | $5 | $25 |

> 上表は二次ソース由来の参考値です。実際の請求は契約時点の[公式 API 料金](https://www.anthropic.com/pricing)で確認してください。

---

## 8. 影響を受けやすい運用と具体例

次のような「自動で回している」運用は、6/15 以降クレジットを消費します。

- **CI/CD パイプラインで `claude -p` を常時実行**しているチーム
- **GitHub Actions による自動PRレビュー / 自動コード生成**
- **常時稼働の Agent SDK バッチ / スケジュール実行のエージェント**
- **サードパーティのエージェント製品**（Zed・Conductor 等）をサブスク認証で利用

逆に、手元で対話しながら Claude Code を使う・Claude.ai でチャットする・Cowork を使う、といった用途は影響を受けません。

> 重い自動化利用者ほど実効的な負担増が大きくなります（解説記事の中にはワークロード次第で大幅な実効値上げになると試算するものもありますが、これらは個人の試算であり前提条件に依存します）。**まずは自分の「自動実行のトークン消費量」を把握すること**が出発点です。

---

## 9. 6/15 までにやるべきこと（チェックリスト）

1. **棚卸し**: `claude -p` / Agent SDK / GitHub Actions で動かしている処理を洗い出し、月間トークン消費を**APIレート換算**で試算する。
2. **クレジットを claim**: 6月8日の案内メール（または Claude アカウント）から、一回限りのオプトインを済ませる。**チームメンバー全員に周知**。
3. **usage credits の ON/OFF を決める**: CI を止めたくない → ON（コスト上限の監視も設定）。コスト暴走を防ぎたい → OFF（枠超過で自動処理が止まる前提で運用）。
4. **プラン見直し / API直契約の検討**: 自動化のボリュームが大きいなら、プラン階層の見直しや Anthropic API の直接契約のほうが合理的な場合がある。
5. **対話運用への切替検討**: 自動化の一部を対話型 Claude Code（対象外枠）に寄せられないか検討する。
6. **コスト最適化**: モデルルーティング（定型処理は Haiku、複雑処理のみ Sonnet/Opus）、プロンプトキャッシュ、コンテキスト削減でトークンを抑える。

---

## 10. よくある誤解の整理

| 誤解 | 正しい理解 |
|:---|:---|
| 「対話型 Claude Code も有料クレジットになる」 | ❌ 対話型（端末/IDE）・チャット・Cowork は**対象外** |
| 「自動で移行されるから何もしなくていい」 | ❌ 移行は自動だが、**クレジットの claim（オプトイン）は必須** |
| 「余ったクレジットは翌月に繰り越せる」 | ❌ **ロールオーバーなし** |
| 「枠を超えたら勝手に課金される」 | △ usage credits を**有効にしている場合のみ**。無効ならリクエストは**停止** |
| 「チームでクレジットを共有できる」 | ❌ **ユーザー単位**でプール・共有不可 |

---

## まとめ

- **2026年6月15日**、Agent SDK・`claude -p`・GitHub Actions・サブスク認証のサードパーティアプリが、**独立した Agent SDK クレジットプール（API標準レート課金）へ分離**。
- 月額クレジットは **Pro $20 / Max 5x $100 / Max 20x $200**（プラン月額と同額）、**ロールオーバーなし**、**ユーザー単位**。
- **一回限りのオプトイン（claim）が必須**。6月8日の案内メールから受け取る。**claim しないと枠が付与されない**。
- 枠枯渇後は **usage credits 有効＝標準APIレートで継続 / 無効＝停止**。
- **対話型 Claude Code・チャット・Cowork は対象外**。
- まずは**自動実行の棚卸し**と**クレジットの claim**を 6/15 前に。

同日に **Sonnet 4 / Opus 4 のリタイア**も重なります。モデル移行と課金分離は別問題なので、両方を切り分けて準備してください（→[Anthropic モデル廃止スケジュール & 移行ガイド](/blog/anthropic-model-deprecation-migration/)）。

---

## 参考資料

- [Use the Claude Agent SDK with your Claude plan — Anthropic Support（一次ソース）](https://support.claude.com/en/articles/15036540-use-the-claude-agent-sdk-with-your-claude-plan)
- [Anthropic ends subscription subsidy for agents (June 15) — TechTimes](https://www.techtimes.com/articles/317625/20260602/anthropic-ends-subscription-subsidy-agents-june-15-credit-pool-replaces-flat-rate-access.htm)
- [Anthropic splits billing: Agent SDK credit pools — The New Stack](https://thenewstack.io/anthropic-agent-sdk-credits/)
- [Claude Code pricing after June 15 — decision table（FindSkill）](https://findskill.ai/blog/claude-code-pricing-after-june-15-decision-table/)
- [Anthropic Claude Agent SDK billing split — developer guide（ChatForest）](https://chatforest.com/reviews/anthropic-claude-agent-sdk-billing-split-june-15-2026-credit-pool-developer-guide/)
- [Anthropic June 2026 billing change for Claude Code（Codersera）](https://codersera.com/blog/anthropic-june-2026-billing-change-claude-code/)
- [Claude subscriptions get separate budgets for programmatic use, billed at full API prices（The Decoder・初報）](https://the-decoder.com/claude-subscriptions-get-separate-budgets-for-programmatic-use-billed-at-full-api-prices/)
- [Anthropic Claude credit overhaul (June 15, 2026)（Digital Applied）](https://www.digitalapplied.com/blog/anthropic-claude-credit-overhaul-june-15-2026)
- [Anthropic splits Claude subscriptions: Agent SDK credit (June 2026)（DevToolPicks）](https://devtoolpicks.com/blog/anthropic-splits-claude-subscriptions-agent-sdk-credit-june-2026)
- [Anthropic API Pricing（公式）](https://www.anthropic.com/pricing)
