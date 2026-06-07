---
title: "Claude Code Review（GitHub PR 自動レビュー）完全ガイド — セットアップ・課金・REVIEW.md カスタマイズ"
date: 2026-06-07
category: "Claude技術解説"
tags: ["Claude Code", "Code Review", "GitHub", "PR", "自動レビュー", "マルチエージェント", "Team", "Enterprise", "DevOps"]
excerpt: "Anthropic の Code Review は、GitHub App 経由で PR に自動でインラインコメントを付けるマネージド・マルチエージェント製品（2026年3月9日ローンチ、Team/Enterprise 向け research preview）。手動の /code-review・/ultrareview とは別物。PR が開くと専門エージェント群が並列で diff とコードベースを分析し、ロジックエラー・脆弱性・境界条件・既存バグを 🔴🟡🟣 の重大度付きで指摘する。GitHub App のセットアップ手順、3つのレビューモード、課金（平均 $15–25/review・usage credits・spend cap）、REVIEW.md / CLAUDE.md によるカスタマイズ、/code-review・/ultrareview との違いまでを公式ドキュメント一次ソースで整理する。"
draft: false
---

> ## 要点
>
> - **Code Review** は、**GitHub App として常駐し、PR に自動でインラインコメント**を付けるマネージド製品（2026年3月9日ローンチ、**research preview**）。
> - 対象は **Team / Enterprise プランのみ**。**Zero Data Retention（ZDR）有効組織では利用不可**。
> - PR が開く（または毎push／手動コメント）と、**Anthropic インフラ上で専門エージェント群が並列起動**し、ロジックエラー・セキュリティ脆弱性・境界条件・既存バグなどを検査して**インラインコメント＋要約**を投稿。
> - 重大度は **🔴 Important / 🟡 Nit / 🟣 Pre-existing** の3段階。**PR を承認もブロックもしない**（チェックランは neutral）。
> - 課金は**トークンベースで平均 $15–25/review**。組織の **usage credits** から消費（プラン込みの枠は使わない）。
> - 手動の `/code-review`・`/ultrareview` とは**別製品**（自動性・常駐性・対象者・出力先・課金枠が異なる）。

## はじめに — 「AI が生成した大量の PR」を AI でレビューする

AI コーディングで PR の量が一気に増えた一方、人間のレビューが追いつかない——という詰まりを解くのが Anthropic の **Code Review** です。Claude Code には手動でレビューを呼ぶ `/code-review` や `/ultrareview` がありますが、本製品はそれらとは別物で、**GitHub に常駐し、PR が開くたびに自動でレビューコメントを付ける**マネージドサービスです。

本記事は公式ドキュメント・サポート記事を一次ソースに、セットアップ・モード・課金・カスタマイズ・他製品との違いを整理します。

> **混同注意**: ローカル CLI の `/code-review`（手動・単一パス）、クラウド深掘りの `/ultrareview`（= `/code-review ultra`、手動）と、本記事の **Code Review（自動・GitHub App・常駐）** は別物です。違いは §6 の比較表を参照してください。

---

## 1. 何ができるか（仕組み）

管理者が組織で有効化すると、レビューは **(a) PR オープン時 / (b) 毎push時 / (c) 手動リクエスト時** のいずれか（リポジトリ設定で決定）でトリガーされます。

レビュー実行時、**複数の専門エージェントが Anthropic のインフラ上で、diff と周辺コードを"フルコードベースの文脈"で並列分析**します。各エージェントは異なるクラスの問題を担当し、公式ドキュメントは検査対象として **ロジックエラー・セキュリティ脆弱性・壊れた境界条件・微妙なリグレッション（既存バグ）** を挙げています。

- 候補は各エージェントが**実際のコード挙動に照らして検証（verification）**し、誤検知を除去。その後**重複排除 → 重大度でランク付け**して投稿。
- 出力は**該当行へのインラインコメント＋レビュー本文の要約**。問題なしならチェックランを「issues なし」で更新。

