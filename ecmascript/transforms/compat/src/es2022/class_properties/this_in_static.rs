use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

pub(super) struct ThisInStaticFolder {
    pub ident: Ident,
}

impl VisitMut for ThisInStaticFolder {
    noop_visit_mut_type!();

    fn visit_mut_class(&mut self, _: &mut Class) {}

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        match e {
            Expr::This(..) => *e = Expr::Ident(self.ident.clone()),
            _ => {}
        }
    }

    fn visit_mut_function(&mut self, _: &mut Function) {}
}
