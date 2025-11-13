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
//!   return _foo.apply(this, arguments);
//! }
//! function _foo() {
//!   _foo = babelHelpers.asyncToGenerator(function* () {
//!           yield bar();
//!   });
//!   return _foo.apply(this, arguments);
//! }
//! const foo2 = function() {
//!   var _ref = babelHelpers.asyncToGenerator(function* () {
//!           yield bar();
//!   });
//!   return function foo2() {
//!      return _ref.apply(this, arguments);
//!   };
//! }();
//! babelHelpers.asyncToGenerator(function* () {
//!   yield bar();
//! });
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-async-to-generator](https://babel.dev/docs/babel-plugin-transform-async-to-generator).
//!
//! Reference:
//! * Babel docs: <https://babeljs.io/docs/en/babel-plugin-transform-async-to-generator>
//! * Babel implementation: <https://github.com/babel/babel/blob/v7.26.2/packages/babel-plugin-transform-async-to-generator>
//! * Async / Await TC39 proposal: <https://github.com/tc39/proposal-async-await>

use swc_ecma_hooks::VisitMutHook;

use crate::context::{TransformCtx, TraverseCtx};

pub struct AsyncToGenerator<'a> {
    _ctx: &'a TransformCtx,
}

impl<'a> AsyncToGenerator<'a> {
    pub fn new(ctx: &'a TransformCtx) -> Self {
        Self { _ctx: ctx }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for AsyncToGenerator<'_> {}

pub struct AsyncGeneratorExecutor<'a> {
    _ctx: &'a TransformCtx,
}

impl<'a> AsyncGeneratorExecutor<'a> {
    #[expect(unused)]
    pub fn new(_ctx: &'a TransformCtx) -> Self {
        Self { _ctx }
    }
}
