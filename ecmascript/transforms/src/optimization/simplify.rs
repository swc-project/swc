//! Ported from closure compiler.
pub use self::dce::dce;
use self::expr::SimplifyExpr;
use crate::{optimization::inline_vars, pass::Pass};
use swc_common::{chain, Fold, FoldWith};
use swc_ecma_ast::*;

pub mod dce;
mod expr;

/// Not intended for general use. Use [simplifier] instead.
///
/// Ported from `PeepholeFoldConstants` of google closure compler.
pub fn expr_simplifier() -> impl Pass + 'static {
    SimplifyExpr
}

/// Ported from `PeepholeRemoveDeadCode` and `PeepholeFoldConstants` of google
/// closure compiler.
pub fn simplifier() -> impl Pass + 'static {
    chain!(
        expr_simplifier(),
        self::inline_vars::inline_vars(Default::default()),
        dce()
    )
}
