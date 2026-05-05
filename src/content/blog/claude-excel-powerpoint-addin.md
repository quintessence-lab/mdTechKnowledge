---
title: "Claude for Excel / PowerPoint アドイン解説 — 会話コンテキスト共有とMicrosoft Copilotとの違い"
date: 2026-04-29
updatedDate: 2026-05-06
category: "Claude技術解説"
tags: ["Claude", "Microsoft Excel", "Microsoft PowerPoint", "アドイン", "Copilot", "比較"]
excerpt: "Claude for Excel/PowerPointアドインの解説。会話コンテキスト共有・Outlook対応予定・金融サービス向け10エージェントテンプレート（2026年5月発表）・13社の業界データMCPコネクタ・Microsoft Copilotとの使い分けを整理。"
draft: false
---

AnthropicはMicrosoft Officeへの統合を急速に進めており、2026年4月時点ではWord・Excel・PowerPointの3アプリすべてでClaudeアドインが利用可能となった。本稿ではそのうちExcel・PowerPoint向けアドインに焦点を当て、2026年3月に追加された**会話コンテキスト共有**機能、インストール方法、ユースケース、Microsoft Copilotとの使い分けを整理する。

---

## Claude for Excel / PowerPoint アドインとは

Claude for Excel および Claude for PowerPoint は、AnthropicがMicrosoft AppSource（Office アドインマーケットプレース）で提供する公式アドイン。Excel・PowerPointの作業ペイン（タスクペイン）にClaudeのチャットUIを表示し、自然言語で指示を出すことでスプレッドシート操作やスライド生成を直接実行できる。

| アドイン | 初回提供 | Pro展開 | 主要モデル |
|---|---|---|---|
| Claude for Excel | 2025年10月（Max・Enterprise向けベータ） | 2026年1月24日 | Sonnet 4.5 / Opus 4.6 |
| Claude for PowerPoint | 2026年2月5日（Max・Team・Enterprise） | 2026年2月20日 | Sonnet 4.5 / Opus 4.6 |
| Claude for Word（参考） | 2026年4月13日 | 同時 | 同上 |

Excel・PowerPointとも**Windows / Mac / Web版に対応**しており、Office内に常駐するパネルとして利用する。

---

## 2026年4月の主要アップデート（会話コンテキスト共有）

2026年3月11日にAnthropicが投入した最大の機能改善が、**Excel・PowerPoint間の会話コンテキスト共有（Shared Context）**である。リリースノートには以下のように記述されている。

> "share the full context of your conversation, so every action Claude takes in one application is informed by everything that's happened in the other."

### 何が変わったか

これまではExcelとPowerPointのアドインがそれぞれ独立した会話セッションを持っており、Excelで実施した分析結果をPowerPointで参照させたい場合は、ユーザーが手動でデータをコピーして貼り付けるか、再度プロンプトで説明し直す必要があった。3月のアップデート以降は以下が可能になった。

- **会話履歴の引き継ぎ**: Excelでの会話・データ参照・分析結果をPowerPoint側のClaudeが自動参照
- **データ参照の継続**: Excelで分析対象としたピボットテーブル・セル範囲をPowerPointから言及可能
- **双方向**: PowerPoint→Excelの方向にも同様にコンテキストが流れる

### 同時投入された関連機能

| 機能 | 内容 |
|---|---|
| **Skills** | 再利用可能なワークフローをワンクリック実行（例：月次レポート定型処理） |
| **MCP Connectors** | Model Context Protocol経由で社内ツールやデータソースに接続 |
| **LLM ゲートウェイ対応** | Amazon Bedrock / Google Cloud Vertex AI / Microsoft Foundry経由でのデプロイをサポート |

エンタープライズ環境ではClaudeアカウントを個別発行せずに、既存のクラウド契約（Bedrock等）経由でモデルへ接続できるようになった点が大きい。

---

## 2026年5月のアップデート（金融サービス向けエージェント群・Outlook対応）

2026年5月5日（PT）にAnthropicは金融サービス業界向けの大型拡張を発表。M365統合の範囲がさらに拡大し、業種特化エージェントとデータMCPコネクタが加わった。

