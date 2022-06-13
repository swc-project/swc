use std::collections::HashMap;

#[allow(unused)]
use rayon::prelude::*;
use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::{js_word, JsWord};
use swc_common::{collections::AHashMap, util::take::Take};
use swc_ecma_ast::Id;
#[cfg(debug_assertions)]
use tracing::debug;

use crate::{maybe_par, util::base54};

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
        to: &mut AHashMap<Id, JsWord>,
        previous: &AHashMap<Id, JsWord>,
        reverse: &FxHashMap<JsWord, Vec<Id>>,
        preserved: &FxHashSet<Id>,
        preserved_symbols: &FxHashSet<JsWord>,
        parallel: bool,
    ) {
        let mut queue = self.data.queue.take();
        queue.sort_by(|a, b| b.1.cmp(&a.1));

        let mut cloned_reverse = reverse.clone();

        self.rename_one_scope(
            to,
            previous,
            &mut cloned_reverse,
            queue,
            preserved,
            preserved_symbols,
        );

        if parallel {
            #[cfg(not(target_arch = "wasm32"))]
            let iter = self.children.par_iter_mut();
            #[cfg(target_arch = "wasm32")]
            let iter = self.children.iter_mut();

            let iter = iter
                .map(|child| {
                    let mut new_map = HashMap::default();
                    child.rename(
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
        } else {
            for child in &mut self.children {
                child.rename(
                    to,
                    &Default::default(),
                    &cloned_reverse,
                    preserved,
                    preserved_symbols,
                    parallel,
                );
            }
        }
    }

    fn rename_one_scope(
        &self,
        to: &mut AHashMap<Id, JsWord>,
        previous: &AHashMap<Id, JsWord>,
        cloned_reverse: &mut FxHashMap<JsWord, Vec<Id>>,
        queue: Vec<(Id, u32)>,
        preserved: &FxHashSet<Id>,
        preserved_symbols: &FxHashSet<JsWord>,
    ) {
        let mut n = 0;

        for (id, cnt) in queue {
            if cnt == 0
                || preserved.contains(&id)
                || to.get(&id).is_some()
                || previous.get(&id).is_some()
            {
                continue;
            }

            loop {
                let sym = base54::encode(&mut n, true);

                // TODO: Use base54::decode
                if preserved_symbols.contains(&sym) {
                    continue;
                }

                if self.can_rename(&id, &sym, cloned_reverse) {
                    #[cfg(debug_assertions)]
                    {
                        debug!("mangle: `{}{:?}` -> {}", id.0, id.1, sym);
                    }

                    to.insert(id.clone(), sym.clone());
                    cloned_reverse.entry(sym).or_default().push(id.clone());
                    // self.data.decls.remove(&id);
                    // self.data.usages.remove(&id);

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

    pub fn rename_cost(&self) -> usize {
        let children = &self.children;
        self.data.queue.len()
            + maybe_par!(
                children.iter().map(|v| v.rename_cost()).sum::<usize>(),
                *crate::LIGHT_TASK_PARALLELS
            )
    }
}
