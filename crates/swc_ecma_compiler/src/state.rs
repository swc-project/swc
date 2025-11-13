use crate::context::TransformCtx;

/// State that can be shared across different transform passes.
///
/// In SWC's visitor pattern architecture, state is typically managed through
/// the visitor struct itself rather than through a separate state object.
/// This struct serves as the context type (`C` parameter) for
/// `VisitMutHook<C>` implementations and provides access to the transform
/// context.
///
/// # Design Notes
///
/// Unlike oxc's `TraverseCtx` which contains extensive traversal state,
/// SWC's hook-based visitor pattern delegates state management to individual
/// visitor implementations. This design provides:
///
/// * Better modularity - each visitor manages its own state
/// * Improved performance - no overhead from unused state fields
/// * Type safety - context type is explicitly parameterized
///
/// The lifetime parameter `'a` allows this type to reference data that lives
/// for the duration of the transformation, enabling zero-copy operations where
/// possible for optimal performance.
pub struct TransformState<'a> {
    /// Reference to the transform context, providing access to configuration,
    /// helpers, and utilities needed during transformation.
    pub ctx: &'a mut TransformCtx,
}

impl<'a> TransformState<'a> {
    /// Creates a new `TransformState` instance with the given transform
    /// context.
    #[inline]
    pub fn new(ctx: &'a mut TransformCtx) -> Self {
        Self { ctx }
    }
}

// Convenience methods that delegate to TransformCtx
impl<'a> std::ops::Deref for TransformState<'a> {
    type Target = TransformCtx;

    fn deref(&self) -> &Self::Target {
        self.ctx
    }
}

impl<'a> std::ops::DerefMut for TransformState<'a> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        self.ctx
    }
}
