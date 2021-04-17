//! This module defines types to mimic all behavior of tsc.

use std::sync::Arc;
use swc_atoms::js_word;
use swc_atoms::JsWord;
use swc_common::errors::Diagnostic;
use swc_common::FileName;
use swc_ecma_ast::*;

pub mod module_analyzer;

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
    fn design_type_of(
        &self,
        _base: &FileName,
        _dep_src: &JsWord,
        imported: &Ident,
    ) -> Result<Box<Expr>, Diagnostic> {
        Ok(Box::new(Expr::Ident(Ident::new(
            js_word!("Object"),
            imported.span,
        ))))
    }
}

macro_rules! impl_ref {
    ($TP:ident,$T:ty) => {
        impl<$TP> DepAnalyzer for $T
        where
            $TP: DepAnalyzer,
        {
            fn design_type_of(
                &self,
                base: &FileName,
                dep_src: &JsWord,
                imported: &Ident,
            ) -> Result<Box<Expr>, Diagnostic> {
                (**self).design_type_of(base, dep_src, imported)
            }
        }
    };
}

impl_ref!(T, &'_ T);
impl_ref!(T, Box<T>);
impl_ref!(T, Arc<T>);

#[derive(Debug, Clone, Copy)]
pub struct NoopDepAnalyzer;

impl DepAnalyzer for NoopDepAnalyzer {}
