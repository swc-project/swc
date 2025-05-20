
import * as binding from './binding'

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

