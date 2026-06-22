pub(crate) mod async_to_generator;

use swc_common::SyntaxContext;
use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

#[derive(Debug, Default)]
#[non_exhaustive]
pub struct Es2017Options {
    pub async_to_generator: bool,
    /// Lower async generators for targets that support async functions but not
    /// async generator syntax.
    pub async_generator_to_generator: bool,
}

impl Es2017Options {
    /// Returns true if any transform is enabled.
    pub fn is_enabled(&self) -> bool {
        self.async_to_generator || self.async_generator_to_generator
    }
}

pub fn hook(
    options: Es2017Options,
    unresolved_ctxt: SyntaxContext,
    ignore_function_length: bool,
) -> impl VisitMutHook<TraverseCtx> {
    if options.is_enabled() {
        Some(async_to_generator::hook(
            unresolved_ctxt,
            ignore_function_length,
            async_to_generator::Options {
                transform_async_functions: options.async_to_generator,
                transform_async_generators: options.async_to_generator
                    || options.async_generator_to_generator,
            },
        ))
    } else {
        None
    }
}
