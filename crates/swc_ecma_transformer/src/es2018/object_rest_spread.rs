use swc_ecma_hooks::VisitMutHook;
use swc_ecma_transforms_base::assumptions::Assumptions;

use crate::TraverseCtx;

pub fn hook(assumptions: Assumptions) -> impl VisitMutHook<TraverseCtx> {
    ObjectRestSpreadPass {}
}

struct ObjectRestSpreadPass {}

impl VisitMutHook<TraverseCtx> for ObjectRestSpreadPass {}
