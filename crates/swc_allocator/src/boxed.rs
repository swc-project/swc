use std::{marker::PhantomData, ptr::NonNull};

/// A special `Box` which has size of [`std::boxed::Box`] but **may** be
/// allocated with a custom allocator.
pub struct Box<T: ?Sized> {
    data: NonNull<T>,
    marker: PhantomData<&mut T>,
}
