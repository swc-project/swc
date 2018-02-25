import { Uri, TreeItemCollapsibleState, ExtensionContext, Command, window, workspace, commands } from "vscode";
import Package, { LibraryType } from "../cargo/Package";
import { join } from "path";
import { executeDocumentSymbolProvider, executeLinkProvider, ProcessBuilder, Factory, CachingFactory } from "../util";
import { NodeType } from "./Constants";
import CargoWorkspace from "../cargo/Workspace";
import { Context } from "../util/context";
import { Buildable } from "../cargo/Build";

type Icon = string | Uri | { light: string | Uri; dark: string | Uri } | undefined;


export abstract class Node {
    abstract readonly type: NodeType;

    abstract readonly label: string;
    abstract readonly state: TreeItemCollapsibleState;

    abstract readonly srcPath: string | undefined;

    getIcon(ctx: ExtensionContext): Icon { return };

    abstract readonly children: Node[] | Promise<Node[]>;
}
export abstract class HasChild<C extends Node> extends Node {
    get state() { return TreeItemCollapsibleState.Collapsed }

    abstract readonly children: C[] | Promise<C[]>;
}

abstract class Leaf extends Node {
    get state() { return TreeItemCollapsibleState.None }

    get children(): Node[] { return [] };

}
abstract class SimpleVirtualGroup<C extends Node> extends HasChild<C> {
    readonly srcPath = undefined;

    constructor(readonly children: C[]) {
        super()
    }
}


type CrateChild = Library | Binary | Examples | Benches | Tests | Deps;

/** Member or dependency */
export class Crate extends HasChild<CrateChild> {
    readonly type = NodeType.Crate;
    readonly label = `${this.pkg.name} ${this.pkg.version}`;
    readonly srcPath = undefined;

    private readonly tests: TestFile[] = [];
    private readonly lib: Library | undefined;
    private readonly binaries: Binary[] = [];
    private readonly examples: Example[] = [];
    private readonly benches: BenchFile[] = [];


    constructor(
        private readonly pkg: Package
    ) {
        super();
        for (const target of pkg.targets) {
            const kind = target.kind[0];

            switch (kind) {
                case 'test':
                    this.tests.push(new TestFile(pkg, target.name, target.src_path));
                    break;

                case 'bench':
                    this.benches.push(new BenchFile(pkg, target.name, target.src_path));
                    break;

                case 'proc-macro':
                    this.lib = new Library(pkg, target.src_path)
                    break;

                case 'lib':
                    this.lib = new Library(pkg, target.src_path)
                    break;

                case 'bin':
                    this.binaries.push(new Binary(pkg, target.name, target.src_path));
                    break;

                case 'example':
                    this.examples.push(new Example(pkg, target.name, target.src_path));
                    break;

                case 'custom-build': break;

                default:
                    console.error(`Unknown target kind '${kind}'`, )
            }
        }
    }

    getIcon(ctx: ExtensionContext): Icon {
        return icon(ctx, 'package.svg')
    }

    get children(): CrateChild[] {
        const nodes: CrateChild[] = [];
        if (this.lib) {
            nodes.push(this.lib)
        }
        nodes.push(...this.binaries)

        if (this.examples.length) {
            nodes.push(new Examples(this.pkg, this.examples))
        }

        if (this.tests.length) {
            nodes.push(new Tests(this.pkg, this.tests));
        }

        if (this.benches.length) {
            nodes.push(new Benches(this.pkg, this.benches))
        }




        return nodes;
    }

}


export class Binary extends Leaf implements Buildable {
    readonly type = NodeType.Binary;
    readonly label = `${this.name} (binary)`;

    constructor(
        readonly pkg: Package,
        readonly name: string,
        readonly srcPath: string,
    ) { super() }

    getIcon(ctx: ExtensionContext): Icon { return icon(ctx, 'run.svg') }


    get buildFlags(): string[] { return ['--bin', this.name] }

}

