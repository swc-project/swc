use swc_common::pass::CompilerPass;
pub use swc_common::pass::{Optional, Repeated};
use swc_ecma_visit::Fold;

pub fn noop() -> impl Fold {
    struct Noop;
    impl Fold for Noop {}
    Noop
}

pub trait JsPass: CompilerPass + Fold {}

impl<T: ?Sized> JsPass for T where T: CompilerPass + Fold {}

pub trait RepeatedJsPass: Repeated + JsPass {}

impl<T: ?Sized> RepeatedJsPass for T where T: Repeated + JsPass {}
