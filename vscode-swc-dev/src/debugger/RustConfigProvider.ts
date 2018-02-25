import {
    DebugConfigurationProvider, Disposable,
    DebugConfiguration, CancellationToken, WorkspaceFolder,
    commands, window, languages, DocumentSelector, extensions, ProgressLocation, debug, QuickPickItem
} from "vscode";
import * as os from 'os';
import { Factory, IDisposable, ProcessBuilder } from "../util";
import * as JSONStream from 'JSONStream';
import { BuildOutput, Buildable } from "../cargo/Build";
import { sep, join } from "path";
import RustCfg from "../rustc/RustCfg";
import Rustc from "../rustc/rustc";
import CargoWorkspace from "../cargo/Workspace";
import { Context } from "../util/context";
import { Cargo } from "../cargo";
import * as which from 'which';
import { askBuildFlags, askCrate } from "./Ask";



type DebuggerType = 'msvc' | 'gdb' | 'lldb';

/**
 * types for vscode cpp tools extension.
 */
type CppDebugType = 'cppdbg' | 'cppvsdbg';


interface BaseCfg extends DebugConfiguration {
    readonly type: CppDebugType;

    readonly program: string;
    readonly args: string[];
    readonly cwd: string;
    readonly env: Object;

    readonly sourceFileMap: Object;
    readonly visualizerFile?: string;


    readonly externalConsole: boolean;

}

interface MsvcCfg extends BaseCfg {
    readonly type: 'cppvsdbg';
    readonly symbolSearchPath?: string;
    readonly dumpPath?: string;
}

interface MiDebuggerCfg extends BaseCfg {
    readonly type: 'cppdbg';
    readonly setupCommands: SetupCommand[];
    customLaunchSetupCommands?: SetupCommand[];
    launchCompleteCommand?: 'exec-run' | 'exec-continue' | 'None';
    showDisplayString?: boolean;
    additionalSOLibSearchPath?: string;
    readonly MIMode: 'gdb' | 'lldb';
    miDebuggerPath?: string;
}
interface SetupCommand {
    readonly description: string;
    readonly text: string;
    readonly ignoreFailures: boolean;
}

type WrappedConfig = MsvcCfg | MiDebuggerCfg;
/** Wrapper class for `default behavior`s */
export interface RustDebugConfig extends DebugConfiguration {
    /**
     * true by default
     */
    readonly pretty: boolean;
    readonly noDebug: boolean;
    readonly crate: string;
    readonly buildFlags: string[];

    readonly sourceFileMap: { [from: string]: string };

    readonly mode: DebuggerType;
    readonly MIDebuggerPath?: string;

}


async function parseRustDebugConfig(
    ctx: Context,
    cargoWorkspace: Factory<CargoWorkspace>,
    rustc: Rustc,
    raw: DebugConfiguration
): Promise<RustDebugConfig> {


    const pretty = raw.pretty !== false;
    delete raw.pretty;

    const noDebug = !!raw.noDebug;



    const crate: string = await (async () => {
        if (raw.crate) {
            return raw.crate
        }

        return askCrate(ctx, cargoWorkspace)
    })();
    delete raw.crate;



    const buildFlags: string[] = await (async () => {
        if (raw.buildFlags) {
            return raw.buildFlags
        }
        return askBuildFlags(ctx, cargoWorkspace, crate)
    })();
    delete raw.buildFlags;



    const cwd: string = raw.cwd || ctx.ws.uri.fsPath;
    const env: Object = raw.env || {};





    const sourceFileMap = await (async () => {
        const map: { [from: string]: string } = raw.sourceMap || {};

        if (os.platform() === 'win32') {

            // 'C:\\projects\\rust' is hardcoded in rust lang's windows builder script.
            map['C:\\projects\\rust'] = await rustc.rustSrcPath;

            // TODO: some general way
            map["/c/"] = "C:\\";
        }

        return map
    })();

    const mode = await (async () => {
        // Check for msvc
        if (os.platform() === 'win32') {
            const cfgs = await rustc.configs;
            for (const cfg of cfgs) {
                if (cfg.key === 'target_env' && cfg.value === 'msvc') {
                    return 'msvc'
                }
            }
        }

        switch (raw.MIMode) {
            case 'gdb':
                return 'gdb';
            case 'lldb':
                return 'lldb';
            case undefined:
                return os.platform() === 'darwin' ? 'lldb' : 'gdb';

            default:
                throw new Error(`Unknown MIMode: ${raw.MIMode}`)
        }
    })();

    const miDebuggerPath = await (async (): Promise<string | undefined> => {
        if (!!raw.MIDebuggerPath || noDebug) {
            return raw.MIDebuggerPath
        }

        // mi engine is not used in msvc mode.
        if (mode === 'msvc') { return }

        return new Promise<string | undefined>((resolve, reject) => {
            which(mode, function (err, resolvedPath: string) {
                if (!!err) { return reject(err) }
                console.log(`Resolved ${mode} as ${resolvedPath} `)
                resolve(resolvedPath)
            })
        })
    })();
    delete raw.MIDebuggerPath;

    return {
        ...raw,
        noDebug,
        pretty,
        crate,
        buildFlags,
        sourceFileMap,
        mode,
        MIDebuggerPath: miDebuggerPath,
    }
}





