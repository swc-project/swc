use super::Diagnostic;
use Span;
use rustc_errors::{CodeMapper, ColorConfig, Diagnostic as RustcDiagnostic,
                   Handler as RustcHandler, HandlerFlags, Level};
use std::rc::Rc;

/// A handler deals with errors.
pub struct Handler {
    pub(super) inner: RustcHandler,
}

impl Handler {
    pub fn with_tty_emitter(
        color_config: ColorConfig,
        can_emit_warnings: bool,
        treat_err_as_bug: bool,
        cm: Option<Rc<CodeMapper>>,
    ) -> Self {
        RustcHandler::with_tty_emitter(color_config, can_emit_warnings, treat_err_as_bug, cm).into()
    }

    pub fn with_tty_emitter_and_flags(
        color_config: ColorConfig,
        cm: Option<Rc<CodeMapper>>,
        flags: HandlerFlags,
    ) -> Self {
        RustcHandler::with_tty_emitter_and_flags(color_config, cm, flags).into()
    }

    pub fn note<'a, 'b>(&'a self, msg: &'b str) -> Diagnostic<'a> {
        Diagnostic::new(self, Level::Note, msg)
    }

    pub fn warn<'a, 'b>(&'a self, msg: &'b str) -> Diagnostic<'a> {
        self.inner.struct_warn(msg).into()
    }

    pub fn error<'a, 'b>(&'a self, msg: &'b str) -> Diagnostic<'a> {
        Diagnostic::new(self, Level::Error, msg)
    }

    pub fn fatal<'a, 'b>(&'a self, msg: &'b str) -> Diagnostic<'a> {
        Diagnostic::new(self, Level::Fatal, msg)
    }

    pub fn has_errors(&self) -> bool {
        self.inner.has_errors()
    }

    pub fn abort_if_errors(&self) {
        self.inner.abort_if_errors()
    }

    pub fn track_diagnostics<F, R>(&self, f: F) -> (R, Vec<RustcDiagnostic>)
    where
        F: FnOnce() -> R,
    {
        self.inner.track_diagnostics(f)
    }
}

impl From<RustcHandler> for Handler {
    fn from(inner: RustcHandler) -> Self {
        Handler { inner }
    }
}
