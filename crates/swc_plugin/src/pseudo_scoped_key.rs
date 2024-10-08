use once_cell::sync::OnceCell;

/// Simple substitution for scoped_thread_local with limited interface parity.
///
/// The only available fn in this struct is `with`, which is being used for the
/// consumers when they need to access global scope handler (HANDLER.with()).
/// Any other interfaces to support thread local is not available.
pub struct PseudoScopedKey<T> {
    // As we can't use scoped_thread_local for the global HANDLER, it is challenging
    // to set its inner handler for each plugin scope's diagnostic emitter.
    // Via lazy init OnceCell we keep static HANDLER as immutable, also allows to set
    // plugin specific values when proc_macro expands plugin's transform helper.
    pub inner: OnceCell<T>,
}

impl<T> PseudoScopedKey<T> {
    pub fn with<F, R>(&self, f: F) -> R
    where
        F: FnOnce(&T) -> R,
    {
        f(self.inner.get().expect("Should set handler before call"))
    }
}

// This is to conform some of swc_common::errors::Handler's thread-safety
// required properties.
//
// NOTE: This only works cause we know each plugin transform doesn't need any
// thread safety. However, if wasm gets thread support and if we're going to
// support it this should be revisited.
unsafe impl<T> std::marker::Sync for PseudoScopedKey<T> {}
