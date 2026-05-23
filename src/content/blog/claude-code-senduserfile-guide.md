---
title: "Claude Code SendUserFile 完全ガイド — PC↔iPhone 直結のファイル共有経路"
date: 2026-05-23
category: "Claude技術解説"
tags: ["Claude Code", "SendUserFile", "iPhone", "ファイル共有", "Remote Control", "Dispatch"]
excerpt: "Claude Code の SendUserFile ツールを使えば、PCで生成したファイルを Anthropic サーバ経由で iPhone Claude Code に即時届けられる。仕組み・データフロー・制限事項・OneDrive 等の永続経路との使い分けまで、PC↔iPhone のファイル共有を最短実装するための完全ガイド。"
draft: false
---

**最終更新**: 2026-05-23
**対象**: Claude Code（macOS/Windows）+ Claude Code iOS App ユーザー
**前提**: Remote Control / Dispatch でのリモート接続経験

---

## 1. SendUserFile とは

**SendUserFile** は Claude Code に組み込まれたツールで、PC ローカルにあるファイルを **Anthropic サーバ経由で同一セッションのチャット履歴に添付** する機能。Claude が「ユーザーに何かを届ける」必要があるときに呼び出す。

特に便利なのは:

- **PC で生成 → iPhone で受け取り**: Python スクリプト等で作った Word/Excel/PDF を、移動中の iPhone で即座にダウンロード可能
- **追加サービス不要**: OneDrive / iCloud / Dropbox 等の中継サービスを介さず、Claude Code 内で完結
- **暗号化転送**: Anthropic の TLS でセキュア

「PCで作ったものを iPhone で見たい」という最も基本的なユースケースの **最短経路** にあたる。

---

## 2. 全体アーキテクチャ図

```
┌────────────────────────────────────────────────────────────────┐
│                     PC (物理端末)                                  │
│                                                                  │
│   Claude Code (ローカルセッション)                                  │
│   ├─ Python スクリプト実行                                         │
│   │  └─ doc.save("C:\Users\quint\report.docx")                    │
│   │                                                             │
│   └─ Claude が SendUserFile ツール呼出                            │
│      ├─ files=["C:\Users\quint\report.docx"]                     │
│      ├─ status="normal" or "proactive"                           │
│      └─ caption="...説明..."                                     │
│                       │                                          │
│                       ▼                                          │
│   ┌──────────────────────────────────────┐                       │
│   │ Claude Code ランタイム                │                       │
│   │ ・ファイルを読み込み                   │                       │
│   │ ・MIME 判定                          │                       │
│   │ ・Anthropic サーバへ HTTPS アップロード │                       │
│   └──────────────────────────────────────┘                       │
│                       │                                          │
└───────────────────────┼──────────────────────────────────────────┘
                        │ TLS 暗号化通信
                        ▼
┌─────────────────────── Anthropic Servers ──────────────────────┐
│                                                                  │
│   ┌─────────────────────────────────────────┐                   │
│   │ ファイルストレージ                         │                   │
│   │ ・file_uuid 発行                          │                   │
│   │   (例: 98e02ced-fb83-4727-af74-...)      │                   │
│   │ ・セッションIDに紐付け                     │                   │
│   │ ・有効期限管理                            │                   │
│   └─────────────────────────────────────────┘                   │
│                       │                                          │
│   ┌─────────────────────────────────────────┐                   │
│   │ セッション履歴 DB                          │                   │
│   │ ・チャットメッセージとしてfile_uuid を追記    │                   │
│   │ ・PC 側にもこのIDを返却                    │                   │
│   └─────────────────────────────────────────┘                   │
│                       │                                          │
│                       │ プッシュ通知 (Remote Control 接続時)        │
│                       ▼                                          │
└───────────────────────┼──────────────────────────────────────────┘
                        │
                        ▼
┌─────────────────────── iPhone Claude Code ─────────────────────┐
│                                                                  │
│   ┌─────────────────────────────────────────┐                   │
│   │ チャット履歴に添付表示                     │                   │
│   │ ┌─────────────────────────┐             │                   │
│   │ │ 📎 report.docx          │             │                   │
│   │ │ 40.5 KB · DOCX         │             │                   │
│   │ │ [ダウンロード]           │             │                   │
│   │ └─────────────────────────┘             │                   │
│   └─────────────────────────────────────────┘                   │
│                       │                                          │
│            ユーザータップ                                          │
│                       │                                          │
│                       ▼                                          │
│   ┌─────────────────────────────────────────┐                   │
│   │ Anthropic からダウンロード                 │                   │
│   │ (file_uuid + auth token で取得)         │                   │
│   └─────────────────────────────────────────┘                   │
│                       │                                          │
│                       ▼                                          │
│   ┌─────────────────────────────────────────┐                   │
│   │ iPhone 内に一時保存                        │                   │
│   │ ・「共有」シート表示                        │                   │
│   │ ・「ファイルに保存」「Wordで開く」等          │                   │
│   └─────────────────────────────────────────┘                   │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

ポイントは、PC 側のファイルが **Anthropic サーバを一度経由する** こと。同セッションに紐付いた `file_uuid` が発行され、iPhone 側 Claude Code はこの ID を使ってファイルをダウンロードする。

---

## 3. PC 側でのファイル送信処理

### Python スクリプトでのファイル生成

```python
from docx import Document

