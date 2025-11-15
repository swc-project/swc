use oxc_ast::ast::*;
use oxc_traverse::Traverse;

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

mod logical_assignment_operators;
mod options;

pub use logical_assignment_operators::LogicalAssignmentOperators;
pub use options::ES2021Options;

pub struct ES2021<'a, 'ctx> {
    options: ES2021Options,

    // Plugins
    logical_assignment_operators: LogicalAssignmentOperators<'a, 'ctx>,
}

impl<'a, 'ctx> ES2021<'a, 'ctx> {
    pub fn new(options: ES2021Options, ctx: &'ctx TransformCtx<'a>) -> Self {
        Self { logical_assignment_operators: LogicalAssignmentOperators::new(ctx), options }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for ES2021<'a, '_> {
    fn enter_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        if self.options.logical_assignment_operators {
            self.logical_assignment_operators.enter_expression(expr, ctx);
        }
    }
}
