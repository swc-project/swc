use crate::{
    bundler::{load::TransformedModule, scope::Metadata},
    BundleKind, Bundler, Load, ModuleId, Resolve,
};
use anyhow::{bail, Error};
use lca::least_common_ancestor;
use petgraph::{algo::all_simple_paths, graphmap::DiGraphMap, visit::Bfs};
use std::collections::{hash_map::Entry, HashMap};

mod lca;
#[cfg(test)]
mod tests;

#[derive(Debug, Default)]
struct PlanBuilder {
    entry_graph: ModuleGraph,

    /// Graph to compute direct dependencies (direct means it will be merged
    /// directly)
    tracking_graph: ModuleGraph,

    circular: HashMap<ModuleId, Vec<ModuleId>>,
    direct_deps: HashMap<ModuleId, Vec<ModuleId>>,

    /// Used to calcuate transitive dependencies.
    reverse: HashMap<ModuleId, Vec<ModuleId>>,

    /// Used for normalization
    ///
    /// This is required because we cannot know the order file is
    /// loaded. It means we cannot know order
    /// calls to add_to_graph.
    /// Thus, we cannot track import order in add_to_graph.
    pending_direct_deps: HashMap<ModuleId, Vec<ModuleId>>,

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

        if let Some(v) = self.circular.iter_mut().find_map(|(_, v)| {
            if v.contains(&src) || v.contains(&imported) {
                Some(v)
            } else {
                None
            }
        }) {
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

    fn try_add_direct_dep(&mut self, root_id: ModuleId, dep: ModuleId, dep_of_dep: ModuleId) {
        if let None = self.tracking_graph.add_edge(root_id, dep_of_dep, 0) {
            if self.circular.contains_key(&dep_of_dep) {
                self.direct_deps.entry(root_id).or_default().push(dep);
                return;
            }

            // Track direct dependencies, but exclude if it will be recursively merged.
            self.direct_deps.entry(dep).or_default().push(dep_of_dep);
        } else {
            if self.circular.contains_key(&dep_of_dep) {
                return;
            }

            self.pending_direct_deps
                .entry(dep)
                .or_default()
                .push(dep_of_dep);
        }
    }
}

#[derive(Debug, Default)]
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
    /// Direct dependencies
    pub chunks: Vec<ModuleId>,

    /// Used to handle
    ///
    /// - a -> b
    /// - a -> c
    /// - b -> d
    /// - c -> d
    pub transitive_chunks: Vec<ModuleId>,
}

#[derive(Debug, Default)]
pub(super) struct CircularPlan {
    /// Members of the circular dependncies.
    pub chunks: Vec<ModuleId>,
}

