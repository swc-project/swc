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
    let mut options = swc_ecma_transformer::Options::default();
    options.env.es3.property_literals = true;
    options.env.es3.member_expression_literals = true;
    options.env.es3.reserved_words = true;
    options.env.es3.preserve_import = preserve_import;
    options.into_pass()
}
