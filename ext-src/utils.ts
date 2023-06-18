import axios from "axios";
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
axios.defaults.baseURL = "https://simple-web3-api.herokuapp.com";

export const getFilename = (path: string) => {
  const parts = path.split(/[\\/]/);
  const filename = parts[parts.length - 1];
  return filename;
};

export const track = (metric: string, data: any, userID: string) => {
  axios.post(`/track/`, {
    metric,
    data: {
      browser: "vscode",
      deviceType: "vscode",
      platform: "vscode",
      userID,
      ...data,
    },
  });
};

export function genHexString(len: number) {
  const hex = "0123456789ABCDEF";
  let output = "";
  for (let i = 0; i < len; ++i) {
    output += hex.charAt(Math.floor(Math.random() * hex.length));
  }
  return output;
}

const getContractInfo = async (contractAddress: string) => {
  let options = {
    headers: {
      "vscode-plugin": "true",
    },
  }
  const res = await axios.get(
    `https://simple-web3-api.herokuapp.com/cli/id/${contractAddress}`, options
  );

  return res.data;
};

const retrieveGistFiles = async (gistId: string) => {
  const res = await axios.get(`https://api.github.com/gists/${gistId}`);
  return res.data.files;
};

const getFilenameForInstall = (path: string) => {
  const parts = path.split("/");
  const filename = parts[parts.length - 1];
  return filename;
};

const updateImports = (contract: any, isMain: any) => {
  let adjustedFile = contract.split("\n");
  let i = 0;
  for (const line of adjustedFile) {
    if (line.replaceAll(" ", "").substring(0, 2) === "//") {
      adjustedFile.splice(i, 1);
    }
    i++;
  }
  adjustedFile = adjustedFile.join("\n");
  const importIndexes = [
    ...adjustedFile.matchAll(new RegExp("import ", "gi")),
  ].map((a) => a.index);
  const imports = importIndexes.map((index) =>
    adjustedFile.substring(index, adjustedFile.indexOf(";", index))
  );
  for (const line of imports) {
    let path = line.substring(line.indexOf('"') + 1, line.lastIndexOf('"'));
    if (!path) {
      path = line.substring(line.indexOf("'") + 1, line.lastIndexOf("'"));
    }
    const filename = getFilename(path);
    contract = contract.replace(
      path,
      `${isMain ? "./dependencies/" : "./"}${filename}`
    );
  }
  return contract;
};

const saveContracts = async (contractAddress: string, mainFilename: string, files: any) => {

  const updatedFiles: any = {};
  const keys = Object.keys(files);

  for (const filename of keys) {
    const oldFile = files[filename];
    const newFile = updateImports(oldFile.content, filename === mainFilename);
    updatedFiles[filename] = { content: newFile };
  }

  const tempParentDirPath = os.tmpdir();
  if (!fs.existsSync(tempParentDirPath)) {
    fs.mkdirSync(tempParentDirPath);
  }
  const tempDirPath = fs.mkdtempSync(path.join(tempParentDirPath, `contracts`));
  const savePath = path.join(tempDirPath, `${contractAddress}`);
  const depsPath = path.join(savePath, `dependencies`)
  if (!fs.existsSync(tempDirPath)) {
    fs.mkdirSync(tempDirPath);
  }
  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath);
  }
  if (!fs.existsSync(depsPath)) {
    fs.mkdirSync(depsPath);
  }

  const choice = await vscode.window.showInformationMessage(
    'Do you want to open the remote file in preview?',
    'Open'
  );
  if (choice !== 'Open') {
    return `Cooking cancelled. '${contractAddress}' was not saved.`;
  }
  for (const filename of keys) {
    let saveFilePath = "";
    if (filename === mainFilename) {
      saveFilePath = `${filename}`;
    }
    else {
      saveFilePath = `dependencies/${filename}`;
    }
    fs.writeFileSync(path.join(savePath, saveFilePath), updatedFiles[filename].content);
  }

  const cookbookExtension = vscode.extensions.getExtension('cookbookdev.vscode-cookbook');
  if (cookbookExtension) {
    const workspaceFolder = cookbookExtension.extensionPath;
    const filePath = path.join(savePath, mainFilename)
    const relativeFilePath = path.relative(workspaceFolder, filePath);
    const fileUri = vscode.Uri.file(relativeFilePath);

    const tempWorkspaceUri = vscode.Uri.file(savePath);
    await vscode.workspace.updateWorkspaceFolders(vscode.workspace.workspaceFolders ? vscode.workspace.workspaceFolders.length : 0, null, { uri: tempWorkspaceUri });
    const document = await vscode.workspace.openTextDocument(fileUri);
    vscode.window.showTextDocument(document, { preview: true });
    return
  }
  return
};

export async function getFiles(contractAddress: string) {
  const { gistId, mainContract } = await getContractInfo(contractAddress); // 2nd param tell api request comes from plugin
  const files = await retrieveGistFiles(gistId);
  saveContracts(
    contractAddress,
    getFilenameForInstall(mainContract),
    files
  );
  return
}

