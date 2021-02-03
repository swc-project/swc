use super::Optimizer;
use crate::util::make_bool;
use crate::util::SpanExt;
use swc_common::EqIgnoreSpan;
use swc_common::Spanned;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::AsOptExpr;
use swc_ecma_transforms_base::ext::ExprRefExt;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::StmtLike;
use swc_ecma_utils::Type;
use swc_ecma_utils::Value::Known;

/// Methods related to the option `conditionals`. All methods are noop if
/// `conditionals` is false.
impl Optimizer {
    /// Removes useless operands of an logical expressions.
    pub(super) fn drop_logical_operands(&mut self, e: &mut Expr) {
        if !self.options.conditionals {
            return;
        }

        let bin = match e {
            Expr::Bin(b) => b,
            _ => return,
        };

        if bin.op != op!("||") && bin.op != op!("&&") {
            return;
        }

        if bin.left.may_have_side_effects() {
            return;
        }

        let lt = bin.left.get_type();
        let rt = bin.right.get_type();

        let lb = bin.left.as_pure_bool();
        let rb = bin.right.as_pure_bool();

        if let (Known(Type::Bool), Known(Type::Bool)) = (lt, rt) {
            // `!!b || true` => true
            if let Known(true) = rb {
                self.changed = true;
                log::trace!("conditionals: `!!foo || true` => `true`");
                *e = make_bool(bin.span, true);
                return;
            }
        }
    }

    pub(super) fn compress_cond_with_logical_as_logical(&mut self, e: &mut Expr) {
        if !self.options.conditionals {
            return;
        }

        let cond = match e {
            Expr::Cond(v) => v,
            _ => return,
        };

        let cons_span = cond.cons.span();

        match (&mut *cond.cons, &mut *cond.alt) {
            (Expr::Bin(cons @ BinExpr { op: op!("||"), .. }), alt)
                if (*cons.right).eq_ignore_span(&*alt) =>
            {
                log::trace!("conditionals: `x ? y || z : z` => `x || y && z`");
                self.changed = true;

                *e = Expr::Bin(BinExpr {
                    span: cond.span,
                    op: op!("||"),
                    left: Box::new(Expr::Bin(BinExpr {
                        span: cons_span,
                        op: op!("&&"),
                        left: cond.test.take(),
                        right: cons.left.take(),
                    })),
                    right: cons.right.take(),
                });
                return;
            }
            _ => {}
        }
    }

