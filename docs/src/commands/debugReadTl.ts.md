# src/commands/debugReadTl.ts 設計説明

## 役割
コマンド `timetracker.debugReadTl` で TL 解析結果と API 送信予定 payload を OutputChannel に表示する。

## 関数構成
- `getDateFromDocument(doc)`
  - ファイル名から `YYYY-MM-DD` を抽出。
  - なければ本文から抽出。
  - 抽出不可はエラー。
- `registerDebugReadTlCommand(context)`
  - コマンド本体を登録。

## 処理フロー
1. アクティブエディタ確認。
2. 日付抽出。
3. `extractTlLines` → `parseTlLinesStrict` → `buildTimeEntryRequestsFromTlStrict` の順に変換。
4. OutputChannel `TimeTracker Daily Import` に以下を出力:
   - 日付
   - TL行数
   - 解析アイテム数
   - `TimeEntryRequest[]` の JSON
5. 最後に情報メッセージで件数表示。

## 主な用途
- TL 記法不備の検証
- 実送信前の payload 確認
