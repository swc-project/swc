use swc_common::{Mark, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

pub(super) fn unique_scope() -> impl VisitMut {
    UniqueScope
}

struct UniqueScope;

impl UniqueScope {
    pub fn mark(&self, s: &mut Span) {
        *s = s.apply_mark(Mark::fresh(Mark::root()));
    }
}

impl VisitMut for UniqueScope {
    noop_visit_mut_type!();

    fn visit_mut_arrow_expr(&mut self, n: &mut ArrowExpr) {
        n.visit_mut_children_with(self);

        self.mark(&mut n.span);
    }

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        n.visit_mut_children_with(self);

        self.mark(&mut n.span);
    }

    fn visit_mut_class_expr(&mut self, n: &mut ClassExpr) {
        n.visit_mut_children_with(self);

        self.mark(&mut n.class.span);
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        n.visit_mut_children_with(self);

        self.mark(&mut n.span);
    }

    fn visit_mut_method_prop(&mut self, n: &mut MethodProp) {
        n.visit_mut_children_with(self);

        self.mark(&mut n.function.span);
    }
}
