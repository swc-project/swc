use std::hash::Hash;
use swc_common::{Span, SyntaxContext};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut};

#[derive(Debug)]
pub(crate) struct CloneMap<K, V>
where
    K: Eq + Hash,
    V: Clone,
{
    #[cfg(feature = "concurrent")]
    inner: dashmap::DashMap<K, V>,
    #[cfg(not(feature = "concurrent"))]
    inner: std::cell::RefCell<std::collections::HashMap<K, V>>,
}

impl<K, V> Default for CloneMap<K, V>
where
    K: Eq + Hash,
    V: Clone,
{
    fn default() -> Self {
        Self {
            inner: Default::default(),
        }
    }
}

impl<K, V> CloneMap<K, V>
where
    K: Eq + Hash,
    V: Clone,
{
    #[cfg(feature = "concurrent")]
    pub fn get(&self, k: &K) -> Option<V> {
        if let Some(v) = self.inner.get(k) {
            Some(v.value().clone())
        } else {
            None
        }
    }

    #[cfg(not(feature = "concurrent"))]
    pub fn get(&self, k: &K) -> Option<V> {
        if let Some(v) = self.inner.borrow().get(k) {
            Some(v.clone())
        } else {
            None
        }
    }

    #[cfg(feature = "concurrent")]
    pub fn insert(&self, k: K, v: V) {
        self.inner.insert(k, v);
    }

    #[cfg(not(feature = "concurrent"))]
    pub fn insert(&self, k: K, v: V) {
        self.inner.borrow_mut().insert(k, v);
    }
}

pub(crate) struct HygieneRemover;

impl VisitMut for HygieneRemover {
    noop_visit_mut_type!();

    fn visit_mut_span(&mut self, s: &mut Span) {
        *s = s.with_ctxt(SyntaxContext::empty())
    }
}

#[cfg(feature = "rayon")]
pub(crate) use rayon::join;

#[cfg(not(feature = "rayon"))]
pub(crate) fn join<A, B, RA, RB>(oper_a: A, oper_b: B) -> (RA, RB)
where
    A: FnOnce() -> RA,
    B: FnOnce() -> RB,
{
    (oper_a(), oper_b())
}

#[cfg(feature = "rayon")]
pub(crate) use rayon::iter::IntoParallelIterator;

/// Fake trait
#[cfg(not(feature = "rayon"))]
pub(crate) trait IntoParallelIterator: Sized + IntoIterator {
    fn into_par_iter(self) -> <Self as IntoIterator>::IntoIter {
        self.into_iter()
    }
}

#[cfg(not(feature = "rayon"))]
impl<T> IntoParallelIterator for T where T: IntoIterator {}
