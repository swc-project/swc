use super::Analyzer;
use crate::errors::Error;
use std::sync::Arc;
use swc_atoms::{js_word, JsWord};
use swc_common::{Spanned, Visit, VisitWith};
use swc_ecma_ast::*;

#[derive(Debug, PartialEq)]
pub struct ExportInfo {
    pub ty: Option<TsType>,
    pub extra: Option<ExportExtra>,
}

/// TODO: Remove this
impl From<Option<TsType>> for ExportInfo {
    fn from(ty: Option<TsType>) -> Self {
        ExportInfo { ty, extra: None }
    }
}

impl From<TsType> for ExportInfo {
    fn from(ty: TsType) -> Self {
        ExportInfo {
            ty: Some(ty),
            extra: None,
        }
    }
}

impl From<ExportExtra> for ExportInfo {
    fn from(extra: ExportExtra) -> Self {
        ExportInfo {
            ty: None,
            extra: Some(extra),
        }
    }
}

impl ExportInfo {
    pub fn instantiate(
        &self,
        type_params: Option<&TsTypeParamInstantiation>,
    ) -> Result<TsType, Error> {
        match self.ty {
            Some(ref ty) => {
                assert_eq!(type_params, None); // TODO: Error
                return Ok(ty.clone());
            }
            None => {}
        }

        match self.extra {
            Some(ref extra) => {
                // Expand
                match extra {
                    ExportExtra::Enum(..) => unimplemented!("ExportExtra::Enum -> instantiate()"),
                    ExportExtra::Interface(ref i) => {
                        // TODO: Check length of type parmaters
                        // TODO: Instantiate type parameters

                        let members = i.body.body.iter().cloned().collect();

                        return Ok(TsType::TsTypeLit(TsTypeLit {
                            span: i.span,
                            members,
                        }));
                    }
                    ExportExtra::Alias(ref decl) => {
                        // TODO(kdy1): Handle type parameters.
                        return Ok(*decl.type_ann.clone());
                    }
                }
            }
            None => unimplemented!("`ty` and `extra` are both null"),
        }
    }
}

#[derive(Debug, PartialEq)]
pub enum ExportExtra {
    Interface(TsInterfaceDecl),
    Enum(TsEnumDecl),
    /// export type A<B> = Foo<B>;
    Alias(TsTypeAliasDecl),
}

// ModuleDecl::ExportNamed(export) => {}
//
// ModuleDecl::ExportAll(export) => unimplemented!("export * from
// 'other-file';"),
//
// ModuleDecl::TsNamespaceExport(ns) =>
// unimplemented!("export namespace"),

impl Visit<TsExportAssignment> for Analyzer<'_, '_> {
    fn visit(&mut self, export: &TsExportAssignment) {
        export.visit_children(self);

        self.export_default_expr(&export.expr);
    }
}

impl Analyzer<'_, '_> {
    pub(super) fn handle_pending_exports(&mut self) {
        if self.pending_exports.is_empty() {
            return;
        }

        let pending_exports = ::std::mem::replace(&mut self.pending_exports, Default::default());

        for ((sym, span), expr) in pending_exports {
            debug_assert_eq!(self.info.exports.get(&sym), None);

            let ty = match self.type_of(&expr) {
                Ok(ty) => ty.into_owned().into(),
                Err(err) => {
                    println!("Pending export resulted in an error: {:#?}", err);
                    self.info.errors.push(err);
                    return;
                }
            };
            self.info.exports.insert(sym, Arc::new(ty));
        }

        assert_eq!(self.pending_exports, Default::default());
    }

    fn export_default_expr(&mut self, expr: &Expr) {
        debug_assert_eq!(self.info.exports.get(&js_word!("default")), None);

        let ty = match self.type_of(expr) {
            Ok(ty) => ty.into_owned().into(),
            Err(err) => {
                match err {
                    // Handle hoisting. This allows
                    //
                    // export = React
                    // declare namespace React {}
                    Error::UndefinedSymbol { .. } => {
                        self.pending_exports
                            .insert((js_word!("default"), expr.span()), box expr.clone());
                        return;
                    }
                    _ => {}
                }
                self.info.errors.push(err);
                return;
            }
        };
        self.info.exports.insert(js_word!("default"), Arc::new(ty));
    }
}

