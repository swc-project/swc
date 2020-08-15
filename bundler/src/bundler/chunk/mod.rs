use super::{load::TransformedModule, Bundler};
use crate::{
    id::ModuleId, load::Load, resolve::Resolve, util::IntoParallelIterator, Bundle, BundleKind,
};
use anyhow::{Context, Error};
use petgraph::{graphmap::DiGraphMap, visit::Bfs};
#[cfg(feature = "rayon")]
use rayon::iter::ParallelIterator;
use std::collections::{HashMap, HashSet};
use swc_ecma_transforms::{hygiene, optimization::simplify::dce};
use swc_ecma_visit::FoldWith;

mod circular;
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
    synchronously_included: HashSet<ModuleId>,
    dynamic_entries: HashSet<ModuleId>,
    common_libs: HashSet<ModuleId>,
}

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// `entries` - Entry modules (provided by user) by it's basename.
    ///
    /// # How it works
    ///
    /// For first, we load all dependencies and determine all entries.
    pub(super) fn chunk(
        &self,
        entries: HashMap<String, TransformedModule>,
    ) -> Result<Vec<Bundle>, Error> {
        let entries = self.determine_entries(entries);

        Ok(entries
            .into_par_iter()
            .map(
                |(kind, id, mut module_ids_to_merge): (BundleKind, ModuleId, _)| {
                    self.run(|| {
                        let module = self
                            .merge_modules(id, &mut module_ids_to_merge)
                            .context("failed to merge module")
                            .unwrap(); // TODO

                        assert_eq!(module_ids_to_merge, vec![], "Everything should be merged");

                        let module = module
                            .fold_with(&mut dce::dce(Default::default()))
                            .fold_with(&mut hygiene());

                        Bundle { kind, id, module }
                    })
                },
            )
            .collect())
    }

    fn determine_entries(
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
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::bundler::tests::suite;
    use swc_common::FileName;

    #[test]
    fn es6_determine_entries() {
        suite()
            .file(
                "main.js",
                "
                    import './a';
                    import './b';
                    ",
            )
            .file("a.js", "import './common';")
            .file("b.js", "import './common';")
            .file("common.js", r#"console.log('foo')"#)
            .run(|t| {
                let module = t
                    .bundler
                    .load_transformed(&FileName::Real("main.js".into()))?
                    .unwrap();
                let mut entries = FxHashMap::default();
                entries.insert("main.js".to_string(), module);

                let determined = t.bundler.determine_entries(entries);

                assert_eq!(
                    determined.len(),
                    2,
                    "common file should be promoted as an entry"
                );

                Ok(())
            });
    }

    #[test]
    fn cjs_determine_entries() {
        suite()
            .file(
                "main.js",
                "
                    require('./a');
                    require('./b');
                    ",
            )
            .file("a.js", "require('./common')")
            .file("b.js", "require('./common')")
            .file("common.js", r#"console.log('foo')"#)
            .run(|t| {
                let module = t
                    .bundler
                    .load_transformed(&FileName::Real("main.js".into()))?
                    .unwrap();
                let mut entries = FxHashMap::default();
                entries.insert("main.js".to_string(), module);

                let determined = t.bundler.determine_entries(entries);

                assert_eq!(
                    determined.len(),
                    2,
                    "common file should be promoted as an entry"
                );

                Ok(())
            });
    }
}
