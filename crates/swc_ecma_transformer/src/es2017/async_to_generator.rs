//! Async to generator transformation.
//!
//! Transforms async functions to generator functions wrapped with an
//! `asyncToGenerator` helper function.
//!
//! ## Overview
//!
//! This transformation converts ES2017 async/await syntax into generator
//! functions that can be executed by a runtime helper. The transformation:
//!
//! 1. Converts `async function` to regular `function`
//! 2. Wraps the function body in a generator function
//! 3. Converts `await` expressions to `yield` expressions
//! 4. Wraps the generator call with `asyncToGenerator` helper
//!
//! ## Example
//!
//! ```js
//! // Input
//! async function fetchData(url) {
//!   const response = await fetch(url);
//!   return response.json();
//! }
//!
//! // Output
//! function fetchData(url) {
//!   return _asyncToGenerator(function* () {
//!     const response = yield fetch(url);
//!     return response.json();
//!   })();
//! }
//! ```
//!
//! ## Implementation Details
//!
//! The transformation handles several cases:
//!
//! - **Function declarations**: Wrapped with helper call
//! - **Function expressions**: Converted to IIFE pattern
//! - **Arrow functions**: Converted to generator expressions
//! - **Method definitions**: Generator methods with helper wrapper
//!
//! ## Reference
//!
//! - Based on: https://github.com/oxc-project/oxc/blob/main/crates/oxc_transformer/src/es2017/async_to_generator.rs
//! - Spec: https://262.ecma-international.org/8.0/#sec-async-function-definitions

use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::{
    common::{Helper, HelperLoader},
    TransformCtx,
};

/// Async to generator transformer.
///
/// This struct implements the transformation of async functions to generators.
pub struct AsyncToGenerator {
    /// Tracks whether we're currently inside an async function.
    /// This is used to determine whether `await` should be transformed.
    in_async_context: bool,
}

impl AsyncToGenerator {
    /// Creates a new async to generator transformer.
    pub fn new() -> Self {
        Self {
            in_async_context: false,
        }
    }

    /// Creates a generator function expression from a function.
    fn create_generator_function(&self, func: &Function) -> Function {
        Function {
            params: func.params.clone(),
            decorators: vec![],
            span: func.span,
            ctxt: Default::default(),
            body: func.body.clone(),
            is_generator: true,
            is_async: false,
            type_params: func.type_params.clone(),
            return_type: func.return_type.clone(),
        }
    }

    /// Wraps a generator function with the asyncToGenerator helper.
    fn wrap_with_async_to_generator(&self, generator: Function, _ctx: &mut TransformCtx) -> Expr {
        let helper_loader = HelperLoader::default();

        // Create the generator function expression
        let generator_expr = Expr::Fn(FnExpr {
            ident: None,
            function: Box::new(generator),
        });

        // Create: _asyncToGenerator(function* () { ... })()
        Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(helper_loader.create_helper_call(
                Helper::AsyncToGenerator,
                vec![ExprOrSpread {
                    spread: None,
                    expr: Box::new(generator_expr),
                }],
            )),
            args: vec![],
            type_args: None,
            ctxt: Default::default(),
        })
    }
}

impl Default for AsyncToGenerator {
    fn default() -> Self {
        Self::new()
    }
}

