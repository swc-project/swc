use swc_common::{util::take::Take, EqIgnoreSpan, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::num_from_str;

use super::Optimizer;

impl Optimizer<'_> {
    pub(super) fn optimize_expr_in_num_ctx(&mut self, e: &mut Expr) {
        match e {
            Expr::Lit(Lit::Str(Str { span, value, .. })) => {
                let Some(value) = value.as_str() else {
                    return;
                };
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
            Expr::Unary(UnaryExpr {
                arg,
                op: op!(unary, "+"),
                ..
            }) => {
                self.changed = true;
                report_change!("numbers: remove useless to number");
                let new_expr = *arg.take();
                *e = new_expr
            }
            _ => (),
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

    pub(super) fn optimize_to_int(&mut self, e: &mut Expr) {
        let span = e.span();

        match e {
            Expr::Bin(bin) => match (bin.op, &mut *bin.left, &mut *bin.right) {
                (op!("|"), Expr::Bin(bin_inner), Expr::Lit(Lit::Num(n)))
                | (op!("|"), Expr::Lit(Lit::Num(n)), Expr::Bin(bin_inner))
                    if matches!(
                        bin_inner.op,
                        op!("<<") | op!(">>") | op!(">>>") | op!("|") | op!("^") | op!("&")
                    ) && n.value == 0.0 =>
                {
                    report_change!("numbers: Turn '(a & b) | 0' into 'a & b'");
                    self.changed = true;

                    let value = bin_inner.take();

                    *bin = BinExpr { span, ..value };
                }

                (
                    op!("<<") | op!(">>") | op!(">>>") | op!("|") | op!("^") | op!("&"),
                    e @ Expr::Bin(BinExpr { op: op!("|"), .. }),
                    _,
                )
                | (
                    op!("<<") | op!(">>") | op!(">>>") | op!("|") | op!("^") | op!("&"),
                    _,
                    e @ Expr::Bin(BinExpr { op: op!("|"), .. }),
                ) => {
                    if let Expr::Bin(bin) = e {
                        match (&mut *bin.left, &mut *bin.right) {
                            (Expr::Lit(Lit::Num(n)), inner) | (inner, Expr::Lit(Lit::Num(n)))
                                if n.value == 0.0 =>
                            {
                                report_change!("numbers: Turn '(a | 0) ^ b' into 'a ^ b'");
                                self.changed = true;

                                let new_expr = inner.take();

                                *e = new_expr
                            }
                            _ => {}
                        }
                    }
                }

                (
                    op!("|"),
                    Expr::Unary(u @ UnaryExpr { op: op!("~"), .. }),
                    Expr::Lit(Lit::Num(Number { value: 0.0, .. })),
                )
                | (
                    op!("|"),
                    Expr::Lit(Lit::Num(Number { value: 0.0, .. })),
                    Expr::Unary(u @ UnaryExpr { op: op!("~"), .. }),
                ) => {
                    report_change!("numbers: Turn '~a | 0' into '~a'");
                    self.changed = true;

                    let value = u.take();

                    *e = Expr::Unary(value);
                }

                (
                    op!("<<") | op!(">>") | op!("^"),
                    _,
                    Expr::Lit(Lit::Num(Number { value: 0.0, .. })),
                ) => {
                    report_change!("numbers: Turn 'a << 0' into 'a | 0'");
                    self.changed = true;
                    bin.op = op!("|");
                }
                (
                    op!("&"),
                    _,
                    Expr::Lit(Lit::Num(
                        n @ Number {
                            value: 4294967295.0, // 2^32 - 1
                            ..
                        },
                    )),
                )
                | (
                    op!("&"),
                    Expr::Lit(Lit::Num(
                        n @ Number {
                            value: 4294967295.0, // 2^32 - 1
                            ..
                        },
                    )),
                    _,
                ) => {
                    report_change!("numbers: Turn 'a & 0XFFFFFFFF' into 'a | 0'");
                    self.changed = true;
                    bin.op = op!("|");
                    n.value = 0.0;
                    n.raw = None;
                }

                _ => (),
            },

            Expr::Assign(
                a @ AssignExpr {
                    op: op!("<<=") | op!(">>=") | op!(">>>=") | op!("|=") | op!("^=") | op!("&="),
                    ..
                },
            ) => {
                if let Expr::Bin(BinExpr {
                    op: op!("|"),
                    left,
                    right,
                    ..
                }) = &mut *a.right
                {
                    if let (e, Expr::Lit(Lit::Num(Number { value: 0.0, .. })))
                    | (Expr::Lit(Lit::Num(Number { value: 0.0, .. })), e) =
                        (&mut **left, &mut **right)
                    {
                        report_change!("numbers: Turn 'a |= b | 0' into 'a |= b'");
                        self.changed = true;
                        let value = e.take();
                        *a.right = value;
                    }
                }
            }
            _ => (),
        }
    }
}
