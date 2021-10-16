//! This module contains utilties to parallelize based on the cargo feature.

use swc_ecma_visit::{VisitMut, VisitMutWith};

pub trait Parallel: Default {
    fn merge(&mut self, other: Self);
}

/// This **may** visit nodes in parallel.
pub fn visit_mut_par<N, V, F>(nodes: &mut Vec<N>, threshold: usize, visitor: F)
where
    N: VisitMutWith<V> + Send + Sync,
    Vec<N>: VisitMutWith<V>,
    F: Sync + Fn() -> V,
    V: VisitMut,
{
    #[cfg(feature = "rayon")]
    if nodes.len() >= threshold {
        use rayon::prelude::*;

        nodes
            .into_par_iter()
            .map(|node| {
                let mut v = visitor();
                node.visit_mut_with(&mut v);
            })
            .reduce(|| (), |_, _| {});

        return;
    }

    nodes.visit_mut_with(&mut visitor())
}

#[macro_export]
macro_rules! simple_visit_mut_par {
    ($name:ident, $T:ty, $threshold:expr) => {
        fn $name(&mut self, nodes: &mut Vec<$T>) {
            $cate::parallel::visit_mut_par(nodes, $threshold, || *self);
        }
    };
}
