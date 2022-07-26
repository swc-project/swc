use std::sync::Arc;

use parking_lot::Mutex;
use swc_common::plugin::{
    metadata::TransformPluginMetadataContext,
    serialized::{PluginSerializedBytes, VersionedSerializable},
};
use wasmer::{LazyInit, Memory, NativeFunc};

use crate::memory_interop::{allocate_return_values_into_guest, copy_bytes_into_host};

#[derive(wasmer::WasmerEnv, Clone)]
pub struct MetadataContextHostEnvironment {
    #[wasmer(export)]
    pub memory: wasmer::LazyInit<Memory>,
    /// Attached imported fn `__alloc` to the hostenvironment to allow any other
    /// imported fn can allocate guest's memory space from host runtime.
    #[wasmer(export(name = "__alloc"))]
    pub alloc_guest_memory: LazyInit<NativeFunc<u32, i32>>,
    pub metadata_context: Arc<TransformPluginMetadataContext>,
    pub transform_plugin_config: Option<serde_json::Value>,
    /// A buffer to string key to the context plugin need to pass to the host.
    pub mutable_context_key_buffer: Arc<Mutex<Vec<u8>>>,
}

impl MetadataContextHostEnvironment {
    pub fn new(
        metadata_context: &Arc<TransformPluginMetadataContext>,
        plugin_config: &Option<serde_json::Value>,
        mutable_context_key_buffer: &Arc<Mutex<Vec<u8>>>,
    ) -> Self {
        MetadataContextHostEnvironment {
            memory: LazyInit::default(),
            alloc_guest_memory: LazyInit::default(),
            metadata_context: metadata_context.clone(),
            transform_plugin_config: plugin_config.clone(),
            mutable_context_key_buffer: mutable_context_key_buffer.clone(),
        }
    }
}

/// Copy given serialized byte into host's comment buffer, subsequent proxy call
/// in the host can read it.
pub fn copy_context_key_to_host_env(
    env: &MetadataContextHostEnvironment,
    bytes_ptr: i32,
    bytes_ptr_len: i32,
) {
    if let Some(memory) = env.memory_ref() {
        (*env.mutable_context_key_buffer.lock()) =
            copy_bytes_into_host(memory, bytes_ptr, bytes_ptr_len);
    }
}

pub fn get_transform_plugin_config(
    env: &MetadataContextHostEnvironment,
    allocated_ret_ptr: i32,
) -> i32 {
    if let Some(memory) = env.memory_ref() {
        if let Some(alloc_guest_memory) = env.alloc_guest_memory_ref() {
            let config_value = &env.transform_plugin_config;
            if let Some(config_value) = config_value {
                // Lazy as possible as we can - only deserialize json value if transform plugin
                // actually needs it.
                let config = serde_json::to_string(config_value).ok();
                if let Some(config) = config {
                    let value = VersionedSerializable::new(config);
                    let serialized = PluginSerializedBytes::try_serialize(&value)
                        .expect("Should be serializable");

                    allocate_return_values_into_guest(
                        memory,
                        alloc_guest_memory,
                        allocated_ret_ptr,
                        &serialized,
                    );

                    return 1;
                }
            }
        }
    }
    0
}

pub fn get_experimental_transform_context(
    env: &MetadataContextHostEnvironment,
    allocated_ret_ptr: i32,
) -> i32 {
    if let Some(memory) = env.memory_ref() {
        if let Some(alloc_guest_memory) = env.alloc_guest_memory_ref() {
            let context_key_buffer = &*env.mutable_context_key_buffer.lock();
            let key: VersionedSerializable<String> =
                PluginSerializedBytes::from_slice(&context_key_buffer[..])
                    .deserialize()
                    .expect("Should able to deserialize");

            let value = env
                .metadata_context
                .experimental
                .get(key.inner())
                .map(|v| v.to_string());

            if let Some(value) = value {
                let value = VersionedSerializable::new(value);
                let serialized =
                    PluginSerializedBytes::try_serialize(&value).expect("Should be serializable");

                allocate_return_values_into_guest(
                    memory,
                    alloc_guest_memory,
                    allocated_ret_ptr,
                    &serialized,
                );

                return 1;
            }
        }
    }
    0
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
