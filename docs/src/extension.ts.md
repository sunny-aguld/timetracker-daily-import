# src/extension.ts 設計説明

## 役割
拡張機能のエントリポイント。`activate` で機能を登録し、VS Code のライフサイクルに接続する。

## エクスポート
- `activate(context: vscode.ExtensionContext): void`
- `deactivate(): void`

## 処理詳細
`activate` は以下を登録する。
- `registerInsertWorkItemCommand`
- `registerTaskCompletion`
- `registerPushTimeEntriesCommand`

登録した Disposable は各 register 関数内で `context.subscriptions` に積まれるため、拡張停止時に解放される。

## 注意点
- インポート済みでも `activate` で呼ばない機能は実行不能になる。
- 現在 `hello/loadWorkItems/debugReadTl` は import されているが未登録。
