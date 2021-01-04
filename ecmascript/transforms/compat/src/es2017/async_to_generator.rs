use crate::{
    compat::es2015::arrow,
    perf::Check,
    util::{contains_ident_ref, contains_this_expr, ExprFactory, StmtLike},
};
use std::iter;
use swc_common::{Mark, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith, Node, Visit, VisitWith};

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
pub fn async_to_generator() -> impl Fold {
    AsyncToGenerator
}

#[derive(Default, Clone)]
struct AsyncToGenerator;

struct Actual {
    extra_stmts: Vec<Stmt>,
}

#[fast_path(ShouldWork)]
impl Fold for AsyncToGenerator {
    noop_fold_type!();

    fn fold_module_items(&mut self, n: Vec<ModuleItem>) -> Vec<ModuleItem> {
        self.fold_stmt_like(n)
    }

    fn fold_stmts(&mut self, n: Vec<Stmt>) -> Vec<Stmt> {
        self.fold_stmt_like(n)
    }
}

impl AsyncToGenerator {
    fn fold_stmt_like<T>(&mut self, stmts: Vec<T>) -> Vec<T>
    where
        T: StmtLike + FoldWith<Actual>,
        Vec<T>: FoldWith<Self>,
    {
        let stmts = stmts.fold_children_with(self);

        let mut buf = Vec::with_capacity(stmts.len());

        for stmt in stmts {
            let mut actual = Actual {
                extra_stmts: vec![],
            };
            let stmt = stmt.fold_with(&mut actual);

            buf.extend(actual.extra_stmts.into_iter().map(T::from_stmt));
            buf.push(stmt);
        }

        buf
    }
}

#[fast_path(ShouldWork)]
impl Fold for Actual {
    noop_fold_type!();

    fn fold_class_method(&mut self, mut m: ClassMethod) -> ClassMethod {
        if m.function.body.is_none() {
            return m;
        }
        if m.kind != MethodKind::Method || !m.function.is_async {
            return m;
        }
        let params = m.function.params.clone();

        let mut folder = MethodFolder { vars: vec![] };
        m.function.params.clear();
        let function = m.function.fold_children_with(&mut folder);
        let expr = make_fn_ref(FnExpr {
            ident: None,
            function,
        });

        let hoisted_super = if folder.vars.is_empty() {
            None
        } else {
            Some(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                decls: folder.vars,
                declare: false,
            })))
        };

        ClassMethod {
            function: Function {
                span: m.span,
                is_async: false,
                is_generator: false,
                params,
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: hoisted_super
                        .into_iter()
                        .chain(iter::once(Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(Box::new(Expr::Call(CallExpr {
                                span: DUMMY_SP,
                                callee: expr.as_callee(),
                                args: vec![],
                                type_args: Default::default(),
                            }))),
                        })))
                        .collect(),
                }),
                decorators: Default::default(),
                type_params: Default::default(),
                return_type: Default::default(),
            },
            ..m
        }
    }

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let expr = validate!(expr);

        match expr {
            Expr::Paren(ParenExpr { span, expr }) => {
                return Expr::Paren(ParenExpr {
                    span,
                    expr: expr.fold_with(self),
                })
            }

            // Optimization for iife.
            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(callee),
                args,
                type_args,
            }) if callee.is_fn_expr() => {
                return self.handle_fn_expr(span, (*callee).fn_expr().unwrap(), args, type_args);
            }

            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(callee),
                args,
                type_args,
            }) if match &*callee {
                Expr::Paren(ParenExpr { expr, .. }) => match &**expr {
                    Expr::Fn(..) => true,
                    _ => false,
                },
                _ => false,
            } =>
            {
                return self.handle_fn_expr(
                    span,
                    (*callee).paren().unwrap().expr.fn_expr().unwrap(),
                    args,
                    type_args,
                );
            }

            _ => {}
        }

        let expr = expr.fold_children_with(self);

        match expr {
            Expr::Arrow(ArrowExpr { is_async: true, .. }) => {
                // Apply arrow
                let expr = expr.fold_with(&mut arrow());

                let f = match expr {
                    Expr::Fn(f) => f,
                    _ => return expr,
                };

                return make_fn_ref(f);
            }

            Expr::Fn(
                expr
                @
                FnExpr {
                    function:
                        Function {
                            is_async: true,
                            body: Some(..),
                            ..
                        },
                    ..
                },
            ) => {
                let function = self.fold_fn(expr.ident.clone(), expr.function, false);
                let body = Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: self
                        .extra_stmts
                        .drain(..)
                        .chain(function.body.unwrap().stmts)
                        .collect(),
                });

                Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: Expr::Fn(FnExpr {
                        ident: None,
                        function: Function { body, ..function },
                    })
                    .as_callee(),
                    args: vec![],
                    type_args: Default::default(),
                })
            }

            _ => expr,
        }
    }

    fn fold_fn_decl(&mut self, f: FnDecl) -> FnDecl {
        let f = f.fold_children_with(self);
        if !f.function.is_async {
            return f;
        }

        let function = self.fold_fn(Some(f.ident.clone()), f.function, true);
        FnDecl {
            ident: f.ident,
            function,
            declare: false,
        }
    }
    fn fold_method_prop(&mut self, prop: MethodProp) -> MethodProp {
        let prop = validate!(prop);
        let prop = prop.fold_children_with(self);

        if !prop.function.is_async {
            return prop;
        }
        let params = prop.function.params;

        let fn_ref = make_fn_ref(FnExpr {
            ident: None,
            function: Function {
                params: vec![],
                ..prop.function
            },
        });
        let fn_ref = Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: fn_ref.as_callee(),
            args: vec![],
            type_args: Default::default(),
        });

        MethodProp {
            function: Function {
                params,
                span: DUMMY_SP,
                is_async: false,
                is_generator: false,
                body: Some(BlockStmt {
                    span: DUMMY_SP,
                    stmts: vec![Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(Box::new(fn_ref)),
                    })],
                }),
                decorators: Default::default(),
                return_type: Default::default(),
                type_params: Default::default(),
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
struct MethodFolder {
    vars: Vec<VarDeclarator>,
}

