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
// we have few targets wasmer does not supports yet
// https://github.com/wasmerio/wasmer/issues/2324
use wasmtime::{Engine, Linker, Store};
use wasmtime_wasi::WasiCtxBuilder;

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
fn load_plugin(plugin_path: &Path, _cache: &mut Option<PluginCache>) -> Result<(), Error> {
    static BYTE_CACHE: Lazy<Mutex<AHashMap<PathBuf, Arc<Vec<u8>>>>> =
        Lazy::new(|| Default::default());

    // TODO: This caching streategy does not consider few edge cases.
    // 1. If process is long-running (devServer) binary change in the middle of
    // process won't be reflected.
    // 2. If reading binary fails somehow it won't bail out but keep retry.
    let module_bytes_key = plugin_path.to_path_buf();
    let _module_bytes =
        if let Some(cached_bytes) = BYTE_CACHE.lock().get(&module_bytes_key).cloned() {
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
    let engine = Engine::default();

    let mut linker = Linker::new(&engine);
    wasmtime_wasi::add_to_linker(&mut linker, |s| s)?;

    let wasi = WasiCtxBuilder::new()
        .inherit_stdio()
        .inherit_args()?
        .build();
    let mut _store = Store::new(&engine, wasi);

    Ok(())
}

pub fn apply_js_plugin(
    _plugin_name: &str,
    path: &Path,
    cache: &mut Option<PluginCache>,
    _config_json: &str,
    program: Program,
) -> Result<Program, Error> {
    (|| -> Result<_, Error> {
        load_plugin(path, cache)?;
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
