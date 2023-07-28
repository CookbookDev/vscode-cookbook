// The module 'vscode' contains the VS Code extensibility API
import * as vscode from 'vscode';
import { CustomSidebarViewProvider } from './customSidebarViewProvider';
import { LocalStorageService } from './storageManger';
import { getFilename, track, getFiles } from './utils';

// let terminal: vscode.Terminal | undefined;
let fsWatcher: vscode.FileSystemWatcher | undefined;
let provider: CustomSidebarViewProvider | undefined;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

  if (!fsWatcher) {
    fsWatcher = vscode.workspace.createFileSystemWatcher("**/*");
  }

  const storageManager = new LocalStorageService(context.globalState);


  provider = new CustomSidebarViewProvider(context.extensionUri);

  vscode.window.registerUriHandler({
    handleUri(uri: vscode.Uri): vscode.ProviderResult<void> {

      let address = uri.toString().split('?')[1].split("%26")[0].split("%3D")[1]
      let type = uri.toString().split('?')[1].split("%26")[1].split("%3D")[1]
      vscode.window.showInformationMessage('Cookbook.dev: opening ' + address);
      getFiles(address, type)

    }
  });

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      CustomSidebarViewProvider.viewType,
      provider
    )
  );

  context.subscriptions.push(vscode.commands.registerCommand('cookbook.track', ({ metric, data }) => { // this is how mixpanel is called
    let userId = storageManager.getValue<string>("newId");
    if (userId) {
      data.uuid = userId;
    }
    else {
      storageManager.setValue("newId", data.uuid);
      track("VScode: Plugin Installed", {}, data.uuid);
    }
    track(metric, data, userId);
  }));


  context.subscriptions.push(vscode.commands.registerCommand('cookbook.open', async ({ urlId, type }) => {
    try {
      getFiles(urlId, type)
    } catch (error: any) {
      vscode.window.showErrorMessage('Failed to open remote file: ' + error.message);
    }
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

  if (provider) {
    provider = undefined;
  }
}
