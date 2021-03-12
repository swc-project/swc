use std::{mem, ptr};

/// Copied from `syntax::ptr::P` of rustc.
pub trait Map<T> {
    /// Transform the inner value, consuming `self` and producing a new `P<T>`.
    ///
    /// # Memory leak
    ///
    /// This will leak `self` if the given closure panics.
    fn map<F>(self, f: F) -> Self
    where
        F: FnOnce(T) -> T;
}

impl<T> Map<T> for Box<T> {
    fn map<F>(mut self, f: F) -> Self
    where
        F: FnOnce(T) -> T,
    {
        let p: *mut T = &mut *self;

        // Leak self in case of panic.
        // FIXME(eddyb) Use some sort of "free guard" that
        // only deallocates, without dropping the pointee,
        // in case the call the `f` below ends in a panic.
        mem::forget(self);

        unsafe {
            ptr::write(p, f(ptr::read(p)));

            // Recreate self from the raw pointer.
            Box::from_raw(p)
        }
    }
}
