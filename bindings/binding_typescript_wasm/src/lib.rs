use serde::{Deserialize, Serialize};
use swc_core::{
    base::HandlerOpts,
    common::{errors::ColorConfig, sync::Lrc, SourceMap, GLOBALS},
};
use swc_error_reporters::handler::try_with_handler;
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

#[derive(Deserialize)]
pub struct Options {}

#[derive(Serialize)]
pub struct TransformOutput {
    code: String,
    map: Option<String>,
}

#[wasm_bindgen]
pub fn transform(input: JsString, options: JsValue) -> Promise {
    future_to_promise(async move { transform_sync(input, options) })
}

#[wasm_bindgen]
pub fn transform_sync(input: JsString, options: JsValue) -> Result<JsValue, JsValue> {
    let options: Options = serde_wasm_bindgen::from_value(options)?;

    let cm = Lrc::new(SourceMap::default());
    GLOBALS.set(&Default::default(), || {
        try_with_handler(
            cm.clone(),
            HandlerOpts {
                color: ColorConfig::Never,
                skip_filename: true,
            },
            |handler| {},
        )
    })
}
