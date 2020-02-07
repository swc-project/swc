//! Ported from closure compiler.
pub use self::dce::dce;
use self::expr::SimplifyExpr;
use crate::pass::RepeatedJsPass;
use swc_common::{chain, pass::Repeat};
use swc_ecma_ast::*;

pub mod dce;
mod expr;
pub mod inlining;
pub mod inlining_old;

/// Not intended for general use. Use [simplifier] instead.
///
/// Ported from `PeepholeFoldConstants` of google closure compler.
pub fn expr_simplifier() -> impl RepeatedJsPass + 'static {
    SimplifyExpr::default()
}

/// Ported from `PeepholeRemoveDeadCode` and `PeepholeFoldConstants` of google
/// closure compiler.
pub fn simplifier() -> impl RepeatedJsPass + 'static {
    Repeat::new(chain!(expr_simplifier(), inlining::inlining(), dce()))
}
