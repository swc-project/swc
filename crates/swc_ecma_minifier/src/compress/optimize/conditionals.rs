use super::Optimizer;
use crate::{
    compress::{
        optimize::Ctx,
        util::{always_terminates, negate_cost},
    },
    mode::Mode,
    util::SpanExt,
    DISABLE_BUGGY_PASSES,
};
use std::mem::swap;
use swc_common::{util::take::Take, EqIgnoreSpan, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::ExprRefExt;
use swc_ecma_utils::{ident::IdentLike, ExprExt, ExprFactory, StmtLike};

/// Methods related to the option `conditionals`. All methods are noop if
/// `conditionals` is false.
impl<M> Optimizer<'_, M>
where
    M: Mode,
{
    /// Negates the condition of a `if` statement to reduce body size.
    pub(super) fn negate_if_stmt(&mut self, stmt: &mut IfStmt) {
        let alt = match stmt.alt.as_deref_mut() {
            Some(v) => v,
            _ => return,
        };

        match &*stmt.cons {
            Stmt::Return(..) | Stmt::Continue(ContinueStmt { label: None, .. }) => return,
            _ => {}
        }

        if negate_cost(&stmt.test, true, false).unwrap_or(isize::MAX) < 0 {
            self.changed = true;
            tracing::debug!("if_return: Negating `cond` of an if statement which has cons and alt");
            let ctx = Ctx {
                in_bool_ctx: true,
                ..self.ctx
            };
            self.with_ctx(ctx).negate(&mut stmt.test, false);
            swap(alt, &mut *stmt.cons);
            return;
        }

        match &*alt {
            Stmt::Return(..) | Stmt::Continue(ContinueStmt { label: None, .. }) => {
                self.changed = true;
                tracing::debug!(
                    "if_return: Negating an if statement because the alt is return / continue"
                );
                self.negate(&mut stmt.test, false);
                swap(alt, &mut *stmt.cons);
            }
            _ => return,
        }
    }
    /// This method may change return value.
    ///
    /// - `a ? b : false` => `a && b`
    pub(super) fn compress_cond_to_logical_ignoring_return_value(&mut self, e: &mut Expr) {
        let cond = match e {
            Expr::Cond(cond) => cond,
            _ => return,
        };

        if !cond.cons.may_have_side_effects() {
            self.changed = true;
            tracing::debug!("conditionals: `cond ? useless : alt` => `cond || alt`");
            *e = Expr::Bin(BinExpr {
                span: cond.span,
                op: op!("||"),
                left: cond.test.take(),
                right: cond.alt.take(),
            });
            return;
        }

        if !cond.alt.may_have_side_effects() {
            self.changed = true;
            tracing::debug!("conditionals: `cond ? cons : useless` => `cond && cons`");
            *e = Expr::Bin(BinExpr {
                span: cond.span,
                op: op!("&&"),
                left: cond.test.take(),
                right: cond.cons.take(),
            });
            return;
        }
    }

    ///
    /// # Example
    ///
    /// ## Input
    ///
    /// ```ts
    /// if (foo) return;
    /// if (bar) return;
    /// if (baz) return;
    /// if (baa) return;
    /// ```
    ///
    /// ## Output
    ///
    /// ```ts
    /// if (foo || bar || baz || baa) return;
    /// ```
    pub(super) fn merge_similar_ifs<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        if !self.options.conditionals {
            return;
        }

        let has_work =
            stmts
                .windows(2)
                .any(|stmts| match (&stmts[0].as_stmt(), &stmts[1].as_stmt()) {
                    (Some(Stmt::If(l)), Some(Stmt::If(r))) => l.cons.eq_ignore_span(&r.cons),
                    _ => false,
                });
        if !has_work {
            return;
        }

        self.changed = true;
        tracing::debug!("conditionals: Merging if statements with same `cons`");

        let mut cur: Option<IfStmt> = None;
        let mut new = Vec::with_capacity(stmts.len());
        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(stmt) => {
                    match stmt {
                        Stmt::If(mut stmt) => {
                            //

                            match &mut cur {
                                Some(cur_if) => {
                                    // If cons is same, we merge conditions.
                                    if cur_if.cons.eq_ignore_span(&stmt.cons) {
                                        cur_if.test = Box::new(Expr::Bin(BinExpr {
                                            span: DUMMY_SP,
                                            left: cur_if.test.take(),
                                            op: op!("||"),
                                            right: stmt.test.take(),
                                        }));
                                    } else {
                                        new.extend(cur.take().map(Stmt::If).map(T::from_stmt));
                                    }
                                }
                                None => {
                                    cur = Some(stmt);
                                }
                            }
                        }
                        _ => {
                            new.extend(cur.take().map(Stmt::If).map(T::from_stmt));

                            new.push(T::from_stmt(stmt));
                        }
                    }
                }
                Err(item) => {
                    new.extend(cur.take().map(Stmt::If).map(T::from_stmt));

                    new.push(item);
                }
            }
        }

        new.extend(cur.map(Stmt::If).map(T::from_stmt));

        *stmts = new;
    }

    ///
    /// # Examples
    ///
    /// ## Input
    ///
    /// ```ts
    /// function foo(do_something, some_condition) {
    ///     if (some_condition) do_something(x);
    ///     else do_something(y);
    ///     if (some_condition) side_effects(x);
    ///     else side_effects(y);
    /// }
    /// ```
    ///
    /// ## Output
    ///
    /// ```ts
    /// function foo(do_something, some_condition) {
    ///     do_something(some_condition ? x : y);
    ///     some_condition ? side_effects(x) : side_effects(y);
    /// }
    /// ```
    pub(super) fn compress_if_stmt_as_cond(&mut self, s: &mut Stmt) {
        let stmt = match s {
            Stmt::If(v) => v,
            _ => return,
        };

        match &*stmt.cons {
            Stmt::Empty(..) => {
                if self.options.conditionals || self.options.unused {
                    if stmt.alt.is_none() {
                        *s = Stmt::Expr(ExprStmt {
                            span: stmt.span,
                            expr: stmt.test.take(),
                        });
                        self.changed = true;
                        tracing::debug!("conditionals: `if (foo);` => `foo` ");
                        return;
                    }
                }
            }
            _ => {}
        }

        // If alt does not exist, an if statement is better than a conditional
        // expression.
        let alt = match &mut stmt.alt {
            Some(v) => &mut **v,
            None => {
                return;
            }
        };
        let alt = match extract_expr_stmt(alt) {
            Some(v) => v,
            None => return,
        };

        // if (!foo); else bar();
        // =>
        // foo && bar()
        match &*stmt.cons {
            Stmt::Empty(..) => {
                match &mut *stmt.test {
                    Expr::Unary(UnaryExpr {
                        op: op!("!"), arg, ..
                    }) => {
                        tracing::debug!("Optimizing `if (!foo); else bar();` as `foo && bar();`");

                        let mut expr = Box::new(Expr::Bin(BinExpr {
                            span: DUMMY_SP,
                            left: arg.take(),
                            op: op!("&&"),
                            right: Box::new(alt.take()),
                        }));
                        self.compress_logical_exprs_as_bang_bang(&mut expr, true);
                        *s = Stmt::Expr(ExprStmt {
                            span: stmt.span,
                            expr,
                        });
                    }
                    _ => {
                        tracing::debug!("Optimizing `if (foo); else bar();` as `foo || bar();`");

                        let mut expr = Box::new(Expr::Bin(BinExpr {
                            span: DUMMY_SP,
                            left: stmt.test.take(),
                            op: op!("||"),
                            right: Box::new(alt.take()),
                        }));
                        self.compress_logical_exprs_as_bang_bang(&mut expr, false);
                        *s = Stmt::Expr(ExprStmt {
                            span: stmt.span,
                            expr,
                        });
                    }
                }
                return;
            }
            _ => {}
        }

        let cons = match extract_expr_stmt(&mut *stmt.cons) {
            Some(v) => v,
            None => return,
        };

        let new_expr = self.compress_similar_cons_alt(&mut stmt.test, cons, alt, true);
        match new_expr {
            Some(v) => {
                self.changed = true;
                *s = Stmt::Expr(ExprStmt {
                    span: stmt.span,
                    expr: Box::new(v),
                });
                return;
            }
            None => {}
        }

        if self.options.conditionals || self.options.bools {
            // if (a) b(); else c(); => a ? b() : c()
            tracing::debug!(
                "Compressing if statement as conditional expression (even though cons and alt is \
                 not compressable)"
            );
            self.changed = true;
            *s = Stmt::Expr(ExprStmt {
                span: stmt.span.with_mark(self.done),
                expr: Box::new(Expr::Cond(CondExpr {
                    span: DUMMY_SP.with_ctxt(self.done_ctxt),
                    test: stmt.test.take(),
                    cons: Box::new(cons.take()),
                    alt: Box::new(alt.take()),
                })),
            })
        }
    }

    /// Compress a conditional expression if cons and alt is simillar
    pub(super) fn compress_cond_expr_if_similar(&mut self, e: &mut Expr) {
        let cond = match e {
            Expr::Cond(expr) => expr,
            _ => return,
        };

        let compressed =
            self.compress_similar_cons_alt(&mut cond.test, &mut cond.cons, &mut cond.alt, false);

        match compressed {
            Some(v) => {
                *e = v;
                self.changed = true;
                return;
            }
            None => {}
        }

        // x ? x : y => x || y
        if cond.test.is_ident() && cond.test.eq_ignore_span(&cond.cons) {
            tracing::debug!("Compressing `x ? x : y` as `x || y`");
            self.changed = true;
            *e = Expr::Bin(BinExpr {
                span: cond.span,
                op: op!("||"),
                left: cond.test.take(),
                right: cond.alt.take(),
            });
            return;
        }
    }

    fn compress_similar_cons_alt(
        &mut self,
        test: &mut Box<Expr>,
        cons: &mut Expr,
        alt: &mut Expr,
        is_for_if_stmt: bool,
    ) -> Option<Expr> {
        if cons.eq_ignore_span(alt)
            && match &*cons {
                Expr::Yield(..) | Expr::Fn(..) => false,
                _ => true,
            }
        {
            tracing::debug!("conditionals: cons is same as alt");
            return Some(Expr::Seq(SeqExpr {
                span: DUMMY_SP,
                exprs: vec![test.take(), Box::new(cons.take())],
            }));
        }

        match (cons, alt) {
            (Expr::Call(cons), Expr::Call(alt)) => {
                let cons_callee = cons.callee.as_expr().and_then(|e| e.as_ident())?;
                //

                if !cons.callee.eq_ignore_span(&alt.callee) {
                    return None;
                }

                let side_effect_free = self
                    .data
                    .as_ref()
                    .and_then(|data| data.vars.get(&cons_callee.to_id()))
                    .map(|v| v.is_fn_local && v.declared)
                    .unwrap_or(false);

                if side_effect_free
                    && cons.args.len() == alt.args.len()
                    && cons.args.iter().all(|arg| arg.spread.is_none())
                    && alt.args.iter().all(|arg| arg.spread.is_none())
                {
                    let diff_count = cons
                        .args
                        .iter()
                        .zip(alt.args.iter())
                        .filter(|(cons, alt)| !cons.eq_ignore_span(alt))
                        .count();

                    if diff_count == 1 {
                        tracing::debug!(
                            "conditionals: Merging cons and alt as only one argument differs"
                        );
                        self.changed = true;
                        let diff_idx = cons
                            .args
                            .iter()
                            .zip(alt.args.iter())
                            .position(|(cons, alt)| !cons.eq_ignore_span(alt))
                            .unwrap();

                        let mut new_args = vec![];

                        for (idx, arg) in cons.args.take().into_iter().enumerate() {
                            if idx == diff_idx {
                                // Inject conditional.
                                new_args.push(ExprOrSpread {
                                    spread: None,
                                    expr: Box::new(Expr::Cond(CondExpr {
                                        span: arg.expr.span(),
                                        test: test.take(),
                                        cons: arg.expr,
                                        alt: alt.args[idx].expr.take(),
                                    })),
                                })
                            } else {
                                //
                                new_args.push(arg)
                            }
                        }

                        return Some(Expr::Call(CallExpr {
                            span: test.span(),
                            callee: cons_callee.clone().as_callee(),
                            args: new_args,
                            type_args: Default::default(),
                        }));
                    }
                }

                if side_effect_free
                    && cons.args.len() == 1
                    && alt.args.len() == 1
                    && cons.args.iter().all(|arg| arg.spread.is_none())
                    && alt.args.iter().all(|arg| arg.spread.is_none())
                {
                    // if (some_condition) do_something(x);
                    // else do_something(y);
                    //
                    // =>
                    //
                    // do_something(some_condition ? x : y);
                    //

                    let mut args = vec![];

                    args.push(ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Cond(CondExpr {
                            span: DUMMY_SP,
                            test: test.take(),
                            cons: cons.args[0].expr.take(),
                            alt: alt.args[0].expr.take(),
                        })),
                    });

                    tracing::debug!(
                        "Compressing if into cond as there's no side effect and the number of \
                         arguments is 1"
                    );
                    return Some(Expr::Call(CallExpr {
                        span: DUMMY_SP.with_ctxt(self.done_ctxt),
                        callee: cons.callee.take(),
                        args,
                        type_args: Default::default(),
                    }));
                }

                if !side_effect_free && is_for_if_stmt {
                    tracing::debug!("Compressing if into cond while preserving side effects");
                    return Some(Expr::Cond(CondExpr {
                        span: DUMMY_SP.with_ctxt(self.done_ctxt),
                        test: test.take(),
                        cons: Box::new(Expr::Call(cons.take())),
                        alt: Box::new(Expr::Call(alt.take())),
                    }));
                }

                None
            }

            (Expr::New(cons), Expr::New(alt)) => {
                // TODO: Handle new expression with no args.

                if cons.callee.eq_ignore_span(&alt.callee) {
                    if cons.args.as_ref().map(|v| v.len() <= 1).unwrap_or(true)
                        && alt.args.as_ref().map(|v| v.len() <= 1).unwrap_or(true)
                        && cons.args.as_ref().map(|v| v.len()).unwrap_or(0)
                            == alt.args.as_ref().map(|v| v.len()).unwrap_or(0)
                        && (cons.args.is_some()
                            && cons
                                .args
                                .as_ref()
                                .unwrap()
                                .iter()
                                .all(|arg| arg.spread.is_none()))
                        && (alt.args.is_some()
                            && alt
                                .args
                                .as_ref()
                                .unwrap()
                                .iter()
                                .all(|arg| arg.spread.is_none()))
                    {
                        let mut args = vec![];

                        if cons.args.as_ref().map(|v| v.len()).unwrap_or(0) == 1 {
                            args.push(ExprOrSpread {
                                spread: None,
                                expr: Box::new(Expr::Cond(CondExpr {
                                    span: DUMMY_SP,
                                    test: test.take(),
                                    cons: cons.args.as_mut().unwrap()[0].expr.take(),
                                    alt: alt.args.as_mut().unwrap()[0].expr.take(),
                                })),
                            });
                        }

                        tracing::debug!(
                            "Compressing if statement into a conditional expression of `new` as \
                             there's no side effect and the number of arguments is 1"
                        );
                        return Some(Expr::New(NewExpr {
                            span: DUMMY_SP.with_ctxt(self.done_ctxt),
                            callee: cons.callee.take(),
                            args: Some(args),
                            type_args: Default::default(),
                        }));
                    }
                }

                None
            }

            (Expr::Assign(cons), Expr::Assign(alt))
                if cons.op == op!("=")
                    && cons.op == alt.op
                    && cons.left.eq_ignore_span(&alt.left)
                    && is_simple_lhs(&cons.left) =>
            {
                tracing::debug!("Merging assignments in cons and alt of if statement");
                Some(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: cons.op,
                    left: cons.left.take(),
                    right: Box::new(Expr::Cond(CondExpr {
                        span: DUMMY_SP,
                        test: test.take(),
                        cons: cons.right.take(),
                        alt: alt.right.take(),
                    })),
                }))
            }

            // a ? b ? c() : d() : d() => a && b ? c() : d()
            (Expr::Cond(cons), alt) if (*cons.alt).eq_ignore_span(&*alt) => {
                tracing::debug!("conditionals: a ? b ? c() : d() : d() => a && b ? c() : d()");
                return Some(Expr::Cond(CondExpr {
                    span: DUMMY_SP.with_ctxt(self.done_ctxt),
                    test: Box::new(Expr::Bin(BinExpr {
                        span: DUMMY_SP,
                        left: test.take(),
                        op: op!("&&"),
                        right: cons.test.take(),
                    })),
                    cons: cons.cons.take(),
                    alt: cons.alt.take(),
                }));
            }

            // z ? "fuji" : (condition(), "fuji");
            // =>
            // (z || condition(), "fuji");
            (cons, Expr::Seq(alt)) if (**alt.exprs.last().unwrap()).eq_ignore_span(&*cons) => {
                self.changed = true;
                tracing::debug!("conditionals: Reducing seq expr in alt");
                //
                alt.exprs.pop();
                let first = Box::new(Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    left: test.take(),
                    op: op!("||"),
                    right: Box::new(Expr::Seq(SeqExpr {
                        span: alt.span,
                        exprs: alt.exprs.take(),
                    })),
                }));
                return Some(Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs: vec![first, Box::new(cons.take())],
                }));
            }

            // z ? (condition(), "fuji") : "fuji"
            // =>
            // (z && condition(), "fuji");
            (Expr::Seq(cons), alt) if (**cons.exprs.last().unwrap()).eq_ignore_span(&*alt) => {
                self.changed = true;
                tracing::debug!("conditionals: Reducing seq expr in cons");
                //
                cons.exprs.pop();
                let first = Box::new(Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    left: test.take(),
                    op: op!("&&"),
                    right: Box::new(Expr::Seq(SeqExpr {
                        span: cons.span,
                        exprs: cons.exprs.take(),
                    })),
                }));
                return Some(Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs: vec![first, Box::new(alt.take())],
                }));
            }

            _ => None,
        }
    }

    /// Currently disabled.
    pub(super) fn inject_else(&mut self, stmts: &mut Vec<Stmt>) {
        if DISABLE_BUGGY_PASSES {
            return;
        }

        let len = stmts.len();

        let pos_of_if = stmts.iter().enumerate().rposition(|(idx, s)| {
            idx != len - 1
                && match s {
                    Stmt::If(IfStmt {
                        cons, alt: None, ..
                    }) => match &**cons {
                        Stmt::Block(b) => {
                            b.stmts.len() == 2
                                && match b.stmts.first() {
                                    Some(Stmt::If(..) | Stmt::Expr(..)) => false,
                                    _ => true,
                                }
                                && match b.stmts.last() {
                                    Some(Stmt::Return(ReturnStmt { arg: None, .. })) => true,
                                    _ => false,
                                }
                        }
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
        tracing::debug!("if_return: Injecting else because it's shorter");

        let mut new = vec![];
        new.reserve(pos_of_if + 1);
        new.extend(stmts.drain(..pos_of_if));
        let alt = stmts.drain(1..).collect::<Vec<_>>();

        let if_stmt = stmts.take().into_iter().next().unwrap();
        match if_stmt {
            Stmt::If(mut s) => {
                match &mut *s.cons {
                    Stmt::Block(cons) => {
                        cons.stmts.pop();
                    }
                    _ => {
                        unreachable!()
                    }
                }

                assert_eq!(s.alt, None);

                s.alt = Some(if alt.len() == 1 {
                    Box::new(alt.into_iter().next().unwrap())
                } else {
                    Box::new(Stmt::Block(BlockStmt {
                        span: DUMMY_SP,
                        stmts: alt,
                    }))
                });

                new.push(Stmt::If(s))
            }
            _ => {
                unreachable!()
            }
        }

        *stmts = new;
    }

    /// if (foo) return bar()
    /// else baz()
    ///
    /// `else` token can be removed from the code above.
    pub(super) fn drop_else_token<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike,
    {
        // Find an if statement with else token.
        let need_work = stmts.iter().any(|stmt| match stmt.as_stmt() {
            Some(Stmt::If(IfStmt {
                cons,
                alt: Some(..),
                ..
            })) => always_terminates(cons),
            _ => false,
        });
        if !need_work {
            return;
        }
        //

        let mut new_stmts = vec![];

        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(stmt) => match stmt {
                    Stmt::If(IfStmt {
                        span,
                        test,
                        cons,
                        alt: Some(alt),
                        ..
                    }) if always_terminates(&cons) => {
                        new_stmts.push(T::from_stmt(Stmt::If(IfStmt {
                            span,
                            test,
                            cons,
                            alt: None,
                        })));
                        new_stmts.push(T::from_stmt(*alt));
                    }
                    _ => {
                        new_stmts.push(T::from_stmt(stmt));
                    }
                },
                Err(stmt) => new_stmts.push(stmt),
            }
        }

        self.changed = true;
        tracing::debug!("conditionals: Dropped useless `else` token");
        *stmts = new_stmts;
    }
}

fn extract_expr_stmt(s: &mut Stmt) -> Option<&mut Expr> {
    match s {
        Stmt::Expr(e) => Some(&mut *e.expr),
        _ => None,
    }
}

fn is_simple_lhs(l: &PatOrExpr) -> bool {
    match l {
        PatOrExpr::Expr(l) => match &**l {
            Expr::Ident(..) => return true,
            _ => false,
        },
        PatOrExpr::Pat(l) => match &**l {
            Pat::Ident(_) => return true,
            Pat::Expr(e) => match &**e {
                Expr::Ident(..) => return true,
                _ => false,
            },
            _ => false,
        },
    }
}
