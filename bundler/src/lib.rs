use load::Load;
use resolve::Resolve;
use swc_common::Mark;

mod id;
pub mod load;
pub mod resolve;
mod scope;

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
}

impl<L, R> Bundler<L, R>
where
    L: Load,
    R: Resolve,
{
}
