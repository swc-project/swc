use std::path::Path;

use anyhow::Context;
use swc_common::sync::OnceCell;
use swc_plugin_runner::runtime;

/// Identifier for bytecode cache stored in local filesystem.
///
/// This MUST be updated when bump up wasmtime.
const MODULE_SERIALIZATION_IDENTIFIER: &str = concat!("wasmtime", "-", "v35");

static ENGINE: OnceCell<wasmtime::Engine> = OnceCell::new();

#[derive(Clone, Copy, Debug)]
pub struct WasmtimeRuntime;

struct WasmtimeCache(wasmtime::Module);

struct WasmtimeTable {
    memory: Option<wasmtime::Memory>,
    alloc_func: Option<wasmtime::TypedFunc<u32, u32>>,
    free_func: Option<wasmtime::TypedFunc<(u32, u32), u32>>,

    wasi: wasi_common::WasiCtx,
}

struct WasmtimeInstance {
    instance: wasmtime::Instance,
    store: wasmtime::Store<WasmtimeTable>,

    memory: wasmtime::Memory,
    alloc_func: wasmtime::TypedFunc<u32, u32>,
    free_func: wasmtime::TypedFunc<(u32, u32), u32>,
    transform_func: wasmtime::TypedFunc<(u32, u32, u32, u32), u32>,
}

struct WasmtimeCaller<'a> {
    store: &'a mut wasmtime::Store<WasmtimeTable>,
    memory: &'a wasmtime::Memory,
    alloc_func: &'a wasmtime::TypedFunc<u32, u32>,
    free_func: &'a wasmtime::TypedFunc<(u32, u32), u32>,
}

struct WasmtimeCallerRef<'a> {
    caller: wasmtime::Caller<'a, WasmtimeTable>,
    memory: wasmtime::Memory,
    alloc_func: wasmtime::TypedFunc<u32, u32>,
    free_func: wasmtime::TypedFunc<(u32, u32), u32>,
}

fn init_engine() -> anyhow::Result<wasmtime::Engine> {
    let config = wasmtime::Config::default();
    wasmtime::Engine::new(&config)
}

impl runtime::Runtime for WasmtimeRuntime {
    fn identifier(&self) -> &'static str {
        MODULE_SERIALIZATION_IDENTIFIER
    }

    fn prepare_module(&self, bytes: &[u8]) -> anyhow::Result<runtime::ModuleCache> {
        let engine = ENGINE.get_or_try_init(init_engine)?;
        let cache = WasmtimeCache(wasmtime::Module::new(engine, bytes)?);
        Ok(runtime::ModuleCache(Box::new(cache)))
    }

    fn clone_cache(&self, cache: &runtime::ModuleCache) -> Option<runtime::ModuleCache> {
        let WasmtimeCache(module) = cache.0.downcast_ref().unwrap();
        let cache = WasmtimeCache(module.clone());
        Some(runtime::ModuleCache(Box::new(cache)))
    }

    unsafe fn load_cache(&self, path: &Path) -> Option<runtime::ModuleCache> {
        let module = std::fs::read(path).ok()?;
        let engine = ENGINE.get_or_try_init(init_engine).ok()?;
        let cache = wasmtime::Module::deserialize(engine, module).ok()?;
        let cache = WasmtimeCache(cache);
        Some(runtime::ModuleCache(Box::new(cache)))
    }

    fn store_cache(&self, path: &Path, cache: &runtime::ModuleCache) -> anyhow::Result<()> {
        use std::io::{ErrorKind, Write};

        let WasmtimeCache(module) = cache.0.downcast_ref().unwrap();
        let data = module.serialize()?;

        // atomic write
        //
        // TODO use `with_added_extension`
        let tmppath = {
            let mut ext = path.extension().unwrap_or_default().to_owned();
            ext.push(".tmp");
            path.with_extension(ext)
        };
        let mut fd = match std::fs::OpenOptions::new()
            .create_new(true)
            .write(true)
            .open(&tmppath)
        {
            Ok(fd) => fd,
            Err(ref err) if err.kind() == ErrorKind::AlreadyExists => return Ok(()),
            Err(err) => return Err(err.into()),
        };

        // If a write failure or process interruption occurs here,
        // the tmp file cannot be rename, and the cache will never be successfully
        // created.
        //
        // But it should be a low-probability event and will not affect program
        // operation. Users can manually delete the cache.
        fd.write_all(&data)?;
        drop(fd);
        std::fs::rename(&tmppath, path)?;
        Ok(())
    }

    fn init(
        &self,
        _name: &str,
        imports: Vec<(String, runtime::Func)>,
        envs: Vec<(String, String)>,
        module: runtime::Module,
    ) -> anyhow::Result<Box<dyn runtime::Instance>> {
        let engine = ENGINE.get_or_try_init(init_engine)?;

        let module = match module {
            runtime::Module::Cache(cache) => {
                let cache = cache.0.downcast::<WasmtimeCache>().unwrap();
                cache.0
            }
            runtime::Module::Bytes(buf) => wasmtime::Module::new(engine, buf)?,
        };

        let current_dir = std::env::current_dir()?;
        let dir = wasi_common::sync::Dir::open_ambient_dir(
            &current_dir,
            wasi_common::sync::ambient_authority(),
        )?;
        let wasi = wasi_common::sync::WasiCtxBuilder::new()
            .envs(&envs)?
            .preopened_dir(dir, "/cwd")?
            .build();

        let table = WasmtimeTable {
            memory: None,
            alloc_func: None,
            free_func: None,

            wasi,
        };
        let mut linker: wasmtime::Linker<WasmtimeTable> = wasmtime::Linker::new(engine);
        for (name, func) in imports {
            let ty = wasmtime::FuncType::new(
                engine,
                (0..func.sign.0).map(|_| wasmtime::ValType::I32),
                (0..func.sign.1).map(|_| wasmtime::ValType::I32),
            );
            linker.func_new("env", &name, ty, move |caller, input, output| {
                wasmtime_func_call(caller, input, output, &func)
            })?;
        }

        wasi_common::sync::add_to_linker(&mut linker, |t| &mut t.wasi)?;

        let mut store = wasmtime::Store::new(engine, table);
        let instance = linker.instantiate(&mut store, &module)?;

        let memory = instance
            .get_memory(&mut store, "memory")
            .context("miss memory export")?;
        let alloc_func: wasmtime::TypedFunc<u32, u32> =
            instance.get_typed_func(&mut store, "__alloc")?;
        let free_func: wasmtime::TypedFunc<(u32, u32), u32> =
            instance.get_typed_func(&mut store, "__free")?;
        let transform_func: wasmtime::TypedFunc<(u32, u32, u32, u32), u32> =
            instance.get_typed_func(&mut store, "__transform_plugin_process_impl")?;

        store.data_mut().memory = Some(memory);
        store.data_mut().alloc_func = Some(alloc_func.clone());
        store.data_mut().free_func = Some(free_func.clone());

        instance
            .get_typed_func::<(), u32>(&mut store, "__get_transform_plugin_core_pkg_diag")?
            .call(&mut store, ())?;

        Ok(Box::new(WasmtimeInstance {
            store,
            instance,
            memory,
            alloc_func,
            free_func,
            transform_func,
        }))
    }
}

