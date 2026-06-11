---
title: "Code with Claude Tokyo 2026 全セッションまとめ — 誰が・何を・いつ話したか（動画タイムスタンプ付き）"
date: 2026-06-11
category: "Claude技術解説"
tags: ["Code with Claude", "Code with Claude Tokyo", "Anthropic", "Claude Code", "Claude Fable 5", "Claude Managed Agents", "Canva", "楽天", "みずほ", "NRI", "カンファレンス", "セッション一覧"]
excerpt: "2026年6月10日に開催された Anthropic の開発者カンファレンス Code with Claude Tokyo（東京会場）の、約9.8時間のライブ配信アーカイブを全12セッションに整理。誰が・どのテーマを・アーカイブのどの時間帯で話したのかを一覧表（YouTube頭出しリンク付き）にまとめ、各セッションの要点も収録。Anthropic キーノート（Fable 5 / Opus 4.8・Claude Code 新機能）に加え、Canva・楽天・みずほFG・NRI など国内外の事例セッションをカバー。"
draft: false
---

> **ご注意**: スライド本文はSonnetの視覚読み取りベースのため、細かな数値・固有名詞にOCR的な読み取り誤差が含まれる可能性があります（例: SWE-bench Proの数値など）。重要箇所を引用される際は元動画での確認をおすすめします。

本記事は、約9.8時間に及ぶ東京会場のライブ配信アーカイブを **全12セッション** に分割し、登壇者・テーマ・登場時間帯を一覧化したものです。長時間アーカイブの「目次」としてご活用ください。

## セッション一覧

時間帯はライブ配信アーカイブ内の経過時間です。各リンクをクリックすると、その頭出し位置から再生できます。

| # | 時間帯（頭出し） | セッション | 登壇者 |
|---|---|---|---|
| 1 | [1:01:00〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=3660s) | 基調講演① プラットフォーム & モデル | Katelyn Lesse / Dianne Penn（Anthropic） |
| 2 | [1:31:00〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=5460s) | 基調講演② Claude Code | Cat Wu（Anthropic, Head of Product for Claude Code） |
| 3 | [2:18:20〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=8300s) | Claude Code の新機能ディープダイブ | Anthropic（Claude Code プロダクトチーム） |
| 4 | [2:53:20〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=10400s) | Inside Canva AI — 数千万ユーザー向けエージェント設計 | Danny Wu（Canva, Head of AI Products） |
| 5 | [3:45:20〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=13520s) | Claude Managed Agents で本番投入を加速する | Michael Cohen / Jessica Yan（Anthropic） |
| 6 | [3:59:40〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=14380s) | Fireside chat — Jessica Yan & Yusuke Kaji | Jessica Yan（Anthropic） / Yusuke Kaji（Rakuten） |
| 7 | [5:28:20〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=19700s) | Rakuten's AI-nization — 自律化 × エンパワーメント | Yusuke Kaji（Rakuten） |
| 8 | [6:14:20〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=22460s) | みずほにおけるAIネイティブな開発組織の構築 | 藤井 達人 / 染谷 謙太郎（みずほFG） |
| 9 | [7:03:40〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=25420s) | フロンティアモデルの進化を引き出すエージェント設計 | Anthropic |
| 10 | [7:43:20〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=27800s) | NRIの業務タスク・ベンチマークによるモデル選定 | 北村 雄騎（野村総合研究所） |
| 11 | [8:33:40〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=30820s) | プロンプトキャッシングとコンテキスト・エンジニアリング | Anthropic |
| 12 | [9:15:20〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=33320s) | ソフトウェア開発の民主化と、その先の未来 | 辻 順一郎（Junichiro Tsuji） |

## Code with Claude Tokyo とは？

**Code with Claude** は Anthropic が開催する開発者向けカンファレンスです。2026年はまず5月6〜7日に米サンフランシスコ本社でメインイベントが開かれ、その後 London（5/20-21）、そして **東京（6/10 メイン / 6/11 Extended）** へと巡回しました。本記事が扱うのは、この **東京会場（2026年6月10日）** のライブ配信アーカイブ（約9.8時間）です。

