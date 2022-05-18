use swc_common::{Mark, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

use crate::tracker::Tracker;

/// Makes [BlockStmt] and [Function] unique in aspect of span hygiene.
///
/// Required for [crate::hygiene_optimizer] to work properly.
pub fn unique_scope(tracker: &mut Tracker) -> impl Fold + VisitMut {
    as_folder(UniqueScope)
}

struct UniqueScope;

impl UniqueScope {
    fn make_unique(&self, span: &mut Span) {
        span.ctxt = span.ctxt.apply_mark(Mark::fresh(Mark::root()));
    }
}

impl VisitMut for UniqueScope {
    noop_visit_mut_type!();

    fn visit_mut_arrow_expr(&mut self, n: &mut ArrowExpr) {
        n.visit_mut_children_with(self);

        self.make_unique(&mut n.span);
    }

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        n.visit_mut_children_with(self);

        self.make_unique(&mut n.span);
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        n.visit_mut_children_with(self);

        self.make_unique(&mut n.span);
    }
}
