import { PackageId, PkgTarget } from "./Metadata";



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

export type BuildOutput = CompilerArtifact | BuildScriptExecuted;

