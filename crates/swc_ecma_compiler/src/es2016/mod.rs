use swc_ecma_hooks::VisitMutHook;

use crate::context::{TransformCtx, TraverseCtx};

mod exponentiation_operator;
mod options;

pub use exponentiation_operator::ExponentiationOperator;
pub use options::ES2016Options;

pub struct ES2016<'a> {
    #[expect(unused)]
    options: ES2016Options,

    // Plugins
    #[expect(unused)]
    exponentiation_operator: ExponentiationOperator<'a>,
}

impl<'a> ES2016<'a> {
    pub fn new(options: ES2016Options, ctx: &'a TransformCtx) -> Self {
        Self {
            exponentiation_operator: ExponentiationOperator::new(ctx),
            options,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ES2016<'_> {}
