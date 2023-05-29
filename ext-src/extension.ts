// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import { CustomSidebarViewProvider } from './customSidebarViewProvider';
import { LocalStorageService } from './storageManger';
import { genHexString, getFilename, track } from './utils';

let terminal: vscode.Terminal | undefined;
let fsWatcher: vscode.FileSystemWatcher | undefined;
let provider: CustomSidebarViewProvider | undefined;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	if (!fsWatcher) {
		fsWatcher = vscode.workspace.createFileSystemWatcher("**/*");
	}
	if (!terminal) { terminal = vscode.window.createTerminal("Cookbook.dev"); }
	terminal.sendText(`npm install cookbookdev@latest -g`);
	terminal.sendText("clear");

	const consoleLog = vscode.window.createOutputChannel("test")
	const storageManager = new LocalStorageService(context.globalState);


	provider = new CustomSidebarViewProvider(context.extensionUri);

	vscode.window.registerUriHandler({
		handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {

			let address = uri.toString().split('?')[1].split("%26")[0].split("%3D")[1]
			let mainFile = uri.toString().split('?')[1].split("%26")[1].split("%3D")[1]
			vscode.window.showInformationMessage('Cookbook.dev: opening ' + address);

			const listener = fsWatcher!.onDidCreate((_uri) => {
				if (getFilename(_uri.fsPath) === getFilename(mainFile)) {
					vscode.window.showTextDocument(_uri);
					listener.dispose();
				}
			});

			if (!terminal) {
				terminal = vscode.window.createTerminal("Cookbook.dev");
			}
			terminal.show();
			terminal.sendText(`npx cookbookdev install ${address} -plugin`);
		}
	});

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

	context.subscriptions.push(vscode.commands.registerCommand('cookbook.track', ({ metric, data }) => { // this is how mixpanel is called
		// consoleLog.appendLine(data.uuid)
		let userId = storageManager.getValue<string>("newId");
		consoleLog.appendLine(userId)
		if (userId)
			data.uuid = userId
		else {
			storageManager.setValue("newId", data.uuid);
			track("VScode: Plugin Installed", {}, data.uuid);
		}
		track(metric, data, userId);
	}));

	context.subscriptions.push(vscode.commands.registerCommand('cookbook.open', ({ address, mainFile }) => {
		if (!vscode.workspace.workspaceFolders) {
			vscode.window.showErrorMessage("Cookbook.dev: Please open a workspace (folder) first.");
			return;
		}
		const listener = fsWatcher!.onDidCreate((uri) => {
			if (getFilename(uri.fsPath) === getFilename(mainFile)) {
				vscode.window.showTextDocument(uri);
				listener.dispose();
			}
		});
		vscode.window.showInformationMessage('Cookbook.dev: opening ' + address);
		if (!terminal) {
			terminal = vscode.window.createTerminal("Cookbook.dev");
		}
		terminal.show();
		terminal.sendText(`npx cookbookdev install ${address} -plugin`);
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
	if (provider) {
		provider = undefined;
	}
}
