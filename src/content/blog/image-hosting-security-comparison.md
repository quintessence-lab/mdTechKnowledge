---
title: "画像ホスティングサービス セキュリティ比較 — Cloudinary / ImgBB / GitHub Pages"
date: 2026-04-11
updatedDate: 2026-04-11
category: "その他技術"
tags: ["セキュリティ", "画像ホスティング", "Cloudinary", "GitHub Pages", "静的サイト", "GitHub Actions"]
excerpt: "静的サイト用の画像ホスティング3サービスをセキュリティ観点で比較。HTTPS・認証・EXIF・アクセス制御・プライバシーなど8項目で評価。Cloudinary + GitHub Pages連携構成図付き。"
draft: false
---

## サービス概要

| 項目 | Cloudinary | ImgBB | GitHub Pages（リポジトリ内） |
|---|---|---|---|
| 種別 | クラウド画像管理プラットフォーム | 画像ホスティングサービス | 静的サイトホスティング |
| 無料枠 | 25GB容量 / 月25GB転送 | 実質無制限 | リポジトリ1GB / 月100GB転送 |
| 画像最適化 | URLパラメータでリサイズ・フォーマット変換・画質調整 | なし | なし |
| API | あり（無料プランでも利用可） | Pro版のみ | Git操作で管理 |

## セキュリティ比較

### 1. 通信の暗号化（HTTPS）

| サービス | 対応状況 |
|---|---|
| Cloudinary | 全通信HTTPS対応 |
| ImgBB | HTTPS対応 |
| GitHub Pages | HTTPS標準対応。カスタムドメインもLet's Encryptで自動対応 |

3サービスともHTTPS対応済み。この点での差はない。

### 2. セキュリティ認証

| サービス | 認証 |
|---|---|
| Cloudinary | **SOC 2 Type II**（Deloitte監査）、**ISO 27001**取得。年次ペネトレーションテスト、Bugcrowdバグバウンティ実施 |
| ImgBB | **認証なし** |
| GitHub Pages | **SOC 2 Type II**、**ISO 27001** 取得（GitHub全体として） |

Cloudinary と GitHub は第三者監査を受けたエンタープライズ級のセキュリティ体制。ImgBB はセキュリティ認証が確認できない。

### 3. 運営元の信頼性

| サービス | 運営情報 |
|---|---|
| Cloudinary | 2012年イスラエル創業。2022年にBlackstoneから1億ドル超の投資、評価額20億ドル。Salesforce Venturesも出資 |
| ImgBB | メキシコ拠点とされるが、WHOIS情報は非公開で運営者の特定が困難。Cheveretoベースで構築 |
| GitHub Pages | Microsoft傘下（2018年買収）。世界最大のソースコードホスティング |

ImgBBは運営の透明性に課題がある。Cloudinary・GitHubは資金力・組織規模ともに安定している。

### 4. EXIF メタデータの扱い

| サービス | EXIF処理 |
|---|---|
| Cloudinary | **変換適用時に自動除去**（位置情報の自動除去設定も可能） |
| ImgBB | **デフォルト保持**（アカウント設定で無効化可能だが自動除去ではない） |
| GitHub Pages | **自動除去なし**（アップロード前に手動除去が必要） |

EXIF にはGPS位置情報や撮影機器情報が含まれる。Cloudinary は変換パラメータ使用時に自動除去されるため、意図せず位置情報が公開されるリスクが低い。ImgBB と GitHub Pages ではユーザー側で事前除去が必要。

### 5. アクセス制御

| サービス | 非公開設定 |
|---|---|
| Cloudinary | 署名付きURL、トークン認証、Cookie認証、IP制限で非公開設定可能 |
| ImgBB | 限定的（パスワード保護不可） |
| GitHub Pages | 不可（public リポジトリは完全公開） |

機密性の高い画像を扱う場合はCloudinaryが最も柔軟。ただし公開サイトの画像であれば、いずれのサービスでも実運用上の差は小さい。

### 6. プライバシーポリシー

| サービス | 準拠規格 |
|---|---|
| Cloudinary | GDPR・CCPA/CPRA準拠。EU-US Data Privacy Framework認定 |
| ImgBB | DNTシグナル非対応。第三者によるデータ収集はImgBBのポリシー対象外と明記 |
| GitHub Pages | GitHubプライバシーステートメントに準拠。データは主に米国で保管 |

ImgBBのプライバシーポリシーには、第三者へのデータ共有に関する免責条項があり、プライバシー意識の高い用途には不向き。

### 7. 過去のセキュリティインシデント

| サービス | インシデント |
|---|---|
| Cloudinary | 特記すべきインシデントなし |
| ImgBB | 約33,960件の認証情報がリーク記録に存在（主にユーザー側マルウェアが原因）。マルウェアがImgBBを悪用してスクリーンショットを外部送信する事例も報告 |
| GitHub Pages | 特記すべきインシデントなし |

ImgBB自体のサーバーが侵害されたわけではないが、マルウェアの悪用プラットフォームとして利用されている実態がある。

