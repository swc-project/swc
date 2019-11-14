use crate::pass::Pass;
use ast::*;
use std::mem;
use swc_common::{Fold, FoldWith, Spanned, DUMMY_SP};
use util::{prepend, undefined, StmtLike};

#[cfg(test)]
mod tests;

pub fn optional_chaining() -> impl Pass {
    OptChaining::default()
}

#[derive(Debug, Default)]
struct OptChaining {
    vars: Vec<VarDeclarator>,
}

impl<T> Fold<Vec<T>> for OptChaining
where
    T: StmtLike + FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let mut stmts = stmts.fold_children(self);

        if !self.vars.is_empty() {
            prepend(
                &mut stmts,
                T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    declare: false,
                    kind: VarDeclKind::Var,
                    decls: mem::replace(&mut self.vars, vec![]),
                }))),
            );
        }

        stmts
    }
}

impl Fold<Expr> for OptChaining {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = match e {
            Expr::TsOptChain(e) => Expr::Cond(self.unwrap(e)),
            _ => e,
        };

        e.fold_children(self)
    }
}

impl OptChaining {
    fn unwrap(&mut self, e: TsOptChain) -> CondExpr {
        let span = e.span;
        let cons = undefined(span);

        match *e.expr.clone() {
            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(box obj),
                prop,
                computed,
                ..
            }) => {
                println!("Folding {:?}", e.expr);
                let obj = match obj {
                    Expr::TsOptChain(o) => {
                        let o_span = o.span;
                        let mut obj = self.unwrap(o);

                        return CondExpr {
                            alt: box Expr::TsOptChain(TsOptChain {
                                span: o_span,
                                expr: obj.alt,
                            }),
                            ..obj
                        };
                    }
                    _ => obj,
                };
                let obj_span = obj.span();

                let (left, right, alt) = match obj {
                    Expr::Ident(..) => (box obj.clone(), box obj.clone(), e.expr),
                    _ => {
                        let i = private_ident!(obj_span, "ref");
                        println!("VAR {}: {:?}", i.sym, obj);
                        self.vars.push(VarDeclarator {
                            span: obj_span,
                            definite: false,
                            name: Pat::Ident(i.clone()),
                            init: None,
                        });

                        (
                            box Expr::Ident(i.clone()),
                            box Expr::Ident(i.clone()),
                            box Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(box Pat::Ident(i.clone())),
                                op: op!("="),
                                right: box Expr::Member(MemberExpr {
                                    obj: ExprOrSuper::Expr(box Expr::Ident(i)),
                                    computed,
                                    span,
                                    prop,
                                }),
                            }),
                        )
                    }
                };

                let test = box Expr::Bin(BinExpr {
                    span,
                    left: box Expr::Bin(BinExpr {
                        span: obj_span,
                        left,
                        op: op!("==="),
                        right: box Expr::Lit(Lit::Null(Null { span: DUMMY_SP })),
                    }),
                    op: op!("||"),
                    right: box Expr::Bin(BinExpr {
                        span: obj_span,
                        left: right,
                        op: op!("==="),
                        right: undefined(span),
                    }),
                });

                CondExpr {
                    span,
                    test,
                    cons,
                    alt,
                }
            }

            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(box obj),
                ..
            }) => unimplemented!("Optional chaining: CallExpr"),
            _ => unreachable!("TsOptChain.expr = {:?}", e.expr),
        }
    }
}
