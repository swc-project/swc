use std::marker::PhantomData;
use swc_common::pass::{Repeated, RepeatedPass};
use swc_ecma_ast::*;
pub use swc_ecma_visit::{Fold, Optional};

pub fn noop() -> impl Fold {
    struct Noop;
    impl Fold for Noop {}
    Noop
}
