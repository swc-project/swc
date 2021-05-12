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

impl<T> Swcify for Vec<T>
where
    T: Swcify,
{
    type Output = Vec<T::Output>;

    fn swcify(self, ctx: &Context) -> Self::Output {
        self.into_iter().map(|v| v.swcify(ctx)).collect()
    }
}
