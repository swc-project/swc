use self::lca::least_common_ancestor;
use crate::dep_graph::ModuleGraph;
use crate::{
    bundler::{load::TransformedModule, scope::Metadata},
    BundleKind, Bundler, Load, ModuleId, Resolve,
};
use ahash::AHashMap;
use ahash::AHashSet;
use anyhow::{bail, Error};
use petgraph::{
    algo::all_simple_paths,
    visit::Bfs,
    EdgeDirection::{Incoming, Outgoing},
};
use std::{
    collections::hash_map::Entry,
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
    all_deps: AHashMap<(ModuleId, ModuleId), bool>,

    /// Graph to compute direct dependencies (direct means it will be merged
    /// directly)
    direct_deps: ModuleGraph,

    circular: Circulars,

    kinds: AHashMap<ModuleId, BundleKind>,
}

#[derive(Debug, Default)]
struct Circulars(Vec<AHashSet<ModuleId>>);

impl Circulars {
    pub fn get(&self, id: ModuleId) -> Option<&AHashSet<ModuleId>> {
        let pos = self.0.iter().position(|set| set.contains(&id))?;

        Some(&self.0[pos])
    }
}

impl Deref for Circulars {
    type Target = Vec<AHashSet<ModuleId>>;

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

        let mut set = AHashSet::default();
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
    pub normal: AHashMap<ModuleId, NormalPlan>,
    /// key is entry
    pub circular: AHashMap<ModuleId, CircularPlan>,

