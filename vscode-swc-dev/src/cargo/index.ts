import { Disposable, workspace } from "vscode";
import { Factory, dispose, IDisposable, progress, ProcessBuilder } from "../util";
import Metadata from "./Metadata";
import CargoTaskProvider from "./TaskProvider";
import { Cli } from "../util/cli";
import { Context } from "../util/context";
import { BuildOutput } from "./Build";
import * as JSONStream from 'JSONStream';

/**
 * Extension for cargo.
 */
export default class CargoExt implements IDisposable {
    @dispose
    private disposable: Disposable;

    public constructor(
        private readonly taskProvider: CargoTaskProvider,
    ) {
        const disposables: Disposable[] = [];

        disposables.push(workspace.registerTaskProvider('cargo', taskProvider));

        this.disposable = Disposable.from(...disposables);
    }

    dispose() { }

}

export class Cargo extends Cli {

    @progress('Building executable')
    buildBinary(
        ctx: Context,
        check: boolean,
        flags: string[],
        opts: {
            logWith?: (s: string) => any,
            onStdout: (BuildOutput) => any,
            onStderr: (s: string) => any,
        },
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const base = check ? ['check'] : ['test', '--no-run'];



            const proc = new ProcessBuilder(
                ctx,
                this.executable,
                [
                    ...base, '--message-format=json', ...flags
                ],
                {})
                .logWith(opts.logWith)
                .spawn();


            proc.stdout
                .pipe(JSONStream.parse())
                .on('data', data => opts.onStdout(<BuildOutput>data));


            proc.stderr.on('data', opts.onStderr)

            proc.once('error', reject)

            proc.once('exit', resolve)
        })
    }
}

export class CargoResolver extends Factory<Cargo>{
    constructor() {
        super([]);
    }

    @progress('Resolving cargo')
    public async get(ctx: Context): Promise<Cargo> {
        //TODO
        return new Cargo("cargo")
    }
}