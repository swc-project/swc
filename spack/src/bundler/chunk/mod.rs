use super::Bundler;
use crate::{
    bundler::{load_transformed::TransformedModule, Entry, EntryKind},
    ModuleId,
};
use anyhow::{Context, Error};
use fxhash::{FxHashMap, FxHashSet};
use petgraph::{dot::Dot, graphmap::DiGraphMap, visit::Bfs};
use rayon::prelude::*;
use swc_common::fold::FoldWith;
use swc_ecma_ast::Module;
use swc_ecma_transforms::{
    fixer,
    optimization::simplify::dce::{self, dce},
};

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
        let mut state = State::default();

        let mut graph = ModuleGraph::new();

        for (_, m) in &entries {
            self.add_chunk_imports(&mut state, m);

            self.add(&mut graph, m);
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
            .chain(state.dynamic_entries.into_iter().map(|id| {
                let m = self.scope.get_module(id).unwrap();
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
        for (k, entry) in &mut actual {
            log::info!("Actual ({}): {:?}", entry.basename, k);

            let mut bfs = Bfs::new(&graph, entry.main.id);

            while let Some(dep) = bfs.next(&graph) {
                if let Some(m) = metadatas.get(&dep) {
                    if m.access_cnt == 1 {
                        entry.included.push(dep);
                    } else {
                        println!("Common lib: {:?}", dep);
                        state.common_libs.insert(dep);
                    }
                }
            }
        }

        log::info!("Metadata: {:?}", metadatas);

        actual.extend(state.common_libs.into_iter().map(|id| {
            let m = self.scope.get_module(id).unwrap();
            (
                m.id,
                InternalEntry {
                    basename: m.fm.name.to_string(),
                    main: m,
                    included: vec![],
                    dynamic: true,
                },
            )
        }));

        let mut graph = ModuleGraph::new();

        for (_, m) in &actual {
            self.add(&mut graph, &m.main);
        }

        println!("{:?}", Dot::with_config(&graph.into_graph::<usize>(), &[]));

        Ok(actual
            .into_par_iter()
            .map(|(_, e): (_, InternalEntry)| {
                self.swc().run(|| {
                    println!("Merging {:?}", e.main.id);

                    let module = self
                        .merge_modules((*e.main.module).clone(), &e.main)
                        .context("failed to merge module")
                        .unwrap(); // TODO

                    let module = module
                        .fold_with(&mut dce(Default::default()))
                        .fold_with(&mut fixer());

                    Entry {
                        // TODO
                        kind: EntryKind::Dynamic { number: 0 },
                        module,
                        fm: e.main.fm,
                    }
                })
            })
            .collect())
    }

    fn add_chunk_imports(&self, state: &mut State, m: &TransformedModule) {
        // Named entries are synchronously imported
        state.synchronously_included.insert(m.id);

        for (src, _) in &m.imports.specifiers {
            //
            if src.is_loaded_synchronously {
                state.synchronously_included.insert(src.module_id);
            } else {
                state.dynamic_entries.insert(src.module_id);
            }
            let v = self.scope.get_module(src.module_id).unwrap();

            self.add_chunk_imports(state, &v);
        }
    }

    fn add(&self, graph: &mut ModuleGraph, info: &TransformedModule) -> ModuleId {
        if graph.contains_node(info.id) {
            return info.id;
        }

        let node = graph.add_node(info.id);

        let v = &info.imports;
        for src in v.specifiers.iter().map(|v| &v.0) {
            let to = {
                let v = self.scope.get_module(src.module_id).unwrap();
                self.add(graph, &v)
            };

            graph.add_edge(node, to, 1);
        }

        node
    }
}
