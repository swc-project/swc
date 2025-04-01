use std::fmt::{Debug, Display};

use handler::{to_pretty_handler, HandlerOpts, ThreadSafetyDiagnostics};
pub use miette::{GraphicalReportHandler, GraphicalTheme};
use swc_common::{
    errors::{Diagnostic, DiagnosticBuilder, Emitter},
    sync::Lrc,
};

mod error;
pub mod handler;
pub use error::ParseSyntaxError;

pub struct ErrorEmitter {
    pub diagnostics: ThreadSafetyDiagnostics,
    pub cm: Lrc<swc_common::SourceMap>,
    pub opts: HandlerOpts,
}

impl Emitter for ErrorEmitter {
    fn emit(&mut self, db: &mut DiagnosticBuilder<'_>) {
        let d = db.take();
        self.diagnostics.push(d);
    }

    fn take_diagnostics(&mut self) -> Vec<String> {
        let HandlerOpts {
            color,
            skip_filename,
        } = self.opts;

        self.diagnostics
            .to_pretty_string(&self.cm, skip_filename, color)
    }
}

/// A wrapper around a value that also contains a list of diagnostics.
/// It helps swc error system migrate to the new error reporting system.
pub struct WrapperDiagnostics {
    diagnostics: Vec<Diagnostic>,
    cm: Lrc<swc_common::SourceMap>,
    report_opts: HandlerOpts,
}

impl Debug for WrapperDiagnostics {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{:?}", self.diagnostics)
    }
}

impl Display for WrapperDiagnostics {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.to_pretty_string())
    }
}

impl WrapperDiagnostics {
    /// Creates a new instance of WrapperDiagnostics with the given diagnostics,
    /// source map, and options.
    pub fn new(
        diagnostics: Vec<Diagnostic>,
        cm: Lrc<swc_common::SourceMap>,
        opts: HandlerOpts,
    ) -> Self {
        Self {
            diagnostics,
            cm,
            report_opts: opts,
        }
    }

    /// Returns a reference to the diagnostics vector.
    pub fn diagnostics(&self) -> &[Diagnostic] {
        &self.diagnostics
    }

    /// Consumes the WrapperDiagnostics instance and returns the diagnostics
    /// vector.
    pub fn take_diagnostics(self) -> Vec<Diagnostic> {
        self.diagnostics
    }

    /// Converts the diagnostics to a pretty error string and wraps it in an
    /// anyhow::Error.
    pub fn to_pretty_error(&self) -> anyhow::Error {
        let error_msg = self.to_pretty_string();

        anyhow::anyhow!(error_msg)
    }

    /// Converts the diagnostics to a pretty string representation.
    pub fn to_pretty_string(&self) -> String {
        let HandlerOpts {
            color,
            skip_filename,
        } = self.report_opts;

        let report_handler = to_pretty_handler(color);

        self.diagnostics
            .iter()
            .map(|d| d.to_pretty_string(&self.cm, skip_filename, &report_handler))
            .collect::<String>()
    }
}
