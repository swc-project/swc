use swc_ecma_hooks::VisitMutHook;
use swc_ecma_transforms_base::assumptions::Assumptions;

use crate::{hook_utils::OptionalHook, TraverseCtx};

mod object_rest_spread;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2018Options {
    pub object_rest_spread: bool,
}

pub(crate) fn hook(
    options: Es2018Options,
    assumptions: Assumptions,
) -> impl VisitMutHook<TraverseCtx> {
    if options.object_rest_spread {
        OptionalHook(Some(object_rest_spread::hook(assumptions)))
    } else {
        OptionalHook(None)
    }
}
