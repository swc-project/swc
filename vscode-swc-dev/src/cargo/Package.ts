import { Uri } from "vscode";


/**
 * Crate
 */
export default interface Package {
    readonly name: string,
    /**
    * Semver
    */
    readonly version: string,
    readonly manifest_path: string,

    readonly targets: TaskTarget[];

    readonly manifest_dir: string;
}

export interface TaskTarget {
    readonly name: string;
    readonly kind: string[];
    readonly src_path: string;
}