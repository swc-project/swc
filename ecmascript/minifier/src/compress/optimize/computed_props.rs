use super::Optimizer;
use swc_ecma_ast::*;

/// Methods related to the option `computed_props`.
impl Optimizer<'_> {
    pub(super) fn optimize_computed_prop_name_as_normal(&mut self, p: &mut PropName) {
        if !self.options.computed_props {
            return;
        }
    }
}
