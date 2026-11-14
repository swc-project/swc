#![allow(clippy::too_many_arguments)]

use std::{hash::BuildHasherDefault, mem::take};

use indexmap::IndexSet;
#[cfg(feature = "concurrent-renamer")]
use par_iter::prelude::*;
use rustc_hash::{FxHashMap, FxHashSet, FxHasher};
use swc_atoms::Atom;
use swc_common::Mark;
use swc_ecma_ast::*;
use tracing::debug;

use super::reverse_map::ReverseMap;
use crate::rename::{RenamedVariable, Renamer};

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq)]
pub(crate) enum ScopeKind {
    #[default]
    Fn,
    Block,
}

#[derive(Debug, Default)]
pub(crate) struct Scope {
    pub(super) kind: ScopeKind,
    pub(super) data: ScopeData,

    /// `true` if this scope holds only the own name of a named function or
    /// class expression, e.g. `Map` in `var a = function Map() {}`.
    ///
    /// That name is visible only inside the expression, so an unresolved
    /// identifier with the same name can conflict with it only if this scope
    /// uses it. See [`Scope::captures_kept_name`].
    pub(super) is_expr_name: bool,

    pub(super) children: Vec<Scope>,
}

pub(super) type FxIndexSet<T> = IndexSet<T, BuildHasherDefault<FxHasher>>;

#[derive(Debug, Default)]
pub(super) struct ScopeData {
    /// All identifiers used by this scope or children.
    ///
    /// This is add-only.
    ///
    /// If the add-only contraint is violated, it is very likely to be a bug,
    /// because we merge every items in children to current scope.
    all: FxHashSet<Id>,

    queue: FxIndexSet<Id>,

    /// Names emitted by non-identifier expressions in this scope or its
    /// descendants. Renamed bindings must not capture these names.
    reserved_output_symbols: FxHashSet<Atom>,
}

impl Scope {
    pub(super) fn add_decl(&mut self, id: &Id, has_eval: bool, top_level_mark: Mark) {
        if &*id.0 == "arguments" {
            return;
        }

        self.data.all.insert(id.clone());

        if !self.data.queue.contains(id) {
            if has_eval && id.1.outer().is_descendant_of(top_level_mark) {
                return;
            }

            self.data.queue.insert(id.clone());
        }
    }

    pub(crate) fn reserve_decl(&mut self, len: usize) {
        self.data.all.reserve(len);

        self.data.queue.reserve(len);
    }

    pub(super) fn add_usage(&mut self, id: Id) {
        if &*id.0 == "arguments" {
            return;
        }

        self.data.all.insert(id);
    }

    pub(super) fn reserve_output_symbol(&mut self, symbol: Atom) {
        self.data.reserved_output_symbols.insert(symbol);
    }

    pub(crate) fn reserve_usage(&mut self, len: usize) {
        self.data.all.reserve(len);
    }

    /// Copy `children.data.all` to `self.data.all`.
    pub(crate) fn prepare_renaming(&mut self) {
        self.children.iter_mut().for_each(|child| {
            child.prepare_renaming();

            self.data.all.extend(child.data.all.iter().cloned());
            self.data
                .reserved_output_symbols
                .extend(child.data.reserved_output_symbols.iter().cloned());
        });
    }

    /// `reserved_symbols` are names that must never be assigned, even to the
    /// own name of a function or class expression. They are the names from
    /// [`Renamer::unresolved_symbols`].
    pub(crate) fn rename_in_normal_mode<R, V>(
        &mut self,
        renamer: &R,
        to: &mut FxHashMap<Id, V>,
        previous: &FxHashMap<Id, V>,
        reverse: &mut ReverseMap,
        preserved: &FxHashSet<Id>,
        preserved_symbols: &FxHashSet<Atom>,
        reserved_symbols: &FxHashSet<Atom>,
    ) where
        R: Renamer,
        V: RenamedVariable,
    {
        let queue = take(&mut self.data.queue);

        // let mut cloned_reverse = reverse.clone();

        self.rename_one_scope_in_normal_mode(
            renamer,
            to,
            previous,
            reverse,
            queue,
            preserved,
            preserved_symbols,
            reserved_symbols,
        );

        for child in &mut self.children {
            child.rename_in_normal_mode(
                renamer,
                to,
                &Default::default(),
                reverse,
                preserved,
                preserved_symbols,
                reserved_symbols,
            );
        }
    }

