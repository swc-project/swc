#![allow(clippy::too_many_arguments)]

use std::{
    fmt::{Display, Formatter},
    mem::{transmute_copy, ManuallyDrop},
};

#[cfg(feature = "concurrent-renamer")]
use rayon::prelude::*;
use rustc_hash::FxHashSet;
use swc_atoms::Atom;
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

pub(crate) type RenameMap = AHashMap<Id, Atom>;

#[derive(Debug, Default)]
pub(super) struct ScopeData {
    /// All identifiers used by this scope or children.
    ///
    /// This is add-only.
    ///
    /// If the add-only contraint is violated, it is very likely to be a bug,
    /// because we merge every items in children to current scope.
    all: FxHashSet<Id>,

    queue: Vec<Id>,
}

impl Scope {
    pub(super) fn add_decl(&mut self, id: &Id, has_eval: bool, top_level_mark: Mark) {
        if id.0 == "arguments" {
            return;
        }

        self.data.all.insert(id.clone());

        if !self.data.queue.contains(id) {
            if has_eval && id.1.outer().is_descendant_of(top_level_mark) {
                return;
            }

            self.data.queue.push(id.clone());
        }
    }

    pub(crate) fn reserve_decl(&mut self, len: usize) {
        self.data.all.reserve(len);

        self.data.queue.reserve(len);
    }

    pub(super) fn add_usage(&mut self, id: Id) {
        if id.0 == "arguments" {
            return;
        }

        self.data.all.insert(id);
    }

    pub(crate) fn reserve_usage(&mut self, len: usize) {
        self.data.all.reserve(len);
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
        preserved_symbols: &FxHashSet<Atom>,
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
        preserved_symbols: &FxHashSet<Atom>,
    ) where
        R: Renamer,
    {
        let mut n = 0;

        for id in queue {
            if to.get(&id).is_some() || previous.get(&id).is_some() || id.0 == "eval" {
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

                    reverse.push_entry(sym.clone(), id.clone());
                    to.insert(id, sym);

                    break;
                }
            }
        }
    }

    fn can_rename(&self, id: &Id, symbol: &Atom, reverse: &ReverseMap) -> bool {
        // We can optimize this
        // We only need to check the current scope and parents (ignoring `a` generated
        // for unrelated scopes)
        for left in reverse.get(symbol) {
            if left.1 == id.1 && *left.0 == id.0 {
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
        preserved_symbols: &FxHashSet<Atom>,
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
            #[cfg(not(all(target_arch = "wasm32", not(target_os = "wasi"))))]
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
        preserved_symbols: &FxHashSet<Atom>,
    ) where
        R: Renamer,
    {
        let mut n = 0;

        for id in queue {
            if preserved.contains(&id)
                || to.get(&id).is_some()
                || previous.get(&id).is_some()
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

                if self.can_rename(&id, &sym, reverse) {
                    #[cfg(debug_assertions)]
                    {
                        debug!("mangle: `{}{:?}` -> {}", id.0, id.1, sym);
                    }

                    reverse.push_entry(sym.clone(), id.clone());
                    to.insert(id.clone(), sym);
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
