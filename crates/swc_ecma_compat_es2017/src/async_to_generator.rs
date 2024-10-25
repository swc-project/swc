use std::{iter, mem};

use serde::Deserialize;
use swc_common::{source_map::PURE_SP, util::take::Take, Mark, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{helper, helper_expr, perf::Check};
use swc_ecma_transforms_macros::fast_path;
use swc_ecma_utils::{
    contains_this_expr, find_pat_ids,
    function::{init_this, FnEnvHoister, FnWrapperResult, FunctionWrapper},
    prepend_stmt, private_ident, quote_ident, ExprFactory, Remapper, StmtLike,
};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, visit_mut_pass, Visit, VisitMut, VisitMutWith, VisitWith,
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
/// var _async_to_generator = function (fn) {
///   ...
/// };
/// var foo = _async_to_generator(function* () {
///   yield bar();
/// });
/// ```
pub fn async_to_generator(c: Config, unresolved_mark: Mark) -> impl Pass {
    visit_mut_pass(AsyncToGenerator {
        c,
        in_subclass: false,
        unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
    })
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

    in_subclass: bool,
    unresolved_ctxt: SyntaxContext,
}

struct Actual {
    c: Config,

    in_subclass: bool,
    hoister: FnEnvHoister,

    unresolved_ctxt: SyntaxContext,
    extra_stmts: Vec<Stmt>,
}

#[swc_trace]
#[fast_path(ShouldWork)]
impl VisitMut for AsyncToGenerator {
    noop_visit_mut_type!(fail);

    fn visit_mut_class(&mut self, c: &mut Class) {
        if c.super_class.is_some() {
            self.in_subclass = true;
        }
        c.visit_mut_children_with(self);
        self.in_subclass = false;
    }

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
            let hoister = FnEnvHoister::new(self.unresolved_ctxt);

            let mut actual = Actual {
                c: self.c,
                in_subclass: self.in_subclass,
                hoister,
                unresolved_ctxt: self.unresolved_ctxt,
                extra_stmts: Vec::new(),
            };

            stmt.visit_mut_with(&mut actual);
            stmts_updated.extend(actual.hoister.to_stmt().into_iter().map(T::from));
            stmts_updated.push(stmt);
            stmts_updated.extend(actual.extra_stmts.into_iter().map(T::from));
        }

        *stmts = stmts_updated;
        stmts.visit_mut_children_with(self);
    }
}

#[swc_trace]
#[fast_path(ShouldWork)]
impl VisitMut for Actual {
    noop_visit_mut_type!(fail);

    fn visit_mut_class(&mut self, c: &mut Class) {
        let old = self.in_subclass;

        if c.super_class.is_some() {
            self.in_subclass = true;
        }
        c.visit_mut_children_with(self);
        self.in_subclass = old;
    }

    fn visit_mut_constructor(&mut self, c: &mut Constructor) {
        c.params.visit_mut_children_with(self);

        if let Some(BlockStmt { span: _, stmts, .. }) = &mut c.body {
            let old_rep = self.hoister.take();

            stmts.visit_mut_children_with(self);

            if self.in_subclass {
                let (decl, this_id) =
                    mem::replace(&mut self.hoister, old_rep).to_stmt_in_subclass();

                if let Some(this_id) = this_id {
                    init_this(stmts, &this_id)
                }

                if let Some(decl) = decl {
                    prepend_stmt(stmts, decl)
                }
            } else {
                let decl = mem::replace(&mut self.hoister, old_rep).to_stmt();

                if let Some(decl) = decl {
                    prepend_stmt(stmts, decl)
                }
            }
        }
    }

