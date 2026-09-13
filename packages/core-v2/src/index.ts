import type {
    JsMinifyOptions,
    Module,
    Output,
    ParseOptions,
    Program,
    Script,
} from "@swc/types";
export type * from "@swc/types";
export type { V2Options as Options } from "./config";

import { toEngineOptions, type V2Options } from "./config";
import type * as NativeBinding from "../binding";

type Native = typeof NativeBinding;
type Wasm = {
    minify(src: string, options?: JsMinifyOptions): Promise<Output>;
    minifySync(src: string, options?: JsMinifyOptions): Output;
    parse(src: string, options?: ParseOptions): Promise<Program>;
    parseSync(src: string, options?: ParseOptions): Program;
    transform(src: string | Program, options?: V2Options): Promise<Output>;
    transformSync(src: string | Program, options?: V2Options): Output;
};

type Backend =
    | { kind: "native"; binding: Native }
    | { kind: "wasm"; binding: Wasm };

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

const sourceContextKey: unique symbol = Symbol("@swc/core-v2.sourceContext");
type ProgramWithContext = Program & {
    [sourceContextKey]?: ProgramSourceContext;
};

let cachedBackend: Backend | undefined;

function backend(): Backend {
    if (cachedBackend) return cachedBackend;

    try {
        const binding = require("../binding") as Native;
        if (!binding.getTargetTriple()) {
            throw new Error("native binding did not report a target triple");
        }
        return (cachedBackend = { kind: "native", binding });
    } catch (nativeError) {
        try {
            return (cachedBackend = {
                kind: "wasm",
                binding: require("@swc/wasm") as Wasm,
            });
        } catch (wasmError) {
            throw new AggregateError(
                [nativeError, wasmError],
                "Unable to load the SWC v2 native binding or @swc/wasm@2 fallback"
            );
        }
    }
}

function attachSourceContext<T extends Program>(
    program: T,
    sourceContext?: ProgramSourceContext | null
): T {
    if (!sourceContext || typeof program !== "object" || program === null) {
        return program;
    }

    try {
        Object.defineProperty(program, sourceContextKey, {
            configurable: true,
            enumerable: false,
            value: sourceContext,
            writable: true,
        });
    } catch {
        // A frozen user-created AST keeps the context-free behavior.
    }
    return program;
}

function parseProgram(json: string): Program {
    const value = JSON.parse(json) as Program | ProgramEnvelope;
    if (value && typeof value === "object" && "program" in value) {
        return attachSourceContext(value.program, value.sourceContext);
    }
    return value as Program;
}

function stringifyProgram(program: Program): string {
    const sourceContext = (program as ProgramWithContext)[sourceContextKey];
    return JSON.stringify(sourceContext ? { program, sourceContext } : program);
}

function buffer(value: unknown): Buffer {
    return Buffer.from(JSON.stringify(value));
}

export interface NapiMinifyExtra {
    mangleNameCache?: object;
}

export const version: string = require("../package.json").version;

export class Compiler {
    async minify(
        src: string | Buffer,
        options?: JsMinifyOptions,
        extras: NapiMinifyExtra = {}
    ): Promise<Output> {
        const selected = backend();
        if (selected.kind === "wasm") {
            return selected.binding.minify(src.toString(), options);
        }
        return selected.binding.minify(
            Buffer.from(src),
            buffer(options ?? {}),
            false,
            extras
        );
    }

    minifySync(
        src: string | Buffer,
        options?: JsMinifyOptions,
        extras: NapiMinifyExtra = {}
    ): Output {
        const selected = backend();
        if (selected.kind === "wasm") {
            return selected.binding.minifySync(src.toString(), options);
        }
        return selected.binding.minifySync(
            Buffer.from(src),
            buffer(options ?? {}),
            false,
            extras
        );
    }

