use std::cell::RefCell;
use swc_atoms::JsWord;
use swc_common::collections::{AHashMap, AHashSet};
use swc_ecma_utils::Id;

#[derive(Debug, Default)]
pub(crate) struct Scope {
    pub data: ScopeData,

    pub children: Vec<Scope>,
}

#[derive(Debug, Default)]
pub struct ScopeData {
    decls: RefCell<AHashSet<Id>>,

    n: usize,

    /// Usages in current scope.
    usages: RefCell<AHashSet<Id>>,

    queue: RefCell<Vec<Id>>,
}

impl Scope {
    pub(super) fn add_decl(&mut self, id: &Id) {
        self.data.decls.get_mut().insert(id.clone());
        {
            let mut b = self.data.queue.get_mut();
            if !b.contains(id) {
                b.push(id.clone());
            }
        }
    }

    pub(super) fn add_usage(&mut self, id: &Id) {
        self.data.usages.get_mut().insert(id.clone());
    }
}
