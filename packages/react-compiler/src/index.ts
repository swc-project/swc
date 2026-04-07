import * as binding from './binding'

export type CompilerTarget =
    | string
    | {
          kind: 'donotuse_meta_internal'
          runtimeModule: string
      }

export interface GatingConfig {
    source: string
    importSpecifierName: string
}

export type ParserSyntax = 'ecmascript' | 'typescript'

export interface ParserOptions {
    syntax?: ParserSyntax
    jsx?: boolean
    tsx?: boolean
    decorators?: boolean
}

export interface TransformOptions {
    parser?: ParserOptions
    filename?: string
    isDev?: boolean
    compilationMode?: string
    panicThreshold?: string
    target?: CompilerTarget
    gating?: GatingConfig
    enableReanimated?: boolean
}

export interface TransformOutput {
    code: string
    diagnostics: string[]
    map?: string
}

function normalizeInput(code: string | Buffer): Buffer {
    return Buffer.isBuffer(code) ? code : Buffer.from(code)
}

function serializeOptions(options: TransformOptions): Buffer {
    return Buffer.from(JSON.stringify(options))
}

export async function transform(
    code: string | Buffer,
    options: TransformOptions = {}
): Promise<TransformOutput> {
    return await binding.transform(normalizeInput(code), serializeOptions(options))
}

export function transformSync(
    code: string | Buffer,
    options: TransformOptions = {}
): TransformOutput {
    return binding.transformSync(normalizeInput(code), serializeOptions(options))
}

export async function isReactCompilerRequired(code: string | Buffer): Promise<boolean> {
    return await binding.isReactCompilerRequired(normalizeInput(code))
}

export function isReactCompilerRequiredSync(code: string | Buffer): boolean {
    return binding.isReactCompilerRequiredSync(normalizeInput(code))
}
