pub(crate) mod async_to_generator;

use swc_common::SyntaxContext;
use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2017Options {
    /// Lower async functions to generators. This also lowers async generators
    /// to preserve the existing behavior of this option.
    pub async_to_generator: bool,

    /// Lower async generators without lowering ordinary async functions.
    pub async_generator_functions: bool,
}

impl Es2017Options {
    /// Returns true if any transform is enabled.
    pub fn is_enabled(&self) -> bool {
        self.async_to_generator || self.async_generator_functions
    }
}

pub fn hook(
    options: Es2017Options,
    unresolved_ctxt: SyntaxContext,
    ignore_function_length: bool,
) -> impl VisitMutHook<TraverseCtx> {
    if options.is_enabled() {
        Some(async_to_generator::hook(
            options.async_to_generator,
            options.async_to_generator || options.async_generator_functions,
            unresolved_ctxt,
            ignore_function_length,
        ))
    } else {
        None
    }
}
