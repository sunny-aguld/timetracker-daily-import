# src/test/extension.test.ts 設計説明

## 役割
拡張テストの雛形。現状はサンプルテストのみ。

## 内容
- `suite('Extension Test Suite', ...)`
  - 開始時に情報メッセージ表示。
- `test('Sample test', ...)`
  - 配列 `indexOf` の基本アサーション2件。

## 現状評価
- 実機能（TL解析、API送信、補完、コマンド登録）に対するテストは未実装。
- 回帰防止には以下を追加すべき:
  - `tlParser` の正常/異常系
  - `tlToEntries` の時刻逆転・終端不足
  - `workItems/userCredentials` の探索/検証
