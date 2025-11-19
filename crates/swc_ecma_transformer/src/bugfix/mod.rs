use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
pub struct BugfixOptions {}

pub fn hook(options: BugfixOptions) -> impl VisitMutHook<TraverseCtx> {
    BugfixPass { options }
}

struct BugfixPass {
    options: BugfixOptions,
}

impl VisitMutHook<TraverseCtx> for BugfixPass {}
