use swc_ecma_hooks::VisitMutHook;

use crate::context::{TransformCtx, TraverseCtx};

mod optional_catch_binding;
mod options;

pub use optional_catch_binding::OptionalCatchBinding;
pub use options::ES2019Options;

pub struct ES2019<'a, 'ctx> {
    #[expect(unused)]
    options: ES2019Options,

    // Plugins
    #[expect(unused)]
    optional_catch_binding: OptionalCatchBinding<'a, 'ctx>,
}

impl<'a, 'ctx> ES2019<'a, 'ctx> {
    pub fn new(options: ES2019Options, ctx: &'ctx TransformCtx<'a>) -> Self {
        Self {
            optional_catch_binding: OptionalCatchBinding::new(ctx),
            options,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ES2019<'_, '_> {}
