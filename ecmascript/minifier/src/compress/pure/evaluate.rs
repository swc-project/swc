use super::Pure;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_utils::{ExprExt, Value::Known};

impl Pure<'_> {
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
                        log::debug!("Removing `b` from `a && b && c` because b is always truthy");

                        left.right.take();
                        return;
                    }

                    if !v && e.op == op!("||") {
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
