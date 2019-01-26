use crate::{pass::Pass, util::ExprFactory};
use ast::*;
use swc_common::{Fold, FoldWith, Spanned};

pub fn fixer() -> impl Pass + Clone {
    Fixer {
        ctx: Context::Default,
    }
}

#[derive(Clone, Copy)]
struct Fixer {
    ctx: Context,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum Context {
    Default,
    ForcedExpr,
}

impl Fold<VarDeclarator> for Fixer {
    fn fold(&mut self, node: VarDeclarator) -> VarDeclarator {
        let name = node.name.fold_children(self);

        let old = self.ctx;
        self.ctx = Context::ForcedExpr;
        let init = node.init.fold_with(self);
        self.ctx = old;

        VarDeclarator { name, init, ..node }
    }
}

impl Fold<Stmt> for Fixer {
    fn fold(&mut self, stmt: Stmt) -> Stmt {
        let old = self.ctx;
        self.ctx = Context::Default;

        let stmt = stmt.fold_children(self);
        let stmt = match stmt {
            // It's important for arrow pass to work properly.
            Stmt::Expr(expr @ box Expr::Fn(FnExpr { ident: None, .. })) => {
                Stmt::Expr(box expr.wrap_with_paren())
            }
            Stmt::Expr(box Expr::Paren(ParenExpr { span, expr })) => match *expr {
                Expr::Object(..) | Expr::Fn(..) => {
                    Stmt::Expr(box Expr::Paren(ParenExpr { span, expr }))
                }
                _ => Stmt::Expr(expr),
            },
            Stmt::Expr(expr @ box Expr::Object(..)) | Stmt::Expr(expr @ box Expr::Fn(..)) => {
                Stmt::Expr(box Expr::Paren(ParenExpr {
                    span: expr.span(),
                    expr,
                }))
            }

            // ({ a } = foo)
            Stmt::Expr(box Expr::Assign(AssignExpr {
                span,
                left: PatOrExpr::Pat(left @ box Pat::Object(..)),
                op,
                right,
            })) => Stmt::Expr(box Expr::Paren(ParenExpr {
                span,
                expr: box Expr::Assign(AssignExpr {
                    span,
                    left: PatOrExpr::Pat(left),
                    op,
                    right,
                }),
            })),
            _ => stmt,
        };

        self.ctx = old;

        stmt
    }
}

macro_rules! context_fn_args {
    ($T:tt) => {
        impl Fold<$T> for Fixer {
            fn fold(&mut self, node: $T) -> $T {
                let $T {
                    span,
                    callee,
                    args,
                    type_args,
                } = node;

                let old = self.ctx;
                self.ctx = Context::ForcedExpr;
                let args = args.fold_with(self);
                self.ctx = old;

                $T {
                    span,
                    callee: callee.fold_children(self),
                    args,
                    type_args,
                }
            }
        }
    };
}
context_fn_args!(NewExpr);
context_fn_args!(CallExpr);

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

            // Function expression cannot start with `function`
            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(callee @ box Expr::Fn(_)),
                args,
                type_args,
            }) => {
                if self.ctx == Context::ForcedExpr {
                    Expr::Call(CallExpr {
                        span,
                        callee: callee.as_callee(),
                        args,
                        type_args,
                    })
                } else {
                    Expr::Call(CallExpr {
                        span,
                        callee: callee.wrap_with_paren().as_callee(),
                        args,
                        type_args,
                    })
                }
            }
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

#[cfg(test)]
mod tests {
    use super::*;

    macro_rules! identical {
        ($name:ident, $src:literal) => {
            test!(Default::default(), fixer(), $name, $src, $src);
        };
    }

    identical!(fn_expr_position, r#"foo(function(){}())"#);

    identical!(fn_decl, r#"function foo(){}"#);

    identical!(iife, r#"(function(){})()"#);
}
