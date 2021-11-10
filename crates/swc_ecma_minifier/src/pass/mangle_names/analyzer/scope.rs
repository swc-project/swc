use crate::util::base54::incr_base54;
use rayon::prelude::*;
use swc_atoms::{js_word, JsWord};
use swc_common::{
    collections::{AHashMap, AHashSet},
    util::take::Take,
};
use swc_ecma_utils::Id;

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
        to: &mut AHashMap<Id, JsWord>,
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

                if self.can_rename(&id, &sym, &to) {
                    to.insert(id.clone(), sym.clone());
                    break;
                }
            }
        }

        for child in self.children.iter_mut() {
            child.rename(to, preserved, preserved_symbols);
        }
    }

    fn can_rename(&self, id: &Id, symbol: &JsWord, renamed: &AHashMap<Id, JsWord>) -> bool {
        if cfg!(target_arch = "wasm32")
            || self
                .data
                .usages
                .iter()
                .chain(self.data.decls.iter())
                .count()
                <= 64
        {
            for used_id in self.data.usages.iter().chain(self.data.decls.iter()) {
                if *used_id == *id {
                    continue;
                }

                if let Some(renamed_id) = renamed.get(used_id) {
                    if renamed_id == symbol {
                        return false;
                    }
                }
            }
        } else {
            if self
                .data
                .usages
                .par_iter()
                .chain(self.data.decls.par_iter())
                .any(|used_id| {
                    if *used_id == *id {
                        return false;
                    }

                    if let Some(renamed_id) = renamed.get(used_id) {
                        if renamed_id == symbol {
                            return true;
                        }
                    }

                    false
                })
            {
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
