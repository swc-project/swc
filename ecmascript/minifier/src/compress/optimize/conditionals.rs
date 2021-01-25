use super::Reducer;
use swc_common::EqIgnoreSpan;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::AsOptExpr;
use swc_ecma_transforms_base::ext::ExprRefExt;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ident::IdentLike;

impl Reducer {
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
        if !self.options.conditionals {
            return;
        }

        let stmt = match s {
            Stmt::If(v) => v,
            _ => return,
        };

        let cons = match extract_expr_stmt(&mut *stmt.cons) {
            Some(v) => v,
            None => return,
        };

        // If alt does not exist, an if statement is better than a conditional
        // expression.
        let alt = match &mut stmt.alt {
            Some(v) => &mut **v,
            None => return,
        };
        let alt = match extract_expr_stmt(alt) {
            Some(v) => v,
            None => return,
        };

        match (cons, alt) {
            (Expr::Call(cons), Expr::Call(alt)) => {
                let cons_callee = cons.callee.as_expr().and_then(|e| e.as_ident());
                let cons_callee = match cons_callee {
                    Some(v) => v,
                    None => return,
                };
                //
                if cons.callee.eq_ignore_span(&alt.callee) {
                    let side_effect_free = self
                        .data
                        .as_ref()
                        .and_then(|data| data.vars.get(&cons_callee.to_id()))
                        .map(|v| v.declared_in_fn)
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
                                test: stmt.test.take(),
                                cons: cons.args[0].expr.take(),
                                alt: alt.args[0].expr.take(),
                            })),
                        });

                        log::trace!(
                            "Compreessing if into cond as there's no side effect and the number \
                             of arguments is 1"
                        );
                        self.changed = true;
                        *s = Stmt::Expr(ExprStmt {
                            span: stmt.span,
                            expr: Box::new(Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: cons.callee.take(),
                                args,
                                type_args: Default::default(),
                            })),
                        });
                        return;
                    }

                    if !side_effect_free {
                        log::trace!("Compreessing if into cond while preserving side effects");
                        self.changed = true;
                        *s = Stmt::Expr(ExprStmt {
                            span: stmt.span,
                            expr: Box::new(Expr::Cond(CondExpr {
                                span: DUMMY_SP,
                                test: stmt.test.take(),
                                cons: Box::new(Expr::Call(cons.take())),
                                alt: Box::new(Expr::Call(alt.take())),
                            })),
                        });
                        return;
                    }
                }
            }

            (Expr::Assign(cons), Expr::Assign(alt))
                if cons.op == alt.op && cons.left.eq_ignore_span(&alt.left) =>
            {
                self.changed = true;
                log::trace!("Merging assignments in cons and alt of if statement");
                *s = Stmt::Expr(ExprStmt {
                    span: stmt.span,
                    expr: Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: cons.op,
                        left: cons.left.take(),
                        right: Box::new(Expr::Cond(CondExpr {
                            span: DUMMY_SP,
                            test: stmt.test.take(),
                            cons: cons.right.take(),
                            alt: alt.right.take(),
                        })),
                    })),
                })
            }

            _ => {}
        }
    }
}

fn extract_expr_stmt(s: &mut Stmt) -> Option<&mut Expr> {
    match s {
        Stmt::Expr(e) => Some(&mut *e.expr),
        _ => None,
    }
}
