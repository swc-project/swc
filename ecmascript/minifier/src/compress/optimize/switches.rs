use super::Optimizer;
use swc_ecma_ast::*;
use swc_ecma_utils::ExprExt;

/// Methods related to option `switches`.
impl Optimizer {
    pub(super) fn optimize_const_switches(&mut self, s: &mut Stmt) {
        if !self.options.switches {
            return;
        }

        let stmt = match s {
            Stmt::Switch(s) => s,
            _ => return,
        };

        if stmt.discriminant.may_have_side_effects() {
            return;
        }
    }
}
