mod async_to_generator;

use swc_common::Mark;
use swc_ecma_hooks::VisitMutHook;

use crate::{hook_utils::OptionalHook, TraverseCtx};

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2017Options {
    pub async_to_generator: Option<Mark>,
}

pub fn hook(options: Es2017Options) -> impl VisitMutHook<TraverseCtx> {
    OptionalHook(options.async_to_generator.map(async_to_generator::hook))
}
