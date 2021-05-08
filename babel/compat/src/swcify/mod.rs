pub use self::ctx::Context;
use std::fmt::Debug;

mod ctx;
mod lit;
mod program;

/// Used to convert a babel ast node to
pub trait Swcify {
    type Output: Debug + Send + Sync;

    fn swcify(self, ctx: &Context) -> Self::Output;
}