doc = Document()
doc.add_heading("テストレポート", 0)
doc.add_paragraph("本日のレポートです。")
out_path = r"C:\Users\quint\report.docx"
doc.save(out_path)
```

ここまでが Python 側の処理。**送信は Claude（メイン）側のツール呼出で行う** のがポイント。Python から直接 SendUserFile を呼ぶ API は提供されておらず、Claude Code のランタイムが提供するツールとして実行される。

### Claude Code 側でのツール呼出

```
SendUserFile(
  files=["C:/Users/quint/report.docx"],
  status="normal",          # or "proactive" (能動的通知)
  caption="本日のレポート"
)
```

返却値:

```
1 file delivered to user.
  C:\Users\quint\report.docx → file_uuid: 98e02ced-fb83-...
```

この時点で **iPhone 側のチャット履歴にも添付が反映** される（Remote Control 接続中、または後で同セッションに接続した場合）。

### 実際の利用は「Claude に頼むだけ」

ユーザーが Claude Code 内で「このファイルを送って」と指示すれば、Claude が自動的に SendUserFile を呼ぶ。本記事の解説ファイル群もすべてこの仕組みで送付されている。

---

## 4. iPhone 側での受信表示

```
┌─────────── iPhone Claude Code ───────────┐
│                                           │
│   Claude:                                 │
│   ┌─────────────────────────────────┐    │
│   │ 本日のレポートです                  │    │
│   │                                  │    │
│   │ 📎 report.docx                   │    │
│   │ ╭───────────────────────╮       │    │
│   │ │ Word Document          │       │    │
│   │ │ 40.5 KB                │       │    │
│   │ ╰───────────────────────╯       │    │
│   │                                  │    │
│   │ [タップしてダウンロード]            │    │
│   └─────────────────────────────────┘    │
│                                           │
└───────────────────────────────────────────┘
            │ タップ
            ▼
