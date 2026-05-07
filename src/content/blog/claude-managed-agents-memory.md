---
title: "Claude Managed Agents Memory 完全ガイド — 永続記憶機能（Public Beta）の仕組みと活用"
date: 2026-05-02
updatedDate: 2026-05-07
category: "Claude技術解説"
tags: ["Claude", "Managed Agents", "Memory", "永続記憶", "Public Beta", "Anthropic", "API", "監査ログ", "マルチエージェント", "Dreaming"]
excerpt: "2026年4月23日にPublic Betaへ移行したClaude Managed AgentsのMemory機能を詳細に解説。memory storeのアーキテクチャ、必須ヘッダーmanaged-agents-2026-04-01、ファイルツール連携、バージョン管理（30日保持）、監査・redact、マルチエージェント共有パターン、長期プロジェクト・ユーザー嗜好・タスク継続といったユースケース、制限事項と運用上のヒント。2026年5月発表のDreaming（セッション間自己改善・Harvey社で完了率6倍）も解説。"
draft: false
---

## はじめに

**Claude Managed Agents** は、クラウドホスト型のAIエージェントを構築・運用するためのAPI群で、2026年4月8日にPublic Betaが公開されました。続く2026年4月23日には、エージェントに**永続的な記憶**を持たせる新機能 **Memory** がパブリックベータ化（全ユーザーに即時提供）されました。

Managed Agents全体については別途**全体ガイド記事**で扱っていますが、本記事はMemory機能に特化した**専用詳細記事**として、API仕様・アーキテクチャ・運用パターン・制限事項を1ページで把握できるようにまとめています。Managed Agentsを実運用する開発者・SRE・プロダクトマネージャー向けの実装ガイドです。

---

## 1. Memory とは何か — 全体ガイドとの位置付け

通常のManaged Agentsセッションは、毎回**新しいコンテキストで開始**されます。セッションが終わると、その間に学習した情報は失われます。これは安全な分離単位として優れている一方、長期プロジェクト・ユーザー嗜好の蓄積・継続タスクには向きません。

**Memory store** は、この課題を解決する**永続的なドキュメントストア**です。エージェントに「セッションをまたいで覚えていてほしい情報」を、ファイルツール経由で読み書きできる形で提供します。

Managed Agentsの全体ガイドでは「3層アーキテクチャ（Session/Harness/Sandbox）」「セッション・イベント・チェックポイント」を中心に扱いましたが、本記事では**Memory storeという第4の永続層**にフォーカスして解説します。

| 層 | 役割 | ライフサイクル |
|:---|:---|:---|
| Session | イベントログ | セッション単位 |
| Harness | ステートレス推論 | リクエスト単位 |
| Sandbox | 実行コンテナ | セッション単位 |
| **Memory store** | **永続ドキュメント群** | **ワークスペース永続** |

---

## 2. アーキテクチャ概観（テキスト図）

```
┌─────────────────────────────────────────────────────────────┐
│                  ワークスペース (workspace)                  │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Memory Store (memstore_xxxx)             │   │
│  │                                                       │   │
│  │   /preferences/formatting.md                          │   │
│  │   /project/conventions.md                             │   │
│  │   /tasks/continuation_2026-05.md                      │   │
│  │                                                       │   │
│  │   各memoryは100KB上限・複数小ファイル推奨            │   │
│  │   全変更が memory_version として永続記録              │   │
│  └──────────────────────────────────────────────────────┘   │
│                          │                                   │
│              attach (read_write or read_only)                │
│                          │                                   │
│                          ▼                                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                Session の Sandbox                     │   │
│  │                                                       │   │
│  │   /mnt/memory/<store_name>/preferences/formatting.md  │   │
│  │   ↑ ファイルシステムにマウントされる                  │   │
│  │                                                       │   │
│  │   エージェントは標準のagent toolset                   │   │
│  │   (read / write / list / edit) で操作                 │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                             │
│   1セッションあたり最大8 memory store までアタッチ可        │
└─────────────────────────────────────────────────────────────┘
```

ポイント:

- Memory storeは**ワークスペーススコープ**で永続管理される
- セッション作成時に`resources[]`配列で**アタッチ**する（実行中の追加・削除は不可）
- アタッチされると`/mnt/memory/<name>/`に**ディレクトリとしてマウント**される
- エージェントは特別なAPIではなく、**通常のファイルツール**でread/write/listする
- 各書き込みは**memory_version**として永続記録され、監査・ロールバック可能

