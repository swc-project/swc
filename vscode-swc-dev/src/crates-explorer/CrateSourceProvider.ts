import { IDisposable, dispose, readFile } from '../util';
import { TextDocumentContentProvider, EventEmitter, Uri, CancellationToken } from 'vscode';
import { open } from 'fs';



export class CrateSourceProvider implements TextDocumentContentProvider, IDisposable {
    static SCHEME = 'cargo-src';


    @dispose
    private readonly _onDidChange: EventEmitter<Uri> = new EventEmitter();
    readonly onDidChange = this._onDidChange.event;

    async provideTextDocumentContent(uri: Uri, token: CancellationToken): Promise<string | null> {
        return readFile(uri.with({ scheme: 'file' }).fsPath)
    }
    dispose() { }
}