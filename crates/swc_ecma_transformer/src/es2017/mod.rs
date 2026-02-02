mod async_to_generator;

use swc_common::SyntaxContext;
use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2017Options {
    pub async_to_generator: bool,
}

impl Es2017Options {
    /// Returns true if any transform is enabled.
    pub fn is_enabled(&self) -> bool {
        self.async_to_generator
    }
}

pub fn hook(
    options: Es2017Options,
    unresolved_ctxt: SyntaxContext,
    ignore_function_length: bool,
) -> impl VisitMutHook<TraverseCtx> {
    if options.async_to_generator {
        Some(async_to_generator::hook(
            unresolved_ctxt,
            ignore_function_length,
        ))
    } else {
        None
    }
}
