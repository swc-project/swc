//! ES2018: Async Generator Functions
//!
//! This plugin mainly does the following transformations:
//!
//! 1. transforms async generator functions (async function *name() {}) to generator functions
//!    and wraps them with `awaitAsyncGenerator` helper function.
//! 2. transforms `await expr` expression to `yield awaitAsyncGenerator(expr)`.
//! 3. transforms `yield * argument` expression to `yield asyncGeneratorDelegate(asyncIterator(argument))`.
//! 4. transforms `for await` statement to `for` statement, and inserts many code to handle async iteration.
//!
//! ## Example
//!
//! Input:
//! ```js
//! async function f() {
//!  for await (let x of y) {
//!    g(x);
//!  }
//!}
//! ```
//!
//! Output:
//! ```js
//! function f() {
//! return _f.apply(this, arguments);
//! }
//! function _f() {
//! _f = babelHelpers.asyncToGenerator(function* () {
//!     var _iteratorAbruptCompletion = false;
//!     var _didIteratorError = false;
//!     var _iteratorError;
//!     try {
//!     for (var _iterator = babelHelpers.asyncIterator(y), _step; _iteratorAbruptCompletion = !(_step = yield _iterator.next()).done; _iteratorAbruptCompletion = false) {
//!         let x = _step.value;
//!         {
//!         g(x);
//!         }
//!     }
//!     } catch (err) {
//!     _didIteratorError = true;
//!     _iteratorError = err;
//!     } finally {
//!     try {
//!         if (_iteratorAbruptCompletion && _iterator.return != null) {
//!         yield _iterator.return();
//!         }
//!     } finally {
//!         if (_didIteratorError) {
//!         throw _iteratorError;
//!         }
//!     }
//!     }
//! });
//! return _f.apply(this, arguments);
//! }
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-async-generator-functions](https://babel.dev/docs/babel-plugin-transform-async-generator-functions).
//!
//! Reference:
//! * Babel docs: <https://babeljs.io/docs/en/babel-plugin-transform-async-generator-functions>
//! * Babel implementation: <https://github.com/babel/babel/blob/v7.26.2/packages/babel-plugin-transform-async-generator-functions>
//! * Async Iteration TC39 proposal: <https://github.com/tc39/proposal-async-iteration>

mod for_await;

use oxc_allocator::TakeIn;
use oxc_ast::ast::*;
use oxc_span::SPAN;
use oxc_traverse::{Ancestor, Traverse};

use crate::{
    common::helper_loader::Helper,
    context::{TransformCtx, TraverseCtx},
    es2017::AsyncGeneratorExecutor,
    state::TransformState,
};

pub struct AsyncGeneratorFunctions<'a, 'ctx> {
    ctx: &'ctx TransformCtx<'a>,
    executor: AsyncGeneratorExecutor<'a, 'ctx>,
}

impl<'a, 'ctx> AsyncGeneratorFunctions<'a, 'ctx> {
    pub fn new(ctx: &'ctx TransformCtx<'a>) -> Self {
        Self { ctx, executor: AsyncGeneratorExecutor::new(Helper::WrapAsyncGenerator, ctx) }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for AsyncGeneratorFunctions<'a, '_> {
    fn exit_expression(&mut self, expr: &mut Expression<'a>, ctx: &mut TraverseCtx<'a>) {
        let new_expr = match expr {
            Expression::AwaitExpression(await_expr) => {
                self.transform_await_expression(await_expr, ctx)
            }
            Expression::YieldExpression(yield_expr) => {
                self.transform_yield_expression(yield_expr, ctx)
            }
            Expression::FunctionExpression(func) => {
                if func.r#async && func.generator {
                    Some(self.executor.transform_function_expression(func, ctx))
                } else {
                    None
                }
            }
            _ => None,
        };

        if let Some(new_expr) = new_expr {
            *expr = new_expr;
        }
    }

    fn enter_statement(&mut self, stmt: &mut Statement<'a>, ctx: &mut TraverseCtx<'a>) {
        self.transform_statement(stmt, ctx);
    }

    fn exit_statement(&mut self, stmt: &mut Statement<'a>, ctx: &mut TraverseCtx<'a>) {
        let function = match stmt {
            Statement::FunctionDeclaration(func) => Some(func),
            Statement::ExportDefaultDeclaration(decl) => {
                if let ExportDefaultDeclarationKind::FunctionDeclaration(func) =
                    &mut decl.declaration
                {
                    Some(func)
                } else {
                    None
                }
            }
            Statement::ExportNamedDeclaration(decl) => {
                if let Some(Declaration::FunctionDeclaration(func)) = &mut decl.declaration {
                    Some(func)
                } else {
                    None
                }
            }
            _ => None,
        };

        if let Some(function) = function
            && function.r#async
            && function.generator
            && !function.is_typescript_syntax()
        {
            let new_statement = self.executor.transform_function_declaration(function, ctx);
            self.ctx.statement_injector.insert_after(stmt, new_statement);
        }
    }

    fn exit_function(&mut self, func: &mut Function<'a>, ctx: &mut TraverseCtx<'a>) {
        if func.r#async
            && func.generator
            && !func.is_typescript_syntax()
            && AsyncGeneratorExecutor::is_class_method_like_ancestor(ctx.parent())
        {
            self.executor.transform_function_for_method_definition(func, ctx);
        }
    }
}

impl<'a> AsyncGeneratorFunctions<'a, '_> {
    /// Transform `yield * argument` expression to `yield asyncGeneratorDelegate(asyncIterator(argument))`.
    fn transform_yield_expression(
        &self,
        expr: &mut YieldExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Expression<'a>> {
        if !expr.delegate || !Self::yield_is_inside_async_generator_function(ctx) {
            return None;
        }

        expr.argument.as_mut().map(|argument| {
            let argument = Argument::from(argument.take_in(ctx.ast));
            let arguments = ctx.ast.vec1(argument);
            let mut argument =
                self.ctx.helper_call_expr(Helper::AsyncIterator, SPAN, arguments, ctx);
            let arguments = ctx.ast.vec1(Argument::from(argument));
            argument =
                self.ctx.helper_call_expr(Helper::AsyncGeneratorDelegate, SPAN, arguments, ctx);
            ctx.ast.expression_yield(SPAN, expr.delegate, Some(argument))
        })
    }

    /// Check whether `yield` is inside an async generator function.
    fn yield_is_inside_async_generator_function(ctx: &TraverseCtx<'a>) -> bool {
        for ancestor in ctx.ancestors() {
            // Note: `yield` cannot appear within function params.
            // Also cannot appear in arrow functions because no such thing as a generator arrow function.
            if let Ancestor::FunctionBody(func) = ancestor {
                return *func.r#async();
            }
        }
        // `yield` can only appear in a function
        unreachable!();
    }

    /// Transforms `await expr` expression to `yield awaitAsyncGenerator(expr)`.
    /// Ignores top-level await expression.
    fn transform_await_expression(
        &self,
        expr: &mut AwaitExpression<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) -> Option<Expression<'a>> {
        if !Self::async_is_inside_async_generator_function(ctx) {
            return None;
        }

        let mut argument = expr.argument.take_in(ctx.ast);
        let arguments = ctx.ast.vec1(Argument::from(argument));
        argument = self.ctx.helper_call_expr(Helper::AwaitAsyncGenerator, SPAN, arguments, ctx);

        Some(ctx.ast.expression_yield(SPAN, false, Some(argument)))
    }

    /// Check whether `await` is inside an async generator function.
    fn async_is_inside_async_generator_function(ctx: &TraverseCtx<'a>) -> bool {
        for ancestor in ctx.ancestors() {
            match ancestor {
                // Note: `await` cannot appear within function params
                Ancestor::FunctionBody(func) => {
                    return *func.generator();
                }
                Ancestor::ArrowFunctionExpressionBody(_) => {
                    // Arrow functions can't be generator functions
                    return false;
                }
                _ => {}
            }
        }
        // Top level await
        false
    }
}
