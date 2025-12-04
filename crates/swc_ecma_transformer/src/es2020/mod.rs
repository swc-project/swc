use swc_ecma_hooks::VisitMutHook;

use crate::{hook_utils::OptionalHook, TraverseCtx};

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

pub fn hook(options: Es2020Options) -> impl VisitMutHook<TraverseCtx> {
    OptionalHook(if options.export_namespace_from {
        Some(self::export_namespace_from::hook())
    } else {
        None
    })
}