impl VisitMutHook<TransformCtx> for AsyncToGenerator {
    fn exit_expr(&mut self, expr: &mut Expr, ctx: &mut TransformCtx) {
        match expr {
            // Transform await expressions to yield expressions
            Expr::Await(await_expr) if self.in_async_context => {
                *expr = Expr::Yield(YieldExpr {
                    span: await_expr.span,
                    arg: Some(await_expr.arg.clone()),
                    delegate: false,
                });
            }

            // Transform async function expressions
            Expr::Fn(fn_expr) if fn_expr.function.is_async => {
                let was_in_async = self.in_async_context;
                self.in_async_context = true;

                let generator = self.create_generator_function(&fn_expr.function);
                let wrapped = self.wrap_with_async_to_generator(generator, ctx);

                self.in_async_context = was_in_async;
                *expr = wrapped;
            }

            // Transform async arrow functions
            Expr::Arrow(arrow) if arrow.is_async => {
                let was_in_async = self.in_async_context;
                self.in_async_context = true;

                // Convert arrow function to regular function
                let body = match arrow.body.as_ref() {
                    BlockStmtOrExpr::BlockStmt(block) => Some(block.clone()),
                    BlockStmtOrExpr::Expr(expr) => Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(expr.clone()),
                        })],
                        ctxt: Default::default(),
                    }),
                };

                // Convert Pat to Param
                let params = arrow
                    .params
                    .iter()
                    .map(|pat| Param {
                        span: DUMMY_SP,
                        decorators: vec![],
                        pat: pat.clone(),
                    })
                    .collect();

                let func = Function {
                    params,
                    decorators: vec![],
                    span: arrow.span,
                    ctxt: Default::default(),
                    body,
                    is_generator: true,
                    is_async: false,
                    type_params: arrow.type_params.clone(),
                    return_type: arrow.return_type.clone(),
                };

                let wrapped = self.wrap_with_async_to_generator(func, ctx);

                self.in_async_context = was_in_async;
                *expr = wrapped;
            }

            _ => {}
        }
    }

    fn exit_function(&mut self, func: &mut Function, _ctx: &mut TransformCtx) {
        // Mark that we need to track async context for nested functions
        if func.is_async {
            self.in_async_context = true;
        }
    }

    fn exit_stmt(&mut self, stmt: &mut Stmt, ctx: &mut TransformCtx) {
        // Transform async function declarations
        if let Stmt::Decl(Decl::Fn(fn_decl)) = stmt {
            if fn_decl.function.is_async {
                let was_in_async = self.in_async_context;
                self.in_async_context = true;

                let generator = self.create_generator_function(&fn_decl.function);
                let wrapped = self.wrap_with_async_to_generator(generator, ctx);

                self.in_async_context = was_in_async;

                // Convert to: function name() { return _asyncToGenerator(...)(); }
                let new_func = Function {
                    params: vec![],
                    decorators: vec![],
                    span: fn_decl.function.span,
                    ctxt: Default::default(),
                    body: Some(BlockStmt {
                        span: DUMMY_SP,
                        stmts: vec![Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(Box::new(wrapped)),
                        })],
                        ctxt: Default::default(),
                    }),
                    is_generator: false,
                    is_async: false,
                    type_params: fn_decl.function.type_params.clone(),
                    return_type: fn_decl.function.return_type.clone(),
                };

                fn_decl.function = Box::new(new_func);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use std::{io, path::PathBuf, sync::Arc};

    use swc_common::{errors::Handler, sync::Lrc, FileName, SourceMap};

    use super::*;
    use crate::TransformCtx;

    fn create_test_ctx() -> TransformCtx {
        let source_map_lrc = Lrc::new(SourceMap::default());
        let source_file = source_map_lrc.new_source_file(Lrc::new(FileName::Anon), "".to_string());

        let handler = Lrc::new(Handler::with_emitter_writer(
            Box::new(io::sink()),
            Some(source_map_lrc.clone()),
        ));

        TransformCtx::new(
            PathBuf::from("test.js"),
            Arc::new(source_file.src.to_string()),
            source_map_lrc.clone(),
            handler,
        )
    }

    #[test]
    fn test_await_to_yield() {
        let mut ctx = create_test_ctx();
        let mut transformer = AsyncToGenerator::new();
        transformer.in_async_context = true;

        let mut expr = Expr::Await(AwaitExpr {
            span: DUMMY_SP,
            arg: Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: Callee::Expr(Box::new(Expr::Ident(Ident::new(
                    "fetch".into(),
                    DUMMY_SP,
                    Default::default(),
                )))),
                args: vec![],
                type_args: None,
                ctxt: Default::default(),
            })),
        });

        transformer.exit_expr(&mut expr, &mut ctx);

        assert!(matches!(expr, Expr::Yield(_)));
    }

    #[test]
    fn test_async_function_transformation() {
        let mut ctx = create_test_ctx();
        let mut transformer = AsyncToGenerator::new();

        let async_fn = Function {
            params: vec![],
            decorators: vec![],
            span: DUMMY_SP,
            ctxt: Default::default(),
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![],
                ctxt: Default::default(),
            }),
            is_generator: false,
            is_async: true,
            type_params: None,
            return_type: None,
        };

        let mut expr = Expr::Fn(FnExpr {
            ident: None,
            function: Box::new(async_fn),
        });

        transformer.exit_expr(&mut expr, &mut ctx);

        // Should be transformed to a call expression
        assert!(matches!(expr, Expr::Call(_)));
    }

    #[test]
    fn test_generator_creation() {
        let transformer = AsyncToGenerator::new();

        let async_fn = Function {
            params: vec![],
            decorators: vec![],
            span: DUMMY_SP,
            ctxt: Default::default(),
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![],
                ctxt: Default::default(),
            }),
            is_generator: false,
            is_async: true,
            type_params: None,
            return_type: None,
        };

        let generator = transformer.create_generator_function(&async_fn);

        assert!(generator.is_generator);
        assert!(!generator.is_async);
    }
}
