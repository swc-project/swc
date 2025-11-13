use swc_ecma_hooks::VisitMutHook;

use crate::context::{TransformCtx, TraverseCtx};

mod async_to_generator;
mod options;
pub use async_to_generator::{AsyncGeneratorExecutor, AsyncToGenerator};
pub use options::ES2017Options;

pub struct ES2017<'a> {
    #[expect(unused)]
    options: ES2017Options,

    // Plugins
    #[expect(unused)]
    async_to_generator: AsyncToGenerator<'a>,
}

impl<'a> ES2017<'a> {
    pub fn new(options: ES2017Options, ctx: &'a TransformCtx) -> ES2017<'a> {
        ES2017 {
            async_to_generator: AsyncToGenerator::new(ctx),
            options,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ES2017<'_> {}
