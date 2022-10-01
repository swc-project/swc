use swc_common::{
    hygiene::MutableMarkContext, plugin::serialized::PluginSerializedBytes, Mark, SyntaxContext,
};

use crate::{host_environment::BaseHostEnvironment, memory_interop::write_into_memory_view};

/// A proxy to Mark::fresh() that can be used in plugin.
/// This it not directly called by plugin, instead `impl Mark` will selectively
/// call this depends on the running context.
pub fn mark_fresh_proxy() -> u32 {
    Mark::fresh().as_u32()
}

#[tracing::instrument(level = "info", skip_all)]
pub fn syntax_context_apply_mark_proxy(self_syntax_context: u32, mark: u32) -> u32 {
    SyntaxContext::from_u32(self_syntax_context)
        .apply_mark(Mark::from_u32(mark))
        .as_u32()
}

#[tracing::instrument(level = "info", skip_all)]
pub fn syntax_context_remove_mark_proxy(
    env: &BaseHostEnvironment,
    self_mark: u32,
    allocated_ptr: i32,
) {
    let mut self_mark = SyntaxContext::from_u32(self_mark);

    let return_value = self_mark.remove_mark();

    if let Some(memory) = env.memory_ref() {
        let context = MutableMarkContext(self_mark.as_u32(), 0, return_value.as_u32());
        let serialized_bytes =
            PluginSerializedBytes::try_serialize(&context).expect("Should be serializable");

        write_into_memory_view(memory, &serialized_bytes, |_| allocated_ptr);
    }
}

#[tracing::instrument(level = "info", skip_all)]
pub fn syntax_context_outer_proxy(self_mark: u32) -> u32 {
    SyntaxContext::from_u32(self_mark).outer().as_u32()
}
