---
title: "Claude Fable 5.1 / Mythos 5.1 完全ガイド — 何がアップデートされ、誰が使うべきか"
date: 2026-09-03
updatedDate: 2026-09-04
category: "Claude技術解説"
tags: ["Claude Fable 5.1", "Claude Mythos 5.1", "Anthropic", "AIモデル", "Fable 5", "tool_choice", "thinking", "プロンプトキャッシュ", "Claude"]
excerpt: "2026年9月1日、Anthropicは Claude Fable 5 / Mythos 5 の後継モデル Claude Fable 5.1（claude-fable-5-1）・Claude Mythos 5.1（claude-mythos-5-1）をリリースし、Fable 5.1がFableファミリーの既定モデルになった。価格は入出力ともFable 5と同額（$10/$50 per MTok）だが、キャッシュ読み取りが$0.25/MTokへ90%削減。API仕様面ではtool_choiceの`any`/`tool`指定が非対応化（400エラー）、thinking blocksの保持ルール変更、thinking display新モード「updates」（ベータ）が追加された。EU AI Act Article 50対応のテキストウォーターマーク（2026年8月2日以降リリースのモデルに適用、検出APIは規制当局・メディア・研究機関等に限定したprivate preview）も実装された。本記事は、Fable 5からの変更点を整理したうえで、既存Fable 5利用者が移行前に確認すべき破壊的変更と、Fable 5.1が向くユースケース・向かないユースケースを解説する。"
draft: false
---

## はじめに

2026年9月1日（PT）、Anthropicは **Claude Fable 5 / Claude Mythos 5** の後継モデルとして **Claude Fable 5.1（`claude-fable-5-1`）・Claude Mythos 5.1（`claude-mythos-5-1`）** をリリースしました。同日から **Fable 5.1がFableファミリーの既定モデル** となり、Claude API・Amazon Bedrock・Claude Platform on AWS・Google Cloud・Microsoft Foundryで利用可能です。

Fable 5・Mythos 5の基礎（Mythosとの関係・安全設計・提供の経緯）は [Claude Fable 5 徹底解剖①概要編](/mdTechKnowledge/blog/claude-fable-5-overview/) を参照してください。本記事は**5.1で何が変わったか**と**誰が使うべきか**に絞って整理します。

> 本記事は Anthropic Platform リリースノート（2026-09-01）を一次ソースとしています。ベンチマーク数値は本記事執筆時点で公式未公開のため扱いません。

## Fable 5.1 / Mythos 5.1 とは

| 項目 | 内容 |
|:---|:---|
| モデルID | `claude-fable-5-1`（Fable 5.1）／`claude-mythos-5-1`（Mythos 5.1、Project Glasswing参加者向け） |
| コンテキストウィンドウ | 1Mトークン（既定） |
| 最大出力トークン | 128k |
| Thinking | Always-on adaptive thinking（常時有効） |
| 価格 | 入力 $10 / 出力 $50 per MTok（**Fable 5と同額**） |
| キャッシュ読み取り価格 | **$0.25 per MTok**（通常価格の0.025倍） |
| 提供先 | Claude API・Amazon Bedrock・Claude Platform on AWS・Google Cloud・Microsoft Foundry |
| データ保持 | 30日必須（Fable 5と同様、Anthropicの明示許可がない限りZDR不可） |

Fable 5とMythos 5の関係（安全装置の有無のみが違う同一基盤モデル）は5.1でも踏襲されています。

## Fable 5からの変更点

### 1. キャッシュ読み取りコストが90%削減

最大の実務的インパクトはここです。入出力の単価自体はFable 5と変わりませんが、**キャッシュ読み取りが$1/MTok→$0.25/MTokに削減**されました。長い会話やシステムプロンプトの再利用が多いワークロードでは、実効コストが大きく下がります。

### 2. `tool_choice` の `"any"`/`"tool"` が非対応に（破壊的変更）

Fable 5.1・Mythos 5.1では、`tool_choice`に`"any"`（いずれかのツールを必ず呼ぶ）または`"tool"`（特定のツールを強制指定）を指定すると**400エラー**を返します。`"auto"`（モデルが判断）・`"none"`（ツールを使わない）は従来どおり動作します。

**影響を受けるケース**: 構造化出力を`tool_choice: "tool"`で強制していた実装は、Fable 5.1へ切り替えると即座にエラーになります。Anthropicは**strict tool useまたはstructured outputs**への切り替えを推奨しています。

### 3. thinking blocksの保持ルールが変更

Fable 5.1・Mythos 5.1が生成したthinking blockは、**生成元と同じモデルか、それより新しいモデルでのみ保持**されます。これより古いモデル（Opus 5・Fable 5・Mythos 5・それ以前）に会話を渡すと、APIがそのthinking blockを自動的に破棄します。

**影響を受けるケース**: モデルを動的に切り替える実装（コスト最適化のためのモデルルーティング等）で、Fable 5.1のthinkingを含む会話を旧モデルに渡すロジックがある場合、意図せずthinkingコンテキストが失われます。

### 4. thinking display 新モード「updates」（ベータ）

`thinking.display`に3つ目の値 `"updates"` が追加されました（`thinking-display-updates-2026-08-18`ベータヘッダー必須）。推論内容自体は空の`thinking`フィールドで返り、代わりに**ツール呼び出し間の短い進捗更新がテキストとして**返されます。長時間のエージェント実行で「今何をしているか」をユーザーに見せたいが、生の思考過程は見せたくない場合に有用です。

### 5. Per-Message Effort（ベータ、Fable 5.1・Mythos 5.1・Opus 5共通）

