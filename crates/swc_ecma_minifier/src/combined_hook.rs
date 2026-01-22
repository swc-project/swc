//! Combined hooks for the minifier.
//!
//! This module combines multiple visitor passes into single AST traversals
//! using the hook system, reducing overall traversal overhead.

use swc_common::{comments::Comments, Mark};
use swc_ecma_ast::*;
use swc_ecma_hooks::{VisitMutHook, VisitMutWithHook};
use swc_ecma_usage_analyzer::marks::Marks;
use swc_ecma_visit::VisitMutWith;

use crate::{
    hook_utils::{HookBuilder, NoopHook},
    metadata::hook::{InfoMarkerCtx, InfoMarkerHook},
    option::CompressOptions,
    pass::{global_defs_hook::GlobalDefsHook, merge_exports_hook::MergeExportsHook},
};

/// Combined pre-compression hook.
///
/// This hook combines:
/// - GlobalDefs: Replaces global definitions
/// - InfoMarker: Marks pure functions and constants based on comments
///
/// Previously these were separate AST traversals. Now they run in a single
/// pass.
pub(crate) fn pre_compress_hook<'a>(
    global_defs: Option<Vec<(Box<Expr>, Box<Expr>)>>,
    unresolved_mark: Mark,
    top_level_mark: Mark,
    options: Option<&'a CompressOptions>,
    comments: Option<&'a dyn Comments>,
    marks: Marks,
) -> impl 'a + VisitMutHook<InfoMarkerCtx> {
    let builder = HookBuilder::new(NoopHook);

    // Add GlobalDefs - wrap in Option to handle presence/absence uniformly
    let global_defs_hook: Option<GlobalDefsHook> = global_defs.and_then(|defs| {
        if !defs.is_empty() {
            Some(GlobalDefsHook::new(defs, unresolved_mark, top_level_mark))
        } else {
            None
        }
    });

    let builder = builder.chain(global_defs_hook);

    // Add InfoMarker
    let builder = builder.chain(InfoMarkerHook::new(options, comments, marks));

    builder.build()
}

/// Runs the pre-compression hooks on the given program.
///
/// This combines GlobalDefs and InfoMarker into a single traversal.
pub(crate) fn visit_with_pre_compress<'a>(
    program: &mut Program,
    global_defs: Option<Vec<(Box<Expr>, Box<Expr>)>>,
    unresolved_mark: Mark,
    top_level_mark: Mark,
    options: Option<&'a CompressOptions>,
    comments: Option<&'a dyn Comments>,
    marks: Marks,
) {
    let hook = pre_compress_hook(
        global_defs,
        unresolved_mark,
        top_level_mark,
        options,
        comments,
        marks,
    );
    let ctx = InfoMarkerCtx;

    let mut visitor = VisitMutWithHook { hook, context: ctx };
    program.visit_mut_with(&mut visitor);
}

/// Post-mangle hook.
///
/// This hook runs after mangling and performs:
/// - MergeExports: Merges export statements
pub(crate) fn post_mangle_hook() -> impl VisitMutHook<InfoMarkerCtx> {
    HookBuilder::new(NoopHook)
        .chain(MergeExportsHook::new())
        .build()
}

/// Runs the post-mangle hooks on the given program.
pub(crate) fn visit_with_post_mangle(program: &mut Program) {
    let hook = post_mangle_hook();
    let ctx = InfoMarkerCtx;

    let mut visitor = VisitMutWithHook { hook, context: ctx };
    program.visit_mut_with(&mut visitor);
}