export default class RustConfigProvider implements DebugConfigurationProvider, IDisposable {

    constructor(
        private readonly rustc: Factory<Rustc>,
        private readonly cargo: Factory<Cargo>,
        private readonly cargoWorkspace: Factory<CargoWorkspace>,
    ) {
    }

    async resolveDebugConfiguration(
        ws: WorkspaceFolder | undefined,
        debugCfg: DebugConfiguration,
        token?: CancellationToken,
    ): Promise<WrappedConfig> {
        if (!ws) {
            throw new Error('Not supported yet: rust debugger for files without vscode workspace')
        }
        const msg = debugCfg.noDebug ? 'Launching' : 'Launching debugger';
        return Context.root(ws, msg).runWith(async (ctx): Promise<WrappedConfig> => {
            const cargo = await this.cargo.get(ctx);
            const rustc = await this.rustc.get(ctx);

            const cfg = await ctx.subTask('Parsing configuration', async ctx => parseRustDebugConfig(
                ctx,
                this.cargoWorkspace,
                rustc,
                debugCfg,
            ));


            const { crate, sourceFileMap, env } = cfg;

            const extras: string[] = ['-p', crate];

            const mode = await cfg.mode;
            const type = (mode === 'gdb' || mode === 'lldb') ? 'cppdbg' : 'cppvsdbg';





            const executables: string[] = [];
            try {
                await cargo.buildBinary(
                    ctx,
                    false,
                    [...cfg.buildFlags, '-p', crate],
                    {
                        onStdout(d: BuildOutput) {
                            if (d.reason === 'compiler-artifact' && d.target.crate_types[0] === 'bin' && d.target.kind[0] !== 'custom-build') {
                                executables.push(...d.filenames)
                            }

                        },
                        onStderr(s: string) {
                            debug.activeDebugConsole.append(s)
                        }
                    });
            } catch (e) {
                throw new Error(`Failed to build executable: ${e}`);
            }
            if (executables.length === 0) {
                throw new Error(`cargo build did not produce any executable file. `)
            }

            // Print executable names to debug console.
            debug.activeDebugConsole.appendLine('Built executables:');
            for (const e of executables) {
                debug.activeDebugConsole.appendLine(`\t${e}`);
            }

            if (cfg.noDebug) {
                // TODO
            }



            // Redirect to cpptools.



            if (executables.length !== 1) {
                throw new Error(`cargo build produced too many executable files. Debugging multiple files is not supported yet and\
 built executables are printed on the debug console.`)
            }
            const program = executables[0];


            const base: BaseCfg = {
                ...cfg,

                type,
                request: cfg.request,
                program,
                cwd: ws.uri.fsPath,
                args: cfg.args || [],
                env,
                sourceFileMap,
                externalConsole: cfg.externalConsole,
            };
            const resolved: WrappedConfig = mode === 'msvc' ?
                {
                    ...base,
                    type: 'cppvsdbg',
                }
                :
                {
                    ...base,
                    type: 'cppdbg',
                    MIMode: mode,
                    setupCommands: cfg.setupCommands || [],
                };


            // Enable pretty printing
            if (cfg.pretty && resolved.type === 'cppdbg') {
                // `-enable-pretty-printing`


                // But if user did it already, skip it.
                let has = false;
                for (const sc of resolved.setupCommands) {
                    if (sc && sc.text === '-enable-pretty-printing') {
                        has = true;
                        break;
                    }
                }
                if (!has) {
                    resolved.setupCommands.push({
                        "description": "Enable pretty-printing for gdb",
                        "text": "-enable-pretty-printing",
                        "ignoreFailures": true
                    });
                }


            }








            console.log('Resolved', debugCfg, 'as', resolved);


            return resolved
        })
    }


    dispose() { }
}

