use swc_ecma_hooks::VisitMutHook;

use crate::{hook_utils::OptionalHook, TraverseCtx};

mod object_rest_spread;

pub use self::object_rest_spread::Config as ObjectRestSpreadConfig;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2018Options {
    pub object_rest_spread: Option<ObjectRestSpreadConfig>,
}

pub fn hook(options: Es2018Options) -> impl VisitMutHook<TraverseCtx> {
    OptionalHook(
        options
            .object_rest_spread
            .map(self::object_rest_spread::hook),
    )
}
