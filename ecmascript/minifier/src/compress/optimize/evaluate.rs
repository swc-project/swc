use std::num::FpCategory;

use super::Optimizer;
use swc_atoms::js_word;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::undefined;
use swc_ecma_utils::ExprExt;
use swc_ecma_utils::Value::Known;

/// Methods related to the option `evaludate`.
impl Optimizer {
    /// Evaludate expression if possible.
    ///
    /// This method call apppropriate methods for each ast types.
    pub(super) fn evaluate(&mut self, e: &mut Expr) {
        if !self.options.evaluate {
            return;
        }

        match e {
            Expr::Ident(Ident {
                span,
                sym: js_word!("undefined"),
                ..
            }) => {
                // We should not convert used-defined `undefined` to `void 0`.
                if self
                    .data
                    .as_ref()
                    .and_then(|data| data.vars.get(&(js_word!("undefined"), span.ctxt)))
                    .map(|var| var.declared)
                    .unwrap_or(false)
                {
                    return;
                }

                log::trace!("evaluate: `undefined` -> `void 0`");
                self.changed = true;
                *e = *undefined(*span);
                return;
            }

            _ => {}
        }

        self.eval_numbers(e);
        self.eval_str_method_call(e);
    }

    fn eval_str_method_call(&mut self, e: &mut Expr) {
        let call = match e {
            Expr::Call(v) => v,
            _ => return,
        };
    }

    fn eval_numbers(&mut self, e: &mut Expr) {
        match e {
            Expr::Bin(bin @ BinExpr { op: op!("/"), .. }) => {
                let ln = bin.left.as_number();

                let rn = bin.right.as_number();
                match (ln, rn) {
                    (Known(ln), Known(rn)) => {
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
