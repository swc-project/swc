use self::{case::CaseHandler, hoist::hoist};
use crate::{
    pass::Pass,
    util::{contains_this_expr, prepend, ExprFactory, StmtLike},
};
use ast::*;
use std::mem::replace;
use swc_common::{Fold, FoldWith, Spanned, Visit, VisitWith, DUMMY_SP};

mod case;
mod hoist;
mod leap;

pub fn regenerator() -> impl Pass {
    Regenerator::default()
}

#[derive(Debug, Default)]
struct Regenerator {
    used: bool,
    vars: Vec<VarDeclarator>,
    /// mark
    fn_vars: Vec<VarDeclarator>,
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

        if !self.fn_vars.is_empty() {
            prepend(
                &mut items,
                T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: replace(&mut self.fn_vars, Default::default()),
                }))),
            );
        }

        items
    }
}

impl Fold<Expr> for Regenerator {
    fn fold(&mut self, e: Expr) -> Expr {
        if !Finder::find(&e) {
            return e;
        }

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
        if !Finder::find(&f) {
            return f;
        }

        let f = f.fold_children(self);

        let marked = private_ident!("_marked");

        self.fn_vars.push(VarDeclarator {
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
        mut f: Function,
    ) -> (Option<Ident>, Function) {
        if !f.is_generator || f.body.is_none() {
            return (i, f);
        }

        let body_span = f.body.span();

        let inner_name = i
            .as_ref()
            .map(|i| Ident::new(format!("{}$", i.sym).into(), i.span))
            .unwrap_or_else(|| private_ident!("ref$"));
        let ctx = private_ident!("_ctx");
        let mut handler = CaseHandler::new(&ctx);

        f.body = f.body.fold_with(&mut FnSentVisitor { ctx: ctx.clone() });
        let uses_this = contains_this_expr(&f.body);
        let (mut body, vars) = hoist(f.body.unwrap());
        self.vars.extend(vars.into_iter().map(|id| VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(id),
            init: None,
            definite: false,
        }));

        handler.explode_stmts(body.stmts);

        let mut cases = vec![];

        handler.extend_cases(&mut cases);

        let try_locs_list = handler.get_try_locs_list();

        // Intentionally fall through to the "end" case...
        cases.push(SwitchCase {
            span: DUMMY_SP,
            test: Some(box Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: handler.final_loc() as _,
            }))),
            // fallthrough
            cons: vec![],
        });
        cases.push(SwitchCase {
            span: DUMMY_SP,
            test: Some(box Expr::Lit(Lit::Str(Str {
                span: DUMMY_SP,
                value: "end".into(),
                has_escape: false,
            }))),
            cons: vec![ReturnStmt {
                span: DUMMY_SP,
                // _ctx.stop()
                arg: Some(box Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: ctx.clone().member(quote_ident!("stop")).as_callee(),
                    args: vec![],
                    type_args: Default::default(),
                })),
            }
            .into()],
        });

        let mut stmts = vec![Stmt::While(WhileStmt {
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
                    cases,
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
                    span: body_span,
                    stmts: {
                        let mut buf = vec![];
                        if !self.vars.is_empty() {
                            buf.push(Stmt::Decl(Decl::Var(VarDecl {
                                span: DUMMY_SP,
                                kind: VarDeclKind::Var,
                                decls: replace(&mut self.vars, Default::default()),
                                declare: false,
                            })));
                        }

                        buf.push(
                            ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(box Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    callee: member_expr!(DUMMY_SP, regeneratorRuntime.wrap)
                                        .as_callee(),
                                    args: {
                                        let mut args = vec![Expr::Fn(FnExpr {
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
                                        .as_arg()];

                                        if f.is_generator {
                                            args.push(marked_ident.as_arg());
                                        } else if uses_this || try_locs_list.is_some() {
                                            // Async functions that are not generators
                                            // don't care about the
                                            // outer function because they don't need it
                                            // to be marked and don't
                                            // inherit from its .prototype.
                                            args.push(Lit::Null(Null { span: DUMMY_SP }).as_arg());
                                        }

                                        if uses_this {
                                            args.push(ThisExpr { span: DUMMY_SP }.as_arg())
                                        } else if try_locs_list.is_some() {
                                            args.push(Lit::Null(Null { span: DUMMY_SP }).as_arg());
                                        }

                                        if let Some(try_locs_list) = try_locs_list {
                                            args.push(try_locs_list.as_arg())
                                        }

                                        args
                                    },
                                    type_args: None,
                                })),
                            }
                            .into(),
                        );

                        buf
                    },
                }),
                ..f
            },
        )
    }
}

struct FnSentVisitor {
    ctx: Ident,
}

impl Fold<Expr> for FnSentVisitor {
    fn fold(&mut self, e: Expr) -> Expr {
        let e: Expr = e.fold_children(self);

        match e {
            Expr::MetaProp(MetaPropExpr { meta, prop })
                if meta.sym == *"function" && prop.sym == *"sent" =>
            {
                return self.ctx.clone().member(quote_ident!("_sent"));
            }

            _ => {}
        }

        e
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
