# src/lib/workItems.ts 設計説明

## 役割
ワークスペースから `work_items.json` を探索・読み込みし、型検証済みデータを返す。

## 型定義
- `WorkItem = { name: string; id: string }`
- `WorkItemsByCategory = Record<string, WorkItem[]>`

## 探索戦略
`loadWorkItemsFromWorkspace()` は以下順で探索。
1. 設定 `timetrackerDailyImport.workItemsPath`
2. `daily/work_items.json`
3. `work_items.json`

探索ルートは先頭ワークスペースフォルダ (`workspaceFolders[0]`)。

## バリデーション
- ルートはカテゴリごとの配列であること。
- 各要素に `name`, `id` が string として存在すること。
- 不正時は詳細なエラーメッセージで `throw`。

## エラー条件
- ワークスペース未オープン
- ファイル未検出
- JSON パース失敗
- データ構造不正

## 補助関数
- `fileExists(p)` は `fs.stat` 成功可否で存在判定。
