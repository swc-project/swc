use crate::dep_graph::ModuleGraph;
use crate::{bundler::load::TransformedModule, BundleKind, Bundler, Load, ModuleId, Resolve};
use ahash::AHashMap;
use anyhow::{bail, Error};
use fxhash::FxHashMap;
use fxhash::FxHashSet;

#[cfg(test)]
mod tests;

#[derive(Debug, Default)]
struct PlanBuilder {
    tracked: FxHashSet<(ModuleId, ModuleId)>,

    graph: ModuleGraph,
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

            self.add_to_graph(&mut builder, module.id);
        }

        Ok((
            Plan {
                entries: builder.kinds,
                all: builder.all,
            },
            builder.graph,
        ))
    }

    fn add_to_graph(&self, builder: &mut PlanBuilder, module_id: ModuleId) {
        builder.graph.add_node(module_id);

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
            builder.graph.add_edge(module_id, src.module_id, ());

            // Prevent infinite loops.
            if !builder.tracked.insert((module_id, src.module_id)) {
                self.add_to_graph(builder, src.module_id);
            }
        }
    }
}
