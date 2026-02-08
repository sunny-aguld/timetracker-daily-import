import * as vscode from "vscode";
import * as fs from "fs/promises";
import * as path from "path";

export type WorkItem = { name: string; id: string };
export type WorkItemsByCategory = Record<string, WorkItem[]>;

const DEFAULT_WORK_ITEMS_REL_PATH = "daily/work_items.json";

async function fileExists(p: string): Promise<boolean> {
  try {
    await fs.stat(p);
    return true;
  } catch {
    return false;
  }
}

/**
 * Find work_items.json from the current workspace and load it.
 * Search order:
 * 1) <workspace>/daily/work_items.json
 * 2) <workspace>/work_items.json
 */
export async function loadWorkItemsFromWorkspace(): Promise<{
  absolutePath: string;
  data: WorkItemsByCategory;
}> {
  const folders = vscode.workspace.workspaceFolders;
  if (!folders || folders.length === 0) {
    throw new Error("No workspace folder is open.");
  }
  const workspaceRoot = folders[0].uri.fsPath;

  const config = vscode.workspace.getConfiguration();
  const configuredRelPath =
    config.get<string>("timetrackerDailyImport.workItemsPath") ?? DEFAULT_WORK_ITEMS_REL_PATH;

  // 探索順：設定パス → daily/work_items.json → work_items.json（保険）
  const candidateRelPaths = [
    configuredRelPath,
    "daily/work_items.json",
    "work_items.json",
  ];

  let found: string | null = null;
  for (const rel of candidateRelPaths) {
    const abs = path.join(workspaceRoot, rel);
    if (await fileExists(abs)) {
      found = abs;
      break;
    }
  }

  if (!found) {
    throw new Error(
      `work_items.json not found. Expected at: ${candidateRelPaths
        .map((p) => path.join(workspaceRoot, p))
        .join(" or ")}`
    );
  }

  const raw = await fs.readFile(found, "utf8");
  const json = JSON.parse(raw) as WorkItemsByCategory;

  // Minimal validation (avoid silent runtime errors later)
  for (const [category, items] of Object.entries(json)) {
    if (!Array.isArray(items)) {
      throw new Error(`Invalid format: "${category}" must be an array.`);
    }
    for (const item of items) {
      if (!item || typeof item.name !== "string" || typeof item.id !== "string") {
        throw new Error(`Invalid item in "${category}": each item must have {name, id} as strings.`);
      }
    }
  }

  return { absolutePath: found, data: json };
}
