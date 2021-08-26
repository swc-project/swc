use anyhow::{Context, Error};
use dashmap::DashMap;
use once_cell::sync::Lazy;
use std::{
    path::{Path, PathBuf},
    sync::Arc,
};
use swc_ecma_ast::Program;
use wasmer::{Array, Instance, NativeFunc, Store, Universal, WasmPtr};
use wasmer_compiler_cranelift::Cranelift;
use wasmer_wasi::WasiState;

fn load_wasm(path: Arc<PathBuf>) -> Result<wasmer::Module, Error> {
    static STORE: Lazy<Store> = Lazy::new(|| {
        let compiler = Cranelift::new();
        let store = Store::new(
            &Universal::new(compiler)
                .features(wasmer::Features {
                    threads: true,
                    simd: true,
                    ..Default::default()
                })
                .engine(),
        );

        store
    });

    static CACHE: Lazy<DashMap<Arc<PathBuf>, wasmer::Module>> = Lazy::new(|| Default::default());

    (|| -> Result<_, Error> {
        if let Some(cache) = CACHE.get(&path) {
            return Ok((*cache).clone());
        }

        let module = wasmer::Module::from_file(&STORE, &**path)
            .context("failed to create wasm module from file")?;

        CACHE.insert(path.clone(), module.clone());

        Ok(module)
    })()
    .with_context(|| format!("failed to load wasm file at `{}`", path.display()))
}

fn set_wasm_memory(wasm: &Instance, memory_name: &str, value: &str) -> Result<(), Error> {
    let mem = wasm
        .exports
        .get_memory(&memory_name)
        .with_context(|| format!("failed to get memory `{}`", memory_name))?;

    Ok(())
}

pub fn apply_js_plugin(
    program: &Program,
    config_json: &str,
    path: &Path,
) -> Result<Program, Error> {
    (|| -> Result<_, Error> {
        let ast_json =
            serde_json::to_string(&program).context("failed to serialize program as json")?;

        let path = path
            .canonicalize()
            .context("failed to canonicalize wasm path")?;

        let plugin = load_wasm(Arc::new(path))?;

        let mut wasi_env = WasiState::new("swc-plugin")
            .finalize()
            .context("failed to initialize wasi")?;

        let import_object = wasi_env
            .import_object_for_all_wasi_versions(&plugin)
            .context("failed to create import object from wasi_env")?;

        let instance =
            Instance::new(&plugin, &import_object).context("failed to instantiate a wasm file")?;

        let new_ast_mem = instance
            .exports
            .get_memory("new_ast_str")
            .context("failed to get memory for `new_ast_str`")?;

        set_wasm_memory(&instance, "ast_str", &ast_json)?;
        set_wasm_memory(&instance, "config_str", &config_json)?;

        let f: NativeFunc<(), (WasmPtr<u8, Array>, u32)> = instance
            .exports
            .get_native_function("process_js")
            .context("the function named `process_js` is not found")?;

        let (ptr, length) = f.call().context("call to `process_js` failed")?;

        let new_ast = ptr.get_utf8_string(&new_ast_mem, length as u32).unwrap();

        let new = serde_json::from_str(&new_ast)
            .with_context(|| format!("plugin generated invalid ast: `{}`", new_ast))?;

        Ok(new)
    })()
    .with_context(|| {
        format!(
            "failed to invoke `{}` as js processor plugin",
            path.display()
        )
    })
}
