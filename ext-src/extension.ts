// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import { CustomSidebarViewProvider } from './customSidebarViewProvider';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	let terminal: vscode.Terminal | undefined = vscode.window.createTerminal("Cookbook.dev");

	// Console diagnostic information (console.log) and errors (console.error)
	// Will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-extension-sidebar-html" is active!');

	const provider = new CustomSidebarViewProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
			CustomSidebarViewProvider.viewType,
			provider
		)
	);

	context.subscriptions.push(
		vscode.window.onDidCloseTerminal((closedTerminal) => {
			if (terminal === closedTerminal) {
				terminal = undefined;
			}
		})
	);

	context.subscriptions.push(vscode.commands.registerCommand('cookbook.open', (address) => {
		vscode.window.showInformationMessage('Cookbook.dev: downloading ' + address);
		if (!terminal) {
			terminal = vscode.window.createTerminal("Cookbook.dev");
		}
		terminal.show();
		terminal.sendText(`npx cookbookdev install ${address}`);
	}));


	context.subscriptions.push(
		vscode.commands.registerCommand("cookbook.menu.view", () => {
			const message = "Menu/Title of extension is clicked !";
			vscode.window.showInformationMessage(message);
		})
	);

	// Command has been defined in the package.json file
	// Provide the implementation of the command with registerCommand
	// CommandId parameter must match the command field in package.json
	let openWebView = vscode.commands.registerCommand('cookbook.contracts', () => {
		// Display a message box to the user
		vscode.window.showInformationMessage('Command " Sidebar View [cookbook.contracts] " called.');
	});

	context.subscriptions.push(openWebView);
}

// this method is called when your extension is deactivated
export function deactivate() { }
