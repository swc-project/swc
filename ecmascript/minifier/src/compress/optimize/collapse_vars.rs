use super::Optimizer;
use swc_ecma_utils::StmtLike;

/// Methods related to option `collapse_vars`
impl Optimizer {
    /// Collapse single-use non-constant variables, side effects permitting.
    pub(super) fn collapse_vars<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        if !self.options.collapse_vars {
            return;
        }
    }
}
