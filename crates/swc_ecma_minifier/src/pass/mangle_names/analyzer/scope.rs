use bimap::BiHashMap;
use rayon::prelude::*;
use swc_atoms::{js_word, JsWord};
use swc_common::{collections::AHashSet, util::take::Take};
use swc_ecma_utils::Id;

use crate::util::base54::incr_base54;

pub(crate) type RenameMap = BiHashMap<Id, JsWord, ahash::RandomState, ahash::RandomState>;

#[derive(Debug, Default)]
pub(crate) struct Scope {
    pub data: ScopeData,

    pub children: Vec<Scope>,
}

#[derive(Debug, Default)]
pub struct ScopeData {
    decls: AHashSet<Id>,

    /// Usages in current scope.
    usages: AHashSet<Id>,

    queue: Vec<Id>,
}

impl Scope {
    pub(super) fn add_decl(&mut self, id: &Id) {
        if id.0 == js_word!("arguments") {
            return;
        }

        self.data.decls.insert(id.clone());
        {
            if !self.data.queue.contains(id) {
                self.data.queue.push(id.clone());
            }
        }
    }

    pub(super) fn add_usage(&mut self, id: &Id) {
        if id.0 == js_word!("arguments") {
            return;
        }

        self.data.usages.insert(id.clone());
    }

    pub(super) fn rename(
        &mut self,
        to: &mut RenameMap,
        preserved: &AHashSet<Id>,
        preserved_symbols: &AHashSet<JsWord>,
    ) {
        let mut n = 0;
        for id in self.data.queue.take() {
            if preserved.contains(&id) {
                continue;
            }

            loop {
                let (_, sym) = incr_base54(&mut n);

                let sym: JsWord = sym.into();

                if preserved_symbols.contains(&sym) {
                    continue;
                }

                if self.can_rename(&id, &sym, to) {
                    to.insert(id.clone(), sym);
                    break;
                }
            }
        }

        for child in self.children.iter_mut() {
            child.rename(to, preserved, preserved_symbols);
        }
    }

    fn can_rename(&self, id: &Id, symbol: &JsWord, renamed: &RenameMap) -> bool {
        if let Some(left) = renamed.get_by_right(symbol) {
            if *left != *id {
                return false;
            }
        }

        if cfg!(target_arch = "wasm32") {
            for c in self.children.iter() {
                if !c.can_rename(id, symbol, renamed) {
                    return false;
                }
            }

            true
        } else {
            self.children
                .par_iter()
                .all(|c| c.can_rename(id, symbol, renamed))
        }
    }
}
