//! Ported from closure compiler.
use swc_common::{chain, pass::Repeat, Mark};
use swc_ecma_transforms_base::pass::RepeatedJsPass;

pub use self::{
    branch::dead_branch_remover,
    expr::{expr_simplifier, Config as ExprSimplifierConfig},
};

mod branch;
pub mod const_propagation;
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
pub fn simplifier(unresolved_mark: Mark, c: Config) -> impl RepeatedJsPass {
    Repeat::new(chain!(
        expr_simplifier(unresolved_mark, c.expr),
        inlining::inlining(c.inlining),
        dead_branch_remover(unresolved_mark),
        dce::dce(c.dce)
    ))
}
