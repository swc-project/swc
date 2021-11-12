use crate::{deps::DepAnalyzer, load::Load};
use anyhow::Error;
use module_id::ModuleId;
use swc_common::FileName;
use swc_ecma_loader::resolve::Resolve;

pub mod cache;
pub mod deps;
pub mod load;
pub mod module_id;

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

    fn load_file_and_deps(&self, f: &FileName) -> Result<(ModuleId, L::Output), Error> {}
}
