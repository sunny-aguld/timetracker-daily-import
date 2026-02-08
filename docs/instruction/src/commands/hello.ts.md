# src/commands/hello.ts 解説（初学者向け）

## このファイルの役割
サンプルコマンド `timetracker-daily-import.helloWorld` を登録します。

## 処理の流れ
1. `vscode.commands.registerCommand(...)` でコマンドIDを登録
2. 実行時に `showInformationMessage(...)` でメッセージ表示
3. `context.subscriptions.push(disposable)` で解放管理

## 初学者ポイント
- コマンドIDは `package.json` の `contributes.commands` と対応させます。
- `disposable` を登録しないと、拡張終了時の管理が煩雑になります。
