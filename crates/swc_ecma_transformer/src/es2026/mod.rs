use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2026Options {}

impl Es2026Options {
    /// Returns true if any transform is enabled.
    /// Currently no transforms are available for ES2026.
    pub fn is_enabled(&self) -> bool {
        false
    }
}

pub fn hook(options: Es2026Options) -> impl VisitMutHook<TraverseCtx> {
    Es2026Pass { options }
}

struct Es2026Pass {
    options: Es2026Options,
}

impl VisitMutHook<TraverseCtx> for Es2026Pass {}
