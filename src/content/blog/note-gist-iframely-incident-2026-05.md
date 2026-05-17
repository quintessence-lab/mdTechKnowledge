---
title: "note.com の GitHub Gist 埋め込み不具合 — iframely 配信ドメイン切替が原因（2026-05-17観測）"
date: 2026-05-17
category: "障害事例・原因分析"
tags: ["note.com", "iframely", "GitHub Gist", "埋め込み", "障害事例", "ポストモーテム", "原因分析"]
excerpt: "2026年5月17日に観測した『note.com 上で GitHub Gist の埋め込みが新規記事および編集後の記事で表示されない』事象の原因分析記事。note の iframely 配信ドメインが cdn.iframe.ly（有料CDN）から iframely.net（無料エンドポイント）へ切り替わったことが原因と特定。既存記事の embed cache 挙動、エンドユーザーから見たレンダリングパス、当面の運用回避策まで整理。"
draft: false
---

> **本記事の位置づけ**: カテゴリ「障害事例・原因分析」初出。実運用で踏んだ不具合について、観測事実 → 切り分けプロセス → 原因確定 → 当面の運用判断、までを再現可能な形で残すシリーズです。同種の事象に遭遇したエンジニア向けの一次資料を目的とします。

## TL;DR

- 2026-05-17 以降に **note.com で新規公開・編集再公開された記事** において、GitHub Gist 埋め込み(`https://gist.github.com/...`) が空表示になる事象を観測。
- 原因は **note の iframely 配信ドメイン切替**: `cdn.iframe.ly`（有料 White-label CDN）から `iframely.net`（無料/公開エンドポイント）への移行と推定。
- **既存記事の埋め込み HTML は note の DB に publish 時点で保存**されており、それが `cdn.iframe.ly/<token>` を含む限り表示は維持される。
- 一度でも記事を編集して再保存すると、`iframely.net/<新token>` で書き換えられ表示が失われる。**当面、過去記事の embed には触らないことが安全策**。

---

## 観測事実

### 1. 不具合症状

新規公開した記事（例: `https://note.com/mdtechknowledge/n/n951a187ce586`）に貼り付けた以下の Gist URL がプレースホルダ箱のまま中身が描画されない:

```
https://gist.github.com/quintessence-lab/94fdae46fdfc29935ef45854877ffeaa
```

- ブラウザ直接訪問では Gist 本体は **MD テーブルが正しく描画される**（GitHub 側は健全）
- `gist.github.com/<id>.js` の embed JS 直叩きも有効な `document.write()` HTML を返す
- それでも note 上の埋め込み箱では描画されない

### 2. 過去記事との比較

| 記事 | publish 時期 | iframely ドメイン出現数 | note表示 |
|---|---|---|:---:|
| 源内アーキテクチャ詳解 | 5/9 | `cdn.iframe.ly` × 79 | ✅ |
| Claude iOS vs Web 価格比較 (MD-only gist) | 5/上旬 | `cdn.iframe.ly` × 49 | ✅ |
| Claude iOS vs Web (csv+md dual) | 5/5 | `cdn.iframe.ly` × 25 | ✅ |
| **Claude Code サブエージェント (5/17 publish)** | **5/17** | **`iframely.net` × 23** | ❌ |

publish 日付と iframely ドメインの相関が明確に出ています。

### 3. 同じ記事の HTML 構造比較

過去記事と新規記事で `<figure>` 構造そのものは同一でした。

```html
<!-- 過去 -->
<figure embedded-service="gist">
  <a data-iframely-url="//cdn.iframe.ly/tmL2Z5te"></a>
  <script async src="//cdn.iframe.ly/embed.js"></script>
</figure>

<!-- 今日 -->
<figure embedded-service="gist">
  <a data-iframely-url="//iframely.net/HFNtWLC0"></a>
  <script async src="//iframely.net/embed.js"></script>
</figure>
```

`embed.js` 本体はバイト単位で同サイズ (24,665 byte) — 配信ドメインだけが差分です。

