import * as vscode from "vscode";
import { loadWorkItemsFromWorkspace } from "../lib/workItems";

function getTaskContext(beforeCursor: string): {
  hasTaskToken: boolean;
  needsEquals: boolean;
  taskIdx: number; // "@task" の開始位置
} {
  const taskIdx = beforeCursor.lastIndexOf("@task");
  if (taskIdx === -1) {
    return { hasTaskToken: false, needsEquals: false, taskIdx: -1 };
  }
  const after = beforeCursor.slice(taskIdx + "@task".length);
  const trimmed = after.trimStart();
  const needsEquals = !trimmed.startsWith("=");

  return { hasTaskToken: true, needsEquals, taskIdx };
}

export function registerTaskCompletion(context: vscode.ExtensionContext) {
  const provider: vscode.CompletionItemProvider = {
    provideCompletionItems: async (document, position) => {
      const line = document.lineAt(position).text;
      const beforeCursor = line.slice(0, position.character);

      const ctx = getTaskContext(beforeCursor);
      if (!ctx.hasTaskToken) {
        return undefined;
      }

      try {
        const { data } = await loadWorkItemsFromWorkspace();
        const items: vscode.CompletionItem[] = [];

        // 置換範囲： "@task" の直後（=の手前）からカーソルまで
        const replaceStartChar = ctx.taskIdx + "@task".length;
        const replaceRange = new vscode.Range(
          new vscode.Position(position.line, replaceStartChar),
          position
        );

        for (const [category, workItems] of Object.entries(data)) {
          for (const wi of workItems) {
            const item = new vscode.CompletionItem(
              { label: wi.name, description: `#id=${wi.id}` },
              vscode.CompletionItemKind.Value
            );

            item.detail = category;

            // VSCodeが「task」でフィルタしても落ちないようにする
            // （入力が @task の状態でも候補が残る）
            item.filterText = "@task";

            // @task の後ろに入れたい文字列
            const insert = ctx.needsEquals
              ? `=${wi.name} #id=${wi.id}`
              : `${wi.name} #id=${wi.id}`;

            // どこに入れるかを明示（@task自体は壊さない）
            item.insertText = insert;
            item.range = replaceRange;

            items.push(item);
          }
        }

        return items;
      } catch (e) {
        // 原因調査しやすいようにログは出す（不要なら後で消してOK）
        console.error("[taskCompletion] failed:", e);
        return undefined;
      }
    },
  };

  const disposable = vscode.languages.registerCompletionItemProvider(
    { language: "markdown" },
    provider,
    "@",
    "="
  );

  context.subscriptions.push(disposable);
}
