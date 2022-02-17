use swc_ecma_ast::*;
use swc_ecma_utils::undefined;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

pub(super) struct ThisInStaticFolder {
    pub ident: Ident,
}

impl VisitMut for ThisInStaticFolder {
    noop_visit_mut_type!();

    // once again, for computed props
    fn visit_mut_constructor(&mut self, _: &mut Constructor) {}

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::This(..) = e {
            *e = Expr::Ident(self.ident.clone())
        }
    }

    fn visit_mut_function(&mut self, _: &mut Function) {}
}

pub(super) struct NewTargetInProp;

impl VisitMut for NewTargetInProp {
    noop_visit_mut_type!();

    // once again, for computed props
    fn visit_mut_constructor(&mut self, _: &mut Constructor) {}

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::MetaProp(MetaPropExpr {
            span,
            kind: MetaPropKind::NewTarget,
        }) = e
        {
            *e = *undefined(*span);
        }
    }

    fn visit_mut_function(&mut self, _: &mut Function) {}
}
