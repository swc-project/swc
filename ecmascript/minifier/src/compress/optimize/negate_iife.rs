use std::mem::swap;

use super::Optimizer;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;

/// Methods related to the option `negate_iife`.
impl Optimizer {
    /// Negates iife, while ignore return value.
    pub(super) fn negate_iife_ignoring_ret(&mut self, e: &mut Expr) {
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
                log::trace!("negate_iife: Negating iife");
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

    /// 
    /// - `iife ? foo : bar` => `!iife ? bar : foo`
    pub(super) fn negate_iife_in_cond(&mut self, e: &mut Expr) {
        let cond = match e {
            Expr::Cond(v) => v,
            _ => return,
        };

        let test_call = match &mut *cond.test {
            Expr::Call(e) => e,
            _ => return,
        };

        let callee = match &mut test_call.callee {
            ExprOrSuper::Super(_) => return,
            ExprOrSuper::Expr(e) => &mut **e,
        };

        match callee {
            Expr::Fn(..) => {
                log::trace!("negate_iife: Swapping cons and alt");
                cond.test = Box::new(Expr::Unary(UnaryExpr {
                    span: DUMMY_SP,
                    op: op!("!"),
                    arg: cond.test.take(),
                }));
                swap(&mut cond.cons, &mut cond.alt);
                return;
            }
            _ => {}
        }
    }
}
