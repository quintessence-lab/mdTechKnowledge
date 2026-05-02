# weekly-update-check — Routine 設計書

このファイルは Claude Code Routine「**mdKnowledge更新候補チェック**」の **メイン設計書** です。Routine起動時にClaudeが本ファイルを読み、記載された手順に従って実行します。

## 起動時の手順

### Step 1: 既存記事のメタ情報取得（軽量）

両リポジトリを clone した上で、**`scripts/update_hashes.py --list-articles`** を呼び、関連カテゴリの記事フロントマターを一括取得します。

```bash
# clone（mdtechknowledge-handoff にスクリプトがある）
git clone https://github.com/quintessence-lab/mdTechKnowledge /tmp/mdTechKnowledge
git clone https://github.com/quintessence-lab/mdtechknowledge-handoff /tmp/mdtechknowledge-handoff

export HANDOFF_REPO=/tmp/mdtechknowledge-handoff
export SITE_REPO=/tmp/mdTechKnowledge

# 関連3カテゴリの記事メタ情報を取得（直近30日に更新があった記事のみ）
python /tmp/mdtechknowledge-handoff/scripts/update_hashes.py --list-articles \
  --category "Claude技術解説,その他技術,一般リサーチ" \
  --recent-days 30
```

**重要**: 個別記事を Read で読み込んではいけません。`--list-articles` の JSON 出力（filename / title / category / date / updatedDate / excerpt）だけで判定可能です。これによりトークン消費が大幅に節約されます。

### Step 2: ウェブ検索で最新動向収集

直近1週間の以下を WebSearch で巡回:

- Claude / Anthropic 関連リリースノート（公式 Newsroom、Releasebot等）
- Claude Code CHANGELOG・新バージョン
- MCP（Model Context Protocol）関連動向
- Anthropic API・Admin API 新機能
- 主要メディア（TechCrunch、The Register、VentureBeat、SimonWillison等）の関連報道

### Step 3: 既存記事 vs 最新情報の比較・判定

Step 1 の `--list-articles` 出力と Step 2 の検索結果を突き合わせ、以下を判定:

- **更新候補**: 既存記事の内容が古くなっている / 重要な追加情報がある
- **新規候補**: 既存記事ではカバーできない新トピック

### Step 4: Issue 起票（候補がある場合のみ）

`quintessence-lab/mdTechKnowledge` リポジトリに **Issue を1件** 起票します。**候補がない場合は何もせず終了**してください（空Issueを作らない）。

```
タイトル: [mdKnowledge更新候補] {YYYY-MM-DD}
ラベル: mdknowledge-update
```

#### 日付ルール（重要）

タイトルおよび本文中の `{YYYY-MM-DD}` は **日本時間（JST、UTC+9）でのRoutine実行日** を使用してください。Routineサンドボックスの既定タイムゾーンはUTCのため、明示的にJSTへ変換する必要があります（変換しないと日付が前日にずれます）。

JST日付の取得方法（いずれかを必ず実行してから本文を組み立てる）:

```bash
# Python（推奨・OS非依存）
JST_DATE=$(python -c "from datetime import datetime, timezone, timedelta; print(datetime.now(timezone(timedelta(hours=9))).strftime('%Y-%m-%d'))")

# GNU date（Linuxサンドボックス）
JST_DATE=$(TZ=Asia/Tokyo date +%Y-%m-%d)

echo "Issue日付: $JST_DATE"
```

本文中で記事のリリース日・最新動向の発生日に言及する場合も、ソース側のタイムゾーン情報（多くは米国時間 PT/ET）を **JSTに換算した日付** を併記してください。例: `2026-04-29 (PT) → 2026-04-30 (JST)`。

#### 本文フォーマット

```markdown
## 更新が必要な既存記事

- **<記事タイトル>** (`<filename>.md`): <更新理由・追加すべき内容>
  - <ソースURL1>
  - <ソースURL2>

## 新規記事候補

- **<トピック名>**: <記事化すべき理由・要点>
  - <ソースURL>

## 検索で確認した主な情報源

- <URL一覧>
```

## 対象カテゴリの拡張

Anthropic / Claude / MCP 関連の動向は以下3カテゴリにわたって既存記事に分散しています。チェック対象から漏らさないでください:

- **Claude技術解説** — Claude Code・Cowork・Routines・Managed Agents・モデル解説等
- **その他技術** — MCP関連・Excel/PowerPointアドイン・脆弱性レポート・credentials等
- **一般リサーチ** — 資本調達・コンピュートインフラ・パートナーシップ等

## トークン節約の前提

- handoff-files.md の Read は **禁止**（必要なら `update_hashes.py --get` を使用）
- 記事本体の Read は最小限（`--list-articles` の出力で判定できる範囲は Read しない）
- WebFetch は1記事候補につき最大3件
