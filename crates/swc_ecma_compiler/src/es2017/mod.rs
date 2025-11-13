use swc_ecma_hooks::VisitMutHook;

use crate::context::{TransformCtx, TraverseCtx};

mod async_to_generator;
mod options;
pub use async_to_generator::{AsyncGeneratorExecutor, AsyncToGenerator};
pub use options::ES2017Options;

pub struct ES2017<'a, 'ctx> {
    #[expect(unused)]
    options: ES2017Options,

    // Plugins
    #[expect(unused)]
    async_to_generator: AsyncToGenerator<'a, 'ctx>,
}

impl<'a, 'ctx> ES2017<'a, 'ctx> {
    pub fn new(options: ES2017Options, ctx: &'ctx TransformCtx<'a>) -> ES2017<'a, 'ctx> {
        ES2017 {
            async_to_generator: AsyncToGenerator::new(ctx),
            options,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ES2017<'_, '_> {}
