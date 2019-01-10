use super::{Diagnostic, DiagnosticBuilder};
use crate::sync::{Lrc, Send, Sync};
pub use rustc_errors::{
    emitter::{Emitter, EmitterWriter},
    HandlerFlags,
};
use rustc_errors::{
    ColorConfig, DiagnosticBuilder as RustcDiagnosticBuilder, Handler as RustcHandler, Level,
    SourceMapper,
};

/// A handler deals with errors.
pub struct Handler {
    pub(crate) inner: RustcHandler,
}

impl Handler {
    pub fn with_tty_emitter(
        color_config: ColorConfig,
        can_emit_warnings: bool,
        treat_err_as_bug: bool,
        cm: Option<Lrc<SourceMapper + Send + Sync>>,
    ) -> Self {
        RustcHandler::with_tty_emitter(color_config, can_emit_warnings, treat_err_as_bug, cm).into()
    }

    pub fn with_tty_emitter_and_flags(
        color_config: ColorConfig,
        cm: Option<Lrc<SourceMapper + Send + Sync>>,
        flags: HandlerFlags,
    ) -> Self {
        RustcHandler::with_tty_emitter_and_flags(color_config, cm, flags).into()
    }

    pub fn with_emitter(e: Box<Emitter + Send>, flags: HandlerFlags) -> Self {
        RustcHandler::with_emitter_and_flags(e, flags).into()
    }

    pub(crate) fn emit(&self, d: Diagnostic) {
        RustcDiagnosticBuilder::new_diagnostic(&self.inner, *d.inner).emit()
    }

    pub fn note<'a, 'b>(&'a self, msg: &'b str) -> DiagnosticBuilder<'a> {
        DiagnosticBuilder::new(self, Level::Note, msg)
    }

    pub fn warn<'a, 'b>(&'a self, msg: &'b str) -> DiagnosticBuilder<'a> {
        self.inner.struct_warn(msg).into()
    }

    pub fn error<'a, 'b>(&'a self, msg: &'b str) -> DiagnosticBuilder<'a> {
        DiagnosticBuilder::new(self, Level::Error, msg)
    }

    pub fn fatal<'a, 'b>(&'a self, msg: &'b str) -> DiagnosticBuilder<'a> {
        DiagnosticBuilder::new(self, Level::Fatal, msg)
    }

    pub fn has_errors(&self) -> bool {
        self.inner.has_errors()
    }

    pub fn abort_if_errors(&self) {
        self.inner.abort_if_errors()
    }

    // pub fn track_diagnostics<F, R>(&self, f: F) -> (R, Vec<Diagnostic>)
    // where
    //     F: FnOnce() -> R,
    // {
    //     let (result, errors) = self.inner.track_diagnostics(f);
    //     (result, errors.into_iter().map(From::from).collect())
    // }
}

impl From<RustcHandler> for Handler {
    fn from(inner: RustcHandler) -> Self {
        Handler { inner }
    }
}
