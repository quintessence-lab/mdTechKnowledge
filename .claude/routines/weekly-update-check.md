# weekly-update-check — Routine 設計書

このファイルは Claude Code Routine「**mdKnowledge更新候補チェック**」の **メイン設計書** です。Routine起動時にClaudeが本ファイルを読み、記載された手順に従って実行します。

> このRoutineの責務は **検出と起票のみ**。既存記事の更新・handoff rev 更新・Gist 同期・記事の新規作成は行いません（すべてローカル端末の `mdknowledge-update` スキルで人手実施）。本Routineは候補を `[mdKnowledge更新候補]` Issue として起票するところまでが範囲です。

## 2026-06-13 改訂 — handoff repo 非依存化（重要）

旧版は Step 1 で private な `mdtechknowledge-handoff` を `git clone` し、`scripts/update_hashes.py --list-articles` で記事メタを取得していた。しかし private repo の**未認証 clone は 404（"repository does not exist"）**になり、cron / headless 実行ではサンドボックスの git 認証が無いと失敗する（=検出Issueが作られなくなる）。

`--list-articles` が実際に読むのは **public な `mdTechKnowledge` のフロントマター**であり、handoff-files.md は不要。そこで本Routineは **handoff repo を clone も参照もしません**。public repo のみを clone し、フロントマターは下記の内蔵パーサで取得します。

---

## 起動時の手順

### Step 1: 既存記事のメタ情報取得（public repo のみ・handoff不要）

**public な `mdTechKnowledge` だけ** を clone し、`src/content/blog/*.md` のフロントマターを直接パースして一覧化します。**個別記事の本文は Read しない**（フロントマターのみで判定。トークン節約）。

```bash
git clone --depth 1 https://github.com/quintessence-lab/mdTechKnowledge /tmp/mdTechKnowledge

# フロントマターのみを抽出（update_hashes.py --list-articles 相当を内蔵化）
python - <<'PY'
import os, re, json
BLOG = "/tmp/mdTechKnowledge/src/content/blog"
CATS = {"Claude技術解説", "その他技術", "一般リサーチ"}  # 対象3カテゴリ
def field(fm, key):
    m = re.search(rf'^{key}:\s*"?(.*?)"?\s*$', fm, re.M)
    return m.group(1) if m else ""
rows = []
for fn in sorted(os.listdir(BLOG)):
    if not fn.endswith(".md"):
        continue
    txt = open(os.path.join(BLOG, fn), encoding="utf-8").read()
    m = re.match(r"^---\n(.*?)\n---", txt, re.S)
    if not m:
        continue
    fm = m.group(1)
    cat = field(fm, "category")
    if cat not in CATS:
        continue
    rows.append({
        "filename": fn, "title": field(fm, "title"), "category": cat,
        "date": field(fm, "date"), "updatedDate": field(fm, "updatedDate"),
        "excerpt": field(fm, "excerpt")[:160],
    })
print(json.dumps(rows, ensure_ascii=False, indent=1))
PY
```

> **重要**: 出力JSON（filename / title / category / date / updatedDate / excerpt）だけで「どの記事が存在し、いつ更新されたか」を把握でき、個別記事を Read する必要はありません。**private な handoff repo は clone しない**（cron で失敗するため）。

### Step 2: ウェブ検索で最新動向収集

直近1週間の以下を WebSearch で巡回:

- Claude / Anthropic 関連リリースノート（公式 Newsroom、`platform.claude.com/docs/en/release-notes`、Releasebot 等）
- Claude Code CHANGELOG（`raw.githubusercontent.com/anthropics/claude-code/main/CHANGELOG.md`）・新バージョン
- MCP（Model Context Protocol）関連動向
- Anthropic API・Admin API 新機能
- 主要メディア（TechCrunch、The Register、VentureBeat、Simon Willison 等）の関連報道

> Wikipedia はソースに使わない。一次ソース（公式 CHANGELOG / release-notes / Anthropic 公式）を優先。

### Step 3: 既存記事 vs 最新情報の比較・判定

Step 1 の一覧と Step 2 の検索結果を突き合わせ:

- **更新候補**: 既存記事の内容が古い / 重要な追加情報がある（該当 filename を特定）
- **新規候補**: 既存記事ではカバーできない新トピック

### Step 4: Issue 起票（候補がある場合のみ）

`quintessence-lab/mdTechKnowledge` に **Issue を1件** 起票（GitHub MCP または `gh`）。**候補がなければ何もせず終了**（空Issueを作らない）。

```
タイトル: [mdKnowledge更新候補] {YYYY-MM-DD}
ラベル: mdknowledge-update
```

#### 日付ルール（重要）

タイトル・本文の `{YYYY-MM-DD}` は **日本時間（JST、UTC+9）でのRoutine実行日**。サンドボックス既定は UTC なので明示変換すること（しないと前日にずれる）。

```bash
JST_DATE=$(python -c "from datetime import datetime, timezone, timedelta; print(datetime.now(timezone(timedelta(hours=9))).strftime('%Y-%m-%d'))")
# または: JST_DATE=$(TZ=Asia/Tokyo date +%Y-%m-%d)
```

本文でソースの発生日に言及する際も、PT/ET を JST に換算した日付を併記（例: `2026-06-09 (PT) → 2026-06-10 (JST)`）。

#### 本文フォーマット

```markdown
## 更新が必要な既存記事

- **<記事タイトル>** (`<filename>.md`): <更新理由・追加すべき内容>
  - <ソースURL1>

## 新規記事候補

- **<トピック名>**: <記事化すべき理由・要点>
  - <ソースURL>

## 検索で確認した主な情報源

- <URL一覧>
```

> 起票後の処理（記事更新・handoff rev・Gist・close）は **ローカル端末の `mdknowledge-update` スキル**が担当する。本Routineは起票で完了。

## 対象カテゴリ

Anthropic / Claude / MCP 関連の動向は3カテゴリに分散。漏らさないこと:

- **Claude技術解説** — Claude Code・Cowork・Routines・Managed Agents・モデル解説 等
- **その他技術** — MCP関連・Excel/PowerPointアドイン・脆弱性レポート・credentials 等
- **一般リサーチ** — 資本調達・コンピュートインフラ・パートナーシップ 等

## トークン節約の前提

- **private handoff repo は clone も参照もしない**（cron 失敗の元凶。Step 1 の内蔵パーサで代替）
- 記事本体の Read は最小限（Step 1 のフロントマター一覧で判定できる範囲は Read しない）
- WebFetch は1記事候補につき最大3件
