use crate::{bundler::load::TransformedModule, BundleKind, Bundler, Load, ModuleId, Resolve};
use petgraph::{graphmap::DiGraphMap, visit::Bfs};
use std::collections::HashMap;

pub(super) struct Plan {
    /// key: entry
    chunk_plans: HashMap<ModuleId, ChunkPlan>,
}

#[derive(Debug, Default)]
struct Metadata {
    access_cnt: u32,
}

#[derive(Debug)]
enum ChunkPlan {
    Normal {
        /// Depends on plan, not module
        depends_on: Vec<ModuleId>,
        chunks: Vec<ModuleId>,
    },
    Circular {
        chunks: Vec<ModuleId>,
    },
}

pub(super) type ModuleGraph = DiGraphMap<ModuleId, usize>;

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    pub(super) fn determine_entries(
        &self,
        mut entries: HashMap<String, TransformedModule>,
    ) -> Vec<(BundleKind, ModuleId, Vec<ModuleId>)> {
        let mut graph = ModuleGraph::default();
        let mut kinds = vec![];

        for (name, module) in entries.drain() {
            kinds.push((BundleKind::Named { name }, module.id));
            self.add_to_graph(&mut graph, module.id);
        }

        let mut metadata = HashMap::<ModuleId, Metadata>::default();

        // Draw dependency graph
        for (_, id) in &kinds {
            let mut bfs = Bfs::new(&graph, *id);

            while let Some(dep) = bfs.next(&graph) {
                if dep == *id {
                    // Useless
                    continue;
                }

                metadata.entry(dep).or_default().access_cnt += 1;
            }
        }

        // Promote modules to entry.
        for (id, md) in &metadata {
            if md.access_cnt > 1 {
                // TODO: Dynamic import
                let module = self.scope.get_module(*id).unwrap();
                kinds.push((
                    BundleKind::Lib {
                        name: module.fm.name.to_string(),
                    },
                    *id,
                ))
            }
        }

        let mut chunks: HashMap<_, Vec<_>> = HashMap::default();

        for (_, id) in &kinds {
            let mut bfs = Bfs::new(&graph, *id);

            while let Some(dep) = bfs.next(&graph) {
                if dep == *id {
                    // Useless
                    continue;
                }

                if metadata.get(&dep).map(|md| md.access_cnt).unwrap_or(0) == 1 {
                    chunks.entry(*id).or_default().push(dep);
                    log::info!("Module dep: {} => {}", id, dep)
                }
            }
        }

        kinds
            .into_iter()
            .map(|(kind, id)| {
                let deps = chunks.remove(&id).unwrap_or_else(|| vec![]);

                (kind, id, deps)
            })
            .collect()
    }

    fn add_to_graph(&self, graph: &mut ModuleGraph, module_id: ModuleId) {
        let contains = graph.contains_node(module_id);

        graph.add_node(module_id);

        let m = self
            .scope
            .get_module(module_id)
            .expect("failed to get module");

        // Prevent dejavu
        if contains {
            for (src, _) in &m.imports.specifiers {
                if graph.contains_node(src.module_id) {
                    self.scope.mark_as_circular(module_id);
                    self.scope.mark_as_circular(src.module_id);
                    return;
                }
            }
        }

        for (src, _) in &*m.imports.specifiers {
            //

            self.add_to_graph(graph, src.module_id);
            graph.add_edge(
                module_id,
                src.module_id,
                if src.is_unconditional { 2 } else { 1 },
            );
        }

        for (src, _) in &m.exports.reexports {
            self.add_to_graph(graph, src.module_id);
            graph.add_edge(
                module_id,
                src.module_id,
                if src.is_unconditional { 2 } else { 1 },
            );
        }
    }
}