### 8. サービス継続性

| サービス | リスク評価 |
|---|---|
| Cloudinary | 大型投資を受けており安定。ただし非上場企業 |
| ImgBB | 不透明。サービス終了時に全画像リンクが切れるリスクあり |
| GitHub Pages | Microsoft傘下で安定性は高い。Gitリポジトリなのでデータ移行も容易 |

## 総合評価

| 評価軸 | Cloudinary | ImgBB | GitHub Pages |
|---|---|---|---|
| セキュリティ認証 | ◎ | × | ◎ |
| 運営の透明性 | ◎ | △ | ◎ |
| EXIFの安全性 | ◎ | △ | △ |
| アクセス制御 | ◎ | △ | × |
| プライバシー | ◎ | △ | ○ |
| インシデント履歴 | ◎ | △ | ◎ |
| サービス継続性 | ○ | △ | ◎ |
| 画像最適化 | ◎ | × | × |
| 手軽さ | ○ | ◎ | ◎ |

## 推奨

- **本格運用・セキュリティ重視** → **Cloudinary** が最適。EXIF自動除去、画像最適化、エンタープライズ級のセキュリティ認証を備える
- **画像が少量で外部依存を避けたい** → **GitHub リポジトリ内配置**。EXIF は事前に手動除去すること
- **ImgBB** は手軽だがセキュリティ・信頼性に課題があり、ビジネス用途では推奨しない

## Cloudinary + GitHub Pages 連携構成図

Cloudinary を画像CDNとして利用し、Astro + GitHub Actions + GitHub Pages で静的サイトを運用する場合の全体像を示す。

### データフロー

```
┌──────────┐         ┌──────────────┐
│  管理者   │──(1)──▶│  Cloudinary  │
│ (ブラウザ) │  画像を  │  (クラウド)   │
└──────────┘ アップ   │              │
              ロード   │  画像を保存・  │
                      │  変換・配信   │
                      └──────┬───────┘
                             │
                        画像URL発行
                  (例: res.cloudinary.com/
                    motenashi/image/...)
                             │
                             ▼
┌──────────┐         ┌──────────────┐
│  管理者   │──(2)──▶│  GitHub リポ  │
│ (エディタ) │  MDに   │              │
└──────────┘ URL貼付  │ content/     │
                      │  sample.md   │
                      └──────┬───────┘
                             │
                        (3) git push
                             │
                             ▼
                      ┌──────────────┐
                      │GitHub Actions│
                      │              │
                      │ astro build  │
                      │  → HTML生成   │
                      └──────┬───────┘
                             │
                        (4) デプロイ
                             │
                             ▼
                      ┌──────────────┐
                      │ GitHub Pages │
                      │  (静的HTML)   │
                      └──────┬───────┘
                             │
                        (5) ユーザーがアクセス
                             │
                             ▼
┌──────────┐         ┌──────────────┐
│ サイト    │◀───────│  ブラウザ     │
│ 閲覧者   │  HTMLを  │  HTMLを取得   │──(6)──▶ Cloudinary
└──────────┘  表示    └──────────────┘  画像を    から画像を
                                       直接取得    高速配信
```

### 各ステップの説明

| ステップ | 内容 |
|---------|------|
| **(1)** | CloudinaryのダッシュボードまたはAPIで画像をアップロード |
| **(2)** | 発行されたURLをMarkdownの `image` フィールドに記載 |
| **(3)** | GitHubにpush |
| **(4)** | GitHub Actionsが `astro build` を実行し、GitHub Pagesにデプロイ |
| **(5)** | 閲覧者がサイトにアクセスし、HTMLを取得 |
| **(6)** | HTML内の `<img src="res.cloudinary.com/...">` をブラウザがCloudinaryのCDNから直接取得 |

### この構成のメリット

- **GitHubリポジトリに画像ファイルを保存しない** — リポジトリが軽量に保たれる
- **画像はCloudinaryのCDNから配信** — 高速配信、自動リサイズ・フォーマット変換が可能
- **MDファイルにはURLだけ記載** — コンテンツとアセットの分離

### Markdownでの記載例

```markdown
---
name: "サンプルレストラン"
image: "https://res.cloudinary.com/motenashi/image/upload/w_800,q_auto,f_auto/restaurant/photo.jpg"
---
```

URLパラメータ（`w_800,q_auto,f_auto`）を付与するだけで、サーバー側でリサイズ・最適化が自動適用される。

## Cloudinary 利用時のURL例

```
https://res.cloudinary.com/<Cloud Name>/image/upload/w_800,q_auto,f_auto/motenashi/temiyage/toraya-yokan.jpg
```

| パラメータ | 意味 |
|---|---|
| `w_800` | 幅800pxにリサイズ |
| `q_auto` | 画質を自動最適化 |
| `f_auto` | WebP/AVIFなど最適フォーマットに自動変換 |
| `c_fill,ar_5:3` | 5:3比率でクロップ（カード表示用） |
