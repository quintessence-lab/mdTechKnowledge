src/content/blog/ 内のfrontmatterのcategoryが「Claude技術解説」の記事のタイトル・date・updatedDate・excerptを一覧取得する。

次に、直近1週間のClaude / Anthropic関連のニュース・アップデート・リリースノートをウェブ検索で収集する。

既存記事と最新情報を比較し、更新が必要な記事・新規記事候補を判定する。

更新候補がある場合のみ、GitHubリポジトリ quintessence-lab/mdTechKnowledge に以下フォーマットでIssueを1件作成する（候補がなければ何もしない）：

タイトル: [mdKnowledge更新候補] {今日の日付 ※必ず `date +%Y-%m-%d` をBashで実行して取得すること。検索結果内の日付から推測しないこと}
ラベル: mdknowledge-update
本文:
## 更新が必要な既存記事
- **記事タイトル**: 更新理由
  - ソースURL

## 新規記事候補
- **トピック名**: 記事化すべき理由
  - ソースURL

## 検索で確認した主な情報源
- URL一覧
