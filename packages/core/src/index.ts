import { resolve } from "path";
import type {
    Plugin,
    ParseOptions,
    Module,
    Output,
    Options,
    Script,
    Program,
    JsMinifyOptions,
} from "@swc/types";
export type * from "@swc/types";
// @ts-ignore
export { newMangleNameCache as experimental_newMangleNameCache } from "./binding";
import { BundleInput, compileBundleOptions } from "./spack";
import * as assert from "assert";
// @ts-ignore
import type { NapiMinifyExtra } from "./binding";

// Allow overrides to the location of the .node binding file
const bindingsOverride = process.env["SWC_BINARY_PATH"];
// `@swc/core` includes d.ts for the `@swc/wasm` to provide typed fallback bindings
// todo: fix package.json scripts
let fallbackBindings: any;
const bindings: typeof import("../binding") = (() => {
    let binding;
    try {
        binding = !!bindingsOverride
            ? require(resolve(bindingsOverride))
            : require("./binding.js");

        // If native binding loaded successfully, it should return proper target triple constant.
        const triple = binding.getTargetTriple();
        assert.ok(triple, "Failed to read target triple from native binary.");
        return binding;
    } catch (_) {
        // postinstall supposed to install `@swc/wasm` already
        fallbackBindings = require("@swc/wasm");
    } finally {
        return binding;
    }
})();

/**
 * Version of the swc binding.
 */
export const version: string = require("./package.json").version;

/**
 * @deprecated JavaScript API is deprecated. Please use Wasm plugin instead.
 */
export function plugins(ps: Plugin[]): Plugin {
    return (mod) => {
        let m = mod;
        for (const p of ps) {
            m = p(m);
        }
        return m;
    };
}

export class Compiler {
    private fallbackBindingsPluginWarningDisplayed = false;

    async minify(src: string, opts?: JsMinifyOptions, extras?: NapiMinifyExtra): Promise<Output> {
        if (bindings) {
            return bindings.minify(toBuffer(src), toBuffer(opts ?? {}), extras ?? {});
        } else if (fallbackBindings) {
            return fallbackBindings.minify(src, opts);
        }
        throw new Error("Bindings not found.");
    }

    minifySync(src: string, opts?: JsMinifyOptions, extras?: NapiMinifyExtra): Output {
        if (bindings) {
            return bindings.minifySync(toBuffer(src), toBuffer(opts ?? {}), extras ?? {});
        } else if (fallbackBindings) {
            return fallbackBindings.minifySync(src, opts);
        }
        throw new Error("Bindings not found.");
    }

    /**
     * @deprecated Use Rust instead.
     */
    parse(
        src: string,
        options: ParseOptions & { isModule: false }
    ): Promise<Script>;
    parse(
        src: string,
        options?: ParseOptions,
        filename?: string
    ): Promise<Module>;
    async parse(
        src: string,
        options?: ParseOptions,
        filename?: string
    ): Promise<Program> {
        options = options || { syntax: "ecmascript" };
        options.syntax = options.syntax || "ecmascript";

        if (!bindings && !!fallbackBindings) {
            throw new Error(
                "Fallback bindings does not support this interface yet."
            );
        } else if (!bindings) {
            throw new Error("Bindings not found.");
        }

        if (bindings) {
            const res = await bindings.parse(src, toBuffer(options), filename);
            return JSON.parse(res);
        } else if (fallbackBindings) {
            return fallbackBindings.parse(src, options);
        }
        throw new Error("Bindings not found.");
    }

    parseSync(src: string, options: ParseOptions & { isModule: false }): Script;
    parseSync(src: string, options?: ParseOptions, filename?: string): Module;
    parseSync(src: string, options?: ParseOptions, filename?: string): Program {
        options = options || { syntax: "ecmascript" };
        options.syntax = options.syntax || "ecmascript";

        if (bindings) {
            return JSON.parse(
                bindings.parseSync(src, toBuffer(options), filename)
            );
        } else if (fallbackBindings) {
            return fallbackBindings.parseSync(src, options);
        }

        throw new Error("Bindings not found.");
    }

    parseFile(
        path: string,
        options: ParseOptions & { isModule: false }
    ): Promise<Script>;
    parseFile(path: string, options?: ParseOptions): Promise<Module>;
    async parseFile(path: string, options?: ParseOptions): Promise<Program> {
        options = options || { syntax: "ecmascript" };
        options.syntax = options.syntax || "ecmascript";

        if (!bindings && !!fallbackBindings) {
            throw new Error(
                "Fallback bindings does not support filesystem access."
            );
        } else if (!bindings) {
            throw new Error("Bindings not found.");
        }

        const res = await bindings.parseFile(path, toBuffer(options));

        return JSON.parse(res);
    }

    parseFileSync(
        path: string,
        options: ParseOptions & { isModule: false }
    ): Script;
    parseFileSync(path: string, options?: ParseOptions): Module;
    parseFileSync(path: string, options?: ParseOptions): Program {
        options = options || { syntax: "ecmascript" };
        options.syntax = options.syntax || "ecmascript";

        if (!bindings && !!fallbackBindings) {
            throw new Error(
                "Fallback bindings does not support filesystem access"
            );
        } else if (!bindings) {
            throw new Error("Bindings not found.");
        }

        return JSON.parse(bindings.parseFileSync(path, toBuffer(options)));
    }

