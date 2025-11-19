use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    OptionalCatchBindingPass {}
}

struct OptionalCatchBindingPass {}

impl VisitMutHook<TraverseCtx> for OptionalCatchBindingPass {}
