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

pub fn hook_with_context(
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

pub fn hook(options: Es2017Options) -> impl VisitMutHook<TraverseCtx> {
    hook_with_context(options, SyntaxContext::empty(), Assumptions::default())
}
