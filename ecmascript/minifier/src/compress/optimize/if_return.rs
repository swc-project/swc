use super::Optimizer;
use swc_ecma_utils::StmtLike;

/// Methods related to the option `if_return`. All methods are noop if
/// `if_return` is false.
impl Optimizer {
    pub(super) fn optimize_if_returns<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        if !self.options.if_return {
            return;
        }
    }
}
