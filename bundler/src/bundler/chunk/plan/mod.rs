use crate::dep_graph::ModuleGraph;
use crate::{bundler::load::TransformedModule, BundleKind, Bundler, Load, ModuleId, Resolve};
use ahash::AHashMap;
use anyhow::{bail, Error};
use fxhash::FxHashMap;
use fxhash::FxHashSet;

#[derive(Debug, Default)]
struct PlanBuilder {
    tracked: FxHashSet<(ModuleId, ModuleId)>,

    graph: ModuleGraph,
    cycles: Vec<Vec<ModuleId>>,
    all: Vec<ModuleId>,

    kinds: FxHashMap<ModuleId, BundleKind>,
}

#[derive(Debug, Default)]
pub(super) struct Plan {
    pub entries: FxHashMap<ModuleId, BundleKind>,

    /// Id of all modules.
    pub all: Vec<ModuleId>,
}

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    pub(super) fn determine_entries(
        &self,
        entries: AHashMap<String, TransformedModule>,
    ) -> Result<(Plan, ModuleGraph, Vec<Vec<ModuleId>>), Error> {
        let mut builder = PlanBuilder::default();

        for (name, module) in entries {
            match builder.kinds.insert(module.id, BundleKind::Named { name }) {
                Some(v) => bail!("Multiple entries with same input path detected: {:?}", v),
                None => {}
            }

            self.add_to_graph(&mut builder, module.id, &mut vec![]);
        }

        Ok((
            Plan {
                entries: builder.kinds,
                all: builder.all,
            },
            builder.graph,
            builder.cycles,
        ))
    }

    fn add_to_graph(
        &self,
        builder: &mut PlanBuilder,
        module_id: ModuleId,
        path: &mut Vec<ModuleId>,
    ) {
        let visited = builder.all.contains(&module_id);
        let cycle_rpos = if visited {
            path.iter().rposition(|v| *v == module_id)
        } else {
            None
        };
        path.push(module_id);

        if let Some(rpos) = cycle_rpos {
            let cycle = path[rpos..].to_vec();
            builder.cycles.push(cycle);
        }

        if !visited {
            builder.all.push(module_id);
        }
        builder.graph.add_node(module_id);

        let m = self
            .scope
            .get_module(module_id)
            .expect("failed to get module");

        for (src, _) in m
            .imports
            .specifiers
            .iter()
            .chain(m.exports.reexports.iter())
        {
            log::debug!("Dep: {} -> {}", module_id, src.module_id);

            builder.graph.add_edge(module_id, src.module_id, ());

            // Prevent infinite loops.
            if builder.tracked.insert((module_id, src.module_id)) {
                self.add_to_graph(builder, src.module_id, path);
            }
        }

        let res = path.pop();
        debug_assert_eq!(res, Some(module_id));
    }
}
