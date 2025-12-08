//! ES2017: Async / Await
//!
//! This plugin transforms async functions to generator functions
//! and wraps them with `asyncToGenerator` helper function.
//!
//! ## Example
//!
//! Input:
//! ```js
//! async function foo() {
//!   await bar();
//! }
//! const foo2 = async () => {
//!   await bar();
//! };
//! async () => {
//!   await bar();
//! }
//! ```
//!
//! Output:
//! ```js
//! function foo() {
//!   return _async_to_generator(function*() {
//!     yield bar();
//!   })();
//! }
//! const foo2 = () => {
//!   return _async_to_generator(function*() {
//!     yield bar();
//!   })();
//! };
//! () => {
//!   return _async_to_generator(function*() {
//!     yield bar();
//!   })();
//! }
//! ```

use std::mem;

use swc_common::{util::take::Take, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_transforms_base::{
    assumptions::Assumptions,
    helper, helper_expr,
    perf::{should_work, Check},
};
use swc_ecma_utils::{
    function::{init_this, FnEnvHoister},
    prepend_stmt, private_ident, quote_ident, ExprFactory,
};
use swc_ecma_visit::{noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith};

use crate::TraverseCtx;

pub fn hook(
    unresolved_ctxt: SyntaxContext,
    assumptions: Assumptions,
) -> impl VisitMutHook<TraverseCtx> {
    AsyncToGeneratorHook {
        inner: AsyncToGenerator {
            c: Config {
                ignore_function_length: assumptions.ignore_function_length,
            },
            fn_state: None,
            in_subclass: false,
            unresolved_ctxt,
        },
    }
}

#[derive(Clone, Debug)]
struct Config {
    ignore_function_length: bool,
}

#[derive(Default, Clone, Debug)]
struct FnState {
    is_async: bool,
    is_generator: bool,
    use_this: bool,
    use_arguments: bool,
    use_super: bool,
}

#[derive(Clone)]
struct AsyncToGenerator {
    c: Config,
    fn_state: Option<FnState>,
    in_subclass: bool,
    unresolved_ctxt: SyntaxContext,
}

struct AsyncToGeneratorHook {
    inner: AsyncToGenerator,
}

impl VisitMutHook<TraverseCtx> for AsyncToGeneratorHook {
    fn enter_program(&mut self, node: &mut Program, _ctx: &mut TraverseCtx) {
        node.visit_mut_with(&mut self.inner);
    }
}

impl VisitMut for AsyncToGenerator {
    fn visit_mut_function(&mut self, function: &mut Function) {
        let Some(body) = &mut function.body else {
            return;
        };

        function.params.visit_mut_with(self);

        let fn_state = self.fn_state.replace(FnState {
            is_async: function.is_async,
            is_generator: function.is_generator,
            ..Default::default()
        });
        body.visit_mut_with(self);

        let mut fn_state = mem::replace(&mut self.fn_state, fn_state).unwrap();
        if !fn_state.is_async {
            return;
        }

        let mut stmts = vec![];
        if fn_state.use_super {
            // slow path
            let mut fn_env_hoister = FnEnvHoister::new(self.unresolved_ctxt);
            fn_env_hoister.disable_this();
            fn_env_hoister.disable_arguments();

            body.visit_mut_with(&mut fn_env_hoister);

            stmts.extend(fn_env_hoister.to_stmt());
        }

        function.is_async = false;
        function.is_generator = false;
        if !fn_state.use_arguments {
            // Errors thrown during argument evaluation must reject the resulting promise,
            // which needs more complex code to handle
            // https://github.com/evanw/esbuild/blob/75286c1b4fabcf93140b97c3c0488f0253158b47/internal/js_parser/js_parser_lower.go#L364
            fn_state.use_arguments =
                could_potentially_throw(&function.params, self.unresolved_ctxt);
        }

        let params = if fn_state.use_arguments {
            let mut params = vec![];

            if !self.c.ignore_function_length {
                let fn_len = function
                    .params
                    .iter()
                    .filter(|p| !matches!(p.pat, Pat::Assign(..) | Pat::Rest(..)))
                    .count();
                for i in 0..fn_len {
                    params.push(Param {
                        pat: private_ident!(format!("_{}", i)).into(),
                        span: DUMMY_SP,
                        decorators: vec![],
                    });
                }
            }

            mem::replace(&mut function.params, params)
        } else {
            vec![]
        };

        let expr = make_fn_ref(&fn_state, params, body.take());

        stmts.push(
            ReturnStmt {
                arg: Some(expr.into()),
                ..Default::default()
            }
            .into(),
        );

        function.body = Some(BlockStmt {
            stmts,
            ..Default::default()
        });
    }

    fn visit_mut_arrow_expr(&mut self, arrow_expr: &mut ArrowExpr) {
        if !arrow_expr.is_async {
            arrow_expr.visit_mut_children_with(self);
            return;
        }

        // arrow expressions cannot be generator
        debug_assert!(!arrow_expr.is_generator);

        arrow_expr.params.visit_mut_with(self);

        let fn_state = self.fn_state.replace(FnState {
            is_async: true,
            is_generator: false,
            ..Default::default()
        });

        arrow_expr.body.visit_mut_with(self);
        let fn_state = mem::replace(&mut self.fn_state, fn_state).unwrap();

        // `this`/`arguments`/`super` are inherited from the parent function
        if let Some(out_fn_state) = &mut self.fn_state {
            out_fn_state.use_this |= fn_state.use_this;
            out_fn_state.use_arguments |= fn_state.use_arguments;
            out_fn_state.use_super |= fn_state.use_super;
        }

        let mut stmts = vec![];
        if fn_state.use_super {
            // slow path
            let mut fn_env_hoister = FnEnvHoister::new(self.unresolved_ctxt);
            fn_env_hoister.disable_this();
            fn_env_hoister.disable_arguments();

            arrow_expr.body.visit_mut_with(&mut fn_env_hoister);

            stmts.extend(fn_env_hoister.to_stmt());
        }

        arrow_expr.is_async = false;

        let body = match *arrow_expr.body.take() {
            BlockStmtOrExpr::BlockStmt(block_stmt) => block_stmt,
            BlockStmtOrExpr::Expr(expr) => BlockStmt {
                stmts: vec![ReturnStmt {
                    arg: Some(expr),
                    ..Default::default()
                }
                .into()],
                ..Default::default()
            },
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        };

        let expr = make_fn_ref(&fn_state, vec![], body);

        arrow_expr.body = if fn_state.use_super {
            stmts.push(expr.into_stmt());
            BlockStmtOrExpr::BlockStmt(BlockStmt {
                stmts,
                ..Default::default()
            })
        } else {
            BlockStmtOrExpr::Expr(Box::new(expr))
        }
        .into()
    }

    fn visit_mut_class(&mut self, class: &mut Class) {
        class.super_class.visit_mut_with(self);
        let in_subclass = mem::replace(&mut self.in_subclass, class.super_class.is_some());
        class.body.visit_mut_with(self);
        self.in_subclass = in_subclass;
    }

    fn visit_mut_constructor(&mut self, constructor: &mut Constructor) {
        constructor.params.visit_mut_with(self);

        if let Some(BlockStmt { stmts, .. }) = &mut constructor.body {
            if !should_work::<ShouldWork, _>(&*stmts) {
                return;
            }

            let (decl, this_id) = if self.in_subclass {
                let mut fn_env_hoister = FnEnvHoister::new(self.unresolved_ctxt);
                stmts.visit_mut_with(&mut fn_env_hoister);
                fn_env_hoister.to_stmt_in_subclass()
            } else {
                (None, None)
            };

            stmts.visit_mut_children_with(self);

            if let Some(this_id) = this_id {
                init_this(stmts, &this_id)
            }

            if let Some(decl) = decl {
                prepend_stmt(stmts, decl)
            }
        }
    }

    fn visit_mut_getter_prop(&mut self, f: &mut GetterProp) {
        let fn_state = self.fn_state.take();
        f.visit_mut_children_with(self);
        self.fn_state = fn_state;
    }

    fn visit_mut_setter_prop(&mut self, f: &mut SetterProp) {
        f.param.visit_mut_with(self);
        let fn_state = self.fn_state.take();
        f.body.visit_mut_with(self);
        self.fn_state = fn_state;
    }

    fn visit_mut_exprs(&mut self, exprs: &mut Vec<Box<Expr>>) {
        if self.fn_state.as_ref().is_some_and(|f| !f.is_async)
            && !should_work::<ShouldWork, _>(&*exprs)
        {
            return;
        }

        exprs.visit_mut_children_with(self);
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        if self.fn_state.as_ref().is_some_and(|f| !f.is_async)
            && !should_work::<ShouldWork, _>(&*expr)
        {
            return;
        }

        expr.visit_mut_children_with(self);

        let Some(fn_state @ FnState { is_async: true, .. }) = &mut self.fn_state else {
            return;
        };

        match expr {
            Expr::This(..) => {
                fn_state.use_this = true;
            }
            Expr::Ident(Ident { sym, .. }) if sym == "arguments" => {
                fn_state.use_arguments = true;
            }
            Expr::Await(AwaitExpr { arg, span }) => {
                *expr = if fn_state.is_generator {
                    let callee = helper!(await_async_generator);
                    let arg = CallExpr {
                        span: *span,
                        callee,
                        args: vec![arg.take().as_arg()],
                        ..Default::default()
                    }
                    .into();
                    YieldExpr {
                        span: *span,
                        delegate: false,
                        arg: Some(arg),
                    }
                } else {
                    YieldExpr {
                        span: *span,
                        delegate: false,
                        arg: Some(arg.take()),
                    }
                }
                .into();
            }
            Expr::Yield(YieldExpr {
                span,
                arg: Some(arg),
                delegate: true,
            }) => {
                let async_iter =
                    helper_expr!(async_iterator).as_call(DUMMY_SP, vec![arg.take().as_arg()]);

                let arg = helper_expr!(async_generator_delegate)
                    .as_call(*span, vec![async_iter.as_arg()])
                    .into();

                *expr = YieldExpr {
                    span: *span,
                    delegate: true,
                    arg: Some(arg),
                }
                .into()
            }

            _ => {}
        }
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        if self.fn_state.as_ref().is_some_and(|f| !f.is_async)
            && !should_work::<ShouldWork, _>(&*stmts)
        {
            return;
        }

        stmts.visit_mut_children_with(self);
    }

    fn visit_mut_stmt(&mut self, stmt: &mut Stmt) {
        if self.fn_state.as_ref().is_some_and(|f| !f.is_async)
            && !should_work::<ShouldWork, _>(&*stmt)
        {
            return;
        }

        stmt.visit_mut_children_with(self);

        if let Some(FnState {
            is_async: true,
            is_generator,
            ..
        }) = self.fn_state
        {
            handle_await_for(stmt, is_generator);
        }
    }

    fn visit_mut_super(&mut self, _: &mut Super) {
        if let Some(FnState { use_super, .. }) = &mut self.fn_state {
            *use_super = true;
        }
    }
}

/// Creates
///
/// `_async_to_generator(function*() {})()` from `async function() {}`;
#[tracing::instrument(level = "debug", skip_all)]
fn make_fn_ref(fn_state: &FnState, params: Vec<Param>, body: BlockStmt) -> Expr {
    let helper = if fn_state.is_generator {
        helper_expr!(DUMMY_SP, wrap_async_generator)
    } else {
        helper_expr!(DUMMY_SP, async_to_generator)
    }
    .as_callee();
    let this = ThisExpr { span: DUMMY_SP };
    let arguments = quote_ident!("arguments");

    let inner_fn = Function {
        is_generator: true,
        params,
        body: Some(body),
        ..Default::default()
    };

    let call_async = CallExpr {
        callee: helper,
        args: vec![inner_fn.as_arg()],
        ..Default::default()
    };

    if fn_state.use_arguments {
        // fn.apply(this, arguments)
        call_async
            .make_member(quote_ident!("apply"))
            .as_call(DUMMY_SP, vec![this.as_arg(), arguments.as_arg()])
    } else if fn_state.use_this {
        // fn.call(this)
        call_async
            .make_member(quote_ident!("call"))
            .as_call(DUMMY_SP, vec![this.as_arg()])
    } else {
        // fn()
        call_async.as_call(DUMMY_SP, vec![])
    }
}

#[tracing::instrument(level = "debug", skip_all)]
fn could_potentially_throw(param: &[Param], unresolved_ctxt: SyntaxContext) -> bool {
    for param in param {
        debug_assert!(param.decorators.is_empty());

        match &param.pat {
            Pat::Ident(..) => continue,
            Pat::Rest(RestPat { arg, .. }) if arg.is_ident() => continue,
            Pat::Assign(assign_pat) => match &*assign_pat.right {
                Expr::Ident(Ident { ctxt, sym, .. })
                    if sym == "undefined" && *ctxt == unresolved_ctxt =>
                {
                    continue
                }
                Expr::Lit(
                    Lit::Null(..) | Lit::Bool(..) | Lit::Num(..) | Lit::BigInt(..) | Lit::Str(..),
                )
                | Expr::Fn(..)
                | Expr::Arrow(..) => continue,

                _ => return true,
            },
            _ => return true,
        }
    }

    false
}

#[derive(Default)]
struct ShouldWork {
    found: bool,
}

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

#[tracing::instrument(level = "debug", skip_all)]
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

            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
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
