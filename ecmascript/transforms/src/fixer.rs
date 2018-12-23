use crate::util::ExprFactory;
use ast::*;
use swc_common::{Fold, FoldWith, Spanned};

pub fn fixer() -> impl Fold<Module> {
    Fixer
}

#[derive(Debug)]
struct Fixer;

impl Fold<Expr> for Fixer {
    fn fold(&mut self, expr: Expr) -> Expr {
        let mut expr = match expr {
            Expr::Paren(..) => expr,
            _ => expr.fold_children(self),
        };

        let span = expr.span();

        match expr {
            Expr::Seq(SeqExpr { ref mut exprs, .. }) if exprs.len() == 1 => *exprs.pop().unwrap(),
            Expr::Seq(..) => ParenExpr {
                span,
                expr: box expr,
            }
            .into(),
            // It's important for arrow pass to work properly.
            Expr::Fn(FnExpr { ident: None, .. }) => expr.wrap_with_paren(),
            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(callee @ box Expr::Fn(_)),
                args,
            }) => Expr::Call(CallExpr {
                span,
                callee: callee.wrap_with_paren().as_callee(),
                args,
            }),
            _ => expr,
        }
    }
}

impl Fold<BinExpr> for Fixer {
    fn fold(&mut self, expr: BinExpr) -> BinExpr {
        let expr = expr.fold_children(self);

        match *expr.left {
            // While simplifying, (1 + x) * Nan becomes `1 + x * Nan`.
            // But it should be `(1 + x) * Nan`
            Expr::Bin(BinExpr { op: op_of_lhs, .. }) => {
                if op_of_lhs.precedence() < expr.op.precedence() {
                    return BinExpr {
                        left: box expr.left.wrap_with_paren(),
                        ..expr
                    };
                } else {
                    expr
                }
            }
            Expr::Cond(cond_expr) => BinExpr {
                left: box cond_expr.wrap_with_paren(),
                ..expr
            },
            _ => expr,
        }
    }
}
