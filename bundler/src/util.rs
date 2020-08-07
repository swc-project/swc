use fxhash::FxBuildHasher;
use std::hash::Hash;
use swc_common::{Span, SyntaxContext};
use swc_ecma_visit::Fold;

#[derive(Debug)]
pub(crate) struct Map<K, V>
where
    K: Eq + Hash,
{
    #[cfg(feature = "concurrent")]
    inner: dashmap::DashMap<K, V, FxBuildHasher>,
    #[cfg(not(feature = "concurrent"))]
    inner: std::cell::RefCell<std::collections::HashMap<K, V, FxBuildHasher>>,
}

impl<K, V> Default for Map<K, V>
where
    K: Eq + Hash,
{
    fn default() -> Self {
        Self {
            inner: Default::default(),
        }
    }
}

impl<K, V> Map<K, V>
where
    K: Eq + Hash,
{
    pub fn get(&self, k: &K) -> Option<&V> {
        if let Some(v) = self.inner.get(k) {
            Some(v.value())
        } else {
            None
        }
    }

    pub fn insert(&self, k: K, v: V) {
        self.inner.insert(k, v);
    }
}

pub struct HygieneRemover;

impl Fold for HygieneRemover {
    fn fold_span(&mut self, s: Span) -> Span {
        s.with_ctxt(SyntaxContext::empty())
    }
}
