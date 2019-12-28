//! Ported from closure compiler.
pub use self::dce::dce;
use self::expr::SimplifyExpr;
use crate::pass::Pass;
use ast::*;
use swc_common::{Fold, FoldWith};

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
    Simplifier
}

struct Simplifier;

impl Fold<Program> for Simplifier {
    fn fold(&mut self, p: Program) -> Program {
        p.fold_with(&mut expr_simplifier()).fold_with(&mut dce())
    }
}
