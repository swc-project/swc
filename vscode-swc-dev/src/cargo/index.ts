import { Disposable, workspace } from "vscode";
import { Factory } from "../util";
import Metadata from "./Metadata";
import CargoTaskProvider from "./TaskProvider";

/**
 * Extension for cargo.
 */
export default class CargoExt implements Disposable {
    private disposable: Disposable;

    public constructor(
        private readonly taskProvider: CargoTaskProvider,
    ) {
        const disposables: Disposable[] = [];

        disposables.push(workspace.registerTaskProvider('cargo', taskProvider));

        this.disposable = Disposable.from(...disposables);
    }


    dispose() {
        return this.disposable.dispose()
    }
}