import * as dateFormat from "dateformat";
import * as vscode from "vscode";
import { IContentService } from "./markdown-worker";

export class ContentService implements IContentService {
    public content(date: Date): string {
        return `# ${dateFormat(date, "mmmm d, yyyy - dddd\n\n## ")}`;
    }
}
