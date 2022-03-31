//! Functions for syntax_pos::hygiene imported into the guests (plugin) runtime
//! allows interop between host's state to plugin. When guest calls these fn,
//! it'll be executed in host's memory space.
/*
* Below diagram shows one reference example how guest does trampoline between
* host's memory space.
*┌───────────────────────────────────────┐    ┌─────────────────────────────────────────────┐
*│Host (SWC/core)                        │    │Plugin (wasm)                                │
*│  ┌────────────────────────────────┐   │    │                                             │
*│  │COMMENTS.with()                 │   │    │  ┌──────────────────────────────────────┐   │
*│  │                                │   │    │  │PluginCommentsProxy                   │   │
*│  │                                │   │    │  │                                      │   │
*│  │ ┌────────────────────────────┐ │   │    │  │ ┌────────────────────────────────┐   │   │
*│  │ │get_leading_comments_proxy()│◀┼───┼────┼──┼─┤get_leading()                   │   │   │
*│  │ │                            │ │   │    │  │ │                                │   │   │
*│  │ │                            │ │   │    │  │ │ ┌──────────────────────────┐   │   │   │
*│  │ │                            │─┼───┼──┬─┼──┼─┼─▶CommentsVecPtr(ptr, len)  │   │   │   │
*│  │ └────────────────────────────┘ │   │  │ │  │ │ │                          │   │   │   │
*│  │                                │   │  │ │  │ │ └─────────────┬────────────┘   │   │   │
*│  │                                │   │  │ │  │ │               │                │   │   │
*│  │                                │   │  │ │  │ │ ┌─────────────▼────────────┐   │   │   │
*│  └────────────────────────────────┘   │  │ │  │ │ │Vec<Comments>             │   │   │   │
*│                                       │  └─┼──┼─┼─▶                          │   │   │   │
*│                                       │    │  │ │ └──────────────────────────┘   │   │   │
*│                                       │    │  │ └────────────────────────────────┘   │   │
*│                                       │    │  └──────────────────────────────────────┘   │
*└───────────────────────────────────────┘    └─────────────────────────────────────────────┘

* 1. Plugin calls `PluginCommentsProxy::get_leading()`. PluginCommentsProxy is
* a struct constructed in plugin's memory space.
* 2. `get_leading()` internally calls `__get_leading_comments_proxy`, which is
* imported fn `get_leading_comments_proxy` exists in the host.
* 3. Host access necessary values in its memory space (COMMENTS)
* 4. Host copies value to be returned into plguin's memory space. Memory
* allocation for the value should be manually performed.
* 5. Host completes imported fn, `PluginCommentsProxy::get_leading()` now can
* read, deserialize memory host wrote.
* - In case of `get_leading`, returned value is non-deterministic vec
* (`Vec<Comments>`) guest cannot preallocate with specific length. Instead,
* guest passes a fixed size struct (CommentsVecPtr), once host allocates
* actual vec into guest it'll write pointer to the vec into the struct.
*/

use std::sync::Arc;

use parking_lot::Mutex;
use wasmer::{imports, Function, ImportObject, Module};

use crate::{host_environment::HostEnvironment, imported_fn::comments::get_leading_comments_proxy};

mod comments;
mod handler;
mod hygiene;
mod set_transform_result;

use handler::*;
use hygiene::*;
use set_transform_result::*;

/// Create an ImportObject includes functions to be imported from host to the
/// plugins.
pub(crate) fn build_import_object(
    module: &Module,
    transform_result: &Arc<Mutex<Vec<u8>>>,
) -> ImportObject {
    let wasmer_store = module.store();

    // transfrom_result
    let set_transform_result_fn_decl = Function::new_native_with_env(
        wasmer_store,
        HostEnvironment::new(transform_result),
        set_transform_result,
    );

    // handler
    let emit_diagnostics_fn_decl = Function::new_native_with_env(
        wasmer_store,
        HostEnvironment::new(transform_result),
        emit_diagnostics,
    );

    // hygiene
    let mark_fresh_fn_decl = Function::new_native(wasmer_store, mark_fresh_proxy);
    let mark_parent_fn_decl = Function::new_native(wasmer_store, mark_parent_proxy);
    let mark_is_builtin_fn_decl = Function::new_native(wasmer_store, mark_is_builtin_proxy);
    let mark_set_builtin_fn_decl = Function::new_native(wasmer_store, mark_set_builtin_proxy);
    let mark_is_descendant_of_fn_decl = Function::new_native_with_env(
        wasmer_store,
        HostEnvironment::new(transform_result),
        mark_is_descendant_of_proxy,
    );

    let mark_least_ancestor_fn_decl = Function::new_native_with_env(
        wasmer_store,
        HostEnvironment::new(transform_result),
        mark_least_ancestor_proxy,
    );

    let syntax_context_apply_mark_fn_decl =
        Function::new_native(wasmer_store, syntax_context_apply_mark_proxy);
    let syntax_context_remove_mark_fn_decl = Function::new_native_with_env(
        wasmer_store,
        HostEnvironment::new(transform_result),
        syntax_context_remove_mark_proxy,
    );
    let syntax_context_outer_fn_decl =
        Function::new_native(wasmer_store, syntax_context_outer_proxy);

    // comments
    let get_leading_comments_fn_decl = Function::new_native_with_env(
        wasmer_store,
        HostEnvironment::new(transform_result),
        get_leading_comments_proxy,
    );

    imports! {
        "env" => {
            // transform
            "__set_transform_result" => set_transform_result_fn_decl,
            // handler
            "__emit_diagnostics" => emit_diagnostics_fn_decl,
            // hygiene
            "__mark_fresh_proxy" => mark_fresh_fn_decl,
            "__mark_parent_proxy" => mark_parent_fn_decl,
            "__mark_is_builtin_proxy" => mark_is_builtin_fn_decl,
            "__mark_set_builtin_proxy" => mark_set_builtin_fn_decl,
            "__mark_is_descendant_of_proxy" => mark_is_descendant_of_fn_decl,
            "__mark_least_ancestor" => mark_least_ancestor_fn_decl,
            "__syntax_context_apply_mark_proxy" => syntax_context_apply_mark_fn_decl,
            "__syntax_context_remove_mark_proxy" => syntax_context_remove_mark_fn_decl,
            "__syntax_context_outer_proxy" => syntax_context_outer_fn_decl,
            // comments
            "__get_leading_comments_proxy" => get_leading_comments_fn_decl,
        }
    }
}
