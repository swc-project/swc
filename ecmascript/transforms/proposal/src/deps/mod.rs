//! This module defines types to mimic all behavior of tsc.

use std::sync::Arc;
use swc_atoms::js_word;
use swc_atoms::JsWord;
use swc_common::errors::Diagnostic;
use swc_common::FileName;
use swc_ecma_ast::*;

pub mod module_analyzer;

#[derive(Debug, Clone, PartialEq, Eq)]
pub(crate) enum EnumKind {
    Mixed,
    Str,
    Num,
}

impl From<&'_ TsEnumDecl> for EnumKind {
    fn from(e: &TsEnumDecl) -> Self {
        e.members
            .iter()
            .map(|member| member.init.as_ref())
            .map(|init| match init {
                Some(e) => match &**e {
                    Expr::Lit(lit) => match lit {
                        Lit::Str(_) => EnumKind::Str,
                        Lit::Num(_) => EnumKind::Num,
                        _ => EnumKind::Mixed,
                    },
                    _ => EnumKind::Mixed,
                },
                None => EnumKind::Num,
            })
            .fold(None, |opt: Option<EnumKind>, item| {
                //
                let a = match item {
                    EnumKind::Mixed => return Some(EnumKind::Mixed),
                    _ => item,
                };

                let b = match opt {
                    Some(EnumKind::Mixed) => return Some(EnumKind::Mixed),
                    Some(v) => v,
                    None => return Some(a),
                };
                if a == b {
                    return Some(a);
                } else {
                    return Some(EnumKind::Mixed);
                }
            })
            .unwrap_or(EnumKind::Mixed)
    }
}

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
    ///
    ///
    /// # Note
    ///
    /// Implementor should ignore span of `imported`.
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
