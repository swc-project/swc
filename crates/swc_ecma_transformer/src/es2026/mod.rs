use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2026Options {}

pub fn hook(options: Es2026Options) -> impl VisitMutHook<TraverseCtx> {
    Es2026Pass { options }
}

struct Es2026Pass {
    options: Es2026Options,
}

impl VisitMutHook<TraverseCtx> for Es2026Pass {}
