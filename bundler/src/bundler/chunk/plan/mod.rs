use crate::{
    bundler::{load::TransformedModule, scope::Metadata},
    BundleKind, Bundler, Load, ModuleId, Resolve,
};
use anyhow::{bail, Error};
use lca::least_common_ancestor;
use petgraph::{
    algo::all_simple_paths,
    graphmap::DiGraphMap,
    visit::Bfs,
    EdgeDirection::{Incoming, Outgoing},
};
use std::collections::{hash_map::Entry, HashMap};

mod lca;
#[cfg(test)]
mod tests;

#[derive(Debug, Default)]
struct PlanBuilder {
    /// Graph to compute direct dependencies (direct means it will be merged
    /// directly)
    direct_deps: ModuleGraph,

    circular: HashMap<ModuleId, Vec<ModuleId>>,

    /// Used to calcuate transitive dependencies.
    reverse: HashMap<ModuleId, Vec<ModuleId>>,

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

        self.circular.insert(src, vec![imported]);
    }

    fn is_circular(&self, id: ModuleId) -> bool {
        self.circular.get(&id).is_some()
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

        dbg!(&builder.direct_deps);

        let mut metadata = HashMap::<ModuleId, Metadata>::default();

        // Draw dependency graph to calculte
        for (id, _) in &builder.kinds {
            let mut bfs = Bfs::new(&builder.direct_deps, *id);

            while let Some(dep) = bfs.next(&builder.direct_deps) {
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

        // Handle circular imports
        for (root_entry, _) in builder.kinds.iter() {
            let mut bfs = Bfs::new(&builder.direct_deps, *root_entry);

            while let Some(entry) = bfs.next(&builder.direct_deps) {
                let deps: Vec<_> = builder
                    .direct_deps
                    .neighbors_directed(entry, Outgoing)
                    .collect();

                for dep in deps {
                    // Check if it's circular.
                    if let Some(members) = builder.circular.get(&dep) {
                        // Exclude circular imnports from normal dependencies
                        for &circular_member in members {
                            if entry == circular_member {
                                continue;
                            }

                            if builder
                                .direct_deps
                                .remove_edge(dep, circular_member)
                                .is_some()
                            {
                                log::debug!(
                                    "[circular] Removing {:?} => {:?}",
                                    dep,
                                    circular_member
                                );
                            }
                        }

                        // Add circular plans
                        match plans.circular.entry(dep) {
                            // Already added
                            Entry::Occupied(_) => {
                                // TODO: assert!
                            }

                            // We need to mark modules as circular.
                            Entry::Vacant(e) => {
                                let circular_plan = e.insert(CircularPlan::default());
                                if let Some(mut v) = builder.circular.remove(&dep) {
                                    dbg!(entry, &v);
                                    if let Some(index) = v.iter().position(|&id| id == dep) {
                                        v.remove(index);
                                    }
                                    circular_plan.chunks.extend(v);
                                }
                            }
                        }

                        // if !builder.is_circular(dep) {
                        //     plans.normal.entry(dep).or_default().chunks.
                        // push(entry); }
                    }
                }
            }
        }

        for (root_entry, _) in &builder.kinds {
            let root_entry = *root_entry;
            let mut bfs = Bfs::new(&builder.direct_deps, root_entry);

            while let Some(entry) = bfs.next(&builder.direct_deps) {
                let deps: Vec<_> = builder
                    .direct_deps
                    .neighbors_directed(entry, Outgoing)
                    .collect();

                for &dep in &deps {
                    let circular = builder.is_circular(dep);
                    eprintln!("{:?} -> {:?}, [circular = {}]", entry, dep, circular);

                    if builder.circular.get(&entry).is_some() {
                        log::debug!(
                            "Adding a circular dependencuy {:?} to normal entry {:?}",
                            entry,
                            root_entry
                        );
                        plans.normal.entry(entry).or_default().chunks.push(dep);
                        continue;
                    }
                    let is_es6 = self.scope.get_module(entry).unwrap().is_es6;
                    let dependants = builder
                        .direct_deps
                        .neighbors_directed(dep, Incoming)
                        .collect::<Vec<_>>();

                    if metadata.get(&dep).map(|md| md.bundle_cnt).unwrap_or(0) == 1 {
                        log::debug!("{:?} depends on {:?}", entry, dep);

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
                                plans.normal.entry(entry).or_default().chunks.push(dep);
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
                            let module = least_common_ancestor(&builder.direct_deps, &dependants);

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
                            let merge_target = if plans.entries.contains(&dependants[0]) {
                                dependants[0]
                            } else if dependants.len() == 2
                                && plans.entries.contains(&dependants[1])
                            {
                                dependants[1]
                            } else {
                                least_common_ancestor(&builder.direct_deps, &dependants)
                            };

                            dbg!(merge_target);

                            if dependants.len() == 2 && dependants.contains(&merge_target) {
                                let entry =
                                    *dependants.iter().find(|&&v| v != merge_target).unwrap();
                                let normal_plan = plans.normal.entry(entry).or_default();
                                if !normal_plan.chunks.contains(&dep) {
                                    normal_plan.chunks.push(dep);
                                }
                            } else {
                                let t = &mut plans
                                    .normal
                                    .entry(merge_target)
                                    .or_default()
                                    .transitive_chunks;
                                if !t.contains(&dep) {
                                    t.push(dep)
                                }
                            }
                        } else {
                            // Direct dependency.
                            plans.normal.entry(entry).or_default().chunks.push(dep);
                        }

                        continue;
                    }
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
        builder.direct_deps.add_node(module_id);

        let m = self
            .scope
            .get_module(module_id)
            .expect("failed to get module");

        for src in m
            .imports
            .specifiers
            .iter()
            .map(|v| &v.0)
            .chain(m.exports.reexports.iter().map(|v| &v.0))
        {
            log::debug!("({:?}) {:?} => {:?}", root_id, module_id, src.module_id);

            builder.direct_deps.add_edge(module_id, src.module_id, 0);

            let rev = builder.reverse.entry(src.module_id).or_default();
            if !rev.contains(&module_id) {
                rev.push(module_id);
            }

            if !builder.direct_deps.contains_edge(src.module_id, module_id) {
                self.add_to_graph(builder, src.module_id, root_id);
            }
        }

        // Prevent dejavu
        for (src, _) in &m.imports.specifiers {
            if builder.direct_deps.contains_edge(src.module_id, module_id) {
                log::debug!(
                    "({:?}) circular dep: {:?} => {:?}",
                    root_id,
                    module_id,
                    src.module_id
                );

                builder.mark_as_circular(module_id, src.module_id);

                let circular_paths = all_simple_paths::<Vec<ModuleId>, _>(
                    &builder.direct_deps,
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
            }
        }
    }
}
