mod async_to_generator;

use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2017Options {
    pub async_to_generator: bool,
}

pub fn hook(options: Es2017Options) -> impl VisitMutHook<TraverseCtx> {
    Es2017Pass { options }
}

struct Es2017Pass {
    options: Es2017Options,
}

impl VisitMutHook<TraverseCtx> for Es2017Pass {}