東京会場は、Anthropic によるキーノート（プラットフォーム／モデルの最新動向、Claude Code の新機能）に加えて、**Canva・楽天・みずほフィナンシャルグループ・野村総合研究所（NRI）** といった国内外の導入事例セッションで構成されています。新モデル **Claude Fable 5 / Opus 4.8**、エージェント開発基盤 **Claude Managed Agents**、そして **Claude Code** の自律化機能（Auto mode・Worktrees・Routines・Remote Control など）が主要テーマでした。

> SF本会場の全体像は別記事 [Code with Claude 2026 開発者カンファレンス まとめ](/mdTechKnowledge/blog/code-with-claude-2026-conference/) を参照してください。本記事は **東京会場のセッション構成** に絞っています。

## 各セッションの見どころ

各セッションの要点を、投影資料の書き起こしから整理しました（冒頭の注意書きのとおり、数値・固有名詞には読み取り誤差を含む可能性があります）。

### 1. 基調講演① プラットフォーム & モデル

**登壇者**: Katelyn Lesse / Dianne Penn（Anthropic） ｜ **頭出し**: [1:01:00〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=3660s)（動画 1:01–1:30）

Claudeプラットフォームの急成長とFable 5・Opus 4.8投入によりエージェント開発が本格化フェーズへ

- ClaudeプラットフォームのAPIボリュームが2025年比で大幅に拡大（内部データ Jan–May 2025 vs 2026）
- 新モデルFable 5・Opus 4.8をリリース：SWE-bench ProでFable 5が80.0%、Mythos Previewが77.8%、Opus 4.8が69.2%を達成
- Fable 5とOpus 4.8は補完関係にあり、Project Glasswingとして統合的に位置づけ
- コンテキストウィンドウ100万トークン対応にMemory・Skillsを組み合わせ、長期エージェントタスクを実現
- Vibecodeソース引用で「本番グレードのエージェントを最大10倍速く構築」が可能に
- Rakuten AI・LEGORA・Asana・Atlassian Williams F1 Teamなど多様なパートナーが実採用

**具体例・数値**
- SWE-bench Pro スコア：Fable 5 = 80.0%、Mythos Preview = 77.8%、Opus 4.8 = 69.2%
- Ecommerce Basket Analysis Agentデモ：orchestrator + reporter / analyst / forecaster の3サブエージェントが並列処理
- LEGORAデモ：SPAドラフトプランを6秒で生成し、7以上のTodoをステップ化
- Shinkiro Racingデモ：空力・タイヤ熱・パワーユニット・ドライバー安全の4研究プロジェクトをリアルタイム追跡
- medkit+：複数専門エージェントが役割分担する医療トレーニング用デモを展示
- AtlassianはWilliams F1 TeamのOfficial Thinking PartnerとしてClaudeを採用

### 2. 基調講演② Claude Code

**登壇者**: Cat Wu（Anthropic, Head of Product for Claude Code） ｜ **頭出し**: [1:31:00〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=5460s)（動画 1:31–2:17）

Claude Codeは個人開発者から組織全体へ — マルチエージェント・リモート制御・Routinesで"常に動くエンジニアリングチーム"を実現

- Claude Codeの目標は「個人開発者から組織全体のエンジニアリング」への展開
- マルチセッション管理UIにより、複数タスクを並列で走らせ、人間は判断が必要な箇所だけに介入する運用を実現
- Remote Controlにより、iPhoneなどモバイル端末からリモートセッションを操作・指示可能
- Routinesでは、スケジュール・GitHubイベント・API呼び出しをトリガーとした自律的なワークフロー自動化が可能
- マルチエージェントのワークフロー機能により、12言語の翻訳を24エージェントが並列実行するような大規模タスクを一括処理
- Spotify（月1,000+ PR）、mercariなど大規模導入事例が示す、エンジニアリング組織全体での活用実績

