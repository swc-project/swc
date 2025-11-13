use swc_ecma_hooks::VisitMutHook;

use crate::context::TraverseCtx;

mod optional_catch_binding;
mod options;

pub use optional_catch_binding::OptionalCatchBinding;
pub use options::ES2019Options;

pub struct ES2019 {
    #[expect(unused)]
    options: ES2019Options,

    // Plugins
    #[expect(unused)]
    optional_catch_binding: OptionalCatchBinding,
}

impl ES2019 {
    pub fn new(options: ES2019Options) -> Self {
        Self {
            optional_catch_binding: OptionalCatchBinding::new(),
            options,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ES2019 {}
