use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
pub struct Es2018Options {}

pub fn hook(options: Es2018Options) -> impl VisitMutHook<TraverseCtx> {
    Es2018Pass { options }
}

struct Es2018Pass {
    options: Es2018Options,
}

impl VisitMutHook<TraverseCtx> for Es2018Pass {}
