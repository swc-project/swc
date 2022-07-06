use swc_common::{plugin::PluginSerializedBytes, sync::OnceCell};

use crate::pseudo_scoped_key::PseudoScopedKey;

#[cfg(target_arch = "wasm32")] // Allow testing
extern "C" {
    fn __emit_diagnostics(bytes_ptr: i32, bytes_ptr_len: i32);
    fn __free(bytes_ptr: i32, size: i32) -> i32;
}

/// An emitter for the Diagnostic in plugin's context by borrowing host's
/// environment context.
///
/// It is not expected to call this directly inside of plugin transform.
/// Instead, it is encouraged to use global HANDLER.
pub struct PluginDiagnosticsEmitter;

impl swc_common::errors::Emitter for PluginDiagnosticsEmitter {
    #[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
    fn emit(&mut self, db: &swc_common::errors::DiagnosticBuilder<'_>) {
        let diag = PluginSerializedBytes::serialize(&*db.diagnostic)
            .expect("Should able to serialize Diagnostic");
        let diag_ref = diag.as_ref();

        let ptr = diag_ref.as_ptr() as i32;
        let len = diag_ref.len() as i32;

        #[cfg(target_arch = "wasm32")] // Allow testing
        unsafe {
            __emit_diagnostics(ptr, len);
        }
    }
}

/// global context HANDLER in plugin's transform function.
pub static HANDLER: PseudoScopedKey = PseudoScopedKey {
    inner: OnceCell::new(),
};
