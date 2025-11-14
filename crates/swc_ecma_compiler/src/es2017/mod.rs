use swc_ecma_hooks::VisitMutHook;

use crate::context::TraverseCtx;

mod async_to_generator;
mod options;
pub use async_to_generator::{AsyncGeneratorExecutor, AsyncToGenerator};
pub use options::ES2017Options;

pub struct ES2017 {
    #[expect(unused)]
    options: ES2017Options,

    // Plugins
    #[expect(unused)]
    async_to_generator: AsyncToGenerator,
}

impl ES2017 {
    pub fn new(options: ES2017Options) -> ES2017 {
        ES2017 {
            async_to_generator: AsyncToGenerator::new(),
            options,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ES2017 {}