---

## 3. 必須ヘッダーとAPIスキーマ

### 必須ヘッダー

すべてのManaged Agents APIリクエストには以下のベータヘッダーが必須です（公式SDKは自動付与）。

```
anthropic-beta: managed-agents-2026-04-01
```

### Memory store のCRUD操作概要

| 操作 | エンドポイント |
|:---|:---|
| ストア作成 | `POST /v1/memory_stores` |
| ストア一覧 | `GET /v1/memory_stores` |
| ストア取得 | `GET /v1/memory_stores/{id}` |
| ストア更新 | `POST /v1/memory_stores/{id}` |
| アーカイブ | `POST /v1/memory_stores/{id}/archive` |
| 削除 | `DELETE /v1/memory_stores/{id}` |

### Memory（個別ファイル）の操作

| 操作 | エンドポイント |
|:---|:---|
| 一覧 | `GET /v1/memory_stores/{id}/memories` |
| 作成 | `POST /v1/memory_stores/{id}/memories` |
| 取得 | `GET /v1/memory_stores/{id}/memories/{mem_id}` |
| 更新 | `POST /v1/memory_stores/{id}/memories/{mem_id}` |
| 削除 | `DELETE /v1/memory_stores/{id}/memories/{mem_id}` |

### バージョン履歴

| 操作 | エンドポイント |
|:---|:---|
| 一覧 | `GET /v1/memory_stores/{id}/memory_versions` |
| 取得 | `GET /v1/memory_stores/{id}/memory_versions/{ver_id}` |
| Redact | `POST /v1/memory_stores/{id}/memory_versions/{ver_id}/redact` |

---

## 4. 基本ワークフロー

### Step 1: Memory store を作成

```python
import anthropic

client = anthropic.Anthropic()

store = client.beta.memory_stores.create(
    name="User Preferences",
    description="Per-user preferences and project context.",
)
print(store.id)  # memstore_01Hx...
```

`description`は**エージェントに渡されるシステムプロンプトの一部**になります。何が入っているストアなのかをエージェントに伝える役割を持つので、明確に書きます。

### Step 2: 初期コンテンツでシード（任意）

```python
client.beta.memory_stores.memories.create(
    store.id,
    path="/formatting_standards.md",
    content="All reports use GAAP formatting. Dates are ISO-8601...",
)
```

### Step 3: セッションにアタッチ

```python
session = client.beta.sessions.create(
    agent=agent.id,
    environment_id=environment.id,
    resources=[
        {
            "type": "memory_store",
            "memory_store_id": store.id,
            "access": "read_write",
            "instructions": "User preferences and project context. Check before starting any task.",
        }
    ],
)
```

`access` は **`read_write`**（既定）または **`read_only`** から選択。`instructions`は最大4096文字でエージェント向けの追加ガイダンスを与えられます。

### Step 4: エージェントが標準ファイルツールで操作

エージェントは特別なAPIを意識せずに、**通常のagent toolset**でファイルとして読み書きできます。

```
[agent.tool_use]   tool=read_file path=/mnt/memory/User Preferences/formatting_standards.md
[agent.tool_result] content="All reports use GAAP formatting..."

[agent.tool_use]   tool=write_file path=/mnt/memory/User Preferences/preferences/style.md
                   content="User prefers concise tables over bullet lists."
[agent.tool_result] success=true
```

これらは通常のtool_use / tool_resultイベントとして**event streamに流れる**ため、可観測性は他のツール呼び出しと同じ枠組みで扱えます。

### Step 5: バージョン履歴の参照

```python
versions = client.beta.memory_stores.memory_versions.list(
    store.id,
    memory_id=mem.id,
)
for v in versions:
    print(f"{v.id}: {v.operation} by session={v.created_by_session_id}")
```

---

## 5. ファイルツール連携の詳細

### マウントの仕組み

```
セッションコンテナ内
└── /mnt/memory/
    ├── User Preferences/      ← memory store 1（read_write）
    │   ├── formatting.md
    │   └── style.md
    └── Org Standards/         ← memory store 2（read_only）
        └── coding_conventions.md
```

