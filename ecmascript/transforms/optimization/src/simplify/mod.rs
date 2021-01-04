//! Ported from closure compiler.
pub use self::{branch::dead_branch_remover, expr::expr_simplifier};
use swc_common::{chain, pass::Repeat};
use swc_ecma_transforms_base::pass::RepeatedJsPass;

mod branch;
pub mod const_propgation;
pub mod dce;
mod expr;
pub mod inlining;

#[derive(Debug, Default)]
pub struct Config<'a> {
    pub dce: dce::Config<'a>,
    pub inlining: inlining::Config,
}

/// Performs simplify-expr, inlining, remove-dead-branch and dce until nothing
/// changes.
pub fn simplifier<'a>(c: Config<'a>) -> impl RepeatedJsPass + 'a {
    Repeat::new(chain!(
        expr_simplifier(),
        inlining::inlining(c.inlining),
        dead_branch_remover(),
        dce::dce(c.dce)
    ))
}
