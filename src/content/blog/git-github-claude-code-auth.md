---
title: "Git/GitHub入門 — Claude Code連携での認証の仕組みとGITHUB_TOKENが必要なケース"
date: 2026-04-29
updatedDate: 2026-04-29
category: "Claude技術解説"
tags: ["Git", "GitHub", "Claude Code", "認証", "GITHUB_TOKEN", "MCP", "初心者向け"]
excerpt: "Git/GitHubの基礎からClaude Code連携時の認証の仕組みまでをGitHub初心者にも分かるように解説。push/pull/cloneの意味、ローカル/リモートの3層構造、Personal Access Token・GITHUB_TOKEN・MCP経由・OAuth委譲の違い、認証情報がどこに保管されてどの操作で必要になるかを図解。Routineサンドボックスでトークンが不要なケースの背景まで。"
draft: false
---

# Git/GitHub入門 — Claude Code連携での認証の仕組みとGITHUB_TOKENが必要なケース

> 2026年4月時点

「Claude Code から GitHub に push したら認証エラーが出た」「`GITHUB_TOKEN` という言葉をよく見るけど、いつ必要なのかよく分からない」「MCP サーバ経由なら認証不要らしいけど、なぜ?」

本記事はそんな疑問に答えるため、**Git/GitHub の超基礎から、Claude Code が GitHub と連携するときの認証経路の違い**まで、GitHub をほとんど触ったことがない方でも理解できるように整理します。

---

## はじめに — この記事のゴール

本記事を読むと次のことが分かります。

- Git と GitHub は別物。それぞれ何をしているか
- `git clone` / `git pull` / `git push` / `git commit` は、それぞれ「どこ」に何をしているか
- GitHub への書き込みには「本人確認」が必要で、その手段は複数あること
- Claude Code から GitHub を操作するときの **4 つの経路** と、それぞれで認証情報がどこから来るのか
- `GITHUB_TOKEN` が必要なケース／不要なケースをケース別に判断する基準

---

# Part 1: Git/GitHub の基礎

## 1. Git とは何か

**Git（ギット）** は、ファイルの変更履歴を記録するツール（バージョン管理ツール）です。

- ローカルの PC 内で動く
- インターネット接続は不要
- 「いつ・誰が・何を変更したか」をすべて記録する
- 過去のバージョンに戻すことができる

「Word の変更履歴機能の超強力版」と考えると分かりやすいでしょう。

## 2. GitHub とは何か

**GitHub（ギットハブ）** は、Git で管理しているコードをインターネット上に置けるサービスです。Microsoft 傘下の Web サービスで、以下のような特徴があります。

- 自分のコードを他人と共有できる
- 複数人で同じプロジェクトを編集できる
- Issue（課題管理）や Pull Request（変更提案）の機能がある
- 公開（public）／非公開（private）の選択ができる

つまり Git は「ローカルで動く道具」、GitHub は「Git で管理したコードを置く場所」です。両者は別物で、Git だけ使って GitHub を使わないことも、その逆もできます（後者は普通やりませんが）。

## 3. ローカル/リモートの2層構造

Git/GitHub の世界には、大きく分けて2つの場所があります。

```
┌────────────────────────────────┐         ┌────────────────────────────────┐
│   ローカル（あなたのPC）         │         │   リモート（GitHub.com）         │
│                                │         │                                │
│   作業フォルダ                   │         │   リモートリポジトリ             │
│      ├── README.md             │         │   （GitHub上の共有保管場所）     │
│      ├── src/                  │         │                                │
│      └── .git/  ← 履歴データ    │  push   │   github.com/user/repo         │
│                                │ ──────> │   ├── README.md                │
│                                │ <────── │   ├── src/                    │
│                                │  pull   │   └── 変更履歴                 │
└────────────────────────────────┘         └────────────────────────────────┘
```

### `.git` ディレクトリの正体

