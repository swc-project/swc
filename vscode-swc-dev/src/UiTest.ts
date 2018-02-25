import {
    TextDocumentContentProvider, Event, Uri, Diagnostic,
    CancellationToken, workspace, commands, TextDocument,
    OutputChannel, window, EventEmitter, Disposable, TextEdit, Range, languages, DiagnosticCollection, DiagnosticSeverity, DocumentLinkProvider, DocumentLink
} from "vscode";
import * as path from 'path';
import * as fs from 'fs';
import { Stats } from "fs";
import { Factory, isDescendant, exists, readFile, rename, clock, profile } from "./util";
import CargoWorkspace from "./cargo/Workspace";
import { Context } from "./util/context";


export const SCHEME: string = 'rust-ui-test-output';
export const LANG: string = SCHEME;

export default class UiTest implements Disposable {
    private readonly diagnostics: DiagnosticCollection;

    constructor(
        private readonly cargoWorkspace: Factory<CargoWorkspace>,
    ) {
        this.diagnostics = languages.createDiagnosticCollection('swc-ui-test');




        const disposables: Disposable[] = [];

        const self = this;
        disposables.push(languages.registerDocumentLinkProvider(LANG, (() => {

            class FileLinkProvider implements DocumentLinkProvider {
                async provideDocumentLinks(doc: TextDocument, token: CancellationToken): Promise<DocumentLink[] | undefined> {
                    const links: DocumentLink[] = [];
                    const dir = await self.getManifestDir(doc.uri);
                    if (!dir) { return }


                    for (let i = 0; i < doc.lineCount; i++) {
                        const line = doc.lineAt(i);
                        if (line.text.startsWith(' --> $DIR')) {
                            const idx = line.text.indexOf(':');
                            const p = line.text.slice(' --> $DIR'.length, idx);

                            links.push(new DocumentLink(line.range, Uri.file(path.join(dir, p))))
                            continue
                        }
                    }

                    return links
                }
            }
            return new FileLinkProvider()
        })()));


        workspace.findFiles('**/target/ui/**/*.stderr').then((files) => {
            for (const f of files) {
                this.diagnostics.set(f, [new Diagnostic(new Range(0, 0, 0, 0), 'Assertion failed: output is changed', DiagnosticSeverity.Error)]);
            }

        })


        disposables.push(commands.registerTextEditorCommand('swc.dev.uiTest.update', async (editor) => {
            // The code you place here will be executed every time your command is executed
            if (editor.document.languageId !== LANG) {
                return window.showErrorMessage("This command only works for output file of ui tests");
            }

            try {
                await this.updateReference(editor.document)
            } catch (e) {
                window.showErrorMessage(`Failed to update reference file: ${e}`)
            }
        }));



        disposables.push(window.onDidChangeActiveTextEditor(async (e) => {
            if (!e) { return }
            try {
                await this.openDiffIfRequried(e.document)
            } catch (err) {
                window.showErrorMessage(`failed to open diff: ${err}`)
            }
        }));

        disposables.push(workspace.registerTextDocumentContentProvider(SCHEME, new ContentProvider()));
    }

    private async updateReference(doc: TextDocument): Promise<void> {
        console.log(`Updating reference for ${doc.uri.fsPath}`)

        const { golden, actual } = await this.resolve(doc.uri.with({ scheme: 'file' }));

        await commands.executeCommand('workbench.action.closeActiveEditor');
        if (await exists(actual)) {
            this.diagnostics.delete(Uri.file(actual));
            console.log(`Renaming: ${actual} -> ${golden}`)
            await rename(actual, golden);
        }
    }

    @profile('UiTest.getManifestDir')
    private async getManifestDir(uri: Uri): Promise<string | void> {
        let ws = workspace.getWorkspaceFolder(uri);
        if (!ws) {
            console.log(`vscode workspace not found for ${uri}`)
            // Ctrl + O -> Click .stderr file
            return;
        }


        const cargoWorkspace = await this.cargoWorkspace.get(Context.root(ws, 'Fetching cargo workspace'));


        const dir = cargoWorkspace.getManifestDir(uri);
        return dir;
    }


