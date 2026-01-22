//! ES3 compatibility transforms.
//!
//! This crate provides transforms for making JavaScript code compatible with
//! ES3 environments.

use swc_ecma_ast::Pass;
use swc_ecma_hooks::{VisitMutHook, VisitMutWithHook};
use swc_ecma_visit::visit_mut_pass;

pub use self::{
    member_expr_lits::member_expression_literals, prop_lits::property_literals,
    reserved_word::reserved_words,
};

mod hook_utils;
mod member_expr_lits;
mod prop_lits;
mod reserved_word;

use hook_utils::{HookBuilder, NoopHook};

/// Make output es3-compatible using a single AST traversal.
///
/// This combines three transforms into a single pass:
/// - `property_literals`: Transform property names
/// - `member_expression_literals`: Transform member expression literals
/// - `reserved_words`: Rename reserved words
pub fn es3(preserve_import: bool) -> impl Pass {
    visit_mut_pass(VisitMutWithHook {
        hook: es3_hook(preserve_import),
        context: (),
    })
}

/// Creates a combined ES3 hook that merges all ES3 transforms.
///
/// This can be used to combine with other hooks for a single AST traversal.
pub fn es3_hook<C>(preserve_import: bool) -> impl VisitMutHook<C> {
    HookBuilder::new(NoopHook)
        .chain(member_expr_lits::hook())
        .chain(prop_lits::hook())
        .chain(reserved_word::hook(preserve_import))
        .build()
}
