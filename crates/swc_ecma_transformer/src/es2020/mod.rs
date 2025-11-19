use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2020Options {}

pub fn hook(options: Es2020Options) -> impl VisitMutHook<TraverseCtx> {
    Es2020Pass { options }
}

struct Es2020Pass {
    options: Es2020Options,
}

impl VisitMutHook<TraverseCtx> for Es2020Pass {}
