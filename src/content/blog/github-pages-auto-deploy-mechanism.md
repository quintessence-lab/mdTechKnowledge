---
title: "GitHub Pages 自動デプロイの仕組み"
date: 2026-04-01
category: "Claude技術解説"
tags: ["GitHub Actions", "GitHub Pages", "Astro", "CICD", "静的サイト"]
excerpt: "git push だけでサイトが自動更新される理由と、GitHub Actions・SSG・ホスティングの各パーツの役割を解説。"
draft: false
---

git push だけでサイトが自動更新される理由と、各パーツの役割を解説する。

---

## 全体の流れ

```
git push（main ブランチ）
    ↓
GitHub が push を検知
    ↓
GitHub Actions（deploy.yml）が自動起動
    ↓
① リポジトリをダウンロード（Checkout）
② Node.js セットアップ
③ npm ci（パッケージインストール）
④ npm run build（Astro が .md を HTML に変換）
⑤ dist/ フォルダを GitHub Pages に配置
    ↓
サイト更新完了
```

---

## 各パーツの役割

### ① GitHub Actions（CI/CD）

リポジトリの `.github/workflows/` にある YAML ファイルに「push されたらビルドしてデプロイせよ」という命令が書かれている。これがトリガーになる。

```yaml
on:
  push:
    branches: [main]   # main ブランチへの push を検知して自動起動
```

### ② 静的サイトジェネレーター（例：Astro）

`src/content/blog/*.md` を読み込み、テンプレートと組み合わせて HTML を自動生成する。Markdown をそのまま Web ページに変換してくれる。

```yaml
- name: Build
  run: npm run build   # Astro が .md → HTML に変換
```

### ③ ホスティングサービス（例：GitHub Pages）

生成された HTML を受け取り、世界中からアクセスできる URL で公開する。

```yaml
- uses: actions/deploy-pages@v4   # 生成済み HTML を公開サーバーに配置
```

---

## なぜ .md を置くだけで済むのか

`npm run build`（= Astro のビルド）が `src/content/blog/` 以下の `.md` ファイルをすべて読み込んで HTML に変換するため。

- **開発者がすること** → `.md` を追加して `git push`
- **GitHub Actions がすること** → ビルド〜公開を全自動実行

---

## 技術スタックの選択肢

| パーツ | 今回の実装 | 別の選択肢 |
|--------|-----------|-----------|
| ① CI/CD | GitHub Actions | Vercel CI、CircleCI など |
| ② SSG | Astro | Next.js、Hugo、Jekyll など |
| ③ ホスティング | GitHub Pages | Vercel、Netlify、Cloudflare Pages など |

GitHub Pages の場合、「リポジトリ管理」「CI実行」「ホスティング」がすべて GitHub 内で完結する。
Vercel を使う場合は ③ だけ外部サービスに切り出す形になるが、役割の定義は同じ。
