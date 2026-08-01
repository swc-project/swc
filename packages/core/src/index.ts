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
    WasmAnalysisOptions,
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

type ProgramSourceContext = {
    realFilename?: string | null;
    source: string;
    startPos: number;
    endPos: number;
};

type ProgramEnvelope = {
    program: Program;
    sourceContext?: ProgramSourceContext | null;
};

const programSourceContextKey: unique symbol = Symbol(
    "@swc/core.programSourceContext"
);

type ProgramWithSourceContext = Program & {
    [programSourceContextKey]?: ProgramSourceContext;
};

function attachProgramSourceContext<T extends Program>(
    program: T,
    sourceContext?: ProgramSourceContext | null
): T {
    if (!sourceContext || typeof program !== "object" || program === null) {
        return program;
    }

    try {
        Object.defineProperty(program, programSourceContextKey, {
            configurable: true,
            enumerable: false,
            value: sourceContext,
            writable: true,
        });
    } catch (_) {
        // Frozen user-created ASTs keep the legacy raw Program behavior.
    }

    return program;
}

function getProgramSourceContext(
    program: Program
): ProgramSourceContext | undefined {
    return (program as ProgramWithSourceContext)[programSourceContextKey];
}

function copyProgramSourceContext<T extends Program>(from: Program, to: T): T {
    return attachProgramSourceContext(to, getProgramSourceContext(from));
}

function parseProgramJson(json: string): Program {
    const value = JSON.parse(json) as Program | ProgramEnvelope;

    if (
        value &&
        typeof value === "object" &&
        "program" in value &&
        value.program
    ) {
        return attachProgramSourceContext(
            value.program,
            value.sourceContext
        );
    }

    return value as Program;
}

function stringifyProgram(program: Program): string {
    const sourceContext = getProgramSourceContext(program);

    if (sourceContext) {
        return JSON.stringify({
            program,
            sourceContext,
        });
    }

    return JSON.stringify(program);
}

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

    async minify(src: string | Buffer, opts?: JsMinifyOptions, extras?: NapiMinifyExtra): Promise<Output> {
        if (bindings) {
            return bindings.minify(Buffer.from(!Buffer.isBuffer(src) && typeof src === 'object' ? JSON.stringify(src) : src), toBuffer(opts ?? {}), !Buffer.isBuffer(src) && typeof src === 'object', extras ?? {});
        } else if (fallbackBindings) {
            return fallbackBindings.minify(src, opts);
        }
        throw new Error("Bindings not found.");
    }

    minifySync(src: string | Buffer, opts?: JsMinifyOptions, extras?: NapiMinifyExtra): Output {
        if (bindings) {
            return bindings.minifySync(Buffer.from(!Buffer.isBuffer(src) && typeof src === 'object' ? JSON.stringify(src) : src), toBuffer(opts ?? {}), !Buffer.isBuffer(src) && typeof src === 'object', extras ?? {});
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
            return parseProgramJson(res);
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
            return parseProgramJson(
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

        return parseProgramJson(res);
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

        return parseProgramJson(bindings.parseFileSync(path, toBuffer(options)));
    }

    /**
     * Note: this method should be invoked on the compiler instance used
     *  for `parse()` / `parseSync()`.
     */
    async print(m: Program, options?: Options): Promise<Output> {
        options = options || {};

        if (bindings) {
            return bindings.print(stringifyProgram(m), toBuffer(options));
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
            return bindings.printSync(stringifyProgram(m), toBuffer(options));
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
                return this.transform(
                    copyProgramSourceContext(m, plugin(m)),
                    newOptions
                );
            }

            return bindings.transform(
                isModule ? stringifyProgram(src) : src,
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
                return this.transformSync(
                    copyProgramSourceContext(m, plugin(m)),
                    newOptions
                );
            }

            return bindings.transformSync(
                isModule ? stringifyProgram(src) : src,
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
            return this.transform(
                copyProgramSourceContext(m, plugin(m)),
                newOptions
            );
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
            return this.transformSync(
                copyProgramSourceContext(m, plugin(m)),
                newOptions
            );
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


export function experimental_analyze(
    src: string,
    options?: WasmAnalysisOptions
): Promise<string> {
    return bindings.analyze(src, toBuffer(options));
}

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
    src: string | Buffer,
    opts?: JsMinifyOptions,
    extras?: NapiMinifyExtra
): Promise<Output> {
    return compiler.minify(src, opts, extras);
}

export function minifySync(src: string | Buffer, opts?: JsMinifyOptions, extras?: NapiMinifyExtra): Output {
    return compiler.minifySync(src, opts, extras);
}

/**
 * @deprecated Trace profiling is disabled. This function is kept as a no-op for compatibility.
 */
export function __experimental_registerGlobalTraceConfig(traceConfig: {
    type: "traceEvent";
    fileName?: string;
}) {
    void traceConfig;
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
