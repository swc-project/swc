use crate::option::CompressOptions;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

pub fn postcompress_optimizer<'a>(options: &'a CompressOptions) -> impl 'a + VisitMut {
    PostcompressOptimizer { options }
}

struct PostcompressOptimizer<'a> {
    options: &'a CompressOptions,
}

impl PostcompressOptimizer<'_> {
    fn optimize_in_bool_ctx(&mut self, _e: &mut Expr) {
        if !self.options.bools {
            return;
        }
    }
}

impl VisitMut for PostcompressOptimizer<'_> {
    noop_visit_mut_type!();

    fn visit_mut_cond_expr(&mut self, e: &mut CondExpr) {
        e.visit_mut_children_with(self);

        self.optimize_in_bool_ctx(&mut *e.test);
    }

    fn visit_mut_if_stmt(&mut self, s: &mut IfStmt) {
        s.visit_mut_children_with(self);

        self.optimize_in_bool_ctx(&mut *s.test);
    }
}