    pub bundle_kinds: AHashMap<ModuleId, BundleKind>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(super) enum DepType {
    /// Direct dependencies
    Direct,
    /// Used to handle
    ///
    /// - a -> b
    /// - a -> c
    /// - b -> d
    /// - c -> d
    Transitive,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(super) struct Dependancy {
    pub ty: DepType,
    pub id: ModuleId,
}

#[derive(Debug, Clone, Default)]
#[cfg_attr(test, derive(PartialEq, Eq))]
pub(super) struct NormalPlan {
    pub chunks: Vec<Dependancy>,
}

#[derive(Debug, Default)]
pub(super) struct CircularPlan {
    /// Members of the circular dependncies.
    pub chunks: Vec<ModuleId>,
}

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    pub(super) fn determine_entries(
        &self,
        entries: AHashMap<String, TransformedModule>,
    ) -> Result<(Plan, ModuleGraph), Error> {
        let plan = self.calculate_plan(entries)?;

        Ok(plan)
    }

    fn calculate_plan(
        &self,
        entries: AHashMap<String, TransformedModule>,
    ) -> Result<(Plan, ModuleGraph), Error> {
        let mut builder = PlanBuilder::default();

        for (name, module) in entries {
            match builder.kinds.insert(module.id, BundleKind::Named { name }) {
                Some(v) => bail!("Multiple entries with same input path detected: {:?}", v),
                None => {}
            }

            self.add_to_graph(&mut builder, module.id, &mut vec![], true);
        }

        let mut metadata = AHashMap::<ModuleId, Metadata>::default();

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

        let graph = builder.direct_deps.clone();

        Ok((self.build_plan(&metadata, builder), graph))
    }

    fn build_plan(&self, _metadata: &AHashMap<ModuleId, Metadata>, builder: PlanBuilder) -> Plan {
        let mut plans = Plan::default();

        for (id, kind) in builder.kinds.iter() {
            plans.entries.push(*id);
            plans.bundle_kinds.insert(*id, kind.clone());
        }

        // Convert graph to plan
        for (root_entry, _) in &builder.kinds {
            let root_entry = *root_entry;
            let mut bfs = Bfs::new(&builder.direct_deps, root_entry);

            let mut done = AHashSet::new();

            while let Some(entry) = bfs.next(&builder.direct_deps) {
                let mut deps: Vec<_> = builder
                    .direct_deps
                    .neighbors_directed(entry, Outgoing)
                    .collect();
                deps.sort();

                let should_be_reexport = deps.iter().any(|&dep| {
                    builder
                        .all_deps
                        .get(&(entry, dep))
                        .copied()
                        .unwrap_or(false)
                });

                for &dep in &deps {
                    if let Some(circular_members) = builder.circular.get(entry) {
                        if circular_members.contains(&dep) {
                            log::debug!(
                                "Adding a circular dependency {:?} to normal entry {:?}",
                                dep,
                                entry
                            );
                            if entry != root_entry && dep != root_entry {
                                // done.insert(dep);
                                plans
                                    .normal
                                    .entry(entry)
                                    .or_default()
                                    .chunks
                                    .push(Dependancy {
                                        id: dep,
                                        ty: DepType::Direct,
                                    });
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
                            plans
                                .normal
                                .entry(entry)
                                .or_default()
                                .chunks
                                .push(Dependancy {
                                    id: dep,
                                    ty: DepType::Direct,
                                });
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
                            let contains = normal_plan.chunks.iter().any(|d| d.id == dep);

                            if !contains {
                                if dependants.contains(&module) {
                                    log::trace!("Normal (non-es6): {:?} => {:?}", module, dep);
                                    // `entry` depends on `module` directly
                                    normal_plan.chunks.push(Dependancy {
                                        id: dep,
                                        ty: DepType::Direct,
                                    });
                                } else {
                                    log::trace!("Transitive (non-es6): {:?} => {:?}", module, dep);
                                    normal_plan.chunks.push(Dependancy {
                                        id: dep,
                                        ty: DepType::Transitive,
                                    });
                                }
                            }
                        }

                        continue;
                    }

                    if is_reexport {
                        let normal_plan = plans.normal.entry(entry).or_default();
                        if normal_plan
                            .chunks
                            .iter()
                            .all(|dependancy| dependancy.id != dep)
                        {
                            done.insert(dep);

                            log::trace!("Normal: {:?} => {:?}", entry, dep);
                            normal_plan.chunks.push(Dependancy {
                                id: dep,
                                ty: DepType::Direct,
                            });
                        }
                        continue;
                    }

                    if 2 <= dependants.len() {
                        // Should be merged as a transitive dependency.
                        let higher_module = if plans.entries.contains(&dependants[0]) {
                            dependants[0]
                        } else if dependants.len() == 2 && plans.entries.contains(&dependants[1]) {
                            dependants[1]
                        } else {
                            least_common_ancestor(&builder, &dependants)
                        };

                        if dependants.len() == 2 && dependants.contains(&higher_module) {
                            let mut entry = if should_be_reexport {
                                higher_module
                            } else {
                                *dependants.iter().find(|&&v| v != higher_module).unwrap()
                            };

                            // We choose higher node if import is circular
                            if builder.is_circular(entry) {
                                entry = higher_module;
                            }

                            let normal_plan = plans.normal.entry(entry).or_default();
                            if normal_plan
                                .chunks
                                .iter()
                                .all(|dependancy| dependancy.id != dep)
                            {
                                log::trace!("Normal: {:?} => {:?}", entry, dep);
                                done.insert(dep);
                                normal_plan.chunks.push(Dependancy {
                                    id: dep,
                                    ty: DepType::Direct,
                                });
                            }
                        } else {
                            if self.scope.should_be_wrapped_with_a_fn(dep) {
                                let normal_entry = &mut plans.normal.entry(entry).or_default();

                                let t = &mut normal_entry.chunks;
                                if t.iter().all(|dependancy| dependancy.id != dep) {
                                    log::debug!("Normal, esm: {:?} => {:?}", entry, dep);
                                    done.insert(dep);
                                    t.push(Dependancy {
                                        id: dep,
                                        ty: DepType::Direct,
                                    })
                                }
                            } else {
                                let normal_entry =
                                    &mut plans.normal.entry(higher_module).or_default();

                                let t = &mut normal_entry.chunks;
                                if t.iter().all(|dependancy| dependancy.id != dep) {
                                    log::trace!("Transitive: {:?} => {:?}", entry, dep);
                                    done.insert(dep);
                                    t.push(Dependancy {
                                        id: dep,
                                        ty: if should_be_reexport {
                                            DepType::Direct
                                        } else {
                                            DepType::Transitive
                                        },
                                    })
                                }
                            }
                        }
                    } else {
                        // Direct dependency.
                        log::trace!("Normal: {:?} => {:?}", entry, dep);
                        done.insert(dep);
                        plans
                            .normal
                            .entry(entry)
                            .or_default()
                            .chunks
                            .push(Dependancy {
                                id: dep,
                                ty: DepType::Direct,
                            });
                    }
                }
            }
        }

        // Sort transitive chunks topologically.
        for (_, normal_plan) in &mut plans.normal {
            toposort(&builder, &mut normal_plan.chunks);
        }

        // Handle circular imports
        for (root_entry, _) in builder.kinds.iter() {
            if let Some(members) = builder.circular.get(*root_entry) {
                plans
                    .normal
                    .entry(*root_entry)
                    .or_default()
                    .chunks
                    .retain(|dep| !members.contains(&dep.id));
            }
        }

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
                        let mut members = members.iter().copied().collect::<Vec<_>>();
                        members.sort();
                        let mut contained_in_entry = false;

                        // Exclude circular imnports from normal dependencies
                        for &circular_member in &members {
                            if entry == circular_member {
                                continue;
                            }
                            {
                                let c = &mut plans.normal.entry(entry).or_default().chunks;
                                if let Some(pos) = c.iter().position(|&v| v.id == circular_member) {
                                    if contained_in_entry {
                                        c.remove(pos);
                                    } else {
                                        contained_in_entry = true;
                                    }
                                }
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
                                    if let Some(pos) =
                                        c.iter().position(|&v| v.id == circular_member)
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
                                    if let Some(pos) = c.iter().position(|&v| v.id == dep) {
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
                                circular_plan.chunks.sort();
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

            builder.direct_deps.add_edge(module_id, src.module_id, ());

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
        for (src, _) in m
            .imports
            .specifiers
            .iter()
            .chain(m.exports.reexports.iter())
        {
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

fn toposort(b: &PlanBuilder, module_ids: &mut Vec<Dependancy>) {
    if module_ids.len() <= 1 {
        return;
    }

    let mut graph = b.direct_deps.clone();
    let len = module_ids.len();
    let mut orders: Vec<usize> = vec![];

    loop {
        if graph.all_edges().count() == 0 {
            break;
        }

        let mut did_work = false;
        // Add nodes which does not have any dependencies.
        for i in 0..len {
            let m = module_ids[i].id;
            if graph.neighbors_directed(m, Incoming).count() != 0 {
                continue;
            }

            did_work = true;
            orders.push(i);
            // Remove dependency
            graph.remove_node(m);
        }

        if !did_work {
            break;
        }
    }

    for i in 0..len {
        if orders.contains(&i) {
            continue;
        }
        orders.push(i);
    }

    let mut buf = Vec::with_capacity(module_ids.len());
    for order in orders {
        let item = module_ids[order];
        buf.push(item)
    }

    *module_ids = buf;
}
