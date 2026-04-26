---
title: "Claude Mythos Preview & Project Glasswing — セキュリティ特化LMと重要インフラ防衛プログラム"
date: 2026-04-26
category: "Claude技術解説"
tags: ["Claude", "Mythos", "Glasswing", "セキュリティ", "Anthropic", "重要インフラ"]
excerpt: "Anthropicがセキュリティタスク特化型LM「Claude Mythos Preview」と重要インフラ防衛プロジェクト「Project Glasswing」を発表。能力範囲・想定ユースケース・公開条件・既存Claudeとの差別化を整理。"
draft: false
---

## はじめに

2026年4月7日、Anthropicはサイバーセキュリティ領域に特化した新しい汎用言語モデル「**Claude Mythos Preview**」と、それを重要インフラ防衛に活用するイニシアチブ「**Project Glasswing**」を同時発表しました。Mythosは数十年間人間のレビューと自動テストをすり抜けてきた脆弱性を次々と発見する能力を持ち、Anthropicは「公開しない」という異例の判断を下しています。本記事では、この2つの発表の全体像と技術的・社会的インパクトを整理します。

## 1. Claude Mythos Preview とは

### 公式名称とリリース時期

正式名称は「Claude Mythos Preview」。2026年4月7日にAnthropicの研究組織「red.anthropic.com」を通じて公表されました。情報は事前のデータリーク事件（[Fortune報道](https://fortune.com/2026/03/26/anthropic-says-testing-mythos-powerful-new-ai-model-after-data-leak-reveals-its-existence-step-change-in-capabilities/)）によって部分的に流出していた経緯もあり、Anthropicは社内で「step change（段階的飛躍）」と表現しています。

### セキュリティタスク特化の汎用LM

Mythosは、Claude 3 / Claude 4 / Claude Opus系列とは異なる位置づけの**汎用LM**ですが、その特性は**コンピュータセキュリティタスクに著しく偏っている**点が最大の特徴です。Anthropic公式サイトによれば「全般的に高性能だが、セキュリティ系タスクで特に突出している」と説明されています。

### 既存 Claude モデルとの位置づけ

| モデル | 主な役割 | 公開状況 |
|--------|----------|----------|
| Claude Opus 4.7 | 一般用途・コーディング・推論 | 一般公開（API・claude.ai） |
| Claude Sonnet | バランス型 | 一般公開 |
| Claude Haiku | 軽量・高速 | 一般公開 |
| **Claude Mythos Preview** | **セキュリティ特化** | **限定アクセスのみ・一般非公開** |

Opus 4.6では成功率がほぼ0%だったFirefoxエクスプロイト開発タスクで、Mythos Previewは181回成功するなど、セキュリティ領域では既存モデルから劇的な飛躍を示しています（出典：[red.anthropic.com](https://red.anthropic.com/2026/mythos-preview/)）。

### 主要能力

公式ブログとUK AI Safety Institute（[AISI評価](https://www.aisi.gov.uk/blog/our-evaluation-of-claude-mythos-previews-cyber-capabilities)）の評価によると、Mythos Previewは以下の能力を備えます。

- **ゼロデイ脆弱性発見**：主要OS（Linux、OpenBSD、FreeBSD）、Webブラウザ、暗号ライブラリ、メディア処理系で数千件のゼロデイを発見
- **長年潜伏したバグの検出**：OpenBSDで27年前、FFmpegで16年前のバグを発見
- **エクスプロイト自動生成**：JITヒープスプレイ、KASLR回避、ROPチェーン分割など高度な技法を組み込み、専門家が数週間要する攻撃チェーンを数時間で生成
- **複数脆弱性のチェーニング**：Linux権限昇格で最大4つの脆弱性を自動連結
- **逆エンジニアリング**：クローズドソースバイナリから疑似ソースを再構築
- **ロジック脆弱性の発見**：認証バイパス、CSRFなど従来のファジングでは検出困難なバグの特定
- **SOC支援・脅威分析**：ログ解析、IoC抽出、脅威ハンティングへの応用

スキャン規模は約7,000エントリポイント・数千リポジトリに及び、検出された脆弱性の99%以上は公表時点で未パッチです。

### アクセス・公開条件

Anthropicは**Mythos Previewを一般公開しない方針**を明確にしています。利用は次の3つに限定されます。

1. Project Glasswingの参加組織（後述）
2. オープンソースセキュリティチーム（限定的）
3. Anthropic社内のレッドチーム

将来的には「Cyber Verification Program」によって正規セキュリティ業務従事者の例外承認制度を整備し、危険な出力を遮断するセーフガードの開発後に段階的に拡大する計画です。

## 2. Project Glasswing とは

### 目的

[Project Glasswing](https://www.anthropic.com/glasswing)は「AI時代に世界で最も重要なソフトウェアを守る」ことを掲げる産業横断プログラムです。Mythos Previewが攻撃者の手に渡る前に、防衛側が同等以上の能力を獲得することを目指します。

### 対象範囲

公式発表では以下の重要インフラ領域がカバーされます。

- **電力・エネルギー**：送配電制御システム、SCADA
- **水道**：浄水・配水制御
- **医療**：病院ネットワーク、医療機器ファームウェア
- **金融**：銀行コアシステム、決済ネットワーク
- **通信**：5G/6Gコア、ネットワーク機器
- **クラウド・OS基盤**：主要OS、ブラウザ、ハイパーバイザ
- **オープンソース基盤**：Linux kernel、OpenSSL、FFmpegなど

### パートナーシップ・連携先

ローンチパートナー（[CyberScoop報道](https://cyberscoop.com/project-glasswing-anthropic-ai-open-source-software-vulnerabilities/)）には以下が含まれます。

- **クラウド・プラットフォーム**：Amazon Web Services、Apple、Google、Microsoft
- **ネットワーク・ハードウェア**：Broadcom、Cisco、NVIDIA
- **セキュリティベンダー**：CrowdStrike、Palo Alto Networks、Zscaler
- **金融**：JPMorgan Chase
- **OSS**：Linux Foundation

加えて、重要インフラを支える40以上の組織が追加アクセス権を得ています。

### 財政コミットメント

Anthropicは**最大1億ドルの利用クレジット**と**400万ドルのオープンソースセキュリティ組織への寄付**をコミットしています。

### Mythosとの関係

Glasswingは「Mythosを社会的に責任ある形で活用する枠組み」と位置づけられます。Mythosが発見した脆弱性をGlasswing参加組織が責任ある開示プロセスで修正し、パッチ後最大135日以内に詳細を公表する運用です。SHA-3ハッシュコミットメント形式で証拠を保持し、改ざん不能な発見記録を残します。

## 3. 想定ユースケース

| 領域 | ユースケース |
|------|--------------|
| OSS保守 | Linux kernel、OpenSSLなどの大規模監査 |
| ベンダー製品 | iOS、Android、Windows、macOSの内部脆弱性ハント |
| SOC運用 | アラートトリアージ、脅威ハンティング、IoC生成 |
| 金融セキュリティ | 取引システムのロジック脆弱性検出、不正アクセス検知 |
| 重要インフラ | SCADA・産業制御システム（ICS）のファームウェア解析 |
| 医療機器 | 組み込みファームウェアの暗号実装監査 |
| バグバウンティ補完 | 商用製品の責任ある開示前検証 |

## 4. 倫理・誤用対策

Mythosは「[公開すれば攻撃者を強化しすぎる](https://venturebeat.com/technology/anthropic-says-its-most-powerful-ai-cyber-model-is-too-dangerous-to-release)」とAnthropic自身が判断したモデルです。誤用対策は多層構造になっています。

- **アクセス制限**：APIすら一般公開しない。クラウド経由ではなく隔離環境での利用
- **ネットワーク隔離**：Mythosの実行はオフライン環境で行う運用が推奨
- **ヒトによる検証**：専門セキュリティトリアジャーがバグレポートを検証（成功率98%以内）
- **クローズドソース解析の制限**：対応するバグバウンティが存在する範囲のみ
- **ハッシュコミットメント**：発見証拠の改ざん防止
- **段階的開示**：パッチ後最大135日でディスクロージャ
- **将来のセーフガード**：危険な出力を検出・遮断するフィルタ層を後続Opusモデルに統合予定

## 5. Anthropicのセキュリティ施策との接続

Mythos / Glasswingは独立した発表ではなく、Anthropicの長期的な安全性施策の延長線上にあります。

- **Responsible Scaling Policy（RSP）**：モデルの能力閾値に応じてセーフガードを段階的に強化する枠組み。MythosはRSPで定義される「サイバー能力閾値」を超えたため、限定公開の意思決定がトリガーされたと見られます
- **Constitutional AI**：拒否ポリシーの基盤。攻撃者支援的な出力を遮断
- **AISIなど第三者評価**：UK AISIによる独立評価が実施され、英国政府レベルでの検証が入っています（[CFR論考](https://www.cfr.org/articles/six-reasons-claude-mythos-is-an-inflection-point-for-ai-and-global-security)）
- **Cyber Verification Program**（計画中）：将来の利用者認証制度

## 6. 開発者・企業へのインパクト

### 開発者への影響

- **パッチサイクルの短縮が必須に**：Mythos相当の能力が攻撃者側に出現するまで時間が限られるため、月次パッチでは間に合わない可能性
- **依存ライブラリ監査の重要性増大**：長年潜伏した脆弱性が大量発見されるため、SBOM管理・依存関係追跡が必須
- **シークレット管理の厳格化**：認証バイパス・ロジック脆弱性の発見が容易になるため、設計時点での防御が重要

### 企業への影響

- **自動アップデート前提の運用**：Anthropicは公式に「自動アップデート拡大」を要求
- **インシデント対応自動化**：人手では追従不能な発見スピードに対応するため、SOAR等の整備が必須
- **重要インフラ事業者は早期参加検討**：Glasswingに参加できなかった事業者は、Mythos相当能力が一般化する移行期に脆弱なまま取り残されるリスク
- **AI Bill of Materials（AIBOM）**：自社が利用するAIサービスがMythos的能力を提供しているか、提供しないかの確認

[AEIの論考](https://www.aei.org/technology-and-innovation/anthropics-project-glasswing-is-a-warning-technical-debt-is-now-a-national-security-risk/)は「技術的負債は今や国家安全保障リスクである」と指摘しており、レガシーシステムを抱える組織への警鐘となっています。

## まとめ

Claude Mythos PreviewとProject Glasswingは、AIによるサイバーセキュリティの「攻防均衡」を一気に書き換えるイベントです。Anthropicが「公開しない」という選択をしたこと自体が、AI能力ガバナンスの新たな前例となります。本記事の内容は2026年4月時点で公表されている情報に基づいており、Anthropic公式の[Project Glasswing](https://www.anthropic.com/glasswing)および[red.anthropic.com](https://red.anthropic.com/2026/mythos-preview/)が一次情報源です。今後のCyber Verification Programの詳細や、後続Opusモデルへのセーフガード統合動向に注目する必要があります。

### 参考リンク

- 一次情報：[Claude Mythos Preview（red.anthropic.com）](https://red.anthropic.com/2026/mythos-preview/)
- 一次情報：[Project Glasswing（anthropic.com）](https://www.anthropic.com/glasswing)
- 二次報道：[TechCrunch](https://techcrunch.com/2026/04/07/anthropic-mythos-ai-model-preview-security/)
- 二次報道：[SecurityWeek](https://www.securityweek.com/anthropic-unveils-claude-mythos-a-cybersecurity-breakthrough-that-could-also-supercharge-attacks/)
- 二次報道：[Foreign Policy](https://foreignpolicy.com/2026/04/20/claude-mythos-preview-anthropic-project-glasswing-cybersecurity-ai-hacking-danger/)
- 評価：[UK AISI評価レポート](https://www.aisi.gov.uk/blog/our-evaluation-of-claude-mythos-previews-cyber-capabilities)
- パートナー視点：[CrowdStrike](https://www.crowdstrike.com/en-us/blog/crowdstrike-founding-member-anthropic-mythos-frontier-model-to-secure-ai/) / [Zscaler](https://www.zscaler.com/blogs/company-news/zscaler-anthropic-project-glasswing)
