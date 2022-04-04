use swc_common::{
    errors::{Diagnostic, HANDLER},
    plugin::Serialized,
};

use crate::{host_environment::BaseHostEnvironment, memory_interop::copy_bytes_into_host};

pub fn emit_diagnostics(env: &BaseHostEnvironment, bytes_ptr: i32, bytes_ptr_len: i32) {
    if let Some(memory) = env.memory_ref() {
        if HANDLER.is_set() {
            HANDLER.with(|handler| {
                let diagnostics_bytes = copy_bytes_into_host(memory, bytes_ptr, bytes_ptr_len);
                let serialized = Serialized::new_for_plugin(&diagnostics_bytes[..], bytes_ptr_len);
                let diagnostic = Serialized::deserialize::<Diagnostic>(&serialized)
                    .expect("Should able to be deserialized into diagnsotic");

                let mut builder =
                    swc_common::errors::DiagnosticBuilder::new_diagnostic(handler, diagnostic);
                builder.emit();
            })
        }
    }
}
