use std::{
    mem::take,
    sync::{Arc, Mutex},
};

use anyhow::Error;
use js_sys::Uint8Array;
use serde::Serialize;
use swc_common::{
    errors::{DiagnosticBuilder, DiagnosticId, Emitter, Handler, HANDLER},
    sync::Lrc,
    SourceMap, SourceMapper, GLOBALS,
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

    let result = GLOBALS.set(&Default::default(), || operate(input, options));

    match result {
        Ok(v) => Ok(serde_wasm_bindgen::to_value(&v)?),
        Err(errors) => Err(serde_wasm_bindgen::to_value(&errors[0])?),
    }
}

fn operate(input: String, options: Options) -> Result<TransformOutput, Vec<JsonDiagnostic>> {
    let cm = Lrc::new(SourceMap::default());

    try_with_json_handler(cm.clone(), |handler| {
        swc_fast_ts_strip::operate(&cm, handler, input, options).map_err(anyhow::Error::new)
    })
}

#[derive(Clone)]
struct LockedWriter {
    errors: Arc<Mutex<Vec<JsonDiagnostic>>>,
    cm: Lrc<SourceMap>,
}

fn try_with_json_handler<F, Ret>(cm: Lrc<SourceMap>, op: F) -> Result<Ret, Vec<JsonDiagnostic>>
where
    F: FnOnce(&Handler) -> Result<Ret, Error>,
{
    let wr = LockedWriter {
        errors: Default::default(),
        cm,
    };
    let emitter: Box<dyn Emitter> = Box::new(wr.clone());

    let handler = Handler::with_emitter(true, false, emitter);

    let ret = HANDLER.set(&handler, || op(&handler));

    if handler.has_errors() {
        let mut lock = wr.errors.lock().unwrap();
        let error = take(&mut *lock);

        Err(error)
    } else {
        Ok(ret.expect("it should not fail without emitting errors to handler"))
    }
}

impl Emitter for LockedWriter {
    fn emit(&mut self, db: &DiagnosticBuilder) {
        let d = &**db;

        let children = d
            .children
            .iter()
            .map(|d| todo!("json subdiagnostic: {d:?}"))
            .collect::<Vec<_>>();

        let error_code = match &d.code {
            Some(DiagnosticId::Error(s)) => Some(&**s),
            Some(DiagnosticId::Lint(s)) => Some(&**s),
            None => None,
        };

        let loc = d
            .span
            .primary_span()
            .and_then(|span| self.cm.try_lookup_char_pos(span.lo()).ok());

        let snippet = d
            .span
            .primary_span()
            .and_then(|span| self.cm.span_to_snippet(span).ok());

        let filename = loc.as_ref().map(|loc| loc.file.name.to_string());

        let error = JsonDiagnostic {
            code: error_code.map(|s| s.to_string()),
            message: d.message[0].0.to_string(),
            snippet,
            filename,
            line: loc.as_ref().map(|loc| loc.line),
            column: loc.as_ref().map(|loc| loc.col_display),
            children,
        };

        self.errors.lock().unwrap().push(error);
    }

    fn take_diagnostics(&mut self) -> Vec<String> {
        Default::default()
    }
}

#[derive(Serialize)]
struct JsonDiagnostic {
    /// Error code
    #[serde(skip_serializing_if = "Option::is_none")]
    code: Option<String>,
    message: String,

    #[serde(skip_serializing_if = "Option::is_none")]
    snippet: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    filename: Option<String>,

    #[serde(skip_serializing_if = "Option::is_none")]
    line: Option<usize>,
    #[serde(skip_serializing_if = "Option::is_none")]
    column: Option<usize>,

    #[serde(skip_serializing_if = "Vec::is_empty")]
    children: Vec<JsonSubdiagnostic>,
}

#[derive(Serialize)]
struct JsonSubdiagnostic {
    message: String,
    snippet: Option<String>,
    filename: String,
    line: usize,
}
