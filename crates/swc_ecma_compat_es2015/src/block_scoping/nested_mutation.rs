use swc_ecma_ast::*;
use swc_ecma_utils::find_pat_ids;
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::FlowHelper;

/// Records writes to loop variables that happen inside a nested function.
///
/// [FlowHelper] skips nested functions because `break`, `continue`, `return`,
/// `yield` and `await` inside them do not belong to the loop body. A write to
/// a captured loop variable still has to be copied back to the outer variable
/// after `_loop(i)`, so this visitor only reports those writes to
/// [FlowHelper::check] and leaves everything else alone.
///
/// Identifiers are compared by [Id], so a binding that shadows the loop
/// variable inside the nested function is not reported.
pub(super) struct NestedMutationCollector<'a, 'b> {
    pub flow: &'a mut FlowHelper<'b>,
}

impl Visit for NestedMutationCollector<'_, '_> {
    noop_visit_type!(fail);

    fn visit_assign_expr(&mut self, n: &AssignExpr) {
        match &n.left {
            AssignTarget::Simple(SimpleAssignTarget::Ident(i)) => {
                self.flow.check(i.to_id());
            }
            AssignTarget::Pat(p) => {
                for id in find_pat_ids::<_, Id>(p) {
                    self.flow.check(id);
                }
            }
            _ => {}
        }

        n.visit_children_with(self);
    }

    fn visit_update_expr(&mut self, n: &UpdateExpr) {
        if let Expr::Ident(i) = &*n.arg {
            self.flow.check(i.to_id());
        }

        n.visit_children_with(self);
    }
}
