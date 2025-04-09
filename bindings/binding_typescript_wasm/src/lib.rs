use std::{
    iter::once,
    mem::take,
    sync::{Arc, Mutex},
};

use anyhow::Error;
use error_reporter::SwcReportHandler;
use js_sys::Uint8Array;
use miette::{GraphicalTheme, LabeledSpan, ThemeCharacters, ThemeStyles};
use serde::Serialize;
use swc_common::{
    errors::{DiagnosticBuilder, DiagnosticId, Emitter, Handler, HANDLER},
    sync::Lrc,
    SourceMap, Span, GLOBALS,
};
use swc_error_reporters::{convert_span, to_pretty_source_code};
use swc_fast_ts_strip::{Options, TransformOutput};
use wasm_bindgen::prelude::*;
use wasm_bindgen_futures::{future_to_promise, js_sys::Promise};

mod error_reporter;

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
struct JsonErrorWriter {
    errors: Arc<Mutex<Vec<JsonDiagnostic>>>,
    reporter: SwcReportHandler,
    cm: Lrc<SourceMap>,
}

fn try_with_json_handler<F, Ret>(cm: Lrc<SourceMap>, op: F) -> Result<Ret, Vec<JsonDiagnostic>>
where
    F: FnOnce(&Handler) -> Result<Ret, Error>,
{
    let wr = JsonErrorWriter {
        errors: Default::default(),
        reporter: SwcReportHandler::default().with_theme(GraphicalTheme {
            characters: ThemeCharacters {
                hbar: ' ',
                vbar: ' ',
                xbar: ' ',
                vbar_break: ' ',
                ltop: ' ',
                rtop: ' ',
                mtop: ' ',
                lbot: ' ',
                rbot: ' ',
                mbot: ' ',
                error: "".into(),
                warning: "".into(),
                advice: "".into(),
                ..ThemeCharacters::ascii()
            },
            styles: ThemeStyles::none(),
        }),
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

impl Emitter for JsonErrorWriter {
    fn emit(&mut self, db: &mut DiagnosticBuilder) {
        let d = &**db;

        let snippet = d.span.primary_span().and_then(|span| {
            let mut snippet = String::new();
            match self.reporter.render_report(
                &mut snippet,
                &Snippet {
                    source_code: &to_pretty_source_code(&self.cm, true),
                    span,
                },
            ) {
                Ok(()) => Some(snippet),
                Err(_) => None,
            }
        });

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

        let start = d
            .span
            .primary_span()
            .and_then(|span| self.cm.try_lookup_char_pos(span.lo()).ok());

        let end = d
            .span
            .primary_span()
            .and_then(|span| self.cm.try_lookup_char_pos(span.hi()).ok());

        let filename = start.as_ref().map(|loc| loc.file.name.to_string());

        let error = JsonDiagnostic {
            code: error_code.map(|s| s.to_string()),
            message: d.message[0].0.to_string(),
            snippet,
            filename,
            start_line: start.as_ref().map(|loc| loc.line),
            start_column: start.as_ref().map(|loc| loc.col_display),
            end_line: end.as_ref().map(|loc| loc.line),
            end_column: end.as_ref().map(|loc| loc.col_display),
            children,
        };

        self.errors.lock().unwrap().push(error);
    }

    fn take_diagnostics(&mut self) -> Vec<String> {
        Default::default()
    }
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
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
    start_line: Option<usize>,
    #[serde(skip_serializing_if = "Option::is_none")]
    start_column: Option<usize>,

    #[serde(skip_serializing_if = "Option::is_none")]
    end_line: Option<usize>,
    #[serde(skip_serializing_if = "Option::is_none")]
    end_column: Option<usize>,

    #[serde(skip_serializing_if = "Vec::is_empty")]
    children: Vec<JsonSubdiagnostic>,
}

#[derive(Serialize)]
#[serde(rename_all = "camelCase")]
struct JsonSubdiagnostic {
    message: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    snippet: Option<String>,
    filename: String,
    line: usize,
}

struct Snippet<'a> {
    source_code: &'a dyn miette::SourceCode,
    span: Span,
}

impl miette::Diagnostic for Snippet<'_> {
    fn source_code(&self) -> Option<&dyn miette::SourceCode> {
        if self.span.lo().is_dummy() || self.span.hi().is_dummy() {
            return None;
        }

        Some(self.source_code)
    }

    fn labels(&self) -> Option<Box<dyn Iterator<Item = miette::LabeledSpan> + '_>> {
        Some(Box::new(once(LabeledSpan::new_with_span(
            None,
            convert_span(self.span),
        ))))
    }
}

impl std::error::Error for Snippet<'_> {}

impl std::fmt::Display for Snippet<'_> {
    fn fmt(&self, _: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        Ok(())
    }
}

impl std::fmt::Debug for Snippet<'_> {
    fn fmt(&self, _: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        Ok(())
    }
}
