---
title: "Claude Code /ultrareview 完全ガイド — クラウドマルチエージェントによる深掘りコードレビュー"
date: 2026-05-02
updatedDate: 2026-05-02
category: "Claude技術解説"
tags: ["Claude Code", "ultrareview", "コードレビュー", "マルチエージェント", "CICD", "Anthropic"]
excerpt: "2026年4月22日にClaude Code v2.1.111でリリースされた/ultrareviewは、リモートサンドボックス上でエージェントフリートを並列実行し、マージ前に深掘りバグハントを行うコードレビュー機能。基本操作から非対話型CI実行、料金体系、--jsonオプション、/reviewとの使い分けまで網羅的に整理する。"
draft: false
---

## 1. リリース概要

Anthropic は **2026年4月17日リリースの Claude Code v2.1.111** にて、**`/ultrareview`** という新しいコードレビュー機能を投入しました。続く 4月22日の v2.1.113 で起動高速化と diffstat 表示を、4月28日の v2.1.120 では **`claude ultrareview` 非対話型サブコマンド** と **`--json` オプション**を追加し、わずか2週間で CI/CD 連携まで一気通貫で実装が整った形です。公式アカウント @ClaudeDevs による正式アナウンスは 4月22日 に行われました。

| 項目 | 内容 |
|------|------|
| 初出バージョン | Claude Code v2.1.86（先行）／ v2.1.111（正式） |
| 公式発表 | 2026-04-22（@ClaudeDevs） |
| 実行環境 | Claude Code on the web インフラ（リモートサンドボックス） |
| 認証 | Claude.ai アカウントでのログイン必須 |
| 並列エージェント数 | 既定 5、規模に応じて最大 20（公開情報ベースの上限値） |
| 想定実行時間 | 5〜10 分 |
| ステータス | リサーチプレビュー（仕様・価格は変更の可能性あり） |

`/ultrareview` のコンセプトはシンプルで、**「マージ前にもう一段深いレビューを欲しい」というユースケースに特化**したクラウド側オフロードです。ローカルの `/review` がワンパス・即応性重視なのに対し、`/ultrareview` はリモートサンドボックスにリポジトリ状態をアップロードし、**複数のレビューアエージェントが並列でバグハント**します。さらに重要な点として、各エージェントの指摘は**独立した検証エージェントが再現確認**してから返されるため、ノイズが少なくシグナル比が高い結果になります。

```text
[ローカル端末]
    │  /ultrareview <PR#>
    ▼
[Claude Code CLI]
    │  リポ状態をバンドルしてアップロード
    ▼
[クラウドサンドボックス]
    ├─ レビューアエージェント A ─┐
    ├─ レビューアエージェント B ─┤  並列バグハント
    ├─ レビューアエージェント C ─┤
    └─ レビューアエージェント N ─┘
              │
              ▼
    [検証エージェント] ─→ 再現できた指摘のみ採択
              │
              ▼
    findings（bugs.json）
              │
              ▼
[ローカル端末] 通知 / `/tasks` で確認
```

---

## 2. `/review` との使い分け

Claude Code には従来から `/review` コマンドが存在しますが、`/ultrareview` はそれを置き換えるものではなく、**フェーズの異なる二刀流**として併用するのが推奨です。

| 観点 | `/review` | `/ultrareview` |
|------|-----------|----------------|
| 実行場所 | ローカル（あなたのセッション内） | クラウドサンドボックス |
| アプローチ | シングルパス | マルチエージェントフリート＋独立検証 |
| 所要時間 | 数秒〜数分 | おおむね 5〜10 分 |
| コスト | 通常の利用枠を消費 | 無料ラン後は 1 回 $5〜$20（追加課金） |
| 強み | 反復開発中の素早いフィードバック | マージ前の深掘り・誤検知の少ない指摘 |
| 端末リソース | ローカル CPU を使用 | リモート実行で端末は解放される |

要するに、**ループで回している最中は `/review`、マージ直前のチェックポイントで `/ultrareview`** という棲み分けがハマります。特に認証ロジック・DB スキーマ移行・課金/個人情報を扱う処理など「壊したら被害が大きい」変更で `/ultrareview` の真価が出ます。

### 2.1 ユースケース別おすすめ

- **イテレーション中のセルフレビュー**: `/review`
- **マージ前の最終確認 / リリース直前**: `/ultrareview`
- **共有コンポーネントの大規模リファクタ**: `/ultrareview`
- **支払い処理・PII 処理・認可境界の変更**: `/ultrareview`
- **typo・lint 級の軽微な修正**: `/review`（`/ultrareview` はオーバーキル）

---

## 3. 基本的な使い方

`/ultrareview` の起動方法は3パターンあります。

### 3.1 引数なし — 現在ブランチの差分をレビュー

