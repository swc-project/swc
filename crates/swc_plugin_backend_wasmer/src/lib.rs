use std::{
    path::{Path, PathBuf},
    sync::Arc,
};

use parking_lot::Mutex;
use swc_common::sync::Lazy;
use swc_plugin_runner::runtime;
use wasmer::{AsStoreMut, Store};
use wasmer_wasix::{default_fs_backing, Runtime};

/// Identifier for bytecode cache stored in local filesystem.
///
/// This MUST be updated when bump up wasmer.
///
/// Bytecode cache generated via wasmer is generally portable,
/// however it is not gauranteed to be compatible across wasmer's
/// internal changes.
/// https://github.com/wasmerio/wasmer/issues/2781
const MODULE_SERIALIZATION_IDENTIFIER: &str = concat!("wasmer", "-", "v7");

/// A shared instance to plugin runtime engine.
/// ref: https://github.com/wasmerio/wasmer/issues/3793#issuecomment-1607117480
static ENGINE: Lazy<Mutex<wasmer::Engine>> = Lazy::new(|| {
    // Use empty enumset to disable simd.
    use enumset::EnumSet;
    use wasmer::sys::{BaseTunables, CompilerConfig, EngineBuilder, Target, Triple};
    #[allow(unused_mut)]
    let mut set = EnumSet::new();

    // [TODO]: Should we use is_x86_feature_detected! macro instead?
    #[cfg(target_arch = "x86_64")]
    set.insert(wasmer::sys::CpuFeature::SSE2);
    let target = Target::new(Triple::host(), set);

    let config = wasmer_compiler_cranelift::Cranelift::default();
    let mut engine = EngineBuilder::new(Box::new(config) as Box<dyn CompilerConfig>)
        .set_target(Some(target))
        .engine();
    let tunables = BaseTunables::for_target(engine.target());
    engine.set_tunables(tunables);
    parking_lot::Mutex::new(wasmer::Engine::from(engine))
});

/// Construct a runtime for the wasix engine depends on the compilation
/// features.
///
/// This is mainly for the case if a host already sets up its runtime, which
/// makes wasix initialization fails due to conflicting runtime. When specified,
/// instead of using default runtime it'll try to use shared one.
fn build_wasi_runtime(_fs_cache_path: Option<PathBuf>) -> Option<Arc<dyn Runtime + Send + Sync>> {
    use wasmer_wasix::{
        runtime::{
            module_cache::{ModuleCache, SharedCache},
            package_loader::UnsupportedPackageLoader,
            resolver::MultiSource,
            task_manager::tokio::TokioTaskManager,
        },
        virtual_net, PluggableRuntime,
    };

    let cache =
        SharedCache::default().with_fallback(wasmer_wasix::runtime::module_cache::in_memory());

    let dummy_loader = UnsupportedPackageLoader;
    let rt = PluggableRuntime {
        rt: Arc::new(TokioTaskManager::default()),
        networking: Arc::new(virtual_net::UnsupportedVirtualNetworking::default()),
        engine: ENGINE.lock().clone(),
        tty: None,
        source: Arc::new(MultiSource::new()),
        module_cache: Arc::new(cache),
        http_client: None,
        package_loader: Arc::new(dummy_loader),
    };

    Some(Arc::new(rt))
}

/// Creates an instnace of [Store] with custom engine instead of default one to
/// disable simd for certain platform targets
#[cfg(not(target_arch = "wasm32"))]
#[allow(unused_mut)]
pub(crate) fn new_store() -> Store {
    let engine = ENGINE.lock().clone();
    Store::new(engine)
}

#[cfg(target_arch = "wasm32")]
pub(crate) fn new_store() -> Store {
    Store::default()
}

#[derive(Clone, Copy, Debug)]
pub struct WasmerRuntime;

#[derive(Default)]
struct WasmerTable {
    memory: Option<wasmer::Memory>,
    alloc_func: Option<wasmer::TypedFunction<u32, u32>>,
    free_func: Option<wasmer::TypedFunction<(u32, u32), u32>>,
}

