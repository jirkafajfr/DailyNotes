"use strict";

import * as vscode from "vscode";
import { ContentService } from "./content-service";
import { DocumentService } from "./document-service";
import { MarkdownWorker } from "./markdown-worker";
import { MessageService } from "./message-service";

export function activate(context: vscode.ExtensionContext) {

    context.subscriptions.push(vscode.commands.registerCommand("extension.dailyNotes", () => {
        const worker = new MarkdownWorker(
            new MessageService(),
            new DocumentService(),
            new ContentService(),
        );
        worker.execute();
    }));
}
