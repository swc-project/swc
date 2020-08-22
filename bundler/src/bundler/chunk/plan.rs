use crate::{bundler::load::TransformedModule, BundleKind, Bundler, Load, ModuleId, Resolve};
use petgraph::{graphmap::DiGraphMap, visit::Bfs};
use std::collections::HashMap;

#[derive(Default)]
struct PlanBuilder {
    graph: ModuleGraph,
}

pub(super) struct Plans {
    pub normal: Vec<NormalPlan>,
    pub circular: Vec<CicularPlan>,
}

pub(super) struct NormalPlan {
    pub bundle_kind: BundleKind,
    pub entry: ModuleId,
    pub chunks: Vec<ModuleId>,
}

pub(super) struct CicularPlan {
    pub bundle_kind: BundleKind,
    pub entry: ModuleId,
    pub chunks: Vec<ModuleId>,
}

#[derive(Debug, Default)]
struct Metadata {
    access_cnt: u32,
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
        let mut builder = PlanBuilder::default();
        let mut kinds = vec![];

        for (name, module) in entries.drain() {
            kinds.push((BundleKind::Named { name }, module.id));
            self.add_to_graph(&mut builder, module.id);
        }

        let mut metadata = HashMap::<ModuleId, Metadata>::default();

        // Draw dependency graph
        for (_, id) in &kinds {
            let mut bfs = Bfs::new(&builder.graph, *id);

            while let Some(dep) = bfs.next(&builder.graph) {
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
            let mut bfs = Bfs::new(&builder.graph, *id);

            while let Some(dep) = bfs.next(&builder.graph) {
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

    fn add_to_graph(&self, builder: &mut PlanBuilder, module_id: ModuleId) {
        let contains = builder.graph.contains_node(module_id);

        builder.graph.add_node(module_id);

        let m = self
            .scope
            .get_module(module_id)
            .expect("failed to get module");

        // Prevent dejavu
        if contains {
            for (src, _) in &m.imports.specifiers {
                if builder.graph.contains_node(src.module_id) {
                    self.scope.mark_as_circular(module_id);
                    self.scope.mark_as_circular(src.module_id);
                    return;
                }
            }
        }

        for (src, _) in &*m.imports.specifiers {
            //

            self.add_to_graph(builder, src.module_id);
            builder.graph.add_edge(
                module_id,
                src.module_id,
                if src.is_unconditional { 2 } else { 1 },
            );
        }

        for (src, _) in &m.exports.reexports {
            self.add_to_graph(builder, src.module_id);
            builder.graph.add_edge(
                module_id,
                src.module_id,
                if src.is_unconditional { 2 } else { 1 },
            );
        }
    }
}
