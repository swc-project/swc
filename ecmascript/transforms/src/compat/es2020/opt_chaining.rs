use crate::{
    pass::Pass,
    util::{prepend, undefined, ExprFactory, StmtLike},
};
use std::{fmt::Debug, iter::once, mem};
use swc_common::{Fold, FoldWith, Spanned, DUMMY_SP};
use swc_ecma_ast::*;

pub fn optional_chaining() -> impl Pass {
    OptChaining::default()
}

#[derive(Debug, Default)]
struct OptChaining {
    vars: Vec<VarDeclarator>,
}

noop_fold_type!(OptChaining);

impl<T> Fold<Vec<T>> for OptChaining
where
    T: Debug + StmtLike + FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        // This is to support nested block statements
        let old = mem::replace(&mut self.vars, vec![]);

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

        self.vars = old;
        stmts
    }
}

impl Fold<Expr> for OptChaining {
    fn fold(&mut self, e: Expr) -> Expr {
        let e = match e {
            Expr::OptChain(e) => Expr::Cond(validate!(self.unwrap(e))),
            Expr::Unary(e) => validate!(self.handle_unary(e)),
            Expr::Member(e) => validate!(self.handle_member(e)),
            Expr::Call(e) => validate!(self.handle_call(e)),
            _ => e,
        };

        validate!(e.fold_children(self))
    }
}

impl OptChaining {
    /// Only called from [Fold<Expr>].
    fn handle_unary(&mut self, e: UnaryExpr) -> Expr {
        let span = e.span;

        if let op!("delete") = e.op {
            match *e.arg {
                Expr::OptChain(o) => {
                    let expr = self.unwrap(o);

                    return CondExpr {
                        span,
                        alt: box Expr::Unary(UnaryExpr {
                            span,
                            op: op!("delete"),
                            arg: expr.alt,
                        }),
                        ..expr
                    }
                    .into();
                }

                Expr::Member(MemberExpr {
                    span,
                    obj: ExprOrSuper::Expr(box Expr::OptChain(o)),
                    prop,
                    computed,
                }) => {
                    let expr = validate!(self.unwrap(o));

                    return CondExpr {
                        span: DUMMY_SP,
                        alt: box Expr::Unary(UnaryExpr {
                            span,
                            op: op!("delete"),
                            arg: box Expr::Member(MemberExpr {
                                span,
                                obj: ExprOrSuper::Expr(expr.alt),
                                prop,
                                computed,
                            }),
                        }),
                        ..expr
                    }
                    .into();
                }
                _ => {}
            }
        }

        Expr::Unary(e)
    }

    /// Only called from [Fold<Expr>].
    fn handle_call(&mut self, e: CallExpr) -> Expr {
        if let ExprOrSuper::Expr(box Expr::OptChain(o)) = e.callee {
            let expr = self.unwrap(o);

            return CondExpr {
                span: DUMMY_SP,
                alt: box Expr::Call(CallExpr {
                    callee: ExprOrSuper::Expr(expr.alt),
                    ..e
                }),
                ..expr
            }
            .into();
        }

        Expr::Call(e)
    }

    /// Only called from `[Fold<Expr>].
    fn handle_member(&mut self, e: MemberExpr) -> Expr {
        let obj = if let ExprOrSuper::Expr(box Expr::Member(obj)) = e.obj {
            let obj = self.handle_member(obj);

            match obj {
                Expr::Cond(obj) => {
                    //
                    return CondExpr {
                        span: DUMMY_SP,
                        alt: box Expr::Member(MemberExpr {
                            obj: ExprOrSuper::Expr(obj.alt),
                            ..e
                        }),
                        ..obj
                    }
                    .into();
                }
                _ => ExprOrSuper::Expr(box obj),
            }
        } else {
            e.obj
        };

        if let ExprOrSuper::Expr(box Expr::OptChain(o)) = obj {
            let expr = self.unwrap(o);

            return CondExpr {
                span: DUMMY_SP,
                alt: box Expr::Member(MemberExpr {
                    obj: ExprOrSuper::Expr(expr.alt),
                    ..e
                }),
                ..expr
            }
            .into();
        }

        Expr::Member(MemberExpr { obj, ..e })
    }

