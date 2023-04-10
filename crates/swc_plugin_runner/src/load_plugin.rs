use std::{env, sync::Arc};

use anyhow::Error;
use parking_lot::Mutex;
use swc_common::{
    plugin::{
        diagnostics::PluginCorePkgDiagnostics, metadata::TransformPluginMetadataContext,
        serialized::PluginSerializedBytes,
    },
    SourceMap,
};
use wasmer::{FunctionEnv, Instance, Store};
use wasmer_wasix::{default_fs_backing, is_wasi_module, WasiEnv, WasiFunctionEnv};

use crate::{
    host_environment::BaseHostEnvironment,
    imported_fn::{
        build_import_object, comments::CommentHostEnvironment,
        diagnostics::DiagnosticContextHostEnvironment,
        metadata_context::MetadataContextHostEnvironment,
        set_transform_result::TransformResultHostEnvironment, source_map::SourceMapHostEnvironment,
    },
};

#[tracing::instrument(level = "info", skip_all)]
pub fn load_plugin(
    store: &mut Store,
    plugin_path: &std::path::Path,
    cache: &once_cell::sync::Lazy<crate::cache::PluginModuleCache>,
    source_map: &Arc<SourceMap>,
    metadata_context: &Arc<TransformPluginMetadataContext>,
    plugin_config: Option<serde_json::Value>,
) -> Result<
    (
        Instance,
        Arc<Mutex<Vec<u8>>>,
        PluginCorePkgDiagnostics,
        Option<WasiFunctionEnv>,
    ),
    Error,
> {
    let module = cache.load_module(store, plugin_path);

    match module {
        Ok(module) => {
            let context_key_buffer = Arc::new(Mutex::new(vec![]));
            let metadata_env = FunctionEnv::new(
                store,
                MetadataContextHostEnvironment::new(
                    metadata_context,
                    &plugin_config,
                    &context_key_buffer,
                ),
            );

            let transform_result: Arc<Mutex<Vec<u8>>> = Arc::new(Mutex::new(vec![]));
            let transform_env = FunctionEnv::new(
                store,
                TransformResultHostEnvironment::new(&transform_result),
            );

            let base_env = FunctionEnv::new(store, BaseHostEnvironment::new());

            let comment_buffer = Arc::new(Mutex::new(vec![]));

            let comments_env =
                FunctionEnv::new(store, CommentHostEnvironment::new(&comment_buffer));

            let source_map_buffer = Arc::new(Mutex::new(vec![]));
            let source_map = Arc::new(Mutex::new(source_map.clone()));

            let source_map_host_env = FunctionEnv::new(
                store,
                SourceMapHostEnvironment::new(&source_map, &source_map_buffer),
            );

            let diagnostics_buffer: Arc<Mutex<Vec<u8>>> = Arc::new(Mutex::new(vec![]));
            let diagnostics_env = FunctionEnv::new(
                store,
                DiagnosticContextHostEnvironment::new(&diagnostics_buffer),
            );

            let mut import_object = build_import_object(
                store,
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
                let file_name = plugin_path
                    .file_name()
                    .and_then(|f| f.to_str())
                    .expect("Plugin path missing file name");

                let builder = WasiEnv::builder(file_name);

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
                let mut wasi_env = wasi_env_builder.finalize(store)?;

                // Then, we get the import object related to our WASI,
                // overwrite into imported_object
                // and attach it to the Wasm instance.
                let wasi_env_import_object = wasi_env.import_object(store, &module)?;
                import_object.extend(&wasi_env_import_object);

                let instance = Instance::new(store, &module, &import_object)?;

                wasi_env.initialize(store, instance.clone())?;

                (instance, Some(wasi_env))
            } else {
                (Instance::new(store, &module, &import_object)?, None)
            };

            // Attach the memory export
            let memory = instance.exports.get_memory("memory")?;
            import_object.define("env", "memory", memory.clone());

            let alloc = instance.exports.get_typed_function(store, "__alloc")?;

            // Unlike wasmer@2, have to manually `import` memory / necessary functions from
            // the guest into env.
            metadata_env.as_mut(store).memory = Some(memory.clone());
            metadata_env.as_mut(store).alloc_guest_memory = Some(alloc.clone());

            transform_env.as_mut(store).memory = Some(memory.clone());

            base_env.as_mut(store).memory = Some(memory.clone());

            comments_env.as_mut(store).memory = Some(memory.clone());
            comments_env.as_mut(store).alloc_guest_memory = Some(alloc.clone());

            source_map_host_env.as_mut(store).memory = Some(memory.clone());
            source_map_host_env.as_mut(store).alloc_guest_memory = Some(alloc);

            diagnostics_env.as_mut(store).memory = Some(memory.clone());

            // As soon as instance is ready, host calls a fn to read plugin's swc_core pkg
            // diagnostics as `handshake`. Once read those values will be available across
            // whole plugin transform execution.

            // IMPORTANT NOTE
            // Note this is `handshake`, which we expect to success ALL TIME. Do not try to
            // expand `PluginCorePkgDiagnostics` as it'll cause deserialization failure
            // until we have forward-compat schema changes.
            instance
                .exports
                .get_typed_function::<(), u32>(store, "__get_transform_plugin_core_pkg_diag")?
                .call(store)?;

            let diag_result: PluginCorePkgDiagnostics =
                PluginSerializedBytes::from_slice(&(&(*diagnostics_buffer.lock()))[..])
                    .deserialize()?;

            Ok((instance, transform_result, diag_result, wasi_env))
        }
        Err(err) => Err(err),
    }
}