**具体例・数値**
- デモ: 「add-locales」ワークフロー — 12言語ロケールファイルを24エージェント・822.8kトークンで並列生成・検証し完了
- 各翻訳エージェント(translate:es, fr, de … 計12言語)はそれぞれ約30.4kトークン・約51秒で完了
- テストカバレッジタスク例: billing/ モジュールを61% → 92%に引き上げPR #408マージ完了
- Remote Controlデモ: iPhoneからの指示でApp Store申請却下の2件のバグを修正(+22 -11)、アーカイブをApp Store Connectにアップロード
- Kaizen Operations(デモ用仮想企業)のClaude Code利用統計: 856セッション・80,348メッセージ・106.3Mトークン・連続使用11日
- Spotify導入実績: Claude Codeにより月1,000件超のPRを生成

### 3. Claude Code の新機能ディープダイブ

**登壇者**: Anthropic（Claude Code プロダクトチーム） ｜ **頭出し**: [2:18:20〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=8300s)（動画 2:18–2:39）

Claude Code の新機能群が「自律性」と「開発者体験」の両軸で大幅強化され、Auto mode・Worktrees・Routines・Dynamic workflows が並列・自動化作業を実現

- 新機能は「Developer experience」と「Autonomy」の2軸で整理されている
- Auto mode: 承認なしに安全なコマンドを自律実行し、リスクある操作（例: rm -rf）は自動ブロック
- Worktrees: Git worktreeを使いサブエージェントが並列でフィーチャー開発を独立実施
- Routines: マルチステップワークフローをスケジュール・GitHub イベント・API トリガーで自動実行
- Dynamic workflows: 多数の並列サブエージェントをオーケストレーションし困難なタスクを一括処理
- Agent view: 複数セッションの状態（awaiting input / working / completed）を一画面で管理
- Remote Control により CLI・Desktop・Web・Mobile からセッションに横断アクセス可能

**具体例・数値**
- Auto mode のデモ: pnpm test で 42 passed、rm -rf build/ は risky と判定してブロック、safer な pnpm clean を代替実行
- Code review: 28 候補を検出 → マルチエージェント分析で 11 confirmed・17 refuted に絞り込み
- Agent view デモ (v2.1.129): 4 awaiting input・3 working・6 completed を同時管理; 84 ファイルのリネームやリンク 412 ページのクロールを並行実施
- Routines デモ: cron 0 */5 * * * で excalidraw の Issue を定期トリアージ、8 件を自動分類・コメント投稿
- Auto memory: 「pnpm を使う」と指示すれば MEMORY.md に記録し、別日のセッションが自動参照して pnpm install を実行
- Recent changelog に 1M Context・Voice mode・Computer use・HTTP/MCP hooks・Claude push notifications 等 18 項目が列挙

### 4. Inside Canva AI — 数千万ユーザー向けエージェント設計

**登壇者**: Danny Wu（Canva, Head of AI Products） ｜ **頭出し**: [2:53:20〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=10400s)（動画 2:53–3:24）

数千万ユーザーを支えるCanva AIは「ハーネスを使い捨て前提で設計し、コストと品質の効率フロンティアを常に更新する」ことで進化し続ける

- Claudeが月数千万人規模のCanvaユーザー向けAIを駆動しており、Haiku/Sonnet/Opusをタスク複雑度に応じてルーティング
- ワンショット完成を追うより「ユーザーとのイテレーション」を重視——公開済みデザインは平均110回編集され、約13%のユーザーのみが「完璧な仕上がり」を求める
- ハーネスは使い捨て前提——モデル更新のたびに再構築し、Conductor→Conductor2→Conductor3と世代交代を繰り返してきた
- コスト管理の三本柱: ターンバジェット上限・スマートモデルルーティング・コスト可視化文化
- SonnetをメインキャッシュエージェントとしOpus/Haiku をサブエージェントに委譲する構成で、コスト-46%・ユーザー成功指標+9%を達成
- ボーカルユーザーのフィードバックは定量メトリクスが「強い緑」でも無視しない——コミュニティ事例を約300件evalセットに加えてv2をリリース
- 核心教訓: 「ユーザーが本当に望むものを決めつけない」「evalはリリース前に完璧を待たず飛び回せ」

