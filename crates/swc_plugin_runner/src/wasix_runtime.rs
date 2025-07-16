#![allow(unused)]

use std::{path::PathBuf, sync::Arc};

use parking_lot::Mutex;
use swc_common::sync::Lazy;
use wasmer::Store;
use wasmer_wasix::Runtime;
use crate::runtime;

/// A shared instance to plugin runtime engine.
/// ref: https://github.com/wasmerio/wasmer/issues/3793#issuecomment-1607117480
static ENGINE: Lazy<Mutex<wasmer::Engine>> = Lazy::new(|| {
    // Use empty enumset to disable simd.
    use enumset::EnumSet;
    use wasmer::sys::{BaseTunables, CompilerConfig, EngineBuilder, Target, Triple};
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

/// Dummy http client for wasix runtime to avoid instantiation failure for the
/// default pluggable runtime. We don't support network in the host runtime
/// anyway (we init vnet instead), and for the default runtime mostly it's for
/// the wapm registry which is redundant for the plugin.
#[derive(Debug)]
struct StubHttpClient;

impl wasmer_wasix::http::HttpClient for StubHttpClient {
    fn request(
        &self,
        _request: wasmer_wasix::http::HttpRequest,
    ) -> futures::future::BoxFuture<'_, Result<wasmer_wasix::http::HttpResponse, anyhow::Error>>
    {
        unimplemented!()
    }
}

/// Construct a runtime for the wasix engine depends on the compilation
/// features.
///
/// This is mainly for the case if a host already sets up its runtime, which
/// makes wasix initialization fails due to conflicting runtime. When specified,
/// instead of using default runtime it'll try to use shared one.
pub fn build_wasi_runtime(
    _fs_cache_path: Option<PathBuf>,
) -> Option<Arc<dyn Runtime + Send + Sync>> {
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

pub struct WasmerRuntimeBuidler;

pub struct WasmerStore {
    table: wasmer::FunctionEnv<Vec<runtime::PluginFunc>>,
    store: Store,
}

pub struct WasmerFunc(wasmer::Function);

pub struct WasmerInstance {
    instance: wasmer::Instance,
    store: Box<WasmerStore>,
    wasi_env: Option<wasmer_wasix::WasiFunctionEnv>,
    memory: wasmer::Memory,
    alloc_func: wasmer::TypedFunction<u32, u32>,
    free_func: wasmer::TypedFunction<(u32, u32), u32>,
    transform_func: wasmer::TypedFunction<(u32, u32, u32, u32), u32>
}

pub struct WasmerView<'a>(wasmer::WasmSlice<'a, u8>);

impl runtime::Builder for WasmerRuntimeBuidler {
    fn new_store(&self) -> anyhow::Result<runtime::Store> {
        let mut store = new_store();
        let table = wasmer::FunctionEnv::new(&mut store, Vec::new());
        
        Ok(runtime::Store(Box::new(WasmerStore {
            table, store 
        })))
    }

    fn new_func(&self, store: &mut runtime::Store, func: runtime::PluginFunc)
        -> anyhow::Result<runtime::Func>
    {
        let store = store.0.downcast_mut::<WasmerStore>().unwrap();

        let sign = func.sign;
        let idx = {
            let table = store.table.as_mut(&mut store.store);
            let idx = table.len();
            table.push(func);
            idx
        };

        let sign = wasmer::FunctionType::new(
            vec![wasmer::Type::I32; sign.0 as usize],
            vec![wasmer::Type::I32; sign.1 as usize]
        );
        let func = wasmer::Function::new_with_env(
            &mut store.store,
            &store.table,
            sign,
            move |env, args| wasmer_func_call(env, args, idx)
        );
        Ok(runtime::Func(Box::new(WasmerFunc(func))))
    }

    fn init(
        &self,
        store: runtime::Store,
        imports: std::collections::HashMap<String, runtime::Func>,
        module: Box<[u8]>,
        _cache: Option<Box<[u8]>>
    )
        -> anyhow::Result<Box<dyn runtime::Instance>>
    {
        let mut store = store.0.downcast::<WasmerStore>().unwrap();
        
        let mut ns = wasmer::Exports::new();
        for (name, func) in imports {
            let func = func.0.downcast::<WasmerFunc>().unwrap();
            ns.insert(name, func.0);
        }
        let mut imports = wasmer::Imports::new();
        imports.register_namespace("env", ns);

        let module = wasmer::Module::new(&store.store, &module)?;

        let (instance, wasi_env) = if wasmer_wasix::is_wasi_module(&module) {
            let name = module.name().unwrap_or("unknown");
            let builder = wasmer_wasix::WasiEnv::builder(name);
            let mut wasi_env = builder.finalize(&mut store.store)?;

            // Then, we get the import object related to our WASI,
            // overwrite into imported_object
            // and attach it to the Wasm instance.
            let wasi_env_import_object = wasi_env.import_object(&mut store.store, &module)?;
            imports.extend(&wasi_env_import_object);

            let instance = wasmer::Instance::new(&mut store.store, &module, &imports)?;
            wasi_env.initialize(&mut store.store, instance.clone())?;
            (instance, Some(wasi_env))
        } else {
            let instance = wasmer::Instance::new(&mut store.store, &module, &imports)?;
            (instance, None)
        };

        // Attach the memory export
        let memory = instance.exports.get_memory("memory")?.clone();
        imports.define("env", "memory", memory.clone());

        // `__alloc` function automatically exported via swc_plugin sdk to allow
        // allocation in guest memory space
        let alloc_func: wasmer::TypedFunction<u32, u32> = instance.exports.get_typed_function(&store.store, "__alloc")?;

        // `__free` function automatically exported via swc_plugin sdk to allow
        // deallocation in guest memory space        
        let free_func: wasmer::TypedFunction<(u32, u32), u32> = instance.exports.get_typed_function(&store.store, "__free")?;

        // Main transform interface plugin exports
        let transform_func: wasmer::TypedFunction<(u32, u32, u32, u32), u32> = instance.exports.get_typed_function(&store.store, "__transform_plugin_process_impl")?;

        Ok(Box::new(WasmerInstance {
            instance, store, wasi_env,
            memory,
            alloc_func, free_func, transform_func
        }))        
    }
}

impl runtime::Instance for WasmerInstance {
    fn alloc(&mut self, size: u32) -> anyhow::Result<u32> {
        self.alloc_func.call(&mut self.store.store, size).map_err(Into::into)
    }

    fn free(&mut self, ptr: u32, size: u32) -> anyhow::Result<u32> {
        self.free_func.call(&mut self.store.store, ptr, size).map_err(Into::into)
    }

    fn transform(&mut self) {
        todo!()
    }

    fn read_buf(&self, ptr: u32, buf: &mut [u8]) -> anyhow::Result<()> {
        let view = self.memory.view(&self.store.store);
        view.read(ptr.into(), buf)?;
        Ok(())
    }

    fn write_buf(&mut self, ptr: u32, buf: &[u8]) -> anyhow::Result<()> {
        let view = self.memory.view(&self.store.store);
        view.write(ptr.into(), buf)?;
        Ok(())
    }
    
    fn cache(&self) -> anyhow::Result<Option<Box<[u8]>>> {
        todo!()
    }
}

fn wasmer_func_call(
    table: wasmer::FunctionEnvMut<'_, Vec<runtime::PluginFunc>>,
    input: &[wasmer::Value],
    idx: usize
) -> Result<Vec<wasmer::Value>, wasmer::RuntimeError> {
    let func = table.data()
        .get(idx)
        .ok_or_else(|| wasmer::RuntimeError::new("bad wasm func index"))?;
    
    let input = input[..func.sign.0 as usize].iter()
        .map(|v| match v {
            wasmer::Value::I32(v) => Ok(*v),
            _ => Err(wasmer::RuntimeError::new("not support argument type"))
        })
        .collect::<Result<Vec<runtime::Value>, _>>()?;
    let mut output = vec![0; func.sign.1 as usize];
    
    (func.func)(&input, &mut output);

    Ok(output.into_iter().map(wasmer::Value::I32).collect())
}
