use swc_ecma_ast::*;
use swc_ecma_visit::{standard_only_visit_mut, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

pub(super) struct ThisInStaticFolder {
    pub ident: Ident,
}

#[swc_trace]
impl VisitMut for ThisInStaticFolder {
    standard_only_visit_mut!();

    // once again, for computed props
    fn visit_mut_constructor(&mut self, _: &mut Constructor) {}

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::This(..) = e {
            *e = self.ident.clone().into()
        }
    }

    fn visit_mut_function(&mut self, _: &mut Function) {}
}

pub(super) struct NewTargetInProp;

#[swc_trace]
impl VisitMut for NewTargetInProp {
    standard_only_visit_mut!();

    // once again, for computed props
    fn visit_mut_constructor(&mut self, _: &mut Constructor) {}

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::MetaProp(MetaPropExpr {
            span,
            kind: MetaPropKind::NewTarget,
        }) = e
        {
            *e = *Expr::undefined(*span);
        }
    }

    fn visit_mut_function(&mut self, _: &mut Function) {}
}
