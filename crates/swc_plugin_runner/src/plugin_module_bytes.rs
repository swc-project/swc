use serde::{Deserialize, Serialize};

use crate::runtime;

// A trait abstracts plugin's wasm compilation and instantiation.
// Depends on the caller, this could be a simple clone from existing module, or
// load from file system cache.
pub trait PluginModuleBytes {
    // Returns a name to the module, typically either path to the plugin or its
    // package name.
    fn get_module_name(&self) -> &str;
    // Returns a compiled wasmer::Module for the plugin module.
    fn compile_module(&self, rt: &dyn runtime::Runtime) -> runtime::Module;
}

/// A struct for the plugin contains raw bytes can be compiled into Wasm Module.
#[derive(Debug, Clone, Eq, Serialize, Deserialize, PartialEq)]
pub struct RawPluginModuleBytes {
    plugin_name: String,
    bytes: Vec<u8>,
}

impl PluginModuleBytes for RawPluginModuleBytes {
    fn get_module_name(&self) -> &str {
        &self.plugin_name
    }

    fn compile_module(&self, rt: &dyn runtime::Runtime) -> runtime::Module {
        let cache = rt.prepare_module(&self.bytes).unwrap();
        runtime::Module::Cache(cache)
    }
}

impl RawPluginModuleBytes {
    pub fn new(identifier: String, bytes: Vec<u8>) -> Self {
        Self {
            plugin_name: identifier,
            bytes,
        }
    }
}

/// A struct for the plugin contains pre-compiled binary.
/// This is for the cases would like to reuse the compiled module, or either
/// load from FileSystemCache.
#[derive(Serialize, Deserialize)]
pub struct CompiledPluginModuleBytes {
    plugin_name: String,
    #[serde(skip)]
    cache: Option<runtime::ModuleCache>,
}

impl CompiledPluginModuleBytes {
    pub fn new(identifier: String, cache: runtime::ModuleCache) -> Self {
        Self {
            plugin_name: identifier,
            cache: Some(cache),
        }
    }

    // Allow to `pre` compile wasm module when there is a raw bytes, want to avoid
    // to skip the compilation step per each trasform.
    pub fn from_raw_module(rt: &dyn runtime::Runtime, raw: RawPluginModuleBytes) -> Self {
        let cache = rt.prepare_module(&raw.bytes).unwrap();
        CompiledPluginModuleBytes {
            plugin_name: raw.plugin_name,
            cache: Some(cache),
        }
    }

    pub fn clone_module(&self, builder: &dyn runtime::Runtime) -> Self {
        CompiledPluginModuleBytes {
            plugin_name: self.plugin_name.clone(),
            cache: self
                .cache
                .as_ref()
                .map(|cache| builder.clone_cache(cache).unwrap()),
        }
    }
}

impl PluginModuleBytes for CompiledPluginModuleBytes {
    fn get_module_name(&self) -> &str {
        &self.plugin_name
    }

    fn compile_module(&self, rt: &dyn runtime::Runtime) -> runtime::Module {
        let cache = self.cache.as_ref().unwrap();
        let cache = rt.clone_cache(cache).unwrap();
        runtime::Module::Cache(cache)
    }
}
