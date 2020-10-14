use self::lca::least_common_ancestor;
use crate::{
    bundler::{load::TransformedModule, scope::Metadata},
    BundleKind, Bundler, Load, ModuleId, Resolve,
};
use anyhow::{bail, Error};
use petgraph::{
    algo::all_simple_paths,
    graphmap::DiGraphMap,
    visit::Bfs,
    EdgeDirection::{Incoming, Outgoing},
};
use std::{
    collections::{hash_map::Entry, HashMap, HashSet},
    ops::{Deref, DerefMut},
};

mod lca;
#[cfg(test)]
mod tests;

#[derive(Debug, Default)]
struct PlanBuilder {
    /// A hashmap to check if a module import is circular.
    ///
    /// This contains all dependencies, including transitive ones. For example,
    /// if `a` dependes on `b` and `b` depdends on `c`, all of
    ///  `(a, b)`, `(a, c)`,`(b, c)` will be inserted.
    ///
    /// `bool` is `true` if it's connected with exports.
    all_deps: HashMap<(ModuleId, ModuleId), bool>,

    /// Graph to compute direct dependencies (direct means it will be merged
    /// directly)
    direct_deps: ModuleGraph,

    circular: Circulars,

    kinds: HashMap<ModuleId, BundleKind>,
}

#[derive(Debug, Default)]
struct Circulars(Vec<HashSet<ModuleId>>);

impl Circulars {
    pub fn get(&self, id: ModuleId) -> Option<&HashSet<ModuleId>> {
        let pos = self.0.iter().position(|set| set.contains(&id))?;

        Some(&self.0[pos])
    }
    // pub fn remove(&mut self, id: ModuleId) -> Option<HashSet<ModuleId>> {
    //     let pos = self.0.iter().position(|set| set.contains(&id))?;
    //     Some(self.0.remove(pos))
    // }
}

impl Deref for Circulars {
    type Target = Vec<HashSet<ModuleId>>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl DerefMut for Circulars {
    fn deref_mut(&mut self) -> &mut Self::Target {
        &mut self.0
    }
}

impl PlanBuilder {
    fn mark_as_circular(&mut self, src: ModuleId, imported: ModuleId) {
        for set in self.circular.iter_mut() {
            if set.contains(&src) || set.contains(&imported) {
                set.insert(src);
                set.insert(imported);
                return;
            }
        }

        let mut set = HashSet::default();
        set.insert(src);
        set.insert(imported);
        self.circular.push(set);
    }

    fn is_circular(&self, id: ModuleId) -> bool {
        for set in self.circular.iter() {
            if set.contains(&id) {
                return true;
            }
        }

        false
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
        let plan = self.circular.get(&entry)?;
        if plan.chunks.is_empty() {
            return None;
        }

        Some(plan)
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
        let plan = self.calculate_plan(entries)?;
        let plan = self.handle_duplicates(plan);

        Ok(plan)
    }

    /// 1. For entry -> a -> b -> a, entry -> a->c, entry -> b -> c,
    ///     we change c as transitive dependancy of entry.
    fn handle_duplicates(&self, plan: Plan) -> Plan {
        plan
    }

    fn calculate_plan(&self, entries: HashMap<String, TransformedModule>) -> Result<Plan, Error> {
        let mut builder = PlanBuilder::default();

        for (name, module) in entries {
            match builder.kinds.insert(module.id, BundleKind::Named { name }) {
                Some(v) => bail!("Multiple entries with same input path detected: {:?}", v),
                None => {}
            }

            self.add_to_graph(&mut builder, module.id, &mut vec![], true);
        }

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

        Ok(self.build_plan(&metadata, builder))
    }

