#![allow(unused)]

use std::{
    env::current_dir,
    path::{Path, PathBuf},
    str::FromStr,
};

use anyhow::{Context, Error};
use enumset::EnumSet;
use parking_lot::Mutex;
use swc_common::{
    collections::AHashMap,
    sync::{Lazy, OnceCell},
};
#[cfg(not(target_arch = "wasm32"))]
use wasmer::{sys::BaseTunables, CpuFeature, Engine, Target, Triple};
use wasmer::{Module, Store};
#[cfg(all(not(target_arch = "wasm32"), feature = "filesystem_cache"))]
use wasmer_cache::{Cache as WasmerCache, FileSystemCache, Hash};

use crate::{
    plugin_module_bytes::{CompiledPluginModuleBytes, PluginModuleBytes, RawPluginModuleBytes},
    wasix_runtime::new_store,
};

/// Version for bytecode cache stored in local filesystem.
///
/// This MUST be updated when bump up wasmer.
///
/// Bytecode cache generated via wasmer is generally portable,
/// however it is not gauranteed to be compatible across wasmer's
/// internal changes.
/// https://github.com/wasmerio/wasmer/issues/2781
const MODULE_SERIALIZATION_VERSION: &str = "v7";

#[derive(Default)]
pub struct PluginModuleCacheInner {
    #[cfg(all(not(target_arch = "wasm32"), feature = "filesystem_cache"))]
    fs_cache_root: Option<String>,
    #[cfg(all(not(target_arch = "wasm32"), feature = "filesystem_cache"))]
    fs_cache_store: Option<FileSystemCache>,
    // Stores the string representation of the hash of the plugin module to store into
    // FileSystemCache. This works since SWC does not revalidates plugin in single process
    // lifecycle.
    #[cfg(all(not(target_arch = "wasm32"), feature = "filesystem_cache"))]
    fs_cache_hash_store: AHashMap<String, Hash>,
    // Generic in-memory cache to the raw bytes, either read by fs or supplied by bindgen.
    memory_cache_store: AHashMap<String, Vec<u8>>,
    // A naive hashmap to the compiled plugin modules.
    // Current it doesn't have any invalidation or expiration logics like lru,
    // having a lot of plugins may create some memory pressure.
    compiled_module_bytes: AHashMap<String, (wasmer::Store, wasmer::Module)>,
}

impl PluginModuleCacheInner {
    pub fn get_fs_cache_root(&self) -> Option<String> {
        #[cfg(all(not(target_arch = "wasm32"), feature = "filesystem_cache"))]
        return self.fs_cache_root.clone();

        None
    }

    /// Check if the cache contains bytes for the corresponding key.
    pub fn contains(&self, key: &str) -> bool {
        let is_in_cache = self.memory_cache_store.contains_key(key)
            || self.compiled_module_bytes.contains_key(key);

        #[cfg(all(not(target_arch = "wasm32"), feature = "filesystem_cache"))]
        {
            // Instead of accessing FileSystemCache, check if the key have corresponding
            // hash since FileSystemCache does not have a way to check if the key
            // exists.
            return is_in_cache || self.fs_cache_hash_store.contains_key(key);
        }

        is_in_cache
    }

    /// Insert raw plugin module bytes into cache does not have compiled
    /// wasmer::Module. The bytes stored in this type of cache will return
    /// RawPluginModuleBytes. It is strongly recommend to avoid using this
    /// type of cache as much as possible, since module compilation time for
    /// the wasm is noticeably expensive and caching raw bytes only cuts off
    /// the reading time for the plugin module.
    pub fn insert_raw_bytes(&mut self, key: String, value: Vec<u8>) {
        self.memory_cache_store.insert(key, value);
    }

    /// Insert already compiled wasmer::Module into cache.
    /// The module stored in this cache will return CompiledPluginModuleBytes,
    /// which costs near-zero time when calling its `compile_module` method as
    /// it clones precompiled module directly.
    ///
    /// In genearl it is recommended to use either using filesystemcache
    /// `store_bytes_from_path` which internally calls this or directly call
    /// this to store compiled module bytes. CompiledModuleBytes provides way to
    /// create it via RawModuleBytes, so there's no practical reason to
    /// store raw bytes most cases.
    pub fn insert_compiled_module_bytes(
        &mut self,
        key: String,
        value: (wasmer::Store, wasmer::Module),
    ) {
        self.compiled_module_bytes.insert(key, value);
    }

