use load::Load;
use resolve::Resolve;
use scope::Scope;
use swc_common::Mark;

mod helpers;
mod id;
pub mod load;
mod module;
pub mod resolve;
mod scope;
mod util;

#[derive(Debug)]
pub struct Bundler<L, R>
where
    L: Load,
    R: Resolve,
{
    loader: L,
    resolver: R,

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
