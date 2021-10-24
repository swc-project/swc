use std::cell::RefCell;
use swc_atoms::JsWord;
use swc_common::collections::AHashSet;
use swc_ecma_utils::Id;

#[derive(Debug, Default)]
pub(super) struct Scope<'a> {
    pub parent: Option<&'a Scope<'a>>,

    pub data: ScopeData,
}

#[derive(Debug, Default)]
pub struct ScopeData {
    direct_decls: RefCell<AHashSet<Id>>,
    decls: RefCell<AHashSet<Id>>,

    n: usize,

    /// Usages in current scope.
    direct_usages: RefCell<AHashSet<Id>>,
    usages: RefCell<AHashSet<Id>>,

    queue: RefCell<Vec<Id>>,
}

impl Scope<'_> {
    pub fn add_decl(&mut self, id: &Id) {
        self.add_decl_inner(true, id);
    }

    fn add_decl_inner(&self, is_direct: bool, id: &Id) {
        if is_direct {
            {
                let mut b = self.data.queue.borrow_mut();
                if !b.contains(id) {
                    b.push(id.clone());
                }
            }

            self.data.direct_decls.borrow_mut().insert(id.clone());
        }

        match self.parent {
            Some(s) => s.add_decl_inner(false, id),
            None => {}
        }
    }

    pub fn add_usage(&mut self, id: &Id) {
        self.add_usage_inner(true, id);
    }

    fn add_usage_inner(&self, is_direct: bool, id: &Id) {
        if is_direct {
            self.data.direct_usages.borrow_mut().insert(id.clone());
        }

        match self.parent {
            Some(s) => s.add_usage_inner(false, id),
            None => {}
        }
    }
}
