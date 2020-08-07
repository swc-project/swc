use crate::{load::Load, resolve::Resolve, scope::Scope};
use swc_atoms::JsWord;
use swc_common::Mark;

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
mod util;

#[derive(Debug)]
pub struct Bundler<L, R>
where
    L: Load,
    R: Resolve,
{
    loader: L,
    resolver: R,

    external_modules: Vec<JsWord>,

    /// [Mark] used while tree shaking
    used_mark: Mark,
    /// [Mark] used while tree shaking
    top_level_mark: Mark,

    scope: Scope,
}

impl<L, R> Bundler<L, R>
where
    L: Load,
    R: Resolve,
{
}