---

## エンドユーザーから見たレンダリングパス（過去：成功）

```
┌─ ① ブラウザ ─────────────────────────────────────────────────────────┐
│  note記事HTMLを取得                                                   │
│  ─ <figure embedded-service="gist">                                  │
│      <a data-iframely-url="//cdn.iframe.ly/tmL2Z5te"></a>            │
│      <script src="//cdn.iframe.ly/embed.js"></script>                │
│    </figure>                                                          │
└─────────────────────────────┬────────────────────────────────────────┘
                              │ JS実行
┌─ ② iframely embed.js ────────▼───────────────────────────────────────┐
│  <a data-iframely-url> を検出し <iframe src="..."> に書換             │
└─────────────────────────────┬────────────────────────────────────────┘
                              │ iframe読込
┌─ ③ cdn.iframe.ly（note契約の有料CDN）▼ ──────────────────────────────┐
│  /tmL2Z5te → 埋め込み用HTMLを返す                                     │
│  HTMLは <script src="https://gist.github.com/<id>.js"> を内包         │
└─────────────────────────────┬────────────────────────────────────────┘
                              │ gist.js実行
┌─ ④ GitHub gist.js ──────────▼───────────────────────────────────────┐
│  document.write() でテーブルHTMLを iframe 内に注入                     │
│  ─ ユーザーに **整形された表** が表示される ✅                          │
└──────────────────────────────────────────────────────────────────────┘
```

---

## エンドユーザーから見たレンダリングパス（今日：失敗）

```
┌─ ① ブラウザ ─────────────────────────────────────────────────────────┐
│  note記事HTMLを取得                                                   │
│  ─ <figure embedded-service="gist">                                  │
│      <a data-iframely-url="//iframely.net/HFNtWLC0"></a>             │
│      <script src="//iframely.net/embed.js"></script>                 │
│    </figure>                                                          │
└─────────────────────────────┬────────────────────────────────────────┘
                              │ JS実行
┌─ ② iframely embed.js ────────▼───────────────────────────────────────┐
│  同じ仕組みで <iframe src="//iframely.net/HFNtWLC0"> を生成            │
└─────────────────────────────┬────────────────────────────────────────┘
                              │ iframe読込
┌─ ③ iframely.net（無料/公開エンドポイント）▼ ─────────────────────────┐
│  HTMLは同じ構造を返す（script src=...gist.js が入っている）            │
└─────────────────────────────┬────────────────────────────────────────┘
                              │ gist.js実行を試みる
┌─ ④ GitHub gist.js ──────────▼───────────────────────────────────────┐
│  document.write() で注入を試みる                                       │
│  ❌ ブラウザ上の最終描画が空のまま                                      │
│      （Referer制限/CSP/サンドボックスのいずれかで                       │
│       iframely.net 経由の二次注入が遮断される）                        │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 切り分けプロセス — どうやって iframely ドメイン切替に行き着いたか

最初は「Gist形式の問題」を疑っており、原因特定までに5段階の仮説立て・棄却を経ました。再現可能な手順として残します。

### Step 1: フォーマット差仮説（MD vs CSV）→ 棄却

- 失敗ケース: 新規記事 #83 で MD-only gist 作成 → 表示されない
- まず疑ったのは「note は CSV-only gist しか描画しない」可能性
- 検証: 既存記事 #25（CSV 9件 → MD 9件に swap 済）の gist 1件にCSVを並記（MD+CSV 同居）して、note上で表示が復活するか確認
- 結果: **CSV を戻しても表示復活せず** → フォーマット差仮説 弱まる

### Step 2: ユーザー追加情報「過去 MD-only も表示されている」→ フォーマット仮説 棄却

- ユーザーから「過去に MD-only で作った記事は表示されている」「本日追加したCSVも見えない」との報告
- これにより **フォーマット (MD vs CSV) は無関係** が確定
- 共通項は **「今日作成 or 編集した gist は表示されない」** という時系列性

### Step 3: GitHub Gist メタデータの比較 → 構造は同一

過去成功 gist と今日失敗 gist のメタデータを `gh api` で取得して比較:

```bash
gh api gists/8c92e758a05c322101f891f4c72dd32a --jq '...'  # 過去成功
gh api gists/94fdae46fdfc29935ef45854877ffeaa --jq '...'  # 今日失敗
```

結果: **両者とも `public:true`、ファイル名規約 `<stem>_table<N>.md`、description 末尾 `(Markdown)` まで同一**。GitHub 側の差分なし。

### Step 4: note記事HTMLの比較 → 同じ `<figure>` 構造

`WebFetch` で要約された静的 HTML には両記事とも `<a></a>` の空アンカーしか見えなかったため、note の **生 HTML を `curl` で直取得して grep** で周辺200文字を抜き出し:

```bash
curl -s "https://note.com/.../<past_note_id>" | grep -o '.\{200\}<gist_id>.\{200\}'
curl -s "https://note.com/.../<today_note_id>" | grep -o '.\{200\}<gist_id>.\{200\}'
```

結果: 両者とも `<figure embedded-service="gist">` 配下に `<div class="iframely-embed">` を含む同一構造を確認。embed の **入れ物 HTML は同じ**。

### Step 5: iframely URL とドメインの抽出 → 決定的差分発見

差分を探すため、`data-iframely-url` 属性を Python の正規表現で抽出:

```bash
curl -s "https://note.com/.../<past>" | python -c "
import sys, re
html = sys.stdin.read()
m = re.findall(r'data-iframely-url=\"([^\"]+)\"', html)
for u in m[:5]: print(u)
"
```

結果:
- **過去記事**: `//cdn.iframe.ly/tmL2Z5te`, `//cdn.iframe.ly/Oj4C1nmF`, ... （13件すべて `cdn.iframe.ly`）
- **今日記事**: `//iframely.net/HFNtWLC0`, `//iframely.net/K2sDG9uv`, ... （4件すべて `iframely.net`）

