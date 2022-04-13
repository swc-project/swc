use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::{option::CompressOptions, DISABLE_BUGGY_PASSES};

pub fn postcompress_optimizer(options: &CompressOptions) -> impl '_ + VisitMut {
    PostcompressOptimizer { options }
}

struct PostcompressOptimizer<'a> {
    options: &'a CompressOptions,
}

impl PostcompressOptimizer<'_> {
    fn optimize_in_bool_ctx(&mut self, e: &mut Expr) {
        if !self.options.bools {
            return;
        }
        // This is buggy
        if DISABLE_BUGGY_PASSES {
            return;
        }

        // Note: `||` is not handled because of precedence.
        if let Expr::Bin(BinExpr {
            op: op @ op!("&&"),
            right,
            left,
            ..
        }) = e
        {
            if let Expr::Bin(BinExpr { op: op!("&&"), .. }) = &**left {
                return;
            }

            match &mut **right {
                Expr::Unary(UnaryExpr {
                    op: op!("!"), arg, ..
                }) if arg.is_ident() => {
                    let new_op = if *op == op!("&&") {
                        op!("||")
                    } else {
                        op!("&&")
                    };

                    report_change!(
                        "bools: `(a {} !b)` => `(a {} b)` (in bool context)",
                        *op,
                        new_op
                    );
                    *op = new_op;
                    *right = arg.take();
                }

                _ => {}
            }
        }
    }
}

impl VisitMut for PostcompressOptimizer<'_> {
    noop_visit_mut_type!();

    fn visit_mut_cond_expr(&mut self, e: &mut CondExpr) {
        e.visit_mut_children_with(self);

        self.optimize_in_bool_ctx(&mut *e.test);
    }

    fn visit_mut_if_stmt(&mut self, s: &mut IfStmt) {
        s.visit_mut_children_with(self);

        self.optimize_in_bool_ctx(&mut *s.test);
    }
}
