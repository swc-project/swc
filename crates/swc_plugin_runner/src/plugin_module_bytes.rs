use anyhow::Error;
use serde::{Deserialize, Serialize};
use wasmer::{Module, Store};

/// Creates an instnace of [Store].
///
/// This function exists because we need to disable simd.
#[cfg(not(target_arch = "wasm32"))]
#[allow(unused_mut)]
pub(crate) fn new_store() -> Store {
    // Use empty enumset to disable simd.
    use enumset::EnumSet;
    use wasmer::{BaseTunables, CompilerConfig, EngineBuilder, Target, Triple};
    let mut set = EnumSet::new();

    // [TODO]: Should we use is_x86_feature_detected! macro instead?
    #[cfg(target_arch = "x86_64")]
    set.insert(wasmer::CpuFeature::SSE2);
    let target = Target::new(Triple::host(), set);

    let config = wasmer_compiler_cranelift::Cranelift::default();
    let mut engine = EngineBuilder::new(Box::new(config) as Box<dyn CompilerConfig>)
        .set_target(Some(target))
        .engine();
    let tunables = BaseTunables::for_target(engine.target());
    engine.set_tunables(tunables);

    Store::new(engine)
}

#[cfg(target_arch = "wasm32")]
fn new_store() -> Store {
    Store::default()
}

// A trait abstracts plugin's wasm compilation and instantiation.
// Depends on the caller, this could be a simple clone from existing module, or
// load from file system cache.
pub trait PluginModuleBytes {
    // Returns a name to the module, typically either path to the plugin or its
    // package name.
    fn get_module_name(&self) -> &str;
    // Returns a compiled wasmer::Module for the plugin module.
    fn compile_module(&self) -> Result<(Store, Module), Error>;
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

    fn compile_module(&self) -> Result<(Store, Module), Error> {
        let store = new_store();
        let module = Module::new(&store, &self.bytes)?;
        Ok((store, module))
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
#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct CompiledPluginModuleBytes {
    plugin_name: String,
    #[serde(skip)]
    bytes: Option<wasmer::Module>,
    #[serde(skip)]
    store: Option<wasmer::Store>,
}

impl Eq for CompiledPluginModuleBytes {}

impl Clone for CompiledPluginModuleBytes {
    fn clone(&self) -> Self {
        Self {
            plugin_name: self.plugin_name.clone(),
            bytes: self.bytes.clone(),
            store: Some(Store::new(
                self.store
                    .as_ref()
                    .expect("Store should be available")
                    .engine()
                    .clone(),
            )),
        }
    }
}

impl CompiledPluginModuleBytes {
    pub fn new(identifier: String, bytes: wasmer::Module, store: wasmer::Store) -> Self {
        Self {
            plugin_name: identifier,
            bytes: Some(bytes),
            store: Some(store),
        }
    }
}

// Allow to `pre` compile wasm module when there is a raw bytes, want to avoid
// to skip the compilation step per each trasform.
impl From<RawPluginModuleBytes> for CompiledPluginModuleBytes {
    fn from(raw: RawPluginModuleBytes) -> Self {
        let (store, module) = raw.compile_module().unwrap();
        Self::new(raw.plugin_name, module, store)
    }
}

impl PluginModuleBytes for CompiledPluginModuleBytes {
    fn get_module_name(&self) -> &str {
        &self.plugin_name
    }

    fn compile_module(&self) -> Result<(Store, Module), Error> {
        Ok((
            Store::new(
                self.store
                    .as_ref()
                    .expect("Store should be available")
                    .engine()
                    .clone(),
            ),
            self.bytes
                .as_ref()
                .expect("Module should be available")
                .clone(),
        ))
    }
}
