use swc_common::SyntaxContext;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_transforms_base::assumptions::Assumptions;

use crate::{hook_utils::OptionalHook, TraverseCtx};

mod async_to_generator;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2017Options {
    pub async_to_generator: bool,
}

pub(crate) fn hook(
    unresolved_ctxt: SyntaxContext,
    options: Es2017Options,
    asseumptions: Assumptions,
) -> impl VisitMutHook<TraverseCtx> {
    OptionalHook(if options.async_to_generator {
        Some(self::async_to_generator::hook(
            unresolved_ctxt,
            asseumptions.ignore_function_length,
        ))
    } else {
        None
    })
}
