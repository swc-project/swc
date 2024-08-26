use std::{env, sync::Arc};

use anyhow::{anyhow, Context, Error};
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
use wasmer::{AsStoreMut, FunctionEnv, Instance, Store, TypedFunction};
use wasmer_wasix::{default_fs_backing, is_wasi_module, Runtime, WasiEnv, WasiFunctionEnv};

#[cfg(feature = "__rkyv")]
use crate::{
    host_environment::BaseHostEnvironment,
    imported_fn::{
        build_import_object, comments::CommentHostEnvironment,
        diagnostics::DiagnosticContextHostEnvironment,
        metadata_context::MetadataContextHostEnvironment,
        set_transform_result::TransformResultHostEnvironment, source_map::SourceMapHostEnvironment,
    },
    memory_interop::write_into_memory_view,
};
use crate::{plugin_module_bytes::PluginModuleBytes, wasix_runtime::build_wasi_runtime};

/// An internal state to the plugin transform.
struct PluginTransformState {
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
    transform_result: Arc<Mutex<Vec<u8>>>,
    #[allow(unused)]
    plugin_core_diag: PluginCorePkgDiagnostics,
}

#[cfg(feature = "__rkyv")]
impl PluginTransformState {
    fn run(
        &mut self,
        program: &PluginSerializedBytes,
        unresolved_mark: swc_common::Mark,
        should_enable_comments_proxy: Option<bool>,
    ) -> Result<PluginSerializedBytes, Error> {
        let memory = self.instance.exports.get_memory("memory")?;

        let should_enable_comments_proxy =
            u32::from(should_enable_comments_proxy.unwrap_or_default());

        // Copy host's serialized bytes into guest (plugin)'s allocated memory.
        let guest_program_ptr = write_into_memory_view(
            memory,
            &mut self.store.as_store_mut(),
            program,
            |s, serialized_len| {
                self.exported_plugin_alloc
                    .call(
                        s,
                        serialized_len
                            .try_into()
                            .expect("Should able to convert size"),
                    )
                    .unwrap_or_else(|_| {
                        panic!(
                            "Should able to allocate memory for the size of {}",
                            serialized_len
                        )
                    })
            },
        );

        let returned_ptr_result = self.exported_plugin_transform.call(
            &mut self.store,
            guest_program_ptr.0,
            guest_program_ptr.1,
            unresolved_mark.as_u32(),
            should_enable_comments_proxy,
        )?;

        // Copy guest's memory into host, construct serialized struct from raw
        // bytes.
        let transformed_result = &(*self.transform_result.lock());
        let ret = PluginSerializedBytes::from_slice(&transformed_result[..]);

        let ret = if returned_ptr_result == 0 {
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
        };

        self.exported_plugin_free.call(
            &mut self.store,
            guest_program_ptr.0,
            guest_program_ptr.1,
        )?;

        // [TODO]: disabled for now as it always panic if it is being called
        // inside of tokio runtime
        // https://github.com/wasmerio/wasmer/discussions/3966
        // [NOTE]: this is not a critical as plugin does not have things to clean up
        // in most cases
        if let Some(_wasi_env) = &self.wasi_env {
            //wasi_env.cleanup(&mut self.store, None);
        }

        ret
    }

