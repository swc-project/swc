use super::Optimizer;
use swc_ecma_ast::*;

/// Methods related to the option `arrows`.
impl Optimizer {
    pub(super) fn optimize_arrow_method_prop(&mut self, p: &mut Prop) {
        if !self.options.unsafe_methods || self.options.ecma < 2015 {
            return;
        }
    }
}
