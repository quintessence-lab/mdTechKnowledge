---
title: "Git の基本コマンドまとめ"
date: 2024-12-01
category: "Claude技術解説"
tags: ["Git", "バージョン管理", "CLI"]
excerpt: "日常的に使う Git コマンドをまとめました。"
draft: false
---

## はじめに

Git はバージョン管理システムの中で最も広く使われているツールです。

## 基本コマンド

### リポジトリの初期化

```bash
git init
```

### 変更のステージング

```bash
git add .
git add ファイル名
```

### コミット

```bash
git commit -m "コミットメッセージ"
```

### ブランチ操作

```bash
git branch            # ブランチ一覧
git branch 新ブランチ名  # ブランチ作成
git checkout ブランチ名  # ブランチ切替
git merge ブランチ名     # マージ
```

## まとめ

これらのコマンドを覚えておけば、日常的な Git 操作は問題なく行えます。
