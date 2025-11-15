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

use oxc_ast::ast::*;
use oxc_semantic::SymbolFlags;
use oxc_span::SPAN;
use oxc_traverse::Traverse;

use crate::{context::TraverseCtx, state::TransformState};

pub struct OptionalCatchBinding;

impl OptionalCatchBinding {
    pub fn new() -> Self {
        Self
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for OptionalCatchBinding {
    /// If CatchClause has no param, add a parameter called `unused`.
    fn enter_catch_clause(&mut self, clause: &mut CatchClause<'a>, ctx: &mut TraverseCtx<'a>) {
        if clause.param.is_some() {
            return;
        }

        let binding = ctx.generate_uid(
            "unused",
            clause.body.scope_id(),
            SymbolFlags::CatchVariable | SymbolFlags::FunctionScopedVariable,
        );
        let binding_pattern = binding.create_binding_pattern(ctx);
        let param = ctx.ast.catch_parameter(SPAN, binding_pattern);
        clause.param = Some(param);
    }
}
