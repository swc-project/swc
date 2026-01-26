use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::private_ident;

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    OptionalCatchBindingPass {}
}

struct OptionalCatchBindingPass {}

impl VisitMutHook<TraverseCtx> for OptionalCatchBindingPass {
    fn enter_catch_clause(&mut self, node: &mut CatchClause, _: &mut TraverseCtx) {
        if node.param.is_none() {
            // TODO: Do not use private_ident! here.
            // All private identifiers should be tracked using TraverseCtx.
            node.param = Some(Pat::Ident(private_ident!("unused").into()));
        }
    }
}
