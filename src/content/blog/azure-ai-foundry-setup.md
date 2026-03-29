---
title: "Azure AI Foundry 初期セットアップ手順書"
date: 2026-03-29
category: "その他技術"
tags: ["Azure", "AI Foundry", "VNet", "Private Endpoint", "Codex"]
excerpt: "Azure AI Foundryの初期セットアップ手順（ハブ・プロジェクト作成、VNet/PE設定、モデルデプロイ、RBAC設定等）をまとめた手順書。"
draft: false
---

## 手順書の構成

### 1. はじめに
- 本書の目的と前提条件
- 必要な権限・サブスクリプション

### 2. Azure AI Foundryの概要
- ハブとプロジェクトの関係
- アーキテクチャ図（テキスト）

### 3. ハブの作成
- Azure Portalでの操作手順
- CLI手順も併記

### 4. プロジェクトの作成
- Foundryポータルでの操作手順

### 5. VNet / Private Endpoint設定
- VNet・サブネット設計
- Private Endpoint作成手順
- DNS設定と検証手順
- ファイアウォール設定（オプション）

### 6. モデルデプロイ
- Codexモデルの選択とデプロイ手順
- デプロイ確認方法

### 7. エンドポイント・APIキー取得
- ポータルからの取得手順
- 認証方式の説明

### 8. RBAC設定
- 企業向けロール構造
- ユーザー追加手順

### 9. データ保持ポリシー
- Modified Abuse Monitoring
- Zero Data Retention設定

### 10. Codex CLI接続設定
- config.toml設定
- 環境変数設定
- 動作確認

### 11. 検証チェックリスト

## 参照URL

- [Quickstart: Create Foundry Resources](https://learn.microsoft.com/en-us/azure/foundry/tutorials/quickstart-create-foundry-resources)
- [Configure Private Link](https://learn.microsoft.com/en-us/azure/foundry/how-to/configure-private-link)
- [Virtual Networks for Agents](https://learn.microsoft.com/en-us/azure/foundry/agents/how-to/virtual-networks)
- [Codex How-To](https://learn.microsoft.com/en-us/azure/foundry/openai/how-to/codex)
- [RBAC for Foundry](https://learn.microsoft.com/en-us/azure/foundry/concepts/rbac-foundry)
- [Setup Azure AI Foundry (DevOps Cube)](https://devopscube.com/setup-azure-ai-foundry/)
