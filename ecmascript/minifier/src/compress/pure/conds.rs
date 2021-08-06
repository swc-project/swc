use super::Pure;
use swc_common::{EqIgnoreSpan, Spanned};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::{ExprExt, Type, Value};

impl Pure<'_> {
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
                log::debug!("conditionals: `foo ? true : bar` => `!!foo || bar`");

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
                log::debug!("conditionals: `foo ? false : bar` => `!foo && bar`");

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
                log::debug!("conditionals: `foo ? bar : false` => `!!foo && bar`");
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
                log::debug!("conditionals: `foo ? bar : true` => `!foo || bar");
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
                log::debug!("conditionals: `x ? y || z : z` => `x || y && z`");
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
}