### 重大度マーカー

| マーカー | 重大度 | 意味 |
|:---|:---|:---|
| 🔴 | **Important** | マージ前に直すべきバグ |
| 🟡 | **Nit** | 軽微。直す価値はあるがブロッカーではない |
| 🟣 | **Pre-existing** | この PR で導入されたのではない既存バグ |

各検出には「なぜ・どう検証したか」を示す展開可能な reasoning が付き、コメントには 👍/👎 が付いてワンクリックで評価できます（評価は PR マージ後に集計され reviewer のチューニングに使われ、**再レビューはトリガーしません**）。

- **PR を承認もブロックもしません**（チェックランは常に neutral で完了し、ブランチ保護を妨げない）。
- インラインコメントに返信しても Claude は反応しません。**修正して push する**のが正しい対処です。

> **公式の効果指標**（Anthropic ブログ）: 導入で「substantive なレビューコメントが付く PR」が 16% → 54% に。誤検知は検出の1%未満。大規模 PR（1,000行以上）は84%が検出あり（平均7.5件）、小規模 PR（50行未満）は31%（平均0.5件）。レビューは**平均20分**で完了（チェックラン自体は数分以内に出現）。

---

## 2. セットアップ手順（管理者）

Claude 組織の **admin 権限**と、GitHub 組織へ **App をインストールする権限**が必要です。

1. **Claude Code 管理設定を開く**: `claude.ai/admin-settings/claude-code`（Organization settings > Claude Code）の Code Review セクションへ。
2. **セットアップ開始**: 「Setup」（または「Configure」）をクリックし、GitHub App のインストールフローを開始。
3. **Claude GitHub App をインストール**: GitHub 組織にインストール。App が要求する権限は次の3つ（いずれも read and write）:
   - **Contents**: read and write
   - **Issues**: read and write
   - **Pull requests**: read and write
   - （Code Review 自体は Contents の read と Pull requests の write を使用。残りは後に GitHub Actions を使う場合に備えた広めの権限）
4. **リポジトリを選択**: Code Review を有効にするリポジトリを選ぶ（後から追加可）。表示されない場合は、App インストール時にそのリポジトリへアクセス権を与えたか確認。
5. **リポジトリごとにトリガーを設定**: リポジトリ一覧の **Review Behavior** ドロップダウンで挙動を選ぶ（§3）。

**動作確認**: テスト PR を開く。自動トリガーなら数分以内に **Claude Code Review** チェックランが出現。Manual 設定なら PR に `@claude review` をコメントして起動。出ない場合は admin 設定にリポジトリが載っているか・App がアクセス権を持つかを確認。

---

## 3. 3つのレビューモードと手動コマンド

| Review Behavior | 動作 | コスト傾向 |
|:---|:---|:---|
| **Once after PR creation** | PR がオープン／ready for review になった時に1回 | 中 |
| **After every push** | PR ブランチへの毎 push。PR の進化に追従し、修正済みスレッドを自動解決 | **最も高い**（レビュー数が最多） |
| **Manual** | `@claude review` / `@claude review once` をコメントした時のみ | 低（呼ぶまでゼロ） |

手動コマンド（どのモードでも有効）:

| コマンド | 動作 |
|:---|:---|
| `@claude review` | レビュー開始＋**以降の push でも自動レビューする購読を有効化** |
| `@claude review once` | **単発**レビュー（将来の push には購読しない） |

- コマンドは **PR のトップレベルコメント**として、コメント先頭に書く（diff 行のインラインでは不可）。
- リポジトリへの owner / member / collaborator アクセスが必要、PR はオープンであること。
- **自動トリガーは draft PR では走らない**が、**手動トリガーは draft でも走る**。
- 既にレビュー実行中なら、リクエストは完了までキューイングされる。

---

## 4. 課金

