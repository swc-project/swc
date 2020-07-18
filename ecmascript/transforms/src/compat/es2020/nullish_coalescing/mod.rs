use crate::util::{alias_if_required, undefined, StmtLike};
use std::mem::replace;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

#[cfg(test)]
mod tests;

pub fn nullish_coalescing() -> impl Fold + 'static {
    NullishCoalescing::default()
}

#[derive(Debug, Default)]
struct NullishCoalescing {
    vars: Vec<VarDeclarator>,
}

impl<T> Fold<Vec<T>> for NullishCoalescing
where
    T: FoldWith<Self> + StmtLike,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let mut buf = Vec::with_capacity(stmts.len() + 2);

        for stmt in stmts {
            let stmt = stmt.fold_with(self);

            if !self.vars.is_empty() {
                buf.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: replace(&mut self.vars, Default::default()),
                    declare: false,
                }))));
            }

            buf.push(stmt);
        }

        buf
    }
}

impl Fold for NullishCoalescing {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = e.fold_children_with(self);

        match e {
            Expr::Bin(BinExpr {
                span,
                left,
                op: op!("??"),
                right,
            }) => {
                //
                let (l, aliased) = alias_if_required(&left, "ref");

                if aliased {
                    self.vars.push(VarDeclarator {
                        span: DUMMY_SP,
                        name: Pat::Ident(l.clone()),
                        init: None,
                        definite: false,
                    });
                }

                let var_expr = if aliased {
                    Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: PatOrExpr::Pat(box Pat::Ident(l.clone())),
                        right: left,
                    })
                } else {
                    Expr::Ident(l.clone())
                };

                return Expr::Cond(CondExpr {
                    span,
                    test: box Expr::Bin(BinExpr {
                        span: DUMMY_SP,
                        left: box Expr::Bin(BinExpr {
                            span: DUMMY_SP,
                            left: box var_expr,
                            op: op!("!=="),
                            right: box Expr::Lit(Lit::Null(Null { span: DUMMY_SP })),
                        }),
                        op: op!("&&"),
                        right: box Expr::Bin(BinExpr {
                            span: DUMMY_SP,
                            left: box Expr::Ident(l.clone()),
                            op: op!("!=="),
                            right: undefined(DUMMY_SP),
                        }),
                    }),
                    cons: box Expr::Ident(l.clone()),
                    alt: right,
                });
            }

            _ => {}
        }

        e
    }
}
