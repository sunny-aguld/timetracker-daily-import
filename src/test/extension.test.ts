import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { parseTlLinesStrict, type TlLine } from '../lib/tlParser';
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('parseTlLinesStrict allows only the last line to omit #id', () => {
		const lines: TlLine[] = [
			{ lineNo: 1, text: '09:00 タスク1 @task=xxxx #id=0000' },
			{ lineNo: 2, text: '10:00 タスク2 @task=xxxx #id=1111' },
			{ lineNo: 3, text: '17:00 終業' },
		];

		const items = parseTlLinesStrict(lines);
		assert.strictEqual(items.length, 3);
		assert.strictEqual(items[2].kind, 'marker');
	});

	test('parseTlLinesStrict rejects a middle TL line without #id', () => {
		const lines: TlLine[] = [
			{ lineNo: 1, text: '09:00 タスク1 @task=xxxx #id=0000' },
			{ lineNo: 2, text: '12:00 休憩' },
			{ lineNo: 3, text: '17:00 終業' },
		];

		assert.throws(
			() => parseTlLinesStrict(lines),
			/#id is required for all TL lines except the last closing line/
		);
	});
});
