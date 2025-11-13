use swc_ecma_hooks::VisitMutHook;

use crate::context::{TransformCtx, TraverseCtx};

mod async_generator_functions;
mod object_rest_spread;
mod options;

pub use async_generator_functions::AsyncGeneratorFunctions;
pub use object_rest_spread::{ObjectRestSpread, ObjectRestSpreadOptions};
pub use options::ES2018Options;

pub struct ES2018<'a> {
    #[expect(unused)]
    options: ES2018Options,

    // Plugins
    #[expect(unused)]
    object_rest_spread: ObjectRestSpread<'a>,
    #[expect(unused)]
    async_generator_functions: AsyncGeneratorFunctions<'a>,
}

impl<'a> ES2018<'a> {
    pub fn new(options: ES2018Options, ctx: &'a TransformCtx) -> Self {
        Self {
            object_rest_spread: ObjectRestSpread::new(
                options.object_rest_spread.unwrap_or_default(),
                ctx,
            ),
            async_generator_functions: AsyncGeneratorFunctions::new(ctx),
            options,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ES2018<'_> {}
