use super::stmt::sort_stmts;
use crate::bundler::modules::Modules;
use crate::debug::print_hygiene;
use crate::dep_graph::ModuleGraph;
use crate::ModuleId;
use ahash::AHashSet;
use indexmap::IndexSet;
use petgraph::algo::all_simple_paths;
use petgraph::EdgeDirection::Outgoing;
use std::collections::VecDeque;
use std::iter::from_fn;
use std::mem::take;
use swc_common::sync::Lrc;
use swc_common::SourceMap;
use swc_common::SyntaxContext;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_transforms::hygiene;
use swc_ecma_utils::prepend_stmts;
use swc_ecma_visit::FoldWith;

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
        let mut chunk = Chunk { stmts: vec![] };

        for id in ids {
            if let Some((_, module)) = modules.iter_mut().find(|(module_id, _)| *module_id == id) {
                chunk.stmts.extend(take(&mut module.body));
            }
        }

        if chunk.stmts.is_empty() {
            continue;
        }

        sort_stmts(injected_ctxt, &mut chunk.stmts);

        print_hygiene(
            "after sort",
            cm,
            &Module {
                span: DUMMY_SP,
                body: chunk.stmts.clone(),
                shebang: None,
            },
        );

        chunks.push(chunk)
    }

    chunks
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

            let all_modules_in_circle = deps
                .iter()
                .copied()
                .flat_map(|dep| all_simple_paths::<Vec<_>, _>(&graph, dep, id, 0, None))
                .flatten()
                .filter(|module_id| !done.contains(&module_id))
                .collect::<IndexSet<_>>();

            if all_modules_in_circle.is_empty() {
                queue.push_front(id);

                // This module does not have any circular imports.
                for dep in deps {
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
