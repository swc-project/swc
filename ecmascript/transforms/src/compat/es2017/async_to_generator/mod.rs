use crate::{
    compat::helpers::Helpers,
    util::{contains_this_expr, ExprFactory, StmtLike},
};
use ast::*;
use std::{
    iter,
    sync::{atomic::Ordering, Arc},
};
use swc_common::{Fold, FoldWith, Mark, Spanned, DUMMY_SP};

#[cfg(test)]
mod tests;

/// `@babel/plugin-transform-async-to-generator`
///
/// ## In
///
/// ```js
/// async function foo() {
///   await bar();
/// }
/// ```
///
/// ## Out
///
/// ```js
/// var _asyncToGenerator = function (fn) {
///   ...
/// };
/// var foo = _asyncToGenerator(function* () {
///   yield bar();
/// });
/// ```
pub fn async_to_generator(helpers: Arc<Helpers>) -> impl Fold<Module> {
    AsyncToGenerator {
        helpers,
        ..Default::default()
    }
}

#[derive(Default)]
struct AsyncToGenerator {
    helpers: Arc<Helpers>,
}
struct Actual {
    helpers: Arc<Helpers>,
    extra_stmts: Vec<Stmt>,
}

impl<T: StmtLike> Fold<Vec<T>> for AsyncToGenerator
where
    Vec<T>: FoldWith<Self>,
{
    fn fold(&mut self, stmts: Vec<T>) -> Vec<T> {
        let stmts = stmts.fold_children(self);

        let mut buf = Vec::with_capacity(stmts.len());

        for stmt in stmts {
            match stmt.try_into_stmt() {
                Err(module_item) => buf.push(module_item),
                Ok(stmt) => {
                    let mut actual = Actual {
                        helpers: self.helpers.clone(),
                        extra_stmts: vec![],
                    };
                    let stmt = stmt.fold_with(&mut actual);

                    buf.extend(actual.extra_stmts.into_iter().map(T::from_stmt));
                    buf.push(T::from_stmt(stmt));
                }
            }
        }

        buf
    }
}

impl Fold<MethodProp> for Actual {
    fn fold(&mut self, prop: MethodProp) -> MethodProp {
        let prop = prop.fold_children(self);
        if !prop.function.is_async {
            return prop;
        }
        let params = prop.function.params;

        let fn_ref = make_fn_ref(
            &self.helpers,
            FnExpr {
                ident: None,
                function: Function {
                    params: vec![],
                    ..prop.function
                },
            },
        );
        let fn_ref = Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: fn_ref.as_callee(),
            args: vec![],
        });

        MethodProp {
            function: Function {
                params,
                span: DUMMY_SP,
                is_async: false,
                is_generator: false,
                body: BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(box fn_ref),
                    })],
                },
            },
            ..prop
        }
    }
}

/// Hoists super access
///
/// ## In
///
/// ```js
/// class Foo {
///     async foo () {
///         super.getter
///         super.setter = 1
///         super.method()
///     }
/// }
/// ```
///
/// ## OUt
///
/// ```js
/// class Foo {
///     var _super_getter = () => super.getter;
///     var _super_setter = (v) => super.setter = v;
///     var _super_method = (...args) => super.method(args);
///     foo () {
///         super.getter
///         super.setter = 1
///         super.method()
///     }
/// }
/// ```
struct ClassMethodFolder {
    vars: Vec<VarDeclarator>,
}

impl ClassMethodFolder {
    fn ident_for_super(&mut self, prop: &Expr) -> (Mark, Ident) {
        let mark = Mark::fresh(Mark::root());
        let prop_span = prop.span();
        let mut ident = match *prop {
            Expr::Ident(ref ident) => quote_ident!(prop_span, format!("_super_{}", ident.sym)),
            _ => quote_ident!(prop_span, "_super_method"),
        };
        ident.span = ident.span.apply_mark(mark);
        (mark, ident)
    }
}

