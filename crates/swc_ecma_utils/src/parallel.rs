//! Module for parallel processing

use once_cell::sync::Lazy;
use swc_common::GLOBALS;
use swc_ecma_ast::*;

static CPU_COUNT: Lazy<usize> = Lazy::new(num_cpus::get);

pub fn cpu_count() -> usize {
    *CPU_COUNT
}

pub trait Parallel: swc_common::sync::Send + swc_common::sync::Sync {
    /// Used to create visitor.
    fn create(&self) -> Self;

    /// This can be called in anytime.
    fn merge(&mut self, other: Self);

    /// Invoked after visiting all [Stmt]s, possibly in parallel.
    fn after_stmts(&mut self, _stmts: &mut Vec<Stmt>) {}

    /// Invoked after visiting all [ModuleItem]s, possibly in parallel.
    fn after_module_items(&mut self, _stmts: &mut Vec<ModuleItem>) {}
}

/// This is considered as a private type and it's NOT A PUBLIC API.
#[cfg(feature = "concurrent")]
#[allow(clippy::len_without_is_empty)]
pub trait Items:
    rayon::iter::IntoParallelIterator<Item = Self::Elem> + IntoIterator<Item = Self::Elem>
{
    type Elem: Send + Sync;

    fn len(&self) -> usize;
}

/// This is considered as a private type and it's NOT A PUBLIC API.
#[cfg(not(feature = "concurrent"))]
#[allow(clippy::len_without_is_empty)]
pub trait Items: IntoIterator<Item = Self::Elem> {
    type Elem: Send + Sync;

    fn len(&self) -> usize;
}

impl<T> Items for Vec<T>
where
    T: Send + Sync,
{
    type Elem = T;

    fn len(&self) -> usize {
        Vec::len(self)
    }
}

impl<'a, T> Items for &'a mut Vec<T>
where
    T: Send + Sync,
{
    type Elem = &'a mut T;

    fn len(&self) -> usize {
        Vec::len(self)
    }
}

impl<'a, T> Items for &'a mut [T]
where
    T: Send + Sync,
{
    type Elem = &'a mut T;

    fn len(&self) -> usize {
        <[T]>::len(self)
    }
}

impl<'a, T> Items for &'a [T]
where
    T: Send + Sync,
{
    type Elem = &'a T;

    fn len(&self) -> usize {
        <[T]>::len(self)
    }
}

pub trait ParallelExt: Parallel {
    /// Invoke `op` in parallel, if `swc_ecma_transforms_base` is compiled with
    /// concurrent feature enabled and `nodes.len()` is bigger than threshold.
    ///
    ///
    /// This configures [GLOBALS], while not configuring [HANDLER] nor [HELPERS]
    fn maybe_par<I, F>(&mut self, threshold: usize, nodes: I, op: F)
    where
        I: Items,
        F: Send + Sync + Fn(&mut Self, I::Elem);
}

#[cfg(feature = "concurrent")]
impl<T> ParallelExt for T
where
    T: Parallel,
{
    fn maybe_par<I, F>(&mut self, threshold: usize, nodes: I, op: F)
    where
        I: Items,
        F: Send + Sync + Fn(&mut Self, I::Elem),
    {
        if nodes.len() >= threshold || option_env!("SWC_FORCE_CONCURRENT") == Some("1") {
            GLOBALS.with(|globals| {
                use rayon::prelude::*;

                let visitor = nodes
                    .into_par_iter()
                    .map(|node| {
                        GLOBALS.set(globals, || {
                            let mut visitor = Parallel::create(&*self);
                            op(&mut visitor, node);

                            visitor
                        })
                    })
                    .reduce(
                        || Parallel::create(&*self),
                        |mut a, b| {
                            Parallel::merge(&mut a, b);

                            a
                        },
                    );

                Parallel::merge(self, visitor);
            });

            return;
        }

        for n in nodes {
            op(self, n);
        }
    }
}

#[cfg(not(feature = "concurrent"))]
impl<T> ParallelExt for T
where
    T: Parallel,
{
    fn maybe_par<I, F>(&mut self, _threshold: usize, nodes: I, op: F)
    where
        I: Items,
        F: Send + Sync + Fn(&mut Self, I::Elem),
    {
        for n in nodes {
            op(self, n);
        }
    }
}
