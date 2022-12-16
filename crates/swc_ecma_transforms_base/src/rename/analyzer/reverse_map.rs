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

    fn iter(&self) -> Iter {
        Iter { cur: Some(self) }
    }

    pub fn get<'a>(&'a self, key: &'a FastJsWord) -> impl Iterator<Item = &'a FastId> + 'a {
        self.iter()
            .filter_map(|v| v.inner.get(key))
            .flat_map(|v| v.iter())
    }

    pub fn next(&self) -> ReverseMap {
        ReverseMap {
            prev: Some(self),
            ..Default::default()
        }
    }
}

pub(crate) struct Iter<'a> {
    cur: Option<&'a ReverseMap<'a>>,
}

impl<'a> Iterator for Iter<'a> {
    type Item = &'a ReverseMap<'a>;

    fn next(&mut self) -> Option<Self::Item> {
        let cur = self.cur.take()?;
        self.cur = cur.prev;
        Some(cur)
    }
}
