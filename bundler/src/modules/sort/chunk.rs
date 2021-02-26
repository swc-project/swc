use super::stmt::sort_stmts;
use crate::dep_graph::ModuleGraph;
use crate::modules::Modules;
use crate::ModuleId;
use ahash::AHashSet;
use ahash::RandomState;
use indexmap::IndexSet;
use petgraph::algo::all_simple_paths;
use petgraph::EdgeDirection::Outgoing;
use std::collections::VecDeque;
use std::iter::from_fn;
use std::mem::take;
use swc_common::sync::Lrc;
use swc_common::SourceMap;
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_utils::prepend_stmts;

/// The unit of sorting.
#[derive(Debug)]
pub(super) struct Chunk {
    pub stmts: Vec<ModuleItem>,
}

impl Modules {
    /// Modules with circular import relations will be in same chunk.
    pub(super) fn take_chunks(
        &mut self,
        entry_id: ModuleId,
        graph: &ModuleGraph,
        cm: &Lrc<SourceMap>,
    ) -> Vec<Chunk> {
        let injected_ctxt = self.injected_ctxt;
        let mut chunks = vec![];

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
    cm: &Lrc<SourceMap>,
) -> Vec<Chunk> {
    let mut queue = modules.iter().map(|v| v.0).collect::<VecDeque<_>>();
    queue.push_front(entry);

    let mut chunks = vec![];

    let sorted_ids = toposort_real_module_ids(queue, graph);
    for ids in sorted_ids {
        if ids.is_empty() {
            continue;
        }

        let mut stmts = vec![];

        for id in ids.iter().copied().rev() {
            if let Some((_, module)) = modules.iter_mut().find(|(module_id, _)| *module_id == id) {
                module.body.retain(|item| match item {
                    ModuleItem::Stmt(Stmt::Empty(..)) => false,
                    _ => true,
                });
                if module.body.is_empty() {
                    continue;
                }

                stmts.push(take(&mut module.body));
            }
        }

        if stmts.is_empty() {
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

/// Get all modules in a cycle.
fn all_modules_in_circle(
    id: ModuleId,
    done: &AHashSet<ModuleId>,
    already_in_index: &mut IndexSet<ModuleId, RandomState>,
    graph: &ModuleGraph,
) -> IndexSet<ModuleId, RandomState> {
    let deps = graph
        .neighbors_directed(id, Outgoing)
        .filter(|dep| !done.contains(&dep) && !already_in_index.contains(dep))
        .collect::<Vec<_>>();

    let mut ids = deps
        .iter()
        .copied()
        .flat_map(|dep| {
            let mut paths =
                all_simple_paths::<Vec<_>, _>(&graph, dep, id, 0, None).collect::<Vec<_>>();

            for path in paths.iter_mut() {
                path.reverse();
            }

            paths
        })
        .flatten()
        .filter(|module_id| !done.contains(&module_id) && !already_in_index.contains(module_id))
        .collect::<IndexSet<ModuleId, RandomState>>();

    already_in_index.extend(ids.iter().copied());
    let mut new_ids = IndexSet::<_, RandomState>::default();

    for &dep_id in &ids {
        let others = all_modules_in_circle(dep_id, done, already_in_index, graph);
        new_ids.extend(others)
    }
    ids.extend(new_ids);

    ids
}

fn toposort_real_module_ids<'a>(
    mut queue: VecDeque<ModuleId>,
    graph: &'a ModuleGraph,
) -> impl 'a + Iterator<Item = Vec<ModuleId>> {
    let mut done = AHashSet::<ModuleId>::default();

    from_fn(move || {
        while let Some(id) = queue.pop_front() {
            if done.contains(&id) {
                continue;
            }
            // dbg!(id);

            let deps = graph
                .neighbors_directed(id, Outgoing)
                .filter(|dep| !done.contains(&dep))
                .collect::<Vec<_>>();

            if deps.is_empty() {
                // TODO: Add dependants

                // Emit
                done.insert(id);
                return Some(vec![id]);
            }

            // dbg!(&deps);

            let mut all_modules_in_circle =
                all_modules_in_circle(id, &done, &mut Default::default(), graph);
            all_modules_in_circle.reverse();

            if all_modules_in_circle.is_empty() {
                queue.push_front(id);

                // This module does not have any circular imports.
                for dep in deps.into_iter().rev() {
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
                        .filter(|dep| !done.contains(&dep) && !all_modules_in_circle.contains(dep))
                })
                .collect::<Vec<_>>();

            // dbg!(&deps_of_circle);

            if !deps_of_circle.is_empty() {
                queue.push_front(id);

                // Handle dependencies first.
                for dep in deps_of_circle.into_iter().rev() {
                    queue.push_front(dep);
                }

                continue;
            }

            // TODO: Add dependants

            // Emit
            done.extend(all_modules_in_circle.iter().copied());
            return Some(all_modules_in_circle.into_iter().collect());
        }

        None
    })
}
