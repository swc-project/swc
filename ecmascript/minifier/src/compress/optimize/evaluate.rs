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
                //
                if bin.left.may_have_side_effects() {
                    return;
                }

                let rn = bin.right.as_number();
                if Known(0.0) == rn {
                    // It's NaN
                    self.changed = true;
                    log::trace!("evaluate: `foo / 0` => `NaN`");
                    *e = Expr::Ident(Ident::new(js_word!("NaN"), bin.span));
                    return;
                }
            }

            _ => {}
        }
    }
}
