use rustc_hash::FxHashMap;

use super::scope::{FastId, FastJsWord};

#[derive(Debug)]
pub(super) struct ReverseMap {
    inner: Vec<FxHashMap<FastJsWord, Vec<FastId>>>,
}

impl Default for ReverseMap {
    fn default() -> Self {
        Self {
            inner: vec![Default::default()],
        }
    }
}

impl ReverseMap {
    pub fn push_entry(&mut self, key: FastJsWord, id: FastId) {
        let map = self.inner.last_mut().unwrap();
        map.entry(key).or_default().push(id);
    }
}
