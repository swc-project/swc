//! Plugin support.
//!
//! We need to replace operations related to thread-local variables in
//! `swc_common`.

use crate::errors::Emitter;

/// DO NOT USE THIS. This is internal API.
pub trait Runtime {
    fn emitter(&self) -> Box<dyn 'static + Emitter>;
}

#[cfg(feature = "plugin-mode")]
scoped_tls::scoped_thread_local!(
    /// DO NOT USE THIS VARIABLE. This is internal API.
    pub(crate) static RT: Box<dyn Runtime>
);

#[cfg(feature = "plugin-mode")]
pub fn with_runtime<F>(rt: &Box<dyn 'static + Runtime>, op: F)
where
    F: FnOnce(),
{
    use crate::errors::{Handler, HANDLER};

    let handler = Handler::with_emitter(true, false, rt.emitter());
    RT.set(rt, || {
        // We proxy error reporting to the core runtime.
        HANDLER.set(&handler, || op())
    })
}
