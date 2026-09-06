use swc_core::binding_macros::{
    build_minify, build_minify_sync, build_parse, build_parse_sync, build_transform,
    build_transform_sync,
};
#[cfg(feature = "api_v1")]
use swc_core::binding_macros::{build_print, build_print_sync};
use wasm_bindgen::prelude::*;
mod types;

#[cfg(all(not(feature = "api_v1"), not(feature = "api_v2")))]
compile_error!("Please enable api_v1 or api_v2 feature");

#[cfg(all(feature = "api_v1", feature = "api_v2"))]
compile_error!("Features api_v1 and api_v2 are incompatible");

/// Custom interface definitions for the @swc/wasm's public interface instead of
/// auto generated one, which is not reflecting most of types in detail.
#[wasm_bindgen(typescript_custom_section)]
#[cfg(feature = "api_v1")]
const INTERFACE_DEFINITIONS: &'static str = r#"
export function minify(src: string, opts?: JsMinifyOptions): Promise<Output>;
export function minifySync(code: string, opts?: JsMinifyOptions): Output;

export function parse(src: string, options: ParseOptions & {
    isModule: false | "commonjs";
}): Promise<Script>;
export function parse(src: string, options?: ParseOptions): Promise<Module>;
export function parseSync(src: string, options: ParseOptions & {
    isModule: false | "commonjs";
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

/// The v2 Wasm API intentionally omits the standalone print functions. Keep
/// this declaration independent from v1 so future configuration and AST changes
/// cannot leak into the stable API.
#[wasm_bindgen(typescript_custom_section)]
#[cfg(feature = "api_v2")]
const INTERFACE_DEFINITIONS_V2: &'static str = r#"
export function minify(src: string, opts?: JsMinifyOptions): Promise<Output>;
export function minifySync(code: string, opts?: JsMinifyOptions): Output;

export function parse(src: string, options: ParseOptions & {
    isModule: false | "commonjs";
}): Promise<Script>;
export function parse(src: string, options?: ParseOptions): Promise<Module>;
export function parseSync(src: string, options: ParseOptions & {
    isModule: false | "commonjs";
}): Script;
export function parseSync(src: string, options?: ParseOptions): Module;

export function transform(
    code: string | Program,
    options?: Options,
    experimental_plugin_bytes_resolver?: any
): Promise<Output>;
export function transformSync(
    code: string | Program,
    opts?: Options,
    experimental_plugin_bytes_resolver?: any
): Output;
"#;

build_minify_sync!(#[wasm_bindgen(js_name = "minifySync", skip_typescript)]);
build_minify!(#[wasm_bindgen(js_name = "minify", skip_typescript)]);
build_parse_sync!(#[wasm_bindgen(js_name = "parseSync", skip_typescript)]);
build_parse!(#[wasm_bindgen(js_name = "parse", skip_typescript)]);
#[cfg(feature = "api_v1")]
build_print_sync!(#[wasm_bindgen(js_name = "printSync", skip_typescript)]);
#[cfg(feature = "api_v1")]
build_print!(#[wasm_bindgen(js_name = "print", skip_typescript)]);
build_transform_sync!(#[wasm_bindgen(js_name = "transformSync", skip_typescript)]);
build_transform!(#[wasm_bindgen(js_name = "transform", skip_typescript)]);
