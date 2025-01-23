use std::mem::swap;

use swc_common::{util::take::Take, EqIgnoreSpan};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Type, Value};

use super::Pure;
#[cfg(feature = "debug")]
use crate::debug::dump;
use crate::{compress::util::negate_cost, util::make_bool};

impl Pure<'_> {
    ///
    /// - `foo ? bar : false` => `!!foo && bar`
    /// - `!foo ? true : bar` => `!foo || bar`
    /// - `foo ? false : bar` => `!foo && bar`
    pub(super) fn compress_conds_as_logical(&mut self, e: &mut Expr) {
        if !self.options.conditionals {
            return;
        }

        let Expr::Cond(cond) = e else { return };

        let lt = cond.cons.get_type();
        if let Value::Known(Type::Bool) = lt {
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

        let rt = cond.alt.get_type();
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
            ) if *value > 0.0 => {
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
            ) if *value > 0.0 => {
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

    pub(super) fn negate_cond_expr(&mut self, cond: &mut CondExpr) {
        if negate_cost(self.expr_ctx, &cond.test, true, false) >= 0 {
            return;
        }

        report_change!("conditionals: `a ? foo : bar` => `!a ? bar : foo` (considered cost)");
        #[cfg(feature = "debug")]
        let start_str = dump(&*cond, false);

        self.negate(&mut cond.test, true, false);
        swap(&mut cond.cons, &mut cond.alt);

        dump_change_detail!(
            "[Change] Negated cond: `{}` => `{}`",
            start_str,
            dump(&*cond, false)
        );
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

        let lt = bin.left.get_type();
        let rt = bin.right.get_type();

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
}
