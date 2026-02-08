# src/lib/tlToEntries.ts 解説（初学者向け）

## このファイルの役割
TL解析結果を TimeTracker API の送信形式へ変換します。

## 変換の考え方
- 1行目の時刻から次行の時刻までを1区間とみなす
- 区間の先頭が `work` の場合だけ送信データを作る
- 区間終端は「次の行」

## 主要関数
- `buildTimeEntryRequestsFromTlStrict(date, items)`
  - `TlItem[]` から `TimeEntryRequest[]` を作成

## チェックしていること
- work項目が1件以上あるか
- 時刻が単調増加か（逆転・同時刻はエラー）
- 最終行が work で終わっていないか（終端不足）

## 初学者ポイント
- 時刻比較は文字列比較ではなく分に変換して比較します。
- 厳密チェックを通してから API 送信する設計は、障害予防に有効です。
