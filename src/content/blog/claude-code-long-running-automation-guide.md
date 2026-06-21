---
title: "Claude Code を長期間動かし続けて定期実行する — Agent View ピン留め＋Auto Mode＋/loop と Routines の使い分け"
date: 2026-06-21
category: "Claude技術解説"
tags: ["Claude Code", "Agent View", "loop", "Routines", "Auto Mode", "バックグラウンドセッション", "定期実行", "自動化"]
excerpt: "Claude Code を1週間のように長期間起動し続け、/loop で定期的にタスクを実行したい——この運用を実現する3つの方法（ローカルの /loop、Agent View のバックグラウンドセッション＋Ctrl+Tピン留め、クラウドの Routines）を、PC の電源・再起動への依存性で比較する。とくに『端末は常時起動、再起動時は手動復帰』を許容できる場合の Agent View ピン留め＋Auto Mode＋/loop の動きを、自動停止の回避・スリープ/再起動の挙動・課金の線引きまで含めて解説する。"
draft: false
---

## はじめに — 「ずっと起動して定期実行したい」を実現する

Claude Code を使っていると、「**端末を開いたまま長期間動かし続け、定期的にタスクを実行させたい**」というニーズが出てきます。たとえば、ある状態を1時間ごとにチェックする、夜間に段階的な作業を進める、1週間にわたって監視を続ける——といったケースです。

これを実現する方法は1つではなく、**PC の電源・再起動への依存性**と**継続できる期間**で選び分けるのが正解です。本記事では3つの方法を比較し、とくに「**端末は常時起動できる／PC 再起動時は手動で立ち上げ直してよい**」という前提で実用的な **Agent View のバックグラウンドセッション＋`Ctrl+T` ピン留め＋Auto Mode＋`/loop`** の動きを詳しく解説します。

> 本記事は2026年6月時点の Claude Code 公式ドキュメント・CHANGELOG に基づきます。自動停止の正確な秒数やスクリーンロック中の挙動など、公式に明記が薄い点は「推測」と明記します。

---

## 1. 3つの方法 — 「PC 依存性」で選ぶ

長期・定期実行の手段は大きく3つです。**最大の判断軸は「ローカル PC の電源・再起動に縛られるか」**です。

| 方法 | PC 電源/再起動への依存 | 継続できる期間 | 実用性 |
|:---|:---|:---|:---:|
| **(a) ローカルで /loop だけ** | 依存（端末セッション存続が必須・再起動で停止） | /loop は **7日で自動失効** | 低 |
| **(b) Agent View バックグラウンド＋`Ctrl+T` ピン留め** | 依存（**スリープは耐える**が再起動で停止） | ピン留め中は常駐（/loop は7日失効） | **中〜高** |
| **(c) Routines（クラウド cron）** | **非依存**（Anthropic クラウドで実行） | **無期限**（無効化するまで） | 高 |

- **PC を切っても回したい** → (c) Routines 一択
- **端末は常時起動でき、再起動時は手動復帰でよい** → (b) が現実的（本記事のメイン）
- (a) 単体は、端末を開きっぱなしにする必要があり再起動にも弱いため、長期には不向き

---

## 2. Agent View バックグラウンド＋ピン留めの仕組み

### 全体像

```
[端末] ──起動──▶ per-user supervisor プロセス（端末から独立して常駐）
                      └─ バックグラウンドセッション（あなたのタスク）
                            ├─ Ctrl+T でピン留め → 自動停止しない
                            ├─ /loop で定期実行（例：1時間ごと）
                            └─ Auto Mode で権限を自動処理（止まらない）
```

### 構成要素の役割

| 要素 | 役割 |
|:---|:---|
| **バックグラウンドセッション** | 端末から独立して動くセッション。`claude --bg "<タスク>"`／対話中に `/bg`／Agent View 入力欄から起動 |
| **per-user supervisor プロセス** | 1ユーザーに1つ。背景セッションをホストし、**端末ウィンドウを閉じても抱え続ける**（PC 起動は必要） |
| **Agent View（`claude agents`）** | 全背景セッションを1画面で俯瞰する管理 UI。状態（Working/Needs input/Idle/Completed/Failed/Stopped）を表示 |
| **`Ctrl+T` ピン留め** | 後述の自動停止から除外し、プロセスを常駐させる |
| **`/loop`** | セッション内で定期実行をスケジュール |
| **Auto Mode** | 権限プロンプトを自動判定し、無人でも止まらないようにする |

### ③ 既定では「約1時間で自動停止」する

ここが要点です。バックグラウンドセッションは、**未 attach のまま約1時間アイドルすると supervisor がプロセスを停止**します（記録＝transcript はディスクに残る）。放置すると1週間もたないのはこのためです（※「約1時間」の正確な仕様は公式に明記が薄く、推測を含みます）。

