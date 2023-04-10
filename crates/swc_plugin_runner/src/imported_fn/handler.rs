use swc_common::{
    errors::{Diagnostic, HANDLER},
    plugin::serialized::PluginSerializedBytes,
};
use wasmer::FunctionEnvMut;

use crate::{host_environment::BaseHostEnvironment, memory_interop::copy_bytes_into_host};

#[tracing::instrument(level = "info", skip_all)]
pub fn emit_diagnostics(
    env: FunctionEnvMut<BaseHostEnvironment>,
    bytes_ptr: i32,
    bytes_ptr_len: i32,
) {
    let memory = env
        .data()
        .memory
        .as_ref()
        .expect("Memory instance should be available, check initialization");

    if HANDLER.is_set() {
        HANDLER.with(|handler| {
            let diagnostics_bytes =
                copy_bytes_into_host(&memory.view(&env), bytes_ptr, bytes_ptr_len);
            let serialized = PluginSerializedBytes::from_slice(&diagnostics_bytes[..]);
            let diagnostic = PluginSerializedBytes::deserialize::<Diagnostic>(&serialized)
                .expect("Should able to be deserialized into diagnostic");

            let mut builder =
                swc_common::errors::DiagnosticBuilder::new_diagnostic(handler, diagnostic);
            builder.emit();
        })
    }
}
