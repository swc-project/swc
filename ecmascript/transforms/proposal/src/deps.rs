//! This module defines types to mimic all behavior of tsc.

use swc_atoms::JsWord;
use swc_common::errors::Diagnostic;
use swc_common::FileName;
use swc_ecma_ast::*;
use swc_ecma_loader::Loader;
use swc_ecma_loader::Resolver;

/// This trait defines methods to get information stored in other files.
pub trait DepAnalyzer {
    /// Returns the type (`$T`) which should be used for
    /// `__metadata("design:type", $T)`.
    ///
    /// # Parameters
    ///
    /// `index.ts`:
    ///
    /// ```ts
    /// import foo, { bar as baz } from './foo';
    /// ```
    ///
    /// In this example, `base` is `index.ts`, `dep_src` is `./foo` and
    /// `imported` will be `default` on first call and `bar` on second call.
    ///
    /// # Return value
    ///
    ///  - `Ok(None)` if the analyzer does not suport this operation.
    /// If this is the case
    fn design_type_of(
        &self,
        base: &FileName,
        dep_src: &JsWord,
        imported: Ident,
    ) -> Result<Option<Box<Expr>>, Diagnostic>;
}

pub struct NoopDepAnalyzer {}

/// Simple dependency analyzer.
pub struct SimpleDepAnalyzer<L, R>
where
    L: Loader,
    R: Resolver,
{
    loader: L,
    resolver: R,
}

impl<L, R> SimpleDepAnalyzer<L, R>
where
    L: Loader,
    R: Resolver,
{
    pub fn new(loader: L, resolver: R) -> Self {
        Self { loader, resolver }
    }
}

impl<L, R> DepAnalyzer for SimpleDepAnalyzer<L, R>
where
    L: Loader,
    R: Resolver,
{
}
