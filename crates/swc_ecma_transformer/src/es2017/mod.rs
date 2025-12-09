mod async_to_generator;

use swc_common::SyntaxContext;
use swc_ecma_hooks::VisitMutHook;

use crate::{hook_utils::OptionalHook, TraverseCtx};

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2017Options {
    pub async_to_generator: bool,
}

pub fn hook(
    options: Es2017Options,
    unresolved_ctxt: SyntaxContext,
    ignore_function_length: bool,
) -> impl VisitMutHook<TraverseCtx> {
    if options.async_to_generator {
        OptionalHook(Some(async_to_generator::hook(
            unresolved_ctxt,
            ignore_function_length,
        )))
    } else {
        OptionalHook(None)
    }
}
