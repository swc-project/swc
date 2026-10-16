//! Binding names already have their physical declaration identities. Only
//! expressions and annotations within a binding pattern need completion.

use swc_ecma_ast::{BindingIdent, ComputedPropName, Expr, TsType};
use swc_ecma_visit::{VisitMut, VisitMutWith};

use super::NamespaceResolver;

pub(super) struct BindingResolver<'a>(pub &'a mut NamespaceResolver);

impl VisitMut for BindingResolver<'_> {
    fn visit_mut_binding_ident(&mut self, node: &mut BindingIdent) {
        node.type_ann.visit_mut_with(self.0);
    }

    fn visit_mut_expr(&mut self, node: &mut Expr) {
        node.visit_mut_with(self.0);
    }

    fn visit_mut_ts_type(&mut self, node: &mut TsType) {
        node.visit_mut_with(self.0);
    }

    fn visit_mut_computed_prop_name(&mut self, node: &mut ComputedPropName) {
        node.visit_mut_with(self.0);
    }
}
