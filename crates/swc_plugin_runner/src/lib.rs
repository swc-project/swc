use std::{
    path::{Path, PathBuf},
    sync::Arc,
};

use anyhow::{anyhow, Context, Error};
use once_cell::sync::Lazy;
use parking_lot::Mutex;
use resolve::PluginCache;
use swc_common::{
    collections::AHashMap,
    errors::{Diagnostic, HANDLER},
    hygiene::MutableMarkContext,
    plugin::{PluginError, Serialized},
    Mark, SyntaxContext,
};
use wasmer::{
    imports, Array, Exports, Function, Instance, LazyInit, Memory, Module, Store, WasmPtr,
};
use wasmer_cache::{Cache, Hash};
use wasmer_wasi::{is_wasi_module, WasiState};

pub mod resolve;

fn copy_bytes_into_host(memory: &Memory, bytes_ptr: i32, bytes_ptr_len: i32) -> Vec<u8> {
    let ptr: WasmPtr<u8, Array> = WasmPtr::new(bytes_ptr as _);

    // Deref & read through plugin's wasm memory space via returned ptr
    let derefed_ptr = ptr
        .deref(memory, 0, bytes_ptr_len as u32)
        .expect("Should able to deref from given ptr");

    derefed_ptr
        .iter()
        .enumerate()
        .take(bytes_ptr_len as usize)
        .map(|(_size, cell)| cell.get())
        .collect::<Vec<u8>>()
}

/// Locate a view from given memory, write serialized bytes into.
fn write_into_memory_view<F>(
    memory: &Memory,
    serialized_bytes: &Serialized,
    get_allocated_ptr: F,
) -> (i32, i32)
where
    F: Fn(usize) -> i32,
{
    let serialized = serialized_bytes.as_ref();
    let serialized_len = serialized.len();

    let ptr_start = get_allocated_ptr(serialized_len);
    let ptr_start_size = ptr_start
        .try_into()
        .expect("Should be able to convert to usize");

    // Note: it's important to get a view from memory _after_ alloc completes
    let view = memory.view::<u8>();

    // loop over the Wasm memory view's bytes, assign bytes value of alignedvec from
    // serialized
    for (cell, byte) in view[ptr_start_size..ptr_start_size + serialized_len + 1]
        .iter()
        .zip(serialized.iter())
    {
        cell.set(*byte)
    }

    (
        ptr_start,
        serialized_len
            .try_into()
            .expect("Should be able to convert to i32"),
    )
}

/// Set plugin's transformed result into host's enviroment.
/// This is an `imported` fn - when we instantiate plugin module, we inject this
/// fn into pluging's export space. Once transform completes, plugin will call
/// this to set its result back to host.
fn set_transform_result(env: &HostEnvironment, bytes_ptr: i32, bytes_ptr_len: i32) {
    if let Some(memory) = env.memory_ref() {
        (*env.transform_result.lock()) = copy_bytes_into_host(memory, bytes_ptr, bytes_ptr_len);
    }
}

fn emit_diagnostics(env: &HostEnvironment, bytes_ptr: i32, bytes_ptr_len: i32) {
    if let Some(memory) = env.memory_ref() {
        if HANDLER.is_set() {
            HANDLER.with(|handler| {
                let diagnostics_bytes = copy_bytes_into_host(memory, bytes_ptr, bytes_ptr_len);
                let serialized = Serialized::new_for_plugin(&diagnostics_bytes[..], bytes_ptr_len);
                let diagnostic = Serialized::deserialize::<Diagnostic>(&serialized)
                    .expect("Should able to be deserialized into diagnsotic");

                let mut builder =
                    swc_common::errors::DiagnosticBuilder::new_diagnostic(handler, diagnostic);
                builder.emit();
            })
        }
    }
}

/// A proxy to Mark::fresh() that can be used in plugin.
/// This it not direcly called by plugin, instead `impl Mark` will selectively
/// call this depends on the running context.
fn mark_fresh_proxy(parent: u32) -> u32 {
    Mark::fresh(Mark::from_u32(parent)).as_u32()
}

