use std::iter;

use serde::Deserialize;
use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, helper_expr, perf::Check};
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{
    contains_this_expr,
    function::{FnEnvHoister, FnWrapperResult, FunctionWrapper},
    private_ident, quote_ident, ExprFactory, StmtLike,
};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitMutWith, VisitWith,
};
use swc_trace_macro::swc_trace;

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
#[tracing::instrument(level = "info", skip_all)]
pub fn async_to_generator(c: Config) -> impl Fold + VisitMut {
    as_folder(AsyncToGenerator { c })
}

#[derive(Debug, Clone, Copy, Default, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Config {
    #[serde(default)]
    pub ignore_function_name: bool,
    #[serde(default)]
    pub ignore_function_length: bool,
}

#[derive(Default, Clone)]
struct AsyncToGenerator {
    c: Config,
}

struct Actual {
    c: Config,

    extra_stmts: Vec<Stmt>,
    hoist_stmts: Vec<Stmt>,
}

#[swc_trace]
#[fast_path(ShouldWork)]
impl VisitMut for AsyncToGenerator {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        self.visit_mut_stmt_like(n);
    }

    fn visit_mut_stmts(&mut self, n: &mut Vec<Stmt>) {
        self.visit_mut_stmt_like(n);
    }
}

#[swc_trace]
impl AsyncToGenerator {
    fn visit_mut_stmt_like<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + VisitMutWith<Actual>,
        Vec<T>: VisitMutWith<Self>,
    {
        let mut stmts_updated = Vec::with_capacity(stmts.len());

        for mut stmt in stmts.drain(..) {
            let mut actual = Actual {
                c: self.c,
                extra_stmts: vec![],
                hoist_stmts: vec![],
            };

            stmt.visit_mut_with(&mut actual);
            stmts_updated.extend(actual.hoist_stmts.into_iter().map(T::from_stmt));
            stmts_updated.push(stmt);
            stmts_updated.extend(actual.extra_stmts.into_iter().map(T::from_stmt));
        }

        *stmts = stmts_updated;
        stmts.visit_mut_children_with(self);
    }
}

#[swc_trace]
#[fast_path(ShouldWork)]
impl VisitMut for Actual {
    noop_visit_mut_type!();

    fn visit_mut_class_method(&mut self, m: &mut ClassMethod) {
        if m.function.body.is_none() {
            return;
        }
        if m.kind != MethodKind::Method || !m.function.is_async {
            return;
        }
        let params = m.function.params.clone();

        let mut visitor = FnEnvHoister::default();
        m.function.params.clear();

        m.function.body.visit_mut_with(&mut visitor);

        let expr = make_fn_ref(FnExpr {
            ident: None,
            function: m.function.take(),
        });

        m.function = Function {
            span: m.span,
            is_async: false,
            is_generator: false,
            params,
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: visitor
                    .to_stmt()
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
        };
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        self.visit_mut_expr_with_binding(expr, None);
    }

    fn visit_mut_fn_decl(&mut self, f: &mut FnDecl) {
        f.visit_mut_children_with(self);
        if !f.function.is_async {
            return;
        }

        let mut wrapper = FunctionWrapper::from(f.take());
        wrapper.ignore_function_name = self.c.ignore_function_name;
        wrapper.ignore_function_length = self.c.ignore_function_length;

        let fn_expr = wrapper.function.fn_expr().unwrap();

        wrapper.function = make_fn_ref(fn_expr);

        let FnWrapperResult { name_fn, ref_fn } = wrapper.into();
        *f = name_fn;
        self.extra_stmts.push(Stmt::Decl(ref_fn.into()));
    }

