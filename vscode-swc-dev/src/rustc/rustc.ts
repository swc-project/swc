import RustCfg from "./RustCfg";
import { ProcessBuilder, Factory } from "../util";
import { WorkspaceFolder } from "vscode";
import { join } from "path";

export default class Rustc {
    constructor(
        private readonly ws: WorkspaceFolder,
        readonly executable: string,
    ) { }


    get sysroot(): Promise<string> {
        return new ProcessBuilder(this.executable, ['--print=sysroot'], { cwd: this.ws.uri.fsPath })
            .exec({ noStderr: true })
            .then(v => v.replace('\r', '').replace('\n', ''))

    }

    get rustSrcPath(): Promise<string> {
        return this.sysroot.then(v => join(v, 'lib', 'rustlib', 'src', 'rust'))
    }

    get configs(): Promise<RustCfg[]> {
        return new ProcessBuilder(this.executable, ['--print=cfg'], {
            cwd: this.ws.uri.fsPath
        })
            .exec({ noStderr: true })
            .then(v => v.replace('\r', '').split('\n').map(RustCfg.parse));
    }
}

export class RustcResolver extends Factory<Rustc>{
    constructor() {
        super([]);
    }

    /**
     * Resolve path to rustup.
     */
    public async get(ws: WorkspaceFolder): Promise<Rustc> {
        //TODO
        return new Rustc(ws, "rustc")
    }
}