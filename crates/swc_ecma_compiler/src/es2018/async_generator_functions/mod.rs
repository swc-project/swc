//! ES2018: Async Generator Functions
//!
//! This plugin transforms async generator functions to generator functions
//! wrapped with helper functions.
//!
//! # Implementation Status
//!
//! This is a stub implementation to replace the oxc-based version.
//! The full implementation requires:
//!
//! 1. Transform async generator functions to generator functions and wrap them
//!    with `awaitAsyncGenerator` helper function.
//! 2. Transform `await expr` expression to `yield awaitAsyncGenerator(expr)`.
//! 3. Transform `yield * argument` expression to `yield
//!    asyncGeneratorDelegate(asyncIterator(argument))`.
//! 4. Transform `for await` statement to `for` statement with async iteration
//!    handling.
//!
//! ## Example
//!
//! Input:
//! ```js
//! async function f() {
//!  for await (let x of y) {
//!    g(x);
//!  }
//! }
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
//!
//! TODO: Implement the full transformation using SWC's visitor infrastructure.

mod for_await;

use swc_ecma_hooks::VisitMutHook;

use crate::{
    context::{TransformCtx, TraverseCtx},
    es2017::AsyncGeneratorExecutor,
};

pub struct AsyncGeneratorFunctions<'a, 'ctx> {
    #[allow(unused)]
    ctx: &'ctx TransformCtx<'a>,
    #[allow(unused)]
    executor: AsyncGeneratorExecutor<'a, 'ctx>,
}

impl<'a, 'ctx> AsyncGeneratorFunctions<'a, 'ctx> {
    pub fn new(ctx: &'ctx TransformCtx<'a>) -> Self {
        Self {
            ctx,
            executor: AsyncGeneratorExecutor::new(ctx),
        }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for AsyncGeneratorFunctions<'_, '_> {
    // TODO: Implement visitor hooks for:
    // - exit_expression: Transform await/yield expressions in async generators
    // - enter_statement: Transform for-await statements
    // - exit_statement: Transform async generator function declarations
    // - exit_function: Transform async generator methods
}
