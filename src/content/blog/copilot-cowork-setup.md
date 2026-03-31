---
title: "Copilot Cowork 導入ガイド（閉域網対応・端末要件）"
date: 2026-03-29
updatedDate: 2026-03-29
category: "その他技術"
tags: ["Microsoft 365", "Copilot", "Copilot Cowork", "閉域網", "ExpressRoute", "Claude"]
excerpt: "Microsoft Copilot Coworkの導入手順書。閉域網（ExpressRoute）環境での制約・課題と端末要件を含む包括的なガイド。"
draft: false
---

## 閉域網前提での課題（重要）

調査の結果、**完全閉域網でのCopilot Cowork利用には根本的な課題**が判明した。

### 課題1: Anthropic Claude推論のトラフィック
- **Claudeモデルの推論はAnthropicのインフラ上で実行される**（Azure内で完結しない）
- プロンプト・出力は世界中どこでも処理される可能性がある
- ExpressRouteのMicrosoft Peering / Private Peeringではカバーされない
- **Copilot CoworkはClaude基盤のため、完全閉域網では原理的に利用困難**

### 課題2: WebSocket (WSS) 接続
- CopilotはWSS接続が必須（`*.cloud.microsoft`, `*.office.com`）
- WSSが遮断されるとCopilotが完全に動作不能
- 多くの企業プロキシがWSSを適切に処理できない

### 課題3: MicrosoftのExpressRoute非推奨方針
- MicrosoftはM365に対するExpressRouteの利用を積極的に推奨していない
- 承認は規制要件等のレアケースに限定

### 課題4: 閉域網で利用困難な機能
- ブラウザCopilot Chat（M365Copilot.com）
- Teams Copilot
- Copilot in Edge
- モバイルアプリ
- いずれもWSS＋インターネット側エンドポイントが必要

### 推奨：現実的な接続方式
- 完全閉域網ではなく**選択的インターネットブレイクアウト**を検討
- MicrosoftアカウントチームにCopilotエンドポイントのER対応を直接確認
- Anthropicへのデータ送信のコンプライアンス適合性を法務・セキュリティ部門と協議

---

## 手順書の構成

### 端末要件とインストール

- デスクトップ端末の要件（M365 Apps バージョン2511以降、更新チャネル）
- ブラウザからの利用（M365Copilot.com、Edge推奨）
- モバイル端末の要件（iOS 16.0+, Android 10+）
- ネットワーク要件（WSS必須、必要ドメイン、プロキシバイパス推奨）
- 管理者によるアプリ配布（Intune / SCCM / グループポリシー）

### 閉域網環境での利用に関する注意

- 閉域網での利用可否（概要・結論）
- Anthropic Claudeトラフィックの課題
- WebSocket (WSS) の課題
- ExpressRouteの対応状況
- 推奨接続方式（選択的インターネットブレイクアウト）
- 閉域網利用時の確認チェックリスト

---

## 閉域網制約 詳細調査レポート

調査日: 2026-03-22

### 0. Copilot Coworkとは

2026年3月9日発表。Anthropic Claudeモデルを基盤とし、Microsoft 365内で複数ステップのタスク（プレゼン準備、メール送信、スケジュール調整など）をバックグラウンドで自律的に実行するエージェント機能。現在Research Preview段階で、2026年3月下旬にFrontierプログラムで拡大予定。

---

### 1. Microsoft 365 Copilotの閉域網対応状況

#### ExpressRoute経由でのCopilot利用

- **Microsoftの公式スタンス**: Microsoft 365に対するExpressRouteの利用は **推奨されていない**。「ほとんどの状況で最良の接続モデルを提供しない」とされている。
- **利用にはMicrosoftの承認が必要**: 規制要件等により閉域網接続が必要であるとMicrosoftが認めた場合のみ、ExpressRouteの利用が承認される（レアケース）。
- **Copilot固有のExpressRoute対応**: 現時点で、Copilot専用のExpressRoute対応に関する明示的な記載は **確認できなかった**。

#### エンドポイントのカテゴリ分類

- Copilotの主要エンドポイント: `*.cloud.microsoft`, `*.office.com`
- Microsoft 365のエンドポイントは **Optimize / Allow / Default** の3カテゴリに分類される。
- 各エンドポイントに **ER列**（ExpressRoute対応可否）が記載されている。
- **`*.cloud.microsoft` ドメイン**: Microsoftは今後Copilotのエクスペリエンスをこのドメインに集約する方針を示しているが、このドメインのExpressRoute対応状況（ER: Yes/No）は **公式エンドポイント一覧で個別に確認が必要**。
- **重要**: ER列が「No」のエンドポイントはExpressRoute経由では到達できず、**インターネット経由での接続が必須**となる。

#### 結論

**Copilot関連トラフィックの多くはDefaultカテゴリに分類される可能性が高く、ExpressRouteではカバーされない可能性がある。** 完全な閉域網でのCopilot利用は現時点で保証されていない。

---

### 2. WebSocket (WSS) の閉域網での扱い

#### Copilotに必須のWSS接続