ローカルで `git init` を実行したフォルダや、`git clone` で取得したフォルダの中には `.git` という隠しフォルダができます。ここに「過去のすべての変更履歴」が圧縮されて保存されています。これがあれば、その PC だけで履歴を見たり、過去の状態に戻したりできます。

GitHub 上の **リモートリポジトリ（リモート上の保管場所）** は、この `.git` の中身を共有用にホスティングしたものだとイメージしてください。

## 4. 主要コマンドの意味と使い方

| コマンド | 何をする? | どこからどこへ? |
|---|---|---|
| `git clone <URL>` | リモートを丸ごとコピー | GitHub → ローカル（新規取得） |
| `git pull` | リモートの最新を取り込む | GitHub → ローカル（既存更新） |
| `git push` | ローカルのコミットを反映 | ローカル → GitHub |
| `git add <file>` | 変更を「次のコミット候補」に追加 | 作業ファイル → ステージング |
| `git commit -m "msg"` | ステージングを履歴に記録 | ステージング → ローカル.git |
| `git status` | 現在の変更状態を表示 | （表示のみ） |
| `git log` | コミット履歴を表示 | （表示のみ） |
| `git diff` | 変更内容を比較表示 | （表示のみ） |

### よくある混乱: add と commit の違い

`git commit` は「ローカルの履歴に記録する」だけで、GitHub には何も送りません。GitHub に反映するには `git push` が必要です。

```
編集  ──add──▶  ステージング  ──commit──▶  ローカル.git  ──push──▶  GitHub
```

## 5. ブランチの概念

**ブランチ（branch、枝）** は、履歴を分岐させて作業するための仕組みです。

- `main`（または `master`）: 本流のブランチ。完成版のコードを置く
- `feature/xxx`: 新機能を追加するときの作業用ブランチ
- `fix/yyy`: バグ修正用ブランチ

```
main:        A ─── B ─── C ───────── M（マージ後）
                          \         /
feature/xxx:               D ─── E ─
```

`git checkout <branch>` または `git switch <branch>` でブランチを切り替えられます。

## 6. リポジトリの公開設定

GitHub のリポジトリには 2 種類あります。

- **public**: 誰でも閲覧可能（読み取りに認証不要）
- **private**: 招待された人だけ閲覧可能（読み取りにも認証必要）

この公開設定が、後述する「認証要否」に大きく関わります。

---

# Part 2: GitHubの認証の仕組み

## 7. なぜ認証が必要か

GitHub では、書き込み操作（push、Issue 起票、PR 作成など）には必ず **本人確認（認証）** が必要です。これは当然で、見ず知らずの誰かが他人のリポジトリを書き換えられたら大変だからです。

一方、public リポジトリの読み取り（clone や閲覧）はインターネット上の誰でもできます。

## 8. 読み取りと書き込みの境界

| 操作 | public repo | private repo |
|---|---|---|
| 閲覧 / clone（読み取り） | 認証不要 | **認証必要** |
| push / Issue / PR（書き込み） | **認証必要** | **認証必要** |

「認証必要」と書いた箇所が、後ほど登場する `GITHUB_TOKEN` などの出番になります。

## 9. 認証手段の種類

GitHub への認証には主に 5 種類あります。それぞれ性質が違うので、用途で使い分けます。

### 9-1. Personal Access Token（PAT、個人アクセストークン）

- 自分のアカウントで発行する **長寿命のトークン**（最長 1 年など、自分で期限を決められる）
- パスワードの代わりに使う長い文字列（例: `ghp_xxxxxxxxxxxxxxxxx`）
- スコープ（権限範囲）を細かく設定できる（repo 全権 / Issue のみ など）
- ローカル開発、CI、自前のスクリプトなどで広く使われる

### 9-2. GITHUB_TOKEN（GitHub Actions が自動生成するトークン）

