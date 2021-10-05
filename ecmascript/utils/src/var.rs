use crate::Id;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};

/// This collects variables bindings while ignoring if it's nested in
/// expression.
pub struct VarCollector<'a> {
    pub to: &'a mut Vec<Id>,
}

impl Visit for VarCollector<'_> {
    noop_visit_type!();

    fn visit_arrow_expr(&mut self, _: &ArrowExpr, _parent: &dyn Node) {}

    fn visit_constructor(&mut self, _: &Constructor, _parent: &dyn Node) {}

    fn visit_expr(&mut self, _: &Expr, _parent: &dyn Node) {}

    fn visit_function(&mut self, _: &Function, _parent: &dyn Node) {}

    fn visit_key_value_pat_prop(&mut self, node: &KeyValuePatProp, _parent: &dyn Node) {
        node.value.visit_with(node, self);
    }

    fn visit_ident(&mut self, i: &Ident, _: &dyn Node) {
        self.to.push((i.sym.clone(), i.span.ctxt()))
    }

    fn visit_var_declarator(&mut self, node: &VarDeclarator, _: &dyn Node) {
        node.name.visit_with(node, self);
    }
}
