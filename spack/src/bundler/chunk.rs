use super::Bundler;
use crate::{
    bundler::{load_transformed::TransformedModule, Entry},
    ModuleId,
};
use anyhow::{Context, Error};
use fxhash::FxHashMap;
use petgraph::{dot::Dot, graphmap::DiGraphMap, visit::Bfs};
use rayon::prelude::*;
use swc_common::fold::FoldWith;
use swc_ecma_ast::Module;
use swc_ecma_transforms::{
    fixer,
    optimization::simplify::dce::{self, dce},
};

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

impl Bundler {
    /// `entries` - Entry modules (provided by user) by it's basename.
    ///
    /// # How it works
    ///
    /// For first, we iterate over all **named** entries (entries provided by
    /// user's config). We mark modules as **imported** if it's imported by
    /// any named entry synchronously and modules as **included** if it can be
    /// imported dynamically by any of named entries.
    ///
    /// Then, we iterate over **included** entries to get information aboit all
    /// files we need to process.
    ///
    /// As we know all candidate files and entries, we can now calculate the
    /// required dependency graph.
    pub(super) fn chunk(
        &self,
        entries: FxHashMap<String, TransformedModule>,
    ) -> Result<Vec<Entry>, Error> {
        let mut imported = FxHashSet::new();
        let mut included = FxHashSet::new();

        // First step
        for (_, m) in &entries {}

        let mut graph = ModuleGraph::new();
        let mut dynamics = vec![];

        // Create a graph.
        for (_, m) in &entries {
            self.add(&mut graph, &mut dynamics, m);
        }

        // Entries including dynamic imports
        let mut actual: FxHashMap<_, _> = entries
            .into_iter()
            .map(|(basename, m)| {
                (
                    m.id,
                    InternalEntry {
                        basename,
                        main: m,
                        included: vec![],
                        dynamic: false,
                    },
                )
            })
            .chain(dynamics.into_iter().map(|dynamic| {
                let m = self.scope.get_module(dynamic).unwrap();
                (
                    m.id,
                    InternalEntry {
                        basename: m.fm.name.to_string(),
                        main: m,
                        included: vec![],
                        dynamic: true,
                    },
                )
            }))
            .collect();
        let mut metadatas = FxHashMap::<ModuleId, Metadata>::default();

        for (_, entry) in &actual {
            let mut bfs = Bfs::new(&graph, entry.main.id);

            while let Some(dep) = bfs.next(&graph) {
                if dep == entry.main.id {
                    // Useless
                    continue;
                }

                metadatas.entry(dep).or_default().access_cnt += 1;
            }
        }

        // If a file is only included by a single entry is static, just merge it.
        for (_, entry) in &mut actual {
            if entry.dynamic {
                continue;
            }

            let mut bfs = Bfs::new(&graph, entry.main.id);

            while let Some(dep) = bfs.next(&graph) {
                if let Some(m) = metadatas.get(&dep) {
                    if m.access_cnt == 1 {
                        entry.included.push(dep);
                    }
                }
            }
        }

        println!("Metadata: {:?}", metadatas);

        println!("{}", Dot::with_config(&graph.into_graph::<usize>(), &[]));

        Ok(actual
            .into_par_iter()
            .map(|(_, e): (_, InternalEntry)| {
                let module = self
                    .merge_modules((*e.main.module).clone(), &e.main)
                    .context("failed to merge module")
                    .unwrap(); // TODO

                let module = module
                    .fold_with(&mut dce(Default::default()))
                    .fold_with(&mut fixer());

                Entry {
                    name: e.basename,
                    module,
                    fm: e.main.fm,
                }
            })
            .collect())
    }

    fn add(
        &self,
        graph: &mut ModuleGraph,
        dynamics: &mut Vec<ModuleId>,
        info: &TransformedModule,
    ) -> ModuleId {
        if graph.contains_node(info.id) {
            return info.id;
        }

        let node = graph.add_node(info.id);

        let v = &info.imports;
        for src in v.specifiers.iter().map(|v| &v.0) {
            let to = self.add_module(graph, dynamics, src.module_id);

            graph.add_edge(node, to, 1);
        }

        node
    }

    fn add_module(
        &self,
        graph: &mut ModuleGraph,
        dynamics: &mut Vec<ModuleId>,
        id: ModuleId,
    ) -> ModuleId {
        let v = self.scope.get_module(id).unwrap();
        self.add(graph, dynamics, &v)
    }
}
