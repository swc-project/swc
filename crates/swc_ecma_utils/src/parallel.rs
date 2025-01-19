//! Module for parallel processing

use once_cell::sync::Lazy;
use swc_common::GLOBALS;
use swc_ecma_ast::*;
use swc_parallel::{
    items::{IntoItems, Items},
    join,
};

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
    ///
    ///
    /// Note: `visit_*_par` never calls this.
    fn after_stmts(&mut self, _stmts: &mut Vec<Stmt>) {}

    /// Invoked after visiting all [ModuleItem]s, possibly in parallel.
    ///
    ///
    /// Note: `visit_*_par` never calls this.
    fn after_module_items(&mut self, _stmts: &mut Vec<ModuleItem>) {}
}

pub trait ParallelExt: Parallel {
    /// Invoke `op` in parallel, if `swc_ecma_utils` is compiled with
    /// concurrent feature enabled and `nodes.len()` is bigger than threshold.
    ///
    ///
    /// This configures [GLOBALS], while not configuring [HANDLER] nor [HELPERS]
    fn maybe_par<I, F>(&mut self, threshold: usize, nodes: I, op: F)
    where
        I: IntoItems,
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
        I: IntoItems,
        F: Send + Sync + Fn(&mut Self, usize, I::Elem),
    {
        self.maybe_par_idx_raw(threshold, nodes.into_items(), &op)
    }

    /// If you don't have a special reason, use [`ParallelExt::maybe_par`] or
    /// [`ParallelExt::maybe_par_idx`] instead.
    fn maybe_par_idx_raw<I, F>(&mut self, threshold: usize, nodes: I, op: &F)
    where
        I: Items,
        F: Send + Sync + Fn(&mut Self, usize, I::Elem);
}

#[cfg(feature = "concurrent")]
impl<T> ParallelExt for T
where
    T: Parallel,
{
    fn maybe_par_idx_raw<I, F>(&mut self, threshold: usize, nodes: I, op: &F)
    where
        I: Items,
        F: Send + Sync + Fn(&mut Self, usize, I::Elem),
    {
        if nodes.len() >= threshold {
            GLOBALS.with(|globals| {
                let len = nodes.len();
                if len == 0 {
                    return;
                }

                if len == 1 {
                    op(self, 0, nodes.into_iter().next().unwrap());
                    return;
                }

                let (na, nb) = nodes.split_at(len / 2);
                let mut vb = Parallel::create(&*self);

                let (_, vb) = join(
                    || {
                        GLOBALS.set(globals, || {
                            self.maybe_par_idx_raw(threshold, na, op);
                        })
                    },
                    || {
                        GLOBALS.set(globals, || {
                            vb.maybe_par_idx_raw(threshold, nb, op);

                            vb
                        })
                    },
                );

                Parallel::merge(self, vb);
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
    fn maybe_par_idx_raw<I, F>(&mut self, _threshold: usize, nodes: I, op: &F)
    where
        I: Items,
        F: Send + Sync + Fn(&mut Self, usize, I::Elem),
    {
        for (idx, n) in nodes.into_iter().enumerate() {
            op(self, idx, n);
        }
    }
}
