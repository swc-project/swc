import RustCfg from "./RustCfg";
import { ProcessBuilder, Factory, progress } from "../util";
import { WorkspaceFolder } from "vscode";
import { join } from "path";
import { Context } from "../util/context";
import { Cli } from "../util/cli";

export default class Rustc extends Cli {
    constructor(
        private readonly ctx: Context,
        executable: string,
    ) { super(executable); }


    get sysroot(): Promise<string> {
        return new ProcessBuilder(this.ctx, this.executable, ['--print=sysroot'], {})
            .exec({ noStderr: true })
            .then(v => v.replace('\r', '').replace('\n', ''))

    }

    get rustSrcPath(): Promise<string> {
        return this.sysroot
            .then(v => join(v, 'lib', 'rustlib', 'src', 'rust'))
    }

    get configs(): Promise<RustCfg[]> {
        return new ProcessBuilder(this.ctx, this.executable, ['--print=cfg'], {})
            .exec({ noStderr: true })
            .then(v => v.replace('\r', '').split('\n').map(RustCfg.parse));
    }
}

export class RustcResolver extends Factory<Rustc>{
    constructor() {
        super([]);
    }

    public async get(ctx: Context): Promise<Rustc> {
        //TODO
        return new Rustc(ctx, "rustc")
    }
}