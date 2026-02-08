# src/lib/userCredentials.ts 設計説明

## 役割
`user.json` から TimeTracker 認証情報（`loginName`, `password`）を読み込む。

## 型定義
- `UserCredentials = { loginName: string; password: string }`

## 探索戦略
`loadUserCredentialsFromWorkspace()` は以下順で探索。
1. `daily/user.json`
2. `user.json`

## バリデーション
- `loginName` が string で存在すること
- `password` が string で存在すること

## 戻り値
- `absolutePath`: 使用した `user.json` の絶対パス
- `data`: 検証済み `UserCredentials`

## エラー条件
- ワークスペース未オープン
- ファイル未検出
- JSON パース失敗
- 必須キー欠落/型不正