**具体例・数値**
- 月間ユーザー数: 2億6500万人、社員数約5000人で全プロダクト組織がAIを開発
- タスクバジェット例(Claude Opus 4.8): 50kトークン→8スライド / 25k→7スライド / 10k→4スライド
- タスクバジェットAPIはClaude Opus 4.7・4.8でネイティブサポート、Sonnet/Haiku向けにはリマインダーインジェクションで拡張
- ターンバジェットのハード上限は「ソフトリミット+約20%+1ターン」の猶予を設けてから外部終了
- E2Eマルチターンevalは数千件規模、実ユーザーセッションの合成複製(同意取得済み)も活用
- アップスケーラーv2: コミュニティ報告~300件をevalセットに追加→内部テスト→サイレントA/Bテスト→100%展開
- A/Bテスト成功基準: 99.5%超の信頼水準、アップスケール公開数約4倍増、フィーチャー継続率向上

### 5. Claude Managed Agents で本番投入を加速する

**登壇者**: Michael Cohen / Jessica Yan（Anthropic） ｜ **頭出し**: [3:45:20〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=13520s)（動画 3:45–3:59）

Claude Managed Agentsが提供するインフラ基盤で、エージェントの本番投入を阻む複雑性・可観測性・セキュリティ課題を一括解決する

- モデル能力は指数的に向上し、タスク水平線が「秒」から「日」単位へ拡大している（Opus 3→Opus 4.8+）
- 本番投入を阻む3大障壁：開発者の1/3がメモリ・コンテキスト管理に苦労、企業の50%がインフラ懸念を1位の障壁に挙げ、エージェントの54%が可観測性なしで稼働
- Claude Managed Agentsはこれらを解決するFoundational infrastructure——サンドボックス・クレデンシャルプロキシ・自動コンテキスト管理・リトライ/エラー回復/チェックポイントを内包
- 開発者プリミティブとして、バージョン管理された状態付きリソース（agent / environment / session）と柔軟なイベントトポロジーを提供
- 可観測性はSession TracingとAsk Claude in Consoleで担保
- 新機能として、マルチエージェントオーケストレーション・セルフホストサンドボックス・Outcomes・Memory・Dreaming・MCP Tunnels・スケジュールデプロイ・Vault環境変数が公開ベータまたはResearch Previewで提供開始

**具体例・数値**
- デモ「Just in Thyme」：800K注文ライン・6テーブルJOIN・33,810ユニーク製品のデータを単一エージェントが約5分18秒で分析、全体96%のCPU稼働率
- ワークフロー4フェーズ：Setup 6s → Analysis 1m31s → Build 3m43s → Verification 0s
- Pythonスクリプト実行はMLトレーニング込みで2〜9秒、タイムアウトなし
- エラー自動修復：2スクリプトが失敗→エージェントが自律的に修正→成功、オーバーヘッドは約25秒
- 59%の全体リオーダー率など、エージェントが自律的にビジネス洞察を生成
- 開発者向けスターターリソース：/claude-api スキル・CLI（ant beta:agents create）・Cookbooks

### 6. Fireside chat — Jessica Yan & Yusuke Kaji

**登壇者**: Jessica Yan（Anthropic） / Yusuke Kaji（Rakuten） ｜ **頭出し**: [3:59:40〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=14380s)（動画 3:59–4:11）

AnthropicとRakutenが語る、ビジネスにおけるAI活用の現在地と展望

