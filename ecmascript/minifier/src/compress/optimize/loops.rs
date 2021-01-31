use crate::compress::optimize::Optimizer;
use swc_ecma_ast::*;

/// Methods related to option `loops`.
impl Optimizer {
    pub(super) fn optiimze_noop_loops(&mut self, stmt: &mut Stmt) {
        if !self.options.loops {
            return;
        }
    }
}