struct WasmerCaller<'a> {
    memory: wasmer::Memory,
    alloc_func: &'a wasmer::TypedFunction<u32, u32>,
    free_func: &'a wasmer::TypedFunction<(u32, u32), u32>,
    store: &'a mut wasmer::Store,
}

struct WasmerCallerRef<'a> {
    memory: wasmer::Memory,
    alloc_func: &'a wasmer::TypedFunction<u32, u32>,
    free_func: &'a wasmer::TypedFunction<(u32, u32), u32>,
    store: wasmer::StoreMut<'a>,
}

struct WasmerCache {
    store: wasmer::Store,
    module: wasmer::Module,
}

struct WasmerInstance {
    _instance: wasmer::Instance,
    _table: wasmer::FunctionEnv<WasmerTable>,
    _wasi_env: Option<wasmer_wasix::WasiFunctionEnv>,

    store: wasmer::Store,
    module: wasmer::Module,

    memory: wasmer::Memory,
    alloc_func: wasmer::TypedFunction<u32, u32>,
    free_func: wasmer::TypedFunction<(u32, u32), u32>,
    transform_func: wasmer::TypedFunction<(u32, u32, u32, u32), u32>,
}

impl runtime::Runtime for WasmerRuntime {
    fn identifier(&self) -> &'static str {
        MODULE_SERIALIZATION_IDENTIFIER
    }

    fn prepare_module(&self, bytes: &[u8]) -> anyhow::Result<runtime::ModuleCache> {
        let store = new_store();
        let module = wasmer::Module::new(&store, bytes)?;
        Ok(runtime::ModuleCache(Box::new(WasmerCache {
            store,
            module,
        })))
    }

    fn init(
        &self,
        name: &str,
        imports: Vec<(String, runtime::Func)>,
        envs: Vec<(String, String)>,
        module: runtime::Module,
    ) -> anyhow::Result<Box<dyn runtime::Instance>> {
        let (mut store, module) = match module {
            runtime::Module::Cache(cache) => {
                let cache = cache.0.downcast::<WasmerCache>().unwrap();
                (cache.store, cache.module)
            }
            runtime::Module::Bytes(buf) => {
                let store = new_store();
                let module = wasmer::Module::new(&store, &buf)?;
                (store, module)
            }
        };

        let table = wasmer::FunctionEnv::new(&mut store, WasmerTable::default());
        let mut ns = wasmer::Exports::new();
        for (name, func) in imports {
            let sign = wasmer::FunctionType::new(
                vec![wasmer::Type::I32; func.sign.0 as usize],
                vec![wasmer::Type::I32; func.sign.1 as usize],
            );
            let func =
                wasmer::Function::new_with_env(&mut store, &table, sign, move |env, args| {
                    wasmer_func_call(env, args, &func)
                });

            ns.insert(name, func);
        }
        let mut imports = wasmer::Imports::new();
        imports.register_namespace("env", ns);

        let (instance, wasi_env) = if wasmer_wasix::is_wasi_module(&module) {
            let mut builder = wasmer_wasix::WasiEnv::builder(name);

            if let Some(runtime) = build_wasi_runtime(None) {
                builder = builder.runtime(runtime);
            }

            // Implicitly enable filesystem access for the wasi plugin to cwd.
            //
            // This allows wasi plugin can read arbitary data (i.e node_modules) or produce
            // output for post process (i.e .lcov coverage data) directly.
            //
            // TODO: this is not finalized decision
            // - should we support this?
            // - can we limit to allowlisted input / output only?
            // - should there be a top-level config from .swcrc to manually override this?
            let mut builder = if let Ok(cwd) = std::env::current_dir() {
                builder
                    .fs(default_fs_backing())
                    .map_dirs(Some(("/cwd".to_string(), cwd)))?
            } else {
                builder
            };

            builder.add_envs(envs);

            let mut wasi_env = builder.finalize(&mut store)?;

            // Then, we get the import object related to our WASI,
            // overwrite into imported_object
            // and attach it to the Wasm instance.
            let wasi_env_import_object = wasi_env.import_object(&mut store, &module)?;
            imports.extend(&wasi_env_import_object);

            let instance = wasmer::Instance::new(&mut store, &module, &imports)?;
            wasi_env.initialize(&mut store, instance.clone())?;
            (instance, Some(wasi_env))
        } else {
            let instance = wasmer::Instance::new(&mut store, &module, &imports)?;
            (instance, None)
        };

        // Attach the memory export
        let memory = instance.exports.get_memory("memory")?.clone();
        imports.define("env", "memory", memory.clone());

        // `__alloc` function automatically exported via swc_plugin sdk to allow
        // allocation in guest memory space
        let alloc_func: wasmer::TypedFunction<u32, u32> =
            instance.exports.get_typed_function(&store, "__alloc")?;

        // `__free` function automatically exported via swc_plugin sdk to allow
        // deallocation in guest memory space
        let free_func: wasmer::TypedFunction<(u32, u32), u32> =
            instance.exports.get_typed_function(&store, "__free")?;

        // Main transform interface plugin exports
        let transform_func: wasmer::TypedFunction<(u32, u32, u32, u32), u32> = instance
            .exports
            .get_typed_function(&store, "__transform_plugin_process_impl")?;

        table.as_mut(&mut store).memory = Some(memory.clone());
        table.as_mut(&mut store).alloc_func = Some(alloc_func.clone());
        table.as_mut(&mut store).free_func = Some(free_func.clone());

        // As soon as instance is ready, host calls a fn to read plugin's swc_core pkg
        // diagnostics as `handshake`. Once read those values will be available across
        // whole plugin transform execution.

        // IMPORTANT NOTE
        // Note this is `handshake`, which we expect to success ALL TIME. Do not try to
        // expand `PluginCorePkgDiagnostics` as it'll cause deserialization failure
        // until we have forward-compat schema changes.
        instance
            .exports
            .get_typed_function::<(), u32>(&store, "__get_transform_plugin_core_pkg_diag")?
            .call(&mut store)?;

        Ok(Box::new(WasmerInstance {
            _instance: instance,
            _table: table,
            _wasi_env: wasi_env,

            store,
            module,
            memory,
            alloc_func,
            free_func,
            transform_func,
        }))
    }

    fn clone_cache(&self, cache: &runtime::ModuleCache) -> Option<runtime::ModuleCache> {
        let cache = cache.0.downcast_ref::<WasmerCache>()?;

        let store = wasmer::Store::new(cache.store.engine().clone());
        let module = cache.module.clone();
        Some(runtime::ModuleCache(Box::new(WasmerCache {
            store,
            module,
        })))
    }

    unsafe fn load_cache(&self, path: &std::path::Path) -> Option<runtime::ModuleCache> {
        let store = new_store();
        let module = wasmer::Module::deserialize_from_file(store.engine(), path);

        if module.is_err() {
            // If an error occurs while deserializing then we can not trust it anymore
            // so delete the cache file
            let _ = std::fs::remove_file(path);
        }

        module
            .ok()
            .map(|module| runtime::ModuleCache(Box::new(WasmerCache { store, module })))
    }

    fn store_cache(&self, path: &Path, cache: &runtime::ModuleCache) -> anyhow::Result<()> {
        let cache = cache.0.downcast_ref::<WasmerCache>().unwrap();
        cache.module.serialize_to_file(path)?;
        Ok(())
    }
}

