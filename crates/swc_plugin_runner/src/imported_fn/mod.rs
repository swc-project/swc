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

use wasmer::{imports, Function, FunctionEnv, Imports, Store};

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
        diagnostics::{set_plugin_core_pkg_diagnostics, DiagnosticContextHostEnvironment},
        metadata_context::get_raw_experiemtal_transform_context,
        set_transform_result::{set_transform_result, TransformResultHostEnvironment},
        source_map::span_to_source_proxy,
        span::span_dummy_with_cmt_proxy,
    },
};

pub(crate) mod comments;
pub(crate) mod diagnostics;
pub(crate) mod handler;
pub(crate) mod hygiene;
pub(crate) mod metadata_context;
pub(crate) mod set_transform_result;
pub(crate) mod source_map;
pub(crate) mod span;

use handler::*;
use hygiene::*;

use self::{
    metadata_context::{
        copy_context_key_to_host_env, get_experimental_transform_context, get_transform_context,
        get_transform_plugin_config, MetadataContextHostEnvironment,
    },
    source_map::{
        doctest_offset_line_proxy, lookup_byte_offset_proxy, lookup_char_pos_proxy,
        merge_spans_proxy, span_to_filename_proxy, span_to_lines_proxy, span_to_string_proxy,
        SourceMapHostEnvironment,
    },
};

