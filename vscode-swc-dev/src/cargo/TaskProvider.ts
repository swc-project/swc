//

import { TaskProvider, CancellationToken, Task, ProcessExecution, workspace, TaskDefinition, window, ProgressLocation, WorkspaceFolder, Uri, Disposable } from "vscode";
import CargoWorkspace from "./Workspace";
import { join, dirname } from "path";
import Package from "./Package";
import { Factory, CachingFactory, IDisposable, dispose } from "../util";
import { Context } from "../util/context";
import { Cargo } from ".";



export default class CargoTaskProvider implements TaskProvider, IDisposable {
    @dispose
    private readonly tasksFactory: CargoTaskFactory = new CargoTaskFactory(this.cargo, this.cargoWorkspace);

    constructor(
        readonly cargo: Factory<Cargo>,
        readonly cargoWorkspace: Factory<CargoWorkspace>
    ) {
    }


    async resolveTask(task: Task, token?: CancellationToken | undefined): Promise<Task | undefined> {
        console.log('resolveTask', task);
        return
    }

    async provideTasks(token?: CancellationToken | undefined): Promise<Task[] | undefined> {
        if (!workspace.workspaceFolders) {
            return
        }


        let promises: Promise<void>[] = [];
        let tasks: Task[] = [];

        for (const ws of workspace.workspaceFolders) {
            const promise = this.tasksFactory.get(Context.root(ws, 'Resolving cargo tasks'))
                .then((ts): void => {
                    tasks.push(...ts);
                });
            promises.push(promise);
        }

        await Promise.all(promises);

        return tasks;

    }

    dispose() { }
}


class CargoTaskFactory extends CachingFactory<Task[]> {
    constructor(
        private readonly cargo: Factory<Cargo>,
        private readonly cargoWorkspace: Factory<CargoWorkspace>,
    ) {
        super([cargo, cargoWorkspace])
    }

    async get_uncached(ctx: Context): Promise<Task[]> {
        const cargo = await this.cargo.get(ctx);
        function makeTask(crate: Package, cmd: string[]): Task {
            const dir = dirname(crate.manifest_path);


            return new Task(
                {
                    type: 'cargo',
                    crate: crate.name,
                    cmd,
                },
                ctx.ws,
                `${cmd.join(' ')} (${crate.name})`,
                `Cargo`,
                new ProcessExecution(cargo.executable,
                    cmd,
                    {
                        cwd: dir,
                    }
                ),
                ['$rustc'],
            );
        }

        const cargoWorkspace = await this.cargoWorkspace.get(ctx);

        const tasks: Task[] = [];

        for (const member of cargoWorkspace.members) {
            if (workspace.getWorkspaceFolder(Uri.file(member.manifest_path)) !== ctx.ws) {
                console.log('Not mine', member.manifest_path, ctx.ws.uri.fsPath);
                continue;
            }
            tasks.push(makeTask(member, ['check']));

            for (const tt of member.targets) {
                const kind = tt.kind[0];
                console.log("Task target kind: ", kind);

                let cmd: string | undefined;
                if (kind === 'bin') {
                    tasks.push(makeTask(member, ['install', '--bin', tt.name]));
                }

                if (kind === 'test') {
                    tasks.push(makeTask(member, ['test', '--test', tt.name]));
                }
            }
        }

        return tasks
    }
}
