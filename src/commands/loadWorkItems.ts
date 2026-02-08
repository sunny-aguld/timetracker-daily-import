import * as vscode from "vscode";
import { loadWorkItemsFromWorkspace } from "../lib/workItems";

export function registerLoadWorkItemsCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "timetracker.loadWorkItems",
    async () => {
      try {
        const { absolutePath, data } = await loadWorkItemsFromWorkspace();
        const categories = Object.keys(data);
        const total = categories.reduce((sum, c) => sum + data[c].length, 0);

        vscode.window.showInformationMessage(
          `Loaded work items: ${categories.length} categories, ${total} items. (${absolutePath})`
        );
      } catch (e: any) {
        vscode.window.showErrorMessage(
          `Failed to load work_items.json: ${e?.message ?? String(e)}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}
