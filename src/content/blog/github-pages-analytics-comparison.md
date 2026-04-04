---
title: "GitHub Pages向けアクセス解析 — Google Analytics vs Cloudflare Web Analytics"
date: 2026-04-04
category: "その他技術"
tags: ["GitHub Pages", "Google Analytics", "Cloudflare", "アクセス解析", "比較"]
excerpt: "GitHub Pagesにはアクセスログ機能がない。Google AnalyticsとCloudflare Web Analyticsの2つの選択肢を比較し、データ反映速度・機能・プライバシーの違いを整理。"
draft: false
---

## 前提: GitHub Pagesにログ機能はない

GitHub Pagesは静的ホスティングサービスであり、アクセスログやサーバーログの提供機能がありません。アクセス状況を把握するには、外部のアナリティクスツールをページに埋め込む必要があります。

---

## 主要ツール比較

| 項目 | Google Analytics | Cloudflare Web Analytics |
|------|-----------------|------------------------|
| **料金** | 無料 | 無料 |
| **アカウント** | Googleアカウント必要 | Cloudflareアカウント必要（無料） |
| **導入方法** | JSタグ埋め込み | JSタグ埋め込み |
| **Cookie** | 使用する | **Cookieレス** |
| **プライバシー** | Cookie同意バナー推奨 | GDPR対応不要 |
| **学習コスト** | やや高い（多機能） | 低い（シンプル） |
| **Cloudflare DNS管理** | 不要 | 不要（JSスニペット方式） |

---

## データ反映速度の比較

| レポート種別 | Google Analytics | Cloudflare Web Analytics |
|------------|-----------------|------------------------|
| **リアルタイム** | 数秒〜数分 | — （リアルタイムビューなし） |
| **標準レポート** | **24〜48時間** | **数分〜最大30分** |

Cloudflareはリアルタイムレポート機能こそないものの、標準レポートへの反映がGoogle Analyticsより圧倒的に速い（数分 vs 最大48時間）。

---

## 機能の比較

### Google Analytics が優れている点

| 機能 | 説明 |
|------|------|
| **クリックイベント追跡** | ボタン・リンクのクリックを個別に計測 |
| **コンバージョン追跡** | 目標達成（購入・登録等）を追跡 |
| **UTMパラメータ分析** | 流入元キャンペーンの効果測定 |
| **ユーザー行動フロー** | サイト内の遷移パスを可視化 |
| **リアルタイムレポート** | 現在のアクティブユーザーを秒単位で確認 |
| **セグメント分析** | ユーザー属性別の詳細分析 |
| **カスタムレポート** | 自由な軸でレポートを作成 |

### Cloudflare Web Analytics が優れている点

| 機能 | 説明 |
|------|------|
| **Cookieレス** | ユーザー追跡にCookieを使用しない |
| **GDPR対応不要** | Cookie同意バナーが不要 |
| **高速な反映** | 数分でダッシュボードに反映 |
| **軽量スクリプト** | ページ読み込みへの影響が極小 |
| **シンプルなUI** | 学習コストが低い |

### 共通で確認できる指標

| 指標 | Google Analytics | Cloudflare |
|------|:---:|:---:|
| ページビュー数 | ○ | ○ |
| ユニーク訪問者数 | ○ | ○ |
| リファラー（流入元） | ○ | ○ |
| ページ別PV | ○ | ○ |
| 国・地域 | ○ | ○ |
| デバイス種別 | ○ | ○ |
| ブラウザ種別 | ○ | ○ |

---

## アフィリエイト運用との相性

アフィリエイトを導入する予定がある場合、効果測定に必要な機能はGoogle Analyticsにしかありません。

| 必要な機能 | Google Analytics | Cloudflare |
|-----------|:---:|:---:|
| クリックイベント追跡 | ○ | × |
| コンバージョン追跡 | ○ | × |
| UTMパラメータ分析 | ○ | × |
| ユーザー行動フロー | ○ | × |

アフィリエイトの効果測定が必要なら**Google Analyticsが必須**。両方を併用することも可能です。

---

## どちらを選ぶべきか

### Cloudflare Web Analytics がおすすめ

- シンプルにアクセス数を把握したい
- Cookie同意バナーを出したくない
- すぐにデータを確認したい（高速反映）
- 個人ブログ・技術サイト

### Google Analytics がおすすめ

- アフィリエイトの効果測定が必要
- ユーザーの行動パスを詳細に分析したい
- リアルタイムのアクティブユーザーを確認したい
- ECサイト・ビジネスサイト

### 併用のすすめ

両方を同時に導入することも可能です。Cloudflareで日常的なPV確認を行い、Google Analyticsで詳細分析を行う運用が理想的です。ただし、管理の手間とページ読み込みへの影響（スクリプト2本）を考慮してください。

---

## 導入方法

### Cloudflare Web Analytics

1. [Cloudflareダッシュボード](https://dash.cloudflare.com/)にログイン
2. 「Analytics & Logs」→「Web Analytics」→「Add a site」
3. ドメインを入力し、表示されるJSスニペットをHTMLの `</body>` 前に追加

```html
<!-- Cloudflare Web Analytics -->
<script defer src='https://static.cloudflareinsights.com/beacon.min.js'
  data-cf-beacon='{"token": "your-token-here"}'></script>
<!-- End Cloudflare Web Analytics -->
```

### Google Analytics

1. [Google Analytics](https://analytics.google.com/)にログイン
2. プロパティを作成し、測定IDを取得
3. HTMLの `<head>` 内にスクリプトを追加

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 参考情報

- [Cloudflare Web Analytics 公式](https://www.cloudflare.com/web-analytics/)
- [Google Analytics 公式](https://analytics.google.com/)
