# src/lib/tlToEntries.ts 設計説明

## 役割
`TlItem[]` を TimeTracker API 送信用 `TimeEntryRequest[]` に変換する。

## 型定義
- `TimeEntryRequest`
  - `workItemId`
  - `startTime` (`YYYY-MM-DDTHH:MM:SS`)
  - `finishTime` (`YYYY-MM-DDTHH:MM:SS`)
  - `memo`（任意）

## 変換アルゴリズム
`buildTimeEntryRequestsFromTlStrict(date, items)` の処理:
1. 少なくとも1件の `work` が存在するか検証。なければエラー。
2. 先頭から末尾-1まで隣接ペア `cur`,`next` を走査。
3. `cur.time < next.time` を必須とし、逆転/同時刻はエラー。
4. `cur.kind === "work"` の場合のみ、`cur.time`〜`next.time` の1件を生成。
5. 最終行が `work` の場合は終端時刻不足としてエラー。

## 補助関数
- `toMinutes(hhmm)`: 時刻比較用に分へ変換。
- `toDateTime(date, hhmm)`: API形式へ連結。

## 設計上の前提
- 区間終端は次行時刻で決まる（marker も終端として有効）。
- `memo` は `TlItem.memo` をそのまま送る。
