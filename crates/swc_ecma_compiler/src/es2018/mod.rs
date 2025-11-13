use swc_ecma_hooks::VisitMutHook;

use crate::context::TraverseCtx;

mod async_generator_functions;
mod object_rest_spread;
mod options;

pub use async_generator_functions::AsyncGeneratorFunctions;
pub use object_rest_spread::{ObjectRestSpread, ObjectRestSpreadOptions};
pub use options::ES2018Options;

pub struct ES2018 {
    #[expect(unused)]
    options: ES2018Options,

    // Plugins
    #[expect(unused)]
    object_rest_spread: ObjectRestSpread,
    #[expect(unused)]
    async_generator_functions: AsyncGeneratorFunctions,
}

impl ES2018 {
    pub fn new(options: ES2018Options) -> Self {
        Self {
            object_rest_spread: ObjectRestSpread::new(
                options.object_rest_spread.unwrap_or_default(),
            ),
            async_generator_functions: AsyncGeneratorFunctions::new(),
            options,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ES2018 {}
