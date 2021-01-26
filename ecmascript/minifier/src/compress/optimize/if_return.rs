use std::unreachable;

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
                    Some(v) => can_merge_stmt(v),
                    None => false,
                })
                .unwrap_or(0);
            //
            let can_merge = stmts.iter().skip(start).all(|stmt| match stmt.as_stmt() {
                Some(s) => can_merge_stmt(s),
                _ => false,
            }) && false;
            if !can_merge {
                return;
            }
        }

        log::trace!("if_return: Merging returns");

        let mut cur: Option<Box<Expr>> = None;
        let mut new = Vec::with_capacity(stmts.len());
        let mut iter = stmts.take().into_iter();
        let mut is_undefined_required = false;

        while iter.len() != 0 {
            let stmt = iter.next().unwrap();

            let stmt = match stmt.try_into_stmt() {
                Ok(stmt) => {
                    if !can_merge_stmt(&stmt) {
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
            let new_expr = self.merge_if_returns_to(stmt, vec![], &mut new, &mut iter);
            match new_expr {
                Expr::Seq(v) => match &mut cur {
                    Some(cur) => {
                        is_undefined_required = true;
                        match &mut **cur {
                            Expr::Cond(cur) => {
                                let seq = cur.alt.force_seq();
                                seq.exprs.extend(v.exprs);
                            }
                            Expr::Seq(cur) => {
                                cur.exprs.extend(v.exprs);
                            }
                            _ => {
                                unreachable!(
                                    "if_return: cur must be one of None, Expr::Seq or \
                                     Expr::Cond(with alt Expr::Seq)"
                                )
                            }
                        }
                    }
                    None => cur = Some(Box::new(Expr::Seq(v))),
                },
                Expr::Cond(v) => {
                    is_undefined_required = false;
                    match &mut cur {
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
                                    "if_return: cur must be one of None, Expr::Seq or \
                                     Expr::Cond(with alt Expr::Seq)"
                                )
                            }
                        },
                        None => cur = Some(Box::new(Expr::Cond(v))),
                    }
                }
                _ => {
                    unreachable!(
                        "if_return: merge_if_returns_to should return one of None, Expr::Seq or \
                         Expr::Cond"
                    )
                }
            }
        }

        *stmts = new;
    }

    /// This method returns one of [None], [Expr::Seq] or [Expr::Cond].
    fn merge_if_returns_to<T>(
        &mut self,
        stmt: Stmt,
        exprs: Vec<Box<Expr>>,
        new: &mut Vec<T>,
        next: &mut std::vec::IntoIter<T>,
    ) -> Expr
    where
        T: StmtLike,
    {
        //
        match stmt {
            Stmt::If(IfStmt {
                span,
                test,
                cons,
                alt,
                ..
            }) => {
                let cons = Box::new(self.merge_if_returns_to(*cons, vec![], new, next));
                let alt = match alt {
                    Some(alt) => Box::new(self.merge_if_returns_to(*alt, vec![], new, next)),
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
                let mut expr = stmt.expr.take();
                if next.len() == 0 {
                    return Expr::Seq(SeqExpr {
                        span: DUMMY_SP,
                        exprs,
                    });
                }

                let stmt = next.next().unwrap();
                let stmt = stmt.try_into_stmt().ok().unwrap();
                debug_assert!(can_merge_stmt(&stmt));

                self.merge_if_returns_to(stmt, exprs, new, next)
            }
            Stmt::Return(expr) => {}
            _ => unreachable!(),
        }
    }
}

fn can_merge_stmt(s: &Stmt) -> bool {
    match s {
        Stmt::Expr(..) | Stmt::Return(..) => true,
        Stmt::If(stmt) => {
            can_merge_stmt(&stmt.cons) && stmt.alt.as_deref().map(can_merge_stmt).unwrap_or(true)
        }
        _ => false,
    }
}
