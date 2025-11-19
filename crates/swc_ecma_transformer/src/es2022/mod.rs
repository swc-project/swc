use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]#[non_exhaustive]
pub struct Es2022Options {}

pub fn hook(options: Es2022Options) -> impl VisitMutHook<TraverseCtx> {
    Es2022Pass { options }
}

struct Es2022Pass {
    options: Es2022Options,
}

impl VisitMutHook<TraverseCtx> for Es2022Pass {}
