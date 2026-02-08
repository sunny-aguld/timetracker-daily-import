# src/commands/hello.ts 設計説明

## 役割
サンプル用コマンド `timetracker-daily-import.helloWorld` を登録する。

## 処理
- コマンド実行時に `showInformationMessage` で固定文字列を表示。
- 登録した Disposable を `context.subscriptions` に追加。

## 用途
- 拡張の最小動作確認。
- VS Code command registration のテンプレート。