impl runtime::Instance for WasmerInstance {
    fn transform(
        &mut self,
        program_ptr: u32,
        program_len: u32,
        unresolved_mark: u32,
        should_enable_comments_proxy: u32,
    ) -> anyhow::Result<u32> {
        self.transform_func
            .call(
                &mut self.store,
                program_ptr,
                program_len,
                unresolved_mark,
                should_enable_comments_proxy,
            )
            .map_err(Into::into)
    }

    fn caller(&mut self) -> anyhow::Result<Box<dyn runtime::Caller<'_> + '_>> {
        Ok(Box::new(WasmerCaller {
            memory: self.memory.clone(),
            store: &mut self.store,
            alloc_func: &self.alloc_func,
            free_func: &self.free_func,
        }))
    }

    fn cache(&self) -> Option<runtime::ModuleCache> {
        let store = wasmer::Store::new(self.store.engine().clone());
        let module = self.module.clone();
        Some(runtime::ModuleCache(Box::new(WasmerCache {
            store,
            module,
        })))
    }

    fn cleanup(&mut self) -> anyhow::Result<()> {
        // [TODO]: disabled for now as it always panic if it is being called
        // inside of tokio runtime
        // https://github.com/wasmerio/wasmer/discussions/3966
        // [NOTE]: this is not a critical as plugin does not have things to clean up
        // in most cases
        if let Some(_wasi_env) = Some(()) {
            //wasi_env.cleanup(&mut self.store, None);
        }

        Ok(())
    }
}

