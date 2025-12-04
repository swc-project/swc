use swc_common::Mark;
use swc_ecma_hooks::VisitMutHook;

use crate::{hook_utils::OptionalHook, TraverseCtx};

mod arrow_functions;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2015Options {
    pub arrow_functions: Option<Mark>,
}

pub fn hook(options: Es2015Options) -> impl VisitMutHook<TraverseCtx> {
    OptionalHook(
        options
            .arrow_functions
            .map(|mark| self::arrow_functions::hook(mark)),
    )
}
