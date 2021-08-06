use super::Pure;
use crate::compress::util::negate;
use crate::util::make_bool;
use swc_common::Spanned;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::Value;
use Value::Known;

impl Pure<'_> {
    pub(super) fn handle_negated_seq(&mut self, n: &mut Expr) {
        match &mut *n {
            Expr::Unary(e @ UnaryExpr { op: op!("!"), .. })
            | Expr::Unary(
                e @ UnaryExpr {
                    op: op!("delete"), ..
                },
            ) => {
                match &mut *e.arg {
                    Expr::Seq(SeqExpr { exprs, .. }) => {
                        if exprs.is_empty() {
                            return;
                        }
                        log::debug!("bools: Optimizing negated sequences");

                        {
                            let last = exprs.last_mut().unwrap();
                            self.optimize_expr_in_bool_ctx(last);
                            // Negate last element.
                            negate(last, false);
                        }

                        *n = *e.arg.take();
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }

    /// This method converts `!1` to `0`.
    pub(super) fn optimize_expr_in_bool_ctx(&mut self, n: &mut Expr) {
        if !self.options.bools {
            return;
        }

        match n {
            Expr::Bin(BinExpr {
                op: op!("&&") | op!("||"),
                left,
                right,
                ..
            }) => {
                // Regardless if it's truthy or falsy, we can optimize it because it will be
                // casted as bool anyway.
                self.optimize_expr_in_bool_ctx(&mut **left);
                self.optimize_expr_in_bool_ctx(&mut **right);
                return;
            }

            Expr::Seq(e) => {
                if let Some(last) = e.exprs.last_mut() {
                    self.optimize_expr_in_bool_ctx(&mut **last);
                }
            }

            _ => {}
        }

        match n {
            Expr::Unary(UnaryExpr {
                span,
                op: op!("!"),
                arg,
            }) => match &mut **arg {
                Expr::Lit(Lit::Num(Number { value, .. })) => {
                    log::debug!("Optimizing: number => number (in bool context)");

                    self.changed = true;
                    *n = Expr::Lit(Lit::Num(Number {
                        span: *span,
                        value: if *value == 0.0 { 1.0 } else { 0.0 },
                    }))
                }

                Expr::Unary(UnaryExpr {
                    op: op!("!"), arg, ..
                }) => {
                    log::debug!("bools: !!expr => expr (in bool ctx)");
                    self.changed = true;
                    *n = *arg.take();
                    return;
                }
                _ => {}
            },

            Expr::Unary(UnaryExpr {
                span,
                op: op!("typeof"),
                arg,
            }) => {
                log::debug!("Optimizing: typeof => true (in bool context)");
                self.changed = true;

                match &**arg {
                    Expr::Ident(..) => {
                        *n = Expr::Lit(Lit::Num(Number {
                            span: *span,
                            value: 1.0,
                        }))
                    }
                    _ => {
                        // Return value of typeof is always truthy
                        let true_expr = Box::new(Expr::Lit(Lit::Num(Number {
                            span: *span,
                            value: 1.0,
                        })));
                        *n = Expr::Seq(SeqExpr {
                            span: *span,
                            exprs: vec![arg.take(), true_expr],
                        })
                    }
                }
            }

            Expr::Lit(Lit::Str(s)) => {
                log::debug!("Converting string as boolean expressions");
                self.changed = true;
                *n = Expr::Lit(Lit::Num(Number {
                    span: s.span,
                    value: if s.value.is_empty() { 0.0 } else { 1.0 },
                }));
            }

            Expr::Lit(Lit::Num(num)) => {
                if num.value == 1.0 || num.value == 0.0 {
                    return;
                }
                if self.options.bools {
                    log::debug!("booleans: Converting number as boolean expressions");
                    self.changed = true;
                    *n = Expr::Lit(Lit::Num(Number {
                        span: num.span,
                        value: if num.value == 0.0 { 0.0 } else { 1.0 },
                    }));
                }
            }

            Expr::Bin(BinExpr {
                op: op!("??"),
                left,
                right,
                ..
            }) => {
                // Optimize if (a ?? false); as if (a);
                if let Value::Known(false) = right.as_pure_bool() {
                    log::debug!(
                        "Dropping right operand of `??` as it's always false (in bool context)"
                    );
                    self.changed = true;
                    *n = *left.take();
                }
            }

            Expr::Bin(BinExpr {
                op: op!("||"),
                left,
                right,
                ..
            }) => {
                // `a || false` => `a` (as it will be casted to boolean anyway)

                if let Known(false) = right.as_pure_bool() {
                    log::debug!("bools: `expr || false` => `expr` (in bool context)");
                    self.changed = true;
                    *n = *left.take();
                    return;
                }
            }

            _ => {
                let span = n.span();
                let v = n.as_pure_bool();
                if let Known(v) = v {
                    log::debug!("Optimizing expr as {} (in bool context)", v);
                    *n = make_bool(span, v);
                    return;
                }
            }
        }
    }
}
