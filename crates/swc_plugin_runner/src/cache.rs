use std::{
    env::current_dir,
    path::{Path, PathBuf},
};

use anyhow::{Context, Error};
use parking_lot::Mutex;
use swc_common::{
    collections::AHashMap,
    sync::{Lazy, OnceCell},
};
use wasmer::{Module, Store};
#[cfg(all(not(target_arch = "wasm32"), feature = "filesystem_cache"))]
use wasmer_cache::{Cache as WasmerCache, FileSystemCache, Hash};

#[cfg(all(not(feature = "filesystem_cache"), not(feature = "memory_cache")))]
compile_error!("Plugin_runner should enable either filesystem, or memory cache");

#[cfg(all(feature = "filesystem_cache", feature = "memory_cache"))]
compile_error!(
    "Only one cache feature should be enabled. If you enabled filesystem_cache, it activates its \
     memory cache as well."
);

/// Version for bytecode cache stored in local filesystem.
///
/// This MUST be updated when bump up wasmer.
///
/// Bytecode cache generated via wasmer is generally portable,
/// however it is not gauranteed to be compatible across wasmer's
/// internal changes.
/// https://github.com/wasmerio/wasmer/issues/2781
const MODULE_SERIALIZATION_VERSION: &str = "v3";

/// A shared instance to plugin's module bytecode cache.
pub static PLUGIN_MODULE_CACHE: Lazy<PluginModuleCache> = Lazy::new(Default::default);

#[cfg(feature = "filesystem_cache")]
#[derive(Default)]
pub struct CacheInner {
    fs_cache: Option<FileSystemCache>,
    // A naive hashmap to the compiled plugin modules.
    // Current it doesn't have any invalidation or expiration logics like lru,
    // having a lot of plugins may create some memory pressure.
    loaded_module_bytes: AHashMap<PathBuf, Module>,
}

#[cfg(feature = "memory_cache")]
#[derive(Default)]
pub struct CacheInner {
    // Unlike sys::Module, we'll keep raw bytes from the module instead of js::Module which
    // implies bindgen's JsValue
    loaded_module_bytes: AHashMap<PathBuf, Vec<u8>>,
}

#[derive(Default)]
pub struct PluginModuleCache {
    inner: OnceCell<Mutex<CacheInner>>,
    /// To prevent concurrent access to `WasmerInstance::new`.
    /// This is a precaution only yet, for the preparation of wasm thread
    /// support in the future.
    instantiation_lock: Mutex<()>,
}

#[cfg(feature = "filesystem_cache")]
#[tracing::instrument(level = "info", skip_all)]
fn create_filesystem_cache(filesystem_cache_root: &Option<String>) -> Option<FileSystemCache> {
    let mut root_path = if let Some(root) = filesystem_cache_root {
        Some(PathBuf::from(root))
    } else if let Ok(cwd) = current_dir() {
        Some(cwd.join(".swc"))
    } else {
        None
    };

    if let Some(root_path) = &mut root_path {
        root_path.push("plugins");
        root_path.push(MODULE_SERIALIZATION_VERSION);

        return FileSystemCache::new(&root_path).ok();
    }

    None
}

/// Create a new cache instance if not initialized. This can be called multiple
/// time, but any subsequent call will be ignored.
///
/// This fn have a side effect to create path to cache if given path is not
/// resolvable. If root is not specified, it'll generate default root for
/// cache location.
///
/// If cache failed to initialize filesystem cache for given location
/// it'll be serve in-memory cache only.
#[cfg(feature = "filesystem_cache")]
pub fn init_plugin_module_cache_once(filesystem_cache_root: &Option<String>) {
    PLUGIN_MODULE_CACHE.inner.get_or_init(|| {
        Mutex::new(CacheInner {
            fs_cache: create_filesystem_cache(filesystem_cache_root),
            loaded_module_bytes: Default::default(),
        })
    });
}

#[cfg(feature = "memory_cache")]
pub fn init_plugin_module_cache_once() {
    PLUGIN_MODULE_CACHE.inner.get_or_init(|| {
        Mutex::new(CacheInner {
            loaded_module_bytes: Default::default(),
        })
    });
}

impl PluginModuleCache {
    /// DO NOT USE unless absolutely necessary. This is mainly for testing
    /// purpose.
    pub fn new() -> Self {
        PluginModuleCache {
            inner: OnceCell::from(Mutex::new(Default::default())),
            instantiation_lock: Mutex::new(()),
        }
    }