fn mark_parent_proxy(self_mark: u32) -> u32 {
    Mark::from_u32(self_mark).parent().as_u32()
}

fn mark_is_builtin_proxy(self_mark: u32) -> u32 {
    Mark::from_u32(self_mark).is_builtin() as u32
}

fn mark_set_builtin_proxy(self_mark: u32, is_builtin: u32) {
    Mark::from_u32(self_mark).set_is_builtin(is_builtin != 0);
}

/// A proxy to Mark::is_descendant_of_() that can be used in plugin.
/// Origianl call site have mutable param, which we'll pass over as return value
/// via serialized MutableMarkContext.
/// Inside of guest context, once this host function returns it'll assign params
/// with return value accordingly.
fn mark_is_descendant_of_proxy(
    env: &HostEnvironment,
    self_mark: u32,
    ancestor: u32,
    allocated_ptr: i32,
) {
    let self_mark = Mark::from_u32(self_mark);
    let ancestor = Mark::from_u32(ancestor);

    let return_value = self_mark.is_descendant_of(ancestor);

    if let Some(memory) = env.memory_ref() {
        let serialized_bytes = Serialized::serialize(&MutableMarkContext(
            self_mark.as_u32(),
            0,
            return_value as u32,
        ))
        .expect("Should be serializable");

        write_into_memory_view(memory, &serialized_bytes, |_| allocated_ptr);
    }
}

fn mark_least_ancestor_proxy(env: &HostEnvironment, a: u32, b: u32, allocated_ptr: i32) {
    let a = Mark::from_u32(a);
    let b = Mark::from_u32(b);

    let return_value = Mark::least_ancestor(a, b).as_u32();

    if let Some(memory) = env.memory_ref() {
        let serialized_bytes =
            Serialized::serialize(&MutableMarkContext(a.as_u32(), b.as_u32(), return_value))
                .expect("Should be serializable");

        write_into_memory_view(memory, &serialized_bytes, |_| allocated_ptr);
    }
}

fn syntax_context_apply_mark_proxy(self_syntax_context: u32, mark: u32) -> u32 {
    SyntaxContext::from_u32(self_syntax_context)
        .apply_mark(Mark::from_u32(mark))
        .as_u32()
}

fn syntax_context_remove_mark_proxy(env: &HostEnvironment, self_mark: u32, allocated_ptr: i32) {
    let mut self_mark = SyntaxContext::from_u32(self_mark);

    let return_value = self_mark.remove_mark();

    if let Some(memory) = env.memory_ref() {
        let serialized_bytes = Serialized::serialize(&MutableMarkContext(
            self_mark.as_u32(),
            0,
            return_value.as_u32(),
        ))
        .expect("Should be serializable");

        write_into_memory_view(memory, &serialized_bytes, |_| allocated_ptr);
    }
}

fn syntax_context_outer_proxy(self_mark: u32) -> u32 {
    SyntaxContext::from_u32(self_mark).outer().as_u32()
}

#[derive(wasmer::WasmerEnv, Clone)]
/// An external enviornment state imported (declared in host, injected into
/// guest) fn can access. This'll allow host access updated state via plugin's
/// transform.
/// ref: https://docs.wasmer.io/integrations/examples/host-functions#declaring-the-data
struct HostEnvironment {
    #[wasmer(export)]
    memory: wasmer::LazyInit<Memory>,
    transform_result: Arc<Mutex<Vec<u8>>>,
}

