---
title: "Claude Code ターミナルUI アーキテクチャ解説"
date: 2026-04-03
category: "Claude技術解説"
tags: ["Claude Code", "ターミナルUI", "React", "Ink", "ANSI", "Buddy"]
excerpt: "Claude Codeの起動バナーやBuddyコンパニオンの描画技術。React+Ink+Yogaによるレンダリングパイプラインを解説。4月14日Desktop版リデザインとの関係も追記。"
draft: false
---

**最終更新**: 2026-04-16

Claude Codeの起動時に表示されるASCIIアートバナーや、Buddy（Cinder）コンパニオンの描画がどのような技術で実現されているかを解説する。

> **2026年4月14日のDesktopリデザインについて**: 本記事はCLI版（`claude`コマンド）のターミナルUIアーキテクチャを解説しています。Desktop版（code.claude.com / Mac・Windowsアプリ）は4月14日にIDE型ワークスペースに全面リデザインされましたが、CLI版のReact+Ink+Yogaベースのレンダリングパイプラインには変更ありません。Desktop版の変更点は末尾の「Desktop版リデザインとの関係」セクションを参照してください。

## 描画アーキテクチャ概要

Claude Codeのターミナル表示は、Web開発で馴染みのあるReactベースのレンダリングパイプラインで構成されている。

```
React コンポーネント
    ↓
カスタム React Reconciler（Ink ライブラリ）
    ↓
Yoga レイアウトエンジン（Flexbox）
    ↓
スクリーンバッファ（2D セルグリッド / ダブルバッファリング）
    ↓
ANSI エスケープシーケンス → ターミナル出力
```

### 各レイヤーの役割

| レイヤー | 技術 | 役割 |
|---|---|---|
| UIコンポーネント | React | `LogoV2` 等のウェルカムバナー、入力UI |
| レンダラー | Ink（カスタム React Reconciler） | React の仮想DOMをターミナル用に変換 |
| レイアウト | Yoga（Facebook製） | Flexboxベースのレスポンシブ配置 |
| バッファ | 2Dセルグリッド | ダブルバッファリングによるちらつき防止 |
| 出力 | ANSIエスケープコード | 色・装飾・カーソル制御 |

### 要素タイプ

Inkが扱うターミナル専用の要素タイプ:

- `ink-root` — ルート要素
- `ink-box` — Flexboxコンテナ（`<div>`相当）
- `ink-text` — テキスト表示（`<span>`相当）
- `ink-virtual-text` — 仮想テキストノード
- `ink-link` — ターミナルハイパーリンク（OSC 8対応）
- `ink-progress` — プログレスバー
- `ink-raw-ansi` — 生のANSIシーケンスを直接出力

## 色・グラデーション表現

### ANSI カラーシステム

ターミナルでの色表現はANSIエスケープシーケンスを使用する。Claude Codeでは効率化のために3つのデデュプリケーションプールを実装している。

| プール | 役割 |
|---|---|
| **CharPool** | 文字列の重複排除。整数IDによるO(1)比較を実現 |
| **StylePool** | ANSIスタイル遷移を事前計算。色変更時のエスケープコード生成を最適化 |
| **HyperlinkPool** | OSC 8 URLの重複排除 |

### グラデーション処理

起動バナーの虹色表現には、以下の手法が使われている:

- **gradient-string** ライブラリによる色の補間処理
- 文字単位でANSIカラーコードを適用
- 水平・垂直・対角方向のグラデーションをサポート
- 13種類のカラーパレット（sunset, ocean, fire, forest, gold, nebula, matrix 等）

## フレームレンダリング

描画はフレームループで管理される:

1. React の state 更新がトリガー
2. Ink が再レンダリングを実行
3. Yoga がレイアウトを再計算
4. 新しいスクリーンバッファを生成
5. 前フレームとの差分のみANSI出力
6. **30fps にスロットリング**して過剰な描画を防止

ダブルバッファリングにより、画面のちらつきを防止しつつスムーズなアニメーションを実現している。

## 起動シーケンス

Claude Codeの起動時は以下の順序で処理が進む:

