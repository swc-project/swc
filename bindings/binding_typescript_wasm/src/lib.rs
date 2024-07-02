use swc_core::binding_macros::{build_minify, build_minify_sync};
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::{
    future_to_promise,
    js_sys::{JsString, Promise},
};

/// Custom interface definitions for the @swc/wasm's public interface instead of
/// auto generated one, which is not reflecting most of types in detail.
#[wasm_bindgen(typescript_custom_section)]
const INTERFACE_DEFINITIONS: &'static str = r#"
export function transform(src: string, opts?: Options): Promise<TransformOutput>;
export function transformSync(src: string, opts?: Options): TransformOutput;
"#;

pub struct Options {}

pub struct TransformOutput {
    code: String,
    map: Option<String>,
}

#[wasm_bindgen]
pub fn transform(input: JsString, options: JsValue) -> Promise {
    future_to_promise(async move { transform_sync(input, options) })
}

#[wasm_bindgen]
pub fn transform_sync(input: JsString, options: JsValue) -> Result<JsValue, JsValue> {}
