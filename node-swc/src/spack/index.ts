import { Options } from "../types";

/**
 * Usage: In `spack.config.js` / `spack.config.ts`, you can utilize type annotations (to get autocompletions) like
 * 
 * ```ts
 * import { config } from '@swc/core/spack';
 * 
 * export default config({
 *      name: 'web',
 * });
 * ```
 * 
 * 
 * 
 */
export function config(c: SpackConfig | SpackConfig[]): SpackConfig | SpackConfig[] {
    return c
}

export interface BundleOptions extends SpackConfig {
    workingDir?: string
}

/**
 * `spack.config,js`
 */
export interface SpackConfig {
    /**
     * @default process.env.NODE_ENV
     */
    mode?: Mode

    entry: EntryConfig,

    output: OutputConfig

    module: ModuleConfig

    options?: Options
}

export interface OutputConfig {
    path: string
}


export interface ModuleConfig {

}

export type Mode = 'production' | 'development' | 'none';

export type EntryConfig = string | string[] | {
    [name: string]: string
}

