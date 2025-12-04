//! ES2017: Async to Generator Transform
//!
//! This plugin transforms async functions to generator functions wrapped in a
//! helper.
//!
//!
//! > This plugin is included in `preset-env`, in ES2017
//!
//! ## Example
//!
//! Input:
//! ```js
//! async function foo() {
//!   const result = await bar();
//!   return result;
//! }
//! ```
//!
//! Output:
//! ```js
//! function foo() {
//!   return _asyncToGenerator(function* () {
//!     const result = yield bar();
//!     return result;
//!   }).apply(this, arguments);
//! }
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-async-to-generator](https://babel.dev/docs/babel-plugin-transform-async-to-generator).
//!
//! ## References:
//!
//! * Babel plugin implementation: <https://github.com/babel/babel/blob/main/packages/babel-plugin-transform-async-to-generator>
//! * Async functions TC39 proposal: <https://github.com/tc39/ecmascript-asyncawait>
//! * Async functions specification: <https://tc39.es/ecma262/#sec-async-functions>

use std::mem;

use swc_common::{util::take::Take, Spanned, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::{
    function::{init_this, FnEnvHoister},
    prepend_stmt, private_ident, quote_ident, ExprFactory,
};
use swc_ecma_visit::VisitMut;

use crate::TraverseCtx;

#[derive(Debug, Clone, Copy)]
pub struct Config {
    pub ignore_function_length: bool,
    pub unresolved_ctxt: SyntaxContext,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            ignore_function_length: false,
            unresolved_ctxt: SyntaxContext::empty(),
        }
    }
}

pub fn hook(config: Config) -> impl VisitMutHook<TraverseCtx> {
    AsyncToGeneratorPass {
        config,
        fn_state: None,
        in_subclass: false,
    }
}

#[derive(Default, Clone, Debug)]
struct FnState {
    is_async: bool,
    is_generator: bool,
    use_this: bool,
    use_arguments: bool,
    use_super: bool,
}

struct AsyncToGeneratorPass {
    config: Config,
    fn_state: Option<FnState>,
    in_subclass: bool,
}

impl VisitMutHook<TraverseCtx> for AsyncToGeneratorPass {
    fn enter_function(&mut self, function: &mut Function, _ctx: &mut TraverseCtx) {
        if function.body.is_none() {
            return;
        }

        // Save current function state
        let _prev_fn_state = self.fn_state.replace(FnState {
            is_async: function.is_async,
            is_generator: function.is_generator,
            ..Default::default()
        });

        // We'll restore this in exit_function
        self.fn_state.as_mut().unwrap().is_async = function.is_async;
    }

