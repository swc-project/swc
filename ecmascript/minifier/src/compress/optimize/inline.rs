use super::Optimizer;
use swc_ecma_ast::*;

/// Methods related to option `inline`.
impl Optimizer {
    pub(super) fn store_decl_for_inlining(&mut self, decl: &mut Decl) {
        if !self.options.inline {
            return;
        }
    }
}
