use swc_common::{Mark, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::perf::{cpu_count, ParVisitMut, Parallel};

pub(super) fn unique_scope() -> impl VisitMut {
    UniqueScope
}

#[derive(Debug, Clone, Copy)]
struct UniqueScope;

impl UniqueScope {
    pub fn mark(&self, s: &mut Span) {
        *s = s.apply_mark(Mark::fresh(Mark::root()));
    }
}

impl Parallel for UniqueScope {
    fn create(&self) -> Self {
        *self
    }

    fn merge(&mut self, _: Self) {}
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

    fn visit_mut_constructor(&mut self, n: &mut Constructor) {
        n.visit_mut_children_with(self);

        self.mark(&mut n.span);
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        n.visit_mut_children_with(self);

        self.mark(&mut n.span);
    }

    fn visit_mut_method_prop(&mut self, n: &mut MethodProp) {
        n.visit_mut_children_with(self);

        self.mark(&mut n.function.span);
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.visit_mut_par(cpu_count() * 64, n)
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.visit_mut_par(cpu_count() * 64, n)
    }
}