### Outlook対応（coming soon）

これまでのClaude M365アドインは Excel・PowerPoint・Word の3アプリに限られていたが、**Outlookが次の対応アプリとして発表された**（coming soon）。実現すれば、Excel→PowerPoint→Word→Outlookの4アプリ間でシームレスに会話コンテキストが引き継がれるM365全体統合が完成する。

### 金融サービス向け10エージェントテンプレート

Anthropicは業務ドメイン別の10エージェントテンプレートを提供開始した。各テンプレートは Claude Cowork Plugin・Claude Code Plugin・Managed Agents cookbook の3形態から組み合わせて利用できる。

| エージェント | 業務用途 |
|---|---|
| Pitch Builder | 提案書・投資家向け資料の自動生成 |
| Meeting Preparer | 会議資料・アジェンダの準備 |
| Earnings Reviewer | 決算資料の分析・サマリー |
| Model Builder | 財務モデリングの補助 |
| Market Researcher | 市場調査・競合分析 |
| KYC Screener | 顧客審査（Know Your Customer）支援 |
| Valuation Reviewer | バリュエーション資料レビュー |
| General Ledger Reconciler | 総勘定元帳の照合・突合 |
| Month End Closer | 月次決算処理の自動化 |
| Statement Auditor | 財務諸表の監査補助 |

### 金融データMCPコネクタ

業界データへの接続を担うMCPコネクタが13社分追加された。既存の汎用MCP Connectorsと組み合わせることで、外部データソースをコンテキストとしてエージェントに自動供給できる。

| プロバイダー | データ内容 |
|---|---|
| Moody's MCP app | 60億社超のクレジットデータ |
| Dun & Bradstreet | 企業信用情報 |
| Guidepoint | エキスパートネットワーク |
| IBISWorld | 業界調査レポート |
| Verisk | リスク・保険データ |
| FactSet | 金融マーケットデータ |
| S&P Capital IQ | 企業財務・M&A情報 |
| MSCI | ESG・リスク分析 |
| PitchBook | VC・PE投資データ |
| Morningstar | 投資リサーチ |
| Chronograph | プライベートキャピタルデータ |
| LSEG | マーケット・取引データ |
| Daloopa | 財務モデル自動入力 |

### Vals AI Finance Agent Benchmark

Vals AI が公開した Finance Agent benchmark において、Claude Opus 4.7が**64.37%**のスコアでトップを記録。金融ドメインの実務タスクにおけるモデル性能が第三者評価でも確認された。

---

## インストール・セットアップ方法

### 個人・チームでのインストール

1. Excel または PowerPoint を起動
2. リボンの **[挿入] → [アドインを取得]** をクリック
3. AppSource検索ボックスで **「Claude by Anthropic」** を検索
4. **Claude for Excel** または **Claude for PowerPoint** を選択して **[追加]**
5. 起動したタスクペインで **[Sign in]** をクリックし、Claudeアカウント（Pro / Max / Team / Enterprise）でログイン

または、Microsoft AppSourceのClaude for Excel / Claude for PowerPointの製品ページから **[今すぐ入手]** を選択しても同じ流れになる。

### 必要な前提

| 項目 | 要件 |
|---|---|
| Microsoft 365 サブスクリプション | 必須（永続ライセンス版Officeでは動作不可） |
| Claudeプラン | Pro（$20/月）以上。Free プラン不可 |
| 対応OS | Windows / macOS / Web版Office |
| 認証 | Anthropic アカウントでのOAuth認証 |

### エンタープライズ集中配信

組織として全社展開する場合は、Microsoft 365 管理センターの **[統合アプリ]** から **集中展開（Centralized Deployment）** を使う。指定したセキュリティグループのユーザーに対して、Claudeアドインを自動インストールできる。

---

## ユースケース例

### Excel × PowerPoint コンテキスト共有を活かすパターン

#### パターン1：四半期業績レビュー

1. **Excel側**: 四半期売上データに対して「事業部別の前年同期比を計算し、トップ3とワースト3を特定して」と指示
2. **PowerPoint側**: 同じ会話を継続したまま「いまの分析結果を経営会議用のサマリースライドにして。表紙＋エグゼクティブサマリー＋事業部別グラフ＋アクション提案の構成で」と指示
3. **結果**: Claude が Excel での分析根拠を引用しつつスライドを生成。元データへの参照リンクも保持