各マウントについて、**システムプロンプトに自動的に説明が追加**されます。エージェントは「どこに何があるか」をマウント名・description・instructionsから把握します。

### アクセス制御

- **`read_only`**: 書き込みは拒否される（ファイルシステム層で阻止）
- **`read_write`**: 書き込みは新しいmemory_versionとして記録される

### 楽観的並行性制御（content_sha256）

複数セッション・APIコールが同じmemoryを書き換える可能性がある場合、**content_sha256プリコンディション**を使うことで上書きを防げます。

```python
client.beta.memory_stores.memories.update(
    memory_id=mem.id,
    memory_store_id=store.id,
    content="CORRECTED: Always use 2-space indentation.",
    precondition={
        "type": "content_sha256",
        "content_sha256": mem.content_sha256,
    },
)
```

ハッシュが現状と一致しない場合、書き込みは拒否されます。**読み直してリトライ**するパターンが基本です。

### 書き込み権限とプロンプトインジェクションのリスク

ドキュメントには明確な警告があります:

> Memory storesは既定で `read_write` でアタッチされる。エージェントが信頼できない入力（ユーザー由来プロンプト・取得Webコンテンツ・サードパーティツール出力）を処理する場合、**プロンプトインジェクションが成功すると悪意あるコンテンツがstoreに書き込まれ、後続セッションが「信頼できる記憶」として読み出してしまう**。

対策:

- 参照系（規約・ナレッジ・固定の知識）は**`read_only`** にする
- 書き込みが必要なstoreは**スコープを最小化**（ユーザーごと、プロジェクトごとに分割）
- 監査ログで定期的に書き込み内容を点検

---

## 6. バージョン管理・監査ログ

### memory_version の特徴

- すべての変更（create / update / delete / rename）が**immutableなmemory_version**を生む
- `memver_xxxx`形式のIDで識別
- ストア単位の履歴として保持され、**memory自体が削除されても版の記録は残る**
- 保持期間は**30日**（ただし最近の版は古くても保持される。変更頻度が低いmemoryは30日超でも保持されることがある）

### バージョン情報に含まれるフィールド

| フィールド | 内容 |
|:---|:---|
| `id` | バージョンID（`memver_...`） |
| `memory_id` | 親memoryのID |
| `operation` | `create` / `update` / `delete` 等 |
| `created_by_session_id` | 変更を起こしたsessionのID |
| `created_at` | タイムスタンプ |
| `content` | （retrieve時のみ）当時のコンテンツ全文 |

### ロールバック手順

専用のrestoreエンドポイントは**無い**ため、以下の手順で行います:

```python
# 1. 戻したいバージョンを取得
version = client.beta.memory_stores.memory_versions.retrieve(
    version_id,
    memory_store_id=store.id,
)

# 2. その内容で現在のmemoryを上書き（または親memoryが既に消えていればcreateで復元）
client.beta.memory_stores.memories.update(
    memory_id=version.memory_id,
    memory_store_id=store.id,
    content=version.content,
)
```

### Redact（履歴のスクラブ）

機密情報・PII・誤って書き込まれたシークレット等を**監査トレールを保ったまま**履歴から除去できます。

```python
client.beta.memory_stores.memory_versions.redact(
    version_id,
    memory_store_id=store.id,
)
```

注意: ライブmemoryの**現在のヘッドバージョンはredact不可**。先に新しい版を書くか、memoryを削除してから古い版をredactします。

### 監査ユースケース

| シナリオ | 必要操作 |
|:---|:---|
| 「誰が、いつ、何を変えたか」の追跡 | versions.list + 各versionのcreated_by_session_id確認 |
| GDPR等のユーザー削除要求 | 関連pathのmemoryを削除 → 過去versionをredact |
| シークレット漏洩の事後対応 | 該当versionをredact、APIキー再発行 |
| 異常変更のロールバック | 直前の正常versionをretrieve → updateで書き戻し |

---

## 7. マルチエージェント共有のパターン

1セッションあたり**最大8 memory storeまで**アタッチ可能で、これを使った共有パターンがいくつかあります。

### パターン1: 組織共通リファレンス + ユーザー個別ストア

```
[Memory Store A] "Org Standards"     access=read_only  ← 全エージェント・全ユーザー共通
[Memory Store B] "User_<id>_Prefs"   access=read_write ← ユーザーごと
```

