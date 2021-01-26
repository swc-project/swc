use super::Optimizer;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;

impl Optimizer {
    /// `!(a && b)` => `!a || !b`
    pub(super) fn optimize_bools(&mut self, e: &mut Expr) {
        if !self.options.bools {
            return;
        }

        match e {
            Expr::Unary(UnaryExpr {
                span,
                op: op!("!"),
                arg,
                ..
            }) => match &mut **arg {
                Expr::Bin(BinExpr {
                    op: op!("&&"),
                    left,
                    right,
                    ..
                }) => {
                    log::trace!("Optimizing ``!(a && b)` as `!a || !b`");
                    self.changed = true;
                    *e = Expr::Bin(BinExpr {
                        span: *span,
                        op: op!("||"),
                        left: Box::new(Expr::Unary(UnaryExpr {
                            span: DUMMY_SP,
                            op: op!("!"),
                            arg: left.take(),
                        })),
                        right: Box::new(Expr::Unary(UnaryExpr {
                            span: DUMMY_SP,
                            op: op!("!"),
                            arg: right.take(),
                        })),
                    });
                    return;
                }
                _ => {}
            },
            _ => {}
        }
    }
}
