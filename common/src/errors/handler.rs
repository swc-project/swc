use rustc_errors::{CodeMapper, ColorConfig, Handler as RustcHandler, HandlerFlags};
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
}

impl From<RustcHandler> for Handler {
    fn from(inner: RustcHandler) -> Self {
        Handler { inner }
    }
}