pub(super) type ModuleGraph = DiGraphMap<ModuleId, usize>;

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    pub(super) fn determine_entries(
        &self,
        entries: HashMap<String, TransformedModule>,
    ) -> Result<Plan, Error> {
        let mut builder = PlanBuilder::default();

        for (name, module) in entries {
            match builder.kinds.insert(module.id, BundleKind::Named { name }) {
                Some(v) => bail!("Multiple entries with same input path detected: {:?}", v),
                None => {}
            }

            self.add_to_graph(&mut builder, module.id, module.id);
        }

        let mut metadata = HashMap::<ModuleId, Metadata>::default();

        // Draw dependency graph to calculte
        for (id, _) in &builder.kinds {
            let mut bfs = Bfs::new(&builder.entry_graph, *id);

            while let Some(dep) = bfs.next(&builder.entry_graph) {
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

        // Fix direct dependencies. See the doc of pending_direct_deps for more
        // information.
        for (entry, deps) in builder.pending_direct_deps.drain() {
            for (key, direct_deps) in builder.direct_deps.iter_mut() {
                if direct_deps.contains(&entry) {
                    if *key == entry {
                        direct_deps.extend_from_slice(&deps);
                    } else {
                        direct_deps.retain(|&id| {
                            if *key == id {
                                return true;
                            }
                            if deps.contains(&id) {
                                return false;
                            }
                            true
                        });
                    }
                }
            }

            if !builder.direct_deps.contains_key(&entry) {
                builder.direct_deps.insert(entry, deps);
            }
        }

        // Handle circular imports
        for (k, members) in &builder.circular {
            for (_entry, deps) in builder.direct_deps.iter_mut() {
                deps.retain(|v| !members.contains(v));
            }

            builder.direct_deps.remove(k);
        }

        // Calculate actual chunking plans
        for (id, _) in builder.kinds.iter() {
            let mut bfs = Bfs::new(&builder.entry_graph, *id);

            let mut prev = *id;

            while let Some(dep) = bfs.next(&builder.entry_graph) {
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
                            let circular_plan = e.insert(CircularPlan::default());
                            if let Some(mut v) = builder.circular.remove(&dep) {
                                dbg!(dep, &v);
                                if let Some(index) = v.iter().position(|&id| id == dep) {
                                    v.remove(index);
                                }
                                circular_plan.chunks.extend(v);
                            }
                        }
                    }

                    if !builder.is_circular(prev) {
                        plans.normal.entry(prev).or_default().chunks.push(dep);
                    }
                }
                prev = dep;
            }
        }

        for (id, deps) in builder.direct_deps.drain() {
            for &dep in &deps {
                if builder.circular.get(&id).is_some() {
                    log::debug!(
                        "Adding a circular dependencuy {:?} to normal entry {:?}",
                        dep,
                        id
                    );
                    plans.normal.entry(id).or_default().chunks.push(dep);
                    continue;
                }
                let is_es6 = self.scope.get_module(dep).unwrap().is_es6;
                let dependants = builder.reverse.get(&dep).map(|s| &**s).unwrap_or(&[]);

                if metadata.get(&dep).map(|md| md.bundle_cnt).unwrap_or(0) == 1 {
                    log::info!("{:?} depends on {:?}", id, dep);

                    // Common js support.
                    if !is_es6 {
                        // Dependancy of
                        //
                        // a -> b
                        // b -> c
                        //
                        // results in
                        //
                        // a <- b
                        // b <- c
                        //
                        if dependants.len() <= 1 {
                            plans.normal.entry(id).or_default().chunks.push(dep);
                            continue;
                        }

                        // We now have a module depended by multiple modules. Let's say
                        //
                        // a -> b
                        // a -> c
                        // b -> c
                        //
                        // results in
                        //
                        // a <- b
                        // a <- c
                        let module = least_common_ancestor(&builder.entry_graph, dependants);

                        let normal_plan = plans.normal.entry(module).or_default();
                        normal_plan.transitive_chunks.reserve(deps.len());

                        for &dep in &deps {
                            if !normal_plan.chunks.contains(&dep)
                                && !normal_plan.transitive_chunks.contains(&dep)
                            {
                                if dependants.contains(&module) {
                                    // `entry` depends on `module` directly
                                    normal_plan.chunks.push(dep);
                                } else {
                                    normal_plan.transitive_chunks.push(dep);
                                }
                            }
                        }

                        continue;
                    }

                    if 2 <= dependants.len() {
                        // Should be merged as a transitive dependency.
                        let module = if plans.entries.contains(&dependants[0]) {
                            dependants[0]
                        } else if dependants.len() == 2 && plans.entries.contains(&dependants[1]) {
                            dependants[1]
                        } else {
                            least_common_ancestor(&builder.entry_graph, dependants)
                        };

                        if dependants.len() == 2 && dependants.contains(&module) {
                            let entry = *dependants.iter().find(|&&v| v != module).unwrap();
                            let normal_plan = plans.normal.entry(entry).or_default();
                            if !normal_plan.chunks.contains(&dep) {
                                normal_plan.chunks.push(dep);
                            }
                        } else {
                            let t = &mut plans.normal.entry(module).or_default().transitive_chunks;
                            if !t.contains(&dep) {
                                t.push(dep)
                            }
                        }
                    } else {
                        // Direct dependency.
                        plans.normal.entry(id).or_default().chunks.push(dep);
                    }

                    continue;
                }
            }
        }

        for &entry in &plans.entries {
            plans.normal.entry(entry).or_default();
        }

        // dbg!(&plans);

        Ok(plans)
    }

    fn add_to_graph(&self, builder: &mut PlanBuilder, module_id: ModuleId, root_id: ModuleId) {
        dbg!(module_id);
        builder.entry_graph.add_node(module_id);
        builder.tracking_graph.add_node(module_id);

        let m = self
            .scope
            .get_module(module_id)
            .expect("failed to get module");

        for (src, _) in &m.imports.specifiers {
            log::debug!("({:?}) {:?} => {:?}", root_id, module_id, src.module_id);
        }

        // Prevent dejavu
        for (src, _) in &m.imports.specifiers {
            if builder.entry_graph.contains_edge(src.module_id, module_id) {
                log::debug!(
                    "({:?}) circular dep: {:?} => {:?}",
                    root_id,
                    module_id,
                    src.module_id
                );

                builder.mark_as_circular(module_id, src.module_id);

                let circular_paths = all_simple_paths::<Vec<ModuleId>, _>(
                    &builder.entry_graph,
                    src.module_id,
                    module_id,
                    0,
                    None,
                )
                .collect::<Vec<_>>();

                for path in circular_paths {
                    for dep in path {
                        builder.mark_as_circular(module_id, dep)
                    }
                }
            } else {
                builder.entry_graph.add_edge(
                    module_id,
                    src.module_id,
                    if src.is_unconditional { 2 } else { 1 },
                );
            }
        }

        for (src, _) in m.imports.specifiers.iter().chain(&m.exports.reexports) {
            if !builder.entry_graph.contains_edge(src.module_id, module_id) {
                self.add_to_graph(builder, src.module_id, root_id);
            }

            builder.entry_graph.add_edge(
                module_id,
                src.module_id,
                if src.is_unconditional { 2 } else { 1 },
            );
            if self.scope.get_module(src.module_id).unwrap().is_es6 {
                builder.try_add_direct_dep(root_id, module_id, src.module_id);
            } else {
                // Common js support.
                let v = builder.direct_deps.entry(module_id).or_default();
                if !v.contains(&src.module_id) {
                    v.push(src.module_id);
                }
            }

            let rev = builder.reverse.entry(src.module_id).or_default();
            if !rev.contains(&module_id) {
                rev.push(module_id);
            }
        }
    }
}
