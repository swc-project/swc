use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct BugfixOptions {}

impl BugfixOptions {
    /// Returns true if any transform is enabled.
    /// Currently no bugfixes are available.
    pub fn is_enabled(&self) -> bool {
        false
    }
}

pub fn hook(options: BugfixOptions) -> impl VisitMutHook<TraverseCtx> {
    BugfixPass { options }
}

struct BugfixPass {
    options: BugfixOptions,
}

impl VisitMutHook<TraverseCtx> for BugfixPass {}
