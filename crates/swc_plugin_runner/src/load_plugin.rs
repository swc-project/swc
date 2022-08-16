use std::{env, sync::Arc};

use anyhow::{Context, Error};
use parking_lot::Mutex;
use swc_common::{plugin::metadata::TransformPluginMetadataContext, SourceMap};
use wasmer::{FunctionEnv, Instance, Store};
use wasmer_wasi::{is_wasi_module, WasiState};

use crate::{
    host_environment::BaseHostEnvironment,
    imported_fn::{
        build_import_object, comments::CommentHostEnvironment,
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
) -> Result<(Instance, Arc<Mutex<Vec<u8>>>), Error> {
    let module = cache.load_module(store, plugin_path);

    return match module {
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

            let mut import_object = build_import_object(
                store,
                &metadata_env,
                &transform_env,
                &base_env,
                &comments_env,
                &source_map_host_env,
            );

            // Plugin binary can be either wasm32-wasi or wasm32-unknown-unknown.
            // Wasi specific env need to be initialized if given module targets wasm32-wasi.
            // TODO: wasm host native runtime throws 'Memory should be set on `WasiEnv`
            // first'
            let instance = if is_wasi_module(&module) {
                // Create the `WasiEnv`.
                let mut wasi_env = WasiState::new(
                    plugin_path
                        .file_name()
                        .and_then(|f| f.to_str())
                        .expect("Plugin path missing file name"),
                );

                // Implicitly enable filesystem access for the wasi plugin to cwd.
                //
                // This allows wasi plugin can read arbitary data (i.e node_modules) or produce
                // output for post process (i.e .lcov coverage data) directly.
                //
                // TODO: this is not finalized decision
                // - should we support this?
                // - can we limit to allowlisted input / output only?
                // - should there be a top-level config from .swcrc to manually override this?
                let wasi_env = if let Ok(cwd) = env::current_dir() {
                    wasi_env.map_dir("/cwd", cwd)?
                } else {
                    &mut wasi_env
                };

                let wasi_env = wasi_env.finalize(store)?;

                // Generate an `ImportObject` from wasi_env, overwrite into imported_object
                let wasi_env_import_object = wasi_env.import_object(store, &module)?;
                import_object.extend(&wasi_env_import_object);
                let instance = Instance::new(store, &module, &import_object);

                if let Ok(instance) = instance {
                    // For WASI, don't forget to import memory to WasiEnv
                    let memory = instance.exports.get_memory("memory")?;
                    let alloc = instance.exports.get_typed_function(store, "__alloc")?;
                    wasi_env.data_mut(store).set_memory(memory.clone());

                    // Unlike wasmer@2, have to manually `import` memory / necessary functions from
                    // the guest into env.
                    metadata_env.as_mut(store).memory = Some(memory.clone());
                    metadata_env.as_mut(store).alloc_guest_memory = Some(alloc.clone());

                    transform_env.as_mut(store).memory = Some(memory.clone());

                    base_env.as_mut(store).memory = Some(memory.clone());

                    comments_env.as_mut(store).memory = Some(memory.clone());
                    comments_env.as_mut(store).alloc_guest_memory = Some(alloc);

                    source_map_host_env.as_mut(store).memory = Some(memory.clone());

                    Ok(instance)
                } else {
                    instance
                }
            } else {
                Instance::new(store, &module, &import_object)
            };

            instance
                .map(|i| (i, transform_result))
                .context("Failed to create plugin instance")
        }
        Err(err) => Err(err),
    };
}