    /**
     * Note: this method should be invoked on the compiler instance used
     *  for `parse()` / `parseSync()`.
     */
    async print(m: Program, options?: Options): Promise<Output> {
        options = options || {};

        if (bindings) {
            return bindings.print(JSON.stringify(m), toBuffer(options));
        } else if (fallbackBindings) {
            return fallbackBindings.print(m, options);
        }

        throw new Error("Bindings not found.");
    }

    /**
     * Note: this method should be invoked on the compiler instance used
     *  for `parse()` / `parseSync()`.
     */
    printSync(m: Program, options?: Options): Output {
        options = options || {};

        if (bindings) {
            return bindings.printSync(JSON.stringify(m), toBuffer(options));
        } else if (fallbackBindings) {
            return fallbackBindings.printSync(m, options);
        }

        throw new Error("Bindings not found.");
    }

    async transform(src: string | Program, options?: Options): Promise<Output> {
        const isModule = typeof src !== "string";
        options = options || {};

        if (options?.jsc?.parser) {
            options.jsc.parser.syntax =
                options.jsc.parser.syntax ?? "ecmascript";
        }

        const { plugin, ...newOptions } = options;

        if (bindings) {
            if (plugin) {
                const m =
                    typeof src === "string"
                        ? await this.parse(
                            src,
                            options?.jsc?.parser,
                            options.filename
                        )
                        : src;
                return this.transform(plugin(m), newOptions);
            }

            return bindings.transform(
                isModule ? JSON.stringify(src) : src,
                isModule,
                toBuffer(newOptions)
            );
        } else if (fallbackBindings) {
            if (plugin && !this.fallbackBindingsPluginWarningDisplayed) {
                console.warn(
                    `Fallback bindings does not support legacy plugins, it'll be ignored.`
                );
                this.fallbackBindingsPluginWarningDisplayed = true;
            }

            return fallbackBindings.transform(src, options);
        }

        throw new Error("Bindings not found.");
    }

    transformSync(src: string | Program, options?: Options): Output {
        const isModule = typeof src !== "string";
        options = options || {};

        if (options?.jsc?.parser) {
            options.jsc.parser.syntax =
                options.jsc.parser.syntax ?? "ecmascript";
        }

        const { plugin, ...newOptions } = options;

        if (bindings) {
            if (plugin) {
                const m =
                    typeof src === "string"
                        ? this.parseSync(
                            src,
                            options?.jsc?.parser,
                            options.filename
                        )
                        : src;
                return this.transformSync(plugin(m), newOptions);
            }

            return bindings.transformSync(
                isModule ? JSON.stringify(src) : src,
                isModule,
                toBuffer(newOptions)
            );
        } else if (fallbackBindings) {
            if (plugin && !this.fallbackBindingsPluginWarningDisplayed) {
                console.warn(
                    `Fallback bindings does not support legacy plugins, it'll be ignored.`
                );
                this.fallbackBindingsPluginWarningDisplayed = true;
            }
            return fallbackBindings.transformSync(
                isModule ? JSON.stringify(src) : src,
                options
            );
        }

        throw new Error("Bindings not found");
    }

    async transformFile(path: string, options?: Options): Promise<Output> {
        if (!bindings && !!fallbackBindings) {
            throw new Error(
                "Fallback bindings does not support filesystem access."
            );
        } else if (!bindings) {
            throw new Error("Bindings not found.");
        }

        options = options || {};

        if (options?.jsc?.parser) {
            options.jsc.parser.syntax =
                options.jsc.parser.syntax ?? "ecmascript";
        }

        const { plugin, ...newOptions } = options;
        newOptions.filename = path;

        if (plugin) {
            const m = await this.parseFile(path, options?.jsc?.parser);
            return this.transform(plugin(m), newOptions);
        }

        return bindings.transformFile(path, false, toBuffer(newOptions));
    }

    transformFileSync(path: string, options?: Options): Output {
        if (!bindings && !!fallbackBindings) {
            throw new Error(
                "Fallback bindings does not support filesystem access."
            );
        } else if (!bindings) {
            throw new Error("Bindings not found.");
        }

        options = options || {};

        if (options?.jsc?.parser) {
            options.jsc.parser.syntax =
                options.jsc.parser.syntax ?? "ecmascript";
        }

        const { plugin, ...newOptions } = options;
        newOptions.filename = path;

        if (plugin) {
            const m = this.parseFileSync(path, options?.jsc?.parser);
            return this.transformSync(plugin(m), newOptions);
        }

        return bindings.transformFileSync(
            path,
            /* isModule */ false,
            toBuffer(newOptions)
        );
    }

