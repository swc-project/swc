use swc_ecma_hooks::VisitMutHook;

use crate::{hook_utils::OptionalHook, TraverseCtx};

pub mod object_rest_spread;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2018Options {
    pub object_rest_spread: bool,
    pub object_rest_spread_config: object_rest_spread::Config,
}

pub fn hook(options: Es2018Options) -> impl VisitMutHook<TraverseCtx> {
    if options.object_rest_spread {
        OptionalHook(Some(object_rest_spread::hook(
            options.object_rest_spread_config,
        )))
    } else {
        OptionalHook(None)
    }
}
