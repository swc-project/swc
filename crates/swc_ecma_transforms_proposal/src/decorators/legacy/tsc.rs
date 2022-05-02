use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::{VisitMut, VisitMutWith};

pub struct TscDecorator {
    appended_exprs: Vec<Box<Expr>>,
}

impl TscDecorator {
    fn visit_mut_stmt_likes<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + VisitMutWith<Self>,
    {
        let old_appended_exprs = self.appended_exprs.take();

        let mut new = vec![];

        for mut s in stmts.take() {
            debug_assert!(self.appended_exprs.is_empty());

            s.visit_mut_with(self);

            new.push(s);

            if !self.appended_exprs.is_empty() {
                let expr = if self.appended_exprs.len() == 1 {
                    self.appended_exprs.pop().unwrap()
                } else {
                    Box::new(Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs: self.appended_exprs.drain(..).collect(),
                    }))
                };

                new.push(T::from_stmt(Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr,
                })))
            }
        }

        *stmts = new;

        self.appended_exprs = old_appended_exprs;
    }
}

impl VisitMut for TscDecorator {
    fn visit_mut_module_items(&mut self, s: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_likes(s)
    }

    fn visit_mut_stmts(&mut self, s: &mut Vec<Stmt>) {
        self.visit_mut_stmt_likes(s)
    }
}
