use std::sync::Arc;

use swc_common::plugin::{
    metadata::TransformPluginMetadataContext,
    serialized::{PluginSerializedBytes, VersionedSerializable},
};
use wasmer::{LazyInit, Memory, NativeFunc};

use crate::memory_interop::allocate_return_values_into_guest;

#[derive(wasmer::WasmerEnv, Clone)]
pub struct MetadataContextHostEnvironment {
    #[wasmer(export)]
    pub memory: wasmer::LazyInit<Memory>,
    /// Attached imported fn `__alloc` to the hostenvironment to allow any other
    /// imported fn can allocate guest's memory space from host runtime.
    #[wasmer(export(name = "__alloc"))]
    pub alloc_guest_memory: LazyInit<NativeFunc<u32, i32>>,
    pub metadata_context: Arc<TransformPluginMetadataContext>,
    pub plugin_config: Option<serde_json::Value>,
}

impl MetadataContextHostEnvironment {
    pub fn new(
        metadata_context: Arc<TransformPluginMetadataContext>,
        plugin_config: Option<serde_json::Value>,
    ) -> Self {
        MetadataContextHostEnvironment {
            memory: LazyInit::default(),
            alloc_guest_memory: LazyInit::default(),
            metadata_context,
            plugin_config,
        }
    }
}

pub fn get_raw_experiemtal_transform_context(
    env: &MetadataContextHostEnvironment,
    allocated_ret_ptr: i32,
) -> i32 {
    if let Some(memory) = env.memory_ref() {
        let experimental_context =
            VersionedSerializable::new(env.metadata_context.experimental.clone());
        let serialized_experimental_context_bytes =
            PluginSerializedBytes::try_serialize(&experimental_context)
                .expect("Should be serializable");
        if let Some(alloc_guest_memory) = env.alloc_guest_memory_ref() {
            allocate_return_values_into_guest(
                memory,
                alloc_guest_memory,
                allocated_ret_ptr,
                &serialized_experimental_context_bytes,
            );
            1
        } else {
            0
        }
    } else {
        0
    }
}
