import { PackageId, PkgTarget } from "./Metadata";
import { Context } from "../util/context";
import { progress } from "../util";
import Package from "./Package";



export interface Buildable {
    /** 
     * - `--bin $name`
     * - `--bins`
     */
    readonly buildFlags: string[];
    readonly pkg: Package;
}


export function isBuildable(node: any): node is Buildable {
    return !!(<Buildable>node).buildFlags && !!(<Buildable>node).pkg
}

export interface BuildProfile {
    readonly debug_assertions: boolean;
    /**
     * Values
     *  - `2`:
     */
    readonly debuginfo: number;
    /** `"0"` */
    readonly opt_level: string;
    readonly overflow_checks: boolean;
    readonly test: boolean;
}

export interface CompilerArtifact {
    readonly package_id: PackageId;
    readonly reason: 'compiler-artifact';


    readonly features: string[];
    /**
     *  Built files.
     */
    readonly filenames: string[];
    readonly fresh: boolean;
    readonly profile: BuildProfile;


    readonly target: PkgTarget;
}

export interface BuildScriptExecuted {
    readonly package_id: PackageId;
    readonly reason: 'build-script-executed';


    readonly cfgs: string[];
    readonly env: string[];
    readonly linked_libs: string[];
    readonly linked_paths: string[];
}

export interface CompilerMessage {
    readonly package_id: PackageId;
    readonly reason: 'compiler-message';
    readonly target: PkgTarget;




    readonly message: Message;


}

export interface Message {
    readonly children: Message[];
    readonly code?: {
        code: string,
        explanation: string | null,
    } | null;


    readonly level: 'note' | string;
    readonly message: string;

    readonly rendered: string | null;
    readonly spans: Span[],
}

export interface Span {
    readonly byte_end: number;
    readonly byte_start: number;
    readonly column_end: number;
    readonly column_start: number;
    // TODO
    readonly expansion: any;
    /** Relative */
    readonly file_name: string;
    readonly is_primary: boolean;
    readonly label: any;
    readonly line_end: number;
    readonly line_start: number;
    readonly suggested_replacement: number;
    readonly text: any[];
}

/**
 * Output from `cargo build --message-format=json`
 * 
 */
export type BuildOutput = CompilerArtifact | BuildScriptExecuted | CompilerMessage;

