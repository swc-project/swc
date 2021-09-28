use super::Pure;
use crate::{compress::util::negate_cost, debug::dump, mode::Mode, util::make_bool};
use std::mem::swap;
use swc_common::{util::take::Take, EqIgnoreSpan, Spanned};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Type, Value};

impl<M> Pure<'_, M>
where
    M: Mode,
{
    ///
    /// - `foo ? bar : false` => `!!foo && bar`
    /// - `!foo ? true : bar` => `!foo || bar`
    /// - `foo ? false : bar` => `!foo && bar`
    pub(super) fn compress_conds_as_logical(&mut self, e: &mut Expr) {
        let cond = match e {
            Expr::Cond(cond) => cond,
            _ => return,
        };

        let lt = cond.cons.get_type();
        if let Value::Known(Type::Bool) = lt {
            let lb = cond.cons.as_pure_bool();
            if let Value::Known(true) = lb {
                tracing::debug!("conditionals: `foo ? true : bar` => `!!foo || bar`");

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

            // TODO: Verify this rule.
            if let Value::Known(false) = lb {
                tracing::debug!("conditionals: `foo ? false : bar` => `!foo && bar`");

                self.changed = true;
                self.negate(&mut cond.test, false);

                *e = Expr::Bin(BinExpr {
                    span: cond.span,
                    op: op!("&&"),
                    left: cond.test.take(),
                    right: cond.alt.take(),
                });
                return;
            }
        }

        let rt = cond.alt.get_type();
        if let Value::Known(Type::Bool) = rt {
            let rb = cond.alt.as_pure_bool();
            if let Value::Known(false) = rb {
                tracing::debug!("conditionals: `foo ? bar : false` => `!!foo && bar`");
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

            if let Value::Known(true) = rb {
                tracing::debug!("conditionals: `foo ? bar : true` => `!foo || bar");
                self.changed = true;

                self.negate(&mut cond.test, false);

                *e = Expr::Bin(BinExpr {
                    span: cond.span,
                    op: op!("||"),
                    left: cond.test.take(),
                    right: cond.cons.take(),
                });
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
                tracing::debug!("conditionals: `x ? y || z : z` => `x || y && z`");
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

    pub(super) fn negate_cond_expr(&mut self, cond: &mut CondExpr) {
        if negate_cost(&cond.test, true, false).unwrap_or(isize::MAX) >= 0 {
            return;
        }

        self.changed = true;
        tracing::debug!("conditionals: `a ? foo : bar` => `!a ? bar : foo` (considered cost)");
        let start_str = dump(&*cond);

        self.negate(&mut cond.test, true);
        swap(&mut cond.cons, &mut cond.alt);

        if cfg!(feature = "debug") {
            tracing::trace!(
                "[Change] Negated cond: `{}` => `{}`",
                start_str,
                dump(&*cond)
            )
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

        if bin.left.may_have_side_effects() {
            return;
        }

        let lt = bin.left.get_type();
        let rt = bin.right.get_type();

        let _lb = bin.left.as_pure_bool();
        let rb = bin.right.as_pure_bool();

        if let (Value::Known(Type::Bool), Value::Known(Type::Bool)) = (lt, rt) {
            // `!!b || true` => true
            if let Value::Known(true) = rb {
                self.changed = true;
                tracing::debug!("conditionals: `!!foo || true` => `true`");
                *e = make_bool(bin.span, true);
                return;
            }
        }
    }
}
