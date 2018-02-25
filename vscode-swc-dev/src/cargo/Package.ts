import { Uri } from "vscode";
import { Dependency } from "./Metadata";


export const enum LibraryType {
    None,
    Normal,
    ProcMacro,
}

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

    readonly targetDir: string;


    readonly targets: TaskTarget[];

    readonly dependencies: Dependency[];

    readonly libType: LibraryType;
    readonly isMember: boolean;

    readonly manifest_dir: string;
}

export interface TaskTarget {
    readonly name: string;
    readonly kind: string[];
    readonly src_path: string;
}