/// Create an ImportObject includes functions to be imported from host to the
/// plugins.
pub(crate) fn build_import_object(
    wasmer_store: &mut Store,
    metadata_env: &FunctionEnv<MetadataContextHostEnvironment>,
    transform_env: &FunctionEnv<TransformResultHostEnvironment>,
    base_env: &FunctionEnv<BaseHostEnvironment>,
    comments_env: &FunctionEnv<CommentHostEnvironment>,
    source_map_host_env: &FunctionEnv<SourceMapHostEnvironment>,
    diagnostics_env: &FunctionEnv<DiagnosticContextHostEnvironment>,
) -> Imports {
    // core_diagnostics
    let set_transform_plugin_core_pkg_diagnostics_fn_decl = Function::new_typed_with_env(
        wasmer_store,
        diagnostics_env,
        set_plugin_core_pkg_diagnostics,
    );

    // metadata
    let copy_context_key_to_host_env_fn_decl =
        Function::new_typed_with_env(wasmer_store, metadata_env, copy_context_key_to_host_env);
    let get_transform_plugin_config_fn_decl =
        Function::new_typed_with_env(wasmer_store, metadata_env, get_transform_plugin_config);
    let get_transform_context_fn_decl =
        Function::new_typed_with_env(wasmer_store, metadata_env, get_transform_context);

    let get_experimental_transform_context_fn_decl = Function::new_typed_with_env(
        wasmer_store,
        metadata_env,
        get_experimental_transform_context,
    );
    let get_raw_experiemtal_transform_context_fn_decl = Function::new_typed_with_env(
        wasmer_store,
        metadata_env,
        get_raw_experiemtal_transform_context,
    );

    // transform_result
    let set_transform_result_fn_decl =
        Function::new_typed_with_env(wasmer_store, transform_env, set_transform_result);

    // handler
    let emit_diagnostics_fn_decl =
        Function::new_typed_with_env(wasmer_store, base_env, emit_diagnostics);

    // hygiene
    let mark_fresh_fn_decl = Function::new_typed(wasmer_store, mark_fresh_proxy);
    let mark_parent_fn_decl = Function::new_typed(wasmer_store, mark_parent_proxy);
    let mark_is_descendant_of_fn_decl =
        Function::new_typed_with_env(wasmer_store, base_env, mark_is_descendant_of_proxy);

    let mark_least_ancestor_fn_decl =
        Function::new_typed_with_env(wasmer_store, base_env, mark_least_ancestor_proxy);

    let syntax_context_apply_mark_fn_decl =
        Function::new_typed(wasmer_store, syntax_context_apply_mark_proxy);
    let syntax_context_remove_mark_fn_decl =
        Function::new_typed_with_env(wasmer_store, base_env, syntax_context_remove_mark_proxy);
    let syntax_context_outer_fn_decl =
        Function::new_typed(wasmer_store, syntax_context_outer_proxy);

    // Span
    let span_dummy_with_cmt_fn_decl = Function::new_typed(wasmer_store, span_dummy_with_cmt_proxy);

    // comments
    let copy_comment_to_host_env_fn_decl =
        Function::new_typed_with_env(wasmer_store, comments_env, copy_comment_to_host_env);

    let add_leading_comment_fn_decl =
        Function::new_typed_with_env(wasmer_store, comments_env, add_leading_comment_proxy);

    let add_leading_comments_fn_decl =
        Function::new_typed_with_env(wasmer_store, comments_env, add_leading_comments_proxy);

    let has_leading_comments_fn_decl =
        Function::new_typed(wasmer_store, has_leading_comments_proxy);

    let move_leading_comments_fn_decl =
        Function::new_typed(wasmer_store, move_leading_comments_proxy);

    let take_leading_comments_fn_decl = Function::new_typed_with_env(
        wasmer_store,
        // take_* doesn't need to share buffer to pass values from plugin to the host - do not
        // clone buffer here.
        comments_env,
        take_leading_comments_proxy,
    );

    let get_leading_comments_fn_decl = Function::new_typed_with_env(
        wasmer_store,
        // get_* doesn't need to share buffer to pass values from plugin to the host - do not clone
        // buffer here.
        comments_env,
        get_leading_comments_proxy,
    );

    let add_trailing_comment_fn_decl =
        Function::new_typed_with_env(wasmer_store, comments_env, add_trailing_comment_proxy);

    let add_trailing_comments_fn_decl =
        Function::new_typed_with_env(wasmer_store, comments_env, add_trailing_comments_proxy);

    let has_trailing_comments_fn_decl =
        Function::new_typed(wasmer_store, has_trailing_comments_proxy);

    let move_trailing_comments_fn_decl =
        Function::new_typed(wasmer_store, move_trailing_comments_proxy);

    let take_trailing_comments_fn_decl = Function::new_typed_with_env(
        wasmer_store,
        // take_* doesn't need to share buffer to pass values from plugin to the host - do not
        // clone buffer here.
        comments_env,
        take_trailing_comments_proxy,
    );

    let get_trailing_comments_fn_decl = Function::new_typed_with_env(
        wasmer_store,
        // get_* doesn't need to share buffer to pass values from plugin to the host - do not clone
        // buffer here.
        comments_env,
        get_trailing_comments_proxy,
    );

    let add_pure_comment_fn_decl = Function::new_typed(wasmer_store, add_pure_comment_proxy);

    // source_map
    let lookup_char_pos_source_map_fn_decl =
        Function::new_typed_with_env(wasmer_store, source_map_host_env, lookup_char_pos_proxy);

    let doctest_offset_line_fn_decl =
        Function::new_typed_with_env(wasmer_store, source_map_host_env, doctest_offset_line_proxy);

    let merge_spans_fn_decl =
        Function::new_typed_with_env(wasmer_store, source_map_host_env, merge_spans_proxy);

    let span_to_string_fn_decl =
        Function::new_typed_with_env(wasmer_store, source_map_host_env, span_to_string_proxy);

    let span_to_filename_fn_decl =
        Function::new_typed_with_env(wasmer_store, source_map_host_env, span_to_filename_proxy);

    let span_to_source_fn_decl =
        Function::new_typed_with_env(wasmer_store, source_map_host_env, span_to_source_proxy);

    let span_to_lines_fn_decl =
        Function::new_typed_with_env(wasmer_store, source_map_host_env, span_to_lines_proxy);

    let lookup_byte_offset_fn_decl =
        Function::new_typed_with_env(wasmer_store, source_map_host_env, lookup_byte_offset_proxy);

    imports! {
        "env" => {
            "__set_transform_plugin_core_pkg_diagnostics" => set_transform_plugin_core_pkg_diagnostics_fn_decl,
            // metadata
            "__copy_context_key_to_host_env" => copy_context_key_to_host_env_fn_decl,
            "__get_transform_plugin_config" => get_transform_plugin_config_fn_decl,
            "__get_transform_context" => get_transform_context_fn_decl,
            "__get_experimental_transform_context" => get_experimental_transform_context_fn_decl,
            "__get_raw_experiemtal_transform_context" => get_raw_experiemtal_transform_context_fn_decl,
            // transform
            "__set_transform_result" => set_transform_result_fn_decl,
            // handler
            "__emit_diagnostics" => emit_diagnostics_fn_decl,
            // hygiene
            "__mark_fresh_proxy" => mark_fresh_fn_decl,
            "__mark_parent_proxy" => mark_parent_fn_decl,
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
            "__lookup_char_pos_source_map_proxy" => lookup_char_pos_source_map_fn_decl,
            "__doctest_offset_line_proxy" => doctest_offset_line_fn_decl,
            "__merge_spans_proxy" => merge_spans_fn_decl,
            "__span_to_string_proxy" => span_to_string_fn_decl,
            "__span_to_filename_proxy" => span_to_filename_fn_decl,
            "__span_to_source_proxy" => span_to_source_fn_decl,
            "__span_to_lines_proxy" => span_to_lines_fn_decl,
            "__lookup_byte_offset_proxy" => lookup_byte_offset_fn_decl
        }
    }
}
