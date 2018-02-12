import Rustup from "../rustup";
import { WorkspaceFolder, Uri, workspace } from "vscode";
import { join, dirname } from "path";
import Package from "./Package";
import Metadata, { parsePkgId, PackageId, PackageMetadata } from "./Metadata";
import { Factory, isDescendant, CachingFactory, profile } from "../util";


export default class CargoWorkspace {
    constructor(
        readonly wsRoot: string | undefined,
        readonly targetDir: string,
        readonly members: Package[],
    ) { }

    public getManifestDir(uri: Uri): string | void {
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
    async get_uncached(ws: WorkspaceFolder): Promise<CargoWorkspace> {
        const data = await this.metadata.get(ws);
        const members = data.workspace_members
            .map(parsePkgId)
            .map(({ id }): Package => {
                // console.log(`Reading cargo package info about member ${id}`);
                let pkg: PackageMetadata & { manifest_dir: string } | undefined;
                for (const p of data.packages) {
                    if (p.name === id) {
                        pkg = {
                            manifest_dir: dirname(p.manifest_path),
                            ...p
                        };
                        break;
                    }
                }
                if (!pkg) {
                    throw new Error(`'cargo metadata' says that an unknown package (${id}) is a member of the current workspace`);
                }
                return pkg
            });

        return new CargoWorkspace(data.workspace_root, data.target_directory, members);
    }
}