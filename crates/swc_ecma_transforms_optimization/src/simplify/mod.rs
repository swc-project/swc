//! Ported from closure compiler.
pub use self::{
    branch::dead_branch_remover,
    expr::{expr_simplifier, Config as ExprSimplifierConfig},
};
use swc_common::{chain, pass::Repeat};
use swc_ecma_transforms_base::pass::RepeatedJsPass;

mod branch;
pub mod const_propgation;
pub mod dce;
mod expr;
pub mod inlining;

#[derive(Debug, Default)]
pub struct Config {
    pub dce: dce::Config,
    pub inlining: inlining::Config,
    pub expr: ExprSimplifierConfig,
}

/// Performs simplify-expr, inlining, remove-dead-branch and dce until nothing
/// changes.
pub fn simplifier(c: Config) -> impl RepeatedJsPass {
    Repeat::new(chain!(
        expr_simplifier(c.expr),
        inlining::inlining(c.inlining),
        dead_branch_remover(),
        dce::dce(c.dce)
    ))
}