### ④ `Ctrl+T` ピン留めで自動停止を回避

Agent View で対象セッションを `↑`/`↓` で選び **`Ctrl+T`** を押すと**ピン留め（pinned）**されます。ピン留めされたセッションは**自動停止の対象外**となり、**プロセスが動き続けます**（リソースが枯渇したときだけ最後に停止）。これで「約1時間で止まる」を無効化でき、**長期常駐が成立**します。

---

## 3. Auto Mode で「止まらない」ようにする

無人で長期運用する場合、**権限確認のプロンプトで止まってしまうと運用が破綻**します。そこで併用するのが **Auto Mode（権限の auto モード）** です。

- Auto Mode は各アクションを**モデルベースの分類器が起動前に判定**し、安全なものは自動で通し、危ういものだけエスカレーションします。
- 暴走の歯止めとして**連続3拒否／累計20拒否で自動停止**するため、「全許可（`--dangerously-skip-permissions`）」より安全に無人運用できます。

つまり、当初イメージしがちな「**Auto Mode でずっと起動**」の正体は、厳密には次の組み合わせです。

> **Auto Mode（権限自律）＋ バックグラウンドセッション（常駐）＋ `Ctrl+T`（自動停止回避）＋ `/loop`（定期実行）**

Auto Mode は「権限判断の自律化」であって「常駐・定期実行」そのものではなく、両者は**直交する別軸**です。Auto Mode の詳細は [Claude Code Auto Mode 完全ガイド](/mdTechKnowledge/blog/claude-code-auto-mode-guide/) を参照してください。

---

## 4. スリープ・再起動の挙動

| 事象 | どうなるか |
|:---|:---|
| **PC スリープ** | セッションは**保持**。wake で supervisor が再接続して継続 |
| **スクリーンロック** | 維持される見込み（※公式に明記が薄く、リソース状況次第。推測） |
| **PC 再起動・シャットダウン** | supervisor とセッションは**停止**。再起動後に `claude agents` から **resume で復帰**（記録から再開）、または `/loop` を再設定 |

→ **「端末は常時起動・再起動時は手動復帰」**という前提なら、**スリープは自動で耐え、再起動だけ手動で立ち上げ直す**運用で長期継続できます。

---

## 5. 操作手順

1. `claude --bg "<長期間まわしたいタスク>"` で背景起動（対話中なら `/bg` で背景化）
2. `claude agents` で Agent View を開く
3. 対象セッションを選び **`Ctrl+T`** でピン留め
4. attach（`Enter`/`→`）して **Auto Mode に設定**＋ **`/loop 1h "<実行したい指示>"`** → `/bg`（または `←`）で背景へ戻す
5. 状態確認は `claude agents --json`（`state` が `working` 等を確認）

```bash
# 入力待ちのセッションだけ抽出する例
claude agents --json | jq '.[] | select(.status=="needs_input") | {name, cwd}'
```

6. PC を再起動したら、`claude agents` から resume するか、手順1から再設定する

---

## 6. 「7日失効」と1週間超の継続

`/loop` で設定したタスクは、**作成から7日で自動失効**します。したがって「ちょうど1週間」なら問題ありませんが、**それ以上続けたい場合は /loop を再設定**する必要があります。

無期限・完全放置で回したいなら、次章の **Routines（クラウド）**の方が適しています。

---

## 7. 課金の線引き — サブスク枠で収める

長期・定期実行で**最も注意すべきは課金経路**です。Claude Code には「サブスク枠で動く手段」と「別課金になりうる手段」があります。

| 手段 | 課金経路 |
|:---|:---|
| **対話的セッションの背景化**（`claude --bg`） | **サブスク枠** |
| **`/loop`**（対話的） | **サブスク枠** |
| **Routines**（クラウド cron） | **サブスク枠**（超過時は usage credits／日次の実行枠あり） |
| Claude Agent SDK | 別課金プール（プログラマティック利用） |
| **`claude -p`（headless・非対話）** | 別課金プール |
| Claude Code GitHub Actions | 別課金プール |

ポイントは、**`claude --bg` は「対話的セッションを背景で動かす」ものであり、headless の `claude -p` とは別物**だということです。前者はサブスク枠、後者は（プログラマティック利用として）別課金プールに分類されます。長期運用を組むときは、**`--bg` ＋ `/loop`、または Routines** を使えばサブスク枠で完結します。

