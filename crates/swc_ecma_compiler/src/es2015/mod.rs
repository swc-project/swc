use swc_ecma_hooks::VisitMutHook;

use crate::context::{TransformCtx, TraverseCtx};

mod arrow_functions;
mod options;

pub use arrow_functions::{ArrowFunctions, ArrowFunctionsOptions};
pub use options::ES2015Options;

pub struct ES2015<'a, 'ctx> {
    #[expect(unused)]
    options: ES2015Options,

    // Plugins
    #[expect(unused)]
    arrow_functions: ArrowFunctions<'a, 'ctx>,
}

impl<'a, 'ctx> ES2015<'a, 'ctx> {
    pub fn new(options: ES2015Options, ctx: &'ctx TransformCtx<'a>) -> Self {
        Self {
            arrow_functions: ArrowFunctions::new(options.arrow_function.unwrap_or_default(), ctx),
            options,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ES2015<'_, '_> {}
