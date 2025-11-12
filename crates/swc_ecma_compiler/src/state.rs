/// State that can be shared across different transform passes.
///
/// This struct is designed to be minimal and lightweight. In SWC's visitor
/// pattern, state is typically managed through the visitor struct itself rather
/// than through a separate state object. This struct exists primarily for
/// compatibility during the transition from oxc to SWC APIs.
///
/// The lifetime parameter `'a` is maintained for now to support the existing
/// traverse pattern, but will be removed once the full migration to SWC is
/// complete.
#[derive(Default)]
pub struct TransformState<'a> {
    /// Marker to maintain the lifetime relationship during the API transition.
    /// This will be removed once the migration to SWC's visitor pattern is
    /// complete.
    _marker: std::marker::PhantomData<&'a ()>,
}
