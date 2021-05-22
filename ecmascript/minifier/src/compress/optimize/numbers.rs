use crate::compress::optimize::Optimizer;
use swc_ecma_ast::*;

impl Optimizer<'_> {
    pub(super) fn optimize_expr_in_num_ctx(&mut self, e: &mut Expr) {}
}
