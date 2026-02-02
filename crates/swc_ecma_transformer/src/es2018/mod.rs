use swc_ecma_hooks::VisitMutHook;
use swc_ecma_transforms_base::assumptions::Assumptions;

use crate::TraverseCtx;

mod object_rest_spread;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2018Options {
    pub object_rest_spread: bool,
}

impl Es2018Options {
    /// Returns true if any transform is enabled.
    pub fn is_enabled(&self) -> bool {
        self.object_rest_spread
    }
}

pub(crate) fn hook(
    options: Es2018Options,
    assumptions: Assumptions,
) -> impl VisitMutHook<TraverseCtx> {
    if options.object_rest_spread {
        Some(object_rest_spread::hook(assumptions))
    } else {
        None
    }
}
