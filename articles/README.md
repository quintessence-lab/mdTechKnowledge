# articles/ — Zenn 自動同期専用ディレクトリ

このフォルダは **Zenn の GitHub 連携が読み取る固定ディレクトリ**です（ディレクトリ名 `articles/` は Zenn 仕様で変更不可）。

- 中身は **`scripts/sync-zenn.mjs` が自動生成**します。**手で編集しないでください**（再生成で上書きされます）。
- 掲載する記事の選択は、リポジトリ直下の **`zenn-selection.json`** で行います。
- 生成元は `src/content/blog/<slug>.md`（mdTechKnowledge 本体記事）。Zenn には**全文**を掲載し、末尾に note 全記事への誘導を付けます。
- Astro サイト本体は `src/` 配下なので、このフォルダはサイトのビルドには影響しません（Zenn 専用）。

## 使い方

```bash
# 1) zenn-selection.json に載せたい記事の slug を追加
# 2) 再生成
npm run zenn-sync
# 3) commit & push（push すると Zenn 側に自動反映される）
```
