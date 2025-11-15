use oxc_ast::ast::*;
use oxc_traverse::Traverse;

use crate::{context::TraverseCtx, state::TransformState};

mod optional_catch_binding;
mod options;

pub use optional_catch_binding::OptionalCatchBinding;
pub use options::ES2019Options;

pub struct ES2019 {
    options: ES2019Options,

    // Plugins
    optional_catch_binding: OptionalCatchBinding,
}

impl ES2019 {
    pub fn new(options: ES2019Options) -> Self {
        Self { optional_catch_binding: OptionalCatchBinding::new(), options }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for ES2019 {
    fn enter_catch_clause(&mut self, clause: &mut CatchClause<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.options.optional_catch_binding {
            self.optional_catch_binding.enter_catch_clause(clause, ctx);
        }
    }
}
