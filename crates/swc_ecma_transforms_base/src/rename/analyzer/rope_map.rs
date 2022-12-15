use rustc_hash::FxHashMap;

use super::scope::{FastId, FastJsWord};

#[derive(Debug, Default)]
pub(crate) struct ReverseMap<'a> {
    prev: Option<&'a ReverseMap<'a>>,

    inner: FxHashMap<FastJsWord, Vec<FastId>>,
}

impl ReverseMap<'_> {
    pub fn push_entry(&mut self, key: FastJsWord, id: FastId) {
        self.inner.entry(key).or_default().push(id);
    }

    pub fn get(&self, key: &FastJsWord) -> Vec<FastId> {
        let mut res = vec![];

        let mut cur = Some(self);
        while let Some(c) = cur {
            if let Some(v) = c.inner.get(key) {
                res.extend(v.iter().cloned());
            }

            cur = c.prev;
        }
        res
    }

    pub fn next(&self) -> ReverseMap {
        ReverseMap {
            prev: Some(self),
            ..Default::default()
        }
    }
}