```text
/ultrareview
```

引数を指定しない場合、**現在のブランチとデフォルトブランチ（通常 `main`）の差分**がレビュー対象になります。コミット済み・ステージ済み・未ステージのワーキングツリーすべての変更がバンドルされ、リモートサンドボックスにアップロードされます。

### 3.2 PR 番号指定 — GitHub PR を直接レビュー

```text
/ultrareview 1234
```

PR モードでは、ローカルのワーキングツリーをバンドルする代わりに、**サンドボックス側が GitHub から PR を直接 clone** します。リポジトリには `github.com` リモートが設定されている必要があります。

> **Tip**: ローカルリポジトリが大きすぎてバンドルできない場合は、Claude Code が PR モードへの切り替えを促します。ブランチを push してドラフト PR を立て、`/ultrareview <PR-number>` を呼ぶのが定石です。

### 3.3 ベースブランチ指定（CLI サブコマンド）

CLI サブコマンドでは、レビュー対象の比較先を任意のブランチに指定することもできます。

```bash
claude ultrareview origin/main
```

### 3.4 起動前の確認ダイアログ

`/ultrareview` 実行直後、以下の情報が確認ダイアログに表示されます。

- レビュー対象のスコープ（ファイル数・行数）
- 残りの無料ラン回数
- 推定コスト
- v2.1.113 以降は **diffstat** も表示

確認後、レビューはバックグラウンドで継続するため、セッションは解放されます。途中で `/tasks` を叩けば進行中レビューの状況確認・詳細表示・キャンセルが可能です。**完了時はセッション内に通知が表示**され、各 finding にはファイル位置と説明が付くので、そのまま Claude に修正依頼できます。

---

## 4. 実行モデル — クラウドサンドボックスとエージェントフリート

### 4.1 リモート実行の流れ

`/ultrareview` 起動から findings 返却までを段階的に追うと以下のとおりです。

| ステップ | 処理 | 場所 |
|---------|------|------|
| 1 | リポジトリ状態のバンドル | ローカル |
| 2 | サンドボックスへのアップロード | ネットワーク |
| 3 | レビューアエージェントの並列起動 | クラウド |
| 4 | 各エージェントが独立にバグ探索 | クラウド |
| 5 | 検証エージェントが個別に findings を再現 | クラウド |
| 6 | 再現できた findings のみ集約 | クラウド |
| 7 | `bugs.json` 生成・通知送出 | クラウド → ローカル |

### 4.2 シグナル比を高める「独立検証」

通常のシングルパス AI レビューでは、**「それっぽいが実は問題ではない」誤検知**が混じります。`/ultrareview` では、レビューアエージェントが見つけた疑義を**別の検証エージェントが独立に再現確認**するため、再現性のないものは弾かれます。結果として、「ノイズではなく実バグの候補」が中心になります。

### 4.3 エージェントの並列度

公開情報ベースでは、**規定 5 並列、変更規模に応じて最大 20 並列**まで増えるとされています。各エージェントは観点（ロジック / セキュリティ / パフォーマンス / 並行性 / API 契約 など）を分担し、フリート全体としてカバレッジを稼ぐ設計です。

```text
変更規模（行数）          並列度の目安
─────────────────────────────────────
小（〜200 行）            5 並列前後
中（200〜2,000 行）       8〜12 並列
大（2,000 行〜）          15〜20 並列
```

---

## 5. 出力例とレビュー指摘の質

`/ultrareview` の各 finding は、**ファイル位置・該当箇所・問題の説明・再現性の根拠**がセットで返ります。たとえば認証境界の修正 PR を流すと、以下のような形式で指摘が並びます（イメージ）。

```text
[Finding 1/3] src/auth/session.ts:142
  Problem: Race condition when refreshing tokens concurrently.
  Reproduction: Two concurrent refresh calls observed; second overwrites first
                before the response handler runs, leading to silent token loss.
  Severity: high

[Finding 2/3] src/auth/middleware.ts:88
  Problem: Authorization header is logged at debug level.
  Reproduction: Confirmed via static trace from logger config; PII risk in
                debug-enabled environments.
  Severity: medium

[Finding 3/3] tests/auth/session.test.ts:301
  Problem: Test asserts on Date.now() without clock control; flaky on slow CI.
  Reproduction: Verified by simulated jitter; failure rate ~3%.
  Severity: low
```

各 finding はそのまま Claude に「これを直して」と指示できる粒度になっており、**読んで終わりではなく即パッチ生成に繋げられる**ことが特徴です。

---

## 6. 非対話型実行（CI/CD 連携）

v2.1.120 で **`claude ultrareview [target]` サブコマンド**が追加され、対話型セッションを起動せずに CI / スクリプトから呼べるようになりました。

