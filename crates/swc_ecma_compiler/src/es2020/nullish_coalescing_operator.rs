//! ES2020: Nullish Coalescing Operator
//!
//! This plugin transforms nullish coalescing operators (`??`) to a series of
//! ternary expressions.
//!
//! > This plugin is included in `preset-env`, in ES2020
//!
//! ## Example
//!
//! Input:
//! ```js
//! var foo = object.foo ?? "default";
//! ```
//!
//! Output:
//! ```js
//! var _object$foo;
//! var foo =
//! (_object$foo = object.foo) !== null && _object$foo !== void 0
//!   ? _object$foo
//!   : "default";
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-nullish-coalescing-operator](https://babeljs.io/docs/babel-plugin-transform-nullish-coalescing-operator).
//!
//! ## References:
//! * Babel plugin implementation: <https://github.com/babel/babel/tree/v7.26.2/packages/babel-plugin-transform-nullish-coalescing-operator>
//! * Nullish coalescing TC39 proposal: <https://github.com/tc39-transfer/proposal-nullish-coalescing>

use swc_ecma_hooks::VisitMutHook;

use crate::context::TraverseCtx;

pub struct NullishCoalescingOperator;

impl NullishCoalescingOperator {
    pub fn new() -> Self {
        Self
    }
}

impl VisitMutHook<TraverseCtx<'_>> for NullishCoalescingOperator {
    // TODO: Implement transformation when SWC infrastructure is ready
    // This will transform `left ?? right` to conditional expressions
}
