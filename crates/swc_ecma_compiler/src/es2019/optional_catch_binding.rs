//! ES2019: Optional Catch Binding
//!
//! This plugin transforms catch clause without parameter to add a parameter
//! called `unused` in catch clause.
//!
//! > This plugin is included in `preset-env`, in ES2019
//!
//! ## Example
//!
//! Input:
//! ```js
//! try {
//!   throw 0;
//! } catch {
//!   doSomethingWhichDoesNotCareAboutTheValueThrown();
//! }
//! ```
//!
//! Output:
//! ```js
//! try {
//!   throw 0;
//! } catch (_unused) {
//!   doSomethingWhichDoesNotCareAboutTheValueThrown();
//! }
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-optional-catch-binding](https://babel.dev/docs/babel-plugin-transform-optional-catch-binding).
//!
//! ## References:
//! * Babel plugin implementation: <https://github.com/babel/babel/tree/v7.26.2/packages/babel-plugin-transform-optional-catch-binding>
//! * Optional catch binding TC39 proposal: <https://github.com/tc39/proposal-optional-catch-binding>

use swc_ecma_hooks::VisitMutHook;

use crate::context::{TransformCtx, TraverseCtx};

pub struct OptionalCatchBinding<'a, 'ctx> {
    _ctx: &'ctx TransformCtx<'a>,
}

impl<'a, 'ctx> OptionalCatchBinding<'a, 'ctx> {
    pub fn new(ctx: &'ctx TransformCtx<'a>) -> Self {
        Self { _ctx: ctx }
    }
}

impl VisitMutHook<TraverseCtx<'_>> for OptionalCatchBinding<'_, '_> {
    // TODO: Implement transformation when SWC infrastructure is ready
    // This will add a parameter called `_unused` to catch clauses without
    // parameters
}
