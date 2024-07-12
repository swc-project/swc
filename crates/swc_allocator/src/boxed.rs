use std::{marker::PhantomData, ptr::NonNull};

pub struct Box<T: ?Sized> {
    data: NonNull<T>,
    marker: PhantomData<&mut T>,
}
