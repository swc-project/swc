use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::context::{TransformCtx, TraverseCtx};

mod logical_assignment_operators;
mod options;

pub use logical_assignment_operators::LogicalAssignmentOperators;
pub use options::ES2021Options;

pub struct ES2021<'a> {
    options: ES2021Options,

    // Plugins
    logical_assignment_operators: LogicalAssignmentOperators<'a>,
}

impl<'a> ES2021<'a> {
    pub fn new(options: ES2021Options, ctx: &'a TransformCtx) -> Self {
        Self {
            logical_assignment_operators: LogicalAssignmentOperators::new(ctx),
            options,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ES2021<'_> {
    fn enter_expr(&mut self, _expr: &mut Expr, _ctx: &mut TraverseCtx) {
        // TODO: Delegate to logical_assignment_operators when enabled
        // if self.options.logical_assignment_operators {
        //     self.logical_assignment_operators.enter_expr(expr, ctx);
        // }
    }
}
