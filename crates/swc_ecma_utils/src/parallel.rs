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
    rayon::iter::IntoParallelIterator<Iter = Self::ParIter> + IntoIterator<Item = Self::Elem>
{
    type Elem: Send + Sync;

    type ParIter: rayon::iter::ParallelIterator<Item = Self::Elem>
        + rayon::iter::IndexedParallelIterator;

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
    #[cfg(feature = "concurrent")]
    type ParIter = rayon::vec::IntoIter<T>;

    fn len(&self) -> usize {
        Vec::len(self)
    }
}

impl<'a, T> Items for &'a mut Vec<T>
where
    T: Send + Sync,
{
    type Elem = &'a mut T;
    #[cfg(feature = "concurrent")]
    type ParIter = rayon::slice::IterMut<'a, T>;

    fn len(&self) -> usize {
        Vec::len(self)
    }
}

impl<'a, T> Items for &'a mut [T]
where
    T: Send + Sync,
{
    type Elem = &'a mut T;
    #[cfg(feature = "concurrent")]
    type ParIter = rayon::slice::IterMut<'a, T>;

    fn len(&self) -> usize {
        <[T]>::len(self)
    }
}

impl<'a, T> Items for &'a [T]
where
    T: Send + Sync,
{
    type Elem = &'a T;
    #[cfg(feature = "concurrent")]
    type ParIter = rayon::slice::Iter<'a, T>;

    fn len(&self) -> usize {
        <[T]>::len(self)
    }
}

pub trait ParallelExt: Parallel {
    /// Invoke `op` in parallel, if `swc_ecma_utils` is compiled with
    /// concurrent feature enabled and `nodes.len()` is bigger than threshold.
    ///
    ///
    /// This configures [GLOBALS], while not configuring [HANDLER] nor [HELPERS]
    fn maybe_par<I, F>(&mut self, threshold: usize, nodes: I, op: F)
    where
        I: Items,
        F: Send + Sync + Fn(&mut Self, I::Elem),
    {
        self.maybe_par_idx(threshold, nodes, |v, _, n| op(v, n))
    }

    /// Invoke `op` in parallel, if `swc_ecma_utils` is compiled with
    /// concurrent feature enabled and `nodes.len()` is bigger than threshold.
    ///
    ///
    /// This configures [GLOBALS], while not configuring [HANDLER] nor [HELPERS]
    fn maybe_par_idx<I, F>(&mut self, threshold: usize, nodes: I, op: F)
    where
        I: Items,
        F: Send + Sync + Fn(&mut Self, usize, I::Elem);
}

#[cfg(feature = "concurrent")]
impl<T> ParallelExt for T
where
    T: Parallel,
{
    fn maybe_par_idx<I, F>(&mut self, threshold: usize, nodes: I, op: F)
    where
        I: Items,
        F: Send + Sync + Fn(&mut Self, usize, I::Elem),
    {
        if nodes.len() >= threshold || option_env!("SWC_FORCE_CONCURRENT") == Some("1") {
            GLOBALS.with(|globals| {
                use rayon::prelude::*;

                let visitor = nodes
                    .into_par_iter()
                    .enumerate()
                    .map(|(idx, node)| {
                        GLOBALS.set(globals, || {
                            let mut visitor = Parallel::create(&*self);
                            op(&mut visitor, idx, node);

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

        for (idx, n) in nodes.into_iter().enumerate() {
            op(self, idx, n);
        }
    }
}

#[cfg(not(feature = "concurrent"))]
impl<T> ParallelExt for T
where
    T: Parallel,
{
    fn maybe_par_idx<I, F>(&mut self, _threshold: usize, nodes: I, op: F)
    where
        I: Items,
        F: Send + Sync + Fn(&mut Self, usize, I::Elem),
    {
        for (idx, n) in nodes.into_iter().enumerate() {
            op(self, idx, n);
        }
    }
}
