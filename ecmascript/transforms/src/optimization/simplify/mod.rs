//! Ported from closure compiler.
pub use self::{branch::dead_branch_remover, expr::expr_simplifier, inlining::inlining};
use crate::pass::RepeatedJsPass;
use std::borrow::Cow;
use swc_common::{chain, pass::Repeat, Mark};
use swc_ecma_utils::Id;

mod branch;
pub mod dce;
mod expr;
mod inlining;

#[derive(Debug, Default)]
pub struct Config<'a> {
    /// If this is [None], all exports are treated as used.
    pub used: Option<Cow<'a, [Id]>>,

    /// Mark used while performing dce.
    ///
    /// Should not be `Mark::root()`. Used to reduce allocation of [Mark].
    pub used_mark: Mark,
}

/// Performs simplify-expr, inlining, remove-dead-branch and dce until nothing
/// changes.
pub fn simplifier<'a>(c: Config<'a>) -> impl RepeatedJsPass + 'a {
    Repeat::new(chain!(
        expr_simplifier(),
        inlining(),
        dead_branch_remover(),
        dce::dce(dce::Config {
            used: c.used,
            used_mark: c.used_mark
        })
    ))
}
