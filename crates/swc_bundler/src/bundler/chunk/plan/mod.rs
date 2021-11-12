use crate::{
    bundler::{load::TransformedModule, scope::Scope},
    dep_graph::ModuleGraph,
    BundleKind, Bundler, Load, ModuleId, Resolve,
};
use anyhow::{bail, Error};
use swc_common::collections::AHashMap;
use swc_graph_analyzer::{DepGraph, GraphAnalyzer};

#[cfg(test)]
mod tests;

#[derive(Debug, Default)]
struct PlanBuilder {
    kinds: AHashMap<ModuleId, BundleKind>,
}

#[derive(Debug, Default)]
pub(super) struct Plan {
    pub entries: AHashMap<ModuleId, BundleKind>,

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
        entries: AHashMap<String, TransformedModule>,
    ) -> Result<(Plan, ModuleGraph, Vec<Vec<ModuleId>>), Error> {
        let mut builder = PlanBuilder::default();
        let mut analyzer = GraphAnalyzer::new(&self.scope);

        for (name, module) in entries {
            match builder.kinds.insert(module.id, BundleKind::Named { name }) {
                Some(v) => bail!("Multiple entries with same input path detected: {:?}", v),
                None => {}
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