| 項目 | 内容 |
|:---|:---|
| 課金方式 | **トークン使用量ベース** |
| 1レビューの目安 | **平均 $15–25**（PR サイズ・コードベース複雑度・検証量でスケール） |
| 消費元 | 組織の **usage credits**（プラン込みの included usage は消費しない） |
| 請求先 | 他機能で Bedrock/Vertex を使っていても、**Code Review のコストは Anthropic の請求**に計上 |
| 支出上限 | `claude.ai/admin-settings/usage` の「Claude Code Review」で**月次 spend cap** を設定可。到達時は PR に「スキップした」旨を1件コメントし、次請求期間開始 or 上限引き上げで再開 |
| 可視化 | `claude.ai/analytics/code-review` のダッシュボード（レビュー数・週次コスト・フィードバック・リポジトリ別内訳） |

トリガー別のコスト感: **Once** = PR ごと1回 / **After every push** = push 数ぶん倍増 / **Manual** = 呼ぶまでゼロ。

---

## 5. REVIEW.md / CLAUDE.md でレビューを調整する

Code Review は**リポジトリ内の Markdown ファイル**を読んでレビュー挙動を調整します（YAML ではありません）。

- **`CLAUDE.md`**: プロジェクト共通指示。新たに導入された違反を **Nit レベル**で検出。ディレクトリ階層の各 `CLAUDE.md` を読む（サブディレクトリのルールはその配下のみ）。
- **`REVIEW.md`**（リポジトリルート）: **レビュー専用**指示。レビューパイプラインの**全エージェントのシステムプロンプトに最優先ブロックとしてそのまま注入**され、既定の指針を上書きする。`@` import 構文は展開されないため、ルールは直接書く。

`REVIEW.md` で調整できる代表項目: 🔴 Important の意味の再定義、Nit 件数の上限、スキップルール（生成コード・lockfile・vendored 依存など）、リポジトリ固有チェック、検証バー、サマリーの形。

公式ドキュメントの `REVIEW.md` サンプル:

```markdown
# Review instructions

## What Important means here

Reserve Important for findings that would break behavior, leak data,
or block a rollback: incorrect logic, unscoped database queries, PII
in logs or error messages, and migrations that aren't backward
compatible. Style, naming, and refactoring suggestions are Nit at
most.

## Cap the nits

Report at most five Nits per review. If you found more, say "plus N
similar items" in the summary instead of posting them inline.

## Do not report

- Anything CI already enforces: lint, formatting, type errors
- Generated files under `src/gen/` and any `*.lock` file
- Test-only code that intentionally violates production rules

## Always check

- New API routes have an integration test
- Log lines don't include email addresses, user IDs, or request bodies
- Database queries are scoped to the caller's tenant
```

### マージをゲートしたい場合（neutral チェックランの機械可読出力）

Code Review はマージをブロックしないため、CI でゲートしたい場合はチェックランの機械可読出力をパースします。

```bash
gh api repos/OWNER/REPO/check-runs/CHECK_RUN_ID \
  --jq '.output.text | split("bughunter-severity: ")[1] | split(" -->")[0] | fromjson'
# → {"normal": 2, "nit": 1, "pre_existing": 0} のような JSON（normal = Important 件数）
```

---

## 6. `/code-review`・`/ultrareview` との違い

3つは別物です。中身（並列マルチエージェント＋検証）は似ても、**自動性・常駐性・対象者・出力先・課金枠**が決定的に異なります。

