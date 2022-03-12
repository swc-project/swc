use rustc_hash::FxHashSet;
use swc_atoms::{js_word, JsWord};
use swc_common::util::take::Take;
use swc_ecma_utils::Id;

use crate::{pass::mangle_names::rename_map::RenameMap, util::base54};

#[derive(Debug, Default)]
pub(crate) struct Scope {
    pub data: ScopeData,

    pub children: Vec<Scope>,
}

#[derive(Debug, Default)]
pub struct ScopeData {
    /// This is add-only.
    ///
    /// If the add-only contraint is violated, it is very likely to be a bug,
    /// because we merge every items in children to current scope.
    all: FxHashSet<Id>,

    queue: Vec<(Id, u32)>,
}

impl Scope {
    pub(super) fn add_decl(&mut self, id: &Id) {
        if id.0 == js_word!("arguments") {
            return;
        }

        // self.data.decls.insert(id.clone());
        self.data.all.insert(id.clone());
        {
            if let Some((_, cnt)) = self.data.queue.iter_mut().find(|(i, _)| *i == *id) {
                *cnt += 1;
            } else {
                self.data.queue.push((id.clone(), 1));
            }
        }
    }

    pub(super) fn add_usage(&mut self, id: &Id) {
        if id.0 == js_word!("arguments") {
            return;
        }

        if let Some((_, cnt)) = self.data.queue.iter_mut().find(|(i, _)| *i == *id) {
            *cnt += 1;
        }

        // self.data.usages.insert(id.clone());
        self.data.all.insert(id.clone());
    }

    /// Copy `children.data.all` to `self.data.all`.
    pub(super) fn prepare_renaming(&mut self) {
        self.children.iter_mut().for_each(|child| {
            child.prepare_renaming();

            self.data.all.extend(child.data.all.iter().cloned());
        });
    }

    pub(super) fn rename(
        &mut self,
        to: &mut RenameMap,
        preserved: &FxHashSet<Id>,
        preserved_symbols: &FxHashSet<JsWord>,
    ) {
        let mut n = 0;
        let mut queue = self.data.queue.take();
        queue.sort_by(|a, b| b.1.cmp(&a.1));

        for (id, cnt) in queue {
            if cnt == 0 || preserved.contains(&id) {
                continue;
            }

            loop {
                let sym = base54::encode(&mut n, true);

                let sym: JsWord = sym.into();

                // TODO: Use base54::decode
                if preserved_symbols.contains(&sym) {
                    continue;
                }

                if self.can_rename(&id, &sym, to) {
                    to.insert(id.clone(), sym);
                    // self.data.decls.remove(&id);
                    // self.data.usages.remove(&id);

                    break;
                }
            }
        }

        for child in self.children.iter_mut() {
            child.rename(to, preserved, preserved_symbols);
        }
    }

    #[inline]
    fn can_rename(&self, id: &Id, symbol: &JsWord, renamed: &RenameMap) -> bool {
        if let Some(lefts) = renamed.get_by_right(symbol) {
            for left in lefts {
                if *left == *id {
                    continue;
                }

                //
                // if self.data.usages.contains(left) || self.data.decls.contains(left) {
                //     return false;
                // }

                if self.data.all.contains(left) {
                    return false;
                }
            }
        }

        true
    }
}