impl Fold<Expr> for ClassMethodFolder {
    fn fold(&mut self, expr: Expr) -> Expr {
        // TODO(kdy): Cache (Reuse declaration for same property)

        match expr {
            // super.setter = 1
            Expr::Assign(AssignExpr {
                left:
                    PatOrExpr::Expr(box Expr::Member(MemberExpr {
                        obj: ExprOrSuper::Super(..),
                        ..
                    })),
                ..
            }) => unimplemented!(),

            // super.method()
            Expr::Call(CallExpr {
                span,
                callee:
                    ExprOrSuper::Expr(box Expr::Member(MemberExpr {
                        span: _,
                        obj: ExprOrSuper::Super(super_token),
                        prop,
                        computed,
                    })),
                args,
            }) => {
                let (mark, ident) = self.ident_for_super(&prop);
                let args_ident = quote_ident!(DUMMY_SP.apply_mark(mark), "_args");

                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(ident.clone()),
                    init: Some(box Expr::Arrow(ArrowExpr {
                        span: DUMMY_SP,
                        is_async: false,
                        is_generator: false,
                        params: vec![Pat::Rest(RestPat {
                            dot3_token: DUMMY_SP,
                            arg: box Pat::Ident(args_ident.clone()),
                        })],
                        body: BlockStmtOrExpr::Expr(box Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: MemberExpr {
                                span: DUMMY_SP,
                                obj: ExprOrSuper::Super(super_token),
                                computed,
                                prop,
                            }
                            .as_callee(),
                            args: vec![ExprOrSpread {
                                spread: Some(DUMMY_SP),
                                expr: box args_ident.clone().into(),
                            }],
                        })),
                    })),
                });

                Expr::Call(CallExpr {
                    span,
                    callee: ident.as_callee(),
                    args,
                })
            }
            // super.getter
            Expr::Member(MemberExpr {
                span,
                obj: ExprOrSuper::Super(super_token),
                prop,
                computed,
            }) => {
                let (_, ident) = self.ident_for_super(&prop);
                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(ident.clone()),
                    init: Some(box Expr::Arrow(ArrowExpr {
                        span: DUMMY_SP,
                        is_async: false,
                        is_generator: false,
                        params: vec![],
                        body: BlockStmtOrExpr::Expr(
                            box MemberExpr {
                                span: DUMMY_SP,
                                obj: ExprOrSuper::Super(super_token),
                                computed,
                                prop,
                            }
                            .into(),
                        ),
                    })),
                });

                Expr::Call(CallExpr {
                    span,
                    callee: ident.as_callee(),
                    args: vec![],
                })
            }
            _ => expr.fold_children(self),
        }
    }
}

impl Fold<ClassMethod> for Actual {
    fn fold(&mut self, m: ClassMethod) -> ClassMethod {
        if m.kind != ClassMethodKind::Method || !m.function.is_async {
            return m;
        }
        let params = m.function.params.clone();

        let mut folder = ClassMethodFolder { vars: vec![] };
        let function = m.function.fold_children(&mut folder);
        let expr = make_fn_ref(
            &self.helpers,
            FnExpr {
                ident: None,
                function,
            },
        );

        let hoisted_super = if folder.vars.is_empty() {
            None
        } else {
            Some(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                decls: folder.vars,
            })))
        };

        ClassMethod {
            function: Function {
                span: m.span,
                is_async: false,
                is_generator: false,
                params,
                body: BlockStmt {
                    span: DUMMY_SP,
                    stmts: hoisted_super
                        .into_iter()
                        .chain(iter::once(Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(box Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: expr.as_callee(),
                                args: vec![],
                            })),
                        })))
                        .collect(),
                },
            },
            ..m
        }
    }
}

impl Fold<Expr> for Actual {
    fn fold(&mut self, expr: Expr) -> Expr {
        match expr {
            // Optimization for iife.
            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(box Expr::Fn(fn_expr)),
                args,
            }) => {
                if !args.is_empty() || !fn_expr.function.is_async {
                    return Expr::Call(CallExpr {
                        span,
                        callee: ExprOrSuper::Expr(box Expr::Fn(fn_expr)),
                        args,
                    });
                }

                return make_fn_ref(&self.helpers, fn_expr);
            }
            _ => {}
        }

        let expr = expr.fold_children(self);

        match expr {
            Expr::Fn(
                expr @ FnExpr {
                    function: Function { is_async: true, .. },
                    ..
                },
            ) => {
                let function = self.fold_fn(expr.ident.clone(), expr.function, false);
                let body = BlockStmt {
                    span: DUMMY_SP,
                    stmts: self
                        .extra_stmts
                        .drain(..)
                        .chain(function.body.stmts)
                        .collect(),
                };

                Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: Expr::Fn(FnExpr {
                        ident: None,
                        function: Function { body, ..function },
                    })
                    .as_callee(),
                    args: vec![],
                })
            }
            _ => expr,
        }
    }
}

