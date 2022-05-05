use std::{
    hash::{Hash, Hasher},
    rc::Rc,
};

use owning_ref::{Erased, OwningRef};

/// Pointer type
pub struct Ptr<T>
where
    T: ?Sized,
{
    inner: OwningRef<Rc<dyn Erased>, T>,
}

impl<T> Ptr<T>
where
    T: ?Sized,
{
    pub fn new(data: Rc<T>) -> Self
    where
        T: 'static + Sized,
    {
        let or = OwningRef::new(data);

        let inner = or.erase_owner();

        Self { inner }
    }
}

impl<T> From<OwningRef<Rc<dyn Erased>, T>> for Ptr<T>
where
    T: ?Sized,
{
    fn from(inner: OwningRef<Rc<dyn Erased>, T>) -> Self {
        Self { inner }
    }
}

impl<T> std::ops::Deref for Ptr<T>
where
    T: ?Sized,
{
    type Target = OwningRef<Rc<dyn Erased>, T>;

    fn deref(&self) -> &Self::Target {
        &self.inner
    }
}

impl<T> Clone for Ptr<T>
where
    T: ?Sized,
{
    fn clone(&self) -> Self {
        Self {
            inner: self.inner.clone(),
        }
    }
}

impl<T> PartialEq for Ptr<T>
where
    T: ?Sized,
{
    fn eq(&self, other: &Self) -> bool {
        Rc::ptr_eq(self.inner.as_owner(), other.inner.as_owner())
            && std::ptr::eq(&*self.inner as *const T, &*other.inner as *const T)
    }
}

impl<T> Eq for Ptr<T> where T: ?Sized {}

impl<T> Hash for Ptr<T>
where
    T: ?Sized,
{
    fn hash<H: Hasher>(&self, state: &mut H) {
        (self.inner.as_owner() as *const dyn Erased).hash(state);
        (&***self as *const T).hash(state);
    }
}
