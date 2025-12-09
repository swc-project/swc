use std::mem;

use swc_common::{util::take::Take, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_transforms_base::{helper, helper_expr};
use swc_ecma_utils::{
    function::{init_this, FnEnvHoister},
    prepend_stmt, private_ident, quote_ident, ExprFactory,
};
use swc_ecma_visit::VisitMutWith;

use crate::TraverseCtx;

pub fn hook(
    unresolved_ctxt: SyntaxContext,
    ignore_function_length: bool,
) -> impl VisitMutHook<TraverseCtx> {
    AsyncToGeneratorPass {
        fn_state: None,
        fn_state_stack: vec![],
        in_subclass: false,
        in_subclass_stack: vec![],
        ignore_function_length,
        unresolved_ctxt,
        this_var: None,
    }
}

#[derive(Default, Clone, Debug)]
struct FnState {
    is_async: bool,
    is_generator: bool,
    use_this: bool,
    use_arguments: bool,
    use_super: bool,
    /// True if this function is in a constructor body (not nested in another
    /// function)
    in_constructor: bool,
}

struct AsyncToGeneratorPass {
    fn_state: Option<FnState>,
    fn_state_stack: Vec<FnState>,
    in_subclass: bool,
    in_subclass_stack: Vec<bool>,
    ignore_function_length: bool,
    unresolved_ctxt: SyntaxContext,
    /// The `_this` identifier to use in constructor context
    this_var: Option<Ident>,
}

impl VisitMutHook<TraverseCtx> for AsyncToGeneratorPass {
    fn exit_function(&mut self, function: &mut Function, _ctx: &mut TraverseCtx) {
        let Some(body) = &mut function.body else {
            return;
        };

        let fn_state = self.fn_state.take();
        let Some(mut fn_state) = fn_state else {
            // Function with no body
            return;
        };

        if !fn_state.is_async {
            // Restore the previous fn_state from stack
            self.fn_state = self.fn_state_stack.pop();
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
            fn_state.use_arguments =
                could_potentially_throw(&function.params, self.unresolved_ctxt);
        }

        let params = if fn_state.use_arguments {
            let mut params = vec![];

            if !self.ignore_function_length {
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

        // Restore the previous fn_state from stack after processing async function
        self.fn_state = self.fn_state_stack.pop();
    }

    fn enter_function(&mut self, function: &mut Function, _ctx: &mut TraverseCtx) {
        let Some(_body) = &mut function.body else {
            return;
        };

        // Save the current fn_state to stack before entering nested function
        if let Some(prev) = self.fn_state.take() {
            self.fn_state_stack.push(prev);
        }

        self.fn_state = Some(FnState {
            is_async: function.is_async,
            is_generator: function.is_generator,
            ..Default::default()
        });
    }

    fn exit_arrow_expr(&mut self, arrow_expr: &mut ArrowExpr, _ctx: &mut TraverseCtx) {
        if !arrow_expr.is_async {
            return;
        }

        // arrow expressions cannot be generator
        debug_assert!(!arrow_expr.is_generator);

        let fn_state = self.fn_state.take().unwrap();

        // Restore the previous fn_state from stack
        let parent_fn_state = self.fn_state_stack.pop();

        // `this`/`arguments`/`super` are inherited from the parent function
        // If arrow is in a constructor and uses `this`, we need to propagate it
        // to use the _this variable pattern at the constructor level
        if let Some(out_fn_state) = &parent_fn_state {
            let mut updated = out_fn_state.clone();
            updated.use_this |= fn_state.use_this;
            updated.use_arguments |= fn_state.use_arguments;
            updated.use_super |= fn_state.use_super;
            self.fn_state = Some(updated);
        }

        let mut stmts = vec![];
        // When using `super`, we need to hoist
        if fn_state.use_super {
            // slow path - hoist super references
            let mut fn_env_hoister = FnEnvHoister::new(self.unresolved_ctxt);
            fn_env_hoister.disable_this();
            fn_env_hoister.disable_arguments();

            arrow_expr.body.visit_mut_with(&mut fn_env_hoister);

            stmts.extend(fn_env_hoister.to_stmt());
        }

        // In constructor context with `this`, replace `this` with `_this`
        if fn_state.in_constructor && fn_state.use_this {
            if self.this_var.is_none() {
                self.this_var = Some(private_ident!("_this"));
            }
            let this_var = self.this_var.clone().unwrap();
            replace_this_in_block_stmt_or_expr(&mut arrow_expr.body, &this_var);
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

    fn enter_arrow_expr(&mut self, arrow_expr: &mut ArrowExpr, _ctx: &mut TraverseCtx) {
        if !arrow_expr.is_async {
            return;
        }

        // Save the current fn_state to stack before entering nested arrow function
        let in_constructor = self
            .fn_state
            .as_ref()
            .map(|s| s.in_constructor)
            .unwrap_or(false);

        if let Some(prev) = self.fn_state.take() {
            self.fn_state_stack.push(prev);
        }

        self.fn_state = Some(FnState {
            is_async: true,
            is_generator: false,
            in_constructor,
            ..Default::default()
        });
    }

    fn enter_class(&mut self, class: &mut Class, _ctx: &mut TraverseCtx) {
        self.in_subclass_stack.push(self.in_subclass);
        self.in_subclass = class.super_class.is_some();
    }

    fn exit_class(&mut self, _class: &mut Class, _ctx: &mut TraverseCtx) {
        self.in_subclass = self.in_subclass_stack.pop().unwrap_or(false);
    }

    fn enter_constructor(&mut self, _constructor: &mut Constructor, _ctx: &mut TraverseCtx) {
        // Mark that we're in a constructor for nested async arrows
        if self.in_subclass {
            // Save the current fn_state to stack
            if let Some(prev) = self.fn_state.take() {
                self.fn_state_stack.push(prev);
            }

            self.fn_state = Some(FnState {
                in_constructor: true,
                ..Default::default()
            });
        }
    }

    fn exit_constructor(&mut self, constructor: &mut Constructor, _ctx: &mut TraverseCtx) {
        if self.in_subclass {
            let fn_state = self.fn_state.take();

            // If any async arrows used `this`, we need to add var _this and _this = this
            if let Some(BlockStmt { stmts, .. }) = &mut constructor.body {
                if let Some(fn_state) = &fn_state {
                    if fn_state.use_this {
                        let this_var = self.this_var.take().unwrap();

                        // Add `_this = this` after super() call
                        init_this(stmts, &this_var);

                        // Add `var _this;` at the beginning
                        let decl = VarDecl {
                            span: DUMMY_SP,
                            kind: VarDeclKind::Var,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: this_var.into(),
                                init: None,
                                definite: false,
                            }],
                            ctxt: Default::default(),
                            declare: false,
                        };
                        prepend_stmt(stmts, decl.into());
                    }
                }
            }

            // Restore the previous fn_state from stack
            self.fn_state = self.fn_state_stack.pop();
        }
    }

    fn enter_getter_prop(&mut self, _f: &mut GetterProp, _ctx: &mut TraverseCtx) {
        if let Some(prev) = self.fn_state.take() {
            self.fn_state_stack.push(prev);
        }
    }

    fn exit_getter_prop(&mut self, _f: &mut GetterProp, _ctx: &mut TraverseCtx) {
        self.fn_state = self.fn_state_stack.pop();
    }

    fn enter_setter_prop(&mut self, _f: &mut SetterProp, _ctx: &mut TraverseCtx) {
        if let Some(prev) = self.fn_state.take() {
            self.fn_state_stack.push(prev);
        }
    }

    fn exit_setter_prop(&mut self, _f: &mut SetterProp, _ctx: &mut TraverseCtx) {
        self.fn_state = self.fn_state_stack.pop();
    }

    fn exit_expr(&mut self, expr: &mut Expr, _ctx: &mut TraverseCtx) {
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

    fn exit_stmt(&mut self, stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
        if let Some(FnState {
            is_async: true,
            is_generator,
            ..
        }) = self.fn_state
        {
            handle_await_for(stmt, is_generator);
        }
    }

    fn enter_super(&mut self, _: &mut Super, _ctx: &mut TraverseCtx) {
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
    } else if fn_state.use_this && !fn_state.in_constructor {
        // fn.call(this)
        // Note: in constructor context, we don't use .call(this) because
        // FnEnvHoister has already replaced `this` with `_this`
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

/// Replace all `this` expressions with the given identifier in a
/// BlockStmtOrExpr
fn replace_this_in_block_stmt_or_expr(body: &mut BlockStmtOrExpr, this_var: &Ident) {
    match body {
        BlockStmtOrExpr::BlockStmt(block) => {
            replace_this_in_stmts(&mut block.stmts, this_var);
        }
        BlockStmtOrExpr::Expr(expr) => {
            replace_this_in_expr(expr, this_var);
        }
    }
}

fn replace_this_in_stmts(stmts: &mut [Stmt], this_var: &Ident) {
    for stmt in stmts {
        replace_this_in_stmt(stmt, this_var);
    }
}

fn replace_this_in_stmt(stmt: &mut Stmt, this_var: &Ident) {
    match stmt {
        Stmt::Block(block) => {
            replace_this_in_stmts(&mut block.stmts, this_var);
        }
        Stmt::If(if_stmt) => {
            replace_this_in_expr(&mut if_stmt.test, this_var);
            replace_this_in_stmt(&mut if_stmt.cons, this_var);
            if let Some(alt) = &mut if_stmt.alt {
                replace_this_in_stmt(alt, this_var);
            }
        }
        Stmt::Return(ret) => {
            if let Some(arg) = &mut ret.arg {
                replace_this_in_expr(arg, this_var);
            }
        }
        Stmt::Expr(expr_stmt) => {
            replace_this_in_expr(&mut expr_stmt.expr, this_var);
        }
        Stmt::Decl(decl) => {
            if let Decl::Var(var_decl) = decl {
                for decl in &mut var_decl.decls {
                    if let Some(init) = &mut decl.init {
                        replace_this_in_expr(init, this_var);
                    }
                }
            }
        }
        _ => {}
    }
}

fn replace_this_in_expr(expr: &mut Expr, this_var: &Ident) {
    match expr {
        Expr::This(_) => {
            *expr = Expr::Ident(this_var.clone());
        }
        Expr::Member(member) => {
            replace_this_in_expr(&mut member.obj, this_var);
        }
        Expr::Call(call) => {
            match &mut call.callee {
                Callee::Expr(expr) => replace_this_in_expr(expr, this_var),
                _ => {}
            }
            for arg in &mut call.args {
                replace_this_in_expr(&mut arg.expr, this_var);
            }
        }
        Expr::Bin(bin) => {
            replace_this_in_expr(&mut bin.left, this_var);
            replace_this_in_expr(&mut bin.right, this_var);
        }
        Expr::Unary(unary) => {
            replace_this_in_expr(&mut unary.arg, this_var);
        }
        Expr::Await(await_expr) => {
            replace_this_in_expr(&mut await_expr.arg, this_var);
        }
        Expr::Yield(yield_expr) => {
            if let Some(arg) = &mut yield_expr.arg {
                replace_this_in_expr(arg, this_var);
            }
        }
        Expr::Assign(assign) => {
            if let AssignTarget::Simple(SimpleAssignTarget::Member(member)) = &mut assign.left {
                replace_this_in_member_expr(member, this_var);
            }
            replace_this_in_expr(&mut assign.right, this_var);
        }
        Expr::Paren(paren) => {
            replace_this_in_expr(&mut paren.expr, this_var);
        }
        Expr::Seq(seq) => {
            for expr in &mut seq.exprs {
                replace_this_in_expr(expr, this_var);
            }
        }
        _ => {}
    }
}

fn replace_this_in_member_expr(member: &mut MemberExpr, this_var: &Ident) {
    replace_this_in_expr(&mut member.obj, this_var);
}

fn replace_this_in_expr_or_spread(expr: &mut ExprOrSpread, this_var: &Ident) {
    replace_this_in_expr(&mut expr.expr, this_var);
}
