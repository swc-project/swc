use std::marker::PhantomData;
use swc_common::pass::{CompilerPass, Repeated};
use swc_ecma_ast::*;
use swc_ecma_visit::Fold;
pub use swc_ecma_visit::Optional;

pub fn noop() -> impl Fold {
    struct Noop;
    impl Fold for Noop {}
    Noop
}

pub trait RepeatedJsPass: CompilerPass + RepeatedPass {}

impl<T: ?Sized> RepeatedJsPass for T where T: CompilerPass + RepeatedPass {}
