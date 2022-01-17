use std::{iter, mem::replace};
use swc_common::{util::take::Take, Mark, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, perf::Check};
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{
    contains_this_expr,
    function::{FnEnvHoister, FnEnvState, FnWrapperResult, FunctionWrapper},
    private_ident, quote_ident, ExprFactory, StmtLike,
};
use swc_ecma_visit::{
    as_folder, noop_visit_mut_type, noop_visit_type, Fold, Visit, VisitMut, VisitMutWith, VisitWith,
};

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
pub fn async_to_generator() -> impl Fold + VisitMut {
    as_folder(AsyncToGenerator)
}

#[derive(Default, Clone)]
struct AsyncToGenerator;

struct Actual {
    extra_stmts: Vec<Stmt>,
    hoist_stmts: Vec<Stmt>,
}

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

impl AsyncToGenerator {
    fn visit_mut_stmt_like<T>(&mut self, stmts: &mut Vec<T>)
    where
        T: StmtLike + VisitMutWith<Actual>,
        Vec<T>: VisitMutWith<Self>,
    {
        let mut stmts_updated = Vec::with_capacity(stmts.len());

        for mut stmt in stmts.drain(..) {
            let mut actual = Actual {
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

#[fast_path(ShouldWork)]
impl VisitMut for Actual {
    noop_visit_mut_type!();

    /// Removes nested binds like `(function(){}).bind(this).bind(this)`
    fn visit_mut_call_expr(&mut self, n: &mut CallExpr) {
        n.visit_mut_children_with(self);

        if let Some(callee) = extract_callee_of_bind_this(n) {
            if let Expr::Call(callee_of_callee) = callee {
                if let Some(..) = extract_callee_of_bind_this(callee_of_callee) {
                    // We found bind(this).bind(this)
                    *n = replace(
                        callee_of_callee,
                        CallExpr {
                            span: DUMMY_SP,
                            callee: Callee::Super(Super { span: DUMMY_SP }),
                            args: Default::default(),
                            type_args: Default::default(),
                        },
                    );
                }
            }
        }
    }

    fn visit_mut_class_method(&mut self, m: &mut ClassMethod) {
        if m.function.body.is_none() {
            return;
        }
        if m.kind != MethodKind::Method || !m.function.is_async {
            return;
        }
        let params = m.function.params.clone();

        let mut folder = MethodFolder {
            vars: vec![],
            scope_ident: FnEnvState::default(),
        };
        m.function.params.clear();

        m.function.visit_mut_children_with(&mut folder);

        let expr = make_fn_ref(
            FnExpr {
                ident: None,
                function: m.function.take(),
            },
            None,
            false,
        );

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

        m.function = Function {
            span: m.span,
            is_async: false,
            is_generator: false,
            params,
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: hoisted_super
                    .into_iter()
                    .chain(folder.scope_ident.to_stmt())
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

        let fn_expr = wrapper.function.fn_expr().unwrap();

        wrapper.function = make_fn_ref(fn_expr, None, true);

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

                        let fn_expr = wrapper.function.fn_expr().unwrap();

                        wrapper.function = make_fn_ref(fn_expr, None, true);

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

        let fn_ref = make_fn_ref(
            FnExpr {
                ident: None,
                function: Function {
                    params: vec![],
                    ..prop.function.take()
                },
            },
            None,
            true,
        );

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
    scope_ident: FnEnvState,
}

impl MethodFolder {
    fn handle_assign_to_super_prop(
        &mut self,
        span: Span,
        left: SuperPropExpr,
        op: AssignOp,
        right: Box<Expr>,
    ) -> Expr {
        let SuperPropExpr {
            span: m_span,
            obj,
            prop,
        } = left;

        let (mark, ident) = self.ident_for_super(&prop);
        let args_ident = quote_ident!(DUMMY_SP.apply_mark(mark), "_args");

        self.vars.push(VarDeclarator {
            span: DUMMY_SP,
            name: ident.clone().into(),
            init: Some(Box::new(Expr::Arrow(ArrowExpr {
                span: DUMMY_SP,
                is_async: false,
                is_generator: false,
                params: vec![args_ident.clone().into()],
                body: BlockStmtOrExpr::Expr(Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Expr(Box::new(
                        SuperPropExpr {
                            span: m_span,
                            obj,
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
    fn ident_for_super(&mut self, prop: &SuperProp) -> (Mark, Ident) {
        let mark = Mark::fresh(Mark::root());
        let prop_span = prop.span();
        let mut ident = match *prop {
            SuperProp::Ident(ref ident) => quote_ident!(prop_span, format!("_super_{}", ident.sym)),
            _ => quote_ident!(prop_span, "_super_method"),
        };
        ident.span = ident.span.apply_mark(mark);
        (mark, ident)
    }
}

impl VisitMut for MethodFolder {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        match expr {
            // TODO: handle arrow with this in constructor once we remove all this bind
            Expr::Arrow(ArrowExpr { body, .. }) => {
                body.visit_mut_with(&mut FnEnvHoister::new(&mut self.scope_ident));
            }
            Expr::Fn(FnExpr {
                function: Function {
                    body: Some(body), ..
                },
                ..
            }) => {
                body.visit_mut_with(&mut FnEnvHoister::new(&mut self.scope_ident));
            }
            _ => {}
        };

        // TODO(kdy): Cache (Reuse declaration for same property)

        match expr {
            // super.setter = 1
            Expr::Assign(AssignExpr {
                span,
                left: PatOrExpr::Expr(left),
                op,
                right,
            }) if left.is_super_prop() => {
                *expr = self.handle_assign_to_super_prop(
                    *span,
                    left.take().expect_super_prop(),
                    *op,
                    right.take(),
                );
            }

            // super.setter = 1
            Expr::Assign(AssignExpr {
                span,
                left: PatOrExpr::Pat(left),
                op,
                right,
            }) if match &**left {
                Pat::Expr(left) => left.is_super_prop(),
                _ => false,
            } =>
            {
                *expr = self.handle_assign_to_super_prop(
                    *span,
                    left.take().expect_expr().expect_super_prop(),
                    *op,
                    right.take(),
                );
                return;
            }

            // super.method()
            Expr::Call(CallExpr {
                span,
                callee: Callee::Expr(callee),
                args,
                type_args,
            }) if callee.is_super_prop() => {
                let SuperPropExpr { obj, prop, .. } = callee.take().expect_super_prop();

                let (mark, ident) = self.ident_for_super(&prop);
                let args_ident = quote_ident!(DUMMY_SP.apply_mark(mark), "_args");

                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: ident.clone().into(),
                    init: Some(Box::new(Expr::Arrow(ArrowExpr {
                        span: DUMMY_SP,
                        is_async: false,
                        is_generator: false,
                        params: vec![Pat::Rest(RestPat {
                            span: DUMMY_SP,
                            dot3_token: DUMMY_SP,
                            arg: args_ident.clone().into(),
                            type_ann: Default::default(),
                        })],
                        body: BlockStmtOrExpr::Expr(Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: SuperPropExpr {
                                span: DUMMY_SP,
                                obj,
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

                *expr = Expr::Call(CallExpr {
                    span: *span,
                    callee: ident.as_callee(),
                    args: args.take(),
                    type_args: type_args.take(),
                });
            }
            // super.getter
            Expr::SuperProp(SuperPropExpr { span, obj, prop }) => {
                let (_, ident) = self.ident_for_super(&prop);
                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: ident.clone().into(),
                    init: Some(Box::new(Expr::Arrow(ArrowExpr {
                        span: DUMMY_SP,
                        is_async: false,
                        is_generator: false,
                        params: vec![],
                        body: BlockStmtOrExpr::Expr(Box::new(
                            SuperPropExpr {
                                span: DUMMY_SP,
                                obj: obj.take(),
                                prop: prop.take(),
                            }
                            .into(),
                        )),
                        type_params: Default::default(),
                        return_type: Default::default(),
                    }))),
                    definite: false,
                });

                *expr = Expr::Call(CallExpr {
                    span: *span,
                    callee: ident.as_callee(),
                    args: vec![],
                    type_args: Default::default(),
                })
            }
            _ => expr.visit_mut_children_with(self),
        }
    }
}

impl Actual {
    fn visit_mut_expr_with_binding(&mut self, expr: &mut Expr, binding_ident: Option<Ident>) {
        expr.visit_mut_children_with(self);

        match expr {
            Expr::Arrow(arrow_expr @ ArrowExpr { is_async: true, .. }) => {
                let mut state = FnEnvState::default();

                arrow_expr
                    .body
                    .visit_mut_with(&mut FnEnvHoister::new(&mut state));

                self.hoist_stmts.extend(state.to_stmt());

                let mut wrapper = FunctionWrapper::from(arrow_expr.take());
                wrapper.binding_ident = binding_ident;

                let fn_expr = wrapper.function.expect_fn_expr();

                // We should not bind `this` in FunctionWrapper
                wrapper.function = make_fn_ref(fn_expr, None, true);
                *expr = wrapper.into();
            }

            Expr::Fn(
                fn_expr @ FnExpr {
                    function: Function { is_async: true, .. },
                    ..
                },
            ) => {
                let mut wrapper = FunctionWrapper::from(fn_expr.take());
                wrapper.binding_ident = binding_ident;

                let fn_expr = wrapper.function.expect_fn_expr();

                wrapper.function = make_fn_ref(fn_expr, None, true);

                *expr = wrapper.into();
            }

            _ => {}
        }
    }
}

/// Creates
///
/// `_asyncToGenerator(function*() {})` from `async function() {}`;
fn make_fn_ref(
    mut expr: FnExpr,
    this_expr: Option<ExprOrSpread>,
    should_not_bind_this: bool,
) -> Expr {
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

    let should_bind_this = !should_not_bind_this && contains_this_expr(&expr.function.body);
    let expr = if should_bind_this {
        Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: expr.make_member(quote_ident!("bind")).as_callee(),
            args: vec![this_expr.unwrap_or(ThisExpr { span: DUMMY_SP }.as_arg())],
            type_args: Default::default(),
        })
    } else {
        Expr::Fn(expr)
    };

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

impl VisitMut for AsyncFnBodyHandler {
    noop_visit_mut_type!();

    noop!(visit_mut_fn_expr, FnExpr);
    noop!(visit_mut_constructor, Constructor);
    noop!(visit_mut_arrow_expr, ArrowExpr);
    noop!(visit_mut_fn_decl, FnDecl);

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        match expr {
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
            _ => (),
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

fn extract_callee_of_bind_this(n: &mut CallExpr) -> Option<&mut Expr> {
    if n.args.len() != 1 {
        return None;
    }

    match &*n.args[0].expr {
        Expr::This(..) => {}
        _ => return None,
    }

    match &mut n.callee {
        Callee::Super(_) | Callee::Import(_) => None,
        Callee::Expr(callee) => match &mut **callee {
            Expr::Member(MemberExpr {
                prop: MemberProp::Ident(Ident { sym, .. }),
                ..
            }) if *sym == *"bind" => Some(&mut **callee),
            _ => None,
        },
    }
}

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
                    init: Some(Box::new(Expr::Ident(value.clone()))),
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
                        right: Box::new(Expr::Ident(value.clone())),
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
                    left: PatOrExpr::Pat(step.clone().into()),
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
                right: Box::new(Expr::Lit(Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: false,
                }))),
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
                right: Box::new(Expr::Lit(Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: true,
                }))),
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
            param: Some(err_param.clone().into()),
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
                    left: Box::new(iterator.clone().make_member(quote_ident!("return"))),
                    right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
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

    let mut stmts = vec![];

    stmts.push(Stmt::Decl(Decl::Var(VarDecl {
        span: DUMMY_SP,
        kind: VarDeclKind::Var,
        declare: false,
        decls: {
            let mut decls = vec![];

            // var _iteratorAbruptCompletion = false;
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: iterator_abrupt_completion.into(),
                init: Some(Box::new(Expr::Lit(Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: false,
                })))),
                definite: false,
            });

            // var _didIteratorError = false;
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: did_iteration_error.into(),
                init: Some(Box::new(Expr::Lit(Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: false,
                })))),
                definite: false,
            });

            // var _iteratorError;
            decls.push(VarDeclarator {
                span: DUMMY_SP,
                name: iterator_error.clone().into(),
                init: None,
                definite: false,
            });

            decls
        },
    })));

    stmts.push(Stmt::Try(try_stmt));
    *stmt = Stmt::Block(BlockStmt {
        span: s.span,
        stmts,
    })
}
