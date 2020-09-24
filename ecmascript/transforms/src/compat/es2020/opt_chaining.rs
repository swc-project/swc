use crate::{
    perf::Check,
    util::{prepend, undefined, ExprFactory, StmtLike},
};
use std::{fmt::Debug, iter::once, mem};
use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::alias_if_required;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, Node, Visit};

pub fn optional_chaining() -> impl Fold {
    OptChaining::default()
}

#[derive(Debug, Default)]
struct OptChaining {
    vars: Vec<VarDeclarator>,
}

#[fast_path(ShouldWork)]
impl Fold for OptChaining {
    noop_fold_type!();

    fn fold_expr(&mut self, e: Expr) -> Expr {
        let e = match e {
            Expr::OptChain(e) => Expr::Cond(validate!(self.unwrap(e))),
            Expr::Unary(e) => validate!(self.handle_unary(e)),
            Expr::Member(e) => match self.handle_member(e).map(Expr::Cond) {
                Ok(v) => v,
                Err(v) => v,
            },
            Expr::Call(e) => validate!(self.handle_call(e)),
            _ => e,
        };

        validate!(e.fold_children_with(self))
    }

    fn fold_module_items(&mut self, n: Vec<ModuleItem>) -> Vec<ModuleItem> {
        self.fold_stmt_like(n)
    }

    fn fold_stmts(&mut self, n: Vec<Stmt>) -> Vec<Stmt> {
        self.fold_stmt_like(n)
    }
}

impl OptChaining {
    fn fold_stmt_like<T>(&mut self, stmts: Vec<T>) -> Vec<T>
    where
        T: StmtLike + FoldWith<Self>,
        Vec<T>: FoldWith<Self>,
    {
        // This is to support nested block statements
        let old = mem::replace(&mut self.vars, vec![]);

        let mut stmts = stmts.fold_children_with(self);

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

impl OptChaining {
    /// Only called from [Fold].
    fn handle_unary(&mut self, e: UnaryExpr) -> Expr {
        let span = e.span;

        if let op!("delete") = e.op {
            match *e.arg {
                Expr::OptChain(o) => {
                    let expr = self.unwrap(o);

                    return CondExpr {
                        span,
                        alt: Box::new(Expr::Unary(UnaryExpr {
                            span,
                            op: op!("delete"),
                            arg: expr.alt,
                        })),
                        ..expr
                    }
                    .into();
                }

                Expr::Member(MemberExpr {
                    span,
                    obj: ExprOrSuper::Expr(obj),
                    prop,
                    computed,
                }) if obj.is_opt_chain() => {
                    let obj = obj.opt_chain().unwrap();
                    let expr = validate!(self.unwrap(obj));

                    return CondExpr {
                        span: DUMMY_SP,
                        alt: Box::new(Expr::Unary(UnaryExpr {
                            span,
                            op: op!("delete"),
                            arg: Box::new(Expr::Member(MemberExpr {
                                span,
                                obj: ExprOrSuper::Expr(expr.alt),
                                prop,
                                computed,
                            })),
                        })),
                        ..expr
                    }
                    .into();
                }
                _ => {}
            }
        }

        Expr::Unary(e)
    }

    /// Only called from [Fold].
    fn handle_call(&mut self, e: CallExpr) -> Expr {
        match e.callee {
            ExprOrSuper::Expr(callee) if callee.is_opt_chain() => {
                let callee = callee.opt_chain().unwrap();
                let expr = self.unwrap(callee);

                return CondExpr {
                    span: DUMMY_SP,
                    alt: Box::new(Expr::Call(CallExpr {
                        callee: ExprOrSuper::Expr(expr.alt),
                        ..e
                    })),
                    ..expr
                }
                .into();
            }
            ExprOrSuper::Expr(callee) if callee.is_member() => {
                let callee = callee.member().unwrap();
                let callee = self.handle_member(callee);

                return match callee {
                    Ok(expr) => Expr::Cond(CondExpr {
                        alt: Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: expr.alt.as_callee(),
                            args: e.args,
                            type_args: e.type_args,
                        })),
                        ..expr
                    }),
                    Err(callee) => Expr::Call(CallExpr {
                        callee: callee.as_callee(),
                        ..e
                    }),
                };
            }
            _ => {}
        }

