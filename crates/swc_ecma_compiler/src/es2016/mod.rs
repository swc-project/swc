use swc_ecma_hooks::VisitMutHook;

use crate::context::TraverseCtx;

mod exponentiation_operator;
mod options;

pub use exponentiation_operator::ExponentiationOperator;
pub use options::ES2016Options;

pub struct ES2016 {
    #[expect(unused)]
    options: ES2016Options,

    // Plugins
    #[expect(unused)]
    exponentiation_operator: ExponentiationOperator,
}

impl ES2016 {
    pub fn new(options: ES2016Options) -> Self {
        Self {
            exponentiation_operator: ExponentiationOperator::new(),
            options,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ES2016 {}
