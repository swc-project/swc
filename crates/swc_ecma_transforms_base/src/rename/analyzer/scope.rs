use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::{js_word, JsWord};
use swc_common::{collections::AHashMap, util::take::Take};
use swc_ecma_ast::*;
use tracing::debug;

use crate::rename::Renamer;

#[derive(Debug, Default)]
pub(crate) struct Scope {
    pub(super) data: ScopeData,

    pub(super) children: Vec<Scope>,
}

#[derive(Debug, Default)]
pub(super) struct ScopeData {
    /// This is add-only.
    ///
    /// If the add-only contraint is violated, it is very likely to be a bug,
    /// because we merge every items in children to current scope.
    all: FxHashSet<Id>,

    queue: Vec<Id>,
}

impl Scope {
    pub(super) fn add_decl(&mut self, id: &Id) {
        if id.0 == js_word!("arguments") {
            return;
        }

        self.data.all.insert(id.clone());
        if !self.data.queue.contains(id) {
            self.data.queue.push(id.clone());
        }
    }

    pub(super) fn add_usage(&mut self, id: &Id) {
        if id.0 == js_word!("arguments") {
            return;
        }

        self.data.all.insert(id.clone());
    }

    /// Copy `children.data.all` to `self.data.all`.
    pub(crate) fn prepare_renaming(&mut self) {
        self.children.iter_mut().for_each(|child| {
            child.prepare_renaming();

            self.data.all.extend(child.data.all.iter().cloned());
        });
    }

    pub(crate) fn rename_single_thread<R>(
        &mut self,
        renamer: &R,
        to: &mut AHashMap<Id, JsWord>,
        previous: &AHashMap<Id, JsWord>,
        reverse: &mut FxHashMap<JsWord, Vec<Id>>,
        preserved_symbols: &FxHashSet<JsWord>,
    ) where
        R: Renamer,
    {
        let queue = self.data.queue.take();

        // let mut cloned_reverse = reverse.clone();

        self.rename_one_scope_single_thread(
            renamer,
            to,
            previous,
            reverse,
            queue,
            preserved_symbols,
        );

        for child in &mut self.children {
            child.rename_single_thread(
                renamer,
                to,
                &Default::default(),
                reverse,
                preserved_symbols,
            );
        }
    }

    fn rename_one_scope_single_thread<R>(
        &self,
        renamer: &R,
        to: &mut AHashMap<Id, JsWord>,
        previous: &AHashMap<Id, JsWord>,
        reverse: &mut FxHashMap<JsWord, Vec<Id>>,
        queue: Vec<Id>,
        preserved_symbols: &FxHashSet<JsWord>,
    ) where
        R: Renamer,
    {
        let mut n = 0;

        for id in queue {
            if to.get(&id).is_some() || previous.get(&id).is_some() {
                continue;
            }

            if R::RESET_N {
                n = 0;
            }

            loop {
                let sym = renamer.new_name_for(&id, &mut n);

                if preserved_symbols.contains(&sym) {
                    continue;
                }

                if self.can_rename(&id, &sym, reverse) {
                    if cfg!(debug_assertions) {
                        debug!("Renaming `{}{:?}` to `{}`", id.0, id.1, sym);
                    }

                    to.insert(id.clone(), sym.clone());
                    reverse.entry(sym).or_default().push(id.clone());

                    break;
                }
            }
        }
    }

    fn can_rename(&self, id: &Id, symbol: &JsWord, reverse: &FxHashMap<JsWord, Vec<Id>>) -> bool {
        // We can optimize this
        // We only need to check the current scope and parents (ignoring `a` generated
        // for unrelated scopes)
        if let Some(lefts) = reverse.get(symbol) {
            for left in lefts {
                if *left == *id {
                    continue;
                }

                if self.data.all.contains(left) {
                    return false;
                }
            }
        }

        true
    }
}