#### パターン2：財務モデルからの提案資料

1. **Excel側**: 多シート構成の財務モデルに対して「IRRが最大化されるシナリオを提示して」と分析依頼
2. **PowerPoint側**: 「このシナリオを投資委員会向けに3枚で説明する資料を作って。前提・感応度分析・推奨アクション」
3. **結果**: モデルの計算ロジックを踏襲したスライドが生成されるため、再説明・再計算が不要

#### パターン3：データクレンジング後の報告

1. **Excel側**: 顧客マスタの重複・欠損を検出して修正（数式・参照は保持されたまま）
2. **PowerPoint側**: 「実施したクレンジング内容と、影響を受けたレコード件数の内訳を1枚にまとめて」
3. **結果**: Excel側の操作履歴を反映した報告スライドを自動生成

### Excel単体のユースケース

- ピボットテーブルの編集・条件付き書式の適用（2026年2月のOpus 4.6統合で対応）
- 破損数式の修復・複雑関数の説明
- 複数シートにまたがるデータの整合性チェック

### PowerPoint単体のユースケース

- スライドマスター・レイアウト・フォント・配色を読み取り、ブランドガイドラインに沿ったスライドを自動生成
- 既存スライドのリライト・翻訳
- スピーカーノートの自動生成

---

## Microsoft Copilot for Microsoft 365 との比較

両者は競合するように見えるが、設計思想と統合粒度が異なる。

| 比較項目 | Claude for Excel/PowerPoint アドイン | Microsoft 365 Copilot（Agent Mode含む） |
|---|---|---|
| **提供元** | Anthropic（AppSourceアドイン） | Microsoft（OS/Officeネイティブ） |
| **モデル** | Claude Sonnet 4.5 / Opus 4.6（選択可） | GPT-5系 / Claude（CopilotのモデルピッカーでAnthropicも選択可） |
| **前提ライセンス** | Microsoft 365 + Claude Pro以上（$20/月〜） | M365 Copilotライセンス（$30/ユーザー/月）または E7 |
| **会話コンテキスト共有** | Excel⇔PowerPoint⇔Word間で共有、Outlook対応予定 | Work IQが Outlook / Teams / Excel / OneDrive / SharePoint を横断 |
| **横断範囲** | Excel・PowerPoint・Word（Outlook coming soon） | M365全アプリ＋Microsoft Graph全体 |
| **対応ファイル** | 現在開いているブック・プレゼン | OneDrive / SharePoint上の他ファイル参照可 |
| **エージェント実行** | 単一会話内のマルチターン＋業種別10エージェントテンプレート | Copilot Cowork：長時間自律実行・スケジューラ連携 |
| **エンタープライズ接続** | Bedrock / Vertex AI / Microsoft Foundry経由可 | Azure OpenAI / Microsoft Foundry |
| **データ境界** | Anthropic基盤（EU境界対象外） | M365データ境界に準拠（Copilot Coworkを除く） |
| **GCC / 政府クラウド** | 未対応 | Copilot本体は対応、Cowork部分は未対応 |
| **監査ログ** | 未提供（既知の制限） | M365監査ログに統合 |

### 使い分けの目安

- **Claude アドインが向くケース**
  - Anthropicモデル（Opus 4.6）の推論力をExcel・PowerPointに直接持ち込みたい
  - 既にClaude Pro / Max / Team / Enterpriseを利用しており、追加コスト最小で始めたい
  - Excel→PowerPoint の縦の流れ（分析→資料化）が業務の中心
  - Bedrock / Vertex AI 経由で社内ガバナンスを通したい
  - 金融業務でPitch Builder・Earnings Reviewer・KYC Screener等の業種別エージェントを活用したい

- **Microsoft Copilotが向くケース**
  - Outlook・Teams・SharePoint を含む M365 全体を横断するエージェントが必要
  - 長時間・多段階の自律実行（Copilot Cowork）を活用したい
  - 既存のM365データ境界・監査基盤を維持したまま運用したい
  - 政府クラウドや EU データ境界対象の業務を含む

