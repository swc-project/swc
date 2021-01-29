use super::Optimizer;
use swc_ecma_utils::StmtLike;

/// Methods related to option `join_vars`.
impl Optimizer {
    pub(super) fn join_vars<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
    }
}
