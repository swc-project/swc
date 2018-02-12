//

import { TaskProvider, CancellationToken, Task, ProcessExecution, workspace, TaskDefinition, window, ProgressLocation, WorkspaceFolder, Uri } from "vscode";
import Rustup from "../rustup";
import CargoWorkspace from "./Workspace";
import { join, dirname } from "path";
import Package from "./Package";
import { Factory, CachingFactory } from "../util";



export default class CargoTaskProvider implements TaskProvider {
    private readonly tasksFactory: CargoTaskFactory;

    constructor(
        readonly rustup: Factory<Rustup>,
        readonly cargoWorkspace: Factory<CargoWorkspace>
    ) {
        this.tasksFactory = new CargoTaskFactory(rustup, cargoWorkspace)

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
            const promise = this.tasksFactory.get(ws).then((ts): void => {
                tasks.push(...ts);
            });
            promises.push(promise);
        }

        await Promise.all(promises);

        return tasks;

    }
}


class CargoTaskFactory extends CachingFactory<Task[]> {
    constructor(
        private readonly rustup: Factory<Rustup>,
        private readonly cargoWorkspace: Factory<CargoWorkspace>,
    ) {
        super([rustup, cargoWorkspace])
    }

    async get_uncached(ws: WorkspaceFolder): Promise<Task[]> {
        let rustup = await this.rustup.get(ws);
        function makeTask(crate: Package, cmd: string[]): Task {
            const dir = dirname(crate.manifest_path);


            return new Task(
                {
                    type: 'cargo',
                    crate: crate.name,
                    cmd,
                },
                ws,
                `${cmd.join(' ')} (${crate.name})`,
                `Cargo`,
                new ProcessExecution(rustup.executable,
                    [
                        'run', rustup.toolchain,
                        'cargo',
                        ...cmd,
                    ],
                    {
                        cwd: dir,
                    }
                ),
                ['$rustc'],
            );
        }

        const cargoWorkspace = await this.cargoWorkspace.get(ws);

        const tasks: Task[] = [];

        for (const member of cargoWorkspace.members) {
            if (workspace.getWorkspaceFolder(Uri.file(member.manifest_path)) !== ws) {
                console.log('Not mine', member.manifest_path, ws.uri.fsPath);
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
