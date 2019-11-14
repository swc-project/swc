use crate::pass::Pass;
use ast::*;
use swc_common::{Fold, FoldWith, Spanned, DUMMY_SP};
use util::StmtLike;

#[cfg(test)]
mod tests;

pub fn optional_chaining() -> impl Pass {
    OptChaining::default()
}

#[derive(Debug, Default)]
struct OptChaining {
    stmts: Vec<Stmt>,
}

impl<T> Fold<Vec<T>> for OptChaining
where
    T: StmtLike + FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let mut output = vec![];

        for stmt in stmts {
            let stmt = stmt.fold_children(self);
            output.extend(self.stmts.drain(..).map(StmtLike::from_stmt));
            output.push(stmt);
        }

        output
    }
}

impl Fold<Expr> for OptChaining {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children(self);

        match expr {
            // let x = (foo === null || foo === undefined) ? undefined : foo.bar.baz();
            Expr::TsOptChain(e) => {
                let test = {
                    match *e.expr.clone() {
                        Expr::Member(MemberExpr {
                            obj: ExprOrSuper::Expr(callee),
                            ..
                        })
                        | Expr::Call(CallExpr {
                            callee: ExprOrSuper::Expr(callee),
                            ..
                        }) => {
                            let callee_span = callee.span();

                            let cached = match *callee {
                                Expr::Ident(..) => callee,
                                _ => {
                                    let i = private_ident!(callee_span, "ref");
                                    self.stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                                        span: DUMMY_SP,
                                        declare: false,
                                        kind: VarDeclKind::Const,
                                        decls: vec![VarDeclarator {
                                            span: callee_span,
                                            definite: false,
                                            name: Pat::Ident(i.clone()),
                                            init: Some(callee),
                                        }],
                                    })));
                                    box Expr::Ident(i)
                                }
                            };

                            box Expr::Bin(BinExpr {
                                span: e.span,
                                left: box Expr::Bin(BinExpr {
                                    span: callee_span,
                                    left: cached.clone(),
                                    op: op!("==="),
                                    right: box Expr::Lit(Lit::Null(Null { span: DUMMY_SP })),
                                }),
                                op: op!("||"),
                                right: box Expr::Bin(BinExpr {
                                    span: callee_span,
                                    left: cached.clone(),
                                    op: op!("==="),
                                    right: box Expr::Ident(Ident::new(
                                        js_word!("undefined"),
                                        DUMMY_SP,
                                    )),
                                }),
                            })
                        }
                        _ => unreachable!("TsOptChain.expr = {:?}", e.expr),
                    }
                };
                let cons = {
                    // undefined
                    box Expr::Ident(Ident::new(js_word!("undefined"), e.span))
                };
                let alt = e.expr;

                Expr::Cond(CondExpr {
                    span: e.span,
                    test,
                    cons,
                    alt,
                })
            }
            _ => expr,
        }
    }
}
