# src/lib/ledger.ts 設計説明

## 役割
送信済み日付をローカル ledger (`daily/timetracker_ledger.json`) に保存し、重複送信の可視化を補助する。

## 型定義
- `Ledger`
  - `version: 1`
  - `submittedDates: string[]` (`YYYY-MM-DD`)

## 主要関数
- `getLedgerPath()`
  - ワークスペースルート配下 `daily/timetracker_ledger.json` を返す。
- `loadOrInitLedger(ledgerPath)`
  - 既存ファイルがあれば JSON 読込。
  - 形式が有効なら採用、無効/未存在なら空 ledger を返す。
- `saveLedger(ledgerPath, ledger)`
  - 親ディレクトリを `mkdir -p` 相当で作成し保存。
- `markDateSubmitted(date)`
  - `submittedDates` 未登録時のみ追加・ソート・保存。
  - 既登録の場合は更新せず `updated: false`。

## 戻り値設計
`markDateSubmitted` は `{ ledgerPath, updated }` を返し、UI 側で「更新済み/既登録」を表示できる。

## エラー条件
- ワークスペース未オープン
- ファイルIO失敗
- JSON パース失敗（読み込み時）