- 登壇者: Jessica Yan（Anthropic、Member of Technical Staff）とYusuke Kaji（Rakuten、General Manager, AI for Business）による対談形式セッション
- Anthropic側とエンタープライズ導入側の双方の視点からAIビジネス活用を議論
- セッションはファイアサイドチャット形式（投影スライドはタイトルとクロージングのみ）
- クロージングメッセージ「Thank you for building with us」でAnthropicとの協業・共創姿勢を表明
- 参加者向けにQuickstartの案内が提示され、実際に試すことが促された

### 7. Rakuten's AI-nization — 自律化 × エンパワーメント

**登壇者**: Yusuke Kaji（Rakuten） ｜ **頭出し**: [5:28:20〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=19700s)（動画 5:28–5:58）

自律性×エンパワーメントの2軸でAIエージェントを評価し、ワークフロー再設計とメモリで成果を複利化する楽天のAI-nization戦略

- エージェントの価値は「自律性（Autonomy）」と「適用範囲の広さ（Breadth）」の2軸でスケールする
- モデルの知能ではなくワークフロー設計がボトルネック——業務構造を再設計し情報をエージェントに読める形にすることが先決
- タスクではなくゴールを委譲することが、非エンジニアへのAI民主化の核心
- メモリが1セッションの学習を企業資産に変え、リリースを重ねるごとに成果を複利で積み上げる
- 次世代の自律エージェントには「自省」——失敗しつつあるパスを自ら認識してやり直す能力——が不可欠
- AI-nization実現の鍵は①独自評価フレームワーク②ワークフロー再定義③エージェントメモリの3つ

**具体例・数値**
- Rakuten-SWE-Bench：自社本番コードに根ざした2段階カスタム評価を構築、Opus 4.7 vs 4.6 で本番タスク完了率が3倍
- Managed Agentsパイロット：クリティカルエラー97%削減、コスト・レイテンシ30%以上削減
- 非エンジニアのパワーユーザー「Galileo」：主要リリースサイクルを四半期→2週間に短縮し、マルチクラウドFinOpsパイプラインとアンビエント異常検知エージェントを運用
- エンジニアリングチームが自己改善型オブザーバビリティエージェントとエンジニア支援不要のSkillsを構築
- 評価軸にコスト（タスク完了あたり）と完了率を併記——母集団スケールでの実現可能性でロールアウトを判断

### 8. みずほにおけるAIネイティブな開発組織の構築

**登壇者**: 藤井 達人 / 染谷 謙太郎（みずほFG） ｜ **頭出し**: [6:14:20〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=22460s)（動画 6:14–6:47）

みずほFGがAI前提の業務再設計と内製開発基盤「Wiz Base」でAIネイティブ組織への変革を推進

- 「AI活用」ではなく「AI前提」の業務プロセス再設計を組織変革の核心に据える
- Human In The Loopから Human On The Loopへ——AIが業務を主導し、人は設計・管理・監督にシフト
- CDTO直下にDX TFを設置し、各部門にDX Leadを配置する司令塔×現場推進の二層体制
- AI開発ガバナンスフレームワーク「みずほAIOA」（50ページ）とAIエージェント基盤「Wiz Base」を整備
- 40名の内製開発ラボ全員にClaude Codeを配布し、1〜5名×25プロダクトの小チーム高速開発を実現
- ハーネスをコードではなくドキュメントに集約し、Wiz BaseのコンテキストをClaude Codeに注入してガバナンスを維持
- 生産性指標をPR数・行数からOKRへの貢献にシフト。セキュリティ・コードレビュー領域では10倍の生産性向上