        Expr::Call(e)
    }

    /// Returns `Ok` if it handled optional chaining.
    fn handle_member(&mut self, e: MemberExpr) -> Result<CondExpr, Expr> {
        let mut obj = match e.obj {
            ExprOrSuper::Expr(obj) if obj.is_member() => {
                let obj = obj.member().unwrap();
                let obj = self.handle_member(obj).map(Expr::Cond);
                let (obj, handled) = match obj {
                    Ok(v) => (v, true),
                    Err(v) => (v, false),
                };

                match obj {
                    Expr::Cond(obj) => {
                        let cond_expr = CondExpr {
                            span: DUMMY_SP,
                            alt: Box::new(Expr::Member(MemberExpr {
                                obj: ExprOrSuper::Expr(obj.alt),
                                ..e
                            })),
                            ..obj
                        };
                        //
                        return if handled {
                            Ok(cond_expr)
                        } else {
                            Err(Expr::Cond(cond_expr))
                        };
                    }
                    _ => ExprOrSuper::Expr(Box::new(obj)),
                }
            }
            _ => e.obj,
        };

        if let ExprOrSuper::Expr(expr) = obj {
            if let Expr::OptChain(obj) = *expr {
                let expr = self.unwrap(obj);

                return Ok(CondExpr {
                    span: DUMMY_SP,
                    alt: Box::new(Expr::Member(MemberExpr {
                        obj: ExprOrSuper::Expr(expr.alt),
                        ..e
                    })),
                    ..expr
                });
            }
            obj = ExprOrSuper::Expr(expr);
        }

        Err(Expr::Member(MemberExpr { obj, ..e }))
    }

    fn unwrap(&mut self, e: OptChainExpr) -> CondExpr {
        let span = e.span;
        let cons = undefined(span);

        match *e.expr {
            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(obj),
                prop,
                computed,
                span: m_span,
            }) if obj.is_opt_chain() => {
                let obj = obj.opt_chain().unwrap();
                let question_dot_token = obj.question_dot_token;

                let obj_span = obj.span;
                let obj = self.unwrap(obj);

                let alt = Box::new(Expr::Member(MemberExpr {
                    span: m_span,
                    obj: ExprOrSuper::Expr(obj.alt),
                    prop,
                    computed,
                }));
                let alt = Box::new(Expr::OptChain(OptChainExpr {
                    span: obj_span,
                    question_dot_token,
                    expr: alt,
                }));

                return validate!(CondExpr { alt, ..obj });
            }

            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(callee),
                args,
                type_args,
            }) if callee.is_opt_chain() => {
                let callee = callee.opt_chain().unwrap();
                let question_dot_token = callee.question_dot_token;

                let obj = self.unwrap(callee);

                let alt = Box::new(Expr::Call(CallExpr {
                    span,
                    callee: ExprOrSuper::Expr(obj.alt),
                    args,
                    type_args,
                }));
                let alt = Box::new(Expr::OptChain(OptChainExpr {
                    span,
                    question_dot_token,
                    expr: alt,
                }));

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
                obj: ExprOrSuper::Expr(obj),
                prop,
                computed,
                ..
            }) => {
                let obj = *obj;
                let obj_span = obj.span();

                let (left, right, alt) = match obj {
                    Expr::Ident(..) => (Box::new(obj.clone()), Box::new(obj), e.expr),
                    _ => {
                        let i = private_ident!(obj_span, "ref");
                        self.vars.push(VarDeclarator {
                            span: obj_span,
                            definite: false,
                            name: Pat::Ident(i.clone()),
                            init: None,
                        });

                        (
                            Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(Box::new(Pat::Ident(i.clone()))),
                                op: op!("="),
                                right: Box::new(obj),
                            })),
                            Box::new(Expr::Ident(i.clone())),
                            Box::new(Expr::Member(MemberExpr {
                                obj: ExprOrSuper::Expr(Box::new(Expr::Ident(i))),
                                computed,
                                span: DUMMY_SP,
                                prop,
                            })),
                        )
                    }
                };

                let right = Box::new(Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    left: right,
                    op: op!("==="),
                    right: undefined(span),
                }));

                let test = Box::new(Expr::Bin(BinExpr {
                    span,
                    left: Box::new(Expr::Bin(BinExpr {
                        span: obj_span,
                        left,
                        op: op!("==="),
                        right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
                    })),
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
                callee: ExprOrSuper::Expr(obj),
                args,
                type_args,
                ..
            }) => {
                let obj_span = obj.span();
                let is_super_access = match *obj {
                    Expr::Member(MemberExpr {
                        obj: ExprOrSuper::Super(..),
                        ..
                    }) => true,
                    _ => false,
                };

                let (left, right, alt) = match *obj {
                    Expr::Ident(..) => (obj.clone(), obj, e.expr),
                    _ => {
                        let this_as_super;
                        let (this_obj, aliased) = alias_if_required(
                            match &*obj {
                                Expr::Member(m) => match &m.obj {
                                    ExprOrSuper::Super(s) => {
                                        this_as_super = Expr::This(ThisExpr { span: s.span });
                                        &this_as_super
                                    }
                                    ExprOrSuper::Expr(obj) => &**obj,
                                },
                                _ => &*obj,
                            },
                            "_obj",
                        );
                        let obj = if !is_super_access && aliased {
                            self.vars.push(VarDeclarator {
                                span: obj_span,
                                definite: false,
                                name: Pat::Ident(this_obj.clone()),
                                init: Some(obj),
                            });

                            Box::new(Expr::Ident(this_obj.clone()))
                        } else {
                            obj
                        };
                        let i = private_ident!(obj_span, "ref");
                        self.vars.push(VarDeclarator {
                            span: obj_span,
                            definite: false,
                            name: Pat::Ident(i.clone()),
                            init: None,
                        });

                        (
                            Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(Box::new(Pat::Ident(i.clone()))),
                                op: op!("="),
                                right: obj,
                            })),
                            Box::new(Expr::Ident(i.clone())),
                            Box::new(Expr::Call(CallExpr {
                                span,
                                callee: ExprOrSuper::Expr(Box::new(Expr::Member(MemberExpr {
                                    span: DUMMY_SP,
                                    obj: ExprOrSuper::Expr(Box::new(Expr::Ident(i.clone()))),
                                    prop: Box::new(Expr::Ident(Ident::new("call".into(), span))),
                                    computed: false,
                                }))),
                                args: once(if is_super_access {
                                    ThisExpr { span }.as_arg()
                                } else {
                                    this_obj.as_arg()
                                })
                                .chain(args)
                                .collect(),
                                type_args,
                            })),
                        )
                    }
                };

                let test = Box::new(Expr::Bin(BinExpr {
                    span,
                    left: Box::new(Expr::Bin(BinExpr {
                        span: DUMMY_SP,
                        left,
                        op: op!("==="),
                        right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
                    })),
                    op: op!("||"),
                    right: Box::new(Expr::Bin(BinExpr {
                        span: DUMMY_SP,
                        left: right,
                        op: op!("==="),
                        right: undefined(span),
                    })),
                }));

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
#[derive(Default)]
struct ShouldWork {
    /// Found optional chaining?
    found: bool,
}

impl Visit for ShouldWork {
    noop_visit_type!();

    fn visit_opt_chain_expr(&mut self, _: &OptChainExpr, _: &dyn Node) {
        self.found = true;
    }
}

impl Check for ShouldWork {
    fn should_handle(&self) -> bool {
        self.found
    }
}
