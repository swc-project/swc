use crate::option::CompressOptions;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::ext::MapWithMut;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

pub fn postcompress_optimizer<'a>(options: &'a CompressOptions) -> impl 'a + VisitMut {
    PostcompressOptimizer { options }
}

struct PostcompressOptimizer<'a> {
    options: &'a CompressOptions,
}

impl VisitMut for PostcompressOptimizer<'_> {
    noop_visit_mut_type!();

    fn visit_mut_if_stmt(&mut self, s: &mut IfStmt) {
        s.visit_mut_children_with(self);

        match &mut *s.test {
            Expr::Bin(BinExpr {
                op: op @ op!("||") | op @ op!("&&"),
                right,
                ..
            }) => match &mut **right {
                Expr::Unary(UnaryExpr {
                    op: op!("!"), arg, ..
                }) => {
                    let new_op = if *op == op!("&&") {
                        op!("||")
                    } else {
                        op!("&&")
                    };

                    log::trace!(
                        "bools: `(a {} !b)` => `(a {} b)` (in bool context)",
                        *op,
                        new_op
                    );
                    *op = new_op;
                    *right = arg.take();
                    return;
                }

                _ => {}
            },

            _ => {}
        }
    }
}
