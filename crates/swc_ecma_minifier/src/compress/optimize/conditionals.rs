use std::mem::swap;

use swc_common::{util::take::Take, EqIgnoreSpan, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::ExprRefExt;
use swc_ecma_transforms_optimization::debug_assert_valid;
use swc_ecma_utils::{ExprExt, ExprFactory, IdentUsageFinder, StmtExt, StmtLike};

use super::Optimizer;
use crate::{
    compress::{
        optimize::Ctx,
        util::{negate, negate_cost},
    },
    DISABLE_BUGGY_PASSES,
};

/// Methods related to the option `conditionals`. All methods are noop if
/// `conditionals` is false.
impl Optimizer<'_> {
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

        if negate_cost(&self.ctx.expr_ctx, &stmt.test, true, false) < 0 {
            report_change!("if_return: Negating `cond` of an if statement which has cons and alt");
            let ctx = Ctx {
                in_bool_ctx: true,
                ..self.ctx.clone()
            };
            self.with_ctx(ctx).negate(&mut stmt.test, false);
            swap(alt, &mut *stmt.cons);
            return;
        }

        match &*alt {
            Stmt::Return(..) | Stmt::Continue(ContinueStmt { label: None, .. }) => {
                self.changed = true;
                report_change!(
                    "if_return: Negating an if statement because the alt is return / continue"
                );
                self.negate(&mut stmt.test, false);
                swap(alt, &mut *stmt.cons);
            }
            _ => {}
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

        if !cond.cons.may_have_side_effects(&self.ctx.expr_ctx) {
            self.changed = true;
            report_change!("conditionals: `cond ? useless : alt` => `cond || alt`");
            *e = BinExpr {
                span: cond.span,
                op: op!("||"),
                left: cond.test.take(),
                right: cond.alt.take(),
            }
            .into();
            return;
        }

        if !cond.alt.may_have_side_effects(&self.ctx.expr_ctx) {
            self.changed = true;
            report_change!("conditionals: `cond ? cons : useless` => `cond && cons`");
            *e = BinExpr {
                span: cond.span,
                op: op!("&&"),
                left: cond.test.take(),
                right: cond.cons.take(),
            }
            .into();
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
                    (
                        Some(Stmt::If(l @ IfStmt { alt: None, .. })),
                        Some(Stmt::If(r @ IfStmt { alt: None, .. })),
                    ) => SyntaxContext::within_ignored_ctxt(|| {
                        l.cons.eq_ignore_span(&r.cons) && l.cons.terminates()
                    }),
                    _ => false,
                });
        if !has_work {
            return;
        }

        self.changed = true;
        report_change!("conditionals: Merging if statements with same `cons`");

        let mut cur: Option<IfStmt> = None;
        let mut new = Vec::with_capacity(stmts.len());
        for stmt in stmts.take() {
            match stmt.try_into_stmt() {
                Ok(stmt) => {
                    match stmt {
                        Stmt::If(mut stmt @ IfStmt { alt: None, .. }) => {
                            //

                            match &mut cur {
                                Some(cur_if) => {
                                    // If cons is same, we merge conditions.
                                    if SyntaxContext::within_ignored_ctxt(|| {
                                        cur_if.cons.eq_ignore_span(&stmt.cons)
                                    }) {
                                        cur_if.test = BinExpr {
                                            span: DUMMY_SP,
                                            left: cur_if.test.take(),
                                            op: op!("||"),
                                            right: stmt.test.take(),
                                        }
                                        .into();
                                    } else {
                                        new.extend(cur.take().map(Stmt::If).map(T::from));

                                        cur = Some(stmt);
                                    }
                                }
                                None => {
                                    cur = Some(stmt);
                                }
                            }
                        }
                        _ => {
                            new.extend(cur.take().map(Stmt::If).map(T::from));

                            new.push(T::from(stmt));
                        }
                    }
                }
                Err(item) => {
                    new.extend(cur.take().map(Stmt::If).map(T::from));

                    new.push(item);
                }
            }
        }

        new.extend(cur.map(Stmt::If).map(T::from));

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

        if let Stmt::Empty(..) = &*stmt.cons {
            if (self.options.conditionals || self.options.unused) && stmt.alt.is_none() {
                *s = ExprStmt {
                    span: stmt.span,
                    expr: stmt.test.take(),
                }
                .into();
                self.changed = true;
                report_change!("conditionals: `if (foo);` => `foo` ");
                return;
            }
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
        if let Stmt::Empty(..) = &*stmt.cons {
            match &mut *stmt.test {
                Expr::Unary(UnaryExpr {
                    op: op!("!"), arg, ..
                }) => {
                    report_change!("Optimizing `if (!foo); else bar();` as `foo && bar();`");

                    let mut expr = BinExpr {
                        span: DUMMY_SP,
                        left: arg.take(),
                        op: op!("&&"),
                        right: Box::new(alt.take()),
                    }
                    .into();
                    self.compress_logical_exprs_as_bang_bang(&mut expr, true);
                    *s = ExprStmt {
                        span: stmt.span,
                        expr: expr.into(),
                    }
                    .into();
                }
                _ => {
                    report_change!("Optimizing `if (foo); else bar();` as `foo || bar();`");

                    let mut expr = BinExpr {
                        span: DUMMY_SP,
                        left: stmt.test.take(),
                        op: op!("||"),
                        right: Box::new(alt.take()),
                    }
                    .into();
                    self.compress_logical_exprs_as_bang_bang(&mut expr, false);
                    *s = ExprStmt {
                        span: stmt.span,
                        expr: expr.into(),
                    }
                    .into();
                }
            }
            return;
        }

        let cons = match extract_expr_stmt(&mut stmt.cons) {
            Some(v) => v,
            None => return,
        };

        let new_expr = self.compress_similar_cons_alt(&mut stmt.test, cons, alt, true);

        if let Some(v) = new_expr {
            debug_assert_valid(&v);

            self.changed = true;
            report_change!("conditionals: Merging cons and alt as only one argument differs");
            *s = ExprStmt {
                span: stmt.span,
                expr: Box::new(v),
            }
            .into();
            return;
        }

        if self.options.conditionals || self.options.bools {
            // if (a) b(); else c(); => a ? b() : c()
            report_change!(
                "Compressing if statement as conditional expression (even though cons and alt is \
                 not compressable)"
            );
            self.changed = true;
            *s = ExprStmt {
                span: stmt.span,
                expr: CondExpr {
                    span: DUMMY_SP,
                    test: stmt.test.take(),
                    cons: Box::new(cons.take()),
                    alt: Box::new(alt.take()),
                }
                .into(),
            }
            .into()
        }
    }

    /// Compress a conditional expression if cons and alt is simillar
    pub(super) fn compress_cond_expr_if_similar(&mut self, e: &mut Expr) {
        if !self.options.conditionals {
            return;
        }

        let cond = match e {
            Expr::Cond(expr) => expr,
            _ => return,
        };

        let compressed =
            self.compress_similar_cons_alt(&mut cond.test, &mut cond.cons, &mut cond.alt, false);

        if let Some(v) = compressed {
            *e = v;
            self.changed = true;
            return;
        }

        // x ? x : y => x || y
        if cond.test.is_ident() && cond.test.eq_ignore_span(&cond.cons) {
            report_change!("Compressing `x ? x : y` as `x || y`");
            self.changed = true;
            *e = BinExpr {
                span: cond.span,
                op: op!("||"),
                left: cond.test.take(),
                right: cond.alt.take(),
            }
            .into();
        }
    }

    fn compress_similar_cons_alt(
        &mut self,
        test: &mut Box<Expr>,
        cons: &mut Expr,
        alt: &mut Expr,
        is_for_if_stmt: bool,
    ) -> Option<Expr> {
        debug_assert_valid(cons);
        debug_assert_valid(alt);

        if cons.eq_ignore_span(alt) && !matches!(&*cons, Expr::Yield(..) | Expr::Fn(..)) {
            report_change!("conditionals: cons is same as alt");
            return Some(
                SeqExpr {
                    span: DUMMY_SP,
                    exprs: vec![test.take(), Box::new(cons.take())],
                }
                .into(),
            );
        }

        match (cons, alt) {
            (Expr::Call(cons), Expr::Call(alt)) => {
                if self.data.contains_unresolved(test) {
                    return None;
                }

                let cons_callee = cons.callee.as_expr().and_then(|e| e.as_ident())?;
                if IdentUsageFinder::find(&cons_callee.to_id(), &**test) {
                    return None;
                }
                //

                if !cons.callee.eq_ignore_span(&alt.callee) {
                    return None;
                }

                let side_effect_free = self
                    .data
                    .vars
                    .get(&cons_callee.to_id())
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
                        report_change!(
                            "conditionals: Merging cons and alt as only one argument differs"
                        );
                        self.changed = true;
                        let diff_idx = cons
                            .args
                            .iter()
                            .zip(alt.args.iter())
                            .position(|(cons, alt)| !cons.eq_ignore_span(alt))
                            .unwrap();

                        let mut new_args = Vec::new();

                        for (idx, arg) in cons.args.take().into_iter().enumerate() {
                            if idx == diff_idx {
                                // Inject conditional.
                                new_args.push(ExprOrSpread {
                                    spread: None,
                                    expr: CondExpr {
                                        span: arg.expr.span(),
                                        test: test.take(),
                                        cons: arg.expr,
                                        alt: alt.args[idx].expr.take(),
                                    }
                                    .into(),
                                })
                            } else {
                                //
                                new_args.push(arg)
                            }
                        }

                        return Some(
                            CallExpr {
                                span: test.span(),
                                callee: cons_callee.clone().as_callee(),
                                args: new_args,
                                ..Default::default()
                            }
                            .into(),
                        );
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

                    let args = vec![CondExpr {
                        span: DUMMY_SP,
                        test: test.take(),
                        cons: cons.args[0].expr.take(),
                        alt: alt.args[0].expr.take(),
                    }
                    .as_arg()];

                    report_change!(
                        "Compressing if into cond as there's no side effect and the number of \
                         arguments is 1"
                    );
                    return Some(
                        CallExpr {
                            span: DUMMY_SP,
                            callee: cons.callee.take(),
                            args,
                            ..Default::default()
                        }
                        .into(),
                    );
                }

                if !side_effect_free && is_for_if_stmt {
                    report_change!("Compressing if into cond while preserving side effects");
                    return Some(
                        CondExpr {
                            span: DUMMY_SP,
                            test: test.take(),
                            cons: cons.take().into(),
                            alt: alt.take().into(),
                        }
                        .into(),
                    );
                }

                None
            }

            (Expr::New(cons), Expr::New(alt)) => {
                if self.data.contains_unresolved(test) {
                    return None;
                }

                // TODO: Handle new expression with no args.

                if cons.callee.eq_ignore_span(&alt.callee)
                    && cons.args.as_ref().map(|v| v.len() <= 1).unwrap_or(true)
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
                    let mut args = Vec::new();

                    if cons.args.as_ref().map(|v| v.len()).unwrap_or(0) == 1 {
                        args = vec![ExprOrSpread {
                            spread: None,
                            expr: Box::new(Expr::Cond(CondExpr {
                                span: DUMMY_SP,
                                test: test.take(),
                                cons: cons.args.as_mut().unwrap()[0].expr.take(),
                                alt: alt.args.as_mut().unwrap()[0].expr.take(),
                            })),
                        }];
                    }

                    report_change!(
                        "Compressing if statement into a conditional expression of `new` as \
                         there's no side effect and the number of arguments is 1"
                    );
                    return Some(
                        NewExpr {
                            span: DUMMY_SP,
                            callee: cons.callee.take(),
                            args: Some(args),
                            ..Default::default()
                        }
                        .into(),
                    );
                }

                None
            }

            (
                Expr::Assign(cons @ AssignExpr { op: op!("="), .. }),
                Expr::Assign(alt @ AssignExpr { op: op!("="), .. }),
            ) if cons.left.eq_ignore_span(&alt.left) && cons.left.as_ident().is_some() => {
                if !test.is_ident() && self.data.contains_unresolved(test) {
                    return None;
                }

                report_change!("Merging assignments in cons and alt of if statement");
                Some(
                    AssignExpr {
                        span: DUMMY_SP,
                        op: cons.op,
                        left: cons.left.take(),
                        right: CondExpr {
                            span: DUMMY_SP,
                            test: test.take(),
                            cons: cons.right.take(),
                            alt: alt.right.take(),
                        }
                        .into(),
                    }
                    .into(),
                )
            }

            // a ? b ? c() : d() : d() => a && b ? c() : d()
            (Expr::Cond(cons), alt) if (*cons.alt).eq_ignore_span(&*alt) => {
                report_change!("conditionals: a ? b ? c() : d() : d() => a && b ? c() : d()");
                Some(
                    CondExpr {
                        span: DUMMY_SP,
                        test: BinExpr {
                            span: DUMMY_SP,
                            left: test.take(),
                            op: op!("&&"),
                            right: cons.test.take(),
                        }
                        .into(),
                        cons: cons.cons.take(),
                        alt: cons.alt.take(),
                    }
                    .into(),
                )
            }

            // z ? "fuji" : (condition(), "fuji");
            // =>
            // (z || condition(), "fuji");
            (cons, Expr::Seq(alt)) if (**alt.exprs.last().unwrap()).eq_ignore_span(&*cons) => {
                self.changed = true;
                report_change!("conditionals: Reducing seq expr in alt");
                //
                alt.exprs.pop();
                let first = BinExpr {
                    span: DUMMY_SP,
                    left: test.take(),
                    op: op!("||"),
                    right: Expr::from_exprs(alt.exprs.take()),
                }
                .into();
                Some(
                    SeqExpr {
                        span: DUMMY_SP,
                        exprs: vec![first, Box::new(cons.take())],
                    }
                    .into(),
                )
            }

            // z ? (condition(), "fuji") : "fuji"
            // =>
            // (z && condition(), "fuji");
            (Expr::Seq(cons), alt) if (**cons.exprs.last().unwrap()).eq_ignore_span(&*alt) => {
                self.changed = true;
                report_change!("conditionals: Reducing seq expr in cons");
                //
                cons.exprs.pop();
                let first = BinExpr {
                    span: DUMMY_SP,
                    left: test.take(),
                    op: op!("&&"),
                    right: Expr::from_exprs(cons.exprs.take()),
                }
                .into();
                Some(
                    SeqExpr {
                        span: DUMMY_SP,
                        exprs: vec![first, Box::new(alt.take())],
                    }
                    .into(),
                )
            }

            (Expr::Seq(left), Expr::Seq(right)) => {
                let left_len = left.exprs.len();
                let right_len = right.exprs.len();
                let min_len = left_len.min(right_len);

                let mut idx = 0;

                while idx < min_len
                    && left.exprs[left_len - idx - 1]
                        .eq_ignore_span(&right.exprs[right_len - idx - 1])
                    && !matches!(
                        &*left.exprs[left_len - idx - 1],
                        Expr::Yield(..) | Expr::Fn(..)
                    )
                {
                    idx += 1;
                }

                if idx == 0 {
                    None
                } else if idx == left_len {
                    self.changed = true;
                    report_change!("conditionals: Reducing similar seq expr in cons");

                    let mut alt = right.exprs.take();

                    alt.truncate(alt.len() - idx);

                    let mut seq = vec![Box::new(Expr::Bin(BinExpr {
                        span: DUMMY_SP,
                        left: test.take(),
                        op: op!("||"),
                        right: Expr::from_exprs(alt),
                    }))];
                    seq.append(&mut left.exprs);

                    Some(
                        SeqExpr {
                            span: DUMMY_SP,
                            exprs: seq,
                        }
                        .into(),
                    )
                } else if idx == right_len {
                    self.changed = true;
                    report_change!("conditionals: Reducing similar seq expr in alt");

                    let mut cons = left.exprs.take();

                    cons.truncate(cons.len() - idx);

                    let mut seq = vec![Box::new(Expr::Bin(BinExpr {
                        span: DUMMY_SP,
                        left: test.take(),
                        op: op!("&&"),
                        right: Expr::from_exprs(cons),
                    }))];
                    seq.append(&mut right.exprs);

                    Some(
                        SeqExpr {
                            span: DUMMY_SP,
                            exprs: seq,
                        }
                        .into(),
                    )
                } else {
                    self.changed = true;
                    report_change!("conditionals: Reducing similar seq expr");
                    let _ = left.exprs.split_off(left_len - idx);
                    let mut common = right.exprs.split_off(right_len - idx);

                    let mut seq = vec![Box::new(Expr::Cond(CondExpr {
                        span: DUMMY_SP,
                        test: test.take(),
                        cons: Box::new(Expr::Seq(left.take())),
                        alt: Box::new(Expr::Seq(right.take())),
                    }))];
                    seq.append(&mut common);

                    Some(
                        SeqExpr {
                            span: DUMMY_SP,
                            exprs: seq,
                        }
                        .into(),
                    )
                }
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
                                && !matches!(b.stmts.first(), Some(Stmt::If(..) | Stmt::Expr(..)))
                                && matches!(
                                    b.stmts.last(),
                                    Some(Stmt::Return(ReturnStmt { arg: None, .. }))
                                )
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
        report_change!("if_return: Injecting else because it's shorter");

        let mut new = Vec::with_capacity(pos_of_if + 1);
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
                    Box::new(
                        BlockStmt {
                            span: DUMMY_SP,
                            stmts: alt,
                            ..Default::default()
                        }
                        .into(),
                    )
                });

                new.push(s.into())
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
            })) => cons.terminates(),
            _ => false,
        });
        if !need_work {
            return;
        }
        //
        let mut new_stmts = Vec::with_capacity(stmts.len() * 2);
        stmts.take().into_iter().for_each(|stmt| {
            match stmt.try_into_stmt() {
                Ok(stmt) => match stmt {
                    Stmt::If(IfStmt {
                        span,
                        mut test,
                        mut cons,
                        alt: Some(mut alt),
                        ..
                    }) if cons.terminates() => {
                        if let (
                            Stmt::Return(ReturnStmt { arg: None, .. }),
                            Stmt::Decl(Decl::Fn(..)),
                        ) = (&*cons, &*alt)
                        {
                            // I don't know why, but terser behaves differently
                            negate(&self.ctx.expr_ctx, &mut test, true, false);

                            swap(&mut cons, &mut alt);
                        }

                        new_stmts.push(T::from(
                            IfStmt {
                                span,
                                test,
                                cons,
                                alt: None,
                            }
                            .into(),
                        ));
                        new_stmts.push(T::from(*alt));
                    }
                    _ => {
                        new_stmts.push(T::from(stmt));
                    }
                },
                Err(stmt) => new_stmts.push(stmt),
            }
        });

        self.changed = true;
        report_change!("conditionals: Dropped useless `else` token");
        *stmts = new_stmts;
    }
}

fn extract_expr_stmt(s: &mut Stmt) -> Option<&mut Expr> {
    match s {
        Stmt::Expr(e) => Some(&mut *e.expr),
        _ => None,
    }
}
