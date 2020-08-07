use crate::{id::ModuleId, load::Load, resolve::Resolve, scope::Scope};
use swc_atoms::JsWord;
use swc_common::{comments::Comments, Mark};
use swc_ecma_ast::Module;

mod chunk;
mod export;
mod helpers;
mod id;
mod import;
pub mod load;
mod module;
pub mod resolve;
mod scope;
#[cfg(test)]
mod tests;
mod usage_analysis;
mod util;

#[derive(Debug)]
pub enum BundleKind {
    /// User-provided entry
    Named { name: String },
    /// Auto-generated entry (created by import expression)
    Dynamic,
    /// A lazy-loaded shared library
    Lib { name: String },
}

/// Built bundle
#[derive(Debug)]
pub struct Bundle {
    pub kind: BundleKind,
    pub id: ModuleId,
    /// Merged module
    pub module: Module,
}

pub struct Bundler<'a, L, R>
where
    L: Load,
    R: Resolve,
{
    loader: L,
    resolver: R,

    comments: Option<&'a dyn Comments>,

    external_modules: Vec<JsWord>,

    /// [Mark] used while tree shaking
    used_mark: Mark,
    /// [Mark] used while tree shaking
    top_level_mark: Mark,

    scope: Scope,
}

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
}
