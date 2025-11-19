use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]#[non_exhaustive]
pub struct Es2015Options {}

pub fn hook(options: Es2015Options) -> impl VisitMutHook<TraverseCtx> {
    Es2015Pass { options }
}

struct Es2015Pass {
    options: Es2015Options,
}

impl VisitMutHook<TraverseCtx> for Es2015Pass {}
