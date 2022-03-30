use std::sync::Arc;

use anyhow::{Context, Error};
use parking_lot::Mutex;
use wasmer::{ChainableNamedResolver, Instance};
use wasmer_wasi::{is_wasi_module, WasiState};

use crate::imported_fn::build_import_object;

#[tracing::instrument(level = "info", skip_all)]
pub fn load_plugin(
    plugin_path: &std::path::Path,
    cache: &once_cell::sync::Lazy<crate::cache::PluginModuleCache>,
) -> Result<(Instance, Arc<Mutex<Vec<u8>>>), Error> {
    let module = cache.load_module(plugin_path);

    return match module {
        Ok(module) => {
            let transform_result: Arc<Mutex<Vec<u8>>> = Arc::new(Mutex::new(vec![]));
            let import_object = build_import_object(&module, &transform_result);

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
                )
                .finalize()?;

                // Generate an `ImportObject` from wasi_env, overwrite into imported_object
                let wasi_env_import_object = wasi_env.import_object(&module)?;
                let chained_resolver = import_object.chain_front(wasi_env_import_object);
                Instance::new(&module, &chained_resolver)
            } else {
                Instance::new(&module, &import_object)
            };

            instance
                .map(|i| (i, transform_result))
                .context("Failed to create plugin instance")
        }
        Err(err) => Err(err),
    };
}
