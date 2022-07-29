#![allow(clippy::too_many_arguments)]

#[cfg(feature = "concurrent-renamer")]
use rayon::prelude::*;
use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::{js_word, JsWord};
use swc_common::{collections::AHashMap, util::take::Take, SyntaxContext};
use swc_ecma_ast::*;

use super::fast::{JsWordIndex, JsWordList};
use crate::rename::Renamer;

#[derive(Debug, Default)]
pub(crate) struct Scope {
    pub(super) data: ScopeData,

    pub(super) children: Vec<Scope>,
}

pub(crate) type FastJsWord = JsWordIndex;

pub(crate) type FastId = (FastJsWord, SyntaxContext);

pub(crate) type RenameMap = AHashMap<FastId, JsWord>;

pub(crate) type ReverseMap = FxHashMap<JsWord, Vec<FastId>>;

#[derive(Debug, Default)]
pub(super) struct ScopeData {
    storage: JsWordList,

    /// This is add-only.
    ///
    /// If the add-only contraint is violated, it is very likely to be a bug,
    /// because we merge every items in children to current scope.
    all: FxHashSet<FastId>,

    queue: Vec<FastId>,
}

impl Scope {
    pub(super) fn add_decl(&mut self, id: &Id) {
        if id.0 == js_word!("arguments") {
            return;
        }

        let id = self.data.storage.id(id);

        self.data.all.insert(id);
        if !self.data.queue.contains(&id) {
            self.data.queue.push(id.clone());
        }
    }

    pub(super) fn add_usage(&mut self, id: &Id) {
        if id.0 == js_word!("arguments") {
            return;
        }

        let id = self.data.storage.id(id);

        self.data.all.insert(id);
    }

    pub(crate) fn get_words(&mut self) -> &mut JsWordList {
        &mut self.data.storage
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
        to: &mut RenameMap,
        previous: &RenameMap,
        reverse: &mut ReverseMap,
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
        to: &mut RenameMap,
        previous: &RenameMap,
        reverse: &mut ReverseMap,
        queue: Vec<FastId>,
        preserved_symbols: &FxHashSet<JsWord>,
    ) where
        R: Renamer,
    {
        let mut n = 0;

        for id in queue {
            if to.get(&id).is_some() || previous.get(&id).is_some() {
                continue;
            }
            let orig_id = self.data.storage.get_id(id);

            if R::RESET_N {
                n = 0;
            }

            loop {
                let sym = renamer.new_name_for(&orig_id, &mut n);

                if preserved_symbols.contains(&sym) {
                    continue;
                }

                if self.can_rename(&id, &sym, reverse) {
                    to.insert(id.clone(), sym.clone());
                    reverse.entry(sym).or_default().push(id);

                    break;
                }
            }
        }
    }

    fn can_rename(&self, id: &FastId, symbol: &JsWord, reverse: &ReverseMap) -> bool {
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

    #[cfg_attr(not(feature = "concurrent-renamer"), allow(unused))]
    pub(crate) fn rename_parallel<R>(
        &mut self,
        renamer: &R,
        to: &mut RenameMap,
        previous: &RenameMap,
        reverse: &ReverseMap,
        preserved: &FxHashSet<Id>,
        preserved_symbols: &FxHashSet<JsWord>,
        parallel: bool,
    ) where
        R: Renamer,
    {
        let queue = self.data.queue.take();

        let mut cloned_reverse = reverse.clone();

        self.rename_one_scope_parallel(
            renamer,
            to,
            previous,
            &mut cloned_reverse,
            queue,
            preserved,
            preserved_symbols,
        );

        #[cfg(feature = "concurrent-renamer")]
        if parallel {
            #[cfg(not(target_arch = "wasm32"))]
            let iter = self.children.par_iter_mut();
            #[cfg(target_arch = "wasm32")]
            let iter = self.children.iter_mut();

            let iter = iter
                .map(|child| {
                    use std::collections::HashMap;

                    let mut new_map = HashMap::default();
                    child.rename_parallel(
                        renamer,
                        &mut new_map,
                        to,
                        &cloned_reverse,
                        preserved,
                        preserved_symbols,
                        parallel,
                    );
                    new_map
                })
                .collect::<Vec<_>>();

            for (k, v) in iter.into_iter().flatten() {
                to.entry(k).or_insert(v);
            }
            return;
        }

        for child in &mut self.children {
            child.rename_parallel(
                renamer,
                to,
                &Default::default(),
                &cloned_reverse,
                preserved,
                preserved_symbols,
                parallel,
            );
        }
    }

    fn rename_one_scope_parallel<R>(
        &self,
        renamer: &R,
        to: &mut RenameMap,
        previous: &RenameMap,
        reverse: &mut ReverseMap,
        queue: Vec<FastId>,
        preserved: &FxHashSet<Id>,
        preserved_symbols: &FxHashSet<JsWord>,
    ) where
        R: Renamer,
    {
        let mut n = 0;

        for id in queue {
            if to.get(&id).is_some() || previous.get(&id).is_some() {
                continue;
            }

            let orig_id = self.data.storage.get_id(id);

            if preserved.contains(&orig_id) {
                continue;
            }

            loop {
                let sym = renamer.new_name_for(&orig_id, &mut n);

                // TODO: Use base54::decode
                if preserved_symbols.contains(&sym) {
                    continue;
                }

                if self.can_rename(&id, &sym, reverse) {
                    to.insert(id, sym.clone());
                    reverse.entry(sym).or_default().push(id);
                    // self.data.decls.remove(&id);
                    // self.data.usages.remove(&id);

                    break;
                }
            }
        }
    }

    pub fn rename_cost(&self) -> usize {
        let children = &self.children;
        self.data.queue.len() + children.iter().map(|v| v.rename_cost()).sum::<usize>()
    }
}
