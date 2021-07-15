use swc_ecma_utils::StmtLike;

use super::Optimizer;

impl Optimizer<'_> {
    pub(super) fn reorder_stmts<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
    }
}