impl<'a> runtime::Caller<'a> for WasmerCaller<'a> {
    fn read_buf(&self, ptr: u32, buf: &mut [u8]) -> anyhow::Result<()> {
        let view = self.memory.view(self.store);
        view.read(ptr.into(), buf)?;
        Ok(())
    }

    fn write_buf(&mut self, ptr: u32, buf: &[u8]) -> anyhow::Result<()> {
        let view = self.memory.view(&self.store);
        // [TODO]: we need wasmer@3 compatible optimization like before
        // https://github.com/swc-project/swc/blob/f73f96dd94639f8b7edcdb6290653e16bf848db6/crates/swc_plugin_runner/src/memory_interop.rs#L54
        view.write(ptr.into(), buf)?;
        Ok(())
    }

    fn alloc(&mut self, size: u32) -> anyhow::Result<u32> {
        self.alloc_func
            .call(&mut self.store, size)
            .map_err(Into::into)
    }

    fn free(&mut self, ptr: u32, size: u32) -> anyhow::Result<u32> {
        self.free_func
            .call(&mut self.store, ptr, size)
            .map_err(Into::into)
    }
}

impl<'a> runtime::Caller<'a> for WasmerCallerRef<'a> {
    fn read_buf(&self, ptr: u32, buf: &mut [u8]) -> anyhow::Result<()> {
        let view = self.memory.view(&self.store);
        view.read(ptr.into(), buf)?;
        Ok(())
    }

    fn write_buf(&mut self, ptr: u32, buf: &[u8]) -> anyhow::Result<()> {
        let view = self.memory.view(&self.store);
        view.write(ptr.into(), buf)?;
        Ok(())
    }

    fn alloc(&mut self, size: u32) -> anyhow::Result<u32> {
        self.alloc_func
            .call(&mut self.store, size)
            .map_err(Into::into)
    }

    fn free(&mut self, ptr: u32, size: u32) -> anyhow::Result<u32> {
        self.free_func
            .call(&mut self.store, ptr, size)
            .map_err(Into::into)
    }
}

fn wasmer_func_call(
    mut table: wasmer::FunctionEnvMut<'_, WasmerTable>,
    input: &[wasmer::Value],
    func: &runtime::Func,
) -> Result<Vec<wasmer::Value>, wasmer::RuntimeError> {
    let memory = table.data().memory.clone().unwrap();
    let alloc_func = table.data().alloc_func.clone().unwrap();
    let free_func = table.data().free_func.clone().unwrap();
    let store = table.as_store_mut();
    let mut caller = WasmerCallerRef {
        store,
        memory,
        alloc_func: &alloc_func,
        free_func: &free_func,
    };

    let input = input[..func.sign.0 as usize]
        .iter()
        .map(|v| match v {
            wasmer::Value::I32(v) => Ok(*v),
            _ => Err(wasmer::RuntimeError::new("not support argument type")),
        })
        .collect::<Result<Vec<runtime::Value>, _>>()?;
    let mut output = vec![0; func.sign.1 as usize];

    (func.func)(&mut caller, &input, &mut output);

    Ok(output.into_iter().map(wasmer::Value::I32).collect())
}
