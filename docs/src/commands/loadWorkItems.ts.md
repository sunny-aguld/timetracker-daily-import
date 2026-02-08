# src/commands/loadWorkItems.ts 設計説明

## 役割
`work_items.json` の読込確認用デバッグコマンド `timetracker.loadWorkItems` を提供する。

## 処理フロー
1. `loadWorkItemsFromWorkspace()` を呼び出し。
2. カテゴリ数と総件数を算出。
3. 成功時は `showInformationMessage` で件数と読み込みパスを表示。
4. 失敗時は `showErrorMessage` で例外内容を表示。

## 主な依存
- `src/lib/workItems.ts`

## 期待効果
- 補完や挿入が効かないとき、ファイル探索/JSON不正の切り分けができる。
