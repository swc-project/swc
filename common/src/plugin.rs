//! Plugin support.
//!
//! We need to replace operations related to thread-local variables in
//! `swc_common`.

use crate::errors::{Diagnostic, DiagnosticBuilder, Emitter};
use abi_stable::sabi_trait;

/// DO NOT USE THIS. This is internal API.
#[sabi_trait]
pub trait Runtime {
    /// Emit a structured diagnostic.
    fn emit(&mut self, db: &Diagnostic);
}

#[cfg(feature = "plugin-mode")]
scoped_tls::scoped_thread_local!(
    /// DO NOT USE THIS VARIABLE. This is internal API.
    pub(crate) static RT: Box<dyn Runtime>
);

#[cfg(feature = "plugin-mode")]
struct PluginEmitter;

#[cfg(feature = "plugin-mode")]
impl Emitter for PluginEmitter {
    fn emit(&mut self, db: &DiagnosticBuilder<'_>) {
        RT.with(|rt| rt.emit(db))
    }
}

#[cfg(feature = "plugin-mode")]
pub fn with_runtime<F>(rt: &Box<dyn 'static + Runtime>, op: F)
where
    F: FnOnce(),
{
    use crate::errors::{Handler, HANDLER};

    let handler = Handler::with_emitter(true, false, Box::new(PluginEmitter));
    RT.set(rt, || {
        // We proxy error reporting to the core runtime.
        HANDLER.set(&handler, || op())
    })
}