- **GitHub Actions のワークフロー実行中だけ有効** な短寿命トークン
- ワークフロー開始時に GitHub が自動生成し、`${{ secrets.GITHUB_TOKEN }}` で参照できる
- 実行が終わると失効する（その場限り）
- スコープはそのリポジトリ内に限定される（他リポジトリ操作には使えない）

混乱しやすいのですが、`GITHUB_TOKEN` は **GitHub Actions の文脈で出てくる固有名詞** です。「GitHub のトークン全般」ではなく、Actions が自動でくれるあのトークンを指します。

### 9-3. OAuth トークン（アプリ経由の委譲認証）

- 外部アプリ（claude.ai、VS Code、各種 CLI など）が「あなたの代理として GitHub を操作する」ために発行されるトークン
- ユーザーが GitHub の認可画面で「許可する」ボタンを押すことで発行される
- アプリごとにスコープが決まっている

`gh auth login` でブラウザ認証する場合や、claude.ai が GitHub と連携する場合がこれにあたります。

### 9-4. GitHub App インストールトークン

- **GitHub App（GitHub上のアプリケーション）** が、インストールされた組織やリポジトリに対して発行する短寿命トークン
- スコープが App の権限設定でガッチリ絞られている
- Bot やインテグレーションでよく使われる（Dependabot など）

### 9-5. SSH 鍵（公開鍵暗号での git 専用認証）

- 公開鍵を GitHub に登録し、秘密鍵を手元に置く方式
- トークンと違い文字列ではなくファイル（`id_ed25519` など）
- HTTPS ではなく `git@github.com:user/repo.git` 形式の URL で使う
- 主に `git push` / `git clone` などの **git プロトコル** に使う

## 10. 認証情報の保管場所

これらの認証情報は、それぞれ以下のような場所に保管されています。

### ローカル端末

```
┌──────────────────────────────────────────────────────────┐
│  ローカル端末の認証情報                                     │
├──────────────────────────────────────────────────────────┤
│  ~/.gitconfig              git のグローバル設定            │
│  ~/.git-credentials        プレーンテキスト保存（非推奨）   │
│  Windows資格情報マネージャー  HTTPS用のPAT/OAuth保存先     │
│  macOS Keychain            macOSの場合                    │
│  ~/.ssh/id_ed25519         SSH秘密鍵                     │
│  ~/.config/gh/hosts.yml    gh CLI のトークン保存場所       │
└──────────────────────────────────────────────────────────┘
```

### クラウド側

```
┌──────────────────────────────────────────────────────────┐
│  クラウド側の認証情報                                       │
├──────────────────────────────────────────────────────────┤
│  GitHub Actions secrets    ワークフロー専用シークレット     │
│  GITHUB_TOKEN（自動）       ワークフロー実行時のみ環境変数  │
│  Anthropicサンドボックス    Routine実行環境の環境変数       │
│  MCPサーバ設定              MCPサーバが内部に保持           │
└──────────────────────────────────────────────────────────┘
```

ポイントは「**認証情報は呼び出す側が持っている必要がある**」ことです。Claude Code 自身は認証情報を持たず、その時々で「誰の認証情報を借りるか」が変わります。これが次の Part の話です。

---

# Part 3: Claude Code が GitHub と連携する4つの経路

ここが本記事の核心です。Claude Code から GitHub への操作には大きく 4 つの経路があり、それぞれで使う認証情報が違います。

```
            ┌───────────────────────────────────────────────┐
            │              Claude Code                      │
            └──┬─────────┬─────────┬─────────┬──────────────┘
               │         │         │         │
        経路A  │  経路B  │   経路C │   経路D │
        git/gh │   MCP   │ Routine │ Actions │
        直接  │ サーバ経由│サンドボックス│ ワークフロー │
               │         │         │         │
               ▼         ▼         ▼         ▼
            ┌─────────────────────────────────────────────┐
            │             GitHub.com                      │
            └─────────────────────────────────────────────┘
```

## 11. 経路A: Claude Code が直接 git/gh CLI を呼ぶ（ローカル端末）