- Microsoft 365 Copilotは `*.cloud.microsoft` および `*.office.com` への **WSS（WebSocket Secure）接続が必須**。
- Copilot Pages、Copilot Notebooksは `*.svc.ms` および `*.office.com` へのWebSocketトラフィックの許可も必要。

#### プロキシ・ファイアウォールの課題

- **多くの企業プロキシはWSSを適切に処理できない**。プロトコルアップグレード（HTTP -> WebSocket）に対応していない、またはWSS通信を検査・中断する場合がある。
- **WSSが遮断されるとCopilotが完全に動作不能**になる。
- プロキシの設定要件:
  - `*.cloud.microsoft` および `*.office.com` のサブドメインに対してWebSocket接続を許可
  - プロトコルアップグレードを許可する設定が必要
- Microsoft 365管理センターでWSS接続の失敗をチェックする機能が提供されている。

#### ExpressRoute経由でのWSS

- ExpressRouteはL3接続であり、TCP/443上のWSSプロトコル自体は通過可能。
- **ただし、対象エンドポイントがExpressRoute対応（ER: Yes）でなければ、そもそもExpressRoute経由でルーティングされない。**

---

### 3. Anthropic Claude統合の閉域網制約（最重要課題）

#### 推論リクエストの処理場所

- **Claudeモデルの推論はAnthropicのインフラストラクチャ上で実行される**（Azure内で完結しない）。
- **AnthropicはMicrosoftの「独立プロセッサ」として位置づけられている。**
- Microsoft側は「APIデプロイメントインフラとAPIエンドポイントの提供・管理」を担当。
- **データ（プロンプト・出力）はAnthropicによって処理され、運用目的（パフォーマンス・キャパシティ管理）のために世界中のどこででも処理される可能性がある。**

#### 閉域網への影響

- **Claudeモデルへの推論リクエストはAzure外部（Anthropicのインフラ）へのトラフィックが発生する。**
- このトラフィックは **ExpressRouteのMicrosoft PeeringやPrivate Peeringではカバーされない**。
- Copilot CoworkはClaude基盤であるため、**閉域網のみでの利用は原理的に困難**。

#### データプライバシーへの懸念

- Anthropicのデータ利用条件（Microsoft Products and Services DPA準拠）が適用される。
- ゼロデータ保持（Zero Data Retention）オプションは利用可能。
- ただし、処理場所の地理的制約がないため、**データレジデンシー要件が厳しい企業には課題**。

---

### 4. Azure AI Foundry (Microsoft Foundry) の閉域網対応

#### Private Link / Private Endpoint対応

- **対応済み**: Azure AI Foundry（Microsoft Foundry）はPrivate Link / Private Endpointに対応。
- Private Endpointを使用することで、VNet内のクライアントからAzure Private Link経由でFoundryリソースに安全にアクセス可能。
- トラフィックはVNetとMicrosoft Azureバックボーンネットワークを経由し、パブリックインターネットへの露出を排除。

#### VNet統合

- **対応済み**: VNetインジェクションに対応。Agentクライアントは顧客管理のVNetサブネットに注入可能。
- Azure PaaSリソースへのアウトバウンド通信はPrivate Endpoint / Private Link経由。
- 全トラフィックを顧客定義のネットワーク境界内に維持可能。

#### 制約・要件

- 全Foundryワークスペースリソースは **VNetと同一リージョンにデプロイ必須**（Cosmos DB、Storage Account、AI Search、Foundry Account等）。
- サブネットには `Microsoft.App/environments` への委任が必要。
- 各リソースのパブリックネットワークアクセスを無効化する必要あり。
- サブネットはRFC1918プライベートIPv4範囲内（10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16）。

#### 重要な注意点

- **FoundryのPrivate Link対応はAzure内のリソース間通信を保護するもの**。Claudeモデルの推論自体がAnthropicインフラで実行される以上、**Private LinkだけではClaude推論トラフィックを完全に閉域網内に収めることはできない**。

---

### 5. 閉域網環境で利用できない可能性のある機能

#### ブラウザからのCopilot Chat（M365Copilot.com）

- `*.cloud.microsoft` ドメインへの接続が必要。
- ExpressRoute非対応の場合、**インターネット接続が必須**。
- WSS接続も必要であり、プロキシ制約により動作しない可能性あり。
- **閉域網のみでは利用困難な可能性が高い。**

#### Teams会議のCopilot

- Teams自体はExpressRoute対応エンドポイントが一部存在するが、Copilot機能部分のトラフィックは別途 `*.cloud.microsoft` 等への接続を要する場合がある。
- **Copilot固有のWSS接続が遮断されると、Teams Copilotは動作しない。**

#### Copilot in Edge

- ブラウザベースであり、Microsoftのクラウドサービスへの接続が必要。
- 閉域網環境では **インターネットブレイクアウトが必要**。

#### モバイルアプリ

- モバイルデバイスは通常、企業の閉域網に直接接続されない（VPN経由の場合あり）。
- VPN経由の場合、**WSSのプロトコルアップグレードが追加の課題**になる可能性。
- **モバイル利用は閉域網環境で最も制約が大きい。**

#### Copilot Cowork（Claude基盤機能）

