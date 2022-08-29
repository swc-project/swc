use std::sync::Arc;

use parking_lot::Mutex;
use wasmer::{LazyInit, Memory};

use crate::memory_interop::copy_bytes_into_host;

/// External environment to read swc_core diagnostics from the host.
#[derive(wasmer::WasmerEnv, Clone)]
pub struct DiagnosticContextHostEnvironment {
    #[wasmer(export)]
    pub memory: wasmer::LazyInit<Memory>,
    /// A buffer to store diagnostics data strings.
    pub core_diag_buffer: Arc<Mutex<Vec<u8>>>,
}

impl DiagnosticContextHostEnvironment {
    pub fn new(core_diag_buffer: &Arc<Mutex<Vec<u8>>>) -> DiagnosticContextHostEnvironment {
        DiagnosticContextHostEnvironment {
            memory: LazyInit::default(),
            core_diag_buffer: core_diag_buffer.clone(),
        }
    }
}

#[tracing::instrument(level = "info", skip_all)]
pub fn set_plugin_core_pkg_diagnostics(
    env: &DiagnosticContextHostEnvironment,
    bytes_ptr: i32,
    bytes_ptr_len: i32,
) {
    let memory = env.memory_ref().expect("Memory should be initialized");
    (*env.core_diag_buffer.lock()) = copy_bytes_into_host(memory, bytes_ptr, bytes_ptr_len);
}
