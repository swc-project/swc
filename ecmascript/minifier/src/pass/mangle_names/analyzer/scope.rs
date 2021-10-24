use std::cell::RefCell;
use swc_atoms::JsWord;
use swc_common::{
    collections::{AHashMap, AHashSet},
    util::take::Take,
};
use swc_ecma_utils::Id;

use crate::util::base54::incr_base54;

#[derive(Debug, Default)]
pub(crate) struct Scope {
    pub data: ScopeData,

    pub children: Vec<Scope>,
}

#[derive(Debug, Default)]
pub struct ScopeData {
    decls: RefCell<AHashSet<Id>>,

    /// Usages in current scope.
    usages: RefCell<AHashSet<Id>>,

    queue: RefCell<Vec<Id>>,
}

impl Scope {
    pub(super) fn add_decl(&mut self, id: &Id) {
        self.data.decls.get_mut().insert(id.clone());
        {
            let b = self.data.queue.get_mut();
            if !b.contains(id) {
                b.push(id.clone());
            }
        }
    }

    pub(super) fn add_usage(&mut self, id: &Id) {
        self.data.usages.get_mut().insert(id.clone());
    }

    pub(super) fn rename(&mut self, to: &mut AHashMap<Id, JsWord>) {
        let mut n = 0;
        for id in self.data.queue.get_mut().take() {
            loop {
                let (_, sym) = incr_base54(&mut n);

                let sym: JsWord = sym.into();

                if self.can_rename(&id, &sym, &to) {
                    to.insert(id.clone(), sym.clone());
                    break;
                }
            }
        }

        for child in self.children.iter_mut() {
            child.rename(to);
        }
    }

    fn can_rename(&self, id: &Id, symbol: &JsWord, renamed: &AHashMap<Id, JsWord>) -> bool {
        for used_id in self
            .data
            .usages
            .borrow()
            .iter()
            .chain(self.data.decls.borrow().iter())
        {
            if *used_id == *id {
                continue;
            }

            if let Some(renamed_id) = renamed.get(used_id) {
                if renamed_id == symbol {
                    return false;
                }
            }
        }

        for c in self.children.iter() {
            if !c.can_rename(id, symbol, renamed) {
                return false;
            }
        }

        true
    }
}
