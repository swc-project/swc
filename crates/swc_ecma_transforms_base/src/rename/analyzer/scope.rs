#![allow(clippy::too_many_arguments)]

use std::{
    fmt::{Display, Formatter},
    mem::{transmute_copy, ManuallyDrop},
};

#[cfg(feature = "concurrent-renamer")]
use rayon::prelude::*;
use rustc_hash::FxHashSet;
use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, util::take::Take, Mark, SyntaxContext};
use swc_ecma_ast::*;
use tracing::debug;

use super::reverse_map::ReverseMap;
use crate::rename::Renamer;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) enum ScopeKind {
    Fn,
    Block,
}

impl Default for ScopeKind {
    fn default() -> Self {
        Self::Fn
    }
}

#[derive(Debug, Default)]
pub(crate) struct Scope {
    pub(super) kind: ScopeKind,
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

impl Display for FastJsWord {
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        Display::fmt(&*self.0, f)
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

#[derive(Debug, Default)]
pub(super) struct ScopeData {
    /// All identifiers used by this scope or children.
    ///
    /// This is add-only.
    ///
    /// If the add-only contraint is violated, it is very likely to be a bug,
    /// because we merge every items in children to current scope.
    all: FxHashSet<FastId>,

    queue: Vec<Id>,
}

impl Scope {
    pub(super) fn add_decl(&mut self, id: &Id, has_eval: bool, top_level_mark: Mark) {
        if id.0 == "arguments" {
            return;
        }

        let fid = fast_id(id.clone());

        self.data.all.insert(fid);

        if !self.data.queue.contains(id) {
            if has_eval && id.1.outer().is_descendant_of(top_level_mark) {
                return;
            }

            self.data.queue.push(id.clone());
        }
    }

    pub(super) fn add_usage(&mut self, id: Id) {
        if id.0 == "arguments" {
            return;
        }

        self.data.all.insert(fast_id(id));
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
            if to.get(&fid).is_some() || previous.get(&fid).is_some() || id.0 == "eval" {
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
                let sym = FastJsWord::new(sym);

                if self.can_rename(&id, &sym, reverse) {
                    if cfg!(debug_assertions) {
                        debug!("Renaming `{}{:?}` to `{}`", id.0, id.1, sym);
                    }

                    let fid = fast_id(id);
                    reverse.push_entry(sym.clone(), fid.clone());
                    to.insert(fid, sym.into_inner());

                    break;
                }
            }
        }
    }

    fn can_rename(&self, id: &Id, symbol: &FastJsWord, reverse: &ReverseMap) -> bool {
        // We can optimize this
        // We only need to check the current scope and parents (ignoring `a` generated
        // for unrelated scopes)
        for left in reverse.get(symbol) {
            if left.1 == id.1 && *left.0 .0 == id.0 {
                continue;
            }

            if self.data.all.contains(left) {
                return false;
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

        let mut cloned_reverse = reverse.next();

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
            if preserved.contains(&id)
                || to.get(&fid).is_some()
                || previous.get(&fid).is_some()
                || id.0 == "eval"
            {
                continue;
            }

            loop {
                let sym = renamer.new_name_for(&id, &mut n);

                // TODO: Use base54::decode
                if preserved_symbols.contains(&sym) {
                    continue;
                }

                let sym = FastJsWord::new(sym);

                if self.can_rename(&id, &sym, reverse) {
                    #[cfg(debug_assertions)]
                    {
                        debug!("mangle: `{}{:?}` -> {}", id.0, id.1, sym);
                    }

                    let fid = fast_id(id.clone());
                    reverse.push_entry(sym.clone(), fid.clone());
                    to.insert(fid.clone(), sym.into_inner());
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
