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


export default class CargoConfigProvider implements DebugConfigurationProvider, Disposable {

    constructor(
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
        c: DebugConfiguration,
        token?: CancellationToken,
    ): Promise<DebugConfiguration> {
        if (!ws) {
            throw new Error('Not supported yet: rust debugger for files without vscode workspace')
        }


        return window.withProgress({
            location: ProgressLocation.Window,
            title: 'launching debugger',
        }, async (progress): Promise<DebugConfiguration> => {
            const extras: string[] = [];

            if (c.crate) {
                extras.push(`-p`, `${c.crate}`)
            }
            if (!c.env) { c.env = {} }
            if (!c.sourceFileMap) { c.sourceFileMap = {} }
            if (!c.setupCommand) { c.setupCommand = {} }


            const executables: string[] = [];
            try {
                progress.report({ message: 'building executable' });
                const rustup = await this.rustup.get(ws);
                debug.activeDebugConsole.appendLine(`${rustup.executable} run ${rustup.toolchain} cargo test --no-run --message-format=json ${extras.join(' ')}`);

                await new Promise<string[]>((resolve, reject) => {

                    const proc = rustup.run({ cwd: ws.uri.fsPath, timeout: 0 }, [
                        'cargo', 'test', '--no-run', '--message-format=json', ...extras,
                    ]).spawn();

                    proc.stdout.pipe(JSONStream.parse()).on('data', function (data) {
                        const d = <BuildOutput>data;
                        if (d.reason === 'compiler-artifact' && d.target.crate_types[0] === 'bin' && d.target.kind[0] !== 'custom-build') {
                            executables.push(...d.filenames)
                        }
                    });


                    proc.stderr.on('data', (s) => { debug.activeDebugConsole.append(s.toString()) })

                    proc.once('error', reject)

                    proc.once('exit', () => {
                        resolve(executables)
                    })
                });

            } catch (e) {
                throw new Error(`Failed to build executable: ${e}`);
            }
            if (executables.length === 0) {
                throw new Error(`cargo build did not produce any executable file`)
            }
            debug.activeDebugConsole.appendLine(executables.join('\n'));
            if (executables.length !== 1) {
                throw new Error(`cargo build produced too many executable files. This is not supported yet and\
 built executables are printed on the debug console.`)
            }
            //TODO
            c.program = executables[0];


            // Enable pretty printing by default.
            if (c.pretty !== false) {
                c.setupCommand.push({
                    "description": "Enable pretty-printing for gdb",
                    "text": "-enable-pretty-printing",
                    "ignoreFailures": true
                });
            }


            //TODO: Use cppvsdbg for msvc toolchains
            c.type = 'cppdbg';

            // TODO: Use lldb for mac os
            c.MIMode = "gdb";




            if (os.platform() === 'win32') {
                // 
                const rustup = await this.rustup.get(ws);
                const rustSysroot = (await rustup.run({ cwd: ws.uri.fsPath }, ['rustc', '--print', 'sysroot']).exec())
                    .stdout.replace('\r', '').replace('\n', '');
                const rustSrcPath = join(rustSysroot, 'lib', 'rustlib', 'src', 'rust');


                c.sourceFileMap['C:\\projects\\rust'] = rustSrcPath;

                // TODO: Need some general way
                c.sourceFileMap["/c/"] = "C:\\";
            }


            return c
        });
    }


    dispose() {
    }
}
