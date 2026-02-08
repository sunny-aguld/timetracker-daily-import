# src/commands/debugReadTl.ts 解説（初学者向け）

## このファイルの役割
日報の `## TL` セクションを読み取り、APIへ送る前のデータを確認するデバッグコマンドです。

## 主な処理
- 日付を取得（ファイル名優先、なければ本文から抽出）
- `extractTlLines` で TL 行を取り出す
- `parseTlLinesStrict` で構文解析
- `buildTimeEntryRequestsFromTlStrict` で API 用配列へ変換
- OutputChannel に JSON を表示

## 初学者ポイント
- OutputChannel は `console.log` より VS Code で見やすく、運用しやすいです。
- 送信前に payload を可視化できるため、不具合調査に有効です。
