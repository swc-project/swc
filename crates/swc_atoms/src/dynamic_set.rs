use std::{
    cell::RefCell,
    sync::{atomic, Arc},
};

use rustc_hash::FxHashSet;

thread_local!(pub(super) static DYNAMIC_SET: RefCell<DynSet> = Default::default());

/// Thread-local interner for atoms.
pub(super) struct DynSet {
    /// hashbrown has better logic for collision resolution.
    inner: FxHashSet<Entry>,
}

impl Default for DynSet {
    fn default() -> Self {
        Self {
            inner: FxHashSet::with_capacity_and_hasher(512, Default::default()),
        }
    }
}

impl DynSet {
    // pub(super) fn intern(&mut self, s: &str) -> Arc<str> {}
}

struct Entry {
    ref_count: atomic::AtomicUsize,
}