```
main.tsx
  → init()
  → loadAuth()         # 認証情報の読み込み
  → loadGrowthBook()   # フィーチャーフラグの読み込み
  → checkQuota()       # クォータ確認
  → getSystemContext()  # システム情報取得
  → getUserContext()    # ユーザー情報取得
  → getAllBaseTools()   # ツール定義の読み込み
  → launchRepl()       # REPL起動 + LogoV2バナー表示
```

`LogoV2` コンポーネントがReactとして描画され、ASCIIアートのウェルカムバナーが表示される。

## Buddy（Cinder）コンパニオンシステム

### 概要

2026年4月1日にイースターエッグとしてリリースされた `/buddy` コマンドで起動するターミナルペット機能。

### スプライトシステム

| 項目 | 仕様 |
|---|---|
| サイズ | 5行 x 12文字幅 |
| アニメーションフレーム | 3フレーム（アイドル・フィジェット・まばたき） |
| ティックレート | 500ms |
| 目の描画 | `{E}` プレースホルダーでテンプレートに挿入 |

### 種族とレアリティ

- **18種族**がアカウントIDのハッシュから決定論的に生成される
- **5段階のレアリティ**: Common (60%) / Uncommon (25%) / Rare (10%) / Epic (4%) / Legendary (1%)
- 各種族に SNARK（辛辣さ）・PATIENCE（忍耐力）などの属性パラメータ
- 非Commonレアリティには特別な帽子が行0に描画される

### アニメーション制御

- フレーム0: 通常のアイドル状態（最も長く表示）
- フレーム1-2: フィジェット（動き）モーション
- フレーム-1: まばたき

アイドルシーケンスの重み付けにより、フレーム0が支配的に表示され、自然な「生きている」感が演出される。

## バナー表示の設定

`~/.claude/settings.json` に以下を追加するとウェルカムバナーを無効化できる:

```json
{
  "showWelcomeBanner": false
}
```

Buddy のビジュアルや色のカスタマイズは、現時点では公開された設定項目がなく、バイナリに組み込まれた動作となっている。

## 2026年4月のCLI版UI改善

4月のアップデートにより、CLI版にも以下の改善が加えられている:

| 改善点 | 説明 |
|--------|------|
| **`/tui fullscreen`コマンド** | フリッカーフリーのレンダリングモードに切り替え可能 |
| **Write tool差分計算 60%高速化** | タブ・特殊文字を含むファイルでのdiff計算が大幅に改善 |

## Desktop版リデザインとの関係（2026年4月14日）

4月14日にDesktop版（code.claude.com / Mac・Windowsアプリ）がIDE型ワークスペースに全面リデザインされた。CLI版とDesktop版のUI技術スタックは異なる。

| 項目 | CLI版（ターミナル） | Desktop版（GUI） |
|------|-------------------|-----------------|
| UIフレームワーク | React + Ink + Yoga | ネイティブGUI（IDE型） |
| レンダリング先 | ANSIターミナル | ウィンドウ（マルチペイン） |
| サイドバー | なし | マルチセッション管理サイドバー |
| ターミナル | ターミナル自体がUI | 統合ターミナル（ペイン内） |
| Diffビューア | インラインテキスト表示 | GUI Diffビューア（再構築済み） |
| ファイルエディタ | なし（外部エディタ連携） | 内蔵ファイルエディタ |
| レイアウト | 全画面ターミナル | ドラッグ&ドロップで自由配置 |
| Buddy | `/buddy`で表示（ASCIIスプライト） | 同様に動作 |

CLI版のReact+Ink+Yogaベースのレンダリングパイプラインは今回のリデザインの影響を受けていない。

## 参考情報

- [Claude Code リポジトリ](https://github.com/anthropics/claude-code)
- [Ink — React for CLIs](https://github.com/vadimdemedes/ink)
- [Yoga Layout Engine](https://yogalayout.dev/)
- [oh-my-logo: ASCII art with gradients](https://github.com/shinshin86/oh-my-logo)
- Claude Code v2.1.88 ソースマップ流出時の解析情報