    fn visit_mut_module_item(&mut self, item: &mut ModuleItem) {
        match item {
            // if fn is ExportDefaultDecl, fn is not FnDecl but FnExpr
            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export_default)) => {
                if let DefaultDecl::Fn(expr) = &mut export_default.decl {
                    if expr.function.is_async {
                        let mut wrapper = FunctionWrapper::from(expr.take());
                        wrapper.ignore_function_name = self.c.ignore_function_name;
                        wrapper.ignore_function_length = self.c.ignore_function_length;

                        let fn_expr = wrapper.function.fn_expr().unwrap();

                        wrapper.function = make_fn_ref(fn_expr);

                        let FnWrapperResult { name_fn, ref_fn } = wrapper.into();

                        *item = ModuleItem::ModuleDecl(
                            ExportDefaultDecl {
                                span: export_default.span,
                                decl: name_fn.into(),
                            }
                            .into(),
                        );
                        self.extra_stmts.push(Stmt::Decl(ref_fn.into()));
                    };
                } else {
                    export_default.visit_mut_children_with(self);
                }
            }
            _ => item.visit_mut_children_with(self),
        };
    }

    fn visit_mut_method_prop(&mut self, prop: &mut MethodProp) {
        prop.visit_mut_children_with(self);

        if !prop.function.is_async {
            return;
        }

        let is_this_used = contains_this_expr(&prop.function.body);

        let original_fn_params = prop.function.params.take();

        let prop_method_span = prop.function.span;
        let prop_method_body_span = if let Some(body) = &prop.function.body {
            body.span
        } else {
            DUMMY_SP
        };
        prop.function.span = prop_method_body_span;

        let fn_ref = make_fn_ref(FnExpr {
            ident: None,
            function: Function {
                params: vec![],
                ..prop.function.take()
            },
        });

        let fn_ref = if is_this_used {
            fn_ref.apply(
                DUMMY_SP,
                Box::new(Expr::This(ThisExpr { span: DUMMY_SP })),
                vec![],
            )
        } else {
            Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: fn_ref.as_callee(),
                args: vec![],
                type_args: Default::default(),
            })
        };

        prop.function = Function {
            params: original_fn_params,
            span: prop_method_span,
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
        }
    }

    fn visit_mut_stmts(&mut self, _n: &mut Vec<Stmt>) {}

    fn visit_mut_var_declarator(&mut self, var: &mut VarDeclarator) {
        if let VarDeclarator {
            name: Pat::Ident(BindingIdent { id, .. }),
            init: Some(init),
            ..
        } = var
        {
            match init.as_ref() {
                Expr::Fn(FnExpr {
                    ident: None,
                    ref function,
                }) if function.is_async || function.is_generator => {
                    self.visit_mut_expr_with_binding(init, Some(id.clone()));
                    return;
                }

                Expr::Arrow(arrow_expr) if arrow_expr.is_async || arrow_expr.is_generator => {
                    self.visit_mut_expr_with_binding(init, Some(id.clone()));
                    return;
                }

                _ => {}
            }
        }

        var.visit_mut_children_with(self);
    }
}

#[swc_trace]
impl Actual {
    fn visit_mut_expr_with_binding(&mut self, expr: &mut Expr, binding_ident: Option<Ident>) {
        expr.visit_mut_children_with(self);

        match expr {
            Expr::Arrow(arrow_expr @ ArrowExpr { is_async: true, .. }) => {
                let mut state = FnEnvHoister::default();

                arrow_expr.visit_mut_with(&mut state);

                self.hoist_stmts.extend(state.to_stmt());

                let mut wrapper = FunctionWrapper::from(arrow_expr.take());
                wrapper.ignore_function_name = self.c.ignore_function_name;
                wrapper.ignore_function_length = self.c.ignore_function_length;
                wrapper.binding_ident = binding_ident;

                let fn_expr = wrapper.function.expect_fn_expr();

                wrapper.function = make_fn_ref(fn_expr);
                *expr = wrapper.into();
            }

            Expr::Fn(
                fn_expr @ FnExpr {
                    function: Function { is_async: true, .. },
                    ..
                },
            ) => {
                let mut wrapper = FunctionWrapper::from(fn_expr.take());
                wrapper.ignore_function_name = self.c.ignore_function_name;
                wrapper.ignore_function_length = self.c.ignore_function_length;
                wrapper.binding_ident = binding_ident;

                let fn_expr = wrapper.function.expect_fn_expr();

                wrapper.function = make_fn_ref(fn_expr);

                *expr = wrapper.into();
            }

            _ => {}
        }
    }
}

