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
