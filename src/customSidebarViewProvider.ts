import * as vscode from "vscode";

export class CustomSidebarViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "cookbook.contracts";

  private _view?: vscode.WebviewView;

  constructor(private readonly _extensionUri: vscode.Uri) { }

  resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext<unknown>,
    token: vscode.CancellationToken
  ): void | Thenable<void> {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    };
    webviewView.webview.html = this.getHtmlContent(webviewView.webview);
  }


  private getHtmlContent(webview: vscode.Webview): string {

    // const manifestUri = vscode.Uri.joinPath(
    //   this._extensionUri,
    //   "build",
    //   "asset-manifest.json"
    // )

    // relative path might cause issues in production. Absolute path caused issues during dev 
    // maybe windows specific?

    const manifest = require("../build/asset-manifest.json");

    const mainScript = manifest.files["main.js"];
    const mainStyle = manifest.files["main.css"];
    const scriptPathOnDisk = vscode.Uri.joinPath(
      this._extensionUri, "build", mainScript
    );
    const scriptUri = webview.asWebviewUri(scriptPathOnDisk);
    const stylePathOnDisk = vscode.Uri.joinPath(
      this._extensionUri, "build", mainStyle
    );
    const styleUri = webview.asWebviewUri(stylePathOnDisk);

    // Use a nonce to whitelist which scripts can be run
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="utf-8">
				<meta name="viewport" content="width=device-width,initial-scale=1,shrink-to-fit=no">
				<meta name="theme-color" content="#000000">
				<title>React App</title>
				<link rel="stylesheet" type="text/css" href="${styleUri}">
        <base href="${webview.asWebviewUri(vscode.Uri.joinPath(this._extensionUri, "build", "index.html"))}/">
        </head>

			<body>
				<noscript>You need to enable JavaScript to run this app.</noscript>
				<div id="root"></div>
				
				<script nonce="${nonce}" src="${scriptUri}"></script>
			</body>
			</html>`;
  }
}

function getNonce() {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 32; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}