    fn exit_function(&mut self, function: &mut Function, _ctx: &mut TraverseCtx) {
        let Some(body) = &mut function.body else {
            // Restore state for functions without bodies
            self.fn_state = None;
            return;
        };

        let Some(mut fn_state) = self.fn_state.take() else {
            return;
        };

        if !fn_state.is_async {
            return;
        }

        let unresolved_ctxt = self.config.unresolved_ctxt;

        let mut stmts = vec![];
        if fn_state.use_super {
            // Slow path: hoist function environment
            let mut fn_env_hoister = FnEnvHoister::new(unresolved_ctxt);
            fn_env_hoister.disable_this();
            fn_env_hoister.disable_arguments();

            // Visit body to hoist super references
            let mut body_clone = body.clone();
            fn_env_hoister.visit_mut_block_stmt(&mut body_clone);
            *body = body_clone;

            stmts.extend(fn_env_hoister.to_stmt());
        }

        function.is_async = false;
        function.is_generator = false;

        if !fn_state.use_arguments {
            // Errors thrown during argument evaluation must reject the resulting promise
            fn_state.use_arguments = could_potentially_throw(&function.params, unresolved_ctxt);
        }

        let params = if fn_state.use_arguments {
            let mut params = vec![];

            if !self.config.ignore_function_length {
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

        let expr = make_fn_ref(&fn_state, params, body.take(), unresolved_ctxt);

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

    fn enter_arrow_expr(&mut self, arrow_expr: &mut ArrowExpr, _ctx: &mut TraverseCtx) {
        if !arrow_expr.is_async {
            return;
        }

        // Arrow expressions cannot be generators
        debug_assert!(!arrow_expr.is_generator);

        // Save current function state
        self.fn_state = Some(FnState {
            is_async: true,
            is_generator: false,
            ..Default::default()
        });
    }

    fn exit_arrow_expr(&mut self, arrow_expr: &mut ArrowExpr, _ctx: &mut TraverseCtx) {
        if !arrow_expr.is_async {
            return;
        }

        let Some(fn_state) = self.fn_state.take() else {
            return;
        };

        // `this`/`arguments`/`super` are inherited from the parent function
        if let Some(out_fn_state) = &mut self.fn_state {
            out_fn_state.use_this |= fn_state.use_this;
            out_fn_state.use_arguments |= fn_state.use_arguments;
            out_fn_state.use_super |= fn_state.use_super;
        }

        let unresolved_ctxt = self.config.unresolved_ctxt;
        let mut stmts = vec![];

        if fn_state.use_super {
            // Slow path: hoist function environment
            let mut fn_env_hoister = FnEnvHoister::new(unresolved_ctxt);
            fn_env_hoister.disable_this();
            fn_env_hoister.disable_arguments();

            let mut body_clone = arrow_expr.body.clone();
            fn_env_hoister.visit_mut_block_stmt_or_expr(&mut body_clone);
            arrow_expr.body = body_clone;

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
        };

        let expr = make_fn_ref(&fn_state, vec![], body, unresolved_ctxt);

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

    fn enter_class(&mut self, class: &mut Class, _ctx: &mut TraverseCtx) {
        self.in_subclass = class.super_class.is_some();
    }

    fn exit_class(&mut self, _class: &mut Class, _ctx: &mut TraverseCtx) {
        self.in_subclass = false;
    }

    fn enter_constructor(&mut self, constructor: &mut Constructor, _ctx: &mut TraverseCtx) {
        if let Some(BlockStmt { stmts, .. }) = &mut constructor.body {
            let unresolved_ctxt = self.config.unresolved_ctxt;

            let (decl, this_id) = if self.in_subclass {
                let mut fn_env_hoister = FnEnvHoister::new(unresolved_ctxt);
                fn_env_hoister.visit_mut_stmts(stmts);
                fn_env_hoister.to_stmt_in_subclass()
            } else {
                (None, None)
            };

            if let Some(this_id) = this_id {
                init_this(stmts, &this_id)
            }

            if let Some(decl) = decl {
                prepend_stmt(stmts, decl)
            }
        }
    }

    fn enter_getter_prop(&mut self, _f: &mut GetterProp, _ctx: &mut TraverseCtx) {
        // Temporarily clear function state
        self.fn_state = None;
    }

    fn enter_setter_prop(&mut self, _f: &mut SetterProp, _ctx: &mut TraverseCtx) {
        // Temporarily clear function state
        self.fn_state = None;
    }

    fn enter_expr(&mut self, expr: &mut Expr, _ctx: &mut TraverseCtx) {
        let Some(fn_state @ FnState { is_async: true, .. }) = &mut self.fn_state else {
            return;
        };

        let unresolved_ctxt = self.config.unresolved_ctxt;

        match expr {
            Expr::This(..) => {
                fn_state.use_this = true;
            }
            Expr::Ident(Ident { sym, .. }) if sym == "arguments" => {
                fn_state.use_arguments = true;
            }
            Expr::Await(AwaitExpr { arg, span }) => {
                // Transform await to yield
                *expr = if fn_state.is_generator {
                    // For async generators, wrap in helper
                    let helper_call = create_helper_call(
                        "_awaitAsyncGenerator",
                        vec![*arg.take()],
                        unresolved_ctxt,
                    );
                    YieldExpr {
                        span: *span,
                        delegate: false,
                        arg: Some(Box::new(helper_call)),
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
            }) if fn_state.is_generator => {
                // Transform yield* in async generators
                let async_iter =
                    create_helper_call("_asyncIterator", vec![*arg.take()], unresolved_ctxt);
                let delegated = create_helper_call(
                    "_asyncGeneratorDelegate",
                    vec![async_iter],
                    unresolved_ctxt,
                );

                *expr = YieldExpr {
                    span: *span,
                    delegate: true,
                    arg: Some(Box::new(delegated)),
                }
                .into();
            }
            _ => {}
        }
    }

    fn enter_super(&mut self, _: &mut Super, _ctx: &mut TraverseCtx) {
        if let Some(FnState { use_super, .. }) = &mut self.fn_state {
            *use_super = true;
        }
    }

    fn enter_stmt(&mut self, stmt: &mut Stmt, _ctx: &mut TraverseCtx) {
        // Handle for-await-of loops
        if let Some(FnState {
            is_async: true,
            is_generator,
            ..
        }) = self.fn_state
        {
            handle_await_for(stmt, is_generator, self.config.unresolved_ctxt);
        }
    }
}

/// Creates `_asyncToGenerator(function*() {})()` from `async function() {}`;
fn make_fn_ref(
    fn_state: &FnState,
    params: Vec<Param>,
    body: BlockStmt,
    unresolved_ctxt: SyntaxContext,
) -> Expr {
    let helper_name = if fn_state.is_generator {
        "_wrapAsyncGenerator"
    } else {
        "_asyncToGenerator"
    };

    let this = ThisExpr { span: DUMMY_SP };
    let arguments = Ident {
        span: DUMMY_SP,
        ctxt: unresolved_ctxt,
        sym: "arguments".into(),
        optional: false,
    };

    let inner_fn = Function {
        is_generator: true,
        params,
        body: Some(body),
        ..Default::default()
    };

    let helper_ident = Ident {
        span: DUMMY_SP,
        ctxt: unresolved_ctxt,
        sym: helper_name.into(),
        optional: false,
    };

    let call_async = CallExpr {
        span: DUMMY_SP,
        ctxt: SyntaxContext::empty(),
        callee: Callee::Expr(Box::new(Expr::Ident(helper_ident))),
        args: vec![ExprOrSpread {
            spread: None,
            expr: Box::new(Expr::Fn(FnExpr {
                ident: None,
                function: Box::new(inner_fn),
            })),
        }],
        type_args: None,
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

/// Check if parameters could potentially throw during evaluation
fn could_potentially_throw(params: &[Param], unresolved_ctxt: SyntaxContext) -> bool {
    for param in params {
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

/// Handle for-await-of loops
fn handle_await_for(stmt: &mut Stmt, is_async_generator: bool, unresolved_ctxt: SyntaxContext) {
    let s = match stmt {
        Stmt::ForOf(s @ ForOfStmt { is_await: true, .. }) => s.take(),
        _ => return,
    };

    // Transform for await (x of y) to a complex for loop with try-catch
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
                            op: AssignOp::Assign,
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

        let init_var_decls = vec![
            VarDeclarator {
                span: DUMMY_SP,
                name: iterator.clone().into(),
                init: Some(
                    create_helper_call("_asyncIterator", vec![*s.right], unresolved_ctxt).into(),
                ),
                definite: false,
            },
            VarDeclarator {
                span: DUMMY_SP,
                name: step.clone().into(),
                init: None,
                definite: false,
            },
        ];

        let for_stmt = ForStmt {
            span: s.span,
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
            test: {
                let iter_next = iterator.clone().make_member(quote_ident!("next"));
                let iter_next = CallExpr {
                    span: DUMMY_SP,
                    ctxt: SyntaxContext::empty(),
                    callee: iter_next.as_callee(),
                    args: Default::default(),
                    type_args: None,
                };

                let yield_arg = if is_async_generator {
                    create_helper_call(
                        "_awaitAsyncGenerator",
                        vec![iter_next.into()],
                        unresolved_ctxt,
                    )
                } else {
                    iter_next.into()
                };

                let assign_to_step: Expr = AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: step.clone().into(),
                    right: YieldExpr {
                        span: DUMMY_SP,
                        arg: Some(Box::new(yield_arg)),
                        delegate: false,
                    }
                    .into(),
                }
                .into();

                let right = UnaryExpr {
                    span: DUMMY_SP,
                    op: UnaryOp::Bang,
                    arg: assign_to_step.make_member(quote_ident!("done")).into(),
                }
                .into();

                let left = iterator_abrupt_completion.clone().into();

                Some(
                    AssignExpr {
                        span: DUMMY_SP,
                        op: AssignOp::Assign,
                        left,
                        right,
                    }
                    .into(),
                )
            },
            update: Some(
                AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
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

    // catch (err) { didIteratorError = true; iteratorError = err; }
    let catch_clause = CatchClause {
        span: DUMMY_SP,
        param: Some(Pat::Ident(err_param.clone().into())),
        body: BlockStmt {
            span: DUMMY_SP,
            stmts: vec![
                AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: did_iteration_error.clone().into(),
                    right: true.into(),
                }
                .into_stmt(),
                AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: iterator_error.clone().into(),
                    right: err_param.into(),
                }
                .into_stmt(),
            ],
            ..Default::default()
        },
    };

    // Build the finally block
    let finally_block = build_finally_block(
        iterator.clone(),
        iterator_abrupt_completion.clone(),
        did_iteration_error.clone(),
        iterator_error.clone(),
        is_async_generator,
        unresolved_ctxt,
    );

    let try_stmt = TryStmt {
        span: s.span,
        block: try_body,
        handler: Some(catch_clause),
        finalizer: Some(finally_block),
    };

    // Wrap everything with variable declarations
    let var_decls = vec![
        VarDeclarator {
            span: DUMMY_SP,
            name: iterator_abrupt_completion.into(),
            init: Some(false.into()),
            definite: false,
        },
        VarDeclarator {
            span: DUMMY_SP,
            name: did_iteration_error.into(),
            init: Some(false.into()),
            definite: false,
        },
        VarDeclarator {
            span: DUMMY_SP,
            name: iterator_error.into(),
            init: None,
            definite: false,
        },
    ];

    *stmt = Stmt::Block(BlockStmt {
        span: s.span,
        stmts: vec![
            VarDecl {
                span: DUMMY_SP,
                kind: VarDeclKind::Var,
                declare: false,
                decls: var_decls,
                ..Default::default()
            }
            .into(),
            try_stmt.into(),
        ],
        ..Default::default()
    });
}

fn build_finally_block(
    iterator: Ident,
    iterator_abrupt_completion: Ident,
    did_iteration_error: Ident,
    iterator_error: Ident,
    is_async_generator: bool,
    unresolved_ctxt: SyntaxContext,
) -> BlockStmt {
    // Build: if (iteratorAbruptCompletion && iterator.return != null) { ... }
    let return_call = {
        let iter_return = iterator.clone().make_member(quote_ident!("return"));
        let call = CallExpr {
            span: DUMMY_SP,
            ctxt: SyntaxContext::empty(),
            callee: iter_return.as_callee(),
            args: vec![],
            type_args: None,
        };

        if is_async_generator {
            YieldExpr {
                span: DUMMY_SP,
                delegate: false,
                arg: Some(Box::new(create_helper_call(
                    "_awaitAsyncGenerator",
                    vec![call.into()],
                    unresolved_ctxt,
                ))),
            }
            .into()
        } else {
            YieldExpr {
                span: DUMMY_SP,
                delegate: false,
                arg: Some(Box::new(call.into())),
            }
            .into()
        }
    };

    let inner_if = IfStmt {
        span: DUMMY_SP,
        test: Box::new(
            BinExpr {
                span: DUMMY_SP,
                op: BinaryOp::NotEqEq,
                left: Box::new(Expr::Member(
                    iterator.clone().make_member(quote_ident!("return")),
                )),
                right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
            }
            .into(),
        ),
        cons: Box::new(Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(return_call),
        })),
        alt: None,
    };

    let outer_if = IfStmt {
        span: DUMMY_SP,
        test: Box::new(iterator_abrupt_completion.into()),
        cons: Box::new(Stmt::Block(BlockStmt {
            span: DUMMY_SP,
            stmts: vec![inner_if.into()],
            ..Default::default()
        })),
        alt: None,
    };

    // Build: if (didIteratorError) { throw iteratorError; }
    let throw_if = IfStmt {
        span: DUMMY_SP,
        test: Box::new(did_iteration_error.into()),
        cons: Box::new(Stmt::Block(BlockStmt {
            span: DUMMY_SP,
            stmts: vec![ThrowStmt {
                span: DUMMY_SP,
                arg: Box::new(iterator_error.into()),
            }
            .into()],
            ..Default::default()
        })),
        alt: None,
    };

    BlockStmt {
        span: DUMMY_SP,
        stmts: vec![TryStmt {
            span: DUMMY_SP,
            block: BlockStmt {
                span: DUMMY_SP,
                stmts: vec![outer_if.into()],
                ..Default::default()
            },
            handler: None,
            finalizer: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![throw_if.into()],
                ..Default::default()
            }),
        }
        .into()],
        ..Default::default()
    }
}

/// Create a helper function call
fn create_helper_call(helper_name: &str, args: Vec<Expr>, unresolved_ctxt: SyntaxContext) -> Expr {
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        ctxt: SyntaxContext::empty(),
        callee: Callee::Expr(Box::new(Expr::Ident(Ident {
            span: DUMMY_SP,
            ctxt: unresolved_ctxt,
            sym: helper_name.into(),
            optional: false,
        }))),
        args: args
            .into_iter()
            .map(|expr| ExprOrSpread {
                spread: None,
                expr: Box::new(expr),
            })
            .collect(),
        type_args: None,
    })
}
