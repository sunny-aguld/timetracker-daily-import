# src/lib/tlParser.ts 設計説明

## 役割
日報 Markdown の `## TL` セクションを抽出し、時系列項目へ厳密パースする。

## 型定義
- `TlLine`
  - `lineNo`: 文書内 1 始まり行番号
  - `text`: 元行文字列
- `TlItem`
  - `time`: `HH:MM`
  - `kind`: `"work"` または `"marker"`
  - `workItemId`: `#id=` から抽出（workのみ）
  - `taskName`: `@task=` から抽出（任意）
  - `memo`: task/id除去後の残文
  - `raw`, `lineNo`

## 関数詳細
### `extractTlLines(markdown)`
1. `## TL` 見出しを厳密一致で探索。
2. 次の `## ` 見出しまでを TL 本文として収集。
3. 空行は除外。
4. 見出し未検出または空セクションはエラー。

### `parseTlLinesStrict(lines)`
1. 各行を `time + body` 形式で分割（空白1以上必須）。
2. `time` を `parseTimeStrict` で検証（`00:00`〜`23:59`）。
3. body から `#id=(\d+)` と `@task=...` を抽出。
4. `#id` ありは `work`、なしは `marker` として出力。
5. `memo` は `@task=...` と `#id=...` を除去して整形。

## 厳密性の意図
- 曖昧な時刻や壊れた行を早期に検出し、送信前に停止させる。
- `lineNo` を保持し、エラー時に修正位置を明確化する。
