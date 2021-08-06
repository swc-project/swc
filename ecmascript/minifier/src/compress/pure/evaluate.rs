use crate::compress::util::is_pure_undefined_or_null;

use super::Pure;
use swc_ecma_ast::*;
use swc_ecma_utils::undefined;

impl Pure<'_> {
    pub(super) fn eval_opt_chain(&mut self, e: &mut Expr) {
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
                    self.changed = true;
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
                    self.changed = true;
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
}
