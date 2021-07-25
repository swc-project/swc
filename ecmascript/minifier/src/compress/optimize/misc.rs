use swc_ecma_ast::PropName;

use super::Optimizer;

impl Optimizer<'_> {
    pub(super) fn optimize_prop_name(&mut self, name: &mut PropName) {}
}
