import * as vscode from "vscode";
import { IMessageService } from "./markdown-worker";

export class MessageService implements IMessageService {

    public showWarning(message: string): Thenable<string> {
        return vscode.window.showWarningMessage(message);
    }
    public showError(message: string): Thenable<string> {
        return vscode.window.showErrorMessage(message);
    }
}
