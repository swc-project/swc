use std::sync::Arc;

use anyhow::{anyhow, Error};
use parking_lot::Mutex;
#[cfg(any(
    feature = "plugin_transform_schema_v1",
    feature = "plugin_transform_schema_vtest"
))]
use swc_common::plugin::PLUGIN_TRANSFORM_AST_SCHEMA_VERSION;
use swc_common::{
    plugin::{
        diagnostics::PluginCorePkgDiagnostics,
        metadata::TransformPluginMetadataContext,
        serialized::{PluginError, PluginSerializedBytes},
    },
    SourceMap,
};
use wasmer::Instance;

use crate::memory_interop::write_into_memory_view;

/// A struct encapsule executing a plugin's transform interop to its teardown
pub struct TransformExecutor {
    // Main transform interface plugin exports
    exported_plugin_transform: wasmer::NativeFunc<(i32, i32, u32, i32), i32>,
    // `__free` function automatically exported via swc_plugin sdk to allow deallocation in guest
    // memory space
    exported_plugin_free: wasmer::NativeFunc<(i32, i32), i32>,
    // `__alloc` function automatically exported via swc_plugin sdk to allow allocation in guest
    // memory space
    exported_plugin_alloc: wasmer::NativeFunc<u32, i32>,
    instance: Instance,
    // Reference to the pointers successfully allocated which'll be freed by Drop.
    allocated_ptr_vec: Vec<(i32, i32)>,
    transform_result: Arc<Mutex<Vec<u8>>>,
    // diagnostic metadata for the swc_core plugin binary uses.
    pub plugin_core_diag: PluginCorePkgDiagnostics,
}

impl TransformExecutor {
    #[tracing::instrument(
        level = "info",
        skip(cache, source_map, metadata_context, plugin_config)
    )]
    pub fn new(
        path: &std::path::Path,
        cache: &once_cell::sync::Lazy<crate::cache::PluginModuleCache>,
        source_map: &Arc<SourceMap>,
        metadata_context: &Arc<TransformPluginMetadataContext>,
        plugin_config: Option<serde_json::Value>,
    ) -> Result<TransformExecutor, Error> {
        let transform_result = Arc::new(Mutex::new(vec![]));
        let core_diag_buffer = Arc::new(Mutex::new(vec![]));

        let instance = crate::load_plugin::load_plugin(
            path,
            cache,
            source_map,
            metadata_context,
            plugin_config,
            &transform_result,
            &core_diag_buffer,
        )?;

        // As soon as instance is ready, host calls a fn to read plugin's swc_core pkg
        // diagnostics as `handshake`. Once read those values will be available across
        // whole plugin transform execution.

        // IMPORTANT NOTE
        // Note this is `handshake`, which we expect to success ALL TIME. Do not try to
        // expand `PluginCorePkgDiagnostics` as it'll cause deserialization failure
        // until we have forward-compat schema changes.
        instance
            .exports
            .get_native_function::<(), i32>("__get_transform_plugin_core_pkg_diag")?
            .call()?;

        let diag_result: PluginCorePkgDiagnostics =
            PluginSerializedBytes::from_slice(&(&(*core_diag_buffer.lock()))[..]).deserialize()?;

        let tracker = TransformExecutor {
            exported_plugin_transform: instance
                .exports
                .get_native_function::<(i32, i32, u32, i32), i32>(
                    "__transform_plugin_process_impl",
                )?,
            exported_plugin_free: instance
                .exports
                .get_native_function::<(i32, i32), i32>("__free")?,
            exported_plugin_alloc: instance
                .exports
                .get_native_function::<u32, i32>("__alloc")?,
            instance,
            allocated_ptr_vec: Vec::with_capacity(3),
            transform_result,
            plugin_core_diag: diag_result,
        };

        Ok(tracker)
    }

    /// Copy host's serialized bytes into guest (plugin)'s allocated memory.
    /// Once transformation completes, host should free allocated memory.
    #[tracing::instrument(level = "info", skip_all)]
    fn write_bytes_into_guest(
        &mut self,
        serialized_bytes: &PluginSerializedBytes,
    ) -> Result<(i32, i32), Error> {
        let memory = self.instance.exports.get_memory("memory")?;

        let ptr = write_into_memory_view(memory, serialized_bytes, |serialized_len| {
            self.exported_plugin_alloc
                .call(serialized_len.try_into().expect(""))
                .expect("")
        });

        self.allocated_ptr_vec.push(ptr);
        Ok(ptr)
    }

    /// Copy guest's memory into host, construct serialized struct from raw
    /// bytes.
    fn read_transformed_result_bytes_from_guest(
        &mut self,
        returned_ptr_result: i32,
    ) -> Result<PluginSerializedBytes, Error> {
        let transformed_result = &(*self.transform_result.lock());
        let ret = PluginSerializedBytes::from_slice(&transformed_result[..]);

        if returned_ptr_result == 0 {
            Ok(ret)
        } else {
            let err: PluginError = ret.deserialize()?;
            match err {
                PluginError::SizeInteropFailure(msg) => Err(anyhow!(
                    "Failed to convert pointer size to calculate: {}",
                    msg
                )),
                PluginError::Deserialize(msg) | PluginError::Serialize(msg) => {
                    Err(anyhow!("{}", msg))
                }
                _ => Err(anyhow!(
                    "Unexpected error occurred while running plugin transform"
                )),
            }
        }
    }

    /**
     * Check compile-time version of AST schema between the plugin and
     * the host. Returns true if it's compatible, false otherwise.
     *
     * Host should appropriately handle if plugin is not compatible to the
     * current runtime.
     */
    #[allow(unreachable_code)]
    pub fn is_transform_schema_compatible(&self) -> Result<bool, Error> {
        #[cfg(any(
            feature = "plugin_transform_schema_v1",
            feature = "plugin_transform_schema_vtest"
        ))]
        return {
            let host_schema_version = PLUGIN_TRANSFORM_AST_SCHEMA_VERSION;

            // TODO: this is incomplete
            if host_schema_version >= self.plugin_core_diag.ast_schema_version {
                Ok(true)
            } else {
                Ok(false)
            }
        };

        #[cfg(not(all(
            feature = "plugin_transform_schema_v1",
            feature = "plugin_transform_schema_vtest"
        )))]
        anyhow::bail!(
            "Plugin runner cannot detect plugin's schema version. Ensure host is compiled with \
             proper versions"
        )
    }

    #[tracing::instrument(level = "info", skip_all)]
    pub fn transform(
        &mut self,
        program: &PluginSerializedBytes,
        unresolved_mark: swc_common::Mark,
        should_enable_comments_proxy: bool,
    ) -> Result<PluginSerializedBytes, Error> {
        let should_enable_comments_proxy = if should_enable_comments_proxy { 1 } else { 0 };
        let guest_program_ptr = self.write_bytes_into_guest(program)?;

        let result = self.exported_plugin_transform.call(
            guest_program_ptr.0,
            guest_program_ptr.1,
            unresolved_mark.as_u32(),
            should_enable_comments_proxy,
        )?;

        self.read_transformed_result_bytes_from_guest(result)
    }
}

impl Drop for TransformExecutor {
    fn drop(&mut self) {
        for ptr in self.allocated_ptr_vec.iter() {
            self.exported_plugin_free
                .call(ptr.0, ptr.1)
                .expect("Failed to free memory allocated in the plugin");
        }
    }
}
