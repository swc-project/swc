//! ES3 compatibility transforms.
//!
//! This crate provides transforms for making JavaScript code compatible with
//! ES3 environments.

use swc_ecma_ast::Pass;
use swc_ecma_hooks::{NoopHook, VisitMutHook, VisitMutWithHook};
use swc_ecma_visit::visit_mut_pass;

pub use self::{
    member_expr_lits::member_expression_literals, prop_lits::property_literals,
    reserved_word::reserved_words,
};

mod hook_utils;
mod member_expr_lits;
mod prop_lits;
mod reserved_word;

use hook_utils::HookBuilder;

/// Make output es3-compatible.
///
/// This combines three transforms:
/// - `property_literals`: Transform property names
/// - `member_expression_literals`: Transform member expression literals
/// - `reserved_words`: Rename reserved words
///
/// Note: `reserved_words` uses a separate traversal because it requires
/// selective visitation that is incompatible with the hook composition pattern.
pub fn es3(preserve_import: bool) -> impl Pass {
    (
        visit_mut_pass(VisitMutWithHook {
            hook: es3_hook(),
            context: (),
        }),
        reserved_words(preserve_import),
    )
}

/// Creates a combined ES3 hook for property and member expression literals.
///
/// This can be used to combine with other hooks for a single AST traversal.
/// Note: This does NOT include `reserved_words` because it requires selective
/// visitation that is incompatible with generic hook composition.
pub fn es3_hook<C>() -> impl VisitMutHook<C> {
    HookBuilder::new(NoopHook)
        .chain(member_expr_lits::hook())
        .chain(prop_lits::hook())
        .build()
}