impl MethodFolder {
    fn handle_assign_to_super_prop(
        &mut self,
        span: Span,
        left: MemberExpr,
        op: AssignOp,
        right: Box<Expr>,
    ) -> Expr {
        let MemberExpr {
            span: m_span,
            obj,
            computed,
            prop,
        } = left;
        let super_token = match obj {
            ExprOrSuper::Super(super_token) => super_token,
            _ => unreachable!("handle_assign_to_super_prop does not accept non-super object"),
        };

        let (mark, ident) = self.ident_for_super(&prop);
        let args_ident = quote_ident!(DUMMY_SP.apply_mark(mark), "_args");

        self.vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(ident.clone()),
            init: Some(Box::new(Expr::Arrow(ArrowExpr {
                span: DUMMY_SP,
                is_async: false,
                is_generator: false,
                params: vec![Pat::Ident(args_ident.clone())],
                body: BlockStmtOrExpr::Expr(Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Expr(Box::new(
                        MemberExpr {
                            span: m_span,
                            obj: ExprOrSuper::Super(super_token),
                            computed,
                            prop,
                        }
                        .into(),
                    )),
                    op,
                    right: Box::new(args_ident.into()),
                }))),
                type_params: Default::default(),
                return_type: Default::default(),
            }))),
            definite: false,
        });

        Expr::Call(CallExpr {
            span,
            callee: ident.as_callee(),
            args: vec![right.as_arg()],
            type_args: Default::default(),
        })
    }
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

impl Fold for MethodFolder {
    noop_fold_type!();

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        let expr = validate!(expr);
        // TODO(kdy): Cache (Reuse declaration for same property)

