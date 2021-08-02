use crate::compress::util::is_pure_undefined_or_null;

use super::Pure;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::{undefined, ExprExt, Value::Known};

impl Pure<'_> {
    pub(super) fn evaluate(&mut self, e: &mut Expr) {
        self.eval_opt_chain(e);
    }

    fn eval_opt_chain(&mut self, e: &mut Expr) {
        let opt = match e {
            Expr::OptChain(e) => e,
            _ => return,
        };

        match &mut *opt.expr {
            Expr::Member(MemberExpr {
                span,
                obj: ExprOrSuper::Expr(obj),
                ..
            }) => {
                //
                if is_pure_undefined_or_null(&obj) {
                    self.modified_node = true;

                    log::debug!(
                        "evaluate: Reduced an optioanl chaining operation because object is \
                         always null or undefined"
                    );

                    *e = *undefined(*span);
                    return;
                }
            }

            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(callee),
                ..
            }) => {
                if is_pure_undefined_or_null(&callee) {
                    self.modified_node = true;
                    log::debug!(
                        "evaluate: Reduced a call expression with optioanl chaining operation \
                         because object is always null or undefined"
                    );

                    *e = *undefined(*span);
                    return;
                }
            }

            _ => {}
        }
    }

    ///
    /// - `Object(1) && 1 && 2` => `Object(1) && 2`.
    pub(super) fn drop_useless_logical_operands(&mut self, e: &mut BinExpr) {
        if !self.options.evaluate {
            return;
        }
        if e.left.is_invalid() || e.right.is_invalid() {
            return;
        }

        match e.op {
            op!("&&") | op!("||") => {}
            _ => return,
        }

        match &mut *e.left {
            Expr::Bin(left) => {
                if left.op != e.op {
                    return;
                }
                // Remove rhs of lhs if possible.

                let v = left.right.as_pure_bool();
                if let Known(v) = v {
                    // As we used as_pure_bool, we can drop it.
                    if v && e.op == op!("&&") {
                        self.modified_node = true;

                        log::debug!("Removing `b` from `a && b && c` because b is always truthy");

                        left.right.take();
                        return;
                    }

                    if !v && e.op == op!("||") {
                        self.modified_node = true;

                        log::debug!("Removing `b` from `a || b || c` because b is always falsy");

                        left.right.take();
                        return;
                    }
                }
            }
            _ => return,
        }
    }
}
