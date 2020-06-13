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
}

export interface OutputConfig {
    path: string
}


export interface ModuleConfig {

}

export type Mode = 'production' | 'development' | 'none';

export interface BundleOptions {
    entry: EntryConfig,
    workingDir?: string
    options?: Options
}

export type EntryConfig = string | string[] | {
    [name: string]: string
}