    fn rename_one_scope_in_normal_mode<R, V>(
        &self,
        renamer: &R,
        to: &mut FxHashMap<Id, V>,
        previous: &FxHashMap<Id, V>,
        reverse: &mut ReverseMap,
        queue: FxIndexSet<Id>,
        preserved: &FxHashSet<Id>,
        preserved_symbols: &FxHashSet<Atom>,
        reserved_symbols: &FxHashSet<Atom>,
    ) where
        R: Renamer,
        V: RenamedVariable,
    {
        let mut latest_n = FxHashMap::default();
        let mut n = 0;

        for id in queue {
            if renamer.preserve_name(&id)
                || preserved.contains(&id)
                || to.get(&id).is_some()
                || previous.get(&id).is_some()
                || id.0 == "eval"
            {
                continue;
            }

            if R::RESET_N {
                n = latest_n.get(&id.0).copied().unwrap_or(0);
            }

            loop {
                let sym = renamer.new_name_for(&id, &mut n);

                // https://github.com/swc-project/swc/issues/12528
                //
                // The own name of a function or class expression cannot capture
                // a reference outside of the expression, so a preserved symbol
                // conflicts with it only if the expression uses an identifier
                // with that symbol that keeps its name.
                //
                // This is safe only in normal mode. In mangle mode,
                // `preserved_symbols` also contains names assigned to other
                // bindings, and those bindings are stored in `data.all` with
                // their original symbols.
                if (preserved_symbols.contains(&sym)
                    && (!self.is_expr_name
                        || reserved_symbols.contains(&sym)
                        || self.captures_kept_name(renamer, &sym, &id, preserved)))
                    || self.data.reserved_output_symbols.contains(&sym)
                {
                    continue;
                }

                if self.can_rename(&id, &sym, reverse) {
                    let renamed = V::new_private(sym.clone());
                    if cfg!(debug_assertions) {
                        let renamed = renamed.to_id();
                        #[cfg(debug_assertions)]
                        debug!(
                            "Renaming `{}{:?}` to `{}{:?}`",
                            id.0, id.1, renamed.0, renamed.1
                        );
                    }
                    latest_n.insert(id.0.clone(), n);

                    reverse.push_entry(sym, id.clone());
                    to.insert(id.clone(), renamed);
                    break;
                }
            }
        }
    }

    /// Returns `true` if a binding of this scope named `symbol` would capture
    /// an identifier that keeps its name.
    ///
    /// Such an identifier is an identifier named `symbol`, other than
    /// `except`, that this scope or a child scope uses, and that is not a
    /// binding declared in a child scope. A binding declared in a child
    /// scope gets its name later, and [`Scope::can_rename`] prevents it from
    /// capturing the binding of this scope. A preserved binding keeps its
    /// name, so it is always treated as a conflict.
    ///
    /// If this scope or a child scope uses `eval`, this always returns `true`.
    /// A direct `eval` can refer to any name through a string, which
    /// `data.all` cannot record. For example, `function_name` gives
    /// `{ Map: function () { return eval("Map"); } }` the name `Map`, which
    /// must not capture a global `Map`.
    ///
    /// This is a linear scan, so call it only after a cheaper check has
    /// found a possible conflict. It must be called before the child scopes
    /// are renamed, because it reads their queues.
    fn captures_kept_name<R>(
        &self,
        renamer: &R,
        symbol: &Atom,
        except: &Id,
        preserved: &FxHashSet<Id>,
    ) -> bool
    where
        R: Renamer,
    {
        self.data.all.iter().any(|used| {
            used.0 == "eval"
                || (used.0 == *symbol
                    && used != except
                    && (preserved.contains(used)
                        || renamer.preserve_name(used)
                        || !self.children.iter().any(|child| child.declares(used))))
        })
    }

    /// Returns `true` if this scope or a child scope will rename `id`.
    fn declares(&self, id: &Id) -> bool {
        self.data.queue.contains(id) || self.children.iter().any(|child| child.declares(id))
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

    #[cfg_attr(
        not(feature = "concurrent-renamer"),
        allow(unused, clippy::only_used_in_recursion)
    )]
    pub(crate) fn rename_in_mangle_mode<R, V>(
        &mut self,
        renamer: &R,
        to: &mut FxHashMap<Id, V>,
        previous: &FxHashMap<Id, V>,
        reverse: &ReverseMap,
        preserved: &FxHashSet<Id>,
        preserved_symbols: &FxHashSet<Atom>,
        parallel: bool,
    ) where
        R: Renamer,
        V: RenamedVariable,
    {
        let queue = take(&mut self.data.queue);

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
                    let mut new_map = FxHashMap::with_capacity_and_hasher(
                        child.rename_cost(),
                        Default::default(),
                    );
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

    fn rename_one_scope_in_mangle_mode<R, V>(
        &self,
        renamer: &R,
        to: &mut FxHashMap<Id, V>,
        previous: &FxHashMap<Id, V>,
        reverse: &mut ReverseMap,
        queue: FxIndexSet<Id>,
        preserved: &FxHashSet<Id>,
        preserved_symbols: &FxHashSet<Atom>,
    ) where
        R: Renamer,
        V: RenamedVariable,
    {
        let mut n = 0;

        for id in queue {
            if renamer.preserve_name(&id)
                || preserved.contains(&id)
                || to.get(&id).is_some()
                || previous.get(&id).is_some()
                || id.0 == "eval"
            {
                continue;
            }

            loop {
                let sym = renamer.new_name_for(&id, &mut n);

                // TODO: Use base54::decode
                if preserved_symbols.contains(&sym)
                    || self.data.reserved_output_symbols.contains(&sym)
                {
                    continue;
                }

                if self.can_rename(&id, &sym, reverse) {
                    #[cfg(debug_assertions)]
                    {
                        #[cfg(debug_assertions)]
                        debug!("mangle: `{}{:?}` -> {}", id.0, id.1, sym);
                    }

                    reverse.push_entry(sym.clone(), id.clone());
                    to.insert(id.clone(), V::new_private(sym));
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
