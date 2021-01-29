use std::num::FpCategory;

use super::Optimizer;
use swc_atoms::js_word;
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
                log::trace!("evaluate: `undefined` -> `void 0`");
                self.changed = true;
                *e = *undefined(*span);
                return;
            }

            _ => {}
        }

        self.eval_numbers(e);
    }

    fn eval_numbers(&mut self, e: &mut Expr) {
        match e {
            Expr::Bin(bin @ BinExpr { op: op!("/"), .. }) => {
                let ln = bin.left.as_number();

                let rn = bin.right.as_number();
                match (ln, rn) {
                    (Known(_ln), Known(rn)) => {
                        // It's NaN
                        match rn.classify() {
                            FpCategory::Zero => {
                                self.changed = true;
                                log::trace!("evaluate: `foo / 0` => `NaN`");

                                // Sign does not matter for NaN
                                *e = Expr::Ident(Ident::new(js_word!("NaN"), bin.span));
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