    /// Store plugin module bytes into the cache, from actual filesystem.
    pub fn store_bytes_from_path(&mut self, binary_path: &Path, key: &str) -> Result<(), Error> {
        #[cfg(all(not(target_arch = "wasm32"), feature = "filesystem_cache"))]
        {
            let raw_module_bytes =
                std::fs::read(binary_path).context("Cannot read plugin from specified path")?;

            // If FilesystemCache is available, store serialized bytes into fs.
            if let Some(fs_cache_store) = &mut self.fs_cache_store {
                let module_bytes_hash = Hash::generate(&raw_module_bytes);
                let store = new_store();

                let module =
                    if let Ok(module) = unsafe { fs_cache_store.load(&store, module_bytes_hash) } {
                        tracing::debug!("Build WASM from cache: {key}");
                        module
                    } else {
                        let module = Module::new(&store, raw_module_bytes.clone())
                            .context("Cannot compile plugin binary")?;
                        fs_cache_store.store(module_bytes_hash, &module)?;
                        module
                    };

                // Store hash to load from fs_cache_store later.
                self.fs_cache_hash_store
                    .insert(key.to_string(), module_bytes_hash);

                // Also store in memory for the in-process cache.
                self.insert_compiled_module_bytes(key.to_string(), (store, module));
            }

            // Store raw bytes into memory cache.
            self.insert_raw_bytes(key.to_string(), raw_module_bytes);

            return Ok(());
        }

        anyhow::bail!("Filesystem cache is not enabled, cannot read plugin from phsyical path");
    }

    /// Returns a PluingModuleBytes can be compiled into a wasmer::Module.
    /// Depends on the cache availability, it may return a raw bytes or a
    /// serialized bytes.
    pub fn get(&self, key: &str) -> Option<Box<dyn PluginModuleBytes>> {
        // Look for compiled module bytes first, it is the cheapest way to get compile
        // wasmer::Module.
        if let Some(compiled_module) = self.compiled_module_bytes.get(key) {
            return Some(Box::new(CompiledPluginModuleBytes::new(
                key.to_string(),
                compiled_module.1.clone(),
                Store::new(compiled_module.0.engine().clone()),
            )));
        }

        // Next, read serialzied bytes from filesystem cache.
        #[cfg(all(not(target_arch = "wasm32"), feature = "filesystem_cache"))]
        if let Some(fs_cache_store) = &self.fs_cache_store {
            let hash = self.fs_cache_hash_store.get(key)?;
            let store = new_store();
            let module = unsafe { fs_cache_store.load(&store, *hash) };
            if let Ok(module) = module {
                return Some(Box::new(CompiledPluginModuleBytes::new(
                    key.to_string(),
                    module,
                    store,
                )));
            }
        }

        // Lastly, look for if there's a raw bytes in memory. This requires compilation
        // still, but doesn't go through filesystem access.
        if let Some(memory_cache_bytes) = self.memory_cache_store.get(key) {
            return Some(Box::new(RawPluginModuleBytes::new(
                key.to_string(),
                memory_cache_bytes.clone(),
            )));
        }
        None
    }
}

#[derive(Default)]
pub struct PluginModuleCache {
    pub inner: OnceCell<Mutex<PluginModuleCacheInner>>,
    /// To prevent concurrent access to `WasmerInstance::new`.
    /// This is a precaution only yet, for the preparation of wasm thread
    /// support in the future.
    instantiation_lock: Mutex<()>,
}

impl PluginModuleCache {
    pub fn create_inner(
        enable_fs_cache_store: bool,
        fs_cache_store_root: &Option<String>,
    ) -> PluginModuleCacheInner {
        PluginModuleCacheInner {
            #[cfg(all(not(target_arch = "wasm32"), feature = "filesystem_cache"))]
            fs_cache_root: fs_cache_store_root.clone(),
            #[cfg(all(not(target_arch = "wasm32"), feature = "filesystem_cache"))]
            fs_cache_store: if enable_fs_cache_store {
                create_filesystem_cache(fs_cache_store_root)
            } else {
                None
            },
            #[cfg(all(not(target_arch = "wasm32"), feature = "filesystem_cache"))]
            fs_cache_hash_store: Default::default(),
            memory_cache_store: Default::default(),
            compiled_module_bytes: Default::default(),
        }
    }
}

#[cfg(all(not(target_arch = "wasm32"), feature = "filesystem_cache"))]
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
        root_path.push(format!(
            "{}_{}_{}_{}",
            MODULE_SERIALIZATION_VERSION,
            std::env::consts::OS,
            std::env::consts::ARCH,
            option_env!("CARGO_PKG_VERSION").unwrap_or("plugin_runner_unknown")
        ));

        return FileSystemCache::new(&root_path).ok();
    }

    None
}
