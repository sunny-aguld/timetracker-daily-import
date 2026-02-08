# src/commands/insertWorkItem.ts 設計説明

## 役割
コマンド `timetracker.insertWorkItem` で WorkItem を選択し、カーソル位置へ `@task=... #id=...` を挿入する。

## 処理フロー
1. アクティブエディタ存在確認。なければエラー表示して終了。
2. `loadWorkItemsFromWorkspace()` でデータ読込。
3. カテゴリ一覧を QuickPick で選択。
4. 選択カテゴリの WorkItem 一覧を QuickPick で選択。
5. `@task=<name> #id=<id>` を `editor.edit` で挿入。

## UI仕様
- キャンセル時は何もせず終了。
- カテゴリ0件時はエラーメッセージ。

## エラー処理
読込失敗や編集失敗は `showErrorMessage` で通知。
