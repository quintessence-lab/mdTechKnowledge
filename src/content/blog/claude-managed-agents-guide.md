---
title: "Claude Managed Agents 簡易ガイド — アーキテクチャ・比較・ユースケース"
date: 2026-04-08
updatedDate: 2026-07-23
category: "Claude技術解説"
tags: ["Claude", "Managed Agents", "Agent SDK", "Claude Code", "API", "マルチエージェント", "Memory", "Enterprise", "Self-hosted sandboxes", "MCP tunnels", "Cloudflare", "Modal", "Vercel", "Daytona", "Cloudflare Environments", "Webhooks", "microVM", "V8 Isolate", "Scheduled deployments", "Vault環境変数"]
excerpt: "Claude Managed Agentsの3層アーキテクチャ（Session/Harness/Sandbox）、p50 TTFT 60%削減のパフォーマンス改善、Memory機能、Dreaming・Outcomes・Multi-agent orchestration、エンタープライズ向けRBAC・OpenTelemetry、2026年5月19日発表のSelf-hosted sandboxes（Cloudflare/Daytona/Modal/Vercel対応、Public Beta）とMCP tunnels（Research Preview、プライベートネットワーク内MCPサーバーへの outbound-only E2E接続）、料金体系（$0.08/session-hour）、さらに Cloudflare Environments（brain/hands 分離・Linux microVM と V8 Isolate を選択可能・ブラウザ/メール/アウトバウンドプロキシ/Cloudflare Mesh・Workers VPC）の概要までを1ページに整理。"
draft: false
---

<iframe src="/mdTechKnowledge/guides/claude-managed-agents-guide.html" width="100%" height="4000" style="border: none; border-radius: 8px;" loading="lazy"></iframe>

## Managed Agents とは何か

**Claude Managed Agents** は、クラウドホスト型AIエージェントを構築・デプロイするためのAPI群です（2026年4月8日 Public Beta リリース）。サンドボックス実行、チェックポイント、認証情報管理、権限スコーピング、トレーシングなど、本番エージェントに必要なインフラをAnthropicが一括管理します。開発者はエージェントのロジックに集中でき、プロトタイプから本番稼働まで**最大10倍高速**に短縮できます。

2026年4月23日には**Memory機能がパブリックベータへ移行**（全ユーザーに即時提供）し、エンタープライズ向けにはRBAC・グループ支出制限・利用分析・OpenTelemetry連携などの管理機能が追加されました。

2026年5月7日（JST）、Code with Claude SF イベントにて**3つの新機能**が発表されました: セッション間でメモリを自己最適化する **Dreaming**（Research Preview）、成功基準を定義し自律的に再試行する **Outcomes**（Public Beta）、リードエージェントが複数のスペシャリストエージェントを編成する **Multi-agent orchestration**（Public Beta）。

## 3層アーキテクチャ — Session / Harness / Sandbox

Managed Agentsは3つのコンポーネントに分離されており、それぞれ独立してスケール・管理されます。

```
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  📋 Session       │  │  🧠 Harness       │  │  📦 Sandbox       │
│ （セッション）    │  │ （ハーネス）      │  │ （サンドボックス）│
│                  │  │                  │  │                  │
│ 追記専用         │  │ ステートレスな    │  │ コード実行用     │
│ イベントログ     │  │ 推論ループ        │  │ 隔離コンテナ     │
│ 全イベントを     │  │ Claudeモデル呼出  │  │ bash / ファイル  │
│ 永続保存         │  │ ツール選択判断    │  │ Web検索 / MCP    │
│ チェックポイント │  │ コンテキスト管理  │  │ ネットワーク隔離 │
│ 状態復元         │  │ 各ターン独立実行  │  │ 認証トークン分離 │
└──────────────────┘  └──────────────────┘  └──────────────────┘
        ▼                     ▼                     ▼
              ☁️ Anthropic マネージドインフラ
   自動スケーリング・認証保管・エラー回復・統合トレーシング
```

| コンポーネント | 役割 | 特徴 |
|--------------|------|------|
| **Session** | 追記専用イベントログ | 全イベントを永続保存。クラッシュ時もログから状態を完全復元 |
| **Harness** | ステートレスな推論ループ | 各ターンをセッションログから再構築。スケールアウトが容易 |
| **Sandbox** | コード実行コンテナ | ファイルシステム・ネットワーク隔離。**認証トークンはサンドボックス外**で管理 |

従来はセッション・ハーネス・サンドボックスが1つのコンテナに同居しており、クラッシュでセッションデータが消失し、デバッグにもユーザーデータを含むコンテナへの直接アクセスが必要でした。Managed Agentsでは各レイヤーを完全分離し、独立してスケールさせることで、信頼性と安全性を両立しています。

## パフォーマンス改善

3層分離アーキテクチャにより、レイテンシが大幅に改善されました。

| 指標 | 改善幅 |
|------|--------|
| **p50 TTFT**（中央値の初回トークン応答時間） | **60%削減** |
| **p95 TTFT**（95パーセンタイル） | **90%超削減** |

ステートレスなHarnessが必要に応じて並列起動できるため、テールレイテンシ（p95）の改善が特に大きく、ユーザー体験の安定性が向上しています。

## 基本ワークフロー

```
[1. Agent定義] → [2. Environment作成] → [3. Session開始] → [4. Event送信] → [5. 操作/中断]
```

| ステップ | 内容 |
|---------|------|
| **1. Agent定義** | モデル・システムプロンプト・ツール・MCP・スキルを設定 |
| **2. Environment作成** | コンテナ設定、パッケージ、ネットワークを構成 |
| **3. Session開始** | 永続的な実行単位を作成。切断後も状態を維持 |
| **4. Event送信** | ユーザーメッセージを送信し、SSEでリアルタイム応答を受信 |
| **5. 操作 / 中断** | 途中で方向修正可能。状態を失わず中断できる |