/// Creates
///
/// `_asyncToGenerator(function*() {})` from `async function() {}`;
#[tracing::instrument(level = "info", skip_all)]
fn make_fn_ref(mut expr: FnExpr) -> Expr {
    expr.function.body.visit_mut_with(&mut AsyncFnBodyHandler {
        is_async_generator: expr.function.is_generator,
    });

    assert!(expr.function.is_async);
    expr.function.is_async = false;

    let helper = if expr.function.is_generator {
        helper!(wrap_async_generator, "wrapAsyncGenerator")
    } else {
        helper!(async_to_generator, "asyncToGenerator")
    };

    expr.function.is_generator = true;

    let span = expr.span();

    let expr = Expr::Fn(expr);

    Expr::Call(CallExpr {
        span,
        callee: helper,
        args: vec![expr.as_arg()],
        type_args: Default::default(),
    })
}

struct AsyncFnBodyHandler {
    is_async_generator: bool,
}

macro_rules! noop {
    ($name:ident, $T:path) => {
        /// Don't recurse into function.
        fn $name(&mut self, _f: &mut $T) {}
    };
}

#[swc_trace]
impl VisitMut for AsyncFnBodyHandler {
    noop_visit_mut_type!();

    noop!(visit_mut_fn_expr, FnExpr);

    noop!(visit_mut_constructor, Constructor);

    noop!(visit_mut_arrow_expr, ArrowExpr);

    noop!(visit_mut_fn_decl, FnDecl);

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        match expr {
            Expr::Yield(YieldExpr {
                span,
                arg: Some(arg),
                delegate: true,
            }) => {
                let callee = helper!(async_generator_delegate, "asyncGeneratorDelegate");
                let arg = Box::new(Expr::Call(CallExpr {
                    span: *span,
                    callee,
                    args: vec![
                        CallExpr {
                            span: DUMMY_SP,
                            callee: helper!(async_iterator, "asyncIterrator"),
                            args: vec![arg.take().as_arg()],
                            type_args: Default::default(),
                        },
                        helper_expr!(await_async_generator, "awaitAsyncGenerator").as_arg(),
                    ],
                    type_args: Default::default(),
                }));
                *expr = Expr::Yield(YieldExpr {
                    span: *span,
                    delegate: true,
                    arg: Some(arg),
                })
            }

            Expr::Await(AwaitExpr { span, arg }) => {
                if self.is_async_generator {
                    let callee = helper!(await_async_generator, "awaitAsyncGenerator");
                    let arg = Box::new(Expr::Call(CallExpr {
                        span: *span,
                        callee,
                        args: vec![arg.take().as_arg()],
                        type_args: Default::default(),
                    }));
                    *expr = Expr::Yield(YieldExpr {
                        span: *span,
                        delegate: false,
                        arg: Some(arg),
                    })
                } else {
                    *expr = Expr::Yield(YieldExpr {
                        span: *span,
                        delegate: false,
                        arg: Some(arg.take()),
                    })
                }
            }
            _ => {}
        }
    }

    fn visit_mut_stmt(&mut self, s: &mut Stmt) {
        s.visit_mut_children_with(self);

        handle_await_for(s, self.is_async_generator);
    }
}

#[derive(Default)]
struct ShouldWork {
    found: bool,
}

#[swc_trace]
impl Visit for ShouldWork {
    noop_visit_type!();

    fn visit_function(&mut self, f: &Function) {
        if f.is_async {
            self.found = true;
            return;
        }
        f.visit_children_with(self);
    }