> **補足（2026-06 時点の重要な前提）**: この「プログラマティック利用の別課金プール」への分離は **2026年6月15日に施行予定でしたが、施行当日に一時停止**されました（公式サポート記事の冒頭 *"For now, nothing has changed."*）。**現状はすべて従来どおりサブスク枠から消費**されています。ただし形を変えて再開する可能性はあるため、長期運用は**再開後も安全な手段（`--bg`／`/loop`／Routines）**で組んでおくのが無難です。詳細は [Claude Agent SDK / claude -p 課金分離ガイド](/mdTechKnowledge/blog/claude-agent-sdk-billing-split/) を参照してください。

---

## 8. レート制限・使用量の注意

課金経路がサブスク枠でも、**使用量（トークン）の上限は別途存在**します。

- 1週間×定期実行は**サブスクの使用枠を消費**します（レート制限は TPM/RPM で連続的に制御）。
- **Routines には日次の実行回数上限**もあります。
- 枠を使い切らないために、**実行間隔は1時間以上、1回のタスクは軽め**に設計するのが安全です。

---

## 9. PC を切っても回したいなら Routines

「PC をスリープ・シャットダウンしても回り続けてほしい」「完全に無期限で放置したい」場合は、**Routines（クラウド cron）**が最適です。

- 実行環境は **Anthropic 管理のクラウド**で、ローカル PC に依存しません。
- スケジュールは cron 式（**最小1時間間隔**）。`/schedule` コマンドや web（claude.ai/code/routines）で設定します。
- 無効化するまで**無期限**で自動実行されます。

ローカル常駐（Agent View ピン留め）とクラウド（Routines）は、**「PC を起動し続けられるか」**で選び分けてください。Routines の基礎は [Claude Code Routines ガイド](/mdTechKnowledge/blog/claude-code-routines-guide/) を参照してください。

---

## まとめ

| 観点 | ポイント |
|:---|:---|
| **選び方の軸** | PC の電源・再起動に縛られるか／継続したい期間 |
| **端末常時起動・再起動時手動でよい** | Agent View バックグラウンド＋`Ctrl+T` ピン留め＋Auto Mode＋`/loop` |
| **自動停止の回避** | `Ctrl+T` ピン留め（既定は約1時間で停止） |
| **無人で止めない** | Auto Mode（権限自律、連続3/累計20拒否で安全停止） |
| **スリープ/再起動** | スリープは耐える／再起動は手動 resume |
| **7日失効** | /loop は7日で失効、超えるなら再設定 or Routines |
| **PC を切っても回す** | Routines（クラウド cron・無期限・最小1時間） |
| **課金** | `--bg`／`/loop`／Routines はサブスク枠。`claude -p`／Agent SDK／GitHub Actions は別課金プール（現状は分離一時停止中） |

「Auto Mode でずっと起動して定期実行」は、正確には **Auto Mode（権限自律）＋ 背景セッション（常駐）＋ ピン留め（自動停止回避）＋ /loop（定期）** の組み合わせです。端末を常時起動できるならこの構成で、PC を切りたいなら Routines で——と使い分けるのが、サブスク枠で安全に長期運用するコツです。

---

## 関連記事

- [Claude のマルチエージェント4系統 — Agent View・Managed Agents・Agent Teams との比較](/mdTechKnowledge/blog/claude-code-agent-view-guide/) — Agent View・バックグラウンドセッションの詳細リファレンス
- [Claude Code Auto Mode 完全ガイド](/mdTechKnowledge/blog/claude-code-auto-mode-guide/) — 権限自律化（無人で止めない仕組み）
- [Claude Code Routines ガイド](/mdTechKnowledge/blog/claude-code-routines-guide/) — PC 非依存のクラウド定期実行
- [Claude Agent SDK / claude -p 課金分離ガイド](/mdTechKnowledge/blog/claude-agent-sdk-billing-split/) — 別課金プールと一時停止の現状

---

## 参考資料

- [Claude Code 公式ドキュメント: Agent view](https://code.claude.com/docs/en/agent-view)（バックグラウンドセッションのホスト・自動停止・ピン留め）
- [Claude Code 公式ドキュメント: Scheduled tasks / loop](https://code.claude.com/docs/en/scheduled-tasks)（/loop の間隔・7日失効・上限）
- [Claude Code 公式ドキュメント: Routines](https://code.claude.com/docs/en/routines)（クラウド cron・スケジュール・使用量）
- [Claude Code 公式ドキュメント: Permission modes（Auto Mode）](https://code.claude.com/docs/en/permission-modes)
- [Claude Code CHANGELOG](https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md)

---

*本記事は2026年6月時点の公式ドキュメント・CHANGELOG に基づきます。自動停止の正確な秒数・スクリーンロック中の挙動・各種上限値はバージョンやプランにより変わり得ます。「推測」と明記した箇所は公式に確認しきれていない点です。最新の正確な仕様は公式ドキュメントでご確認ください。*
