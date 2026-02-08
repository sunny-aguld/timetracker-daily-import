# src/lib/timetrackerApi.ts 設計説明

## 役割
TimeTracker API 通信を集約し、認証・ユーザー取得・工数登録を提供する。

## 設定取得
`getApiBaseUrl()`:
- 設定 `timetrackerDailyImport.apiBaseUrl` を取得。
- 未設定はエラー。
- 末尾スラッシュを除去して URL 連結の二重 `/` を防止。

## 共通通信
`jsonFetch<T>(url, init)`:
1. `fetch` 実行（`Content-Type: application/json` を付与）。
2. `res.ok` でない場合、本文テキスト込みでエラー。
3. JSON を `T` として返す。

## API関数
- `issueToken(loginName, password): Promise<string>`
  - `POST /auth/token`
  - レスポンス `token` 必須
- `getMe(token): Promise<LoginUser>`
  - `GET /system/users/me`
  - `Authorization: Bearer <token>`
- `postTimeEntry(token, userId, req): Promise<unknown>`
  - `POST /system/users/{userId}/timeEntries`
  - body は `TimeEntryRequest`

## エラー方針
- 設定不足、HTTPエラー、想定レスポンス不足を明示的に `throw`。
- 呼び出し元コマンド側でユーザー通知を行う。
