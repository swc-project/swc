use std::ops::{Deref, DerefMut};

/// Utility type to deallocate memory in another thread.
///
///
///
/// If ths feature `enable` is turned on, the value will be deallocated in other
/// thread.
#[repr(transparent)]
#[derive(Debug, Clone, Default, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct FastDrop<T>
where
    T: Send + 'static,
{
    value: Option<T>,
}

impl<T> FastDrop<T>
where
    T: Send,
{
    #[inline(always)]
    pub fn new(value: T) -> Self {
        let value = Some(value);
        Self { value }
    }
}

impl<T> From<T> for FastDrop<T>
where
    T: Send,
{
    #[inline(always)]
    fn from(value: T) -> Self {
        Self::new(value)
    }
}

impl<T> Deref for FastDrop<T>
where
    T: Send,
{
    type Target = T;

    #[inline(always)]
    fn deref(&self) -> &Self::Target {
        // Safety: self.value can be None only if drop is called.
        unsafe { self.value.as_ref().unwrap_unchecked() }
    }
}

impl<T> DerefMut for FastDrop<T>
where
    T: Send,
{
    #[inline(always)]
    fn deref_mut(&mut self) -> &mut Self::Target {
        // Safety: self.value can be None only if drop is called.
        unsafe { self.value.as_mut().unwrap_unchecked() }
    }
}

impl<T> Drop for FastDrop<T>
where
    T: Send,
{
    fn drop(&mut self) {
        #[cfg(feature = "enable")]
        if let Some(value) = self.value.take() {
            rayon::spawn(move || {
                std::mem::drop(value);
            });
        }
    }
}
