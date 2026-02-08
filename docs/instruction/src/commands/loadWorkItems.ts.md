# src/commands/loadWorkItems.ts 解説（初学者向け）

## このファイルの役割
`work_items.json` を正しく読めるか確認するためのデバッグ用コマンドです。

## 処理の流れ
1. `loadWorkItemsFromWorkspace()` を呼ぶ
2. 読み込んだデータからカテゴリ数と総件数を計算
3. 成功なら `showInformationMessage` で結果表示
4. 失敗なら `showErrorMessage` で理由表示

## 初学者ポイント
- 「補完が出ない」問題の切り分けに使えるコマンドです。
- まずこのコマンドで JSON 読み込み成功を確認すると調査しやすくなります。