**具体例・数値**
- 内製開発ラボ：エンジニア約50名、25プロダクト同時開発、1プロダクトあたり1〜5名
- Claude Opus 4.8を公開当日に内製開発ラボで展開——BedrockでモデルをBedrock集約し即日適用
- 営業支援AI「みずほRM Studio」：営業準備時間の大幅削減により営業活動生産性2倍以上
- エージェンティック開発の新指標：セキュリティ/コードレビュー領域で10倍、2週間で複数プロトタイプ作成可能
- PoC稼働中を含め数十のAIエージェントが稼働。めんきくん（音声→議事録）、AiHawk Filter（監査監視）等が本番稼働
- AIトランスフォーメーションのロードマップ：Ph.1（FY2025–2027）E2Eプロセス再設計→Ph.2（2028–2030）AI組込運用拡大→Ph.3（2031–2035）AIネイティブモデル設計
- 過剰設計の罠への教訓：モデル性能向上に伴い個別最適チューニングは過剰設計となる——汎用エージェント+ハーネス設計でアジリティを確保

### 9. フロンティアモデルの進化を引き出すエージェント設計

**登壇者**: Anthropic ｜ **頭出し**: [7:03:40〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=25420s)（動画 7:03–7:24）

モデル進化に合わせてエージェント設計を刷新し、計画・自己修正・長時間実行の能力向上を最大限に引き出す

- モデルの世代ごとに「天井」が上がり続けており、エージェント設計もそれに追従する必要がある
- モデルの進化は「行動前に計画する」「エラーから自己修正する」「長文脈で一貫性を保つ」の3点に集約される
- これらの能力が積み重なることで、エンドツーエンドのタスク完了（真の自律性）が実現する
- 設計指針①：評価(eval)を実際のトラフィックに合わせて更新し、飽和した指標は刷新する
- 設計指針②：前モデルの弱点回避のための過剰な足場(scaffolding)を削ぎ落とし、意図を記述する
- 設計指針③：モデルに考える余地と適切なアクセス権を与え、エージェントループを自己検証で閉じる

**具体例・数値**
- SWE-bench Verified スコアの推移：Sonnet 3.7（62.3%、2025年2月）→ Opus 4.8（88.6%、2026年5月）
- 同一タスクのデモ比較：12か月前と現在でツール使用回数・実装完成度が大幅向上
- 1Mトークンまでのコンテキスト全体で一貫性を維持できるようになり、コードベース全体を渡して処理可能に
- Shopify（Tom Pritchard）：Opus 4.8はより良い判断力を持ち、計画の不備に自ら気づき修正する
- Cursor（Michael Truell）：CursorBenchで全努力レベルで過去のOpusを上回り、ツール呼び出しが効率化
- Cognition（Scott Wu）：Opus 4.8はツール使用がクリーンで指示の一貫性も高く、無人実行ワークロードに適合

### 10. NRIの業務タスク・ベンチマークによるモデル選定

**登壇者**: 北村 雄騎（野村総合研究所） ｜ **頭出し**: [7:43:20〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=27800s)（動画 7:43–8:12）

NRIが業務観点4軸ベンチマークで検証し、複雑指示追従の強さからClaudeを選定した知見と設計原則

- モデル評価の前提は「業務のどこで何が起きたら成功か」を分解すること——スコアより業務観点が先
- NRI社内ベンチは日本語業務文書の解釈・OCR×文書理解・「わからない」と言える能力・複雑指示の整合性の4軸で測定
- Claudeが選ばれた決定的理由は「大量の業務指示を最後まで破綻なくやり切る」Complex Instruction Following
- 新モデル公開翌日に自動でベンチが走り社内共有される運用パイプラインを構築、アドバイザリーの基盤に
- 「派手なデモが動く」と「業務が回る」は別物——評価設計なしにモデル進化の恩恵は受け取れない
- プロンプト職人芸でなく、業務知識をSkillsとして言語化・資産化することがモデル更新を跨いで恩恵を受ける唯一の方法
- 業務を言語化できる組織だけがモデル進化の恩恵を継続して受け取れる——クロージングメッセージ

