#![allow(clippy::too_many_arguments)]

use std::mem::{transmute_copy, ManuallyDrop};

#[cfg(feature = "concurrent-renamer")]
use rayon::prelude::*;
use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::{js_word, JsWord};
use swc_common::{collections::AHashMap, util::take::Take, SyntaxContext};
use swc_ecma_ast::*;
use tracing::debug;

use crate::rename::Renamer;

#[derive(Debug, Default)]
pub(crate) struct Scope {
    pub(super) data: ScopeData,

    pub(super) children: Vec<Scope>,
}

/// [JsWord] without clone or drop. This is unsafe and creator should ensure
/// that [JsWord] stored in this type is not dropped until all operations are
/// finished.
#[repr(transparent)]
#[derive(Debug, Default, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub(crate) struct FastJsWord(ManuallyDrop<JsWord>);

impl Clone for FastJsWord {
    fn clone(&self) -> Self {
        unsafe { Self(ManuallyDrop::new(transmute_copy(&self.0))) }
    }
}

impl FastJsWord {
    pub fn new(src: JsWord) -> Self {
        FastJsWord(ManuallyDrop::new(src))
    }

    pub fn into_inner(self) -> JsWord {
        ManuallyDrop::into_inner(self.0)
    }
}

pub(crate) type FastId = (FastJsWord, SyntaxContext);

pub(crate) type RenameMap = AHashMap<FastId, JsWord>;

pub(crate) type ReverseMap = FxHashMap<JsWord, Vec<FastId>>;

#[derive(Debug, Default)]
pub(super) struct ScopeData {
    /// This is add-only.
    ///
    /// If the add-only contraint is violated, it is very likely to be a bug,
    /// because we merge every items in children to current scope.
    all: FxHashSet<FastId>,

    queue: Vec<Id>,
}

impl Scope {
    pub(super) fn add_decl(&mut self, id: &Id) {
        if id.0 == js_word!("arguments") {
            return;
        }

        self.data.all.insert(fast_id(id.clone()));
        if !self.data.queue.contains(id) {
            self.data.queue.push(id.clone());
        }
    }

    pub(super) fn add_usage(&mut self, id: &Id) {
        if id.0 == js_word!("arguments") {
            return;
        }

        self.data.all.insert(fast_id(id.clone()));
    }

    /// Copy `children.data.all` to `self.data.all`.
    pub(crate) fn prepare_renaming(&mut self) {
        self.children.iter_mut().for_each(|child| {
            child.prepare_renaming();

            self.data.all.extend(child.data.all.iter().cloned());
        });
    }

    pub(crate) fn rename_in_normal_mode<R>(
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

        self.rename_one_scope_in_normal_mode(
            renamer,
            to,
            previous,
            reverse,
            queue,
            preserved_symbols,
        );

        for child in &mut self.children {
            child.rename_in_normal_mode(
                renamer,
                to,
                &Default::default(),
                reverse,
                preserved_symbols,
            );
        }
    }

    fn rename_one_scope_in_normal_mode<R>(
        &self,
        renamer: &R,
        to: &mut RenameMap,
        previous: &RenameMap,
        reverse: &mut ReverseMap,
        queue: Vec<Id>,
        preserved_symbols: &FxHashSet<JsWord>,
    ) where
        R: Renamer,
    {
        let mut n = 0;

        for id in queue {
            let fid = fast_id(id.clone());
            if to.get(&fid).is_some() || previous.get(&fid).is_some() {
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

                    let fid = fast_id(id);
                    to.insert(fid.clone(), sym.clone());
                    reverse.entry(sym).or_default().push(fid);

                    break;
                }
            }
        }
    }

    fn can_rename(&self, id: &Id, symbol: &JsWord, reverse: &ReverseMap) -> bool {
        // We can optimize this
        // We only need to check the current scope and parents (ignoring `a` generated
        // for unrelated scopes)
        if let Some(lefts) = reverse.get(symbol) {
            for left in lefts {
                if left.1 == id.1 && *left.0 .0 == id.0 {
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
    pub(crate) fn rename_in_mangle_mode<R>(
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

        self.rename_one_scope_in_mangle_mode(
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
                    child.rename_in_mangle_mode(
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
            child.rename_in_mangle_mode(
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

    fn rename_one_scope_in_mangle_mode<R>(
        &self,
        renamer: &R,
        to: &mut RenameMap,
        previous: &RenameMap,
        reverse: &mut ReverseMap,
        queue: Vec<Id>,
        preserved: &FxHashSet<Id>,
        preserved_symbols: &FxHashSet<JsWord>,
    ) where
        R: Renamer,
    {
        let mut n = 0;

        for id in queue {
            let fid = fast_id(id.clone());
            if preserved.contains(&id) || to.get(&fid).is_some() || previous.get(&fid).is_some() {
                continue;
            }

            loop {
                let sym = renamer.new_name_for(&id, &mut n);

                // TODO: Use base54::decode
                if preserved_symbols.contains(&sym) {
                    continue;
                }

                if self.can_rename(&id, &sym, reverse) {
                    #[cfg(debug_assertions)]
                    {
                        debug!("mangle: `{}{:?}` -> {}", id.0, id.1, sym);
                    }

                    let fid = fast_id(id.clone());
                    to.insert(fid.clone(), sym.clone());
                    reverse.entry(sym).or_default().push(fid.clone());
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

fn fast_id(id: Id) -> FastId {
    (FastJsWord::new(id.0), id.1)
}