    ///
    /// - `foo ? 1 : false` => `!!foo && 1`
    /// - `!foo ? true : 0` => `!foo || 0`
    pub(super) fn compress_conds_as_logical(&mut self, e: &mut Expr) {
        if !self.options.conditionals {
            return;
        }

        let cond = match e {
            Expr::Cond(cond) => cond,
            _ => return,
        };

        let lt = cond.cons.get_type();
        if let Known(Type::Bool) = lt {
            let lb = cond.cons.as_pure_bool();
            if let Known(true) = lb {
                log::trace!("conditionals: `foo ? true : bar` => `!!foo || bar`");

                // Negate twice to convert `test` to boolean.
                self.negate_twice(&mut cond.test);

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

        let rt = cond.alt.get_type();
        if let Known(Type::Bool) = rt {
            let rb = cond.alt.as_pure_bool();
            if let Known(false) = rb {
                log::trace!("conditionals: `foo ? 1 : false` => `!!foo && 1`");
                self.changed = true;

                // Negate twice to convert `test` to boolean.
                self.negate_twice(&mut cond.test);

                *e = Expr::Bin(BinExpr {
                    span: cond.span,
                    op: op!("&&"),
                    left: cond.test.take(),
                    right: cond.cons.take(),
                });
                return;
            }
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
    pub(super) fn merge_simillar_ifs<T>(&mut self, stmts: &mut Vec<T>)
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
        log::trace!("conditionals: Merging if statements with same `cons`");

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
    pub(super) fn compress_if_stmt_as_expr(&mut self, s: &mut Stmt) {
        if !self.options.conditionals {
            return;
        }

        let stmt = match s {
            Stmt::If(v) => v,
            _ => return,
        };

        let alt = match &mut stmt.alt {
            Some(v) => &mut **v,
            None => {
                match &mut *stmt.cons {
                    Stmt::Expr(cons) => {
                        self.changed = true;
                        log::trace!("conditionals: `if (foo) bar;` => f`oo && bar`");
                        *s = Stmt::Expr(ExprStmt {
                            span: stmt.span,
                            expr: Box::new(Expr::Bin(BinExpr {
                                span: stmt.test.span(),
                                op: op!("&&"),
                                left: stmt.test.take(),
                                right: cons.expr.take(),
                            })),
                        });
                        return;
                    }
                    _ => {}
                }

                // If alt does not exist, an if statement is better than a conditional
                // expression.
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
                        log::trace!("Optimizing `if (!foo); else bar();` as `foo && bar();`");

                        let mut expr = Box::new(Expr::Bin(BinExpr {
                            span: DUMMY_SP,
                            left: arg.take(),
                            op: op!("&&"),
                            right: Box::new(alt.take()),
                        }));
                        self.compress_logical_exprs_as_bang_bang(&mut expr);
                        *s = Stmt::Expr(ExprStmt {
                            span: stmt.span,
                            expr,
                        });
                    }
                    _ => {
                        log::trace!("Optimizing `if (foo); else bar();` as `foo || bar();`");

                        let mut expr = Box::new(Expr::Bin(BinExpr {
                            span: DUMMY_SP,
                            left: stmt.test.take(),
                            op: op!("||"),
                            right: Box::new(alt.take()),
                        }));
                        self.compress_logical_exprs_as_bang_bang(&mut expr);
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

        // if (a) b(); else c(); => a ? b() : c()
        log::trace!(
            "Compressing if statement as conditional expression (even though cons and alt is not \
             compressable)"
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

    /// Compress a conditional expression if cons and alt is simillar
    pub(super) fn compress_cond_expr_if_simillar(&mut self, e: &mut Expr) {
        if !self.options.conditionals {
            return;
        }

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
            log::trace!("Compressing `x ? x : y` as `x || y`");
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
        if cons.eq_ignore_span(alt) {
            return Some(Expr::Seq(SeqExpr {
                span: DUMMY_SP,
                exprs: vec![test.take(), Box::new(cons.take())],
            }));
        }

        match (cons, alt) {
            (Expr::Call(cons), Expr::Call(alt)) => {
                let cons_callee = cons.callee.as_expr().and_then(|e| e.as_ident())?;
                //
                if cons.callee.eq_ignore_span(&alt.callee) {
                    let side_effect_free = self
                        .data
                        .as_ref()
                        .and_then(|data| data.vars.get(&cons_callee.to_id()))
                        .map(|v| v.is_fn_local)
                        .unwrap_or(false);

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

                        log::trace!(
                            "Compreessing if into cond as there's no side effect and the number \
                             of arguments is 1"
                        );
                        return Some(Expr::Call(CallExpr {
                            span: DUMMY_SP.with_ctxt(self.done_ctxt),
                            callee: cons.callee.take(),
                            args,
                            type_args: Default::default(),
                        }));
                    }

                    if !side_effect_free && is_for_if_stmt {
                        log::trace!("Compreessing if into cond while preserving side effects");
                        return Some(Expr::Cond(CondExpr {
                            span: DUMMY_SP.with_ctxt(self.done_ctxt),
                            test: test.take(),
                            cons: Box::new(Expr::Call(cons.take())),
                            alt: Box::new(Expr::Call(alt.take())),
                        }));
                    }
                }

                None
            }

            (Expr::New(cons), Expr::New(alt)) => {
                // TODO: Handle new expression with no args.

                if cons.callee.eq_ignore_span(&alt.callee) {
                    if cons.args.as_ref().map(|v| v.len() <= 1).unwrap_or(true)
                        && alt.args.as_ref().map(|v| v.len() <= 1).unwrap_or(true)
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

                        args.push(ExprOrSpread {
                            spread: None,
                            expr: Box::new(Expr::Cond(CondExpr {
                                span: DUMMY_SP,
                                test: test.take(),
                                cons: cons.args.as_mut().unwrap()[0].expr.take(),
                                alt: alt.args.as_mut().unwrap()[0].expr.take(),
                            })),
                        });

                        log::trace!(
                            "Compreessing if statement into a condiotnal expression of `new` as \
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
                log::trace!("Merging assignments in cons and alt of if statement");
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
                log::trace!("conditionals: a ? b ? c() : d() : d() => a && b ? c() : d()");
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
            (cons, Expr::Seq(alt))
                if alt.exprs.len() == 2 && (**alt.exprs.last().unwrap()).eq_ignore_span(&*cons) =>
            {
                log::trace!("conditionals: Reducing seq expr in alt");
                //
                let first = Box::new(Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    left: test.take(),
                    op: op!("||"),
                    right: alt.exprs[0].take(),
                }));
                return Some(Expr::Seq(SeqExpr {
                    span: DUMMY_SP,
                    exprs: vec![first, Box::new(cons.take())],
                }));
            }

            _ => None,
        }
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
            _ => false,
        },
    }
}