最もシンプルな経路です。Claude Code がローカル端末で動作し、Bash ツールで `git` や `gh` コマンドを直接実行する場合です。

```
あなたのPC
┌──────────────────────────────────────────────────┐
│  Claude Code（ローカル）                          │
│        │                                         │
│        │ Bashツール経由で実行                      │
│        ▼                                         │
│  git push / gh issue create                     │
│        │                                         │
│        │ 認証情報を読みに行く                       │
│        ▼                                         │
│  ┌─────────────────────────────┐                │
│  │ ~/.gitconfig                │                │
│  │ Windows資格情報マネージャー    │                │
│  │ ~/.config/gh/hosts.yml      │                │
│  │ ~/.ssh/id_ed25519           │                │
│  └─────────────────────────────┘                │
│        │                                         │
└────────┼─────────────────────────────────────────┘
         │ HTTPS / SSH
         ▼
      GitHub.com
```

- 認証はローカルにある git credential / gh 認証をそのまま流用する
- 一度 `gh auth login` などで認証を済ませておけば、以降の `git push` はそのまま動く
- **`GITHUB_TOKEN` 環境変数は不要**（既存のローカル認証情報を使うため）

ローカル開発で Claude Code を使う日常的なケースは、ほぼこの経路です。

## 12. 経路B: Claude Code が GitHub MCP サーバ経由で操作

**MCP（Model Context Protocol）** とは、Claude などの AI に「使える道具」を増やすための共通仕様です。GitHub MCP サーバを使うと、Claude Code は MCP 経由で GitHub の API を叩けます。

```
Claude Code
   │
   │ MCPプロトコル（ローカルプロセス間通信 / HTTP）
   ▼
GitHub MCPサーバ（github-local や claude.ai GithubMCP_PAT_forCode など）
   │
   │ サーバ自身が保持しているPAT/OAuthで認証
   ▼
GitHub REST/GraphQL API
   │
   ▼
GitHub.com
```

- MCP サーバは起動時に認証情報（PAT など）を内部に持っている
- Claude 本体は **認証情報をまったく扱わない**。「このファイルを更新して」と MCP に依頼するだけ
- 認証は **MCPサーバ側で完結** するので、Claude 側で `GITHUB_TOKEN` を意識する必要はない
- 例: `mcp__github-local__create_or_update_file` というツールは、内部で MCP サーバが PAT を使って GitHub API を呼んでいる

これは「金庫の鍵を MCP サーバが持っていて、Claude は『これを取って』とだけ頼む」イメージです。

## 13. 経路C: Claude Code Routine（クラウドサンドボックス）から git/gh CLI

**Claude Code Routine** は、Anthropic 側のクラウドサンドボックス（隔離された Linux 実行環境）で Claude Code を動かす機能です。Cron のような自動定期実行や、Web から「タスク実行」した場合などがこれにあたります。

```
あなたのPC                    Anthropic サンドボックス
                          ┌──────────────────────────────┐
        Routine起動  ─────▶│ Claude Code（クラウド）       │
                          │       │                       │
                          │       │ git clone / git push  │
                          │       ▼                       │
                          │ 環境変数 GITHUB_TOKEN ?       │
                          │   （注入される場合・されない場合）│
                          └──────┬─────────────────────────┘
                                 │
                                 ▼
                              GitHub.com
```

- サンドボックス起動時に Anthropic が **一時トークン** を環境変数として注入する場合がある
- ただし「全 Routine で `GITHUB_TOKEN` が常に存在する」わけではない（取得不可なケースもある）
- このため `git clone` が動く時もあれば、認証エラーで失敗する時もある
- ローカルの `~/.gitconfig` などはサンドボックスには **存在しない**（あなたの PC とは別の環境）

サンドボックスで動かす場合、**ローカルの認証情報は使えない** という点が重要です。

## 14. 経路D: GitHub Actions ワークフロー

