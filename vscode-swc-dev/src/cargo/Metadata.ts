import { Uri, WorkspaceFolder, Disposable, window, workspace } from "vscode";
import { Factory, CachingFactory, setContext, dispose, progress, ProcessBuilder } from "../util";
import { Context } from "../util/context";
import { Cargo } from ".";

/**
 * Output of `cargo metadata --format-version 1`
 */
export default interface Metadata {
    readonly workspace_root: string | undefined;
    readonly target_directory: string;
    readonly packages: PackageMetadata[];
    readonly workspace_members: PackageId[];
    readonly resolve: Resolve;
}

export class MetadataFactory extends CachingFactory<Metadata> {
    @dispose
    private readonly disposable: Disposable;

    constructor(
        private readonly cargo: Factory<Cargo>,
    ) {
        super([cargo]);

        const disposables: Disposable[] = [];

        const watcher = workspace.createFileSystemWatcher('**/Cargo.lock');
        disposables.push(watcher);

        watcher.onDidCreate(this.invalidateFor, this, disposables);
        watcher.onDidChange(this.invalidateFor, this, disposables);
        watcher.onDidDelete(this.invalidateFor, this, disposables);

        this.disposable = Disposable.from(...disposables);
    }

    private invalidateFor(uri: Uri) {
        const ws = workspace.getWorkspaceFolder(uri);
        if (ws) {
            this.notifyChange(ws)
        }
    }


    async get(ctx: Context): Promise<Metadata> {
        return this.get_uncached(ctx)
    }
    /**
     * Run `cargo metadata`
     */
    @progress('Running cargo metadata')
    async get_uncached(ctx: Context): Promise<Metadata> {
        const cargo = await this.cargo.get(ctx);

        let stdout;
        try {
            stdout = await new ProcessBuilder(
                ctx,
                cargo.executable,
                ['metadata', '--format-version', '1'],
                {}
            ).exec({ noStderr: true })


            await setContext('validCargoMetadata', true);
        } catch (e) {
            await setContext('validCargoMetadata', false);
            throw e
        }

        console.log(`'cargo metadata'  was successful`);
        return <Metadata>JSON.parse(stdout);
    }
}


export interface Resolve {
    /**
     * Current package.
     */
    readonly root: PackageId;

    readonly nodes: ResolvedNode[];
}

export interface ResolvedNode {
    readonly id: PackageId;
    readonly dependencies: PackageId[];
}

/**
 * Space separated package id like `swc_macros_common 0.1.0 (path+file:///mnt/c/Users/kdy/Documents/projects/swc/macros/common)`;
 */
export type PackageId = string;

export function parsePkgId(pkgId: PackageId): {
    readonly id: string,
    readonly version: string,
    readonly path: string,
} {
    let ss = pkgId.split(' ', 3);
    if (ss.length !== 3) {
        throw new Error(`Cannot parse '${pkgId}' as a cargo package because it's length is ${ss.length} when splited by a space`);
    }

    // Remove surrounding paren
    let replaced = ss[2].substr(1, ss[2].length - 2)
        .replace('path+file', 'file')
        .replace('registry+http', 'https');

    try {
        let path = Uri.parse(replaced);
        return { id: ss[0], version: ss[1], path: path.fsPath }
    } catch (e) {
        throw new Error(`failed to parse ${replaced} as a uri: ${e}`)
    }

}

/**
 * e.g. `registry+https://github.com/rust-lang/crates.io-index`
 */
export type Source = string | undefined;

export interface PackageMetadata {
    readonly name: string;
    /**
     * Semver
     */
    readonly version: string;
    readonly id: PackageId;
    readonly license: string | undefined;
    readonly license_file: string | undefined;
    readonly description: string | undefined;
    readonly source: Source;

    readonly dependencies: Dependency[];

    readonly targets: PkgTarget[];

    readonly features: Features;

    readonly manifest_path: string;
}

export interface Features {
    /**
     * Feature names.
     */
    readonly default: string[];
    /**
     * e.g. `"nested-values": ["erased-serde"],`
     */
    readonly [feature: string]: string[];
}

export interface PkgTarget {
    /**
     * e.g. `["lib"]`, `["example"]`, `["test"]`, `["bench"]`, `["proc-macro"]`, `["custom-build"]`
     */
    readonly kind: string[];
    /**
     * e.g. `["lib"]`, `["bin"]`, `["proc-macro"]`
     */
    readonly crate_types: string[];
    readonly name: string;
    /**
     * Absolute path to main rust file.
     * 
     * e.g. `/mnt/c/Users/kdy/Documents/projects/swc/macros/common/src/lib.rs` 
     */
    readonly src_path: string;
}

export interface Dependency {
    readonly name: string;
    readonly source: Source;
    /**
     * Semver match rule.
     * 
     * e.g. `*`, `^1`
     */
    readonly req: string;
    /**
     *  - `null` for normal dependencies.
     *  - `dev` for dev dependencies.
     * 
     * 
     */
    readonly kind: string | undefined;
    readonly optional: boolean;
    readonly uses_default_features: boolean;
    readonly features: string[];
    /**
     * e.g. `null`, `cfg(target_os = \"redox\")`, `cfg(windows)`
     */
    readonly target: string | undefined;
}