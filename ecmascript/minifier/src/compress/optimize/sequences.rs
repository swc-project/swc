use super::Optimizer;
use crate::util::ExprOptExt;
use std::mem::take;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::StmtLike;

/// Methods related to the option `sequences`. All methods are noop if
/// `sequences` is false.
impl Optimizer {
    ///
    /// # Exmaple
    ///
    ///
    /// ## Input
    ///
    /// ```ts
    /// x = 5;
    /// if (y) z();
    /// x = 5;
    /// for (i = 0; i < 5; i++) console.log(i);
    /// x = 5;
    /// for (; i < 5; i++) console.log(i);
    /// x = 5;
    /// switch (y) {
    /// }
    /// x = 5;
    /// with (obj) {
    /// }
    /// ```
    ///
    /// ## Output
    /// ```ts
    /// if (x = 5, y) z();
    /// for(x = 5, i = 0; i < 5; i++)console.log(i);
    /// for(x = 5; i < 5; i++)console.log(i);
    /// switch(x = 5, y){
    /// }
    /// with (x = 5, obj);
    /// ```
    pub(super) fn make_sequences<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        if !self.options.sequences {
            return;
        }

        let can_work =
            stmts
                .windows(2)
                .any(|stmts| match (stmts[0].as_stmt(), stmts[1].as_stmt()) {
                    (Some(Stmt::Expr(..)), Some(r)) => match r {
                        Stmt::Expr(..)
                        | Stmt::If(..)
                        | Stmt::For(ForStmt { init: None, .. })
                        | Stmt::For(ForStmt {
                            init: Some(VarDeclOrExpr::Expr(..)),
                            ..
                        }) => true,
                        _ => false,
                    },
                    _ => false,
                });

        if !can_work {
            return;
        }
        log::trace!("sequences: Compressing statements as a sequences");

        self.changed = true;
        let mut exprs = vec![];
        // This is bigger than required.
        let mut new_stmts = Vec::with_capacity(stmts.len());

        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(stmt) => {
                    // If
                    match stmt {
                        Stmt::Expr(stmt) => {
                            exprs.push(stmt.expr);
                        }

                        Stmt::If(mut stmt) => {
                            stmt.test.prepend_exprs(take(&mut exprs));
                            new_stmts.push(T::from_stmt(Stmt::If(stmt)));
                        }

                        Stmt::For(mut stmt @ ForStmt { init: None, .. })
                        | Stmt::For(
                            mut
                            stmt
                            @
                            ForStmt {
                                init: Some(VarDeclOrExpr::Expr(..)),
                                ..
                            },
                        ) => {
                            match &mut stmt.init {
                                Some(VarDeclOrExpr::Expr(e)) => {
                                    e.prepend_exprs(take(&mut exprs));
                                }
                                None => {
                                    stmt.init =
                                        Some(VarDeclOrExpr::Expr(Box::new(Expr::Seq(SeqExpr {
                                            span: DUMMY_SP,
                                            exprs: take(&mut exprs),
                                        }))))
                                }
                                _ => {
                                    unreachable!()
                                }
                            }
                            new_stmts.push(T::from_stmt(Stmt::For(stmt)));
                        }

                        _ => {
                            if !exprs.is_empty() {
                                new_stmts.push(T::from_stmt(Stmt::Expr(ExprStmt {
                                    span: DUMMY_SP,
                                    expr: Box::new(Expr::Seq(SeqExpr {
                                        span: DUMMY_SP,
                                        exprs: take(&mut exprs),
                                    })),
                                })))
                            }

                            new_stmts.push(T::from_stmt(stmt));
                        }
                    }
                }
                Err(item) => {
                    if !exprs.is_empty() {
                        new_stmts.push(T::from_stmt(Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr: Box::new(Expr::Seq(SeqExpr {
                                span: DUMMY_SP,
                                exprs: take(&mut exprs),
                            })),
                        })))
                    }

                    new_stmts.push(item);
                }
            }
        }

        if !exprs.is_empty() {
            new_stmts.push(T::from_stmt(Stmt::Expr(ExprStmt {
                span: DUMMY_SP,
                expr: Box::new(Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs: take(&mut exprs),
                })),
            })))
        }

        *stmts = new_stmts;
    }
}