### 6.1 サブコマンドの使い方

```bash
# 現在ブランチ vs デフォルトブランチ
claude ultrareview

# 特定の PR を対象
claude ultrareview 1234

# 任意のベースブランチとの差分
claude ultrareview origin/main
```

サブコマンドは **対話版と同じレビュー**を実行し、リモートレビュー完了までブロックして待ちます。findings は stdout に整形出力、進捗メッセージとライブセッション URL は **stderr に出る**ため、stdout はパース可能なまま保たれます。

### 6.2 終了コード仕様

| 終了コード | 意味 |
|-----------|------|
| 0 | レビュー完了（findings の有無は問わない） |
| 1 | 起動失敗 / リモートエラー / タイムアウト |
| 130 | Ctrl-C による中断（リモートレビューはそのまま継続） |

中断してもクラウド側は走り続けるので、stderr に出ているセッション URL からブラウザで結果を見にいけます。

### 6.3 主要フラグ

| フラグ | 説明 |
|--------|------|
| `--json` | 整形済み findings の代わりに **生の `bugs.json` を出力** |
| `--timeout <minutes>` | 待機タイムアウト（既定 30 分） |

### 6.4 GitHub Actions サンプル

PR 作成時に自動で `/ultrareview` を流し、findings をアーティファクトに残す例です。

```yaml
name: Ultrareview on PR

on:
  pull_request:
    types: [opened, ready_for_review, synchronize]

jobs:
  ultrareview:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Install Claude Code
        run: npm install -g @anthropic-ai/claude-code

      - name: Authenticate
        env:
          CLAUDE_CODE_OAUTH_TOKEN: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
        run: claude auth status

      - name: Run ultrareview
        id: review
        env:
          CLAUDE_CODE_OAUTH_TOKEN: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}
        run: |
          claude ultrareview "${{ github.event.pull_request.number }}" \
            --json --timeout 20 > bugs.json
        continue-on-error: true

      - name: Upload findings
        uses: actions/upload-artifact@v4
        with:
          name: ultrareview-findings
          path: bugs.json
```

注意点として、**Claude.ai アカウント認証が必要**なため、CI 環境にはトークン（OAuth）を仕込んでおく必要があります。Bedrock / Vertex AI / Microsoft Foundry 経由の Claude Code では `/ultrareview` 自体がサポート対象外であるため、CI 側もこれらの経路では動きません。

---

## 7. `--json` オプションでの結果解析

`--json` を付けると、整形出力の代わりに **`bugs.json` の生ペイロード**が stdout に流れます。これを後段ツールでパースすれば、レビュー結果のダッシュボード化・PR コメント自動投稿・Slack 通知などにそのまま組み込めます。

```bash
claude ultrareview 1234 --json > bugs.json
jq '.findings[] | {file, line, severity, message}' bugs.json
```

簡易な PR コメント投稿スクリプト例:

```bash
claude ultrareview "$PR_NUMBER" --json > bugs.json
COUNT=$(jq '.findings | length' bugs.json)
if [ "$COUNT" -gt 0 ]; then
  BODY=$(jq -r '.findings[] |
    "- `\(.file):\(.line)` (\(.severity)) — \(.message)"' bugs.json)
  gh pr comment "$PR_NUMBER" --body "## ultrareview findings\n\n$BODY"
fi
```

`bugs.json` のスキーマは正式仕様としてはまだ研究プレビュー扱いなので、**フィールド名は今後変更され得る**ことを前提に、薄いラッパーを噛ませておくのが安全です。

---

## 8. 料金体系・無料ラン

`/ultrareview` は**プラン込みの利用枠とは別**に、Extra usage（追加利用）として課金されます。

| プラン | 含まれる無料ラン | 無料ラン超過後 |
|--------|----------------|---------------|
| Pro | 3 回（〜2026-05-05） | Extra usage で課金 |
| Max | 3 回（〜2026-05-05） | Extra usage で課金 |
| Team / Enterprise | なし | Extra usage で課金 |

### 8.1 無料ランの仕様

- **Pro / Max は 3 回まで無料**（試用枠）
- **2026-05-05 を過ぎると無料枠は失効**（継続的な特典ではない）
- **アカウントごとに 1 回限り**の付与でリフィルなし
- 起動した時点で 1 回消費 — **途中停止・失敗でも消化される**

### 8.2 課金後の単価

無料枠を使い切った後は、**変更規模に応じて 1 回あたり $5〜$20** の追加利用課金です。Team / Enterprise は最初から課金対象で、Extra usage 機能を有効化していないとそもそも起動できません（`/extra-usage` で確認・有効化可能）。

| 変更規模 | 想定コスト |
|---------|-----------|
| 数百行 | $5 前後 |
| 数千行 | $10 前後 |
| 数千行〜大規模 | $15〜$20 |

