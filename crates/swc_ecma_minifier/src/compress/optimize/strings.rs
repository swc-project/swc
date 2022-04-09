use swc_atoms::js_word;
use swc_common::{util::take::Take, Spanned};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, ExprExt, Value::Known};

use super::Optimizer;
use crate::mode::Mode;

impl<M> Optimizer<'_, M>
where
    M: Mode,
{
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
            if args.iter().any(|arg| arg.expr.may_have_side_effects()) {
                return;
            }

            match &**callee {
                Expr::Ident(Ident {
                    sym: js_word!("RegExp"),
                    ..
                }) if self.options.unsafe_regexp => {
                    if args.len() != 1 {
                        return;
                    }

                    self.optimize_expr_in_str_ctx(&mut args[0].expr);

                    if let Expr::Lit(Lit::Str(..)) = &*args[0].expr {
                        self.changed = true;
                        tracing::debug!(
                            "strings: Unsafely reduced `RegExp` call in a string context"
                        );

                        *e = *args[0].expr.take();
                    }
                }
                _ => {}
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
                    tracing::debug!("string: Removed a paren in a string context");
                }

                return;
            }
            _ => {}
        }

        let value = n.as_string();
        if let Known(value) = value {
            let span = n.span();

            self.changed = true;
            tracing::debug!(
                "strings: Converted an expression into a string literal (in string context)"
            );
            *n = Expr::Lit(Lit::Str(Str {
                span,
                raw: None,
                value: value.into(),
            }));
            return;
        }

        match n {
            Expr::Lit(Lit::Num(v)) => {
                self.changed = true;
                tracing::debug!(
                    "strings: Converted a numeric literal ({}) into a string literal (in string \
                     context)",
                    v.value
                );

                let value = format!("{:?}", v.value);

                *n = Expr::Lit(Lit::Str(Str {
                    span: v.span,
                    raw: None,
                    value: value.into(),
                }));
            }

            Expr::Lit(Lit::Regex(v)) => {
                if !self.options.evaluate {
                    return;
                }
                self.changed = true;
                tracing::debug!(
                    "strings: Converted a regex (/{}/{}) into a string literal (in string context)",
                    v.exp,
                    v.flags
                );

                let value = format!("/{}/{}", v.exp, v.flags);

                *n = Expr::Lit(Lit::Str(Str {
                    span: v.span,
                    raw: None,
                    value: value.into(),
                }));
            }

            Expr::Ident(i) => {
                if !self.options.evaluate || !self.options.reduce_vars {
                    return;
                }
                if self
                    .data
                    .vars
                    .get(&i.to_id())
                    .map(|v| {
                        v.declared
                            && !v.var_initialized
                            && !v.cond_init
                            && v.assign_count == 0
                            && !v.declared_as_fn_param
                    })
                    .unwrap_or(false)
                {
                    self.changed = true;
                    tracing::debug!(
                        "strings: Converting an unresolved reference ({}{:?}) into `undefined` \
                         (in string context)",
                        i.sym,
                        i.span.ctxt
                    );

                    *n = Expr::Lit(Lit::Str(Str {
                        span: i.span,
                        raw: None,
                        value: js_word!("undefined"),
                    }));
                }
            }

            _ => {}
        }
    }
}
