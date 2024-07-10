use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_utils::num_from_str;

use super::Pure;

impl Pure<'_> {
    pub(super) fn optimize_expr_in_num_ctx(&mut self, e: &mut Expr) {
        if let Expr::Lit(Lit::Str(Str { span, value, .. })) = e {
            let value = if value.is_empty() {
                0f64
            } else {
                match num_from_str(value).into_result() {
                    Ok(f) if f.is_finite() => f,
                    _ => return,
                }
            };

            self.changed = true;
            report_change!("numbers: Converting a string literal to {:?}", value);
            *e = Lit::Num(Number {
                span: *span,
                value,
                raw: None,
            })
            .into();
        }
    }

    ///
    /// - `1 / -0` => `- 1 / 0`
    pub(super) fn lift_minus(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        if let Expr::Bin(arg) = e {
            if arg.op != op!("*") && arg.op != op!("/") {
                return;
            }

            match &mut *arg.right {
                Expr::Unary(UnaryExpr {
                    op: op!(unary, "-"),
                    arg: right_arg,
                    ..
                }) => {
                    self.changed = true;
                    report_change!("numbers: Lifting `-`");

                    *e = UnaryExpr {
                        span: arg.span,
                        op: op!(unary, "-"),
                        arg: BinExpr {
                            span: arg.span,
                            op: arg.op,
                            left: arg.left.take(),
                            right: right_arg.take(),
                        }
                        .into(),
                    }
                    .into();
                }

                Expr::Lit(Lit::Num(Number { span, value, .. })) => {
                    if value.is_sign_negative() {
                        self.changed = true;
                        report_change!("numbers: Lifting `-` in a literal");

                        *e = UnaryExpr {
                            span: arg.span,
                            op: op!(unary, "-"),
                            arg: BinExpr {
                                span: arg.span,
                                op: arg.op,
                                left: arg.left.take(),
                                right: Box::new(Expr::Lit(Lit::Num(Number {
                                    span: *span,
                                    value: -*value,
                                    raw: None,
                                }))),
                            }
                            .into(),
                        }
                        .into();
                    }
                }

                _ => {}
            }
        }
    }
}
