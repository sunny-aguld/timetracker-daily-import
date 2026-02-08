# src/commands/insertWorkItem.ts 解説（初学者向け）

## このファイルの役割
コマンド実行で WorkItem を選び、`@task=... #id=...` をエディタに挿入します。

## 処理の流れ
1. アクティブエディタがあるか確認
2. `work_items.json` を読み込み
3. 1回目の QuickPick でカテゴリ選択
4. 2回目の QuickPick で項目選択
5. カーソル位置に文字列を挿入

## 初学者ポイント
- `showQuickPick` は「候補から1つ選ぶUI」を簡単に作れます。
- `editor.edit(...)` は非同期です。`await` して完了を待つ実装になっています。
- キャンセル時に `return` して安全に終了するのは、VS Code 拡張でよく使う書き方です。
