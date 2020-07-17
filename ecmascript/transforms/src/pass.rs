use std::marker::PhantomData;
use swc_common::pass::{Repeated, RepeatedPass};
use swc_ecma_ast::*;
pub use swc_ecma_visit::{Fold, Optional};

pub fn noop() -> impl Fold {
    struct Noop;
    impl Fold for Noop {}
    Noop
}

#[derive(Debug, Clone, Copy)]
pub struct JoinedPass<A, B, N> {
    pub first: A,
    pub second: B,
    pub ty: PhantomData<N>,
}

impl<A, B, T> Fold<T> for JoinedPass<A, B, T>
where
    T: FoldWith<Self>,
    A: Fold<T>,
    B: Fold<T>,
{
    #[inline(always)]
    fn fold(&mut self, node: T) -> T {
        // println!(
        //     "Folding<{}><{}>({})",
        //     type_name::<A>(),
        //     type_name::<B>(),
        //     type_name::<T>()
        // );
        self.second.fold(self.first.fold(node))
    }
}

impl<A, B, T, N> Fold<T> for JoinedPass<A, B, N>
where
    T: FoldWith<Self>,
{
    #[inline(always)]
    default fn fold(&mut self, node: T) -> T {
        node.fold_children(self)
    }
}

pub trait RepeatedJsPass:
    Repeated + RepeatedPass<Program> + RepeatedPass<Module> + RepeatedPass<Script> + Pass
{
}

impl<P> RepeatedJsPass for P where P: Repeated + Pass {}
