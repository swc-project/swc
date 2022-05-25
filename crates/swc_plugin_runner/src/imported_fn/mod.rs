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
*│  │ │                            │─┼───┼──┬─┼──┼─┼─▶AllocatedBytesPtr(p,len)  │   │   │   │
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
* 4. Host copies value to be returned into plugin's memory space. Memory
* allocation for the value should be manually performed.
* 5. Host completes imported fn, `PluginCommentsProxy::get_leading()` now can
* read, deserialize memory host wrote.
* - In case of `get_leading`, returned value is non-deterministic vec
* (`Vec<Comments>`) guest cannot preallocate with specific length. Instead,
* guest passes a fixed size struct (AllocatedBytesPtr), once host allocates
* actual vec into guest it'll write pointer to the vec into the struct.
*/

use std::sync::Arc;

use parking_lot::Mutex;
use swc_common::SourceMap;
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
        span::span_dummy_with_cmt_proxy,
    },
};

mod comments;
mod handler;
mod hygiene;
mod set_transform_result;
mod source_map;
mod span;

use handler::*;
use hygiene::*;

use self::source_map::{
    doctest_offset_line_proxy, lookup_char_pos_proxy, merge_spans_proxy, span_to_filename_proxy,
    span_to_lines_proxy, span_to_string_proxy, SourceMapHostEnvironment,
};

/// Create an ImportObject includes functions to be imported from host to the
/// plugins.
pub(crate) fn build_import_object(
    module: &Module,
    transform_result: &Arc<Mutex<Vec<u8>>>,
    source_map: Arc<SourceMap>,
) -> ImportObject {
    let wasmer_store = module.store();

    // transform_result
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

    // Span
    let span_dummy_with_cmt_fn_decl = Function::new_native(wasmer_store, span_dummy_with_cmt_proxy);

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

    // source_map
    let source_map_buffer = Arc::new(Mutex::new(vec![]));
    let source_map = Arc::new(Mutex::new(source_map));

    let lookup_char_pos_source_map_fn_decl = Function::new_native_with_env(
        wasmer_store,
        SourceMapHostEnvironment::new(&source_map, &source_map_buffer),
        lookup_char_pos_proxy,
    );

    let doctest_offset_line_fn_decl = Function::new_native_with_env(
        wasmer_store,
        SourceMapHostEnvironment::new(&source_map, &source_map_buffer),
        doctest_offset_line_proxy,
    );

    let merge_spans_fn_decl = Function::new_native_with_env(
        wasmer_store,
        SourceMapHostEnvironment::new(&source_map, &source_map_buffer),
        merge_spans_proxy,
    );

    let span_to_string_fn_decl = Function::new_native_with_env(
        wasmer_store,
        SourceMapHostEnvironment::new(&source_map, &source_map_buffer),
        span_to_string_proxy,
    );

    let span_to_filename_fn_decl = Function::new_native_with_env(
        wasmer_store,
        SourceMapHostEnvironment::new(&source_map, &source_map_buffer),
        span_to_filename_proxy,
    );

    let span_to_lines_fn_decl = Function::new_native_with_env(
        wasmer_store,
        SourceMapHostEnvironment::new(&source_map, &source_map_buffer),
        span_to_lines_proxy,
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
            // span
            "__span_dummy_with_cmt_proxy" => span_dummy_with_cmt_fn_decl,
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
            // source_map
            "__lookup_char_pos_source_map_proxy" =>lookup_char_pos_source_map_fn_decl,
            "__doctest_offset_line_proxy" => doctest_offset_line_fn_decl,
            "__merge_spans_proxy" => merge_spans_fn_decl,
            "__span_to_string_proxy" => span_to_string_fn_decl,
            "__span_to_filename_proxy" => span_to_filename_fn_decl,
            "__span_to_lines_proxy" =>span_to_lines_fn_decl
        }
    }
}
