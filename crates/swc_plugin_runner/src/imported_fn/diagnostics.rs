use std::sync::Arc;

use parking_lot::Mutex;
use wasmer::{FunctionEnvMut, Memory};

use crate::memory_interop::copy_bytes_into_host;

/// External environment to read swc_core diagnostics from the host.
#[derive(Clone)]
pub struct DiagnosticContextHostEnvironment {
    pub memory: Option<Memory>,
    /// A buffer to store diagnostics data strings.
    pub core_diag_buffer: Arc<Mutex<Vec<u8>>>,
}

impl DiagnosticContextHostEnvironment {
    pub fn new(core_diag_buffer: &Arc<Mutex<Vec<u8>>>) -> Self {
        DiagnosticContextHostEnvironment {
            memory: None,
            core_diag_buffer: core_diag_buffer.clone(),
        }
    }
}

#[tracing::instrument(level = "info", skip_all)]
pub fn set_plugin_core_pkg_diagnostics(
    mut env: FunctionEnvMut<DiagnosticContextHostEnvironment>,
    bytes_ptr: i32,
    bytes_ptr_len: i32,
) {
    let memory = env
        .data()
        .memory
        .as_ref()
        .expect("Memory instance should be available, check initialization");

    (*env.data_mut().core_diag_buffer.lock()) =
        copy_bytes_into_host(&memory.view(&env), bytes_ptr, bytes_ptr_len);
}
