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

use crate::{
    host_environment::BaseHostEnvironment,
    imported_fn::{
        comments::{
            add_leading_comment_proxy, add_leading_comments_proxy, add_pure_comment_proxy,
            add_trailing_comment_proxy, add_trailing_comments_proxy, copy_comment_to_host_env,
            get_leading_comments_proxy, get_trailing_comments_proxy, has_leading_comments_proxy,
            has_trailing_comments_proxy, move_leading_comments_proxy, move_trailing_comments_proxy,
            take_leading_comments_proxy, take_trailing_comments_proxy, CommentHostEnvironment,
        },
        set_transform_result::{set_transform_result, TransformResultHostEnvironment},
    },
};

mod comments;
mod handler;
mod hygiene;
mod set_transform_result;

use handler::*;
use hygiene::*;

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
        TransformResultHostEnvironment::new(transform_result),
        set_transform_result,
    );

    // handler
    let emit_diagnostics_fn_decl =
        Function::new_native_with_env(wasmer_store, BaseHostEnvironment::new(), emit_diagnostics);

    // hygiene
    let mark_fresh_fn_decl = Function::new_native(wasmer_store, mark_fresh_proxy);
    let mark_parent_fn_decl = Function::new_native(wasmer_store, mark_parent_proxy);
    let mark_is_builtin_fn_decl = Function::new_native(wasmer_store, mark_is_builtin_proxy);
    let mark_set_builtin_fn_decl = Function::new_native(wasmer_store, mark_set_builtin_proxy);
    let mark_is_descendant_of_fn_decl = Function::new_native_with_env(
        wasmer_store,
        BaseHostEnvironment::new(),
        mark_is_descendant_of_proxy,
    );

    let mark_least_ancestor_fn_decl = Function::new_native_with_env(
        wasmer_store,
        BaseHostEnvironment::new(),
        mark_least_ancestor_proxy,
    );

    let syntax_context_apply_mark_fn_decl =
        Function::new_native(wasmer_store, syntax_context_apply_mark_proxy);
    let syntax_context_remove_mark_fn_decl = Function::new_native_with_env(
        wasmer_store,
        BaseHostEnvironment::new(),
        syntax_context_remove_mark_proxy,
    );
    let syntax_context_outer_fn_decl =
        Function::new_native(wasmer_store, syntax_context_outer_proxy);

    // comments
    let comment_buffer = Arc::new(Mutex::new(vec![]));

    let copy_comment_to_host_env_fn_decl = Function::new_native_with_env(
        wasmer_store,
        CommentHostEnvironment::new(&comment_buffer),
        copy_comment_to_host_env,
    );

    let add_leading_comment_fn_decl = Function::new_native_with_env(
        wasmer_store,
        CommentHostEnvironment::new(&comment_buffer),
        add_leading_comment_proxy,
    );

    let add_leading_comments_fn_decl = Function::new_native_with_env(
        wasmer_store,
        CommentHostEnvironment::new(&comment_buffer),
        add_leading_comments_proxy,
    );

    let has_leading_comments_fn_decl =
        Function::new_native(wasmer_store, has_leading_comments_proxy);

    let move_leading_comments_fn_decl =
        Function::new_native(wasmer_store, move_leading_comments_proxy);

    let take_leading_comments_fn_decl = Function::new_native_with_env(
        wasmer_store,
        // take_* doesn't need to share buffer to pass values from plugin to the host - do not
        // clone buffer here.
        CommentHostEnvironment::new(&Default::default()),
        take_leading_comments_proxy,
    );

    let get_leading_comments_fn_decl = Function::new_native_with_env(
        wasmer_store,
        // get_* doesn't need to share buffer to pass values from plugin to the host - do not clone
        // buffer here.
        CommentHostEnvironment::new(&Default::default()),
        get_leading_comments_proxy,
    );

    let add_trailing_comment_fn_decl = Function::new_native_with_env(
        wasmer_store,
        CommentHostEnvironment::new(&comment_buffer),
        add_trailing_comment_proxy,
    );

    let add_trailing_comments_fn_decl = Function::new_native_with_env(
        wasmer_store,
        CommentHostEnvironment::new(&comment_buffer),
        add_trailing_comments_proxy,
    );

    let has_trailing_comments_fn_decl =
        Function::new_native(wasmer_store, has_trailing_comments_proxy);

    let move_trailing_comments_fn_decl =
        Function::new_native(wasmer_store, move_trailing_comments_proxy);

    let take_trailing_comments_fn_decl = Function::new_native_with_env(
        wasmer_store,
        // take_* doesn't need to share buffer to pass values from plugin to the host - do not
        // clone buffer here.
        CommentHostEnvironment::new(&Default::default()),
        take_trailing_comments_proxy,
    );

    let get_trailing_comments_fn_decl = Function::new_native_with_env(
        wasmer_store,
        // get_* doesn't need to share buffer to pass values from plugin to the host - do not clone
        // buffer here.
        CommentHostEnvironment::new(&Default::default()),
        get_trailing_comments_proxy,
    );

    let add_pure_comment_fn_decl = Function::new_native(wasmer_store, add_pure_comment_proxy);

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
            "__copy_comment_to_host_env" => copy_comment_to_host_env_fn_decl,
            "__add_leading_comment_proxy" => add_leading_comment_fn_decl,
            "__add_leading_comments_proxy" => add_leading_comments_fn_decl,
            "__has_leading_comments_proxy" => has_leading_comments_fn_decl,
            "__move_leading_comments_proxy" => move_leading_comments_fn_decl,
            "__take_leading_comments_proxy" => take_leading_comments_fn_decl,
            "__get_leading_comments_proxy" => get_leading_comments_fn_decl,
            "__add_trailing_comment_proxy" => add_trailing_comment_fn_decl,
            "__add_trailing_comments_proxy" => add_trailing_comments_fn_decl,
            "__has_trailing_comments_proxy" => has_trailing_comments_fn_decl,
            "__move_trailing_comments_proxy" => move_trailing_comments_fn_decl,
            "__take_trailing_comments_proxy" => take_trailing_comments_fn_decl,
            "__get_trailing_comments_proxy" => get_trailing_comments_fn_decl,
            "__add_pure_comment_proxy" => add_pure_comment_fn_decl,
        }
    }
}
