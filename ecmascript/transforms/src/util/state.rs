use std::ops::{Deref, DerefMut};

/// Variable which is resetted to default on clone
#[derive(Debug, Default, Copy, PartialEq, Eq)]
pub(crate) struct State<T: Default> {
    pub value: T,
}

impl<T: Default> From<T> for State<T> {
    fn from(value: T) -> Self {
        State { value }
    }
}

impl<T: Default> Deref for State<T> {
    type Target = T;
    fn deref(&self) -> &T {
        &self.value
    }
}

impl<T: Default> DerefMut for State<T> {
    fn deref_mut(&mut self) -> &mut T {
        &mut self.value
    }
}

impl<T: Default> Clone for State<T> {
    fn clone(&self) -> Self {
        State {
            value: Default::default(),
        }
    }
}

/// Safe iff cloned.
unsafe impl<T: Default> Send for State<T> {}
/// Safe iff cloned.
unsafe impl<T: Default> Sync for State<T> {}
