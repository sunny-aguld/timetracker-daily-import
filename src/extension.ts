// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { registerHelloCommand } from './commands/hello';
import { registerLoadWorkItemsCommand } from "./commands/loadWorkItems";
import { registerInsertWorkItemCommand } from "./commands/insertWorkItem";
import { registerTaskCompletion } from "./providers/taskCompletion";
// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	registerHelloCommand(context);
	registerLoadWorkItemsCommand(context);
	registerInsertWorkItemCommand(context);
	registerTaskCompletion(context);
}

// This method is called when your extension is deactivated
export function deactivate() {}
