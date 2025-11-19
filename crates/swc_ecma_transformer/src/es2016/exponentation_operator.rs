use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

pub fn hook() -> impl VisitMutHook<TraverseCtx> {
    ExponentiationOperatorPass::default()
}

#[derive(Default)]
struct ExponentiationOperatorPass {}

impl VisitMutHook<TraverseCtx> for ExponentiationOperatorPass {}
