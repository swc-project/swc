use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

mod object_rest_spread;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2018Options {
    pub object_rest_spread: bool,
}

pub fn hook(options: Es2018Options) -> impl VisitMutHook<TraverseCtx> {
    Es2018Pass { options }
}

struct Es2018Pass {
    options: Es2018Options,
}

impl VisitMutHook<TraverseCtx> for Es2018Pass {}
