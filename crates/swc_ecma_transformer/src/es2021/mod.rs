mod logical_assignment_operators;

use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2021Options {
    pub logical_assignment_operators: bool,
}

pub fn hook(options: Es2021Options) -> impl VisitMutHook<TraverseCtx> {
    Es2021Pass { options }
}

struct Es2021Pass {
    options: Es2021Options,
}

impl VisitMutHook<TraverseCtx> for Es2021Pass {}
