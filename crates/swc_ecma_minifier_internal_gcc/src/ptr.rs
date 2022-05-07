use std::hash::{Hash, Hasher};

/// Pointer type
pub struct Ptr<'a, T>
where
    T: ?Sized,
{
    data: &'a T,
}

impl<'a, T> Ptr<'a, T>
where
    T: ?Sized,
{
    pub fn new(data: &'a T) -> Self
    where
        T: 'static + Sized,
    {
        Self { data }
    }
}

impl<'a, T> std::ops::Deref for Ptr<'a, T>
where
    T: ?Sized,
{
    type Target = T;

    fn deref(&self) -> &Self::Target {
        &self.data
    }
}

impl<T> Clone for Ptr<'_, T>
where
    T: ?Sized,
{
    fn clone(&self) -> Self {
        Self { data: *self.data }
    }
}

impl<T> Copy for Ptr<'_, T> where T: ?Sized {}

impl<T> PartialEq for Ptr<'_, T>
where
    T: ?Sized,
{
    #[allow(clippy::vtable_address_comparisons)]
    fn eq(&self, other: &Self) -> bool {
        std::ptr::eq(&*self.data as *const T, &*other.data as *const T)
    }
}

impl<T> Eq for Ptr<'_, T> where T: ?Sized {}

impl<T> Hash for Ptr<'_, T>
where
    T: ?Sized,
{
    fn hash<H: Hasher>(&self, state: &mut H) {
        (&***self as *const T).hash(state);
    }
}
