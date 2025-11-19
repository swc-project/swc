use swc_common::SyntaxContext;
use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

pub(crate) fn hook(
    unresolved_ctxt: SyntaxContext,
    ignore_function_length: bool,
) -> impl VisitMutHook<TraverseCtx> {
    AsyncToGeneratorPass {
        unresolved_ctxt,
        ignore_function_length,
    }
}

struct AsyncToGeneratorPass {
    unresolved_ctxt: SyntaxContext,
    ignore_function_length: bool,
}

impl VisitMutHook<TraverseCtx> for AsyncToGeneratorPass {}
