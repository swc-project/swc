use super::Optimizer;
use crate::compress::optimize::is_pure_undefined;
use crate::util::ExprOptExt;
use std::fmt;
use std::mem::swap;
use swc_common::Spanned;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::undefined;
use swc_ecma_utils::StmtLike;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitWith;

/// Methods related to the option `if_return`. All methods are noop if
/// `if_return` is false.
impl Optimizer<'_> {
    pub(super) fn drop_undefined_from_return_arg(&mut self, s: &mut ReturnStmt) {
        match s.arg.as_deref() {
            Some(e) => {
                if is_pure_undefined(e) {
                    self.changed = true;
                    log::trace!("Dropped `undefined` from `return undefined`");
                    s.arg.take();
                }
            }
            None => {}
        }
    }

    pub(super) fn negate_if_else(&mut self, stmt: &mut IfStmt) {
        let alt = match stmt.alt.as_deref_mut() {
            Some(v) => v,
            _ => return,
        };

        let test_arg = match &mut *stmt.test {
            Expr::Unary(UnaryExpr {
                op: op!("!"), arg, ..
            }) => &mut **arg,
            _ => return,
        };

        self.changed = true;
        log::trace!(
            "if_return: Negating `!cond` as `cond` in for an if statement which has cons and alt"
        );
        stmt.test = Box::new(test_arg.take());
        swap(alt, &mut *stmt.cons);
    }

    /// # Input
    ///
    /// ```js
    /// function f(a, b) {
    ///     if (a) return;
    ///     console.log(b);
    /// }
    /// ```
    ///
    /// # Output
    /// ```js
    /// function f(a, b) {
    ///     if (!a)
    ///         console.log(b);
    /// }
    /// ```
    pub(super) fn negate_if_terminate(&mut self, stmts: &mut Vec<Stmt>) {
        let len = stmts.len();

        let pos_of_if = stmts.iter().enumerate().rposition(|(idx, s)| {
            idx != len - 1
                && match s {
                    Stmt::If(IfStmt {
                        cons, alt: None, ..
                    }) => match &**cons {
                        Stmt::Return(ReturnStmt { arg: None, .. }) => true,

                        // TODO(kdy1): Verify if this is correct.
                        Stmt::Continue(ContinueStmt { label: None, .. }) => true,
                        _ => false,
                    },
                    _ => false,
                }
        });

        let pos_of_if = match pos_of_if {
            Some(v) => v,
            _ => return,
        };

        self.changed = true;
        log::trace!(
            "if_return: Negating `foo` in `if (foo) return; bar()` to make it `if (!foo) bar()`"
        );

        let mut new = vec![];
        new.extend(stmts.drain(..pos_of_if));
        let cons = stmts.drain(1..).collect::<Vec<_>>();

        let if_stmt = stmts.take().into_iter().next().unwrap();
        match if_stmt
            .try_into_stmt()
            .expect("first value must be an if statement")
        {
            Stmt::If(mut s) => {
                assert_eq!(s.alt, None);
                self.negate(&mut s.test);

                s.cons = if cons.len() == 1 {
                    Box::new(cons.into_iter().next().unwrap())
                } else {
                    Box::new(Stmt::Block(BlockStmt {
                        span: DUMMY_SP,
                        stmts: cons,
                    }))
                };

                new.push(Stmt::If(s))
            }
            _ => {
                unreachable!()
            }
        }

        *stmts = new;
    }

    pub(super) fn merge_nested_if(&mut self, s: &mut IfStmt) {
        if s.alt.is_some() {
            return;
        }

        match &mut *s.cons {
            Stmt::If(IfStmt {
                test,
                cons,
                alt: None,
                ..
            }) => {
                self.changed = true;
                log::trace!("if_return: Merging nested if statements");

                s.test = Box::new(Expr::Bin(BinExpr {
                    span: s.test.span(),
                    op: op!("&&"),
                    left: s.test.take(),
                    right: test.take(),
                }));
                s.cons = cons.take();
            }
            _ => {}
        }
    }

    /// Merge simple return statements in if statements.
    ///
    /// # Example
    ///
    /// ## Input
    ///
    /// ```js
    /// function foo() {
    ///     if (a) return foo();
    ///     return bar()
    /// }
    /// ```
    ///
    /// ## Output
    ///
    /// ```js
    /// function foo() {
    ///     return a ? foo() : bar();
    /// }
    /// ```
    pub(super) fn merge_if_returns<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + fmt::Debug,
        Vec<T>: VisitWith<ReturnFinder>,
    {
        if !self.options.if_return || stmts.len() <= 1 {
            return;
        }

        {
            let return_count = count_leaping_returns(&*stmts);

            // There's no return statment so merging requires injecting unnecessary `void 0`
            if return_count == 0 {
                return;
            }

            let may_need_work = stmts
                .last()
                .map(|stmt| match stmt.as_stmt() {
                    Some(Stmt::If(..)) => true,
                    _ => false,
                })
                .unwrap();

            // TODO: Find correct condition

            if return_count == 1 {
                return;
            }
        }

        let idx_of_not_mergable = stmts.iter().rposition(|stmt| match stmt.as_stmt() {
            Some(v) => !self.can_merge_stmt_as_if_return(v),
            None => true,
        });

        {
            let skip = idx_of_not_mergable.map(|v| v + 1).unwrap_or(0);

            let start = stmts
                .iter()
                .skip(skip)
                .position(|stmt| match stmt.as_stmt() {
                    Some(v) => self.can_merge_stmt_as_if_return(v),
                    None => false,
                })
                .unwrap_or(0);

            let ends_with_mergable = stmts
                .last()
                .map(|stmt| match stmt.as_stmt() {
                    Some(Stmt::Return(..) | Stmt::Expr(..)) => true,
                    _ => false,
                })
                .unwrap();

            if stmts.len() == start + skip + 1 || !ends_with_mergable {
                return;
            }

            let can_merge = stmts.iter().skip(skip).all(|stmt| match stmt.as_stmt() {
                Some(s) => self.can_merge_stmt_as_if_return(s),
                _ => false,
            });
            if !can_merge {
                return;
            }
        }

        log::trace!("if_return: Merging returns");
        self.changed = true;

        let mut cur: Option<Box<Expr>> = None;
        let mut new = Vec::with_capacity(stmts.len());

        for (idx, stmt) in stmts.take().into_iter().enumerate() {
            if let Some(not_mergable) = idx_of_not_mergable {
                if idx < not_mergable {
                    new.push(stmt);
                    continue;
                }
            }

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
            let is_nonconditional_return = match stmt {
                Stmt::Return(..) => true,
                _ => false,
            };
            let new_expr = self.merge_if_returns_to(stmt, vec![]);
            match new_expr {
                Expr::Seq(v) => match &mut cur {
                    Some(cur) => match &mut **cur {
                        Expr::Cond(cur) => {
                            let seq = get_rightmost_alt_of_cond(cur).force_seq();
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
                            let alt = get_rightmost_alt_of_cond(cur);

                            let (span, exprs) = {
                                let prev_seq = alt.force_seq();
                                prev_seq.exprs.push(v.test);
                                let exprs = prev_seq.exprs.take();

                                (prev_seq.span, exprs)
                            };

                            *alt = Expr::Cond(CondExpr {
                                span: DUMMY_SP,
                                test: Box::new(Expr::Seq(SeqExpr { span, exprs })),
                                cons: v.cons,
                                alt: v.alt,
                            });
                        }
                        Expr::Seq(prev_seq) => {
                            prev_seq.exprs.push(v.test);
                            let exprs = prev_seq.exprs.take();

                            *cur = Box::new(Expr::Cond(CondExpr {
                                span: DUMMY_SP,
                                test: Box::new(Expr::Seq(SeqExpr {
                                    span: prev_seq.span,
                                    exprs,
                                })),
                                cons: v.cons,
                                alt: v.alt,
                            }));
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

            if is_nonconditional_return {
                break;
            }
        }

        if let Some(mut cur) = cur {
            match &*cur {
                Expr::Seq(seq)
                    if seq
                        .exprs
                        .last()
                        .map(|v| is_pure_undefined(&v))
                        .unwrap_or(true) =>
                {
                    let expr = self.ignore_return_value(&mut cur);

                    if let Some(cur) = expr {
                        new.push(T::from_stmt(Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr: Box::new(cur),
                        })))
                    }
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
                exprs.push(Box::new(Expr::Unary(UnaryExpr {
                    span: DUMMY_SP,
                    op: op!("void"),
                    arg: stmt.expr,
                })));
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
            Stmt::If(stmt) => {
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

fn get_rightmost_alt_of_cond(e: &mut CondExpr) -> &mut Expr {
    match &mut *e.alt {
        Expr::Cond(alt) => get_rightmost_alt_of_cond(alt),
        alt => alt,
    }
}

fn count_leaping_returns<N>(n: &N) -> usize
where
    N: VisitWith<ReturnFinder>,
{
    let mut v = ReturnFinder::default();
    n.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
    v.count
}

#[derive(Default)]
pub(super) struct ReturnFinder {
    count: usize,
}

impl Visit for ReturnFinder {
    noop_visit_type!();

    fn visit_return_stmt(&mut self, n: &ReturnStmt, _: &dyn Node) {
        n.visit_children_with(self);
        self.count += 1;
    }

    fn visit_function(&mut self, _: &Function, _: &dyn Node) {}
    fn visit_arrow_expr(&mut self, _: &ArrowExpr, _: &dyn Node) {}
}
