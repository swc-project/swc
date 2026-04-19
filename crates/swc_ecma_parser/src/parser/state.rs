use std::{
    fmt,
    hash::Hash,
    ops::{Deref, DerefMut},
    rc::Rc,
};

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::{BytePos, Span};

use crate::{input::Tokens, Parser};

/// Copy-on-write vector storage for parser state checkpoints.
#[derive(Clone, Default)]
pub struct SharedVec<T>(Rc<Vec<T>>);

impl<T> SharedVec<T> {
    #[cfg(test)]
    pub(crate) fn strong_count(&self) -> usize {
        Rc::strong_count(&self.0)
    }
}

impl<T> Deref for SharedVec<T> {
    type Target = Vec<T>;

    fn deref(&self) -> &Self::Target {
        self.0.as_ref()
    }
}

impl<T: Clone> DerefMut for SharedVec<T> {
    fn deref_mut(&mut self) -> &mut Self::Target {
        Rc::make_mut(&mut self.0)
    }
}

impl<T: fmt::Debug> fmt::Debug for SharedVec<T> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

impl<'a, T> IntoIterator for &'a SharedVec<T> {
    type IntoIter = std::slice::Iter<'a, T>;
    type Item = &'a T;

    fn into_iter(self) -> Self::IntoIter {
        self.iter()
    }
}

impl<'a, T: Clone> IntoIterator for &'a mut SharedVec<T> {
    type IntoIter = std::slice::IterMut<'a, T>;
    type Item = &'a mut T;

    fn into_iter(self) -> Self::IntoIter {
        self.iter_mut()
    }
}

/// Copy-on-write hash map storage for parser state checkpoints.
#[derive(Clone, Default)]
pub struct SharedMap<K, V>(Rc<FxHashMap<K, V>>);

impl<K, V> SharedMap<K, V> {
    #[cfg(test)]
    pub(crate) fn strong_count(&self) -> usize {
        Rc::strong_count(&self.0)
    }
}

impl<K, V> Deref for SharedMap<K, V> {
    type Target = FxHashMap<K, V>;

    fn deref(&self) -> &Self::Target {
        self.0.as_ref()
    }
}

impl<K, V> DerefMut for SharedMap<K, V>
where
    K: Eq + Hash + Clone,
    V: Clone,
{
    fn deref_mut(&mut self) -> &mut Self::Target {
        Rc::make_mut(&mut self.0)
    }
}

impl<K, V> fmt::Debug for SharedMap<K, V>
where
    K: fmt::Debug,
    V: fmt::Debug,
{
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        self.0.fmt(f)
    }
}

#[derive(Clone, Default, Debug)]
pub struct State {
    pub labels: SharedVec<Atom>,
    /// Start position of an assignment expression.
    pub potential_arrow_start: Option<BytePos>,
    /// Start position of an AST node and the span of its trailing comma.
    pub trailing_commas: SharedMap<BytePos, Span>,
}

#[cfg(test)]
impl State {
    pub(crate) fn labels_ref_count(&self) -> usize {
        self.labels.strong_count()
    }

    pub(crate) fn trailing_commas_ref_count(&self) -> usize {
        self.trailing_commas.strong_count()
    }
}

pub struct WithState<'w, I: Tokens> {
    pub(super) inner: &'w mut Parser<I>,
    pub(super) orig_state: State,
}

impl<I: Tokens> Deref for WithState<'_, I> {
    type Target = Parser<I>;

    fn deref(&self) -> &Parser<I> {
        self.inner
    }
}
impl<I: Tokens> DerefMut for WithState<'_, I> {
    fn deref_mut(&mut self) -> &mut Parser<I> {
        self.inner
    }
}

impl<I: Tokens> Drop for WithState<'_, I> {
    fn drop(&mut self) {
        std::mem::swap(self.inner.state_mut(), &mut self.orig_state);
    }
}