┌─────────── iOS 標準共有シート ─────────────┐
│                                           │
│  📄 report.docx (40.5 KB)                │
│                                           │
│  以下のアプリで開く:                        │
│  ┌─────┬─────┬─────┬─────┐               │
│  │Files│ Word│Mail │Drive│ ...           │
│  └─────┴─────┴─────┴─────┘               │
│                                           │
│  アクション:                                │
│  ・ファイルに保存                            │
│  ・コピー                                  │
│  ・Air Drop で送信                         │
│                                           │
└───────────────────────────────────────────┘
```

タップ後は iOS 標準の共有シートが起動し、ファイル App への保存、Word for iPhone での編集、Mail での転送、Air Drop での別端末送信などが可能。

---

## 5. status の挙動の違い

`SendUserFile` の `status` 引数は2種類あり、iPhone 側の通知挙動が変わる。

| status | 用途 | iPhone 通知 |
|---|---|---|
| `normal` | ユーザーが直前にリクエストした応答として送る | チャット内に表示のみ |
| `proactive` | ユーザーが待っていない時に自動で送る（バックグラウンド処理完了等）| **プッシュ通知付き**（iPhone のロック画面に表示） |

例えば長時間スクリプトの完了通知なら `proactive`、対話的なやり取り中の「ファイル送って」への応答なら `normal` が適切。

---

## 6. SendUserFile の制限事項

| 項目 | 制限 |
|---|---|
| **ファイルサイズ上限** | 公式明示なし、推定 数十MB程度（ストリーミング転送が長引くと失敗） |
| **同時送信ファイル数** | 1リクエストで複数指定可能（実績 4ファイル同時） |
| **対応形式** | テキスト/バイナリ問わず（.docx, .xlsx, .csv, .pdf, .png, .zip 等） |
| **有効期限** | セッションが残っている限り取得可能。Claude Code のセッション履歴保持期間に依存 |
| **iPhone 接続条件** | 同じ Anthropic アカウントで Claude Code iOS App ログイン、該当セッションに接続 |
| **オフライン取得** | ❌ 不可（その場で取得しないと、後でオフラインからは見れない） |

---

## 7. PC と iPhone のセッション関係（重要）

SendUserFile が iPhone でも見える条件は、**PC・iPhone が同じセッションを共有している** ことが必須。3つのパターンを整理する。

### パターンA: iPhone が PC セッションに後から接続

```
[PC] セッション開始 → ファイル生成 → SendUserFile 呼出
                                      │
                                      ▼
                              セッション履歴に蓄積
                                      │
[iPhone] あとから Remote Control で同セッション接続
         → 履歴をスクロールすると過去の添付ファイルが見える
         → タップしてダウンロード可能
```

PC で先に作業しておき、移動中に iPhone で取りに行く、という最も多いパターン。

### パターンB: 同時接続（Remote Control 並走）

```
[PC] セッション開始
[iPhone] Remote Control で接続（同セッションに参加）
[PC] ファイル生成 → SendUserFile 呼出
         │
         ▼ リアルタイム
[iPhone] チャットUIに即時表示、プッシュ通知も飛ぶ
```

PC のターミナルで作業しつつ、iPhone でも結果を即時確認したいケース。

### パターンC: iPhone から新規セッション起動（NG）

```
[PC] セッション A でファイル生成 → SendUserFile（セッション A に蓄積）

[iPhone] セッション B を新規起動（A とは別）
       → セッション B には何も添付がない
       → セッション A の添付は見えない
```

iPhone 側で新規セッションを立ち上げてしまうと、過去の PC セッションに添付されたファイルは見えない。**「同じセッション」を意識して接続する** ことが重要。

---

## 8. メリット・デメリット

### ✅ メリット

| 観点 | 内容 |
|---|---|
| **即時性** | クラウド同期待ち不要、3秒程度で iPhone に表示 |
| **追加設定不要** | OneDrive 契約・iCloud 設定など一切不要 |
| **暗号化転送** | Anthropic の TLS で保護 |
| **PC↔iPhone 直結** | 中間サービス（Microsoft/Google）に保管されない |
| **Claude が自動運用** | ユーザーが「送って」と言うだけで Claude が処理 |

### ⚠️ デメリット

| 観点 | 内容 |
|---|---|
| **セッション依存** | 別セッションでは取得不可、長期保管に不向き |
| **オフライン不可** | iPhone がネット繋がってないと取得不可 |
| **サイズ制限** | 推定数十MB（大容量データは別経路推奨） |
| **検索性低い** | 過去のチャット履歴を辿る必要、ファイル一覧では見れない |
| **PC↔他デバイス不可** | iPad で同セッションに繋ぐ等は可、ただし非 Claude Code アプリには共有不可（共有シート経由は可） |

---

## 9. OneDrive 等の永続経路との使い分け

SendUserFile は短期共有の最短経路だが、長期保管・複数デバイス編集・チーム共有には向かない。用途別の使い分けは以下の通り。

| シーン | 推奨経路 |
|---|---|
| 「今すぐ iPhone で見たい」短期共有 | **SendUserFile** ⭐ |
| iPhone Claude Code で Dispatch 実行 → 結果即受取 | **SendUserFile** ⭐ |
| 後で何度も参照する資料 | OneDrive 経由（長期保管） |
| PC・iPhone・iPad で同じファイルを編集 | OneDrive 経由（自動同期） |
| チームメンバーにも共有 | OneDrive 共有リンク or メール |
| 数百MB の大きいファイル | OneDrive 経由（SendUserFile はサイズ制限） |

実運用では「2系統併用」がベストプラクティス。PC で生成したファイルを **OneDrive にも保存しつつ SendUserFile でも送付** すれば、セッション中は即取得・セッション切れ後も OneDrive 側に残る、という二重の安心が得られる。

```python
import os
from docx import Document
from datetime import datetime

