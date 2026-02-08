import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as path from "path";

export type Ledger = {
  version: 1;
  submittedDates: string[]; // "YYYY-MM-DD"
};

const LEDGER_FILENAME = "timetracker_ledger.json";

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

function getWorkspaceRoot(): string {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    throw new Error("No workspace folder is open.");
  }
  return folders[0].uri.fsPath;
}

export function getLedgerPath(): string {
  const root = getWorkspaceRoot();
  return path.join(root, "daily", LEDGER_FILENAME);
}

export async function loadOrInitLedger(ledgerPath: string): Promise<Ledger> {
  if (await fileExists(ledgerPath)) {
    const raw = await fs.readFile(ledgerPath, "utf8");
    const json = JSON.parse(raw) as Partial<Ledger>;
    if (json.version === 1 && Array.isArray(json.submittedDates)) {
      return {
        version: 1,
        submittedDates: json.submittedDates.filter((x) => typeof x === "string"),
      };
    }
  }
  return { version: 1, submittedDates: [] };
}

export async function saveLedger(ledgerPath: string, ledger: Ledger): Promise<void> {
  await fs.mkdir(path.dirname(ledgerPath), { recursive: true });
  await fs.writeFile(ledgerPath, JSON.stringify(ledger, null, 2), "utf8");
}

export async function markDateSubmitted(
  date: string
): Promise<{ ledgerPath: string; updated: boolean }> {
  const ledgerPath = getLedgerPath();
  const ledger = await loadOrInitLedger(ledgerPath);

  if (!ledger.submittedDates.includes(date)) {
    ledger.submittedDates.push(date);
    ledger.submittedDates.sort();
    await saveLedger(ledgerPath, ledger);
    return { ledgerPath, updated: true };
  }

  return { ledgerPath, updated: false };
}