/// Load plugin from specified path.
/// If cache is provided, it'll try to load from cache first to avoid
/// compilation.
///
/// Since plugin will be initialized per-file transform, this function tries to
/// avoid reading filesystem per each initialization via naive in-memory map
/// which stores raw bytecodes from file. Unlike compiled bytecode cache for the
/// wasm, this is volatile.
///
/// ### Notes
/// [This code](https://github.com/swc-project/swc/blob/fc4c6708f24cda39640fbbfe56123f2f6eeb2474/crates/swc/src/plugin.rs#L19-L44)
/// includes previous incorrect attempt to workaround file read issues.
/// In actual transform, `plugins` is also being called per each transform.
fn load_plugin(
    plugin_path: &Path,
    cache: &mut Option<PluginCache>,
) -> Result<(Instance, Arc<Mutex<Vec<u8>>>), Error> {
    static BYTE_CACHE: Lazy<Mutex<AHashMap<PathBuf, Arc<Vec<u8>>>>> = Lazy::new(Default::default);

    // TODO: This caching streategy does not consider few edge cases.
    // 1. If process is long-running (devServer) binary change in the middle of
    // process won't be reflected.
    // 2. If reading binary fails somehow it won't bail out but keep retry.
    let module_bytes_key = plugin_path.to_path_buf();
    let cached_bytes = BYTE_CACHE.lock().get(&module_bytes_key).cloned();
    let module_bytes = if let Some(cached_bytes) = cached_bytes {
        cached_bytes
    } else {
        let fresh_module_bytes = std::fs::read(plugin_path)
            .map(Arc::new)
            .context("Cannot read plugin from specified path")?;

        BYTE_CACHE
            .lock()
            .insert(module_bytes_key, fresh_module_bytes.clone());

        fresh_module_bytes
    };

    // TODO: can we share store instances across each plugin binaries?
    let wasmer_store = Store::default();

    let load_from_cache = |c: &mut PluginCache, hash: Hash| match c {
        PluginCache::File(filesystem_cache) => unsafe {
            filesystem_cache.load(&wasmer_store, hash)
        },
    };

    let store_into_cache = |c: &mut PluginCache, hash: Hash, module: &Module| match c {
        PluginCache::File(filesystem_cache) => filesystem_cache.store(hash, module),
    };

    let hash = Hash::generate(&module_bytes);

    let load_cold_wasm_bytes =
        || Module::new(&wasmer_store, module_bytes.as_ref()).context("Cannot compile plugin");

    let module = if let Some(cache) = cache {
        let cached_module =
            load_from_cache(cache, hash).context("Failed to load plugin from cache");

        match cached_module {
            Ok(module) => Ok(module),
            Err(err) => {
                let loaded_module = load_cold_wasm_bytes().map_err(|_| err);
                match &loaded_module {
                    Ok(module) => {
                        if let Err(err) = store_into_cache(cache, hash, module) {
                            loaded_module
                                .map_err(|_| err)
                                .context("Failed to store compiled plugin into cache")
                        } else {
                            loaded_module
                        }
                    }
                    Err(..) => loaded_module,
                }
            }
        }
    } else {
        load_cold_wasm_bytes()
    };

    return match module {
        Ok(module) => {
            let transform_result: Arc<Mutex<Vec<u8>>> = Arc::new(Mutex::new(vec![]));
            let set_transform_result_fn_decl = Function::new_native_with_env(
                &wasmer_store,
                HostEnvironment {
                    memory: LazyInit::default(),
                    transform_result: transform_result.clone(),
                },
                set_transform_result,
            );

            let emit_diagnostics_fn_decl = Function::new_native_with_env(
                &wasmer_store,
                HostEnvironment {
                    memory: LazyInit::default(),
                    transform_result: transform_result.clone(),
                },
                emit_diagnostics,
            );

            let mark_fresh_fn_decl = Function::new_native(&wasmer_store, mark_fresh_proxy);
            let mark_parent_fn_decl = Function::new_native(&wasmer_store, mark_parent_proxy);
            let mark_is_builtin_fn_decl =
                Function::new_native(&wasmer_store, mark_is_builtin_proxy);
            let mark_set_builtin_fn_decl =
                Function::new_native(&wasmer_store, mark_set_builtin_proxy);
            let mark_is_descendant_of_fn_decl = Function::new_native_with_env(
                &wasmer_store,
                HostEnvironment {
                    memory: LazyInit::default(),
                    transform_result: transform_result.clone(),
                },
                mark_is_descendant_of_proxy,
            );

            let mark_least_ancestor_fn_decl = Function::new_native_with_env(
                &wasmer_store,
                HostEnvironment {
                    memory: LazyInit::default(),
                    transform_result: transform_result.clone(),
                },
                mark_least_ancestor_proxy,
            );

            let syntax_context_apply_mark_fn_decl =
                Function::new_native(&wasmer_store, syntax_context_apply_mark_proxy);
            let syntax_context_remove_mark_fn_decl = Function::new_native_with_env(
                &wasmer_store,
                HostEnvironment {
                    memory: LazyInit::default(),
                    transform_result: transform_result.clone(),
                },
                syntax_context_remove_mark_proxy,
            );
            let syntax_context_outer_fn_decl =
                Function::new_native(&wasmer_store, syntax_context_outer_proxy);

            // Plugin binary can be either wasm32-wasi or wasm32-unknown-unknown
            let import_object = if is_wasi_module(&module) {
                // Create the `WasiEnv`.
                let mut wasi_env = WasiState::new(
                    plugin_path
                        .file_name()
                        .and_then(|f| f.to_str())
                        .expect("Plugin path missing file name"),
                )
                .finalize()?;

                // Generate an `ImportObject` from wasi_env
                let mut import_object = wasi_env.import_object(&module)?;

                // This'll inject few interfaces into plugin's namespace to let plugin
                // communicate with host
                let mut env = Exports::new();
                env.insert("__set_transform_result", set_transform_result_fn_decl);
                env.insert("__emit_diagnostics", emit_diagnostics_fn_decl);

                env.insert("__mark_fresh_proxy", mark_fresh_fn_decl);
                env.insert("__mark_parent_proxy", mark_parent_fn_decl);
                env.insert("__mark_is_builtin_proxy", mark_is_builtin_fn_decl);
                env.insert("__mark_set_builtin_proxy", mark_set_builtin_fn_decl);
                env.insert(
                    "__mark_is_descendant_of_proxy",
                    mark_is_descendant_of_fn_decl,
                );
                env.insert("__mark_least_ancestor", mark_least_ancestor_fn_decl);
                env.insert(
                    "__syntax_context_apply_mark_proxy",
                    syntax_context_apply_mark_fn_decl,
                );
                env.insert(
                    "__syntax_context_remove_mark_proxy",
                    syntax_context_remove_mark_fn_decl,
                );
                env.insert("__syntax_context_outer_proxy", syntax_context_outer_fn_decl);

                import_object.register("env", env);
                import_object
            }
            // Not able to detect wasi version in binary - assume plugin targets
            // wasm32-unknown-unknown
            else {
                imports! {
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
                }
            };

            Instance::new(&module, &import_object)
                .map(|i| (i, transform_result))
                .context("Failed to create plugin instance")
        }
        Err(err) => Err(err),
    };
}

