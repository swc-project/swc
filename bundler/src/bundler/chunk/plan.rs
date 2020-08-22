use crate::{bundler::load::TransformedModule, BundleKind, Bundler, Load, ModuleId, Resolve};
use petgraph::{graphmap::DiGraphMap, visit::Bfs};
use std::collections::{hash_map::Entry, HashMap, HashSet};

#[derive(Default)]
struct PlanBuilder {
    graph: ModuleGraph,
    circular: HashMap<ModuleId, Vec<ModuleId>>,
    kinds: HashMap<ModuleId, BundleKind>,
}

impl PlanBuilder {
    fn mark_as_circular(&mut self, src: ModuleId, imported: ModuleId) {
        if let Some(v) = self.circular.get_mut(&src).or_else(|| {
            self.circular
                .iter_mut()
                .find_map(|(_, v)| if v.contains(&imported) { Some(v) } else { None })
        }) {
            if !v.contains(&src) {
                v.push(src);
            }
            if !v.contains(&imported) {
                v.push(imported);
            }
        } else {
            self.circular.insert(src, vec![imported]);
        }
    }

    fn is_circular(&self, id: ModuleId) -> bool {
        if self.circular.get(&id).is_some() {
            return true;
        }

        self.circular
            .iter()
            .any(|(_, v)| v.iter().any(|&v| v == id))
    }
}

#[derive(Default)]
pub(super) struct Plan {
    pub entries: Vec<ModuleId>,

    /// key is entry
    pub normal: HashMap<ModuleId, NormalPlan>,
    /// key is entry
    pub circular: HashMap<ModuleId, CircularPlan>,

    pub bundle_kinds: HashMap<ModuleId, BundleKind>,
}

impl Plan {
    pub fn entry_as_circular(&self, entry: ModuleId) -> Option<&CircularPlan> {
        self.circular.get(&entry)
    }
}

#[derive(Debug, Default)]
pub(super) struct NormalPlan {
    // Direct dependencies
    pub chunks: Vec<ModuleId>,
}

#[derive(Debug, Default)]
pub(super) struct CircularPlan {
    /// Members of the circular dependncies.
    pub chunks: Vec<ModuleId>,
}

#[derive(Debug, Default)]
struct Metadata {
    bundle_cnt: u32,
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
    ) -> Plan {
        let mut builder = PlanBuilder::default();

        for (name, module) in entries {
            builder
                .kinds
                .insert(module.id, BundleKind::Named { name })
                .expect("Multiple entries with same input path detected");
            self.add_to_graph(&mut builder, module.id);
        }

        let mut metadata = HashMap::<ModuleId, Metadata>::default();

        // Draw dependency graph to calculte
        for (id, _) in &builder.kinds {
            let mut bfs = Bfs::new(&builder.graph, *id);

            while let Some(dep) = bfs.next(&builder.graph) {
                if dep == *id {
                    // Useless
                    continue;
                }

                metadata.entry(dep).or_default().bundle_cnt += 1;
            }
        }

        // Promote modules to entry.
        for (id, md) in &metadata {
            if md.bundle_cnt > 1 {
                // TODO: Dynamic import
                let module = self.scope.get_module(*id).unwrap();
                builder
                    .kinds
                    .insert(
                        *id,
                        BundleKind::Lib {
                            name: module.fm.name.to_string(),
                        },
                    )
                    .expect("An entry cannot be dynamically imported");
            }
        }

        let mut plans = Plan::default();

        // Calculate actual chunking plans
        for (id, _) in builder.kinds.iter() {
            let mut bfs = Bfs::new(&builder.graph, *id);

            while let Some(dep) = bfs.next(&builder.graph) {
                if dep == *id {
                    // Useless
                    continue;
                }
                // Check if it's circular.
                if builder.is_circular(dep) {
                    // Entry is `dep`.
                    match plans.circular.entry(dep) {
                        // Already added
                        Entry::Occupied(_) => {
                            // TODO: assert!
                        }

                        // We need to mark modules as circular.
                        Entry::Vacant(e) => {
                            let mut plan = e.insert(CircularPlan::default());
                            plan.chunks
                                .extend(builder.circular.remove(&dep).unwrap_or_else(|| {
                                    panic!(
                                        "PlanBuilder did not contain infomartion about {:?}",
                                        dep
                                    )
                                }));
                        }
                    }
                    continue;
                }

                if metadata.get(&dep).map(|md| md.bundle_cnt).unwrap_or(0) == 1 {
                    plans.normal.entry(*id).or_default().chunks.push(dep);
                    log::info!("Module dep: {} => {}", id, dep);
                    continue;
                }
            }
        }

        plans
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
                    builder.mark_as_circular(module_id, src.module_id);
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
