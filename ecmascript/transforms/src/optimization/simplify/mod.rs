//! Ported from closure compiler.
pub use self::{branch::dead_branch_remover, expr::expr_simplifier, inlining::inlining};
use crate::pass::RepeatedJsPass;
use swc_common::{chain, pass::Repeat};
use swc_ecma_utils::Id;

mod branch;
mod expr;
mod inlining;

#[derive(Debug, Default)]
pub struct Config {
    /// If this is [None], all exports are treated as used.
    pub used: Option<Vec<Id>>,
}

/// Performs simplify-expr, inlining, remove-dead-branch and dce until nothing
/// changes.
pub fn simplifier(_: Config) -> impl RepeatedJsPass + 'static {
    Repeat::new(chain!(expr_simplifier(), inlining(), dead_branch_remover()))
}
