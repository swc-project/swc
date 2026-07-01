
import type { EsParserConfig, TsParserConfig } from '@swc/types'

import * as binding from './binding'

export type {
    Diagnostic,
    DiagnosticDetail,
    DiagnosticLocation,
    DiagnosticPosition,
} from './binding'

/**
 * The `syntax` shapes `lint`/`lintSync` accept. Deliberately narrower than
 * `@swc/types`'s `ParserConfig` (which also includes `FlowParserConfig`):
 * this crate only enables `swc_ecma_parser`'s `typescript` feature, not
 * `flow`, so the compiled `Syntax` enum has no `Flow` variant — passing a
 * Flow config would type-check against the wider `ParserConfig` but fail
 * at runtime with a confusing `unknown variant 'flow'` error. Excluding it
 * here turns that into a compile-time error instead.
 */
export type LintSyntax = TsParserConfig | EsParserConfig

/**
 * TODO
 */
export async function isReactCompilerRequired(code: Buffer) {
    return await binding.isReactCompilerRequired(code)
}


/**
 * TODO
 */
export function isReactCompilerRequiredSync(code: Buffer): boolean {
    return binding.isReactCompilerRequiredSync(code)
}

function encodeSyntax(syntax?: LintSyntax): Buffer | undefined {
    return syntax === undefined ? undefined : Buffer.from(JSON.stringify(syntax))
}

/**
 * Lints `code` for React Compiler rule violations without compiling it.
 *
 * `syntax` defaults to plain ECMAScript (no JSX/TSX/decorators) when
 * omitted, matching `@swc/core`'s own default — pass an explicit `syntax`
 * for TypeScript, JSX, or decorator syntax.
 */
export async function lint(code: string, syntax?: LintSyntax): Promise<binding.Diagnostic[]> {
    return await binding.lint(code, encodeSyntax(syntax))
}

/**
 * Synchronous variant of {@link lint}.
 */
export function lintSync(code: string, syntax?: LintSyntax): binding.Diagnostic[] {
    return binding.lintSync(code, encodeSyntax(syntax))
}
