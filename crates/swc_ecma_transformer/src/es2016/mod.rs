mod exponentation_operator;

use swc_ecma_hooks::VisitMutHook;

use crate::{hook_utils::OptionalHook, TraverseCtx};

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2016Options {
    pub exponentation_operator: bool,
}

pub fn hook(options: Es2016Options) -> impl VisitMutHook<TraverseCtx> {
    OptionalHook(if options.exponentation_operator {
        Some(self::exponentation_operator::hook())
    } else {
        None
    })
}