    async bundle(
        options?: BundleInput | string
    ): Promise<{ [name: string]: Output }> {
        if (!bindings && !!fallbackBindings) {
            throw new Error(
                "Fallback bindings does not support this interface yet."
            );
        } else if (!bindings) {
            throw new Error("Bindings not found.");
        }

        const opts = await compileBundleOptions(options);

        if (Array.isArray(opts)) {
            const all = await Promise.all(
                opts.map(async (opt) => {
                    return this.bundle(opt);
                })
            );
            let obj = {} as any;
            for (const o of all) {
                obj = {
                    ...obj,
                    ...o,
                };
            }
            return obj;
        }

        return bindings.bundle(
            toBuffer({
                ...opts,
            })
        );
    }
}

const compiler = new Compiler();

/**
 * @deprecated Use Rust instead.
 */
export function parse(
    src: string,
    options: ParseOptions & { isModule: false }
): Promise<Script>;
export function parse(src: string, options?: ParseOptions): Promise<Module>;
export function parse(src: string, options?: ParseOptions): Promise<Program> {
    return compiler.parse(src, options);
}

export function parseSync(
    src: string,
    options: ParseOptions & { isModule: false }
): Script;
export function parseSync(src: string, options?: ParseOptions): Module;
export function parseSync(src: string, options?: ParseOptions): Program {
    return compiler.parseSync(src, options);
}

export function parseFile(
    path: string,
    options: ParseOptions & { isModule: false }
): Promise<Script>;
export function parseFile(
    path: string,
    options?: ParseOptions
): Promise<Module>;
export function parseFile(
    path: string,
    options?: ParseOptions
): Promise<Program> {
    return compiler.parseFile(path, options);
}

export function parseFileSync(
    path: string,
    options: ParseOptions & { isModule: false }
): Script;
export function parseFileSync(path: string, options?: ParseOptions): Module;
export function parseFileSync(path: string, options?: ParseOptions): Program {
    return compiler.parseFileSync(path, options);
}

export function print(m: Program, options?: Options): Promise<Output> {
    return compiler.print(m, options);
}

export function printSync(m: Program, options?: Options): Output {
    return compiler.printSync(m, options);
}

export function transform(
    src: string | Program,
    options?: Options
): Promise<Output> {
    return compiler.transform(src, options);
}

export function transformSync(
    src: string | Program,
    options?: Options
): Output {
    return compiler.transformSync(src, options);
}

export function transformFile(
    path: string,
    options?: Options
): Promise<Output> {
    return compiler.transformFile(path, options);
}

export function transformFileSync(path: string, options?: Options): Output {
    return compiler.transformFileSync(path, options);
}

export function bundle(
    options?: BundleInput | string
): Promise<{ [name: string]: Output }> {
    return compiler.bundle(options);
}

export async function minify(
    src: string,
    opts?: JsMinifyOptions,
    extras?: NapiMinifyExtra
): Promise<Output> {
    return compiler.minify(src, opts, extras);
}

export function minifySync(src: string, opts?: JsMinifyOptions, extras?: NapiMinifyExtra): Output {
    return compiler.minifySync(src, opts, extras);
}

/**
 * Configure custom trace configuration runs for a process lifecycle.
 * Currently only chromium's trace event format is supported.
 * (https://docs.google.com/document/d/1CvAClvFfyA5R-PhYUmn5OOQtYMH4h6I0nSsKchNAySU/preview)
 *
 * This should be called before calling any binding interfaces exported in `@swc/core`, such as
 * `transform*`, or `parse*` or anything. To avoid breaking changes, each binding fn internally
 * sets default trace subscriber if not set.
 *
 * Unlike other configuration, this does not belong to individual api surface using swcrc
 * or api's parameters (`transform(..., {trace})`). This is due to current tracing subscriber
 * can be configured only once for the global scope. Calling `registerGlobalTraceConfig` multiple
 * time won't cause error, subsequent calls will be ignored.
 *
 * As name implies currently this is experimental interface may change over time without semver
 * major breaking changes. Please provide feedbacks,
 * or bug report at https://github.com/swc-project/swc/discussions.
 */
export function __experimental_registerGlobalTraceConfig(traceConfig: {
    type: "traceEvent";
    fileName?: string;
}) {
    // Do not raise error if binding doesn't exists - fallback binding will not support
    // this ever.
    if (bindings) {
        if (traceConfig.type === "traceEvent") {
            bindings.initCustomTraceSubscriber(traceConfig.fileName);
        }
    }
}

/**
 * @ignore
 *
 * Returns current binary's metadata to determine which binary is actually loaded.
 *
 * This is undocumented interface, does not guarantee stability across `@swc/core`'s semver
 * as internal representation may change anytime. Use it with caution.
 */
export function getBinaryMetadata() {
    return {
        target: bindings ? bindings?.getTargetTriple() : undefined,
    };
}

export const DEFAULT_EXTENSIONS = Object.freeze([
    ".js",
    ".jsx",
    ".es6",
    ".es",
    ".mjs",
    ".ts",
    ".tsx",
    ".cts",
    ".mts",
]);

function toBuffer(t: any): Buffer {
    return Buffer.from(JSON.stringify(t));
}
