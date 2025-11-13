//! ES2022: Class Properties
//! Transform of property declarations (instance and static).
//!
//! Stub implementation for SWC.

use swc_ecma_ast::*;

use super::ClassProperties;
use crate::context::TraverseCtx;

impl ClassProperties {
    /// Convert instance property definition.
    ///
    /// Stub implementation.
    pub(super) fn convert_instance_property(
        &mut self,
        _prop: &mut ClassProp,
        _instance_inits: &mut Vec<Box<Expr>>,
        _ctx: &mut TraverseCtx<'_>,
    ) {
        // Stub implementation
        // TODO: Implement instance property conversion
    }

    /// Convert static property definition.
    ///
    /// Stub implementation.
    pub(super) fn convert_static_property(
        &mut self,
        _prop: &mut ClassProp,
        _ctx: &mut TraverseCtx<'_>,
    ) {
        // Stub implementation
        // TODO: Implement static property conversion
    }
}