    fn visit_mut_class_method(&mut self, m: &mut ClassMethod) {
        if m.function.body.is_none() {
            return;
        }

        m.visit_mut_children_with(self);

        if m.kind != MethodKind::Method || !m.function.is_async {
            return;
        }
        let params = m.function.params.clone();

        let mut visitor = FnEnvHoister::new(self.unresolved_ctxt);
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
                stmts: visitor
                    .to_stmt()
                    .into_iter()
                    .chain(iter::once(
                        ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(
                                CallExpr {
                                    span: DUMMY_SP,
                                    callee: expr.as_callee(),
                                    args: Vec::new(),
                                    ..Default::default()
                                }
                                .into(),
                            ),
                        }
                        .into(),
                    ))
                    .collect(),
                ..Default::default()
            }),
            ..Default::default()
        }
        .into();
    }

    fn visit_mut_call_expr(&mut self, expr: &mut CallExpr) {
        if let Callee::Expr(e) = &mut expr.callee {
            let mut e = &mut **e;
            while let Expr::Paren(ParenExpr { expr, .. }) = e {
                e = &mut **expr;
            }
            self.visit_mut_expr_with_binding(e, None, true);
        }

        expr.args.visit_mut_with(self)
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        self.visit_mut_expr_with_binding(expr, None, false);
    }

    fn visit_mut_function(&mut self, f: &mut Function) {
        let old_rep = self.hoister.take();

        f.visit_mut_children_with(self);

        let decl = mem::replace(&mut self.hoister, old_rep).to_stmt();

        if let (Some(body), Some(decl)) = (&mut f.body, decl) {
            prepend_stmt(&mut body.stmts, decl);
        }
    }

    fn visit_mut_getter_prop(&mut self, f: &mut GetterProp) {
        f.key.visit_mut_with(self);

        if let Some(body) = &mut f.body {
            let old_rep = self.hoister.take();

            body.visit_mut_with(self);

            let decl = mem::replace(&mut self.hoister, old_rep).to_stmt();

            if let Some(stmt) = decl {
                prepend_stmt(&mut body.stmts, stmt);
            }
        }
    }

    fn visit_mut_setter_prop(&mut self, f: &mut SetterProp) {
        f.key.visit_mut_with(self);
        f.param.visit_mut_with(self);

        if let Some(body) = &mut f.body {
            let old_rep = self.hoister.take();

            body.visit_mut_with(self);

            let decl = mem::replace(&mut self.hoister, old_rep).to_stmt();

            if let Some(stmt) = decl {
                prepend_stmt(&mut body.stmts, stmt);
            }
        }
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
        self.extra_stmts.push(ref_fn.into());
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

                        *item = ExportDefaultDecl {
                            span: export_default.span,
                            decl: name_fn.into(),
                        }
                        .into();
                        self.extra_stmts.push(ref_fn.into());
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
            Function {
                params: Vec::new(),
                ..*prop.function.take()
            }
            .into(),
        );

        let fn_ref = if is_this_used {
            fn_ref.apply(DUMMY_SP, ThisExpr { span: DUMMY_SP }.into(), Vec::new())
        } else {
            CallExpr {
                span: DUMMY_SP,
                callee: fn_ref.as_callee(),
                args: Vec::new(),
                ..Default::default()
            }
            .into()
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
                ..Default::default()
            }),
            ..Default::default()
        }
        .into()
    }

    fn visit_mut_stmts(&mut self, _n: &mut Vec<Stmt>) {}

    fn visit_mut_var_declarator(&mut self, var: &mut VarDeclarator) {
        if let VarDeclarator {
            name: Pat::Ident(id),
            init: Some(init),
            ..
        } = var
        {
            match init.as_ref() {
                Expr::Fn(FnExpr {
                    ident: None,
                    ref function,
                }) if function.is_async || function.is_generator => {
                    self.visit_mut_expr_with_binding(init, Some(Ident::from(&*id)), false);
                    return;
                }

                Expr::Arrow(arrow_expr) if arrow_expr.is_async || arrow_expr.is_generator => {
                    self.visit_mut_expr_with_binding(init, Some(Ident::from(&*id)), false);
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
    fn visit_mut_expr_with_binding(
        &mut self,
        expr: &mut Expr,
        binding_ident: Option<Ident>,
        in_iife: bool,
    ) {
        expr.visit_mut_children_with(self);

        match expr {
            Expr::Arrow(arrow_expr @ ArrowExpr { is_async: true, .. }) => {
                arrow_expr.visit_mut_with(&mut self.hoister);

                let mut wrapper = FunctionWrapper::from(arrow_expr.take());
                wrapper.ignore_function_name = self.c.ignore_function_name;
                wrapper.ignore_function_length = self.c.ignore_function_length;
                wrapper.binding_ident = binding_ident;

                let fn_expr = wrapper.function.expect_fn_expr();

                wrapper.function = make_fn_ref(fn_expr);
                *expr = wrapper.into();
                if !in_iife {
                    expr.set_span(PURE_SP);
                }
            }

            Expr::Fn(fn_expr) if fn_expr.function.is_async => {
                let mut wrapper = FunctionWrapper::from(fn_expr.take());
                wrapper.ignore_function_name = self.c.ignore_function_name;
                wrapper.ignore_function_length = self.c.ignore_function_length;
                wrapper.binding_ident = binding_ident;

                let fn_expr = wrapper.function.expect_fn_expr();

                wrapper.function = make_fn_ref(fn_expr);

                *expr = wrapper.into();
                if !in_iife {
                    expr.set_span(PURE_SP);
                }
            }

            _ => {}
        }
    }
}

/// Creates
///
/// `_async_to_generator(function*() {})` from `async function() {}`;
#[tracing::instrument(level = "info", skip_all)]
fn make_fn_ref(mut expr: FnExpr) -> Expr {
    {
        let param_ids: Vec<Id> = find_pat_ids(&expr.function.params);
        let mapping = param_ids
            .into_iter()
            .map(|id| (id, SyntaxContext::empty().apply_mark(Mark::new())))
            .collect();

        expr.function.visit_mut_with(&mut Remapper::new(&mapping));
    }

    expr.function.body.visit_mut_with(&mut AsyncFnBodyHandler {
        is_async_generator: expr.function.is_generator,
    });

    assert!(expr.function.is_async);
    expr.function.is_async = false;

    let helper = if expr.function.is_generator {
        helper!(wrap_async_generator)
    } else {
        helper!(async_to_generator)
    };

    expr.function.is_generator = true;

    let span = expr.span();

    CallExpr {
        span,
        callee: helper,
        args: vec![expr.as_arg()],
        ..Default::default()
    }
    .into()
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
    noop_visit_mut_type!(fail);

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
                let callee = helper!(async_generator_delegate);
                let arg = CallExpr {
                    span: *span,
                    callee,
                    args: vec![
                        CallExpr {
                            span: DUMMY_SP,
                            callee: helper!(async_iterator),
                            args: vec![arg.take().as_arg()],
                            ..Default::default()
                        }
                        .as_arg(),
                        helper_expr!(await_async_generator).as_arg(),
                    ],
                    ..Default::default()
                }
                .into();
                *expr = YieldExpr {
                    span: *span,
                    delegate: true,
                    arg: Some(arg),
                }
                .into()
            }

            Expr::Await(AwaitExpr { span, arg }) => {
                if self.is_async_generator {
                    let callee = helper!(await_async_generator);
                    let arg = CallExpr {
                        span: *span,
                        callee,
                        args: vec![arg.take().as_arg()],
                        ..Default::default()
                    }
                    .into();
                    *expr = YieldExpr {
                        span: *span,
                        delegate: false,
                        arg: Some(arg),
                    }
                    .into()
                } else {
                    *expr = YieldExpr {
                        span: *span,
                        delegate: false,
                        arg: Some(arg.take()),
                    }
                    .into()
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
    noop_visit_type!(fail);

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
        Stmt::ForOf(s @ ForOfStmt { is_await: true, .. }) => s.take(),
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

        let mut for_loop_body = Vec::new();
        {
            // let value = _step.value;
            let value_var = VarDeclarator {
                span: DUMMY_SP,
                name: value.clone().into(),
                init: Some(step.clone().make_member(quote_ident!("value")).into()),
                definite: false,
            };
            for_loop_body.push(
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Let,
                    declare: false,
                    decls: vec![value_var],
                    ..Default::default()
                }
                .into(),
            );
        }

        match s.left {
            ForHead::VarDecl(v) => {
                let var = v.decls.into_iter().next().unwrap();
                let var_decl = VarDeclarator {
                    span: DUMMY_SP,
                    name: var.name,
                    init: Some(value.into()),
                    definite: false,
                };
                for_loop_body.push(
                    VarDecl {
                        span: DUMMY_SP,
                        kind: VarDeclKind::Const,
                        declare: false,
                        decls: vec![var_decl],
                        ..Default::default()
                    }
                    .into(),
                );
            }
            ForHead::Pat(p) => {
                for_loop_body.push(
                    ExprStmt {
                        span: DUMMY_SP,
                        expr: AssignExpr {
                            span: DUMMY_SP,
                            op: op!("="),
                            left: p.try_into().unwrap(),
                            right: Box::new(value.into()),
                        }
                        .into(),
                    }
                    .into(),
                );
            }

            ForHead::UsingDecl(..) => {
                unreachable!("using declaration must be removed by previous pass")
            }
        }

        for_loop_body.extend(orig_body);

        let for_loop_body = BlockStmt {
            span: body_span,
            stmts: for_loop_body,
            ..Default::default()
        };

        let mut init_var_decls = Vec::new();
        // _iterator = _async_iterator(lol())
        init_var_decls.push(VarDeclarator {
            span: DUMMY_SP,
            name: iterator.clone().into(),
            init: {
                let callee = helper!(async_iterator);

                Some(
                    CallExpr {
                        span: DUMMY_SP,
                        callee,
                        args: vec![s.right.as_arg()],
                        ..Default::default()
                    }
                    .into(),
                )
            },
            definite: false,
        });
        init_var_decls.push(VarDeclarator {
            span: DUMMY_SP,
            name: step.clone().into(),
            init: None,
            definite: false,
        });

        let for_stmt = ForStmt {
            span: s.span,
            // var _iterator = _async_iterator(lol()), _step;
            init: Some(
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: init_var_decls,
                    ..Default::default()
                }
                .into(),
            ),
            // _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done
            test: {
                let iter_next = iterator.clone().make_member(quote_ident!("next"));
                let iter_next = CallExpr {
                    span: DUMMY_SP,
                    callee: iter_next.as_callee(),
                    args: Default::default(),
                    ..Default::default()
                };

                let yield_arg = if is_async_generator {
                    CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(await_async_generator),
                        args: vec![iter_next.as_arg()],
                        ..Default::default()
                    }
                    .into()
                } else {
                    iter_next.into()
                };

                let assign_to_step: Expr = AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: step.into(),
                    right: YieldExpr {
                        span: DUMMY_SP,
                        arg: Some(yield_arg),
                        delegate: false,
                    }
                    .into(),
                }
                .into();

                let right = UnaryExpr {
                    span: DUMMY_SP,
                    op: op!("!"),
                    arg: assign_to_step.make_member(quote_ident!("done")).into(),
                }
                .into();

                let left = iterator_abrupt_completion.clone().into();

                Some(
                    AssignExpr {
                        span: DUMMY_SP,
                        op: op!("="),
                        left,
                        right,
                    }
                    .into(),
                )
            },
            // _iteratorNormalCompletion = true
            update: Some(
                AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: iterator_abrupt_completion.clone().into(),
                    right: false.into(),
                }
                .into(),
            ),
            body: Box::new(Stmt::Block(for_loop_body)),
        }
        .into();

        BlockStmt {
            span: body_span,
            stmts: vec![for_stmt],
            ..Default::default()
        }
    };

    let catch_clause = {
        // _didIteratorError = true;
        let mark_as_errorred = ExprStmt {
            span: DUMMY_SP,
            expr: AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: did_iteration_error.clone().into(),
                right: true.into(),
            }
            .into(),
        }
        .into();
        // _iteratorError = err;
        let store_error = ExprStmt {
            span: DUMMY_SP,
            expr: AssignExpr {
                span: DUMMY_SP,
                op: op!("="),
                left: iterator_error.clone().into(),
                right: Box::new(err_param.clone().into()),
            }
            .into(),
        }
        .into();

        CatchClause {
            span: DUMMY_SP,
            param: Some(err_param.into()),
            body: BlockStmt {
                stmts: vec![mark_as_errorred, store_error],
                ..Default::default()
            },
        }
    };

    let finally_block = {
        let throw_iterator_error = ThrowStmt {
            span: DUMMY_SP,
            arg: iterator_error.clone().into(),
        }
        .into();
        let throw_iterator_error = IfStmt {
            span: DUMMY_SP,
            test: did_iteration_error.clone().into(),
            cons: Box::new(Stmt::Block(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![throw_iterator_error],
                ..Default::default()
            })),
            alt: None,
        }
        .into();

        let iterator_return: Expr = CallExpr {
            span: DUMMY_SP,
            callee: iterator
                .clone()
                .make_member(quote_ident!("return"))
                .as_callee(),
            args: Vec::new(),
            ..Default::default()
        }
        .into();

        // yield _iterator.return();
        // or
        // yield _awaitAsyncGenerator(_iterator.return());
        let yield_stmt = ExprStmt {
            span: DUMMY_SP,
            expr: YieldExpr {
                span: DUMMY_SP,
                delegate: false,
                arg: Some(if is_async_generator {
                    CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(await_async_generator),
                        args: vec![iterator_return.as_arg()],
                        ..Default::default()
                    }
                    .into()
                } else {
                    iterator_return.into()
                }),
            }
            .into(),
        }
        .into();

        let conditional_yield = IfStmt {
            span: DUMMY_SP,
            // _iteratorAbruptCompletion && _iterator.return != null
            test: BinExpr {
                span: DUMMY_SP,
                op: op!("&&"),
                // _iteratorAbruptCompletion
                left: Box::new(iterator_abrupt_completion.clone().into()),
                // _iterator.return != null
                right: Box::new(
                    BinExpr {
                        span: DUMMY_SP,
                        op: op!("!="),
                        left: iterator.make_member(quote_ident!("return")).into(),
                        right: Null { span: DUMMY_SP }.into(),
                    }
                    .into(),
                ),
            }
            .into(),
            cons: Box::new(Stmt::Block(BlockStmt {
                stmts: vec![yield_stmt],
                ..Default::default()
            })),
            alt: None,
        }
        .into();
        let body = BlockStmt {
            stmts: vec![conditional_yield],
            ..Default::default()
        };

        let inner_try = TryStmt {
            span: DUMMY_SP,
            block: body,
            handler: None,
            finalizer: Some(BlockStmt {
                stmts: vec![throw_iterator_error],
                ..Default::default()
            }),
        }
        .into();
        BlockStmt {
            stmts: vec![inner_try],
            ..Default::default()
        }
    };

    let try_stmt = TryStmt {
        span: s.span,
        block: try_body,
        handler: Some(catch_clause),
        finalizer: Some(finally_block),
    };

    let stmts = vec![
        VarDecl {
            kind: VarDeclKind::Var,
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
            ..Default::default()
        }
        .into(),
        try_stmt.into(),
    ];

    *stmt = BlockStmt {
        span: s.span,
        stmts,
        ..Default::default()
    }
    .into()
}
