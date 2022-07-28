use std::cell::RefCell;

use rustc_hash::FxHashSet;

thread_local!(static LOCAL_SET: RefCell<Set> = Default::default());

pub(super) struct Set {
    /// hashbrown has better logic for collision resolution.
    inner: FxHashSet<Entry>,
}

impl Default for Set {
    fn default() -> Self {
        Self {
            inner: FxHashSet::with_capacity_and_hasher(256, Default::default()),
        }
    }
}

struct Entry {}