export class Library extends Leaf implements Buildable {

    readonly type = NodeType.Library;

    readonly label = this.pkg.libType == LibraryType.ProcMacro ? 'Macro' : 'Library';

    constructor(
        readonly pkg: Package,
        readonly srcPath: string,
    ) { super() }

    get buildFlags(): string[] { return ['--lib'] }
}

export class Example extends Leaf implements Buildable {
    readonly type = NodeType.Example;

    constructor(
        readonly pkg: Package,
        readonly label: string,
        readonly srcPath: string,
    ) { super() }

    get buildFlags(): string[] { return ['--example', this.label] }
}

abstract class TestFileLike<C extends TestFnLike> extends HasChild<C> {
    constructor(
        readonly pkg: Package,
        readonly label: string,
        readonly srcPath: string,
    ) { super() }

    getIcon(c: ExtensionContext): Icon { return icon(c, 'rust-logo.svg') }





    get children(): Promise<C[]> {
        return (async () => {
            // const { uri } = await workspace.openTextDocument(this.uriToOpen());
            // const symbols = await executeDocumentSymbolProvider(uri);

            // console.log(symbols);


            return []
        })()
    }
}

export class BenchFile extends TestFileLike<BenchFn> implements Buildable {
    readonly type = NodeType.BenchFile;
    get buildFlags(): string[] { return ['--bench', this.label] }
}
/** A file in `tests` directory. */
export class TestFile extends TestFileLike<TestFn> implements Buildable {
    readonly type = NodeType.TestFile;

    get buildFlags(): string[] { return ['--test', this.label] }
}

abstract class TestFnLike extends Leaf { }
/** `#[test] fn foo(){}` */
export class TestFn extends TestFnLike {
    readonly type = NodeType.TestFn;
    readonly srcPath = undefined;

    constructor(readonly label: string) { super() }
}

export class BenchFn extends TestFnLike {
    readonly type = NodeType.BenchFn;
    readonly srcPath = undefined;

    constructor(readonly label: string) { super() }
}


abstract class CrateFiles<C extends Node> extends SimpleVirtualGroup<C> {
    constructor(
        readonly pkg: Package,
        children: C[],
    ) {
        super(children)
    }

}

export class Tests extends CrateFiles<TestFile> implements Buildable {
    readonly type = NodeType.TestFiles;
    readonly label = 'Tests';

    get buildFlags(): string[] { return ['--tests'] }
}

export class Benches extends CrateFiles<BenchFile> implements Buildable {
    readonly type = NodeType.BenchFiles;
    readonly label = 'Benches';

    get buildFlags(): string[] { return ['--benches'] }
}

export class Examples extends CrateFiles<Example> implements Buildable {
    readonly type = NodeType.Examples;
    readonly label = 'Examples';

    get buildFlags(): string[] { return ['--examples'] }
}

export class DepRef extends Leaf {
    readonly type = NodeType.Dep;
    readonly srcPath = undefined;

    constructor(readonly label: string) { super() }

}

export class Deps extends SimpleVirtualGroup<DepRef> {
    readonly type = NodeType.Deps;
    readonly label = 'Dependencies';
    readonly srcPath = undefined;


    children = [];
}

export class Root extends CachingFactory<Node[]> {

    constructor(
        readonly cargoWorkspace: Factory<CargoWorkspace>,
    ) {
        super([cargoWorkspace])
    }

    protected async get_uncached(ctx: Context): Promise<Node[]> {
        //TODO
        const ws = await this.cargoWorkspace.get(ctx);


        const nodes: Node[] = ws.packages.map(p => new Crate(p));



        return nodes;
    }
}


/**
 * 
 * `resource/media/$theme/$name` 
 */
function icon(c: ExtensionContext, name: string): { light: string, dark: string } {
    return {
        light: c.asAbsolutePath(join('resources', 'media', 'light', name)),
        dark: c.asAbsolutePath(join('resources', 'media', 'dark', name)),
    }
}
