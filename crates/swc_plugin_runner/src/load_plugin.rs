use std::sync::Arc;

use anyhow::{Context, Error};
use parking_lot::Mutex;
use wasmer::{imports, ChainableNamedResolver, Function, Instance, LazyInit};
use wasmer_wasi::{is_wasi_module, WasiState};

use crate::{
    context::HostEnvironment,
    imported_fn::{
        emit_diagnostics, mark_fresh_proxy, mark_is_builtin_proxy, mark_is_descendant_of_proxy,
        mark_least_ancestor_proxy, mark_parent_proxy, mark_set_builtin_proxy, set_transform_result,
        syntax_context_apply_mark_proxy, syntax_context_outer_proxy,
        syntax_context_remove_mark_proxy,
    },
};

#[tracing::instrument(level = "info", skip_all)]
pub fn load_plugin(
    plugin_path: &std::path::Path,
    cache: &once_cell::sync::Lazy<crate::cache::PluginModuleCache>,
) -> Result<(Instance, Arc<Mutex<Vec<u8>>>), Error> {
    let module = cache.load_module(plugin_path);

    return match module {
        Ok(module) => {
            let wasmer_store = module.store();
            let transform_result: Arc<Mutex<Vec<u8>>> = Arc::new(Mutex::new(vec![]));
            let set_transform_result_fn_decl = Function::new_native_with_env(
                wasmer_store,
                HostEnvironment {
                    memory: LazyInit::default(),
                    transform_result: transform_result.clone(),
                },
                set_transform_result,
            );

            let emit_diagnostics_fn_decl = Function::new_native_with_env(
                wasmer_store,
                HostEnvironment {
                    memory: LazyInit::default(),
                    transform_result: transform_result.clone(),
                },
                emit_diagnostics,
            );

            let mark_fresh_fn_decl = Function::new_native(wasmer_store, mark_fresh_proxy);
            let mark_parent_fn_decl = Function::new_native(wasmer_store, mark_parent_proxy);
            let mark_is_builtin_fn_decl = Function::new_native(wasmer_store, mark_is_builtin_proxy);
            let mark_set_builtin_fn_decl =
                Function::new_native(wasmer_store, mark_set_builtin_proxy);
            let mark_is_descendant_of_fn_decl = Function::new_native_with_env(
                wasmer_store,
                HostEnvironment {
                    memory: LazyInit::default(),
                    transform_result: transform_result.clone(),
                },
                mark_is_descendant_of_proxy,
            );

            let mark_least_ancestor_fn_decl = Function::new_native_with_env(
                wasmer_store,
                HostEnvironment {
                    memory: LazyInit::default(),
                    transform_result: transform_result.clone(),
                },
                mark_least_ancestor_proxy,
            );

            let syntax_context_apply_mark_fn_decl =
                Function::new_native(wasmer_store, syntax_context_apply_mark_proxy);
            let syntax_context_remove_mark_fn_decl = Function::new_native_with_env(
                wasmer_store,
                HostEnvironment {
                    memory: LazyInit::default(),
                    transform_result: transform_result.clone(),
                },
                syntax_context_remove_mark_proxy,
            );
            let syntax_context_outer_fn_decl =
                Function::new_native(wasmer_store, syntax_context_outer_proxy);

            let import_object = imports! {
                "env" => {
                    "__set_transform_result" => set_transform_result_fn_decl,
                    "__emit_diagnostics" => emit_diagnostics_fn_decl,
                    "__mark_fresh_proxy" => mark_fresh_fn_decl,
                    "__mark_parent_proxy" => mark_parent_fn_decl,
                    "__mark_is_builtin_proxy" => mark_is_builtin_fn_decl,
                    "__mark_set_builtin_proxy" => mark_set_builtin_fn_decl,
                    "__mark_is_descendant_of_proxy" => mark_is_descendant_of_fn_decl,
                    "__mark_least_ancestor" => mark_least_ancestor_fn_decl,
                    "__syntax_context_apply_mark_proxy" => syntax_context_apply_mark_fn_decl,
                    "__syntax_context_remove_mark_proxy" => syntax_context_remove_mark_fn_decl,
                    "__syntax_context_outer_proxy" => syntax_context_outer_fn_decl
                }
            };

            // Plugin binary can be either wasm32-wasi or wasm32-unknown-unknown.
            // Wasi specific env need to be initialized if given module targets wasm32-wasi.
            let instance = if is_wasi_module(&module) {
                // Create the `WasiEnv`.
                let mut wasi_env = WasiState::new(
                    plugin_path
                        .file_name()
                        .and_then(|f| f.to_str())
                        .expect("Plugin path missing file name"),
                )
                .finalize()?;

                // Generate an `ImportObject` from wasi_env, overwrite into imported_object
                let wasi_env_import_object = wasi_env.import_object(&module)?;
                let chained_resolver = import_object.chain_front(wasi_env_import_object);
                Instance::new(&module, &chained_resolver)
            } else {
                Instance::new(&module, &import_object)
            };

            instance
                .map(|i| (i, transform_result))
                .context("Failed to create plugin instance")
        }
        Err(err) => Err(err),
    };
}
