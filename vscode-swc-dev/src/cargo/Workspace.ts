import { WorkspaceFolder, Uri, workspace } from "vscode";
import { join, dirname } from "path";
import Package, { LibraryType } from "./Package";
import Metadata, { parsePkgId, PackageId, PackageMetadata } from "./Metadata";
import { Factory, isDescendant, CachingFactory, profile, progress } from "../util";
import { Context } from "../util/context";


export default class CargoWorkspace {
    constructor(
        readonly wsRoot: string | undefined,
        readonly targetDir: string,
        readonly members: Package[],
        readonly packages: Package[],
    ) {
        if (members === undefined) {
            throw new Error('Assertion failed: CargoWorkspace.members !== undefined')
        }

    }

    public getManifestDir(uri: Uri): string | undefined {
        let candidate: string = '';

        for (const m of this.members) {
            if (candidate.length >= m.manifest_dir.length) {
                continue
            }

            const dir = m.manifest_dir;
            if (!isDescendant(dir, uri.fsPath)) {
                continue
            }

            candidate = m.manifest_dir
        }

        // 
        if (candidate.length === 0) { return }

        return candidate
    }





}

export class CargoWorkspaceFactory extends CachingFactory<CargoWorkspace> {
    constructor(
        private readonly metadata: Factory<Metadata>,
    ) { super([metadata]) }

    /**
     * Run `cargo metadata`
     */
    @profile('CargoWorkspaceFactory.get_uncached')
    @progress('Parsing cargo workspace')
    async get_uncached(ctx: Context): Promise<CargoWorkspace> {
        const data = await this.metadata.get(ctx);

        const packages = data.packages.map(p => intoPackage(data.target_directory, p));


        const members = data.workspace_members
            .sort()
            .map(parsePkgId)
            .map(({ id }): Package => {
                for (const p of packages) {
                    if (p.name === id) {
                        p.isMember = true;
                        return p;
                    }
                }
                throw new Error(`'cargo metadata' says that an unknown package (${id}) is a member of the current workspace`);
            });


        return new CargoWorkspace(data.workspace_root, data.target_directory, members, packages.sort((l, r) => {
            if (l.isMember === r.isMember) { return l.name.localeCompare(r.name) }


            return r.isMember ? 1 : 0 - (l.isMember ? 1 : 0)
        }));
    }
}

function intoPackage(targetDir: string, p: PackageMetadata): PackageMetadata & {
    manifest_dir: string,
    isMember: boolean,
    libType: LibraryType,
    targetDir: string,
} {
    let libType = LibraryType.None;
    for (const t of p.targets) {
        if (t.kind.length !== 1) {
            throw new Error(`Unexpected target.kind: ${t.kind} found from crate ${p.name}`)
        }

        const { kind: [kind] } = t;

        if (kind === 'lib') {
            libType = LibraryType.Normal;
            break;
        } else if (kind === 'proc-macro') {
            libType = LibraryType.ProcMacro;
            break;
        }
    }


    return {
        ...p,
        manifest_dir: dirname(p.manifest_path),
        isMember: false,
        libType,
        targetDir,
    };
}