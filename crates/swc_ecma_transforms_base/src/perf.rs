use once_cell::sync::Lazy;
use swc_common::{errors::HANDLER, GLOBALS};
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith, Visit, VisitMut, VisitMutWith, VisitWith};

use crate::helpers::HELPERS;

pub trait Check: Visit + Default {
    fn should_handle(&self) -> bool;
}

pub fn should_work<C, T>(n: &T) -> bool
where
    C: Check,
    T: VisitWith<C>,
{
    let mut checker = C::default();
    n.visit_with(&mut checker);
    checker.should_handle()
}

static CPU_COUNT: Lazy<usize> = Lazy::new(num_cpus::get);

pub fn cpu_count() -> usize {
    *CPU_COUNT
}

pub trait Parallel {
    /// Used to create visitor.
    fn create(&self) -> Self;

    /// This can be called in anytime.
    fn merge(&mut self, other: Self);

    /// Invoked after visiting all [Stmt]s, possibly in parallel.
    fn after_stmts(&mut self, _stmts: &mut Vec<Stmt>) {}

    /// Invoked after visiting all [ModuleItem]s, possibly in parallel.
    fn after_module_items(&mut self, _stmts: &mut Vec<ModuleItem>) {}
}

pub trait ParExplode: Parallel {
    /// Invoked after visiting each statements.
    ///
    /// Implementor should not delete/prepend to `stmts`.
    fn after_one_stmt(&mut self, stmts: &mut Vec<Stmt>);

    /// Invoked after visiting each statements.
    ///
    /// Implementor should not delete/prepend to `stmts`.
    fn after_one_module_item(&mut self, stmts: &mut Vec<ModuleItem>);
}

pub trait ParVisit: Visit + Parallel {
    fn visit_par<N>(&mut self, threashold: usize, nodes: &[N])
    where
        N: Send + Sync + VisitWith<Self>;
}

impl<T> ParVisit for T
where
    T: Visit + Parallel,
{
    fn visit_par<N>(&mut self, threashold: usize, nodes: &[N])
    where
        N: Send + Sync + VisitWith<Self>,
    {
        #[cfg(feature = "rayon")]
        if nodes.len() >= threshold {
            use rayon::prelude::*;

            let (visitor, mut nodes) = GLOBALS.with(|globals| {
                HELPERS.with(|helpers| {
                    HANDLER.with(|handler| {
                        nodes
                            .into_par_iter()
                            .map(|node| {
                                GLOBALS.set(&globals, || {
                                    HELPERS.set(helpers, || {
                                        HANDLER.set(handler, || {
                                            let mut visitor = Parallel::create(&*self);
                                            let node = node.fold_with(&mut visitor);

                                            (visitor, node)
                                        })
                                    })
                                })
                            })
                            .fold(
                                || (Parallel::create(&*self), vec![]),
                                |mut a, b| {
                                    Parallel::merge(&mut a.0, b.0);

                                    a.1.push(b.1);

                                    a
                                },
                            )
                            .reduce(
                                || (Parallel::create(&*self), vec![]),
                                |mut a, b| {
                                    Parallel::merge(&mut a.0, b.0);

                                    a.1.extend(b.1);

                                    a
                                },
                            )
                    })
                })
            });

            Parallel::merge(self, visitor);

            {
                hook;
            }

            return nodes;
        }

        for n in nodes {
            n.visit_with(self);
        }
    }
}

pub trait ParVisitMut: VisitMut + Parallel {
    fn visit_mut_par<N>(&mut self, threashold: usize, nodes: &[N])
    where
        N: Send + Sync + VisitMutWith<Self>;
}

impl<T> ParVisitMut for T where T: VisitMut + Parallel {}

pub trait ParFold: Fold + Parallel {
    fn fold_par<N>(&mut self, threashold: usize, nodes: &[N])
    where
        N: Send + Sync + FoldWith<Self>;
}

impl<T> ParFold for T where T: Fold + Parallel {}