ONEDRIVE_DROP = r"C:\Users\quint\OneDrive\ClaudeCode_Drop"
os.makedirs(ONEDRIVE_DROP, exist_ok=True)

doc = Document()
# ... 内容追加 ...

# OneDrive に直接保存（永続化）
filename = f"report_{datetime.now().strftime('%Y%m%d_%H%M')}.docx"
onedrive_path = os.path.join(ONEDRIVE_DROP, filename)
doc.save(onedrive_path)

# このあと Claude 側で SendUserFile(files=[onedrive_path]) を呼ぶ
```

メイン Claude 側:

```
SendUserFile(files=[onedrive_path], status="normal",
             caption="本日の成果物 (OneDrive にも保存済み)")
```

---

## 10. セキュリティ・プライバシー上の留意点

SendUserFile はファイルが **Anthropic のサーバを一度経由する** 仕組みのため、以下のファイルは送付に注意。

| カテゴリ | 例 | 理由 |
|---|---|---|
| **認証情報** | .env / credentials.json / token.json | API キー・OAuth トークン等が含まれる |
| **秘密鍵** | .ssh/id_rsa / SSL 秘密鍵 | 漏洩時の影響大 |
| **個人情報** | 顧客リスト・社員情報 | プライバシー法令の対象 |
| **業務機密** | 契約書・社内ノウハウ・財務資料 | 業務上の守秘義務 |
| **大容量ログ** | 数百MBのログ | サイズ制限超過の可能性 |

機密度の高いファイルは、Anthropic を経由しない経路（自社ネットワーク内のファイルサーバや、エンドツーエンド暗号化対応のサービス）を検討する方が安全。

---

## 11. SendUserFile が活きる代表的なユースケース

実際に SendUserFile が威力を発揮するシーンを整理する。

### Dispatch + 結果受取

iPhone から Dispatch でローカル PC に「データ集計してレポート生成」と依頼 → PC が処理 → 完成したファイルを SendUserFile で iPhone に届ける。「依頼して放置 → 完成通知を受け取る」というワークフロー全体が Claude Code 内で完結する。

### Remote Control 中の即時受け渡し

PC ターミナルで作業中、iPhone でも結果を即時確認したいときに使える。例えばグラフを生成したら即 iPhone に PNG が届く、設定変更後のスクリーンショットを共有する、等。

### 出先での再ダウンロード

PC で午前中に生成したレポートを、外出先で iPhone から見直したいときに有効。OneDrive 等の同期サービスを設定していなくても、Claude Code のセッションに接続し直すだけで再ダウンロード可能。

---

## まとめ

- **SendUserFile** は Claude Code 内蔵の **PC→iPhone 最短ファイル共有経路**
- ファイルは **Anthropic サーバ経由** で暗号化転送、`file_uuid` で識別
- iPhone 側は **同セッションに接続中** であれば即受け取り可能
- 追加サービス不要・即時性最高・PC↔iPhone 直結
- ただし **セッション依存**・長期保管不可・機密ファイルには不向き
- 長期保管・複数デバイス編集を伴うなら **OneDrive 等の永続経路と併用** が安全
- ユーザーは「Claude に頼むだけ」、実装は Claude Code 側が自動で処理

「短期共有なら SendUserFile、永続保管なら OneDrive」と覚えておくと、PC↔iPhone 間のファイル運用がスムーズに設計できる。
