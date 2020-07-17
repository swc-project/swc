use serde::export::PhantomData;
use std::borrow::Cow;
pub use swc_visit::*;

pub trait CompilerPass {
    /// Name should follow hyphen-case
    ///
    /// TODO: timing
    fn name() -> Cow<'static, str>;
}
