//! ES2022: Class Properties
//! Transform of static property initializers and static blocks.
//!
//! Stub implementation for SWC.

use swc_ecma_ast::*;

use super::ClassProperties;
use crate::context::TraverseCtx;

impl<'a> ClassProperties<'a, '_> {
    /// Convert static block.
    ///
    /// Stub implementation.
    pub(super) fn convert_static_block(
        &mut self,
        _block: &mut StaticBlock,
        _ctx: &mut TraverseCtx<'a>,
    ) {
        // Stub implementation
        // TODO: Implement static block conversion
    }
}
