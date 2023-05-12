use std::sync::Arc;

use anyhow::{anyhow, Error};
use parking_lot::Mutex;
#[cfg(feature = "__rkyv")]
use swc_common::plugin::serialized::{PluginError, PluginSerializedBytes};
#[cfg(any(
    feature = "plugin_transform_schema_v1",
    feature = "plugin_transform_schema_vtest"
))]
use swc_common::plugin::PLUGIN_TRANSFORM_AST_SCHEMA_VERSION;
use swc_common::{
    plugin::{diagnostics::PluginCorePkgDiagnostics, metadata::TransformPluginMetadataContext},
    SourceMap,
};
use wasmer::{AsStoreMut, Instance, Store, TypedFunction};
use wasmer_wasix::WasiFunctionEnv;

#[cfg(feature = "__rkyv")]
use crate::memory_interop::write_into_memory_view;

/// Creates an instnace of [Store].
///
/// This function exists because we need to disable simd.
#[cfg(not(target_arch = "wasm32"))]
#[allow(unused_mut)]
fn new_store() -> Store {
    // Use empty enumset to disable simd.
    use enumset::EnumSet;
    use wasmer::{BaseTunables, CompilerConfig, EngineBuilder, Target, Triple};
    let mut set = EnumSet::new();

    // [TODO]: Should we use is_x86_feature_detected! macro instead?
    #[cfg(target_arch = "x86_64")]
    set.insert(wasmer::CpuFeature::SSE2);
    let target = Target::new(Triple::host(), set);

    let config = wasmer_compiler_cranelift::Cranelift::default();
    let mut engine = EngineBuilder::new(Box::new(config) as Box<dyn CompilerConfig>)
        .set_target(Some(target))
        .engine();
    let tunables = BaseTunables::for_target(engine.target());
    engine.set_tunables(tunables);

    Store::new(engine)
}

#[cfg(target_arch = "wasm32")]
fn new_store() -> Store {
    Store::default()
}

/// A struct encapsule executing a plugin's transform interop to its teardown
pub struct TransformExecutor {
    // Main transform interface plugin exports
    exported_plugin_transform: TypedFunction<(u32, u32, u32, u32), u32>,
    // `__free` function automatically exported via swc_plugin sdk to allow deallocation in guest
    // memory space
    exported_plugin_free: TypedFunction<(u32, u32), u32>,
    // `__alloc` function automatically exported via swc_plugin sdk to allow allocation in guest
    // memory space
    exported_plugin_alloc: TypedFunction<u32, u32>,
    wasi_env: Option<WasiFunctionEnv>,
    instance: Instance,
    store: Store,
    // Reference to the pointers successfully allocated which'll be freed by Drop.
    allocated_ptr_vec: Vec<(u32, u32)>,
    transform_result: Arc<Mutex<Vec<u8>>>,
    // diagnostic metadata for the swc_core plugin binary uses.
    pub plugin_core_diag: PluginCorePkgDiagnostics,
}

#[cfg(feature = "__rkyv")]
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
        let mut store = new_store();

        let (instance, transform_result, diagnostics_buffer, wasi_env) =
            crate::load_plugin::load_plugin(
                &mut store,
                path,
                cache,
                source_map,
                metadata_context,
                plugin_config,
            )?;

        let executor = TransformExecutor {
            exported_plugin_transform: instance
                .exports
                .get_typed_function(&store, "__transform_plugin_process_impl")?,
            exported_plugin_free: instance.exports.get_typed_function(&store, "__free")?,
            exported_plugin_alloc: instance.exports.get_typed_function(&store, "__alloc")?,
            instance,
            store,
            wasi_env,
            allocated_ptr_vec: Vec::with_capacity(3),
            transform_result,
            plugin_core_diag: diagnostics_buffer,
        };

        Ok(executor)
    }

    /// Copy host's serialized bytes into guest (plugin)'s allocated memory.
    /// Once transformation completes, host should free allocated memory.
    #[tracing::instrument(level = "info", skip_all)]
    fn write_bytes_into_guest(
        &mut self,
        serialized_bytes: &PluginSerializedBytes,
    ) -> Result<(u32, u32), Error> {
        let memory = self.instance.exports.get_memory("memory")?;

        let ptr = write_into_memory_view(
            memory,
            &mut self.store.as_store_mut(),
            serialized_bytes,
            |s, serialized_len| {
                self.exported_plugin_alloc
                    .call(s, serialized_len.try_into().expect("booo"))
                    .unwrap_or_else(|_| {
                        panic!(
                            "Should able to allocate memory for the size of {}",
                            serialized_len
                        )
                    })
            },
        );

        self.allocated_ptr_vec.push(ptr);
        Ok(ptr)
    }

    /// Copy guest's memory into host, construct serialized struct from raw
    /// bytes.
    fn read_transformed_result_bytes_from_guest(
        &mut self,
        returned_ptr_result: u32,
    ) -> Result<PluginSerializedBytes, Error> {
        let transformed_result = &(*self.transform_result.lock());
        let ret = PluginSerializedBytes::from_slice(&transformed_result[..]);

        if returned_ptr_result == 0 {
            Ok(ret)
        } else {
            let err: PluginError = ret.deserialize()?.into_inner();
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
    pub fn is_transform_schema_compatible(&mut self) -> Result<bool, Error> {
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
        let should_enable_comments_proxy = u32::from(should_enable_comments_proxy);
        let guest_program_ptr = self.write_bytes_into_guest(program)?;

        let result = self.exported_plugin_transform.call(
            &mut self.store,
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
                .call(&mut self.store, ptr.0, ptr.1)
                .expect("Failed to free memory allocated in the plugin");
        }

        if let Some(wasi_env) = &self.wasi_env {
            wasi_env.cleanup(&mut self.store, None);
        }
    }
}
