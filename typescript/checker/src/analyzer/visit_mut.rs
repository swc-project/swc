//! This module implements VisitMut for Analyzer

use super::Analyzer;
use swc_ecma_ast::*;
use swc_ecma_visit::VisitMut;

macro_rules! forward {
    ($name:ident,$T:ty) => {
        /// Delegates to `Validate<T>`
        fn $name(&mut self, n: &mut $T) {
            let res = n.validate_with(self);
            match res {
                // ignored
                Ok(..) => {}
                Err(err) => {
                    self.info.errors.push(err);
                }
            }
        }
    };
}

/// All methods forward to `Validate<T>`
impl VisitMut for Analyzer<'_, '_> {
    forward!(visit_mut_expr, Expr);
    forward!(visit_mut_pat, Pat);
}
