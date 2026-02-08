# src/commands/pushTimeEntries.ts 設計説明

## 役割
コマンド `timetracker.pushTimeEntries` で日報 TL を解析し、TimeTracker API へ time entries を送信する。

## 関数構成
- `getDateFromDocument(doc)`
  - `debugReadTl.ts` と同様に日付抽出。
- `registerPushTimeEntriesCommand(context)`
  - 送信コマンド本体を登録。

## 送信フロー（詳細）
1. アクティブエディタ確認。
2. 日付抽出。
3. TL抽出・パース・リクエスト変換。
4. 送信対象0件なら警告表示して終了。
5. `loadUserCredentialsFromWorkspace()` で認証情報取得。
6. `issueToken()` で token 発行。
7. `getMe()` で `userId` を決定（`id` 優先、なければ `userId`）。
8. `withProgress` 内で `postTimeEntry()` を順次実行。
9. 全件成功後に `markDateSubmitted(date)` で ledger 更新。
10. 成功メッセージ表示（ledger が更新済みか既登録かを表示）。

## 失敗時挙動
- 上記いずれかで例外が発生した場合は `showErrorMessage`。
- 途中失敗時は残件送信しない（逐次送信のため失敗時点で停止）。

## 依存モジュール
- 解析系: `tlParser`, `tlToEntries`
- API系: `timetrackerApi`
- 認証情報: `userCredentials`
- 送信履歴: `ledger`