    fn build_plan(&self, metadata: &HashMap<ModuleId, Metadata>, builder: PlanBuilder) -> Plan {
        let mut plans = Plan::default();

        for (id, kind) in builder.kinds.iter() {
            plans.entries.push(*id);
            plans.bundle_kinds.insert(*id, kind.clone());
        }

        // Convert graph to plan
        for (root_entry, _) in &builder.kinds {
            let root_entry = *root_entry;
            let mut bfs = Bfs::new(&builder.direct_deps, root_entry);

            let mut done = HashSet::new();

            while let Some(entry) = bfs.next(&builder.direct_deps) {
                let mut deps: Vec<_> = builder
                    .direct_deps
                    .neighbors_directed(entry, Outgoing)
                    .collect();
                deps.sort();

                for &dep in &deps {
                    if let Some(circular_members) = builder.circular.get(entry) {
                        if circular_members.contains(&dep) {
                            log::debug!(
                                "Adding a circular dependency {:?} to normal entry {:?}",
                                dep,
                                entry
                            );
                            if entry != root_entry && dep != root_entry {
                                done.insert(dep);
                                plans.normal.entry(entry).or_default().chunks.push(dep);
                            }
                            continue;
                        }
                    }

                    if done.contains(&dep) {
                        continue;
                    }

                    let is_es6 = self.scope.get_module(entry).unwrap().is_es6;
                    let mut dependants = builder
                        .direct_deps
                        .neighbors_directed(dep, Incoming)
                        .collect::<Vec<_>>();
                    dependants.sort();

                    if metadata.get(&dep).map(|md| md.bundle_cnt).unwrap_or(0) == 1 {
                        log::debug!("{:?} depends on {:?}", entry, dep);

                        let is_reexport = builder
                            .all_deps
                            .get(&(entry, dep))
                            .copied()
                            .unwrap_or(false);

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
                            let module = least_common_ancestor(&builder, &dependants);
                            let normal_plan = plans.normal.entry(module).or_default();

                            for &dep in &deps {
                                if !normal_plan.chunks.contains(&dep)
                                    && !normal_plan.transitive_chunks.contains(&dep)
                                {
                                    if dependants.contains(&module) {
                                        log::trace!("Normal: {:?} => {:?}", module, dep);
                                        // `entry` depends on `module` directly
                                        normal_plan.chunks.push(dep);
                                    } else {
                                        log::trace!("Transitive: {:?} => {:?}", module, dep);
                                        normal_plan.transitive_chunks.push(dep);
                                    }
                                }
                            }

                            continue;
                        }

                        if is_reexport {
                            let normal_plan = plans.normal.entry(entry).or_default();
                            if !normal_plan.chunks.contains(&dep) {
                                done.insert(dep);

                                log::trace!("Normal: {:?} => {:?}", entry, dep);
                                normal_plan.chunks.push(dep);
                            }
                            continue;
                        }

                        if 2 <= dependants.len() {
                            // Should be merged as a transitive dependency.
                            let higher_module = if plans.entries.contains(&dependants[0]) {
                                dependants[0]
                            } else if dependants.len() == 2
                                && plans.entries.contains(&dependants[1])
                            {
                                dependants[1]
                            } else {
                                least_common_ancestor(&builder, &dependants)
                            };

                            if dependants.len() == 2 && dependants.contains(&higher_module) {
                                let mut entry = if is_reexport {
                                    higher_module
                                } else {
                                    *dependants.iter().find(|&&v| v != higher_module).unwrap()
                                };

                                // We choose higher node if import is circular
                                if builder.is_circular(entry) {
                                    entry = higher_module;
                                }

                                let normal_plan = plans.normal.entry(entry).or_default();
                                if !normal_plan.chunks.contains(&dep) {
                                    log::trace!("Normal: {:?} => {:?}", entry, dep);
                                    done.insert(dep);
                                    normal_plan.chunks.push(dep);
                                }
                            } else {
                                let t = &mut plans
                                    .normal
                                    .entry(higher_module)
                                    .or_default()
                                    .transitive_chunks;
                                if !t.contains(&dep) {
                                    log::trace!("Transitive: {:?} => {:?}", entry, dep);
                                    done.insert(dep);
                                    t.push(dep)
                                }
                            }
                        } else {
                            // Direct dependency.
                            log::trace!("Normal: {:?} => {:?}", entry, dep);
                            done.insert(dep);
                            plans.normal.entry(entry).or_default().chunks.push(dep);
                        }

                        continue;
                    }
                }
            }
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
                    if let Some(members) = builder.circular.get(dep) {
                        // Exclude circular imnports from normal dependencies
                        for &circular_member in members {
                            if entry == circular_member {
                                continue;
                            }
                            // Remove direct deps if it's circular
                            if builder.direct_deps.contains_edge(dep, circular_member) {
                                log::debug!(
                                    "[circular] Removing {:?} => {:?}",
                                    dep,
                                    circular_member
                                );

                                {
                                    let c = &mut plans.normal.entry(dep).or_default().chunks;
                                    if let Some(pos) = c.iter().position(|&v| v == circular_member)
                                    {
                                        c.remove(pos);
                                    }
                                }

                                {
                                    let c = &mut plans
                                        .normal
                                        .entry(circular_member)
                                        .or_default()
                                        .chunks;
                                    if let Some(pos) = c.iter().position(|&v| v == dep) {
                                        c.remove(pos);
                                    }
                                }
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
                                if let Some(v) = builder.circular.get(dep) {
                                    circular_plan
                                        .chunks
                                        .extend(v.iter().copied().filter(|&v| v != dep));
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

        for &entry in &plans.entries {
            plans.normal.entry(entry).or_default();
        }

        // dbg!(&plans);
        plans
    }

    fn add_to_graph(
        &self,
        builder: &mut PlanBuilder,
        module_id: ModuleId,
        path: &mut Vec<ModuleId>,
        is_in_reexports: bool,
    ) {
        builder.direct_deps.add_node(module_id);

        let m = self
            .scope
            .get_module(module_id)
            .expect("failed to get module");

        for (src, is_export) in m
            .imports
            .specifiers
            .iter()
            .map(|v| (&v.0, false))
            .chain(m.exports.reexports.iter().map(|v| (&v.0, true)))
        {
            if !builder.direct_deps.contains_edge(module_id, src.module_id) {
                log::debug!(
                    "Dependency: {:?} => {:?}; in export = {:?}; export = {:?}",
                    module_id,
                    src.module_id,
                    is_in_reexports,
                    is_export
                );
            }

            builder.direct_deps.add_edge(module_id, src.module_id, 0);

            for &id in &*path {
                builder
                    .all_deps
                    .insert((id, src.module_id), is_in_reexports);
            }
            builder
                .all_deps
                .insert((module_id, src.module_id), is_export);

            if !builder.all_deps.contains_key(&(src.module_id, module_id)) {
                path.push(module_id);
                self.add_to_graph(builder, src.module_id, path, is_export);
                assert_eq!(path.pop(), Some(module_id));
            }
        }

        // Prevent dejavu
        for (src, _) in &m.imports.specifiers {
            if builder.all_deps.contains_key(&(src.module_id, module_id)) {
                log::debug!("Circular dep: {:?} => {:?}", module_id, src.module_id);

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
