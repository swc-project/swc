use std::ptr::NonNull;

/// A special `Box` which has size of [`std::boxed::Box`] but **may** be
/// allocated with a custom allocator.
///
///
/// # Representation
///
/// The last bit is 1 if the box is allocated with a custom allocator.
pub struct Box<T: ?Sized> {
    data: NonNull<T>,
}
