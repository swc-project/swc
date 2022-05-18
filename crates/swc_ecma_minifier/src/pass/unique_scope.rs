use swc_common::{Mark, Span};
use swc_ecma_ast::*;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

use crate::tracker::TrackerData;

/// Makes [BlockStmt] and [Function] unique in aspect of span hygiene.
///
/// Required for [crate::hygiene_optimizer] to work properly.
pub(crate) fn unique_scope(tracker: &mut TrackerData) -> impl '_ + Fold + VisitMut {
    as_folder(UniqueScope { tracker })
}

struct UniqueScope<'a> {
    tracker: &'a mut TrackerData,
}

impl UniqueScope<'_> {
    fn make_unique(&mut self, span: &mut Span, is_scope: bool) {
        if is_scope {
            span.ctxt = span.ctxt.apply_mark(Mark::fresh(Mark::root()));
            self.tracker.add_to_known_list_of_spans(*span);
        } else {
            self.tracker.ensure_unique(span);
        }
    }
}

impl VisitMut for UniqueScope<'_> {
    noop_visit_mut_type!();

    fn visit_mut_arrow_expr(&mut self, n: &mut ArrowExpr) {
        n.visit_mut_children_with(self);

        self.make_unique(&mut n.span, true);
    }

    fn visit_mut_block_stmt(&mut self, n: &mut BlockStmt) {
        n.visit_mut_children_with(self);

        self.make_unique(&mut n.span, true);
    }

    fn visit_mut_expr_stmt(&mut self, n: &mut ExprStmt) {
        n.visit_mut_children_with(self);

        self.make_unique(&mut n.span, false);
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        n.visit_mut_children_with(self);

        self.make_unique(&mut n.span, true);
    }

    fn visit_mut_if_stmt(&mut self, n: &mut IfStmt) {
        n.visit_mut_children_with(self);

        self.make_unique(&mut n.span, false);
    }

    fn visit_mut_return_stmt(&mut self, n: &mut ReturnStmt) {
        n.visit_mut_children_with(self);

        self.make_unique(&mut n.span, false);
    }

    fn visit_mut_switch_stmt(&mut self, n: &mut SwitchStmt) {
        n.visit_mut_children_with(self);

        self.make_unique(&mut n.span, false);
    }

    fn visit_mut_try_stmt(&mut self, n: &mut TryStmt) {
        n.visit_mut_children_with(self);

        self.make_unique(&mut n.span, false);
    }
}