impl runtime::Instance for WasmtimeInstance {
    fn transform(
        &mut self,
        program_ptr: u32,
        program_len: u32,
        unresolved_mark: u32,
        should_enable_comments_proxy: u32,
    ) -> anyhow::Result<u32> {
        self.transform_func.call(
            &mut self.store,
            (
                program_ptr,
                program_len,
                unresolved_mark,
                should_enable_comments_proxy,
            ),
        )
    }

    fn caller(&mut self) -> anyhow::Result<Box<dyn runtime::Caller<'_> + '_>> {
        Ok(Box::new(WasmtimeCaller {
            store: &mut self.store,
            memory: &self.memory,
            alloc_func: &self.alloc_func,
            free_func: &self.free_func,
        }))
    }

    fn cache(&self) -> Option<runtime::ModuleCache> {
        let module = self.instance.module(&self.store);
        let cache = WasmtimeCache(module.clone());
        Some(runtime::ModuleCache(Box::new(cache)))
    }
}

impl<'a> runtime::Caller<'a> for WasmtimeCaller<'a> {
    fn read_buf(&self, ptr: u32, buf: &mut [u8]) -> anyhow::Result<()> {
        self.memory.read(&self.store, ptr as usize, buf)?;
        Ok(())
    }

    fn write_buf(&mut self, ptr: u32, buf: &[u8]) -> anyhow::Result<()> {
        self.memory.write(&mut self.store, ptr as usize, buf)?;
        Ok(())
    }

    fn alloc(&mut self, size: u32) -> anyhow::Result<u32> {
        self.alloc_func.call(&mut self.store, size)
    }

    fn free(&mut self, ptr: u32, size: u32) -> anyhow::Result<u32> {
        self.free_func.call(&mut self.store, (ptr, size))
    }
}

impl<'a> runtime::Caller<'a> for WasmtimeCallerRef<'a> {
    fn read_buf(&self, ptr: u32, buf: &mut [u8]) -> anyhow::Result<()> {
        self.memory.read(&self.caller, ptr as usize, buf)?;
        Ok(())
    }

    fn write_buf(&mut self, ptr: u32, buf: &[u8]) -> anyhow::Result<()> {
        self.memory.write(&mut self.caller, ptr as usize, buf)?;
        Ok(())
    }

    fn alloc(&mut self, size: u32) -> anyhow::Result<u32> {
        self.alloc_func.call(&mut self.caller, size)
    }

    fn free(&mut self, ptr: u32, size: u32) -> anyhow::Result<u32> {
        self.free_func.call(&mut self.caller, (ptr, size))
    }
}

fn wasmtime_func_call(
    caller: wasmtime::Caller<'_, WasmtimeTable>,
    input: &[wasmtime::Val],
    output: &mut [wasmtime::Val],
    func: &runtime::Func,
) -> anyhow::Result<()> {
    assert_eq!(func.sign.0 as usize, input.len());
    assert_eq!(func.sign.1 as usize, output.len());

    let memory = caller.data().memory.unwrap();
    let alloc_func = caller.data().alloc_func.clone().unwrap();
    let free_func = caller.data().free_func.clone().unwrap();

    let mut caller = WasmtimeCallerRef {
        caller,
        memory,
        alloc_func,
        free_func,
    };

    let input = input
        .iter()
        .map(|val| match val {
            wasmtime::Val::I32(v) => Ok(*v),
            _ => Err(anyhow::format_err!("not support argument type")),
        })
        .collect::<anyhow::Result<Vec<i32>>>()?;
    let mut output2 = vec![0; output.len()];

    (func.func)(&mut caller, &input, &mut output2);

    for i in 0..output.len() {
        output[i] = wasmtime::Val::I32(output2[i]);
    }

    Ok(())
}
