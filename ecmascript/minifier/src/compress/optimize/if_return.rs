use super::Optimizer;
use crate::{
    compress::{optimize::Ctx, util::is_pure_undefined},
    debug::dump,
    mode::Mode,
    util::ExprOptExt,
};
use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::{prepend, undefined, StmtLike};
use swc_ecma_visit::{noop_visit_type, Node, Visit, VisitWith};

/// Methods related to the option `if_return`. All methods are noop if
/// `if_return` is false.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
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
    pub(super) fn negate_if_terminate(
        &mut self,
        stmts: &mut Vec<Stmt>,
        handle_return: bool,
        handle_continue: bool,
    ) {
        if handle_return {
            if !self.options.if_return || !self.options.bools {
                return;
            }

            for s in stmts.iter_mut() {
                match s {
                    Stmt::If(s) => match &mut *s.cons {
                        Stmt::Block(cons) => {
                            self.negate_if_terminate(&mut cons.stmts, true, false);
                        }
                        _ => {}
                    },
                    _ => {}
                }
            }
        }

        let len = stmts.len();

        let pos_of_if = stmts.iter().enumerate().rposition(|(idx, s)| {
            idx != len - 1
                && match s {
                    Stmt::If(IfStmt {
                        cons, alt: None, ..
                    }) => match &**cons {
                        Stmt::Return(ReturnStmt { arg: None, .. }) => handle_return,

                        Stmt::Continue(ContinueStmt { label: None, .. }) => handle_continue,
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
        log::debug!(
            "if_return: Negating `foo` in `if (foo) return; bar()` to make it `if (!foo) bar()`"
        );

        let mut new = vec![];
        new.extend(stmts.drain(..pos_of_if));
        let cons = stmts.drain(1..).collect::<Vec<_>>();

        let if_stmt = stmts.take().into_iter().next().unwrap();
        match if_stmt {
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
        if !self.options.conditionals && !self.options.bools {
            return;
        }

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
                log::debug!("if_return: Merging nested if statements");

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

    pub(super) fn merge_else_if(&mut self, s: &mut IfStmt) {
        match s.alt.as_deref_mut() {
            Some(Stmt::If(IfStmt {
                span: span_of_alt,
                test: test_of_alt,
                cons: cons_of_alt,
                alt: Some(alt_of_alt),
                ..
            })) => {
                match &**cons_of_alt {
                    Stmt::Return(..) | Stmt::Continue(ContinueStmt { label: None, .. }) => {}
                    _ => return,
                }

                match &mut **alt_of_alt {
                    Stmt::Block(..) => {}
                    Stmt::Expr(..) => {
                        *alt_of_alt = Box::new(Stmt::Block(BlockStmt {
                            span: DUMMY_SP,
                            stmts: vec![*alt_of_alt.take()],
                        }));
                    }
                    _ => {
                        return;
                    }
                }

                self.changed = true;
                log::debug!("if_return: Merging `else if` into `else`");

                match &mut **alt_of_alt {
                    Stmt::Block(alt_of_alt) => {
                        prepend(
                            &mut alt_of_alt.stmts,
                            Stmt::If(IfStmt {
                                span: *span_of_alt,
                                test: test_of_alt.take(),
                                cons: cons_of_alt.take(),
                                alt: None,
                            }),
                        );
                    }

                    _ => {
                        unreachable!()
                    }
                }

                s.alt = Some(alt_of_alt.take());
                return;
            }

            _ => {}
        }
    }

    fn merge_nested_if_returns(&mut self, s: &mut Stmt) {
        match s {
            Stmt::Block(s) => self.merge_if_returns(&mut s.stmts),
            Stmt::If(s) => {
                self.merge_nested_if_returns(&mut s.cons);

                if let Some(alt) = &mut s.alt {
                    self.merge_nested_if_returns(&mut **alt);
                }
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
    pub(super) fn merge_if_returns(&mut self, stmts: &mut Vec<Stmt>) {
        if !self.options.if_return {
            return;
        }

        for stmt in stmts.iter_mut() {
            let ctx = Ctx {
                is_nested_if_return_merging: true,
                ..self.ctx
            };
            self.with_ctx(ctx).merge_nested_if_returns(stmt)
        }

        if stmts.len() <= 1 {
            return;
        }

        let idx_of_not_mergable = stmts.iter().rposition(|stmt| match stmt.as_stmt() {
            Some(v) => !self.can_merge_stmt_as_if_return(v),
            None => true,
        });
        let skip = idx_of_not_mergable.map(|v| v + 1).unwrap_or(0);
        log::trace!("if_return: Skip = {}", skip);

        if stmts.len() <= skip + 1 {
            log::trace!("if_return: [x] Aborting because of skip");
            return;
        }

        {
            let stmts = &stmts[skip..];
            let return_count: usize = stmts.iter().map(|v| count_leaping_returns(v)).sum();

            // There's no return statment so merging requires injecting unnecessary `void 0`
            if return_count == 0 {
                log::trace!("if_return: [x] Aborting because we failed to find return");
                return;
            }

            // If the last statement is a return statement and last - 1 is an if statement
            // is without return, we don't need to fold it as `void 0` is too much for such
            // cases.

            let if_return_count = stmts
                .iter()
                .filter(|s| match s {
                    Stmt::If(IfStmt {
                        cons, alt: None, ..
                    }) => always_terminates_with_return_arg(&cons),
                    _ => false,
                })
                .count();

            if stmts.len() >= 2 {
                match (
                    &stmts[stmts.len() - 2].as_stmt(),
                    &stmts[stmts.len() - 1].as_stmt(),
                ) {
                    (_, Some(Stmt::If(IfStmt { alt: None, .. }) | Stmt::Expr(..)))
                        if if_return_count <= 1 =>
                    {
                        log::trace!(
                            "if_return: [x] Aborting because last stmt is a not return stmt"
                        );
                        return;
                    }

                    (
                        Some(Stmt::If(IfStmt {
                            cons, alt: None, ..
                        })),
                        Some(Stmt::Return(..)),
                    ) => match &**cons {
                        Stmt::Return(ReturnStmt { arg: Some(..), .. }) => {}
                        _ => {
                            log::trace!(
                                "if_return: [x] Aborting because stmt before last is an if stmt \
                                 and cons of it is not a return stmt"
                            );
                            return;
                        }
                    },

                    _ => {}
                }
            }
        }

        {
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
                    Some(Stmt::If(IfStmt { alt: None, .. }))
                        if self.ctx.is_nested_if_return_merging =>
                    {
                        false
                    }
                    Some(s) => self.can_merge_stmt_as_if_return(s),
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

        log::debug!("if_return: Merging returns");
        if cfg!(feature = "debug") {
            let block = BlockStmt {
                span: DUMMY_SP,
                stmts: stmts.clone(),
            };
            log::trace!("if_return: {}", dump(&block))
        }
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

            let stmt = if !self.can_merge_stmt_as_if_return(&stmt) {
                debug_assert_eq!(cur, None);
                new.push(stmt);
                continue;
            } else {
                stmt
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
                        new.push(Stmt::Expr(ExprStmt {
                            span: DUMMY_SP,
                            expr: Box::new(cur),
                        }))
                    }
                }
                _ => {
                    new.push(Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(cur),
                    }));
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
            Stmt::Block(s) => {
                assert_eq!(s.stmts.len(), 1);
                self.merge_if_returns_to(s.stmts.into_iter().next().unwrap(), exprs)
            }

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
        let res = match s {
            Stmt::Expr(..) | Stmt::Return(..) => true,
            Stmt::Block(s) => s.stmts.len() == 1 && self.can_merge_stmt_as_if_return(&s.stmts[0]),
            Stmt::If(stmt) => {
                self.can_merge_stmt_as_if_return(&stmt.cons)
                    && stmt
                        .alt
                        .as_deref()
                        .map(|s| self.can_merge_stmt_as_if_return(s))
                        .unwrap_or(true)
            }
            _ => false,
        };
        // if !res {
        //     log::trace!("Cannot merge: {}", dump(s));
        // }

        res
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

fn always_terminates_with_return_arg(s: &Stmt) -> bool {
    match s {
        Stmt::Return(ReturnStmt { arg: Some(..), .. }) => true,
        Stmt::If(IfStmt { cons, alt, .. }) => {
            always_terminates_with_return_arg(&cons)
                && alt
                    .as_deref()
                    .map(always_terminates_with_return_arg)
                    .unwrap_or(false)
        }
        Stmt::Block(s) => s.stmts.iter().any(always_terminates_with_return_arg),

        _ => false,
    }
}