**具体例・数値**
- ベンチマーク規模: 業務観点4軸 × 50〜200タスクを自動実行、100+ユースケースの実績に還元
- Claude Sonnet 4.6: 1Mコンテキストにより大量設計書を横断する影響分析が一晩で完走
- Claude Opus 4.7: 生成→検証→反省→再生成の自己検証が指示なしで動作、品質管理工程への組み込みが可能に
- Opus 4.7で破綻しなくなった業務例: 法規制文書×社内ルールの併存指示、数十ページ設計書からのTDD前提テストコード生成、1ターン内での設計書ドラフト→レビュー→修正案の三段階自己処理
- Anthropic公式Case Study（2025年5月）: 業務文書レビュー時間を50%削減
- 価値あるベンチの3条件: 実書類で構成（合成データ不使用）・成功/失敗の二値判定可能・新モデル翌日に自動実行
- まとめ5原則: 業務観点ベンチを持つ／複雑指示追従を選定軸に加える／業務知識をSkills資産化／業務軸での評価設計／モデル切替を月次で判断できる体制構築

### 11. プロンプトキャッシングとコンテキスト・エンジニアリング

**登壇者**: Anthropic ｜ **頭出し**: [8:33:40〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=30820s)（動画 8:33–9:00）

プロンプトキャッシングとコンテキスト・エンジニアリングの3技法で、エージェントのコスト・速度・実行品質を同時に最適化する

- まず「プロンプトキャッシュヒット率80%以上」を最優先で達成することが前提条件
- コンテキスト・ウィンドウ・エンジニアリングとは「何をClaudeのコンテキストに入れるか」を設計する規律
- Tool Search：未使用のツールスキーマをコンテキストから除外し、200ツールのうち必要な分だけをオンデマンドで取得
- Programmatic Tool Calling：中間ツール結果をサンドボックスで処理し、最終的な小さな結果だけをコンテキストに戻す
- Compaction：古いターン履歴を自動要約することでコンテキスト超過を防ぎ、実行ターン数を無制限化
- Advisorストラテジー：SonnetをメインループにしつつOpusをオンデマンドで呼び出し、複雑タスクのみ高精度判断を付与
- Key Takeawayの位置付け：キャッシング→コンテキスト管理3技法→Advisorの順序で段階的に最適化する

**具体例・数値**
- 実績キャッシュヒット率：Replit 93%、Cursor 94%、Perplexity 90.2%、Claude Code 97.4%
- HeroCorpデモ：キャッシュなし¥4,586→キャッシュ有効58%ヒットで¥2,146（コスト約半減）
- 全戦略適用後：83%キャッシュヒット、¥335コスト、Elapsed 23.5sで5目標完遂
- Tool Search採用事例：Lovable「メインエージェントのプロンプトトークンを約10%削減、全ユーザーに本番展開済み」（Fabian Hedin, CTO）
- Programmatic Tool Calling：317KBのinvoice HTMLをサンドボックスで処理しコンテキストへは280バイトのみ返却（20往復→1スクリプト化）
- Compaction採用事例：HEX「自社コード3,000行を削除でき、ユーザー苦情がゼロになった」（Izzy Miller, AI Engineer）
- Advisorデモ：SonnetがGREENと判定した契約更新をOpusがAMBERに覆し、隠れたリスク（Gala依存）を検出

### 12. ソフトウェア開発の民主化と、その先の未来

