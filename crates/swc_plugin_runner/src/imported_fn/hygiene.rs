use swc_common::{
    hygiene::MutableMarkContext,
    plugin::{PluginSerializedBytes, VersionedSerializable},
    Mark, SyntaxContext,
};

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

pub fn mark_is_builtin_proxy(self_mark: u32) -> u32 {
    Mark::from_u32(self_mark).is_builtin() as u32
}

pub fn mark_set_builtin_proxy(self_mark: u32, is_builtin: u32) {
    Mark::from_u32(self_mark).set_is_builtin(is_builtin != 0);
}

/// A proxy to Mark::is_descendant_of_() that can be used in plugin.
/// Original call site have mutable param, which we'll pass over as return value
/// via serialized MutableMarkContext.
/// Inside of guest context, once this host function returns it'll assign params
/// with return value accordingly.
pub fn mark_is_descendant_of_proxy(
    env: &BaseHostEnvironment,
    self_mark: u32,
    ancestor: u32,
    allocated_ptr: i32,
) {
    let self_mark = Mark::from_u32(self_mark);
    let ancestor = Mark::from_u32(ancestor);

    let return_value = self_mark.is_descendant_of(ancestor);

    if let Some(memory) = env.memory_ref() {
        let context = VersionedSerializable::new(MutableMarkContext(
            self_mark.as_u32(),
            0,
            return_value as u32,
        ));
        let serialized_bytes =
            PluginSerializedBytes::try_serialize(&context).expect("Should be serializable");

        write_into_memory_view(memory, &serialized_bytes, |_| allocated_ptr);
    }
}

pub fn mark_least_ancestor_proxy(env: &BaseHostEnvironment, a: u32, b: u32, allocated_ptr: i32) {
    let a = Mark::from_u32(a);
    let b = Mark::from_u32(b);

    let return_value = Mark::least_ancestor(a, b).as_u32();

    if let Some(memory) = env.memory_ref() {
        let context =
            VersionedSerializable::new(MutableMarkContext(a.as_u32(), b.as_u32(), return_value));
        let serialized_bytes =
            PluginSerializedBytes::try_serialize(&context).expect("Should be serializable");

        write_into_memory_view(memory, &serialized_bytes, |_| allocated_ptr);
    }
}

pub fn syntax_context_apply_mark_proxy(self_syntax_context: u32, mark: u32) -> u32 {
    SyntaxContext::from_u32(self_syntax_context)
        .apply_mark(Mark::from_u32(mark))
        .as_u32()
}

pub fn syntax_context_remove_mark_proxy(
    env: &BaseHostEnvironment,
    self_mark: u32,
    allocated_ptr: i32,
) {
    let mut self_mark = SyntaxContext::from_u32(self_mark);

    let return_value = self_mark.remove_mark();

    if let Some(memory) = env.memory_ref() {
        let context = VersionedSerializable::new(MutableMarkContext(
            self_mark.as_u32(),
            0,
            return_value.as_u32(),
        ));
        let serialized_bytes =
            PluginSerializedBytes::try_serialize(&context).expect("Should be serializable");

        write_into_memory_view(memory, &serialized_bytes, |_| allocated_ptr);
    }
}

pub fn syntax_context_outer_proxy(self_mark: u32) -> u32 {
    SyntaxContext::from_u32(self_mark).outer().as_u32()
}
