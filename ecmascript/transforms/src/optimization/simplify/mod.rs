//! Ported from closure compiler.
pub use self::{branch::dead_branch_remover, expr::expr_simplifier, inlining::inlining};
use crate::pass::RepeatedJsPass;
use swc_common::{chain, pass::Repeat};

mod branch;
mod expr;
mod inlining;

/// Performs simplify-expr, inlining, remove-dead-branch and dce until nothing
/// changes.
pub fn simplifier() -> impl RepeatedJsPass + 'static {
    Repeat::new(chain!(expr_simplifier(), inlining(), dead_branch_remover()))
}
