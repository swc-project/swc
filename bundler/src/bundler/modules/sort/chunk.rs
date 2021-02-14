use crate::bundler::modules::Modules;
use crate::dep_graph::ModuleGraph;
use crate::util::MapWithMut;
use crate::ModuleId;
use ahash::AHashSet;
use indexmap::IndexSet;
use petgraph::algo::all_simple_paths;
use petgraph::EdgeDirection::Outgoing;
use retain_mut::RetainMut;
use std::collections::VecDeque;
use std::iter::from_fn;
use std::mem::take;
use swc_common::Spanned;
use swc_ecma_ast::*;

/// The unit of sorting.
#[derive(Debug)]
pub(super) struct Chunk {
    pub stmts: Vec<ModuleItem>,
}

impl Modules {
    fn normalize_injected(&mut self) {
        let injected_ctxt = self.injected_ctxt;

        self.retain_mut(|item| match item {
            ModuleItem::Stmt(Stmt::Empty(..)) => false,
            _ => true,
        });

        let mut modules = take(&mut self.modules);
        for module in &mut modules {
            module.1.body.retain_mut(|item| {
                let is_free = item.span().ctxt == injected_ctxt;
                if is_free {
                    self.injected.push(item.take());
                    false
                } else {
                    true
                }
            });
        }
        self.modules = modules;
    }

    /// Modules with circular import relations will be in same chunk.
    pub(super) fn take_chunks(&mut self, entry_id: ModuleId, graph: &ModuleGraph) -> Vec<Chunk> {
        self.normalize_injected();

        let mut chunks = vec![];

        chunks.extend(
            take(&mut self.prepended)
                .into_iter()
                .map(|stmt| Chunk { stmts: vec![stmt] }),
        );
        chunks.extend(
            take(&mut self.injected)
                .into_iter()
                .map(|stmt| Chunk { stmts: vec![stmt] }),
        );

        chunks.extend(toposort_chunks(take(&mut self.modules), entry_id, graph));

        chunks
    }
}

/// Sort items topologically, while merging cycles as a
fn toposort_chunks<'a>(
    mut modules: Vec<(ModuleId, Module)>,
    entry: ModuleId,
    graph: &'a ModuleGraph,
) -> Vec<Chunk> {
    let mut queue = modules.iter().map(|v| v.0).collect::<VecDeque<_>>();
    queue.push_front(entry);

    let mut chunks = vec![];

    let sorted_ids = toposort_ids(queue, graph);
    for ids in sorted_ids {
        let mut chunk = Chunk { stmts: vec![] };

        for id in ids {
            if let Some((_, module)) = modules.iter_mut().find(|(module_id, _)| *module_id == id) {
                chunk.stmts.extend(take(&mut module.body));
            }
        }

        chunks.push(chunk)
    }

    chunks
}

fn toposort_ids<'a>(
    mut queue: VecDeque<ModuleId>,
    graph: &'a ModuleGraph,
) -> impl 'a + Iterator<Item = Vec<ModuleId>> {
    let mut done = AHashSet::<ModuleId>::default();

    from_fn(move || {
        while let Some(id) = queue.pop_front() {
            if done.contains(&id) {
                continue;
            }

            let deps = graph
                .neighbors_directed(id, Outgoing)
                .filter(|dep| !done.contains(&dep))
                .collect::<Vec<_>>();

            if deps.is_empty() {
                // Add dependants

                // Emit
                done.insert(id);
                return Some(vec![id]);
            }

            let all_modules_in_circle = deps
                .iter()
                .copied()
                .flat_map(|dep| all_simple_paths::<Vec<_>, _>(&graph, dep, id, 0, None))
                .flatten()
                .filter(|module_id| !done.contains(&module_id))
                .collect::<IndexSet<_>>();

            if all_modules_in_circle.is_empty() {
                // This module does not have any circular imports.
                for dep in deps {
                    queue.push_front(dep);
                }

                queue.push_front(id);
                continue;
            }

            // Add dependants

            // Emit
            done.extend(all_modules_in_circle.iter().copied());
            return Some(all_modules_in_circle.into_iter().collect());
        }

        None
    })
}
