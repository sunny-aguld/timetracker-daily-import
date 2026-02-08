# src/providers/taskCompletion.ts 設計説明

## 役割
Markdown 編集中に `@task` 文脈を検出し、`work_items.json` 由来の候補を補完候補として返す。

## 主な関数
- `getTaskContext(beforeCursor)`
  - カーソル左側文字列から最終 `@task` の位置を取得。
  - `=` が必要かどうか（`needsEquals`）を判定。
- `registerTaskCompletion(context)`
  - CompletionItemProvider を登録。

## 補完判定ロジック
1. 現在行のカーソル手前文字列を取得。
2. `@task` がなければ `undefined` を返し補完対象外。
3. `loadWorkItemsFromWorkspace()` で候補データを取得。
4. `@task` 以降を置換する `Range` を計算。
5. 各 work item から CompletionItem を構築。

## CompletionItem の設計
- `label`: WorkItem 名
- `description`: `#id=<id>`
- `detail`: カテゴリ名
- `filterText`: `@task`（`@task` 文脈で候補が落ちにくいようにする）
- `insertText`:
  - `needsEquals=true` のとき `=<name> #id=<id>`
  - それ以外は `<name> #id=<id>`
- `range`: `@task` 直後からカーソル位置まで

## トリガー文字
`registerCompletionItemProvider` の triggerCharacters は `"@"`, `"="`。

## エラー処理
`work_items.json` 読込や JSON 解析で失敗した場合は `console.error` 出力後、`undefined` を返して補完を非表示にする。
