import { Factory, dispose, IDisposable, ProcessBuilder } from "../util";
import { TreeDataProvider, TreeItem, EventEmitter, workspace, ExtensionContext, commands, window, Uri, Disposable, debug } from "vscode";
import { Node, Crate, Root } from "./Node";
import CargoWorkspace from "../cargo/Workspace";
import { CrateSourceProvider } from "./CrateSourceProvider";
import { RunCommand, DebugCommand } from "./Constants";
import { Context } from "../util/context";
import { Cargo } from "../cargo";
import { BuildOutput, isBuildable } from "../cargo/Build";
import RustConfigProvider, { RustDebugConfig } from "../debugger/RustConfigProvider";


export default class CratesExplorer implements TreeDataProvider<Node>, IDisposable {
    public static readonly ID = 'cratesExplorer';


    @dispose
    private readonly _onDidChangeTreeData: EventEmitter<Node | undefined> = new EventEmitter();
    public readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

    @dispose
    private readonly crateSourceProvider: CrateSourceProvider = new CrateSourceProvider();

    @dispose
    private readonly rootNode = new Root(this.cargoWorkspace);

    public constructor(
        private readonly ctx: ExtensionContext,
        private readonly cargo: Factory<Cargo>,
        private readonly cargoWorkspace: Factory<CargoWorkspace>,
        private readonly debugConfigProvider: RustConfigProvider,
    ) {
        workspace.registerTextDocumentContentProvider(CrateSourceProvider.SCHEME, this.crateSourceProvider);

        commands.registerCommand(RunCommand, (arg) => this.run(true, arg));
        commands.registerCommand(DebugCommand, (arg) => this.run(false, arg));


    }

    private async run(noDebug: boolean, arg: any) {
        if (!(arg instanceof Node)) {
            throw new Error(`${arg} is not a crates explorer node.`)
        }

        console.log('run', arg);
        if (!isBuildable(arg)) {
            window.showErrorMessage(`Invalid build target: ${arg.type} (${arg.label})`);
            throw new Error(`Invalid build target: ${JSON.stringify(arg)}`);
        }


        const flags = arg.buildFlags;
        const firstWs = workspace.workspaceFolders && workspace.workspaceFolders[0];
        if (!firstWs) {
            throw new Error('crate explorer: no vscode workspace.')
        }
        const ctx = Context.root(firstWs, 'Crates explorer');

        try {
            await debug.startDebugging(ctx.ws, {
                name: `${arg.type}: ${arg.label}`,
                type: 'rust',
                request: 'launch',
                noDebug,
                cwd: ctx.ws.uri.fsPath,
                crate: arg.pkg.name,
                buildFlags: arg.buildFlags,
            });

        } catch (e) {
            window.showErrorMessage(e.message);
        }
    }



    public getTreeItem(e: Node): TreeItem {
        const srcPath = e.srcPath;
        let uriToOpen = srcPath ? Uri.file(srcPath) : undefined;

        // Open crates.io dependencies as read only.
        if (uriToOpen && !workspace.getWorkspaceFolder(uriToOpen)) {
            uriToOpen = uriToOpen.with({ scheme: CrateSourceProvider.SCHEME })
        }




        return {
            contextValue: e.type.toString(),
            collapsibleState: e.state,

            iconPath: e.getIcon(this.ctx),
            label: e.label,

            command: uriToOpen ? {
                title: 'Open',
                tooltip: 'Open file',
                command: 'vscode.open',
                arguments: [uriToOpen],
            } : undefined,
        }
    }
    public async getChildren(element?: Node): Promise<Node[]> {
        const firstWs = workspace.workspaceFolders && workspace.workspaceFolders[0];
        if (!firstWs) {
            throw new Error('crate explorer: no vscode workspace.')
        }


        if (!element) {
            return this.rootNode.get(Context.root(firstWs, 'Crates explorer'));
        }

        return element.children
    }


    dispose() { }

}