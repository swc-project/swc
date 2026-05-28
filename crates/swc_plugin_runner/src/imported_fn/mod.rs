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
    runtime,
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
    metadata_env: Arc<MetadataContextHostEnvironment>,
    transform_env: Arc<TransformResultHostEnvironment>,
    base_env: Arc<BaseHostEnvironment>,
    comments_env: Arc<CommentHostEnvironment>,
    source_map_host_env: Arc<SourceMapHostEnvironment>,
    diagnostics_env: Arc<DiagnosticContextHostEnvironment>,
) -> Vec<(String, runtime::Func)> {
    macro_rules! define {
        ( fn $name:ident ( $( $arg:ident ),* ) ) => {
            let $name = runtime::Func::from_fn(
                move |_caller, [ $( $arg , )* ]| {
                    $name($( $arg as _ , )* );
                    []
                }
            );
        };
        ( fn $name:ident ( $( $arg:ident ),* ) -> i32 ) => {
            let $name = runtime::Func::from_fn(
                move |_caller, [ $( $arg , )* ]| {
                    [$name($( $arg as _ , )* ) as i32]
                }
            );
        };
        ( fn $name:ident ( env $env:ident , $( $arg:ident ),* ) ) => {
            let env_ref = $env.clone();
            let $name = runtime::Func::from_fn(
                move |caller, [ $( $arg , )* ]| {
                    $name(caller, &env_ref, $( $arg as _ , )* );
                    []
                }
            );
        };
        ( fn $name:ident ( env $env:ident , $( $arg:ident ),* ) -> i32 ) => {
            let env_ref = $env.clone();
            let $name = runtime::Func::from_fn(
                move |caller, [ $( $arg , )* ]| {
                    [$name(caller, &env_ref, $( $arg as _ , )* ) as i32]
                }
            );
        }
    }

    // core_diagnostics
    define!(fn set_plugin_core_pkg_diagnostics(env diagnostics_env, bytes_ptr, bytes_ptr_len));

    // metadata
    define!(fn copy_context_key_to_host_env(env metadata_env, bytes_ptr, bytes_ptr_len));
    define!(fn get_transform_plugin_config(env metadata_env, allocated_ret_ptr) -> i32);
    define!(fn get_transform_context(env metadata_env, key, allocated_ret_ptr) -> i32);
    define!(fn get_experimental_transform_context(env metadata_env, allocated_ret_ptr) -> i32);
    define!(fn get_raw_experiemtal_transform_context(env metadata_env, allocated_ret_ptr) -> i32);

    // transform_result
    define!(fn set_transform_result(env transform_env, bytes_ptr, bytes_ptr_len));

    // handler
    define!(fn emit_diagnostics(env base_env, bytes_ptr, bytes_ptr_len));
    define!(fn emit_output(env base_env, output_ptr, output_len));

    // hygiene
    define!(fn mark_fresh_proxy(parent) -> i32);
    define!(fn mark_parent_proxy(self_mark) -> i32);
    define!(fn mark_is_descendant_of_proxy(env base_env, self_mark, ancestor, allocated_ptr));
    define!(fn mark_least_ancestor_proxy(env base_env, a, b, allocated_ptr));
    define!(fn syntax_context_apply_mark_proxy(self_syntax_context, mark) -> i32);
    define!(fn syntax_context_remove_mark_proxy(env base_env, self_mark, allocated_ptr));
    define!(fn syntax_context_outer_proxy(self_mark) -> i32);

    // Span
    define!(fn span_dummy_with_cmt_proxy() -> i32);

    // comments
    define!(fn copy_comment_to_host_env(env comments_env, bytes_ptr, bytes_ptr_len));
    define!(fn add_leading_comment_proxy(env comments_env, byte_pos));
    define!(fn add_leading_comments_proxy(env comments_env, byte_pos));
    define!(fn has_leading_comments_proxy(byte_pos) -> i32);
    define!(fn move_leading_comments_proxy(from_byte_pos, to_byte_pos));
    define!(fn take_leading_comments_proxy(env comments_env, byte_pos, allocated_ret_ptr) -> i32);
    define!(fn get_leading_comments_proxy(env comments_env, byte_pos, allocated_ret_ptr) -> i32);
    define!(fn add_trailing_comment_proxy(env comments_env, byte_pos));
    define!(fn add_trailing_comments_proxy(env comments_env, byte_pos));
    define!(fn has_trailing_comments_proxy(byte_pos) -> i32);
    define!(fn move_trailing_comments_proxy(from_byte_pos, to_byte_pos));
    define!(fn take_trailing_comments_proxy(env comments_env, byte_pos, allocated_ret_ptr) -> i32);
    define!(fn get_trailing_comments_proxy(env comments_env, byte_pos, allocated_ret_ptr) -> i32);
    define!(fn add_pure_comment_proxy(byte_pos));

    // source_map
    define!(fn lookup_char_pos_proxy(env source_map_host_env, byte_pos, should_include_source_file, allocated_ret_ptr) -> i32);
    define!(fn doctest_offset_line_proxy(env source_map_host_env, orig) -> i32);
    define!(fn merge_spans_proxy(env source_map_host_env, lhs_lo, lhs_hi, rhs_lo, rhs_hi, allocated_ptr) -> i32);
    define!(fn span_to_lines_proxy(env source_map_host_env, span_lo, span_hi, should_request_source_file, allocated_ret_ptr) -> i32);
    define!(fn lookup_byte_offset_proxy(env source_map_host_env, byte_pos, allocated_ret_ptr) -> i32);
    define!(fn span_to_string_proxy(env source_map_host_env, span_lo, span_hi, allocated_ret_ptr) -> i32);
    define!(fn span_to_filename_proxy(env source_map_host_env, span_lo, span_hi, allocated_ret_ptr) -> i32);
    define!(fn span_to_source_proxy(env source_map_host_env, span_lo, span_hi, allocated_ret_ptr) -> i32);

    [
        (
            "__set_transform_plugin_core_pkg_diagnostics",
            set_plugin_core_pkg_diagnostics,
        ),
        // metadata
        (
            "__copy_context_key_to_host_env",
            copy_context_key_to_host_env,
        ),
        ("__get_transform_plugin_config", get_transform_plugin_config),
        ("__get_transform_context", get_transform_context),
        (
            "__get_experimental_transform_context",
            get_experimental_transform_context,
        ),
        (
            "__get_raw_experiemtal_transform_context",
            get_raw_experiemtal_transform_context,
        ),
        // transform
        ("__set_transform_result", set_transform_result),
        // handler
        ("__emit_diagnostics", emit_diagnostics),
        ("__emit_output", emit_output),
        // hygiene
        ("__mark_fresh_proxy", mark_fresh_proxy),
        ("__mark_parent_proxy", mark_parent_proxy),
        ("__mark_is_descendant_of_proxy", mark_is_descendant_of_proxy),
        ("__mark_least_ancestor", mark_least_ancestor_proxy),
        (
            "__syntax_context_apply_mark_proxy",
            syntax_context_apply_mark_proxy,
        ),
        (
            "__syntax_context_remove_mark_proxy",
            syntax_context_remove_mark_proxy,
        ),
        ("__syntax_context_outer_proxy", syntax_context_outer_proxy),
        // span
        ("__span_dummy_with_cmt_proxy", span_dummy_with_cmt_proxy),
        // comments
        ("__copy_comment_to_host_env", copy_comment_to_host_env),
        ("__add_leading_comment_proxy", add_leading_comment_proxy),
        ("__add_leading_comments_proxy", add_leading_comments_proxy),
        ("__has_leading_comments_proxy", has_leading_comments_proxy),
        ("__move_leading_comments_proxy", move_leading_comments_proxy),
        ("__take_leading_comments_proxy", take_leading_comments_proxy),
        ("__get_leading_comments_proxy", get_leading_comments_proxy),
        ("__add_trailing_comment_proxy", add_trailing_comment_proxy),
        ("__add_trailing_comments_proxy", add_trailing_comments_proxy),
        ("__has_trailing_comments_proxy", has_trailing_comments_proxy),
        (
            "__move_trailing_comments_proxy",
            move_trailing_comments_proxy,
        ),
        (
            "__take_trailing_comments_proxy",
            take_trailing_comments_proxy,
        ),
        ("__get_trailing_comments_proxy", get_trailing_comments_proxy),
        ("__add_pure_comment_proxy", add_pure_comment_proxy),
        // source_map
        ("__lookup_char_pos_source_map_proxy", lookup_char_pos_proxy),
        ("__doctest_offset_line_proxy", doctest_offset_line_proxy),
        ("__merge_spans_proxy", merge_spans_proxy),
        ("__span_to_string_proxy", span_to_string_proxy),
        ("__span_to_filename_proxy", span_to_filename_proxy),
        ("__span_to_source_proxy", span_to_source_proxy),
        ("__span_to_lines_proxy", span_to_lines_proxy),
        ("__lookup_byte_offset_proxy", lookup_byte_offset_proxy),
    ]
    .into_iter()
    .map(|(name, f)| (name.into(), f))
    .collect()
}
