import axios from "axios";
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import * as vscode from 'vscode';
import watermark from './watermark'
// axios.defaults.baseURL = "http://localhost:5001";
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
    }
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

const getContractInfo = async (contractUrlId: string, type: string) => {
  let options = {
    headers: {
      "vscode-plugin": "true",
    },
  }
  let res
  if (type === "contract") {
    res = await axios.get(
      `/contracts/contract-gist/${contractUrlId}`, options
    );
  }
  else {
    res = await axios.get(
      `/protocols/protocol-gist/${contractUrlId}`, options
    );
  }

  return res.data;
};


const getFilenameForInstall = (path: string) => {
  const parts = path.split("/");
  const filename = parts[parts.length - 1];
  return filename;
};


const saveContracts = async (contractUrlId: string, mainFilename: string, files: any) => {
  vscode.window.showInformationMessage(`Cookbook.dev: opening ${contractUrlId} in preview`);

  const workspaceFolder = vscode.workspace.workspaceFolders[0].uri.path
  const tempParentDirPath = path.join(workspaceFolder, "cookbook")
  if (!fs.existsSync(tempParentDirPath)) {
    fs.mkdirSync(tempParentDirPath);
  }
  const savePath = path.join(tempParentDirPath, `${contractUrlId}`);
  if (!fs.existsSync(savePath)) {
    fs.mkdirSync(savePath);
  }

  for (let file of files) {
    let pathToCreate = savePath.repeat(1)
    for (let folder of file.path.split("/")) {
      if (!folder.includes(".sol")) {
        pathToCreate = path.join(pathToCreate, folder);
        if (!fs.existsSync(pathToCreate)) {
          fs.mkdirSync(pathToCreate);
        }
      }
      else {
        fs.writeFileSync(path.join(pathToCreate, folder), watermark(
          "https://www.cookbook.dev/contracts/" + contractUrlId + "/"
        ).concat(file.content));
      }
    }
  }

  let mainFilePath = files.find((item: any) => item.path.endsWith(mainFilename))?.path

  const filePath = path.join(savePath, mainFilePath)
  const fileUri = vscode.Uri.file(filePath);

  const document = await vscode.workspace.openTextDocument(fileUri);
  vscode.window.showTextDocument(document, { preview: true });
  return
  return
};

export async function getFiles(urlId: string, type: string) {
  const { gistId, mainContract, contracts } = await getContractInfo(urlId, type); // 2nd param tell api request comes from plugin
  const files = contracts
  saveContracts(
    urlId,
    getFilenameForInstall(mainContract),
    files
  );
  return
}

