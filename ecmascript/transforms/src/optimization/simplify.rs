//! Ported from closure compiler.
pub use self::branch::dead_branch_remover;
use self::expr::expr_simplifier;
use crate::pass::RepeatedJsPass;
use swc_common::{chain, pass::Repeat};

mod branch;
mod expr;
pub mod inlining;

/// Performs simplify-expr, inlining, remove-dead-branch and dce until nothing
/// changes.
pub fn simplifier() -> impl RepeatedJsPass + 'static {
    Repeat::new(chain!(
        expr_simplifier(),
        inlining::inlining(),
        dead_branch_remover()
    ))
}
