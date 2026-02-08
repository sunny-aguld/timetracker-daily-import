import * as vscode from "vscode";
import { extractTlLines, parseTlLinesStrict } from "../lib/tlParser";
import { buildTimeEntryRequestsFromTlStrict } from "../lib/tlToEntries";


function getDateFromDocument(doc: vscode.TextDocument): string {
  const file = doc.fileName.replace(/\\/g, "/");
  const m = file.match(/(\d{4}-\d{2}-\d{2})/);
  if (m) {
    return m[1];
  }

  // フォールバック：本文に "YYYY-MM-DD" があれば拾う（保険）
  const text = doc.getText();
  const m2 = text.match(/(\d{4}-\d{2}-\d{2})/);
  if (m2) {
    return m2[1];
  }

  throw new Error("Date not found. Expected YYYY-MM-DD in file name or document.");
}

export function registerDebugReadTlCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("timetracker.debugReadTl", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No active editor. Open a daily note (.md) first.");
      return;
    }

    let date: string;
    try {
      date = getDateFromDocument(editor.document);
    } catch (e: any) {
      vscode.window.showErrorMessage(e?.message ?? String(e));
      return;
    }

    const text = editor.document.getText();
    const tlLines = extractTlLines(text);
    const items = parseTlLinesStrict(tlLines);
    const reqs = buildTimeEntryRequestsFromTlStrict(date, items);

    const ch = vscode.window.createOutputChannel("TimeTracker Daily Import");
    ch.clear();
    ch.appendLine(`date: ${date}`);
    ch.appendLine(`TL lines: ${tlLines.length}`);
    ch.appendLine(`Parsed items: ${items.length}`);
    ch.appendLine("");
    ch.appendLine("=== TimeEntryRequests (API payload) ===");
    ch.appendLine(JSON.stringify(reqs, null, 2));
    ch.show(true);

    vscode.window.showInformationMessage(`TimeEntryRequests: ${reqs.length}`);
  });

  context.subscriptions.push(disposable);
}