    fn unwrap(&mut self, e: OptChainExpr) -> CondExpr {
        let span = e.span;
        let cons = undefined(span);

        match *e.expr {
            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(box Expr::OptChain(o)),
                prop,
                computed,
                span: m_span,
            }) => {
                let o_span = o.span;
                let obj = self.unwrap(o);

                let alt = box Expr::Member(MemberExpr {
                    span: m_span,
                    obj: ExprOrSuper::Expr(obj.alt),
                    prop,
                    computed,
                });
                let alt = box Expr::OptChain(OptChainExpr {
                    span: o_span,
                    expr: alt,
                });

                return validate!(CondExpr { alt, ..obj });
            }

            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(box Expr::OptChain(o)),
                args,
                type_args,
            }) => {
                let obj = self.unwrap(o);

                let alt = box Expr::Call(CallExpr {
                    span,
                    callee: ExprOrSuper::Expr(obj.alt),
                    args,
                    type_args,
                });
                let alt = box Expr::OptChain(OptChainExpr { span, expr: alt });

                return validate!(CondExpr {
                    span: DUMMY_SP,
                    alt,
                    ..obj
                });
            }

            _ => {}
        }

        match *e.expr.clone() {
            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(box obj),
                prop,
                computed,
                ..
            }) => {
                let obj_span = obj.span();

                let (left, right, alt) = match obj {
                    Expr::Ident(..) => (box obj.clone(), box obj, e.expr),
                    _ => {
                        let i = private_ident!(obj_span, "ref");
                        self.vars.push(VarDeclarator {
                            span: obj_span,
                            definite: false,
                            name: Pat::Ident(i.clone()),
                            init: None,
                        });

                        (
                            box Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(box Pat::Ident(i.clone())),
                                op: op!("="),
                                right: box obj,
                            }),
                            box Expr::Ident(i.clone()),
                            validate!(box Expr::Member(MemberExpr {
                                obj: ExprOrSuper::Expr(box Expr::Ident(i)),
                                computed,
                                span: DUMMY_SP,
                                prop,
                            })),
                        )
                    }
                };

                let right = validate!(box Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    left: right,
                    op: op!("==="),
                    right: undefined(span),
                }));

                let test = validate!(box Expr::Bin(BinExpr {
                    span,
                    left: box Expr::Bin(BinExpr {
                        span: obj_span,
                        left,
                        op: op!("==="),
                        right: box Expr::Lit(Lit::Null(Null { span: DUMMY_SP })),
                    }),
                    op: op!("||"),
                    right,
                }));

                validate!(CondExpr {
                    span,
                    test,
                    cons,
                    alt,
                })
            }

            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(box obj),
                args,
                type_args,
                ..
            }) => {
                let obj_span = obj.span();
                let is_super_access = match obj {
                    Expr::Member(MemberExpr {
                        obj: ExprOrSuper::Super(..),
                        ..
                    }) => true,
                    _ => false,
                };

                let (left, right, alt) = match obj {
                    Expr::Ident(..) => (box obj.clone(), box obj, e.expr),
                    _ => {
                        let i = private_ident!(obj_span, "ref");
                        self.vars.push(VarDeclarator {
                            span: obj_span,
                            definite: false,
                            name: Pat::Ident(i.clone()),
                            init: None,
                        });

                        (
                            box Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(box Pat::Ident(i.clone())),
                                op: op!("="),
                                right: box obj,
                            }),
                            box Expr::Ident(i.clone()),
                            box Expr::Call(CallExpr {
                                span,
                                callee: ExprOrSuper::Expr(box Expr::Member(MemberExpr {
                                    span: DUMMY_SP,
                                    obj: ExprOrSuper::Expr(box Expr::Ident(i.clone())),
                                    prop: box Expr::Ident(Ident::new("call".into(), span)),
                                    computed: false,
                                })),
                                // TODO;
                                args: once(if is_super_access {
                                    ThisExpr { span }.as_arg()
                                } else {
                                    i.as_arg()
                                })
                                .chain(args)
                                .collect(),
                                type_args,
                            }),
                        )
                    }
                };

                let test = box Expr::Bin(BinExpr {
                    span,
                    left: box Expr::Bin(BinExpr {
                        span: DUMMY_SP,
                        left,
                        op: op!("==="),
                        right: box Expr::Lit(Lit::Null(Null { span: DUMMY_SP })),
                    }),
                    op: op!("||"),
                    right: box Expr::Bin(BinExpr {
                        span: DUMMY_SP,
                        left: right,
                        op: op!("==="),
                        right: undefined(span),
                    }),
                });

                validate!(CondExpr {
                    span: DUMMY_SP,
                    test,
                    cons,
                    alt,
                })
            }
            _ => unreachable!("TsOptChain.expr = {:?}", e.expr),
        }
    }
}
