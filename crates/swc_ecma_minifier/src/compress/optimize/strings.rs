use swc_common::{util::take::Take, Spanned, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprExt, Value::Known};

use super::Optimizer;

impl Optimizer<'_> {
    pub(super) fn optimize_expr_in_str_ctx_unsafely(&mut self, e: &mut Expr) {
        if !self.options.unsafe_passes {
            return;
        }

        if let Expr::Call(CallExpr {
            callee: Callee::Expr(callee),
            args,
            ..
        }) = e
        {
            if args
                .iter()
                .any(|arg| arg.expr.may_have_side_effects(&self.ctx.expr_ctx))
            {
                return;
            }

            if callee.is_ident_ref_to("RegExp") && self.options.unsafe_regexp {
                if args.len() != 1 {
                    return;
                }

                self.optimize_expr_in_str_ctx(&mut args[0].expr);

                if let Expr::Lit(Lit::Str(..)) = &*args[0].expr {
                    self.changed = true;
                    report_change!("strings: Unsafely reduced `RegExp` call in a string context");

                    *e = *args[0].expr.take();
                }
            }
        }
    }

    /// Convert expressions to string literal if possible.
    pub(super) fn optimize_expr_in_str_ctx(&mut self, n: &mut Expr) {
        match n {
            Expr::Lit(Lit::Str(..)) => return,
            Expr::Paren(e) => {
                self.optimize_expr_in_str_ctx(&mut e.expr);
                if let Expr::Lit(Lit::Str(..)) = &*e.expr {
                    *n = *e.expr.take();
                    self.changed = true;
                    report_change!("string: Removed a paren in a string context");
                }

                return;
            }
            _ => {}
        }

        let value = n.as_pure_string(&self.ctx.expr_ctx);
        if let Known(value) = value {
            let span = n.span();

            self.changed = true;
            report_change!(
                "strings: Converted an expression into a string literal (in string context)"
            );
            *n = Lit::Str(Str {
                span,
                raw: None,
                value: value.into(),
            })
            .into();
            return;
        }

        match n {
            Expr::Lit(Lit::Num(v)) => {
                self.changed = true;
                report_change!(
                    "strings: Converted a numeric literal ({}) into a string literal (in string \
                     context)",
                    v.value
                );

                let value = format!("{:?}", v.value);

                *n = Lit::Str(Str {
                    span: v.span,
                    raw: None,
                    value: value.into(),
                })
                .into();
            }

            Expr::Lit(Lit::Regex(v)) => {
                if !self.options.evaluate {
                    return;
                }
                self.changed = true;
                report_change!(
                    "strings: Converted a regex (/{}/{}) into a string literal (in string context)",
                    v.exp,
                    v.flags
                );

                let value = format!("/{}/{}", v.exp, v.flags);

                *n = Lit::Str(Str {
                    span: v.span,
                    raw: None,
                    value: value.into(),
                })
                .into();
            }

            Expr::Bin(BinExpr {
                span,
                op: op!("/"),
                left,
                right,
            }) => {
                if let (Expr::Lit(Lit::Num(l)), Expr::Lit(Lit::Num(r))) = (&**left, &**right) {
                    if l.value == 0.0 && r.value == 0.0 {
                        *n = Ident::new(
                            "NaN".into(),
                            *span,
                            SyntaxContext::empty().apply_mark(self.marks.unresolved_mark),
                        )
                        .into();
                        self.changed = true;
                        report_change!("strings: Evaluated 0 / 0 => NaN in string context");
                    }
                }
            }

            _ => {}
        }
    }
}
