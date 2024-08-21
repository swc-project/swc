use swc_common::{
    hygiene::MutableMarkContext,
    plugin::serialized::{PluginSerializedBytes, VersionedSerializable},
    Mark, SyntaxContext,
};
use wasmer::{AsStoreMut, FunctionEnvMut};

use crate::{host_environment::BaseHostEnvironment, memory_interop::write_into_memory_view};

/// A proxy to Mark::fresh() that can be used in plugin.
/// This it not directly called by plugin, instead `impl Mark` will selectively
/// call this depends on the running context.
pub fn mark_fresh_proxy(parent: u32) -> u32 {
    Mark::fresh(Mark::from_u32(parent)).as_u32()
}

pub fn mark_parent_proxy(self_mark: u32) -> u32 {
    Mark::from_u32(self_mark).parent().as_u32()
}

/// A proxy to Mark::is_descendant_of_() that can be used in plugin.
/// Original call site have mutable param, which we'll pass over as return value
/// via serialized MutableMarkContext.
/// Inside of guest context, once this host function returns it'll assign params
/// with return value accordingly.
#[tracing::instrument(level = "info", skip_all)]
pub fn mark_is_descendant_of_proxy(
    mut env: FunctionEnvMut<BaseHostEnvironment>,
    self_mark: u32,
    ancestor: u32,
    allocated_ptr: u32,
) {
    let memory = env.data().memory.clone();
    let memory = memory
        .as_ref()
        .expect("Memory instance should be available, check initialization");

    let self_mark = Mark::from_u32(self_mark);
    let ancestor = Mark::from_u32(ancestor);

    let return_value = self_mark.is_descendant_of(ancestor);

    let context = VersionedSerializable::new(MutableMarkContext(
        self_mark.as_u32(),
        0,
        return_value as u32,
    ));
    let serialized_bytes =
        PluginSerializedBytes::try_serialize(&context).expect("Should be serializable");

    write_into_memory_view(
        memory,
        &mut env.as_store_mut(),
        &serialized_bytes,
        |_, _| allocated_ptr,
    );
}

#[tracing::instrument(level = "info", skip_all)]
pub fn mark_least_ancestor_proxy(
    mut env: FunctionEnvMut<BaseHostEnvironment>,
    a: u32,
    b: u32,
    allocated_ptr: u32,
) {
    let memory = env.data().memory.clone();
    let memory = memory
        .as_ref()
        .expect("Memory instance should be available, check initialization");

    let a = Mark::from_u32(a);
    let b = Mark::from_u32(b);

    let return_value = Mark::least_ancestor(a, b).as_u32();

    let context =
        VersionedSerializable::new(MutableMarkContext(a.as_u32(), b.as_u32(), return_value));
    let serialized_bytes =
        PluginSerializedBytes::try_serialize(&context).expect("Should be serializable");

    write_into_memory_view(
        memory,
        &mut env.as_store_mut(),
        &serialized_bytes,
        |_, _| allocated_ptr,
    );
}

#[tracing::instrument(level = "info", skip_all)]
pub fn syntax_context_apply_mark_proxy(self_syntax_context: u32, mark: u32) -> u32 {
    SyntaxContext::from_u32(self_syntax_context)
        .apply_mark(Mark::from_u32(mark))
        .as_u32()
}

#[tracing::instrument(level = "info", skip_all)]
pub fn syntax_context_remove_mark_proxy(
    mut env: FunctionEnvMut<BaseHostEnvironment>,
    self_mark: u32,
    allocated_ptr: u32,
) {
    let memory = env.data().memory.clone();
    let memory = memory
        .as_ref()
        .expect("Memory instance should be available, check initialization");

    let mut self_mark = SyntaxContext::from_u32(self_mark);

    let return_value = self_mark.remove_mark();

    let context = VersionedSerializable::new(MutableMarkContext(
        self_mark.as_u32(),
        0,
        return_value.as_u32(),
    ));
    let serialized_bytes =
        PluginSerializedBytes::try_serialize(&context).expect("Should be serializable");

    write_into_memory_view(
        memory,
        &mut env.as_store_mut(),
        &serialized_bytes,
        |_, _| allocated_ptr,
    );
}

#[tracing::instrument(level = "info", skip_all)]
pub fn syntax_context_outer_proxy(self_mark: u32) -> u32 {
    SyntaxContext::from_u32(self_mark).outer().as_u32()
}