        match expr {
            // super.setter = 1
            Expr::Assign(AssignExpr {
                span,
                left: PatOrExpr::Expr(left),
                op,
                right,
            }) if match &*left {
                Expr::Member(MemberExpr {
                    obj: ExprOrSuper::Super(..),
                    ..
                }) => true,
                _ => false,
            } =>
            {
                return self.handle_assign_to_super_prop(span, left.member().unwrap(), op, right);
            }

            // super.setter = 1
            Expr::Assign(AssignExpr {
                span,
                left: PatOrExpr::Pat(left),
                op,
                right,
            }) if match &*left {
                Pat::Expr(left) => match &**left {
                    Expr::Member(MemberExpr {
                        obj: ExprOrSuper::Super(..),
                        ..
                    }) => true,
                    _ => false,
                },
                _ => false,
            } =>
            {
                return self.handle_assign_to_super_prop(
                    span,
                    left.expr().unwrap().member().unwrap(),
                    op,
                    right,
                );
            }

            // super.method()
            Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(callee),
                args,
                type_args,
            }) if match *callee {
                Expr::Member(MemberExpr {
                    obj: ExprOrSuper::Super(..),
                    ..
                }) => true,
                _ => false,
            } =>
            {
                let MemberExpr {
                    obj,
                    prop,
                    computed,
                    ..
                } = callee.member().unwrap();
                let super_token = match obj {
                    ExprOrSuper::Super(super_token) => super_token,
                    _ => unreachable!(),
                };

                let (mark, ident) = self.ident_for_super(&prop);
                let args_ident = quote_ident!(DUMMY_SP.apply_mark(mark), "_args");

                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(ident.clone()),
                    init: Some(Box::new(Expr::Arrow(ArrowExpr {
                        span: DUMMY_SP,
                        is_async: false,
                        is_generator: false,
                        params: vec![Pat::Rest(RestPat {
                            span: DUMMY_SP,
                            dot3_token: DUMMY_SP,
                            arg: Box::new(Pat::Ident(args_ident.clone())),
                            type_ann: Default::default(),
                        })],
                        body: BlockStmtOrExpr::Expr(Box::new(Expr::Call(CallExpr {
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
                                expr: Box::new(args_ident.into()),
                            }],
                            type_args: Default::default(),
                        }))),
                        type_params: Default::default(),
                        return_type: Default::default(),
                    }))),
                    definite: false,
                });

                Expr::Call(CallExpr {
                    span,
                    callee: ident.as_callee(),
                    args,
                    type_args,
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
                    init: Some(Box::new(Expr::Arrow(ArrowExpr {
                        span: DUMMY_SP,
                        is_async: false,
                        is_generator: false,
                        params: vec![],
                        body: BlockStmtOrExpr::Expr(Box::new(
                            MemberExpr {
                                span: DUMMY_SP,
                                obj: ExprOrSuper::Super(super_token),
                                computed,
                                prop,
                            }
                            .into(),
                        )),
                        type_params: Default::default(),
                        return_type: Default::default(),
                    }))),
                    definite: false,
                });

                Expr::Call(CallExpr {
                    span,
                    callee: ident.as_callee(),
                    args: vec![],
                    type_args: Default::default(),
                })
            }
            _ => expr.fold_children_with(self),
        }
    }
}

