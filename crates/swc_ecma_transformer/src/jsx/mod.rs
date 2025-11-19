use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct JsxOptions {}

pub fn hook(options: JsxOptions) -> impl VisitMutHook<TraverseCtx> {
    JsxPass { options }
}

struct JsxPass {
    options: JsxOptions,
}

impl VisitMutHook<TraverseCtx> for JsxPass {}
