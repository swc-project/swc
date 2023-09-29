
import { JsMinifyOptions } from '@swc/types';
import * as binding from './binding'

/**
 * TODO
 */
export async function minify(code: Buffer, options: JsMinifyOptions) {
    return await binding.minify(code, toBuffer(options))
}


/**
 * TODO
 */
export function minifySync(code: Buffer, options: JsMinifyOptions): binding.TransformOutput {
    return binding.minifySync(code, toBuffer(options))
}


function toBuffer(t: any): Buffer {
    return Buffer.from(JSON.stringify(t))
}
