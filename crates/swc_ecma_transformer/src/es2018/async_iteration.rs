//! Async iteration transformation.
//!
//! This module transforms ES2018 async iteration features:
//!
//! ## For-await-of loops
//!
//! ```javascript
//! // Input
//! for await (const x of asyncIterable) {
//!   console.log(x);
//! }
//!
//! // Output (simplified)
//! const _iterator = asyncIterable[Symbol.asyncIterator]();
//! let _result;
//! while (!(_result = await _iterator.next()).done) {
//!   const x = _result.value;
//!   console.log(x);
//! }
//! ```
//!
//! ## Async Generator Functions
//!
//! ```javascript
//! // Input
//! async function* gen() {
//!   yield await fetch('/data');
//! }
//!
//! // Output (uses helpers)
//! function gen() {
//!   return _wrapAsyncGenerator(function* () {
//!     yield _awaitAsyncGenerator(fetch('/data'));
//!   })();
//! }
//! ```
//!
//! # References
//! - Specification: https://github.com/tc39/proposal-async-iteration
//! - MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of

use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TransformCtx;

/// Async iteration transformer.
///
/// Handles transformation of for-await-of loops and async generator functions.
#[derive(Debug)]
pub struct AsyncIteration {
    for_await_enabled: bool,
    async_generator_enabled: bool,
    /// Track if we're inside an async generator function.
    in_async_generator: bool,
}

impl AsyncIteration {
    /// Creates a new async iteration transformer.
    pub fn new(for_await_enabled: bool, async_generator_enabled: bool) -> Self {
        Self {
            for_await_enabled,
            async_generator_enabled,
            in_async_generator: false,
        }
    }

    /// Check if we should process this node.
    fn is_enabled(&self) -> bool {
        self.for_await_enabled || self.async_generator_enabled
    }
}

impl VisitMutHook<TransformCtx> for AsyncIteration {
    fn enter_expr(&mut self, node: &mut Expr, _ctx: &mut TransformCtx) {
        if !self.is_enabled() {
            return;
        }

        // Track when entering async generator functions
        match node {
            Expr::Fn(fn_expr) if fn_expr.function.is_async && fn_expr.function.is_generator => {
                self.in_async_generator = true;
            }
            _ => {}
        }
    }

    fn exit_expr(&mut self, node: &mut Expr, _ctx: &mut TransformCtx) {
        if !self.is_enabled() {
            return;
        }

        match node {
            // Transform await expressions inside async generators
            Expr::Await(await_expr) if self.in_async_generator => {
                self.transform_await_in_async_generator(await_expr);
            }
            // Transform yield* expressions inside async generators
            Expr::Yield(yield_expr) if self.in_async_generator && yield_expr.delegate => {
                self.transform_yield_delegate_in_async_generator(yield_expr);
            }
            // Track when exiting async generator functions
            Expr::Fn(fn_expr) if fn_expr.function.is_async && fn_expr.function.is_generator => {
                self.in_async_generator = false;
            }
            _ => {}
        }
    }

    fn exit_function(&mut self, node: &mut Function, _ctx: &mut TransformCtx) {
        if !self.async_generator_enabled {
            return;
        }

        // Transform async generator functions
        if node.is_async && node.is_generator {
            self.transform_async_generator_function(node);
        }
    }

    fn exit_for_of_stmt(&mut self, node: &mut ForOfStmt, _ctx: &mut TransformCtx) {
        if !self.for_await_enabled {
            return;
        }

        // Transform for-await-of loops
        if node.is_await {
            self.transform_for_await_of(node);
        }
    }
}

impl AsyncIteration {
    /// Transform await expressions inside async generator functions.
    ///
    /// Converts `await expr` to `yield _awaitAsyncGenerator(expr)`
    fn transform_await_in_async_generator(&mut self, _await_expr: &mut AwaitExpr) {
        // TODO: Implement await transformation
        // The actual implementation would:
        // 1. Wrap the argument with _awaitAsyncGenerator helper call
        // 2. Convert to a yield expression
    }

    /// Transform yield* expressions inside async generator functions.
    ///
    /// Converts `yield* expr` to `yield*
    /// _asyncGeneratorDelegate(_asyncIterator(expr))`
    fn transform_yield_delegate_in_async_generator(&mut self, _yield_expr: &mut YieldExpr) {
        // TODO: Implement yield* transformation
        // The actual implementation would:
        // 1. Wrap the argument with _asyncIterator helper
        // 2. Wrap with _asyncGeneratorDelegate helper
    }

    /// Transform async generator functions.
    ///
    /// Wraps the function body with appropriate helpers.
    fn transform_async_generator_function(&mut self, _function: &mut Function) {
        // TODO: Implement async generator transformation
        // The actual implementation would:
        // 1. Remove async and generator flags
        // 2. Wrap body with _wrapAsyncGenerator helper
        // 3. Transform await and yield expressions inside
    }

    /// Transform for-await-of loops.
    ///
    /// Converts `for await (const x of iter)` to an equivalent while loop
    /// using async iterator protocol.
    fn transform_for_await_of(&mut self, _for_of: &mut ForOfStmt) {
        // TODO: Implement for-await-of transformation
        // The actual implementation would:
        // 1. Get the async iterator from the iterable
        // 2. Create a while loop that calls iterator.next()
        // 3. Handle the iterator protocol (value, done)
        // 4. Insert try-finally for proper cleanup
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_async_iteration_creation() {
        let transformer = AsyncIteration::new(true, true);
        assert!(transformer.for_await_enabled);
        assert!(transformer.async_generator_enabled);
        assert!(!transformer.in_async_generator);
    }

    #[test]
    fn test_async_iteration_disabled() {
        let transformer = AsyncIteration::new(false, false);
        assert!(!transformer.for_await_enabled);
        assert!(!transformer.async_generator_enabled);
    }

    #[test]
    fn test_is_enabled() {
        let transformer1 = AsyncIteration::new(true, false);
        assert!(transformer1.is_enabled());

        let transformer2 = AsyncIteration::new(false, true);
        assert!(transformer2.is_enabled());

        let transformer3 = AsyncIteration::new(false, false);
        assert!(!transformer3.is_enabled());
    }
}
