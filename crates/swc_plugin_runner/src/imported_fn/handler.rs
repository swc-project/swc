use swc_common::{
    errors::{Diagnostic, HANDLER},
    plugin::serialized::PluginSerializedBytes,
};
use swc_transform_common::output::experimental_emit;

use crate::{host_environment::BaseHostEnvironment, memory_interop::copy_bytes_into_host, runtime};

#[tracing::instrument(level = "info", skip_all)]
pub fn emit_diagnostics(
    caller: &mut dyn runtime::Caller<'_>,
    _env: &BaseHostEnvironment,
    bytes_ptr: i32,
    bytes_ptr_len: i32,
) {
    if HANDLER.is_set() {
        HANDLER.with(|handler| {
            let mut diagnostics_bytes = Vec::new();
            copy_bytes_into_host(caller, bytes_ptr, bytes_ptr_len, &mut diagnostics_bytes);
            let serialized = PluginSerializedBytes::from_bytes(diagnostics_bytes);
            let diagnostic = PluginSerializedBytes::deserialize::<Diagnostic>(&serialized)
                .expect("Should able to be deserialized into diagnostic");

            let mut builder = swc_common::errors::DiagnosticBuilder::new_diagnostic(
                handler,
                diagnostic.into_inner(),
            );
            builder.emit();
        })
    }
}

pub fn emit_output(
    caller: &mut dyn runtime::Caller<'_>,
    _env: &BaseHostEnvironment,
    output_ptr: i32,
    output_len: i32,
) {
    let mut output_bytes = Vec::new();
    copy_bytes_into_host(caller, output_ptr, output_len, &mut output_bytes);
    let serialized = PluginSerializedBytes::from_bytes(output_bytes);
    let output = PluginSerializedBytes::deserialize::<swc_common::plugin::emit::PluginEmitOutput>(
        &serialized,
    )
    .expect("Should able to be deserialized into string");

    experimental_emit(output.0.key, output.0.value);
}
