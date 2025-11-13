/// State that can be shared across different transform passes.
///
/// In SWC's visitor pattern architecture, state is typically managed through
/// the visitor struct itself rather than through a separate state object.
/// This minimal struct serves as the context type (`C` parameter) for
/// `VisitMutHook<C>` implementations.
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
#[derive(Default)]
pub struct TransformState<'a> {
    /// Marker to maintain the lifetime relationship.
    ///
    /// This PhantomData ensures the struct is properly covariant over `'a`,
    /// allowing it to be used in contexts where lifetime variance matters
    /// for soundness.
    _marker: std::marker::PhantomData<&'a ()>,
}

impl<'a> TransformState<'a> {
    /// Creates a new `TransformState` instance.
    ///
    /// This is equivalent to using `Default::default()` but provides
    /// a more explicit constructor for clarity.
    #[inline]
    pub fn new() -> Self {
        Self::default()
    }
}
