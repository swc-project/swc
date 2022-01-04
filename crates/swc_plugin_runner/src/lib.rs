use std::{
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::{Context, Error};
use once_cell::sync::Lazy;
use parking_lot::Mutex;
use resolve::PluginCache;
use swc_common::collections::AHashMap;
use swc_ecma_ast::Program;
use wasmer::{imports, Instance, Module, Store};
use wasmer_cache::{Cache, Hash};

pub mod resolve;

/// Load plugin from specified path.
/// If cache is provided, it'll try to load from cache first to avoid
/// compilation.
///
/// Since plugin will be initialized per-file transform, this function tries to
/// avoid reading filesystem per each initialization via naive in-memory map
/// which stores raw bytecodes from file. Unlike compiled bytecode cache for the
/// wasm, this is volatile.
///
/// ### Notes
/// [This code](https://github.com/swc-project/swc/blob/fc4c6708f24cda39640fbbfe56123f2f6eeb2474/crates/swc/src/plugin.rs#L19-L44)
/// includes previous incorrect attempt to workaround file read issues.
/// In actual transform, `plugins` is also being called per each transform.
fn load_plugin(plugin_path: &Path, cache: &mut Option<PluginCache>) -> Result<Instance, Error> {
    static BYTE_CACHE: Lazy<Mutex<AHashMap<PathBuf, Arc<Vec<u8>>>>> =
        Lazy::new(|| Default::default());

    // TODO: This caching streategy does not consider few edge cases.
    // 1. If process is long-running (devServer) binary change in the middle of
    // process won't be reflected.
    // 2. If reading binary fails somehow it won't bail out but keep retry.
    let module_bytes_key = plugin_path.to_path_buf();
    let module_bytes = if let Some(cached_bytes) = BYTE_CACHE.lock().get(&module_bytes_key).cloned()
    {
        cached_bytes
    } else {
        let fresh_module_bytes = std::fs::read(plugin_path)
            .map(Arc::new)
            .context("Cannot read plugin from specified path")?;
        BYTE_CACHE
            .lock()
            .insert(module_bytes_key, fresh_module_bytes.clone());

        fresh_module_bytes
    };

    // TODO: can we share store instances across each plugin binaries?
    let wasmer_store = Store::default();

    let load_from_cache = |c: &mut PluginCache, hash: Hash| match c {
        PluginCache::File(filesystem_cache) => unsafe {
            filesystem_cache.load(&wasmer_store, hash)
        },
    };

    let store_into_cache = |c: &mut PluginCache, hash: Hash, module: &Module| match c {
        PluginCache::File(filesystem_cache) => filesystem_cache.store(hash, module),
    };

    let hash = Hash::generate(&module_bytes);

    let load_cold_wasm_bytes =
        || Module::new(&wasmer_store, module_bytes.as_ref()).context("Cannot compile plugin");

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
    _plugin_name: &str,
    path: &Path,
    cache: &mut Option<PluginCache>,
    _config_json: &str,
    program: Program,
) -> Result<Program, Error> {
    (|| -> Result<_, Error> {
        let _instance = load_plugin(path, cache)?;
        // TODO: actually apply transform from plugin
        Ok(program)
    })()
    .with_context(|| {
        format!(
            "failed to invoke `{}` as js transform plugin",
            path.display()
        )
    })
}