両者は併用も可能で、実務ではExcel・PowerPointの細かい編集はClaudeアドイン、Outlook・Teams連携やコラボレーションはMicrosoft Copilot、と棲み分けるパターンが現実的である。

---

## 価格・プラン要件

### Claude側の必要プラン

| プラン | 月額 | アドイン利用 | 備考 |
|---|---|---|---|
| Free | $0 | ❌ | アドイン利用不可 |
| **Pro** | $20/月 | ✅ | Sonnet 4.5中心。Opus 4.6は使用上限の対象 |
| **Max** | $100〜200/月 | ✅ | 高頻度利用向け。Opus 4.6を多用可 |
| **Team** | $30/ユーザー/月 | ✅ | 5ユーザー以上の組織向け |
| **Enterprise** | 個別見積 | ✅ | SSO・監査・データ保持ポリシー対応 |

### 補足コスト

- **Microsoft 365側のコスト**: Microsoft 365 Personal / Family / Business / E3 / E5 などのいずれかが別途必要
- **Bedrock / Vertex AI / Foundry経由の場合**: 各クラウドの従量課金（Claudeトークン課金）

### 過去の促進策

2026年3月19日まで、PowerPointアドイン使用時の使用上限を全有料プランで2倍にする促進キャンペーンが実施された（現在は通常上限）。

---

## 制限事項・既知の課題

### 機能面の制限

| 制限 | 内容 |
|---|---|
| **ファイルサイズ** | 30MB上限。埋め込み動画・大量画像を含む大型プレゼンは超過する可能性 |
| **使用上限** | PowerPointでの利用は通常のClaude使用上限を消費。Opus 4.6はSonnet 4.5より大幅に消費が早い |
| **永続ライセンス版Office** | 非対応（Microsoft 365 サブスクリプションが必須） |
| **コンテキスト共有の境界** | Outlook対応はcoming soon、他Microsoftアプリへの拡張は今後予定 |
| **マルチファイル参照** | 開いているブック・プレゼン以外への自動アクセスは不可 |

### エンタープライズ運用の課題

- **監査ログ未提供**: 管理者が組織内のアドイン使用状況をコンプライアンス基盤から追跡できない
- **データ境界**: Anthropic基盤で推論されるため、M365データ境界の範囲外。EU・UK・政府クラウド要件への適合は組織側の判断が必要
- **Copilot既存契約との重複**: Copilotライセンスを持つユーザーに対して、ClaudeアドインとCopilot両方の使用許諾・データ取扱いの整合を取る必要がある

### 今後の動向

- **Outlook対応（coming soon）**: Excel・PowerPoint・Wordに続き4つ目のM365アプリ統合。実現でWord→Outlook間の会話コンテキスト引き継ぎが完成
- **金融サービス向け拡張**: 2026年5月発表の10エージェントテンプレートおよび13社の金融データMCPコネクタにより、会計・リサーチ・審査業務での活用が本格化
- MCP Connectors の拡充により、社内データソース（CRM・ERP・BI）からのプル型コンテキスト統合が進む見通し
- 監査ログ・DLP連携などエンタープライズ運用機能は後追い実装の段階

---

## まとめ

Claude for Excel / PowerPoint アドインは、2026年3月のShared Context導入によって**「分析→資料化」の縦の業務フローを単一会話で完結させられる**ツールに進化した。2026年5月にはOutlook対応（coming soon）と金融サービス向け10エージェントテンプレート・13社の業界データMCPコネクタが加わり、金融業務における活用の幅が大きく広がっている。Microsoft Copilotが M365全体を横断するエージェント基盤として位置づけられるのに対し、Claudeアドインは**Officeアプリ内の高品質な編集体験と業種別エージェント**に特化している。Pro プラン（$20/月）から始められる導入容易性も合わせ、特に資料作成・財務分析・コンサルティング業務との親和性が高い。一方で監査ログ未提供・ファイルサイズ上限・データ境界などエンタープライズ要件には注意が必要で、組織導入時はMicrosoft Copilotとの併用・棲み分け設計を前提に検討するのが現実的である。