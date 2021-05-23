use crate::compress::optimize::Optimizer;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;

impl Optimizer<'_> {
    pub(super) fn optimize_expr_in_num_ctx(&mut self, e: &mut Expr) {
        match e {
            Expr::Lit(Lit::Str(Str { span, value, .. })) => {
                let value = if value.is_empty() { 0f64 } else { 1f64 };

                self.changed = true;
                log::trace!("numbers: Converting a string literal to {:?}", value);
                *e = Expr::Lit(Lit::Num(Number { span: *span, value }));
                return;
            }
            _ => {}
        }
    }

    ///
    /// - `1 / -0` => `- 1 / 0`
    pub(super) fn lift_minus(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        match e {
            Expr::Bin(arg) => {
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
                        log::trace!("numbers: Lifting `-`");

                        *e = Expr::Unary(UnaryExpr {
                            span: arg.span,
                            op: op!(unary, "-"),
                            arg: Box::new(Expr::Bin(BinExpr {
                                span: arg.span,
                                op: arg.op,
                                left: arg.left.take(),
                                right: right_arg.take(),
                            })),
                        });
                        return;
                    }

                    Expr::Lit(Lit::Num(Number { span, value, .. })) => {
                        if value.is_sign_negative() {
                            self.changed = true;
                            log::trace!("numbers: Lifting `-` in a literal");

                            *e = Expr::Unary(UnaryExpr {
                                span: arg.span,
                                op: op!(unary, "-"),
                                arg: Box::new(Expr::Bin(BinExpr {
                                    span: arg.span,
                                    op: arg.op,
                                    left: arg.left.take(),
                                    right: Box::new(Expr::Lit(Lit::Num(Number {
                                        span: *span,
                                        value: -*value,
                                    }))),
                                })),
                            });
                        }
                    }

                    _ => {}
                }
            }
            _ => {}
        }
    }
}
