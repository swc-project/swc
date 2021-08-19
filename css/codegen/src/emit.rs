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
