use std::{collections::VecDeque, iter::from_fn, mem::take, time::Instant};

use indexmap::IndexSet;
use petgraph::EdgeDirection::Outgoing;
use swc_common::{
    collections::{AHashSet, ARandomState},
    sync::Lrc,
    SourceMap, SyntaxContext,
};
use swc_ecma_ast::*;
use swc_ecma_utils::prepend_stmts;

use super::stmt::sort_stmts;
use crate::{dep_graph::ModuleGraph, modules::Modules, ModuleId};

/// The unit of sorting.
#[derive(Debug)]
pub(super) struct Chunk {
    pub stmts: Vec<ModuleItem>,
}

impl Modules {
    /// Modules with circular import relations will be in same chunk.
    #[allow(clippy::ptr_arg)]
    pub(super) fn take_chunks(
        &mut self,
        entry_id: ModuleId,
        graph: &ModuleGraph,
        cycle: &Vec<Vec<ModuleId>>,
        cm: &Lrc<SourceMap>,
    ) -> Vec<Chunk> {
        let injected_ctxt = self.injected_ctxt;
        let mut chunks = Vec::new();

        let mut modules = take(&mut self.modules);

        for (id, module) in &mut modules {
            if let Some(prepended) = self.prepended_stmts.remove(&*id) {
                prepend_stmts(&mut module.body, prepended.into_iter());
            }

            if let Some(items) = self.appended_stmts.remove(&*id) {
                module.body.extend(items);
            }
        }

        chunks.extend(toposort_real_modules(
            injected_ctxt,
            modules,
            entry_id,
            graph,
            cycle,
            cm,
        ));

        chunks
    }
}

/// Sort items topologically, while merging cycles as a
fn toposort_real_modules<'a>(
    injected_ctxt: SyntaxContext,
    mut modules: Vec<(ModuleId, Module)>,
    entry: ModuleId,
    graph: &'a ModuleGraph,
    cycles: &'a [Vec<ModuleId>],
    cm: &Lrc<SourceMap>,
) -> Vec<Chunk> {
    let mut queue = modules.iter().map(|v| v.0).collect::<VecDeque<_>>();
    queue.push_front(entry);

    let mut chunks = Vec::new();

    tracing::debug!(
        "Topologically sorting modules based on the dependency graph: ({} items)",
        modules.len()
    );

    #[cfg(not(target_arch = "wasm32"))]
    let start = Instant::now();
    let sorted_ids = toposort_real_module_ids(queue, graph, cycles).collect::<Vec<_>>();
    #[cfg(not(target_arch = "wasm32"))]
    let end = Instant::now();
    #[cfg(not(target_arch = "wasm32"))]
    tracing::debug!("Toposort of module ids took {:?}", end - start);
    for ids in sorted_ids {
        if ids.is_empty() {
            continue;
        }

        let mut stmts = Vec::new();

        for id in ids.iter().copied().rev() {
            if let Some((_, module)) = modules.iter_mut().find(|(module_id, _)| *module_id == id) {
                module
                    .body
                    .retain(|item| !matches!(item, ModuleItem::Stmt(Stmt::Empty(..))));
                if module.body.is_empty() {
                    continue;
                }

                stmts.push(take(&mut module.body));
            }
        }

        if stmts.is_empty() {
            continue;
        }

        // Skip sorting statements if there is no import.
        if ids.len() == 1 && graph.neighbors_directed(ids[0], Outgoing).count() == 0 {
            chunks.push(Chunk {
                stmts: stmts.into_iter().next().unwrap(),
            });
            continue;
        }

        let stmts = sort_stmts(injected_ctxt, stmts, cm);

        // print_hygiene(
        //     &format!("after sort: {:?}", ids),
        //     cm,
        //     &Module {
        //         span: DUMMY_SP,
        //         body: stmts.clone(),
        //         shebang: None,
        //     },
        // );

        chunks.push(Chunk { stmts })
    }

    chunks
}

fn cycles_for(
    cycles: &[Vec<ModuleId>],
    id: ModuleId,
    checked: &mut Vec<ModuleId>,
) -> IndexSet<ModuleId, ARandomState> {
    checked.push(id);
    let mut v = cycles
        .iter()
        .filter(|v| v.contains(&id))
        .flatten()
        .copied()
        .collect::<IndexSet<_, _>>();

    let ids = v.clone();

    for added in ids {
        if checked.contains(&added) {
            continue;
        }
        v.extend(cycles_for(cycles, added, checked));
    }

    v
}

fn toposort_real_module_ids<'a>(
    mut queue: VecDeque<ModuleId>,
    graph: &'a ModuleGraph,
    cycles: &'a [Vec<ModuleId>],
) -> impl 'a + Iterator<Item = Vec<ModuleId>> {
    let mut done = AHashSet::<ModuleId>::default();
    let mut errorred = AHashSet::<ModuleId>::default();

    from_fn(move || {
        while let Some(id) = queue.pop_front() {
            if done.contains(&id) {
                continue;
            }

            // dbg!(id);

            let deps = graph
                .neighbors_directed(id, Outgoing)
                .filter(|dep| !done.contains(dep))
                .collect::<Vec<_>>();

            if deps.is_empty() {
                // TODO: Add dependants

                // Emit
                done.insert(id);
                errorred.clear();
                return Some(vec![id]);
            }

            // dbg!(&deps);

            let mut all_modules_in_circle = cycles_for(cycles, id, &mut Default::default());
            all_modules_in_circle.reverse();

            // dbg!(&all_modules_in_circle);

            if all_modules_in_circle.is_empty() {
                queue.push_front(id);

                // This module does not have any circular imports.
                for dep in deps.iter().copied().rev() {
                    queue.push_front(dep);
                }

                continue;
            }

            // We need to handle dependencies of all circular modules.
            let deps_of_circle = all_modules_in_circle
                .iter()
                .flat_map(|&id| {
                    graph
                        .neighbors_directed(id, Outgoing)
                        .filter(|dep| !done.contains(dep) && !all_modules_in_circle.contains(dep))
                })
                .collect::<Vec<_>>();

            // dbg!(&deps_of_circle);

            if !deps_of_circle.is_empty() {
                if errorred.insert(id) {
                    queue.push_front(id);

                    // Handle dependencies first.
                    for dep in deps_of_circle.iter().copied().rev() {
                        queue.push_front(dep);
                    }

                    continue;
                }
                tracing::info!("Using slow, fallback logic for topological sorting");
                all_modules_in_circle.extend(deps_of_circle);
            }

            // TODO: Add dependants

            // Emit
            done.extend(all_modules_in_circle.iter().copied());
            errorred.clear();
            return Some(all_modules_in_circle.into_iter().collect());
        }

        None
    })
}
