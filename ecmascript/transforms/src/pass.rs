pub use swc_common::pass::Optional;
use swc_common::pass::{CompilerPass, Repeated};
use swc_ecma_visit::Fold;

pub fn noop() -> impl Fold {
    struct Noop;
    impl Fold for Noop {}
    Noop
}

pub trait RepeatedJsPass: CompilerPass + Repeated + Fold {}

impl<T: ?Sized> RepeatedJsPass for T where T: CompilerPass + Repeated + Fold {}
