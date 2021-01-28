use super::Optimizer;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;

/// Methods related to the option `negate_iife`. All methods are noop if
/// `negate_iife` is false.
impl Optimizer {
    pub(super) fn handle_negated_iife(&mut self, e: &mut Expr) {
        if !self.options.negate_iife || self.ctx.in_bang_arg {
            return;
        }

        let expr = match e {
            Expr::Call(e) => e,
            _ => return,
        };

        let callee = match &mut expr.callee {
            ExprOrSuper::Super(_) => return,
            ExprOrSuper::Expr(e) => &mut **e,
        };

        match callee {
            Expr::Fn(..) => {
                log::trace!("negate_iife: Compressing iife");
                *e = Expr::Unary(UnaryExpr {
                    span: DUMMY_SP,
                    op: op!("!"),
                    arg: Box::new(e.take()),
                });
                return;
            }
            _ => {}
        }
    }
}