**配信ドメインが完全に別系統**であることが判明 → これが決定的差分。

### Step 6: 時系列性の裏付け — 複数記事で domain 出現数をカウント

「今日の publish だけ `iframely.net` に切り替わった」と断定するため、publish 時期の異なる複数記事で各ドメインの出現数を集計:

```bash
for url in <past_urls> <today_url>; do
  curl -s "$url" | grep -oE 'cdn\.iframe\.ly|iframely\.net' | sort | uniq -c
done
```

結果は本文の表（5/9 #80、5/上旬 #77、5/5 #76 はすべて `cdn.iframe.ly`、5/17 #83 のみ `iframely.net`）で一意に時系列カットオーバーを確認できました。

### 全体の学び

| Step | 学び |
|---|---|
| 1〜2 | 仮説は具体的に検証可能な実験へ落とすこと。ユーザー報告で複数のサンプルが揃うと早く棄却できる |
| 3 | 「同じ条件で違う結果」を見たら、**サービス側の差分を疑う** |
| 4 | `WebFetch`/AI 要約は要点を落とす場合があるので、**決定的な切り分けでは生 HTML を `curl` で取得し正規表現で確認**する |
| 5 | 構造が同じなら **値の差分** を探す。属性値を網羅抽出して `sort | uniq -c` するのが速い |
| 6 | 時系列の cutover を疑ったら、**時期の異なる複数サンプルで出現比を確認**するのが最短 |

---

## 原因仮説

iframely.com には2つの提供形態があります:

| プラン | ドメイン | 性質 |
|---|---|---|
| **Cloud (有料 / White-label)** | `cdn.iframe.ly` (note 専用 CDN) | Reliability重視、契約サイトのみ利用可 |
| **Free / Public** | `iframely.net` | Hobbyist 向け、Referer制約・レート制限あり、配信embedの動作保証は限定的 |

