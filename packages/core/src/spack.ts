import * as path from "path";

import { Options } from "@swc/types";

export type BundleInput = BundleOptions | BundleOptions[];

export const isLocalFile = /^\.{0,2}\//; // starts with '/' './' '../'

export async function compileBundleOptions(
    config: BundleInput | string | undefined
): Promise<BundleInput> {
    const f = config === undefined ? "." : config;

    try {
        const filepath = typeof f === "string" ? f : "spack.config.js";
        const fileModule = isLocalFile.test(filepath)
            ? path.resolve(filepath)
            : filepath;
        let configFromFile: BundleInput = require(fileModule);
        if ((configFromFile as any).default) {
            configFromFile = (configFromFile as any).default;
        }
        if (Array.isArray(configFromFile)) {
            if (Array.isArray(f)) {
                return [...configFromFile, ...f];
            }
            if (typeof f !== "string") {
                configFromFile.push(f);
            }
            return configFromFile;
        }

        return {
            ...configFromFile,
            ...(typeof config === "string" ? {} : config),
        };
    } catch (e) {
        if (typeof f === "string") {
            throw new Error(
                `Error occurred while loading config file at ${config}: ${e}`
            );
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
    return c;
}

export interface BundleOptions extends SpackConfig {
    workingDir?: string;
}

/**
 * `spack.config,js`
 */
export interface SpackConfig {
    /**
     * @default process.env.NODE_ENV
     */
    mode?: Mode;

    target?: Target;

    entry: EntryConfig;

    output: OutputConfig;

    module: ModuleConfig;

    options?: Options;

    /**
     * Modules to exclude from bundle.
     */
    externalModules?: string[];
}

export interface OutputConfig {
    name: string;
    path: string;
}

export interface ModuleConfig {}

export type Mode = "production" | "development" | "none";
export type Target = "browser" | "node";

export type EntryConfig =
    | string
    | string[]
    | {
          [name: string]: string;
      };
