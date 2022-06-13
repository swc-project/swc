use std::{iter::once, mem};

use serde::Deserialize;
use swc_atoms::js_word;
use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Check;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{
    alias_if_required, opt_chain_test, prepend_stmt, private_ident, undefined, ExprFactory,
    IntoIndirectCall, StmtLike,
};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitMutWith,
};
use swc_trace_macro::swc_trace;

#[tracing::instrument(level = "info", skip_all)]
pub fn optional_chaining(c: Config) -> impl Fold + VisitMut {
    as_folder(OptChaining {
        c,
        ..Default::default()
    })
}

#[derive(Default)]
struct OptChaining {
    vars_without_init: Vec<VarDeclarator>,
    vars_with_init: Vec<VarDeclarator>,
    c: Config,
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub no_document_all: bool,
    #[serde(default)]
    pub pure_getter: bool,
}

#[swc_trace]
#[fast_path(ShouldWork)]
impl VisitMut for OptChaining {
    noop_visit_mut_type!();

    fn visit_mut_block_stmt_or_expr(&mut self, expr: &mut BlockStmtOrExpr) {
        match expr {
            BlockStmtOrExpr::BlockStmt(..) => {
                expr.visit_mut_children_with(self);
            }
            BlockStmtOrExpr::Expr(e) => {
                let mut stmt = BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![Stmt::Return(ReturnStmt {
                        span: e.span(),
                        arg: Some(e.take()),
                    })],
                };

                stmt.visit_mut_with(self);
                *expr = BlockStmtOrExpr::BlockStmt(stmt);
            }
        };
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        match expr {
            Expr::OptChain(e) => *expr = Expr::Cond(self.unwrap(e)),
            Expr::Call(e) => match self.handle_call(e).map(Expr::Cond) {
                Ok(v) => *expr = v,
                Err(v) => *expr = v,
            },
            Expr::Unary(e) => *expr = self.handle_unary(e),
            Expr::Member(e) => match self.handle_member(e).map(Expr::Cond) {
                Ok(v) => *expr = v,
                Err(v) => *expr = v,
            },
            _ => {}
        }

        expr.visit_mut_children_with(self);
    }

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(n);
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(n);
    }
}

#[swc_trace]
impl OptChaining {
    /// Returned statements are variable declarations without initializer
    fn visit_mut_one_stmt_to<T>(&mut self, mut stmt: T, new: &mut Vec<T>)
    where
        T: StmtLike + VisitMutWith<Self>,
    {
        stmt.visit_mut_with(self);

        if !self.vars_with_init.is_empty() {
            new.push(T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                declare: false,
                kind: VarDeclKind::Var,
                decls: mem::take(&mut self.vars_with_init),
            }))));
        }
        new.push(stmt);
    }

    fn visit_mut_stmt_like<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: Send + Sync + StmtLike + VisitMutWith<Self>,
        Vec<T>: VisitMutWith<Self>,
    {
        let mut new: Vec<T> = vec![];

        let init = self.vars_with_init.take();
        let uninit = self.vars_without_init.take();
        for stmt in stmts.drain(..) {
            self.visit_mut_one_stmt_to(stmt, &mut new);
        }

        if !self.vars_without_init.is_empty() {
            prepend_stmt(
                &mut new,
                T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    declare: false,
                    kind: VarDeclKind::Var,
                    decls: mem::take(&mut self.vars_without_init),
                }))),
            );
        }

        self.vars_with_init = init;
        self.vars_without_init = uninit;
        *stmts = new;
    }
}

#[swc_trace]
impl OptChaining {
    /// Only called from [VisitMut].
    fn handle_unary(&mut self, e: &mut UnaryExpr) -> Expr {
        let span = e.span;

        if let op!("delete") = e.op {
            match &mut *e.arg {
                Expr::OptChain(o) => {
                    let expr = self.unwrap(o);

                    return CondExpr {
                        span,
                        alt: Box::new(Expr::Unary(UnaryExpr {
                            span,
                            op: op!("delete"),
                            arg: expr.alt,
                        })),
                        test: expr.test,
                        cons: expr.cons,
                    }
                    .into();
                }

                Expr::Member(MemberExpr { span, obj, prop }) if obj.is_opt_chain() => {
                    let mut obj = obj.take().opt_chain().unwrap();

                    let expr = self.unwrap(&mut obj);

                    return CondExpr {
                        span: DUMMY_SP,
                        alt: Box::new(Expr::Unary(UnaryExpr {
                            span: *span,
                            op: op!("delete"),
                            arg: Box::new(Expr::Member(MemberExpr {
                                span: *span,
                                obj: expr.alt,
                                prop: prop.take(),
                            })),
                        })),
                        ..expr
                    }
                    .into();
                }
                _ => {}
            }
        }

        Expr::Unary(e.take())
    }

