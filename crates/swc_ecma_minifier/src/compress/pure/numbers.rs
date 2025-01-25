use swc_common::{util::take::Take, EqIgnoreSpan, DUMMY_SP};
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

    pub(super) fn optimize_to_number(&mut self, e: &mut Expr) {
        match e {
            Expr::Bin(bin) => {
                if bin.op == op!("*")
                    && matches!(&*bin.left, Expr::Lit(Lit::Num(Number { value: 1.0, .. })))
                {
                    report_change!("numbers: Turn '1 *' into '+'");
                    self.changed = true;

                    let value = bin.right.take();
                    let span = bin.span;

                    *e = Expr::Unary(UnaryExpr {
                        span,
                        op: op!(unary, "+"),
                        arg: value,
                    })
                }
            }
            Expr::Assign(a @ AssignExpr { op: op!("="), .. }) => {
                if let (
                    AssignTarget::Simple(SimpleAssignTarget::Ident(l_id)),
                    Expr::Unary(UnaryExpr {
                        op: op!(unary, "+"),
                        arg,
                        ..
                    }),
                ) = (&a.left, &*a.right)
                {
                    if let Expr::Ident(r_id) = &**arg {
                        if l_id.id.eq_ignore_span(r_id) {
                            report_change!("numbers: Turn a = +a into a *= 1");
                            self.changed = true;

                            a.op = op!("*=");
                            a.right = Box::new(Expr::Lit(Lit::Num(Number {
                                span: DUMMY_SP,
                                value: 1.0,
                                raw: None,
                            })))
                        }
                    }
                }
            }
            _ => (),
        }
    }
}
