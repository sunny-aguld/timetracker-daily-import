# src/extension.ts 解説（初学者向け）

## このファイルの役割
拡張機能の「起動時エントリポイント」です。  
VS Code はこのファイルの `activate` を呼び出して、コマンドや補完機能を使えるようにします。

## 何をしているか
- `registerInsertWorkItemCommand(context)`
- `registerTaskCompletion(context)`
- `registerPushTimeEntriesCommand(context)`

上の3つを `activate` 内で呼び、機能を登録しています。

## 初学者ポイント
- `ExtensionContext` は「拡張機能の実行コンテキスト」です。
- 各 register 関数は `Disposable` を `context.subscriptions` に追加します。
- `deactivate` は終了時フックですが、この実装では特別な後処理はありません。