組織のコーディング規約・社内用語集・ブランドガイドは`read_only`で全員に提供し、ユーザー個別の嗜好・進行中タスクは個別`read_write`ストアに分離します。

### パターン2: チーム/プロジェクト別ストア

```
[Memory Store P1] "Project Alpha"    access=read_write ← プロジェクトAlphaのメンバーのみ
[Memory Store P2] "Project Beta"     access=read_write ← プロジェクトBetaのメンバーのみ
[Memory Store G ] "Glossary"          access=read_only  ← 全プロジェクト共通
```

プロダクトの構造（マルチテナント・マルチプロジェクト）にmemory storeを対応させるパターン。

### パターン3: ライフサイクル別ストア

```
[Memory Store L] "Long-term Notes"   永続保持
[Memory Store S] "Sprint Notes"      スプリント終了でアーカイブ
```

スプリント単位で更新するノートと、永続的な知見を分離。スプリント終了時に`archive`して読み取り専用に固定します。

### 共有時のベストプラクティス

| 推奨 | 理由 |
|:---|:---|
| 用途別に分割 | アクセス制御・ライフサイクル管理が容易 |
| 参照系は必ずread_only | プロンプトインジェクション対策 |
| descriptionとinstructionsを丁寧に書く | エージェントの記憶利用率が大幅向上 |
| 100KBの上限を意識し、**多数の小ファイル**で構成 | 検索性・更新コスト両面で有利 |

---

## 8. Dreaming — セッション間の自己改善（2026年5月追加）

2026年5月6日（PT）、Code with Claude SF イベントで **Dreaming** が発表されました（Research Preview）。これは Memory store と深く連動する新機能です。

### 概要

Dreaming は、エージェントのセッション間に**定期スケジュールで自動実行**されるバックグラウンドプロセスです。

- 過去最大 **100セッション分のトランスクリプト**と既存 Memory store を精査
- 反復パターン・失敗事例・成功パターンを抽出
- 入力の Memory store とは**別の出力 Memory store** にキュレーション結果を書き込む（元データは変更しない）
- 自動更新モードと、変更確認モードを選択可能

### 設計の特徴

| 観点 | 内容 |
|------|------|
| **実行タイミング** | セッション間（アイドル時）に自動スケジュール |
| **入出力の分離** | 入力 store と出力 store を分離し、元のセッションデータには触れない |
| **制御性** | 「自動適用」か「人間が確認してから適用」かを選択できる |
| **提供状況** | Research Preview（別途アクセス申請が必要） |

### Harvey 社の事例

法律 AI スタートアップ Harvey が Managed Agents で複雑な法律文書の長期作成・ドキュメントレビューに活用。Dreaming を有効にすると、エージェントが**ファイルタイプの回避策やツール固有のパターン**をセッションをまたいで記憶・活用するようになり、内部テストで**完了率が最大約 6倍**に向上しました（モデルの変更ではなく、蓄積された知識の活用による改善）。

---

## 9. ユースケース集

### ユースケース1: 長期プロジェクトの継続

**課題**: 半年以上にわたるプロジェクトで、毎セッション初期化されるとコンテキストの再投入が大きな負担。

**Memory構成例**:

```
/project/overview.md             — プロジェクト概要（read_only）
/project/decisions/2026-04.md    — 決定事項ログ（read_write）
/project/decisions/2026-05.md
/project/conventions.md          — チーム独自規約（read_only）
/project/blockers.md             — 現在のブロッカーリスト（read_write）
```

エージェントはセッション開始時にoverview/conventionsを読み、作業中にdecisions/blockersを更新します。

### ユースケース2: ユーザー嗜好の長期蓄積

**課題**: コーディングアシスタント・文書作成アシスタントで、ユーザーごとの好み（タブ vs スペース、です/だ調、用語）を毎回伝えるのが煩雑。

**Memory構成例**:

```
/user/<id>/style.md              — 文体・トーン
/user/<id>/coding_style.md       — コーディング規約
/user/<id>/disliked_phrases.md   — 避けたい言い回し
/user/<id>/recent_topics.md      — 最近のやりとりサマリ
```

エージェントは指示前にこれらを読み込んでからタスクに取り掛かります。Rakuten事例では、これに類するメモリ活用で**初回パスのエラーが97%減・コスト27%減**との報告があります。

