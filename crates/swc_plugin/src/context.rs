use swc_common::{errors::Diagnostic, plugin::Serialized};

extern "C" {
    fn __emit_diagnostics(bytes_ptr: i32, bytes_ptr_len: i32);
    fn __free(bytes_ptr: i32, size: i32) -> i32;
}

/// Emitter for the Diagnostic in plugin's context by borrowing host's
/// environment context.
pub struct Diagnostics {}

impl Diagnostics {
    pub fn emit(&self, diagnostic: Diagnostic) {
        let diag = Serialized::serialize(&diagnostic).expect("Should able to serialize Diagnostic");
        let diag_ref = diag.as_ref();

        let ptr = diag_ref.as_ptr() as _;
        let len = diag_ref.len() as i32;

        unsafe {
            __emit_diagnostics(ptr, len);
            __free(ptr, len);
        }
    }
}

/// A struct contains set of utility fn to access host environment inside
/// of plugin. This is being used for certain operations such as sending
/// diagnostics back to the host.
pub struct HostContext {
    pub diagnostics: Diagnostics,
}

impl HostContext {
    pub fn new() -> HostContext {
        HostContext {
            diagnostics: Diagnostics {},
        }
    }
}

impl Default for HostContext {
    fn default() -> Self {
        Self::new()
    }
}
