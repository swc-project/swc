use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct TypescriptOptions {}

pub fn hook(options: TypescriptOptions) -> impl VisitMutHook<TraverseCtx> {
    TypeScriptPass { options }
}

struct TypeScriptPass {
    options: TypescriptOptions,
}

impl VisitMutHook<TraverseCtx> for TypeScriptPass {}
