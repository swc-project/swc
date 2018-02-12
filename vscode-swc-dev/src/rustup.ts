import { ProcessExecution, workspace, window } from "vscode";
import { execFile } from "child_process";
import { Factory } from "./util";

export interface RunOpts {
    readonly cwd: string;
    readonly env?: Map<string, string>;
    readonly timeout?: number;
}

/**
 * Resolved rustup.
 */
export default class Rustup {
    constructor(
        readonly executable: string,
        readonly toolchain: string
    ) {
    }


    /**
     * Invoke `rustup run`
     */
    public run(opts: RunOpts, ...cmd: string[]): Promise<{ stdout: string, stderr: string }> {
        return new Promise((resolve, reject) => {
            execFile(this.executable, ['run', this.toolchain, ...cmd,], {
                encoding: 'utf8',
                timeout: opts.timeout || 10000,
                env: opts.env,
                cwd: opts.cwd,
            }, (err, stdout: string, stderr: string): void => {
                if (!!err) {
                    console.log('`rustup run` failed', err, 'Stdout:\n', stdout, 'Stderr:\n', stderr);
                    return reject(err)
                }


                resolve({ stdout, stderr })
            })
        })

    }
}

export class RustupResolver extends Factory<Rustup>{
    constructor() {
        super([]);
    }

    /**
     * Resolve path to rustup.
     */
    public async get(): Promise<Rustup> {
        //TODO
        return new Rustup("rustup", "nightly")
    }
}