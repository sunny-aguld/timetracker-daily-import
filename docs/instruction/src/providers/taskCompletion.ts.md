# src/providers/taskCompletion.ts 解説（初学者向け）

## このファイルの役割
Markdown で `@task` を入力したときに、`work_items.json` 由来の候補を出す補完機能です。

## 処理の流れ
1. カーソル左側テキストから `@task` の位置を調べる
2. `@task` 文脈でなければ補完しない
3. WorkItem を読み込む
4. CompletionItem を作って返す

## CompletionItem の中身
- `label`: 作業名
- `description`: `#id=...`
- `detail`: カテゴリ名
- `insertText`: `=<name> #id=<id>` など
- `range`: どの範囲を置き換えるか

## 初学者ポイント
- `registerCompletionItemProvider` の triggerCharacters に `"@"`, `"="` を指定しています。
- 補完は「いつ呼ぶか」と「何を返すか」の2点が重要です。
- 例外時に補完を壊さないよう、失敗時は `undefined` を返す設計です。