/// Wraps wasm plugin's exports and its allocated resource to allow easier
/// teardown
struct PluginTransformTracker {
    // Main transform interface plugin exports
    exported_plugin_transform: wasmer::NativeFunc<(i32, i32, i32, i32, i32, i32), i32>,
    // `__free` function automatically exported via swc_plugin sdk to allow deallocation in guest
    // memory space
    exported_plugin_free: wasmer::NativeFunc<(i32, i32), i32>,
    // `__alloc` function automatically exported via swc_plugin sdk to allow allocation in guest
    // memory space
    exported_plugin_alloc: wasmer::NativeFunc<u32, i32>,
    instance: Instance,
    // Reference to the pointers succesfully allocated which'll be freed by Drop.
    allocated_ptr_vec: Vec<(i32, i32)>,
    transform_result: Arc<Mutex<Vec<u8>>>,
}

impl PluginTransformTracker {
    fn new(path: &Path, cache: &mut Option<PluginCache>) -> Result<PluginTransformTracker, Error> {
        let (instance, transform_result) = load_plugin(path, cache)?;

        let tracker = PluginTransformTracker {
            exported_plugin_transform: instance
                .exports
                .get_native_function::<(i32, i32, i32, i32, i32, i32), i32>(
                    "__plugin_process_impl",
                )?,
            exported_plugin_free: instance
                .exports
                .get_native_function::<(i32, i32), i32>("__free")?,
            exported_plugin_alloc: instance
                .exports
                .get_native_function::<u32, i32>("__alloc")?,
            instance,
            allocated_ptr_vec: Vec::with_capacity(3),
            transform_result,
        };

        Ok(tracker)
    }

