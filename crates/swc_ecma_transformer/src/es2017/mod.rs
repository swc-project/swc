mod async_to_generator;

use swc_common::SyntaxContext;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_transforms_base::assumptions::Assumptions;

use crate::{hook_utils::OptionalHook, TraverseCtx};

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2017Options {
    pub async_to_generator: bool,
}

struct Es2017Context {
    unresolved_ctxt: SyntaxContext,
    assumptions: Assumptions,
}

pub(crate) fn hook(
    options: Es2017Options,
    unresolved_ctxt: SyntaxContext,
    assumptions: Assumptions,
) -> impl VisitMutHook<TraverseCtx> {
    OptionalHook(if options.async_to_generator {
        Some(self::async_to_generator::hook(unresolved_ctxt, assumptions))
    } else {
        None
    })
}