impl Visit<ExportDecl> for Analyzer<'_, '_> {
    fn visit(&mut self, export: &ExportDecl) {
        export.visit_children(self);

        match export.decl {
            Decl::Fn(ref f) => {
                self.export_fn(f.ident.sym.clone(), &f.function);
            }
            Decl::TsInterface(ref i) => {
                self.export_interface(i.id.sym.clone(), &i);
            }
            Decl::Class(..) => unimplemented!("export class Foo"),
            Decl::Var(..) => unimplemented!("export var Foo = a;"),
            Decl::TsEnum(ref e) => {
                debug_assert_eq!(self.info.exports.get(&e.id.sym), None);
                self.info.exports.insert(
                    e.id.sym.clone(),
                    Arc::new(ExportExtra::Enum(e.clone()).into()),
                );
            }
            Decl::TsModule(..) => unimplemented!("export module "),
            Decl::TsTypeAlias(ref decl) => {
                // export type Foo = 'a' | 'b';
                // export type Foo = {};

                // TODO(kdy1): Handle type parameters.

                self.info.exports.insert(
                    decl.id.sym.clone(),
                    Arc::new(ExportExtra::Alias(decl.clone()).into()),
                );
            }
        }
    }
}

impl Visit<ExportDefaultDecl> for Analyzer<'_, '_> {
    fn visit(&mut self, export: &ExportDefaultDecl) {
        export.visit_children(self);

        match export.decl {
            DefaultDecl::Fn(ref f) => {
                self.export_fn(js_word!("default"), &f.function);
            }
            DefaultDecl::Class(..) => unimplemented!("export default class"),
            DefaultDecl::TsInterfaceDecl(ref i) => {
                self.export_interface(js_word!("default"), i);
            }
        };
    }
}

impl Visit<ExportDefaultExpr> for Analyzer<'_, '_> {
    fn visit(&mut self, export: &ExportDefaultExpr) {
        export.visit_children(self);

        self.export_default_expr(&export.expr);
    }
}

impl Analyzer<'_, '_> {
    fn export_interface(&mut self, name: JsWord, i: &TsInterfaceDecl) {
        debug_assert_eq!(self.info.exports.get(&name), None);

        self.info
            .exports
            .insert(name, Arc::new(ExportExtra::Interface(i.clone()).into()));
    }

    fn export_fn(&mut self, name: JsWord, f: &Function) {
        let ret_ty = f
            .return_type
            .as_ref()
            .map(|t| &*t.type_ann)
            .cloned()
            .unwrap_or_else(|| {
                if let Some(_) = f.body {
                    unimplemented!("return type inference (based on function's body)")
                }

                TsType::TsKeywordType(TsKeywordType {
                    span: f.span,
                    kind: TsKeywordTypeKind::TsAnyKeyword,
                })
            });

        let ty = TsType::TsFnOrConstructorType(TsFnOrConstructorType::TsFnType(TsFnType {
            span: f.span,
            params: f
                .params
                .clone()
                .into_iter()
                .map(pat_to_ts_fn_param)
                .collect(),
            type_params: f.type_params.clone(),
            type_ann: TsTypeAnn {
                span: ret_ty.span(),
                type_ann: box ret_ty,
            },
        }));

        self.info.exports.insert(name, Arc::new(ty.into()));
    }
}

pub fn pat_to_ts_fn_param(p: Pat) -> TsFnParam {
    match p {
        Pat::Ident(i) => TsFnParam::Ident(i),
        Pat::Rest(rest) => TsFnParam::Rest(rest),
        Pat::Array(arr) => TsFnParam::Array(arr),
        Pat::Object(obj) => TsFnParam::Object(obj),
        // TODO: Pat::Assign()
        _ => unimplemented!("function parameter of type {:?}", p),
    }
}
