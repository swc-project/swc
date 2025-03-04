use std::{f128::consts::E, fmt::Write};

use serde_derive::Serialize;
use swc_common::{
    errors::{DiagnosticBuilder, Emitter, Level},
    sync::Lrc,
    SourceMap,
};

use crate::{MietteDiagnostic, MietteSourceCode, MietteSubdiagnostic, WriterWrapper};

pub struct JsonEmitter {
    cm: Lrc<SourceMap>,

    wr: WriterWrapper,

    config: JsonEmitterConfig,

    diagnostics: Vec<String>,
}

#[derive(Debug, Clone, Default)]
pub struct JsonEmitterConfig {
    pub skip_filename: bool,
}

impl Emitter for JsonEmitter {
    fn emit(&mut self, db: &DiagnosticBuilder) {
        let d = &**db;

        let children = d
            .children
            .iter()
            .map(|d| JsonSubdiagnostic {
                code: &d.code,
                message: &d.message,
                snippet: d.snippet,
                filename: d.filename(),
                line: d.line(),
            })
            .collect::<Vec<_>>();

        let error = JsonDiagnostic {
            code: &d.code,
            message: &d.message,
            filename: d.filename(),
            line: d.line(),
            column: d.column(),
            children,
        };

        let result = serde_json::to_string(&mut error).unwrap();

        self.wr.write_str(&result).unwrap();

        self.diagnostics.push(result);
    }

    fn take_diagnostics(&mut self) -> Vec<String> {
        std::mem::take(&mut self.diagnostics)
    }
}

#[derive(Serialize)]
struct JsonDiagnostic<'a> {
    /// Error code
    code: &'a str,
    message: &'a str,

    #[serde(skip_serializing_if = "Option::is_none")]
    snippet: Option<&'a str>,

    #[serde(skip_serializing_if = "Option::is_none")]
    filename: Option<&'a str>,

    #[serde(skip_serializing_if = "Option::is_none")]
    line: Option<usize>,
    #[serde(skip_serializing_if = "Option::is_none")]
    column: Option<usize>,

    #[serde(skip_serializing_if = "Vec::is_empty")]
    children: Vec<JsonSubdiagnostic<'a>>,
}

#[derive(Serialize)]
struct JsonSubdiagnostic<'a> {
    code: &'a str,
    message: &'a str,
    snippet: &'a str,
    filename: &'a str,
    line: usize,
}
