use crate::{deps::DepAnalyzer, load::Load, util::IntoParallelIterator};
use anyhow::{Context, Error};
use module_id::ModuleId;
use swc_atoms::JsWord;
use swc_common::FileName;
use swc_ecma_loader::resolve::Resolve;

pub mod cache;
pub mod deps;
pub mod load;
pub mod module_id;
mod util;

pub struct ModuleGraph<L, R, DA>
where
    L: Load,
    R: Resolve,
    DA: DepAnalyzer<L::Output>,
{
    loader: L,
    resolver: R,
    dep_analyzer: DA,
}

impl<L, R, DA> ModuleGraph<L, R, DA>
where
    L: Load,
    R: Resolve,
    DA: DepAnalyzer<L::Output>,
{
    pub fn new(loader: L, resolver: R, dep_analyzer: DA) -> Self {
        Self {
            loader,
            resolver,
            dep_analyzer,
        }
    }

    pub fn load(&self, entry: &FileName) -> Result<(ModuleId, L::Output), Error> {
        self.load_file_and_deps(entry)
    }

    fn load_file_and_deps(&self, f: &FileName) -> Result<(ModuleId, L::Output), Error> {
        let (module_id, metadata) = self.loader.metadata_for(f)?;

        let module = self
            .loader
            .load(module_id, metadata, f)
            .with_context(|| format!("failed to load {}; (module id = {:?})", f, module_id))?;

        let mut deps = self.dep_analyzer.analyze_deps(&module);
        deps.sort();
        deps.dedup();

        deps.into_par_iter()
            .map(|dep| self.load_dep(&f, &dep))
            .collect::<Result<Vec<_>, _>>()?;

        Ok((module_id, module))
    }

    fn load_dep(&self, base: &FileName, dep: &JsWord) -> Result<ModuleId, Error> {
        let dep_path = self
            .resolver
            .resolve(base, &dep)
            .with_context(|| format!("failed to resolve dependency '{}' of '{}'", dep, base))?;

        let (module_id, _) = self
            .load_file_and_deps(&dep_path)
            .with_context(|| format!("failed to load dependency '{}' of '{}'", dep, base))?;

        Ok(module_id)
    }
}
