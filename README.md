# mdTechKnowledge

Markdown で書いた技術ナレッジを公開・共有するための静的サイトです。

## 技術スタック

- [Astro](https://astro.build/) 4.x
- CSS Variables（フレームワーク不使用）
- [Fuse.js](https://www.fusejs.io/) によるクライアント側検索
- GitHub Pages + GitHub Actions による自動デプロイ

## セットアップ

### 前提条件

- Node.js 20.x 以上
- npm

### ローカル開発

```bash
# 依存パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
# → http://localhost:4321/mdTechKnowledge/ で確認

# ビルド
npm run build

# ビルド結果のプレビュー
npm run preview
```

## 記事の追加方法

`src/content/blog/` に Markdown ファイルを作成してください。

### Frontmatter テンプレート

```yaml
---
title: "記事タイトル"
date: 2024-01-01
updatedDate: 2024-01-15  # 任意
category: "カテゴリ名"
tags: ["タグ1", "タグ2"]
excerpt: "記事の概要"       # 任意
draft: false               # true にすると非公開
---
```

## デプロイ

1. GitHub にリポジトリを作成
2. リポジトリの Settings > Pages > Source を「GitHub Actions」に変更
3. `main` ブランチへ push すると自動デプロイされます

## ライセンス

MIT
