import * as fs from "fs";
import * as vscode from "vscode";
import { IDocumentService } from "./markdown-worker";

export class DocumentService implements IDocumentService {

    get workingFolder(): string {
        return vscode.workspace.rootPath;
    }

    public exists(path: string | Buffer): Thenable<void> {
        return new Promise((resolve, reject) => {
            fs.exists(path, (exists) => {
                if (exists) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    public create(path: string, data: any): Thenable<void> {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, data, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    public open(path: string): Thenable<vscode.TextEditor> {
        return vscode.workspace
            .openTextDocument(path)
            .then((document) => vscode.window.showTextDocument(document, vscode.ViewColumn.One, true));
    }
}
