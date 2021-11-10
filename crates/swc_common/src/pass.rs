//! This module reexports items from `swc_visit` with some swc-specific traits.

use std::borrow::Cow;
pub use swc_visit::*;

/// A named compiler pass.
pub trait CompilerPass {
    ///
    /// - name should follow hyphen-case.
    /// - an implementation should return same name
    fn name() -> Cow<'static, str>;
}

impl<V> CompilerPass for Repeat<V>
where
    V: CompilerPass + Repeated,
{
    fn name() -> Cow<'static, str> {
        Cow::Owned(format!("repeat({})", V::name()))
    }
}

impl<A, B> CompilerPass for AndThen<A, B>
where
    A: CompilerPass,
    B: CompilerPass,
{
    fn name() -> Cow<'static, str> {
        Cow::Owned(format!("{} -> {}", A::name(), B::name()))
    }
}