「日常レビューでは `/review`、ここぞの局面で `/ultrareview`」と使い分けることで、コスト効率と品質のバランスが取れます。

---

## 9. ベストプラクティス

### 9.1 流すべき変更

- **認証 / 認可境界の変更** — 1 件のミスがセキュリティ事故に直結
- **DB スキーマ移行 / マイグレーション** — ロールバック困難
- **共有コンポーネント / ユーティリティのリファクタ** — 影響範囲が広い
- **支払い・PII 処理** — 規制要件・法的リスクが高い
- **並行処理 / ロック / トランザクション境界の変更** — レース起因のバグはレビューで気付きにくい

### 9.2 流さなくていい変更

- typo / コメント修正 / フォーマット
- バージョン番号バンプのみの PR
- 自動生成ファイルだけの差分
- すでに `/review` で深く見ており再確認不要な小変更

### 9.3 オーケストレーション

- **PR ドラフト時に手動で 1 回**、レビューア承認後の最終確認でもう 1 回流す、というように**ゲートとして使う**運用が綺麗
- CI で全 PR に強制すると無料枠を瞬殺するため、**ラベル `ultrareview` が付いた PR のみ**で発火させるのが現実的
- `--json` を保存して PR コメントに転記する仕組みを作っておくと、レビュー履歴がリポジトリ内に残り後追いしやすい

### 9.4 findings の捌き方

- finding をそのままセッション内 Claude に渡して**修正パッチを生成**
- severity:high のものから順に潰し、low は別 issue に逃がす
- 検証エージェントが再現できた指摘なので、**「無視してよい指摘」は基本的に少ない**前提で読む

---

## 10. 制限事項

`/ultrareview` には現時点で以下の制限があります。

| 制限 | 内容 |
|------|------|
| 認証経路 | **Claude.ai アカウント必須**。API キーのみのログインでは利用不可。`/login` で Claude.ai 認証へ切替が必要 |
| クラウド経路 | Amazon Bedrock / Google Cloud Vertex AI / Microsoft Foundry 経由の Claude Code では**未対応** |
| ZDR 組織 | Zero Data Retention を有効化した組織は利用不可 |
| リポジトリ規模 | 大きすぎるリポジトリはバンドル不可。PR モードで回避 |
| GitHub 以外 | PR モードは `github.com` リモート前提。GitLab / Bitbucket は **ブランチ差分モード**で代替 |
| 部分findings | 中断した場合、**部分的な findings は返らない**（クラウドセッションはアーカイブ） |
| 仕様の安定性 | リサーチプレビュー扱い、仕様・価格・提供範囲は変更され得る |

特に「クラウド経路 Bedrock / Vertex AI / Foundry 非対応」は、エンタープライズ導入時に効いてくる制約なので注意が必要です。`/ultrareview` だけは Claude.ai 直接利用にする、というハイブリッド運用が必要になるケースもあります。

---

## 11. まとめ

`/ultrareview` は、Claude Code に**「マージ前の深掘りレビュー」という新しい段階**を持ち込みました。ローカルの `/review` がワンパスで素早く反復用なのに対し、`/ultrareview` は**クラウドサンドボックス上のエージェントフリート＋独立検証**という重量級の構成で、誤検知を抑えながら実バグ候補を返してくれます。

- **リリース**: 2026-04-17（v2.1.111）／公式アナウンス 4-22（v2.1.113）
- **CI/CD 連携**: v2.1.120 の `claude ultrareview` サブコマンドと `--json` で完結
- **コスト感**: Pro/Max は 5/5 まで 3 回無料、以降 1 回 $5〜$20
- **使いどころ**: 認証・DB マイグレーション・PII 処理・大規模リファクタなど「壊したら痛い」変更
- **制限**: Bedrock / Vertex / Foundry 経由は不可、ZDR 組織は不可、リサーチプレビュー仕様

`/review` と `/ultrareview` を**「日常レビュー」と「マージ前ゲート」**として併用するのが、現状もっともコスト効率と品質のバランスが取れた運用です。リサーチプレビューゆえに今後仕様変更は入りますが、**マルチエージェント＋独立検証の枠組みそのものは定着方向**と見られ、CI に組み込んでおく価値は十分にあります。

---

## 参考資料

- [Find bugs with ultrareview — Claude Code Docs](https://code.claude.com/docs/en/ultrareview)
- [Claude Code: Ultrareview — Multi-Agent Cloud Code Review (2026) — Pasquale Pillitteri](https://pasqualepillitteri.it/en/news/1301/claude-code-ultrareview-agents-cloud-2026)
- [Anthropic / Claude Code release notes — releasebot.io](https://releasebot.io/updates/anthropic/claude-code)
