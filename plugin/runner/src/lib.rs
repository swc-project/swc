use anyhow::{anyhow, Context, Error};
use dashmap::DashMap;
use once_cell::sync::Lazy;
use std::{
    path::{Path, PathBuf},
    sync::Arc,
};
use swc_ecma_ast::Program;
use wasmer::{Store, Universal};
use wasmer_compiler_cranelift::Cranelift;

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

pub fn apply_js_plugin(
    program: &Program,
    config_json: &str,
    path: &Path,
) -> Result<Program, Error> {
    (|| -> Result<_, Error> {
        let path = path
            .canonicalize()
            .context("failed to canonicalize wasm path")?;

        let plugin = load_wasm(Arc::new(path))?;

        let ast_json =
            serde_json::to_string(&program).context("failed to serialize program as json")?;

        let plugin_fn = plugin
            .process_js()
            .ok_or_else(|| anyhow!("the plugin does not support transforming js"))?;

        let new_ast = plugin_fn(RStr::from(config_json), RString::from(ast_json));

        let new = match new_ast {
            RResult::ROk(v) => v,
            RResult::RErr(err) => return Err(anyhow!("plugin returned an errror\n{}", err)),
        };
        let new = new.into_string();

        let new = serde_json::from_str(&new)
            .with_context(|| format!("plugin generated invalid ast: `{}`", new))?;

        Ok(new)
    })()
    .with_context(|| {
        format!(
            "failed to invoke `{}` as js transform plugin",
            path.display()
        )
    })
}
