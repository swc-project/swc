use std::unreachable;

use crate::compress::optimize::is_pure_undefined;
use crate::util::ExprOptExt;

use super::Optimizer;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::undefined;
use swc_ecma_utils::StmtLike;

/// Methods related to the option `if_return`. All methods are noop if
/// `if_return` is false.
impl Optimizer {
    pub(super) fn optimize_if_returns<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        if !self.options.if_return || stmts.is_empty() {
            return;
        }

        {
            let start = stmts
                .iter()
                .position(|stmt| match stmt.as_stmt() {
                    Some(v) => self.can_merge_stmt_as_if_return(v),
                    None => false,
                })
                .unwrap_or(0);
            //
            let can_merge = stmts.iter().skip(start).all(|stmt| match stmt.as_stmt() {
                Some(s) => self.can_merge_stmt_as_if_return(s),
                _ => false,
            });
            if !can_merge {
                return;
            }
        }

        log::trace!("if_return: Merging returns");

        let mut cur: Option<Box<Expr>> = None;
        let mut new = Vec::with_capacity(stmts.len());

        for stmt in stmts.take() {
            let stmt = match stmt.try_into_stmt() {
                Ok(stmt) => {
                    if !self.can_merge_stmt_as_if_return(&stmt) {
                        debug_assert_eq!(cur, None);
                        new.push(T::from_stmt(stmt));
                        continue;
                    } else {
                        stmt
                    }
                }
                Err(item) => {
                    debug_assert_eq!(cur, None);
                    new.push(item);
                    continue;
                }
            };
            let new_expr = self.merge_if_returns_to(stmt, vec![]);
            match new_expr {
                Expr::Seq(v) => match &mut cur {
                    Some(cur) => match &mut **cur {
                        Expr::Cond(cur) => {
                            let seq = cur.alt.force_seq();
                            seq.exprs.extend(v.exprs);
                        }
                        Expr::Seq(cur) => {
                            cur.exprs.extend(v.exprs);
                        }
                        _ => {
                            unreachable!(
                                "if_return: cur must be one of None, Expr::Seq or Expr::Cond(with \
                                 alt Expr::Seq)"
                            )
                        }
                    },
                    None => cur = Some(Box::new(Expr::Seq(v))),
                },
                Expr::Cond(v) => match &mut cur {
                    Some(cur) => match &mut **cur {
                        Expr::Cond(cur) => {
                            let seq = cur.alt.force_seq();
                            seq.exprs.push(Box::new(Expr::Cond(v)));
                        }
                        Expr::Seq(cur) => {
                            cur.exprs.push(Box::new(Expr::Cond(v)));
                        }
                        _ => {
                            unreachable!(
                                "if_return: cur must be one of None, Expr::Seq or Expr::Cond(with \
                                 alt Expr::Seq)"
                            )
                        }
                    },
                    None => cur = Some(Box::new(Expr::Cond(v))),
                },
                _ => {
                    unreachable!(
                        "if_return: merge_if_returns_to should return one of None, Expr::Seq or \
                         Expr::Cond"
                    )
                }
            }
        }

        if let Some(mut cur) = cur {
            match &mut *cur {
                Expr::Seq(seq)
                    if seq
                        .exprs
                        .last()
                        .map(|v| is_pure_undefined(&v))
                        .unwrap_or(true) =>
                {
                    if seq
                        .exprs
                        .last()
                        .map(|v| is_pure_undefined(&v))
                        .unwrap_or(false)
                    {
                        seq.exprs.pop();
                    }

                    new.push(T::from_stmt(Stmt::Expr(ExprStmt {
                        span: DUMMY_SP,
                        expr: cur,
                    })))
                }
                _ => {
                    new.push(T::from_stmt(Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(cur),
                    })));
                }
            }
        }

        *stmts = new;
    }

    /// This method returns [Expr::Seq] or [Expr::Cond].
    ///
    /// `exprs` is a simple optimization.
    fn merge_if_returns_to(&mut self, stmt: Stmt, mut exprs: Vec<Box<Expr>>) -> Expr {
        //
        match stmt {
            Stmt::If(IfStmt {
                span,
                test,
                cons,
                alt,
                ..
            }) => {
                let cons = Box::new(self.merge_if_returns_to(*cons, vec![]));
                let alt = match alt {
                    Some(alt) => Box::new(self.merge_if_returns_to(*alt, vec![])),
                    None => undefined(DUMMY_SP),
                };

                exprs.push(test);

                Expr::Cond(CondExpr {
                    span,
                    test: Box::new(Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs,
                    })),
                    cons,
                    alt,
                })
            }
            Stmt::Expr(stmt) => {
                exprs.push(stmt.expr);
                exprs.push(undefined(DUMMY_SP));
                Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs,
                })
            }
            Stmt::Return(stmt) => {
                let span = stmt.span;
                exprs.push(stmt.arg.unwrap_or_else(|| undefined(span)));
                Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs,
                })
            }
            _ => unreachable!(),
        }
    }

    fn can_merge_stmt_as_if_return(&self, s: &Stmt) -> bool {
        match s {
            Stmt::Expr(..) | Stmt::Return(..) => true,
            Stmt::If(stmt) if self.options.conditionals => {
                self.can_merge_stmt_as_if_return(&stmt.cons)
                    && stmt
                        .alt
                        .as_deref()
                        .map(|s| self.can_merge_stmt_as_if_return(s))
                        .unwrap_or(true)
            }
            _ => false,
        }
    }
}
