import { Uri, WorkspaceFolder, Disposable, window, workspace } from "vscode";
import Rustup from "../rustup";
import { Factory, CachingFactory } from "../util";

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
    private readonly disposable: Disposable;

    constructor(
        private readonly rustup: Factory<Rustup>,
    ) {
        super([rustup]);

        const disposables: Disposable[] = [];

        const watcher = workspace.createFileSystemWatcher('**/Cargo.{lock,toml}');
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


    /**
     * Run `cargo metadata`
     */
    async get_uncached(ws: WorkspaceFolder): Promise<Metadata> {
        let rustup = await this.rustup.get(ws);

        let { stdout, stderr } = await rustup.run({ cwd: ws.uri.fsPath, }, 'cargo', 'metadata', '--no-deps', '--format-version', '1');



        if (stderr) {
            throw new Error(`cargo metadata printed something on stderr: ${stderr}\nstdout: ${stdout}`)
        }
        console.log(`'cargo metadata'  was successful`);
        return <Metadata>JSON.parse(stdout);
    }
    dispose() {
        this.disposable.dispose()
        return super.dispose();
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
     * e.g. `["lib"]`, `["example"]`, `["test"]`, `["bench"]`, `["proc-macro"]`
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