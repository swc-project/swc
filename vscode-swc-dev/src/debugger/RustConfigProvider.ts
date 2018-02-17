import {
    DebugConfigurationProvider, Disposable,
    DebugConfiguration, CancellationToken, WorkspaceFolder,
    commands, window, languages, DocumentSelector, extensions, ProgressLocation, debug
} from "vscode";
import * as os from 'os';
import { Factory } from "../util";
import * as JSONStream from 'JSONStream';
import Rustup from "../rustup";
import { BuildOutput } from "../cargo/BuildOutput";
import { sep, join } from "path";
import RustCfg from "../rustc/RustCfg";
import Rustc from "../rustc/rustc";
import CargoWorkspace from "../cargo/Workspace";



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
interface RustDebugConfig extends DebugConfiguration {
    /**
     * true by default
     */
    readonly pretty: boolean;
    readonly crate: string;

    readonly sourceFileMap: { [from: string]: string };

    readonly mode: DebuggerType;

}


async function parseRustDebugConfig(
    ws: WorkspaceFolder,
    rustc: Rustc,
    raw: DebugConfiguration
): Promise<RustDebugConfig> {


    const pretty = raw.pretty !== false;
    delete raw.pretty;

    const crate = await (async () => {
        if (raw.crate) {
            return raw.crate
        }

        return await window.showInputBox({ value: '', placeHolder: 'Crate name' })
    })();
    delete raw.crate;

    const cwd: string = raw.cwd || ws.uri.fsPath;
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

    return {
        ...raw,
        pretty,
        crate,
        sourceFileMap,
        mode,
    }
}





export default class RustConfigProvider implements DebugConfigurationProvider, Disposable {

    constructor(
        private readonly rustc: Factory<Rustc>,
        private readonly rustup: Factory<Rustup>,
    ) {
        // TODO: Move these to cargo

        commands.registerCommand('extension.rustExt.pickCrateName', async (...args) => {
            console.log('extension.rustExt.pickCrateName', ...args)
            return window.showInputBox({ value: '', placeHolder: 'Crate name' })
        });
        commands.registerCommand('extension.rustExt.pickBuildTargets', async (...args) => {
            console.log('extension.rustExt.pickBuildTargets', ...args)
            return window.showInputBox({ value: '', placeHolder: 'Build targets' })
        });


    }

    async resolveDebugConfiguration(
        ws: WorkspaceFolder | undefined,
        debugCfg: DebugConfiguration,
        token?: CancellationToken,
    ): Promise<WrappedConfig> {
        if (!ws) {
            throw new Error('Not supported yet: rust debugger for files without vscode workspace')
        }


        return window.withProgress({
            location: ProgressLocation.Window,
            title: 'launching debugger',
        }, async (progress): Promise<WrappedConfig> => {

            progress.report({ message: 'resolving rustup' });
            const rustup = await this.rustup.get(ws);

            progress.report({ message: 'parsing configuration' });
            const cfg = await parseRustDebugConfig(ws, await this.rustc.get(ws), debugCfg);

            const { crate, sourceFileMap, env } = cfg;

            const extras: string[] = ['-p', crate];

            const mode = await cfg.mode;
            const type = (mode === 'gdb' || mode === 'lldb') ? 'cppdbg' : 'cppvsdbg';




            const executables: string[] = [];
            try {
                progress.report({ message: 'building executable' });
                await new Promise<string[]>((resolve, reject) => {

                    const proc = rustup.run({ cwd: ws.uri.fsPath, timeout: 0 }, [
                        'cargo', 'test', '--no-run', '--message-format=json', ...extras,
                    ])
                        .logWith(cmd => debug.activeDebugConsole.appendLine(cmd))
                        .spawn();

                    proc.stdout
                        .pipe(JSONStream.parse())
                        .on('data', function (data) {
                            const d = <BuildOutput>data;
                            if (d.reason === 'compiler-artifact' && d.target.crate_types[0] === 'bin' && d.target.kind[0] !== 'custom-build') {
                                executables.push(...d.filenames)
                            }
                        });


                    proc.stderr.on('data', (s) => debug.activeDebugConsole.append(s.toString()))

                    proc.once('error', reject)

                    proc.once('exit', () => resolve(executables))
                });

            } catch (e) {
                throw new Error(`Failed to build executable: ${e}`);
            }
            if (executables.length === 0) {
                throw new Error(`cargo build did not produce any executable file. `)
            }
            debug.activeDebugConsole.appendLine(executables.join('\n'));
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


            // Enable pretty printing by default.
            if (cfg.pretty && resolved.type === 'cppdbg') {
                {
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


            }








            console.log('Resolved', debugCfg, 'as', resolved);


            return resolved
        });
    }


    dispose() {
    }
}

