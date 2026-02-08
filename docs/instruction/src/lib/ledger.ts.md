# src/lib/ledger.ts 解説（初学者向け）

## このファイルの役割
「どの日付を送信済みか」をローカル JSON に記録します。

## 保存先
- `daily/timetracker_ledger.json`

## 主な関数
- `getLedgerPath()`
  - ledger ファイルのパスを返す
- `loadOrInitLedger(path)`
  - あれば読込、なければ初期値作成
- `saveLedger(path, ledger)`
  - JSON保存
- `markDateSubmitted(date)`
  - 日付が未登録なら追加して保存

## 初学者ポイント
- この ledger は「重複送信を完全防止」ではなく、履歴管理・可視化のための補助です。
- 保存前に配列をソートして、差分を見やすくしています。
