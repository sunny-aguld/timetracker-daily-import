import * as vscode from "vscode";
import { extractTlLines, parseTlLines } from "../lib/tlParser";
import { buildTimeEntryRequestsFromTl } from "../lib/tlToEntries";
import { getMe, issueToken, postTimeEntry } from "../lib/timetrackerApi";
import { loadUserCredentialsFromWorkspace } from "../lib/userCredentials";
import { markDateSubmitted } from "../lib/ledger";

function getDateFromDocument(doc: vscode.TextDocument): string {
  const file = doc.fileName.replace(/\\/g, "/");
  const m = file.match(/(\d{4}-\d{2}-\d{2})/);
  if (m) {
    return m[1];
  }

  const text = doc.getText();
  const m2 = text.match(/(\d{4}-\d{2}-\d{2})/);
  if (m2) {
    return m2[1];
  }

  throw new Error("Date not found. Expected YYYY-MM-DD in file name or document.");
}





export function registerPushTimeEntriesCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand("timetracker.pushTimeEntries", async () => {
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
    const items = parseTlLines(tlLines);
    const reqs = buildTimeEntryRequestsFromTl(date, items);

    if (reqs.length === 0) {
      vscode.window.showWarningMessage("No TimeEntryRequests to send (check TL).");
      return;
    }


    try {
      const { data: creds } = await loadUserCredentialsFromWorkspace();
      const token = await issueToken(creds.loginName, creds.password);
      const me = await getMe(token);

      const userId = me.id ?? me.userId;
      if (userId === undefined || userId === null) {
        vscode.window.showErrorMessage("Failed to get userId from /system/users/me response.");
        return;
      }

      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: `TimeTracker: sending ${reqs.length} time entries`,
          cancellable: false,
        },
        async (progress) => {
          for (let i = 0; i < reqs.length; i++) {
            progress.report({ message: `${i + 1}/${reqs.length}` });
            await postTimeEntry(token, userId, reqs[i]);
          }
        }
      );
      const ledger = await markDateSubmitted(date);
      vscode.window.showInformationMessage(
        `Sent ${reqs.length} time entries to TimeTracker. Ledger: ${ledger.updated ? "updated" : "already recorded"}`
      );
    } catch (e: any) {
      vscode.window.showErrorMessage(`Failed to send time entries: ${e?.message ?? String(e)}`);
    }
  });

  context.subscriptions.push(disposable);
}
