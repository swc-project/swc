//! Plugin runtime abstract

use std::{any::Any, fmt, path::Path};

/// Runtime FFI Value
pub type Value = i32;

/// Opaque module cache
pub struct ModuleCache(pub Box<dyn Any + Send + Sync>);

/// Module cache or raw bytes module
pub enum Module {
    Cache(ModuleCache),
    Bytes(Box<[u8]>),
}

/// Plugin function define
pub struct Func {
    /// Number of parameters and return values
    pub sign: (u8, u8),
    /// The closure
    pub func: Box<dyn Fn(&mut dyn Caller<'_>, &[Value], &mut [Value]) + Send + Sync>,
}

/// Plugin runtime abstract
pub trait Runtime: fmt::Debug + Send + Sync {
    /// An identifier used to identify the runtime implement,
    /// which should include the runtime name and version.
    fn identifier(&self) -> &'static str;

    /// Preprocess raw bytes into module cache
    ///
    /// Note that it is not mandatory to implement AOT. It can just be loaded as
    /// an object.
    fn prepare_module(&self, bytes: &[u8]) -> anyhow::Result<ModuleCache>;

    /// Initialize the plugin instance
    ///
    /// * `name` and `envs` parameters are module name and environment variable
    ///   pairs. They can be ignored for non-wasi modules.
    /// * `imports` parameters should be provided as `env` module.
    /// * The runtime should call the `__get_transform_plugin_core_pkg_diag`
    ///   function once after instantiation to check that initialization was
    ///   completed correctly.
    fn init(
        &self,
        name: &str,
        imports: Vec<(String, Func)>,
        envs: Vec<(String, String)>,
        module: Module,
    ) -> anyhow::Result<Box<dyn Instance>>;

    /// Clone module cache
    ///
    /// If the runtime does not allow clone, then it can return `None`.
    fn clone_cache(&self, _cache: &ModuleCache) -> Option<ModuleCache> {
        None
    }

    /// Load a module from file
    ///
    /// # Safety
    ///
    /// This function is marked as unsafe, allow to load trusted module cache
    /// without verification.
    unsafe fn load_cache(&self, _path: &Path) -> Option<ModuleCache> {
        None
    }

    /// Store a module to file
    fn store_cache(&self, _path: &Path, _cache: &ModuleCache) -> anyhow::Result<()> {
        Ok(())
    }
}

/// Instance Accessor
pub trait Caller<'a> {
    /// Read data from instance memory
    fn read_buf(&self, ptr: u32, buf: &mut [u8]) -> anyhow::Result<()>;

    /// Write data to instance memory
    fn write_buf(&mut self, ptr: u32, buf: &[u8]) -> anyhow::Result<()>;

    /// Allocate memory in instance
    fn alloc(&mut self, size: u32) -> anyhow::Result<u32>;

    /// Free memory in instance
    fn free(&mut self, ptr: u32, size: u32) -> anyhow::Result<u32>;
}

/// Plugin instance
pub trait Instance: Send + Sync {
    /// Execute transform.
    ///
    /// The program parameter should use [Caller::alloc] to allocate
    /// and write `PluginSerializedBytes` data.
    fn transform(
        &mut self,
        program_ptr: u32,
        program_len: u32,
        unresolved_mark: u32,
        should_enable_comments_proxy: u32,
    ) -> anyhow::Result<u32>;

    /// Get instance accessor
    fn caller(&mut self) -> anyhow::Result<Box<dyn Caller<'_> + '_>>;

    /// Export Module cache
    fn cache(&self) -> Option<ModuleCache>;

    /// Perform cleanup operations
    fn cleanup(&mut self) -> anyhow::Result<()> {
        Ok(())
    }
}

impl Func {
    /// Create a plugin function from closure
    pub fn from_fn<const A: usize, const R: usize, F>(f: F) -> Self
    where
        F: Fn(&mut dyn Caller<'_>, [i32; A]) -> [i32; R] + Send + Sync + 'static,
    {
        Func {
            sign: (A.try_into().unwrap(), R.try_into().unwrap()),
            func: Box::new(move |store, args, rv| {
                let args = args.try_into().unwrap();
                rv.copy_from_slice(&f(store, args));
            }),
        }
    }
}