    public async openDiffIfRequried(e: TextDocument): Promise<void> {
        // We have nothing to do with this.
        if (e.languageId !== LANG || e.uri.scheme !== 'file') {
            return;
        }
        const { actual, golden } = await this.resolve(e.uri);

        if (await exists(actual)) {
            this.diagnostics.set(Uri.file(actual), [new Diagnostic(new Range(0, 0, 0, 0), 'Assertion failed: output is changed', DiagnosticSeverity.Error)]);

            await commands.executeCommand(
                "vscode.diff",
                Uri.file(golden).with({ scheme: SCHEME }),
                Uri.file(actual).with({ scheme: SCHEME }),
                'Error message changed'
            );

        } else {
            // Open as read-only, because it should not be modified by hand.

            this.diagnostics.delete(Uri.file(actual));

            // await commands.executeCommand("vscode.open", Uri.file(golden).with({ scheme: SCHEME }));
            // await window.setStatusBarMessage("swc: Opened as read-only");
        }
    }

    @profile('UiTest.resolve')
    private async resolve(uri: Uri): Promise<{ actual: string, golden: string, isGolden: boolean }> {
        const manifestDir = await this.getManifestDir(uri);
        if (manifestDir === undefined) {
            throw new Error(`Cannot determine cargo manifest directory for ${uri.fsPath}`)
        }

        /**
         *   Relative path from workspace root. This might contain `target/ui`.
         */
        let relPath = path.relative(manifestDir, uri.fsPath);

        let isGolden = !relPath.startsWith(path.join('target', 'ui'));

        if (isGolden) {
            return {
                isGolden,
                actual: path.join(manifestDir, 'target', 'ui', relPath),
                golden: uri.fsPath,
            };

        } else {
            const goldenRelPath = path.relative(path.join('target', 'ui'), relPath);
            const golden = path.join(manifestDir, goldenRelPath);
            return {
                isGolden,
                actual: uri.fsPath,
                golden,
            };
        }
    }

    dispose() { }
}

export class ContentProvider implements TextDocumentContentProvider {
    _onDidChange: EventEmitter<Uri>;
    output: OutputChannel;
    constructor() {
        this._onDidChange = new EventEmitter();
        this.output = window.createOutputChannel('Swc ui test - ContentProvider');
    }

    get onDidChange(): Event<Uri> { return this._onDidChange.event }

    async provideTextDocumentContent(uri: Uri, token: CancellationToken): Promise<string> {
        uri = uri.with({ scheme: 'file' });
        // TODO
        let ws = workspace.getWorkspaceFolder(uri);
        if (!ws) {
            // Default to file:// style uri.
            return readFile(uri.fsPath);
        }


        const relPath = path.relative(ws.uri.fsPath, uri.fsPath);
        const isActual = relPath.startsWith(path.join('target', 'ui'));

        let filePath = path.join(ws.uri.fsPath, relPath);
        this.output.append(`\nOpening ${uri.fsPath}`);
        try {
            let content = await readFile(filePath);
            return content;
        } catch (e) {
            // If output file does not exist, show golden reference file instead.
            if (isActual) {
                const goldenRelPath = path.relative(path.join('target', 'ui'), relPath);
                const goldenFullPath = path.join(ws.uri.fsPath, goldenRelPath);
                this.output.append(`\nFalling back to golden file at ${goldenRelPath}`);
                return readOrEmptyStr(goldenFullPath)
            }

            this.output.append(`\nReturning empty content because we failed to read file: ${e}`);
            return ''
        }
    }

}

async function readOrEmptyStr(path: string): Promise<string> {
    try {
        let content = await readFile(path);
        return content;
    } catch (e) {
        return ''
    }
}