    /**
     * Check compile-time version of AST schema between the plugin and
     * the host. Returns true if it's compatible, false otherwise.
     *
     * Host should appropriately handle if plugin is not compatible to the
     * current runtime.
     */
    #[allow(unreachable_code)]
    pub fn is_transform_schema_compatible(&mut self) -> Result<(), Error> {
        #[cfg(any(
            feature = "plugin_transform_schema_v1",
            feature = "plugin_transform_schema_vtest"
        ))]
        return {
            let host_schema_version = PLUGIN_TRANSFORM_AST_SCHEMA_VERSION;

            // TODO: this is incomplete
            if host_schema_version >= self.plugin_core_diag.ast_schema_version {
                Ok(())
            } else {
                anyhow::bail!(
                    "Plugin's AST schema version is not compatible with host's. Host: {}, Plugin: \
                     {}",
                    host_schema_version,
                    self.plugin_core_diag.ast_schema_version
                )
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
}

/// A struct encapsule executing a plugin's transform.
pub struct TransformExecutor {
    source_map: Arc<SourceMap>,
    unresolved_mark: swc_common::Mark,
    metadata_context: Arc<TransformPluginMetadataContext>,
    plugin_config: Option<serde_json::Value>,
    module_bytes: Box<dyn PluginModuleBytes>,
    runtime: Option<Arc<dyn Runtime + Send + Sync>>,
}

#[cfg(feature = "__rkyv")]
impl TransformExecutor {
    #[tracing::instrument(
        level = "info",
        skip(source_map, metadata_context, plugin_config, module_bytes)
    )]
    pub fn new(
        module_bytes: Box<dyn PluginModuleBytes>,
        source_map: &Arc<SourceMap>,
        unresolved_mark: &swc_common::Mark,
        metadata_context: &Arc<TransformPluginMetadataContext>,
        plugin_config: Option<serde_json::Value>,
        runtime: Option<Arc<dyn Runtime + Send + Sync>>,
    ) -> Self {
        let runtime = if runtime.is_some() {
            runtime
        } else {
            // https://github.com/wasmerio/wasmer/issues/4029
            // prevent to wasienvbuilder invoke default PluggableRuntime::new which causes
            // unexpected failure
            build_wasi_runtime(None)
        };

        Self {
            source_map: source_map.clone(),
            unresolved_mark: *unresolved_mark,
            metadata_context: metadata_context.clone(),
            plugin_config,
            module_bytes,
            runtime,
        }
    }

    // Import, export, and create memory for the plugin to communicate between host
    // and guest then acquire necessary exports from the plugin.
    fn setup_plugin_env_exports(&mut self) -> Result<PluginTransformState, Error> {
        // First, compile plugin module bytes into wasmer::Module and get the
        // corresponding store
        let (mut store, module) = self.module_bytes.compile_module()?;

        let context_key_buffer = Arc::new(Mutex::new(Vec::new()));
        let metadata_env = FunctionEnv::new(
            &mut store,
            MetadataContextHostEnvironment::new(
                &self.metadata_context,
                &self.plugin_config,
                &context_key_buffer,
            ),
        );

        let transform_result: Arc<Mutex<Vec<u8>>> = Arc::new(Mutex::new(Vec::new()));
        let transform_env = FunctionEnv::new(
            &mut store,
            TransformResultHostEnvironment::new(&transform_result),
        );

        let base_env = FunctionEnv::new(&mut store, BaseHostEnvironment::new());

        let comment_buffer = Arc::new(Mutex::new(Vec::new()));

        let comments_env =
            FunctionEnv::new(&mut store, CommentHostEnvironment::new(&comment_buffer));

        let source_map_buffer = Arc::new(Mutex::new(Vec::new()));
        let source_map = Arc::new(Mutex::new(self.source_map.clone()));

        let source_map_host_env = FunctionEnv::new(
            &mut store,
            SourceMapHostEnvironment::new(&source_map, &source_map_buffer),
        );

        let diagnostics_buffer: Arc<Mutex<Vec<u8>>> = Arc::new(Mutex::new(Vec::new()));
        let diagnostics_env = FunctionEnv::new(
            &mut store,
            DiagnosticContextHostEnvironment::new(&diagnostics_buffer),
        );

        let mut import_object = build_import_object(
            &mut store,
            &metadata_env,
            &transform_env,
            &base_env,
            &comments_env,
            &source_map_host_env,
            &diagnostics_env,
        );

        // Plugin binary can be either wasm32-wasi or wasm32-unknown-unknown.
        // Wasi specific env need to be initialized if given module targets wasm32-wasi.
        // TODO: wasm host native runtime throws 'Memory should be set on `WasiEnv`
        // first'
        let (instance, wasi_env) = if is_wasi_module(&module) {
            let builder = WasiEnv::builder(self.module_bytes.get_module_name());
            let builder = if let Some(runtime) = &self.runtime {
                builder.runtime(runtime.clone())
            } else {
                builder
            };

            // Implicitly enable filesystem access for the wasi plugin to cwd.
            //
            // This allows wasi plugin can read arbitary data (i.e node_modules) or produce
            // output for post process (i.e .lcov coverage data) directly.
            //
            // TODO: this is not finalized decision
            // - should we support this?
            // - can we limit to allowlisted input / output only?
            // - should there be a top-level config from .swcrc to manually override this?
            let wasi_env_builder = if let Ok(cwd) = env::current_dir() {
                builder
                    .fs(default_fs_backing())
                    .map_dirs(vec![("/cwd".to_string(), cwd)].drain(..))?
            } else {
                builder
            };

            //create the `WasiEnv`
            let mut wasi_env = wasi_env_builder.finalize(&mut store)?;

            // Then, we get the import object related to our WASI,
            // overwrite into imported_object
            // and attach it to the Wasm instance.
            let wasi_env_import_object = wasi_env.import_object(&mut store, &module)?;
            import_object.extend(&wasi_env_import_object);

            let instance = Instance::new(&mut store, &module, &import_object)?;

            wasi_env.initialize(&mut store, instance.clone())?;

            (instance, Some(wasi_env))
        } else {
            (Instance::new(&mut store, &module, &import_object)?, None)
        };

        // Attach the memory export
        let memory = instance.exports.get_memory("memory")?;
        import_object.define("env", "memory", memory.clone());

        let alloc = instance.exports.get_typed_function(&store, "__alloc")?;

        // Unlike wasmer@2, have to manually `import` memory / necessary functions from
        // the guest into env.
        metadata_env.as_mut(&mut store).memory = Some(memory.clone());
        metadata_env.as_mut(&mut store).alloc_guest_memory = Some(alloc.clone());

        transform_env.as_mut(&mut store).memory = Some(memory.clone());

        base_env.as_mut(&mut store).memory = Some(memory.clone());

        comments_env.as_mut(&mut store).memory = Some(memory.clone());
        comments_env.as_mut(&mut store).alloc_guest_memory = Some(alloc.clone());

        source_map_host_env.as_mut(&mut store).memory = Some(memory.clone());
        source_map_host_env.as_mut(&mut store).alloc_guest_memory = Some(alloc);

        diagnostics_env.as_mut(&mut store).memory = Some(memory.clone());

        // As soon as instance is ready, host calls a fn to read plugin's swc_core pkg
        // diagnostics as `handshake`. Once read those values will be available across
        // whole plugin transform execution.

        // IMPORTANT NOTE
        // Note this is `handshake`, which we expect to success ALL TIME. Do not try to
        // expand `PluginCorePkgDiagnostics` as it'll cause deserialization failure
        // until we have forward-compat schema changes.
        instance
            .exports
            .get_typed_function::<(), u32>(&store, "__get_transform_plugin_core_pkg_diag")?
            .call(&mut store)?;

        let diag_result: PluginCorePkgDiagnostics =
            PluginSerializedBytes::from_slice(&(&(*diagnostics_buffer.lock()))[..])
                .deserialize()?
                .into_inner();

        // Main transform interface plugin exports
        let exported_plugin_transform: TypedFunction<(u32, u32, u32, u32), u32> = instance
            .exports
            .get_typed_function(&store, "__transform_plugin_process_impl")?;
        // `__free` function automatically exported via swc_plugin sdk to allow
        // deallocation in guest memory space
        let exported_plugin_free: TypedFunction<(u32, u32), u32> =
            instance.exports.get_typed_function(&store, "__free")?;
        // `__alloc` function automatically exported via swc_plugin sdk to allow
        // allocation in guest memory space
        let exported_plugin_alloc: TypedFunction<u32, u32> =
            instance.exports.get_typed_function(&store, "__alloc")?;

        Ok(PluginTransformState {
            exported_plugin_transform,
            exported_plugin_free,
            exported_plugin_alloc,
            instance,
            store,
            wasi_env,
            transform_result,
            plugin_core_diag: diag_result,
        })
    }

    #[tracing::instrument(level = "info", skip_all)]
    pub fn transform(
        &mut self,
        program: &PluginSerializedBytes,
        should_enable_comments_proxy: Option<bool>,
    ) -> Result<PluginSerializedBytes, Error> {
        let mut transform_state = self.setup_plugin_env_exports()?;
        transform_state.is_transform_schema_compatible()?;
        transform_state
            .run(program, self.unresolved_mark, should_enable_comments_proxy)
            .with_context(|| {
                format!(
                    "failed to run Wasm plugin transform. Please ensure the version of `swc_core` \
                     used by the plugin is compatible with the host runtime. See the \
                     documentation for compatibility information. If you are an author of the \
                     plugin, please update `swc_core` to the compatible version.
                 
                Note that if you want to use the os features like filesystem, you need to use \
                     `wasi`. Wasm itself does not have concept of filesystem.
                 
                https://swc.rs/docs/plugin/selecting-swc-core

                See https://plugins.swc.rs/versions/from-plugin-runner/{PKG_VERSION} for the list of the compatible versions.
                 
                Build info: 
                    Date: {BUILD_DATE}
                    Timestamp: {BUILD_TIMESTAMP}
                    
                Version info: 
                    swc_plugin_runner: {PKG_VERSION}
                    Dependencies: {PKG_DEPS}
                "
                )
            })
    }
}

const BUILD_DATE: &str = env!("VERGEN_BUILD_DATE");
const BUILD_TIMESTAMP: &str = env!("VERGEN_BUILD_TIMESTAMP");
const PKG_VERSION: &str = env!("CARGO_PKG_VERSION");
const PKG_DEPS: &str = env!("VERGEN_CARGO_DEPENDENCIES");
