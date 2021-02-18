use std::{iter::once, mem};
use swc_common::{Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Check;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::alias_if_required;
use swc_ecma_utils::private_ident;
use swc_ecma_utils::{prepend, undefined, ExprFactory, StmtLike};
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, Node, Visit};

pub fn optional_chaining() -> impl Fold {
    OptChaining::default()
}

#[derive(Default)]
struct OptChaining {
    vars_without_init: Vec<VarDeclarator>,
    vars_with_init: Vec<VarDeclarator>,
}

#[fast_path(ShouldWork)]
impl Fold for OptChaining {
    noop_fold_type!();

    fn fold_expr(&mut self, e: Expr) -> Expr {
        let e = match e {
            Expr::OptChain(e) => Expr::Cond(self.unwrap(e)),
            Expr::Unary(e) => self.handle_unary(e),
            Expr::Member(e) => match self.handle_member(e).map(Expr::Cond) {
                Ok(v) => v,
                Err(v) => v,
            },
            Expr::Call(e) => match self.handle_call(e).map(Expr::Cond) {
                Ok(v) => v,
                Err(v) => v,
            },
            _ => e,
        };

        e.fold_children_with(self)
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
        let old_no_init = mem::replace(&mut self.vars_without_init, vec![]);
        let old_init = mem::replace(&mut self.vars_with_init, vec![]);

        let mut new: Vec<T> = vec![];

        for stmt in stmts {
            let stmt = stmt.fold_with(self);
            if !self.vars_with_init.is_empty() {
                new.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    declare: false,
                    kind: VarDeclKind::Var,
                    decls: mem::replace(&mut self.vars_with_init, vec![]),
                }))));
            }
            new.push(stmt);
        }

        if !self.vars_without_init.is_empty() {
            prepend(
                &mut new,
                T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    declare: false,
                    kind: VarDeclKind::Var,
                    decls: mem::replace(&mut self.vars_without_init, vec![]),
                }))),
            );
        }

        self.vars_without_init = old_no_init;
        self.vars_with_init = old_init;
        new
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
                    let expr = self.unwrap(obj);

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
    fn handle_call(&mut self, e: CallExpr) -> Result<CondExpr, Expr> {
        match e.callee {
            ExprOrSuper::Expr(callee) if callee.is_opt_chain() => {
                let callee = callee.opt_chain().unwrap();
                let expr = self.unwrap(callee);

                return Ok(CondExpr {
                    span: DUMMY_SP,
                    alt: Box::new(Expr::Call(CallExpr {
                        callee: ExprOrSuper::Expr(expr.alt),
                        ..e
                    })),
                    ..expr
                });
            }
            ExprOrSuper::Expr(callee) if callee.is_member() => {
                let callee = callee.member().unwrap();
                let callee = self.handle_member(callee);

                return match callee {
                    Ok(expr) => Ok(CondExpr {
                        span: e.span,
                        alt: Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: expr.alt.as_callee(),
                            args: e.args,
                            type_args: e.type_args,
                        })),
                        ..expr
                    }),
                    Err(callee) => Err(Expr::Call(CallExpr {
                        callee: callee.as_callee(),
                        ..e
                    })),
                };
            }
            _ => {}
        }

        Err(Expr::Call(e))
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

            ExprOrSuper::Expr(obj) if obj.is_call() => {
                let obj = obj.call().unwrap();
                let obj = self.handle_call(obj).map(Expr::Cond);
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

                return CondExpr { alt, ..obj };
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

                return CondExpr {
                    span: DUMMY_SP,
                    alt,
                    ..obj
                };
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
                        self.vars_without_init.push(VarDeclarator {
                            span: obj_span,
                            definite: false,
                            name: Pat::Ident(i.clone().into()),
                            init: None,
                        });

                        (
                            Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(Box::new(Pat::Ident(i.clone().into()))),
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

                CondExpr {
                    span,
                    test,
                    cons,
                    alt,
                }
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
                            self.vars_with_init.push(VarDeclarator {
                                span: obj_span,
                                definite: false,
                                name: Pat::Ident(this_obj.clone().into()),
                                init: Some(obj),
                            });

                            Box::new(Expr::Ident(this_obj.clone()))
                        } else {
                            obj
                        };
                        let i = private_ident!(obj_span, "ref");
                        self.vars_without_init.push(VarDeclarator {
                            span: obj_span,
                            definite: false,
                            name: Pat::Ident(i.clone().into()),
                            init: None,
                        });

                        (
                            Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(Box::new(Pat::Ident(i.clone().into()))),
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

                CondExpr {
                    span: DUMMY_SP,
                    test,
                    cons,
                    alt,
                }
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
