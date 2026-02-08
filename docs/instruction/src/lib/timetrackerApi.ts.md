# src/lib/timetrackerApi.ts 解説（初学者向け）

## このファイルの役割
TimeTracker API との通信をまとめたモジュールです。

## 主な関数
- `issueToken(loginName, password)`
  - 認証 token を取得
- `getMe(token)`
  - ログイン中ユーザー情報を取得
- `postTimeEntry(token, userId, req)`
  - 工数エントリを1件送信

## 共通処理
- `jsonFetch<T>(url, init)`
  - fetch実行
  - HTTPエラー時に本文込みで例外化
  - JSONレスポンスを返却

## 設定値
- `timetrackerDailyImport.apiBaseUrl` を必須使用

## 初学者ポイント
- API処理を1ファイルに集めると、コマンド側が読みやすくなります。
- `Authorization: Bearer <token>` の付与は関数内で統一しています。
