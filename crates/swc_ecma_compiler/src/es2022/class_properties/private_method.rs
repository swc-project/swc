//! ES2022: Class Properties
//! Transform of private methods.
//!
//! Stub implementation for SWC.

use swc_ecma_ast::*;

use super::ClassProperties;
use crate::context::TraverseCtx;

impl<'a> ClassProperties<'_> {
    /// Convert private method definition.
    ///
    /// Returns a statement to insert after the class, or `None` if method
    /// doesn't need transforming.
    ///
    /// Stub implementation.
    pub(super) fn convert_private_method(
        &mut self,
        _method: &mut ClassMethod,
        _ctx: &mut TraverseCtx<'a>,
    ) -> Option<Stmt> {
        // Stub implementation
        // TODO: Implement private method conversion
        None
    }

    /// Create `_classPrivateMethodInitSpec(this, _C_brand)` call.
    ///
    /// Stub implementation.
    pub(super) fn create_class_private_method_init_spec(
        &mut self,
        _ctx: &mut TraverseCtx<'a>,
    ) -> Box<Expr> {
        // Stub implementation
        // TODO: Implement private method init spec creation
        Box::new(Expr::Invalid(Invalid {
            span: swc_common::DUMMY_SP,
        }))
    }
}
