import { Factory, isDescendant } from "../util";
import CargoWorkspace from "../cargo/Workspace";
import { Context } from "../util/context";
import { QuickPickItem, window, workspace } from "vscode";
import { Buildable } from "../cargo/Build";
import { PkgTarget } from "../cargo/Metadata";
import Package from "../cargo/Package";
import { relative } from "path";

/**
 * Try to get manifest directory of currently opened file.
 */
async function getCurrentManifestDir(
    ctx: Context,
    cargoWorkspace: Factory<CargoWorkspace>,
): Promise<string | undefined> {
    const editor = window.activeTextEditor;
    if (!editor) {
        return;
    }

    return await cargoWorkspace.get(ctx)
        .then(cargoWs => cargoWs.getManifestDir(editor.document.uri));
}

type CrateQuickPickItem = QuickPickItem & { pkgId: string };

export async function askCrate(
    ctx: Context,
    cargoWorkspace: Factory<CargoWorkspace>,
): Promise<string> {

    const curManifestDir: string | undefined = await getCurrentManifestDir(ctx, cargoWorkspace);

    const items: Promise<CrateQuickPickItem[]> = cargoWorkspace.get(ctx)
        .then(ws => ws.packages
            .filter(pkg => pkg.isMember)
            .sort((l, r) => {
                // If editor is opened, show the current crate first.

                if (curManifestDir) {
                    if (l.manifest_dir === curManifestDir) {
                        return -1;
                    }
                    if (r.manifest_dir === curManifestDir) {
                        return 1;
                    }
                }
                return l.name.localeCompare(r.name)
            })
            .map((pkg): CrateQuickPickItem => {
                const cratePath = relative(ctx.ws.uri.fsPath, pkg.manifest_dir);

                return {
                    label: `${pkg.name} ${pkg.version}`,
                    description: '',
                    detail: cratePath,
                    pkgId: pkg.name,
                }
            })
        );

    const s = await window.showQuickPick(items, {
        matchOnDescription: true,
        matchOnDetail: false,


        placeHolder: `Select crate`,
        ignoreFocusOut: true,
    })


    if (!s) { throw new Error('Crate name is required') }
    return s.pkgId
}

export async function askBuildFlags(
    ctx: Context,
    cargoWorkspace: Factory<CargoWorkspace>,
    crate: string,
): Promise<string[]> {

    const items = cargoWorkspace.get(ctx)
        .then(ws => {
            const pkg = ws.packages.find(pkg => pkg.name === crate);
            if (!pkg) {
                throw new Error(`Unknown crate ${crate}`)
            }

            const items: (QuickPickItem & Buildable)[] = [];

            for (const t of pkg.targets) {
                if (t.kind.length !== 1) {
                    throw new Error(`Unexpected target.kind ${t.kind}`)
                }
                const { kind: [kind] } = t;
                if (kind === 'proc-macro') {
                    continue
                }

                if (kind === 'lib') {
                    items.push({
                        label: `Library`,

                        description: 'Run tests in library file',
                        detail: 'cargo test --lib',
                        pkg,
                        get buildFlags(): string[] {
                            return ['--lib']
                        }

                    });
                    items.push({
                        label: `Library (doc)`,

                        description: 'Run doc-tests',
                        detail: 'cargo test --doc',
                        pkg,
                        get buildFlags(): string[] {
                            return ['--doc']
                        }

                    });
                } else if (kind === 'bin') {
                    items.push({
                        label: `${t.name} (binary)`,

                        description: '',
                        detail: `cargo run --bin `,

                        pkg,
                        get buildFlags(): string[] {
                            return ['--bin', t.name]
                        }

                    })
                } else if (kind === 'test') {
                    items.push({
                        label: `${t.name} (test)`,

                        description: '',

                        pkg,
                        get buildFlags(): string[] {
                            return ['--test', t.name]
                        }

                    })
                } else if (kind === 'example') {
                    items.push({
                        label: `${t.name} (example)`,

                        description: '',

                        pkg,
                        get buildFlags(): string[] {
                            return ['--example', t.name]
                        }

                    })
                } else {
                    items.push({
                        label: `${t.name} (unknown kind '${kind}')`,

                        description: '',

                        pkg,
                        get buildFlags(): string[] {
                            throw new Error(`Cannot build an executable from unknown kind '${kind}'`)
                        }

                    })
                }

            }

            return items
        });



    const s = await window.showQuickPick(items, {

        matchOnDescription: true,
        matchOnDetail: false,


        placeHolder: `Crate: ${crate}`,
        ignoreFocusOut: true,
    });
    if (!s) { return [] }
    return s.buildFlags
}

