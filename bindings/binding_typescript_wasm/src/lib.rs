use swc_core::binding_macros::{build_minify, build_minify_sync};
use wasm_bindgen::prelude::*;

/// Custom interface definitions for the @swc/wasm's public interface instead of
/// auto generated one, which is not reflecting most of types in detail.
#[wasm_bindgen(typescript_custom_section)]
const INTERFACE_DEFINITIONS: &'static str = r#"
export function minify(src: string, opts?: JsMinifyOptions): Promise<Output>;
export function minifySync(code: string, opts?: JsMinifyOptions): Output;
"#;

build_minify_sync!(#[wasm_bindgen(js_name = "minifySync", typescript_type = "minifySync",skip_typescript)]);
build_minify!(#[wasm_bindgen(js_name = "minify", typescript_type = "minify",skip_typescript)]);
