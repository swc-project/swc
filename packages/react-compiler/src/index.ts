
import type { ParserConfig } from '@swc/types'

import * as binding from './binding'

export type {
    Diagnostic,
    DiagnosticDetail,
    DiagnosticLocation,
    DiagnosticPosition,
} from './binding'

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

function encodeSyntax(syntax?: ParserConfig): Buffer | undefined {
    return syntax === undefined ? undefined : Buffer.from(JSON.stringify(syntax))
}

/**
 * Lints `code` for React Compiler rule violations without compiling it.
 *
 * `syntax` defaults to TSX with decorators enabled when omitted.
 */
export async function lint(code: Buffer, syntax?: ParserConfig): Promise<binding.Diagnostic[]> {
    return await binding.lint(code, encodeSyntax(syntax))
}

/**
 * Synchronous variant of {@link lint}.
 */
export function lintSync(code: Buffer, syntax?: ParserConfig): binding.Diagnostic[] {
    return binding.lintSync(code, encodeSyntax(syntax))
}
