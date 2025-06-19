
import { JsMinifyOptions } from '@swc/types';
import * as binding from './binding'

/**
 * TODO
 */
export async function minify(code: string | Buffer, options: JsMinifyOptions) {
    return await binding.minify(Buffer.from(code), toBuffer(options), false, {})
}


/**
 * TODO
 */
export function minifySync(code: string | Buffer, options: JsMinifyOptions): binding.TransformOutput {
    return binding.minifySync(Buffer.from(code), toBuffer(options), false, {})
}


function toBuffer(t: any): Buffer {
    return Buffer.from(JSON.stringify(t))
}