| 観点 | **Code Review**（本製品・GitHub App） | `/code-review`（ローカル CLI） | `/ultrareview`（= `/code-review ultra`） |
|:---|:---|:---|:---|
| 種別 | マネージド GitHub App（**常駐・自動**） | CLI の手動コマンド | CLI の手動コマンド（クラウド実行） |
| 呼び出し | PR open / 毎 push / `@claude review` | セッションで `/code-review` | `/code-review ultra` / `claude ultrareview` |
| 実行場所 | Anthropic インフラ（並列） | **ローカルセッション内**（単一パス） | クラウドの remote sandbox |
| 常駐性 | **常駐・自動** | 都度手動 | 都度手動 |
| 出力 | PR にインラインコメント＋チェックラン | ターミナル（`--comment` で PR、`--fix` で作業ツリー適用） | セッションに検証済み検出（`--fix` 可） |
| 所要時間 | 平均20分 | 数秒〜数分 | 約5〜10分 |
| 課金 | トークン課金・平均 $15–25・**usage credits** | 通常の利用枠 | 無料枠後 約 $5–20・usage credits |
| 対象 | **Team / Enterprise のみ** | 全プラン | Pro/Max/Team/Enterprise |
| ZDR | **不可** | 制限記載なし | 不可 |

> 補足: ローカル `/code-review` は v2.1.147 で `/simplify` から改名され、v2.1.154 以降は `/simplify`（クリーンアップ専用）と分離されています。バグ探索目的なら `/code-review --fix` を使います。詳しくは [/ultrareview 完全ガイド](/blog/claude-code-ultrareview-guide/) を参照。

---

## 7. 制約・注意点

| 項目 | 内容 |
|:---|:---|
| 対象プラン | **Team / Enterprise のみ**（Pro/Max/個人は対象外）。research preview（仕様・価格変更あり） |
| ZDR | **Zero Data Retention 有効組織では利用不可** |
| 対応 VCS | **GitHub（github.com）のみ**。セルフホストは GitHub Enterprise Server 連携が別途必要 |
| プライバシー | コードは **Anthropic のクラウドで処理**される（フルコードベース文脈で分析するマネージドサービス） |
| 既定の重点 | **correctness（正しさ）重視**。フォーマット嗜好やテストカバレッジ不足は既定では対象外（`REVIEW.md` で拡張可） |
| 失敗時 | best-effort で**自動リトライしない**。エラー/タイムアウト時は `@claude review once` で再実行（GitHub の Re-run ボタンは効かない）か新規 push |
| 対応言語 | 公式ドキュメントに**明示的な対応言語リストはなし**（フルコードベース文脈で動く汎用記述のみ） |

---

## まとめ

- **Code Review** は GitHub に常駐し、PR に自動でインラインコメントを付けるマネージド・マルチエージェント製品（2026年3月9日、Team/Enterprise の research preview）。
- セットアップは **GitHub App インストール（Contents/Issues/PRs の read+write）＋ admin の組織設定**。トリガーは **Once / Every push / Manual** の3モード。
- 検出は **🔴 Important / 🟡 Nit / 🟣 Pre-existing** で、**PR は承認もブロックもしない**（ゲートは check-run の機械可読出力を CI でパース）。
- 課金は**平均 $15–25/review・usage credits**（included 枠外）、**spend cap** と analytics で統制。
- `REVIEW.md` / `CLAUDE.md` でレビュー指針をカスタマイズできる。
- 手動の `/code-review`・`/ultrareview` とは**別製品**（§6）。**ZDR 組織・GitHub 以外は非対応**。

---

## 参考資料

- [Code Review for Claude Code — Anthropic 公式ブログ（2026-03-09・一次）](https://claude.com/blog/code-review)
- [Code Review — Claude Code 公式ドキュメント（一次）](https://code.claude.com/docs/en/code-review)
- [Set up Code Review for Claude Code — Anthropic Support（一次）](https://support.claude.com/en/articles/14233555-set-up-code-review-for-claude-code)
- [Find bugs with ultrareview — Claude Code 公式ドキュメント](https://code.claude.com/docs/en/ultrareview)
- [Anthropic launches a multi-agent code review tool — The New Stack](https://thenewstack.io/anthropic-launches-a-multi-agent-code-review-tool-for-claude-code/)
