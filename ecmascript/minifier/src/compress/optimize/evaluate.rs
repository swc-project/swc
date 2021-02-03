use std::num::FpCategory;

use super::Optimizer;
use swc_atoms::js_word;
use swc_common::SyntaxContext;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::undefined;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::Value::Known;

/// Methods related to the option `evaludate`.
impl Optimizer {
    /// Evaludate expression if possible.
    ///
    /// This method call apppropriate methods for each ast types.
    pub(super) fn evaluate(&mut self, e: &mut Expr) {
        self.eval_global_vars(e);

        self.eval_numbers(e);
        self.eval_str_method_call(e);
    }

    fn eval_global_vars(&mut self, e: &mut Expr) {
        if self.options.ie8 {
            return;
        }

        if self.ctx.is_delete_arg || self.ctx.is_update_arg || self.ctx.is_lhs_of_assign {
            return;
        }

        // We should not convert used-defined `undefined` to `void 0`.
        match e {
            Expr::Ident(i) => {
                if self
                    .data
                    .as_ref()
                    .and_then(|data| data.vars.get(&i.to_id()))
                    .map(|var| var.declared)
                    .unwrap_or(false)
                {
                    return;
                }
            }
            _ => {}
        }

        match e {
            Expr::Ident(Ident {
                span,
                sym: js_word!("undefined"),
                ..
            }) => {
                log::trace!("evaluate: `undefined` -> `void 0`");
                self.changed = true;
                *e = *undefined(*span);
                return;
            }

            Expr::Ident(Ident {
                span,
                sym: js_word!("Infinity"),
                ..
            }) => {
                log::trace!("evaluate: `Infinity` -> `1 / 0`");
                self.changed = true;
                *e = Expr::Bin(BinExpr {
                    span: span.with_ctxt(self.done_ctxt),
                    op: op!("/"),
                    left: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: 1.0,
                    }))),
                    right: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: 0.0,
                    }))),
                });
                return;
            }

            Expr::Ident(Ident {
                span,
                sym: js_word!("NaN"),
                ..
            }) => {
                log::trace!("evaluate: `NaN` -> `0 / 0`");
                self.changed = true;
                *e = Expr::Bin(BinExpr {
                    span: span.with_ctxt(self.done_ctxt),
                    op: op!("/"),
                    left: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: 0.0,
                    }))),
                    right: Box::new(Expr::Lit(Lit::Num(Number {
                        span: DUMMY_SP,
                        value: 0.0,
                    }))),
                });
                return;
            }

            _ => {}
        }
    }

    fn eval_str_method_call(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        let call = match e {
            Expr::Call(v) => v,
            _ => return,
        };

        let (s, method) = match &call.callee {
            ExprOrSuper::Super(_) => return,
            ExprOrSuper::Expr(callee) => match &**callee {
                Expr::Member(MemberExpr {
                    obj: ExprOrSuper::Expr(obj),
                    prop,
                    computed: false,
                    ..
                }) => match (&**obj, &**prop) {
                    (Expr::Lit(Lit::Str(s)), Expr::Ident(prop)) => (s.clone(), prop.sym.clone()),
                    _ => return,
                },
                _ => return,
            },
        };

        let new_val = match &*method {
            "toLowerCase" => s.value.to_lowercase(),
            "toUpperCase" => s.value.to_uppercase(),
            "charCodeAt" => {
                if call.args.len() != 1 {
                    return;
                }
                if let Expr::Lit(Lit::Num(Number { value, .. })) = &*call.args[0].expr {
                    if value.fract() != 0.0 {
                        return;
                    }

                    let idx = value.round() as i64 as usize;
                    let c = s.value.chars().nth(idx);
                    match c {
                        Some(v) => {
                            self.changed = true;
                            log::trace!("evaluate: Evaluated `charCodeAt` of a string literal",);
                            *e = Expr::Lit(Lit::Num(Number {
                                span: call.span,
                                value: v as usize as f64,
                            }))
                        }
                        None => {}
                    }
                }
                return;
            }
            _ => return,
        };

        self.changed = true;
        log::trace!("evaluate: Evaluated `{}` of a string literal", method);
        *e = Expr::Lit(Lit::Str(Str {
            value: new_val.into(),
            ..s
        }));
    }

    fn eval_numbers(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        if self.ctx.is_delete_arg || self.ctx.is_update_arg || self.ctx.is_lhs_of_assign {
            return;
        }

        match e {
            Expr::Bin(bin @ BinExpr { op: op!("/"), .. }) => {
                let ln = bin.left.as_number();

                let rn = bin.right.as_number();
                match (ln, rn) {
                    (Known(ln), Known(rn)) => {
                        // Prefer `0/0` over NaN.
                        if ln == 0.0 && rn == 0.0 {
                            return;
                        }
                        // Prefer `1/0` over Infinity.
                        if ln == 1.0 && rn == 0.0 {
                            return;
                        }

                        // It's NaN
                        match (ln.classify(), rn.classify()) {
                            (FpCategory::Zero, FpCategory::Zero) => {
                                self.changed = true;
                                log::trace!("evaluate: `0 / 0` => `NaN`");

                                // Sign does not matter for NaN
                                *e = Expr::Ident(Ident::new(
                                    js_word!("NaN"),
                                    bin.span.with_ctxt(SyntaxContext::empty()),
                                ));
                                return;
                            }
                            (FpCategory::Normal, FpCategory::Zero) => {
                                self.changed = true;
                                log::trace!("evaluate: `constant / 0` => `Infinity`");

                                // Sign does not matter for NaN
                                *e = if ln.is_sign_positive() == rn.is_sign_positive() {
                                    Expr::Ident(Ident::new(
                                        js_word!("Infinity"),
                                        bin.span.with_ctxt(SyntaxContext::empty()),
                                    ))
                                } else {
                                    Expr::Unary(UnaryExpr {
                                        span: bin.span,
                                        op: op!(unary, "-"),
                                        arg: Box::new(Expr::Ident(Ident::new(
                                            js_word!("NaN"),
                                            bin.span.with_ctxt(SyntaxContext::empty()),
                                        ))),
                                    })
                                };
                                return;
                            }
                            _ => {}
                        }
                        return;
                    }
                    _ => {}
                }
            }

            _ => {}
        }
    }
}
