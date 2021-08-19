use std::fmt::Result;
use swc_common::Spanned;

///
/// # Type paramters
///
/// ## `T`
///
/// The type of the ast node.
pub trait Emit<T>
where
    T: Spanned,
{
    fn emit(&mut self, node: &T) -> Result;
}

impl<T, E> Emit<&'_ T> for E
where
    E: Emit<T>,
    T: Spanned,
{
    #[inline]
    fn emit(&mut self, node: &&'_ T) -> Result {
        self.emit(&**node)
    }
}
