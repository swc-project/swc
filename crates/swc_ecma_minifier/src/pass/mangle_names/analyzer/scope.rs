use swc_atoms::{js_word, JsWord};
use swc_common::{collections::AHashSet, util::take::Take};
use swc_ecma_utils::Id;

use crate::pass::{compute_char_freq::CharFreqInfo, mangle_names::rename_map::RenameMap};

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
        f: &CharFreqInfo,
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
                let (_, sym) = f.incr_base54(&mut n);

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
            child.rename(f, to, preserved, preserved_symbols);
        }
    }

    fn can_rename(&self, id: &Id, symbol: &JsWord, renamed: &RenameMap) -> bool {
        if let Some(lefts) = renamed.get_by_right(symbol) {
            for left in lefts {
                if *left == *id {
                    continue;
                }

                //
                if self.data.usages.contains(left) || self.data.decls.contains(left) {
                    return false;
                }
            }
        }

        self.children
            .iter()
            .all(|c| c.can_rename(id, symbol, renamed))
    }
}
