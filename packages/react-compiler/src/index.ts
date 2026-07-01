
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

/**
 * Lints `code` for React Compiler rule violations without compiling it.
 */
export async function lint(code: Buffer): Promise<binding.Diagnostic[]> {
    return await binding.lint(code)
}

/**
 * Synchronous variant of {@link lint}.
 */
export function lintSync(code: Buffer): binding.Diagnostic[] {
    return binding.lintSync(code)
}
