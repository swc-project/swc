use crate::{pass::Pass, util::ExprFactory};
use ast::*;
use swc_common::{Fold, FoldWith, Spanned};

pub fn fixer() -> impl Pass + Clone {
    Fixer
}

#[derive(Clone, Copy)]
struct Fixer;

impl Fold<Stmt> for Fixer {
    fn fold(&mut self, stmt: Stmt) -> Stmt {
        let stmt = stmt.fold_children(self);

        match stmt {
            // It's important for arrow pass to work properly.
            Stmt::Expr(expr @ box Expr::Fn(FnExpr { ident: None, .. })) => {
                Stmt::Expr(box expr.wrap_with_paren())
            }
            _ => stmt,
        }
    }
}

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
            Expr::Member(MemberExpr {
                span,
                computed,
                obj: ExprOrSuper::Expr(obj @ box Expr::Fn(_)),
                prop,
            })
            | Expr::Member(MemberExpr {
                span,
                computed,
                obj: ExprOrSuper::Expr(obj @ box Expr::Assign(_)),
                prop,
            }) => MemberExpr {
                span,
                computed,
                obj: obj.wrap_with_paren().as_obj(),
                prop,
            }
            .into(),
            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(callee @ box Expr::Fn(_)),
                args,
                type_args,
            }) => Expr::Call(CallExpr {
                span,
                callee: callee.wrap_with_paren().as_callee(),
                args,
                type_args,
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
