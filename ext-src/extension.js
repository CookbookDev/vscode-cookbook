"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
const vscode = require("vscode");
const customSidebarViewProvider_1 = require("./customSidebarViewProvider");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Console diagnostic information (console.log) and errors (console.error)
    // Will only be executed once when your extension is activated
    console.log('Congratulations, your extension "vscode-extension-sidebar-html" is active!');
    const provider = new customSidebarViewProvider_1.CustomSidebarViewProvider(context.extensionUri);
    context.subscriptions.push(vscode.window.registerWebviewViewProvider(customSidebarViewProvider_1.CustomSidebarViewProvider.viewType, provider));
    context.subscriptions.push(vscode.commands.registerCommand("cookbook.menu.view", () => {
        const message = "Menu/Title of extension is clicked !";
        vscode.window.showInformationMessage(message);
    }));
    // Command has been defined in the package.json file
    // Provide the implementation of the command with registerCommand
    // CommandId parameter must match the command field in package.json
    let openWebView = vscode.commands.registerCommand('cookbook.contracts', () => {
        // Display a message box to the user
        vscode.window.showInformationMessage('Command " Sidebar View [cookbook.contracts] " called.');
    });
    context.subscriptions.push(openWebView);
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map