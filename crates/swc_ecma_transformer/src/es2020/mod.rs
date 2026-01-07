use swc_ecma_hooks::VisitMutHook;
use swc_ecma_transforms_base::assumptions::Assumptions;

use crate::{
    hook_utils::{HookBuilder, NoopHook},
    TraverseCtx,
};

mod export_namespace_from;
mod nullish_coalescing;
mod optional_chaining;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2020Options {
    pub export_namespace_from: bool,

    pub nullish_coalescing: bool,

    pub optional_chaining: bool,
}

pub(crate) fn hook(
    options: Es2020Options,
    assumptions: Assumptions,
) -> impl VisitMutHook<TraverseCtx> {
    let hook = HookBuilder::new(NoopHook);

    let hook = hook.chain(if options.export_namespace_from {
        Some(self::export_namespace_from::hook())
    } else {
        None
    });

    let hook = hook.chain(if options.nullish_coalescing {
        Some(self::nullish_coalescing::hook(assumptions.no_document_all))
    } else {
        None
    });

    hook.build()
}
