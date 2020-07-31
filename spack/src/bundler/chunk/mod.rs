use super::Bundler;
use crate::{
    bundler::{load_transformed::TransformedModule, Bundle, BundleKind},
    ModuleId,
};
use anyhow::{Context, Error};
use fxhash::{FxHashMap, FxHashSet};
use petgraph::{graphmap::DiGraphMap, visit::Bfs};
use rayon::prelude::*;
use swc_ecma_transforms::{fixer, hygiene, optimization::simplify::dce::dce};
use swc_ecma_visit::FoldWith;

mod merge;

pub(super) type ModuleGraph = DiGraphMap<ModuleId, usize>;

#[derive(Debug)]
struct InternalEntry {
    basename: String,
    main: TransformedModule,
    included: Vec<ModuleId>,
    dynamic: bool,
}

#[derive(Debug, Default)]
struct Metadata {
    access_cnt: u32,
}

#[derive(Debug, Default)]
struct State {
    synchronously_included: FxHashSet<ModuleId>,
    dynamic_entries: FxHashSet<ModuleId>,
    common_libs: FxHashSet<ModuleId>,
}

impl Bundler<'_> {
    /// `entries` - Entry modules (provided by user) by it's basename.
    ///
    /// # How it works
    ///
    /// For first, we load all dependencies and determine all entries.
    pub(super) fn chunk(
        &self,
        entries: FxHashMap<String, TransformedModule>,
    ) -> Result<Vec<Bundle>, Error> {
        let entries = self.determine_entries(entries);

        Ok(entries
            .into_par_iter()
            .map(
                |(kind, id, mut module_ids_to_merge): (BundleKind, ModuleId, _)| {
                    self.swc().run(|| {
                        let module = self
                            .merge_modules(id, &mut module_ids_to_merge)
                            .context("failed to merge module")
                            .unwrap(); // TODO

                        let module = module
                            .fold_with(&mut dce(Default::default()))
                            .fold_with(&mut hygiene())
                            .fold_with(&mut fixer(Some(&self.swc.comments() as _)));

                        Bundle { kind, id, module }
                    })
                },
            )
            .collect())
    }

    fn determine_entries(
        &self,
        mut entries: FxHashMap<String, TransformedModule>,
    ) -> Vec<(BundleKind, ModuleId, Vec<ModuleId>)> {
        let mut graph = ModuleGraph::default();
        let mut kinds = vec![];

        for (name, module) in entries.drain() {
            kinds.push((BundleKind::Named { name }, module.id));
            self.add_to_graph(&mut graph, module.id);
        }

        let mut metadata = FxHashMap::<ModuleId, Metadata>::default();

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

        let mut chunks: FxHashMap<_, Vec<_>> = FxHashMap::default();

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
        graph.add_node(module_id);

        let m = self
            .scope
            .get_module(module_id)
            .expect("failed to get module");

        for (src, _) in &*m.imports.specifiers {
            //
            self.add_to_graph(graph, src.module_id);
            graph.add_edge(
                module_id,
                src.module_id,
                if src.is_unconditional { 2 } else { 1 },
            );
        }
    }
}