## Claude Code / Agent SDK / Managed Agents 比較

### 概要比較

| 項目 | Claude Code | Agent SDK | Managed Agents |
|------|------------|-----------|----------------|
| 分類 | ローカル CLI / クラウド版 | セルフホスト ライブラリ | フルマネージド |
| 特徴 | ターミナルで対話的にコーディング | Python/TypeScript ライブラリ | API定義 → Anthropicが実行 |
| 実行環境 | ローカル or クラウドサンドボックス | 自前サーバー | Anthropicクラウド |
| カスタマイズ | CLAUDE.md | 細かいアーキテクチャ制御 | Console統合トレーシング |
| 料金 | トークン課金のみ | トークン + 自前インフラ費 | トークン + $0.08/セッション時間 |

### 詳細比較テーブル

| 比較項目 | Claude Code | Agent SDK | Managed Agents |
|---------|------------|-----------|----------------|
| 実行環境 | ローカル / クラウドサンドボックス | 自前サーバー | Anthropicクラウド |
| インフラ管理 | 不要（ローカル） | 自前で必要 | ✓ 完全マネージド |
| 長時間タスク | △ セッション限定 | △ 自前で構築 | ✓ 数時間〜対応 |
| チェックポイント | — | 自前実装 | ✓ 自動保存 |
| エラー回復 | 手動 | 自前実装 | ✓ 自動復旧 |
| マルチエージェント | サブエージェント | 自前で構築 | ✓ Public Beta（2026-05〜） |
| セキュリティ | ローカル権限 / サンドボックス | 自前管理 | ✓ 隔離コンテナ + Vault |
| 可観測性 | ターミナル出力 | 自前構築 | ✓ Console統合 |
| Git連携 | ✓ プロキシ経由 | 自前実装 | ✓ トークン隔離 |
| 主な用途 | 対話的コーディング | カスタムエージェント | 本番エージェント運用 |

## Claude Code クラウド版との違い

### Claude Code on the web（クラウド版）

クラウド上の隔離サンドボックスでClaude Codeセッションを実行。git認証情報はサンドボックス外のプロキシが管理し、GitHubリポジトリを介して成果物をやり取りする。**コーディングに特化**した対話型ツール。

### Managed Agents

Claude Codeのハーネスを「メタハーネス」として包含する上位レイヤー。コーディングだけでなく、文書処理・タスク自動化・マルチエージェントなど汎用用途に対応。APIとして外部システムに組み込み、顧客向けプロダクトとして提供することを想定。

**共通点:** git認証のセキュリティモデル（トークン隔離パターン）は同じ。Managed Agentsはこの設計を継承・拡張している。

## セキュリティモデル

### サンドボックスからの認証トークン分離

Managed Agentsの最重要セキュリティ原則は、**認証トークンをサンドボックスの外に置く**ことです。Gitトークンはサンドボックス初期化時のcloneにのみ使われ、エージェント実行コンテナからは直接アクセスできません。MCP用OAuthトークンはセキュアVaultに保管され、専用プロキシ経由でツール呼び出しが行われます。これにより、悪意あるコードや誤ったツール呼び出しでトークンが漏洩するリスクを構造的に排除しています。

### サンドボックス隔離

各セッションは独立したクラウドコンテナで実行されます。ファイルシステムとネットワークの両面で隔離され、組織ごとにセッションが分離されます。Anthropicの標準データ保持ポリシーが適用されます。

### スコープ付き権限

エージェントが実行できるツール・アクセスできるリソースを細かく制限できます。意図しない操作や権限昇格のリスクを最小化します。

### 可観測性

Claude Consoleでセッショントレーシング、ツール呼び出し、エージェントの判断、失敗モードを検査可能です。統合分析とトラブルシューティングツールを提供します。

## Memory機能（2026年4月23日パブリックベータローンチ）

**2026年4月23日、Memoryがパブリックベータへ移行**しました。**全Managed Agentsユーザーに即時提供**され、追加の申請手続きは不要です。Managed Agentsにおける長期記憶レイヤーとして、以下の特徴を持ちます。

| 観点 | 内容 |
|------|------|
| **実装方式** | エージェントの**ファイルシステム層**として実装。エージェント自身が読み書きできるファイル群として扱える |
| **学習・改善** | **セッション間で経験を蓄積**し、繰り返し利用するほど精度・効率が向上（過去の判断・好み・コンテキストを次回以降に活用） |
| **監査性** | Memoryへの**全変更がAudit logに記録**される。コンプライアンス要件にも対応 |
| **管理性** | **API経由でエクスポート・インポート・削除**が可能。組織ポリシーに沿った運用が可能 |
| **提供範囲** | **全Managed Agentsユーザーに即時提供**（追加申請・別途契約不要） |
| **対象** | エンタープライズの繰り返しワークフロー（顧客対応・コードベース知識・社内手順など）に最適 |

ファイルシステム層として実装されているため、エージェントは「メモを読む・書く」感覚で自然に長期記憶を活用できます。Netflix・Rakuten・Notion等が早期から本番ワークフローで活用しています。

## エンタープライズ向け機能（2026年4月9日）

2026年4月9日、Anthropicは Claude Cowork および Managed Agents に向けたエンタープライズ機能を発表しました。

| 機能 | 内容 |
|------|------|
| **RBAC**（ロールベースアクセス制御） | エージェント・セッション・Memoryへのアクセスを役職・チーム単位で制御 |
| **グループ支出制限** | チーム・部門単位でトークン/セッション時間の上限を設定。予算管理を厳格化 |
| **利用分析** | エージェント別・ユーザー別のコスト・利用パターンをダッシュボードで可視化 |
| **OpenTelemetry連携** | 既存の可観測性基盤（Datadog・Grafana等）にトレース・メトリクスをエクスポート |