**登壇者**: 辻 順一郎（Junichiro Tsuji） ｜ **頭出し**: [9:15:20〜](https://www.youtube.com/watch?v=GiqyYQdYoIY&t=33320s)（動画 9:15–9:38）

コードを書けることより課題を深く知ることが価値を持つ、ソフトウェア開発民主化の新時代が到来

- ソフトウェアを作る障壁が消え、「コードが書けるか」から「課題を言葉にできるか」へ制約が移動した
- 民主化は今回が初めてではなく、表計算・ウェブ・スマートフォンに続く第4の波として位置づけられる
- 「Built with Opus」ハッカソンで世界から選ばれた500人のうち、上位5組中4組が職業エンジニアではなかった
- 今最も強いのは「コードが書ける人」ではなく、「その分野の課題を誰よりもよく知っている人」
- ZapierやEpicでは非エンジニアによるAI活用が急拡大し、現場主導での広がりが実証されている
- 日本でも同様の動きが加速しており、「Claude Community Ambassadors Japan」を発足・募集開始

**具体例・数値**
- CrossBeam（弁護士 Mike Brown 作）: カリフォルニア州の建築許可初回却下率90%超・施主負担3万ドル問題を、図面投入から20分で行動計画を生成することで解決。Buena Park市が導入検討
- PostVisit（心臓専門医 Michał 作）: 診察後の患者ケアを平易な言葉で自動解説。ブリュッセルからSFへの飛行機内で開発
- TARA（ウガンダ交通省出身 Kyeyune 作）: 道路評価に要する期間を「数週間→5時間」、通常1〜4百万ドル・9〜14ヶ月の作業を自動化
- Zapier: 全社ハッカソン後、社員97%がAIを日常活用・AIエージェント数が従業員800人超を上回る
- Epic: リーダー合宿をハンズオン体験の場に転換し、AI活用の半数以上が非エンジニアから

## 制作の舞台裏 — Fable 5 が引き起こした“暴走”（失敗談）

実は本記事と、元にした全セッションのスライド資料は、9.8時間のアーカイブから約700枚のスライド静止画を抽出し、**Dynamic Workflows（マルチエージェント）** で1枚ずつ視覚的に読み取って作成しています。冒頭で「OCR的な読み取り誤差」と断っているのは、このためです。

その制作過程で、ひとつ大きな落とし穴にはまりました。

最初、メインのモデルを **Claude Fable 5** にした状態で Dynamic Workflows を起動したところ、**生成された36個のサブエージェントが、すべて Fable 5 で立ち上がってしまった**のです。Dynamic Workflows のサブエージェントは、明示的に指定しない限り **メインループのモデルを引き継ぐ** ためです。

Fable 5 は最上位クラスの高価なモデルです。それが36体、一斉に画像読み取りという重い処理を始めた結果、**わずかな時間でセッションの利用上限に到達**し、作業が強制的に中断されました。ずらりと並んだサブエージェントがすべて Fable 5 になっている画面は、なかなか“恐ろしい”光景でした。

<!-- 画像挿入候補: 全サブエージェントが Fable 5 で起動した画面のスクリーンショット（cwc-tokyo-fable5-subagents-swarm.png） -->

**教訓**: メインループを Fable 5 にしているときに Dynamic Workflows を使うなら、サブエージェントのモデルを **明示的に指定** する（例: `model: 'sonnet'`）。大量のサブエージェントで機械的な処理（視覚読み取り・転記・分類など）を並列実行する場合は、Sonnet で十分なことが多く、コストと上限の両面で安全です。実際、本記事は読み取りを **Sonnet** で再実行して完成させました。

## 関連記事

東京会場で取り上げられた主要トピックは、以下の記事で詳しく解説しています。

- [Code with Claude 2026 開発者カンファレンス まとめ](/mdTechKnowledge/blog/code-with-claude-2026-conference/)（SF本会場の全体像）
- [Claude Fable 5 徹底解剖①概要編](/mdTechKnowledge/blog/claude-fable-5-overview/)（新モデル Fable 5 / Opus 4.8）
- [Claude Managed Agents 簡易ガイド](/mdTechKnowledge/blog/claude-managed-agents-guide/)（エージェント開発基盤）
- [Claude Code Routines 完全ガイド](/mdTechKnowledge/blog/claude-code-routines-guide/)（定期実行ワークフロー）
- [Claude Code Dynamic Workflows ガイド](/mdTechKnowledge/blog/claude-code-dynamic-workflows-guide/)（マルチエージェント・オーケストレーション）

---

> 本記事は、東京会場ライブ配信アーカイブ（[YouTube](https://www.youtube.com/watch?v=GiqyYQdYoIY)）の投影資料を書き起こし・要約して作成しました。