impl Fold<FnDecl> for Actual {
    fn fold(&mut self, f: FnDecl) -> FnDecl {
        let f = f.fold_children(self);
        if !f.function.is_async {
            return f;
        }

        let function = self.fold_fn(Some(f.ident.clone()), f.function, true);
        FnDecl {
            ident: f.ident,
            function,
        }
    }
}

impl Actual {
    #[inline(always)]
    fn fold_fn(&mut self, raw_ident: Option<Ident>, f: Function, is_decl: bool) -> Function {
        let span = f.span();
        let params = f.params.clone();
        let ident = raw_ident.clone().unwrap_or_else(|| quote_ident!("ref"));

        let mark = Mark::fresh(Mark::root());
        let real_fn_ident = quote_ident!(ident.span.apply_mark(mark), format!("_{}", ident.sym));
        let right = make_fn_ref(
            &self.helpers,
            FnExpr {
                ident: None,
                function: f,
            },
        );

        if is_decl {
            let real_fn = FnDecl {
                ident: real_fn_ident.clone(),
                function: Function {
                    span: DUMMY_SP,
                    body: BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![
                            Stmt::Expr(box Expr::Assign(AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(box Pat::Ident(real_fn_ident.clone())),
                                op: op!("="),
                                right: box right,
                            })),
                            Stmt::Return(ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(box real_fn_ident.clone().apply(
                                    DUMMY_SP,
                                    box ThisExpr { span: DUMMY_SP }.into(),
                                    vec![quote_ident!("arguments").as_arg()],
                                )),
                            }),
                        ],
                    },
                    params: vec![],
                    is_async: false,
                    is_generator: false,
                },
            };
            self.extra_stmts.push(Stmt::Decl(Decl::Fn(real_fn)));
        } else {
            self.extra_stmts.push(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                decls: vec![VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(real_fn_ident.clone()),
                    init: Some(box right),
                }],
            })));
        }

        let apply = Stmt::Return(ReturnStmt {
            span: DUMMY_SP,
            arg: Some(box real_fn_ident.apply(
                DUMMY_SP,
                box Expr::This(ThisExpr { span: DUMMY_SP }),
                vec![quote_ident!("arguments").as_arg()],
            )),
        });
        Function {
            span,
            body: BlockStmt {
                span: DUMMY_SP,
                stmts: if is_decl {
                    vec![apply]
                } else {
                    vec![Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(box Expr::Fn(FnExpr {
                            ident: raw_ident,
                            function: Function {
                                span: DUMMY_SP,
                                is_async: false,
                                is_generator: false,
                                params: vec![],
                                body: BlockStmt {
                                    span: DUMMY_SP,
                                    stmts: vec![apply],
                                },
                            },
                        })),
                    })]
                },
            },
            params: params.clone(),
            is_generator: false,
            is_async: false,
        }
    }
}

/// Creates
///
/// `_asyncToGenerator(function*() {})` from `async function() {}`;
fn make_fn_ref(helpers: &Helpers, mut expr: FnExpr) -> Expr {
    struct AwaitToYield;

    impl Fold<Function> for AwaitToYield {
        /// Don't recurse into function.
        fn fold(&mut self, f: Function) -> Function {
            f
        }
    }

    impl Fold<Expr> for AwaitToYield {
        fn fold(&mut self, expr: Expr) -> Expr {
            let expr = expr.fold_children(self);

            match expr {
                Expr::Await(AwaitExpr { span, arg }) => Expr::Yield(YieldExpr {
                    span,
                    delegate: false,
                    arg: Some(arg),
                }),
                _ => expr,
            }
        }
    }

    expr.function.body = expr.function.body.fold_with(&mut AwaitToYield);

    assert!(expr.function.is_async);
    expr.function.is_async = false;
    expr.function.is_generator = true;

    let span = expr.span();
    helpers.async_to_generator.store(true, Ordering::Relaxed);

    let contains_this = contains_this_expr(&expr.function.body);
    let expr = if contains_this {
        Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: MemberExpr {
                span: DUMMY_SP,
                computed: false,
                obj: expr.as_obj(),
                prop: box Expr::Ident(quote_ident!("bind")),
            }
            .as_callee(),
            args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
        })
    } else {
        Expr::Fn(expr)
    };

    Expr::Call(CallExpr {
        span,
        callee: quote_ident!("_asyncToGenerator").as_callee(),
        args: vec![expr.as_arg()],
    })
}
