import { Options } from "../types";
import * as path from 'path';

export type BundleInput = BundleOptions | BundleOptions[];

export async function compileBundleOptions(c: BundleInput | string | undefined): Promise<BundleInput> {
    const f = c === undefined ? '.' : c;

    try {
        const file = typeof f === 'string' ? f : path.resolve('spack.config.js');
        let configFromFile = require(file);
        if (configFromFile.default) {
            configFromFile = configFromFile.default;
        }
        return Object.assign({}, configFromFile, c);
    } catch (e) {
        console.log(e);
        if (typeof f === 'string') {
            throw new Error(`Config file does not exist at ${c}`)
        }
        return f;
    }
}

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
export function config(c: BundleInput): BundleInput {
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
    name: string
    path: string
}


export interface ModuleConfig {

}

export type Mode = 'production' | 'development' | 'none';

export type EntryConfig = string | string[] | {
    [name: string]: string
}

