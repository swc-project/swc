use std::mem::take;

use swc_common::{util::take::Take, EqIgnoreSpan, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, IsEmpty, StmtExt, Type, Value};

use super::{DropOpts, Pure};
use crate::{compress::util::can_absorb_negate, util::make_bool};

impl Pure<'_> {
    pub(super) fn merge_nested_if(&mut self, s: &mut IfStmt) {
        if !self.options.conditionals && !self.options.bools {
            return;
        }

        if s.alt.is_some() {
            return;
        }

        if let Stmt::If(IfStmt {
            test,
            cons,
            alt: None,
            ..
        }) = &mut *s.cons
        {
            self.changed = true;
            report_change!("if_return: Merging nested if statements");

            s.test = BinExpr {
                span: s.test.span(),
                op: op!("&&"),
                left: s.test.take(),
                right: test.take(),
            }
            .into();
            s.cons = cons.take();
        }
    }

    pub(super) fn optimize_const_cond(&mut self, e: &mut Expr) {
        let Expr::Cond(cond) = e else {
            return;
        };

        let (p, Value::Known(v)) = cond.test.cast_to_bool(self.expr_ctx) else {
            return;
        };

        if p.is_pure() {
            if v {
                self.changed = true;
                report_change!("conditionals: `true ? foo : bar` => `foo` (pure test)");
                *e = if cond.cons.directness_matters() {
                    Expr::Seq(SeqExpr {
                        span: cond.span,
                        exprs: vec![0.into(), cond.cons.take()],
                    })
                } else {
                    *cond.cons.take()
                };
            } else {
                self.changed = true;
                report_change!("conditionals: `false ? foo : bar` => `bar` (pure test)");
                *e = if cond.alt.directness_matters() {
                    Expr::Seq(SeqExpr {
                        span: cond.span,
                        exprs: vec![0.into(), cond.alt.take()],
                    })
                } else {
                    *cond.alt.take()
                };
            }
        } else {
            self.ignore_return_value(
                &mut cond.test,
                DropOpts::DROP_NUMBER.union(DropOpts::DROP_STR_LIT),
            );

            self.changed = true;

            let mut exprs = Vec::with_capacity(2);
            if !cond.test.is_invalid() {
                exprs.push(take(&mut cond.test));
            }

            if v {
                report_change!("conditionals: `true ? foo : bar` => `true, foo`");
                exprs.push(take(&mut cond.cons));
            } else {
                report_change!("conditionals: `false ? foo : bar` => `false, bar`");
                exprs.push(take(&mut cond.alt));
            }

            *e = *Expr::from_exprs(exprs);
        }
    }

    ///
    /// - `foo ? bar : false` => `!!foo && bar`
    /// - `!foo ? true : bar` => `!foo || bar`
    /// - `foo ? false : bar` => `!foo && bar`
    pub(super) fn compress_conds_as_logical(&mut self, e: &mut Expr) {
        if !self.options.conditionals {
            return;
        }

        let Expr::Cond(cond) = e else { return };

        if let Value::Known(Type::Bool) = cond.cons.get_type(self.expr_ctx) {
            let lb = cond.cons.as_pure_bool(self.expr_ctx);
            if let Value::Known(true) = lb {
                report_change!("conditionals: `foo ? true : bar` => `!!foo || bar`");

                // Negate twice to convert `test` to boolean.
                self.negate_twice(&mut cond.test, false);

                self.changed = true;
                *e = BinExpr {
                    span: cond.span,
                    op: op!("||"),
                    left: cond.test.take(),
                    right: cond.alt.take(),
                }
                .into();
                return;
            }

            // TODO: Verify this rule.
            if let Value::Known(false) = lb {
                report_change!("conditionals: `foo ? false : bar` => `!foo && bar`");

                self.changed = true;
                self.negate(&mut cond.test, false, false);

                *e = BinExpr {
                    span: cond.span,
                    op: op!("&&"),
                    left: cond.test.take(),
                    right: cond.alt.take(),
                }
                .into();
                return;
            }
        }

        let rt = cond.alt.get_type(self.expr_ctx);
        if let Value::Known(Type::Bool) = rt {
            let rb = cond.alt.as_pure_bool(self.expr_ctx);
            if let Value::Known(false) = rb {
                report_change!("conditionals: `foo ? bar : false` => `!!foo && bar`");
                self.changed = true;

                // Negate twice to convert `test` to boolean.
                self.negate_twice(&mut cond.test, false);

                *e = BinExpr {
                    span: cond.span,
                    op: op!("&&"),
                    left: cond.test.take(),
                    right: cond.cons.take(),
                }
                .into();
                return;
            }

            if let Value::Known(true) = rb {
                report_change!("conditionals: `foo ? bar : true` => `!foo || bar");
                self.changed = true;

                self.negate(&mut cond.test, false, false);

                *e = BinExpr {
                    span: cond.span,
                    op: op!("||"),
                    left: cond.test.take(),
                    right: cond.cons.take(),
                }
                .into();
            }
        }
    }

    pub(super) fn compress_cond_with_logical_as_logical(&mut self, e: &mut Expr) {
        if !self.options.conditionals {
            return;
        }

        let Expr::Cond(cond) = e else { return };

        match (&mut *cond.cons, &mut *cond.alt) {
            (Expr::Bin(cons @ BinExpr { op: op!("||"), .. }), alt)
                if (*cons.right).eq_ignore_span(&*alt) =>
            {
                let cons_span = cons.span;

                report_change!("conditionals: `x ? y || z : z` => `x || y && z`");
                self.changed = true;

                *e = BinExpr {
                    span: cond.span,
                    op: op!("||"),
                    left: BinExpr {
                        span: cons_span,
                        op: op!("&&"),
                        left: cond.test.take(),
                        right: cons.left.take(),
                    }
                    .into(),
                    right: cons.right.take(),
                }
                .into();
            }
            _ => {}
        }
    }

    ///
    /// - `foo ? num : 0` => `num * !!foo`
    /// - `foo ? 0 : num` => `num * !foo`
    pub(super) fn compress_conds_as_arithmetic(&mut self, e: &mut Expr) {
        if !self.options.conditionals {
            return;
        }

        let Expr::Cond(cond) = e else { return };
        let span = cond.span;

        match (&mut *cond.cons, &mut *cond.alt) {
            (
                Expr::Lit(Lit::Num(Number { value, .. })),
                Expr::Lit(Lit::Num(Number { value: 0.0, .. })),
            ) if *value > 0.0
                && (!cond.test.is_bin()
                    || cond.test.get_type(self.expr_ctx) == Value::Known(Type::Bool)) =>
            {
                report_change!("conditionals: `foo ? num : 0` => `num * !!foo`");
                self.changed = true;

                let left = cond.cons.take();
                let mut right = cond.test.take();
                self.negate_twice(&mut right, false);

                *e = Expr::Bin(BinExpr {
                    span,
                    op: op!("*"),
                    left,
                    right,
                })
            }
            (
                Expr::Lit(Lit::Num(Number { value: 0.0, .. })),
                Expr::Lit(Lit::Num(Number { value, .. })),
            ) if *value > 0.0
                && (!cond.test.is_bin() || can_absorb_negate(&cond.test, self.expr_ctx)) =>
            {
                report_change!("conditionals: `foo ? 0 : num` => `num * !foo`");
                self.changed = true;

                let left = cond.alt.take();
                let mut right = cond.test.take();
                self.negate(&mut right, false, false);

                *e = Expr::Bin(BinExpr {
                    span,
                    op: op!("*"),
                    left,
                    right,
                })
            }
            _ => (),
        }
    }

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

        if bin.left.may_have_side_effects(self.expr_ctx) {
            return;
        }

        let lt = bin.left.get_type(self.expr_ctx);
        let rt = bin.right.get_type(self.expr_ctx);

        let _lb = bin.left.as_pure_bool(self.expr_ctx);
        let rb = bin.right.as_pure_bool(self.expr_ctx);

        if bin.op == op!("||") {
            if let (Value::Known(Type::Bool), Value::Known(Type::Bool)) = (lt, rt) {
                // `!!b || true` => true
                if let Value::Known(true) = rb {
                    self.changed = true;
                    report_change!("conditionals: `!!foo || true` => `true`");
                    *e = make_bool(bin.span, true);
                }
            }
        }
    }

    pub(super) fn optimize_empty_try_stmt(&mut self, s: &mut Stmt) {
        if !self.options.dead_code {
            return;
        }

        let Stmt::Try(ts) = s else {
            return;
        };

        if !ts.block.stmts.is_empty() {
            return;
        }

        report_change!("conditionals: Optimizing empty try block");
        self.changed = true;

        let mut vars = None;

        if ts.handler.is_some() {
            let vec = ts
                .handler
                .iter()
                .flat_map(|c| c.body.stmts.iter())
                .flat_map(|s| s.extract_var_ids())
                .map(|i| VarDeclarator {
                    span: DUMMY_SP,
                    name: i.into(),
                    init: None,
                    definite: false,
                })
                .collect::<Vec<_>>();
            if !vec.is_empty() {
                vars = Some(vec);
            }
        }

        *s = ts.finalizer.take().map(Stmt::from).unwrap_or_default();

        if let Some(vars) = vars {
            *s = Stmt::Block(BlockStmt {
                stmts: vec![
                    Stmt::Decl(Decl::Var(Box::new(VarDecl {
                        span: DUMMY_SP,
                        ctxt: Default::default(),
                        kind: VarDeclKind::Var,
                        declare: false,
                        decls: vars,
                    }))),
                    take(s),
                ],
                ..Default::default()
            });
        }
    }

    pub(super) fn optimize_meaningless_try(&mut self, s: &mut Stmt) {
        let Stmt::Try(ts) = s else {
            return;
        };

        // If catch block is not specified and finally block is empty, fold it to simple
        // block.
        if ts.handler.is_none() && ts.finalizer.is_empty() {
            report_change!("conditionals: Optimizing meaningless try block");
            self.changed = true;
            *s = take(&mut ts.block).into();
        }
    }
}
