import * as vscode from "vscode";
import { loadWorkItemsFromWorkspace, WorkItem } from "../lib/workItems";

export function registerInsertWorkItemCommand(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "timetracker.insertWorkItem",
    async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showErrorMessage("No active editor.");
        return;
      }

      try {
        const { data } = await loadWorkItemsFromWorkspace();

        // 1) pick category
        const categories = Object.keys(data);
        if (categories.length === 0) {
          vscode.window.showErrorMessage("No categories in work_items.json.");
          return;
        }

        const pickedCategory = await vscode.window.showQuickPick(categories, {
          title: "Select category",
          placeHolder: "Choose a category",
          canPickMany: false,
        });
        if (!pickedCategory) {
            return;
        }
        // 2) pick work item in category
        const items = data[pickedCategory] ?? [];
        const picked = await vscode.window.showQuickPick(
          items.map((it) => ({
            label: it.name,
            description: it.id,
            item: it,
          })),
          {
            title: `Select work item (${pickedCategory})`,
            placeHolder: "Choose a work item",
            canPickMany: false,
          }
        );
        if (!picked) {
            return;
        }
        const wi: WorkItem = picked.item;

        // 3) insert text at cursor
        const insertText = `@task=${wi.name} #id=${wi.id}`;
        await editor.edit((editBuilder) => {
          editBuilder.insert(editor.selection.active, insertText);
        });
      } catch (e: any) {
        vscode.window.showErrorMessage(
          `Failed to insert work item: ${e?.message ?? String(e)}`
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}
