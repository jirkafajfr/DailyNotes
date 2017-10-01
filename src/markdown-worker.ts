import * as dateFormat from "dateformat";
import * as path from "path";
import * as vscode from "vscode";
import { NoWorkingDirectoryError } from "./no-working-directory-error";

export interface IMessageService {
    showWarning(message: string): Thenable<string>;
    showError(message: string): Thenable<string>;
}

export interface IDocumentService {
    workingFolder: string;
    exists(path: string | Buffer): Thenable<void>;
    create(path: string, data: any): Thenable<void>;
    open(path: string): Thenable<vscode.TextEditor>;
}

export interface IContentService {
    content(date: Date): string;
}

export class MarkdownWorker {

    constructor(
        private readonly messageService: IMessageService,
        private readonly documentService: IDocumentService,
        private readonly contentService: IContentService,
    ) {
    }

    public execute(today: Date = new Date()): Thenable<any> {
        return new Promise((resolve, reject) => {
            try {
                const filePath = this.filePath(today);
                this.documentService.exists(filePath)
                    .then(
                    () => this.documentService.open(filePath)
                        .then(resolve, reject),
                    () => this.documentService.create(filePath, this.contentService.content(today))
                        .then(
                        () => this.documentService.open(filePath)
                            .then(resolve, reject),
                        () => this.messageService.showError(`Failed to create ${this.fileName(today)}.`)
                            .then(resolve, reject)),
                    );
            } catch (e) {
                if (e instanceof NoWorkingDirectoryError) {
                    this.messageService.showWarning("Please select working folder before creating note.")
                        .then(resolve, reject);
                } else {
                    this.messageService.showError(e.message)
                        .then(resolve, reject);
                }
            }
        });
    }

    private fileName(date: Date): string {
        return `${dateFormat(date, "yyyymmdd")}.md`;
    }

    private filePath(date: Date): string {
        const workingFolder = this.documentService.workingFolder;
        if (!workingFolder) {
            throw new NoWorkingDirectoryError();
        }
        return path.join(workingFolder, this.fileName(date));
    }
}