    async parse(src: string, options?: ParseOptions): Promise<Program> {
        const normalized = options ?? { syntax: "ecmascript" };
        const selected = backend();
        if (selected.kind === "wasm") {
            return selected.binding.parse(src, normalized);
        }
        return parseProgram(
            await selected.binding.parse(src, buffer(normalized), undefined)
        );
    }

    parseSync(src: string, options?: ParseOptions): Program {
        const normalized = options ?? { syntax: "ecmascript" };
        const selected = backend();
        if (selected.kind === "wasm") {
            return selected.binding.parseSync(src, normalized);
        }
        return parseProgram(
            selected.binding.parseSync(src, buffer(normalized))
        );
    }

    async parseFile(path: string, options?: ParseOptions): Promise<Program> {
        const selected = backend();
        if (selected.kind === "wasm") {
            throw new Error("parseFile is not available in @swc/wasm");
        }
        return parseProgram(
            await selected.binding.parseFile(
                path,
                buffer(options ?? { syntax: "ecmascript" })
            )
        );
    }

    parseFileSync(path: string, options?: ParseOptions): Program {
        const selected = backend();
        if (selected.kind === "wasm") {
            throw new Error("parseFileSync is not available in @swc/wasm");
        }
        return parseProgram(
            selected.binding.parseFileSync(
                path,
                buffer(options ?? { syntax: "ecmascript" })
            )
        );
    }

    async transform(
        input: string | Program,
        options?: V2Options
    ): Promise<Output> {
        const selected = backend();
        const normalized = toEngineOptions(options);
        if (selected.kind === "wasm") {
            return selected.binding.transform(input, normalized);
        }
        return selected.binding.transform(
            typeof input === "string" ? input : stringifyProgram(input),
            typeof input !== "string",
            buffer(normalized)
        );
    }

    transformSync(input: string | Program, options?: V2Options): Output {
        const selected = backend();
        const normalized = toEngineOptions(options);
        if (selected.kind === "wasm") {
            return selected.binding.transformSync(input, normalized);
        }
        return selected.binding.transformSync(
            typeof input === "string" ? input : stringifyProgram(input),
            typeof input !== "string",
            buffer(normalized)
        );
    }

    async transformFile(path: string, options?: V2Options): Promise<Output> {
        const selected = backend();
        if (selected.kind === "wasm") {
            throw new Error("transformFile is not available in @swc/wasm");
        }
        return selected.binding.transformFile(
            path,
            false,
            buffer(toEngineOptions(options))
        );
    }

    transformFileSync(path: string, options?: V2Options): Output {
        const selected = backend();
        if (selected.kind === "wasm") {
            throw new Error("transformFileSync is not available in @swc/wasm");
        }
        return selected.binding.transformFileSync(
            path,
            false,
            buffer(toEngineOptions(options))
        );
    }
}

const compiler = new Compiler();

export function minify(
    src: string | Buffer,
    options?: JsMinifyOptions,
    extras?: NapiMinifyExtra
): Promise<Output> {
    return compiler.minify(src, options, extras);
}

export function minifySync(
    src: string | Buffer,
    options?: JsMinifyOptions,
    extras?: NapiMinifyExtra
): Output {
    return compiler.minifySync(src, options, extras);
}

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

export const parseFile = compiler.parseFile.bind(compiler);
export const parseFileSync = compiler.parseFileSync.bind(compiler);
export const transform = compiler.transform.bind(compiler);
export const transformSync = compiler.transformSync.bind(compiler);
export const transformFile = compiler.transformFile.bind(compiler);
export const transformFileSync = compiler.transformFileSync.bind(compiler);

export function getBinaryMetadata(): { target?: string } {
    const selected = backend();
    return selected.kind === "native"
        ? { target: selected.binding.getTargetTriple() }
        : {};
}

export const DEFAULT_EXTENSIONS = Object.freeze([
    ".js",
    ".jsx",
    ".mjs",
    ".cjs",
    ".ts",
    ".tsx",
    ".mts",
    ".cts",
]);
