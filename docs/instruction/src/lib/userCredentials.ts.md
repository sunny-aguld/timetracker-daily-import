# src/lib/userCredentials.ts 解説（初学者向け）

## このファイルの役割
`user.json` からログイン情報を読み込みます。

## 読み込む値
- `loginName`
- `password`

## 処理の流れ
1. ワークスペース確認
2. `daily/user.json` と `user.json` を順に探索
3. JSON 読み込み
4. `loginName` / `password` の存在と型を検証
5. パス情報付きで返却

## 初学者ポイント
- 認証情報ファイルの場所を複数許容すると、ワークスペース構成差に対応しやすくなります。
- 必須項目チェックをこの層に集約すると、API呼び出し側を簡潔にできます。
