use std::fmt::{Debug, Display};

use anyhow::anyhow;
use handler::{to_pretty_handler, HandlerOpts, ThreadSafetyDiagnostics};
pub use miette::{GraphicalReportHandler, GraphicalTheme};
use swc_common::{
    errors::{Diagnostic, DiagnosticBuilder, Emitter},
    sync::Lrc,
};

mod diagnostic;
pub mod handler;
pub use diagnostic::{convert_span, to_pretty_source_code, ToPrettyDiagnostic};

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
pub struct TWithDiagnosticArray<T: Debug + Display> {
    inner: Option<T>,
    diagnostics: Vec<Diagnostic>,
    cm: Lrc<swc_common::SourceMap>,
    report_opts: HandlerOpts,
}

impl<T: Debug + Display> Debug for TWithDiagnosticArray<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("TWithDiagnosticArray")
            .field("inner", &self.inner)
            .field("diagnostics", &self.diagnostics)
            .finish()
    }
}

impl<T: Debug + Display> Display for TWithDiagnosticArray<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self.inner.as_ref() {
            Some(inner) => {
                write!(f, "{}\n{}", self.take_pretty_diagnostics(), inner)
            }
            None => write!(f, "{}", self.take_pretty_diagnostics()),
        }
    }
}

impl<T: Debug + Display> TWithDiagnosticArray<T> {
    /// Creates a new instance of WrapperDiagnostics with the given diagnostics,
    /// source map, and options.
    pub fn new(
        inner: Option<T>,
        diagnostics: Vec<Diagnostic>,
        cm: Lrc<swc_common::SourceMap>,
        opts: HandlerOpts,
    ) -> Self {
        Self {
            inner,
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

    /// Converts the diagnostics to a pretty string representation.
    fn take_pretty_diagnostics(&self) -> String {
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

impl TWithDiagnosticArray<anyhow::Error> {
    /// Converts the diagnostics to a pretty error string and wraps it in an
    /// anyhow::Error.
    pub fn to_pretty_error(self) -> anyhow::Error {
        let pretty_diagnostics = self.take_pretty_diagnostics();

        match self.inner {
            Some(inner_error) => inner_error.context(pretty_diagnostics),
            None => {
                anyhow!(pretty_diagnostics)
            }
        }
    }

    /// Converts the diagnostics to a pretty string representation.
    pub fn to_pretty_string(self) -> String {
        let pretty_error = self.to_pretty_error();

        pretty_error.to_string()
    }
}
