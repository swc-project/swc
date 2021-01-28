use super::Optimizer;
use swc_ecma_ast::*;

impl Optimizer {
    pub(super) fn handle_negated_iife(&mut self, e: &mut CallExpr) {}
}