impl Actual {
    fn handle_fn_expr(
        &mut self,
        span: Span,
        callee: FnExpr,
        args: Vec<ExprOrSpread>,
        type_args: Option<TsTypeParamInstantiation>,
    ) -> Expr {
        if !callee.function.is_async {
            return Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(Box::new(Expr::Fn(callee))),
                args,
                type_args,
            });
        }

        // https://github.com/babel/babel/issues/8783
        if callee.ident.is_some()
            && contains_ident_ref(&callee.function.body, callee.ident.as_ref().unwrap())
        {
            return Expr::Call(CallExpr {
                span,
                callee: ExprOrSuper::Expr(Box::new(Expr::Fn(callee))),
                args,
                type_args,
            })
            .fold_children_with(self);
        }

        return make_fn_ref(callee);
    }
    fn fold_fn(&mut self, raw_ident: Option<Ident>, f: Function, is_decl: bool) -> Function {
        if f.body.is_none() {
            return f;
        }
        let span = f.span();
        let params = {
            let mut done = false;
            f.params
                .iter()
                .filter_map(|p| {
                    if done {
                        None
                    } else {
                        match p.pat {
                            Pat::Ident(..) => Some(p.clone()),
                            Pat::Array(..) | Pat::Object(..) => Some(Param {
                                pat: Pat::Ident(private_ident!("_")),
                                ..p.clone()
                            }),
                            _ => {
                                done = true;
                                None
                            }
                        }
                    }
                })
                .collect()
        };
        let ident = raw_ident.clone().unwrap_or_else(|| quote_ident!("ref"));

        let real_fn_ident = private_ident!(ident.span, format!("_{}", ident.sym));
        let right = make_fn_ref(FnExpr {
            ident: None,
            function: f,
        });

        if is_decl {
            let real_fn = FnDecl {
                ident: real_fn_ident.clone(),
                declare: false,
                function: Function {
                    span: DUMMY_SP,
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![
                            AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(Box::new(Pat::Ident(real_fn_ident.clone()))),
                                op: op!("="),
                                right: Box::new(right),
                            }
                            .into_stmt(),
                            Stmt::Return(ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(Box::new(real_fn_ident.clone().apply(
                                    DUMMY_SP,
                                    Box::new(ThisExpr { span: DUMMY_SP }.into()),
                                    vec![quote_ident!("arguments").as_arg()],
                                ))),
                            }),
                        ],
                    }),
                    params: vec![],
                    is_async: false,
                    is_generator: false,
                    decorators: Default::default(),
                    type_params: Default::default(),
                    return_type: Default::default(),
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
                    init: Some(Box::new(right)),
                    definite: false,
                }],
                declare: false,
            })));
        }

        let apply = Stmt::Return(ReturnStmt {
            span: DUMMY_SP,
            arg: Some(Box::new(real_fn_ident.apply(
                DUMMY_SP,
                Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                vec![quote_ident!("arguments").as_arg()],
            ))),
        });
        Function {
            span,
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: if is_decl {
                    vec![apply]
                } else {
                    // function foo() {
                    //      return _foo.apply(this, arguments);
                    // }
                    let f = Function {
                        span: DUMMY_SP,
                        is_async: false,
                        is_generator: false,
                        params: vec![],
                        body: Some(BlockStmt {
                            span: DUMMY_SP,
                            stmts: vec![apply],
                        }),
                        decorators: Default::default(),
                        type_params: Default::default(),
                        return_type: Default::default(),
                    };

                    if raw_ident.is_some() {
                        vec![
                            Stmt::Decl(Decl::Fn(FnDecl {
                                ident: raw_ident.clone().unwrap(),
                                declare: false,
                                function: f,
                            })),
                            Stmt::Return(ReturnStmt {
                                span: DUMMY_SP,
                                arg: Some(Box::new(Expr::Ident(raw_ident.clone().unwrap()))),
                            }),
                        ]
                    } else {
                        vec![Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(Box::new(Expr::Fn(FnExpr {
                                ident: raw_ident,
                                function: f,
                            }))),
                        })]
                    }
                },
            }),
            params,
            is_generator: false,
            is_async: false,
            decorators: Default::default(),
            return_type: Default::default(),
            type_params: Default::default(),
        }
    }
}

/// Creates
///
/// `_asyncToGenerator(function*() {})` from `async function() {}`;
fn make_fn_ref(mut expr: FnExpr) -> Expr {
    struct AwaitToYield;

    macro_rules! noop {
        ($name:ident, $T:path) => {
            /// Don't recurse into function.
            fn $name(&mut self, f: $T) -> $T {
                f
            }
        };
    }

    impl Fold for AwaitToYield {
        noop_fold_type!();

        noop!(fold_fn_decl, FnDecl);
        noop!(fold_fn_expr, FnExpr);
        noop!(fold_constructor, Constructor);
        noop!(fold_arrow_expr, ArrowExpr);

        fn fold_expr(&mut self, expr: Expr) -> Expr {
            let expr = expr.fold_children_with(self);

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

    let contains_this = contains_this_expr(&expr.function.body);
    let expr = if contains_this {
        Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: validate!(expr.make_member(quote_ident!("bind"))).as_callee(),
            args: vec![ThisExpr { span: DUMMY_SP }.as_arg()],
            type_args: Default::default(),
        })
    } else {
        Expr::Fn(expr)
    };

    Expr::Call(CallExpr {
        span,
        callee: helper!(async_to_generator, "asyncToGenerator"),
        args: vec![expr.as_arg()],
        type_args: Default::default(),
    })
}

#[derive(Default)]
struct ShouldWork {
    found: bool,
}

impl Visit for ShouldWork {
    noop_visit_type!();

    fn visit_function(&mut self, f: &Function, _: &dyn Node) {
        if f.is_async {
            self.found = true;
            return;
        }
        f.visit_children_with(self);
    }

    fn visit_arrow_expr(&mut self, f: &ArrowExpr, _: &dyn Node) {
        if f.is_async {
            self.found = true;
            return;
        }
        f.visit_children_with(self);
    }
}

impl Check for ShouldWork {
    fn should_handle(&self) -> bool {
        self.found
    }
}