    fn visit_arrow_expr(&mut self, f: &ArrowExpr) {
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

#[tracing::instrument(level = "info", skip_all)]
fn handle_await_for(stmt: &mut Stmt, is_async_generator: bool) {
    let s = match stmt {
        Stmt::ForOf(
            s @ ForOfStmt {
                await_token: Some(..),
                ..
            },
        ) => s.take(),
        _ => return,
    };

    let value = private_ident!("_value");
    let iterator = private_ident!("_iterator");
    let iterator_error = private_ident!("_iteratorError");
    let step = private_ident!("_step");
    let did_iteration_error = private_ident!("_didIteratorError");
    let iterator_abrupt_completion = private_ident!("_iteratorAbruptCompletion");
    let err_param = private_ident!("err");

    let try_body = {
        let body_span = s.body.span();
        let orig_body = match *s.body {
            Stmt::Block(s) => s.stmts,
            _ => vec![*s.body],
        };

        let mut for_loop_body = vec![];
        {
            // let value = _step.value;
            let value_var = VarDeclarator {
                span: DUMMY_SP,
                name: value.clone().into(),
                init: Some(Box::new(step.clone().make_member(quote_ident!("value")))),
                definite: false,
            };
            for_loop_body.push(Stmt::Decl(Decl::Var(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Let,
                declare: false,
                decls: vec![value_var],
            })));
        }

        match s.left {
            VarDeclOrPat::VarDecl(v) => {
                let var = v.decls.into_iter().next().unwrap();
                let var_decl = VarDeclarator {
                    span: DUMMY_SP,
                    name: var.name,
                    init: Some(Box::new(Expr::Ident(value))),
                    definite: false,
                };
                for_loop_body.push(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Const,
                    declare: false,
                    decls: vec![var_decl],
                })));
            }
            VarDeclOrPat::Pat(p) => {
                for_loop_body.push(Stmt::Expr(ExprStmt {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left: PatOrExpr::Pat(Box::new(p)),
                        right: Box::new(Expr::Ident(value)),
                    })),
                }));
            }
        }

        for_loop_body.extend(orig_body);

        let for_loop_body = BlockStmt {
            span: body_span,
            stmts: for_loop_body,
        };

        let mut init_var_decls = vec![];
        // _iterator = _asyncIterator(lol())
        init_var_decls.push(VarDeclarator {
            span: DUMMY_SP,
            name: iterator.clone().into(),
            init: {
                let callee = helper!(async_iterator, "asyncIterator");

                Some(Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee,
                    args: vec![s.right.as_arg()],
                    type_args: Default::default(),
                })))
            },
            definite: false,
        });
        init_var_decls.push(VarDeclarator {
            span: DUMMY_SP,
            name: step.clone().into(),
            init: None,
            definite: false,
        });

        let for_stmt = Stmt::For(ForStmt {
            span: s.span,
            // var _iterator = _asyncIterator(lol()), _step;
            init: Some(VarDeclOrExpr::VarDecl(VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: init_var_decls,
            })),
            // _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done
            test: {
                let iter_next = iterator.clone().make_member(quote_ident!("next"));
                let iter_next = CallExpr {
                    span: DUMMY_SP,
                    callee: iter_next.as_callee(),
                    args: Default::default(),
                    type_args: Default::default(),
                };

                let yield_arg = if is_async_generator {
                    Box::new(Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(await_async_generator, "awaitAsyncGenerator"),
                        args: vec![iter_next.as_arg()],
                        type_args: Default::default(),
                    }))
                } else {
                    Box::new(Expr::Call(iter_next))
                };

                let assign_to_step = Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: PatOrExpr::Pat(step.into()),
                    right: Box::new(Expr::Yield(YieldExpr {
                        span: DUMMY_SP,
                        arg: Some(yield_arg),
                        delegate: false,
                    })),
                });

                let right = Box::new(Expr::Unary(UnaryExpr {
                    span: DUMMY_SP,
                    op: op!("!"),
                    arg: Box::new(assign_to_step.make_member(quote_ident!("done"))),
                }));

                let left = PatOrExpr::Pat(iterator_abrupt_completion.clone().into());

                Some(Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left,
                    right,
                })))
            },
            // _iteratorNormalCompletion = true
            update: Some(Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: PatOrExpr::Pat(iterator_abrupt_completion.clone().into()),
                right: false.into(),
            }))),
            body: Box::new(Stmt::Block(for_loop_body)),
        });

        BlockStmt {
            span: body_span,
            stmts: vec![for_stmt],
        }
    };

    let catch_clause = {
        // _didIteratorError = true;
        let mark_as_errorred = Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: PatOrExpr::Pat(did_iteration_error.clone().into()),
                right: true.into(),
            })),
        });
        // _iteratorError = err;
        let store_error = Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: PatOrExpr::Pat(iterator_error.clone().into()),
                right: Box::new(Expr::Ident(err_param.clone())),
            })),
        });

        CatchClause {
            span: DUMMY_SP,
            param: Some(err_param.into()),
            body: BlockStmt {
                span: DUMMY_SP,
                stmts: vec![mark_as_errorred, store_error],
            },
        }
    };

    let finally_block = {
        let throw_iterator_error = Stmt::Throw(ThrowStmt {
            span: DUMMY_SP,
            arg: Box::new(Expr::Ident(iterator_error.clone())),
        });
        let throw_iterator_error = Stmt::If(IfStmt {
            span: DUMMY_SP,
            test: Box::new(Expr::Ident(did_iteration_error.clone())),
            cons: Box::new(Stmt::Block(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![throw_iterator_error],
            })),
            alt: None,
        });

        // yield _iterator.return();
        let yield_stmt = Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(Expr::Yield(YieldExpr {
                span: DUMMY_SP,
                delegate: false,
                arg: Some(Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: iterator_error
                        .clone()
                        .make_member(quote_ident!("return"))
                        .as_callee(),
                    args: Default::default(),
                    type_args: Default::default(),
                }))),
            })),
        });

        let conditional_yield = Stmt::If(IfStmt {
            span: DUMMY_SP,
            // _iteratorAbruptCompletion && _iterator.return != null
            test: Box::new(Expr::Bin(BinExpr {
                span: DUMMY_SP,
                op: op!("&&"),
                // _iteratorAbruptCompletion
                left: Box::new(Expr::Ident(iterator_abrupt_completion.clone())),
                // _iterator.return != null
                right: Box::new(Expr::Bin(BinExpr {
                    span: DUMMY_SP,
                    op: op!("!="),
                    left: Box::new(iterator.make_member(quote_ident!("return"))),
                    right: Null { span: DUMMY_SP }.into(),
                })),
            })),
            cons: Box::new(Stmt::Block(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![yield_stmt],
            })),
            alt: None,
        });
        let body = BlockStmt {
            span: DUMMY_SP,
            stmts: vec![conditional_yield],
        };

        let inner_try = Stmt::Try(TryStmt {
            span: DUMMY_SP,
            block: body,
            handler: None,
            finalizer: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![throw_iterator_error],
            }),
        });
        BlockStmt {
            span: DUMMY_SP,
            stmts: vec![inner_try],
        }
    };

    let try_stmt = TryStmt {
        span: s.span,
        block: try_body,
        handler: Some(catch_clause),
        finalizer: Some(finally_block),
    };

    let stmts = vec![
        Stmt::Decl(Decl::Var(VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Var,
            declare: false,
            decls: vec![
                // var _iteratorAbruptCompletion = false;
                VarDeclarator {
                    span: DUMMY_SP,
                    name: iterator_abrupt_completion.into(),
                    init: Some(false.into()),
                    definite: false,
                },
                // var _didIteratorError = false;
                VarDeclarator {
                    span: DUMMY_SP,
                    name: did_iteration_error.into(),
                    init: Some(false.into()),
                    definite: false,
                },
                // var _iteratorError;
                VarDeclarator {
                    span: DUMMY_SP,
                    name: iterator_error.into(),
                    init: None,
                    definite: false,
                },
            ],
        })),
        Stmt::Try(try_stmt),
    ];

    *stmt = Stmt::Block(BlockStmt {
        span: s.span,
        stmts,
    })
}