### ユースケース3: タスクの継続（中断→再開）

**課題**: 複数日にまたがるタスクを途中で中断し、後日続きから再開したい。

**Memory構成例**:

```
/tasks/<task_id>/state.md        — 現在の進捗・残作業
/tasks/<task_id>/notes.md        — 中間メモ・気付き
/tasks/<task_id>/blockers.md     — 詰まっている点
```

セッション開始時に`/tasks/<task_id>/state.md`を読めば、エージェントは前回の続きから即着手できます。Wisedocs事例では文書検証が**30%高速化**しました。

### ユースケース4: クロスセッション学習（Dreaming 活用）

**課題**: 同じ間違いを毎回繰り返すエージェントを矯正したい。

**Memory構成例 + Dreaming**:

```
/lessons/mistakes_to_avoid.md    — 過去の失敗とそこから得た教訓
/lessons/successful_patterns.md  — 成功パターン
```

エージェントは作業前にこれらを参照し、作業後に新しい教訓を追記します。さらに Dreaming を有効にすると、エージェントが自動的に過去のトランスクリプトを解析してパターンを抽出し、Memory store に反映します。Netflix事例では、**手動プロンプト更新なしにコンテキストがセッションを跨いで運ばれる**運用が実現しています。

### ユースケース5: 組織ナレッジベースの動的読み込み

**課題**: 大規模なナレッジベース全体をプロンプトに毎回入れるのはコストがかかる。

**Memory構成例**:

```
/kb/glossary.md                  — 用語集（read_only）
/kb/architecture/<system>.md     — システム別アーキ概要（read_only）
/kb/runbooks/<incident>.md       — インシデント対応手順（read_only）
```

エージェントが必要に応じて`list` + `read`で**遅延読み込み**するため、トークン消費を抑えながら知識を活用できます。

---

## 10. 制限事項・コスト

### 容量・サイズ制限

| 項目 | 制限 |
|:---|:---|
| 1 memory のサイズ上限 | **100KB**（約25Kトークン） |
| 1セッションあたりのstoreアタッチ数 | **最大8** |
| `instructions` の文字数 | 最大4096文字 |
| memory version 保持期間 | **30日**（recent versionは古くても保持される場合あり） |
| Dreaming の解析対象セッション数 | 最大 **100セッション** |

### 構造設計の指針

- **多数の小ファイル**で構成する（検索性・更新粒度・並行性すべてに有利）
- 巨大なログ的ファイルは避け、**月別/プロジェクト別**で分割
- ファイル名は**意味的に検索しやすい命名**を（エージェントがlistから推測しやすい）

### アタッチに関する制限

- memory storeのアタッチは**セッション作成時のみ**可能。実行中の追加・削除は不可
- アーカイブされたstoreは新規セッションへのアタッチが不可（既存セッションでは継続利用可）
- アーカイブは**一方通行**でアンアーカイブ不可

### コスト構造

Managed Agents全体のコスト体系（基本料金: $0.08 / session-hour 等）に加え、Memory機能特有の課金は**ベータ期間中は最小限**に抑えられています。ただし以下の点は実コストに影響します:

| 要素 | 影響 |
|:---|:---|
| memoryのread/write | 通常のtool useと同じトークン課金 |
| storeに格納される総容量 | ベータ中は寛容な無料枠、GA時に正式価格化見込み |
| バージョン履歴 | 30日保持は標準。長期保持はAPI経由でエクスポートして自前管理 |

ベータ期間中はAnthropicに**サポート問い合わせで上限緩和**を依頼することも可能です。

### セキュリティ上の注意

- 既定の`read_write`は**プロンプトインジェクションリスクあり** → 信頼できない入力を処理するエージェントでは参照系を`read_only`に
- 機密データはredactで履歴から除去可能だが、**書き込まないのが第一の防衛線**
- 監査ログ（`created_by_session_id`）を活用して定期的にレビュー

---

## 11. 運用上のヒント

### ヒント1: descriptionとinstructionsを「エージェント向けREADME」として書く

ストア作成時の`description`、アタッチ時の`instructions`は、エージェントの**Memory利用率**に直結します。「何が入っているか」「いつ参照すべきか」「どう更新すべきか」を明示的に書きます。

