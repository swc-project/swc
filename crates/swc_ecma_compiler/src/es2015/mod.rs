use swc_ecma_hooks::VisitMutHook;

use crate::context::TraverseCtx;

mod arrow_functions;
mod options;

pub use arrow_functions::{ArrowFunctions, ArrowFunctionsOptions};
pub use options::ES2015Options;

pub struct ES2015 {
    #[expect(unused)]
    options: ES2015Options,

    // Plugins
    #[expect(unused)]
    arrow_functions: ArrowFunctions,
}

impl ES2015 {
    pub fn new(options: ES2015Options) -> Self {
        Self {
            arrow_functions: ArrowFunctions::new(options.arrow_function.unwrap_or_default()),
            options,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ES2015 {}
