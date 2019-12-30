use crate::{
    pass::Pass,
    util::{prepend, ExprFactory, StmtLike},
};
use ast::*;
use std::mem::replace;
use swc_common::{Fold, FoldWith, Spanned, Visit, VisitWith, DUMMY_SP};

pub fn regenerator() -> impl Pass {
    Regenerator::default()
}

#[derive(Debug, Default)]
struct Regenerator {
    used: bool,
    vars: Vec<VarDeclarator>,
}

impl<T> Fold<Vec<T>> for Regenerator
where
    T: FoldWith<Self> + StmtLike,
    Vec<T>: FoldWith<Self> + VisitWith<Finder>,
{
    fn fold(&mut self, items: Vec<T>) -> Vec<T> {
        if !Finder::find(&items) {
            return items;
        }

        let mut items = items.fold_children(self);

        if !self.vars.is_empty() {
            prepend(
                &mut items,
                T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: replace(&mut self.vars, Default::default()),
                    declare: false,
                }))),
            );
        }

        items
    }
}

impl Fold<Expr> for Regenerator {
    fn fold(&mut self, e: Expr) -> Expr {
        let e: Expr = e.fold_children(self);

        match e {
            Expr::Fn(FnExpr {
                ident, function, ..
            }) if function.is_generator => {
                let marked = ident.clone().unwrap_or_else(|| private_ident!("_callee"));
                let (ident, function) = self.fold_fn(
                    Some(ident.unwrap_or_else(|| marked.clone())),
                    marked,
                    function,
                );
                return Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: member_expr!(DUMMY_SP, regeneratorRuntime.mark).as_callee(),
                    args: vec![FnExpr { ident, function }.as_arg()],
                    type_args: None,
                });
            }

            _ => {}
        }

        e
    }
}

impl Fold<FnDecl> for Regenerator {
    fn fold(&mut self, f: FnDecl) -> FnDecl {
        let f = f.fold_children(self);

        let marked = private_ident!("_marked");

        self.vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(marked.clone()),
            init: Some(box Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: member_expr!(DUMMY_SP, regeneratorRuntime.mark).as_callee(),
                args: vec![f.ident.clone().as_arg()],
                type_args: None,
            })),
            definite: false,
        });

        let (i, function) = self.fold_fn(Some(f.ident), marked, f.function);

        FnDecl {
            ident: i.unwrap(),
            function,
            ..f
        }
    }
}

impl Regenerator {
    fn fold_fn(
        &mut self,
        i: Option<Ident>,
        marked_ident: Ident,
        f: Function,
    ) -> (Option<Ident>, Function) {
        if !f.is_generator || f.body.is_none() {
            return (i, f);
        }

        let inner_name = i
            .as_ref()
            .map(|i| Ident::new(format!("{}$", i.sym).into(), i.span))
            .unwrap_or_else(|| private_ident!("ref$"));
        let ctx = private_ident!("_ctx");

        let stmts = vec![Stmt::While(WhileStmt {
            span: DUMMY_SP,
            test: box Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: 1.0,
            })),
            body: box BlockStmt {
                span: DUMMY_SP,
                stmts: vec![SwitchStmt {
                    span: DUMMY_SP,
                    // _ctx.prev = _ctx.next
                    discriminant: box AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: PatOrExpr::Expr(box ctx.clone().member(quote_ident!("prev"))),
                        right: box ctx.clone().member(quote_ident!("next")),
                    }
                    .into(),
                    cases: vec![],
                }
                .into()],
            }
            .into(),
        })];

        (
            i,
            Function {
                is_generator: false,
                body: Some(BlockStmt {
                    span: f.body.span(),
                    stmts: vec![ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(box Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: member_expr!(DUMMY_SP, regeneratorRuntime.wrap).as_callee(),
                            args: vec![
                                Expr::Fn(FnExpr {
                                    ident: Some(inner_name),
                                    function: Function {
                                        params: vec![Pat::Ident(ctx.clone())],
                                        decorators: Default::default(),
                                        span: DUMMY_SP,
                                        body: Some(BlockStmt {
                                            span: DUMMY_SP,
                                            stmts,
                                        }),
                                        is_generator: false,
                                        is_async: false,
                                        type_params: None,
                                        return_type: None,
                                    },
                                })
                                .as_arg(),
                                marked_ident.as_arg(),
                            ],
                            type_args: None,
                        })),
                    }
                    .into()],
                }),
                ..f
            },
        )
    }
}

/// Finds a generator function
struct Finder {
    found: bool,
}

impl Finder {
    fn find<T: VisitWith<Self>>(node: &T) -> bool {
        let mut v = Finder { found: false };
        node.visit_with(&mut v);
        v.found
    }
}

impl Visit<Function> for Finder {
    fn visit(&mut self, node: &Function) {
        if node.is_generator {
            self.found = true;
            return;
        }
        node.visit_children(self);
    }
}
