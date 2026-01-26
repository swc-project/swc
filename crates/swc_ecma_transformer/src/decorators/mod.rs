use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct DecoratorOptions {}

pub fn hook(options: DecoratorOptions) -> impl VisitMutHook<TraverseCtx> {
    DecoratorPass { options }
}

struct DecoratorPass {
    options: DecoratorOptions,
}

impl VisitMutHook<TraverseCtx> for DecoratorPass {}
