use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::private_ident;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    OptionalCatchBindingPass {}
}

pub(crate) fn pass() -> impl Pass {
    visit_mut_pass(OptionalCatchBindingPass {})
}

struct OptionalCatchBindingPass {}

impl OptionalCatchBindingPass {
    fn transform_catch_clause(&mut self, node: &mut CatchClause) {
        if node.param.is_none() {
            // TODO: Do not use private_ident! here.
            // All private identifiers should be tracked using TraverseCtx.
            node.param = Some(Pat::Ident(private_ident!("unused").into()));
        }
    }
}

impl VisitMutHook<TraverseCtx> for OptionalCatchBindingPass {
    fn enter_catch_clause(&mut self, node: &mut CatchClause, _: &mut TraverseCtx) {
        self.transform_catch_clause(node);
    }
}

impl VisitMut for OptionalCatchBindingPass {
    noop_visit_mut_type!(fail);

    fn visit_mut_catch_clause(&mut self, node: &mut CatchClause) {
        self.transform_catch_clause(node);
        node.body.visit_mut_with(self);
    }
}
