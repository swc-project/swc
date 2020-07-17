use std::marker::PhantomData;
use swc_common::pass::{CompilerPass, Repeated};
use swc_ecma_ast::*;
pub use swc_ecma_visit::{Fold, Optional};

pub fn noop() -> impl Fold {
    struct Noop;
    impl Fold for Noop {}
    Noop
}

pub trait RepeatedJsPass: CompilerPass + RepeatedPass {}

impl<T: ?Sized> RepeatedJsPass for T where T: CompilerPass + RepeatedPass {}
