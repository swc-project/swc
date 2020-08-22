use crate::{bundler::load::TransformedModule, BundleKind, Bundler, Load, ModuleId, Resolve};
use anyhow::{bail, Error};
use petgraph::{graphmap::DiGraphMap, visit::Bfs};
use std::collections::{hash_map::Entry, HashMap, HashSet};

#[derive(Debug, Default)]
struct PlanBuilder {
    graph: ModuleGraph,

    circular: HashMap<ModuleId, Vec<ModuleId>>,
    direct_deps: HashMap<ModuleId, Vec<ModuleId>>,

    kinds: HashMap<ModuleId, BundleKind>,
}

impl PlanBuilder {
    fn mark_as_circular(&mut self, src: ModuleId, imported: ModuleId) {
        if let Some(v) = self.circular.get_mut(&src) {
            if !v.contains(&src) {
                v.push(src);
            }
            if !v.contains(&imported) {
                v.push(imported);
            }
            return;
        }

        if let Some(v) =
            self.circular
                .iter_mut()
                .find_map(|(_, v)| if v.contains(&imported) { Some(v) } else { None })
        {
            if !v.contains(&src) {
                v.push(src);
            }
            if !v.contains(&imported) {
                v.push(imported);
            }
            return;
        }

        self.circular.insert(src, vec![imported]);
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
    ) -> Result<Plan, Error> {
        let mut builder = PlanBuilder::default();

        for (name, module) in entries {
            match builder.kinds.insert(module.id, BundleKind::Named { name }) {
                Some(v) => bail!("Multiple entries with same input path detected: {:?}", v),
                None => {}
            }

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
                match builder.kinds.insert(
                    *id,
                    BundleKind::Lib {
                        name: module.fm.name.to_string(),
                    },
                ) {
                    Some(v) => {
                        bail!("An entry cannot be imported: {:?}", v);
                    }
                    None => {}
                }
            }
        }

        let mut plans = Plan::default();

        for (id, kind) in builder.kinds.iter() {
            plans.entries.push(*id);
            plans.bundle_kinds.insert(*id, kind.clone());
        }

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
                            let plan = e.insert(CircularPlan::default());
                            if let Some(v) = builder.circular.remove(&dep) {
                                plan.chunks.extend(v);
                            }
                        }
                    }
                    continue;
                }
            }
        }

        for (id, _) in &builder.circular {
            builder.direct_deps.remove(id);
        }

        for (id, deps) in builder.direct_deps {
            let e = plans.normal.entry(id).or_default();

            for dep in deps {
                if metadata.get(&dep).map(|md| md.bundle_cnt).unwrap_or(0) == 1 {
                    log::info!("Module dep: {} => {}", id, dep);
                    e.chunks.push(dep);
                    continue;
                }
            }
        }

        Ok(plans)
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
            // Track direct dependencies
            builder
                .direct_deps
                .entry(module_id)
                .or_default()
                .push(src.module_id);

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
