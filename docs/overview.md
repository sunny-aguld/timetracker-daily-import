# timetracker-daily-import 拡張機能 概要

## 1. 目的
この拡張機能は、日報 Markdown 内の `## TL` セクションから作業時間を抽出し、TimeTracker API へ工数エントリを送信する。  
あわせて、`work_items.json` を元に `@task` 入力補完と手動挿入を提供し、記法の入力コストを下げる。

## 2. 想定ワークスペース
- ルートは `foam` を想定。
- 主な参照ファイル:
  - `daily/work_items.json` または `work_items.json`
  - `daily/user.json` または `user.json`
  - 日報 `.md` ファイル（ファイル名または本文に `YYYY-MM-DD` を含む）

## 3. 機能一覧
- `@task` 補完: `src/providers/taskCompletion.ts`
- WorkItem 読み込み確認コマンド: `src/commands/loadWorkItems.ts`
- WorkItem 挿入コマンド: `src/commands/insertWorkItem.ts`
- TL 解析デバッグコマンド: `src/commands/debugReadTl.ts`
- TimeTracker 送信コマンド: `src/commands/pushTimeEntries.ts`
- 送信済み日付の記録（ledger）: `src/lib/ledger.ts`

## 4. 処理アーキテクチャ
1. VS Code 起動時に `activate()` が呼ばれ、コマンドと補完プロバイダを登録。
2. 日報送信時は `pushTimeEntries` コマンドが起点となり、以下を順に実行。
3. `tlParser` で `## TL` セクション抽出と厳密パース。
4. `tlToEntries` で TL アイテム列を API リクエスト配列へ変換。
5. `userCredentials` で認証情報読込、`timetrackerApi` で token 発行・me 取得・timeEntries POST。
6. 成功後に `ledger` へ日付を記録。

## 5. データモデル（主要）
- WorkItem: `{ name: string; id: string }`
- TLアイテム:
  - `work`: `#id=` を含む作業行
  - `marker`: 区切り行（例: 休憩、終業）
- TimeEntryRequest:
  - `workItemId`
  - `startTime` (`YYYY-MM-DDTHH:MM:SS`)
  - `finishTime` (`YYYY-MM-DDTHH:MM:SS`)
  - `memo`（任意）

## 6. 設定値
- `timetrackerDailyImport.workItemsPath`
  - WorkItem ファイル相対パス（未設定時 `daily/work_items.json`）
- `timetrackerDailyImport.apiBaseUrl`
  - TimeTracker API ベース URL（必須）

## 7. エラー設計方針
- 形式不正は早期に `Error` を投げ、上位コマンド側で `showErrorMessage`。
- API 失敗は HTTP ステータスとレスポンス本文をエラーへ含める。
- 補完失敗は編集体験を壊さないため候補未表示にフォールバックし、ログ出力する。
