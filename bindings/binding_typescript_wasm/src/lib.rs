use std::{
    iter::once,
    mem::take,
    sync::{Arc, Mutex},
};

use anyhow::Error;
use error_reporter::SwcReportHandler;
use js_sys::Uint8Array;
use miette::{GraphicalReportHandler, GraphicalTheme, LabeledSpan, ThemeCharacters, ThemeStyles};
use serde::Serialize;
use swc_common::{
    errors::{DiagnosticBuilder, DiagnosticId, Emitter, Handler, HANDLER},
    sync::Lrc,
    SourceMap, Span, GLOBALS,
};
use swc_error_reporters::{to_miette_source_code, to_miette_span, PrettyEmitterConfig};
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
    fn emit(&mut self, db: &DiagnosticBuilder) {
        let d = &**db;

        let snippet = d.span.primary_span().and_then(|span| {
            let mut snippet = String::new();
            match self.reporter.render_report(
                &mut snippet,
                &Snippet {
                    source_code: &to_miette_source_code(
                        &self.cm,
                        &PrettyEmitterConfig {
                            skip_filename: true,
                        },
                    ),
                    span,
                },
            ) {
                Ok(()) => Some({
                    remove_line_number(&mut snippet);
                    snippet
                }),
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
            to_miette_span(self.span),
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

/// Finds for `[\d+\s+]` and `\[\d+:\d+\]` and remove them.
fn remove_line_number(snippet: &mut String) {
    let mut result = String::with_capacity(snippet.len());
    let lines = snippet.lines();

    for line in lines {
        let mut new_line = String::with_capacity(line.len());

        // Check for [n:m] pattern
        if let Some(pos) = line.find('[') {
            if let Some(end_pos) = line[pos..].find(']') {
                let bracket_content = &line[pos + 1..pos + end_pos];
                if bracket_content
                    .chars()
                    .all(|c| c.is_ascii_digit() || c == ':')
                {
                    // Replace [n:m] with spaces
                    for _ in 0..pos {
                        new_line.push(' ');
                    }
                    for _ in 0..(end_pos + 1) {
                        new_line.push(' ');
                    }
                    new_line.push_str(&line[pos + end_pos + 1..]);
                    result.push_str(&new_line);
                    result.push('\n');
                    continue;
                }
            }
        }

        // Check for digit-space pattern (e.g., " 1   ")
        let trimmed = line.trim_start();

        if !trimmed.is_empty() && trimmed.chars().next().unwrap().is_ascii_digit() {
            let leading_space_count = line.len() - trimmed.len();
            let mut digit_end = 0;

            // Find where the digits end
            for (i, c) in trimmed.char_indices() {
                if !c.is_ascii_digit() {
                    digit_end = i;
                    break;
                }
            }

            if digit_end == 0 && trimmed.chars().all(|c| c.is_ascii_digit()) {
                digit_end = trimmed.len();
            }

            // Check if digits are followed by whitespace
            if digit_end < trimmed.len()
                && trimmed[digit_end..].starts_with(|c: char| c.is_whitespace())
            {
                // Count trailing whitespace
                let trailing_space_end = trimmed[digit_end..]
                    .chars()
                    .take_while(|&c| c.is_whitespace())
                    .count();

                // Replace number and surrounding spaces with spaces
                for _ in 0..(leading_space_count + digit_end + trailing_space_end) {
                    new_line.push(' ');
                }

                new_line.push_str(&trimmed[digit_end + trailing_space_end..]);
                result.push_str(&new_line);
                result.push('\n');
                continue;
            }
        }

        // If no pattern matched, keep the line as is
        result.push_str(line);
        result.push('\n');
    }

    // Remove the trailing newline if the original didn't have one
    if !snippet.ends_with('\n') && !result.is_empty() {
        result.pop();
    }

    *snippet = result;
}
