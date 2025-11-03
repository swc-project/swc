use std::sync::Arc;

use parking_lot::Mutex;
use swc_common::plugin::{
    metadata::{TransformPluginMetadataContext, TransformPluginMetadataContextKind},
    serialized::{PluginSerializedBytes, VersionedSerializable},
};

use crate::{
    memory_interop::{allocate_return_values_into_guest, copy_bytes_into_host},
    runtime,
};

#[derive(Clone)]
pub struct MetadataContextHostEnvironment {
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
    caller: &mut dyn runtime::Caller<'_>,
    env: &MetadataContextHostEnvironment,
    bytes_ptr: i32,
    bytes_ptr_len: i32,
) {
    let mut buf = env.mutable_context_key_buffer.lock();
    copy_bytes_into_host(caller, bytes_ptr, bytes_ptr_len, &mut buf);
}

#[tracing::instrument(level = "info", skip_all)]
pub fn get_transform_plugin_config(
    caller: &mut dyn runtime::Caller<'_>,
    env: &MetadataContextHostEnvironment,
    allocated_ret_ptr: u32,
) -> i32 {
    let config_value = env.transform_plugin_config.as_ref();
    if let Some(config_value) = config_value {
        // Lazy as possible as we can - only deserialize json value if transform plugin
        // actually needs it.
        let config = serde_json::to_string(config_value).ok();
        if let Some(config) = config {
            let serialized =
                PluginSerializedBytes::try_serialize(&VersionedSerializable::new(config))
                    .expect("Should be serializable");

            allocate_return_values_into_guest(caller, allocated_ret_ptr, &serialized);

            return 1;
        }
    }
    0
}

#[tracing::instrument(level = "info", skip_all)]
pub fn get_transform_context(
    caller: &mut dyn runtime::Caller<'_>,
    env: &MetadataContextHostEnvironment,
    key: u32,
    allocated_ret_ptr: u32,
) -> i32 {
    let Some(value) = env
        .metadata_context
        .get(&TransformPluginMetadataContextKind::from(key))
    else {
        return 0;
    };
    let value = VersionedSerializable::new(value);
    let serialized = PluginSerializedBytes::try_serialize(&value).expect("Should be serializable");

    allocate_return_values_into_guest(caller, allocated_ret_ptr, &serialized);

    1
}

#[tracing::instrument(level = "info", skip_all)]
pub fn get_experimental_transform_context(
    caller: &mut dyn runtime::Caller<'_>,
    env: &MetadataContextHostEnvironment,
    allocated_ret_ptr: u32,
) -> i32 {
    let context_key_buffer = env.mutable_context_key_buffer.lock();
    let key: String = PluginSerializedBytes::from_bytes(context_key_buffer.clone())
        .deserialize()
        .expect("Should able to deserialize")
        .into_inner();

    let value = env
        .metadata_context
        .experimental
        .get(&key)
        .map(|v| v.to_string());

    if let Some(value) = value {
        let serialized = PluginSerializedBytes::try_serialize(&VersionedSerializable::new(value))
            .expect("Should be serializable");

        allocate_return_values_into_guest(caller, allocated_ret_ptr, &serialized);

        return 1;
    }

    0
}

#[tracing::instrument(level = "info", skip_all)]
pub fn get_raw_experiemtal_transform_context(
    caller: &mut dyn runtime::Caller<'_>,
    env: &MetadataContextHostEnvironment,
    allocated_ret_ptr: u32,
) -> i32 {
    let experimental_context =
        swc_common::plugin::metadata::Context(env.metadata_context.experimental.clone());
    let experimental_context = VersionedSerializable::new(experimental_context);
    let serialized_experimental_context_bytes =
        PluginSerializedBytes::try_serialize(&experimental_context)
            .expect("Should be serializable");

    allocate_return_values_into_guest(
        caller,
        allocated_ret_ptr,
        &serialized_experimental_context_bytes,
    );
    1
}
