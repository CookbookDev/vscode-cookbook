// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import { CustomSidebarViewProvider } from './customSidebarViewProvider';
import { getFilename } from './utils';

let terminal: vscode.Terminal | undefined;
let fsWatcher: vscode.FileSystemWatcher | undefined;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	if (!fsWatcher) {
		fsWatcher = vscode.workspace.createFileSystemWatcher("**/*");
	}
	if (!terminal) { terminal = vscode.window.createTerminal("Cookbook.dev"); }
	terminal.sendText(`npm install cookbookdev@latest -g`);

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

	context.subscriptions.push(vscode.commands.registerCommand('cookbook.open', (address, mainContract) => {
		if (!vscode.workspace.workspaceFolders) {
			vscode.window.showErrorMessage("Cookbook.dev: Please open a workspace (folder) first.");
			return;
		}
		const listener = fsWatcher!.onDidCreate((uri) => {
			const filename = getFilename(uri.fsPath);
			console.log("james", filename);
			if (filename === "simple-token.sol") {
				console.log("found it")
				vscode.window.showTextDocument(uri);
				listener.dispose();
			}
		});
		console.log(vscode.workspace.workspaceFolders[0].uri.fsPath);
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
export function deactivate() {
	if (fsWatcher) {
		fsWatcher.dispose();
		fsWatcher = undefined;
	}
	if (terminal) {
		terminal.dispose();
		terminal = undefined;
	}
}