    /// Only called from [VisitMut].
    fn handle_call(&mut self, e: &mut CallExpr) -> Result<CondExpr, Expr> {
        match &mut e.callee {
            Callee::Expr(callee) if callee.is_opt_chain() => {
                let mut callee = callee.take().opt_chain().unwrap();
                let expr = self.unwrap(&mut callee);

                return Ok(CondExpr {
                    span: DUMMY_SP,
                    alt: Box::new(Expr::Call(CallExpr {
                        callee: expr.alt.as_callee(),
                        ..e.take()
                    })),
                    ..expr
                });
            }
            Callee::Expr(callee) if callee.is_member() => {
                let mut callee = callee.take().member().unwrap();
                let callee = self.handle_member(&mut callee);

                return match callee {
                    Ok(expr) => Ok(CondExpr {
                        span: e.span,
                        alt: Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: expr.alt.as_callee(),
                            args: e.args.take(),
                            type_args: e.type_args.take(),
                        })),
                        ..expr
                    }),
                    Err(callee) => Err(Expr::Call(CallExpr {
                        callee: callee.as_callee(),
                        ..e.take()
                    })),
                };
            }
            _ => {}
        }

        Err(Expr::Call(e.take()))
    }

    fn handle_member(&mut self, e: &mut MemberExpr) -> Result<CondExpr, Expr> {
        let obj = match &mut *e.obj {
            Expr::Member(obj) => {
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
                                obj: obj.alt,
                                ..e.take()
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
                    _ => Box::new(obj),
                }
            }
            Expr::Call(obj) => {
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
                                obj: obj.alt,
                                ..e.take()
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
                    _ => Box::new(obj),
                }
            }
            _ => e.obj.take(),
        };

        if let Expr::OptChain(mut obj) = *obj {
            let expr = self.unwrap(&mut obj);

            return Ok(CondExpr {
                span: DUMMY_SP,
                alt: Box::new(Expr::Member(MemberExpr {
                    obj: expr.alt,
                    ..e.take()
                })),
                ..expr
            });
        }

        Err(Expr::Member(MemberExpr { obj, ..e.take() }))
    }

    fn unwrap(&mut self, e: &mut OptChainExpr) -> CondExpr {
        let span = e.span;
        let cons = undefined(span);

        match &mut e.base {
            OptChainBase::Member(MemberExpr {
                obj,
                prop,
                span: m_span,
            }) if obj.is_opt_chain() => {
                let mut obj = obj.take().opt_chain().unwrap();
                let question_dot_token = obj.question_dot_token;

                let obj_span = obj.span;
                let obj = self.unwrap(&mut obj);

                let alt = OptChainBase::Member(MemberExpr {
                    span: *m_span,
                    obj: obj.alt,
                    prop: prop.take(),
                });
                let alt = Box::new(Expr::OptChain(OptChainExpr {
                    span: obj_span,
                    question_dot_token,
                    base: alt,
                }));

                return CondExpr { alt, ..obj };
            }
            OptChainBase::Call(OptCall {
                span,
                callee,
                args,
                type_args,
            }) if callee.is_opt_chain() => {
                let mut callee = callee.take().opt_chain().unwrap();
                let question_dot_token = callee.question_dot_token;

                let obj = self.unwrap(&mut callee);

                let alt = OptChainBase::Call(OptCall {
                    span: *span,
                    callee: obj.alt,
                    args: args.take(),
                    type_args: type_args.take(),
                });
                let alt = Box::new(Expr::OptChain(OptChainExpr {
                    span: *span,
                    question_dot_token,
                    base: alt,
                }));

                return CondExpr {
                    span: DUMMY_SP,
                    alt,
                    ..obj
                };
            }
            _ => {}
        }

        e.base.visit_mut_children_with(self);

        match &mut e.base {
            OptChainBase::Member(MemberExpr { obj, prop, .. }) => {
                let obj_span = obj.span();

                let (left, right, alt) = match &mut **obj {
                    Expr::Ident(..) => (obj.clone(), obj.clone(), Box::new(e.base.take().into())),
                    _ => {
                        let i = private_ident!(obj_span, "ref");
                        self.vars_without_init.push(VarDeclarator {
                            span: obj_span,
                            definite: false,
                            name: i.clone().into(),
                            init: None,
                        });

                        (
                            Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(i.clone().into()),
                                op: op!("="),
                                right: obj.take(),
                            })),
                            Box::new(Expr::Ident(i.clone())),
                            Box::new(Expr::Member(MemberExpr {
                                obj: Box::new(Expr::Ident(i)),
                                span: DUMMY_SP,
                                prop: prop.take(),
                            })),
                        )
                    }
                };

                let test = Box::new(opt_chain_test(left, right, span, self.c.no_document_all));

                CondExpr {
                    span,
                    test,
                    cons,
                    alt,
                }
            }

            OptChainBase::Call(call) => {
                let callee = &mut call.callee;
                let obj_span = callee.span();
                let is_super_access = matches!(&**callee, Expr::SuperProp(_));

                let (left, right, alt) = match &**callee {
                    Expr::Ident(ident) => (
                        callee.clone(),
                        callee.clone(),
                        if ident.sym == js_word!("eval") {
                            Box::new(CallExpr::from(call.take()).into_indirect().into())
                        } else {
                            Box::new(CallExpr::from(call.take()).into())
                        },
                    ),
                    _ if is_simple_expr(callee) && self.c.pure_getter => (
                        callee.clone(),
                        callee.clone(),
                        Box::new(CallExpr::from(call.take()).into()),
                    ),
                    _ => {
                        let this_as_super;
                        let should_call = callee.is_member() || callee.is_super_prop();
                        let (this_obj, aliased) = if should_call {
                            alias_if_required(
                                match &**callee {
                                    Expr::SuperProp(m) => {
                                        this_as_super = Expr::This(ThisExpr { span: m.obj.span });
                                        &this_as_super
                                    }
                                    Expr::Member(m) => &*m.obj,
                                    _ => &*call.callee,
                                },
                                "_obj",
                            )
                        } else {
                            (Ident::dummy(), false)
                        };
                        let obj_expr = if !is_super_access && aliased {
                            self.vars_without_init.push(VarDeclarator {
                                span: obj_span,
                                definite: false,
                                name: this_obj.clone().into(),
                                init: None,
                            });

                            match &mut *call.callee {
                                Expr::Member(obj) => Box::new(Expr::Member(MemberExpr {
                                    span: obj.span,
                                    obj: Expr::Assign(AssignExpr {
                                        span: DUMMY_SP,
                                        op: op!("="),
                                        left: PatOrExpr::Pat(this_obj.clone().into()),
                                        right: obj.obj.take(),
                                    })
                                    .into(),
                                    prop: obj.prop.take(),
                                })),
                                _ => Box::new(Expr::Assign(AssignExpr {
                                    span: DUMMY_SP,
                                    op: op!("="),
                                    left: PatOrExpr::Pat(this_obj.clone().into()),
                                    right: call.callee.take(),
                                })),
                            }
                        } else {
                            call.callee.take()
                        };

                        let tmp = private_ident!(obj_span, "ref");

                        self.vars_without_init.push(VarDeclarator {
                            span: obj_span,
                            definite: false,
                            name: tmp.clone().into(),
                            init: None,
                        });

                        (
                            Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(tmp.clone().into()),
                                op: op!("="),
                                right: obj_expr,
                            })),
                            Box::new(Expr::Ident(tmp.clone())),
                            Box::new(Expr::Call(CallExpr {
                                span,
                                callee: Callee::Expr(Box::new(if should_call {
                                    Expr::Member(MemberExpr {
                                        span: DUMMY_SP,
                                        obj: Box::new(Expr::Ident(tmp)),
                                        prop: MemberProp::Ident(Ident::new("call".into(), span)),
                                    })
                                } else {
                                    Expr::Ident(tmp)
                                })),
                                args: if should_call {
                                    once(if is_super_access {
                                        ThisExpr { span }.as_arg()
                                    } else {
                                        this_obj.as_arg()
                                    })
                                    .chain(call.args.take())
                                    .collect()
                                } else {
                                    call.args.take()
                                },
                                type_args: call.type_args.take(),
                            })),
                        )
                    }
                };

                let test = Box::new(opt_chain_test(left, right, span, self.c.no_document_all));

                CondExpr {
                    span: DUMMY_SP,
                    test,
                    cons,
                    alt,
                }
            }
        }
    }
}
#[derive(Default)]
struct ShouldWork {
    /// Found optional chaining?
    found: bool,
}

#[swc_trace]
impl Visit for ShouldWork {
    noop_visit_type!();

    fn visit_opt_chain_expr(&mut self, _: &OptChainExpr) {
        self.found = true;
    }
}

impl Check for ShouldWork {
    fn should_handle(&self) -> bool {
        self.found
    }
}

// TODO: skip transparent wrapper
#[tracing::instrument(level = "info", skip_all)]
fn is_simple_expr(expr: &Expr) -> bool {
    match expr {
        Expr::Ident(_) => true,
        Expr::Member(MemberExpr {
            obj,
            prop: MemberProp::Ident(..) | MemberProp::PrivateName(..),
            ..
        }) if is_simple_expr(obj) => true,
        Expr::SuperProp(SuperPropExpr {
            prop: SuperProp::Ident(..),
            ..
        }) => true,
        _ => false,
    }
}
