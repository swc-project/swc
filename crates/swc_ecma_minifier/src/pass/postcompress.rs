use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::option::CompressOptions;

pub fn postcompress_optimizer(options: &CompressOptions) -> impl '_ + VisitMut {
    PostcompressOptimizer { options }
}

struct PostcompressOptimizer<'a> {
    #[allow(unused)]
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

    fn visit_mut_var_decl(&mut self, v: &mut VarDecl) {
        v.visit_mut_children_with(self);

        if let VarDeclKind::Const = v.kind {
            v.kind = VarDeclKind::Let;
        }
    }
}