    /// Copy host's serialized bytes into guest (plugin)'s allocated memory.
    /// Once transformation completes, host should free allocated memory.
    fn write_bytes_into_guest(
        &mut self,
        serialized_bytes: &Serialized,
    ) -> Result<(i32, i32), Error> {
        let memory = self.instance.exports.get_memory("memory")?;

        let ptr = write_into_memory_view(memory, serialized_bytes, |serialized_len| {
            self.exported_plugin_alloc
                .call(serialized_len.try_into().expect(""))
                .expect("")
        });

        self.allocated_ptr_vec.push(ptr);
        Ok(ptr)
    }

    /// Copy guest's memory into host, construct serialized struct from raw
    /// bytes.
    fn read_bytes_from_guest(&mut self, returned_ptr_result: i32) -> Result<Serialized, Error> {
        let transformed_result = &(*self.transform_result.lock());
        let ret =
            Serialized::new_for_plugin(&transformed_result[..], transformed_result.len() as i32);

        if returned_ptr_result == 0 {
            Ok(ret)
        } else {
            let err: PluginError = Serialized::deserialize(&ret)?;
            match err {
                PluginError::SizeInteropFailure(msg) => Err(anyhow!(
                    "Failed to convert pointer size to calculate: {}",
                    msg
                )),
                PluginError::Deserialize((msg, ..)) | PluginError::Serialize(msg) => {
                    Err(anyhow!("{}", msg))
                }
                _ => Err(anyhow!(
                    "Unexpected error occurred while running plugin transform"
                )),
            }
        }
    }

    fn transform(
        &mut self,
        program: &Serialized,
        config: &Serialized,
        context: &Serialized,
    ) -> Result<Serialized, Error> {
        let guest_program_ptr = self.write_bytes_into_guest(program)?;
        let config_str_ptr = self.write_bytes_into_guest(config)?;
        let context_str_ptr = self.write_bytes_into_guest(context)?;

        let result = self.exported_plugin_transform.call(
            guest_program_ptr.0,
            guest_program_ptr.1,
            config_str_ptr.0,
            config_str_ptr.1,
            context_str_ptr.0,
            context_str_ptr.1,
        )?;

        self.read_bytes_from_guest(result)
    }
}

impl Drop for PluginTransformTracker {
    fn drop(&mut self) {
        for ptr in self.allocated_ptr_vec.iter() {
            self.exported_plugin_free
                .call(ptr.0, ptr.1)
                .expect("Failed to free memory allocated in the plugin");
        }
    }
}

pub fn apply_js_plugin(
    plugin_name: &str,
    path: &Path,
    cache: &mut Option<PluginCache>,
    program: Serialized,
    config_json: Serialized,
    context_json: Serialized,
) -> Result<Serialized, Error> {
    (|| -> Result<_, Error> {
        let mut transform_tracker = PluginTransformTracker::new(path, cache)?;

        transform_tracker.transform(&program, &config_json, &context_json)
    })()
    .with_context(|| {
        format!(
            "failed to invoke `{}` as js transform plugin at {}",
            plugin_name,
            path.display()
        )
    })
}
