use std::{
    collections::{hash_map, HashMap},
    hash::{BuildHasher, Hash},
};

use crate::join;

pub fn merge_in_parallel<T: Merge>(mut items: Vec<T>) -> T {
    assert!(!items.is_empty());

    if items.len() == 1 {
        return items.into_iter().next().unwrap();
    }

    let b = items.split_off(items.len() / 2);

    let (mut a, b) = join(
        move || merge_in_parallel(items),
        move || merge_in_parallel(b),
    );

    a.merge(b);

    a
}

/// Used to merge in parallel.
pub trait Merge: Send {
    fn merge(&mut self, other: Self);
}

impl<K, V, S> Merge for HashMap<K, V, S>
where
    Self: Send,
    K: Hash + Eq,
    V: Merge,
    S: BuildHasher,
{
    fn merge(&mut self, other: Self) {
        self.reserve(other.len());

        for (k, val) in other {
            match self.entry(k) {
                hash_map::Entry::Occupied(mut o) => o.get_mut().merge(val),
                hash_map::Entry::Vacant(v) => {
                    v.insert(val);
                }
            }
        }
    }
}

#[cfg(feature = "indexmap")]
impl<K, V, S> Merge for indexmap::IndexMap<K, V, S>
where
    Self: Send,
    K: Eq + Hash,
    V: Merge,
    S: BuildHasher,
{
    fn merge(&mut self, other: Self) {
        self.reserve(other.len());

        for (k, v) in other {
            match self.entry(k) {
                indexmap::map::Entry::Occupied(mut e) => {
                    e.get_mut().merge(v);
                }
                indexmap::map::Entry::Vacant(e) => {
                    e.insert(v);
                }
            }
        }
    }
}
