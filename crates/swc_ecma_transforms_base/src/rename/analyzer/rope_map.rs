use rustc_hash::FxHashMap;

#[derive(Debug, Clone)]
pub(super) struct RopeMap<K, V> {
    inner: Vec<FxHashMap<K, V>>,
}

impl<K, V> Default for RopeMap<K, V> {
    fn default() -> Self {
        Self {
            inner: Default::default(),
        }
    }
}
