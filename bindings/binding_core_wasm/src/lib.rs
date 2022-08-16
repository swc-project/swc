use swc_core::binding_macros::{
    build_minify, build_minify_sync, build_parse, build_parse_sync, build_print, build_print_sync,
    build_transform, build_transform_sync,
};
use wasm_bindgen::prelude::*;
mod types;

/// Custom interface definitions for the @swc/wasm's public interface instead of
/// auto generated one, which is not reflecting most of types in detail.
#[wasm_bindgen(typescript_custom_section)]
const INTERFACE_DEFINITIONS: &'static str = r#"
export function minify(src: string, opts?: JsMinifyOptions): Promise<Output>;
export function minifySync(code: string, opts?: JsMinifyOptions): Output;

export function parse(src: string, options: ParseOptions & {
    isModule: false;
}): Promise<Script>;
export function parse(src: string, options?: ParseOptions): Promise<Module>;
export function parseSync(src: string, options: ParseOptions & {
    isModule: false;
}): Script;
export function parseSync(src: string, options?: ParseOptions): Module;

export function print(m: Program, options?: Options): Promise<Output>;
export function printSync(m: Program, options?: Options): Output

/**
 * Note: this interface currently does not do _actual_ async work, only provides
 * a corresponding async interfaces to the `@swc/core`'s interface.
 */
export function transform(
    code: string | Program,
    options?: Options,
    experimental_plugin_bytes_resolver?: any
): Promise<Output>;
/**
 * @param {string} code
 * @param {Options} opts
 * @param {Record<string, ArrayBuffer>} experimental_plugin_bytes_resolver An object contains bytes array for the plugin
 * specified in config. Key of record represents the name of the plugin specified in config. Note this is an experimental
 * interface, likely will change.
 * @returns {Output}
 */
export function transformSync(code: string | Program, opts?: Options, experimental_plugin_bytes_resolver?: any): Output;
"#;

build_minify_sync!(#[wasm_bindgen(js_name = "minifySync", typescript_type = "minifySync", skip_typescript)]);
build_minify!(#[wasm_bindgen(js_name = "minify", typescript_type = "minify", skip_typescript)]);

build_parse_sync!(#[wasm_bindgen(js_name = "parseSync", typescript_type = "parseSync", skip_typescript)]);
build_parse!(#[wasm_bindgen(js_name = "parse", typescript_type = "parse", skip_typescript)]);

build_transform_sync!(#[wasm_bindgen(js_name = "transformSync", typescript_type = "transformSync", skip_typescript)]);
build_transform!(#[wasm_bindgen(js_name = "transform", typescript_type = "transform", skip_typescript)]);

build_print_sync!(#[wasm_bindgen(js_name = "printSync", typescript_type = "printSync", skip_typescript)]);
build_print!(#[wasm_bindgen(js_name = "print", typescript_type = "print", skip_typescript)]);
