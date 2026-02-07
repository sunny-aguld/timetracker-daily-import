import * as vscode from 'vscode';

export function registerHelloCommand(context: vscode.ExtensionContext){
    const disposable = vscode.commands.registerCommand(
        "timetracker-daily-import.helloWorld",
        () => {
            vscode.window.showInformationMessage("Hello World from TimeTracker Daily Import!");
        }
    );
    context.subscriptions.push(disposable);
}
