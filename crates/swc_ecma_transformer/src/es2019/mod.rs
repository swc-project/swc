use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
pub struct Es2019Options {}

pub fn hook(options: Es2019Options) -> impl VisitMutHook<TraverseCtx> {
    Es2019Pass { options }
}

struct Es2019Pass {
    options: Es2019Options,
}

impl VisitMutHook<TraverseCtx> for Es2019Pass {}