これにより、IT部門・財務部門が求めるガバナンス要件を満たしつつ、現場部門が本番エージェントを安心してスケールさせられる体制が整いました。

## プライバシー・セキュリティ強化（2026年5月19日 PT）

2026年5月19日（PT）、Managed Agents の **ツール実行・MCP接続まわりのプライバシー／セキュリティ層** を大幅に拡張する2機能が発表されました。エージェントのオーケストレーションループは Anthropic 側に残しつつ、**機密データを顧客側ネットワーク内に留める**設計です。

### Self-hosted sandboxes（Public Beta）

**エージェントのツール実行を、顧客自身のインフラまたはマネージドサンドボックスプロバイダー上で動かす**選択肢。Anthropic のサンドボックスにファイルやパッケージを送らずに済むため、コーポレートペリメータ内で機密データを完結処理可能。

| 提供プロバイダー | 特徴 |
|---|---|
| **Cloudflare** | MicroVM ベース、Zero-trust secrets、カスタマイズ可能ネットワークプロキシ |
| **Daytona** | フルステートフルなコンピュータ、長時間稼働、SSH／プレビューURLアクセス、状態保持 |
| **Modal** | クラウドプラットフォーム、サブ秒起動、GPU/CPU オンデマンド、数十万並列スケール |
| **Vercel** | VM セキュリティ、VPCピアリング、ミリ秒起動、ネットワーク境界での credential injection |

#### Cloudflare Environments — microVM と V8 Isolate を選べる実行基盤（概要）

Self-hosted sandboxes のプロバイダーの1つである **Cloudflare** については、Anthropic と Cloudflare の共同発表により **Cloudflare Sandboxes 上に Managed Agents のツール実行を載せる統合（Cloudflare Environments）** が用意されています。設計思想は **「brain（頭脳）と hands（手）の分離」** で、エージェントのコアループ（brain）は Anthropic 側に残し、コード実行・ツール呼び出し・ネットワーク接続（hands）を Cloudflare インフラ側で動かします。セッション開始時に Workers ベースの Cloudflare コントロールプレーンへ実行が委譲される仕組みです。

実行サンドボックスは用途に応じて2種類から選べます。

| 実行形態 | 基盤 | 起動 | 向くワークロード |
|---|---|---|---|
| **Linux microVM** | Cloudflare Containers | （VM 起動） | 開発者としてアプリ全体を構築し Linux ツールを動かす複雑タスク |
| **V8 Isolate** | Dynamic Workers + Codemode | **ミリ秒**で起動 | 軽量・低コスト。**数万規模の同時エージェント**のバーストに対応 |

付属ツール／ネットワーク機能も Cloudflare の基盤を活かした構成です。

| 機能 | 内容 |
|---|---|
| **ブラウザツール** | `browser_search` / `browser_execute` / `screenshot` / `browse` / `fetch_to_markdown` など。セッション録画・監査証跡付き |
| **メールツール** | `send_email` / `email_read` / `email_list`（Cloudflare Email Service 経由） |
| **アウトバウンドプロキシ** | 暗号化クレデンシャルの **zero-trust injection**。エージェントコードはシークレットに直接触れない |
| **プライベート接続** | **Cloudflare Mesh** / **Workers VPC** 経由で、VPN なしに社内サービスへ到達 |
| **カスタムツール** | Codemode によるユーザー定義ツール（例: R2 オブジェクトストレージ連携） |

Cloudflare の director of product, Mike Nomitch 氏は「これまで Managed Agents はスタック全体を Anthropic 提供のインフラで動かす必要があったが、セキュリティ・コンプライアンス・パフォーマンス上の理由でインフラ選択をより自分で制御したい開発者もいる」と位置付けを説明しています。

> ※ Cloudflare Environments の詳細（microVM と V8 Isolate の使い分け、Mesh/Workers VPC のネットワーク設計、Codemode のツール定義など）は、別記事「Cloudflare Environments 詳解（予定）」で深掘りします。本記事では概要レベルにとどめます。

| 観点 | 内容 |
|---|---|
| ステータス | Public Beta（即日利用可） |
| 適用範囲 | Managed Agents / Messages API |
| ガバナンス | 組織が compute resources・ネットワークポリシー・監査ログを統制 |

### MCP tunnels（Research Preview）

**プライベートネットワーク内の MCP サーバーへ、エージェントがファイアウォール変更なしに到達できる**仕組み。軽量ゲートウェイ経由で **outbound-only 接続**＋**E2E 暗号化**を実現し、社内 MCP サーバーをパブリック露出することなく Managed Agents から呼び出し可能になります。