```python
description = (
    "User-specific preferences and project context. "
    "Contains formatting rules, coding style, and recent task notes."
)

instructions = (
    "Always check /preferences/*.md before starting any task. "
    "Update /tasks/<task_id>/state.md when interrupting work. "
    "Do not modify files under /constants/."
)
```

### ヒント2: 命名規則を初期に固める

```
/preferences/        — ユーザー嗜好
/projects/<id>/      — プロジェクト別
/tasks/<id>/         — タスク継続
/lessons/            — 学習・教訓
/kb/                 — ナレッジベース（read_only推奨）
/archive/            — 過去の参考資料
```

このような**ディレクトリ規約**を最初に決めておくと、エージェントが`list`で構造を把握しやすくなります。

### ヒント3: 監査スクリプトで定期点検

```python
def audit_recent_writes(store_id: str, hours: int = 24):
    versions = client.beta.memory_stores.memory_versions.list(store_id)
    cutoff = datetime.utcnow() - timedelta(hours=hours)
    for v in versions:
        if v.created_at >= cutoff and v.operation in ("create", "update"):
            content = client.beta.memory_stores.memory_versions.retrieve(
                v.id, memory_store_id=store_id
            ).content
            if contains_secret_pattern(content):
                print(f"WARN: secret-like content in {v.id}")
```

### ヒント4: テスト用ストアを別ワークスペースに切る

開発・テスト用のmemory store操作で本番ストアを汚さないよう、**ワークスペース単位で分離**します。

### ヒント5: 100KBに近づいたら早めに分割

memoryのサイズが上限近くになる前にファイル分割を検討します。エージェントには「`/tasks/<id>/state.md`が肥大化したら`/tasks/<id>/state-archive-<date>.md`にローテートしてよい」と指示しておくと自律的に管理されます。

---

## まとめ

- 2026-04-23、Claude Managed AgentsのMemory機能が**Public Beta**化（全ユーザーに即時提供）
- 2026-05-07、**Dreaming**（Research Preview）が発表。セッション間の自動パターン抽出・メモリ最適化でエージェントを自己改善させる機能。Harvey社で完了率約6倍の実績
- 必須ヘッダー: **`managed-agents-2026-04-01`**（公式SDKは自動付与）
- Memory storeは**ワークスペーススコープのテキストドキュメント群**で、`/mnt/memory/<name>/`としてセッションコンテナにマウントされる
- エージェントは**通常のファイルツール**（read/write/list/edit）で操作。専用APIの学習は不要
- すべての変更は**memory_version**として記録され、ロールバック・redactが可能（30日保持基準）
- **1 memory 100KB上限・1セッション最大8ストア**。多数の小ファイル構成が推奨
- マルチエージェント共有は「組織共通read_only + ユーザー個別read_write」が基本パターン
- ユースケース: 長期プロジェクト継続・ユーザー嗜好蓄積・タスク中断再開・クロスセッション学習・KB遅延読み込み
- セキュリティ: 既定の`read_write`は**プロンプトインジェクション**リスクあり。参照系は必ず`read_only`に
- ベータ期間中はサポート経由で**上限緩和**の相談が可能

Memory機能は、Managed Agentsを「単発タスクのアシスタント」から「**長期にわたって育つ業務パートナー**」へ昇華させる中核機能です。Rakuten・Wisedocs・Netflix・Andoなどの先行事例では、初回パスエラー削減、検証高速化、コスト削減、自前メモリインフラ構築の不要化といった具体的な成果が報告されています。Public Beta段階で触れる立場にある方は、まずは**ユーザー嗜好ストア**または**プロジェクトノートストア**といった粒度の小さい用途から始め、運用パターンを掴んでから組織共通ストアへ拡張していくのが現実的なステップです。

---

## 参考資料

- [Claude Managed Agents Memory（公式ブログ）](https://claude.com/blog/claude-managed-agents-memory)
- [Using agent memory — Claude Platform Docs](https://platform.claude.com/docs/en/managed-agents/memory)
- [Anthropic adds memory to Claude Managed Agents — SD Times](https://sdtimes.com/anthropic/anthropic-adds-memory-to-claude-managed-agents/)
- [Claude Managed Agents Dreaming — Claude Platform Docs](https://platform.claude.com/docs/en/managed-agents/dreams)
