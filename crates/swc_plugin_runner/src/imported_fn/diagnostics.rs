use std::sync::Arc;

use parking_lot::Mutex;

use crate::{memory_interop::copy_bytes_into_host, runtime};

/// External environment to read swc_core diagnostics from the host.
#[derive(Clone)]
pub struct DiagnosticContextHostEnvironment {
    /// A buffer to store diagnostics data strings.
    pub core_diag_buffer: Arc<Mutex<Vec<u8>>>,
}

impl DiagnosticContextHostEnvironment {
    pub fn new(core_diag_buffer: &Arc<Mutex<Vec<u8>>>) -> Self {
        DiagnosticContextHostEnvironment {
            core_diag_buffer: core_diag_buffer.clone(),
        }
    }
}

#[tracing::instrument(level = "info", skip_all)]
pub fn set_plugin_core_pkg_diagnostics(
    caller: &mut dyn runtime::Caller<'_>,
    env: &DiagnosticContextHostEnvironment,
    bytes_ptr: i32,
    bytes_ptr_len: i32,
) {
    let mut buf = env.core_diag_buffer.lock();
    copy_bytes_into_host(caller, bytes_ptr, bytes_ptr_len, &mut buf);
}
