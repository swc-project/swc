use super::Optimizer;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;

/// Methods related to the option `arrows`.
impl Optimizer<'_> {
    pub(super) fn optimize_arrow_body(&mut self, b: &mut BlockStmtOrExpr) {
        if !self.options.arrows {
            return;
        }

        match b {
            BlockStmtOrExpr::BlockStmt(s) => {
                if s.stmts.len() == 1 {
                    if let Stmt::Return(s) = &mut s.stmts[0] {
                        if let Some(arg) = &mut s.arg {
                            log::debug!("arrows: Optimizing the body of an arrow");
                            *b = BlockStmtOrExpr::Expr(arg.take());
                            return;
                        }
                    }
                }
            }
            BlockStmtOrExpr::Expr(_) => {}
        }
    }
}