**有力仮説**: note.com が iframely 有料契約を解除・縮退・更新失効などにより、新規埋め込みの token 発行先が `iframely.net` 側に移った。`iframely.net` 配信の iframe は Gist の二次 `document.write()` を制約があり描画されない。

過去記事は publish 時点の HTML が note の DB に保存されており、その HTML が `cdn.iframe.ly/<token>` を含む限り表示は維持されます。

---

## 二次被害: 既存記事を編集・swap すると壊れる

検証として、過去 publish 済の記事「Claude マルチエージェントの初期設定」の Gist を CSV → MD に **URL不変** で内容差替（`gh gist edit --add <md> --remove <csv>`）したところ、**note 上の埋め込み表示が失われました**。

その後 MD → CSV に rollback（同じく URL不変）しても表示は復活せず。

```
過去のpublish時:    note DB に <iframe src="//cdn.iframe.ly/token_A"> を保存
                            ↓
今日gistをswap:     gist自体の中身が変わった
                            ↓
ユーザーが再表示:    note が embed の再フェッチを実施した可能性
                    （または publish 時の token が一定期間で失効する設計？）
                    → 新たに //iframely.net/token_B 側で再取得 → 失敗
                            ↓
rollback後:        gist内容を元のCSVに戻したが、note の cached embed token は
                    既に iframely.net 側に書換わっており復旧せず
```

結論: **gist 内容の変更は note 側 embed cache を invalidate するトリガーになる**模様。`URL不変だから安全` という旧来の理解は崩れています。

---

## 当面の運用判断（2026-05-17 時点）

| 対象 | 判断 |
|---|---|
| **新規記事への Gist 埋め込み** | 当面、控える。表は本文インラインのまま貼る |
| **既存 publish 済記事の Gist** | **触らない**（内容差替も削除も embed 破壊リスクあり） |
| **過去公開記事の再編集** | 必要最小限。再 publish すると iframely.net 側 token に置換される懸念 |
| **note運営への問い合わせ** | GitHub Gist 埋め込み不具合として報告推奨 |

将来 note が iframely.net → cdn.iframe.ly に巻き戻すか、別のembedサービスに移行すれば自然解決する見込み。

---

## 切り分けに使った検証コマンド（再現用）

```bash
# 1) 記事HTMLに含まれるiframelyドメインの種別カウント
curl -s "https://note.com/<user>/<note_id>" | grep -oE 'cdn\.iframe\.ly|iframely\.net' | sort | uniq -c

# 2) 当該gistの埋め込みJS応答確認
curl -s "https://gist.github.com/<owner>/<gist_id>.js" | head

# 3) iframelyラッパーHTMLの中身確認
curl -s "https://iframely.net/<token>"
curl -s "https://cdn.iframe.ly/<token>"

# 4) gist公開状態とファイル構成
gh api gists/<gist_id> --jq '{public, files: (.files | keys), updated_at, history_length: (.history | length)}'
```

---

## 再発防止メモ

- **note の embed は publish 時の HTML snapshot に依存**する仕様だと判明。これを前提に「過去記事は触らない」原則を運用に組み込む。
- **embed CDN 変更を観測する自動監視**を入れる選択肢: 月1回 任意の自記事の HTML を curl して `cdn.iframe.ly | iframely.net` の出現数をログ化、変化を検知したらアラート。
- **Gist の MD/CSV 形式議論は無効化**: 今回の事象では gist のフォーマット差は無関係。`feedback_gist_md_only.md` 等の方針は、note以外の埋め込み先（Zenn / dev.to 等）に対しては有効性を再評価すべき。

---

## 関連情報

- [iframely Cloud 公式](https://iframely.com/cloud) — White-label CDN プラン
- [iframely.net (Free/Hobby)](https://iframely.com/) — 無料/公開エンドポイント
- [GitHub Gist embedding ドキュメント](https://docs.github.com/en/get-started/writing-on-github/editing-and-sharing-content-with-gists/creating-gists)
