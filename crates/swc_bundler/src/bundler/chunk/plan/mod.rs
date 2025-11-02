use anyhow::{bail, Error};
use rustc_hash::FxHashMap;
use swc_graph_analyzer::{DepGraph, GraphAnalyzer};

use crate::{
    bundler::{load::TransformedModule, scope::Scope},
    dep_graph::ModuleGraph,
    BundleKind, Bundler, Load, ModuleId, Resolve,
};

#[cfg(test)]
mod tests;

#[derive(Debug, Default)]
struct PlanBuilder {
    kinds: FxHashMap<ModuleId, BundleKind>,
}

#[derive(Debug, Default)]
pub(super) struct Plan {
    pub entries: FxHashMap<ModuleId, BundleKind>,

    /// Id of all modules.
    pub all: Vec<ModuleId>,
}

impl DepGraph for Scope {
    type ModuleId = ModuleId;

    fn deps_of(&self, module_id: Self::ModuleId) -> Vec<Self::ModuleId> {
        let m = self.get_module(module_id).expect("failed to get module");

        m.imports
            .specifiers
            .iter()
            .chain(m.exports.reexports.iter())
            .map(|v| v.0.module_id)
            .collect()
    }
}

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    pub(super) fn determine_entries(
        &self,
        entries: FxHashMap<String, TransformedModule>,
    ) -> Result<(Plan, ModuleGraph, Vec<Vec<ModuleId>>), Error> {
        let mut builder = PlanBuilder::default();
        let mut analyzer = GraphAnalyzer::new(&self.scope);

        for (name, module) in entries {
            if let Some(v) = builder.kinds.insert(module.id, BundleKind::Named { name }) {
                bail!("Multiple entries with same input path detected: {v:?}")
            }

            analyzer.load(module.id);
        }
        let res = analyzer.into_result();

        // dbg!(&builder.cycles);

        Ok((
            Plan {
                entries: builder.kinds,
                all: res.all,
            },
            res.graph,
            res.cycles,
        ))
    }
}