- **閉域網のみでの利用は最も困難**。Anthropicインフラへのトラフィックが発生するため。

---

### 6. 閉域網での導入事例や公式ガイダンス

#### 公式ガイダンス

- Microsoftは **M365に対するExpressRouteの利用を推奨していない**（公式ドキュメントで明記）。
- 閉域網でのCopilot利用に関する **専用の公式ガイダンスは確認できなかった**。
- ネットワーク要件は一般的なM365ネットワーク要件ドキュメントに含まれている。
- Microsoftは「ネットワークレベルの制限（ドメイン・URL・IPブロッキング、プロトコルフィルタリング）によるCopilot Chat管理は推奨せず、サポートもできない」と明記。

#### 導入事例

- **閉域網でのCopilot Cowork導入事例は公開情報として確認できなかった**（Cowork自体が2026年3月発表のResearch Preview段階であるため）。

---

### 7. 総合評価と推奨事項

#### 主要リスク

| 項目 | リスクレベル | 理由 |
|------|------------|------|
| Copilot基本機能 | **中〜高** | エンドポイントがExpressRoute非対応の可能性、WSS要件 |
| Copilot Cowork | **極めて高** | Anthropicインフラへの外部トラフィックが発生 |
| データレジデンシー | **高** | Claudeの推論は地理的制約なしに処理される |
| WSS接続 | **高** | 多くの企業プロキシが非対応 |

#### 推奨アクション

1. **Microsoftアカウントチームへの直接確認**: Copilot関連エンドポイントのExpressRoute対応状況（ER列）の最新情報を確認する。
2. **ネットワーク設計の見直し**: 完全閉域網ではなく、**選択的インターネットブレイクアウト**（Copilot関連トラフィックのみインターネット経由）の検討。
3. **Copilot Cowork利用時のデータフロー確認**: Anthropicインフラへのデータ送信がコンプライアンス要件に適合するか、法務・セキュリティ部門と協議。
4. **段階的導入**: まずExpressRoute対応が確認できるM365基本機能から導入し、Copilot/Coworkは対応状況が明確になってから検討。
5. **Private Link / VNet統合の活用**: Azure AI Foundry側のリソースについてはPrivate Linkで保護可能だが、Claude推論トラフィックの外部経路は別途対策が必要。

---

## Sources

- [App and network requirements for Microsoft 365 Copilot admins](https://learn.microsoft.com/en-us/copilot/microsoft-365/microsoft-365-copilot-requirements)
- [Microsoft 365 URLs and IP address ranges](https://learn.microsoft.com/en-us/microsoft-365/enterprise/urls-and-ip-address-ranges?view=o365-worldwide)
- [Azure ExpressRoute for Microsoft 365](https://learn.microsoft.com/en-us/microsoft-365/enterprise/azure-expressroute?view=o365-worldwide)
- [Using ExpressRoute for Microsoft 365 Services](https://learn.microsoft.com/en-us/azure/expressroute/using-expressroute-for-microsoft365)
- [Implementing ExpressRoute for Microsoft 365](https://learn.microsoft.com/en-us/microsoft-365/enterprise/implementing-expressroute?view=o365-worldwide)
- [Data, privacy, and security for use of Anthropic Claude models in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/responsible-ai/claude-models/data-privacy)
- [Deploy and use Claude models in Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/foundry-models/how-to/use-foundry-models-claude)
- [How to configure network isolation for Microsoft Foundry](https://learn.microsoft.com/en-us/azure/foundry/how-to/configure-private-link)
- [Set up private networking for Foundry Agent Service](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/virtual-networks?view=foundry-classic)
- [WebSocket connection failures when accessing Copilot (Tech Community)](https://techcommunity.microsoft.com/discussions/deploymentnetworking/optimizing-customer-network-connectivity-for-microsoft-365-copilot/4374772)
- [WebSocket connections to critical Microsoft 365 domains (Tech Community)](https://techcommunity.microsoft.com/discussions/deploymentnetworking/websocket-connections-to-critical-microsoft-365-domains/4424770)
- [Understanding implications when using network Intermediation](https://learn.microsoft.com/en-us/microsoft-365/enterprise/network-intermediation?view=o365-worldwide)
- [Copilot Cowork: A new way of getting work done](https://www.microsoft.com/en-us/microsoft-365/blog/2026/03/09/copilot-cowork-a-new-way-of-getting-work-done/)
- [Introducing Anthropic's Claude models in Microsoft Foundry](https://azure.microsoft.com/en-us/blog/introducing-anthropics-claude-models-in-microsoft-foundry-bringing-frontier-intelligence-to-azure/)
- [Claude in Microsoft Foundry (Anthropic Docs)](https://platform.claude.com/docs/en/build-with-claude/claude-in-microsoft-foundry)
- [Microsoft Peering 導入時の注意事項 (Japan Azure Blog)](https://jpaztech.github.io/blog/network/considerations-of-microsoft-peering/)
- [Microsoft 365 Copilot 管理者のアプリとネットワークの要件 (日本語)](https://learn.microsoft.com/ja-jp/copilot/microsoft-365/microsoft-365-copilot-requirements)
