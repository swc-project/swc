//! ES2020: Optional Chaining
//!
//! This plugin transforms [`ChainExpression`] into a series of `null` and `void
//! 0` checks, resulting in a conditional expression.
//!
//! > This plugin is included in `preset-env`, in ES2020.
//!
//! ## Example
//!
//! Input:
//! ```js
//! const foo = {};
//! // Read
//! foo?.bar?.bar;
//! // Call
//! foo?.bar?.baz?.();
//! // Delete
//! delete foo?.bar?.baz;
//! ```
//!
//! Output:
//! ```js
//! var _foo$bar, _foo$bar2, _foo$bar2$baz, _foo$bar3;
//! const foo = {};
//! // Read
//! foo === null || foo === void 0 || (_foo$bar = foo.bar) === null ||
//!   _foo$bar === void 0 ? void 0 : _foo$bar.bar;
//! // Call
//! foo === null || foo === void 0 || (_foo$bar2 = foo.bar) === null ||
//!   _foo$bar2 === void 0 || (_foo$bar2$baz = _foo$bar2.baz) === null ||
//!   _foo$bar2$baz === void 0 ? void 0 : _foo$bar2$baz.call(_foo$bar2);
//! // Delete
//! foo === null || foo === void 0 || (_foo$bar3 = foo.bar) === null ||
//!   _foo$bar3 === void 0 ? true : delete _foo$bar3.baz;
//! ```
//!
//! ## Implementation
//!
//! Due to the different architecture, we found it hard to port the
//! implementation from Babel directly; however, our implementation is written
//! based on Babel's transformed output.
//!
//! Nevertheless, our outputs still have some differences from Babel's output.
//!
//! ## References
//!
//! * Babel docs: <https://babeljs.io/docs/en/babel-plugin-proposal-optional-chaining>
//! * Babel implementation: <https://github.com/babel/babel/tree/v7.26.2/packages/babel-plugin-transform-optional-chaining>
//! * Optional chaining TC39 proposal: <https://github.com/tc39/proposal-optional-chaining>

use swc_ecma_hooks::VisitMutHook;

use crate::context::{TransformCtx, TraverseCtx};

pub struct OptionalChaining<'a, 'ctx> {
    _ctx: &'ctx TransformCtx<'a>,
}

impl<'a, 'ctx> OptionalChaining<'a, 'ctx> {
    pub fn new(ctx: &'ctx TransformCtx<'a>) -> Self {
        Self { _ctx: ctx }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for OptionalChaining<'_, '_> {
    // TODO: Implement transformation when SWC infrastructure is ready
    // This will transform optional chaining expressions to conditional expressions
}
