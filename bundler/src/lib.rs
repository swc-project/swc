use atomicity::Atomicity;
use load::Load;
use resolve::Resolve;
use scope::Scope;
use swc_common::Mark;

pub mod atomicity;
mod helper;
mod id;
pub mod load;
mod module;
pub mod resolve;
mod scope;

#[derive(Debug)]
pub struct Bundler<A, L, R>
where
    A: Atomicity,
    L: Load,
    R: Resolve,
{
    loader: L,
    resolver: R,

    /// [Mark] used while tree shaking
    used_mark: Mark,
    /// [Mark] used while tree shaking
    top_level_mark: Mark,

    scope: Scope<A>,
}

impl<A, L, R> Bundler<A, L, R>
where
    A: Atomicity,
    L: Load,
    R: Resolve,
{
}
