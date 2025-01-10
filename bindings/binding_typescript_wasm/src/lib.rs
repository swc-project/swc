use anyhow::Error;
use serde::Serialize;
use swc_common::{errors::ColorConfig, sync::Lrc, SourceMap, GLOBALS};
use swc_error_reporters::handler::{try_with_handler, HandlerOpts};
use swc_fast_ts_strip::{ErrorCode, Options, TransformOutput, TsError};
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::{
    future_to_promise,
    js_sys::{JsString, Promise},
};

/// Custom interface definitions for the @swc/wasm's public interface instead of
/// auto generated one, which is not reflecting most of types in detail.
#[wasm_bindgen(typescript_custom_section)]
const INTERFACE_DEFINITIONS: &'static str = r#"
export declare function transform(src: string, opts?: Options): Promise<TransformOutput>;
export declare function transformSync(src: string, opts?: Options): TransformOutput;
export type { Options, TransformOutput };
"#;

#[wasm_bindgen(skip_typescript)]
pub fn transform(input: JsString, options: JsValue) -> Promise {
    future_to_promise(async move { transform_sync(input, options) })
}

#[wasm_bindgen(js_name = "transformSync", skip_typescript)]
pub fn transform_sync(input: JsString, options: JsValue) -> Result<JsValue, JsValue> {
    let options: Options = if options.is_falsy() {
        Default::default()
    } else {
        serde_wasm_bindgen::from_value(options)?
    };

    let input = input.as_string().unwrap();

    let result = GLOBALS
        .set(&Default::default(), || operate(input, options))
        .map_err(convert_err)?;

    Ok(serde_wasm_bindgen::to_value(&result)?)
}

fn operate(input: String, options: Options) -> Result<TransformOutput, Error> {
    let cm = Lrc::new(SourceMap::default());

    try_with_handler(
        cm.clone(),
        HandlerOpts {
            color: ColorConfig::Never,
            skip_filename: true,
        },
        |handler| {
            swc_fast_ts_strip::operate(&cm, handler, input, options).map_err(anyhow::Error::new)
        },
    )
}

#[derive(Debug, Serialize)]
struct ErrorObject {
    code: ErrorCode,
    message: String,
}

pub fn convert_err(err: Error) -> wasm_bindgen::prelude::JsValue {
    if let Some(ts_error) = err.downcast_ref::<TsError>() {
        return serde_wasm_bindgen::to_value(&ErrorObject {
            code: ts_error.code,
            message: err.to_string(),
        })
        .unwrap();
    }

    format!("{}", err).into()
}
