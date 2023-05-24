use std::sync::Arc;

use parking_lot::Mutex;
use swc_common::plugin::{
    metadata::{TransformPluginMetadataContext, TransformPluginMetadataContextKind},
    serialized::{PluginSerializedBytes, VersionedSerializable},
};
use wasmer::{AsStoreMut, FunctionEnvMut, Memory, TypedFunction};

use crate::memory_interop::{allocate_return_values_into_guest, copy_bytes_into_host};

#[derive(Clone)]
pub struct MetadataContextHostEnvironment {
    pub memory: Option<Memory>,
    /// Attached imported fn `__alloc` to the hostenvironment to allow any other
    /// imported fn can allocate guest's memory space from host runtime.
    pub alloc_guest_memory: Option<TypedFunction<u32, u32>>,
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
            memory: None,
            alloc_guest_memory: None,
            metadata_context: metadata_context.clone(),
            transform_plugin_config: plugin_config.clone(),
            mutable_context_key_buffer: mutable_context_key_buffer.clone(),
        }
    }
}

/// Copy given serialized byte into host's comment buffer, subsequent proxy call
/// in the host can read it.
#[tracing::instrument(level = "info", skip_all)]
pub fn copy_context_key_to_host_env(
    mut env: FunctionEnvMut<MetadataContextHostEnvironment>,
    bytes_ptr: i32,
    bytes_ptr_len: i32,
) {
    let memory = env
        .data()
        .memory
        .as_ref()
        .expect("Memory instance should be available, check initialization");

    (*env.data_mut().mutable_context_key_buffer.lock()) =
        copy_bytes_into_host(&memory.view(&env), bytes_ptr, bytes_ptr_len);
}

#[tracing::instrument(level = "info", skip_all)]
pub fn get_transform_plugin_config(
    mut env: FunctionEnvMut<MetadataContextHostEnvironment>,
    allocated_ret_ptr: u32,
) -> i32 {
    let memory = env.data().memory.clone();
    let memory = memory
        .as_ref()
        .expect("Memory instance should be available, check initialization");

    let alloc_guest_memory = env.data().alloc_guest_memory.clone();
    let alloc_guest_memory = alloc_guest_memory
        .as_ref()
        .expect("Alloc guest memory fn should be available, check initialization");

    let config_value = &env.data().transform_plugin_config;
    if let Some(config_value) = config_value {
        // Lazy as possible as we can - only deserialize json value if transform plugin
        // actually needs it.
        let config = serde_json::to_string(config_value).ok();
        if let Some(config) = config {
            let serialized =
                PluginSerializedBytes::try_serialize(&VersionedSerializable::new(config))
                    .expect("Should be serializable");

            allocate_return_values_into_guest(
                memory,
                &mut env.as_store_mut(),
                alloc_guest_memory,
                allocated_ret_ptr,
                &serialized,
            );

            return 1;
        }
    }
    0
}

#[tracing::instrument(level = "info", skip_all)]
pub fn get_transform_context(
    mut env: FunctionEnvMut<MetadataContextHostEnvironment>,
    key: u32,
    allocated_ret_ptr: u32,
) -> i32 {
    let memory = env.data().memory.clone();
    let memory = memory
        .as_ref()
        .expect("Memory instance should be available, check initialization");

    let alloc_guest_memory = env.data().alloc_guest_memory.clone();
    let alloc_guest_memory = alloc_guest_memory
        .as_ref()
        .expect("Alloc guest memory fn should be available, check initialization");

    let value = VersionedSerializable::new(
        env.data()
            .metadata_context
            .get(&TransformPluginMetadataContextKind::from(key)),
    );

    let serialized = PluginSerializedBytes::try_serialize(&value).expect("Should be serializable");

    allocate_return_values_into_guest(
        memory,
        &mut env.as_store_mut(),
        alloc_guest_memory,
        allocated_ret_ptr,
        &serialized,
    );

    1
}

#[tracing::instrument(level = "info", skip_all)]
pub fn get_experimental_transform_context(
    mut env: FunctionEnvMut<MetadataContextHostEnvironment>,
    allocated_ret_ptr: u32,
) -> i32 {
    let memory = env.data().memory.clone();
    let memory = memory
        .as_ref()
        .expect("Memory instance should be available, check initialization");

    let alloc_guest_memory = env.data().alloc_guest_memory.clone();
    let alloc_guest_memory = alloc_guest_memory
        .as_ref()
        .expect("Alloc guest memory fn should be available, check initialization");

    let context_key_buffer = env.data().mutable_context_key_buffer.lock().clone();
    let key: String = PluginSerializedBytes::from_slice(&context_key_buffer[..])
        .deserialize()
        .expect("Should able to deserialize")
        .into_inner();

    let value = env
        .data()
        .metadata_context
        .experimental
        .get(&key)
        .map(|v| v.to_string());

    if let Some(value) = value {
        let serialized = PluginSerializedBytes::try_serialize(&VersionedSerializable::new(value))
            .expect("Should be serializable");

        allocate_return_values_into_guest(
            memory,
            &mut env.as_store_mut(),
            alloc_guest_memory,
            allocated_ret_ptr,
            &serialized,
        );

        return 1;
    }

    0
}

#[tracing::instrument(level = "info", skip_all)]
pub fn get_raw_experiemtal_transform_context(
    mut env: FunctionEnvMut<MetadataContextHostEnvironment>,
    allocated_ret_ptr: u32,
) -> i32 {
    let memory = env.data().memory.clone();
    let memory = memory
        .as_ref()
        .expect("Memory instance should be available, check initialization");

    let alloc_guest_memory = env.data().alloc_guest_memory.clone();
    let alloc_guest_memory = alloc_guest_memory
        .as_ref()
        .expect("Alloc guest memory fn should be available, check initialization");

    let experimental_context =
        VersionedSerializable::new(env.data().metadata_context.experimental.clone());
    let serialized_experimental_context_bytes =
        PluginSerializedBytes::try_serialize(&experimental_context)
            .expect("Should be serializable");

    allocate_return_values_into_guest(
        memory,
        &mut env.as_store_mut(),
        alloc_guest_memory,
        allocated_ret_ptr,
        &serialized_experimental_context_bytes,
    );
    1
}
