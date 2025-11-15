use oxc_traverse::Traverse;

use crate::{context::TransformCtx, state::TransformState};

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

impl<'a> Traverse<'a, TransformState<'a>> for ES2015<'a, '_> {}
