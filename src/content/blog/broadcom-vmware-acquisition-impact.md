---
title: "Broadcom VMware買収によるインフラ基盤への影響 調査レポート"
date: 2026-03-29
category: "一般リサーチ"
tags: ["VMware", "Broadcom", "仮想化", "ライセンス", "vSphere", "VCF", "移行", "infrastructure"]
excerpt: "BroadcomによるVMware買収（690億ドル）の経緯、ライセンス体系変更、日本市場への影響、顧客訴訟・規制動向、代替プラットフォームへの移行動向を網羅的にまとめた調査レポート。"
draft: false
---

**調査期間**: 2022年5月〜2026年3月

---

## 目次

1. [概要](#第1章-概要)
2. [時系列](#第2章-時系列)
3. [vSphere製品サポートライフサイクル](#第3章-vsphere製品サポートライフサイクル)
4. [ハイパースケーラーへの影響](#第4章-ハイパースケーラーへの影響)
5. [ライセンス体系変更の詳細](#第5章-ライセンス体系変更の詳細)
6. [日本市場への影響](#第6章-日本市場への影響)
7. [顧客訴訟・規制動向](#第7章-顧客訴訟規制動向)
8. [代替プラットフォームへの移行動向](#第8章-代替プラットフォームへの移行動向)
9. [情報ソース一覧](#第9章-情報ソース一覧)

---

## 第1章: 概要

### 買収の背景と戦略的意図

Broadcom Inc.は2022年5月26日、VMware Inc.を約610億ドルで買収する計画を発表した。Broadcomの戦略は、半導体事業に加えてインフラソフトウェア事業を拡大し、安定的な収益基盤を構築することにあった。同社は2018年にCA Technologiesを189億ドル、2019年にSymantecのエンタープライズセキュリティ部門を107億ドルで買収しており、VMware買収はこの戦略の集大成と位置づけられた。

最終的な買収金額は690億ドル（1株当たり142.50ドルの現金または0.2520 Broadcom株式）となり、2023年11月22日に完了した。

### 規制承認プロセス

買収は17ヶ月にわたる規制審査を経て完了した。

| 規制当局 | 国/地域 | 決定日 | 結果 |
|---------|---------|--------|------|
| FTC | 米国 | 2023年中盤 | Second Request後、承認（条件なし） |
| EU委員会 | EU | 2023年7月12日 | 条件付き承認（FC HBA相互運用性確保） |
| CMA | 英国 | 2023年8月21日 | 承認（条件なし） |
| SAMR | 中国 | 2023年11月21日 | 条件付き承認 |
| JFTC | 日本 | 2023年11月以前 | 承認（条件なし） |
| その他 | 豪/伯/加/以/南ア/台湾 | 2023年8月以前 | 承認 |

EU委員会が課した条件は、BroadcomのFC HBA（ファイバーチャネルホストバスアダプタ）とVMwareサーバー仮想化ソフトウェア間の相互運用性を確保するもので、MarvellおよびFC HBA市場への潜在的参入者に技術アクセスを提供することが義務付けられた。

---

## 第2章: 時系列

### 2022年: 買収発表と規制審査開始

| 日付 | イベント | 詳細 |
|------|---------|------|
| 5月26日 | **VMware買収発表** | Broadcomが約610億ドルでVMwareを買収する計画を発表。現金とBroadcom株式の組み合わせ |
| 6月10日 | HSR法通知提出 | Hart-Scott-Rodino法に基づく通知・報告書を米FTCに提出 |
| 7月11日 | FTC Second Request | FTCが追加情報要求を発行。詳細な反トラスト審査の開始 |
| 11月4日 | VMware株主承認 | VMware株主総会で99.61%の賛成により買収案を承認（3億5,260万株賛成） |
| 12月12日 | EU深掘り調査開始 | 欧州委員会がPhase 2（4ヶ月の詳細調査）を正式決定 |

### 2023年: 規制承認と買収完了

| 日付 | イベント | 詳細 |
|------|---------|------|
| 2月 | EU調査停止 | Broadcomが「欠落情報」を提供できず、EU調査期間が一時停止 |
| 3月22〜29日 | 英CMA Phase 2開始 | サーバー価格上昇の懸念を理由に詳細調査を予告 |
| 7月12日 | **EU条件付き承認** | FC HBA相互運用性確保を条件に承認 |
| 7月19日 | 英CMA仮承認 | Phase 2調査後、競争上の懸念なしと判定 |
| 8月21日 | **英CMA最終承認** | 条件なし承認。豪/伯/加/以/南ア/台湾も承認完了 |
| 10月19日 | 中国遅延報道 | Biden政権の半導体輸出規制への報復措置の可能性が浮上 |
| 11月21日 | **中国SAMR承認** | 制限的条件付きで承認。全規制当局からの承認完了 |
| 11月22日 | **買収完了** | 最終価格690億ドルでクロージング |
| 11月〜12月 | 組織再編開始 | CEO Raghu Raghuram離任、レイオフ開始（2,800名以上） |
| 12月12日 | Aria SaaS販売終了 | vRealize Operations/Automation/Network InsightのSaaS版がEnd of Availability |
| 12月13日 | **永続ライセンス販売終了** | サブスクリプションモデルへの全面移行を発表 |

### 2024年: ライセンス変更・製品再編・訴訟の年

| 日付 | イベント | 詳細 |
|------|---------|------|
| 1月 | パートナープログラム廃止 | VMwareの長年のパートナープログラムを廃止し新構造を発表 |
| 2月2日 | レガシーパートナー契約終了通知 | 全既存パートナーに契約終了を通知 |
| 2月12日 | **無料ESXi提供終了** | vSphere Hypervisor 7.x/8.xの無料版がEnd of General Availability |
| 2月26日 | KKR EUC部門買収完了 | KKRが40億ドルでVMware EUC部門を買収 |
| 3月 | Carbon Black統合発表 | Carbon BlackとSymantecを統合し「Enterprise Security Group」を新設 |
| 4月10日 | **72コア最小ライセンス** | 最小ライセンスコア数を16→72コアに引き上げ |
| 4月25日 | Omnissa正式発表 | 旧EUC部門が「Omnissa」として新ブランドを公式発表 |
| 4月30日 | VMC on AWS再販終了 | AWSがVMware Cloud on AWSの再販を終了 |
| 6月24日 | Tanzu移行完了 | 全オンプレミスTanzu製品がBroadcomサポートポータルに移行 |
| 7月 | **日本: NTTコム値上げ** | NTTコミュニケーションズがライセンス費用1.5〜10倍引き上げ発表 |
| 8月 | **168製品→4バンドル統合** | VCF/VVF/VVS/VVEPの4つに集約 |
| 8月26日 | **日本: VAO契約締結** | 日立・富士通・NECとVMware Authorized Outsourcer契約 |
| 8月29日 | AT&T訴訟提起 | AT&Tが1,050%値上げを主張しBroadcomを提訴 |
| 9月25日 | **日本: JFTC立入検査** | 公正取引委員会がVMware/Broadcomの東京オフィスに立入検査 |
| 10月2日 | vSphere 7.0サポート延長終了 | 6ヶ月延長後のEnd of General Support |
| 12月6日 | Aria SaaS完全終了 | SaaSサービスの提供を完全に停止 |

### 2025年: VCSP再編・訴訟拡大・日本市場の動き

| 日付 | イベント | 詳細 |
|------|---------|------|
| 2月〜4月 | 無料ESXi復活 | ESXi 8.0 Update 3eで無料版復活（非本番環境のみ、サポートなし、vCenter接続不可） |
| 3月 | **日本: NTTデータ代替サービス** | KVM仮想化基盤管理サービス「Prossione Virtualization」発表 |
| 3月3日 | Tanzuダウンロード制限 | エンタイトルユーザーのみBroadcomサポートポータルでアクセス可能に |
| 3月27日 | **日本: さくらESXi終了** | さくらインターネットがESXi提供終了を発表 |
| 4月 | UHC訴訟提起 | UnitedHealthcareがCA Technologies関連でBroadcomを提訴 |
| 4月10日 | **APJ vSphere Standard停止** | APJ地域でvSphere Standard提供停止、72コア最小購入義務 |
| 6月1日 | パートナー3段階再編 | Pinnacle/Premier/Selectの3段階に再編 |
| 6月27日 | **オランダ裁判所命令** | Rijkswaterstaatに2年間サポート提供を命令（年180万ユーロ、違反時日次最大2,500万ユーロ罰金） |
| 7月15日 | VCSP変更通知 | 11月に招待制への移行を通知 |
| 7月24日 | **CISPE EU提訴** | EU一般裁判所に合併承認無効化の訴訟提起 |
| 8月 | Amazon EVS開始 | Amazon Elastic VMware Serviceの提供開始 |
| 9月 | VCF 9.0発表 | VMware Explore 2025でVMware Cloud Foundation 9.0を発表 |
| 9月3日 | **Tesco訴訟提起** | 1億ポンド以上の損害賠償を請求（40,000サーバーワークロードに影響） |
| 10月2日 | **vSphere 7.x EOS** | vSphere 7.x / vSAN 7.x 一般サポート終了 |
| 10月15日 | ハイパースケーラー期限 | 全ハイパースケーラーのライセンス内包販売終了期限 |
| 10月29日 | **日本: NECパートナーシップ** | NEC戦略的パートナーシップ強化発表 |
| 10月31日 | ホワイトレーベル終了 | 非招待VCSPの新規取引停止 |
| 11月1日 | **FY26開始** | 新VCSP招待制プログラム発効、BYOLモデル発効 |
| 11月3日 | Fidelity訴訟提起 | 5,000万顧客・17.5兆ドル資産への影響を警告 |
| 12月13日 | AT&T和解成立 | 和解金額非開示 |

### 2026年（〜3月現在）: 規制本格化

| 日付 | イベント | 詳細 |
|------|---------|------|
| 1月 | Fidelity和解 | Broadcomがソフトウェアアクセス継続に同意（金額非開示） |
| 1月 | VCSP契約終了通知 | 非招待パートナーへの一方的終了通知 |
| 2月6日 | EU本格調査報道 | Bloomberg「EU本格スクルティニー開始」 |
| 3月19日 | **CISPE正式訴訟** | EU競争法違反の正式訴訟提起 |
| 3月31日 | VCSP全取引終了期限 | 非招待VCSPの全取引が終了 |

---

## 第3章: vSphere製品サポートライフサイクル

VMware製品のサポートライフサイクルは、Broadcom買収後も基本的にBroadcomの製品ライフサイクルポリシーに従う。ただし、買収に伴い一部製品でサポート期間の短縮や変更が発生している。

### サポート期限一覧

| 製品 | GA日 | 一般サポート終了 | 技術ガイダンス終了 | 備考 |
|------|------|-----------------|-------------------|------|
| vSphere/ESXi 6.5 | 2016年11月 | 2022年10月15日 | 2023年11月15日 | サポート終了済 |
| vSphere/ESXi 6.7 | 2018年4月 | 2022年10月15日 | 2023年11月15日 | サポート終了済 |
| vSphere/ESXi 7.0 | 2020年3月 | **2025年10月2日** | 2027年10月2日 | 当初2025年4月→6ヶ月延長 |
| vSphere/ESXi 8.0 | 2022年10月 | 2027年10月11日 | 2029年10月11日 | 現行最新版 |
| vSAN 7.x | - | **2025年10月2日** | 2027年10月2日 | vSphere 7と同時終了 |
| vSAN 8.x | - | 2027年10月11日 | 2029年10月11日 | - |
| NSX-V | - | 2022年1月16日 | 2023年1月16日 | 後継: NSX-T→NSX |
| vRealize/Aria SaaS | - | 2024年12月6日 | - | SaaS版は完全終了 |

### 重要な注意点

- **vSphere 7.x**: 2025年10月2日の一般サポート終了後は、セキュリティパッチ・バグ修正が提供されない。技術ガイダンス（2027年10月まで）はナレッジベースのみ
- **vSphere 8.x**: 2029年10月まで技術ガイダンスが継続。ただしBroadcomの方針変更リスクあり
- **永続ライセンス保有者**: サポート契約を更新しないと、パッチ・アップデートへのアクセスが失われる。更新遅延には20%のペナルティが課される
- **無料ESXi**: 2024年2月に廃止後、2025年4月に非本番環境限定で復活。ただしサポートなし、vCenter接続不可

---

## 第4章: ハイパースケーラーへの影響

Broadcomは買収後、主要クラウドプロバイダー（ハイパースケーラー）に対してもライセンスモデルの変更を要求。従来のライセンス内包型から、顧客がBroadcomから直接ライセンスを購入するBYOL（Bring Your Own License）モデルへの移行を強制した。

### クラウドプロバイダー別影響

#### AWS（Amazon Web Services）

| 項目 | 詳細 |
|------|------|
| サービス名 | VMware Cloud on AWS |
| 主な変更 | AWSによるVMware Cloud on AWSの再販を終了 |
| 終了日 | 2024年4月30日（再販終了） |
| 代替サービス | Amazon Elastic VMware Service（EVS）（2025年8月提供開始） |
| BYOL必須化 | 2025年11月1日 |
| 影響 | 既存顧客は直接Broadcomとライセンス契約が必要。EVSはEC2ベアメタル上でvSphere/vSANを実行 |

#### Microsoft Azure

| 項目 | 詳細 |
|------|------|
| サービス名 | Azure VMware Solution（AVS） |
| 主な変更 | VCFライセンス内包販売終了 |
| 期限 | 2025年10月15日 |
| 値上げ幅 | 8〜15倍の値上げ報告 |
| 影響 | 顧客はBroadcomから直接VCFライセンスを調達し、Azureインフラ費用と別途支払い |

#### Google Cloud Platform（GCP）

| 項目 | 詳細 |
|------|------|
| サービス名 | Google Cloud VMware Engine（GCVE） |
| 主な変更 | BYOLモデルを最初に提供（2024年）、ライセンス内包販売終了 |
| 期限 | 2025年10月15日 |
| 影響 | GCPが最も早くBYOLに対応。顧客は移行計画を立てやすい |

#### Oracle Cloud Infrastructure（OCI）

| 項目 | 詳細 |
|------|------|
| サービス名 | Oracle Cloud VMware Solution（OCVS） |
| 主な変更 | BYOL移行 |
| 期限 | 2026年5月21日（他社より猶予あり） |
| 影響 | 最も遅い期限だが、移行は必須 |

### ハイパースケーラーへの影響まとめ

- **コスト増**: 顧客はクラウドインフラ費用に加え、Broadcomへのライセンス費用が別途発生
- **管理複雑化**: 2つのベンダー（クラウド + Broadcom）との契約管理が必要
- **代替検討**: AWS EVS、Azure Stack HCI、Google Distributed Cloudなど、VMware非依存の選択肢への移行を検討する企業が増加
- **VCSPへの波及**: ハイパースケーラーですらBYOL化されたことで、小規模CSPの交渉力はさらに低下

---

## 第5章: ライセンス体系変更の詳細

### 永続ライセンスからサブスクリプションへの移行

Broadcomは2023年12月13日、VMware製品の永続（パーペチュアル）ライセンス販売を終了し、サブスクリプションモデルへの全面移行を発表した。

| 項目 | 買収前（VMware時代） | 買収後（Broadcom時代） |
|------|---------------------|----------------------|
| ライセンス形態 | 永続ライセンス + 年間サポート契約 | サブスクリプション（1年/3年/5年） |
| 課金単位 | CPU（ソケット）単位 | **コア単位** |
| 最小購入単位 | 1 CPU（16コア相当） | **72コア**（APJ地域は2025年4月以降） |
| 製品構成 | 168製品・バンドル・エディション | **4バンドル** |
| 無料版 | vSphere Hypervisor（ESXi無料版）あり | 廃止（2025年4月に非本番用で限定復活） |
| 更新遅延ペナルティ | なし | **20%** |

### 4つのバンドル構成

| バンドル | 主な構成要素 | 対象 |
|---------|------------|------|
| VMware Cloud Foundation (VCF) | vSphere + vSAN + NSX + Aria Suite + Tanzu | 大規模エンタープライズ |
| VMware vSphere Foundation (VVF) | vSphere Enterprise Plus + Aria Suite + Tanzu（一部） | 中〜大規模 |
| VMware vSphere Standard (VVS) | vSphere Standard | 中規模 |
| VMware vSphere Essential Plus (VVEP) | vSphere Essentials Plus Kit | 小規模（最大96コア） |

### 価格変更の影響

| ケース | 値上げ幅 | 出典 |
|--------|---------|------|
| 平均的な顧客 | 2〜4倍 | 各種レポート |
| AT&T | **1,050%**（10.5倍） | AT&T訴訟資料 |
| 一般的なエンタープライズ | 3〜12倍 | Gartner推計 |
| Azure VMware Solution | 8〜15倍 | The Register報道 |
| CISPE報告 | **最大10倍** | CISPE訴訟資料 |
| 日本・NTTコミュニケーションズ | 1.5〜10倍 | 日本メディア報道 |

### 主な問題点

1. **強制バンドリング**: 顧客が必要としない機能も含むバンドルの購入が必須
2. **コア単位課金**: CPUソケット単位からコア単位への変更により、多コアCPUを使用する顧客ほど影響大
3. **72コア最小購入**: 小規模環境でも72コア分のライセンスが必要
4. **永続ライセンスの無効化**: 既存の永続ライセンス保有者も、サポート更新時に事実上サブスクリプションへの移行を強制
5. **更新遅延ペナルティ**: サポート契約の更新が遅れると20%のペナルティが課される

### EUC部門の分離（Omnissa）

| 項目 | 詳細 |
|------|------|
| 売却先 | KKR（プライベートエクイティ） |
| 買収額 | 40億ドル |
| 完了日 | 2024年2月26日（米国・アイルランド）、2024年7月1日（全世界） |
| 新社名 | Omnissa |
| 対象製品 | VMware Horizon、Workspace ONE |
| 規模 | ARR 15億ドル、顧客26,000社、従業員4,000名以上 |
| 市場 | デジタルワークスペース市場（260億ドル） |

### Carbon BlackとSymantecの統合

| 項目 | 詳細 |
|------|------|
| 発表 | 2024年3月 |
| 新組織 | Enterprise Security Group |
| 統合内容 | Carbon Black EDR + Symantec脅威防止・DLP・ネットワークセキュリティ |
| 当初計画 | Carbon Black売却を計画（約10億ドル）→買い手不足で頓挫 |

---

## 第6章: 日本市場への影響

### 概況

VMwareは日本の仮想化市場で約80%のシェアを持ち、金融、製造、公共など基幹システムの仮想化基盤として広く浸透している。Broadcomによる買収後のライセンス変更は、日本市場に特に大きな影響を与えた。

### 公正取引委員会（JFTC）の立入検査

| 項目 | 詳細 |
|------|------|
| 実施日 | 2024年9月25日 |
| 対象 | VMware（Broadcom子会社）東京オフィス |
| 容疑 | 独占禁止法違反の疑い（抱き合わせ販売、優越的地位の濫用） |
| 背景 | 製品バンドリングの強制、不要な製品を含むパッケージ購入の義務付け |
| 状況 | 2026年3月現在、調査継続中 |

### 主要SIer・ベンダーの対応

| 企業 | 影響・対応 | 時期 |
|------|-----------|------|
| **富士通** | HCI（PRIMEFLEX for VMware vSAN等）の保守対応が困難に。VAO契約締結で部分解決 | 2024年8月 |
| **NEC** | 戦略的パートナーシップ強化を発表。VCFベースのソリューション提供継続 | 2025年10月 |
| **日立** | VAO（VMware Authorized Outsourcer）契約を締結 | 2024年8月 |
| **NTTデータ** | KVM仮想化基盤管理サービス「Prossione Virtualization」を開発・発表 | 2025年3月 |
| **NTTコミュニケーションズ** | ライセンス費用1.5〜10倍の引き上げを発表 | 2024年7月 |
| **IIJ** | VMwareライセンスの大幅値上げにより、最大30億円の業績影響を想定 | 2024年 |
| **さくらインターネット** | ESXiベースのサービス提供終了を発表 | 2025年3月27日 |

### 日本市場固有の課題

1. **デジタル主権**: 基幹システムの仮想化基盤が米国企業1社に依存するリスクが顕在化
2. **SIerビジネスモデルへの影響**: VMware製品の再販・構築・運用を収益源とするSIerのビジネスモデルが根本的に変化
3. **公共セクター**: 自治体・政府機関のVMware依存度が高く、代替検討に時間がかかる
4. **言語・技術サポート**: Broadcom移管後の日本語サポートの質低下への懸念
5. **VAO契約の限界**: VAO契約では、パートナーがBroadcomに代わってサポートを提供するが、深い技術支援にはBroadcomのエスカレーションが必要

### APJ地域特有の制限

2025年4月10日より、APJ（アジア太平洋・日本）地域では以下の制限が適用：
- vSphere Standardの提供停止
- 72コア最小購入義務の厳格化
- VCFまたはVVFへのアップセル圧力の増大

---

## 第7章: 顧客訴訟・規制動向

Broadcomによるライセンス変更は、世界各地で訴訟・規制対応を引き起こしている。

### 主要訴訟一覧

#### AT&T対Broadcom/VMware

| 項目 | 詳細 |
|------|------|
| 提訴日 | 2024年8月29日 |
| 和解日 | 2024年11〜12月 |
| 主張 | VMwareライセンスの**1,050%値上げ**。75,000仮想マシン・約8,600サーバーのサポート喪失の脅威 |
| 和解条件 | 非開示 |
| 意義 | 最初の大規模訴訟として注目を集め、他社の訴訟を誘発 |

#### Tesco対Broadcom/VMware/Computacenter

| 項目 | 詳細 |
|------|------|
| 提訴日 | 2025年9月3日 |
| 請求額 | **最低1億ポンド（約1.34億ドル）以上**（利息含む） |
| 状況 | 2026年3月現在、継続中 |
| 主張 | 2021年購入の永続ライセンスの権利侵害、40,000サーバーワークロードへの影響、英国・アイルランドの食糧供給への影響可能性 |

#### Fidelity対Broadcom/VMware

| 項目 | 詳細 |
|------|------|
| 提訴日 | 2025年11月3日 |
| 和解日 | 2026年1月 |
| 主張 | 2005年以来のVMware使用、高額バンドル製品の強制、既存契約更新権の拒否。**5,000万顧客・17.5兆ドル資産管理への影響**を警告 |
| 和解条件 | ソフトウェアアクセス継続に同意（金額非開示） |

#### UnitedHealthcare対Broadcom

| 項目 | 詳細 |
|------|------|
| 提訴日 | 2025年4月（ミネソタ州連邦地裁） |
| 状況 | 継続中 |
| 主張 | CA Technologies（2018年Broadcom買収）メインフレームソフトウェアの数百万ドル追加請求の強要、契約上の価格保護権の無視。VMwareライセンスでも同様の値上げ |

#### Siemens対VMware/Broadcom

| 項目 | 詳細 |
|------|------|
| 裁判所 | デラウェア地方裁判所 |
| 状況 | VMware側がSiemensを提訴（ライセンス権なしの製品使用を主張）。Siemens側は異議 |

### 規制・司法動向

#### CISPE（欧州クラウドインフラストラクチャサービスプロバイダー）のEU訴訟

| 項目 | 詳細 |
|------|------|
| 提訴日 | 2025年7月24日（EU一般裁判所） |
| 追加提訴 | 2026年3月19日（EU競争法違反の正式訴訟） |
| 主張 | Broadcom CEOがEBITDAを35-45億ドル→85億ドルへ60-80%増加を公言。価格引き上げと強制バンドリング以外では不可能。EU委員会は適切な条件を課さず承認 |
| 背景 | 買収前のVMware VCSP 4,000+パートナー → 2026年現在: 米国19、英国9に激減 |

#### オランダRijkswaterstaat判決

| 項目 | 詳細 |
|------|------|
| 判決日 | 2025年6月27日（ハーグ地区裁判所） |
| 判決 | Broadcomに**2年間のメンテナンスサポート提供を命令** |
| サポート料金 | 年間180万ユーロ |
| 違反ペナルティ | 非遵守時の日次罰金最大**2,500万ユーロ** |
| 意義 | 顧客側に有利な初の司法判断。他国の訴訟に先例を提供 |

#### EU委員会の動向

| 時期 | 動き |
|------|------|
| 2023年7月 | 合併を条件付き承認 |
| 2025年7月 | CISPE提訴（承認無効化） |
| 2026年2月 | Bloomberg「EU本格スクルティニー開始」報道 |
| 2026年3月 | CISPE正式訴訟。EU委員会は評価中 |

#### 日本JFTC調査

| 時期 | 動き |
|------|------|
| 2024年9月25日 | 立入検査実施 |
| 2024年10月〜 | 調査継続中 |
| 容疑 | 抱き合わせ販売、優越的地位の濫用 |

---

## 第8章: 代替プラットフォームへの移行動向

### 主な代替候補

| プラットフォーム | 種類 | 特徴 | 適用場面 |
|----------------|------|------|---------|
| **Nutanix AHV** | 商用HCI | VMwareからの移行ツール提供、エンタープライズサポート | 大〜中規模企業 |
| **Proxmox VE** | OSS | KVMベース、無料、コミュニティ活発 | 中小規模・検証環境 |
| **OpenStack** | OSS | 大規模クラウド向け、高い柔軟性 | 通信事業者・大規模DC |
| **KVM/libvirt** | OSS | Linuxカーネル内蔵、軽量 | 技術力のある組織 |
| **Microsoft Hyper-V** | 商用 | Windows統合、Azure連携 | Microsoft環境 |
| **Oracle Linux KVM** | 商用 | Oracle DB最適化 | Oracle環境 |

### 市場調査データ

| 調査機関 | 調査結果 |
|---------|---------|
| **Gartner** | 2028年までにVMware顧客の**35%**が代替プラットフォームに移行と予測 |
| **Rimini Street** | VMware顧客の**98%**が代替を検討、**36%**が切替完了/進行中 |
| **Forrester** | エンタープライズの60%以上がマルチハイパーバイザー戦略を検討 |

### 日本における代替動向

| 企業・動向 | 詳細 |
|-----------|------|
| **NTTデータ「Prossione Virtualization」** | KVM仮想化基盤管理サービス。VMwareからの移行支援を含む（2025年3月発表） |
| **さくらインターネット** | ESXi提供終了、独自基盤への移行（2025年3月） |
| **国内SIer** | Nutanix AHVの提案・導入案件が急増。Proxmox VEの検証も進む |
| **公共セクター** | 長期的なOSS仮想化基盤への移行を検討。ただし移行期間は3〜5年を想定 |

### 移行の課題

1. **技術的複雑性**: VMware固有の機能（vMotion、DRS、HA等）の代替が困難
2. **移行コスト**: 既存環境からの移行には、テスト・検証を含め相当なコストが発生
3. **人材不足**: VMware以外の仮想化技術に精通したエンジニアの不足
4. **アプリケーション互換性**: VMware Tools依存のアプリケーションの改修が必要な場合がある
5. **サポート体制**: OSSベースの場合、エンタープライズレベルのサポート確保が課題

---

## 第9章: 情報ソース一覧

### 公式発表・プレスリリース

1. [Broadcom - VMware買収発表](https://www.broadcom.com/company/news/financial-releases/60271)
2. [Broadcom - 買収完了プレスリリース](https://investors.broadcom.com/news-releases/news-release-details/broadcom-completes-acquisition-vmware)
3. [Broadcom - 規制アップデート](https://investors.broadcom.com/news-releases/news-release-details/broadcom-inc-provides-regulatory-update-vmware-transaction)
4. [欧州委員会 - 合併承認](https://ec.europa.eu/commission/presscorner/detail/da/ip_23_3777)
5. [EC Competition Case M.10806](https://competition-cases.ec.europa.eu/cases/M.10806)
6. [Omnissa公式ブログ](https://www.omnissa.com/insights/blog/introducing-omnissa-the-former-vmware-end-user-computing-business/)
7. [VMware Tanzu Blog](https://blogs.vmware.com/tanzu/tanzu-whats-new-march-7-2025/)
8. [Broadcom TechDocs - vSphere Lifecycle](https://techdocs.broadcom.com/us/en/vmware-cis/vsphere/vsphere/8-0/vmware-vsphere-product-lifecycle-matrix.html)
9. [Broadcom Knowledge - Aria EOL](https://knowledge.broadcom.com/external/article/422643/end-of-general-support-for-vmware-aria-o.html)
10. [NEC - VMwareパートナーシップ発表](https://jpn.nec.com/press/202510/20251029_01.html)

### メディア報道（英語）

11. [Channel Futures - Complete Timeline](https://www.channelfutures.com/channel-business/the-broadcom-vmware-acquisition-a-complete-timeline)
12. [Channel Futures - Omnissa](https://www.channelfutures.com/mergers-acquisitions/vmware-euc-which-broadcom-shunned-becomes-omnissa)
13. [Channel Futures - VMware Explore 2025](https://www.channelfutures.com/cloud/vmware-explore-2025-broadcom-expands-vcf-tanzu-more/)
14. [The Register - Free ESXi Ended](https://www.theregister.com/2024/02/13/broadcom_ends_free_esxi_vsphere/)
15. [The Register - China Approval](https://www.theregister.com/2023/11/21/china_relents_broadcomvmware_merger_cleared/)
16. [The Register - CMA Investigation](https://www.theregister.com/2023/03/29/uk_watchdog_to_give_broadcomvmware/)
17. [The Register - Azure Price Hike](https://www.theregister.com/2025/03/14/azure_vmware_solution_price_hike/)
18. [CIODive - VMware Bundling](https://www.ciodive.com/news/broadcom-vmware-bundling-budget-cuts-saas-licensing/718859/)
19. [CIODive - AT&T Settlement](https://www.ciodive.com/news/broadcom-att-vmware-settlement-licensing-support-lawsuit/733763/)
20. [CIODive - vSphere Support End](https://www.ciodive.com/news/broadcom-vmware-vsphere-support-private-cloud-spinnaker/761158/)
21. [NetworkWorld - CMA Approval](https://www.networkworld.com/article/972449/uk-competition-agency-provisionally-oks-broadcoms-6b-vmware-acquisition.html)
22. [NetworkWorld - Dutch Court](https://www.networkworld.com/article/4015489/dutch-court-forces-broadcom-to-support-vmware-migration-after-85-price-hike-backlash.html)
23. [ServeTheHome - Free ESXi Era](https://www.servethehome.com/broadcom-vmware-ends-free-vmware-vsphere-hypervisor-closing-an-era/)
24. [Virtualization Review - ESXi Free Again](https://virtualizationreview.com/articles/2025/04/18/esxi-is-free-again.aspx)
25. [SDxCentral - Carbon Black](https://www.sdxcentral.com/analysis/vmware-integration-to-cost-broadcom-1b-carbon-black-goes-on-the-block/)
26. [ThreatDown - Carbon Black Symantec](https://www.threatdown.com/blog/carbon-black-and-broadcom-acquisition-symantec-and-whats-next/)
27. [GovConWire - Shareholder Vote](https://www.govconwire.com/2022/11/broadcoms-61b-acquisition-proposal-gets-ok-from-vmware-stockholders/)
28. [TechTarget - Omnissa](https://www.techtarget.com/searchvirtualdesktop/opinion/VMware-EUC-is-now-Omnissa-What-we-know-so-far)

### 訴訟・規制関連

29. [CISPE - EU Court Filing](https://www.cispe.cloud/cispe-takes-european-commission-to-court-to-annul-approval-of-broadcoms-acquisition-of-vmware/)
30. [CISPE - Challenges EU Commission](https://www.cispe.cloud/cispe-challenges-eu-commissions-defence-of-broadcom-vmware-merger/)
31. [Addleshaw Goddard - Tesco Claim](https://www.addleshawgoddard.com/en/insights/insights-briefings/2025/dispute-resolution/tescos-100m-claim-against-broadcom-vmware-computacenter/)
32. [AllAboutLawyer - Fidelity Lawsuit](https://allaboutlawyer.com/broadcom-lawsuit-2025-fidelity-warns-of-massive-outages-as-vmware-price-war-explodes-into-legal-case/)
33. [Loeb - UHC Lawsuit](https://www.loeb.com/en/insights/publications/2025/04/broadcom-sued-by-united-healthcare-over-price-increases-for-ca-mainframe-software)
34. [Cleary Antitrust Watch - EU Conditions](https://www.clearyantitrustwatch.com/2023/07/the-commission-approves-broadcoms-acquisition-of-vmware-subject-to-remedies/)
35. [Licenseware - EU Scrutiny](https://licenseware.io/broadcom-faces-eu-scrutiny-over-controversial-vmware-licensing-practices/)
36. [TechZine - Japan JFTC Investigation](https://www.techzine.eu/news/privacy-compliance/124738/vmware-bundling-puts-broadcom-japans-crosshairs/)

### パートナー・ライセンス情報

37. [Graphon - Partner Agreements Cancelled](https://www.graphon.com/blog/broadcom-cancels-vmware-partner-agreements)
38. [Intelisys - Licensing Changes](https://intelisys.com/broadcom-vmware-licensing-changes/)
39. [Redress Compliance - Simplified Portfolio](https://redresscompliance.com/broadcom-simplified-vmware-product-portfolio-whats-included-and-whats-missing/)
40. [Channel Futures - China Delay](https://www.channelfutures.com/regulation-compliance/reports-china-retaliating-for-biden-move-could-delay-broadcom-vmware)

### 日本語ソース

41. [日経クロステック - 公正取引委員会立入検査](https://xtech.nikkei.com/atcl/nxt/news/24/01879/)
42. [日経クロステック - VMwareライセンス値上げ](https://xtech.nikkei.com/atcl/nxt/column/18/00001/09411/)
43. [ITmedia - VMware買収後の影響](https://www.itmedia.co.jp/enterprise/articles/2410/01/news061.html)
44. [ZDNet Japan - Broadcom VMware日本市場](https://japan.zdnet.com/article/35223893/)
45. [NTTデータ - Prossione発表](https://www.nttdata.com/global/ja/news/release/2025/032600/)
46. [IIJ - 業績影響](https://www.iij.ad.jp/ir/)

### 市場調査

47. [Gartner - VMware Alternatives](https://www.gartner.com/en/documents/5234963)
48. [Rimini Street - VMware Survey](https://www.riministreet.com/resources/research-report/vmware-licensing-survey/)
49. [AWS - Amazon EVS](https://aws.amazon.com/blogs/aws/amazon-elastic-vmware-service-evs/)
50. [VMware Lifecycle Matrix](https://lifecycle.vmware.com/)

---

*本レポートは2026年3月23日時点の情報に基づいています。Broadcom/VMwareの状況は急速に変化しており、最新情報は各ソースを直接確認してください。*
