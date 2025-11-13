//! ES2022: Class Properties
//! Transform of static property initializers and static blocks.
//!
//! Stub implementation for SWC.

use swc_ecma_ast::*;

use super::ClassProperties;
use crate::context::TraverseCtx;

impl ClassProperties {
    /// Convert static block.
    ///
    /// Stub implementation.
    pub(super) fn convert_static_block(
        &mut self,
        _block: &mut StaticBlock,
        _ctx: &mut TraverseCtx<'_>,
    ) {
        // Stub implementation
        // TODO: Implement static block conversion
    }
}
