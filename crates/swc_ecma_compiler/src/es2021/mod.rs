use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::context::TraverseCtx;

mod logical_assignment_operators;
mod options;

pub use logical_assignment_operators::LogicalAssignmentOperators;
pub use options::ES2021Options;

pub struct ES2021 {
    options: ES2021Options,

    // Plugins
    logical_assignment_operators: LogicalAssignmentOperators,
}

impl ES2021 {
    pub fn new(options: ES2021Options) -> Self {
        Self {
            logical_assignment_operators: LogicalAssignmentOperators::new(),
            options,
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for ES2021 {
    fn enter_expr(&mut self, _expr: &mut Expr, _ctx: &mut TraverseCtx) {
        // TODO: Delegate to logical_assignment_operators when enabled
        // if self.options.logical_assignment_operators {
        //     self.logical_assignment_operators.enter_expr(expr, ctx);
        // }
    }
}
