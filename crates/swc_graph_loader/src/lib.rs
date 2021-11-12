use crate::{deps::DepAnalyzer, load::Load};
use swc_ecma_loader::resolve::Resolve;

pub mod deps;
pub mod load;
pub mod module_id;

pub struct ModuleGraph<L, R, D>
where
    L: Load,
    R: Resolve,
    D: DepAnalyzer<L::Output>,
{
    loader: L,
    resolver: R,
    deps_analyzer: D,
}
