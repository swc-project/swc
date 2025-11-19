use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2016Options {}

pub fn hook(options: Es2016Options) -> impl VisitMutHook<TraverseCtx> {
    Es2016Pass { options }
}

struct Es2016Pass {
    options: Es2016Options,
}

impl VisitMutHook<TraverseCtx> for Es2016Pass {}