`output_config.effort`（`"high"`/`"max"`）をメッセージ単位・ターンごとに切り替え可能になりました（ヘッダー: `mid-conversation-output-config-2026-07-01`）。ターン間でプロンプトキャッシュは保持されるため、「通常は軽めに、難しい局面だけeffortを上げる」といった運用がキャッシュを壊さずに行えます。

### 6. テキストウォーターマーク・C2PA対応（EU AI Act対応）

Fable 5.1・Mythos 5.1のテキスト出力には、**不可視のテキストウォーターマーク**が付加されます。検出ツールなしでは目視できませんが、Anthropicの検出APIで識別可能です。

- **法規制上の背景**: **EU AI Act Article 50**は、AI生成コンテンツを機械可読な形式でマークし検出可能にすることをプロバイダーに義務付けています。この要件は**2026年8月2日以降にリリースされたモデルに適用**され、Fable 5.1・Mythos 5.1はローンチ時点からこの要件に対応した最初のモデル群です。
- **ウォーターマーク検出API（private preview）**: Anthropicは検出APIを**private preview**で提供していますが、対象は**規制当局・法執行機関・メディア・ファクトチェッカー・独立研究者・教育機関・EU市民社会団体**に限定されています。一般開発者向けの公開APIではありません。
- **C2PA Content Credentials**: コード実行ツール経由で生成された画像・動画には、C2PA（Coalition for Content Provenance and Authenticity）準拠のContent Credentials（来歴メタデータ）が付与されます。

**実務上の含意**: 自社アプリケーションでFable 5.1の出力を扱う場合、ウォーターマーク自体はテキストに埋め込まれますが、**自社で検出・除去する手段は用意されていません**（検出APIはEU規制対応の限定公開のため）。フォーマット変換・再保存の過程でウォーターマークが失われる可能性がある点も留意してください。

詳細なAPI仕様は [Anthropic Messages API 新機能まとめ 第16章](/mdTechKnowledge/blog/anthropic-messages-api-new-features-2026/) も参照してください。

## 誰が使うべきか

### 積極的に移行すべき

- **長い会話・大きなシステムプロンプトを繰り返しキャッシュしているワークロード**: キャッシュ読み取り90%削減の恩恵が最大化されます。エージェント型の長時間セッションほど効果が大きいです。
- **これから新規にFableクラスのモデルを導入する開発者**: 9/1以降、Fableの既定はFable 5.1です。特別な理由がなければ5.1から始めるのが自然です。
- **エージェントの進捗をユーザーに見せたいが、生の思考過程は隠したい実装**: `thinking.display: "updates"`が適します。

### 移行前に必ずコードを確認すべき

- **`tool_choice: "any"`/`"tool"`を使っている実装**: そのまま切り替えると400エラーになります。strict tool use / structured outputsへの書き換えが必要です。
- **複数モデルを動的に切り替えるルーティング構成**: Fable 5.1のthinking blockを旧モデルに渡す経路がないか確認してください。

### 当面Fable 5に留まってよいケース

- 上記の破壊的変更（特に`tool_choice`）への対応工数が今すぐ確保できず、キャッシュコスト削減の恩恵も小さい（キャッシュをほとんど使わない単発リクエスト中心）ワークロード。Fable 5は引き続き提供されており、即座の移行を強制されるものではありません。
- **Claude apps gateway経由のセッション**: ゲートウェイがFable 5.1に未対応の場合、`fable`/`best`エイリアスは当面Fable 5に解決され続けます（Claude Code v2.1.257の変更点）。5.1を使うには`/model`で明示的に選択する必要があります。

## サブスクプラン上の扱い

Claude.ai / Claude Code / Coworkのサブスクプラン（Pro/Max/Team）での扱いについて、本記事執筆時点でFable 5.1固有のアナウンスはありません。価格がFable 5と同額であることから、[Fable 5のプラン別扱い](/mdTechKnowledge/blog/claude-fable-5-pro-plan-availability/)（Max/Team Premiumは週間上限50%として恒久組み込み、Pro/Team StandardはUsage Credits）と同枠組みが引き継がれると見られますが、公式発表があり次第、本記事を更新します。

## まとめ

- **2026年9月1日リリース**。Fable 5.1がFableファミリーの既定モデルに
- **価格は同額（$10/$50）、キャッシュ読み取りのみ90%削減**（$0.25/MTok）— 長時間セッションほど恩恵大
- **`tool_choice: "any"`/`"tool"`が400エラーに** — 移行前に必ずコードを確認
- **thinking blocksの保持ルール変更** — モデル動的切り替え構成は要確認
- **thinking display「updates」モード追加**（ベータ）で進捗表示が可能に
- Claude apps gateway経由では当面Fable 5に解決されるため、5.1を使うには明示選択が必要

## 関連記事

- [Claude Fable 5 徹底解剖①概要編](/mdTechKnowledge/blog/claude-fable-5-overview/)
- [Claude Fable 5 徹底解剖②ベンチマーク・性能編](/mdTechKnowledge/blog/claude-fable-5-benchmarks/)
- [Claude Fable 5 は Pro プランで使える？](/mdTechKnowledge/blog/claude-fable-5-pro-plan-availability/)
- [Anthropic Messages API 新機能まとめ（2026年5〜8月）](/mdTechKnowledge/blog/anthropic-messages-api-new-features-2026/)
- [Claude Code バージョン履歴まとめ](/mdTechKnowledge/blog/claude-code-version-history/)

## 参考資料

- [Anthropic Platform リリースノート（2026-09-01）](https://platform.claude.com/docs/en/release-notes/overview)
