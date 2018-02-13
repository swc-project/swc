import { ProcessExecution, workspace, window, WorkspaceFolder } from "vscode";
import { execFile, ChildProcess, spawn } from "child_process";
import { Factory, ProcessOptions, ProcessBuilder } from "./util";


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
    public run(opts: ProcessOptions, cmd: string[]): ProcessBuilder {
        const timeout = opts.timeout === undefined ? 10000 : opts.timeout;

        return new ProcessBuilder(this.executable, ['run', this.toolchain, ...cmd], opts)
    }
}

export class RustupResolver extends Factory<Rustup>{
    constructor() {
        super([]);
    }

    /**
     * Resolve path to rustup.
     */
    public async get(ws: WorkspaceFolder): Promise<Rustup> {
        //TODO
        return new Rustup("rustup", "nightly")
    }
}