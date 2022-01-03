use anyhow::{Context, Error};
use resolve::PluginCache;
use swc_ecma_ast::Program;
use wasmer::{imports, Instance, Module, Store};
use wasmer_cache::{Cache, Hash};

pub mod resolve;

/// Load plugin from specified path.
/// If cache is provided, it'll try to load from cache first to avoid
/// compilation.
fn load_plugin(module_bytes: &Vec<u8>, cache: &mut Option<PluginCache>) -> Result<Instance, Error> {
    let wasmer_store = Store::default();

    let load_from_cache = |c: &mut PluginCache, hash: Hash| match c {
        PluginCache::File(filesystem_cache) => unsafe {
            filesystem_cache.load(&wasmer_store, hash)
        },
    };

    let store_into_cache = |c: &mut PluginCache, hash: Hash, module: &Module| match c {
        PluginCache::File(filesystem_cache) => filesystem_cache.store(hash, module),
    };

    let hash = Hash::generate(module_bytes);

    let load_cold_wasm_bytes =
        || Module::new(&wasmer_store, module_bytes).context("Cannot compile plugin");

    let module = if let Some(cache) = cache {
        let cached_module =
            load_from_cache(cache, hash).context("Failed to load plugin from cache");

        match cached_module {
            Ok(module) => Ok(module),
            Err(err) => {
                let loaded_module = load_cold_wasm_bytes().map_err(|_| err);
                match &loaded_module {
                    Ok(module) => {
                        if let Err(err) = store_into_cache(cache, hash, &module) {
                            loaded_module
                                .map_err(|_| err)
                                .context("Failed to store compiled plugin into cache")
                        } else {
                            loaded_module
                        }
                    }
                    Err(..) => loaded_module,
                }
            }
        }
    } else {
        load_cold_wasm_bytes()
    };

    return match module {
        Ok(module) => {
            let import_object = imports! {};

            Instance::new(&module, &import_object).context("Failed to create plugin instance")
        }
        Err(err) => Err(err.into()),
    };
}

pub fn apply_js_plugin(
    plugin_name: &str,
    module_bytes: &Vec<u8>,
    cache: &mut Option<PluginCache>,
    _config_json: &str,
    program: Program,
) -> Result<Program, Error> {
    (|| -> Result<_, Error> {
        let _instance = load_plugin(module_bytes, cache)?;
        // TODO: actually apply transform from plugin
        Ok(program)
    })()
    .with_context(|| format!("failed to invoke `{}` as js transform plugin", plugin_name))
}
