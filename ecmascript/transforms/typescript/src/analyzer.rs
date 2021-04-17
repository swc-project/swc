//! This module defines types to mimic all behavior of tsc.

use swc_ecma_loader::Loader;
use swc_ecma_loader::Resolver;

/// This trait defines methods to get information stored in other files.
pub trait Analyzer {}

/// Simple dependency analyzer.
pub struct SimpleAnalyzer<L, R>
where
    L: Loader,
    R: Resolver,
{
    loader: L,
    resolver: R,
}

impl<L, R> SimpleAnalyzer<L, R>
where
    L: Loader,
    R: Resolver,
{
    pub fn new(loader: L, resolver: R) -> Self {
        Self { loader, resolver }
    }
}

impl<L, R> Analyzer for SimpleAnalyzer<L, R>
where
    L: Loader,
    R: Resolver,
{
}
