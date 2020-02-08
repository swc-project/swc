//! Ported from closure compiler.
pub use self::{branch::dead_branch_remover, expr::expr_simplifier, inlining::inlining};
use crate::pass::RepeatedJsPass;
use swc_common::{chain, pass::Repeat};

mod branch;
pub mod dce;
mod expr;
mod inlining;

#[derive(Debug, Default)]
pub struct Config<'a> {
    pub dce: dce::Config<'a>,
}

/// Performs simplify-expr, inlining, remove-dead-branch and dce until nothing
/// changes.
pub fn simplifier<'a>(c: Config<'a>) -> impl RepeatedJsPass + 'a {
    Repeat::new(chain!(
        expr_simplifier(),
        inlining(),
        dead_branch_remover(),
        dce::dce(c.dce)
    ))
}
