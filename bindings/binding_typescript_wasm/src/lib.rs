use std::{
    fmt,
    io::Write,
    mem::take,
    sync::{Arc, Mutex},
};

use anyhow::Error;
use js_sys::Uint8Array;
use serde_wasm_bindgen::to_value;
use swc_common::{
    errors::{ColorConfig, Handler, HANDLER},
    sync::Lrc,
    SourceMap, GLOBALS,
};
use swc_error_reporters::{
    handler::HandlerOpts,
    json_emitter::{JsonEmitter, JsonEmitterConfig},
};
use swc_fast_ts_strip::{Options, TransformOutput};
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::{future_to_promise, js_sys::Promise};

/// Custom interface definitions for the @swc/wasm's public interface instead of
/// auto generated one, which is not reflecting most of types in detail.
#[wasm_bindgen(typescript_custom_section)]
const INTERFACE_DEFINITIONS: &'static str = r#"
export declare function transform(src: string | Uint8Array, opts?: Options): Promise<TransformOutput>;
export declare function transformSync(src: string | Uint8Array, opts?: Options): TransformOutput;
export type { Options, TransformOutput };
"#;

#[wasm_bindgen(skip_typescript)]
pub fn transform(input: JsValue, options: JsValue) -> Promise {
    future_to_promise(async move { transform_sync(input, options) })
}

#[wasm_bindgen(js_name = "transformSync", skip_typescript)]
pub fn transform_sync(input: JsValue, options: JsValue) -> Result<JsValue, JsValue> {
    let options: Options = if options.is_falsy() {
        Default::default()
    } else {
        serde_wasm_bindgen::from_value(options)?
    };

    let input = match input.as_string() {
        Some(input) => input,
        None => {
            if input.is_instance_of::<Uint8Array>() {
                let input = input.unchecked_into::<Uint8Array>();
                match input.to_string().as_string() {
                    Some(input) => input,
                    None => return Err(JsValue::from_str("Input Uint8Array is not valid utf-8")),
                }
            } else {
                return Err(JsValue::from_str("Input is not a string or Uint8Array"));
            }
        }
    };

    let result = GLOBALS
        .set(&Default::default(), || operate(input, options))
        .map_err(convert_err)?;

    Ok(serde_wasm_bindgen::to_value(&result)?)
}

fn operate(input: String, options: Options) -> Result<TransformOutput, Vec<serde_json::Value>> {
    let cm = Lrc::new(SourceMap::default());

    try_with_json_handler(
        cm.clone(),
        HandlerOpts {
            color: ColorConfig::Never,
            skip_filename: false,
        },
        |handler| {
            swc_fast_ts_strip::operate(&cm, handler, input, options).map_err(anyhow::Error::new)
        },
    )
}

#[derive(Clone, Default)]
struct LockedWriter(Arc<Mutex<Vec<serde_json::Value>>>);

impl Write for LockedWriter {
    fn write(&mut self, buf: &[u8]) -> std::io::Result<usize> {
        let mut lock = self.0.lock().unwrap();

        lock.push(serde_json::from_slice(buf)?);

        Ok(buf.len())
    }

    fn flush(&mut self) -> std::io::Result<()> {
        Ok(())
    }
}

impl fmt::Write for LockedWriter {
    fn write_str(&mut self, s: &str) -> fmt::Result {
        self.write(s.as_bytes()).map_err(|_| fmt::Error)?;

        Ok(())
    }
}

fn try_with_json_handler<F, Ret>(
    cm: Lrc<SourceMap>,
    config: HandlerOpts,
    op: F,
) -> Result<Ret, Vec<serde_json::Value>>
where
    F: FnOnce(&Handler) -> Result<Ret, Error>,
{
    let wr = Box::<LockedWriter>::default();

    let emitter = Box::new(JsonEmitter::new(
        cm,
        wr.clone(),
        JsonEmitterConfig {
            skip_filename: config.skip_filename,
        },
    ));
    // let e_wr = EmitterWriter::new(wr.clone(), Some(cm), false,
    // true).skip_filename(skip_filename);
    let handler = Handler::with_emitter(true, false, emitter);

    let ret = HANDLER.set(&handler, || op(&handler));

    if handler.has_errors() {
        let mut lock = wr.0.lock().unwrap();
        let error = take(&mut *lock);

        Err(error)
    } else {
        Ok(ret.expect("it should not fail without emitting errors to handler"))
    }
}

pub fn convert_err(err: Vec<serde_json::Value>) -> wasm_bindgen::prelude::JsValue {
    to_value(&err).unwrap()
}