    /// Load a compiled plugin Module from specified path.
    /// Since plugin will be initialized per-file transform, this function tries
    /// to avoid reading filesystem per each initialization via naive
    /// in-memory map which stores raw bytecodes from file. Unlike compiled
    /// bytecode cache for the wasm, this is volatile.
    ///
    /// ### Notes
    /// [This code](https://github.com/swc-project/swc/blob/fc4c6708f24cda39640fbbfe56123f2f6eeb2474/crates/swc/src/plugin.rs#L19-L44)
    /// includes previous incorrect attempt to workaround file read issues.
    /// In actual transform, `plugins` is also being called per each transform.
    #[cfg(feature = "filesystem_cache")]
    #[tracing::instrument(level = "info", skip_all)]
    pub fn load_module(&self, binary_path: &Path) -> Result<Module, Error> {
        let binary_path = binary_path.to_path_buf();
        let mut inner_cache = self.inner.get().expect("Cache should be available").lock();

        // if constructed Module is available in-memory, directly return it.
        // Note we do not invalidate in-memory cache currently: if wasm binary is
        // replaced in-process lifecycle (i.e devserver) it won't be reflected.
        let in_memory_module = inner_cache.loaded_module_bytes.get(&binary_path);
        if let Some(module) = in_memory_module {
            return Ok(module.clone());
        }

        let module_bytes =
            std::fs::read(&binary_path).context("Cannot read plugin from specified path")?;
        let module_bytes_hash = Hash::generate(&module_bytes);

        let wasmer_store = Store::default();

        let load_cold_wasm_bytes = || {
            let span = tracing::span!(
                tracing::Level::INFO,
                "load_cold_wasm_bytes",
                plugin_module = binary_path.to_str()
            );
            let span_guard = span.enter();
            let _lock = self.instantiation_lock.lock();
            let ret =
                Module::new(&wasmer_store, module_bytes).context("Cannot compile plugin binary");
            drop(span_guard);
            ret
        };

        // Try to load compiled bytes from filesystem cache if available.
        // Otherwise, cold compile instead.
        let module = if let Some(fs_cache) = &mut inner_cache.fs_cache {
            let load_result = unsafe { fs_cache.load(&wasmer_store, module_bytes_hash) };
            if let Ok(module) = load_result {
                module
            } else {
                let cold_bytes = load_cold_wasm_bytes()?;
                fs_cache.store(module_bytes_hash, &cold_bytes)?;
                cold_bytes
            }
        } else {
            load_cold_wasm_bytes()?
        };

        inner_cache
            .loaded_module_bytes
            .insert(binary_path, module.clone());

        Ok(module)
    }

    #[cfg(feature = "memory_cache")]
    pub fn load_module(&self, binary_path: &Path) -> Result<Module, Error> {
        let binary_path = binary_path.to_path_buf();
        let mut inner_cache = self.inner.get().expect("Cache should be available").lock();

        // In case of memory_cache, we do not have way to resolve / load modules
        // externally. Bail out if cache doesn't have corresponding binary.
        let in_memory_module_bytes = inner_cache
            .loaded_module_bytes
            .get(&binary_path)
            .ok_or_else(|| {
                anyhow::anyhow!("Could not locate plugin binary {}", binary_path.display())
            })?;

        //TODO: In native runtime we have to reconstruct module using raw bytes in
        // memory cache. requires https://github.com/wasmerio/wasmer/pull/2821

        let wasmer_store = Store::default();
        let module = Module::new(&wasmer_store, in_memory_module_bytes)?;

        Ok(module)
    }

    /// An experimental interface to store externally loaded module bytes into
    /// cache. This is primarily to support swc/wasm-* target, which does
    /// not have way to access system, especially filesystem by default.
    ///
    /// Currently this doesn't do any validation or expiration: once a bytes set
    /// with specific id, subsequent call will noop.
    ///
    /// This interface is not a public, but also will likely change anytime
    /// while stablizing plugin interface.
    #[cfg(feature = "memory_cache")]
    pub fn store_once(&self, module_name: &str, module_bytes: Vec<u8>) {
        // We use path as canonical id for the cache
        let binary_path = PathBuf::from(module_name);
        let mut inner_cache = self.inner.get().expect("Cache should be available").lock();

        if !inner_cache.loaded_module_bytes.contains_key(&binary_path) {
            inner_cache
                .loaded_module_bytes
                .insert(binary_path, module_bytes);
        }
    }
}
