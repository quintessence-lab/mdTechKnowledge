---
title: "note.com の GitHub Gist 埋め込みが一時表示されなくなった事象 — iframely.net 配信切替直後の一時障害（2026-05-17発生 / 05-30解決）"
date: 2026-05-17
updatedDate: 2026-05-30
category: "障害事例・原因分析"
tags: ["note.com", "iframely", "GitHub Gist", "埋め込み", "障害事例", "ポストモーテム", "原因分析"]
excerpt: "2026年5月17日に観測した『note.com 上で GitHub Gist の埋め込みが新規・編集後の記事で表示されない』事象のポストモーテム。当初は『iframely.net 配信は構造的に gist 描画不可』と推定したが、05-30 に同じ iframely.net 配信のまま正常描画が復活したことで、真因は配信ドメインの恒久的非互換ではなく iframely.net エンドポイントの一時的障害だったと判明。切り分けプロセスと結論の訂正を併記。"
draft: false
---

> **本記事の位置づけ**: カテゴリ「障害事例・原因分析」初出。実運用で踏んだ不具合について、観測事実 → 切り分けプロセス → 原因確定 → 当面の運用判断、までを再現可能な形で残すシリーズです。同種の事象に遭遇したエンジニア向けの一次資料を目的とします。

> **🟢 続報・解決（2026-05-30 追記）**
> 本事象は **解決済み**です。2026-05-30 時点で、問題の記事（`n951a187ce586` など）の HTML は **依然 `iframely.net` 配信のまま**ですが、gist 埋め込みは**正常に描画される**ことを確認しました（`https://iframely.net/<token>` も HTTP 200 で gist スクリプトを内包した正常なラッパーHTMLを返却）。
>
> これにより、本記事が当初立てた「**`iframely.net` 経由は Referer制限/CSP/サンドボックスで gist を構造的に描画できない**」という結論は **誤りだったと判明しました**。真因は配信ドメインの恒久的非互換ではなく、**note が `cdn.iframe.ly` → `iframely.net` へ切り替えた直後の `iframely.net` 配信エンドポイント側の一時的障害**であり、その後 note/iframely 側で復旧したものです（**note は `cdn.iframe.ly` には巻き戻していません**）。
>
> - ✅ 正確だった観測: 5/17頃に配信ドメインが `cdn.iframe.ly` → `iframely.net` へ切り替わった
> - ❌ 誤っていた推定: 「iframely.net は構造的に gist 描画不可」→ 実際は一時障害で、現在は同じ iframely.net で正常描画
> - 🟢 現在の運用判断: **gist 埋め込みは通常どおり利用可**（後述の旧「当面の運用判断」は無効）
>
> 以降の本文は **発生当時（2026-05-17）の観測・推定の記録**として残します。「原因仮説」「失敗レンダリングパス」「当面の運用判断」の各節は、上記の訂正を前提に読んでください。

## TL;DR

> ⚠️ 以下は **発生当時（2026-05-17）の暫定結論**です。最終結論は冒頭の「続報・解決」を参照してください。

- 2026-05-17 以降に **note.com で新規公開・編集再公開された記事** において、GitHub Gist 埋め込み(`https://gist.github.com/...`) が空表示になる事象を観測。
- 配信ドメインが **`cdn.iframe.ly`（有料 White-label CDN）から `iframely.net`（公開エンドポイント）へ切り替わった**ことと時系列が一致（観測は正確）。
- 当時は「`iframely.net` 配信は構造的に gist を描画できない」と推定したが、**これは誤り**だった（→ 05-30 に同じ `iframely.net` 配信のまま描画復活）。
- **真因**: ドメイン切替直後の **`iframely.net` エンドポイント側の一時的障害**。その後 note/iframely 側で復旧。`cdn.iframe.ly` への巻き戻しは発生していない。
- **現在（2026-05-30）**: gist 埋め込みは正常。**運用上の制約なし**。

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

**当時の有力仮説（※後に誤りと判明）**: note.com が iframely 有料契約を解除・縮退・更新失効などにより、新規埋め込みの token 発行先が `iframely.net` 側に移った。`iframely.net` 配信の iframe は Gist の二次 `document.write()` に制約があり描画されない。

> 🔻 **訂正（2026-05-30）**: 後半の「`iframely.net` 配信は二次 `document.write()` に制約があり描画されない」は**誤り**でした。05-30 時点で同じ `iframely.net/<token>` が HTTP 200 で gist スクリプトを内包した正常なラッパーを返し、描画も復活しています。配信ドメインが `iframely.net` に移ったこと自体は事実ですが、表示不能は**ドメインの構造的非互換ではなく一時障害**が原因でした。

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

結論（当時）: **gist 内容の変更は note 側 embed cache を invalidate するトリガーになる**模様。`URL不変だから安全` という旧来の理解は崩れている、と考えた。

> 🔻 **訂正（2026-05-30）**: この「二次被害」は、根底にあった「`iframely.net` 配信＝描画不可」という前提が誤りだったため、現在は再現しません。当時 swap 後に表示が失われたのは embed cache の invalidate そのものではなく、再フェッチ先の `iframely.net` エンドポイントが一時障害中だったことが主因と考えられます。エンドポイント復旧後は、内容差替・再編集をしても通常どおり描画されます。

---

## 当面の運用判断（2026-05-17 時点）

> ⛔ **この節は 2026-05-30 時点で無効です。**事象は解決済みで、以下の回避策はいずれも不要になりました（gist 埋め込みは通常どおり利用可）。当時の判断記録として残します。

| 対象 | 当時の判断（現在は不要） |
|---|---|
| **新規記事への Gist 埋め込み** | ~~当面、控える。表は本文インラインのまま貼る~~ → **解決済み・通常利用可** |
| **既存 publish 済記事の Gist** | ~~触らない~~ → **解決済み** |
| **過去公開記事の再編集** | ~~必要最小限~~ → **解決済み** |
| **note運営への問い合わせ** | （対応不要。note/iframely 側で復旧済み） |

当時は「note が iframely.net → cdn.iframe.ly に巻き戻すか、別 embed に移行すれば自然解決」と見込んでいたが、実際は **`iframely.net` 配信のまま復旧**した（巻き戻しは発生せず）。

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