リポジトリにデプロイの自動化を仕込んでいる場合（mdTechKnowledge サイトもこれです）、GitHub Actions のランナー上でビルドや push が走ります。

```
リポジトリの.github/workflows/deploy.yml がトリガーされる
   │
   ▼
GitHub Actions ランナー（GitHub側のVM）
   │
   │ ${{ secrets.GITHUB_TOKEN }} が自動で利用可能
   │
   ├── actions/checkout（リポジトリ取得・自動でトークン使用）
   ├── npm run build
   └── peaceiris/actions-gh-pages（同リポジトリへ push）
        │
        ▼
   GitHub Pages にデプロイ
```

- ランナー起動時に `GITHUB_TOKEN` が自動で生成・注入される
- スコープは **そのワークフローを実行しているリポジトリ内** に限定
- ワークフロー終了で失効する
- **別リポジトリに push したい場合** は、`GITHUB_TOKEN` では権限不足。別途 PAT を `secrets.MY_PAT` のような形で登録して使う

---

# Part 4: GITHUB_TOKEN が必要/不要のケース別整理表

ここまでの内容を、実際のシーンで「`GITHUB_TOKEN` を用意する必要があるか?」という観点で整理します。

| # | 経路 | 操作 | GITHUB_TOKEN必要? | 代替認証 |
|---|---|---|---|---|
| 1 | ローカル端末から `git push` | リモートに書き込み | 不要 | `~/.gitconfig`のクレデンシャルヘルパー、SSH鍵 |
| 2 | ローカル端末から `gh issue close` | Issue操作 | 不要 | `gh auth login`で保存されたOAuth/PAT |
| 3 | MCP `create_or_update_file` | リモートに書き込み | 不要 | MCPサーバが内部でPAT保持 |
| 4 | MCP `add_issue_comment` | Issueコメント | 不要 | 同上 |
| 5 | Routineサンドボックス内の `git clone` | private repo読み取り | 場合による | 注入トークンが使えれば不要 |
| 6 | Routine内の `requests.put('https://api.github.com/...')` | API直叩き書き込み | **必要** | 他に認証手段なし |
| 7 | GitHub Actionsの `actions/checkout` | リポジトリ取得 | 不要（自動付与） | `GITHUB_TOKEN`は自動セット |
| 8 | GitHub Actionsから他リポジトリへ push | クロスrepo書き込み | **必要（PAT）** | `GITHUB_TOKEN`では権限不足 |

### 表の読み方ガイド

- 「不要」: 何らかの認証はされているが、ユーザーが `GITHUB_TOKEN` を意識して用意する必要はない
- 「場合による」: 環境によって自動注入されるか変わる。スクリプトでは存在チェックを入れておくのが安全
- 「必要」: 明示的にトークンを取得・設定しないと動かない

---

# Part 5: 実例 — mdTechKnowledge サイトでの運用

最後に、本サイト（mdTechKnowledge）の Routine 運用での実例を紹介します。これは Part 3 の経路 B と経路 C の組み合わせです。

## 16. 通常モード（cloneできる場合）

```
Routineサンドボックス起動
   │
   ▼
git clone（注入されたトークンで private repo 取得）
   │
   ▼
scripts/ingest.py 実行（記事の取り込み処理）
   │
   ▼
更新ファイルをリポジトリに反映
   │
   ▼
MCP（github-local）経由で push
   ※ MCPサーバが保持するPATを使用
   │
   ▼
GitHub Actionsがトリガーされ、サイト再ビルド
```

## フォールバックモード（cloneできない場合）

サンドボックスのトークン注入が失敗しても、MCP サーバは別経路で生きているため、以下が成立します。

- `git clone` が失敗 → 代わりに MCP の `get_file_contents` で必要ファイルだけ取得
- ローカル展開せず、MCP の `create_or_update_file` で直接 push

つまり **MCP 経路があれば、サンドボックス側のトークンは無くても運用は止まらない** という二段構えになっています。

