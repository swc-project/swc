use swc_ecma_hooks::VisitMutHook;

use crate::{
    hook_utils::{HookBuilder, OptionalHook},
    TraverseCtx,
};

mod export_namespace_from;
pub mod nullish_coalescing;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2020Options {
    pub export_namespace_from: bool,
    pub nullish_coalescing: bool,
}

pub fn hook(options: Es2020Options) -> impl VisitMutHook<TraverseCtx> {
    let hook = HookBuilder::new(OptionalHook(if options.export_namespace_from {
        Some(self::export_namespace_from::hook())
    } else {
        None
    }));

    let hook = hook.chain_optional(if options.nullish_coalescing {
        Some(self::nullish_coalescing::hook())
    } else {
        None
    });

    hook.build()
}
