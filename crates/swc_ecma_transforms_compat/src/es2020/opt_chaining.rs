use serde::Deserialize;
use std::{iter::once, mem};
use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::perf::Check;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{alias_if_required, prepend, private_ident, undefined, ExprFactory, StmtLike};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Node, Visit, VisitMut, VisitMutWith,
};

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
                        span: DUMMY_SP,
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
            Expr::OptChain(e) => {
                *expr = Expr::Cond(self.unwrap(e));
            }
            Expr::Member(e) => match self.handle_member(e).map(Expr::Cond) {
                Ok(v) => *expr = v,
                Err(v) => *expr = v,
            },
            _ => {
                self.handle_call(expr);
                self.handle_unary(expr);
            }
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

impl OptChaining {
    /// Returned statements are variable declarations without initializer
    fn visit_mut_one_stmt_to<T>(&mut self, mut stmt: T, new: &mut Vec<T>)
    where
        T: StmtLike + VisitMutWith<Self>,
    {
        (&mut stmt).visit_mut_with(self);

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
        #[cfg(feature = "rayon")]
        if stmts.len() > 4 {
            use rayon::prelude::*;
            use swc_common::GLOBALS;

            let (mut stmts_updated, mut vars_without_init) = GLOBALS.with(|globals| {
                stmts
                    .take()
                    .into_par_iter()
                    .map(|stmt| {
                        GLOBALS.set(&globals, || {
                            let mut visitor = Self::default();
                            visitor.c = self.c;
                            let mut stmts = Vec::with_capacity(3);
                            visitor.visit_mut_one_stmt_to(stmt, &mut stmts);

                            (stmts, visitor.vars_without_init)
                        })
                    })
                    .reduce(Default::default, |mut a, b| {
                        a.0.extend(b.0);
                        a.1.extend(b.1);

                        a
                    })
            });

            if !vars_without_init.is_empty() {
                prepend(
                    &mut stmts_updated,
                    T::from_stmt(Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        declare: false,
                        kind: VarDeclKind::Var,
                        decls: mem::take(&mut vars_without_init),
                    }))),
                );
            }
            *stmts = stmts_updated;
            return;
        }

        let mut new: Vec<T> = vec![];

        let init = self.vars_with_init.take();
        let uninit = self.vars_without_init.take();
        for stmt in stmts.drain(..) {
            self.visit_mut_one_stmt_to(stmt, &mut new);
        }

        if !self.vars_without_init.is_empty() {
            prepend(
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

impl OptChaining {
    /// Only called from [VisitMut].
    fn handle_unary(&mut self, e: &mut Expr) {
        match e {
            Expr::Unary(unary_expr) => {
                let span = unary_expr.span;

                if let op!("delete") = unary_expr.op {
                    match &mut *unary_expr.arg {
                        Expr::OptChain(o) => {
                            let expr = self.unwrap(o);

                            *e = CondExpr {
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
                            let mut obj = obj.take().opt_chain().unwrap();
                            let expr = self.unwrap(&mut obj);

                            *e = CondExpr {
                                span: DUMMY_SP,
                                alt: Box::new(Expr::Unary(UnaryExpr {
                                    span: *span,
                                    op: op!("delete"),
                                    arg: Box::new(Expr::Member(MemberExpr {
                                        span: *span,
                                        obj: ExprOrSuper::Expr(expr.alt),
                                        prop: prop.clone(),
                                        computed: *computed,
                                    })),
                                })),
                                ..expr
                            }
                            .into();
                        }
                        _ => {}
                    }
                };
            }
            _ => {}
        };
    }

    /// Only called from [VisitMut].
    fn handle_call(&mut self, e: &mut Expr) -> bool {
        match e {
            Expr::Call(call_expr) => match &mut call_expr.callee {
                ExprOrSuper::Expr(callee) if callee.is_opt_chain() => {
                    let mut callee = (&mut *callee).take().opt_chain().unwrap();
                    let expr = self.unwrap(&mut callee);

                    *e = CondExpr {
                        span: DUMMY_SP,
                        alt: Box::new(Expr::Call(CallExpr {
                            callee: ExprOrSuper::Expr(expr.alt),
                            ..call_expr.take()
                        })),
                        ..expr
                    }
                    .into();
                    return true;
                }
                ExprOrSuper::Expr(callee) if callee.is_member() => {
                    let mut callee = (&mut *callee).take().member().unwrap();
                    let callee = self.handle_member(&mut callee);

                    match callee {
                        Ok(expr) => {
                            *e = CondExpr {
                                span: call_expr.span,
                                alt: Box::new(Expr::Call(CallExpr {
                                    span: DUMMY_SP,
                                    callee: expr.alt.as_callee(),
                                    args: call_expr.args.take(),
                                    type_args: call_expr.type_args.take(),
                                })),
                                ..expr
                            }
                            .into();
                            return true;
                        }
                        Err(callee) => {
                            *e = Expr::Call(CallExpr {
                                callee: callee.as_callee(),
                                ..call_expr.take()
                            });
                            return false;
                        }
                    };
                }
                _ => {}
            },
            _ => {}
        }
        return false;
    }

    /// Returns `Ok` if it handled optional chaining.
    fn handle_member(&mut self, e: &mut MemberExpr) -> Result<CondExpr, Expr> {
        let mut obj = match &e.obj {
            ExprOrSuper::Expr(obj) if obj.is_member() => {
                let mut obj = obj.clone().member().unwrap();
                let obj = self.handle_member(&mut obj).map(Expr::Cond);
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
                    _ => ExprOrSuper::Expr(Box::new(obj)),
                }
            }

            ExprOrSuper::Expr(obj) if obj.is_call() => {
                let mut obj = obj.clone();
                let handled = self.handle_call(&mut obj);

                match *obj {
                    Expr::Cond(obj) => {
                        let cond_expr = CondExpr {
                            span: DUMMY_SP,
                            alt: Box::new(Expr::Member(MemberExpr {
                                obj: ExprOrSuper::Expr(obj.alt),
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
                    _ => ExprOrSuper::Expr(obj.take()),
                }
            }
            _ => e.obj.clone(),
        };

        if let ExprOrSuper::Expr(expr) = obj {
            if let Expr::OptChain(mut obj) = *expr {
                let expr = self.unwrap(&mut obj);

                return Ok(CondExpr {
                    span: DUMMY_SP,
                    alt: Box::new(Expr::Member(MemberExpr {
                        obj: ExprOrSuper::Expr(expr.alt),
                        ..e.take()
                    })),
                    ..expr
                });
            }
            obj = ExprOrSuper::Expr(expr);
        }

        Err(Expr::Member(MemberExpr { obj, ..e.take() }))
    }

    fn unwrap(&mut self, e: &mut OptChainExpr) -> CondExpr {
        let span = e.span;
        let cons = undefined(span);

        match &*e.expr {
            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(obj),
                prop,
                computed,
                span: m_span,
            }) if obj.is_opt_chain() => {
                let mut obj = obj.clone().opt_chain().unwrap();
                let question_dot_token = obj.question_dot_token;

                let obj_span = obj.span;
                let obj = self.unwrap(&mut obj);

                let alt = Box::new(Expr::Member(MemberExpr {
                    span: *m_span,
                    obj: ExprOrSuper::Expr(obj.alt),
                    prop: prop.clone(),
                    computed: *computed,
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
                let mut callee = callee.clone().opt_chain().unwrap();
                let question_dot_token = callee.question_dot_token;

                let obj = self.unwrap(&mut callee);

                let alt = Box::new(Expr::Call(CallExpr {
                    span: *span,
                    callee: ExprOrSuper::Expr(obj.alt),
                    args: args.clone(),
                    type_args: type_args.clone(),
                }));
                let alt = Box::new(Expr::OptChain(OptChainExpr {
                    span: *span,
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

        e.expr.visit_mut_children_with(self);

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
                    Expr::Ident(..) => (Box::new(obj.clone()), Box::new(obj), e.expr.take()),
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

                let test = Box::new(Expr::Bin(if self.c.no_document_all {
                    BinExpr {
                        span: obj_span,
                        left,
                        op: op!("=="),
                        right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
                    }
                } else {
                    BinExpr {
                        span,
                        left: Box::new(Expr::Bin(BinExpr {
                            span: obj_span,
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
                    }
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
                    Expr::Ident(..) => (obj.clone(), obj, e.expr.take()),
                    _ if is_simple_expr(&obj) && self.c.pure_getter => {
                        (obj.clone(), obj, e.expr.take())
                    }
                    _ => {
                        let this_as_super;
                        let should_call = obj.is_member();
                        let (this_obj, aliased) = if should_call {
                            alias_if_required(
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
                            )
                        } else {
                            (Ident::dummy(), false)
                        };
                        let obj_expr = if !is_super_access && aliased {
                            self.vars_without_init.push(VarDeclarator {
                                span: obj_span,
                                definite: false,
                                name: Pat::Ident(this_obj.clone().into()),
                                init: None,
                            });

                            match *obj {
                                Expr::Member(
                                    obj @ MemberExpr {
                                        obj: ExprOrSuper::Expr(..),
                                        ..
                                    },
                                ) => Box::new(Expr::Member(MemberExpr {
                                    span: obj.span,
                                    obj: Expr::Assign(AssignExpr {
                                        span: DUMMY_SP,
                                        op: op!("="),
                                        left: PatOrExpr::Pat(Box::new(Pat::Ident(
                                            this_obj.clone().into(),
                                        ))),
                                        right: obj.obj.expect_expr(),
                                    })
                                    .as_obj(),
                                    prop: obj.prop,
                                    computed: obj.computed,
                                })),
                                _ => Box::new(Expr::Assign(AssignExpr {
                                    span: DUMMY_SP,
                                    op: op!("="),
                                    left: PatOrExpr::Pat(Box::new(Pat::Ident(
                                        this_obj.clone().into(),
                                    ))),
                                    right: obj,
                                })),
                            }
                        } else {
                            obj
                        };

                        let tmp = private_ident!(obj_span, "ref");

                        self.vars_without_init.push(VarDeclarator {
                            span: obj_span,
                            definite: false,
                            name: Pat::Ident(tmp.clone().into()),
                            init: None,
                        });

                        (
                            Box::new(Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(Box::new(Pat::Ident(tmp.clone().into()))),
                                op: op!("="),
                                right: obj_expr,
                            })),
                            Box::new(Expr::Ident(tmp.clone())),
                            Box::new(Expr::Call(CallExpr {
                                span,
                                callee: ExprOrSuper::Expr(Box::new(if should_call {
                                    Expr::Member(MemberExpr {
                                        span: DUMMY_SP,
                                        obj: ExprOrSuper::Expr(Box::new(Expr::Ident(tmp.clone()))),
                                        prop: Box::new(Expr::Ident(Ident::new(
                                            "call".into(),
                                            span,
                                        ))),
                                        computed: false,
                                    })
                                } else {
                                    Expr::Ident(tmp.clone())
                                })),
                                args: if should_call {
                                    once(if is_super_access {
                                        ThisExpr { span }.as_arg()
                                    } else {
                                        this_obj.as_arg()
                                    })
                                    .chain(args)
                                    .collect()
                                } else {
                                    args
                                },
                                type_args,
                            })),
                        )
                    }
                };

                let test = Box::new(Expr::Bin(if self.c.no_document_all {
                    BinExpr {
                        span: DUMMY_SP,
                        left,
                        op: op!("=="),
                        right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
                    }
                } else {
                    BinExpr {
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
                    }
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

// TODO: skip transparent wrapper
fn is_simple_expr(expr: &Expr) -> bool {
    match expr {
        Expr::Ident(_) => true,
        Expr::Member(MemberExpr {
            obj,
            computed: false,
            ..
        }) if match obj {
            ExprOrSuper::Super(..) => true,
            ExprOrSuper::Expr(expr) if is_simple_expr(expr) => true,
            _ => false,
        } =>
        {
            true
        }
        _ => false,
    }
}
