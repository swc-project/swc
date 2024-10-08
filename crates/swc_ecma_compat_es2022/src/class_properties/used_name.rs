use swc_atoms::JsWord;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};
use swc_trace_macro::swc_trace;

pub(super) struct UsedNameCollector<'a> {
    pub used_names: &'a mut Vec<JsWord>,
}

macro_rules! noop {
    ($name:ident, $T:path) => {
        /// no-op
        fn $name(&mut self, _: &$T) {}
    };
}

#[swc_trace]
impl Visit for UsedNameCollector<'_> {
    noop_visit_type!(fail);

    noop!(visit_arrow_expr, ArrowExpr);

    noop!(visit_function, Function);

    noop!(visit_setter_prop, SetterProp);

    noop!(visit_getter_prop, GetterProp);

    noop!(visit_method_prop, MethodProp);

    noop!(visit_constructor, Constructor);

    fn visit_expr(&mut self, expr: &Expr) {
        match *expr {
            Expr::Ident(ref i) => self.used_names.push(i.sym.clone()),
            _ => expr.visit_children_with(self),
        }
    }
}