| 観点 | 内容 |
|---|---|
| ステータス | Research Preview（[`claude.com/form/claude-managed-agents`](https://claude.com/form/claude-managed-agents) 経由でアクセス申請） |
| 接続方式 | 軽量ゲートウェイ + outbound-only + E2E 暗号化 |
| 要件 | 顧客側にゲートウェイを配置（FW 設定変更は不要） |
| 想定ユースケース | 社内 DB / 内部 API / オンプレ MCP コネクタ等の non-public MCP サーバーをエージェントから安全に利用 |

### 位置付け

| レイヤー | 従来 | 5月19日以降 |
|---|---|---|
| オーケストレーション | Anthropic ホスト | Anthropic ホスト（変更なし） |
| ツール実行サンドボックス | Anthropic ホスト | **Anthropic / 顧客側インフラ / マネージド sandbox プロバイダ** から選択可能 |
| MCP サーバー接続 | 公開 endpoint のみ | **プライベートネットワーク内 MCP サーバー** にもトンネル経由で接続可能 |

エンタープライズで頻発する「データ persistence の境界を社外に出したくない」「社内 MCP コネクタを公開できない」という制約を、Managed Agents の利便性を維持したまま解消する設計です。料金面のアナウンスは無く、既存 Claude Platform offering に統合される形となります。

## ランタイム機能の追加（2026年5月22日 JST、Claude Code v2.1.149連動）

2026年5月22日（JST）リリースの Claude Code v2.1.149 とAPIドキュメント更新により、Managed Agents の **実行時挙動を支える3機能** が追加されました。いずれも「長時間セッションを実運用に乗せた際のオペレーション課題」を直接解消する内容です。

### セッション中の MCP 設定動的更新

アクティブなセッションに紐づいた **MCP サーバー・ツール構成を、セッション継続中に変更** できるようになりました。従来は「セッション開始時に確定した MCP 構成」が固定されていたため、サーバー追加・撤去・認証情報更新のたびにセッションを切り替える必要がありました。

| 観点 | 変更前 | 変更後 |
|---|---|---|
| MCP 構成変更 | セッション再作成が必要 | **アクティブセッションのまま変更可能** |
| 想定運用 | 設計変更時はセッション破棄 | 長時間 Dreaming/Outcomes セッション内でも構成更新可能 |
| 典型ユースケース | 環境差し替えごとに新セッション | 業務ロール切り替え・段階的なツール拡張 |

→ Managed Agents で **数時間〜数日にわたる Dreaming セッション**を運用する組織にとって、構成変更コストを大幅削減。

### 大容量ツール出力の自動スピル（agent_toolset / MCP 共通）

`agent_toolset` や MCP ツールの出力が **100K トークン超** になった場合、自動的に **サンドボックス内ファイルへ書き出し**、モデルには「トランケート済みプレビュー＋ファイルパス」を返す仕組み。

| 観点 | 内容 |
|---|---|
| 発火条件 | ツール出力が **100K トークン超** |
| 保存先 | サンドボックス内ファイル（モデルからは `read_file` 等で参照可能） |
| モデルへの返却 | **トランケート済みプレビュー + ファイルパス** |
| 適用範囲 | agent_toolset / MCP ツール出力 共通 |
| 効果 | コンテキスト圧迫の自動防止、長文ログ・大型ファイル取得時の安定動作 |

→ 「巨大な検索結果や `grep` 出力でコンテキストが瞬間的に消費される」典型的トラブルを **harness 層で自動吸収**。エージェント側で「これは長すぎるから一旦ファイル化」と意識する必要がなくなる。

### Cache diagnostics（Public Beta）

Messages リクエストに **`diagnostics.previous_message_id`** を付与すると、レスポンスに **`cache_miss_reason`** が返るようになりました。前回ターンとのキャッシュプレフィックス分岐箇所を診断可能。

| 観点 | 内容 |
|---|---|
| ステータス | **Public Beta** |
| リクエスト側 | `diagnostics.previous_message_id` を指定 |
| レスポンス側 | `cache_miss_reason` フィールドで分岐位置・原因を返却 |
| 想定用途 | プロンプトキャッシュが「効くはずなのに効かない」事象の原因特定 |
| 典型シナリオ | システムプロンプト末尾の動的フィールド・ツール定義変更・MCP 構成変更によるキャッシュ無効化を可視化 |

→ プロンプトキャッシュ最適化が必要な高頻度トラフィック運用において、**キャッシュ効率低下の根本原因を機械的に追跡可能**に。従来は「効いてないはず」を勘で当てる必要があった領域。

### 3機能の位置付け

| 機能 | 解決する課題 | 影響レイヤー |
|---|---|---|
| **セッション中 MCP 更新** | 長時間セッションの構成変更コスト | セッション管理 |
| **大容量出力スピル** | 大型ツール結果によるコンテキスト圧迫 | tool 実行 |
| **Cache diagnostics** | プロンプトキャッシュ効率の透明性 | 課金・性能 |

これら3機能は、5月19日の **Self-hosted sandboxes / MCP tunnels**（プライバシー層の拡張）と組み合わさることで、Managed Agents が「**長時間・大型データ・機密データを安定運用できる業務基盤**」へと一段階成熟したことを示しています。

## Dynamic Workflows との関係（2026年5月28日 PT / 5月29日 JST）

2026年5月28日（PT）、Claude Opus 4.8 と同時に Claude Code へ **Dynamic Workflows（Research Preview）** が追加されました。プロンプトに `workflow` と含めるだけで、Claude が JavaScript スクリプトを自動生成し、**同時最大16・1回の実行で総計最大1000サブエージェント**をファンアウト実行する機能です。Claude Code CLI / Desktop / VS Code拡張・Claude API・Amazon Bedrock・Vertex AI・Microsoft Foundry で利用できます。

「多数のエージェントを束ねる」点で Managed Agents と混同されがちですが、**オーケストレーションの主体と設計思想が異なります**。

| 観点 | Managed Agents | Dynamic Workflows |
|---|---|---|
| オーケストレーションの所在 | **Anthropic ホスト**（クラウド側のループ） | **Claude Code 側**（自動生成スクリプトがローカル/セッションで駆動） |
| 制御フロー | エージェントの逐次判断（model-driven） | **コードのループ・分岐（code-driven）** |
| 中間結果の保持 | セッション/Memory 層 | スクリプト変数（コンテキストには最終結果のみ） |
| 主用途 | エンタープライズの繰り返し業務ワークフローを**常設運用** | 大規模リファクタリング・移行・多視点検証を**その場でファンアウト** |
| 状態管理 | Managed（セッション・Memory） | 明示的（スクリプトが保持・再開は同一セッション内） |

→ ざっくり言えば、**Managed Agents は「業務を恒常的に回す運用基盤」、Dynamic Workflows は「単発の大規模タスクを並列に解く道具」**です。両者は競合ではなく、レイヤーが異なります。Dynamic Workflows の内部構造・制御・コストは [Claude Code Dynamic Workflows 完全ガイド](/mdTechKnowledge/blog/claude-code-dynamic-workflows-guide/) を参照してください。

## スケジュールデプロイ と Vault 環境変数（2026年6月9日 PT、Fable 5ローンチ同時）

2026年6月9日（PT）の **Claude Fable 5** ローンチと同じ日に、Managed Agents へ運用面の機能が2つ追加されました（[公式リリースノート](https://platform.claude.com/docs/en/release-notes/overview)）。

### スケジュールデプロイ（Scheduled deployments）

**cron スケジュールでセッションを実行**できるようになりました。これまでは「いつエージェントを起動するか」を自前のスケジューラ（外部 cron・ジョブ基盤）で管理する必要がありましたが、**自前スケジューラを用意せずに** Managed Agents 側で定期実行を組めます。日次レポート生成・定期監査・夜間バッチのようなワークロードを、インフラを足さずに常設運用できます。

> 公式: *"Claude Managed Agents now supports scheduled deployments, letting you run sessions on a cron schedule without managing your own scheduler."*

### Vault 環境変数クレデンシャル（Environment variable credentials）

Managed Agents の **Vault が「環境変数クレデンシャル」に対応**しました。シークレット（APIキー・トークン等）を、**環境変数経由で認証する CLI・SDK・外部サービス向けに、エージェントのサンドボックスへ安全に注入**できます。値は Vault に格納され、前述の「サンドボックスからの認証トークン分離」と同様に **モデル本体からは隠蔽**されたまま、実行時にだけサンドボックスへ渡されます。

> 公式: *"Claude Managed Agents vaults now support environment variable credentials, so you can securely inject secrets into the agent's sandbox for CLIs, SDKs, and other services that authenticate through environment variables."*

これにより、`gh` CLI・各種クラウド SDK・データベースクライアントのように **「環境変数にトークンを置く」前提のツール**を、シークレットをプロンプトやコードに平文で晒すことなく Managed Agents から扱えるようになります。

## MCPコネクタの一括認可 EMA（2026年6月18日 PT、Beta）

2026年6月18日（PT）／19日（JST）、**MCPコネクタの認可をエンタープライズで一括管理する Enterprise-Managed Authorization（EMA）が Beta 提供**を開始しました。Managed Agents が呼び出す MCP コネクタ（SaaS 連携）の認可にも関わるため、本ガイドでも触れておきます。

- **仕組み**: IT 管理者が IdP（ローンチ対応は **Okta**、Cross App Access を利用）で一度コネクタを承認すれば、社員は所属グループ／ロールに応じて**初回ログイン時にゼロタッチでアクセスを継承**（アプリごとの個別 OAuth 同意画面が不要）。
- **対応コネクタ（ローンチ時7種）**: Asana / Atlassian / Canva / Figma / Granola / Linear / Supabase（Slack ほか追加予定）。
- **適用範囲**: Claude チャット／Claude Code／Cowork を横断（**GA ではなく Beta**、Team / Enterprise 向け）。

> **位置づけの注意**: EMA は Managed Agents 専用機能ではなく、Claude 全体の MCP コネクタ認可をエンタープライズ向けに整備するものです。Managed Agents の文脈では「呼び出す MCP コネクタの認可も一元化できる」という関係になります。技術詳細は [MCP アーキテクチャ詳細](/mdTechKnowledge/blog/mcp-architecture/) の EMA 節、および [Enterprise Analytics API ガイド](/mdTechKnowledge/blog/anthropic-enterprise-analytics-api/) を参照してください。

## 具体的なユースケース

### コーディングエージェント（対象: 開発チーム・DevOps）

コードベースを読み取り、修正計画を立て、実装してPRを作成するまでを自律的に実行。CI/CDパイプラインと連携し、バグ修正や機能追加を自動化。

> **Sentry の事例:** フラグが立ったバグの根本原因分析→修正コード作成→PR作成を一気通貫で自動処理

### プロダクティビティエージェント（対象: ナレッジワーカー・PMチーム）

プロジェクトに「AI Teammate」として参加し、タスクを拾い上げて作業。スライド、スプレッドシート、Webサイトなどの成果物を生成。数十タスクの並列実行も可能。

> **Notion の事例:** コーディングからスライド・スプレッドシート作成まで、ワークスペース内で直接Claudeに委任。チーム全体で成果物を共同編集

### 財務・法務エージェント（対象: 財務部門・法務部門）

契約書や財務レポートの大量文書を処理し、重要情報を抽出・分類。定型的なレビュー業務の自動化やリスク箇所のハイライトに活用。

> **活用例:** 四半期決算の大量資料を読み込み、KPI変動の要因分析レポートを自動生成

### 会議準備エージェント（対象: 営業・事業開発）

会議前に各参加者をリサーチし、過去のやり取りや最新ニュースをまとめて提示。CRM・カレンダー・議事録ツールとMCP連携で動作。

> **導入実績:** アイデアから本番稼働まで数日で実現。カスタムツールで自社カレンダー・連絡先データを統合

### HR・社内業務エージェント（対象: 人事・管理部門）

SlackやTeamsから指示を送り、スプレッドシート・スライド・アプリなどの成果物を受け取る。入社手続き、研修資料作成、社内問い合わせ対応など。

> **楽天の事例:** プロダクト・営業・マーケ・財務・HRの各部門に専門エージェントを配置。それぞれ1週間以内に本番稼働

### カスタマーサポートエージェント（対象: CS部門・サービス運用）

問い合わせ内容を分析し、ナレッジベースを検索して回答案を生成。複雑な問い合わせにはチケット起票や関連情報の収集まで自律的に処理。

> **活用例:** ユーザーの問い合わせ→FAQ検索→回答ドラフト→必要に応じてエスカレーション起票を一連で自動化

## 早期導入企業

| 企業 | 活用内容 |
|------|---------|
| **Netflix** | コンテンツ運用・社内ワークフローでMemory機能を活用し長期的なエージェント運用を本番展開 |
| **Notion** | ワークスペース内でコーディング・スライド・スプレッドシートをClaudeに委任。数十タスク並列実行 |
| **Rakuten（楽天）** | 5部門に専門エージェント配置。Slack/Teams連携で指示→成果物受取。各1週間以内に稼働 |
| **Asana** | AI Teammatesがプロジェクト内タスクを自律的に処理。高度機能の出荷速度が劇的に向上 |
| **Sentry** | バグ検出→根本原因分析→修正コード作成→PR作成を完全自動化 |
| **Vibecode** | インフラ構築が10倍以上高速化。開発者体験の大幅向上を報告 |

## 料金体系

**Claude APIトークン料金 ＋ $0.08 / session-hour**

- 別途アクセス費用やプラットフォーム料金なし
- 新規APIアカウントには初期テスト用クレジット付与
- 全Claude APIアカウントでデフォルトアクセス可能

※ 24エージェント × 8時間/日 運用の場合、セッション費だけで約$15.36/日（推論コスト別）。大規模運用前にコストシミュレーションを推奨します。
※ **セッション時間にはアイドル状態も含まれる**ため、未使用セッションは明示的に終了させてください。

## 2026年5月 新機能: Dreaming / Outcomes / Multi-agent orchestration

2026年5月6日（PT）/ 5月7日（JST）の Code with Claude SF イベントで、Anthropicは Managed Agents の3つの新機能を発表しました。

### Dreaming（Research Preview）

エージェントのセッション間に**定期スケジュールで自動実行**されるバックグラウンドプロセスです。過去のセッション履歴とメモリストアを精査し、反復するパターンや失敗事例を抽出してメモリを自動整理・更新します。

| 観点 | 内容 |
|------|------|
| **動作タイミング** | セッション間（アイドル時）に自動実行 |
| **主な効果** | 繰り返しパターンの検出・記憶の整理・過去の失敗から自律学習 |
| **提供状況** | Research Preview（別途アクセス申請が必要） |
| **実績** | Harvey社のテストで完了率が最大 **約6倍**に向上 |

個々のエージェントがセッション単位では気づけない、より大局的なパターンを Dreaming が抽出することで、繰り返し利用するほど精度が向上します。

> **【2026-07-10追記】Dreaming が Claude Fable 5・Claude Sonnet 5 に対応**: 公式リリースノートによると、Dreaming（Research Preview）が **Claude Fable 5 と Claude Sonnet 5 をサポート**しました。これまでの対応モデルに両モデルが加わったことで、Fable 5 の高度な自律実行と Sonnet 5 の低コストなエージェント運用を、Dreaming のセッション間自己改善と組み合わせられます。出典: [Anthropic Release notes（2026-07-10）](https://platform.claude.com/docs/en/release-notes/overview)。

### Outcomes（Public Beta）

開発者が**成功基準（ルーブリック）を定義**すると、別の評価エージェント（Grader）がアウトプットを採点し、基準未達の場合にエージェントへ修正を促します。

| 観点 | 内容 |
|------|------|
| **仕組み** | ルーブリック定義 → Grader が自動評価 → 未達なら再試行 |
| **効果** | 標準プロンプトループ比で成功率を最大 **10ポイント**改善 |
| **特徴** | 難度が高いタスクほど改善幅が大きい |
| **提供状況** | Public Beta（全 Managed Agents ユーザーが利用可） |

定量的な合否判定ロジックを外部から差し込めるため、QA・コンプライアンスチェック・コード品質ゲートなど、明確な合否基準がある業務に特に有効です。

### Multi-agent orchestration（Public Beta）

**リードエージェントが複数のスペシャリストエージェントを編成**し、複雑なタスクを並列分散処理します。

| 観点 | 内容 |
|------|------|
| **構成** | リードエージェント + 複数サブエージェント（各自が専用モデル・プロンプト・ツールを保有） |
| **並列実行** | 各サブエージェントが共有ファイルシステム上で並列作業 |
| **可観測性** | サブエージェントの動作が Claude Console からトレース可能 |
| **提供状況** | Public Beta（2026年5月〜。従来は Research Preview） |

コード調査・ドキュメント作成・テスト実行など、専門性が異なる作業を並列化することで、単一エージェントでは時間がかかる複雑タスクを大幅に高速化できます。

### Webhooks（同日発表の第4の新機能）

Dreaming / Outcomes / Multi-agent orchestration と同じ 2026年5月7日（JST）に、Managed Agents のライフサイクルイベントを外部システムへ通知する **Webhooks** が追加されました。これまでセッション状態の追跡はポーリング API か Console 経由でしか得られませんでしたが、Webhooks の登場で **イベント駆動の外部連携**が標準化されました。

| 観点 | 内容 |
|------|------|
| **対象イベント** | **Session 系**: `session.status_run_started`（実行開始）/ `session.status_idled`（入力待ち）/ `session.status_rescheduled`（一時エラーで自動再試行）/ `session.status_terminated`（終端エラー）/ `session.thread_created`・`session.thread_idled`・`session.thread_terminated`（マルチエージェントのスレッド）/ `session.outcome_evaluation_ended`（Outcomes 評価完了）。**Vault 系**: `vault.created` / `vault.archived` / `vault.deleted` / `vault_credential.created` / `vault_credential.archived` / `vault_credential.deleted` / `vault_credential.refresh_failed`（クレデンシャル更新失敗） |
| **配信形式** | HTTPS POST（443・公開解決可能なホスト名必須）、JSON ペイロード。ペイロードは event の `type` と `id` のみを返し、本体は ID で GET 取得（再送時の陳腐化データを回避）。`X-Webhook-Signature` ヘッダ + SDK の `unwrap()` で署名検証（`whsec_` プレフィックスの 32 バイト signing secret） |
| **再送制御** | 少なくとも1回リトライ（同一 `event.id` で再送 = 冪等判定可能）。約20回連続失敗、または private IP 解決・リダイレクト応答で自動的に `disabled` 化。ordering は非保証で `created_at` で並べ替える |
| **主な用途** | Slack/Teams への完了通知、CI/CD のチェーンキック、SIEM への Vault 監査ログ転送、Outcomes 未達時のオンコール通知 |
| **提供状況** | Public Beta（全 Managed Agents ユーザーが利用可。申請不要） |

Outcomes と組み合わせれば「成功基準を満たすまで自律的に再試行 → 最終結果を Webhook で外部システムに通知」というクローズドループが構築できます。また Vault イベントを SIEM に流すことで、コンプライアンス監査のリアルタイム性も向上します。

> **【2026-06-09 更新】`session.thread_*` イベントの拡充**: マルチエージェントのスレッド系イベント（`session.thread_created` / `session.thread_idled` / `session.thread_terminated`）に **`session_thread_id` フィールドが追加**されました。これにより、**どのマルチエージェントスレッドがイベントを発火したか**を Webhook 受信側で識別できるようになり、複数スレッドを並走させる構成でのイベント突合が容易になりました。

## Claude Platform on AWS による Managed Agents 利用（2026-05-12 JST GA）

2026年5月12日（JST）、Anthropic は **Claude Platform on AWS** を一般提供（GA）開始しました。これは Claude API / Managed Agents をはじめとする Anthropic のプラットフォーム機能を、**AWS アカウント経由でネイティブに利用できる**統合形態です。

| 観点 | 内容 |
|------|------|
| **GA 日** | 2026年5月12日（JST） |
| **利用形態** | AWS Marketplace から Claude Platform を購読 → 既存 AWS アカウントから Managed Agents・Claude API・Memory・Skills を呼び出し |
| **課金** | **AWS Billing に統合**（既存の AWS 契約・コミット消費が適用可能） |
| **認証 / 権限** | **AWS IAM ロール**で API 呼び出しを制御。Anthropic 側に別途キー管理が不要 |
| **対応リージョン** | **日本を含む 17 リージョン**で利用可能（東京リージョン対応） |
| **データ所在** | AWS リージョン内でのリクエスト処理が可能（データレジデンシー要件に対応） |

### 従来の Anthropic Direct との違い

| 観点 | Anthropic Direct（Claude API 直接） | Claude Platform on AWS |
|------|------------------------------------|------------------------|
| 契約・請求 | Anthropic に直接契約・USD 請求 | **AWS 契約に統合**・既存コミット消費可 |
| 認証 | Anthropic API キー | **AWS IAM**（SigV4 認証） |
| データ所在 | Anthropic 管理リージョン | AWS リージョン（東京など）選択可 |
| 既存 AWS 資産との統合 | 別系統 | CloudWatch / IAM / VPC エンドポイント等と統合 |
| 機能差 | 全機能即時提供 | GA 機能から順次対応（Managed Agents は GA 対象） |

これにより、AWS を主軸にしている企業は **「既存の AWS ガバナンス・調達フローのまま Managed Agents を本番投入できる」** ようになりました。特に金融・公共・医療など、ベンダー追加契約のハードルが高い業種では導入障壁が大きく下がります。エンタープライズ向け RBAC・OpenTelemetry 連携と組み合わせれば、AWS 上の既存可観測性スタックに Managed Agents をシームレスに載せられます。

### 【2026-05-29 追記】webhooks・Multi-agent orchestration・Self-hosted sandboxes も AWS 対応

2026年5月29日、Managed Agents の **webhooks・マルチエージェントオーケストレーション・セルフホスト型サンドボックス**の3機能が **Claude Platform on AWS でも利用可能**になりました（GA 時点の Managed Agents 本体対応に続く機能追加）。これにより、第一者の Claude API とほぼ同等のエージェント運用機能が **AWS 課金・IAM 認証のまま**使えます。セルフホスト型サンドボックス向けには新しい IAM アクションと **`AnthropicSelfHostedEnvironmentAccess`** マネージドポリシーが提供され、6月10日には保留ワークを取得する **`GET /v1/environments/{id}/work`** エンドポイントも AWS 側で利用可能になっています（出典: [Claude Platform release notes](https://platform.claude.com/docs/en/release-notes/overview)）。

## 【2026-06-30追記】Claude が Microsoft Foundry で一般提供（GA）

2026年6月29日（PT）、**Claude Opus 4.8・Claude Haiku 4.5 が Microsoft Foundry（Azure ホスト）で一般提供（GA）**となりました。Messages API・プロンプトキャッシュ・extended thinking に対応し、**Azure ネイティブの認証・請求・ガバナンス、US データゾーン（データレジデンシー対応）**を利用できます。デプロイは「Azure ホスト」（自社の Azure 環境で実行）と「Anthropic ホスト」（全 API 機能・最新モデルが必要な場合）の2方式から選べます。

> **注意（Managed Agents との関係）**: これは **Claude モデルの Azure 提供**であり、本記事の主題である **Managed Agents（Anthropic マネージドのエージェント実行基盤）そのものではありません**。Managed Agents は Microsoft Foundry では非対応で、Anthropic クラウド（または上記の Claude Platform on AWS）経由で利用します。「**Azure 環境で Claude を使う**」エンタープライズの選択肢が増えた、という位置づけです。

出典: [Microsoft Azure Blog](https://azure.microsoft.com/en-us/blog/introducing-anthropics-claude-models-in-microsoft-foundry-bringing-frontier-intelligence-to-azure/) / [Claude 公式: Claude in Microsoft Foundry is now GA](https://claude.com/blog/claude-in-microsoft-foundry)

## 【2026-07-02追記】Developer Platform アップデート — Managed Agents の運用強化（Sonnet 5 と同時）

2026年7月1〜2日、Claude Sonnet 5 のリリースと同時に、**Managed Agents 周りの Developer Platform 機能**が拡充されました。

| 機能 | 内容 |
|:---|:---|
| Event deltas | セッションのイベントストリームが `event_delta` で**生成途中のメッセージをプレビュー**可能に |
| Backward pagination | セッション一覧が `prev_page` カーソルに対応（過去方向の遡り） |
| Session-level overrides（6/30） | **セッション作成時に `agent: {type: "agent_with_overrides"}`** を渡すと、**そのセッションだけ**モデル・システムプロンプト・ツール・MCP サーバー・スキルを差し替え可能（エージェント本体は不変）。アクティブセッションの MCP/ツール構成のリアルタイム更新も可 |
| Vault 環境変数クレデンシャル（6/30） | シークレットを**環境変数としてサンドボックスに注入**。**新設 `injection_location`（`headers` / `body` / `both`）** で、egress 時に値をアウトバウンド要求の**ヘッダー・ボディ・両方**のどこへ差し込むか制御 |
| Webhook 拡張（6/30） | agent／deployment／deployment run の各ライフサイクルをカバー（新バージョン公開・停止・スケジュール失敗をポーリング不要で検知） |
| MCP tunnels | プライベートネットワーク内 MCP サーバーへ到達（Research Preview） |
| Self-hosted sandboxes | ツール実行を Anthropic インフラではなく**自社ホスト**で行う選択肢 |

> **【2026-07-02】Memory API のベータヘッダー変更**: メモリ一覧の並び順・`depth`・`path_prefix` の挙動を変える **`agent-memory-2026-07-22`** ヘッダーが追加されました（2026-07-22 以降は旧 `managed-agents-2026-04-01` でも同挙動）。詳細は [Claude Managed Agents Memory 完全ガイド](/mdTechKnowledge/blog/claude-managed-agents-memory/) を参照。

出典: [Anthropic Release notes](https://platform.claude.com/docs/en/release-notes/overview)。

## 【2026-07-22追記】effort レベル設定・Webhook 拡張・セッション初期イベント注入

| 機能 | 内容 |
|:---|:---|
| Effort レベル設定 | エージェント作成時に **`model` オブジェクト内で `effort` を指定**可能に。エージェントの推論に投じる計算量をレベルで制御できる |
| Webhook 拡張 | environment（**4種類**）・memory_store（**3種類**）のライフサイクルイベントが Webhook でカバー対象に追加。前述の agent／deployment／deployment run の拡張に続く追加分 |
| Session initial_events | セッション作成時に **`initial_events` で最大50件の初期イベントを注入**可能に（セッション開始時点の文脈をあらかじめ与えられる） |

出典: [Anthropic Release notes（2026-07-22）](https://platform.claude.com/docs/en/release-notes/overview)。

## APIアクセスとレート制限

- **必須ベータヘッダー**: `anthropic-beta: managed-agents-2026-04-01`（Anthropic公式SDKでは自動付与）
- **デフォルト有効**: 通常のManaged Agents APIは全Claude APIアカウントで利用可能
- **レート制限**: Create 300 req/min、Read 600 req/min
- **Research Preview 機能**（Dreaming）は引き続き別途アクセス申請が必要 → [claude.com/form/claude-managed-agents](https://claude.com/form/claude-managed-agents)
- **Multi-agent orchestration・Outcomes** は2026年5月より Public Beta へ移行。全 Managed Agents ユーザーが申請不要で利用可能
- **Memory** は2026年4月23日にパブリックベータへ移行済み。**全Managed Agentsユーザーに即時提供**されており、申請不要で利用可能（必須ベータヘッダー `managed-agents-2026-04-01` のみ指定）

## はじめるには

1. [ドキュメント](https://platform.claude.com/docs/en/managed-agents/quickstart)を確認
2. Claude ConsoleからAgent・Environment・Sessionを作成
3. CLIからもデプロイ可能: `anthropic-beta: managed-agents-2026-04-01` ベータヘッダー（**必須**）を指定
4. Claude Codeユーザーは `"start onboarding for managed agents in Claude API"` で開始
5. Research Preview機能（Dreaming）が必要な場合は [claude.com/form/claude-managed-agents](https://claude.com/form/claude-managed-agents) から申請（Multi-agent orchestration・Outcomes は Public Beta のため申請不要）
6. Memoryはパブリックベータのため申請不要。エンタープライズ向けRBAC/支出制限/OpenTelemetryはConsoleの管理画面から設定

---

*Sources: Anthropic Blog, Claude API Docs（platform.claude.com/docs/en/managed-agents/overview, /tools, /webhooks, /self-hosted-sandboxes）, Cloudflare Blog（blog.cloudflare.com/claude-managed-agents）, InfoQ, SDTimes, TestingCatalog, 9to5Mac, WaveSpeed, The New Stack, The Decoder — May 2026*
*本ガイドは2026年6月16日時点の情報に基づいています（2026-04-08 GA / 2026-04-09 Enterprise / 2026-04-23 Memory パブリックベータ移行 / 2026-05-07 Dreaming・Outcomes・Multi-agent orchestration・Webhooks 追加 / 2026-05-19 Self-hosted sandboxes（Cloudflare Environments 概要を含む） / 2026-06-09 スケジュールデプロイ・Vault 環境変数クレデンシャル・`session.thread_*` への `session_thread_id` 追加 を反映）*