## ポイント

> Routineサンドボックスでは `GITHUB_TOKEN` を直接扱わない設計（MCP に集約する設計）にしておくほうが堅牢

理由は以下の通りです。

- サンドボックス側のトークン注入は環境依存で不安定
- MCP サーバ側の認証は安定しており一元管理しやすい
- トークンを Claude のコンテキストに露出させずに済む（漏洩リスク低減）

---

# Part 6: トラブルシューティング

## 17. 「Permission denied」エラー

主な原因と対処を整理します。

| 表示 | 主な原因 | 対処 |
|---|---|---|
| `Permission denied (publickey)` | SSH鍵がGitHubに登録されていない / 鍵が違う | `ssh -T git@github.com` で疎通確認、GitHub設定で鍵登録 |
| `Permission denied to <user>` | 認証ユーザーに書き込み権限がない | リポジトリのCollaboratorに追加してもらう |
| `403 Resource not accessible by integration` | GitHub Appやワークフローのスコープ不足 | `permissions:` 設定を見直す |

## 18. 「Authentication failed」のよくある原因

- **パスワード認証が廃止されている**: GitHub は 2021 年以降、HTTPS でのパスワード認証を廃止。PAT または OAuth/SSH を使う必要がある
- **PAT の期限切れ**: PAT には有効期限がある。切れていたら再発行
- **資格情報マネージャーが古い PAT をキャッシュ**: Windows 資格情報マネージャーから該当エントリを削除してやり直す
- **2FA を有効にしているのにパスワードで push しようとした**: 2FA 有効時は PAT 必須

## 19. PAT vs OAuth トークンの選び方

| 観点 | PAT | OAuth トークン |
|---|---|---|
| 発行者 | あなた自身 | あなたが許可したアプリ |
| 期限 | 自分で設定（最長1年など） | アプリ依存（自動更新の場合あり） |
| スコープ | 自分で細かく設定 | アプリが要求した範囲 |
| 用途 | スクリプト、CI、自前ツール | サードパーティアプリの GitHub 連携 |
| 失効しやすさ | 期限切れで失効 | 連携解除で即失効 |

迷ったら以下を目安にしてください。

- 自分で書いたスクリプト・CI のシークレット → **PAT**
- VS Code・claude.ai・各種 SaaS の連携 → **OAuth**（自動でセットアップされる）
- リポジトリ単位の Bot → **GitHub App**

---

## まとめ

- Git は **ローカルで動くバージョン管理ツール**、GitHub は **Git のリモートホスティングサービス**
- GitHub への書き込みには認証が必要。手段は PAT / GITHUB_TOKEN / OAuth / GitHub App / SSH の 5 種類
- Claude Code から GitHub への経路は 4 種類（ローカル直接 / MCP / Routine / Actions）。それぞれ認証情報の出どころが違う
- `GITHUB_TOKEN` は **GitHub Actions の文脈で自動生成される短寿命トークン**。ローカルや MCP 経由では基本不要
- mdTechKnowledge では「MCP に認証を集約」する設計でサンドボックスのトークン揺らぎに対するロバスト性を担保している

「いつ `GITHUB_TOKEN` が必要か」を判断するときは、**操作している主体（ローカルかサンドボックスかActionsか）と経路（直接 git か MCP か API 直叩きか）** を切り分けて考えると整理しやすくなります。

---

## 関連記事

- [GitHub の仕組み — ローカルフォルダ・ローカルgit・GitHub の3層構造](/mdTechKnowledge/blog/github-three-layer-guide/) — ファイルとgitの層構造を図解
- [GitHub MCP サーバ導入のメリットとデメリット](/mdTechKnowledge/blog/github-mcp-merits-demerits/) — MCP方式 vs Webフェッチ方式の比較
- [GitHub Pages 自動デプロイの仕組み](/mdTechKnowledge/blog/github-pages-auto-deploy-mechanism/) — Actionsワークフローの中身
